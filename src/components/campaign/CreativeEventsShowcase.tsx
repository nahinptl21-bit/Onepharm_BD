import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  ShoppingBag,
  Building2,
  Cpu,
  Check,
  Copy,
  PlusCircle,
  Tag,
  Target,
  Send,
  RefreshCw
} from 'lucide-react';
import { CreativeEventSuggestion } from '../../types';

interface CreativeEventsShowcaseProps {
  initialVertical?: string;
}

const DEFAULT_EVENTS: CreativeEventSuggestion[] = [
  {
    id: 'one-pharma-1',
    vertical: 'ONE Pharmacy',
    eventName: 'Shastho Shobar Dware - Pharmacy Trust Mela 2026',
    bengaliName: 'স্বাস্থ্য সবার দ্বারে - ফার্মেসি আস্থা মেলা ২০২৬',
    tagline: 'পাড়ার ফার্মেসি, এখন বিশ্বস্ত ব্র্যান্ড',
    targetAudience: 'Neighborhood residents, local families, and independent retail pharmacy owners',
    eventType: 'Health Camp',
    concept: 'A 7-day community health activation at all ONE Pharmacy partner stores offering complimentary blood pressure monitoring, blood glucose screening, and free prescription reviews.',
    keyActivities: [
      'Complimentary vital checks (BP, Diabetes, Weight/BMI)',
      'Free First Aid Kit with purchase of essential family medicines',
      'On-the-spot franchise consultation booth for interested neighboring pharmacists'
    ],
    suggestedChannels: ['Local Leaflets & Banners', 'Facebook Hyperlocal Geotargeted Ads', 'Community Miking & WhatsApp']
  },
  {
    id: 'one-pharma-2',
    vertical: 'ONE Pharmacy',
    eventName: 'Retail Horizon Summit: The Future of Mom & Pop Pharmacies',
    bengaliName: 'রিটেল হরাইজন সামিট: ফার্মেসি ব্যবসার নতুন দিগন্ত',
    tagline: 'একা লড়াই নয়, একসাথে এগিয়ে চলার শক্তি',
    targetAudience: 'Independent pharmacy proprietors, medicine dispensary owners across Dhaka & Chittagong',
    eventType: 'Partner Meet',
    concept: 'A premier convention bringing together 500+ independent retail pharmacists with banking partners, fintech leaders, and pharmaceutical suppliers.',
    keyActivities: [
      'Keynote on Embedded Working Capital Financing for small pharmacies',
      'Live demonstration of ONE Pharmacy Smart POS & Inventory Management software',
      'Franchise signing bonus ceremony and store makeover awards'
    ],
    suggestedChannels: ['Facebook Business Manager Ads', 'Direct SMS Invitations to Pharmacists', 'Pharma Trade Associations']
  },
  {
    id: 'one-pharma-3',
    vertical: 'ONE Pharmacy',
    eventName: 'Golden Pharmacist Awards & Excellence Gala',
    bengaliName: 'সেরা ফার্মাসিস্ট অ্যাওয়ার্ড ও সম্মাননা গালা',
    tagline: 'সম্মান জানাই জীবনের অতন্দ্র প্রহরীদের',
    targetAudience: 'Top-performing franchisee owners, licensed diploma pharmacists, and healthcare assistants',
    eventType: 'Summit',
    concept: 'An annual red-carpet celebration honoring independent pharmacy owners who went above and beyond during flood crises, dengue outbreaks, and nighttime emergencies.',
    keyActivities: [
      'Awards in 8 categories: Best Customer Care, Fastest Emergency Response, Cleanest Model Store',
      'Panel discussion on counterfeit medicine eradication with DGDA officials',
      'Dinner and musical celebration for pharmacist families'
    ],
    suggestedChannels: ['Facebook Live Broadcast', 'Print Press Releases', 'YouTube Event Highlights']
  },
  {
    id: 'medbox-1',
    vertical: 'MedBox',
    eventName: 'PharmaLeague 2026: The Mega B2B Order Championship',
    bengaliName: 'ফার্মা-লীগ ২০২৬: মেগা সাপ্লাই চ্যাম্পিয়নশিপ',
    tagline: 'অর্ডার হবে বেশি, লাভ হবে দ্বিগুণ',
    targetAudience: '14,000+ registered retail pharmacies ordering on the MedBox platform',
    eventType: 'Competition',
    concept: 'A gamified 6-week retail order tournament building on the massive traction of MedBox "Order Champion" and "Golden Goal" campaigns, rewarding top volume pharmacies with grand prizes.',
    keyActivities: [
      'Weekly order leaderboards announced live on the MedBox App',
      'Flash Discount Hours offering ৳300 instant cashback on partner brand orders',
      'Grand award celebration awarding Cox’s Bazar vacations and delivery waivers'
    ],
    suggestedChannels: ['MedBox Mobile App Push Notifications', 'Facebook Video Reels', 'In-Invoice Printed Promo Inserts']
  },
  {
    id: 'medbox-2',
    vertical: 'MedBox',
    eventName: 'Frontline Delivery Heroes Salute & Logistics Expo',
    bengaliName: 'ফ্রন্টলাইন ডেলিভারি হিরো সম্মাননা ও সাপ্লাই চেইন এক্সপো',
    tagline: 'বৃষ্টি, ঝড় কিংবা জলবদ্ধতা—সেবা থামে না কখনো',
    targetAudience: 'Pharmaceutical manufacturers (ACME, SMC, Beximco, Square), delivery staff, and supply chain managers',
    eventType: 'Exhibition',
    concept: 'A high-visibility industry exhibition spotlighting MedBox’s monsoon-resilient delivery fleet, climate-controlled cold chain logistics, and dedicated delivery heroes.',
    keyActivities: [
      'Tech showcase of smart route-optimization algorithms and cold-chain boxes',
      'Family safety insurance and scholarship distribution for delivery assistants',
      'Manufacturer partnership signing ceremonies for direct-from-factory distribution'
    ],
    suggestedChannels: ['LinkedIn Corporate Thought Leadership', 'National TV Feature (Somoy, Ekattor)', 'YouTube Mini-Documentary']
  },
  {
    id: 'pulsetech-1',
    vertical: 'PulseTech',
    eventName: 'PulseImpact HealthTech Summit: Modernizing Bangladesh’s Healthcare Infrastructure',
    bengaliName: 'পালস-ইমপ্যাক্ট হেলথটেক সামিট ২০২৬',
    tagline: 'From $2.5M to $150M: Engineering the Backbone of Digital Health',
    targetAudience: 'Institutional venture investors, health tech founders, government policymakers, and fintech partners',
    eventType: 'Summit',
    concept: 'A landmark gathering celebrating Startup Bangladesh’s first multi-fold portfolio exit and exploring how AI, supply chain digitalization, and embedded finance will modernize South Asian healthcare.',
    keyActivities: [
      'Keynotes by venture partners from Accelerating Asia, AVV (Eddie Thai), and Venkat Siva',
      'Unveiling of the 2026 Bangladesh National Healthcare Supply Chain Whitepaper',
      'Fireside chat with PulseTech leadership on scaling to $150M ARR'
    ],
    suggestedChannels: ['LinkedIn Thought Leadership Articles', 'Tech Publications (AsiaTechDaily, e27, TechInAsia)', 'Executive VIP Invitations']
  },
  {
    id: 'pulsetech-2',
    vertical: 'PulseTech',
    eventName: 'HealthNexus AI Hackathon & Venture Challenge',
    bengaliName: 'হেলথনেক্সাস এআই হ্যাকাথন ও ভেঞ্চার চ্যালেঞ্জ',
    tagline: 'Code for Care, Build for Scale',
    targetAudience: 'Software engineers, AI/ML researchers, biomedical students, and tech startups',
    eventType: 'Competition',
    concept: 'A 48-hour hands-on national hackathon challenging developers to build AI solutions for predictive medicine shortages, automated prescription digitization, and counterfeit drug detection.',
    keyActivities: [
      '48-hour continuous coding sprint with real anonymized supply chain data APIs',
      '1-on-1 mentorship by Silicon Valley & regional AI leaders (Alex Miller & team)',
      '৳10,00,000 prize pool and immediate talent recruitment into PulseTech Engineering'
    ],
    suggestedChannels: ['University CS Departments & Tech Clubs', 'GitHub Community & Discord', 'LinkedIn Tech Groups']
  }
];

export const CreativeEventsShowcase: React.FC<CreativeEventsShowcaseProps> = ({
  initialVertical = 'All',
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>(initialVertical);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [events, setEvents] = useState<CreativeEventSuggestion[]>(DEFAULT_EVENTS);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [customFocus, setCustomFocus] = useState<string>('');

  const filteredEvents = events.filter((ev) => {
    const matchBrand = selectedBrand === 'All' || ev.vertical === selectedBrand;
    const matchType = selectedType === 'All' || ev.eventType === selectedType;
    return matchBrand && matchType;
  });

  const handleCopy = (event: CreativeEventSuggestion) => {
    const text = `Event: ${event.eventName}\nBengali: ${event.bengaliName || ''}\nTagline: "${event.tagline}"\nBrand: ${event.vertical}\nType: ${event.eventType}\nAudience: ${event.targetAudience}\nConcept: ${event.concept}\nKey Activities:\n${event.keyActivities.map((a) => `• ${a}`).join('\n')}\nChannels: ${event.suggestedChannels.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(event.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateMore = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/suggest-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vertical: selectedBrand === 'All' ? undefined : selectedBrand,
          focusArea: customFocus || 'Expansion, Pharmacist Engagement, Festive Offers, and Digital Health Innovation',
        }),
      });

      if (!response.ok) throw new Error('Failed to generate events');
      const json = await response.json();
      if (json.success && Array.isArray(json.data)) {
        // Prepend new generated events
        setEvents((prev) => [...json.data, ...prev]);
        setCustomFocus('');
      }
    } catch (err) {
      console.error('Error generating event suggestions:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Generator Box */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Creative Event Names &amp; Strategic Blueprints
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Curated and AI-suggested event concepts for ONE Pharmacy, MedBox, and PulseTech.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Custom focus (e.g. Dengue drive, Eid fest, AI)..."
              value={customFocus}
              onChange={(e) => setCustomFocus(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-stone-400 w-56 sm:w-64"
            />
            <button
              onClick={handleGenerateMore}
              disabled={isGenerating}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Suggesting...' : 'Suggest More'}</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Brand Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium mr-1">Brand:</span>
            {['All', 'ONE Pharmacy', 'MedBox', 'PulseTech'].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedBrand === b
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium mr-1">Type:</span>
            {['All', 'Health Camp', 'Summit', 'Competition', 'Partner Meet', 'Exhibition'].map(
              (t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    selectedType === t
                      ? 'bg-stone-800 text-white shadow-2xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/80'
                  }`}
                >
                  {t}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((event) => {
          const isOne = event.vertical === 'ONE Pharmacy';
          const isMed = event.vertical === 'MedBox';

          const accent = isOne
            ? {
                badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                border: 'border-emerald-200/80 hover:border-emerald-400',
                icon: <ShoppingBag className="w-4 h-4 text-emerald-600" />,
                taglineText: 'text-emerald-700',
              }
            : isMed
            ? {
                badge: 'bg-orange-100 text-orange-800 border-orange-200',
                border: 'border-orange-200/80 hover:border-orange-400',
                icon: <Building2 className="w-4 h-4 text-orange-600" />,
                taglineText: 'text-orange-700',
              }
            : {
                badge: 'bg-sky-100 text-sky-800 border-sky-200',
                border: 'border-sky-200/80 hover:border-sky-400',
                icon: <Cpu className="w-4 h-4 text-sky-600" />,
                taglineText: 'text-sky-700',
              };

          return (
            <div
              key={event.id}
              className={`p-5 bg-white rounded-2xl border ${accent.border} shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-3">
                {/* Card Top: Brand Badge & Event Type */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold border flex items-center gap-1.5 ${accent.badge}`}
                  >
                    {accent.icon}
                    {event.vertical}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-600">
                    {event.eventType}
                  </span>
                </div>

                {/* Event Names */}
                <div>
                  <h3 className="font-bold text-stone-900 text-base leading-snug">
                    {event.eventName}
                  </h3>
                  {event.bengaliName && (
                    <p className="text-xs font-semibold text-stone-600 mt-1">
                      {event.bengaliName}
                    </p>
                  )}
                  <p className={`text-xs font-bold mt-1.5 ${accent.taglineText}`}>
                    "{event.tagline}"
                  </p>
                </div>

                {/* Concept */}
                <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
                  {event.concept}
                </p>

                {/* Activities */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Key Activities:
                  </span>
                  <ul className="space-y-1 text-xs text-stone-700">
                    {event.keyActivities.map((act, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0"></span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer: Channels & Copy Blueprint */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap gap-1">
                  {event.suggestedChannels.map((c, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded text-[10px] font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleCopy(event)}
                  className="px-2.5 py-1 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-md font-medium text-xs flex items-center gap-1 shrink-0 transition-colors"
                  title="Copy complete event proposal"
                >
                  {copiedId === event.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
