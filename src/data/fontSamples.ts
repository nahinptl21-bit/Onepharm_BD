import { FontMatchData } from '../types';

export interface FontSamplePreset {
  id: string;
  title: string;
  category: string;
  previewUrl: string;
  mockData: FontMatchData;
}

// Generate clean SVG data URLs for instant, self-contained, crystal-clear sample screenshots
function createSvgDataUrl(width: number, height: number, svgContent: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${svgContent}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const FONT_SAMPLES: FontSamplePreset[] = [
  {
    id: 'editorial-serif',
    title: 'Luxury Editorial Headline',
    category: 'Serif (Didone / Transitional)',
    previewUrl: createSvgDataUrl(
      800,
      320,
      `<rect width="100%" height="100%" fill="#faf8f5" rx="8"/>
       <rect x="20" y="20" width="760" height="280" fill="#ffffff" stroke="#e7e2d9" stroke-width="1.5" rx="6"/>
       <text x="50" y="80" font-family="'Playfair Display', 'Bodoni MT', 'Didot', serif" font-size="20" font-style="italic" fill="#8c7851" letter-spacing="4">AUTUMN COLLECTION</text>
       <text x="50" y="150" font-family="'Playfair Display', 'Didot', serif" font-size="52" font-weight="700" fill="#1c1917" letter-spacing="-1">The Art of Modern Elegance</text>
       <text x="50" y="210" font-family="'Playfair Display', serif" font-size="22" fill="#57534e" letter-spacing="1">ARCHITECTURAL DESIGN &amp; TIMELESS CRAFT</text>
       <line x1="50" y1="245" x2="250" y2="245" stroke="#1c1917" stroke-width="2"/>`
    ),
    mockData: {
      detectedText: "The Art of Modern Elegance\nARCHITECTURAL DESIGN & TIMELESS CRAFT",
      primaryMatch: {
        fontName: "Playfair Display",
        confidence: 97,
        classification: "Transitional Serif / Modern Didone",
        weight: "Bold (700)",
        style: "Normal",
        foundryOrSource: "Claus Eggers Sørensen (Google Fonts)",
        isGoogleFont: true,
        googleFontFamily: "Playfair+Display",
        description: "An elegant serif typeface inspired by the transitional period of the late 18th century, featuring high stroke contrast and delicate ball terminals."
      },
      typographicFeatures: [
        "High stroke contrast between thick stems and razor-thin hairlines",
        "Refined bracketed serifs with subtle cupped bases",
        "Distinctive ball terminal on lowercase letters like 'r' and 'c'",
        "Steep italic angle with calligraphic swashes",
        "Generous x-height optimized for prominent editorial headlines"
      ],
      alternativeFonts: [
        {
          fontName: "Bodoni Moda",
          googleFontFamily: "Bodoni+Moda",
          similarityScore: 94,
          reason: "Similar high-contrast Didone structure with dramatic vertical stress and sharp serifs.",
          classification: "Didone Serif"
        },
        {
          fontName: "Prata",
          googleFontFamily: "Prata",
          similarityScore: 89,
          reason: "Elegant teardrop terminals and balanced proportions suitable for titles.",
          classification: "Didone Serif"
        },
        {
          fontName: "Cormorant Garamond",
          googleFontFamily: "Cormorant+Garamond",
          similarityScore: 85,
          reason: "Classical Renaissance proportions with delicate line weights.",
          classification: "Old Style Serif"
        }
      ],
      cssSnippet: `font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;\nfont-weight: 700;`
    }
  },
  {
    id: 'geometric-sans',
    title: 'Tech Geometric Sans UI',
    category: 'Geometric Sans-Serif',
    previewUrl: createSvgDataUrl(
      800,
      320,
      `<rect width="100%" height="100%" fill="#0f172a" rx="8"/>
       <rect x="20" y="20" width="760" height="280" fill="#1e293b" stroke="#334155" stroke-width="1.5" rx="6"/>
       <circle cx="65" cy="75" r="14" fill="#38bdf8"/>
       <text x="95" y="82" font-family="'Montserrat', 'Century Gothic', sans-serif" font-size="20" font-weight="700" fill="#38bdf8" letter-spacing="3">QUANTUM CLOUD</text>
       <text x="50" y="160" font-family="'Montserrat', 'Futura', sans-serif" font-size="54" font-weight="800" fill="#f8fafc" letter-spacing="-0.5">NEXT-GEN RUNTIME</text>
       <text x="50" y="220" font-family="'Montserrat', sans-serif" font-size="22" font-weight="500" fill="#94a3b8" letter-spacing="2">ZERO-LATENCY DISTRIBUTED PLATFORM</text>
       <rect x="50" y="250" width="160" height="34" rx="17" fill="#38bdf8"/>
       <text x="88" y="272" font-family="'Montserrat', sans-serif" font-size="13" font-weight="700" fill="#0f172a">LAUNCH APP</text>`
    ),
    mockData: {
      detectedText: "QUANTUM CLOUD\nNEXT-GEN RUNTIME\nZERO-LATENCY DISTRIBUTED PLATFORM",
      primaryMatch: {
        fontName: "Montserrat",
        confidence: 96,
        classification: "Geometric Sans-Serif",
        weight: "Extra-Bold (800)",
        style: "Normal",
        foundryOrSource: "Julieta Ulanovsky (Google Fonts)",
        isGoogleFont: true,
        googleFontFamily: "Montserrat",
        description: "A geometric sans-serif typeface inspired by old posters and signs in the traditional Montserrat neighborhood of Buenos Aires."
      },
      typographicFeatures: [
        "Nearly circular 'O', 'C', and 'G' glyphs based on pure Euclidean geometry",
        "Low crossbar on uppercase 'G' without an inner spur",
        "Spacious wide proportioning across capital letters",
        "Sharp diagonal terminals on uppercase 'A' and 'M'",
        "Clean, uniform stroke width with minimal optical contrast"
      ],
      alternativeFonts: [
        {
          fontName: "Poppins",
          googleFontFamily: "Poppins",
          similarityScore: 92,
          reason: "Pure geometric curves with slightly rounder characteristics and constructed forms.",
          classification: "Geometric Sans"
        },
        {
          fontName: "Outfit",
          googleFontFamily: "Outfit",
          similarityScore: 90,
          reason: "Clean modern geometric sans engineered specifically for digital branding and UI.",
          classification: "Geometric Sans"
        },
        {
          fontName: "Urbanist",
          googleFontFamily: "Urbanist",
          similarityScore: 88,
          reason: "Low-contrast, neo-grotesque geometric hybrid with crisp clean terminals.",
          classification: "Geometric Sans"
        }
      ],
      cssSnippet: `font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;\nfont-weight: 800;`
    }
  },
  {
    id: 'developer-mono',
    title: 'Developer Monospace Terminal',
    category: 'Monospace / Code',
    previewUrl: createSvgDataUrl(
      800,
      320,
      `<rect width="100%" height="100%" fill="#18181b" rx="8"/>
       <rect x="20" y="20" width="760" height="280" fill="#27272a" stroke="#3f3f46" stroke-width="1.5" rx="6"/>
       <circle cx="50" cy="50" r="6" fill="#ef4444"/>
       <circle cx="70" cy="50" r="6" fill="#f59e0b"/>
       <circle cx="90" cy="50" r="6" fill="#10b981"/>
       <text x="50" y="110" font-family="'JetBrains Mono', 'Fira Code', monospace" font-size="28" font-weight="700" fill="#a855f7">const <tspan fill="#60a5fa">matchContent</tspan> = <tspan fill="#e4e4e7">(</tspan><tspan fill="#f59e0b">a</tspan>, <tspan fill="#f59e0b">b</tspan><tspan fill="#e4e4e7">)</tspan> =&gt; {</text>
       <text x="80" y="160" font-family="'JetBrains Mono', monospace" font-size="26" fill="#10b981">  return a.normalize() === b.normalize();</text>
       <text x="50" y="210" font-family="'JetBrains Mono', monospace" font-size="28" fill="#e4e4e7">};</text>
       <text x="50" y="265" font-family="'JetBrains Mono', monospace" font-size="20" fill="#71717a">// Status: 100% Exact Typographical Match</text>`
    ),
    mockData: {
      detectedText: "const matchContent = (a, b) => {\n  return a.normalize() === b.normalize();\n};\n// Status: 100% Exact Typographical Match",
      primaryMatch: {
        fontName: "JetBrains Mono",
        confidence: 98,
        classification: "Monospace / Programming",
        weight: "Bold (700)",
        style: "Normal",
        foundryOrSource: "JetBrains (Philipp Nurullin)",
        isGoogleFont: true,
        googleFontFamily: "JetBrains+Mono",
        description: "A typeface crafted specifically for developers with increased letter height, programming ligatures, and distinct character forms."
      },
      typographicFeatures: [
        "Distinctive oval zero with diagonal slash to prevent confusion with capital 'O'",
        "High x-height for optimal legibility at compact code editor sizes",
        "Clear differentiation between 1, l, I and |, /",
        "Flat, horizontal terminals suited for grid alignment",
        "Engineered spacing that preserves scanability across long lines"
      ],
      alternativeFonts: [
        {
          fontName: "Fira Code",
          googleFontFamily: "Fira+Code",
          similarityScore: 95,
          reason: "Popular programming monospaced font with clean glyph shapes and coding ligatures.",
          classification: "Monospace"
        },
        {
          fontName: "Space Mono",
          googleFontFamily: "Space+Mono",
          similarityScore: 89,
          reason: "Geometric and grotesque monospace with retro sci-fi flair.",
          classification: "Monospace"
        },
        {
          fontName: "Source Code Pro",
          googleFontFamily: "Source+Code+Pro",
          similarityScore: 91,
          reason: "Adobe designed monospace font with open apertures and high readability.",
          classification: "Monospace"
        }
      ],
      cssSnippet: `font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;\nfont-weight: 700;`
    }
  },
  {
    id: 'humanist-sans',
    title: 'Clean Humanist Sans Interface',
    category: 'Humanist / Neo-Grotesque',
    previewUrl: createSvgDataUrl(
      800,
      320,
      `<rect width="100%" height="100%" fill="#f1f5f9" rx="8"/>
       <rect x="20" y="20" width="760" height="280" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" rx="6"/>
       <text x="50" y="85" font-family="'Inter', -apple-system, sans-serif" font-size="16" font-weight="600" fill="#64748b" letter-spacing="1">USER SETTINGS &amp; PREFERENCES</text>
       <text x="50" y="145" font-family="'Inter', sans-serif" font-size="46" font-weight="700" fill="#0f172a" letter-spacing="-0.8">Account Security &amp; Access</text>
       <text x="50" y="205" font-family="'Inter', sans-serif" font-size="22" font-weight="400" fill="#475569">Multi-Factor Authentication enabled for all authorized team members.</text>
       <rect x="50" y="240" width="130" height="36" rx="6" fill="#0f172a"/>
       <text x="74" y="263" font-family="'Inter', sans-serif" font-size="14" font-weight="500" fill="#ffffff">Update Settings</text>`
    ),
    mockData: {
      detectedText: "USER SETTINGS & PREFERENCES\nAccount Security & Access\nMulti-Factor Authentication enabled for all authorized team members.",
      primaryMatch: {
        fontName: "Inter",
        confidence: 99,
        classification: "Neo-Grotesque / Screen Sans",
        weight: "Bold (700)",
        style: "Normal",
        foundryOrSource: "Rasmus Andersson",
        isGoogleFont: true,
        googleFontFamily: "Inter",
        description: "A typeface carefully crafted & designed for computer screens with tall x-height and context-aware punctuation."
      },
      typographicFeatures: [
        "Tall x-height to maximize readability at smaller screen sizes",
        "Curved tail on lowercase 'l' to distinguish it from uppercase 'I'",
        "Moderate aperture openings with clean vertical sheared terminals",
        "Neutral neo-grotesque rhythm without aggressive optical quirks",
        "Multiple optical weights for dense user interface layouts"
      ],
      alternativeFonts: [
        {
          fontName: "Roboto",
          googleFontFamily: "Roboto",
          similarityScore: 93,
          reason: "Dual nature featuring mechanical skeleton and largely geometric forms with friendly curves.",
          classification: "Neo-Grotesque"
        },
        {
          fontName: "Plus Jakarta Sans",
          googleFontFamily: "Plus+Jakarta+Sans",
          similarityScore: 91,
          reason: "Contemporary neo-grotesque font with warm, geometric touches.",
          classification: "Neo-Grotesque"
        },
        {
          fontName: "DM Sans",
          googleFontFamily: "DM+Sans",
          similarityScore: 88,
          reason: "Low-contrast geometric sans font designed for coordinate use at text sizes.",
          classification: "Geometric Sans"
        }
      ],
      cssSnippet: `font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\nfont-weight: 700;`
    }
  }
];
