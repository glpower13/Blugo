// Die zähe Wendung — und die Falle, die daraus entstand.
//
// ── DER BEFUND (2026-07-26, aus dem Code beweisbar) ──────────────────────────
//
// Bei jedem „Nochmal" hängte die App die Wendung hinten an die Warteschlange:
//
//     setQueue((q) => (result === 'again' ? [...q, currentChunk.id] : q));
//     setPos((p) => p + 1);
//
// Die Warteschlange wächst um eins, die Position wächst um eins — der Abstand
// zwischen beiden bleibt gleich. Daraus folgt unausweichlich:
//
//   WER EINE WENDUNG NICHT HINBEKOMMT, KANN DIE SITZUNG NIE BEENDEN.
//
// „Sitzung erledigt." erscheint erst, wenn man sie kann. Wer sie heute nicht
// kann, sitzt fest, bis er aufgibt und die App verlässt. Das ist die Klippe, um
// die es in `CLAUDE.md` geht — nur diesmal nicht als Menge, sondern als Schleife.
//
// ── UND ES IST AUCH DIDAKTISCH FALSCH ────────────────────────────────────────
//
// Dieselbe Wendung fünfmal hintereinander abzufragen ist geballte Wiederholung
// (massed practice) — die schwächste bekannte Form des Übens. `CLAUDE.md` sagt
// für genau diesen Fall das Gegenteil: „Wird etwas zu hart, NICHT durchdrücken:
// erst mehr verständlichen Input + leichtere Variante nachschieben, dann neu
// annähern." Gebaut war das Durchdrücken.
//
// ── WAS SICH ÄNDERT ──────────────────────────────────────────────────────────
//
// 1. In EINER Sitzung kommt eine Wendung höchstens `NACHHOLUNGEN` mal zurück.
//    Danach ist sie für heute fertig — und das wird gesagt, nicht verschwiegen.
// 2. Wer mehrfach hintereinander scheitert, bekommt sie nicht mehr täglich
//    vorgelegt. Nicht als Strafe: Die tägliche Abfrage hat nachweislich nicht
//    geholfen, sonst wäre sie nicht mehrfach durchgefallen.

import type { ChunkState } from '../domain/chunk';

/**
 * Wie oft eine Wendung innerhalb EINER Sitzung zurückkommt.
 *
 * Zwei, nicht null: Der zweite Anlauf direkt nach der offenen Dekodierung ist
 * der wertvollste — da sitzt die Hilfe noch. Und nicht fünf: Ab dem dritten
 * Fehlversuch am selben Tag lernt niemand mehr etwas, er ärgert sich nur.
 */
export const NACHHOLUNGEN = 2;

/**
 * Darf diese Wendung nach einem „Nochmal" noch einmal in DIESE Sitzung?
 *
 * `queue` ist die laufende Warteschlange; die Wendung steht mindestens einmal
 * darin (ihr ursprünglicher Platz). Rein, damit die Regel prüfbar bleibt.
 */
export function darfNochmal(queue: string[], chunkId: string): boolean {
  const bisher = queue.filter((x) => x === chunkId).length;
  return bisher <= NACHHOLUNGEN;
}

/**
 * Ab wie vielen Fehlschlägen HINTEREINANDER eine Wendung als zäh gilt.
 *
 * Vier ist bewusst hoch angesetzt: Drei Fehlversuche können ein schlechter Tag
 * sein. Vier hintereinander heißen, dass die Art der Darbietung nicht passt —
 * und dagegen hilft kein fünfter Versuch.
 */
export const ZAEH_AB = 4;

/** Wie oft die Wendung zuletzt hintereinander durchgefallen ist. */
export function fehlschlaegeAmStueck(state: ChunkState): number {
  let n = 0;
  for (let i = state.history.length - 1; i >= 0; i--) {
    if (state.history[i].result !== 'again') break;
    n++;
  }
  return n;
}

/** Ist diese Wendung gerade zäh — also mehrfach hintereinander durchgefallen? */
export function istZaeh(state: ChunkState): boolean {
  return fehlschlaegeAmStueck(state) >= ZAEH_AB;
}

/**
 * Der Mindestabstand in Tagen, bevor eine zähe Wendung wiederkommt.
 *
 * Er wächst mit der Zahl der Fehlschläge und ist gedeckelt: 1, 2, 4, 8, dann
 * 14 Tage. Warum überhaupt ein Abstand, wo die Wendung doch gerade NICHT sitzt?
 *
 *   · Weil sie ohnehin weg ist. Ob morgen oder in vier Tagen abgefragt wird,
 *     ändert an einer Abrufchance nahe null nichts.
 *   · Weil geballte Wiederholung die schwächste Form des Übens ist (Fels).
 *   · Weil eine Wendung, die JEDEN Tag als Erstes erscheint und JEDEN Tag
 *     misslingt, den Lerner die App kostet — und mit ihr die anderen 533.
 *
 * Was sie NICHT ist: ein Verstecken. Die Wendung bleibt gezählt, bleibt im
 * Thema sichtbar, und die App sagt, dass sie beiseitegelegt wurde.
 */
export function mindestAbstandTage(state: ChunkState): number {
  const n = fehlschlaegeAmStueck(state);
  if (n < ZAEH_AB) return 0;
  return Math.min(14, 2 ** (n - ZAEH_AB + 1) / 2);
}
