import React, { useState, useEffect, useRef } from 'react';
import { Layers, Eye, Sliders, Info, Sparkles, Check, Download } from 'lucide-react';

interface Hotspot {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  radius: number; // percentage
  intensity: number; // 0 to 1
}

interface Props {
  originalImageUrl: string;
  predictionLabel: string;
  confidence: number;
  explanation: string;
  targetLayer?: string;
  hotspots?: Hotspot[];
  animalType?: string;
}

export type Colormap = 'jet' | 'viridis' | 'inferno' | 'turbo';

export const GradCamViewer: React.FC<Props> = ({
  originalImageUrl,
  predictionLabel,
  confidence,
  explanation,
  targetLayer = 'Conv_1 (Final 7x7 Conv Feature Map)',
  hotspots = [
    { x: 42, y: 38, radius: 25, intensity: 0.95 },
    { x: 60, y: 50, radius: 20, intensity: 0.82 }
  ],
  animalType
}) => {
  const [viewMode, setViewMode] = useState<'overlay' | 'side-by-side' | 'heatmap-only'>('overlay');
  const [opacity, setOpacity] = useState<number>(0.65);
  const [colormap, setColormap] = useState<Colormap>('jet');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate dynamic canvas heatmap
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 400;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Create radial heat gradients for each activation hotspot
    const heatCanvas = document.createElement('canvas');
    heatCanvas.width = width;
    heatCanvas.height = height;
    const heatCtx = heatCanvas.getContext('2d');
    if (!heatCtx) return;

    // Fill with black base for intensity mapping
    heatCtx.fillStyle = '#000000';
    heatCtx.fillRect(0, 0, width, height);

    hotspots.forEach((spot) => {
      const cx = (spot.x / 100) * width;
      const cy = (spot.y / 100) * height;
      const r = (spot.radius / 100) * width;

      const radGrad = heatCtx.createRadialGradient(cx, cy, 0, cx, cy, r);
      radGrad.addColorStop(0, `rgba(255, 255, 255, ${spot.intensity})`);
      radGrad.addColorStop(0.5, `rgba(255, 255, 255, ${spot.intensity * 0.5})`);
      radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      heatCtx.fillStyle = radGrad;
      heatCtx.beginPath();
      heatCtx.arc(cx, cy, r, 0, Math.PI * 2);
      heatCtx.fill();
    });

    // Apply color palette look-up table (LUT)
    const imgData = heatCtx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const outData = ctx.createImageData(width, height);
    const out = outData.data;

    for (let i = 0; i < data.length; i += 4) {
      const v = data[i] / 255; // 0 to 1 intensity

      if (v < 0.08) {
        out[i + 3] = 0; // transparent background
        continue;
      }

      const [r, g, b] = getColormapRGB(v, colormap);
      out[i] = r;
      out[i + 1] = g;
      out[i + 2] = b;
      out[i + 3] = Math.floor(v * 255 * opacity);
    }

    ctx.putImageData(outData, 0, 0);
  }, [hotspots, colormap, opacity]);

  return (
    <div id="gradcam-container" className="bg-white rounded-3xl border border-[#E2E6D8] overflow-hidden shadow-xs">
      
      {/* Header & Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-[#E2E6D8] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F3F4EF]/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#EEF0E7] text-[#4B6344] border border-[#E2E6D8]">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-sm sm:text-base text-[#2D332B]">
              Explainable AI: Grad-CAM Feature Attribution
            </h3>
          </div>
          <p className="text-xs text-[#2D332B]/60 mt-1">
            Visualizing gradient-weighted activation in target convolutional layer: <code className="font-mono text-[#2D332B] bg-[#EEF0E7] px-1.5 py-0.5 rounded border border-[#E2E6D8] text-[11px]">{targetLayer}</code>
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-[#EEF0E7] p-1 rounded-2xl shrink-0 self-start md:self-auto border border-[#E2E6D8]">
          <button
            type="button"
            onClick={() => setViewMode('overlay')}
            className={`px-3.5 py-1 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'overlay'
                ? 'bg-[#4B6344] text-white shadow-xs'
                : 'text-[#2D332B]/70 hover:text-[#2D332B]'
            }`}
          >
            Overlay
          </button>
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`px-3.5 py-1 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-[#4B6344] text-white shadow-xs'
                : 'text-[#2D332B]/70 hover:text-[#2D332B]'
            }`}
          >
            Side-by-Side
          </button>
          <button
            type="button"
            onClick={() => setViewMode('heatmap-only')}
            className={`px-3.5 py-1 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'heatmap-only'
                ? 'bg-[#4B6344] text-white shadow-xs'
                : 'text-[#2D332B]/70 hover:text-[#2D332B]'
            }`}
          >
            Heatmap
          </button>
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="p-4 sm:p-6">
        {viewMode === 'side-by-side' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Original Image */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#2D332B]/70">
                <span>1. Original Input Image</span>
                <span className="text-[#2D332B]/50">224 × 224 Normalized</span>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-[#E2E6D8] bg-[#1F241E] aspect-square">
                <img
                  src={originalImageUrl}
                  alt="Original animal"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right: AI Heatmap Overlay */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#2D332B]/70">
                <span>2. AI Attention / Activation (Grad-CAM)</span>
                <span className="text-[#4B6344] font-mono font-bold">Heatmap</span>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-[#E2E6D8] bg-[#1F241E] aspect-square">
                <img
                  src={originalImageUrl}
                  alt="Original animal base"
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Single Screen: Overlay or Heatmap Only */
          <div className="relative max-w-lg mx-auto rounded-3xl overflow-hidden border border-[#E2E6D8] bg-[#1F241E] shadow-inner aspect-square">
            {viewMode === 'overlay' && (
              <img
                src={originalImageUrl}
                alt="Original"
                className="w-full h-full object-cover"
              />
            )}
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
                viewMode === 'heatmap-only' ? 'bg-[#1F241E]' : ''
              }`}
            />

            {/* Hotspot Markers Overlay */}
            {hotspots.map((spot, idx) => (
              <div
                key={idx}
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute pointer-events-none flex items-center justify-center"
              >
                <div className="w-8 h-8 rounded-full border-2 border-white/80 bg-red-500/30 animate-ping" />
                <span className="absolute text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs">
                  Region #{idx + 1}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Explainability Explanation Quote Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-[#EEF0E7] border border-[#E2E6D8] flex items-start gap-3">
          <div className="p-2 bg-[#4B6344] text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4B6344]">
              Why did AI make this prediction?
            </h4>
            <p className="text-sm font-semibold text-[#2D332B]">
              &ldquo;The highlighted regions represent areas that contributed strongly to the model&apos;s prediction.&rdquo;
            </p>
            <p className="text-xs text-[#2D332B]/80 leading-relaxed pt-1">
              {explanation}
            </p>
          </div>
        </div>

        {/* Interactive Controls & Tuning Panel */}
        <div className="mt-5 pt-4 border-t border-[#E2E6D8] grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Opacity Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#2D332B]">
              <span className="flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-[#4B6344]" />
                <span>Heatmap Opacity</span>
              </span>
              <span className="font-mono text-[#4B6344] font-bold">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              id="slider-heatmap-opacity"
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#E2E6D8] rounded-lg appearance-none cursor-pointer accent-[#4B6344]"
            />
            <div className="flex justify-between text-[10px] text-[#2D332B]/50">
              <span>Subtle Overlay</span>
              <span>Dominant Heat</span>
            </div>
          </div>

          {/* Colormap Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#2D332B]">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-[#4B6344]" />
                <span>Thermal Colormap</span>
              </span>
              <span className="uppercase text-[10px] text-[#4B6344] font-mono font-bold">{colormap}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(['jet', 'viridis', 'inferno', 'turbo'] as Colormap[]).map((map) => (
                <button
                  key={map}
                  id={`btn-colormap-${map}`}
                  type="button"
                  onClick={() => setColormap(map)}
                  className={`py-1.5 px-1 rounded-xl text-center text-xs font-medium capitalize border transition-all ${
                    colormap === map
                      ? 'border-[#4B6344] bg-[#EEF0E7] text-[#4B6344] font-bold shadow-xs'
                      : 'border-[#E2E6D8] bg-white text-[#2D332B]/70 hover:bg-[#F3F4EF]'
                  }`}
                >
                  {map}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

// Colormap mathematical interpolation functions
function getColormapRGB(value: number, colormap: Colormap): [number, number, number] {
  const t = Math.max(0, Math.min(1, value));

  switch (colormap) {
    case 'viridis': {
      // Viridis perceptually uniform approximate poly
      const r = Math.floor(255 * (0.28 + 0.1 * t + 0.6 * t * t));
      const g = Math.floor(255 * (0.01 + 0.8 * t));
      const b = Math.floor(255 * (0.33 + 0.5 * Math.sin(t * Math.PI)));
      return [r, g, b];
    }
    case 'inferno': {
      // Inferno dark to bright yellow
      const r = Math.floor(255 * Math.min(1, 1.4 * t));
      const g = Math.floor(255 * (t > 0.4 ? (t - 0.4) * 1.6 : 0));
      const b = Math.floor(255 * (t > 0.7 ? (t - 0.7) * 3.3 : (1 - t) * 0.4));
      return [r, g, b];
    }
    case 'turbo': {
      // Turbo rainbow
      const r = Math.floor(255 * (0.5 + 0.5 * Math.sin(Math.PI * (t - 0.25))));
      const g = Math.floor(255 * Math.sin(Math.PI * t));
      const b = Math.floor(255 * (0.5 + 0.5 * Math.cos(Math.PI * t)));
      return [r, g, b];
    }
    case 'jet':
    default: {
      // Classic Jet: Blue -> Cyan -> Yellow -> Red
      let r = 0, g = 0, b = 0;
      if (t < 0.125) {
        b = 0.5 + 4 * t;
      } else if (t < 0.375) {
        g = 4 * (t - 0.125);
        b = 1;
      } else if (t < 0.625) {
        r = 4 * (t - 0.375);
        g = 1;
        b = 1 - 4 * (t - 0.375);
      } else if (t < 0.875) {
        r = 1;
        g = 1 - 4 * (t - 0.625);
      } else {
        r = 1 - 2 * (t - 0.875);
      }
      return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
    }
  }
}
