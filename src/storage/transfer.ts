// „Übertragen" — dein Gedächtnis als Datei (docs/gremium-einstellungen.md §2.1).
//
// DER BURGGRABEN IN EINEM SATZ: Weil es keinen Server gibt, gehören die Daten
// schon jetzt dir — hier bekommst du sie auch in die Hand. Duolingos Fortschritt
// liegt in deren Cloud; Mitnehmen heißt dort „Datenanfrage stellen".
//
// ZWEI ENTSCHEIDUNGEN, DIE HIER FESTLIEGEN:
//
//   1. ZUSAMMENFÜHREN STATT ÜBERSCHREIBEN. Wer auf zwei Geräten lernt, hat auf
//      beiden echte Abrufe geleistet. Ein simples „Datei gewinnt" würde davon
//      die Hälfte vernichten. Deshalb entscheidet je Wendung der WEITER
//      FORTGESCHRITTENE Stand — und im Zweifel der, der mehr echte Abrufe
//      hinter sich hat.
//   2. DER KI-SCHLÜSSEL WANDERT NICHT MIT. Ein Zugangsschlüssel in einer Datei,
//      die man sich selbst per Messenger schickt, ist ein Sicherheitsproblem.
//      Bequemer wäre es, ehrlicher ist es nicht.

import type { ChunkState } from '../domain/chunk';
import { defaultPreferences, normalizePreferences, type Preferences } from '../session/preferences';

export const BACKUP_APP = 'neurolang' as const;
export const BACKUP_VERSION = 1 as const;

export interface Backup {
  app: typeof BACKUP_APP;
  version: number;
  exportedAt: number;
  name: string;
  preferences: Preferences;
  states: ChunkState[];
}

export interface MergeSummary {
  merged: ChunkState[];
  /** Wendungen, die es hier noch gar nicht gab. */
  added: number;
  /** Wendungen, bei denen der Stand aus der Datei weiter war. */
  updated: number;
  /** Wendungen, bei denen der eigene Stand weiter war (Datei ignoriert). */
  kept: number;
}

export function buildBackup(
  states: ChunkState[],
  name: string,
  preferences: Preferences,
  now: number,
): Backup {
  return {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    exportedAt: now,
    name,
    preferences,
    states,
  };
}

/** Dateiname mit Datum — damit mehrere Sicherungen unterscheidbar bleiben. */
export function backupFilename(now: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `neurolang-${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}.json`;
}

function isState(v: unknown): v is ChunkState {
  const s = v as Partial<ChunkState> | null;
  return (
    !!s &&
    typeof s === 'object' &&
    typeof s.chunkId === 'string' &&
    typeof s.dueAt === 'number' &&
    Array.isArray(s.history)
  );
}

/**
 * Liest eine Sicherungsdatei (rein, streng). Wirft ausschließlich Meldungen, die
 * einem Menschen sagen, was los ist — „unexpected token" hilft niemandem.
 */
export function parseBackup(text: string): Backup {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('Das ist keine lesbare Sicherungsdatei (kein gültiges JSON).');
  }
  const b = raw as Partial<Backup> | null;
  if (!b || typeof b !== 'object' || b.app !== BACKUP_APP) {
    throw new Error('Diese Datei stammt nicht aus NEUROLANG.');
  }
  if (typeof b.version !== 'number' || b.version > BACKUP_VERSION) {
    throw new Error(
      'Diese Sicherung stammt aus einer neueren Fassung der App. Aktualisiere die App und versuche es erneut.',
    );
  }
  const states = Array.isArray(b.states) ? b.states.filter(isState) : [];
  if (states.length === 0) {
    throw new Error('In dieser Datei steht kein Lernstand.');
  }
  return {
    app: BACKUP_APP,
    version: b.version,
    exportedAt: typeof b.exportedAt === 'number' ? b.exportedAt : 0,
    name: typeof b.name === 'string' ? b.name : '',
    preferences: b.preferences ? normalizePreferences(b.preferences) : defaultPreferences(),
    states,
  };
}

/**
 * Welcher der beiden Stände ist WEITER? Rein.
 *
 * Reihenfolge der Kriterien, bewusst so und nicht anders:
 *   1. bewiesen stabil schlägt alles — dieser Beweis ist das Produkt.
 *   2. sonst: mehr echte Abrufe in der Historie (das ist geleistete Arbeit).
 *   3. sonst: der zuletzt wiederholte.
 * Ein reines „neuer gewinnt" wäre falsch: Ein frisch angelegter, leerer Stand
 * ist „neuer" als ein monatelang gepflegter — und würde ihn löschen.
 */
export function isFurther(a: ChunkState, b: ChunkState): boolean {
  const provenA = a.provenStableAt != null;
  const provenB = b.provenStableAt != null;
  if (provenA !== provenB) return provenA;
  if (a.history.length !== b.history.length) return a.history.length > b.history.length;
  return (a.lastReviewedAt ?? 0) > (b.lastReviewedAt ?? 0);
}

/** Führt einen eingelesenen Stand mit dem vorhandenen zusammen (rein). */
export function mergeStates(mine: ChunkState[], theirs: ChunkState[]): MergeSummary {
  const byId = new Map(mine.map((s) => [s.chunkId, s]));
  let added = 0;
  let updated = 0;
  let kept = 0;
  for (const t of theirs) {
    const m = byId.get(t.chunkId);
    if (!m) {
      byId.set(t.chunkId, t);
      added++;
    } else if (isFurther(t, m)) {
      byId.set(t.chunkId, t);
      updated++;
    } else {
      kept++;
    }
  }
  return { merged: [...byId.values()], added, updated, kept };
}
