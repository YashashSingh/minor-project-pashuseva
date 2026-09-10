import React from 'react';
import { ShieldCheck, Heart, Database, Cpu, Sparkles, BookOpen } from 'lucide-react';
import { PageView } from './Navbar';

interface Props {
  onNavigate: (view: PageView) => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#2D332B] text-[#EEF0E7] border-t border-[#3D5237] pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#3D5237]">
          
          {/* Brand & Project Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4B6344] flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4 text-[#EEF0E7]" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                PashuSeva<span className="text-[#8DA67A]">AI</span>
              </span>
            </div>
            <p className="text-xs text-[#EEF0E7]/70 leading-relaxed max-w-md">
              An integrated decision-support platform engineered for dairy farmers and veterinary field officers. Combining deep learning CNN classification, cutaneous lesion screening, explainable Grad-CAM visual attention, and contextual conversational AI.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#EEF0E7]/60">
              <span className="px-2 py-0.5 rounded bg-[#3D5237] border border-[#4B6344] text-[#EEF0E7] font-mono">
                CSE 7th Semester Minor Project
              </span>
              <span>•</span>
              <span>Transfer Learning (MobileNetV2 / EfficientNet)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('classifier')} 
                  className="hover:text-[#8DA67A] transition-colors"
                >
                  Animal Classification (Cattle / Buffalo)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('skin-screening')} 
                  className="hover:text-[#8DA67A] transition-colors"
                >
                  AI Skin Health Screening
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('explainable-ai')} 
                  className="hover:text-[#8DA67A] transition-colors"
                >
                  Explainable AI &amp; Grad-CAM Heatmaps
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('chatbot')} 
                  className="hover:text-[#8DA67A] transition-colors"
                >
                  Livestock AI Assistant (Gemini)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('veterinarians')} 
                  className="hover:text-[#8DA67A] transition-colors"
                >
                  Find Nearby Veterinarians
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('health-history')} 
                  className="hover:text-[#8DA67A] transition-colors"
                >
                  Animal Health History Records
                </button>
              </li>
            </ul>
          </div>

          {/* Academic & Architecture Specs */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#8DA67A]" />
              <span>Technical Stack</span>
            </h4>
            <div className="space-y-1.5 text-xs text-[#EEF0E7]/70">
              <p className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8DA67A]" />
                <span><strong>Vision Backbone:</strong> MobileNetV2 / EfficientNet</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8DA67A]" />
                <span><strong>Explainability:</strong> Grad-CAM Layer Visualizer</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8DA67A]" />
                <span><strong>Conversational:</strong> Gemini 3.8 Flash (Server-Side)</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8DA67A]" />
                <span><strong>Database:</strong> Relational MySQL 8.0 Schema</span>
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('project-info')}
                  className="text-[11px] text-[#8DA67A] hover:text-white font-medium inline-flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Viva &amp; Architecture Report →</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#EEF0E7]/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8DA67A] shrink-0" />
            <span>
              Clinical Decision-Support System: Intended for preliminary screening only. Does not replace professional clinical veterinary diagnosis.
            </span>
          </div>
          <p className="text-[#EEF0E7]/60 text-center sm:text-right">
            Department of Computer Science &amp; Engineering • Minor Project
          </p>
        </div>
      </div>
    </footer>
  );
};
