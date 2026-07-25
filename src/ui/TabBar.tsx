// Globale Navigation: vier Räume (docs/gremium-navigation.md, Schritt 1).
//
// WARUM AUSSERHALB VON <main>: `main.vt-page` trägt `view-transition-name`, und
// die Spezifikation legt darauf `contain: layout`. Damit wird <main> zum
// Bezugsrahmen für alles Positionierte darin — `position: fixed` bezog sich also
// auf <main> statt aufs Fenster, und die Leiste scrollte am Ende weg. Sie steht
// deshalb als Geschwister NEBEN <main>: dann klebt sie verlässlich am Fensterrand.
//
// UNTEN AUF ALLEN GRÖSSEN: erst stand sie ab `md` oben. Eine Navigationsleiste
// soll immer an derselben Stelle sein — und unten ist sie in Daumenreichweite.
// Auf breiten Geräten schwebt sie als zentriertes Dock über dem Rand.
//
// GOLDENER SCHNITT (Nutzerwunsch 2026-07-25): die senkrechte Gliederung folgt φ.
// Icon + Abstand (1,5 rem + 0,28 rem = 1,78 rem) zur Beschriftungszeile (1,1 rem)
// steht bei 1,62 — also φ. Das Dock ist damit ruhig proportioniert statt geraten.
//
// EHRLICHKEIT: Die Leiste trägt KEINE Zähler-Abzeichen („3 neu!"). Ein Abzeichen
// müsste ein Versprechen sein; die einzige fällige Zahl steht dort, wo sie etwas
// auslöst — auf dem Weiterlernen-Knopf.

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { IconToday, IconSprout, IconChat, IconChart } from './icons';

export type Tab = 'today' | 'learn' | 'talk' | 'progress';

const TABS: { id: Tab; label: string; Icon: (p: { className?: string }) => ReactNode }[] = [
  { id: 'today', label: 'Heute', Icon: IconToday },
  { id: 'learn', label: 'Lernen', Icon: IconSprout },
  { id: 'talk', label: 'Gespräche', Icon: IconChat },
  { id: 'progress', label: 'Fortschritt', Icon: IconChart },
];

export const TAB_IDS: Tab[] = TABS.map((t) => t.id);

/**
 * Die Markierung FOLGT dem Finger.
 *
 * Üblich ist, dass eine Reiterleiste erst am Ende der Wischgeste umspringt —
 * Leiste und Inhalt wirken dann wie zwei getrennte Bedienelemente. Läuft die
 * Markierung anteilig mit, wirken sie wie EIN Gegenstand. Das ist der Schritt
 * über den Standard hinaus, und er kostet nur diese eine Zahl: `progress`.
 */
export function TabBar({
  active,
  onSelect,
  progress = 0,
}: {
  active: Tab;
  onSelect: (t: Tab) => void;
  /** Zug-Fortschritt −1…1 aus `useSwipeTabs` (negativ = nach links gezogen). */
  progress?: number;
}) {
  // Die Leiste meldet ihre EIGENE Höhe nach oben (`--tabbar-h`), damit der
  // Inhalt darüber genau so viel Platz frei lässt, wie sie wirklich braucht.
  //
  // Vorher stand dort ein fester Abstand. Sobald jemand die System-Schriftgröße
  // hochstellt (Android-Textskalierung), wächst die Leiste — und verdeckte die
  // letzten Zeilen. Genau das war der gemeldete Fehler „die Bereiche überlappen
  // sich" (2026-07-25).
  const nav = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const el = nav.current;
    if (!el) return;
    const report = () =>
      document.documentElement.style.setProperty('--tabbar-h', `${el.offsetHeight}px`);
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty('--tabbar-h');
    };
  }, []);

  const i = TAB_IDS.indexOf(active);
  // Der Zug geht nach links (negativ) → die Markierung wandert nach RECHTS.
  const shift = Math.max(-1, Math.min(1, -progress));
  const pos = Math.max(0, Math.min(TABS.length - 1, i + shift));
  return (
    <nav
      ref={nav}
      aria-label="Hauptbereiche"
      /* Eigener Name für die Ansichts-Überblendung: dadurch wird die Leiste beim
         Drill-down NICHT mit weggeblendet, sondern bleibt stehen. Ohne das
         sprang die aktive Markierung während des Übergangs sichtbar hin und her. */
      style={{ viewTransitionName: 'tabbar' }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/75 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl md:inset-x-auto md:bottom-6 md:left-1/2 md:w-auto md:-translate-x-1/2 md:rounded-[1.75rem] md:border md:bg-white/[0.055] md:pb-0 md:shadow-[0_18px_50px_-14px_rgba(0,0,0,.75)]"
    >
      <ul className="relative mx-auto flex w-full max-w-md items-stretch px-2 py-1.5 md:max-w-none md:px-2 md:py-2">
        {/* Die mitlaufende Markierung — eine Fläche, keine vier Zustände. */}
        <li
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1.5 top-1.5 rounded-2xl bg-brand/[0.14] md:bottom-2 md:top-2"
          style={{
            width: `calc((100% - 1rem) / ${TABS.length})`,
            left: '0.5rem',
            transform: `translateX(calc(${pos} * 100%))`,
            transition: progress === 0 ? 'transform .22s cubic-bezier(.22,.61,.36,1)' : 'none',
          }}
        />
        {TABS.map(({ id, label, Icon }, idx) => {
          const on = id === active;
          // Farbe blendet anteilig zum Nachbarn — sonst springt der Ton, während
          // die Fläche gleitet.
          const near = 1 - Math.min(1, Math.abs(idx - pos));
          return (
            <li key={id} className="relative min-w-0 flex-1 md:flex-none">
              <button
                onClick={() => onSelect(id)}
                aria-current={on ? 'page' : undefined}
                className="flex w-full min-w-0 flex-col items-center gap-[0.28rem] rounded-2xl px-1.5 pb-1.5 pt-2 md:min-w-[5.6rem] md:px-2"
                style={{
                  color: `color-mix(in oklab, #E7C08A ${near * 100}%, rgba(236,236,244,0.5))`,
                }}
              >
                <Icon className="h-6 w-6 shrink-0" />
                {/* `min(...)`: Die Beschriftung wächst mit der System-Schrift mit,
                    aber nur so weit, wie das Gerät breit ist. Ohne die Schranke
                    lief „Fortschritt" bei hochgestellter Schrift über den Rand
                    hinaus (gemessen: rechte Kante 397 bei 390 px Breite). */}
                <span className="w-full truncate text-center text-[min(0.7rem,2.9vw)] font-medium leading-[1.35] tracking-[0.03em]">
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
