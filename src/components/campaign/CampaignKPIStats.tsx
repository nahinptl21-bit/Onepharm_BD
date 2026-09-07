import React from 'react';
import { BarChart3, TrendingUp, Eye, Share2, Layers, Building2, ShoppingBag, Cpu } from 'lucide-react';
import { CampaignMetrics } from '../../utils/campaignAnalytics';

interface CampaignKPIStatsProps {
  metrics: CampaignMetrics;
  selectedVertical: string;
  onSelectVertical: (vertical: string) => void;
}

export const CampaignKPIStats: React.FC<CampaignKPIStatsProps> = ({
  metrics,
  selectedVertical,
  onSelectVertical,
}) => {
  return (
    <div className="space-y-4">
      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1 font-medium">
            <span>Total Posts Analyzed</span>
            <Layers className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-bold text-stone-900 tracking-tight">
            {metrics.totalPosts}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1.5">
            <span className="font-semibold text-emerald-600">5 Months</span>
            <span>(Apr - Aug 2026)</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1 font-medium">
            <span>Tracked Video Views</span>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 tracking-tight">
            {metrics.totalViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Across top partner &amp; video campaigns
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1 font-medium">
            <span>Organic Reach Recorded</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 tracking-tight">
            {metrics.totalReach.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Unique healthcare &amp; retail audience
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1 font-medium">
            <span>Avg Caption Length</span>
            <BarChart3 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 tracking-tight">
            {metrics.averageCharacters} <span className="text-xs font-normal text-stone-500">chars</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Storytelling &amp; hotline format
          </div>
        </div>
      </div>

      {/* Brand Vertical Filter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => onSelectVertical('All')}
          className={`p-2.5 sm:p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
            selectedVertical === 'All'
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
              : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200'
          }`}
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate">All Entities</p>
            <p className={`text-[10px] sm:text-[11px] truncate ${selectedVertical === 'All' ? 'text-stone-300' : 'text-stone-500'}`}>
              Portfolio overview
            </p>
          </div>
          <span className={`text-xs sm:text-sm font-bold px-1.5 sm:px-2 py-0.5 rounded-md shrink-0 ${
            selectedVertical === 'All' ? 'bg-stone-800 text-emerald-400' : 'bg-stone-100 text-stone-700'
          }`}>
            {metrics.totalPosts}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectVertical('ONE Pharmacy')}
          className={`p-2.5 sm:p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
            selectedVertical === 'ONE Pharmacy'
              ? 'bg-emerald-950 text-white border-emerald-900 shadow-xs'
              : 'bg-white hover:bg-emerald-50/40 text-stone-800 border-stone-200'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">ONE Pharmacy</p>
              <p className={`text-[10px] sm:text-[11px] truncate ${selectedVertical === 'ONE Pharmacy' ? 'text-emerald-300' : 'text-stone-500'}`}>
                Retail Network
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-1.5 sm:px-2 py-0.5 bg-emerald-100/90 text-emerald-900 rounded-md shrink-0">
            {metrics.byVertical['ONE Pharmacy'] || 0}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectVertical('MedBox')}
          className={`p-2.5 sm:p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
            selectedVertical === 'MedBox'
              ? 'bg-orange-950 text-white border-orange-900 shadow-xs'
              : 'bg-white hover:bg-orange-50/40 text-stone-800 border-stone-200'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">MedBox</p>
              <p className={`text-[10px] sm:text-[11px] truncate ${selectedVertical === 'MedBox' ? 'text-orange-300' : 'text-stone-500'}`}>
                B2B Distribution
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-1.5 sm:px-2 py-0.5 bg-orange-100 text-orange-900 rounded-md shrink-0">
            {metrics.byVertical['MedBox'] || 0}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectVertical('PulseTech')}
          className={`p-2.5 sm:p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
            selectedVertical === 'PulseTech'
              ? 'bg-sky-950 text-white border-sky-900 shadow-xs'
              : 'bg-white hover:bg-sky-50/40 text-stone-800 border-stone-200'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
              <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">PulseTech</p>
              <p className={`text-[10px] sm:text-[11px] truncate ${selectedVertical === 'PulseTech' ? 'text-sky-300' : 'text-stone-500'}`}>
                Scale &amp; Tech
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-1.5 sm:px-2 py-0.5 bg-sky-100 text-sky-900 rounded-md shrink-0">
            {metrics.byVertical['PulseTech'] || 0}
          </span>
        </button>
      </div>

      {/* Channel and Monthly Distribution Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-stone-100 rounded-xl border border-stone-200/70 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-stone-500 font-medium">Channel Split:</span>
          <span className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg font-medium text-stone-800 flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Facebook: <strong className="font-semibold">{metrics.byChannel['Facebook'] || 0}</strong>
          </span>
          <span className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg font-medium text-stone-800 flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-sky-700"></span>
            LinkedIn: <strong className="font-semibold">{metrics.byChannel['LinkedIn'] || 0}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-stone-500 font-medium mr-1">Months:</span>
          {Object.entries(metrics.byMonth).map(([month, count]) => (
            <span
              key={month}
              className="px-2 py-0.5 bg-white border border-stone-200/80 rounded font-medium text-stone-700"
            >
              {month}: {count}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
