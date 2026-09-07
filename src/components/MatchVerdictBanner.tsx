import { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ArrowLeftRight, Copy, Check, Info, ShieldCheck } from 'lucide-react';
import { ComparisonResult } from '../types';

interface MatchVerdictBannerProps {
  result: ComparisonResult;
  onSwap: () => void;
  hasInput: boolean;
}

export function MatchVerdictBanner({ result, onSwap, hasInput }: MatchVerdictBannerProps) {
  const [copiedReport, setCopiedReport] = useState(false);

  if (!hasInput) {
    return (
      <div className="bg-stone-50 border border-dashed border-stone-300 rounded-xl p-4 text-center">
        <p className="text-sm font-medium text-stone-600">
          Enter or paste information into both panels above to check if the content matches.
        </p>
      </div>
    );
  }

  const {
    verdict,
    verdictTitle,
    verdictDescription,
    similarityScore,
    isExactMatch,
    isNormalizedMatch,
    charCountA,
    charCountB,
    wordCountA,
    wordCountB,
    levenshteinDistance,
    mismatchSummary,
  } = result;

  // Determine styling theme based on verdict
  let bannerBg = 'bg-rose-50 border-rose-200 text-rose-900';
  let badgeBg = 'bg-rose-100 text-rose-800 border-rose-300';
  let icon = <XCircle className="w-6 h-6 text-rose-600 shrink-0" />;
  let progressBarBg = 'bg-rose-500';

  if (isExactMatch) {
    bannerBg = 'bg-emerald-50/90 border-emerald-200 text-emerald-950';
    badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    icon = <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />;
    progressBarBg = 'bg-emerald-500';
  } else if (isNormalizedMatch || (result.isJson && result.jsonEqual)) {
    bannerBg = 'bg-emerald-50/70 border-emerald-200 text-emerald-900';
    badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    icon = <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />;
    progressBarBg = 'bg-emerald-500';
  } else if (verdict === 'HIGH_SIMILARITY') {
    bannerBg = 'bg-amber-50/90 border-amber-200 text-amber-950';
    badgeBg = 'bg-amber-100 text-amber-800 border-amber-300';
    icon = <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />;
    progressBarBg = 'bg-amber-500';
  }

  const handleCopyReport = async () => {
    const reportText = [
      `CONTENT MATCH VERDICT: ${isExactMatch ? 'MATCHED (100% IDENTICAL)' : isNormalizedMatch ? 'MATCHED (NORMALIZED)' : 'MISMATCHED'}`,
      `Similarity Score: ${similarityScore}%`,
      `Levenshtein Edit Distance: ${levenshteinDistance}`,
      `Information 1: ${charCountA} chars, ${wordCountA} words`,
      `Information 2: ${charCountB} chars, ${wordCountB} words`,
      `Differences:`,
      ...mismatchSummary.map((item) => ` - ${item}`),
    ].join('\n');

    try {
      await navigator.clipboard.writeText(reportText);
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2000);
    } catch {
      // Ignore fallback
    }
  };

  return (
    <div className={`border rounded-xl p-4 sm:p-5 transition-all shadow-xs ${bannerBg}`}>
      {/* Top row: Verdict Icon, Title, and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="mt-0.5 sm:mt-0">{icon}</div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-md border ${badgeBg}`}>
                {isExactMatch ? 'Content Matched' : isNormalizedMatch ? 'Tolerant Match' : 'Content Mismatched'}
              </span>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                {verdictTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {verdictDescription}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full sm:w-auto grid grid-cols-2 sm:flex items-center gap-2">
          <button
            type="button"
            id="swap-inputs-btn"
            onClick={onSwap}
            className="px-3 py-2 sm:py-1.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer min-h-[40px] sm:min-h-0"
            title="Swap Information 1 and Information 2"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Swap Inputs</span>
          </button>

          <button
            type="button"
            id="copy-report-btn"
            onClick={handleCopyReport}
            className="px-3 py-2 sm:py-1.5 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer min-h-[40px] sm:min-h-0"
            title="Copy comparison summary to clipboard"
          >
            {copiedReport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Similarity Progress Bar & Numeric Stats */}
      <div className="mt-4 pt-3.5 border-t border-stone-200/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 text-xs">
          <div className="flex items-center gap-2 font-medium text-stone-700">
            <span>Similarity Metric:</span>
            <span className="text-sm font-bold text-stone-900">{similarityScore}%</span>
          </div>
          <div className="flex items-center gap-3 text-stone-600 text-xs">
            <span>
              Length diff: <strong>{Math.abs(charCountA - charCountB)}</strong> chars
            </span>
            <span className="text-stone-300">•</span>
            <span>
              Word diff: <strong>{Math.abs(wordCountA - wordCountB)}</strong> words
            </span>
            <span className="text-stone-300">•</span>
            <span>
              Edit Distance: <strong>{levenshteinDistance}</strong>
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-stone-200/80 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${progressBarBg}`}
            style={{ width: `${similarityScore}%` }}
          />
        </div>
      </div>

      {/* Discrepancy Breakdown */}
      {mismatchSummary.length > 0 && (
        <div className="mt-3.5 pt-3 border-t border-stone-200/60 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-stone-800 mb-1.5">
            <Info className="w-3.5 h-3.5 text-stone-500" />
            <span>Inspection Breakdown:</span>
          </div>
          <ul className="space-y-1 text-stone-700">
            {mismatchSummary.map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-stone-400 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
