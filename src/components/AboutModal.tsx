import React from 'react';
import { X, FileCheck, Type, Sparkles, Building2, ShoppingBag, Cpu, ShieldCheck, HeartHandshake } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Box */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-stone-200 shadow-2xl p-5 sm:p-6 z-10 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-stone-50 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                About Studio Suite
              </h2>
              <p className="text-xs text-stone-500">
                Content Verification &amp; Healthcare Campaign Studio
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-4 overflow-y-auto text-xs text-stone-600 leading-relaxed pr-1">
          {/* Brief Overview */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
            <p className="font-medium text-stone-800">
              <strong>Studio Suite</strong> is a modern multi-tool workspace built for healthcare operators, developers, and marketing teams to verify critical text/data integrity, identify brand typography, and generate high-impact social campaigns.
            </p>
          </div>

          {/* 3 Core Pillars */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-stone-900 text-[11px] uppercase tracking-wider">
              Core Capabilities
            </h3>

            <div className="p-3 rounded-xl border border-stone-200/80 bg-white flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-xs">Content Match Checker</h4>
                <p className="text-stone-500 text-[11px] mt-0.5">
                  High-speed character, word, line, and semantic JSON comparison with real-time Levenshtein edit distance and visual difference inspector.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-stone-200/80 bg-white flex items-start gap-3">
              <div className="p-2 rounded-lg bg-sky-50 text-sky-700 shrink-0">
                <Type className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-xs">Screenshot Font Identifier</h4>
                <p className="text-stone-500 text-[11px] mt-0.5">
                  AI-powered OCR and typographic inspection tool that identifies font families, glyph traits, and curated Google Font pairings from any image.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-stone-200/80 bg-white flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-xs">Campaign AI &amp; Event Planner</h4>
                <p className="text-stone-500 text-[11px] mt-0.5">
                  Strategic insights from 70+ historical campaign posts, bilingual poster copy generator, art direction prompts, and creative event blueprints.
                </p>
              </div>
            </div>
          </div>

          {/* Ecosystem Brands */}
          <div className="space-y-1.5 pt-1">
            <h3 className="font-bold text-stone-900 text-[11px] uppercase tracking-wider">
              Supported Ecosystem
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-200 text-emerald-900">
                <ShoppingBag className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-700" />
                <span className="font-bold block">ONE Pharmacy</span>
                <span className="text-[10px] text-emerald-700/80">Retail Network</span>
              </div>
              <div className="p-2 rounded-lg bg-orange-50/60 border border-orange-200 text-orange-900">
                <Building2 className="w-3.5 h-3.5 mx-auto mb-1 text-orange-700" />
                <span className="font-bold block">MedBox</span>
                <span className="text-[10px] text-orange-700/80">B2B Distribution</span>
              </div>
              <div className="p-2 rounded-lg bg-sky-50/60 border border-sky-200 text-sky-900">
                <Cpu className="w-3.5 h-3.5 mx-auto mb-1 text-sky-700" />
                <span className="font-bold block">PulseTech</span>
                <span className="text-[10px] text-sky-700/80">HealthTech Platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Client-side verification &amp; Gemini AI</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
