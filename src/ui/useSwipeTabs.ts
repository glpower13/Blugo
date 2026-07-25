// Wischen zwischen den Reitern (Nutzerwunsch 2026-07-25) — recherchiert, nicht geraten.
//
// WAS DIE PLATTFORMEN SAGEN:
// · Android macht das Wischen zwischen Reitern zum STANDARD (ViewPager2 + TabLayout).
// · Apples Richtlinien halten beim Reiter-Wechsel das TIPPEN für primär; Wischen ist
//   dort für Geschwister-Ansichten (Fotos) vorgesehen, nicht für die Reiterleiste.
// · Gemeinsamer Nenner der UX-Praxis: Wischen als ZUSATZ, nie als einziger Weg —
//   sonst ist es für alle unerreichbar, die nicht wischen können.
// Deshalb: Tippen bleibt vollwertig, Wischen kommt oben drauf.
//
// DIE VIER FALLSTRICKE, an denen naive Umsetzungen scheitern:
//
//   1. RANDGESTE. iOS Safari und Chrome deuten einen Wisch vom Bildschirmrand als
//      „zurück". Wer dort mitlauscht, löst beides gleichzeitig aus. Wir ignorieren
//      Gesten, die in der Randzone beginnen — der Browser behält sein Verhalten.
//   2. SENKRECHTES SCROLLEN. Wer sofort greift, blockiert das Scrollen. Wir legen
//      die Achse erst beim ersten echten Weg fest (Richtungs-Sperre) und geben
//      senkrechte Gesten vollständig frei.
//   3. WAAGERECHTE SCROLLER im Inhalt müssen gewinnen. Liegt einer unter dem
//      Finger, greifen wir gar nicht erst.
//   4. REDUZIERTE BEWEGUNG. Wer sie eingestellt hat, bekommt den Wechsel ohne
//      mitlaufende Animation — aber er funktioniert.
//
// DER SCHRITT DARÜBER HINAUS: Diese Umsetzung meldet den Zug fortlaufend
// (`progress`), damit auch die REITERLEISTE mitgeht. Üblich ist, dass die Leiste
// erst am Ende umspringt; wenn die Markierung dem Finger folgt, wirken Leiste und
// Inhalt wie EIN Gegenstand statt wie zwei Bedienelemente.

import { useCallback, useRef, useState } from 'react';

/** Randzone, in der die Zurück-Geste des Browsers Vorrang hat. */
const EDGE_PX = 28;
/** Ab diesem Weg gilt die Geste als waagerecht (Richtungs-Sperre). */
const LOCK_PX = 10;
/** Anteil der Breite, ab dem beim Loslassen umgeschaltet wird. */
const COMMIT_RATIO = 0.22;
/** Schnelles Schnippen schaltet auch unterhalb der Strecke um (px/ms). */
const FLING_VELOCITY = 0.45;
/**
 * ... aber nie unter dieser Strecke. Ohne diese Untergrenze zählt jede sehr
 * schnelle Mini-Bewegung als Schnippen — ein 38-px-Zucken schaltete den Reiter
 * um. Ein Schnippen ist schnell UND hat einen Weg.
 */
const FLING_MIN_PX = 44;
/** Gummiband am ersten/letzten Reiter. */
const RUBBER = 0.28;

export interface SwipeTabsState {
  /** Zug in Pixeln (negativ = nach links). 0 wenn nichts läuft. */
  dx: number;
  /** Fortschritt -1…1 relativ zur Breite — für die Leiste. */
  progress: number;
  /** Index, zu dem gerade gezogen wird, oder null. */
  toIndex: number | null;
  /** Läuft gerade die Auslauf-Animation? */
  settling: boolean;
}

export function useSwipeTabs(index: number, count: number, onChange: (next: number) => void) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<SwipeTabsState>({
    dx: 0,
    progress: 0,
    toIndex: null,
    settling: false,
  });

  // Alles Veränderliche einer Geste in einem Ref: kein Render pro Bewegung
  // außer dem, der die Verschiebung zeichnet.
  const g = useRef({
    active: false,
    locked: false as false | 'x' | 'y',
    startX: 0,
    startY: 0,
    startT: 0,
    lastX: 0,
    lastT: 0,
    width: 1,
    pointerId: -1,
  });

  const reduceMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  /** Liegt unter dem Finger ein waagerecht scrollbares Element? Dann Finger weg. */
  const inHorizontalScroller = (target: EventTarget | null): boolean => {
    let el = target as HTMLElement | null;
    while (el && el !== ref.current) {
      if (el.scrollWidth > el.clientWidth + 2) {
        const ov = getComputedStyle(el).overflowX;
        if (ov === 'auto' || ov === 'scroll') return true;
      }
      el = el.parentElement;
    }
    return false;
  };

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Maus bewusst nicht: dort ist Ziehen ungewohnt und kollidiert mit dem
      // Markieren von Text. Finger und Stift ja.
      if (e.pointerType === 'mouse') return;
      const el = ref.current;
      if (!el) return;
      const w = el.clientWidth || 1;
      // Fallstrick 1: Randzone dem Browser überlassen.
      if (e.clientX < EDGE_PX || e.clientX > w - EDGE_PX) return;
      // Fallstrick 3: waagerechte Scroller haben Vorrang.
      if (inHorizontalScroller(e.target)) return;
      g.current = {
        active: true,
        locked: false,
        startX: e.clientX,
        startY: e.clientY,
        startT: e.timeStamp,
        lastX: e.clientX,
        lastT: e.timeStamp,
        width: w,
        pointerId: e.pointerId,
      };
    },
    [],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const c = g.current;
      if (!c.active || e.pointerId !== c.pointerId) return;
      const dx = e.clientX - c.startX;
      const dy = e.clientY - c.startY;

      // Fallstrick 2: Achse einmal festlegen, dann dabei bleiben.
      if (!c.locked) {
        if (Math.abs(dx) < LOCK_PX && Math.abs(dy) < LOCK_PX) return;
        c.locked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (c.locked === 'y') {
          c.active = false; // senkrecht: vollständig freigeben
          return;
        }
      }
      c.lastX = e.clientX;
      c.lastT = e.timeStamp;

      const dir = dx < 0 ? 1 : -1; // 1 = zum nächsten Reiter
      const to = index + dir;
      const atEnd = to < 0 || to >= count;
      // Gummiband statt hartem Stopp am ersten/letzten Reiter.
      const eff = atEnd ? dx * RUBBER : dx;
      setState({
        dx: eff,
        progress: eff / c.width,
        toIndex: atEnd ? null : to,
        settling: false,
      });
    },
    [index, count],
  );

  const finish = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const c = g.current;
      if (!c.active || c.locked !== 'x') {
        c.active = false;
        return;
      }
      c.active = false;
      const dx = e.clientX - c.startX;
      // Geschwindigkeit aus dem LETZTEN Stück, nicht über die ganze Geste: wer
      // erst zögert und dann schnippt, meint das Schnippen.
      const segT = Math.max(1, e.timeStamp - c.lastT);
      const v = Math.abs(e.clientX - c.lastX) / segT;
      const dir = dx < 0 ? 1 : -1;
      const to = index + dir;
      const canGo = to >= 0 && to < count;
      const far = Math.abs(dx) > c.width * COMMIT_RATIO;
      const flung = v > FLING_VELOCITY && Math.abs(dx) > FLING_MIN_PX;
      const commit = canGo && (far || flung);

      if (commit && reduceMotion()) {
        setState({ dx: 0, progress: 0, toIndex: null, settling: false });
        onChange(to);
        return;
      }
      if (commit) {
        // Zu Ende gleiten lassen, dann umschalten und zurücksetzen.
        setState({ dx: -dir * c.width, progress: -dir, toIndex: to, settling: true });
        window.setTimeout(() => {
          onChange(to);
          setState({ dx: 0, progress: 0, toIndex: null, settling: false });
        }, 190);
        return;
      }
      // Nicht weit genug: zurückfedern.
      setState({ dx: 0, progress: 0, toIndex: null, settling: true });
      window.setTimeout(
        () => setState({ dx: 0, progress: 0, toIndex: null, settling: false }),
        190,
      );
    },
    [index, count, onChange],
  );

  return {
    ref,
    state,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finish,
      onPointerCancel: finish,
      // Beim waagerechten Ziehen soll der Browser nicht mitscrollen; senkrecht
      // bleibt frei. `pan-y` sagt genau das — ohne JS-preventDefault, das auf
      // iOS unzuverlässig ist.
      style: { touchAction: 'pan-y' as const },
    },
  };
}
