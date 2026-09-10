import React, { useState } from 'react';
import { 
  Layers, 
  Eye, 
  HelpCircle, 
  Cpu, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  Sliders, 
  BookOpen, 
  FileCode2 
} from 'lucide-react';
import { GradCamViewer, Colormap } from '../components/GradCamViewer';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface XaiDemoPreset {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  predictionLabel: string;
  confidence: number;
  explanation: string;
  targetLayer: string;
  hotspots: { x: number; y: number; radius: number; intensity: number }[];
  anatomicalFeatures: string[];
}

const PRESET_DEMOS: XaiDemoPreset[] = [
  {
    id: 'demo-cattle',
    title: 'Gir Cattle Morphology',
    category: 'Animal Classification',
    imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80',
    predictionLabel: 'Cattle (Bos indicus)',
    confidence: 96.8,
    explanation: 'CNN attention is predominantly localized along the distinct thoracic hump, pendulous cervical dewlap, and forward-sweeping horn curvature characteristic of indigenous Bos indicus.',
    targetLayer: 'MobileNetV2: Conv_1 (1280 channels @ 7x7)',
    hotspots: [
      { x: 46, y: 34, radius: 24, intensity: 0.96 }, // Dewlap & Throat
      { x: 62, y: 38, radius: 22, intensity: 0.88 }, // Thoracic Hump
      { x: 38, y: 26, radius: 18, intensity: 0.79 }  // Head & Muzzle
    ],
    anatomicalFeatures: [
      'Pronounced cervico-thoracic fatty hump',
      'Pendulous dewlap skin fold providing heat dissipation',
      'Elongated, slender facial bone architecture'
    ]
  },
  {
    id: 'demo-buffalo',
    title: 'Murrah Buffalo Morphology',
    category: 'Animal Classification',
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80',
    predictionLabel: 'Buffalo (Bubalus bubalis)',
    confidence: 97.4,
    explanation: 'Strongest gradient activations concentrate at the tightly spiraled horn base, wide flat frontal bone, and jet-black sparse coat texture distinct from Bos taurus.',
    targetLayer: 'MobileNetV2: Conv_1 (1280 channels @ 7x7)',
    hotspots: [
      { x: 36, y: 30, radius: 22, intensity: 0.95 }, // Tightly curled horn base
      { x: 50, y: 35, radius: 25, intensity: 0.91 }, // Broad flat forehead
      { x: 44, y: 64, radius: 20, intensity: 0.74 }  // Compact muscular neck
    ],
    anatomicalFeatures: [
      'Tightly curled spiral horn core',
      'Broad, flattened skull with absence of cranial crest',
      'Thick, heavily pigmented dermal layer with sparse hair'
    ]
  },
  {
    id: 'demo-lsd',
    title: 'Lumpy Skin Lesion Nodules',
    category: 'Dermatological Screening',
    imageUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=600&q=80',
    predictionLabel: 'Possible Lumpy Skin Disease',
    confidence: 91.5,
    explanation: 'The model attends specifically to the circumscribed 2-5cm cutaneous raised nodules with central induration and localized inflammatory edema on the flank.',
    targetLayer: 'EfficientNetB0: top_conv (1280 channels @ 7x7)',
    hotspots: [
      { x: 45, y: 42, radius: 20, intensity: 0.98 }, // Primary nodule
      { x: 60, y: 55, radius: 18, intensity: 0.86 }, // Satellite cluster
      { x: 35, y: 60, radius: 16, intensity: 0.76 }  // Dermal edema
    ],
    anatomicalFeatures: [
      'Discrete, round, firm cutaneous nodules in epidermis/dermis',
      'Central necrotic depression ("sit-fast")',
      'Regional lymphadenopathy and inflammatory swelling'
    ]
  }
];

export const ExplainableAIPage: React.FC = () => {
  const [activePreset, setActivePreset] = useState<XaiDemoPreset>(PRESET_DEMOS[0]);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="pt-4 space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]">
            <Layers className="w-5 h-5" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2D332B] tracking-tight">
            Explainable AI (Grad-CAM) Visualizer
          </h1>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]">
            Interpretability &amp; Model Transparency
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#2D332B]/60">
          Inspect visual explanation maps showing exactly which spatial regions and anatomical features guided the deep neural network&apos;s predictions.
        </p>
      </div>

      <DisclaimerBanner compact />

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#2D332B]/60 uppercase tracking-wider mr-2">
          Select Case Study:
        </span>
        {PRESET_DEMOS.map((demo) => (
          <button
            key={demo.id}
            onClick={() => setActivePreset(demo)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activePreset.id === demo.id
                ? 'bg-[#4B6344] text-white shadow-xs font-bold'
                : 'bg-white border border-[#E2E6D8] text-[#2D332B] hover:bg-[#F3F4EF]'
            }`}
          >
            {demo.title}
          </button>
        ))}
      </div>

      {/* Main Interactive Visualizer */}
      <GradCamViewer
        originalImageUrl={activePreset.imageUrl}
        predictionLabel={activePreset.predictionLabel}
        confidence={activePreset.confidence}
        explanation={activePreset.explanation}
        targetLayer={activePreset.targetLayer}
        hotspots={activePreset.hotspots}
      />

      {/* Technical Academic Explanation for Minor Project Viva */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Mathematical Theory of Grad-CAM */}
        <div className="p-6 rounded-3xl border border-[#E2E6D8] bg-white shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#4B6344]" />
            <h3 className="text-sm font-bold text-[#2D332B]">
              Mathematical Formulation (Grad-CAM)
            </h3>
          </div>

          <p className="text-xs text-[#2D332B]/80 leading-relaxed">
            Gradient-weighted Class Activation Mapping (Grad-CAM) computes the gradient of the target class score <code className="bg-[#EEF0E7] px-1.5 py-0.5 rounded font-mono text-[#2D332B] border border-[#E2E6D8]">y^c</code> with respect to the feature activation map <code className="bg-[#EEF0E7] px-1.5 py-0.5 rounded font-mono text-[#2D332B] border border-[#E2E6D8]">A^k</code> of the final convolutional layer:
          </p>

          <div className="p-4 rounded-2xl bg-[#1F241E] text-[#8DA67A] font-mono text-xs overflow-x-auto space-y-2 border border-[#E2E6D8]/20 shadow-inner">
            <div>
              <span className="text-stone-400"># 1. Neuron Importance Weights (Global Average Pooling):</span>
              <br />
              α_k^c = (1 / Z) * Σ_i Σ_j (∂y^c / ∂A_&#123;i,j&#125;^k)
            </div>
            <div>
              <span className="text-stone-400"># 2. Weighted Activation + Rectified Linear Unit (ReLU):</span>
              <br />
              L_&#123;Grad-CAM&#125;^c = ReLU( Σ_k α_k^c * A^k )
            </div>
          </div>

          <p className="text-xs text-[#2D332B]/60 leading-relaxed">
            The <strong className="text-[#2D332B]">ReLU</strong> operator ensures that the visualizer captures only positive correlations that increase the probability of the target class, filtering out negative or distracter features.
          </p>
        </div>

        {/* Card 2: Anatomical Alignment in Livestock Diagnostics */}
        <div className="p-6 rounded-3xl border border-[#E2E6D8] bg-white shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#4B6344]" />
            <h3 className="text-sm font-bold text-[#2D332B]">
              Veterinary &amp; Clinical Correlation
            </h3>
          </div>

          <p className="text-xs text-[#2D332B]/80 leading-relaxed">
            In veterinary triage, black-box deep learning is unacceptable because misleading background artifacts (e.g. grass, fences, barn walls) could trick the model. Grad-CAM confirms true biological feature learning:
          </p>

          <div className="space-y-2 text-xs">
            {activePreset.anatomicalFeatures.map((feat, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F9FAF7] border border-[#E2E6D8] text-[#2D332B]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#4B6344] shrink-0 mt-0.5" />
                <span className="font-medium">{feat}</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EEF0E7] border border-[#E2E6D8] text-xs text-[#2D332B] leading-relaxed">
            <strong className="text-[#4B6344]">Viva Defence Tip:</strong> Emphasize to examiners that Grad-CAM proves the model is not relying on spurious co-occurrences (e.g., pasture background) but rather on authentic phenotypic characteristics.
          </div>
        </div>

      </div>

    </div>
  );
};
