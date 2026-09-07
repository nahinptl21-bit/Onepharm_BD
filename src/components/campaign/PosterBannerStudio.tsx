import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  Share2,
  RefreshCw,
  Image as ImageIcon,
  Palette,
  Eye,
  ShoppingBag,
  Building2,
  Cpu,
  Layers
} from 'lucide-react';
import { GeneratedPosterContent } from '../../types';

interface PosterBannerStudioProps {
  initialVertical?: string;
}

const PRESET_TOPICS = [
  'Retail Franchise Modernization & Growth',
  '100% Genuine Medicine & Direct Sourcing',
  'Working Capital & Embedded Finance for Pharmacies',
  'B2B Mega Orders, Cashback & Free Gifts',
  'Monsoon & Flood Resilient Delivery Heroes',
  'Strategic Pharma Partnerships (ACME & SMC)',
  'US$150M Revenue Milestone & Startup Bangladesh Exit',
  'Seasonal Health Awareness & First Aid Readiness',
];

export const PosterBannerStudio: React.FC<PosterBannerStudioProps> = ({
  initialVertical = 'ONE Pharmacy',
}) => {
  const [vertical, setVertical] = useState<'ONE Pharmacy' | 'MedBox' | 'PulseTech'>(
    (initialVertical as any) || 'ONE Pharmacy'
  );
  const [format, setFormat] = useState<string>('Facebook Poster / Feed Post');
  const [topic, setTopic] = useState<string>(PRESET_TOPICS[0]);
  const [goal, setGoal] = useState<string>('Franchise Onboarding & Lead Generation');
  const [language, setLanguage] = useState<string>('Bangla & English');
  const [tone, setTone] = useState<string>('Inspiring, Trustworthy & Action-Oriented');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Default initial content
  const [generatedContent, setGeneratedContent] = useState<GeneratedPosterContent>({
    headline: 'আপনার ফার্মেসিকে দিন আধুনিক রূপ ও দ্বিগুণ বিক্রির নিশ্চয়তা!',
    subheadline: '১০০% খাঁটি ওষুধের টেকসই সাপ্লাই এবং সহজ ফাইন্যান্সিং সুবিধা নিয়ে যুক্ত হন ONE Pharmacy নেটওয়ার্কে।',
    primaryCaption: `চারদিকের বড় চেইন শপের ভিড়ে আপনার পরিচিত ফার্মেসি কি পিছিয়ে পড়ছে?

চিন্তার দিন শেষ! ONE Pharmacy-এর কো-ব্র্যান্ডেড ফ্র্যাঞ্চাইজি নেটওয়ার্কে যুক্ত হয়ে আপনার সাধারণ ফার্মেসিকেই রূপান্তর করুন এলাকার সেরা আধুনিক মডেল স্টোরে।

আমাদের সাথে যুক্ত হলে আপনি পাচ্ছেন:
✅ ১০০% অরিজিনাল ওষুধের নিশ্চয়তা
✅ সহজ এমবেডেড ফাইন্যান্সিং ও ক্রেডিট সাপোর্ট
✅ আধুনিক ইন্টেরিয়র ও ব্র্যান্ডিং সাপোর্ট
✅ ফ্রি ডিজিটাল ইনভেন্টরি ও সেলস সফটওয়্যার

আর একা লড়াই নয়, আজই যুক্ত হোন আমাদের দেশসেরা নেটওয়ার্কে!
📞 বিস্তারিত জানতে কল/WhatsApp করুন: ০১৩২২-৮০০৩৩৩`,
    bannerBadge: 'ফ্র্যাঞ্চাইজি অফার ২০২৬',
    ctaButtonText: 'আজই যুক্ত হন',
    visualDirection: {
      colorPalette: ['#047857', '#10B981', '#ECFDF5', '#0F172A'],
      layoutDescription: 'High-contrast clean modern retail layout. Left column highlights bold punchy Bengali typography, right side showcases modernized pharmacy storefront with verified shield icon.',
      graphicElements: ['Glowing Verified Authenticity Badge', 'Green Modern Pill Contour', 'Clean WhatsApp / Call Hotline Pill'],
      suggestedImagePrompt: 'Modern well-lit Bangladeshi retail pharmacy storefront with illuminated teal ONE Pharmacy branding, organized medicine shelves, professional pharmacist welcoming customers.',
    },
    hashtags: ['#ONEPharmacy', '#PharmacyFranchise', '#RetailModernization', '#AuthenticMedicine', '#BusinessGrowth', '#DhakaPharmacies'],
    targetAudience: 'Independent retail pharmacy owners & entrepreneurs in Dhaka and surrounding areas',
    channelOptimizedFor: 'Facebook Feed, Banner & WhatsApp Flyer',
  });

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-campaign-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vertical,
          format,
          topic,
          goal,
          language,
          tone,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate campaign content');
      }

      const json = await response.json();
      if (json.success && json.data) {
        setGeneratedContent(json.data);
      }
    } catch (err) {
      console.error('Error generating campaign content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Brand visual styles
  const isOnePharma = vertical === 'ONE Pharmacy';
  const isMedBox = vertical === 'MedBox';

  const brandColors = isOnePharma
    ? {
        gradient: 'from-emerald-900 via-teal-900 to-slate-950',
        badgeBg: 'bg-emerald-500 text-white',
        accentBg: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
        border: 'border-emerald-700/50',
        textHighlight: 'text-emerald-400',
        subtext: 'text-emerald-100/90',
        tag: 'ONE Pharmacy Retail Chain',
        icon: <ShoppingBag className="w-4 h-4 text-emerald-400" />,
        hotline: '০১৩২২-৮০০৩৩৩',
      }
    : isMedBox
    ? {
        gradient: 'from-orange-950 via-amber-950 to-slate-950',
        badgeBg: 'bg-orange-500 text-white',
        accentBg: 'bg-orange-500 hover:bg-orange-400 text-slate-950',
        border: 'border-orange-700/50',
        textHighlight: 'text-orange-400',
        subtext: 'text-orange-100/90',
        tag: 'MedBox B2B Digital Distribution',
        icon: <Building2 className="w-4 h-4 text-orange-400" />,
        hotline: '০১৩২৯-৬৫৫৭০০',
      }
    : {
        gradient: 'from-blue-950 via-slate-900 to-sky-950',
        badgeBg: 'bg-sky-500 text-white',
        accentBg: 'bg-sky-500 hover:bg-sky-400 text-slate-950',
        border: 'border-sky-700/50',
        textHighlight: 'text-sky-400',
        subtext: 'text-sky-100/90',
        tag: 'PulseTech HealthTech Platform',
        icon: <Cpu className="w-4 h-4 text-sky-400" />,
        hotline: 'investors@pulsetech.com',
      };

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              AI Poster &amp; Banner Content Generator
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Generate personalized visual poster copy, headlines, social captions, and design directions for social media.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Generating with AI...' : 'Generate Personalized Content'}</span>
          </button>
        </div>

        {/* Form Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          {/* Brand Vertical */}
          <div>
            <label className="block text-stone-600 font-semibold mb-1">Target Entity / Brand</label>
            <select
              value={vertical}
              onChange={(e) => setVertical(e.target.value as any)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-400"
            >
              <option value="ONE Pharmacy">ONE Pharmacy (Franchise &amp; Retail)</option>
              <option value="MedBox">MedBox (B2B Distribution)</option>
              <option value="PulseTech">PulseTech (Corporate &amp; Scale)</option>
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-stone-600 font-semibold mb-1">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-400"
            >
              <option value="Facebook Poster / Feed Post">Facebook Poster / Feed Post</option>
              <option value="Social Media Banner / Ad">Social Media Banner / Ad</option>
              <option value="LinkedIn Thought Leadership Post">LinkedIn Thought Leadership Post</option>
              <option value="Instagram Square Card (1:1)">Instagram Square Card (1:1)</option>
              <option value="Retail Store Leaflet / Banner">Retail Store Leaflet / Banner</option>
            </select>
          </div>

          {/* Preset Topics */}
          <div>
            <label className="block text-stone-600 font-semibold mb-1">Campaign Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-400"
            >
              {PRESET_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Language & Tone */}
          <div>
            <label className="block text-stone-600 font-semibold mb-1">Language &amp; Tone</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-stone-400"
            >
              <option value="Bangla & English">Bangla &amp; English (Natural)</option>
              <option value="Pure Bengali (বাংলা)">Pure Bengali (বাংলা)</option>
              <option value="English (Corporate)">English (Corporate)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generated Content Presentation: 2 Columns (Live Visual Banner Preview + Full Copy Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Live Visual Poster / Banner Mockup Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-stone-500" />
              Live Banner / Poster Mockup Card
            </h3>
            <span className="text-[11px] text-stone-500 font-medium">
              Optimized for {generatedContent.channelOptimizedFor}
            </span>
          </div>

          {/* Visual Poster Canvas */}
          <div
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${brandColors.gradient} p-6 sm:p-8 text-white border ${brandColors.border} shadow-xl min-h-[380px] flex flex-col justify-between`}
          >
            {/* Background Decorative Accent Gradients */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>

            {/* Top Bar inside Poster */}
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md">
                  {brandColors.icon}
                </div>
                <div>
                  <span className="font-extrabold text-sm tracking-tight text-white block">
                    {vertical}
                  </span>
                  <span className="text-[10px] text-stone-300 font-medium block">
                    {brandColors.tag}
                  </span>
                </div>
              </div>

              {/* Badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-xs ${brandColors.badgeBg}`}
              >
                {generatedContent.bannerBadge}
              </span>
            </div>

            {/* Poster Main Body */}
            <div className="relative z-10 my-6 space-y-3">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-xs">
                {generatedContent.headline}
              </h2>
              <p className={`text-xs sm:text-sm font-medium leading-relaxed max-w-xl ${brandColors.subtext}`}>
                {generatedContent.subheadline}
              </p>
            </div>

            {/* Poster Bottom Bar / Call To Action */}
            <div className="relative z-10 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-stone-300 text-[11px]">যোগাযোগ / Hotline:</span>
                <span className={`font-bold text-sm tracking-wide ${brandColors.textHighlight}`}>
                  {brandColors.hotline}
                </span>
              </div>

              <button
                type="button"
                className={`px-4 py-2 rounded-xl font-bold text-xs tracking-tight shadow-md transition-all ${brandColors.accentBg}`}
              >
                {generatedContent.ctaButtonText} →
              </button>
            </div>
          </div>

          {/* Visual Art Direction & Design Specs */}
          <div className="p-4 bg-white rounded-xl border border-stone-200/80 text-xs space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-indigo-600" />
                Visual Art Direction &amp; Graphic Elements
              </span>
              <button
                onClick={() =>
                  handleCopy(generatedContent.visualDirection.suggestedImagePrompt, 'prompt')
                }
                className="text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1 text-[11px]"
              >
                {copiedKey === 'prompt' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Copy Image Prompt</span>
              </button>
            </div>

            <p className="text-stone-600 leading-relaxed">
              <strong>Layout:</strong> {generatedContent.visualDirection.layoutDescription}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <strong className="text-stone-700">Palette:</strong>
              {generatedContent.visualDirection.colorPalette.map((color, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 px-2 py-0.5 rounded border border-stone-200 bg-stone-50 font-mono text-[11px]"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block border border-black/10"
                    style={{ backgroundColor: color }}
                  ></span>
                  {color}
                </span>
              ))}
            </div>

            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/70">
              <span className="text-[11px] font-semibold text-stone-500 block mb-1">
                AI Image Prompt (Midjourney / DALL-E):
              </span>
              <p className="font-mono text-[11px] text-stone-800 leading-relaxed select-all">
                {generatedContent.visualDirection.suggestedImagePrompt}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Social Media Caption, Copy & Hashtags (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-stone-500" />
              Social Media Post Copy &amp; Caption
            </h3>
            <button
              onClick={() => handleCopy(generatedContent.primaryCaption, 'caption')}
              className="px-2.5 py-1 bg-stone-900 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 hover:bg-stone-800 transition-colors shadow-2xs"
            >
              {copiedKey === 'caption' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Caption</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-2xs space-y-3.5">
            <div>
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                Target Audience
              </span>
              <p className="text-xs text-stone-800 bg-stone-50 p-2 rounded-lg border border-stone-200/70 font-medium">
                {generatedContent.targetAudience}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                Full Social Caption
              </span>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-800 leading-relaxed whitespace-pre-line font-sans max-h-72 overflow-y-auto">
                {generatedContent.primaryCaption}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  Recommended Hashtags
                </span>
                <button
                  onClick={() =>
                    handleCopy(generatedContent.hashtags.join(' '), 'hashtags')
                  }
                  className="text-[11px] text-stone-600 hover:text-stone-900 font-medium flex items-center gap-1"
                >
                  {copiedKey === 'hashtags' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>Copy Tags</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {generatedContent.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
