import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { Area, Category, Chunk, ChunkState, ReviewResult, Segment } from './domain/chunk';
import type { Dialog, DialogTurn } from './domain/dialog';
import { seedContentSource } from './modules/content/contentPipeline';
import { getAllChunkStates, logEvent, putChunkState } from './storage/db';
import { initialState, schedule } from './modules/memory/memoryEngine';
import { newCountFor, recentSuccessRate, scaffoldShouldOpen } from './modules/memory/difficulty';
import { buildQueue, buildPracticeQueue, pickSegmentForChunk } from './session/buildQueue';
import { loadFocus, saveFocus } from './session/focus';
import { loadName, saveName } from './session/profile';
import { loadPreferences, savePreferences, type Preferences, ungesicherteBeweise } from './session/preferences';
import { setSpeechRate } from './modules/comprehension/tts';
import { setOnDeviceReady, setSpeechLocalOnly } from './modules/comprehension/speech';
import { clearAll, putChunkStates } from './storage/db';
import { knownPhrases } from './session/knownChunks';
import { ComprehensionLoop } from './modules/comprehension/ComprehensionLoop';
import { AreaOverview } from './modules/progress/AreaOverview';
import { AreaDetail } from './modules/progress/AreaDetail';
import { CategoryDetail } from './modules/progress/CategoryDetail';
import { TodayView } from './modules/progress/TodayView';
import { LanguagePair } from './modules/progress/LanguagePair';
import { ProgressView } from './modules/progress/ProgressView';
import { DialogOverview } from './modules/dialog/DialogOverview';
// Erst bei Bedarf laden (kleineres Startbündel → schnellere erste Anzeige).
const DialogScene = lazy(() =>
  import('./modules/dialog/DialogScene').then((m) => ({ default: m.DialogScene })),
);
import { computeMetrics, directionSplit, spokenAloud } from './modules/progress/metrics';
import { areaProgress, categoryProgress } from './modules/progress/categories';
import { milestoneProgress } from './modules/progress/milestones';
import { InstallButton } from './ui/InstallButton';
import { Backdrop } from './ui/Backdrop';
import { NameEditor } from './ui/NameEditor';
import { IconBack, IconTarget } from './ui/icons';
import { areaVisual } from './ui/areaTheme';
import { TabBar, TAB_IDS, tabLabel, type Tab } from './ui/TabBar';
import { useSwipeTabs } from './ui/useSwipeTabs';
const SettingsScreen = lazy(() =>
  import('./modules/settings/SettingsScreen').then((m) => ({ default: m.SettingsScreen })),
);
import { initAiSettings } from './modules/content/aiSettings';
import { aiRegistry } from './modules/content/aiRegistry';
import { pickTargets } from './modules/sparring/targets';
const SparringScene = lazy(() =>
  import('./modules/sparring/SparringScene').then((m) => ({ default: m.SparringScene })),
);
// Der Startpilot läuft genau einmal — er gehört nicht ins Startbündel.
const StartpilotScene = lazy(() =>
  import('./modules/onboarding/StartpilotScene').then((m) => ({ default: m.StartpilotScene })),
);

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
  | { name: 'sparring' } // freies Gespräch mit dem KI-Partner (P4)
  | { name: 'startpilot' } // die ersten sechzehn Wörter, geführt
  | { name: 'session' };

/**
 * Nach jedem Ansichtswechsel den Fokus auf die neue Überschrift setzen.
 *
 * BEFUND (Barrierefreiheits-Audit 2026-07-25): Nach „Gespräch verlassen" stand
 * der Fokus auf `<body>`. Wer mit der Tastatur arbeitet, musste sich jedes Mal
 * neu durch die Reiterleiste tabben; ein Vorlese-Programm meldete den Wechsel
 * gar nicht. Die Überschrift bekommt `tabIndex={-1}`, damit sie fokussierbar
 * ist, ohne im Tabulator-Lauf aufzutauchen.
 */
function focusNewView(): void {
  requestAnimationFrame(() => {
    const h = document.querySelector<HTMLElement>('main h1');
    if (!h) return;
    h.tabIndex = -1;
    h.focus({ preventScroll: true });
  });
}

/** Zu welchem Reiter eine Drill-down-Ansicht gehört (für die aktive Markierung). */
function tabOf(view: View): Tab {
  switch (view.name) {
    case 'tab':
      return view.tab;
    case 'dialog':
    case 'sparring':
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
  // Ab welcher Stelle der Warteschlange die FREIWILLIGE Wiederholung beginnt.
  // Alles davor war fällig oder neu; alles danach hat der Lerner selbst gewählt.
  const [pflichtAnzahl, setPflichtAnzahl] = useState(0);
  const [pos, setPos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  // Einstellungen des Lerners (docs/gremium-einstellungen.md). Sie ändern den
  // AUFWAND, nie den Maßstab — deshalb liegen sie neben der Engine, nicht darin.
  const [prefs, setPrefs] = useState<Preferences>(() => loadPreferences());
  const [focusId, setFocusId] = useState<string | null>(null);
  // Vorname des Lerners (lokal): personalisiert Begrüßung & Gespräche.
  const [name, setName] = useState<string>(() => loadName());
  const [showName, setShowName] = useState(false);
  const [showPair, setShowPair] = useState(false);
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
        const [ars, cats, cs, segs, persisted] = await Promise.all([
          seedContentSource.getAreas(),
          seedContentSource.getCategories(),
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
        setAreas(ars);
        setCategories(cats);
        setChunks(cs);
        setSegments(segs);
        setStates(byId);
        setFocusId(loadFocus());
        // Die Gespräche kommen NACH dem ersten Bild. Gemessen auf einer
        // gedrosselten Verbindung (400 kbit/s): erste Fläche nutzbar nach 4,6 s
        // statt 5,7 s, weil ein Drittel des Inhalts nicht mehr davorsteht. Die
        // Gesprächsliste ist dafür beim allerersten Besuch ~1,2 s später da —
        // ein bewusster Tausch: die erste Fläche sieht jeder, den Reiter nicht.
        // Ab dem zweiten Start liegt beides ohnehin im Cache der PWA.
        // (Parallel statt danach gestartet: messgleich, aber danach ist die
        // sauberere Reihenfolge — nichts konkurriert um dieselbe Leitung.)
        seedContentSource
          .getDialogs()
          .then(setDialogs)
          .catch((e) => console.error('Gespräche konnten nicht geladen werden', e));
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

  // Tempo und Erkennungs-Haltung wirken in Modulen, die keine React-Zustände
  // lesen können — deshalb einmal zentral durchreichen.
  useEffect(() => {
    setSpeechRate(prefs.speechRate);
    setSpeechLocalOnly(prefs.speechLocalOnly);
    setOnDeviceReady(prefs.speechOnDeviceReady);
  }, [prefs.speechRate, prefs.speechLocalOnly, prefs.speechOnDeviceReady]);

  const updatePrefs = useCallback((p: Preferences) => {
    setPrefs(p);
    savePreferences(p);
  }, []);

  const stateList = useMemo(() => Object.values(states), [states]);
  // Die Erfolgsquote wurde bisher NUR beim Start berechnet. „(100 % zuletzt)"
  // blieb dann eine ganze Sitzung lang stehen, obwohl gerade dreimal „Nochmal"
  // gedrückt wurde — und die Anti-Klippen-Logik, die daran hängt, reagierte erst
  // beim nächsten App-Start (Ehrlichkeits-Audit 2026-07-25).
  const successRate = useMemo(() => recentSuccessRate(stateList), [stateList]);
  // Sprachliche Meilensteine (A1 … B2) — bewegen sich nur an BEWIESENEN Wendungen.
  const milestones = useMemo(() => milestoneProgress(chunks, categories, states), [chunks, categories, states]);
  const metrics = useMemo(() => computeMetrics(stateList), [stateList]);
  // Laut Gesagtes (P3): eine Eigenschaft der Abrufe, keine zweite Währung.
  const spokenCount = useMemo(() => spokenAloud(stateList), [stateList]);
  // Fällige Wendungen, die der Sparringspartner hervorlocken soll (P4).
  const sparringTargets = useMemo(
    () => pickTargets(chunks, states, Date.now()),
    [chunks, states],
  );
  // Wie viele Wendungen in welcher RICHTUNG stehen (gemessen, nicht gewählt).
  const direction = useMemo(() => directionSplit(stateList), [stateList]);
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
  // Sitzung lässt aber nur `newCountFor` neue zu — der Knopf versprach 98
  // und lieferte 3. Sachlich richtig, als Ankündigung falsch (10-open-questions.md).
  //
  // Motivation: Eine Wand aus 98 ist genau die Klippe, gegen die dieses Projekt
  // gebaut ist (CLAUDE.md, „keine Klippe"). Eine kleine, endliche Zahl ist ein
  // Zugehen-Signal — und sie ist WAHR, weil es exakt die Warteschlange ist, die
  // gleich läuft. `buildQueue` ist deterministisch, also kann hier nichts driften:
  // dieselbe Liste wird angezeigt und dann abgearbeitet.
  const plannedSession = useMemo(
    () =>
      buildQueue(Object.values(states), Date.now(), newCountFor(successRate, prefs.newPerSession), {
        categoryByChunkId,
        categoryId: focusId,
      }),
    [states, successRate, prefs.newPerSession, categoryByChunkId, focusId],
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
      focusNewView();
      return;
    }
    document.documentElement.dataset.nav = direction;
    const t = doc.startViewTransition(() => flushSync(update));
    void t.finished.finally(() => {
      delete document.documentElement.dataset.nav;
      focusNewView();
    });
  }, []);

  /**
   * Escape führt aus jeder fokussierten Fläche zurück auf „Heute".
   *
   * BEFUND DES DAUERLAUFS (47 Nutzer, 2026-07-25): In Sitzung, Gespräch und
   * Sparring ist die Reiterleiste bewusst ausgeblendet — der Zurück-Knopf ist
   * der EINZIGE Ausweg. Bleibt dort etwas hängen, sitzt der Nutzer fest, und
   * jeder weitere Schritt scheitert. Eine zweite, immer erreichbare Tür kostet
   * nichts und nimmt dem Fall die Schärfe. Zugleich behebt es den
   * Barrierefreiheits-Befund „Escape schließt nirgends etwas".
   *
   * Überlagerungen (Einstellungen, Name, Sprachpaar) fangen Escape selbst ab
   * und halten es mit `stopPropagation` bei sich — die oberste Fläche gewinnt.
   */
  useEffect(() => {
    if (view.name === 'tab') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      navigate('pop', () => setView({ name: 'tab', tab: 'today' }));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view.name, navigate]);

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
        setPflichtAnzahl(plannedSession.length); // der Tagesplan ist ganz Pflicht
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
      // Und die Sitzung hat IMMER etwas zu tun: Ist nichts fällig, folgt
      // freiwillige Wiederholung (`buildPracticeQueue`). Ein Knopf, der ins
      // Leere führt, nimmt dem Lerner die Möglichkeit zurückzugehen.
      const { queue: q, faellig } = buildPracticeQueue(
        pool,
        Date.now(),
        newCountFor(successRate, prefs.newPerSession),
      );
      setQueue(q);
      setPflichtAnzahl(faellig);
      setPos(0);
      setView({ name: 'session' });
    },
    [plannedSession, states, successRate, prefs.newPerSession, categoryByChunkId, areaByChunkId],
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
  // Wann die Bedeutung/Dekodierung sofort offen steht: bei neuem Stoff — und
  // nach einem „Nochmal". Die Regel steht in `difficulty.ts`, weil sie zur
  // Anti-Klippe gehört und dort geprüft wird, nicht hier im Beiwerk.
  const scaffoldOpen = scaffoldShouldOpen(currentState);

  async function handleResult(
    result: ReviewResult,
    helpUsed: boolean,
    spoken = false,
    exact = false,
  ) {
    if (submitting.current) return; // ignore rapid double-taps on the same item
    if (!currentChunk || !currentState || !currentSegment) return;
    submitting.current = true;
    try {
      const now = Date.now();
      const next = schedule(currentState, result, currentSegment.id, now, {
        spoken,
        exact,
        retention: prefs.retention,
      });
      // Persist first; only advance the UI once the write succeeded, so a
      // storage failure is surfaced and never silently drops progress.
      await putChunkState(next);
      await logEvent(currentChunk.id, {
        at: now,
        result,
        segmentId: currentSegment.id,
        helpUsed,
        ...(spoken ? { spoken: true } : {}),
      });
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
    (
      dialogId: string,
      turn: DialogTurn,
      result: ReviewResult,
      helpUsed: boolean,
      spoken = false,
      exact = false,
    ) => {
      const chunkId = turn.chunkId;
      if (!chunkId) return;
      const state = states[chunkId];
      if (!state) return;
      const now = Date.now();
      const segId = `dialog:${dialogId}:${turn.id}`;
      const next = schedule(state, result, segId, now, { spoken, exact, retention: prefs.retention });
      void (async () => {
        try {
          await putChunkState(next);
          await logEvent(chunkId, {
            at: now,
            result,
            segmentId: segId,
            helpUsed,
            ...(spoken ? { spoken: true } : {}),
          });
          setStates((prev) => ({ ...prev, [chunkId]: next }));
        } catch (e) {
          console.error('Persist failed', e);
          setError('Die Bewertung konnte nicht gespeichert werden. Bitte die App neu laden.');
        }
      })();
    },
    [states, prefs.retention],
  );

  /**
   * Wem der Startpilot angeboten wird.
   *
   * NICHT nur „noch nicht gelaufen": Wer einen Lernstand von einem anderen
   * Gerät einliest, hat vielleicht schon hundert Wendungen hinter sich — dem
   * „Fang hier an" anzubieten wäre schlicht falsch. Angeboten wird er nur,
   * solange noch KEIN einziger Abruf gelungen ist (Befund 2026-07-26).
   */
  const startpilotOffen = useMemo(
    () =>
      prefs.startpilotDoneAt === null &&
      chunks.some((c) => c.categoryId === 'cat-first-words') &&
      !Object.values(states).some((s) => s.history.some((h) => h.result === 'good')),
    [prefs.startpilotDoneAt, chunks, states],
  );

  // Die sechzehn Wörter des Startpiloten, in ihrer festgelegten Reihenfolge.
  const ersteWoerter = useMemo(
    () => chunks.filter((c) => c.categoryId === 'cat-first-words'),
    [chunks],
  );

  /**
   * Eine Antwort im Startpiloten — DIESELBE Memory-Engine wie überall sonst.
   *
   * Kein zweiter Zähler, kein Startpiloten-Punktestand: Was hier gelingt, ist
   * ein Wiedererkennen und wird als solches verbucht. „Bewiesen stabil" kann
   * daraus per Konstruktion nichts werden — das verlangt die Produktions-Stufe
   * nach über neunzig Tagen (`memoryEngine.ts`).
   */
  const handleStartpilot = useCallback(
    (chunkId: string, result: ReviewResult) => {
      const state = states[chunkId];
      if (!state) return;
      const now = Date.now();
      const segId = `startpilot:${chunkId}`;
      const next = schedule(state, result, segId, now, { retention: prefs.retention });
      void (async () => {
        try {
          await putChunkState(next);
          await logEvent(chunkId, { at: now, result, segmentId: segId });
          setStates((prev) => ({ ...prev, [chunkId]: next }));
        } catch (e) {
          console.error('Persist failed', e);
          setError('Die Antwort konnte nicht gespeichert werden. Bitte die App neu laden.');
        }
      })();
    },
    [states, prefs.retention],
  );

  // Im Sparring produzierte Wendung: derselbe Weg wie überall (P4). Bewusst
  // ohne Selbsteinschätzung — hier ist der Treffer objektiv: der Lerner hat die
  // geprüfte Wendung selbst gesagt, ohne dass sie ihm vorgesagt wurde.
  const handleSparringProduced = useCallback(
    (chunk: Chunk, spoken: boolean, helpUsed: boolean) => {
      const state = states[chunk.id];
      if (!state) return;
      const now = Date.now();
      const segId = `sparring:${chunk.id}:${now}`;
      const next = schedule(state, 'good', segId, now, { spoken, retention: prefs.retention });
      void (async () => {
        try {
          await putChunkState(next);
          await logEvent(chunk.id, {
            at: now,
            result: 'good',
            segmentId: segId,
            helpUsed,
            ...(spoken ? { spoken: true } : {}),
          });
          setStates((prev) => ({ ...prev, [chunk.id]: next }));
        } catch (e) {
          console.error('Persist failed', e);
          setError('Die Bewertung konnte nicht gespeichert werden. Bitte die App neu laden.');
        }
      })();
    },
    [states, prefs.retention],
  );

  const done = !loading && pos >= queue.length;
  // Ebene 4 (Lernen/Gespräch): die globale Navigation verschwindet — nichts lenkt
  // ab (docs/gremium-navigation.md §4, „Formsprache je Ebene").
  const showTabs =
    view.name !== 'session' &&
    view.name !== 'dialog' &&
    view.name !== 'sparring' &&
    view.name !== 'startpilot';
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

  // ── Wischen zwischen den Reitern ──────────────────────────────────────────
  const tabIndex = view.name === 'tab' ? TAB_IDS.indexOf(view.tab) : -1;
  const swipe = useSwipeTabs(Math.max(0, tabIndex), TAB_IDS.length, (next) =>
    setView({ name: 'tab', tab: TAB_IDS[next] }),
  );
  const neighbourTab = swipe.state.toIndex != null ? TAB_IDS[swipe.state.toIndex] : null;
  const neighbourSide = swipe.state.toIndex != null && swipe.state.toIndex > tabIndex ? 1 : -1;

  /** Der Inhalt EINES Reiters — damit ihn der Wisch-Container zweimal zeigen kann. */
  function renderTab(tab: Tab) {
    return (
      <>
        {/* ───────── HEUTE (Ebene 0 · der Verteiler) ───────── */}
        {tab === 'today' && (
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
              onOpenPair={() => setShowPair(true)}
              onStart={() => navigate('push', () => enterSession())}
              onGoLearn={() => navigate('push', () => setView({ name: 'tab', tab: 'learn' }))}
              onGoTalk={() => navigate('push', () => setView({ name: 'tab', tab: 'talk' }))}
              onGoSparring={() => navigate('push', () => setView({ name: 'sparring' }))}
              sparringReady={aiRegistry.partner !== null}
              sparringTargets={sparringTargets.length}
            startpilotOffen={startpilotOffen}
            onStartpilot={() => navigate('push', () => setView({ name: 'startpilot' }))}
            />
            <div className="mx-auto mt-auto flex w-full max-w-md flex-col gap-3 pt-4 md:max-w-xl">
              <InstallButton />
              <p className="text-center text-[0.7rem] tracking-wide text-faint">
                © 2026 Andreas Fink · NEUROLANG
              </p>
            </div>
          </>
        )}

        {/* ───────── LERNEN (Ebene 1 · der Baum) ───────── */}
        {tab === 'learn' && (
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
                onStartpilot={() => navigate('push', () => setView({ name: 'startpilot' }))}
                startpilotGelaufen={prefs.startpilotDoneAt !== null}
              />
            )}
          </div>
        )}

        {/* ───────── GESPRÄCHE (eigener Raum statt drei Klicks tief) ───────── */}
        {tab === 'talk' && !loading && (
          <DialogOverview
            dialogs={dialogs}
            categories={categories}
            areas={areas}
            states={states}
            onOpen={(id) => navigate('push', () => setView({ name: 'dialog', id }))}
            onOpenSparring={() => navigate('push', () => setView({ name: 'sparring' }))}
            sparringReady={aiRegistry.partner !== null}
            sparringTargets={sparringTargets.length}
          />
        )}

        {/* ───────── FORTSCHRITT (die ehrliche Messung, eigener Raum) ───────── */}
        {tab === 'progress' && (
          <ProgressView
            states={stateList}
            stable={metrics.stable}
            maturing={metrics.maturing}
            active={metrics.active}
            dueNow={metrics.dueNow}
            coverage={metrics.coverage}
            coverageBase={metrics.coverageBase}
            totalChunks={chunks.length}
            successRate={successRate}
            spoken={spokenCount}
            milestones={milestones}
            ungesichert={ungesicherteBeweise(metrics.stable, prefs)}
            onSichern={() => setShowSettings(true)}
          />
        )}

      </>
    );
  }

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
          progress={view.name === 'tab' ? swipe.state.progress : 0}
          /* SOFORT, ohne Überblendung. Ein Reiterwechsel ist SEITWÄRTS-Navigation,
             keine Bewegung im Baum — die Ansichts-Überblendung kostete dafür ~0,8 s
             und ließ die Leiste selbst mitspringen. Richtungsanimationen bleiben
             dem Drill-down vorbehalten, wo sie etwas bedeuten. */
          onSelect={(tab) => setView({ name: 'tab', tab })}
        />
      )}

      {/* Ansage des Ansichtswechsels.
          BEFUND D-3 (Prüfkaskade 2026-07-25): Ein Reiterwechsel läuft bewusst
          NICHT über `navigate()` (sofort, ohne Überblendung) — damit lief auch
          `focusNewView()` dort nicht, und ein Vorlese-Programm meldete den
          Wechsel gar nicht. Dasselbe gilt fürs Wischen. Statt den Fokus zu
          stehlen (der gehört bei Reitern auf den Reiter) sagt eine höfliche
          Ansage, wo man gelandet ist. Steht außerhalb von <main>, damit sie das
          Stilllegen durch eine offene Überlagerung nicht mitmacht. */}
      <p aria-live="polite" className="sr-only">
        {view.name === 'tab' ? tabLabel(view.tab) : ''}
      </p>

      <main
        /* Der Abstand nach unten kommt aus der GEMESSENEN Höhe der Reiterleiste
           (`--tabbar-h`, gesetzt von TabBar). Ein fester Wert reichte nicht: Bei
           hochgestellter System-Schrift wächst die Leiste und verdeckte sonst
           die letzten Zeilen (gemeldeter Fehler 2026-07-25). */
        style={showTabs ? { paddingBottom: 'calc(var(--tabbar-h, 5.5rem) + 1.5rem)' } : undefined}
        className={`vt-page mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-4 pt-6 md:max-w-3xl md:px-6 ${
          showTabs ? '' : 'pb-10'
        }`}
      >
        {error && (
          <section className="rounded-2xl border border-danger/40 bg-danger/10 p-4">
            <p className="text-sm text-danger">{error}</p>
          </section>
        )}

        {/* Wischbarer Reiter-Bereich (docs/gremium-navigation.md, useSwipeTabs.ts).
            Nur der aktive Reiter ist gemountet; der Nachbar kommt erst dazu,
            WÄHREND gezogen wird — sonst kostete das Wischen die Ladezeit, die
            gerade erst gewonnen wurde. */}
        {view.name === 'tab' && (
          <div
            ref={swipe.ref}
            {...swipe.handlers}
            className="relative flex flex-1 flex-col overflow-hidden"
          >
            <div
              className="flex flex-1 flex-col"
              style={{
                transform: `translateX(${swipe.state.dx}px)`,
                transition: swipe.state.settling
                  ? 'transform .19s cubic-bezier(.22,.61,.36,1)'
                  : 'none',
              }}
            >
              {renderTab(view.tab)}
            </div>
            {neighbourTab && (
              <div
                aria-hidden="true"
                className="absolute inset-0 flex flex-col overflow-hidden"
                style={{
                  transform: `translateX(calc(${swipe.state.dx}px + ${neighbourSide}00%))`,
                  transition: swipe.state.settling
                    ? 'transform .19s cubic-bezier(.22,.61,.36,1)'
                    : 'none',
                }}
              >
                {renderTab(neighbourTab)}
              </div>
            )}
          </div>
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
                Gespräch lädt …
              </div>
            }
          >
            <DialogScene
              dialog={activeDialog}
              backLabel={dialogCategory?.title ?? 'Zurück'}
              areaHue={areaVisual(dialogCategory?.areaId).hue}
              learnerName={name}
              onProduce={(turn, result, helpUsed, spoken) =>
                handleDialogProduce(activeDialog.id, turn, result, helpUsed, spoken)
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

        {/* ───────── SPARRING (freies Gespräch, gemessen — P4) ───────── */}
        {view.name === 'sparring' && (
          <Suspense
            fallback={
              <div className="glass mx-auto w-full max-w-xl rounded-2xl p-6 text-center text-muted">
                Sparring lädt …
              </div>
            }
          >
            <SparringScene
              targets={sparringTargets}
              learnerName={name}
              onProduced={handleSparringProduced}
              onOpenSettings={() => setShowSettings(true)}
              onExit={() => navigate('pop', () => setView({ name: 'tab', tab: 'talk' }))}
            />
          </Suspense>
        )}

        {/* ───────── STARTPILOT (die ersten sechzehn Wörter) ───────── */}
        {view.name === 'startpilot' && (
          <Suspense
            fallback={
              <div className="glass mx-auto w-full max-w-xl rounded-2xl p-6 text-center text-muted">
                Startpilot lädt …
              </div>
            }
          >
            <StartpilotScene
              woerter={ersteWoerter}
              onErgebnis={handleStartpilot}
              onFertig={(durchgelaufen) => {
                if (durchgelaufen) updatePrefs({ ...prefs, startpilotDoneAt: Date.now() });
                navigate('pop', () => setView({ name: 'tab', tab: 'today' }));
              }}
            />
          </Suspense>
        )}

        {/* ───────── LERN-SESSION (fokussiert) ───────── */}
        {view.name === 'session' && (
          <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
            {/* Die wichtigste Fläche der App hatte keine einzige Überschrift —
                für ein Vorlese-Programm gab es hier keinen Einstiegspunkt
                (Barrierefreiheits-Audit 2026-07-25). Sichtbar ist sie nicht
                nötig: Modus-Abzeichen und Zähler stehen daneben. */}
            <h1 className="sr-only">
              Üben — Wendung {Math.min(pos + 1, Math.max(queue.length, 1))} von {queue.length}
            </h1>
            <nav className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('pop', () => setView({ name: 'tab', tab: 'today' }))}
                  className="glass-soft flex min-h-11 items-center gap-1 rounded-full pl-2.5 pr-4 text-sm text-paper"
                  aria-label="Übersicht — Sitzung verlassen"
                >
                  <IconBack className="h-4 w-4" /> Übersicht
                </button>
                {/* Modus-Abzeichen: klar der Üben-Modus (nicht das Gespräch). */}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-brand">
                  <IconTarget className="h-3.5 w-3.5" /> Üben
                </span>
              </div>
              {!done && queue.length > 0 && (
                <span
                  aria-live="polite"
                  className="whitespace-nowrap text-xs font-medium uppercase tracking-wide text-muted"
                >
                  {Math.min(pos + 1, queue.length)} / {queue.length}
                </span>
              )}
            </nav>

            {/* Ab hier hat der Lerner SELBST weitergemacht — nichts davon war
                fällig. Der Satz steht genau einmal, an der Grenze, und sagt die
                unbequeme Wahrheit: Häufiger üben bringt dem Beweis nichts, weil
                der Beweis die PAUSE misst und nicht die Menge
                (`07-measurement.md`). Verboten wird es trotzdem nicht — wer
                zurückgehen will, darf das jederzeit. */}
            {!done && pos >= pflichtAnzahl && queue.length > pflichtAnzahl && (
              <section className="glass rounded-2xl border border-line px-4 py-3">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-brand">
                  Freiwillige Wiederholung
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  {pflichtAnzahl === 0
                    ? 'Hier ist gerade nichts fällig — du wiederholst freiwillig.'
                    : 'Das Fällige ist durch — ab hier wiederholst du freiwillig.'}{' '}
                  Das schadet nichts, bringt dem Gedächtnis aber wenig: Was du eben
                  erst konntest, kannst du auch gleich noch. Für „bewiesen stabil"
                  zählt allein, dass du es nach einer langen Pause noch kannst — mehr
                  Wiederholungen machen diese Pause nicht kürzer, sondern länger.
                </p>
              </section>
            )}

            {!done && currentChunk && currentSegment && currentState ? (
              <ComprehensionLoop
                segment={currentSegment}
                chunk={currentChunk}
                stage={currentState.stage}
                state={currentState}
                retention={prefs.retention}
                onResult={handleResult}
                known={known}
                scaffoldOpen={scaffoldOpen}
              />
            ) : null}

            {done && (
              <section className="glass rounded-2xl p-6 text-center">
                <p className="font-display text-xl font-semibold text-success">Sitzung erledigt.</p>
                <p className="mt-1 text-sm text-muted">
                  Heute stabilisiert. Der Rest wartet — hier zerbricht keine Serie.
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

      </main>

      {/* Overlays ebenfalls AUSSERHALB von <main>: dort erzeugt
          `view-transition-name` ein `contain: layout`, das einen eigenen
          Stapelkontext aufmacht. Ein `z-50` darin kommt trotzdem nicht über die
          Reiterleiste daneben — der Fußtext lag hinter ihr. */}
      {showSettings && (
        <Suspense fallback={null}>
          <SettingsScreen
            name={name}
            onName={(n) => {
              saveName(n);
              setName(n);
            }}
            prefs={prefs}
            onPrefs={updatePrefs}
            states={stateList}
            totalChunks={chunks.length}
            onStartpilot={() => {
              setShowSettings(false);
              navigate('push', () => setView({ name: 'startpilot' }));
            }}
            onImport={async (next, importedName, importedPrefs) => {
              await putChunkStates(next);
              setStates(Object.fromEntries(next.map((s) => [s.chunkId, s])));
              if (importedName) {
                saveName(importedName);
                setName(importedName);
              }
              updatePrefs(importedPrefs);
            }}
            onWipe={async () => {
              await clearAll();
              const fresh = Object.fromEntries(
                chunks.map((c) => [c.id, initialState(c.id, Date.now())]),
              );
              setStates(fresh);
              setQueue([]);
              setPos(0);
            }}
            onClose={() => setShowSettings(false)}
          />
        </Suspense>
      )}

      {showPair && <LanguagePair split={direction} onClose={() => setShowPair(false)} />}

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
    </>
  );
}
