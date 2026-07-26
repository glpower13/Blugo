// Die Rückkehr nach einer Pause — der Moment, für den diese App gebaut ist.
//
// ── DER BEFUND (2026-07-26, simuliert) ───────────────────────────────────────
//
// Ein Lerner mit 120 geübten Wendungen macht 30 Tage Pause. Beim Wiederkommen
// stand auf „Heute": „Weiterlernen · 120 Wendungen." Und die Reihenfolge war
// „am längsten überfällig zuerst" — das sind ausgerechnet die SCHWÄCHSTEN.
// Gemessen an einem simulierten Lernstand hatten die ersten zwölf Wendungen im
// Schnitt 3 % Abrufchance, der Durchschnitt aller fälligen lag bei 37 %.
//
// Also: 120 als eine Sitzung hingestellt, und die ersten zwölf davon mit
// Sicherheit nicht zu können. Das ist die Klippe, gegen die dieses Projekt
// angetreten ist („Es darf keine Klippe geben, an der der Nutzer abspringt.",
// CLAUDE.md) — und sie stand im verletzlichsten Moment überhaupt.
//
// ── WAS SICH ÄNDERT UND WAS NICHT ────────────────────────────────────────────
//
// NICHT geändert wird die Zahl. 120 SIND fällig, und das wird auch weiter
// gesagt. Gelogen war nie die Zahl, sondern die Verpackung: sie als EINE
// Sitzung hinzustellen.
//
// Geändert wird zweierlei:
//   1. Eine Sitzung trägt eine PORTION, nicht den ganzen Rückstand. Die
//      Oberfläche versprach das längst („der Rest wartet — bewusst auf die
//      nächsten Sitzungen verteilt"); gebaut war es nie.
//   2. Zuerst kommt, was noch zu RETTEN ist.
//
// ── DIE EVIDENZ, UND WO SIE AUFHÖRT ──────────────────────────────────────────
//
//   Fels    Abrufübung wirkt (Testing Effect).
//   stark   Ein Abruf, der mit Mühe GELINGT, bringt pro Minute mehr als einer,
//           der scheitert. Gescheiterte Abrufe mit Rückmeldung helfen auch —
//           nur langsamer, und sie kosten Mut.
//   schwach Wo genau die Grenze liegt. `RETTBAR_MINIMUM` ist eine gesetzte
//           Zahl, keine gemessene. Deshalb ist es eine SCHWELLE und kein
//           „optimaler Zielwert": Die Behauptung „ab hier lohnt es noch" ist
//           tragbar, die Behauptung „genau bei 0,6 ist es am besten" nicht.

import type { ChunkState } from '../domain/chunk';
import { retrievability } from '../modules/memory/fsrs';
import { getDue } from '../modules/memory/memoryEngine';

const TAG_MS = 86_400_000;

/**
 * Wie viele Wendungen eine Sitzung trägt. Bei etwa 20–40 Sekunden je Wendung
 * sind das rund zehn Minuten — etwas, das man nach einer Pause anfängt, statt
 * es auf morgen zu schieben.
 */
export const PORTION = 20;

/**
 * Ab wann von einer Rückkehr die Rede ist: wenn der Rückstand eine Sitzung
 * deutlich übersteigt. Bewusst am RÜCKSTAND festgemacht und nicht an der
 * Abwesenheit — was weh tut, ist der Berg, nicht der Kalender.
 */
export const RUECKKEHR_AB = PORTION * 2;

/**
 * Ab welcher Abrufchance eine Wendung als „noch da" gilt. Unterhalb davon ist
 * ein Abruf kein Abruf mehr, sondern Neulernen — das kann warten, ohne dass
 * mehr verlorengeht, denn verloren ist es bereits.
 */
export const RETTBAR_MINIMUM = 0.2;

/** Wie wahrscheinlich diese Wendung JETZT noch abrufbar ist (0 … 1). */
export function abrufchance(state: ChunkState, now: number): number {
  if (state.lastReviewedAt === null) return 1; // noch nie geübt — nichts zu verlieren
  const tage = Math.max(0, (now - state.lastReviewedAt) / TAG_MS);
  return retrievability(tage, state.stability);
}

/**
 * Die fälligen Wendungen in der Reihenfolge, in der sie einem Rückkehrer am
 * meisten nützen.
 *
 * ZUERST das noch Rettbare, darin am längsten Überfälliges zuerst: Das ist das,
 * was gerade wegrutscht und durch einen Abruf gehalten wird.
 * DANACH das stark Verblasste. Es ist nicht vergessen im Sinne von „egal" — es
 * kommt wieder, nur eben als Neubegegnung und nicht als erste Ohrfeige.
 */
export function nachRettbarkeit(states: ChunkState[], now: number): ChunkState[] {
  const faellig = getDue(states, now); // bereits nach dueAt sortiert
  const rettbar = faellig.filter((s) => abrufchance(s, now) >= RETTBAR_MINIMUM);
  const verblasst = faellig.filter((s) => abrufchance(s, now) < RETTBAR_MINIMUM);
  return [...rettbar, ...verblasst];
}

export interface RueckkehrLage {
  /** Wie viel wirklich fällig ist — die Zahl wird NICHT geschönt. */
  faellig: number;
  /** Was diese Sitzung davon trägt. */
  portion: number;
  /** Davon noch abrufbar (≥ `RETTBAR_MINIMUM`). */
  nochDa: number;
  /** Davon stark verblasst — kommt wieder, dann wie neuer Stoff. */
  verblasst: number;
  /** Wie lange die letzte Übung her ist, in Tagen (0 = heute). */
  tageWeg: number;
}

/**
 * Die Lage bei der Rückkehr — oder `null`, wenn es ein ganz normaler Tag ist.
 *
 * `null` ist der Regelfall und wichtig: Eine Rückkehr-Ansprache an jemanden, der
 * gestern noch da war, wäre Theater. Die Fläche zeigt den Hinweis nur, wenn er
 * wahr ist.
 */
export function rueckkehrLage(states: ChunkState[], now: number = Date.now()): RueckkehrLage | null {
  // NUR schon Geübtes zählt als Rückstand. Neuer Stoff ist ab dem ersten Tag
  // „fällig" — auf einem frischen Gerät sind das alle 534 Wendungen. Ohne diese
  // Zeile begrüßte die App jemanden mit „Willkommen zurück", der noch nie da
  // war (im e2e-Test aufgefallen). Ein Berg entsteht aus Vergessenem, nicht aus
  // Ungelerntem.
  const faellig = getDue(
    states.filter((s) => s.lastReviewedAt !== null),
    now,
  );
  if (faellig.length < RUECKKEHR_AB) return null;
  const nochDa = faellig.filter((s) => abrufchance(s, now) >= RETTBAR_MINIMUM).length;
  const zuletzt = Math.max(...states.map((s) => s.lastReviewedAt ?? 0));
  return {
    faellig: faellig.length,
    portion: Math.min(PORTION, faellig.length),
    nochDa,
    verblasst: faellig.length - nochDa,
    tageWeg: zuletzt > 0 ? Math.floor((now - zuletzt) / TAG_MS) : 0,
  };
}
