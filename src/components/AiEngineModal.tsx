import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  X,
  Server,
  Cpu,
  Bot,
  Layers,
} from 'lucide-react';

interface ProviderInfo {
  configured: boolean;
  models: string[];
}

interface AiStatusResponse {
  success: boolean;
  providers: {
    gemini: ProviderInfo;
    cerebras: ProviderInfo;
    deepseek: ProviderInfo;
    autoFailoverEnabled: boolean;
    order: string[];
  };
  description: string;
}

interface AiEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AiEngineModal({ isOpen, onClose }: AiEngineModalProps) {
  const [status, setStatus] = useState<AiStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<string>('');

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        setLastCheckTime(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed to fetch AI status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                Multi-Model AI Failover Pool
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live Active
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                Automatic cascade whenever an API hits rate limits or quota
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Failover Explanation */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3.5 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700 leading-relaxed">
              <span className="font-semibold text-emerald-950">Zero-Downtime Cascade:</span> If
              Gemini experiences 503 high-demand or quota limits, requests automatically route to
              <strong className="text-emerald-900"> Cerebras</strong> and{' '}
              <strong className="text-emerald-900"> DeepSeek</strong>, backed by our domain
              heuristic engine so your tasks never fail.
            </div>
          </div>

          {/* Connected Providers List */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-1 flex items-center justify-between">
              <span>Configured AI Systems</span>
              <button
                type="button"
                onClick={fetchStatus}
                disabled={loading}
                className="flex items-center gap-1 text-[10px] text-stone-500 hover:text-stone-900 font-medium cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>{lastCheckTime ? `Checked ${lastCheckTime}` : 'Refresh'}</span>
              </button>
            </div>

            {/* Provider 1: Gemini */}
            <div className="p-3.5 rounded-xl border border-stone-200/90 bg-stone-50/50 hover:bg-white transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                    G
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                      <span>Google Gemini</span>
                      <span className="px-1.5 py-0.2 text-[9px] font-bold bg-sky-100 text-sky-700 rounded">
                        Tier 1 (Primary)
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Multimodal Vision (Font Matcher) & Rapid Reasoning
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Configured</span>
                </div>
              </div>
              <div className="text-[10px] text-stone-500 bg-white/80 p-2 rounded-lg border border-stone-200/60 flex flex-wrap gap-1.5">
                <span className="font-semibold text-stone-700">Models:</span>
                <span className="font-mono bg-stone-100 px-1 rounded">gemini-3.1-flash-lite</span>
                <span className="font-mono bg-stone-100 px-1 rounded">gemini-3.8-flash</span>
                <span className="font-mono bg-stone-100 px-1 rounded">gemini-flash-latest</span>
              </div>
            </div>

            {/* Provider 2: Cerebras */}
            <div className="p-3.5 rounded-xl border border-stone-200/90 bg-stone-50/50 hover:bg-white transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                      <span>Cerebras Ultra-Fast AI</span>
                      <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-100 text-amber-700 rounded">
                        Tier 2 (Failover)
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500">
                      High-throughput wafer-scale inference engine
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Connected</span>
                </div>
              </div>
              <div className="text-[10px] text-stone-500 bg-white/80 p-2 rounded-lg border border-stone-200/60 flex flex-wrap gap-1.5">
                <span className="font-semibold text-stone-700">Models:</span>
                <span className="font-mono bg-stone-100 px-1 rounded">gpt-oss-120b</span>
                <span className="font-mono bg-stone-100 px-1 rounded">qwen-3.8-27b</span>
                <span className="font-mono bg-stone-100 px-1 rounded">gemma-4-31b</span>
              </div>
            </div>

            {/* Provider 3: DeepSeek */}
            <div className="p-3.5 rounded-xl border border-stone-200/90 bg-stone-50/50 hover:bg-white transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                      <span>DeepSeek AI</span>
                      <span className="px-1.5 py-0.2 text-[9px] font-bold bg-indigo-100 text-indigo-700 rounded">
                        Tier 3 (Failover)
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Advanced strategic reasoning & Bengali copywriting
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Connected</span>
                </div>
              </div>
              <div className="text-[10px] text-stone-500 bg-white/80 p-2 rounded-lg border border-stone-200/60 flex flex-wrap gap-1.5">
                <span className="font-semibold text-stone-700">Models:</span>
                <span className="font-mono bg-stone-100 px-1 rounded">deepseek-chat</span>
              </div>
            </div>

            {/* Provider 4: Domain Heuristics */}
            <div className="p-3.5 rounded-xl border border-stone-200/90 bg-stone-50/50 hover:bg-white transition-colors space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                      <span>Domain Knowledge Heuristics</span>
                      <span className="px-1.5 py-0.2 text-[9px] font-bold bg-stone-200 text-stone-700 rounded">
                        Tier 4 (Guaranteed)
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Precompiled authentic ONE Pharmacy, MedBox, & PulseTech rules
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-stone-600 font-medium">
                  <span>Always Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
          <span className="text-[11px] text-stone-400">
            Failover triggers on 429 (Rate Limit), 402 (Balance), or 503 (Demand)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
