// Local, offline-first persistence via IndexedDB (idb). No backend in M1
// (docs/05-architecture.md: "Backend erst, wenn eine Entscheidung es zwingt").

import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { ChunkState, ReviewEvent, Segment } from '../domain/chunk';

/**
 * Ein vorab erzeugter, vom Tor angenommener Satz (der Vorrat,
 * docs/08-content-pipeline.md). Bewusst NICHT Teil des Lernstands: er ist
 * jederzeit neu herstellbar und gehört deshalb weder in eine Sicherung noch in
 * die Messung. Wer ihn löscht, verliert nichts als Wartezeit.
 */
export interface VorratEintrag {
  /** Eindeutig, damit zwei Sätze zur selben Wendung nebeneinander liegen können. */
  id: string;
  chunkId: string;
  segment: Segment;
  erzeugtAm: number;
  /** Welches Modell ihn geschrieben hat — die Fläche darf das sagen. */
  modell: string;
}

interface NeurolangDB extends DBSchema {
  chunkStates: {
    key: string; // chunkId
    value: ChunkState;
  };
  sessionLog: {
    key: number; // autoIncrement
    value: ReviewEvent & { chunkId: string };
  };
  vorrat: {
    key: string; // id
    value: VorratEintrag;
    indexes: { byChunk: string };
  };
}

const DB_NAME = 'neurolang';
// 2 (2026-07-26): Ablage für den Vorrat vorab erzeugter Sätze dazugekommen.
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<NeurolangDB>> | null = null;

function getDB(): Promise<IDBPDatabase<NeurolangDB>> {
  if (!dbPromise) {
    dbPromise = openDB<NeurolangDB>(DB_NAME, DB_VERSION, {
      // Jeder Schritt einzeln abgesichert: Der Aufstieg von Fassung 1 darf den
      // vorhandenen Lernstand unter keinen Umständen anfassen.
      upgrade(db) {
        if (!db.objectStoreNames.contains('chunkStates')) {
          db.createObjectStore('chunkStates', { keyPath: 'chunkId' });
        }
        if (!db.objectStoreNames.contains('sessionLog')) {
          db.createObjectStore('sessionLog', { autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('vorrat')) {
          const store = db.createObjectStore('vorrat', { keyPath: 'id' });
          store.createIndex('byChunk', 'chunkId');
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllChunkStates(): Promise<ChunkState[]> {
  return (await getDB()).getAll('chunkStates');
}

export async function getChunkState(chunkId: string): Promise<ChunkState | undefined> {
  return (await getDB()).get('chunkStates', chunkId);
}

export async function putChunkState(state: ChunkState): Promise<void> {
  await (await getDB()).put('chunkStates', state);
}

export async function logEvent(chunkId: string, event: ReviewEvent): Promise<void> {
  await (await getDB()).add('sessionLog', { chunkId, ...event });
}

/**
 * Viele Stände auf einmal schreiben — für das Einlesen einer Sicherung
 * (docs/gremium-einstellungen.md §2.1). Eine Transaktion: entweder alles oder
 * nichts, damit ein Abbruch keinen halben Lernstand hinterlässt.
 */
export async function putChunkStates(states: ChunkState[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('chunkStates', 'readwrite');
  await Promise.all(states.map((s) => tx.store.put(s)));
  await tx.done;
}

/**
 * Alles löschen. Bewusst ohne Papierkorb: Wer das wählt, meint es — und ein
 * halb gelöschter Stand wäre schlimmer als ein leerer.
 */
export async function clearAll(): Promise<void> {
  const db = await getDB();
  await db.clear('chunkStates');
  await db.clear('sessionLog');
  await db.clear('vorrat');
}

// --- Der Vorrat vorab erzeugter Sätze ------------------------------------------

export async function vorratFuer(chunkId: string): Promise<VorratEintrag[]> {
  return (await getDB()).getAllFromIndex('vorrat', 'byChunk', chunkId);
}

export async function vorratAnzahl(): Promise<number> {
  return (await getDB()).count('vorrat');
}

export async function vorratChunkIds(): Promise<string[]> {
  return (await getDB()).getAllKeysFromIndex('vorrat', 'byChunk') as Promise<string[]>;
}

export async function vorratHinzu(eintrag: VorratEintrag): Promise<void> {
  await (await getDB()).put('vorrat', eintrag);
}

export async function vorratWeg(id: string): Promise<void> {
  await (await getDB()).delete('vorrat', id);
}

export async function vorratLeeren(): Promise<void> {
  await (await getDB()).clear('vorrat');
}
