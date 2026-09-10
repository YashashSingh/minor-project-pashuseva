import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface ChatContext {
  animalType?: string;
  skinCondition?: string;
  confidence?: number;
  severity?: string;
  symptoms?: string[];
  userLocation?: string;
}

export async function generateChatResponse(
  userMessage: string,
  history: { role: 'user' | 'model'; text: string }[],
  context?: ChatContext
): Promise<{ text: string; suggestedQuestions: string[] }> {
  const ai = getGenAI();

  const systemInstruction = `You are the "Livestock AI Assistant", a conversational decision-support tool in an AI-Powered Livestock Health Monitoring System (CSE Minor Project).
Your audience includes dairy farmers, livestock keepers, agricultural extension workers, and students.

CURRENT ANIMAL CONTEXT:
- Detected Animal Type: ${context?.animalType || "Not specified / pending upload"}
- Current Skin Health Screening: ${context?.skinCondition || "None performed yet"}
- Model Confidence: ${context?.confidence ? context.confidence + "%" : "N/A"}
- Estimated Risk/Severity: ${context?.severity || "N/A"}
- Visible Symptoms: ${context?.symptoms?.join(", ") || "None recorded"}

CRITICAL SAFETY & VETERINARY PROTOCOLS:
1. INFORMATIONAL SUPPORT ONLY: Clearly emphasize that your insights are AI-assisted screening guidelines and DO NOT constitute a licensed veterinary diagnosis or official prescription.
2. NEVER PRESCRIBE CONTROLLED SUBSTANCES: Do not prescribe injectable antibiotics, restricted veterinary chemicals, or unverified folk remedies that could harm the animal.
3. CLEAR EXPLANATIONS: Explain symptoms, biological vectors (like biting flies, ticks, wet bedding), and biosecurity measures in simple, supportive language.
4. VETERINARY REFERRAL: If the condition is moderate, high, or urgent (e.g. high fever, widespread nodules, refusal to feed, severe mastitis, sudden drop in milk yield, laboured breathing), urge the user to contact a nearby veterinary clinic or government livestock dispensary immediately.
5. CONTEXTUAL REASONING: When the user asks about the current screening result, refer directly to the detected animal and condition details provided above.

Formatting: Use structured, clean bullet points with bold subheaders for easy reading in the field.`;

  if (!ai) {
    // Graceful fallback to heuristic livestock knowledge base
    return generateFallbackResponse(userMessage, context);
  }

  try {
    const contents: any[] = [];

    // Append prior dialogue history (limit last 6 exchanges to maintain fresh context)
    const recentHistory = history.slice(-6);
    for (const item of recentHistory) {
      contents.push({
        role: item.role,
        parts: [{ text: item.text }],
      });
    }

    // Append the current user message
    contents.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4,
      },
    });

    const text = response.text || "I was unable to formulate a response. Please try rephrasing your livestock health question.";

    // Generate dynamic suggested questions based on context
    const suggestedQuestions = getSuggestedQuestions(context, userMessage);

    return { text, suggestedQuestions };
  } catch (error) {
    console.error("Gemini API call failed, switching to local knowledge fallback:", error);
    return generateFallbackResponse(userMessage, context);
  }
}

function getSuggestedQuestions(context?: ChatContext, lastMessage?: string): string[] {
  const suggestions: string[] = [];
  const condition = context?.skinCondition?.toLowerCase() || "";

  if (condition.includes("lumpy")) {
    suggestions.push("How does Lumpy Skin Disease spread between cattle?");
    suggestions.push("What biosecurity precautions should I take for my herd?");
    suggestions.push("When should I call an emergency veterinarian?");
    suggestions.push("Can buffaloes also catch Lumpy Skin Disease?");
  } else if (condition.includes("ringworm") || condition.includes("dermatophytosis")) {
    suggestions.push("Can ringworm transmit to handlers or other animals?");
    suggestions.push("How should I clean and disinfect the animal shed?");
    suggestions.push("What topical antiseptic washes are safe?");
  } else if (condition.includes("mange") || condition.includes("mites")) {
    suggestions.push("What signs indicate severe mange or secondary infection?");
    suggestions.push("How can I prevent flies and ticks around the shelter?");
  } else {
    suggestions.push("Explain this AI screening result in detail");
    suggestions.push("What vital signs should I monitor today?");
    suggestions.push("When should I contact a qualified veterinarian?");
    suggestions.push("What are key nutritional tips for recovery?");
  }

  return suggestions.slice(0, 4);
}

function generateFallbackResponse(
  userMessage: string,
  context?: ChatContext
): { text: string; suggestedQuestions: string[] } {
  const msg = userMessage.toLowerCase();
  const animal = context?.animalType || "animal";
  const condition = context?.skinCondition || "the observed condition";

  let reply = "";

  if (msg.includes("explain") || msg.includes("result") || msg.includes("meaning")) {
    reply = `### Overview of AI Screening Result\n\n` +
      `Our deep learning model screened the uploaded image for **${context?.animalType || "Livestock"}** and indicated a screening profile of **${context?.skinCondition || "Suspicious Skin Lesion"}** with an estimated confidence of **${context?.confidence || 85}%**.\n\n` +
      `**Key Observations:**\n` +
      `- **Visible Markers:** Cutaneous surface irregularities, localized hair loss, or nodular elevation were highlighted by the neural network's activation mapping.\n` +
      `- **Important Note:** This is an automated screening aid. Laboratory testing (skin scrapings, PCR, or clinical palpation) by a veterinary officer is necessary to confirm the diagnosis.`;
  } else if (msg.includes("vet") || msg.includes("doctor") || msg.includes("when to contact") || msg.includes("emergency")) {
    reply = `### Veterinary Consultation Guidance\n\n` +
      `You should seek prompt veterinary assistance if you observe any of the following **red-flag symptoms**:\n\n` +
      `1. **Body Temperature:** Rectal temperature exceeds 103.5°F (39.7°C) in cattle/buffaloes.\n` +
      `2. **Feeding & Milk:** Sudden refusal to feed (anorexia) or a drastic reduction (>30%) in daily milk yield.\n` +
      `3. **Spread:** Rapid appearance of new skin nodules or secondary pus-filled lesions within 24–48 hours.\n` +
      `4. **General State:** Drooping ears, nasal discharge, excessive salivation, or difficulty standing.\n\n` +
      `*Tip: Use the "Find Veterinarian" tab above to locate the nearest registered veterinary clinic or government veterinary hospital.*`;
  } else if (msg.includes("prevent") || msg.includes("biosecurity") || msg.includes("spread") || msg.includes("isolate")) {
    reply = `### Recommended Farm Biosecurity & Care Measures\n\n` +
      `To prevent disease transmission and support healing for your **${animal}**:\n\n` +
      `* **Physical Isolation:** Move the symptomatic animal to a dedicated quarantine shed at least 15–20 meters away from the main herd.\n` +
      `* **Vector Control:** Spray approved animal-safe pyrethroid or neem-based fly repellents to minimize biting flies (*Stomoxys*), mosquitoes, and ticks.\n` +
      `* **Hygiene & Utensils:** Disinfect feeding mangers and buckets with 1% potassium permanganate or mild chlorine solution. Never share grooming brushes or needles.\n` +
      `* **Nutrition & Hydration:** Provide clean drinking water and easily digestible green fodder with mineral mixture supplements.`;
  } else {
    reply = `Thank you for sharing your concern regarding your **${animal}**.\n\n` +
      `Based on the current analysis for **${condition}**:\n\n` +
      `- **Observation:** Keep a close watch on feed intake, rumination frequency, body temperature, and the progression of skin patches.\n` +
      `- **Safe Cleaning:** Avoid peeling or forcibly puncturing skin nodules or scabs, as open lesions invite secondary bacterial infections.\n` +
      `- **Next Step:** If lesions worsen or the animal shows signs of distress, please utilize the **Find Veterinarian** module to arrange a physical clinical examination.`;
  }

  return {
    text: reply,
    suggestedQuestions: getSuggestedQuestions(context, userMessage),
  };
}
