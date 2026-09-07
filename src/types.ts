export type DiffGranularity = 'word' | 'char' | 'line';

export type DiffType = 'same' | 'added' | 'removed';

export interface DiffPart {
  type: DiffType;
  value: string;
}

export interface LineDiffItem {
  lineNumberA?: number;
  lineNumberB?: number;
  type: 'same' | 'added' | 'removed' | 'modified';
  contentA?: string;
  contentB?: string;
  charDiffs?: {
    a: DiffPart[];
    b: DiffPart[];
  };
}

export interface ComparisonOptions {
  caseSensitive: boolean;
  ignoreWhitespace: boolean;
  ignoreLineBreaks: boolean;
  ignorePunctuation: boolean;
  autoDetectJson: boolean;
  diffGranularity: DiffGranularity;
  viewMode: 'split' | 'unified';
}

export type MatchVerdictType = 
  | 'EMPTY' 
  | 'EXACT_MATCH' 
  | 'NORMALIZED_MATCH' 
  | 'HIGH_SIMILARITY' 
  | 'PARTIAL_MATCH' 
  | 'NO_MATCH';

export interface ComparisonResult {
  verdict: MatchVerdictType;
  verdictTitle: string;
  verdictDescription: string;
  isExactMatch: boolean;
  isNormalizedMatch: boolean;
  similarityScore: number; // 0 to 100
  levenshteinDistance: number;
  charCountA: number;
  charCountB: number;
  wordCountA: number;
  wordCountB: number;
  lineCountA: number;
  lineCountB: number;
  isJson: boolean;
  jsonEqual?: boolean;
  jsonErrorA?: string;
  jsonErrorB?: string;
  wordDiffs: DiffPart[];
  charDiffs: DiffPart[];
  lineDiffs: LineDiffItem[];
  mismatchSummary: string[];
}

export interface FontAlternative {
  fontName: string;
  googleFontFamily: string;
  similarityScore: number;
  reason: string;
  classification?: string;
}

export interface PrimaryFontMatch {
  fontName: string;
  confidence: number;
  classification: string;
  weight: string;
  style: string;
  foundryOrSource?: string;
  isGoogleFont: boolean;
  googleFontFamily?: string;
  description?: string;
}

export interface FontMatchData {
  detectedText: string;
  primaryMatch: PrimaryFontMatch;
  typographicFeatures: string[];
  alternativeFonts: FontAlternative[];
  cssSnippet: string;
}

export type ActiveAppTab = 'content-matcher' | 'font-identifier' | 'campaign-ai';

export interface CampaignPost {
  Vertical: string;
  Channel: string;
  Date: string;
  Day?: string;
  Status?: string | null;
  Caption: string | null;
  Character?: number | null;
  PostLink?: string | null;
  Views?: number | null;
  Reach?: number | null;
  Impression?: number | null;
  Engagement?: number | null;
  Month?: string;
}

export interface CampaignMonthlyData {
  [month: string]: CampaignPost[];
}

export interface CreativeEventSuggestion {
  id: string;
  vertical: 'ONE Pharmacy' | 'MedBox' | 'PulseTech';
  eventName: string;
  bengaliName?: string;
  tagline: string;
  targetAudience: string;
  eventType: 'Summit' | 'Exhibition' | 'Health Camp' | 'Webinar' | 'Competition' | 'Partner Meet';
  concept: string;
  keyActivities: string[];
  suggestedChannels: string[];
}

export interface GeneratedPosterContent {
  headline: string;
  subheadline: string;
  primaryCaption: string;
  bannerBadge: string;
  ctaButtonText: string;
  visualDirection: {
    colorPalette: string[];
    layoutDescription: string;
    graphicElements: string[];
    suggestedImagePrompt: string;
  };
  hashtags: string[];
  targetAudience: string;
  channelOptimizedFor: string;
}

export interface CampaignAnalysisReport {
  summary: string;
  verticalHighlights: {
    vertical: string;
    keyThemes: string[];
    topStrengths: string[];
    recommendedNextSteps: string[];
  }[];
  contentPerformanceFindings: string[];
  optimalChannelStrategy: string[];
  seasonalEventOpportunities: string[];
}
