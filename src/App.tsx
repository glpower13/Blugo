import { useEffect, useMemo, useRef, useState } from 'react';
import type { Chunk, ChunkState, ReviewResult, Segment } from './domain/chunk';
import { seedContentSource } from './modules/content/contentPipeline';
import { getAllChunkStates, logEvent, putChunkState } from './storage/db';
import { initialState, schedule } from './modules/memory/memoryEngine';
import { buildQueue, pickSegmentForChunk } from './session/buildQueue';
import { ComprehensionLoop } from './modules/comprehension/ComprehensionLoop';
import { MemoryField } from './modules/progress/MemoryField';
import { computeMetrics } from './modules/progress/metrics';
import { InstallButton } from './ui/InstallButton';

export default function App() {
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [states, setStates] = useState<Record<string, ChunkState>>({});
  const [queue, setQueue] = useState<string[]>([]);
  const [pos, setPos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Guards against a fast double-tap grading the same item twice (P3 race).
  const submitting = useRef(false);

  // Bootstrap: load content + persisted states, initialise missing states.
  useEffect(() => {
    (async () => {
      try {
        const [cs, segs, persisted] = await Promise.all([
          seedContentSource.getChunks(),
          seedContentSource.getSegments(),
          getAllChunkStates(),
        ]);
        const now = Date.now();
        const byId: Record<string, ChunkState> = {};
        for (const p of persisted) byId[p.chunkId] = p;
        for (const c of cs) if (!byId[c.id]) byId[c.id] = initialState(c.id, now);
        setChunks(cs);
        setSegments(segs);
        setStates(byId);
        setQueue(buildQueue(Object.values(byId), now));
        setPos(0);
      } catch (e) {
        // Never fail silently (docs/TEST-UND-PRUEF-STANDARD.md §3.1): surface it.
        console.error('Bootstrap failed', e);
        setError('Lokale Daten konnten nicht geladen werden. Bitte die App neu laden.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const chunkById = useMemo(() => Object.fromEntries(chunks.map((c) => [c.id, c])), [chunks]);
  const stateList = useMemo(() => Object.values(states), [states]);
  const metrics = useMemo(() => computeMetrics(stateList), [stateList]);

  const currentChunkId = queue[pos];
  const currentChunk = currentChunkId ? chunkById[currentChunkId] : undefined;
  const currentState = currentChunkId ? states[currentChunkId] : undefined;
  const currentSegment =
    currentChunk && currentState
      ? pickSegmentForChunk(currentChunk, currentState, segments)
      : undefined;

  async function handleResult(result: ReviewResult) {
    if (submitting.current) return; // ignore rapid double-taps on the same item
    if (!currentChunk || !currentState || !currentSegment) return;
    submitting.current = true;
    try {
      const now = Date.now();
      const next = schedule(currentState, result, currentSegment.id, now);
      setStates((prev) => ({ ...prev, [currentChunk.id]: next }));
      await putChunkState(next);
      await logEvent(currentChunk.id, { at: now, result, segmentId: currentSegment.id });
      // 'again' → re-queue at the end (relearn this session); else advance.
      setQueue((q) => (result === 'again' ? [...q, currentChunk.id] : q));
      setPos((p) => p + 1);
    } finally {
      submitting.current = false;
    }
  }

  const done = !loading && pos >= queue.length;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-4 px-4 pb-10 pt-6">
      <header>
        <h1 className="text-lg font-bold tracking-tight text-slate-100">NEUROLANG</h1>
        <p className="text-xs text-slate-400">Deutsch → Schwedisch · Erhalt statt Streak</p>
      </header>

      {/* Ehrliche Fortschrittsanzeige (docs/07-measurement.md) */}
      <section className="rounded-2xl bg-surface p-4">
        <div className="flex items-baseline gap-4">
          <Stat value={metrics.active} label="aktiv" />
          <Stat value={metrics.maturing} label="reift" />
          <Stat value={metrics.stable} label="stabil (bewiesen)" accent />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          {metrics.dueNow} jetzt fällig · Verständnis-Abdeckung {Math.round(metrics.coverage * 100)} %
        </p>
        <div className="mt-3">
          <MemoryField states={stateList} />
        </div>
      </section>

      {loading && <p className="text-slate-400">Lädt…</p>}

      {error && (
        <section className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4">
          <p className="text-sm text-rose-300">{error}</p>
        </section>
      )}

      {!loading && !error && currentChunk && currentSegment && currentState ? (
        <ComprehensionLoop
          segment={currentSegment}
          chunk={currentChunk}
          stage={currentState.stage}
          onResult={handleResult}
        />
      ) : null}

      {done && !error && (
        <section className="rounded-2xl bg-surface p-5 text-center">
          <p className="text-lg font-semibold text-emerald-400">Session erledigt.</p>
          <p className="mt-1 text-sm text-slate-400">
            Heute stabilisiert. Der Rest wartet — ohne zerbrechenden Streak.
          </p>
          {metrics.dueNow > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              Noch {metrics.dueNow} fällig — bewusst auf die nächsten Sitzungen verteilt.
            </p>
          )}
        </section>
      )}

      <div className="mt-auto pt-4">
        <InstallButton />
      </div>
    </main>
  );
}

function Stat({ value, label, accent }: { value: number; label: string; accent?: boolean }) {
  return (
    <div>
      <div className={`text-2xl font-bold ${accent ? 'text-emerald-400' : 'text-slate-100'}`}>
        {value}
      </div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
