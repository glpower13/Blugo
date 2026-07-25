// Progress / Measurement — the honest numbers (docs/07-measurement.md).
// The one number that matters is STABLE chunks, not streaks or XP.

import type { ChunkState } from '../../domain/chunk';

export interface Metrics {
  active: number; // chunks currently in the loop
  maturing: number; // on the way to stable: production stage, interval grown, not yet proven
  stable: number; // chunks proven retained after a long gap
  /**
   * Fällig zur WIEDERHOLUNG — nur schon begegnete Wendungen.
   *
   * Vorher zählte diese Zahl jede Wendung mit `dueAt <= now`, und eine frische
   * steht per Voreinstellung auf „jetzt". Am ersten Tag las man deshalb „179
   * jetzt fällig", obwohl man nichts davon je gesehen hatte — eine Zahl, die
   * Rückstand behauptet, wo keiner ist (Ehrlichkeits-Audit 2026-07-25).
   */
  dueNow: number;
  /** Noch nie begegnet — Vorrat, keine Schuld. Bewusst getrennt gezählt. */
  untouched: number;
  /**
   * Trefferquote 0..1 über die BEGONNENEN Wendungen — nicht über den Stoff.
   * Der Name „Abdeckung" hat genau das verwechselt: Er klingt nach „Anteil des
   * Ganzen", gerechnet wurde aber über `active`. Bei 3 von 179 angefassten
   * Wendungen standen dort 100 % (Ehrlichkeits-Audit 2026-07-25). Die Fläche
   * nennt jetzt beide Zahlen.
   */
  coverage: number;
  /** Bezugsgröße der Trefferquote: wie viele Wendungen überhaupt begonnen sind. */
  coverageBase: number;
}

/**
 * A chunk is "active" once it has been encountered at least once.
 *
 * EXPORTIERT, weil `categories.ts` dieselbe Frage stellt. Sie stand dort als
 * zweite, wortgleiche Bedingung im Code — zwei Rechenquellen für eine Kennzahl,
 * die §3.3 des Prüf-Standards ausdrücklich verbietet (Befund E-6 der
 * Prüfkaskade 2026-07-25). Eine Änderung hier hätte die Themen-Zählung stumm
 * auseinanderlaufen lassen.
 */
export function isActive(s: ChunkState): boolean {
  return s.status !== 'new' || s.history.length > 0;
}

/** Last retrieval on this chunk was a success. */
function lastWasGood(s: ChunkState): boolean {
  return s.history[s.history.length - 1]?.result === 'good';
}

/**
 * Gilt ein erbrachter Beweis JETZT noch? Rein.
 *
 * Ein Beweis ist historisch wahr — er wurde erbracht. Aber die Zahlen auf der
 * Startseite behaupten Gegenwart („was du wirklich behalten hast"). Ist die
 * Wendung nach dem Beweis wieder durchgefallen, hat die App das Gegenteil
 * GEMESSEN; sie weiter als bewiesen zu führen wäre genau die Art Zahl, gegen
 * die dieses Projekt gebaut ist (Ehrlichkeits-Audit 2026-07-25).
 */
function stillHolds(at: number | null | undefined, s: ChunkState): boolean {
  if (at == null) return false;
  return s.lapsedAt == null || s.lapsedAt < at;
}

/**
 * A chunk is "stable" only once it has been *proven* so (docs/07-measurement.md):
 * a successful production recall after the scheduled interval had already
 * reached the horizon — i.e. it really survived a long gap. Measured, not
 * estimated; a merely long scheduled interval does not count (anti-Goodhart).
 *
 * Und der Beweis muss halten: Nach einem Fehlschlag zählt er nicht mehr, bis er
 * neu erbracht ist.
 */
export function isStable(s: ChunkState): boolean {
  return stillHolds(s.provenStableAt, s);
}

/**
 * Auf dem Weg dorthin: eine TATSÄCHLICH überstandene Pause von ≥ 21 Tagen in der
 * Produktions-Stufe, noch ohne den langen Beweis.
 *
 * Vorher stand hier `intervalDays >= 21` — das gerade neu GEPLANTE Intervall,
 * also eine Prognose, während die Oberfläche „überstanden" behauptete. Jetzt
 * zählt derselbe gemessene Vermerk wie beim langen Beweis (`maturedAt`), und er
 * verfällt beim Fehlschlag genauso.
 */
export function isMaturing(s: ChunkState): boolean {
  return !isStable(s) && stillHolds(s.maturedAt, s);
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
  struggling: number; // begegnet, aber noch nie gekonnt
  recognition: number; // begegnet, du verstehst sie
  production: number; // du sagst sie selbst
}

/** Hat die Wendung je einen gelungenen Abruf gehabt? */
const everSucceeded = (s: ChunkState): boolean => s.history.some((h) => h.result === 'good');

/**
 * EIGENER EIMER FÜR „begegnet, aber noch nie gekonnt": Vorher landete jede
 * begegnete Wendung, die nicht in Produktion war, unter „verstehst du" — auch
 * eine, die der Lerner dreimal hintereinander NICHT konnte. Eine Fläche, die
 * damit wirbt, die Richtung sei ein Messwert, darf kein Scheitern als Verständnis
 * führen (Ehrlichkeits-Audit 2026-07-25).
 */
export function directionSplit(states: ChunkState[]): DirectionSplit {
  let untouched = 0;
  let struggling = 0;
  let recognition = 0;
  let production = 0;
  for (const s of states) {
    if (!isActive(s)) untouched++;
    else if (s.stage === 'production') production++;
    else if (everSucceeded(s)) recognition++;
    else struggling++;
  }
  return { untouched, struggling, recognition, production };
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
    dueNow: activeStates.filter((s) => s.dueAt <= now).length,
    untouched: states.length - activeStates.length,
    coverage: activeStates.length === 0 ? 0 : understoodWeight / activeStates.length,
    coverageBase: activeStates.length,
  };
}
