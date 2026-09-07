import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Sliders,
  Type,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { FontMatchData } from '../types';
import { loadGoogleFont, getCleanFontFamily } from '../utils/fontLoader';

interface FontResultCardProps {
  data: FontMatchData;
  screenshotPreview: string | null;
}

export function FontResultCard({ data, screenshotPreview }: FontResultCardProps) {
  const { primaryMatch, typographicFeatures, alternativeFonts, cssSnippet, detectedText } = data;

  // Active font being tested in the interactive live preview
  const [activeFontFamily, setActiveFontFamily] = useState<string>(
    primaryMatch.googleFontFamily || primaryMatch.fontName
  );
  const [activeFontDisplayName, setActiveFontDisplayName] = useState<string>(primaryMatch.fontName);
  const [testText, setTestText] = useState<string>(detectedText || 'Sphinx of black quartz, judge my vow.');
  const [fontSize, setFontSize] = useState<number>(32);
  const [copiedCss, setCopiedCss] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Dynamically load the Google Font whenever activeFontFamily changes
  useEffect(() => {
    if (activeFontFamily) {
      loadGoogleFont(activeFontFamily);
    }
  }, [activeFontFamily]);

  // If new data arrives, reset active font to primary match
  useEffect(() => {
    const family = primaryMatch.googleFontFamily || primaryMatch.fontName;
    setActiveFontFamily(family);
    setActiveFontDisplayName(primaryMatch.fontName);
    if (detectedText) {
      setTestText(detectedText);
    }
  }, [data, primaryMatch, detectedText]);

  const handleCopyCss = async () => {
    const snippet = `font-family: ${getCleanFontFamily(activeFontFamily)};\nfont-weight: ${primaryMatch.weight.match(/\d+/)?.[0] || '700'};`;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedCss(true);
      setTimeout(() => setCopiedCss(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyEmbed = async () => {
    const embedCode = `<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=${activeFontFamily.replace(/\s+/g, '+')}:wght@400;600;700;800&display=swap" rel="stylesheet">`;
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    } catch {
      // Fallback
    }
  };

  const googleFontsUrl = `https://fonts.google.com/specimen/${encodeURIComponent(activeFontFamily.replace(/\+/g, ' '))}`;

  return (
    <div className="space-y-5">
      {/* Primary Match Highlight Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Identified Font Match</span>
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                {primaryMatch.classification}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                {primaryMatch.weight}
              </span>
              {primaryMatch.isGoogleFont && (
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                  Google Fonts Available
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {primaryMatch.fontName}
            </h2>

            {primaryMatch.foundryOrSource && (
              <p className="text-xs text-stone-500 mt-1">
                Designer / Source: <strong className="text-stone-700">{primaryMatch.foundryOrSource}</strong>
              </p>
            )}

            {primaryMatch.description && (
              <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
                {primaryMatch.description}
              </p>
            )}
          </div>

          {/* Confidence Meter Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 min-w-[200px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
              <span>Match Confidence</span>
              <span className="font-bold text-stone-900 text-sm">{primaryMatch.confidence}%</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${primaryMatch.confidence}%` }}
              />
            </div>
            <span className="text-[11px] text-stone-400">
              High-precision typographical feature alignment
            </span>
          </div>
        </div>

        {/* Distinct Typographical Features */}
        {typographicFeatures && typographicFeatures.length > 0 && (
          <div className="pt-4 pb-4 border-b border-stone-200">
            <h3 className="text-xs font-semibold text-stone-900 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Distinctive Glyphs &amp; Typographical Markers:</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {typographicFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-700 bg-stone-50/80 p-2 rounded-lg border border-stone-200/70">
                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions & Code Snippets */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              id="copy-css-btn"
              onClick={handleCopyCss}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {copiedCss ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CSS Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy CSS Rule</span>
                </>
              )}
            </button>

            <button
              id="copy-embed-btn"
              onClick={handleCopyEmbed}
              className="px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 rounded-lg font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {copiedEmbed ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Web Font HTML</span>
                </>
              )}
            </button>
          </div>

          <a
            href={googleFontsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1 hover:underline"
          >
            <span>View &amp; Download on Google Fonts</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Interactive Live Font Preview & Tester */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-emerald-600" />
            <h3 className="text-base font-bold text-stone-900 tracking-tight">
              Interactive Live Font Tester
            </h3>
            <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-700 rounded font-mono font-medium">
              Rendering: {activeFontDisplayName}
            </span>
          </div>

          {/* Font Size Slider */}
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Sliders className="w-3.5 h-3.5" />
            <span>Size: {fontSize}px</span>
            <input
              type="range"
              min="16"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-24 sm:w-32 accent-stone-900 cursor-pointer"
            />
          </div>
        </div>

        {/* Input box to test custom sentence */}
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1">
            Test with Custom Text:
          </label>
          <input
            type="text"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Type anything to test this typeface..."
            className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
        </div>

        {/* Dynamic Render Canvas */}
        <div className="p-6 bg-stone-50/50 rounded-xl border border-stone-200 min-h-[140px] flex items-center justify-center overflow-x-auto text-stone-900 transition-all">
          <p
            style={{
              fontFamily: getCleanFontFamily(activeFontFamily),
              fontSize: `${fontSize}px`,
              fontWeight: primaryMatch.weight.includes('Bold') || primaryMatch.weight.includes('700') || primaryMatch.weight.includes('800') ? '700' : '400',
              lineHeight: 1.3,
            }}
            className="text-center select-all whitespace-pre-wrap break-words w-full"
          >
            {testText || 'Sphinx of black quartz, judge my vow.'}
          </p>
        </div>

        {/* Glyph Alphabet Strip */}
        <div className="p-3 bg-stone-100/70 rounded-lg text-xs font-mono text-stone-600 text-center select-all overflow-x-auto">
          <span
            style={{
              fontFamily: getCleanFontFamily(activeFontFamily),
              fontSize: '16px',
            }}
            className="tracking-wider block"
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789 &amp;@#$?!%
          </span>
        </div>
      </div>

      {/* Alternative Matches & Similar Free Fonts */}
      {alternativeFonts && alternativeFonts.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-stone-600" />
            <h3 className="text-base font-bold text-stone-900 tracking-tight">
              Alternative Matches &amp; Free Google Fonts Equivalents
            </h3>
          </div>
          <p className="text-xs text-stone-500">
            Click any alternative font to immediately load and test it in the interactive preview canvas above.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {alternativeFonts.map((alt, idx) => {
              const isCurrentlyActive = activeFontDisplayName === alt.fontName;
              return (
                <button
                  key={idx}
                  id={`alt-font-${idx}`}
                  type="button"
                  onClick={() => {
                    setActiveFontFamily(alt.googleFontFamily || alt.fontName);
                    setActiveFontDisplayName(alt.fontName);
                  }}
                  className={`text-left p-3.5 rounded-xl border transition-all relative ${
                    isCurrentlyActive
                      ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/20'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-sm font-bold text-stone-900">
                      {alt.fontName}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      {alt.similarityScore}% Match
                    </span>
                  </div>

                  {alt.classification && (
                    <div className="text-[11px] text-stone-500 font-medium mb-2">
                      {alt.classification}
                    </div>
                  )}

                  <p className="text-xs text-stone-600 leading-relaxed mb-3">
                    {alt.reason}
                  </p>

                  <div className="text-[11px] text-stone-500 font-mono bg-white p-1.5 rounded border border-stone-200/70 truncate">
                    Click to test live &rarr;
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
