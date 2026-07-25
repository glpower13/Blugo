// Tests der Datenmitnahme (docs/gremium-einstellungen.md §2.1).
//
// Die wichtigste Zusicherung steht ganz unten: Einlesen darf NIEMALS geleistete
// Arbeit vernichten. Wer auf zwei Geräten lernt, hat auf beiden echte Abrufe
// gemacht — ein „Datei gewinnt" würde die Hälfte davon löschen.

import { describe, expect, it } from 'vitest';
import {
  backupFilename,
  buildBackup,
  isFurther,
  mergeStates,
  parseBackup,
} from './transfer';
import { initialState } from '../modules/memory/memoryEngine';
import { defaultPreferences } from '../session/preferences';
import type { ChunkState } from '../domain/chunk';

const NOW = 1_700_000_000_000;

function st(id: string, o: Partial<ChunkState> = {}): ChunkState {
  return { ...initialState(id, NOW), ...o };
}

const review = (at: number) => ({ at, result: 'good' as const, segmentId: 's' });

describe('buildBackup / parseBackup', () => {
  it('kommt heil durch Schreiben und Lesen', () => {
    const b = buildBackup([st('a')], 'Andreas', defaultPreferences(), NOW);
    const back = parseBackup(JSON.stringify(b));
    expect(back.name).toBe('Andreas');
    expect(back.states).toHaveLength(1);
    expect(back.exportedAt).toBe(NOW);
  });

  it('sagt bei kaputtem Inhalt, was los ist — nicht „unexpected token"', () => {
    expect(() => parseBackup('{kaputt')).toThrow(/lesbare Sicherungsdatei/);
  });

  it('weist fremde Dateien ab', () => {
    expect(() => parseBackup(JSON.stringify({ app: 'anki', states: [] }))).toThrow(
      /nicht aus NEUROLANG/,
    );
  });

  it('weist eine Sicherung aus einer NEUEREN App-Fassung ab, statt zu raten', () => {
    expect(() =>
      parseBackup(JSON.stringify({ app: 'neurolang', version: 99, states: [st('a')] })),
    ).toThrow(/neueren Fassung/);
  });

  it('weist eine leere Sicherung ab (sonst „erfolgreich nichts eingelesen")', () => {
    expect(() => parseBackup(JSON.stringify({ app: 'neurolang', version: 1, states: [] }))).toThrow(
      /kein Lernstand/,
    );
  });

  it('wirft kaputte Einzel-Stände weg, statt die ganze Datei abzulehnen', () => {
    const b = parseBackup(
      JSON.stringify({ app: 'neurolang', version: 1, states: [st('a'), { müll: true }] }),
    );
    expect(b.states).toHaveLength(1);
  });

  it('gibt der Datei ein Datum im Namen', () => {
    expect(backupFilename(new Date(2026, 6, 25))).toBe('neurolang-2026-07-25.json');
  });
});

describe('isFurther — welcher Stand ist weiter?', () => {
  it('bewiesen stabil schlägt alles', () => {
    const proven = st('a', { provenStableAt: NOW, history: [review(NOW)] });
    const busy = st('a', { history: [review(NOW), review(NOW + 1), review(NOW + 2)] });
    expect(isFurther(proven, busy)).toBe(true);
  });

  it('sonst gewinnt, wer mehr echte Abrufe hat', () => {
    const many = st('a', { history: [review(NOW), review(NOW + 1)], lastReviewedAt: NOW + 1 });
    const recent = st('a', { history: [review(NOW + 99)], lastReviewedAt: NOW + 99 });
    expect(isFurther(many, recent)).toBe(true);
  });

  it('bei gleichem Umfang gewinnt der zuletzt wiederholte', () => {
    const older = st('a', { history: [review(NOW)], lastReviewedAt: NOW });
    const newer = st('a', { history: [review(NOW + 5)], lastReviewedAt: NOW + 5 });
    expect(isFurther(newer, older)).toBe(true);
  });
});

describe('mergeStates — Einlesen darf nichts vernichten', () => {
  it('übernimmt Wendungen, die es hier noch nicht gab', () => {
    const r = mergeStates([st('a')], [st('b', { history: [review(NOW)] })]);
    expect(r.added).toBe(1);
    expect(r.merged).toHaveLength(2);
  });

  it('übernimmt den weiteren Stand aus der Datei', () => {
    const mine = st('a');
    const theirs = st('a', { history: [review(NOW)], lastReviewedAt: NOW });
    const r = mergeStates([mine], [theirs]);
    expect(r.updated).toBe(1);
    expect(r.merged[0].history).toHaveLength(1);
  });

  it('BEHÄLT den eigenen Stand, wenn er weiter ist — der ganze Punkt', () => {
    const mine = st('a', {
      history: [review(NOW), review(NOW + 1)],
      lastReviewedAt: NOW + 1,
      provenStableAt: NOW + 1,
    });
    const theirs = st('a'); // frisch angelegt, „neuer", aber leer
    const r = mergeStates([mine], [theirs]);
    expect(r.kept).toBe(1);
    expect(r.merged[0].provenStableAt).toBe(NOW + 1);
  });

  it('verliert bei keiner Richtung eine Wendung', () => {
    const mine = [st('a'), st('b')];
    const theirs = [st('b'), st('c')];
    expect(mergeStates(mine, theirs).merged).toHaveLength(3);
    expect(mergeStates(theirs, mine).merged).toHaveLength(3);
  });
});
