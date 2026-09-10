import React, { useState } from 'react';
import { 
  BookOpen, 
  Cpu, 
  Database, 
  Layers, 
  Server, 
  CheckCircle2, 
  HelpCircle, 
  Code2, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const ProjectInfoPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const vivaQuestions = [
    {
      q: "1. Why use MobileNetV2 and EfficientNet over traditional ResNet-50 or VGG-16?",
      a: "MobileNetV2 introduces inverted residuals with linear bottlenecks and depthwise separable convolutions, reducing multiply-accumulate (MAC) operations from ~4.1 billion (ResNet-50) down to ~300 million. This allows the livestock classification model to operate with <65ms latency on low-cost edge hardware or field mobile devices without compromising Top-1 classification accuracy."
    },
    {
      q: "2. How does Grad-CAM compute activation heatmaps without retraining the network?",
      a: "Grad-CAM uses the gradients of any target concept score (e.g. score for 'Buffalo') flowing into the final convolutional feature maps. By performing global average pooling over the width and height of the gradient maps, we obtain neuron importance weights (alpha_k). A weighted combination followed by a Rectified Linear Unit (ReLU) ensures only features positively correlating with the class are visualized."
    },
    {
      q: "3. How does the system prevent hazardous AI hallucinations in veterinary recommendations?",
      a: "The Google Gemini 3.8 Flash model runs strictly server-side with structured prompt constraints. It is fed real diagnostic context (predicted class, confidence score, observed cutaneous symptoms, and calibrated risk level) and has hard safety boundaries prohibiting specific drug dosage prescription. When high fever or contagion is detected, it triggers mandatory in-person veterinary escalation."
    },
    {
      q: "4. Why is a full-stack Express + Vite architecture required rather than a pure client-side SPA?",
      a: "In production clinical applications, API credentials (such as GEMINI_API_KEY) must never leak into client browser bundles where they could be extracted. The Express backend securely proxies inference requests, executes Grad-CAM matrix operations, provides normalized database access, and exposes a decoupled microservice interface compatible with Python FastAPI ML workers."
    },
    {
      q: "5. How is the relational MySQL schema structured for longitudinal livestock tracking?",
      a: "The database uses normalized relational tables: `users` (farmers/vets), `animals` (unique ear tag IDs, species, breed, DOB), `health_records` (longitudinal checkups with foreign key references), and `veterinary_clinics` (spatial indexing for distance queries). This allows tracking recurrent mastitis or skin outbreaks over an animal's lifespan."
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="pt-4 space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]">
            <BookOpen className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2D332B] tracking-tight">
            Project Architecture &amp; Viva Voce Guide
          </h1>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]">
            7th Semester CSE Minor Project
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#2D332B]/60">
          Comprehensive documentation of technical architecture, deep learning pipelines, database design, and external evaluation defence.
        </p>
      </div>

      <DisclaimerBanner compact />

      {/* System Architecture Block Diagram */}
      <div className="p-6 rounded-3xl border border-[#E2E6D8] bg-white shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-[#4B6344]" />
            <h3 className="text-base font-bold text-[#2D332B]">
              End-to-End Multi-Tier System Architecture
            </h3>
          </div>
          <span className="text-xs text-[#2D332B]/50 font-mono">Microservices &amp; REST</span>
        </div>

        {/* 4 Pipeline Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-[#F9FAF7] border border-[#E2E6D8] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4B6344] bg-[#EEF0E7] px-2 py-0.5 rounded-md border border-[#E2E6D8]">
                Tier 1: Client
              </span>
              <Layers className="w-4 h-4 text-[#2D332B]/40" />
            </div>
            <h4 className="text-xs font-bold text-[#2D332B]">React 18 + Vite SPA</h4>
            <ul className="text-[11px] text-[#2D332B]/70 space-y-1">
              <li>• Responsive Tailwind CSS</li>
              <li>• Interactive Grad-CAM visualizer</li>
              <li>• Drag &amp; Drop image pipeline</li>
              <li>• Geolocation clinic search</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#F9FAF7] border border-[#E2E6D8] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4B6344] bg-[#EEF0E7] px-2 py-0.5 rounded-md border border-[#E2E6D8]">
                Tier 2: Gateway
              </span>
              <Server className="w-4 h-4 text-[#2D332B]/40" />
            </div>
            <h4 className="text-xs font-bold text-[#2D332B]">Node.js Express API</h4>
            <ul className="text-[11px] text-[#2D332B]/70 space-y-1">
              <li>• Port 3000 container ingress</li>
              <li>• REST endpoints for CV &amp; chat</li>
              <li>• Secure Gemini API proxy</li>
              <li>• Health records JSON / DB store</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#F9FAF7] border border-[#E2E6D8] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4B6344] bg-[#EEF0E7] px-2 py-0.5 rounded-md border border-[#E2E6D8]">
                Tier 3: AI / ML
              </span>
              <Cpu className="w-4 h-4 text-[#2D332B]/40" />
            </div>
            <h4 className="text-xs font-bold text-[#2D332B]">Computer Vision + LLM</h4>
            <ul className="text-[11px] text-[#2D332B]/70 space-y-1">
              <li>• MobileNetV2 / EfficientNetB0</li>
              <li>• Grad-CAM layer attribution</li>
              <li>• Cutaneous disease classifier</li>
              <li>• Gemini 3.8 Flash Veterinary AI</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#F9FAF7] border border-[#E2E6D8] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4B6344] bg-[#EEF0E7] px-2 py-0.5 rounded-md border border-[#E2E6D8]">
                Tier 4: Storage
              </span>
              <Database className="w-4 h-4 text-[#2D332B]/40" />
            </div>
            <h4 className="text-xs font-bold text-[#2D332B]">MySQL 8.0 Relational</h4>
            <ul className="text-[11px] text-[#2D332B]/70 space-y-1">
              <li>• Normalized 3NF entity schema</li>
              <li>• Foreign key integrity</li>
              <li>• Spatial indexes for clinics</li>
              <li>• Exportable JSON backup</li>
            </ul>
          </div>

        </div>

      </div>

      {/* Frequently Asked Viva Voce Questions for External Examiners */}
      <div className="p-6 rounded-3xl border border-[#E2E6D8] bg-white shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#4B6344]" />
          <div>
            <h3 className="text-base font-bold text-[#2D332B]">
              Viva Voce Defense &amp; Examiner Q&amp;A
            </h3>
            <p className="text-xs text-[#2D332B]/60">
              Key theoretical and practical justifications prepared for academic defense.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {vivaQuestions.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className="rounded-2xl border border-[#E2E6D8] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left bg-[#F9FAF7] hover:bg-[#EEF0E7] flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#2D332B] transition-colors"
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#4B6344] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#2D332B]/40 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-4 text-xs sm:text-sm text-[#2D332B]/80 bg-white border-t border-[#E2E6D8] leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MySQL Relational Schema Reference */}
      <div className="p-6 rounded-3xl border border-[#E2E6D8] bg-white shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#4B6344]" />
            <h3 className="text-base font-bold text-[#2D332B]">
              Relational Database Schema (MySQL 8.0)
            </h3>
          </div>
          <span className="text-xs text-[#2D332B]/50 font-mono">database/schema.sql</span>
        </div>

        <p className="text-xs text-[#2D332B]/70">
          Designed with full referential integrity across users, animal profiles, classifications, and clinics:
        </p>

        <div className="p-5 rounded-2xl bg-[#1F241E] text-[#EEF0E7] font-mono text-[11px] overflow-x-auto leading-relaxed border border-[#2D332B]">
          <pre>{`-- MySQL Schema for Livestock Health System
CREATE TABLE animals (
    id VARCHAR(36) PRIMARY KEY,
    owner_id VARCHAR(36) NOT NULL,
    tag_number VARCHAR(50) UNIQUE,
    species ENUM('Cattle', 'Buffalo') NOT NULL,
    breed VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE health_records (
    id VARCHAR(36) PRIMARY KEY,
    animal_id VARCHAR(36) NOT NULL,
    analysis_type ENUM('Classification', 'Skin Screening', 'Full Checkup'),
    condition_result VARCHAR(150),
    confidence_score DECIMAL(5,2),
    risk_level ENUM('Low', 'Moderate', 'High', 'Urgent'),
    vet_consult_recommended BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
);

CREATE TABLE veterinary_clinics (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    phone VARCHAR(50),
    emergency_available BOOLEAN DEFAULT FALSE
);`}</pre>
        </div>
      </div>

    </div>
  );
};
