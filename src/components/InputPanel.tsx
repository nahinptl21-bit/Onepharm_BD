import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Clipboard, Trash2, Upload, FileText, Check } from 'lucide-react';

interface InputPanelProps {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  charCount: number;
  wordCount: number;
  lineCount: number;
  placeholder?: string;
  accentColor?: 'stone' | 'sky';
}

export function InputPanel({
  id,
  title,
  subtitle,
  badge,
  value,
  onChange,
  onClear,
  charCount,
  wordCount,
  lineCount,
  placeholder = 'Type or paste content here...',
  accentColor = 'stone',
}: InputPanelProps) {
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
        setCopiedFeedback(true);
        setTimeout(() => setCopiedFeedback(false), 1500);
      }
    } catch {
      // If clipboard read fails due to browser permissions, focus textarea
      const el = document.getElementById(id) as HTMLTextAreaElement;
      if (el) el.focus();
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readFile(file);
    }
    // reset input so same file can be re-uploaded if cleared
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (typeof content === 'string') {
        onChange(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      className={`bg-white border rounded-xl flex flex-col h-[380px] sm:h-[420px] transition-all relative overflow-hidden ${
        isDragging
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10'
          : 'border-stone-200 shadow-xs hover:border-stone-300'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Top Header / Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-stone-50/90 border-b border-stone-200 select-none">
        <div className="flex items-center gap-2">
          <FileText className={`w-4 h-4 ${accentColor === 'sky' ? 'text-sky-600' : 'text-stone-700'}`} />
          <h2 className="text-sm font-semibold text-stone-900 tracking-tight">
            {title}
          </h2>
          {badge && (
            <span className="text-[11px] font-medium px-2 py-0.2 bg-stone-200/70 text-stone-700 rounded-md">
              {badge}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-stone-400 hidden sm:inline">
              ({subtitle})
            </span>
          )}
        </div>

        {/* Panel Action Buttons */}
        <div className="flex items-center gap-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".txt,.json,.csv,.md,.html,.xml,.js,.ts,.yaml,.yml,.log"
          />
          <button
            type="button"
            id={`${id}-upload-btn`}
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors text-xs flex items-center gap-1"
            title="Upload text or code file"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Upload</span>
          </button>

          <button
            type="button"
            id={`${id}-paste-btn`}
            onClick={handlePaste}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 rounded-md transition-colors text-xs flex items-center gap-1"
            title="Paste from clipboard"
          >
            {copiedFeedback ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] text-emerald-600">Pasted</span>
              </>
            ) : (
              <>
                <Clipboard className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">Paste</span>
              </>
            )}
          </button>

          {value && (
            <button
              type="button"
              id={`${id}-clear-btn`}
              onClick={onClear}
              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors text-xs flex items-center gap-1"
              title="Clear this text"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[11px]">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Textarea */}
      <div className="relative flex-1 flex flex-col">
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          className="w-full flex-1 p-3.5 text-xs sm:text-sm font-mono text-stone-900 bg-white resize-none focus:outline-none focus:ring-0 leading-relaxed overflow-y-auto selection:bg-stone-200"
        />

        {/* Drag and Drop visual helper */}
        {isDragging && (
          <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-xs flex items-center justify-center border-2 border-dashed border-emerald-500 pointer-events-none">
            <div className="bg-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 text-emerald-700 font-medium text-xs">
              <Upload className="w-4 h-4 animate-bounce" />
              Drop text, JSON, or code file here
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Stats */}
      <div className="px-3 py-1.5 bg-stone-50 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <span>
            <strong className="font-semibold text-stone-700">{charCount}</strong> chars
          </span>
          <span className="text-stone-300">•</span>
          <span>
            <strong className="font-semibold text-stone-700">{wordCount}</strong> words
          </span>
          <span className="text-stone-300">•</span>
          <span>
            <strong className="font-semibold text-stone-700">{lineCount}</strong> lines
          </span>
        </div>
        <div>
          {value.length > 0 && (
            <span className="text-stone-400">
              {value.startsWith('{') || value.startsWith('[') ? 'JSON / Object' : 'Plain Text'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
