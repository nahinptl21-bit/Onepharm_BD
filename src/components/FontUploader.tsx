import { useState, useRef, ChangeEvent, DragEvent, useEffect } from 'react';
import { Upload, Clipboard, Sparkles, Image as ImageIcon, CheckCircle2, RotateCw } from 'lucide-react';
import { FONT_SAMPLES, FontSamplePreset } from '../data/fontSamples';
import { FontMatchData } from '../types';

interface FontUploaderProps {
  onAnalyze: (base64: string, mimeType: string, presetMock?: FontMatchData) => void;
  isLoading: boolean;
  activePresetId?: string;
  onSelectPreset: (preset: FontSamplePreset) => void;
  currentImagePreview: string | null;
  onClearImage: () => void;
}

export function FontUploader({
  onAnalyze,
  isLoading,
  activePresetId,
  onSelectPreset,
  currentImagePreview,
  onClearImage,
}: FontUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global window paste listener for instantaneous screenshot pasting (Cmd+V / Ctrl+V)
  useEffect(() => {
    const handleWindowPaste = (e: ClipboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            handleImageFile(blob);
            setPasteError(null);
            e.preventDefault();
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handleWindowPaste);
    return () => window.removeEventListener('paste', handleWindowPaste);
  }, []);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setPasteError('Please provide a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onAnalyze(result, file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleManualPasteClick = async () => {
    setPasteError(null);
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageType = item.types.find((type) => type.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          handleImageFile(new File([blob], 'pasted-screenshot.png', { type: imageType }));
          return;
        }
      }
      setPasteError('No screenshot or image found in your clipboard. Press PrintScreen or Cmd+Shift+4 first!');
    } catch {
      setPasteError('Direct clipboard access not permitted. Press Ctrl+V (or Cmd+V) directly on this page to paste your screenshot.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload & Dropzone Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all relative overflow-hidden ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/20 ring-4 ring-emerald-500/10'
            : currentImagePreview
            ? 'border-stone-300 bg-white shadow-xs'
            : 'border-stone-300 bg-white/70 hover:border-stone-400 shadow-xs'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="hidden"
        />

        {currentImagePreview ? (
          /* Preview of selected screenshot with re-upload controls */
          <div className="flex flex-col items-center gap-4">
            <div className="relative group max-w-xl w-full max-h-64 rounded-xl border border-stone-200 bg-stone-900/5 overflow-hidden flex items-center justify-center p-2 shadow-2xs">
              <img
                src={currentImagePreview}
                alt="Uploaded Screenshot Typography"
                className="max-h-56 w-auto object-contain rounded-lg"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
                  <RotateCw className="w-7 h-7 animate-spin text-emerald-400" />
                  <p className="text-xs font-semibold tracking-wide">
                    Analyzing letterforms & matching fonts...
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                id="reupload-screenshot-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Different Screenshot
              </button>

              <button
                type="button"
                id="clear-screenshot-btn"
                onClick={onClearImage}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                Remove Screenshot
              </button>
            </div>
          </div>
        ) : (
          /* Empty State: Prompt for screenshot */
          <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 shadow-2xs">
              <ImageIcon className="w-7 h-7 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900 tracking-tight">
                Upload or Paste Your Screenshot
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Take a screenshot of any text or font you want to identify, then drag & drop or press{' '}
                <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded text-[11px] font-mono text-stone-700">
                  Ctrl+V
                </kbd>{' '}
                to paste.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                id="browse-screenshot-btn"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
              >
                <Upload className="w-4 h-4" />
                Browse Image File
              </button>

              <button
                type="button"
                id="paste-screenshot-btn"
                onClick={handleManualPasteClick}
                className="px-4 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs"
              >
                <Clipboard className="w-4 h-4 text-stone-500" />
                Paste from Clipboard
              </button>
            </div>

            {pasteError && (
              <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg">
                {pasteError}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Quick Test Samples */}
      <div className="bg-white border border-stone-200 rounded-xl p-3.5 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Try Ready-Made Typography Screenshots:</span>
          </div>
          <span className="text-[11px] text-stone-400">Click any preset to test font identification</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FONT_SAMPLES.map((sample) => {
            const isSelected = activePresetId === sample.id;
            return (
              <button
                key={sample.id}
                id={`preset-${sample.id}`}
                onClick={() => onSelectPreset(sample)}
                disabled={isLoading}
                className={`text-left p-2 rounded-lg border transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-white'
                }`}
              >
                <div className="h-16 w-full rounded border border-stone-200 bg-stone-100 overflow-hidden mb-1.5 flex items-center justify-center">
                  <img
                    src={sample.previewUrl}
                    alt={sample.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="text-[11px] font-semibold text-stone-900 truncate">
                  {sample.title}
                </div>
                <div className="text-[10px] text-stone-500 truncate">
                  {sample.category}
                </div>
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 bg-emerald-600 text-white rounded-full p-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
