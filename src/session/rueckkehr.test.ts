// Der Rückkehrer ist der Grund, warum es diese App gibt. Diese Tests halten
// fest, was er bekommt — und, genauso wichtig, was einem täglichen Nutzer NICHT
// passiert, nur weil es den Rückkehr-Fall gibt.

import { describe, expect, it } from 'vitest';
import type { ChunkState } from '../domain/chunk';
import { initialState, schedule } from '../modules/memory/memoryEngine';
import { buildQueue } from './buildQueue';
import {
  abrufchance,
  nachRettbarkeit,
  PORTION,
  RETTBAR_MINIMUM,
  rueckkehrLage,
  RUECKKEHR_AB,
} from './rueckkehr';

const TAG = 86_400_000;
const START = Date.UTC(2026, 0, 1);

/** Eine geübte Wendung mit gesetzter Stabilität — so lässt sich gezielt prüfen. */
function geuebt(id: string, stabilitaet: number, zuletzt: number): ChunkState {
  return {
    ...initialState(id),
    stability: stabilitaet,
    difficulty: 5,
    lastReviewedAt: zuletzt,
    dueAt: zuletzt + stabilitaet * TAG,
    status: 'maintenance',
    history: [{ at: zuletzt, result: 'good', segmentId: 's' }],
  };
}

/** Ein realistischer Lernstand: verschieden oft geübt, verschieden gut. */
function lernstand(anzahl: number): ChunkState[] {
  return Array.from({ length: anzahl }, (_, i) => {
    let s = initialState(`c${i}`);
    let t = START;
    for (let k = 0; k <= i % 6; k++) {
      s = schedule(s, i % 7 === 0 ? 'again' : i % 7 === 1 ? 'hard' : 'good', 'seg', t, {
        retention: 0.9,
      });
      t = s.dueAt;
    }
    return s;
  });
}

describe('Abrufchance', () => {
  it('sinkt mit der Zeit', () => {
    const s = geuebt('a', 10, START);
    expect(abrufchance(s, START)).toBeCloseTo(1, 2);
    expect(abrufchance(s, START + 10 * TAG)).toBeCloseTo(0.9, 2);
    // Und zwar LANGSAM: Die FSRS-Kurve ist ein Potenzgesetz, kein exponentieller
    // Absturz. Nach 200 Tagen sind es immer noch rund 42 % — genau deshalb lohnt
    // die Unterscheidung „noch da" / „weg" überhaupt.
    expect(abrufchance(s, START + 200 * TAG)).toBeCloseTo(0.42, 2);
  });

  it('behandelt nie Geübtes nicht als vergessen', () => {
    expect(abrufchance(initialState('neu'), START)).toBe(1);
  });
});

describe('Reihenfolge nach Rettbarkeit', () => {
  it('setzt noch Abrufbares VOR stark Verblasstes', () => {
    const jetzt = START + 100 * TAG;
    // Die verblasste ist am längsten überfällig — heute käme sie zuerst.
    const verblasst = geuebt('weg', 0.5, START);
    const rettbar = geuebt('haltbar', 60, START + 40 * TAG);
    expect(abrufchance(verblasst, jetzt)).toBeLessThan(RETTBAR_MINIMUM);
    expect(abrufchance(rettbar, jetzt)).toBeGreaterThan(RETTBAR_MINIMUM);

    const raus = nachRettbarkeit([verblasst, rettbar], jetzt).map((s) => s.chunkId);
    expect(raus).toEqual(['haltbar', 'weg']);
  });

  it('lässt das Verblasste NICHT verschwinden — es kommt nur später', () => {
    const jetzt = START + 100 * TAG;
    const raus = nachRettbarkeit([geuebt('weg', 0.5, START), geuebt('haltbar', 60, START + 40 * TAG)], jetzt);
    expect(raus).toHaveLength(2);
  });

  it('behält innerhalb des Rettbaren „am längsten überfällig zuerst"', () => {
    const jetzt = START + 50 * TAG;
    const frueher = geuebt('frueher', 40, START);
    const spaeter = geuebt('spaeter', 40, START + 5 * TAG);
    expect(nachRettbarkeit([spaeter, frueher], jetzt).map((s) => s.chunkId)).toEqual([
      'frueher',
      'spaeter',
    ]);
  });
});

describe('Die Portion', () => {
  it('begrenzt die Sitzung — statt den ganzen Rückstand hinzustellen', () => {
    const states = lernstand(120);
    const jetzt = Math.max(...states.map((s) => s.lastReviewedAt ?? 0)) + 30 * TAG;
    const q = buildQueue(states, jetzt, 0);
    expect(q.length).toBeLessThanOrEqual(PORTION);
  });

  it('gibt dem Rückkehrer eine deutlich bessere Startchance', () => {
    // Der eigentliche Befund, als Messung festgehalten: Vorher lag die
    // Abrufchance der ersten Wendungen weit unter dem Durchschnitt.
    const states = lernstand(120);
    const jetzt = Math.max(...states.map((s) => s.lastReviewedAt ?? 0)) + 30 * TAG;
    const nachId = new Map(states.map((s) => [s.chunkId, s]));

    const neu = buildQueue(states, jetzt, 0).map((id) => abrufchance(nachId.get(id)!, jetzt));
    const alt = states
      .filter((s) => s.dueAt <= jetzt && s.lastReviewedAt !== null)
      .sort((a, b) => a.dueAt - b.dueAt)
      .slice(0, PORTION)
      .map((s) => abrufchance(s, jetzt));

    const mittel = (l: number[]) => l.reduce((a, b) => a + b, 0) / l.length;
    // Der Befund in Zahlen: Die alte Reihenfolge legt dem Rückkehrer Wendungen
    // weit unter 10 % Abrufchance vor — er scheitert fast sicher an allen.
    //
    // Gemessen wird der ABSTAND, nicht ein Vielfaches: Ein Faktor bricht, sobald
    // sich die kleine Zahl im Nenner bewegt. Genau das ist am 2026-07-26
    // passiert, als der Mindestabstand für zähe Wendungen (`zaeh.ts`) die
    // schwächsten Wendungen auch in der ALTEN Reihenfolge entzerrte — die
    // Verbesserung war unverändert, die Behauptung „fünffach" nicht mehr.
    expect(mittel(alt)).toBeLessThan(0.1);
    expect(mittel(neu)).toBeGreaterThan(0.25);
    expect(mittel(neu) - mittel(alt)).toBeGreaterThan(0.2);
  });

  it('legt nur noch Rettbares in die Portion, solange genug davon da ist', () => {
    const states = lernstand(120);
    const jetzt = Math.max(...states.map((s) => s.lastReviewedAt ?? 0)) + 30 * TAG;
    const nachId = new Map(states.map((s) => [s.chunkId, s]));
    const chancen = buildQueue(states, jetzt, 0).map((id) => abrufchance(nachId.get(id)!, jetzt));
    expect(chancen.every((c) => c >= RETTBAR_MINIMUM)).toBe(true);
  });

  it('ändert für den TÄGLICHEN Nutzer nichts', () => {
    // Wer nie weg war, hat weniger fällig als eine Portion — er merkt von der
    // ganzen Sache nichts. Genau das ist die Bedingung, unter der sie gebaut
    // werden durfte.
    const wenige = [geuebt('a', 5, START), geuebt('b', 5, START), geuebt('c', 5, START)];
    const jetzt = START + 6 * TAG;
    expect(buildQueue(wenige, jetzt, 0)).toHaveLength(3);
    expect(rueckkehrLage(wenige, jetzt)).toBeNull();
  });
});

describe('Die Lage bei der Rückkehr', () => {
  it('meldet sich nicht an einem normalen Tag', () => {
    expect(rueckkehrLage(lernstand(5), START + TAG)).toBeNull();
  });

  it('beschönigt die Zahl NICHT', () => {
    const states = lernstand(120);
    const jetzt = Math.max(...states.map((s) => s.lastReviewedAt ?? 0)) + 30 * TAG;
    const lage = rueckkehrLage(states, jetzt)!;
    expect(lage).not.toBeNull();
    // Genau so viele, wie wirklich fällig sind.
    expect(lage.faellig).toBe(states.filter((s) => s.dueAt <= jetzt).length);
    expect(lage.faellig).toBeGreaterThanOrEqual(RUECKKEHR_AB);
    // Und die Aufteilung geht auf — keine Wendung fällt unter den Tisch.
    expect(lage.nochDa + lage.verblasst).toBe(lage.faellig);
  });

  it('sagt, wie lange die Pause war', () => {
    const states = [geuebt('a', 1, START), ...lernstand(60)];
    const zuletzt = Math.max(...states.map((s) => s.lastReviewedAt ?? 0));
    const lage = rueckkehrLage(states, zuletzt + 34 * TAG);
    expect(lage?.tageWeg).toBe(34);
  });

  it('nennt die Portion nie größer als das, was da ist', () => {
    const states = lernstand(120);
    const jetzt = Math.max(...states.map((s) => s.lastReviewedAt ?? 0)) + 30 * TAG;
    const lage = rueckkehrLage(states, jetzt)!;
    expect(lage.portion).toBeLessThanOrEqual(lage.faellig);
    expect(lage.portion).toBe(PORTION);
  });
});
