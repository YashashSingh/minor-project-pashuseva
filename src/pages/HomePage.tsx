import React from 'react';
import { 
  Activity, 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Layers, 
  MapPin, 
  Microscope, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Users 
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { PageView } from '../components/Navbar';

interface Props {
  onNavigate: (view: PageView) => void;
}

export const HomePage: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-[#F3F4EF] rounded-3xl border border-[#E2E6D8] px-6 sm:px-12 mt-4 shadow-xs">
        
        {/* Subtle decorative background organic shape */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#8DA67A]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#4B6344]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-5">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8] text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#4B6344]" />
            <span>CSE 7th Semester Minor Project • AI Decision Support</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-black text-[#2D332B] tracking-tight leading-tight">
            AI-Powered Livestock Health Monitoring &amp; Veterinary Assistance
          </h1>

          {/* Subtitle / Short Description */}
          <p className="text-base sm:text-lg text-[#2D332B]/75 max-w-2xl mx-auto leading-relaxed">
            An end-to-end intelligent platform bridging deep learning computer vision (Cattle vs. Buffalo), dermatological disease screening, explainable Grad-CAM heatmaps, and contextual veterinary guidance.
          </p>

          {/* Prominent Disclaimer */}
          <div className="max-w-2xl mx-auto text-left">
            <DisclaimerBanner />
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <button
              id="btn-hero-analyze-animal"
              onClick={() => onNavigate('classifier')}
              className="px-6 py-3.5 rounded-xl bg-[#4B6344] hover:bg-[#3D5237] text-white font-bold text-sm shadow-xs hover:shadow-sm transition-all flex items-center gap-2"
            >
              <Microscope className="w-4 h-4" />
              <span>Analyze Animal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-hero-ask-ai"
              onClick={() => onNavigate('chatbot')}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#EEF0E7] text-[#4B6344] font-bold text-sm border border-[#E2E6D8] shadow-xs hover:shadow-sm transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-[#4B6344]" />
              <span>Ask AI Assistant</span>
            </button>

            <button
              id="btn-hero-find-vet"
              onClick={() => onNavigate('veterinarians')}
              className="px-6 py-3.5 rounded-xl bg-[#2D332B] hover:bg-[#3D5237] text-white font-bold text-sm shadow-xs transition-all flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-[#8DA67A]" />
              <span>Find Veterinarian</span>
            </button>
          </div>

          {/* Key Metrics Strip */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-[#E2E6D8] max-w-3xl mx-auto">
            <div className="p-4 bg-white rounded-2xl border border-[#E2E6D8] shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-[#4B6344]">96.4%</div>
              <div className="text-[11px] font-bold text-[#2D332B]/60 uppercase tracking-tighter mt-1">
                Cattle/Buffalo Accuracy
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-[#E2E6D8] shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-[#8B4513]">&lt;65ms</div>
              <div className="text-[11px] font-bold text-[#2D332B]/60 uppercase tracking-tighter mt-1">
                Inference Latency
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-[#E2E6D8] shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-[#4B6344]">Grad-CAM</div>
              <div className="text-[11px] font-bold text-[#2D332B]/60 uppercase tracking-tighter mt-1">
                Visual Attention Heatmaps
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-[#E2E6D8] shadow-xs">
              <div className="text-xl sm:text-2xl font-black text-[#2D332B]">Gemini 3.8</div>
              <div className="text-[11px] font-bold text-[#2D332B]/60 uppercase tracking-tighter mt-1">
                Livestock Assistant
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Complete Workflow Pipeline Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4B6344] bg-[#EEF0E7] px-3 py-1 rounded-full border border-[#E2E6D8]">
            System Architecture &amp; User Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2D332B]">
            Integrated Decision-Support Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-[#2D332B]/70">
            Transforming a standard image classification task into a full-lifecycle clinical assistance tool.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Animal Type Classification */}
          <div 
            id="flow-card-classifier"
            onClick={() => onNavigate('classifier')}
            className="p-6 rounded-3xl border border-[#E2E6D8] bg-white hover:border-[#4B6344] hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF0E7] text-[#4B6344] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#E2E6D8]">
                <Microscope className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#4B6344] uppercase tracking-wider">Step 1</span>
                <span className="text-[10px] font-mono bg-[#F3F4EF] px-2 py-0.5 rounded text-[#2D332B]/70 border border-[#E2E6D8]">CNN Model</span>
              </div>
              <h3 className="text-lg font-bold text-[#2D332B] group-hover:text-[#4B6344] transition-colors">
                Animal Type Classification
              </h3>
              <p className="text-xs text-[#2D332B]/70 leading-relaxed">
                Distinguishes between Cattle (Bos indicus / taurus) and Buffalo (Bubalus bubalis) using deep convolutional transfer learning with morphological feature validation.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E2E6D8] flex items-center justify-between text-xs font-semibold text-[#4B6344]">
              <span>Launch Classifier</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Skin Health Screening */}
          <div 
            id="flow-card-skin"
            onClick={() => onNavigate('skin-screening')}
            className="p-6 rounded-3xl border border-[#E2E6D8] bg-white hover:border-[#8B4513] hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center group-hover:scale-105 transition-transform border border-amber-200">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#8B4513] uppercase tracking-wider">Step 2</span>
                <span className="text-[10px] font-mono bg-[#F3F4EF] px-2 py-0.5 rounded text-[#2D332B]/70 border border-[#E2E6D8]">Lesion Screening</span>
              </div>
              <h3 className="text-lg font-bold text-[#2D332B] group-hover:text-[#8B4513] transition-colors">
                AI Skin Health Screening
              </h3>
              <p className="text-xs text-[#2D332B]/70 leading-relaxed">
                Evaluates suspicious skin nodules and patches for conditions such as Lumpy Skin Disease (LSD), Ringworm, Papillomas, and Mange with severity estimation.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E2E6D8] flex items-center justify-between text-xs font-semibold text-[#8B4513]">
              <span>Start Skin Screening</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Explainable AI (Grad-CAM) */}
          <div 
            id="flow-card-xai"
            onClick={() => onNavigate('explainable-ai')}
            className="p-6 rounded-3xl border border-[#E2E6D8] bg-white hover:border-[#4B6344] hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF0E7] text-[#4B6344] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#E2E6D8]">
                <Layers className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#4B6344] uppercase tracking-wider">Step 3</span>
                <span className="text-[10px] font-mono bg-[#F3F4EF] px-2 py-0.5 rounded text-[#2D332B]/70 border border-[#E2E6D8]">XAI Visualizer</span>
              </div>
              <h3 className="text-lg font-bold text-[#2D332B] group-hover:text-[#4B6344] transition-colors">
                Explainable AI Heatmaps
              </h3>
              <p className="text-xs text-[#2D332B]/70 leading-relaxed">
                Gradient-weighted Class Activation Mapping (Grad-CAM) highlights exact image regions that contributed to the model&apos;s decision for transparent verification.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E2E6D8] flex items-center justify-between text-xs font-semibold text-[#4B6344]">
              <span>Explore Grad-CAM</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Second Row of Workflow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 4: Livestock AI Assistant */}
          <div 
            id="flow-card-chat"
            onClick={() => onNavigate('chatbot')}
            className="p-6 rounded-3xl border border-[#E2E6D8] bg-white hover:border-[#4B6344] hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF0E7] text-[#4B6344] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#E2E6D8]">
                <Bot className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#4B6344] uppercase tracking-wider">Step 4</span>
                <span className="text-[10px] font-mono bg-[#F3F4EF] px-2 py-0.5 rounded text-[#2D332B]/70 border border-[#E2E6D8]">Gemini LLM</span>
              </div>
              <h3 className="text-lg font-bold text-[#2D332B] group-hover:text-[#4B6344] transition-colors">
                Livestock AI Assistant
              </h3>
              <p className="text-xs text-[#2D332B]/70 leading-relaxed">
                Context-aware conversational assistant that ingests your current animal and skin screening results to provide safety advice, follow-ups, and triage instructions.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E2E6D8] flex items-center justify-between text-xs font-semibold text-[#4B6344]">
              <span>Consult Assistant</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Nearby Veterinarian Finder */}
          <div 
            id="flow-card-vets"
            onClick={() => onNavigate('veterinarians')}
            className="p-6 rounded-3xl border border-[#E2E6D8] bg-white hover:border-[#4B6344] hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF0E7] text-[#4B6344] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#E2E6D8]">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#4B6344] uppercase tracking-wider">Step 5</span>
                <span className="text-[10px] font-mono bg-[#F3F4EF] px-2 py-0.5 rounded text-[#2D332B]/70 border border-[#E2E6D8]">Geo Triage</span>
              </div>
              <h3 className="text-lg font-bold text-[#2D332B] group-hover:text-[#4B6344] transition-colors">
                Find Nearby Veterinarian
              </h3>
              <p className="text-xs text-[#2D332B]/70 leading-relaxed">
                Locate verified government veterinary dispensaries, district polyclinics, and 24/7 mobile veterinary units with emergency contact numbers and directions.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E2E6D8] flex items-center justify-between text-xs font-semibold text-[#4B6344]">
              <span>Find Local Clinics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Health History & Records */}
          <div 
            id="flow-card-history"
            onClick={() => onNavigate('health-history')}
            className="p-6 rounded-3xl border border-[#E2E6D8] bg-white hover:border-[#4B6344] hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF0E7] text-[#4B6344] flex items-center justify-center group-hover:scale-105 transition-transform border border-[#E2E6D8]">
                <Clock className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#4B6344] uppercase tracking-wider">Step 6</span>
                <span className="text-[10px] font-mono bg-[#F3F4EF] px-2 py-0.5 rounded text-[#2D332B]/70 border border-[#E2E6D8]">MySQL Store</span>
              </div>
              <h3 className="text-lg font-bold text-[#2D332B] group-hover:text-[#4B6344] transition-colors">
                Animal Health History
              </h3>
              <p className="text-xs text-[#2D332B]/70 leading-relaxed">
                Structured clinical history storing past classifications, confidence metrics, visual symptoms, and notes for herd health management and record keeping.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E2E6D8] flex items-center justify-between text-xs font-semibold text-[#4B6344]">
              <span>View Records</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

      </section>

      {/* Academic Minor Project Banner */}
      <section className="bg-[#4B6344] text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#EEF0E7] border border-white/20 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#8DA67A]" />
            <span>CSE 7th Semester Minor Project Evaluation Ready</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Why this project goes beyond basic classification
          </h3>
          <p className="text-sm text-white/80 leading-relaxed">
            Standard college projects merely predict a binary class label. This platform synthesizes deep learning CNNs, clinical dermatology screening, transparent explainability (Grad-CAM), conversational LLM assistance, geolocation triage, and relational database modeling into a cohesive decision-support product.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('project-info')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#EEF0E7] text-[#4B6344] text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
            >
              <span>View Viva &amp; Architecture Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 rounded-xl bg-[#3D5237] hover:bg-white/10 text-white text-xs font-bold border border-white/20 transition-all"
            >
              Open Health Analytics Dashboard
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
