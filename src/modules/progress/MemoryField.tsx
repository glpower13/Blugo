// Lebendes Gedächtnisfeld (docs/06-motivation.md, Hauptbelohnung):
// stabil = leuchtet, verblassend = dimmt. Kein XP, keine Fantasiezahl.

import type { ChunkState } from '../../domain/chunk';
import { isStable } from './metrics';

function dotClass(s: ChunkState, now: number): string {
  if (isStable(s)) return 'bg-emerald-400';
  if (s.status === 'maintenance') return 'bg-emerald-400/60';
  if (s.dueAt <= now) return 'bg-amber-400/80'; // verblassend, braucht Zuwendung
  if (s.status === 'learning') return 'bg-brand/70';
  return 'bg-slate-500/40';
}

export function MemoryField({ states }: { states: ChunkState[] }) {
  const now = Date.now();
  if (states.length === 0) {
    return <p className="text-sm text-slate-400">Noch keine Chunks — beginne deine erste Begegnung.</p>;
  }
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Gedächtnisfeld">
      {states.map((s) => (
        <span
          key={s.chunkId}
          title={`${s.chunkId} · ${s.status} · ${s.intervalDays}d`}
          className={`h-3.5 w-3.5 rounded-full transition-colors ${dotClass(s, now)}`}
        />
      ))}
    </div>
  );
}
