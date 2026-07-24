// Themen-Übersicht (Navigations-Einstieg): jede Kachel ist anklickbar und führt
// per Drill-down ins Thema-Detail. Zeigt die EHRLICHE Abdeckung (bewiesen stabil
// von gesamt) — bewusst KEIN „Lektion erledigt"-Balken (docs/07-measurement.md;
// die eine Design-Regel). Die Fokus-Wahl liegt im Detail.

import type { CategoryProgress } from './categories';
import { IconChevron } from '../../ui/icons';
import { HonestBar, HonestLegend } from './HonestBar';

interface Props {
  progress: CategoryProgress[];
  focusId: string | null;
  onOpen: (categoryId: string) => void;
  onClearFocus: () => void;
}

export function CategoryOverview({ progress, focusId, onOpen, onClearFocus }: Props) {
  if (progress.length === 0) return null;

  const focused = progress.find((p) => p.category.id === focusId);

  return (
    <section className="glass rounded-2xl p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg font-semibold tracking-[0.01em] text-paper">Themen</h2>
        {focused && (
          <button onClick={onClearFocus} className="text-xs text-muted underline underline-offset-2">
            Fokus: {focused.category.title} · aufheben
          </button>
        )}
      </div>

      <ul className="flex flex-col gap-3">
        {progress.map((p) => {
          const isFocus = p.category.id === focusId;
          return (
            <li key={p.category.id}>
              <button
                onClick={() => onOpen(p.category.id)}
                className="glass-soft block w-full rounded-xl p-3.5 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 font-display text-[1.05rem] font-semibold tracking-[0.01em] text-paper">
                      {isFocus && <span className="text-brand">★</span>}
                      {p.category.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{p.category.blurb}</p>
                  </div>
                  <IconChevron className="mt-0.5 h-5 w-5 shrink-0 text-faint" />
                </div>

                {/* Ehrlicher Balken in zwei Zonen (kräftig = bewiesen, blass = reift) —
                    beides gemessen, nie „erledigt" oder bloße Anwesenheit. */}
                <HonestBar stable={p.stable} maturing={p.maturing} total={p.total} />
                <HonestLegend
                  stable={p.stable}
                  maturing={p.maturing}
                  total={p.total}
                  dueNow={p.dueNow}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
