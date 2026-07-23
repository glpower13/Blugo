import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Category, Chunk, ChunkState, ReviewResult, Segment } from './domain/chunk';
import { seedContentSource } from './modules/content/contentPipeline';
import { getAllChunkStates, logEvent, putChunkState } from './storage/db';
import { initialState, schedule } from './modules/memory/memoryEngine';
import { bandStatus, recentSuccessRate, recommendedNewCount } from './modules/memory/difficulty';
import { buildQueue, pickSegmentForChunk, type NewFocus } from './session/buildQueue';
import { loadFocus, saveFocus } from './session/focus';
import { knownPhrases } from './session/knownChunks';
import { ComprehensionLoop } from './modules/comprehension/ComprehensionLoop';
import { MemoryField } from './modules/progress/MemoryField';
import { CategoryOverview } from './modules/progress/CategoryOverview';
import { computeMetrics } from './modules/progress/metrics';
import { categoryProgress } from './modules/progress/categories';
import { InstallButton } from './ui/InstallButton';
import { Backdrop } from './ui/Backdrop';
import { IconSettings } from './ui/icons';
import { AiSettings } from './modules/content/AiSettings';
import { initAiSettings } from './modules/content/aiSettings';

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [states, setStates] = useState<Record<string, ChunkState>>({});
  const [queue, setQueue] = useState<string[]>([]);
  const [pos, setPos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successRate, setSuccessRate] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);
  // Guards against a fast double-tap grading the same item twice (P3 race).
  const submitting = useRef(false);

  const chunkById = useMemo(() => Object.fromEntries(chunks.map((c) => [c.id, c])), [chunks]);
  // Chunk → category map for the new-intake focus (buildQueue never biases maintenance).
  const categoryByChunkId = useMemo(
    () => Object.fromEntries(chunks.map((c) => [c.id, c.categoryId])),
    [chunks],
  );

  // Bootstrap: load content + persisted states, initialise missing states.
  useEffect(() => {
    initAiSettings(); // gespeicherte KI-Auswahl laden und auf die Registry anwenden
    (async () => {
      try {
        const [cats, cs, segs, persisted] = await Promise.all([
          seedContentSource.getCategories(),
          seedContentSource.getChunks(),
          seedContentSource.getSegments(),
          getAllChunkStates(),
        ]);
        const now = Date.now();
        const byId: Record<string, ChunkState> = {};
        for (const p of persisted) byId[p.chunkId] = p;
        for (const c of cs) if (!byId[c.id]) byId[c.id] = initialState(c.id, now);
        // Adaptive difficulty: hold the ~80–85 % success band by tuning how
        // many NEW chunks enter this session (docs/04-product.md, anti-cliff).
        const rate = recentSuccessRate(Object.values(byId));
        const maxNew = recommendedNewCount(rate);
        const focus = loadFocus();
        const catByChunk = Object.fromEntries(cs.map((c) => [c.id, c.categoryId]));
        setCategories(cats);
        setChunks(cs);
        setSegments(segs);
        setStates(byId);
        setSuccessRate(rate);
        setFocusId(focus);
        setQueue(
          buildQueue(Object.values(byId), now, maxNew, {
            categoryByChunkId: catByChunk,
            categoryId: focus,
          }),
        );
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

  const stateList = useMemo(() => Object.values(states), [states]);
  const metrics = useMemo(() => computeMetrics(stateList), [stateList]);
  const catProgress = useMemo(
    () => categoryProgress(categories, chunks, states),
    [categories, chunks, states],
  );

  // Change the theme focus for NEW intake and rebuild the remaining queue in place.
  const changeFocus = useCallback(
    (next: string | null) => {
      setFocusId(next);
      saveFocus(next);
      const now = Date.now();
      const maxNew = recommendedNewCount(successRate);
      const focus: NewFocus = { categoryByChunkId, categoryId: next };
      setQueue(buildQueue(Object.values(states), now, maxNew, focus));
      setPos(0);
    },
    [categoryByChunkId, states, successRate],
  );

  const currentChunkId = queue[pos];
  const currentChunk = currentChunkId ? chunkById[currentChunkId] : undefined;
  const currentState = currentChunkId ? states[currentChunkId] : undefined;
  const currentSegment =
    currentChunk && currentState
      ? pickSegmentForChunk(currentChunk, currentState, segments)
      : undefined;
  // Was der Lerner schon kann — Grundlage für echtes i+1 bei der KI-Generierung.
  const known = useMemo(
    () => (currentChunkId ? knownPhrases(chunks, states, currentChunkId) : []),
    [chunks, states, currentChunkId],
  );

  async function handleResult(result: ReviewResult, helpUsed: boolean) {
    if (submitting.current) return; // ignore rapid double-taps on the same item
    if (!currentChunk || !currentState || !currentSegment) return;
    submitting.current = true;
    try {
      const now = Date.now();
      const next = schedule(currentState, result, currentSegment.id, now);
      // Persist first; only advance the UI once the write succeeded, so a
      // storage failure is surfaced and never silently drops progress.
      await putChunkState(next);
      await logEvent(currentChunk.id, { at: now, result, segmentId: currentSegment.id, helpUsed });
      setStates((prev) => ({ ...prev, [currentChunk.id]: next }));
      // 'again' → re-queue at the end (relearn this session); else advance.
      setQueue((q) => (result === 'again' ? [...q, currentChunk.id] : q));
      setPos((p) => p + 1);
    } catch (e) {
      console.error('Persist failed', e);
      setError('Die Bewertung konnte nicht gespeichert werden. Bitte die App neu laden.');
    } finally {
      submitting.current = false;
    }
  }

  const done = !loading && pos >= queue.length;

  return (
    <>
      <Backdrop />
      <div className="grain" aria-hidden="true" />
      <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-4 px-4 pb-10 pt-6">
      <header className="flex items-start justify-between gap-3 px-1 pt-1">
        <div>
          <h1 className="wordmark font-display text-[1.7rem] font-semibold leading-none tracking-[0.02em] text-paper">
            neuro<span className="font-light text-brand">lang</span>
          </h1>
          <p className="mt-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-muted">
            Deutsch → Schwedisch
          </p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="glass-soft flex shrink-0 items-center justify-center rounded-full p-2.5 text-paper"
          aria-label="KI-Einstellungen"
          title="KI-Einstellungen"
        >
          <IconSettings className="h-5 w-5" />
        </button>
      </header>

      {/* Ehrliche Fortschrittsanzeige (docs/07-measurement.md) */}
      <section className="glass rise rounded-2xl p-5" style={{ animationDelay: '0.04s' }}>
        <div className="flex items-baseline gap-5">
          <Stat value={metrics.active} label="aktiv" />
          <Stat value={metrics.maturing} label="reift" />
          <Stat value={metrics.stable} label="stabil (bewiesen)" accent />
        </div>
        <p className="mt-2 text-xs text-muted">
          {metrics.dueNow} jetzt fällig · Verständnis-Abdeckung {Math.round(metrics.coverage * 100)} %
        </p>
        {successRate !== null && (
          <p className="mt-1 text-xs text-faint">
            Flow-Band: {bandStatus(successRate)} ({Math.round(successRate * 100)} % zuletzt)
          </p>
        )}
        <div className="mt-3">
          <MemoryField states={stateList} />
        </div>
      </section>

      {!loading && !error && categories.length > 0 && (
        <CategoryOverview
          progress={catProgress}
          focusId={focusId}
          onFocus={changeFocus}
          enterDelay="0.11s"
        />
      )}

      {loading && <p className="text-muted">Lädt…</p>}

      {error && (
        <section className="rounded-2xl border border-danger/40 bg-danger/10 p-4">
          <p className="text-sm text-danger">{error}</p>
        </section>
      )}

      {!loading && !error && currentChunk && currentSegment && currentState ? (
        <ComprehensionLoop
          segment={currentSegment}
          chunk={currentChunk}
          stage={currentState.stage}
          onResult={handleResult}
          known={known}
          enterDelay="0.18s"
        />
      ) : null}

      {done && !error && (
        <section className="glass rise rounded-2xl p-6 text-center">
          <p className="font-display text-xl font-semibold text-success">Session erledigt.</p>
          <p className="mt-1 text-sm text-muted">
            Heute stabilisiert. Der Rest wartet — ohne zerbrechenden Streak.
          </p>
          {metrics.dueNow > 0 && (
            <p className="mt-2 text-xs text-faint">
              Noch {metrics.dueNow} fällig — bewusst auf die nächsten Sitzungen verteilt.
            </p>
          )}
        </section>
      )}

      <div className="mt-auto pt-4">
        <InstallButton />
      </div>

      {showSettings && <AiSettings onClose={() => setShowSettings(false)} />}
      </main>
    </>
  );
}

function Stat({ value, label, accent }: { value: number; label: string; accent?: boolean }) {
  return (
    <div>
      <div
        className={`tnum font-display text-3xl font-semibold ${accent ? 'text-success glow-success' : 'text-paper'}`}
      >
        {value}
      </div>
      <div className="mt-0.5 text-[0.7rem] uppercase tracking-[0.12em] text-muted">{label}</div>
    </div>
  );
}
