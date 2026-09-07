import React, { useState, useEffect, useRef } from 'react';
import {
  FileCheck,
  Sparkles,
  Type,
  Palette,
  Menu,
  X,
  RotateCcw,
  ChevronDown,
  Check,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { SAMPLE_PRESETS, SamplePreset } from '../data/samplePresets';
import { ActiveAppTab } from '../types';
import { AboutModal } from './AboutModal';

interface HeaderProps {
  activeTab: ActiveAppTab;
  onSelectTab: (tab: ActiveAppTab) => void;
  onSelectSample: (sample: SamplePreset) => void;
  onClearAll: () => void;
}

export function Header({
  activeTab,
  onSelectTab,
  onSelectSample,
  onClearAll,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [samplesDropdownOpen, setSamplesDropdownOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const samplesDropdownRef = useRef<HTMLDivElement>(null);

  // Close desktop dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        samplesDropdownRef.current &&
        !samplesDropdownRef.current.contains(event.target as Node)
      ) {
        setSamplesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        setSamplesDropdownOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleTabChange = (tab: ActiveAppTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const handleSampleSelect = (sample: SamplePreset) => {
    onSelectSample(sample);
    setSamplesDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const activeTabLabels: Record<ActiveAppTab, { title: string; subtitle: string; icon: React.ReactNode }> = {
    'content-matcher': {
      title: 'Content Matcher',
      subtitle: 'Compare character, word, line & semantic JSON',
      icon: <FileCheck className="w-4 h-4 text-emerald-400" />,
    },
    'font-identifier': {
      title: 'Font Identifier',
      subtitle: 'Screenshot glyph analysis & Google Fonts match',
      icon: <Type className="w-4 h-4 text-sky-400" />,
    },
    'campaign-ai': {
      title: 'Campaign AI Studio',
      subtitle: 'Social posters, events & brand campaign analysis',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
    },
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/95 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Brand Identity & Current Context */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-stone-900 text-stone-50 flex items-center justify-center shadow-xs shrink-0">
                {activeTabLabels[activeTab].icon}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-bold text-stone-900 tracking-tight truncate">
                    {activeTabLabels[activeTab].title}
                  </span>
                  <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold bg-stone-100 text-stone-600 rounded-md border border-stone-200">
                    {activeTab === 'campaign-ai' ? 'AI Studio' : 'v2.4'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 hidden sm:block truncate max-w-xs md:max-w-sm">
                  {activeTabLabels[activeTab].subtitle}
                </p>
              </div>
            </div>

            {/* Desktop Navigation Segmented Control */}
            <nav
              aria-label="Tool selection"
              className="hidden md:flex items-center bg-stone-100/90 p-1 rounded-xl border border-stone-200/80 shadow-2xs"
            >
              <button
                type="button"
                id="tab-content-matcher"
                onClick={() => handleTabChange('content-matcher')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'content-matcher'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Content Matcher</span>
              </button>

              <button
                type="button"
                id="tab-font-identifier"
                onClick={() => handleTabChange('font-identifier')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'font-identifier'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Type className="w-3.5 h-3.5 text-sky-600" />
                <span>Font Identifier</span>
              </button>

              <button
                type="button"
                id="tab-campaign-ai"
                onClick={() => handleTabChange('campaign-ai')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'campaign-ai'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Campaign AI</span>
                <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded text-[9px] font-bold">
                  AI
                </span>
              </button>
            </nav>

            {/* Desktop Actions & Samples (Minimalist Dropdown) */}
            <div className="hidden md:flex items-center gap-2">
              {activeTab === 'content-matcher' && (
                <>
                  <div className="relative" ref={samplesDropdownRef}>
                    <button
                      type="button"
                      id="samples-dropdown-btn"
                      onClick={() => setSamplesDropdownOpen(!samplesDropdownOpen)}
                      className="px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Samples</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-150 ${
                          samplesDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Desktop Samples Popover */}
                    {samplesDropdownOpen && (
                      <div className="absolute right-0 mt-1.5 w-64 bg-white border border-stone-200 rounded-xl shadow-lg p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-2.5 py-1.5 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                          Load Sample Scenario
                        </div>
                        <div className="space-y-0.5">
                          {SAMPLE_PRESETS.map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => handleSampleSelect(preset)}
                              className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-stone-100 text-stone-700 transition-colors flex flex-col gap-0.5 cursor-pointer"
                            >
                              <span className="font-semibold text-stone-900">
                                {preset.name}
                              </span>
                              <span className="text-[11px] text-stone-500 line-clamp-1">
                                {preset.description}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    id="clear-all-header-btn"
                    onClick={onClearAll}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                    title="Clear both inputs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                </>
              )}

              {activeTab === 'campaign-ai' && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 border border-stone-200 rounded-lg text-[11px] text-stone-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>ONE • MedBox • Pulse</span>
                </div>
              )}

              {/* Desktop About Button */}
              <button
                type="button"
                id="about-app-btn"
                onClick={() => setAboutModalOpen(true)}
                className="p-1.5 sm:px-2.5 sm:py-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                title="About this application"
              >
                <Info className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">About</span>
              </button>
            </div>

            {/* Mobile Header Right Controls: Fast Sample & Hamburger Menu Button */}
            <div className="flex md:hidden items-center gap-1.5">
              {activeTab === 'content-matcher' && (
                <button
                  type="button"
                  id="mobile-quick-sample-btn"
                  onClick={() => handleSampleSelect(SAMPLE_PRESETS[0])}
                  className="px-2.5 py-1.5 bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1 border border-stone-200 active:bg-stone-200 transition-colors"
                  title="Load sample comparison"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sample</span>
                </button>
              )}

              {/* Accessible Hamburger Toggle Button (>=44px touch area) */}
              <button
                type="button"
                id="mobile-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  mobileMenuOpen
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200'
                }`}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer / Overlay Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed top-14 sm:top-16 inset-x-0 bottom-0 bg-white border-b border-stone-200 overflow-y-auto z-50 p-4 space-y-5 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              {/* Menu Title */}
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Select Workspace Tool
                </span>
                <span className="text-[11px] font-medium text-stone-500">
                  Multi-Tool Studio
                </span>
              </div>

              {/* Navigation Items */}
              <div className="space-y-2">
                {/* Content Matcher Option */}
                <button
                  type="button"
                  onClick={() => handleTabChange('content-matcher')}
                  className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    activeTab === 'content-matcher'
                      ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-500/20 shadow-xs'
                      : 'bg-stone-50/80 border-stone-200 hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      activeTab === 'content-matcher'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-stone-700 border border-stone-200'
                    }`}
                  >
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-stone-900">
                        Content Matcher
                      </span>
                      {activeTab === 'content-matcher' && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Verify exact, trimmed, or JSON semantic matching between two inputs.
                    </p>
                  </div>
                </button>

                {/* Font Identifier Option */}
                <button
                  type="button"
                  onClick={() => handleTabChange('font-identifier')}
                  className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    activeTab === 'font-identifier'
                      ? 'bg-sky-50/70 border-sky-300 ring-1 ring-sky-500/20 shadow-xs'
                      : 'bg-stone-50/80 border-stone-200 hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      activeTab === 'font-identifier'
                        ? 'bg-sky-600 text-white'
                        : 'bg-white text-stone-700 border border-stone-200'
                    }`}
                  >
                    <Type className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-stone-900">
                        Font Identifier
                      </span>
                      {activeTab === 'font-identifier' && (
                        <Check className="w-4 h-4 text-sky-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Upload or paste screenshot to identify typography &amp; Google Fonts.
                    </p>
                  </div>
                </button>

                {/* Campaign AI Option */}
                <button
                  type="button"
                  onClick={() => handleTabChange('campaign-ai')}
                  className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    activeTab === 'campaign-ai'
                      ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-500/20 shadow-xs'
                      : 'bg-stone-50/80 border-stone-200 hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      activeTab === 'campaign-ai'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-stone-700 border border-stone-200'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-stone-900">
                          Campaign AI &amp; Brand Studio
                        </span>
                        <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded text-[9px] font-bold">
                          AI
                        </span>
                      </div>
                      {activeTab === 'campaign-ai' && (
                        <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Personalized poster copy generator, creative events &amp; data insights.
                    </p>
                  </div>
                </button>
              </div>

              {/* Sample Presets Section (when Content Matcher is active or accessible) */}
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Load Sample Scenarios
                  </span>
                  {activeTab === 'content-matcher' && (
                    <button
                      type="button"
                      onClick={() => {
                        onClearAll();
                        setMobileMenuOpen(false);
                      }}
                      className="text-stone-400 hover:text-rose-600 flex items-center gap-1 text-[11px]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Inputs</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {SAMPLE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSampleSelect(preset)}
                      className="w-full text-left p-2.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200/80 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold text-xs text-stone-800">
                          {preset.name}
                        </div>
                        <div className="text-[11px] text-stone-500 line-clamp-1">
                          {preset.description}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Footer Info inside Mobile Menu */}
            <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 space-y-2">
              <button
                type="button"
                id="mobile-about-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAboutModalOpen(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-stone-600" />
                <span>About This Application</span>
              </button>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span>Ecosystem Entities:</span>
                <span className="font-semibold text-stone-700">
                  ONE Pharmacy • MedBox • PulseTech
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 bg-stone-900 text-white rounded-xl font-semibold text-xs shadow-xs cursor-pointer"
              >
                Close Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Modal Dialog */}
      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />
    </>
  );
}
