// Das Gedächtnisfeld als Nachthimmel deines Wissens (docs/06-motivation.md,
// Hauptbelohnung): jede Wendung ist ein Stern. BEWIESEN stabile leuchten und
// pulsieren, Reifende glimmen, Neues ist nur ein feiner Punkt. Ehrlich: nur
// echtes, geprüftes Können strahlt — kein Schein-Stern (die eine Design-Regel).

import type { ChunkState } from '../../domain/chunk';
import { isStable } from './metrics';

// Stabiler Pseudo-Zufall aus der chunkId → jeder Chunk hat seinen festen Platz.
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

interface Star {
  cls: string;
  size: number;
  delay: number;
}

function starFor(s: ChunkState, now: number): Star {
  if (isStable(s)) return { cls: 'star star-stable bg-success', size: 8, delay: 0 };
  if (s.status === 'maintenance') return { cls: 'star star-maint bg-success', size: 6, delay: 0 };
  if (s.dueAt <= now) return { cls: 'star bg-warn', size: 5, delay: 0 };
  if (s.status === 'learning') return { cls: 'star bg-brand', size: 5, delay: 0 };
  return { cls: 'star star-faint bg-paper', size: 4, delay: 0 }; // Neues: feiner Punkt
}

export function MemoryField({ states }: { states: ChunkState[] }) {
  const now = Date.now();
  if (states.length === 0) {
    return <p className="text-sm text-muted">Noch keine Chunks — beginne deine erste Begegnung.</p>;
  }
  return (
    <div className="memory-sky relative h-24 w-full overflow-hidden rounded-xl" aria-label="Gedächtnisfeld">
      {states.map((s) => {
        const st = starFor(s, now);
        // feste Position aus der ID (mit Rand, damit nichts abgeschnitten wird)
        const x = 6 + (hash(s.chunkId + 'x') % 1000) / 1000 * 88;
        const y = 12 + (hash(s.chunkId + 'y') % 1000) / 1000 * 76;
        const delay = (hash(s.chunkId + 'd') % 3200) / 1000; // versetztes Funkeln
        return (
          <span
            key={s.chunkId}
            title={`${s.chunkId} · ${s.status} · ${s.intervalDays}d`}
            className={st.cls}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${st.size}px`,
              height: `${st.size}px`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
