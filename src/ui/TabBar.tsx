// Globale Navigation: vier Räume (docs/gremium-navigation.md, Schritt 1).
//
// WARUM ÜBERHAUPT: Die Startseite machte sechs Dinge gleichzeitig und jede
// Baum-Ebene sah gleich aus. Die Reiterleiste trennt die Räume; der Verteiler
// „Heute" ersetzt die Wand aus allem.
//
// PLATZIERUNG: Im DOM steht die Leiste VOR dem Inhalt — ab `md` erscheint sie
// dadurch oben (desktopnah), auf schmalen Geräten ist sie fest am unteren Rand
// (Daumenreichweite). Ein DOM-Knoten, zwei Positionen: kein doppeltes Markup,
// keine doppelte Vorlesereihenfolge.
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
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink/80 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:static md:mx-auto md:mb-1 md:w-full md:max-w-md md:rounded-full md:border md:bg-white/[0.04] md:px-1.5 md:py-1.5"
    >
      <ul className="mx-auto flex w-full max-w-md items-stretch gap-1">
        {TABS.map(({ id, label, Icon }) => {
          const on = id === active;
          return (
            <li key={id} className="flex-1">
              <button
                onClick={() => onSelect(id)}
                aria-current={on ? 'page' : undefined}
                className={`flex w-full flex-col items-center gap-1 rounded-2xl px-1 py-1.5 transition-colors md:flex-row md:justify-center md:gap-1.5 md:rounded-full md:py-2 ${
                  on ? 'text-brand md:bg-brand/10' : 'text-faint hover:text-muted'
                }`}
              >
                <Icon className="h-[1.15rem] w-[1.15rem]" />
                <span className="text-[0.62rem] font-medium tracking-[0.04em] md:text-[0.78rem]">
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
