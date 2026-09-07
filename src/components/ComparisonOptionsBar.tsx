import { Settings2, Split, Columns2, CaseSensitive, Space, WrapText, Brackets, Check } from 'lucide-react';
import { ComparisonOptions, DiffGranularity } from '../types';

interface ComparisonOptionsBarProps {
  options: ComparisonOptions;
  onChangeOptions: (newOptions: ComparisonOptions) => void;
}

export function ComparisonOptionsBar({ options, onChangeOptions }: ComparisonOptionsBarProps) {
  const toggleOption = (key: keyof ComparisonOptions) => {
    onChangeOptions({
      ...options,
      [key]: !options[key],
    });
  };

  const setGranularity = (granularity: DiffGranularity) => {
    onChangeOptions({
      ...options,
      diffGranularity: granularity,
    });
  };

  const setViewMode = (mode: 'split' | 'unified') => {
    onChangeOptions({
      ...options,
      viewMode: mode,
    });
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-3 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Comparison Matching Rules */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-stone-400 font-medium flex items-center gap-1 mr-1">
            <Settings2 className="w-3.5 h-3.5" />
            Matching Rules:
          </span>

          {/* Case sensitive */}
          <button
            id="opt-case-sensitive"
            onClick={() => toggleOption('caseSensitive')}
            className={`px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
              options.caseSensitive
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
            title="Match letter casing exactly (A vs a)"
          >
            <CaseSensitive className="w-3.5 h-3.5" />
            <span>Case Sensitive</span>
            {options.caseSensitive && <Check className="w-3 h-3 text-emerald-400 ml-0.5" />}
          </button>

          {/* Ignore whitespace */}
          <button
            id="opt-ignore-whitespace"
            onClick={() => toggleOption('ignoreWhitespace')}
            className={`px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
              options.ignoreWhitespace
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
            title="Ignore extra spaces, tabs, and trailing whitespace"
          >
            <Space className="w-3.5 h-3.5" />
            <span>Trim Whitespace</span>
            {options.ignoreWhitespace && <Check className="w-3 h-3 text-emerald-400 ml-0.5" />}
          </button>

          {/* Ignore line breaks */}
          <button
            id="opt-ignore-line-breaks"
            onClick={() => toggleOption('ignoreLineBreaks')}
            className={`px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
              options.ignoreLineBreaks
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
            title="Treat newlines as standard spaces"
          >
            <WrapText className="w-3.5 h-3.5" />
            <span>Ignore Line Breaks</span>
            {options.ignoreLineBreaks && <Check className="w-3 h-3 text-emerald-400 ml-0.5" />}
          </button>

          {/* Auto detect JSON */}
          <button
            id="opt-auto-json"
            onClick={() => toggleOption('autoDetectJson')}
            className={`px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
              options.autoDetectJson
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
            title="Check if JSON data matches semantically regardless of key ordering or spacing"
          >
            <Brackets className="w-3.5 h-3.5" />
            <span>JSON Semantic Match</span>
            {options.autoDetectJson && <Check className="w-3 h-3 text-emerald-400 ml-0.5" />}
          </button>
        </div>

        {/* Diff Granularity & View Mode */}
        <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg">
            <button
              id="granularity-word"
              onClick={() => setGranularity('word')}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                options.diffGranularity === 'word'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Words
            </button>
            <button
              id="granularity-char"
              onClick={() => setGranularity('char')}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                options.diffGranularity === 'char'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Chars
            </button>
            <button
              id="granularity-line"
              onClick={() => setGranularity('line')}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                options.diffGranularity === 'line'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Lines
            </button>
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg">
            <button
              id="view-mode-split"
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                options.viewMode === 'split'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Side-by-side view"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
            <button
              id="view-mode-unified"
              onClick={() => setViewMode('unified')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                options.viewMode === 'unified'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Combined inline view"
            >
              <Split className="w-3.5 h-3.5" />
              <span>Unified</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
