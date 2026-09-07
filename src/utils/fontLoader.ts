/**
 * Dynamically loads a Google Font stylesheet if not already injected.
 */
const loadedFonts = new Set<string>();

export function loadGoogleFont(googleFontFamily: string) {
  if (!googleFontFamily || loadedFonts.has(googleFontFamily)) {
    return;
  }

  try {
    const linkId = `gfont-${googleFontFamily.replace(/[^a-zA-Z0-9]/g, '-')}`;
    if (document.getElementById(linkId)) {
      loadedFonts.add(googleFontFamily);
      return;
    }

    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    // Load standard weights 400 and 700
    const familyParam = googleFontFamily.includes(':') 
      ? googleFontFamily 
      : `${googleFontFamily}:wght@400;600;700;800`;
    link.href = `https://fonts.googleapis.com/css2?family=${familyParam}&display=swap`;
    
    document.head.appendChild(link);
    loadedFonts.add(googleFontFamily);
  } catch (err) {
    console.warn('Failed to dynamically load Google Font:', err);
  }
}

/**
 * Normalizes font name for CSS font-family declaration
 */
export function getCleanFontFamily(fontName: string): string {
  const clean = fontName.replace(/\+/g, ' ').replace(/:.*/, '');
  return `'${clean}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
}
