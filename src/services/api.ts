import { 
  AnimalClassificationResult, 
  SkinScreeningResult, 
  HealthRecord, 
  VeterinaryClinic, 
  DashboardStats,
  ModelArchitectureInfo 
} from '../types';

export const api = {
  // 1. Animal Classification
  async classifyAnimal(
    imageData: string, 
    modelArch: 'MobileNetV2' | 'EfficientNetB0' = 'MobileNetV2'
  ): Promise<AnimalClassificationResult> {
    const res = await fetch('/api/classify-animal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData, modelArch }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.details || err.error || 'Animal classification failed');
    }
    return res.json();
  },

  // 2. Skin Screening
  async screenSkin(
    imageData: string, 
    animalType: 'Cattle' | 'Buffalo' = 'Cattle'
  ): Promise<SkinScreeningResult> {
    const res = await fetch('/api/skin-screen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData, animalType }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.details || err.error || 'Skin screening failed');
    }
    return res.json();
  },

  // 3. Livestock Chatbot (Google Gemini 3.8 Flash)
  async sendChatMessage(
    message: string,
    history: { role: 'user' | 'model'; text: string }[] = [],
    context: {
      animalType?: string;
      skinCondition?: string;
      confidence?: number;
      severity?: string;
      symptoms?: string[];
    } = {}
  ): Promise<{ reply: string; suggestedQuestions: string[]; model: string }> {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, context }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.details || err.error || 'Chat request failed');
    }
    return res.json();
  },

  // 4. Health History
  async getHealthHistory(): Promise<HealthRecord[]> {
    const res = await fetch('/api/health-history');
    if (!res.ok) throw new Error('Failed to fetch health history');
    return res.json();
  },

  async getHealthRecord(id: string): Promise<HealthRecord> {
    const res = await fetch(`/api/health-history/${id}`);
    if (!res.ok) throw new Error('Failed to fetch health record');
    return res.json();
  },

  async saveHealthRecord(record: Partial<HealthRecord>): Promise<HealthRecord> {
    const res = await fetch('/api/health-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error('Failed to save record');
    return res.json();
  },

  async deleteHealthRecord(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/health-history/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete record');
    return res.json();
  },

  // 5. Veterinary Finder
  async getNearbyVeterinarians(lat?: number, lon?: number): Promise<VeterinaryClinic[]> {
    const query = lat && lon ? `?lat=${lat}&lon=${lon}` : '';
    const res = await fetch(`/api/veterinarians/nearby${query}`);
    if (!res.ok) throw new Error('Failed to fetch veterinarians');
    return res.json();
  },

  // 6. Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch('/api/dashboard/stats');
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  },

  // 7. Model Architecture Info
  async getModelInfo(): Promise<ModelArchitectureInfo> {
    const res = await fetch('/api/ml/model-info');
    if (!res.ok) throw new Error('Failed to fetch model info');
    return res.json();
  }
};
