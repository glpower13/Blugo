import { describe, expect, it } from 'vitest';
import {
  analyzeAnswer,
  diffChars,
  gradeTyped,
  hintFor,
  levenshtein,
  normalizeAnswer,
} from './answerCheck';

describe('answerCheck', () => {
  it('normalizes case, trailing punctuation and spacing but keeps diacritics', () => {
    expect(normalizeAnswer('  Hur MÅR du? ')).toBe('hur mår du');
    expect(normalizeAnswer('Jag  heter')).toBe('jag heter');
  });

  it('levenshtein counts edits', () => {
    expect(levenshtein('abc', 'abc')).toBe(0);
    expect(levenshtein('abc', 'abx')).toBe(1);
    expect(levenshtein('', 'abc')).toBe(3);
  });

  it('grades an exact (normalised) answer as good', () => {
    expect(gradeTyped('Kan du hjälpa mig?', 'kan du hjälpa mig?')).toBe('good');
  });

  it('grades a small typo as hard', () => {
    expect(gradeTyped('kan du hjälpa mej', 'kan du hjälpa mig')).toBe('hard'); // 1 edit
  });

  it('grades a wrong or empty answer as again', () => {
    expect(gradeTyped('helt fel', 'kan du hjälpa mig')).toBe('again');
    expect(gradeTyped('   ', 'jag heter')).toBe('again');
  });

  it('ignores a missing diacritic only within the typo tolerance', () => {
    // "mar" vs "mår" is a single edit → hard, not silently good
    expect(gradeTyped('hur mar du', 'hur mår du')).toBe('hard');
  });
});

describe('answerCheck — formatives Feedback', () => {
  it('diffChars: identisch → alles "same"', () => {
    expect(diffChars('hej', 'hej')).toEqual([{ text: 'hej', kind: 'same' }]);
  });

  it('diffChars: Invariante — same+missing = Ziel, same+extra = Eingabe', () => {
    const cases: [string, string][] = [
      ['mar', 'mår'],
      ['kan du hjelpa mig', 'kan du hjälpa mig'],
      ['', 'jag heter'],
      ['zuviel text', 'text'],
    ];
    for (const [typed, target] of cases) {
      const parts = diffChars(typed, target);
      const rebuiltTarget = parts.filter((p) => p.kind !== 'extra').map((p) => p.text).join('');
      const rebuiltTyped = parts.filter((p) => p.kind !== 'missing').map((p) => p.text).join('');
      expect(rebuiltTarget).toBe(target);
      expect(rebuiltTyped).toBe(typed);
    }
  });

  it('hintFor: gezielt je nach Abweichung', () => {
    expect(hintFor('hej', 'hej')).toMatch(/richtig/i);
    expect(hintFor('hur mar du', 'hur mår du')).toMatch(/å, ä, ö/);
    expect(hintFor('', 'jag heter')).toMatch(/tippe/i);
    expect(hintFor('völlig daneben', 'jag heter')).toMatch(/Wort für Wort/i);
  });

  it('analyzeAnswer: exakt → correct + good; falsch → correct=false + Diff', () => {
    const ok = analyzeAnswer('Jag heter', 'jag heter');
    expect(ok.correct).toBe(true);
    expect(ok.grade).toBe('good');

    const bad = analyzeAnswer('jag hetar', 'jag heter');
    expect(bad.correct).toBe(false);
    expect(bad.diff.some((p) => p.kind !== 'same')).toBe(true);
  });
});
