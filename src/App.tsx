import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { Area, Category, Chunk, ChunkState, ReviewResult, Segment } from './domain/chunk';
import type { Dialog, DialogTurn } from './domain/dialog';
import { seedContentSource } from './modules/content/contentPipeline';
import { getAllChunkStates, logEvent, putChunkState } from './storage/db';
import { initialState, schedule } from './modules/memory/memoryEngine';
import { recentSuccessRate, recommendedNewCount } from './modules/memory/difficulty';
import { buildQueue, pickSegmentForChunk, type NewFocus } from './session/buildQueue';
import { loadFocus, saveFocus } from './session/focus';
import { loadName, saveName } from './session/profile';
import { knownPhrases } from './session/knownChunks';
import { ComprehensionLoop } from './modules/comprehension/ComprehensionLoop';
import { AreaOverview } from './modules/progress/AreaOverview';
import { AreaDetail } from './modules/progress/AreaDetail';
import { CategoryDetail } from './modules/progress/CategoryDetail';
import { TodayView } from './modules/progress/TodayView';
import { ProgressView } from './modules/progress/ProgressView';
import { DialogOverview } from './modules/dialog/DialogOverview';
// Erst bei Bedarf laden (kleineres Startbündel → schnellere erste Anzeige).
const DialogScene = lazy(() =>
  import('./modules/dialog/DialogScene').then((m) => ({ default: m.DialogScene })),
);
import { computeMetrics } from './modules/progress/metrics';
import { areaProgress, categoryProgress } from './modules/progress/categories';
import { InstallButton } from './ui/InstallButton';
import { Backdrop } from './ui/Backdrop';
import { NameEditor } from './ui/NameEditor';
import { IconBack, IconTarget } from './ui/icons';
import { areaVisual } from './ui/areaTheme';
import { TabBar, type Tab } from './ui/TabBar';
const AiSettings = lazy(() =>
  import('./modules/content/AiSettings').then((m) => ({ default: m.AiSettings })),
);
import { initAiSettings } from './modules/content/aiSettings';

// Ein Scope grenzt eine Session ein: ein ganzer Bereich oder ein einzelnes Thema.
type SessionScope = { kind: 'area' | 'category'; id: string };

// Die „Räume" der App (client-seitige Navigation, kein Router nötig).
//
// Seit gremium-navigation.md (Schritt 1) zweistufig: VIER Reiter als globale
// Navigation, und darin der Drill-down des Baums (Bereich → Thema → Gespräch/
// Session). Die Reiterleiste bleibt beim Drill-down sichtbar — man ist ja noch
// im selben Raum — und verschwindet erst beim Lernen selbst (Ebene 4).
type View =
  | { name: 'tab'; tab: Tab }
  | { name: 'area'; id: string }
  | { name: 'category'; id: string }
  | { name: 'dialog'; id: string }
  | { name: 'session' };

/** Zu welchem Reiter eine Drill-down-Ansicht gehört (für die aktive Markierung). */
function tabOf(view: View): Tab {
  switch (view.name) {
    case 'tab':
      return view.tab;
    case 'dialog':
      return 'talk';
    default:
      return 'learn';
  }
}

export default function App() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogs, setDialogs] = useState<Dialog[]>([]);
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
  // Vorname des Lerners (lokal): personalisiert Begrüßung & Gespräche.
  const [name, setName] = useState<string>(() => loadName());
  const [showName, setShowName] = useState(false);
  // Navigation: Reiter (global) → Drill-down im Baum → fokussierte Lern-Session.
  const [view, setView] = useState<View>({ name: 'tab', tab: 'today' });
  // Guards against a fast double-tap grading the same item twice (P3 race).
  const submitting = useRef(false);

  const chunkById = useMemo(() => Object.fromEntries(chunks.map((c) => [c.id, c])), [chunks]);
  // Chunk → category map for the new-intake focus (buildQueue never biases maintenance).
  const categoryByChunkId = useMemo(
    () => Object.fromEntries(chunks.map((c) => [c.id, c.categoryId])),
    [chunks],
  );
  // Chunk → area map (for area-scoped practice): chunk → category → area.
  const areaByChunkId = useMemo(() => {
    const areaOfCat = Object.fromEntries(categories.map((c) => [c.id, c.areaId]));
    return Object.fromEntries(chunks.map((c) => [c.id, areaOfCat[c.categoryId]]));
  }, [chunks, categories]);

  // Bootstrap: load content + persisted states, initialise missing states.
  useEffect(() => {
    initAiSettings(); // gespeicherte KI-Auswahl laden und auf die Registry anwenden
    (async () => {
      try {
        const [ars, cats, dlgs, cs, segs, persisted] = await Promise.all([
          seedContentSource.getAreas(),
          seedContentSource.getCategories(),
          seedContentSource.getDialogs(),
          seedContentSource.getChunks(),
          seedContentSource.getSegments(),
          getAllChunkStates(),
        ]);
        const now = Date.now();
        const byId: Record<string, ChunkState> = {};
        for (const p of persisted) byId[p.chunkId] = p;
        for (const c of cs) if (!byId[c.id]) byId[c.id] = initialState(c.id, now);
        // Adaptive difficulty: judge the recent success band (drives how many
        // NEW chunks a session admits — docs/04-product.md, anti-cliff).
        const rate = recentSuccessRate(Object.values(byId));
        setAreas(ars);
        setCategories(cats);
        setDialogs(dlgs);
        setChunks(cs);
        setSegments(segs);
        setStates(byId);
        setSuccessRate(rate);
        setFocusId(loadFocus());
        // Kein Vorab-Queue mehr: die Session baut ihre Warteschlange beim Start.
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
  const areaProg = useMemo(() => areaProgress(areas, catProgress), [areas, catProgress]);
  // Titel des fokussierten Themas (global, für die Fokus-Zeile auf der Übersicht).
  const focusTitle = useMemo(
    () => (focusId ? (categories.find((c) => c.id === focusId)?.title ?? null) : null),
    [focusId, categories],
  );
  // Was die NÄCHSTE Sitzung tatsächlich enthält.
  //
  // WARUM NICHT „fällig": Bei frischem Start sind alle 98 Wendungen fällig, die
  // Sitzung lässt aber nur `recommendedNewCount` neue zu — der Knopf versprach 98
  // und lieferte 3. Sachlich richtig, als Ankündigung falsch (10-open-questions.md).
  //
  // Motivation: Eine Wand aus 98 ist genau die Klippe, gegen die dieses Projekt
  // gebaut ist (CLAUDE.md, „keine Klippe"). Eine kleine, endliche Zahl ist ein
  // Zugehen-Signal — und sie ist WAHR, weil es exakt die Warteschlange ist, die
  // gleich läuft. `buildQueue` ist deterministisch, also kann hier nichts driften:
  // dieselbe Liste wird angezeigt und dann abgearbeitet.
  const plannedSession = useMemo(
    () =>
      buildQueue(Object.values(states), Date.now(), recommendedNewCount(successRate), {
        categoryByChunkId,
        categoryId: focusId,
      }),
    [states, successRate, categoryByChunkId, focusId],
  );

  // Dialoge je Thema (für den „Gespräch"-Einstieg im Thema-Detail).
  const dialogsByCategory = useMemo(() => {
    const map: Record<string, Dialog[]> = {};
    for (const d of dialogs) (map[d.categoryId] ??= []).push(d);
    return map;
  }, [dialogs]);

  // Animierte Ansichts-Navigation (View Transitions): der Inhalt gleitet
  // richtungsabhängig. Fällt sauber auf sofortiges Umschalten zurück, wo die
  // API fehlt oder reduzierte Bewegung gewünscht ist.
  const navigate = useCallback((direction: 'push' | 'pop', update: () => void) => {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> };
    };
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!doc.startViewTransition || reduce) {
      update();
      return;
    }
    document.documentElement.dataset.nav = direction;
    const t = doc.startViewTransition(() => flushSync(update));
    void t.finished.finally(() => {
      delete document.documentElement.dataset.nav;
    });
  }, []);

  // Theme focus for NEW intake (autonomy). No queue rebuild — the session builds
  // its queue fresh on start (buildQueue never biases due maintenance).
  const setFocus = useCallback((next: string | null) => {
    setFocusId(next);
    saveFocus(next);
  }, []);

  // Enter a learning session. Optionally scoped to one area or one theme
  // ("Diesen Bereich üben" / "Dieses Thema üben"). Unscoped = the honest global
  // due-set (the memory engine drives the loop); the theme focus only biases NEW
  // intake, never which due items surface.
  const enterSession = useCallback(
    (scope?: SessionScope) => {
      // Ohne Scope ist es genau die Warteschlange, die der Knopf angekündigt hat.
      if (!scope) {
        setQueue(plannedSession);
        setPos(0);
        setView({ name: 'session' });
        return;
      }
      const inScope = (chunkId: string) =>
        scope.kind === 'category'
          ? categoryByChunkId[chunkId] === scope.id
          : areaByChunkId[chunkId] === scope.id;
      const pool = Object.values(states).filter((s) => inScope(s.chunkId));
      // Bereich/Thema üben: der Scope IST die Wahl — kein zusätzlicher Fokus.
      const focus: NewFocus | undefined = undefined;
      setQueue(buildQueue(pool, Date.now(), recommendedNewCount(successRate), focus));
      setPos(0);
      setView({ name: 'session' });
    },
    [plannedSession, states, successRate, categoryByChunkId, areaByChunkId],
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
  // Neuer Chunk (noch kein erfolgreicher Abruf)? Dann die Bedeutung/Dekodierung
  // sofort offen zeigen (verständlicher Input, docs/gremium-darstellung.md).
  const scaffoldOpen = currentState
    ? !currentState.history.some((h) => h.result === 'good')
    : true;

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

  // Eine „du"-Zeile im Gespräch ist ein echter Abruf ihres Chunks → dieselbe
  // Memory-Engine wie der Loop (die eine Design-Regel: echtes Können, kein Schein).
  const handleDialogProduce = useCallback(
    (dialogId: string, turn: DialogTurn, result: ReviewResult, helpUsed: boolean) => {
      const chunkId = turn.chunkId;
      if (!chunkId) return;
      const state = states[chunkId];
      if (!state) return;
      const now = Date.now();
      const segId = `dialog:${dialogId}:${turn.id}`;
      const next = schedule(state, result, segId, now);
      void (async () => {
        try {
          await putChunkState(next);
          await logEvent(chunkId, { at: now, result, segmentId: segId, helpUsed });
          setStates((prev) => ({ ...prev, [chunkId]: next }));
        } catch (e) {
          console.error('Persist failed', e);
          setError('Die Bewertung konnte nicht gespeichert werden. Bitte die App neu laden.');
        }
      })();
    },
    [states],
  );

  const done = !loading && pos >= queue.length;
  // Ebene 4 (Lernen/Gespräch): die globale Navigation verschwindet — nichts lenkt
  // ab (docs/gremium-navigation.md §4, „Formsprache je Ebene").
  const showTabs = view.name !== 'session' && view.name !== 'dialog';
  const activeArea = view.name === 'area' ? areaProg.find((a) => a.area.id === view.id) : undefined;
  const activeCategory =
    view.name === 'category' ? categories.find((c) => c.id === view.id) : undefined;
  const activeDialog = view.name === 'dialog' ? dialogs.find((d) => d.id === view.id) : undefined;
  // Der Bereich, zu dem das offene Thema gehört (für „Zurück"-Ziel + Beschriftung).
  const parentArea = activeCategory
    ? areas.find((a) => a.id === activeCategory.areaId)
    : undefined;
  // Das Thema, zu dem das offene Gespräch gehört (für „Zurück"-Ziel).
  const dialogCategory = activeDialog
    ? categories.find((c) => c.id === activeDialog.categoryId)
    : undefined;

  return (
    <>
      <Backdrop />
      <div className="grain" aria-hidden="true" />
      {/* Globale Navigation — bewusst AUSSERHALB von <main>: dort trägt
          `view-transition-name` ein `contain: layout`, das `position: fixed`
          an <main> bindet statt ans Fenster (die Leiste scrollte weg). */}
      {showTabs && (
        <TabBar
          active={tabOf(view)}
          onSelect={(tab) =>
            navigate(tab === tabOf(view) ? 'pop' : 'push', () => setView({ name: 'tab', tab }))
          }
        />
      )}

      <main
        className={`vt-page mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-4 pt-6 md:max-w-3xl md:px-6 ${
          showTabs ? 'pb-32 md:pb-28' : 'pb-10'
        }`}
      >
        {error && (
          <section className="rounded-2xl border border-danger/40 bg-danger/10 p-4">
            <p className="text-sm text-danger">{error}</p>
          </section>
        )}

        {/* ───────── HEUTE (Ebene 0 · der Verteiler) ───────── */}
        {view.name === 'tab' && view.tab === 'today' && (
          <>
            <TodayView
              name={name}
              stable={metrics.stable}
              maturing={metrics.maturing}
              sessionSize={plannedSession.length}
              dueNow={metrics.dueNow}
              totalChunks={chunks.length}
              areaCount={areaProg.length}
              dialogCount={dialogs.length}
              loading={loading}
              onEditName={() => setShowName(true)}
              onSettings={() => setShowSettings(true)}
              onStart={() => navigate('push', () => enterSession())}
              onGoLearn={() => navigate('push', () => setView({ name: 'tab', tab: 'learn' }))}
              onGoTalk={() => navigate('push', () => setView({ name: 'tab', tab: 'talk' }))}
            />
            <div className="mx-auto mt-auto flex w-full max-w-md flex-col gap-3 pt-4 md:max-w-xl">
              <InstallButton />
              <p className="text-center text-[0.7rem] tracking-wide text-faint">
                © 2026 Andreas Fink · neurolang
              </p>
            </div>
          </>
        )}

        {/* ───────── LERNEN (Ebene 1 · der Baum) ───────── */}
        {view.name === 'tab' && view.tab === 'learn' && (
          <div className="mx-auto flex w-full max-w-md flex-col gap-4 md:max-w-xl">
            <header className="px-1 pt-1">
              <h1 className="font-display text-[1.5rem] font-semibold leading-tight text-paper">
                Lernen
              </h1>
              <p className="mt-1 text-xs text-faint">
                Du wählst, woraus neuer Stoff kommt — Fälliges kommt trotzdem.
              </p>
            </header>

            {loading && (
              <section className="glass flex flex-col gap-3 rounded-2xl p-5" aria-hidden="true">
                <div className="shimmer h-5 w-24 rounded" />
                <div className="shimmer h-16 w-full rounded-xl" />
                <div className="shimmer h-16 w-full rounded-xl" />
                <div className="shimmer h-16 w-full rounded-xl" />
              </section>
            )}

            {!loading && !error && areaProg.length > 0 && (
              <AreaOverview
                progress={areaProg}
                focusTitle={focusTitle}
                onOpen={(id) => navigate('push', () => setView({ name: 'area', id }))}
                onClearFocus={() => setFocus(null)}
              />
            )}
          </div>
        )}

        {/* ───────── GESPRÄCHE (eigener Raum statt drei Klicks tief) ───────── */}
        {view.name === 'tab' && view.tab === 'talk' && !loading && (
          <DialogOverview
            dialogs={dialogs}
            categories={categories}
            areas={areas}
            states={states}
            onOpen={(id) => navigate('push', () => setView({ name: 'dialog', id }))}
          />
        )}

        {/* ───────── FORTSCHRITT (die ehrliche Messung, eigener Raum) ───────── */}
        {view.name === 'tab' && view.tab === 'progress' && (
          <ProgressView
            states={stateList}
            stable={metrics.stable}
            maturing={metrics.maturing}
            active={metrics.active}
            dueNow={metrics.dueNow}
            coverage={metrics.coverage}
            totalChunks={chunks.length}
            successRate={successRate}
          />
        )}

        {/* ───────── BEREICH-DETAIL (Ebene 1 → 2) ───────── */}
        {view.name === 'area' && activeArea && (
          <AreaDetail
            areaProgress={activeArea}
            focusId={focusId}
            onOpenCategory={(id) => navigate('push', () => setView({ name: 'category', id }))}
            onClearFocus={() => setFocus(null)}
            onBack={() => navigate('pop', () => setView({ name: 'tab', tab: 'learn' }))}
            onPractice={() => navigate('push', () => enterSession({ kind: 'area', id: activeArea.area.id }))}
          />
        )}

        {/* ───────── THEMA-DETAIL (Ebene 2 → 3) ───────── */}
        {view.name === 'category' && activeCategory && (
          <div className="mx-auto w-full max-w-2xl">
            <CategoryDetail
              category={activeCategory}
              chunks={chunks}
              states={states}
              dialogs={dialogsByCategory[activeCategory.id] ?? []}
              isFocus={focusId === activeCategory.id}
              backLabel={parentArea?.title ?? 'Zurück'}
              onToggleFocus={() => setFocus(focusId === activeCategory.id ? null : activeCategory.id)}
              onOpenDialog={(id) => navigate('push', () => setView({ name: 'dialog', id }))}
              onBack={() =>
                navigate('pop', () =>
                  setView(
                    parentArea ? { name: 'area', id: parentArea.id } : { name: 'tab', tab: 'learn' },
                  ),
                )
              }
              onPractice={() =>
                navigate('push', () => enterSession({ kind: 'category', id: activeCategory.id }))
              }
            />
          </div>
        )}

        {/* ───────── GESPRÄCH (Dialog-Modus) ───────── */}
        {view.name === 'dialog' && activeDialog && (
          <Suspense
            fallback={
              <div className="glass mx-auto w-full max-w-xl rounded-2xl p-6 text-center text-muted">
                Gespräch lädt…
              </div>
            }
          >
            <DialogScene
              dialog={activeDialog}
              backLabel={dialogCategory?.title ?? 'Zurück'}
              areaHue={areaVisual(dialogCategory?.areaId).hue}
              learnerName={name}
              onProduce={(turn, result, helpUsed) =>
                handleDialogProduce(activeDialog.id, turn, result, helpUsed)
              }
              onExit={() =>
                navigate('pop', () =>
                  setView(
                    dialogCategory
                      ? { name: 'category', id: dialogCategory.id }
                      : { name: 'tab', tab: 'talk' },
                  ),
                )
              }
            />
          </Suspense>
        )}

        {/* ───────── LERN-SESSION (fokussiert) ───────── */}
        {view.name === 'session' && (
          <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
            <nav className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('pop', () => setView({ name: 'tab', tab: 'today' }))}
                  className="glass-soft flex items-center gap-1 rounded-full py-1.5 pl-2 pr-3 text-sm text-paper"
                  aria-label="Session verlassen"
                >
                  <IconBack className="h-4 w-4" /> Übersicht
                </button>
                {/* Modus-Abzeichen: klar der Üben-Modus (nicht das Gespräch). */}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-brand">
                  <IconTarget className="h-3.5 w-3.5" /> Üben
                </span>
              </div>
              {!done && queue.length > 0 && (
                <span className="text-xs font-medium uppercase tracking-wide text-faint">
                  {Math.min(pos + 1, queue.length)} / {queue.length}
                </span>
              )}
            </nav>

            {!done && currentChunk && currentSegment && currentState ? (
              <ComprehensionLoop
                segment={currentSegment}
                chunk={currentChunk}
                stage={currentState.stage}
                onResult={handleResult}
                known={known}
                scaffoldOpen={scaffoldOpen}
              />
            ) : null}

            {done && (
              <section className="glass rounded-2xl p-6 text-center">
                <p className="font-display text-xl font-semibold text-success">Session erledigt.</p>
                <p className="mt-1 text-sm text-muted">
                  Heute stabilisiert. Der Rest wartet — ohne zerbrechenden Streak.
                </p>
                {metrics.dueNow > 0 && (
                  <p className="mt-2 text-xs text-faint">
                    Noch {metrics.dueNow} fällig — bewusst auf die nächsten Sitzungen verteilt.
                  </p>
                )}
                <button
                  onClick={() => navigate('pop', () => setView({ name: 'tab', tab: 'today' }))}
                  className="btn-gold mt-4 rounded-xl px-5 py-2.5 font-medium text-ink"
                >
                  Zurück zur Übersicht
                </button>
              </section>
            )}
          </div>
        )}

        {showSettings && (
          <Suspense fallback={null}>
            <AiSettings onClose={() => setShowSettings(false)} />
          </Suspense>
        )}

        {showName && (
          <NameEditor
            initial={name}
            onSave={(n) => {
              saveName(n);
              setName(n);
              setShowName(false);
            }}
            onClose={() => setShowName(false)}
          />
        )}
      </main>
    </>
  );
}
