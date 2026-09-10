import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  AlertCircle, 
  HelpCircle, 
  ShieldCheck, 
  Trash2, 
  CornerDownLeft, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { api } from '../services/api';
import { AnimalClassificationResult, SkinScreeningResult } from '../types';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { PageView } from '../components/Navbar';

interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface Props {
  onNavigate: (view: PageView) => void;
  activeAnimalResult?: AnimalClassificationResult | null;
  activeSkinResult?: SkinScreeningResult | null;
}

const DEFAULT_SUGGESTIONS = [
  'What are the early symptoms of Lumpy Skin Disease?',
  'How do I distinguish between cattle and water buffalo anatomically?',
  'What general first aid should I give an animal with cutaneous crusts?',
  'When is high livestock fever considered a critical emergency?'
];

export const ChatbotPage: React.FC<Props> = ({
  onNavigate,
  activeAnimalResult,
  activeSkinResult
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'model',
      text: "Hello! I am your AI Livestock Health & Veterinary Assistant powered by Google Gemini. I can assist you with understanding animal breeds, dermatological signs, hygiene protocols, and early symptom triage.\n\n*Please note: I provide informational decision support and cannot replace an in-person veterinary physical exam.* How may I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      // Build history for Gemini
      const history = messages.map((m) => ({
        role: m.sender,
        text: m.text
      }));

      // Gather active animal context
      const context = {
        animalType: activeSkinResult?.animalType || activeAnimalResult?.animalType,
        skinCondition: activeSkinResult?.conditionName,
        confidence: activeSkinResult?.confidence || activeAnimalResult?.confidence,
        severity: activeSkinResult?.severity,
        symptoms: activeSkinResult?.visibleSymptoms
      };

      const response = await api.sendChatMessage(query, history, context);

      const botMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        sender: 'model',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);

      if (response.suggestedQuestions && response.suggestedQuestions.length > 0) {
        setSuggestedQuestions(response.suggestedQuestions);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'model',
        text: "I encountered a communication delay while connecting to the livestock knowledge service. Please check your network connection or try your query again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'model',
        text: "Chat session refreshed. How can I help with your livestock health or management today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]">
              <Bot className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2D332B] tracking-tight">
              Livestock AI Veterinary Assistant
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]">
              Gemini 3.8 Flash
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#2D332B]/60">
            Ask questions about animal health, nutrition, biosecurity, and triage instructions.
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-[#E2E6D8] bg-white hover:bg-[#F3F4EF] text-[#2D332B] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      <DisclaimerBanner compact />

      {/* Active Screening Context Indicator (if available) */}
      {(activeAnimalResult || activeSkinResult) && (
        <div className="p-4 rounded-2xl bg-[#EEF0E7] border border-[#E2E6D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <Sparkles className="w-4 h-4 text-[#4B6344] shrink-0" />
            <span className="text-[#2D332B] font-bold">Active Assessment Context Loaded:</span>
            <span className="bg-white px-2.5 py-0.5 rounded-full border border-[#E2E6D8] text-[#4B6344] font-bold">
              {activeSkinResult 
                ? `${activeSkinResult.animalType || 'Livestock'} • ${activeSkinResult.conditionName} (${activeSkinResult.severity} Risk)`
                : `${activeAnimalResult?.animalType} (${activeAnimalResult?.confidence}% Conf.)`}
            </span>
          </div>
          <span className="text-[#2D332B]/60 text-[11px]">
            The AI assistant incorporates these diagnostic observations into responses.
          </span>
        </div>
      )}

      {/* Main Chat Interface Container */}
      <div className="rounded-3xl border border-[#E2E6D8] bg-white shadow-xs overflow-hidden flex flex-col h-[600px]">
        
        {/* Chat Messages Log Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F9FAF7]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#4B6344] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-2xl space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                      isUser
                        ? 'bg-[#4B6344] text-white rounded-br-none'
                        : 'bg-white text-[#2D332B] border border-[#E2E6D8] rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div
                    className={`text-[10px] text-[#2D332B]/50 px-1 ${
                      isUser ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#2D332B] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-[#4B6344] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#E2E6D8] text-[#2D332B] text-xs flex items-center gap-2 shadow-xs">
                <div className="w-2 h-2 bg-[#4B6344] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[#4B6344] rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-[#4B6344] rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-[#2D332B]/60 font-medium">
                  Gemini analyzing veterinary protocol...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions Strip */}
        <div className="px-4 py-2.5 bg-white border-t border-[#E2E6D8] flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D332B]/50 shrink-0">
            Suggested:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="text-xs bg-[#F3F4EF] hover:bg-[#EEF0E7] text-[#2D332B] hover:text-[#4B6344] border border-[#E2E6D8] hover:border-[#4B6344] px-3.5 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#E2E6D8]">
          <div className="relative flex items-center gap-2">
            <textarea
              id="input-chat-query"
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about livestock symptoms, breed characteristics, disease prevention, or triage..."
              className="w-full resize-none rounded-2xl border border-[#E2E6D8] focus:border-[#4B6344] focus:ring-1 focus:ring-[#4B6344] p-3 pr-12 text-xs sm:text-sm text-[#2D332B] placeholder:text-[#2D332B]/40"
            />

            <button
              id="btn-submit-chat-message"
              type="button"
              disabled={loading || !inputText.trim()}
              onClick={() => handleSendMessage()}
              className="absolute right-3 p-2 rounded-xl bg-[#4B6344] hover:bg-[#3D5237] disabled:bg-[#E2E6D8] text-white transition-colors shadow-xs"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#2D332B]/50 mt-2 px-1">
            <span>Press Enter to send • Shift+Enter for new line</span>
            <button
              onClick={() => onNavigate('veterinarians')}
              className="text-[#8B4513] hover:text-[#72380f] font-semibold flex items-center gap-1"
            >
              <span>Emergency? Find Nearby Vet →</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
