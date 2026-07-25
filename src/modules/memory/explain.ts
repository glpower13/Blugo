// „Warum jetzt?" — die App erklärt ihre eigene Entscheidung.
//
// WARUM ES DAS GIBT: Jede Lern-App entscheidet für dich, was du als Nächstes
// siehst, und keine sagt dir, warum. Man soll dem Algorithmus glauben. Bei einer
// App, deren ganzes Versprechen „unsere Zahlen sind wahr" lautet, ist das ein
// Widerspruch: Eine Messung, die man nicht nachvollziehen kann, ist eine
// Behauptung.
//
// Diese Datei rechnet deshalb aus, was die Engine WIRKLICH weiß — und zwar aus
// demselben Zustand und mit derselben Funktion, die auch plant. Nichts wird für
// die Anzeige nachgebaut; ein zweiter, hübscherer Rechenweg wäre genau die Art
// Schönfärberei, gegen die dieses Projekt steht.

import type { ChunkState } from '../../domain/chunk';
import { DAY_MS, STABLE_INTERVAL_DAYS, schedule } from './memoryEngine';

export interface ScheduleExplanation {
  /** Tage seit dem letzten Abruf; null, wenn es noch keinen gab. */
  sinceLastDays: number | null;
  /** Geplantes Intervall, das die Wendung überstehen sollte. */
  plannedDays: number;
  /** Tage über den Plan hinaus (0 = pünktlich, nie negativ). */
  overdueDays: number;
  /** Erste Begegnung? Dann gibt es nichts zu erklären außer „neu". */
  isNew: boolean;
  stage: ChunkState['stage'];
  successStreak: number;
  /** Voraussichtliches nächstes Intervall, wenn es jetzt sitzt. */
  nextIfGoodDays: number;
  /** Schon bewiesen stabil? */
  proven: boolean;
  /**
   * Wenn nicht bewiesen: Was genau fehlt noch. Bewusst als Aufzählung von
   * BEDINGUNGEN, nicht als Fortschrittsbalken — es ist kein Weg mit Prozenten,
   * sondern eine Prüfung, die man besteht oder nicht.
   */
  missingForProof: string[];
}

/** Rechnet die Erklärung aus dem echten Zustand (rein). */
export function explainSchedule(
  state: ChunkState,
  now: number,
  retention?: number,
): ScheduleExplanation {
  const sinceLastDays =
    state.lastReviewedAt === null ? null : Math.floor((now - state.lastReviewedAt) / DAY_MS);
  const plannedDays = state.intervalDays;
  const overdueDays = sinceLastDays === null ? 0 : Math.max(0, sinceLastDays - plannedDays);
  // Die Vorschau läuft durch DIESELBE Planung wie der echte Abruf — kein
  // zweiter Rechenweg, der auseinanderlaufen könnte.
  const preview = schedule(state, 'good', 'vorschau', now, { retention });

  const missing: string[] = [];
  const proven = state.provenStableAt != null;
  if (!proven) {
    if (state.stage !== 'production') {
      missing.push('die Stufe „du sagst sie selbst" (kommt von allein, wenn der Abruf sitzt)');
    }
    if (plannedDays < STABLE_INTERVAL_DAYS) {
      missing.push(`eine überstandene Pause von ${STABLE_INTERVAL_DAYS} Tagen (aktuell ${plannedDays})`);
    }
    if (state.stage === 'production' && plannedDays >= STABLE_INTERVAL_DAYS) {
      missing.push('nur noch dieser eine Abruf — wenn er jetzt sitzt, ist sie bewiesen');
    }
  }

  return {
    sinceLastDays,
    plannedDays,
    overdueDays,
    isNew: state.lastReviewedAt === null,
    stage: state.stage,
    successStreak: state.successStreak,
    nextIfGoodDays: preview.intervalDays,
    proven,
    missingForProof: missing,
  };
}

/** Ein Satz in Alltagsdeutsch, warum diese Wendung jetzt dran ist (rein). */
export function whyNowSentence(e: ScheduleExplanation): string {
  if (e.isNew) return 'Neu — du begegnest ihr zum ersten Mal.';
  if (e.overdueDays > 0) {
    return `Fällig seit ${e.overdueDays} ${e.overdueDays === 1 ? 'Tag' : 'Tagen'} — geplant war eine Pause von ${e.plannedDays} ${e.plannedDays === 1 ? 'Tag' : 'Tagen'}.`;
  }
  if (e.plannedDays === 0) return 'In dieser Sitzung noch einmal — der letzte Versuch saß nicht.';
  return `Genau jetzt fällig — die geplante Pause von ${e.plannedDays} ${e.plannedDays === 1 ? 'Tag' : 'Tagen'} ist um.`;
}
