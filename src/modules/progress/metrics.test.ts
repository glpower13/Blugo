import { describe, expect, it } from 'vitest';
import {
  computeMetrics,
  isStable,
  isMaturing,
  isHolding,
  directionSplit,
  spokenAloud,
} from './metrics';
import { initialState } from '../memory/memoryEngine';
import type { ChunkState } from '../../domain/chunk';

const NOW = 1_700_000_000_000;

function make(overrides: Partial<ChunkState>): ChunkState {
  return { ...initialState('x', NOW), ...overrides };
}

describe('metrics', () => {
  it('counts a chunk stable only once proven (provenStableAt set), not by scheduled interval', () => {
    // A long *scheduled* interval alone is NOT stable (anti-Goodhart)...
    expect(
      isStable(make({ status: 'maintenance', stage: 'production', intervalDays: 120 })),
    ).toBe(false);
    // ...only an actual proven recall after a long gap counts.
    expect(
      isStable(make({ status: 'maintenance', stage: 'production', provenStableAt: NOW })),
    ).toBe(true);
  });

  it('computeMetrics reports active, stable and due counts', () => {
    const states: ChunkState[] = [
      make({ chunkId: 'new', status: 'new' }), // untouched → not active
      make({ chunkId: 'learn', status: 'learning', history: [{ at: NOW, result: 'good', segmentId: 's' }] }),
      make({ chunkId: 'stable', status: 'maintenance', stage: 'production', intervalDays: 100, provenStableAt: NOW }),
      make({ chunkId: 'due', status: 'learning', dueAt: NOW - 1000, history: [{ at: NOW, result: 'good', segmentId: 's' }] }),
    ];
    const m = computeMetrics(states, NOW);
    expect(m.active).toBe(3); // learn, stable, due (new untouched excluded)
    expect(m.stable).toBe(1);
    expect(m.dueNow).toBeGreaterThanOrEqual(1);
  });

  it('coverage weights production-good full, recognition-good half, failure zero', () => {
    const prodGood = make({ chunkId: 'p', stage: 'production', history: [{ at: NOW, result: 'good', segmentId: 's' }] });
    const recogGood = make({ chunkId: 'r', stage: 'recognition', history: [{ at: NOW, result: 'good', segmentId: 's' }] });
    const bad = make({ chunkId: 'b', history: [{ at: NOW, result: 'again', segmentId: 's' }] });
    const m = computeMetrics([prodGood, recogGood, bad], NOW);
    expect(m.active).toBe(3);
    expect(m.coverage).toBeCloseTo((1 + 0.5) / 3); // = 0.5
  });

  it('coverage is 0 when nothing is active', () => {
    expect(computeMetrics([make({ status: 'new' })], NOW).coverage).toBe(0);
  });

  it('„reift" zählt nur ÜBERSTANDENE Pausen, kein bloß geplantes Intervall', () => {
    // Ein langes GEPLANTES Intervall ist eine Prognose. Die Oberfläche sagt aber
    // „überstanden" — also darf nur der gemessene Vermerk zählen.
    const nurGeplant = make({ chunkId: 'g', stage: 'production', intervalDays: 50 });
    const ueberstanden = make({ chunkId: 'm', stage: 'production', intervalDays: 50, maturedAt: NOW });
    const proven = make({
      chunkId: 's',
      stage: 'production',
      intervalDays: 120,
      maturedAt: NOW,
      provenStableAt: NOW,
    });
    const m = computeMetrics([nurGeplant, ueberstanden, proven], NOW);
    expect(m.maturing).toBe(1); // nur die tatsächlich überstandene, noch unbewiesene
    expect(m.stable).toBe(1); // die bewiesene zählt NICHT zusätzlich als reifend
  });

  it('ein Fehlschlag NACH dem Beweis nimmt den Beweis wieder weg', () => {
    // Die große Zahl behauptet Gegenwart („was du wirklich behalten hast").
    // Hat die App gerade das Gegenteil gemessen, darf sie nicht weiterzählen.
    const gefallen = make({
      chunkId: 'x',
      stage: 'production',
      provenStableAt: NOW,
      maturedAt: NOW,
      lapsedAt: NOW + 1000,
      history: [{ at: NOW + 1000, result: 'again', segmentId: 's' }],
    });
    expect(isStable(gefallen)).toBe(false);
    expect(isMaturing(gefallen)).toBe(false);
    // Gelingt der Beweis danach erneut, zählt er wieder.
    expect(isStable({ ...gefallen, provenStableAt: NOW + 2000 })).toBe(true);
  });
});

describe('directionSplit — die Richtung ist gemessen, nicht gewählt', () => {
  it('zählt nie begegnete Wendungen NICHT als „du verstehst sie"', () => {
    // Eine frische Wendung steht per Voreinstellung auf `recognition`. Sie als
    // verstanden zu zählen wäre die Lüge, gegen die dieses Projekt gebaut ist.
    const d = directionSplit([initialState('a', NOW), initialState('b', NOW)]);
    expect(d.untouched).toBe(2);
    expect(d.recognition).toBe(0);
    expect(d.production).toBe(0);
  });

  it('trennt Verstehen und Selbst-Sagen anhand der Stufe', () => {
    const seen = (id: string, stage: 'recognition' | 'production') => ({
      ...initialState(id, NOW),
      stage,
      status: 'learning' as const,
      history: [{ at: NOW, result: 'good' as const, segmentId: 's' }],
    });
    const d = directionSplit([seen('a', 'recognition'), seen('b', 'production'), seen('c', 'production')]);
    expect(d).toEqual({ untouched: 0, struggling: 0, recognition: 1, production: 2 });
  });

  it('führt eine nie gekonnte Wendung NICHT als „du verstehst sie"', () => {
    // Dreimal „Nochmal" ist gemessenes Scheitern. Es als Verständnis zu zählen
    // wäre genau die Sorte Zahl, gegen die dieses Projekt gebaut ist.
    const nurGescheitert = {
      ...initialState('a', NOW),
      status: 'learning' as const,
      history: [
        { at: NOW, result: 'again' as const, segmentId: 's' },
        { at: NOW + 1, result: 'again' as const, segmentId: 's' },
        { at: NOW + 2, result: 'again' as const, segmentId: 's' },
      ],
    };
    const d = directionSplit([nurGescheitert]);
    expect(d.struggling).toBe(1);
    expect(d.recognition).toBe(0);
  });

  it('die vier Eimer ergeben zusammen immer die Gesamtzahl', () => {
    const states = [
      initialState('a', NOW),
      { ...initialState('b', NOW), status: 'learning' as const, history: [{ at: NOW, result: 'again' as const, segmentId: 's' }] },
      { ...initialState('c', NOW), status: 'learning' as const, history: [{ at: NOW, result: 'good' as const, segmentId: 's' }] },
      { ...initialState('d', NOW), stage: 'production' as const, status: 'learning' as const, history: [{ at: NOW, result: 'good' as const, segmentId: 's' }] },
    ];
    const d = directionSplit(states);
    expect(d.untouched + d.struggling + d.recognition + d.production).toBe(states.length);
  });
});

describe('spokenAloud (P3, docs/gremium-sprachpartner.md)', () => {
  it('zählt Wendungen, die laut gesagt UND richtig erkannt wurden', () => {
    const a = make({
      chunkId: 'a',
      history: [{ at: NOW, result: 'good', segmentId: 's1', spoken: true }],
    });
    const b = make({ chunkId: 'b', history: [{ at: NOW, result: 'good', segmentId: 's1' }] });
    expect(spokenAloud([a, b])).toBe(1);
  });

  it('zählt eine Wendung nur EINMAL, egal wie oft sie gesprochen wurde', () => {
    const a = make({
      chunkId: 'a',
      history: [
        { at: NOW, result: 'good', segmentId: 's1', spoken: true },
        { at: NOW + 1, result: 'good', segmentId: 's2', spoken: true },
      ],
    });
    expect(spokenAloud([a])).toBe(1);
  });

  it('ist ohne Sprechen schlicht null — keine Anwesenheitszahl', () => {
    expect(spokenAloud([make({ chunkId: 'a' })])).toBe(0);
  });
});

describe('„fällig" ist Wiederholung, nicht Vorrat', () => {
  it('zählt nie begegnete Wendungen NICHT als fällig', () => {
    // Eine frische Wendung steht per Voreinstellung auf „jetzt fällig". Am
    // ersten Tag las man deshalb „179 jetzt fällig", ohne je etwas gesehen zu
    // haben — eine Zahl, die Rückstand behauptet, wo keiner ist.
    const frisch = make({ chunkId: 'n', status: 'new', dueAt: NOW });
    const wirklichFaellig = make({
      chunkId: 'f',
      status: 'learning',
      dueAt: NOW - 1000,
      history: [{ at: NOW - 2000, result: 'good', segmentId: 's' }],
    });
    const m = computeMetrics([frisch, wirklichFaellig], NOW);
    expect(m.dueNow).toBe(1);
    expect(m.untouched).toBe(1);
  });
});

// ── Die kleinste ehrliche Stufe („gehalten") ──────────────────────────────────
//
// Diese Stufe ist die riskanteste Zahl der ganzen App: Sie ist dazu da, in den
// ersten Wochen etwas zu zeigen — genau die Lage, in der jede andere App anfängt
// zu schummeln. Die Tests hier prüfen deshalb vor allem, was NICHT zählt.
describe('gehalten — eine überstandene Pause von drei Tagen', () => {
  const TAG = 86_400_000;
  const T0 = Date.UTC(2026, 0, 1);
  const mit = (h: { at: number; result: 'again' | 'hard' | 'good' }[], lapsedAt: number | null = null) =>
    ({
      ...initialState('c'),
      lastReviewedAt: h[h.length - 1]?.at ?? null,
      lapsedAt,
      history: h.map((x) => ({ ...x, segmentId: 's' })),
    }) as ChunkState;

  it('zählt eine Wendung, die nach drei Tagen wieder abgerufen wurde', () => {
    expect(isHolding(mit([
      { at: T0, result: 'good' },
      { at: T0 + 3 * TAG, result: 'good' },
    ]))).toBe(true);
  });

  it('zählt ANWESENHEIT nicht — üben ohne Pause bringt nichts', () => {
    // Zehn Abrufe an einem Tag sind zehn Abrufe, aber keine überstandene Pause.
    const gleicherTag = Array.from({ length: 10 }, (_, i) => ({
      at: T0 + i * 3600_000,
      result: 'good' as const,
    }));
    expect(isHolding(mit(gleicherTag))).toBe(false);
  });

  it('zählt einen FEHLSCHLAG nach langer Pause nicht als Halten', () => {
    // Der wichtigste Fall: „Nochmal" nach drei Wochen beweist, dass es weg war.
    expect(isHolding(mit([
      { at: T0, result: 'good' },
      { at: T0 + 21 * TAG, result: 'again' },
    ]))).toBe(false);
  });

  it('zählt eine zu kurze Pause nicht', () => {
    expect(isHolding(mit([
      { at: T0, result: 'good' },
      { at: T0 + 2 * TAG, result: 'good' },
    ]))).toBe(false);
  });

  it('verfällt nach einem späteren Fehlschlag — wie „reift" und „bewiesen"', () => {
    const s = mit(
      [
        { at: T0, result: 'good' },
        { at: T0 + 5 * TAG, result: 'good' },
      ],
      T0 + 9 * TAG,
    );
    expect(isHolding(s)).toBe(false);
  });

  it('lebt wieder auf, wenn die Pause danach erneut überstanden wird', () => {
    const s = mit(
      [
        { at: T0, result: 'good' },
        { at: T0 + 5 * TAG, result: 'good' },
        { at: T0 + 20 * TAG, result: 'good' },
      ],
      T0 + 9 * TAG,
    );
    expect(isHolding(s)).toBe(true);
  });

  it('ist eine OBERMENGE — was 90 Tage hält, hält auch drei', () => {
    const s = { ...mit([
      { at: T0, result: 'good' },
      { at: T0 + 95 * TAG, result: 'good' },
    ]), provenStableAt: T0 + 95 * TAG } as ChunkState;
    expect(isStable(s)).toBe(true);
    expect(isHolding(s)).toBe(true);
  });
});
