import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  FileText,
  Calendar,
  Layers,
  BarChart3,
  Palette,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { CampaignKPIStats } from './CampaignKPIStats';
import { PosterBannerStudio } from './PosterBannerStudio';
import { CreativeEventsShowcase } from './CreativeEventsShowcase';
import { CampaignExecutiveReport } from './CampaignExecutiveReport';
import { PostDataExplorer } from './PostDataExplorer';
import {
  getAllCampaignPosts,
  computeCampaignMetrics,
} from '../../utils/campaignAnalytics';

type CampaignSubTab = 'poster-studio' | 'executive-report' | 'creative-events' | 'post-explorer';

export const CampaignDashboardView: React.FC = () => {
  const [subTab, setSubTab] = useState<CampaignSubTab>('poster-studio');
  const [selectedVertical, setSelectedVertical] = useState<string>('All');

  // Load and memoize all posts from JSON
  const allPosts = useMemo(() => {
    return getAllCampaignPosts();
  }, []);

  // Compute aggregated stats
  const metrics = useMemo(() => {
    return computeCampaignMetrics(allPosts);
  }, [allPosts]);

  return (
    <div className="space-y-6">
      {/* High-Level KPI Header & Quick Vertical Switcher */}
      <CampaignKPIStats
        metrics={metrics}
        selectedVertical={selectedVertical}
        onSelectVertical={setSelectedVertical}
      />

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-stone-200/90 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full scrollbar-none">
          <button
            type="button"
            onClick={() => setSubTab('poster-studio')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              subTab === 'poster-studio'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-emerald-400" />
            <span>Poster AI Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('executive-report')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              subTab === 'executive-report'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
            <span>Executive Report</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('creative-events')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              subTab === 'creative-events'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Creative Events</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('post-explorer')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              subTab === 'post-explorer'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Campaign Data ({allPosts.length})</span>
          </button>
        </div>

        <div className="text-[11px] text-stone-500 font-medium hidden md:block shrink-0">
          Dataset: <strong>socialCampaignData.json</strong>
        </div>
      </div>

      {/* Sub-Tab View Rendering */}
      {subTab === 'poster-studio' && (
        <PosterBannerStudio initialVertical={selectedVertical === 'All' ? 'ONE Pharmacy' : selectedVertical} />
      )}

      {subTab === 'executive-report' && (
        <CampaignExecutiveReport selectedVertical={selectedVertical} />
      )}

      {subTab === 'creative-events' && (
        <CreativeEventsShowcase initialVertical={selectedVertical} />
      )}

      {subTab === 'post-explorer' && (
        <PostDataExplorer
          posts={allPosts}
          selectedVertical={selectedVertical}
          onSelectVertical={setSelectedVertical}
        />
      )}
    </div>
  );
};
