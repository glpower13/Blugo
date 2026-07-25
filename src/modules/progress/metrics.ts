// Progress / Measurement — the honest numbers (docs/07-measurement.md).
// The one number that matters is STABLE chunks, not streaks or XP.

import type { ChunkState } from '../../domain/chunk';

export interface Metrics {
  active: number; // chunks currently in the loop
  maturing: number; // on the way to stable: production stage, interval grown, not yet proven
  stable: number; // chunks proven retained after a long gap
  dueNow: number; // chunks due for retrieval right now
  coverage: number; // Verständnis-Abdeckung 0..1 (share of active chunks last understood)
}

/** A chunk is "active" once it has been encountered at least once. */
function isActive(s: ChunkState): boolean {
  return s.status !== 'new' || s.history.length > 0;
}

/** Last retrieval on this chunk was a success. */
function lastWasGood(s: ChunkState): boolean {
  return s.history[s.history.length - 1]?.result === 'good';
}

/**
 * A chunk is "stable" only once it has been *proven* so (docs/07-measurement.md):
 * a successful production recall after the scheduled interval had already
 * reached the horizon — i.e. it really survived a long gap. Measured, not
 * estimated; a merely long scheduled interval does not count (anti-Goodhart).
 */
export function isStable(s: ChunkState): boolean {
  return s.provenStableAt != null;
}

/**
 * On the way to stable: reliably in production with a grown interval, not yet proven.
 * Exported so every view names the same thing "reift" — the honest bar shows this
 * as its faint zone (docs/07-measurement.md).
 */
export function isMaturing(s: ChunkState): boolean {
  return !isStable(s) && s.stage === 'production' && s.intervalDays >= 21;
}

/**
 * Wie viele Wendungen stehen in welcher RICHTUNG (docs/gremium-navigation.md §5).
 *
 * Die Richtung Deutsch→Schwedisch ist in NEUROLANG kein Schalter, sondern eine
 * gemessene Stufe: die Engine führt jede Wendung von `recognition` („du
 * verstehst sie") nach `production` („du sagst sie selbst"), sobald genug echte
 * Abrufe gelungen sind. Nur ein Produktions-Abruf zählt für „bewiesen stabil".
 *
 * EHRLICH: Eine nie begegnete Wendung steht per Voreinstellung auf `recognition`
 * — sie als „du verstehst sie" zu zählen wäre schlicht falsch. Sie bekommt
 * deshalb einen eigenen Eimer.
 */
export interface DirectionSplit {
  untouched: number; // noch nie begegnet
  recognition: number; // begegnet, du verstehst sie
  production: number; // du sagst sie selbst
}

export function directionSplit(states: ChunkState[]): DirectionSplit {
  let untouched = 0;
  let recognition = 0;
  let production = 0;
  for (const s of states) {
    if (!isActive(s)) untouched++;
    else if (s.stage === 'production') production++;
    else recognition++;
  }
  return { untouched, recognition, production };
}

/**
 * Wie viele Wendungen der Lerner schon LAUT gesagt hat — und zwar so, dass ein
 * Erkenner genau den geprüften Chunk verstanden hat (docs/gremium-sprachpartner.md, P3).
 *
 * WARUM DAS EHRLICH IST: Diese Zahl lässt sich nicht durch Anwesenheit erzeugen.
 * Man muss die richtige schwedische Wendung aussprechen; ein Vorbeireden zählt nicht.
 * Sie ist damit ein Signal echten Könnens — und ausdrücklich KEINE zweite Währung
 * neben „bewiesen stabil": sie zählt Wendungen, nicht Minuten, und sie ersetzt
 * nichts.
 *
 * WAS SIE NICHT SAGT: nichts über die Aussprache-QUALITÄT. Erkenner normalisieren
 * großzügig. Jede Anzeige dazu muss „gesagt und erkannt" heißen, nie „richtig
 * ausgesprochen" (docs/gremium-feedback.md §6).
 */
export function spokenAloud(states: ChunkState[]): number {
  return states.filter((s) => s.history.some((h) => h.spoken)).length;
}

export function computeMetrics(states: ChunkState[], now: number = Date.now()): Metrics {
  const activeStates = states.filter(isActive);
  // Verständnis-Abdeckung (docs/07-measurement.md), M1-Näherung: gewichtet nach
  // Stufe — ein Produktions-Abruf zählt voll, Wiedererkennen nur halb, weil
  // produktives Können mehr wert ist als bloßes Wiedererkennen. Offene
  // Verfeinerung (neuer Kontext / Zielstufe) in docs/10-open-questions.md.
  const understoodWeight = activeStates.reduce((sum, s) => {
    if (!lastWasGood(s)) return sum;
    return sum + (s.stage === 'production' ? 1 : 0.5);
  }, 0);
  return {
    active: activeStates.length,
    maturing: states.filter(isMaturing).length,
    stable: states.filter(isStable).length,
    dueNow: states.filter((s) => s.dueAt <= now).length,
    coverage: activeStates.length === 0 ? 0 : understoodWeight / activeStates.length,
  };
}
