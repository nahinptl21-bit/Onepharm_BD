import { useState } from 'react';
import { Eye, CheckCircle2, AlertCircle, FileSearch, Layers } from 'lucide-react';
import { ComparisonResult, DiffGranularity } from '../types';

interface DiffViewerProps {
  result: ComparisonResult;
  viewMode: 'split' | 'unified';
  granularity: DiffGranularity;
  infoA: string;
  infoB: string;
}

export function DiffViewer({ result, viewMode, granularity, infoA, infoB }: DiffViewerProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'lines'>('visual');

  if (!infoA && !infoB) {
    return null;
  }

  const { isExactMatch, wordDiffs, charDiffs, lineDiffs } = result;
  const activeDiffs = granularity === 'char' ? charDiffs : wordDiffs;

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
      {/* Top Diff Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-stone-50 border-b border-stone-200 gap-2">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-stone-600" />
          <h2 className="text-sm font-semibold text-stone-900 tracking-tight">
            Visual Difference Inspector
          </h2>
          {isExactMatch ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              100% Match
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
              <AlertCircle className="w-3 h-3" />
              Differences Highlighted
            </span>
          )}
        </div>

        {/* Legend & Sub-tabs */}
        <div className="flex items-center gap-4 text-xs">
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3 text-stone-600 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-200 border border-rose-400 inline-block" />
              <span>Info 1 only (Removed/Different)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-200 border border-emerald-400 inline-block" />
              <span>Info 2 only (Added/Different)</span>
            </span>
          </div>

          {/* Line vs Visual tabs */}
          <div className="flex items-center bg-stone-200/70 p-0.5 rounded-lg text-xs">
            <button
              id="diff-tab-visual"
              onClick={() => setActiveTab('visual')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'visual'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileSearch className="w-3 h-3" />
              <span>Inline/Split</span>
            </button>
            <button
              id="diff-tab-lines"
              onClick={() => setActiveTab('lines')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'lines'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Line Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Diff Content Container */}
      <div className="p-4 overflow-x-auto">
        {activeTab === 'lines' ? (
          /* Line by Line comparison grid */
          <div className="border border-stone-200 rounded-lg overflow-hidden text-xs font-mono">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-stone-100/90 text-stone-600 border-b border-stone-200 text-left">
                  <th className="py-2 px-3 w-14 font-semibold text-center border-r border-stone-200">#1</th>
                  <th className="py-2 px-3 w-14 font-semibold text-center border-r border-stone-200">#2</th>
                  <th className="py-2 px-2 w-8 font-semibold text-center border-r border-stone-200">Stat</th>
                  <th className="py-2 px-3 font-semibold">Content Comparison</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {lineDiffs.map((item, idx) => {
                  let rowBg = 'hover:bg-stone-50';
                  let statusBadge = <span className="text-stone-400">=</span>;

                  if (item.type === 'same') {
                    statusBadge = <span className="text-stone-400 font-bold">=</span>;
                  } else if (item.type === 'modified') {
                    rowBg = 'bg-amber-50/40 hover:bg-amber-50';
                    statusBadge = <span className="text-amber-600 font-bold">~</span>;
                  } else if (item.type === 'removed') {
                    rowBg = 'bg-rose-50/50 hover:bg-rose-50';
                    statusBadge = <span className="text-rose-600 font-bold">-</span>;
                  } else if (item.type === 'added') {
                    rowBg = 'bg-emerald-50/50 hover:bg-emerald-50';
                    statusBadge = <span className="text-emerald-600 font-bold">+</span>;
                  }

                  return (
                    <tr key={idx} className={rowBg}>
                      <td className="py-1.5 px-3 text-stone-400 text-center border-r border-stone-200 select-none">
                        {item.lineNumberA ?? ''}
                      </td>
                      <td className="py-1.5 px-3 text-stone-400 text-center border-r border-stone-200 select-none">
                        {item.lineNumberB ?? ''}
                      </td>
                      <td className="py-1.5 px-2 text-center border-r border-stone-200 select-none">
                        {statusBadge}
                      </td>
                      <td className="py-1.5 px-3 whitespace-pre-wrap break-all leading-relaxed">
                        {item.type === 'modified' ? (
                          <div className="space-y-1">
                            <div className="text-rose-800 bg-rose-100/50 px-1.5 py-0.5 rounded-xs">
                              <span className="text-rose-400 mr-1.5">-</span>
                              {item.charDiffs?.a.map((p, pIdx) => (
                                <span
                                  key={pIdx}
                                  className={p.type === 'removed' ? 'bg-rose-300 text-rose-950 font-bold px-0.5 rounded-xs' : ''}
                                >
                                  {p.value}
                                </span>
                              ))}
                            </div>
                            <div className="text-emerald-800 bg-emerald-100/50 px-1.5 py-0.5 rounded-xs">
                              <span className="text-emerald-400 mr-1.5">+</span>
                              {item.charDiffs?.b.map((p, pIdx) => (
                                <span
                                  key={pIdx}
                                  className={p.type === 'added' ? 'bg-emerald-300 text-emerald-950 font-bold px-0.5 rounded-xs' : ''}
                                >
                                  {p.value}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : item.type === 'removed' ? (
                          <span className="text-rose-800 bg-rose-100/60 px-1 py-0.5 rounded-xs">
                            {item.contentA}
                          </span>
                        ) : item.type === 'added' ? (
                          <span className="text-emerald-800 bg-emerald-100/60 px-1 py-0.5 rounded-xs">
                            {item.contentB}
                          </span>
                        ) : (
                          <span className="text-stone-700">{item.contentA}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : viewMode === 'split' ? (
          /* Side by Side Split View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Box: Info 1 with deletions marked */}
            <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50 font-mono text-xs leading-relaxed max-h-96 overflow-y-auto">
              <div className="text-stone-400 text-[11px] font-sans font-medium mb-2 pb-1 border-b border-stone-200">
                Information 1 (Source)
              </div>
              <div className="whitespace-pre-wrap break-all">
                {activeDiffs
                  .filter((p) => p.type !== 'added')
                  .map((part, index) => {
                    if (part.type === 'removed') {
                      return (
                        <mark
                          key={index}
                          className="bg-rose-200 text-rose-950 font-semibold px-0.5 rounded-xs mx-0.5"
                          title="Present in Info 1, missing/altered in Info 2"
                        >
                          {part.value}
                        </mark>
                      );
                    }
                    return <span key={index} className="text-stone-800">{part.value}</span>;
                  })}
              </div>
            </div>

            {/* Right Box: Info 2 with additions marked */}
            <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50/50 font-mono text-xs leading-relaxed max-h-96 overflow-y-auto">
              <div className="text-stone-400 text-[11px] font-sans font-medium mb-2 pb-1 border-b border-stone-200">
                Information 2 (Comparison)
              </div>
              <div className="whitespace-pre-wrap break-all">
                {activeDiffs
                  .filter((p) => p.type !== 'removed')
                  .map((part, index) => {
                    if (part.type === 'added') {
                      return (
                        <mark
                          key={index}
                          className="bg-emerald-200 text-emerald-950 font-semibold px-0.5 rounded-xs mx-0.5"
                          title="Present in Info 2, missing/altered in Info 1"
                        >
                          {part.value}
                        </mark>
                      );
                    }
                    return <span key={index} className="text-stone-800">{part.value}</span>;
                  })}
              </div>
            </div>
          </div>
        ) : (
          /* Unified Inline View */
          <div className="border border-stone-200 rounded-lg p-4 bg-stone-50/60 font-mono text-xs sm:text-sm leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap break-all">
            {activeDiffs.map((part, index) => {
              if (part.type === 'same') {
                return (
                  <span key={index} className="text-stone-800">
                    {part.value}
                  </span>
                );
              }
              if (part.type === 'removed') {
                return (
                  <mark
                    key={index}
                    className="bg-rose-200/90 text-rose-950 line-through decoration-rose-600 px-1 py-0.5 rounded-xs mx-0.5"
                    title="Removed / only in Info 1"
                  >
                    {part.value}
                  </mark>
                );
              }
              if (part.type === 'added') {
                return (
                  <mark
                    key={index}
                    className="bg-emerald-200/90 text-emerald-950 font-semibold underline decoration-emerald-600 px-1 py-0.5 rounded-xs mx-0.5"
                    title="Added / only in Info 2"
                  >
                    {part.value}
                  </mark>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
