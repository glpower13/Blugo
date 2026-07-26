// Assembles a day's session (docs/04-product.md): "Wartung zuerst" — due chunks
// (maintenance/learning) before new encounters. Context variation: prefer a
// segment the chunk has NOT been seen in yet (docs/03-method.md, step 4).

import type { Chunk, ChunkState, Segment } from '../domain/chunk';
import { getDue } from '../modules/memory/memoryEngine';

export interface QueueItem {
  chunk: Chunk;
  segment: Segment;
}

/** Daily dosing of NEW chunks (docs/04-product.md: "1–3 neue Chunks"). */
export const MAX_NEW_PER_SESSION = 3;

/**
 * Optional theme focus for NEW intake (autonomy, docs/gremium-struktur.md):
 * among the brand-new chunks, prefer those of `categoryId` for the limited slots.
 * Maintenance is NEVER biased by this — only which fresh material enters first.
 */
export interface NewFocus {
  categoryByChunkId: Record<string, string>;
  categoryId: string | null;
}

/**
 * Ordered chunkIds for a session: due maintenance/learning first ("Wartung
 * zuerst"), then at most `maxNew` brand-new chunks. Maintenance is never
 * capped — forgetting waits for no one; only the intake of new material is.
 *
 * When `focus` names a category, fresh chunks of that theme are preferred for the
 * `maxNew` slots (stable-sorted, so order within a theme is otherwise preserved).
 */
export function buildQueue(
  states: ChunkState[],
  now: number = Date.now(),
  maxNew: number = MAX_NEW_PER_SESSION,
  focus?: NewFocus,
): string[] {
  const due = getDue(states, now);
  const reviewed = due
    .filter((s) => s.lastReviewedAt !== null)
    .sort((a, b) => a.dueAt - b.dueAt);
  let fresh = due.filter((s) => s.lastReviewedAt === null);
  const focusId = focus?.categoryId;
  if (focusId) {
    // Prefer the focused theme for the scarce new slots; keep everything else's
    // relative order (stable sort) — this only reprioritises, never drops.
    fresh = [...fresh].sort(
      (a, b) =>
        (focus!.categoryByChunkId[a.chunkId] === focusId ? 0 : 1) -
        (focus!.categoryByChunkId[b.chunkId] === focusId ? 0 : 1),
    );
  }
  return [...reviewed, ...fresh.slice(0, maxNew)].map((s) => s.chunkId);
}

/**
 * Der Kontext, in dem die Wendung diesmal begegnet — normalerweise ein NEUER.
 *
 * AUSNAHME NACH EINEM „NOCHMAL" (Befund 2026-07-26): Kontextvariation ist
 * Schritt 4 des Loops und gehört hinter den Erfolg. Wer gerade gescheitert ist,
 * bekam bisher trotzdem sofort einen neuen Satz vorgelegt — die Wendung wurde
 * beim Wiedersehen also SCHWERER statt leichter. `CLAUDE.md` verlangt an dieser
 * Stelle das Gegenteil: „erst mehr verständlichen Input + leichtere Variante
 * nachschieben, dann neu annähern."
 *
 * Beim Nachlernen kommt deshalb derselbe Satz zurück — zusammen mit der offenen
 * Dekodierung (`scaffoldShouldOpen`). Erst nach dem nächsten Erfolg variiert der
 * Kontext wieder.
 */
export function pickSegmentForChunk(
  chunk: Chunk,
  state: ChunkState,
  segments: Segment[],
): Segment | undefined {
  const containing = segments.filter((s) => s.chunkIds.includes(chunk.id));
  if (containing.length === 0) return undefined;
  const letzte = state.history[state.history.length - 1];
  if (letzte?.result === 'again') {
    const gleicher = containing.find((s) => s.id === letzte.segmentId);
    if (gleicher) return gleicher;
  }
  const unseen = containing.find((s) => !state.seenSegmentIds.includes(s.id));
  return unseen ?? containing[0];
}

/**
 * Eine Sitzung, die IMMER etwas zu tun hat — „dieses Thema noch einmal".
 *
 * DAS PROBLEM (gemeldet 2026-07-26): „Dieses Thema üben" baute dieselbe
 * Warteschlange wie der Tagesplan — fälliges Material plus ein paar neue
 * Wendungen. Ist im Thema gerade nichts fällig und nichts neu, kam eine LEERE
 * Sitzung heraus. Ein Knopf, der nichts tut, ist schlimmer als keiner: Der
 * Lerner darf jederzeit zurückgehen können, auch mitten in einer langen Pause.
 *
 * Die Reihenfolge bleibt trotzdem ehrlich:
 *   1. Fälliges zuerst — Wartung geht immer vor (docs/04-product.md).
 *   2. Dann neuer Stoff, gedeckelt wie sonst auch.
 *   3. Erst dann freiwillige Wiederholung, am längsten Unangefasstes zuerst.
 *
 * `faellig` sagt, wo Punkt 3 beginnt. Die Oberfläche braucht die Zahl, um an
 * genau dieser Stelle zu sagen, was eine frühe Wiederholung wirklich bewirkt —
 * nämlich WENIG, und für den Beweis sogar weniger als nichts (siehe
 * `07-measurement.md`: der Beweis braucht die Pause, nicht die Menge).
 */
export function buildPracticeQueue(
  states: ChunkState[],
  now: number = Date.now(),
  maxNew: number = MAX_NEW_PER_SESSION,
): { queue: string[]; faellig: number } {
  const pflicht = buildQueue(states, now, maxNew);
  const drin = new Set(pflicht);
  const freiwillig = states
    .filter((s) => !drin.has(s.chunkId) && s.lastReviewedAt !== null)
    // Am längsten nicht angefasst zuerst: Das ist das, was am ehesten wackelt.
    .sort((a, b) => (a.lastReviewedAt ?? 0) - (b.lastReviewedAt ?? 0))
    .map((s) => s.chunkId);
  return { queue: [...pflicht, ...freiwillig], faellig: pflicht.length };
}
