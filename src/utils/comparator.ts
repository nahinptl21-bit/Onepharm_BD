import { ComparisonOptions, ComparisonResult, DiffPart, LineDiffItem, MatchVerdictType } from '../types';

/**
 * Normalizes text based on comparison options.
 */
export function normalizeText(text: string, options: ComparisonOptions): string {
  let res = text;
  if (!options.caseSensitive) {
    res = res.toLowerCase();
  }
  if (options.ignoreLineBreaks) {
    res = res.replace(/[\r\n]+/g, ' ');
  }
  if (options.ignoreWhitespace) {
    res = res.replace(/\s+/g, ' ').trim();
  }
  if (options.ignorePunctuation) {
    res = res.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’“”]/g, '');
  }
  return res;
}

/**
 * Longest Common Subsequence (LCS) based diff implementation for tokens.
 */
export function diffTokens(tokensA: string[], tokensB: string[]): DiffPart[] {
  const n = tokensA.length;
  const m = tokensB.length;

  // For very large token arrays, fallback to fast heuristic to prevent UI freezing
  if (n * m > 1_500_000) {
    return fastDiff(tokensA, tokensB);
  }

  // Standard dynamic programming matrix for LCS
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1) as unknown as number[]);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (tokensA[i] === tokensB[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const result: DiffPart[] = [];
  let i = n;
  let j = m;

  const stack: DiffPart[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && tokensA[i - 1] === tokensB[j - 1]) {
      stack.push({ type: 'same', value: tokensA[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: 'added', value: tokensB[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      stack.push({ type: 'removed', value: tokensA[i - 1] });
      i--;
    }
  }

  stack.reverse();

  // Consolidate consecutive tokens of the same diff type
  for (const part of stack) {
    const prev = result[result.length - 1];
    if (prev && prev.type === part.type) {
      prev.value += part.value;
    } else {
      result.push({ ...part });
    }
  }

  return result;
}

function fastDiff(tokensA: string[], tokensB: string[]): DiffPart[] {
  const result: DiffPart[] = [];
  let i = 0;
  let j = 0;
  while (i < tokensA.length && j < tokensB.length) {
    if (tokensA[i] === tokensB[j]) {
      result.push({ type: 'same', value: tokensA[i] });
      i++;
      j++;
    } else {
      result.push({ type: 'removed', value: tokensA[i] });
      result.push({ type: 'added', value: tokensB[j] });
      i++;
      j++;
    }
  }
  while (i < tokensA.length) {
    result.push({ type: 'removed', value: tokensA[i++] });
  }
  while (j < tokensB.length) {
    result.push({ type: 'added', value: tokensB[j++] });
  }
  return result;
}

/**
 * Tokenize string into word-and-whitespace pieces.
 */
export function tokenizeWords(text: string): string[] {
  // Splits keeping word characters and whitespace/punctuation delimiters
  const matches = text.match(/\s+|[^\s]+/g);
  return matches || [];
}

/**
 * Tokenize string into individual characters.
 */
export function tokenizeChars(text: string): string[] {
  return Array.from(text);
}

/**
 * Calculates Levenshtein Distance for similarity calculation.
 */
export function calculateLevenshtein(strA: string, strB: string): number {
  const a = strA.slice(0, 1000);
  const b = strB.slice(0, 1000);
  const m = a.length;
  const n = b.length;

  if (m === 0) return n;
  if (n === 0) return m;

  const row = new Array(n + 1);
  for (let j = 0; j <= n; j++) row[j] = j;

  for (let i = 1; i <= m; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = row[j];
      if (a[i - 1] === b[j - 1]) {
        row[j] = prev;
      } else {
        row[j] = Math.min(row[j - 1], row[j], prev) + 1;
      }
      prev = temp;
    }
  }

  return row[n];
}

/**
 * Compute similarity score 0 to 100 based on Levenshtein and token overlap.
 */
export function computeSimilarityScore(strA: string, strB: string): number {
  if (strA === strB) return 100;
  if (!strA && !strB) return 100;
  if (!strA || !strB) return 0;

  const maxLen = Math.max(strA.length, strB.length);
  if (maxLen === 0) return 100;

  const levDist = calculateLevenshtein(strA, strB);
  const levScore = Math.max(0, 1 - levDist / maxLen);

  // Also calculate Jaccard word similarity for semantic overlap
  const wordsA = new Set(strA.toLowerCase().split(/\s+/).filter(Boolean));
  const wordsB = new Set(strB.toLowerCase().split(/\s+/).filter(Boolean));
  
  let intersection = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) intersection++;
  }
  const union = new Set([...wordsA, ...wordsB]).size;
  const jaccardScore = union > 0 ? intersection / union : 1;

  const combined = (levScore * 0.7 + jaccardScore * 0.3) * 100;
  return Math.min(100, Math.max(0, Math.round(combined * 10) / 10));
}

/**
 * Recursively sort JSON keys to test semantic equivalence
 */
function sortJsonObject(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortJsonObject);
  }
  if (obj !== null && typeof obj === 'object') {
    const sortedKeys = Object.keys(obj as Record<string, unknown>).sort();
    const result: Record<string, unknown> = {};
    for (const key of sortedKeys) {
      result[key] = sortJsonObject((obj as Record<string, unknown>)[key]);
    }
    return result;
  }
  return obj;
}

/**
 * Compares two lines and creates character-level diffs
 */
export function computeLineDiffs(textA: string, textB: string): LineDiffItem[] {
  const linesA = textA.split(/\r?\n/);
  const linesB = textB.split(/\r?\n/);

  // Align lines using token diff
  const rawDiff = diffTokens(linesA, linesB);
  const items: LineDiffItem[] = [];

  let lineNumA = 1;
  let lineNumB = 1;

  for (const part of rawDiff) {
    const lines = part.value.split(/(?=[^\n]*\n?)/).filter(Boolean);
    // Actually part.value is joined tokens, so let's preserve discrete lines
    // Better to handle directly with indexed lines
  }

  // Simple direct alignment
  const maxLines = Math.max(linesA.length, linesB.length);
  for (let i = 0; i < maxLines; i++) {
    const lineA = linesA[i];
    const lineB = linesB[i];

    if (lineA !== undefined && lineB !== undefined) {
      if (lineA === lineB) {
        items.push({
          type: 'same',
          lineNumberA: i + 1,
          lineNumberB: i + 1,
          contentA: lineA,
          contentB: lineB,
        });
      } else {
        // Line was modified
        const charPartsA = diffTokens(tokenizeWords(lineA), tokenizeWords(lineB));
        items.push({
          type: 'modified',
          lineNumberA: i + 1,
          lineNumberB: i + 1,
          contentA: lineA,
          contentB: lineB,
          charDiffs: {
            a: charPartsA.filter(p => p.type !== 'added'),
            b: charPartsA.filter(p => p.type !== 'removed'),
          },
        });
      }
    } else if (lineA !== undefined) {
      items.push({
        type: 'removed',
        lineNumberA: i + 1,
        contentA: lineA,
      });
    } else if (lineB !== undefined) {
      items.push({
        type: 'added',
        lineNumberB: i + 1,
        contentB: lineB,
      });
    }
  }

  return items;
}

/**
 * Main Comparison Function
 */
export function compareContent(infoA: string, infoB: string, options: ComparisonOptions): ComparisonResult {
  const isEmptyA = infoA.trim() === '';
  const isEmptyB = infoB.trim() === '';

  const charCountA = infoA.length;
  const charCountB = infoB.length;
  const wordCountA = infoA.trim() ? infoA.trim().split(/\s+/).length : 0;
  const wordCountB = infoB.trim() ? infoB.trim().split(/\s+/).length : 0;
  const lineCountA = infoA ? infoA.split(/\r?\n/).length : 0;
  const lineCountB = infoB ? infoB.split(/\r?\n/).length : 0;

  if (isEmptyA && isEmptyB) {
    return {
      verdict: 'EMPTY',
      verdictTitle: 'Ready to Compare',
      verdictDescription: 'Enter or paste information into both boxes to check whether the content matches.',
      isExactMatch: false,
      isNormalizedMatch: false,
      similarityScore: 0,
      levenshteinDistance: 0,
      charCountA: 0,
      charCountB: 0,
      wordCountA: 0,
      wordCountB: 0,
      lineCountA: 0,
      lineCountB: 0,
      isJson: false,
      wordDiffs: [],
      charDiffs: [],
      lineDiffs: [],
      mismatchSummary: [],
    };
  }

  const isExactMatch = infoA === infoB;
  const normA = normalizeText(infoA, options);
  const normB = normalizeText(infoB, options);
  const isNormalizedMatch = normA === normB;

  // JSON semantic check
  let isJson = false;
  let jsonEqual: boolean | undefined = undefined;
  let jsonErrorA: string | undefined = undefined;
  let jsonErrorB: string | undefined = undefined;

  if (options.autoDetectJson && infoA.trim().startsWith('{') || infoA.trim().startsWith('[')) {
    try {
      const parsedA = JSON.parse(infoA);
      try {
        const parsedB = JSON.parse(infoB);
        isJson = true;
        const sortedA = JSON.stringify(sortJsonObject(parsedA));
        const sortedB = JSON.stringify(sortJsonObject(parsedB));
        jsonEqual = sortedA === sortedB;
      } catch {
        jsonErrorB = 'Info 2 is not valid JSON';
      }
    } catch {
      jsonErrorA = 'Info 1 is not valid JSON';
    }
  }

  const similarityScore = isExactMatch ? 100 : computeSimilarityScore(normA, normB);
  const levDist = calculateLevenshtein(infoA, infoB);

  // Compute token diffs
  const wordsA = tokenizeWords(infoA);
  const wordsB = tokenizeWords(infoB);
  const wordDiffs = isExactMatch 
    ? [{ type: 'same' as const, value: infoA }]
    : diffTokens(wordsA, wordsB);

  const charsA = tokenizeChars(infoA);
  const charsB = tokenizeChars(infoB);
  const charDiffs = isExactMatch
    ? [{ type: 'same' as const, value: infoA }]
    : diffTokens(charsA, charsB);

  const lineDiffs = computeLineDiffs(infoA, infoB);

  // Generate actionable mismatch diagnostic summary
  const mismatchSummary: string[] = [];

  if (isExactMatch) {
    mismatchSummary.push('The two sets of information are 100% identical in characters, casing, and formatting.');
  } else {
    // Check if only casing is different
    if (infoA.toLowerCase() === infoB.toLowerCase()) {
      mismatchSummary.push('Only letter casing differs between the two texts (e.g. UPPERCASE vs lowercase).');
    }
    // Check if only whitespace differs
    if (infoA.replace(/\s+/g, ' ').trim() === infoB.replace(/\s+/g, ' ').trim()) {
      mismatchSummary.push('Texts are identical except for spacing, indentation, or newline differences.');
    }
    // Check if lengths differ
    if (charCountA !== charCountB) {
      const diff = Math.abs(charCountA - charCountB);
      mismatchSummary.push(`Length mismatch: Info 1 is ${charCountA} chars, Info 2 is ${charCountB} chars (${diff} character difference).`);
    }
    // Check word count
    if (wordCountA !== wordCountB) {
      const diff = Math.abs(wordCountA - wordCountB);
      mismatchSummary.push(`Word count mismatch: Info 1 has ${wordCountA} words, Info 2 has ${wordCountB} words (${diff} word difference).`);
    }
    // JSON details
    if (isJson) {
      if (jsonEqual) {
        mismatchSummary.push('JSON Semantic Match: Both represent the exact same JSON data structure and values (regardless of property order or indentation).');
      } else {
        mismatchSummary.push('JSON Structure Mismatch: The JSON objects contain different keys, array items, or data values.');
      }
    }
  }

  // Verdict calculation
  let verdict: MatchVerdictType = 'NO_MATCH';
  let verdictTitle = 'Content Does Not Match';
  let verdictDescription = `Found discrepancies between the two inputs (${similarityScore}% match).`;

  if (isExactMatch) {
    verdict = 'EXACT_MATCH';
    verdictTitle = 'Exact Match (100% Identical)';
    verdictDescription = 'Every single character, space, and line matches perfectly between both sources.';
  } else if (isNormalizedMatch || (isJson && jsonEqual)) {
    verdict = 'NORMALIZED_MATCH';
    verdictTitle = 'Content Matched with Selected Tolerances';
    verdictDescription = isJson && jsonEqual 
      ? 'Valid JSON match: Both payloads represent the identical semantic data.'
      : 'The content matches completely when applying your current filter settings (casing / whitespace / punctuation).';
  } else if (similarityScore >= 80) {
    verdict = 'HIGH_SIMILARITY';
    verdictTitle = 'Content Closely Matched';
    verdictDescription = `Very high similarity (${similarityScore}%). Minor differences or edits detected.`;
  } else if (similarityScore >= 40) {
    verdict = 'PARTIAL_MATCH';
    verdictTitle = 'Partial Match';
    verdictDescription = `Moderate similarity (${similarityScore}%). Several sentences, words, or values differ.`;
  } else {
    verdict = 'NO_MATCH';
    verdictTitle = 'Content Does Not Match';
    verdictDescription = `Low similarity (${similarityScore}%). The two inputs contain substantially different content.`;
  }

  return {
    verdict,
    verdictTitle,
    verdictDescription,
    isExactMatch,
    isNormalizedMatch,
    similarityScore,
    levenshteinDistance: levDist,
    charCountA,
    charCountB,
    wordCountA,
    wordCountB,
    lineCountA,
    lineCountB,
    isJson,
    jsonEqual,
    jsonErrorA,
    jsonErrorB,
    wordDiffs,
    charDiffs,
    lineDiffs,
    mismatchSummary,
  };
}
