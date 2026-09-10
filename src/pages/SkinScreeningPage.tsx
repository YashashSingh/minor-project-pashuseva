import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  Clock, 
  HeartHandshake, 
  Layers, 
  MapPin, 
  Microscope, 
  Plus, 
  Save, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { ImageUploadZone } from '../components/ImageUploadZone';
import { GradCamViewer } from '../components/GradCamViewer';
import { SkinScreeningResult, AnimalType } from '../types';
import { api } from '../services/api';
import { PageView } from '../components/Navbar';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface Props {
  onNavigate: (view: PageView) => void;
  activeAnimalType?: AnimalType;
  onScreeningCompleted?: (result: SkinScreeningResult, image: string) => void;
}

export const SkinScreeningPage: React.FC<Props> = ({ 
  onNavigate, 
  activeAnimalType = 'Cattle',
  onScreeningCompleted 
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [animalType, setAnimalType] = useState<AnimalType>(activeAnimalType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SkinScreeningResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleScreenSkin = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const data = await api.screenSkin(selectedImage, animalType === 'Unknown' ? 'Cattle' : animalType);
      data.animalType = animalType;
      data.originalImageUrl = selectedImage;
      setResult(data);

      if (onScreeningCompleted) {
        onScreeningCompleted(data, selectedImage);
      }
    } catch (err: any) {
      setError(err.message || 'Skin screening inference failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToHistory = async () => {
    if (!result || !selectedImage) return;

    try {
      await api.saveHealthRecord({
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        animalType: animalType,
        tagNumber: `SKIN-${animalType.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
        analysisType: 'Skin Screening',
        predictedAnimal: animalType,
        skinConditionResult: result.conditionName,
        confidence: result.confidence,
        riskLevel: result.severity,
        imageUrl: selectedImage,
        visibleSymptoms: result.visibleSymptoms,
        generalPrecautions: result.generalPrecautions,
        vetConsultRecommended: result.vetConsultRecommended,
        notes: `Screening for ${result.conditionName}. Severity evaluated as ${result.severity}.`
      });
      setSavedSuccess(true);
    } catch (err) {
      alert('Failed to save record to history');
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
            <ShieldAlert className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2D332B] tracking-tight">
            AI Skin Health Screening
          </h1>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]">
            Dermatology Decision-Support
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#2D332B]/60">
          Upload a photograph of suspicious cutaneous lesions, nodules, alopecia, or crusts for AI-assisted symptom screening.
        </p>
      </div>

      <DisclaimerBanner />

      {/* Target Animal Selector Bar */}
      <div className="p-4 rounded-2xl border border-[#E2E6D8] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-[#2D332B]">Subject Animal Context:</span>
          <div className="inline-flex rounded-xl p-1 bg-[#F3F4EF] border border-[#E2E6D8]">
            {(['Cattle', 'Buffalo'] as AnimalType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setAnimalType(type)}
                className={`px-3.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  animalType === type
                    ? 'bg-[#4B6344] text-white font-bold shadow-xs'
                    : 'text-[#2D332B]/70 hover:text-[#2D332B]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-[#2D332B]/50 font-mono">
          Target Diseases: Lumpy Skin Disease (LSD) • Bovine Ringworm • Warts • Mange
        </div>
      </div>

      {/* Two Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Upload & Trigger (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl border border-[#E2E6D8] bg-white shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#2D332B]">
              Upload Skin Area Image
            </h3>

            <ImageUploadZone
              selectedImage={selectedImage}
              onImageSelected={(img) => {
                setSelectedImage(img);
                setResult(null);
                setSavedSuccess(false);
              }}
              onClear={handleClear}
              title="Upload Suspicious Skin Photo"
              description="Capture an area showing nodules, circular crusts, alopecia patches, or swelling"
            />

            {/* Run Screening Action Button */}
            {selectedImage && (
              <button
                id="btn-run-skin-screening"
                type="button"
                disabled={loading}
                onClick={handleScreenSkin}
                className="w-full py-3.5 px-4 rounded-xl bg-[#4B6344] hover:bg-[#3D5237] disabled:bg-[#E2E6D8] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Cutaneous Features...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Perform AI Skin Screening</span>
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

        {/* Right Column: Screening Results, Symptoms & Precautions (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-6">
              
              {/* Screening Diagnosis Card */}
              <div className="p-6 sm:p-7 rounded-3xl border border-[#E2E6D8] bg-white shadow-xs space-y-5">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4B6344] bg-[#EEF0E7] px-3 py-1 rounded-full border border-[#E2E6D8]">
                      AI Screening Result
                    </span>
                    <span className="text-xs text-[#2D332B]/50">
                      (Preliminary Decision Support)
                    </span>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    result.severity === 'Urgent'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : result.severity === 'High'
                      ? 'bg-[#EEF0E7] text-[#8B4513] border border-[#E2E6D8]'
                      : 'bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]'
                  }`}>
                    {result.severity} Risk Level
                  </span>
                </div>

                {/* Condition Name & Probability */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <div className="text-xs text-[#2D332B]/60 uppercase tracking-wider font-bold">
                      Possible Skin Condition
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-[#2D332B] mt-1 tracking-tight">
                      {result.conditionName}
                    </div>
                    {result.conditionScientificName && (
                      <div className="text-xs text-[#2D332B]/50 italic mt-0.5">
                        Etiology: {result.conditionScientificName}
                      </div>
                    )}
                  </div>

                  <div className="bg-[#F9FAF7] p-4 rounded-2xl border border-[#E2E6D8] shadow-xs">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#2D332B]/70 mb-1">
                      <span>Screening Confidence</span>
                      <span className="font-mono text-[#4B6344] text-base font-bold">{result.confidence}%</span>
                    </div>
                    <div className="w-full bg-[#E2E6D8] rounded-full h-2.5 overflow-hidden">
                      <div
                        style={{ width: `${result.confidence}%` }}
                        className="bg-[#4B6344] h-full rounded-full transition-all duration-500"
                      />
                    </div>
                    <div className="text-[10px] text-[#2D332B]/50 mt-1 text-right">
                      Probability Score
                    </div>
                  </div>
                </div>

                {/* Veterinary Recommendation Callout */}
                <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
                  result.vetConsultRecommended
                    ? 'bg-[#EEF0E7] border-[#E2E6D8] text-[#2D332B]'
                    : 'bg-[#F9FAF7] border-[#E2E6D8] text-[#2D332B]'
                }`}>
                  <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                    result.vetConsultRecommended ? 'text-[#8B4513]' : 'text-[#4B6344]'
                  }`} />
                  <div>
                    <span className="font-bold text-[#2D332B]">
                      {result.vetConsultRecommended 
                        ? 'Veterinary Examination Recommended' 
                        : 'Routine Monitoring Protocol'}
                    </span>
                    <p className="mt-1 text-[#2D332B]/70 leading-relaxed">
                      {result.vetConsultRecommended
                        ? 'Due to the contagious or acute nature of these cutaneous signs, a physical clinical examination by a licensed veterinary practitioner is strongly advised.'
                        : 'Symptoms appear mild and non-systemic. Continue daily observation and sanitation.'}
                    </p>
                  </div>
                </div>

                {/* Visible Symptoms Checklist */}
                <div className="space-y-2 pt-3 border-t border-[#E2E6D8]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D332B]">
                    Visible Symptoms Identified by Model
                  </h4>
                  <div className="space-y-2">
                    {result.visibleSymptoms.map((sym, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F9FAF7] border border-[#E2E6D8] text-xs text-[#2D332B]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#4B6344] shrink-0 mt-0.5" />
                        <span className="font-medium">{sym}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* General Precautions Checklist */}
                <div className="space-y-2 pt-3 border-t border-[#E2E6D8]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D332B]">
                    General Care &amp; Biosecurity Precautions
                  </h4>
                  <div className="space-y-2">
                    {result.generalPrecautions.map((prec, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F9FAF7] border border-[#E2E6D8] text-xs text-[#2D332B]"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#4B6344] shrink-0 mt-1.5" />
                        <span className="font-medium">{prec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-[#E2E6D8] flex flex-wrap items-center justify-between gap-3">
                  <button
                    id="btn-save-skin-screening-record"
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
                        <span>Saved to History</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Record to History</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      id="btn-consult-ai-assistant"
                      type="button"
                      onClick={() => onNavigate('chatbot')}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#4B6344] hover:bg-[#3D5237] text-white shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Consult Livestock AI Assistant</span>
                    </button>

                    {result.vetConsultRecommended && (
                      <button
                        id="btn-find-vet-for-skin"
                        type="button"
                        onClick={() => onNavigate('veterinarians')}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#8B4513] hover:bg-[#72380f] text-white shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Find Veterinarian</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Explainable AI / Grad-CAM Component */}
              {selectedImage && (
                <GradCamViewer
                  originalImageUrl={selectedImage}
                  predictionLabel={result.conditionName}
                  confidence={result.confidence}
                  explanation={result.xaiExplanation}
                  targetLayer="EfficientNetB0 top_conv (Final 1280 Spatial Feature Maps)"
                  hotspots={result.hotspotCoordinates}
                  animalType={animalType}
                />
              )}

            </div>
          ) : (
            /* Placeholder State */
            <div className="p-12 rounded-3xl border-2 border-dashed border-[#E2E6D8] bg-white text-center space-y-4 flex flex-col items-center justify-center min-h-[420px] shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8] flex items-center justify-center">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[#2D332B]">
                  Awaiting Skin Area Image
                </h4>
                <p className="text-xs text-[#2D332B]/60 max-w-sm">
                  Upload a clear image of the suspected lesion on the left to initiate the AI dermatology screening and compute Grad-CAM attention hotmaps.
                </p>
              </div>
              <div className="text-[11px] text-[#2D332B]/60 bg-[#F3F4EF] px-3.5 py-1 rounded-full border border-[#E2E6D8]">
                Provides precautionary guidance • Not a replacement for veterinary diagnosis
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
