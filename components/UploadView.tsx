import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';

interface UploadViewProps {
  onImageSelect: (base64: string) => void;
  isAnalyzing: boolean;
  error?: string;
}

export const UploadView: React.FC<UploadViewProps> = ({ onImageSelect, isAnalyzing, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreviewUrl(base64);
      // Strip prefix for API
      const base64Data = base64.split(',')[1];
      onImageSelect(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">What's in your fridge?</h2>
          <p className="text-slate-500">Take a photo or upload an image to get AI-powered recipe suggestions.</p>
        </div>

        {error && (
           <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center justify-center space-x-2 text-sm">
             <AlertCircle className="w-4 h-4" />
             <span>{error}</span>
           </div>
        )}

        <div
          className={`
            relative group border-2 border-dashed rounded-3xl p-10 transition-all duration-300 ease-in-out
            flex flex-col items-center justify-center min-h-[400px]
            ${isDragging ? 'border-emerald-500 bg-emerald-50/50 scale-[1.02]' : 'border-slate-200 bg-white hover:border-emerald-200'}
            ${isAnalyzing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          />

          {isAnalyzing ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ChefIcon className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-lg font-medium text-slate-800">Analyzing ingredients...</p>
                <p className="text-sm text-slate-400">This usually takes a few seconds.</p>
              </div>
            </div>
          ) : previewUrl ? (
            <div className="relative w-full h-full min-h-[320px] rounded-xl overflow-hidden group-hover:opacity-90 transition-opacity">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white font-medium flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Click to retake</span>
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Camera className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-slate-700">Click or drop image here</p>
                <p className="text-sm text-slate-400">Supports JPG, PNG</p>
              </div>
              <div className="mt-8 flex items-center justify-center space-x-4">
                 <button className="px-6 py-2.5 bg-emerald-500 text-white rounded-full font-medium shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-colors flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload Photo</span>
                 </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ChefIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
    <line x1="6" y1="17" x2="18" y2="17" />
  </svg>
);