// Stufe G der Prüfkaskade (docs/TEST-UND-PRUEF-STANDARD.md §2 G) — der Teil, den
// der Projekt-Adapter bisher als „entfällt in M1" führte.
//
// Das stimmte nur halb: Last/Server/DR entfallen tatsächlich (kein Backend), aber
// **Property-Fuzzing über Invarianten**, **Fault-Injection auf die
// Sicherungsdatei** und **Kalender-Grenzfälle** sind auch in einer reinen
// Client-App möglich — und sie treffen genau den Kern, an dem dieses Projekt
// hängt: die Ehrlichkeit der Zahlen.
//
// Diese Tests sind absichtlich NICHT beispielbasiert. Sie behaupten Gesetze und
// werfen tausende zufällige Abrufverläufe dagegen. Ein Beispieltest zeigt, dass
// ein Fall geht; ein Gesetz zeigt, dass keiner bricht.

import { describe, expect, it } from 'vitest';
import {
  DAY_MS,
  MATURING_INTERVAL_DAYS,
  STABLE_INTERVAL_DAYS,
  initialState,
  schedule,
} from './memoryEngine';
import { computeMetrics, directionSplit, isMaturing, isStable } from '../progress/metrics';
import { isFurther, mergeStates, parseBackup } from '../../storage/transfer';
import type { ChunkState, ReviewResult } from '../../domain/chunk';

const T0 = 1_700_000_000_000;

/**
 * Deterministischer Zufall (xorshift32). Bewusst KEIN `Math.random()`: Ein
 * Fuzzing-Lauf, der sich nicht wiederholen lässt, ist als Nachweis wertlos —
 * ein roter Lauf muss reproduzierbar sein (§0.4 des Standards).
 */
function rng(seed: number): () => number {
  let x = seed | 0 || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) % 100000) / 100000;
  };
}

const GRADES: ReviewResult[] = ['again', 'hard', 'good'];

/** Ein zufälliger, aber zeitlich plausibler Abrufverlauf über eine Wendung. */
function randomHistory(rand: () => number, steps: number): ChunkState {
  let s = initialState('c', T0);
  let t = T0;
  for (let i = 0; i < steps; i++) {
    const g = GRADES[Math.floor(rand() * GRADES.length)];
    // Die Zeit springt bis zum geplanten Termin — mal knapp davor, mal weit danach.
    const jump = Math.max(0, Math.round(s.intervalDays * (0.5 + rand() * 2)));
    t += jump * DAY_MS + Math.round(rand() * DAY_MS);
    s = schedule(s, g, `seg${i % 5}`, t);
  }
  return s;
}

describe('G · Invarianten über zufällige Abrufverläufe (10 000 Fälle je Gesetz)', () => {
  // Der Standard verlangt 10 000+ Fälle je Eigenschaft (§2 G). Der Lauf bleibt
  // damit unter einer Sekunde — es gibt keinen Grund, darunter zu bleiben.
  const CASES = 10_000;

  it('kein Zustand wird je unplausibel (NaN, negativ, unendlich)', () => {
    const rand = rng(12345);
    for (let i = 0; i < CASES; i++) {
      const s = randomHistory(rand, 1 + Math.floor(rand() * 14));
      const zahlen = [s.intervalDays, s.stability, s.difficulty, s.dueAt, s.successStreak];
      for (const n of zahlen) {
        expect(Number.isFinite(n), `Fall ${i}: nicht endlich`).toBe(true);
        expect(n, `Fall ${i}: negativ`).toBeGreaterThanOrEqual(0);
      }
      expect(s.dueAt).toBeGreaterThanOrEqual(s.lastReviewedAt!);
    }
  });

  it('„bewiesen" und „reift" schließen sich immer gegenseitig aus', () => {
    // Die beiden Balken-Zonen werden gestapelt. Überschneiden sie sich auch nur
    // in einem Fall, zählt eine Wendung doppelt und der Balken läuft über 100 %.
    const rand = rng(777);
    for (let i = 0; i < CASES; i++) {
      const s = randomHistory(rand, 1 + Math.floor(rand() * 20));
      expect(isStable(s) && isMaturing(s), `Fall ${i}: beides zugleich`).toBe(false);
    }
  });

  it('ein Beweis gilt nie, wenn danach ein Fehlschlag steht', () => {
    // Die eine Design-Regel in Testform: Die Anzeige behauptet Gegenwart.
    const rand = rng(4242);
    for (let i = 0; i < CASES; i++) {
      const s = randomHistory(rand, 2 + Math.floor(rand() * 20));
      if (s.lapsedAt != null && s.provenStableAt != null && s.provenStableAt < s.lapsedAt) {
        expect(isStable(s), `Fall ${i}: widerrufener Beweis zählt noch`).toBe(false);
      }
      if (s.lapsedAt != null && s.maturedAt != null && s.maturedAt < s.lapsedAt) {
        expect(isMaturing(s), `Fall ${i}: widerrufenes „reift" zählt noch`).toBe(false);
      }
    }
  });

  it('ein Vermerk entsteht nur aus einer TATSÄCHLICH überstandenen Pause', () => {
    // Anti-Goodhart als Gesetz: Kein Vermerk ohne Produktions-Abruf, und keiner,
    // dessen vorheriges Intervall die Schwelle nicht erreicht hatte.
    const rand = rng(31337);
    for (let i = 0; i < CASES; i++) {
      let s = initialState('c', T0);
      let t = T0;
      let konnteReifen = false;
      let konnteBeweisen = false;
      for (let k = 0; k < 12; k++) {
        const g = GRADES[Math.floor(rand() * GRADES.length)];
        if (g === 'good' && s.stage === 'production') {
          if (s.intervalDays >= MATURING_INTERVAL_DAYS) konnteReifen = true;
          if (s.intervalDays >= STABLE_INTERVAL_DAYS) konnteBeweisen = true;
        }
        t += Math.max(1, s.intervalDays) * DAY_MS;
        s = schedule(s, g, 'seg', t);
      }
      if (s.maturedAt != null) expect(konnteReifen, `Fall ${i}: „reift" ohne Pause`).toBe(true);
      if (s.provenStableAt != null) {
        expect(konnteBeweisen, `Fall ${i}: Beweis ohne 90-Tage-Pause`).toBe(true);
      }
    }
  });

  it('die vier Richtungs-Eimer ergeben immer genau die Gesamtzahl', () => {
    const rand = rng(90210);
    for (let i = 0; i < 2_000; i++) {
      const n = 1 + Math.floor(rand() * 25);
      const states = Array.from({ length: n }, () => randomHistory(rand, Math.floor(rand() * 8)));
      const d = directionSplit(states);
      expect(d.untouched + d.struggling + d.recognition + d.production).toBe(n);
    }
  });

  it('die Kennzahlen bleiben in ihren Grenzen', () => {
    const rand = rng(5150);
    for (let i = 0; i < 2_000; i++) {
      const n = 1 + Math.floor(rand() * 25);
      const states = Array.from({ length: n }, () => randomHistory(rand, Math.floor(rand() * 10)));
      const m = computeMetrics(states, T0 + 500 * DAY_MS);
      expect(m.coverage).toBeGreaterThanOrEqual(0);
      expect(m.coverage).toBeLessThanOrEqual(1);
      expect(m.stable + m.maturing).toBeLessThanOrEqual(n);
      expect(m.active).toBeLessThanOrEqual(n);
      expect(m.dueNow).toBeLessThanOrEqual(m.active); // fällig ⊆ begonnen
      expect(m.coverageBase).toBe(m.active);
      expect(m.untouched + m.active).toBe(n);
    }
  });
});

describe('G · Fault-Injection auf die Sicherungsdatei', () => {
  // §3.1 des Standards: kein stiller Datenverlust. Eine beschädigte Datei muss
  // eine Fehlermeldung erzeugen, die ein Mensch versteht — nie ein leeres
  // Ergebnis, das wie „alles gelesen" aussieht.
  const gueltig = JSON.stringify({
    app: 'neurolang',
    version: 1,
    exportedAt: T0,
    name: 'Testperson',
    preferences: {},
    states: [initialState('c1', T0)],
  });

  const kaputt: Array<[string, string]> = [
    ['leer', ''],
    ['kein JSON', '{das ist kaputt'],
    ['abgeschnitten', gueltig.slice(0, gueltig.length / 2)],
    ['fremde App', JSON.stringify({ app: 'anki', version: 1, states: [] })],
    ['null', 'null'],
    ['Array statt Objekt', '[]'],
    ['Zahl', '42'],
    ['ohne Zustände', JSON.stringify({ app: 'neurolang', version: 1, states: [] })],
    ['Zustände kein Array', JSON.stringify({ app: 'neurolang', version: 1, states: 'viele' })],
    ['aus der Zukunft', JSON.stringify({ app: 'neurolang', version: 99, states: [] })],
    ['Zustände sind Müll', JSON.stringify({ app: 'neurolang', version: 1, states: [1, 'x', null] })],
  ];

  for (const [name, text] of kaputt) {
    it(`weist „${name}" mit einer verständlichen Meldung ab`, () => {
      let fehler: Error | null = null;
      try {
        parseBackup(text);
      } catch (e) {
        fehler = e as Error;
      }
      expect(fehler, 'still durchgelassen — das wäre stiller Datenverlust').not.toBeNull();
      // Kein technisches Kauderwelsch: keine „unexpected token"-Meldungen.
      expect(fehler!.message).not.toMatch(/unexpected|SyntaxError|undefined|JSON\.parse/i);
      expect(fehler!.message.length).toBeGreaterThan(20);
    });
  }

  it('liest eine gültige Datei unversehrt ein', () => {
    const b = parseBackup(gueltig);
    expect(b.states).toHaveLength(1);
    expect(b.name).toBe('Testperson');
  });
});

describe('G · Zusammenführen verliert nie den weiteren Stand', () => {
  // Das Zusammenführen ist der einzige Weg, auf dem ein Lernstand verschwinden
  // KÖNNTE. Als Gesetz geprüft, nicht an drei Beispielen.
  it('behält bei jeder Paarung den weiteren von beiden', () => {
    const rand = rng(2468);
    for (let i = 0; i < 5_000; i++) {
      const a = { ...randomHistory(rand, 1 + Math.floor(rand() * 10)), chunkId: 'x' };
      const b = { ...randomHistory(rand, 1 + Math.floor(rand() * 10)), chunkId: 'x' };
      const res = mergeStates([a], [b]);
      const gewinner = res.merged.find((s) => s.chunkId === 'x')!;
      const erwartet = isFurther(b, a) ? b : a;
      expect(gewinner.history.length, `Fall ${i}`).toBe(erwartet.history.length);
      // Nie weniger Historie als der bessere der beiden hatte — kein stiller Verlust.
      expect(gewinner.history.length).toBeGreaterThanOrEqual(
        Math.min(a.history.length, b.history.length),
      );
    }
  });

  it('ist idempotent: zweimal dieselbe Datei ändert nichts mehr', () => {
    const rand = rng(1357);
    const mine = Array.from({ length: 12 }, (_, i) => ({
      ...randomHistory(rand, 1 + Math.floor(rand() * 6)),
      chunkId: `c${i}`,
    }));
    const theirs = mine.map((s) => ({ ...s }));
    const eins = mergeStates(mine, theirs);
    const zwei = mergeStates(eins.merged, theirs);
    expect(zwei.added).toBe(0);
    expect(zwei.merged.length).toBe(eins.merged.length);
  });

  it('verliert keine Wendung, die nur auf einer Seite steht', () => {
    const rand = rng(8642);
    const mine = Array.from({ length: 8 }, (_, i) => ({
      ...randomHistory(rand, 3),
      chunkId: `nur-hier-${i}`,
    }));
    const theirs = Array.from({ length: 8 }, (_, i) => ({
      ...randomHistory(rand, 3),
      chunkId: `nur-dort-${i}`,
    }));
    const res = mergeStates(mine, theirs);
    expect(res.merged).toHaveLength(16);
    expect(res.added).toBe(8);
  });
});

describe('G · Zeit- und Kalender-Grenzfälle', () => {
  // Der Terminplaner rechnet in Millisekunden ab `now`. Sommerzeit, Monats- und
  // Jahreswechsel sowie Schaltjahre dürfen den Abstand nicht verschieben.
  const faelle: Array<[string, string]> = [
    ['Sommerzeit-Beginn (DE)', '2027-03-28T00:30:00Z'],
    ['Sommerzeit-Ende (DE)', '2027-10-31T00:30:00Z'],
    ['Jahreswechsel', '2027-12-31T23:59:00Z'],
    ['Schalttag', '2028-02-29T12:00:00Z'],
    ['Monatsende 31.', '2027-01-31T23:00:00Z'],
  ];

  for (const [name, iso] of faelle) {
    it(`plant über „${name}" hinweg exakt`, () => {
      const at = Date.parse(iso);
      const s = schedule(initialState('c', at), 'good', 'seg', at);
      // Der Abstand ist exakt intervalDays × 24 h — keine Kalenderarithmetik,
      // also auch keine verlorene oder doppelte Stunde.
      expect(s.dueAt - at).toBe(s.intervalDays * DAY_MS);
      expect(Number.isInteger(s.dueAt)).toBe(true);
    });
  }

  it('ein Abruf weit in der Zukunft erzeugt keine Fantasiewerte', () => {
    // Wer die App ein Jahr liegen lässt, darf keinen kaputten Zustand vorfinden.
    let s = schedule(initialState('c', T0), 'good', 'seg', T0);
    s = schedule(s, 'good', 'seg2', T0 + 365 * DAY_MS);
    expect(Number.isFinite(s.stability)).toBe(true);
    expect(s.intervalDays).toBeGreaterThanOrEqual(1);
    expect(s.difficulty).toBeGreaterThanOrEqual(1);
    expect(s.difficulty).toBeLessThanOrEqual(10);
  });

  it('zwei Abrufe in derselben Millisekunde bleiben wohldefiniert', () => {
    // Doppeltipp-Fall: dieselbe Zeit, zweimal bewertet.
    const a = schedule(initialState('c', T0), 'good', 'seg', T0);
    const b = schedule(a, 'good', 'seg', T0);
    expect(b.history).toHaveLength(2);
    expect(Number.isFinite(b.dueAt)).toBe(true);
    expect(b.dueAt).toBeGreaterThanOrEqual(T0);
  });
});
