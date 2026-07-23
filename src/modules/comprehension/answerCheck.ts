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

// --- Formatives Feedback (docs/gremium-feedback.md, Schritt 1) ------------------
// Deterministisch gegen den GEPRÜFTEN Chunk — kein KI-Irrtums-Risiko. Zeigt die
// Abweichung (Noticing) und gibt EINEN sanften Hinweis (Focus on Form, freundlich).

export type DiffKind = 'same' | 'missing' | 'extra';
export interface DiffPart {
  text: string;
  kind: DiffKind; // same = korrekt · missing = fehlt (im Ziel) · extra = zu viel (getippt)
}

export interface AnswerAnalysis {
  correct: boolean; // exakter (normalisierter) Treffer
  grade: ReviewResult; // Vorschlag wie gehabt
  diff: DiffPart[]; // getippt → Ziel, zeichenweise ausgerichtet
  hint: string; // genau EIN freundlicher Hinweis
}

/** Zeichen-Diff getippt→Ziel über die längste gemeinsame Teilfolge (rein). */
export function diffChars(typed: string, target: string): DiffPart[] {
  const a = typed;
  const b = target;
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const parts: DiffPart[] = [];
  const push = (text: string, kind: DiffKind) => {
    const last = parts[parts.length - 1];
    if (last && last.kind === kind) last.text += text;
    else parts.push({ text, kind });
  };
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      push(a[i], 'same');
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      push(a[i], 'extra'); // im Getippten, nicht im Ziel
      i++;
    } else {
      push(b[j], 'missing'); // im Ziel, nicht getippt
      j++;
    }
  }
  while (i < m) push(a[i++], 'extra');
  while (j < n) push(b[j++], 'missing');
  return parts;
}

const foldDiacritics = (s: string): string =>
  s.replace(/å|ä/g, 'a').replace(/ö/g, 'o').replace(/é/g, 'e');

/** Ein einziger, freundlicher Hinweis passend zur Art der Abweichung (rein). */
export function hintFor(input: string, target: string): string {
  const a = normalizeAnswer(input);
  const b = normalizeAnswer(target);
  if (a.length === 0) return 'Versuch es — tippe, was du meinst.';
  if (a === b) return 'Genau richtig!';
  if (foldDiacritics(a) === foldDiacritics(b)) {
    return 'Fast! Achte auf die schwedischen Buchstaben å, ä, ö.';
  }
  if (levenshtein(a, b) <= 2) return 'Ganz nah dran — schau auf die markierten Stellen.';
  return 'Noch nicht ganz — vergleiche Wort für Wort mit der Markierung.';
}

/** Vollständige Analyse einer getippten Antwort gegen den geprüften Chunk. */
export function analyzeAnswer(input: string, target: string): AnswerAnalysis {
  const a = normalizeAnswer(input);
  const b = normalizeAnswer(target);
  return {
    correct: a.length > 0 && a === b,
    grade: gradeTyped(input, target),
    diff: diffChars(a, b),
    hint: hintFor(input, target),
  };
}
