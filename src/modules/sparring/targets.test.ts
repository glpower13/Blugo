// Tests der Sparring-Logik (P4). Hier steht die Ehrlichkeit des Modus:
// Nachgeplappertes darf NIE zählen, und es darf nichts abgefragt werden, was
// der Lerner noch nie gesehen hat.

import { describe, expect, it } from 'vitest';
import {
  containsPhrase,
  matchedTargets,
  nearMisses,
  normalizePhrase,
  pickTargets,
} from './targets';
import { initialState } from '../memory/memoryEngine';
import type { Chunk, ChunkState } from '../../domain/chunk';

const NOW = 1_700_000_000_000;
const DAY = 86_400_000;

const chunk = (id: string, sv: string): Chunk => ({
  id,
  categoryId: 'k',
  sv,
  de: id,
  decoding: [],
});

function state(id: string, o: Partial<ChunkState> = {}): ChunkState {
  return { ...initialState(id, NOW), ...o };
}

describe('normalizePhrase', () => {
  it('räumt Groß-/Kleinschreibung, Satzzeichen und Leerzeichen weg', () => {
    expect(normalizePhrase('  Tack så MYCKET! ')).toBe('tack så mycket');
    expect(normalizePhrase('„Hej, hej."')).toBe('hej hej');
  });
});

describe('containsPhrase', () => {
  it('findet die Wendung mitten im Satz', () => {
    expect(containsPhrase('ja, tack så mycket för hjälpen', 'tack så mycket')).toBe(true);
  });

  it('achtet auf Wortgrenzen — „ha" steckt nicht in „hallå"', () => {
    expect(containsPhrase('hallå där', 'ha')).toBe(false);
  });

  it('ist bei leerer Wendung falsch, statt überall zu treffen', () => {
    expect(containsPhrase('vad som helst', '')).toBe(false);
  });
});

describe('matchedTargets — die Anti-Nachplapper-Regel', () => {
  const targets = [
    { sv: 'tack så mycket', de: 'vielen Dank' },
    { sv: 'jag skulle vilja ha', de: 'ich hätte gern' },
  ];

  it('zählt, was der Lerner selbst produziert hat', () => {
    const m = matchedTargets('tack så mycket', targets, 'Varsågod.');
    expect(m.map((t) => t.sv)).toEqual(['tack så mycket']);
  });

  it('zählt NICHT, was der Partner gerade selbst gesagt hat (Echo)', () => {
    const m = matchedTargets('tack så mycket', targets, 'Man säger tack så mycket här.');
    expect(m).toEqual([]);
  });

  it('erkennt mehrere Wendungen in einer Äußerung', () => {
    const m = matchedTargets('jag skulle vilja ha en kaffe, tack så mycket', targets);
    expect(m).toHaveLength(2);
  });

  it('erfindet nichts bei einer leeren Äußerung', () => {
    expect(matchedTargets('', targets)).toEqual([]);
  });
});

describe('pickTargets', () => {
  const chunks = [chunk('a', 'aaa'), chunk('b', 'bbb'), chunk('c', 'ccc')];

  it('nimmt nur fällige Wendungen, denen der Lerner schon begegnet ist', () => {
    const states = {
      a: state('a', { dueAt: NOW - DAY, history: [{ at: NOW, result: 'good', segmentId: 's' }] }),
      b: state('b', { dueAt: NOW - DAY }), // nie begegnet (status 'new', keine Historie)
      c: state('c', { dueAt: NOW + DAY, history: [{ at: NOW, result: 'good', segmentId: 's' }] }),
    };
    expect(pickTargets(chunks, states, NOW).map((c) => c.id)).toEqual(['a']);
  });

  it('stellt die Produktions-Stufe voran', () => {
    const states = {
      a: state('a', {
        dueAt: NOW - 5 * DAY,
        stage: 'recognition',
        history: [{ at: NOW, result: 'good', segmentId: 's' }],
      }),
      b: state('b', {
        dueAt: NOW - DAY,
        stage: 'production',
        history: [{ at: NOW, result: 'good', segmentId: 's' }],
      }),
      c: state('c', { dueAt: NOW + DAY }),
    };
    expect(pickTargets(chunks, states, NOW).map((c) => c.id)).toEqual(['b', 'a']);
  });

  it('gibt höchstens so viele zurück wie gewünscht', () => {
    const states = Object.fromEntries(
      chunks.map((c) => [
        c.id,
        state(c.id, { dueAt: NOW - DAY, history: [{ at: NOW, result: 'good', segmentId: 's' }] }),
      ]),
    );
    expect(pickTargets(chunks, states, NOW, 2)).toHaveLength(2);
  });
});

describe('nearMisses — Hinweis, aber niemals Punkte', () => {
  const targets = [
    { sv: 'jag skulle vilja ha', de: 'ich hätte gern' },
    { sv: 'tack så mycket', de: 'vielen Dank' },
  ];

  it('erkennt eine knapp verfehlte Endung', () => {
    const n = nearMisses('jag skulle vilja har en kaffe', targets);
    expect(n.map((m) => m.target.sv)).toEqual(['jag skulle vilja ha']);
  });

  it('meldet NICHTS, wenn die Wendung exakt kam — dann ist es ein echter Treffer', () => {
    expect(nearMisses('jag skulle vilja ha en kaffe', [targets[0]])).toEqual([]);
  });

  it('meldet nichts bei etwas völlig anderem', () => {
    expect(nearMisses('var ligger stationen', targets)).toEqual([]);
  });

  it('zeigt, WAS gesagt wurde — sonst kann der Lerner nichts damit anfangen', () => {
    const n = nearMisses('tack sa mycke', [targets[1]]);
    expect(n).toHaveLength(1);
    expect(n[0].said).toBe('tack sa mycke');
  });

  it('kommt mit einer leeren Äußerung klar', () => {
    expect(nearMisses('', targets)).toEqual([]);
  });
});
