import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ExternalLink,
  Eye,
  TrendingUp,
  BarChart3,
  Calendar,
  Share2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Building2,
  Cpu
} from 'lucide-react';
import { CampaignPost } from '../../types';

interface PostDataExplorerProps {
  posts: CampaignPost[];
  selectedVertical: string;
  onSelectVertical: (vertical: string) => void;
}

export const PostDataExplorer: React.FC<PostDataExplorerProps> = ({
  posts,
  selectedVertical,
  onSelectVertical,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [selectedChannel, setSelectedChannel] = useState<string>('All');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Available months
  const months = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.Month) set.add(p.Month);
    });
    return Array.from(set);
  }, [posts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchVertical = selectedVertical === 'All' || p.Vertical === selectedVertical;
      const matchMonth = selectedMonth === 'All' || p.Month === selectedMonth;
      const matchChannel = selectedChannel === 'All' || p.Channel === selectedChannel;

      if (!matchVertical || !matchMonth || !matchChannel) return false;

      if (searchTerm.trim().length === 0) return true;

      const q = searchTerm.toLowerCase();
      const caption = (p.Caption || '').toLowerCase();
      const date = (p.Date || '').toLowerCase();
      const vertical = (p.Vertical || '').toLowerCase();

      return caption.includes(q) || date.includes(q) || vertical.includes(q);
    });
  }, [posts, selectedVertical, selectedMonth, selectedChannel, searchTerm]);

  const handleCopyCaption = (caption: string | null, index: number) => {
    if (!caption) return;
    navigator.clipboard.writeText(caption);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search posts by keywords, location (Mirpur, Basabo, etc.), ACME, finance..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <div className="flex items-center gap-2 text-xs flex-wrap">
            {/* Month Filter */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-medium focus:bg-white focus:outline-hidden"
            >
              <option value="All">All Months</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  Month: {m}
                </option>
              ))}
            </select>

            {/* Channel Filter */}
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-medium focus:bg-white focus:outline-hidden"
            >
              <option value="All">All Channels</option>
              <option value="Facebook">Facebook</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100">
          <span>
            Showing <strong>{filteredPosts.length}</strong> of {posts.length} campaigns
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-stone-700 hover:text-stone-900 font-semibold"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-stone-200/80 text-stone-500 text-xs">
            No campaigns matched your current filters. Try relaxing the search or selecting 'All'.
          </div>
        ) : (
          filteredPosts.map((post, idx) => {
            const isExpanded = expandedIndex === idx;
            const isOne = post.Vertical === 'ONE Pharmacy';
            const isMed = post.Vertical === 'MedBox';

            const brandStyle = isOne
              ? {
                  badge: 'bg-emerald-100 text-emerald-800',
                  icon: <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />,
                }
              : isMed
              ? {
                  badge: 'bg-orange-100 text-orange-800',
                  icon: <Building2 className="w-3.5 h-3.5 text-orange-700" />,
                }
              : {
                  badge: 'bg-sky-100 text-sky-800',
                  icon: <Cpu className="w-3.5 h-3.5 text-sky-700" />,
                };

            return (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-2xs hover:border-stone-300 transition-all space-y-3"
              >
                {/* Post Card Top Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] flex items-center gap-1.5 ${brandStyle.badge}`}
                    >
                      {brandStyle.icon}
                      {post.Vertical}
                    </span>

                    <span className="px-2 py-0.5 bg-stone-100 text-stone-700 font-medium rounded text-[11px] flex items-center gap-1">
                      <Share2 className="w-3 h-3 text-stone-500" />
                      {post.Channel}
                    </span>

                    {post.Month && (
                      <span className="px-2 py-0.5 bg-stone-50 border border-stone-200/80 text-stone-600 rounded text-[11px]">
                        {post.Month}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-stone-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.Date || 'No date'} {post.Day ? `(${post.Day})` : ''}
                    </span>

                    {post.Character && post.Character > 0 && (
                      <span>{post.Character} chars</span>
                    )}
                  </div>
                </div>

                {/* Caption Body */}
                <div className="text-xs text-stone-800 leading-relaxed font-sans">
                  {post.Caption ? (
                    <p className={`whitespace-pre-line ${isExpanded ? '' : 'line-clamp-3'}`}>
                      {post.Caption}
                    </p>
                  ) : (
                    <p className="text-stone-400 italic">No caption text available for this asset.</p>
                  )}
                </div>

                {/* Metrics & Actions Row */}
                <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  {/* Performance Indicators */}
                  <div className="flex items-center gap-3 text-[11px] text-stone-600">
                    {post.Views !== null && (
                      <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <Eye className="w-3 h-3 text-emerald-600" />
                        {post.Views.toLocaleString()} Views
                      </span>
                    )}

                    {post.Reach !== null && (
                      <span className="flex items-center gap-1 font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                        <TrendingUp className="w-3 h-3 text-sky-600" />
                        {post.Reach.toLocaleString()} Reach
                      </span>
                    )}

                    {post.Impression !== null && (
                      <span className="flex items-center gap-1 text-stone-600">
                        <BarChart3 className="w-3 h-3 text-stone-400" />
                        {post.Impression.toLocaleString()} Imp.
                      </span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2">
                    {post.Caption && (
                      <button
                        onClick={() => handleCopyCaption(post.Caption, idx)}
                        className="px-2 py-1 bg-stone-50 hover:bg-stone-100 text-stone-700 rounded-md font-medium text-[11px] flex items-center gap-1 border border-stone-200"
                        title="Copy caption text"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}

                    {post.PostLink && (
                      <a
                        href={post.PostLink}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="px-2 py-1 bg-stone-50 hover:bg-stone-100 text-blue-600 rounded-md font-medium text-[11px] flex items-center gap-1 border border-stone-200"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Live Post</span>
                      </a>
                    )}

                    {post.Caption && post.Caption.length > 150 && (
                      <button
                        onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                        className="px-2 py-1 text-stone-500 hover:text-stone-800 text-[11px] font-medium flex items-center gap-0.5"
                      >
                        <span>{isExpanded ? 'Show Less' : 'Show Full'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
