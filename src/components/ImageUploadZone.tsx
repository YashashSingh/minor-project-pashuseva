import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

interface SampleImage {
  id: string;
  label: string;
  category: 'Cattle' | 'Buffalo' | 'Skin Condition';
  thumbnailUrl: string;
}

const PRESET_SAMPLES: SampleImage[] = [
  {
    id: 'sample-cattle-1',
    label: 'Gir Zebu Cow',
    category: 'Cattle',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-buffalo-1',
    label: 'Murrah Water Buffalo',
    category: 'Buffalo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-cattle-2',
    label: 'Sahiwal Dairy Cattle',
    category: 'Cattle',
    thumbnailUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sample-buffalo-2',
    label: 'Nili-Ravi Buffalo',
    category: 'Buffalo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&w=600&q=80'
  }
];

interface Props {
  onImageSelected: (base64Data: string) => void;
  selectedImage: string | null;
  onClear: () => void;
  title?: string;
  description?: string;
  categoryFilter?: 'Animal' | 'Skin' | 'All';
}

export const ImageUploadZone: React.FC<Props> = ({
  onImageSelected,
  selectedImage,
  onClear,
  title = 'Upload Livestock Image',
  description = 'Drag & drop or browse a photo of cattle, buffalo, or suspicious skin patch',
  categoryFilter = 'All'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageSelected(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const loadSampleImage = async (url: string) => {
    setLoadingSample(true);
    try {
      // Convert external image to base64 via canvas for reliable offline and backend transmission
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          onImageSelected(dataUrl);
        }
        setLoadingSample(false);
      };
      img.onerror = () => {
        // Fallback: pass url directly
        onImageSelected(url);
        setLoadingSample(false);
      };
    } catch (e) {
      onImageSelected(url);
      setLoadingSample(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Box / Image Preview */}
      {selectedImage ? (
        <div 
          id="image-preview-container"
          className="relative rounded-3xl overflow-hidden border-2 border-[#4B6344]/40 bg-[#2D332B] shadow-xs group"
        >
          <img
            src={selectedImage}
            alt="Uploaded livestock preview"
            className="w-full h-80 sm:h-96 object-contain bg-[#1F241E]"
          />

          {/* Top Floating Badge & Clear Button */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2D332B]/85 text-[#EEF0E7] border border-[#E2E6D8]/30 backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8DA67A]" />
              Image Loaded &amp; Preprocessed
            </span>

            <button
              id="btn-remove-selected-image"
              type="button"
              onClick={onClear}
              className="pointer-events-auto p-1.5 rounded-full bg-[#2D332B]/80 text-[#EEF0E7] hover:text-white hover:bg-rose-700/90 backdrop-blur-md transition-colors shadow-xs"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Actions Bar */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-end gap-2 pointer-events-none">
            <button
              id="btn-replace-image"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#2D332B]/90 text-white hover:bg-[#3D5237] border border-[#E2E6D8]/30 backdrop-blur-md transition-all shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change Image</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          id="upload-dropzone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[280px] ${
            isDragging
              ? 'border-[#4B6344] bg-[#EEF0E7]/60 scale-[1.01]'
              : 'border-[#E2E6D8] hover:border-[#4B6344] bg-white hover:bg-[#F3F4EF]/50 shadow-xs'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#EEF0E7] text-[#4B6344] flex items-center justify-center mb-4 border border-[#E2E6D8] shadow-xs">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-base font-bold text-[#2D332B] mb-1">
            {title}
          </h3>
          <p className="text-xs text-[#2D332B]/60 max-w-sm mb-4 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center gap-2">
            <span className="px-4 py-2 rounded-xl text-xs font-bold bg-[#4B6344] hover:bg-[#3D5237] text-white shadow-xs transition-colors">
              Browse from Device
            </span>
            <span className="text-xs text-[#2D332B]/50">or drop here</span>
          </div>

          <p className="text-[11px] text-[#2D332B]/50 mt-4">
            Supports JPEG, PNG, WEBP • Max resolution up to 4K (rescaled to 224×224 for CNN)
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Quick Test Samples for Viva / Demonstration */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#2D332B]/75 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#8B4513]" />
            <span>Try Sample Dataset Images (for quick evaluation):</span>
          </span>
          {loadingSample && (
            <span className="text-[11px] text-[#4B6344] animate-pulse">
              Loading sample...
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESET_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              id={`btn-sample-${sample.id}`}
              type="button"
              disabled={loadingSample}
              onClick={() => loadSampleImage(sample.thumbnailUrl)}
              className="group text-left p-2 rounded-2xl border border-[#E2E6D8] bg-white hover:border-[#4B6344] hover:shadow-xs transition-all flex items-center gap-2.5 disabled:opacity-50"
            >
              <img
                src={sample.thumbnailUrl}
                alt={sample.label}
                className="w-12 h-12 rounded-xl object-cover bg-stone-100 group-hover:scale-105 transition-transform"
              />
              <div className="overflow-hidden">
                <div className="text-[11px] font-bold text-[#2D332B] truncate">
                  {sample.label}
                </div>
                <span className="inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#F3F4EF] text-[#4B6344] border border-[#E2E6D8] mt-0.5">
                  {sample.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
