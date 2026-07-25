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

import type { ReactNode } from 'react';
import { IconToday, IconSprout, IconChat, IconChart } from './icons';

export type Tab = 'today' | 'learn' | 'talk' | 'progress';

const TABS: { id: Tab; label: string; Icon: (p: { className?: string }) => ReactNode }[] = [
  { id: 'today', label: 'Heute', Icon: IconToday },
  { id: 'learn', label: 'Lernen', Icon: IconSprout },
  { id: 'talk', label: 'Gespräche', Icon: IconChat },
  { id: 'progress', label: 'Fortschritt', Icon: IconChart },
];

export function TabBar({ active, onSelect }: { active: Tab; onSelect: (t: Tab) => void }) {
  return (
    <nav
      aria-label="Hauptbereiche"
      /* Eigener Name für die Ansichts-Überblendung: dadurch wird die Leiste beim
         Drill-down NICHT mit weggeblendet, sondern bleibt stehen. Ohne das
         sprang die aktive Markierung während des Übergangs sichtbar hin und her. */
      style={{ viewTransitionName: 'tabbar' }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/75 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl md:inset-x-auto md:bottom-6 md:left-1/2 md:w-auto md:-translate-x-1/2 md:rounded-[1.75rem] md:border md:bg-white/[0.055] md:pb-0 md:shadow-[0_18px_50px_-14px_rgba(0,0,0,.75)]"
    >
      <ul className="mx-auto flex w-full max-w-md items-stretch gap-1 px-2 py-1.5 md:max-w-none md:gap-1.5 md:px-2 md:py-2">
        {TABS.map(({ id, label, Icon }) => {
          const on = id === active;
          return (
            <li key={id} className="flex-1 md:flex-none">
              <button
                onClick={() => onSelect(id)}
                aria-current={on ? 'page' : undefined}
                className={`flex w-full flex-col items-center gap-[0.28rem] rounded-2xl px-2 pb-1.5 pt-2 transition-colors md:min-w-[5.6rem] ${
                  on ? 'bg-brand/[0.14] text-brand' : 'text-faint hover:bg-white/[0.05] hover:text-muted'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-[0.7rem] font-medium leading-[1.1rem] tracking-[0.03em]">
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
