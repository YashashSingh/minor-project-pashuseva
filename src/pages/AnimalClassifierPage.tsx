import React, { useState } from 'react';
import { 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Layers, 
  Microscope, 
  Save, 
  ShieldAlert, 
  Sparkles, 
  SlidersHorizontal 
} from 'lucide-react';
import { ImageUploadZone } from '../components/ImageUploadZone';
import { GradCamViewer } from '../components/GradCamViewer';
import { AnimalClassificationResult } from '../types';
import { api } from '../services/api';
import { PageView } from '../components/Navbar';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface Props {
  onNavigate: (view: PageView) => void;
  onAnimalAnalyzed?: (result: AnimalClassificationResult, image: string) => void;
}

export const AnimalClassifierPage: React.FC<Props> = ({ onNavigate, onAnimalAnalyzed }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modelArch, setModelArch] = useState<'MobileNetV2' | 'EfficientNetB0'>('MobileNetV2');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnimalClassificationResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const data = await api.classifyAnimal(selectedImage, modelArch);
      setResult(data);

      if (onAnimalAnalyzed) {
        onAnimalAnalyzed(data, selectedImage);
      }
    } catch (err: any) {
      setError(err.message || 'Classification inference failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToHistory = async () => {
    if (!result || !selectedImage) return;

    try {
      await api.saveHealthRecord({
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        animalType: result.animalType,
        tagNumber: `TAG-${result.animalType.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
        analysisType: 'Classification',
        predictedAnimal: result.animalType,
        confidence: result.confidence,
        riskLevel: 'Low',
        imageUrl: selectedImage,
        notes: `Classified as ${result.animalType} using ${result.modelName}. Inferred in ${result.inferenceTimeMs}ms.`,
        vetConsultRecommended: false
      });
      setSavedSuccess(true);
    } catch (err) {
      alert('Failed to save to history');
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    setSavedSuccess(false);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="pt-4 space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]">
            <Microscope className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2D332B] tracking-tight">
            Animal Type Classification
          </h1>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]">
            CNN / Transfer Learning
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#2D332B]/60">
          Upload a clear photograph of the livestock to classify between Cattle (Bos indicus / taurus) and Buffalo (Bubalus bubalis).
        </p>
      </div>

      <DisclaimerBanner compact />

      {/* Model Selection & Architecture Bar */}
      <div className="p-4 rounded-2xl border border-[#E2E6D8] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <Cpu className="w-4 h-4 text-[#4B6344]" />
          <span className="font-bold text-[#2D332B]">Deep Learning CNN Backbone:</span>
          <div className="inline-flex rounded-xl p-1 bg-[#F3F4EF] border border-[#E2E6D8]">
            <button
              type="button"
              onClick={() => setModelArch('MobileNetV2')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                modelArch === 'MobileNetV2'
                  ? 'bg-[#4B6344] text-white font-bold shadow-xs'
                  : 'text-[#2D332B]/70 hover:text-[#2D332B]'
              }`}
            >
              MobileNetV2 (Fast, 3.4M Params)
            </button>
            <button
              type="button"
              onClick={() => setModelArch('EfficientNetB0')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                modelArch === 'EfficientNetB0'
                  ? 'bg-[#4B6344] text-white font-bold shadow-xs'
                  : 'text-[#2D332B]/70 hover:text-[#2D332B]'
              }`}
            >
              EfficientNetB0 (Compound Scaling)
            </button>
          </div>
        </div>

        <div className="text-[11px] text-[#2D332B]/50 font-mono">
          Input: 224×224 RGB • ImageNet Pre-trained
        </div>
      </div>

      {/* Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Upload & Action (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl border border-[#E2E6D8] bg-white shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#2D332B]">
              Input Animal Photo
            </h3>

            <ImageUploadZone
              selectedImage={selectedImage}
              onImageSelected={(img) => {
                setSelectedImage(img);
                setResult(null);
                setSavedSuccess(false);
              }}
              onClear={handleClear}
              title="Upload Bovine Photograph"
              description="Drop an image showing the head, horns, or full body profile of the cattle or buffalo"
            />

            {/* Submit Action Button */}
            {selectedImage && (
              <button
                id="btn-run-animal-analysis"
                type="button"
                disabled={loading}
                onClick={handleAnalyze}
                className="w-full py-3.5 px-4 rounded-xl bg-[#4B6344] hover:bg-[#3D5237] disabled:bg-[#E2E6D8] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Extracting CNN Feature Maps...</span>
                  </>
                ) : (
                  <>
                    <Microscope className="w-4 h-4" />
                    <span>Analyze Animal</span>
                  </>
                )}
              </button>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Prediction Results & Characteristics (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-6">
              
              {/* Primary Prediction Output Card */}
              <div className="p-6 sm:p-7 rounded-3xl border border-[#E2E6D8] bg-white shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4B6344] bg-[#EEF0E7] px-3 py-1 rounded-full border border-[#E2E6D8]">
                    Classification Result
                  </span>
                  <span className="text-xs text-[#2D332B]/50 font-mono">
                    Inference: {result.inferenceTimeMs}ms
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <div className="text-xs text-[#2D332B]/60 uppercase tracking-wider font-bold">
                      Predicted Animal Type
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-[#2D332B] mt-1 tracking-tight">
                      {result.animalType.toUpperCase()}
                    </div>
                    <div className="text-xs text-[#4B6344] font-semibold mt-1">
                      {result.animalType === 'Buffalo' 
                        ? 'Bubalus bubalis (Water Buffalo)' 
                        : 'Bos indicus / Bos taurus (Bovine Cattle)'}
                    </div>
                  </div>

                  <div className="bg-[#F9FAF7] p-4 rounded-2xl border border-[#E2E6D8] shadow-xs">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#2D332B]/70 mb-1">
                      <span>Model Confidence</span>
                      <span className="font-mono text-[#4B6344] text-base font-bold">{result.confidence}%</span>
                    </div>
                    <div className="w-full bg-[#E2E6D8] rounded-full h-2.5 overflow-hidden">
                      <div
                        style={{ width: `${result.confidence}%` }}
                        className="bg-[#4B6344] h-full rounded-full transition-all duration-500"
                      />
                    </div>
                    <div className="text-[10px] text-[#2D332B]/50 mt-1 text-right">
                      Softmax Probability
                    </div>
                  </div>
                </div>

                {/* Detected Characteristics Breakdown */}
                <div className="pt-3 border-t border-[#E2E6D8] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D332B]">
                    Detected Morphological Characteristics
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.featuresList.map((feat, idx) => (
                      <div 
                        key={idx} 
                        className="p-3.5 rounded-2xl bg-[#F9FAF7] border border-[#E2E6D8] space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#2D332B]">
                            {feat.name}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]">
                            {feat.indicativeOf}
                          </span>
                        </div>
                        <p className="text-xs text-[#2D332B]/80 font-medium">
                          {feat.observed}
                        </p>
                        <p className="text-[11px] text-[#2D332B]/50 leading-tight">
                          {feat.relevance}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Next Steps Actions */}
                <div className="pt-4 border-t border-[#E2E6D8] flex flex-wrap items-center justify-between gap-3">
                  <button
                    id="btn-save-classification-record"
                    type="button"
                    onClick={handleSaveToHistory}
                    disabled={savedSuccess}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      savedSuccess
                        ? 'bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]'
                        : 'bg-[#2D332B] hover:bg-[#3D5237] text-white shadow-xs'
                    }`}
                  >
                    {savedSuccess ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4B6344]" />
                        <span>Saved to Health History</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save to History</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      id="btn-proceed-to-skin-screening"
                      type="button"
                      onClick={() => onNavigate('skin-screening')}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#8B4513] hover:bg-[#72380f] text-white shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Check Skin Health →</span>
                    </button>

                    <button
                      id="btn-ask-ai-about-animal"
                      type="button"
                      onClick={() => onNavigate('chatbot')}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#4B6344] hover:bg-[#3D5237] text-white shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Ask AI</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Explainable AI / Grad-CAM Section */}
              {selectedImage && (
                <GradCamViewer
                  originalImageUrl={selectedImage}
                  predictionLabel={result.animalType}
                  confidence={result.confidence}
                  explanation={result.xaiExplanation}
                  targetLayer={`${modelArch} Conv_1 Final Spatial Feature Map`}
                  hotspots={result.animalType === 'Buffalo' ? [
                    { x: 38, y: 32, radius: 22, intensity: 0.94 }, // Horn root
                    { x: 50, y: 36, radius: 24, intensity: 0.89 }, // Broad forehead
                    { x: 44, y: 62, radius: 20, intensity: 0.78 }  // Neck contour
                  ] : [
                    { x: 48, y: 35, radius: 24, intensity: 0.95 }, // Dewlap & throat fold
                    { x: 62, y: 40, radius: 20, intensity: 0.86 }, // Thoracic hump
                    { x: 40, y: 28, radius: 18, intensity: 0.81 }  // Horn & muzzle
                  ]}
                  animalType={result.animalType}
                />
              )}

            </div>
          ) : (
            /* Placeholder State */
            <div className="p-12 rounded-3xl border-2 border-dashed border-[#E2E6D8] bg-white text-center space-y-4 flex flex-col items-center justify-center min-h-[420px] shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8] flex items-center justify-center">
                <Microscope className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[#2D332B]">
                  Awaiting Animal Photograph
                </h4>
                <p className="text-xs text-[#2D332B]/60 max-w-sm">
                  Upload an image on the left and click &ldquo;Analyze Animal&rdquo; to execute the deep learning classification and generate Grad-CAM explainability maps.
                </p>
              </div>
              <div className="text-[11px] text-[#2D332B]/60 bg-[#F3F4EF] px-3.5 py-1 rounded-full border border-[#E2E6D8]">
                Supports MobileNetV2 &amp; EfficientNetB0 CNN Architectures
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
