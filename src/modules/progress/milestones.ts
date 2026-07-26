// Sprachliche Meilensteine (A1 … B2) — die zweite Achse neben dem Gedächtnis.
//
// WARUM ES SIE BRAUCHT: Die App misst bisher, wie viel du BEHÄLTST. Was sie nie
// beantwortet hat, ist die Frage, die jeder Lernende zuerst stellt: „Wo stehe
// ich?" Ohne Antwort darauf ist der Fortschritt eine Zahl ohne Landkarte.
//
// DIE EINE DESIGN-REGEL GILT AUCH HIER — und sie ist der Grund, warum dieser
// Meilenstein anders gebaut ist als überall sonst in der Branche:
//
//   · Kein Meilenstein zählt Lektionen, Tage oder angefasste Wendungen. Er zählt
//     ausschließlich BEWIESENE (`isStable`) — dieselbe harte Messlatte wie die
//     große Zahl auf der Startseite.
//   · „Erreicht" ist deshalb keine Anwesenheitsmeldung, sondern eine Aussage
//     über echtes, über Monate gehaltenes Können.
//   · Und weil das lange dauert, zeigt die Fläche daneben den weichen Stand
//     („reift") — nicht als zweite Währung, sondern als Wegmarke.
//
// WAS EIN MEILENSTEIN AUSDRÜCKLICH NICHT IST: ein GER-Zertifikat. Der GER ist
// über Kann-Beschreibungen definiert, nicht über Wendungslisten. Wer alle
// A1-Wendungen DIESER App bewiesen hat, hat genau das getan — nicht mehr. Der
// Text in der App sagt das mit denselben Worten.

import type { Category, CefrLevel, Chunk, ChunkState } from '../../domain/chunk';
import { CEFR_LEVELS } from '../../domain/chunk';
import { isMaturing, isStable } from './metrics';

/**
 * Anteil der bewiesenen Wendungen, ab dem ein Meilenstein als erreicht gilt.
 *
 * WARUM NICHT 100 %: Eine einzige zähe Wendung — ein Wort, das man partout
 * nicht behält — würde den Meilenstein sonst auf Dauer blockieren, obwohl der
 * Rest längst sitzt. Das wäre keine ehrlichere Messung, sondern nur eine
 * frustrierendere. 90 % ist streng genug, dass niemand hindurchrutscht.
 *
 * WARUM NICHT WENIGER: Bei 70 % könnte man „A1 erreicht" lesen und trotzdem
 * jede dritte Grundwendung nicht können. Das wäre die Sorte Zahl, gegen die
 * dieses Projekt gebaut ist.
 */
export const MILESTONE_THRESHOLD = 0.9;

export interface MilestoneProgress {
  level: CefrLevel;
  /** Wendungen, die auf diesem Meilenstein liegen. */
  total: number;
  /** Davon BEWIESEN stabil — die einzige Zahl, die über „erreicht" entscheidet. */
  proven: number;
  /** Davon reifend (auf dem Weg, noch nicht bewiesen). Wegmarke, kein Kriterium. */
  maturing: number;
  /** Schon einmal begegnet. Nur Umfang, ausdrücklich kein Fortschritt. */
  touched: number;
  /** Anteil bewiesen, 0..1. */
  share: number;
  reached: boolean;
  /**
   * Ist dieser Meilenstein der, an dem gerade gearbeitet wird? Genau einer —
   * der erste nicht erreichte. Alles darüber ist noch nicht dran.
   */
  current: boolean;
}

/**
 * Auf welchem Meilenstein eine Wendung liegt — über ihr Thema.
 * Ohne bekanntes Thema zählt sie als A1 (der Grundstock); das kann nur bei
 * verwaistem Inhalt vorkommen, den die Oberfläche ohnehin nicht zeigt.
 */
export function levelOf(chunk: Chunk, byCategory: Map<string, CefrLevel>): CefrLevel {
  return byCategory.get(chunk.categoryId) ?? 'A1';
}

/**
 * Der Stand je Meilenstein (rein, testbar).
 *
 * Reihenfolge ist A1 → B2; `current` ist der erste NICHT erreichte. Ein
 * Meilenstein ohne Wendungen gilt nie als erreicht — sonst stünde „B2 erreicht"
 * da, weil es noch keinen B2-Inhalt gibt. Genau diese Art stiller Null-durch-
 * Null-Behauptung ist der Fehler, den die Trefferquote schon einmal hatte.
 */
export function milestoneProgress(
  chunks: Chunk[],
  categories: Category[],
  states: Record<string, ChunkState>,
): MilestoneProgress[] {
  const byCategory = new Map(categories.map((k) => [k.id, k.cefr]));
  const proHöhe = new Map<CefrLevel, Chunk[]>();
  for (const level of CEFR_LEVELS) proHöhe.set(level, []);
  for (const c of chunks) proHöhe.get(levelOf(c, byCategory))?.push(c);

  let currentGesetzt = false;
  return CEFR_LEVELS.map((level) => {
    const liste = proHöhe.get(level) ?? [];
    let proven = 0;
    let maturing = 0;
    let touched = 0;
    for (const c of liste) {
      const s = states[c.id];
      if (!s) continue;
      if (isStable(s)) proven++;
      else if (isMaturing(s)) maturing++;
      if (s.status !== 'new' || s.history.length > 0) touched++;
    }
    const total = liste.length;
    const share = total === 0 ? 0 : proven / total;
    const reached = total > 0 && share >= MILESTONE_THRESHOLD;
    const current = !reached && !currentGesetzt && total > 0;
    if (current) currentGesetzt = true;
    return { level, total, proven, maturing, touched, share, reached, current };
  });
}

/** Der Meilenstein, an dem gerade gearbeitet wird — oder der letzte erreichte. */
export function currentMilestone(alle: MilestoneProgress[]): MilestoneProgress | undefined {
  return alle.find((m) => m.current) ?? [...alle].reverse().find((m) => m.reached);
}

/**
 * Was auf diesem Meilenstein noch fehlt — als Bedingung, nicht als Prozentzahl.
 *
 * Dieselbe Haltung wie bei „Warum jetzt?": Der Beweis ist eine Prüfung, die man
 * besteht oder nicht, kein Weg mit Fortschrittsbalken.
 */
export function whatIsMissing(m: MilestoneProgress): string {
  if (m.total === 0) return 'Für diesen Meilenstein gibt es hier noch keinen Stoff.';
  if (m.reached) return 'Erreicht — und er bleibt es nur, solange die Wendungen halten.';
  const noch = Math.max(0, Math.ceil(m.total * MILESTONE_THRESHOLD) - m.proven);
  if (m.proven === 0 && m.touched === 0) return `Noch nicht begonnen — ${m.total} Wendungen.`;
  return `Noch ${noch} bewiesene ${noch === 1 ? 'Wendung' : 'Wendungen'} bis hierher.`;
}
