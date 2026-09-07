import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Share2,
  RefreshCw,
  ShoppingBag,
  Building2,
  Cpu,
  Layers,
  Award
} from 'lucide-react';
import { CampaignAnalysisReport } from '../../types';

interface CampaignExecutiveReportProps {
  selectedVertical?: string;
}

export const CampaignExecutiveReport: React.FC<CampaignExecutiveReportProps> = ({
  selectedVertical = 'All',
}) => {
  const [report, setReport] = useState<CampaignAnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vertical: selectedVertical === 'All' ? undefined : selectedVertical,
        }),
      });

      if (!res.ok) throw new Error('Analysis request failed');
      const json = await res.json();
      if (json.success && json.data) {
        setReport(json.data);
      }
    } catch (err: any) {
      console.error('Error fetching report:', err);
      setError(err.message || 'Failed to load report');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [selectedVertical]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            AI Campaign Strategic Analysis &amp; Dashboard Report
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Holistic performance review synthesized from 70+ historical campaign records across ONE Pharmacy, MedBox, and PulseTech.
          </p>
        </div>

        <button
          onClick={fetchAnalysis}
          disabled={isLoading}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Synthesizing...' : 'Refresh AI Analysis'}</span>
        </button>
      </div>

      {isLoading && !report && (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-stone-800">
            Analyzing multi-brand social campaign JSON dataset...
          </p>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Extracting engagement dynamics, video viewership, storytelling motifs, and channel efficiency for ONE Pharmacy, MedBox, and PulseTech.
          </p>
        </div>
      )}

      {report && (
        <>
          {/* Executive Summary Card */}
          <div className="p-5 bg-emerald-950 text-white rounded-2xl shadow-sm border border-emerald-900/80 space-y-3">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Executive Strategic Overview
            </div>
            <p className="text-sm text-emerald-100/90 leading-relaxed font-medium">
              {report.summary}
            </p>
          </div>

          {/* Vertical Deep Dive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.verticalHighlights.map((vh, i) => {
              const isOne = vh.vertical === 'ONE Pharmacy';
              const isMed = vh.vertical === 'MedBox';

              const cardTheme = isOne
                ? {
                    border: 'border-emerald-200',
                    headerBg: 'bg-emerald-50 text-emerald-900',
                    icon: <ShoppingBag className="w-4 h-4 text-emerald-700" />,
                    badge: 'bg-emerald-100 text-emerald-800',
                  }
                : isMed
                ? {
                    border: 'border-orange-200',
                    headerBg: 'bg-orange-50 text-orange-900',
                    icon: <Building2 className="w-4 h-4 text-orange-700" />,
                    badge: 'bg-orange-100 text-orange-800',
                  }
                : {
                    border: 'border-sky-200',
                    headerBg: 'bg-sky-50 text-sky-900',
                    icon: <Cpu className="w-4 h-4 text-sky-700" />,
                    badge: 'bg-sky-100 text-sky-800',
                  };

              return (
                <div
                  key={i}
                  className={`bg-white rounded-2xl border ${cardTheme.border} shadow-2xs overflow-hidden flex flex-col justify-between`}
                >
                  <div className={`p-4 ${cardTheme.headerBg} flex items-center justify-between border-b border-stone-100`}>
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {cardTheme.icon}
                      <span>{vh.vertical}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${cardTheme.badge}`}>
                      Strategic Audit
                    </span>
                  </div>

                  <div className="p-5 space-y-4 text-xs">
                    {/* Key Themes */}
                    <div>
                      <span className="font-bold text-stone-700 uppercase text-[10px] tracking-wider block mb-1.5">
                        Dominant Themes
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {vh.keyThemes.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[11px]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Top Strengths */}
                    <div>
                      <span className="font-bold text-stone-700 uppercase text-[10px] tracking-wider block mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Observed Strengths
                      </span>
                      <ul className="space-y-1.5 text-stone-600">
                        {vh.topStrengths.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommended Actions */}
                    <div>
                      <span className="font-bold text-stone-700 uppercase text-[10px] tracking-wider block mb-1.5 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
                        Next Strategic Steps
                      </span>
                      <ul className="space-y-1.5 text-stone-600">
                        {vh.recommendedNextSteps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Content Findings & Channel Strategy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Content Performance Findings */}
            <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Key Content Performance Findings
              </h3>
              <ul className="space-y-2 text-xs text-stone-600">
                {report.contentPerformanceFindings.map((finding, idx) => (
                  <li key={idx} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/60 leading-relaxed flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Optimal Channel Strategy */}
            <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-600" />
                Optimal Channel Strategy (Facebook vs LinkedIn)
              </h3>
              <ul className="space-y-2 text-xs text-stone-600">
                {report.optimalChannelStrategy.map((strat, idx) => (
                  <li key={idx} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/60 leading-relaxed flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{strat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Seasonal & Health Awareness Calendar */}
          <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-500" />
              Seasonal &amp; Healthcare Event Expansion Opportunities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {report.seasonalEventOpportunities.map((opp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-rose-50/40 rounded-xl border border-rose-100 text-stone-700 leading-relaxed font-medium"
                >
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block mb-1">
                    Opportunity 0{idx + 1}
                  </span>
                  {opp}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
