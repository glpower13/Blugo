import { describe, expect, it } from 'vitest';
import { gradeTyped, levenshtein, normalizeAnswer } from './answerCheck';

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
