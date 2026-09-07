import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ComparisonOptionsBar } from './components/ComparisonOptionsBar';
import { InputPanel } from './components/InputPanel';
import { MatchVerdictBanner } from './components/MatchVerdictBanner';
import { DiffViewer } from './components/DiffViewer';
import { FontIdentifierView } from './components/FontIdentifierView';
import { CampaignDashboardView } from './components/campaign/CampaignDashboardView';
import { ComparisonOptions, ActiveAppTab } from './types';
import { compareContent } from './utils/comparator';
import { SAMPLE_PRESETS, SamplePreset } from './data/samplePresets';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveAppTab>('content-matcher');
  const [infoA, setInfoA] = useState<string>(SAMPLE_PRESETS[0].infoA);
  const [infoB, setInfoB] = useState<string>(SAMPLE_PRESETS[0].infoB);

  const [options, setOptions] = useState<ComparisonOptions>({
    caseSensitive: true,
    ignoreWhitespace: false,
    ignoreLineBreaks: false,
    ignorePunctuation: false,
    autoDetectJson: true,
    diffGranularity: 'word',
    viewMode: 'split',
  });

  // Calculate comparison result reactively
  const comparisonResult = useMemo(() => {
    return compareContent(infoA, infoB, options);
  }, [infoA, infoB, options]);

  const handleSelectSample = (sample: SamplePreset) => {
    setInfoA(sample.infoA);
    setInfoB(sample.infoB);
  };

  const handleClearAll = () => {
    setInfoA('');
    setInfoB('');
  };

  const handleSwap = () => {
    setInfoA(infoB);
    setInfoB(infoA);
  };

  const hasInput = infoA.trim().length > 0 || infoB.trim().length > 0;

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans antialiased selection:bg-stone-300">
      {/* Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSelectSample={handleSelectSample}
        onClearAll={handleClearAll}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {activeTab === 'content-matcher' ? (
          <>
            {/* Comparison Options Bar */}
            <ComparisonOptionsBar
              options={options}
              onChangeOptions={setOptions}
            />

            {/* Input Panels (Side-by-side or stacked) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InputPanel
                id="input-info-a"
                title="Information 1"
                subtitle="Original / Baseline"
                badge="Source A"
                value={infoA}
                onChange={setInfoA}
                onClear={() => setInfoA('')}
                charCount={comparisonResult.charCountA}
                wordCount={comparisonResult.wordCountA}
                lineCount={comparisonResult.lineCountA}
                placeholder="Paste or enter the first piece of information..."
                accentColor="stone"
              />

              <InputPanel
                id="input-info-b"
                title="Information 2"
                subtitle="Comparison Target"
                badge="Source B"
                value={infoB}
                onChange={setInfoB}
                onClear={() => setInfoB('')}
                charCount={comparisonResult.charCountB}
                wordCount={comparisonResult.wordCountB}
                lineCount={comparisonResult.lineCountB}
                placeholder="Paste or enter the second piece of information to compare against..."
                accentColor="sky"
              />
            </div>

            {/* Real-time Match Verdict Banner */}
            <MatchVerdictBanner
              result={comparisonResult}
              onSwap={handleSwap}
              hasInput={hasInput}
            />

            {/* Visual Difference Inspector */}
            {hasInput && (
              <DiffViewer
                result={comparisonResult}
                viewMode={options.viewMode}
                granularity={options.diffGranularity}
                infoA={infoA}
                infoB={infoB}
              />
            )}
          </>
        ) : activeTab === 'font-identifier' ? (
          /* Font Identifier View */
          <FontIdentifierView />
        ) : (
          /* Campaign AI & Dashboard View */
          <CampaignDashboardView />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-stone-200 bg-stone-50 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <p>
            {activeTab === 'content-matcher'
              ? 'Content Match Checker — Fast character, word, line, and semantic JSON comparison.'
              : activeTab === 'font-identifier'
              ? 'Screenshot Font Identifier — AI glyph analysis, font family detection, and Google Font matching.'
              : 'Campaign AI & Brand Studio — AI social media poster/banner copy, creative event planner, and JSON campaign analytics.'}
          </p>
          <div className="flex items-center gap-3">
            <span>ONE Pharmacy • MedBox • PulseTech</span>
            <span>•</span>
            <span>Real-time AI Generation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

