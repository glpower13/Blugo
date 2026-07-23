// Typed production check (docs/04-product.md, docs/03-method.md): on the
// production stage the learner actually PRODUCES the chunk (types it) instead
// of self-grading. Lenient normalisation — case, surrounding punctuation and
// extra spaces don't matter; Swedish diacritics (å ä ö) do.

import type { ReviewResult } from '../../domain/chunk';

export function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[.!?,;:]+$/g, '')
    .replace(/\s+/g, ' ');
}

/** Levenshtein edit distance (for "close but a typo" tolerance). */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

/**
 * Suggest a grade for a typed production answer:
 * exact (normalised) → good · within 2 edits → hard · otherwise → again.
 * The learner still confirms — this is a suggestion, not a verdict.
 */
export function gradeTyped(input: string, target: string): ReviewResult {
  const a = normalizeAnswer(input);
  const b = normalizeAnswer(target);
  if (a.length === 0) return 'again';
  if (a === b) return 'good';
  if (levenshtein(a, b) <= 2) return 'hard';
  return 'again';
}
