/**
 * Shared TypeScript definitions for AI-Powered Livestock Health Monitoring System
 */

export type AnimalType = 'Cattle' | 'Buffalo' | 'Unknown';

export type SeverityLevel = 'Low' | 'Moderate' | 'High' | 'Urgent';
export type RiskLevel = SeverityLevel;

export interface DetectedFeature {
  name: string;
  observed: string;
  relevance: string;
  indicativeOf: 'Cattle' | 'Buffalo';
}

export interface AnimalClassificationResult {
  id: string;
  animalType: AnimalType;
  confidence: number; // e.g. 94.2
  modelName: string;
  inferenceTimeMs: number;
  detectedFeatures: {
    hornProfile: string;
    dewlapSize: string;
    skullForehead: string;
    coatColorTexture: string;
    bodyConformation: string;
  };
  featuresList: DetectedFeature[];
  timestamp: string;
  imageUrl?: string;
  heatmapUrl?: string;
  xaiExplanation: string;
}

export interface SkinScreeningResult {
  id: string;
  animalType?: AnimalType;
  conditionName: string;
  conditionScientificName?: string;
  confidence: number; // e.g. 87.5
  severity: SeverityLevel;
  visibleSymptoms: string[];
  generalPrecautions: string[];
  vetConsultRecommended: boolean;
  xaiExplanation: string;
  heatmapUrl?: string;
  originalImageUrl?: string;
  hotspotCoordinates?: { x: number; y: number; radius: number; intensity: number }[];
  timestamp: string;
  disclaimer: string;
}

export interface HealthRecord {
  id: string;
  date: string;
  animalType: AnimalType;
  tagNumber?: string;
  analysisType: 'Classification' | 'Skin Screening' | 'Combined';
  predictedAnimal?: AnimalType;
  skinConditionResult?: string;
  confidence: number;
  riskLevel: SeverityLevel;
  imageUrl: string;
  heatmapUrl?: string;
  notes?: string;
  visibleSymptoms?: string[];
  generalPrecautions?: string[];
  vetConsultRecommended: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  message: string;
  timestamp: string;
  contextUsed?: {
    animalType?: string;
    skinCondition?: string;
    confidence?: number;
    severity?: string;
  };
  suggestedFollowUps?: string[];
}

export interface VeterinaryClinic {
  id: string;
  name: string;
  doctorInCharge?: string;
  type: 'Government Hospital' | 'Private Veterinary Clinic' | 'District Poly-Clinic' | '24/7 Emergency Livestock Care';
  address: string;
  city: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  phone: string;
  emergencyPhone?: string;
  openingHours: string;
  isOpenNow: boolean;
  services: string[];
  rating: number;
  reviewCount: number;
  hasEmergencyService: boolean;
}

export interface DashboardStats {
  totalAnalyses: number;
  animalsIdentified: {
    cattle: number;
    buffalo: number;
    total: number;
  };
  healthScreeningsCount: number;
  veterinaryRecommendationsCount: number;
  riskDistribution: {
    low: number;
    moderate: number;
    high: number;
    urgent: number;
  };
  recentRecords: HealthRecord[];
  latestRecord?: HealthRecord;
}

export interface ModelArchitectureInfo {
  animalClassifier: {
    name: string;
    backbone: string;
    inputResolution: string;
    classes: string[];
    top1Accuracy: number;
    trainingDataset: string;
    gradCamLayer: string;
  };
  skinClassifier: {
    name: string;
    backbone: string;
    inputResolution: string;
    classes: string[];
    top1Accuracy: number;
    trainingDataset: string;
    gradCamLayer: string;
  };
}
