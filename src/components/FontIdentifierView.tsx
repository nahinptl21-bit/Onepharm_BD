import { useState } from 'react';
import { FontUploader } from './FontUploader';
import { FontResultCard } from './FontResultCard';
import { FONT_SAMPLES, FontSamplePreset } from '../data/fontSamples';
import { FontMatchData } from '../types';
import { AlertCircle } from 'lucide-react';

export function FontIdentifierView() {
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(FONT_SAMPLES[0].previewUrl);
  const [activePresetId, setActivePresetId] = useState<string | undefined>(FONT_SAMPLES[0].id);
  const [fontResult, setFontResult] = useState<FontMatchData | null>(FONT_SAMPLES[0].mockData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);
  const [lastImageData, setLastImageData] = useState<{ base64: string; mimeType: string } | null>(null);

  const handleSelectPreset = (preset: FontSamplePreset) => {
    setActivePresetId(preset.id);
    setScreenshotPreview(preset.previewUrl);
    setFontResult(preset.mockData);
    setErrorMsg(null);
    setNoticeMsg(null);
    setLastImageData(null);
  };

  const handleClearImage = () => {
    setScreenshotPreview(null);
    setActivePresetId(undefined);
    setFontResult(null);
    setErrorMsg(null);
    setNoticeMsg(null);
    setLastImageData(null);
  };

  const handleAnalyze = async (base64: string, mimeType: string, presetMock?: FontMatchData) => {
    setActivePresetId(undefined);
    setScreenshotPreview(base64);
    setLastImageData({ base64, mimeType });
    setIsLoading(true);
    setErrorMsg(null);
    setNoticeMsg(null);

    // If preset mock was provided directly
    if (presetMock) {
      setFontResult(presetMock);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/identify-font', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: mimeType || 'image/png',
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to identify font from this image.');
      }

      if (json.isFallbackNotice && json.notice) {
        setNoticeMsg(json.notice);
      }

      setFontResult(json.data);
    } catch (err: any) {
      console.error('Font identification error:', err);
      let friendlyError = 'Unable to identify font from screenshot. Please try again.';
      const raw = err.message || '';
      if (raw.includes('503') || raw.includes('high demand') || raw.includes('UNAVAILABLE')) {
        friendlyError = 'The AI model is currently experiencing temporary high demand. Please click "Retry Analysis" in a few moments.';
      } else {
        try {
          const parsed = JSON.parse(raw);
          friendlyError = parsed.error?.message || parsed.message || raw;
        } catch {
          friendlyError = raw;
        }
      }

      setErrorMsg(friendlyError);
      // If no result yet, keep current or fallback
      if (!fontResult) {
        setFontResult(FONT_SAMPLES[1].mockData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastImageData) {
      handleAnalyze(lastImageData.base64, lastImageData.mimeType);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload and Screenshot Selection */}
      <FontUploader
        onAnalyze={handleAnalyze}
        isLoading={isLoading}
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        currentImagePreview={screenshotPreview}
        onClearImage={handleClearImage}
      />

      {/* Notice / Info banner */}
      {noticeMsg && (
        <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 text-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Typography Analysis Notice</p>
              <p className="mt-0.5 leading-relaxed">{noticeMsg}</p>
            </div>
          </div>
          {lastImageData && (
            <button
              onClick={handleRetry}
              disabled={isLoading}
              className="px-3 py-1.5 bg-sky-900 text-white rounded-lg font-semibold shrink-0 hover:bg-sky-800 transition-colors shadow-2xs text-xs"
            >
              Retry Live AI
            </button>
          )}
        </div>
      )}

      {/* Error notification banner with Retry button */}
      {errorMsg && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">AI Service Notice</p>
              <p className="mt-0.5 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
          {lastImageData && (
            <button
              onClick={handleRetry}
              disabled={isLoading}
              className="px-3 py-1.5 bg-amber-900 text-white rounded-lg font-semibold shrink-0 hover:bg-amber-800 transition-colors shadow-2xs text-xs"
            >
              {isLoading ? 'Retrying...' : 'Retry Analysis'}
            </button>
          )}
        </div>
      )}

      {/* Results and Live Font Tester */}
      {fontResult && (
        <FontResultCard
          data={fontResult}
          screenshotPreview={screenshotPreview}
        />
      )}
    </div>
  );
}
