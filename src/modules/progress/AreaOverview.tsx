// Bereichs-Übersicht (Wurzel des Baums, Navigations-Einstieg): jede Kachel ist
// ein Lebens-BEREICH (Reisen, Essen, …) und führt per Drill-down zu seinen Themen.
// Zeigt die EHRLICHE Abdeckung des Bereichs (bewiesen stabil von gesamt) — bewusst
// KEIN „Kurs erledigt"-Balken (docs/07-measurement.md; die eine Design-Regel).

import type { AreaProgress } from './categories';
import { IconChevron } from '../../ui/icons';
import { areaVisual, AreaBadge } from '../../ui/areaTheme';
import { HonestBar } from './HonestBar';

interface Props {
  progress: AreaProgress[];
  focusTitle: string | null; // Titel des fokussierten Themas (global), falls gesetzt
  onOpen: (areaId: string) => void;
  onClearFocus: () => void;
}

export function AreaOverview({ progress, focusTitle, onOpen, onClearFocus }: Props) {
  if (progress.length === 0) return null;

  return (
    <section className="glass rounded-2xl p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg font-semibold tracking-[0.01em] text-paper">Bereiche</h2>
        {focusTitle && (
          <button onClick={onClearFocus} className="text-xs text-muted underline underline-offset-2">
            Fokus: {focusTitle} · aufheben
          </button>
        )}
      </div>

      <ul className="flex flex-col gap-3">
        {progress.map((p) => {
          const themes = p.categories.length;
          const { hue, Icon } = areaVisual(p.area.id);
          return (
            <li key={p.area.id}>
              <button
                onClick={() => onOpen(p.area.id)}
                className="glass-soft block w-full rounded-xl p-3.5 text-left"
              >
                <div className="flex items-start gap-3">
                  <AreaBadge hue={hue} Icon={Icon} />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[1.05rem] font-semibold tracking-[0.01em] text-paper">
                      {p.area.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{p.area.blurb}</p>
                  </div>
                  <IconChevron className="mt-0.5 h-5 w-5 shrink-0 text-faint" />
                </div>

                {/* Ehrlicher Balken in zwei Zonen: kräftig = bewiesen stabil,
                    blasser = reift. Beides GEMESSEN, nur an zwei Horizonten;
                    bloße Anwesenheit taucht bewusst nirgends auf. Immer Mint
                    (die Wahrheitsfarbe) — die Bereichsfarbe trägt nur das Icon. */}
                <HonestBar stable={p.stable} maturing={p.maturing} total={p.total} />
                <p className="mt-1.5 text-xs text-muted">
                  {themes} {themes === 1 ? 'Thema' : 'Themen'} ·{' '}
                  <span className="text-success">{p.stable}</span> von {p.total} bewiesen
                  {p.maturing > 0 && (
                    <>
                      {' · '}
                      <span className="text-success/70">{p.maturing}</span> reifen
                    </>
                  )}
                  {p.dueNow > 0 && <> · {p.dueNow} fällig</>}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
