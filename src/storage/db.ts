// Local, offline-first persistence via IndexedDB (idb). No backend in M1
// (docs/05-architecture.md: "Backend erst, wenn eine Entscheidung es zwingt").

import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { ChunkState, ReviewEvent } from '../domain/chunk';

interface NeurolangDB extends DBSchema {
  chunkStates: {
    key: string; // chunkId
    value: ChunkState;
  };
  sessionLog: {
    key: number; // autoIncrement
    value: ReviewEvent & { chunkId: string };
  };
}

const DB_NAME = 'neurolang';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<NeurolangDB>> | null = null;

function getDB(): Promise<IDBPDatabase<NeurolangDB>> {
  if (!dbPromise) {
    dbPromise = openDB<NeurolangDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('chunkStates')) {
          db.createObjectStore('chunkStates', { keyPath: 'chunkId' });
        }
        if (!db.objectStoreNames.contains('sessionLog')) {
          db.createObjectStore('sessionLog', { autoIncrement: true });
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
