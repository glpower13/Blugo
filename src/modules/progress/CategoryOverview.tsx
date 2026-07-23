// Themen-Übersicht (Navigations-Einstieg): jede Kachel ist anklickbar und führt
// per Drill-down ins Thema-Detail. Zeigt die EHRLICHE Abdeckung (bewiesen stabil
// von gesamt) — bewusst KEIN „Lektion erledigt"-Balken (docs/07-measurement.md;
// die eine Design-Regel). Die Fokus-Wahl liegt im Detail.

import { useEffect, useState } from 'react';
import type { CategoryProgress } from './categories';
import { IconChevron } from '../../ui/icons';

interface Props {
  progress: CategoryProgress[];
  focusId: string | null;
  onOpen: (categoryId: string) => void;
  onClearFocus: () => void;
  enterDelay?: string; // gestaffeltes Einschweben (Choreografie)
}

export function CategoryOverview({ progress, focusId, onOpen, onClearFocus, enterDelay }: Props) {
  // Balken füllen sich beim Erscheinen weich (von 0 auf ihren Anteil).
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(id);
  }, []);
  if (progress.length === 0) return null;

  const focused = progress.find((p) => p.category.id === focusId);

  return (
    <section className="glass rise rounded-2xl p-5" style={{ animationDelay: enterDelay }}>
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
          const share = p.total === 0 ? 0 : p.stable / p.total;
          const isFocus = p.category.id === focusId;
          return (
            <li key={p.category.id}>
              <button
                onClick={() => onOpen(p.category.id)}
                className="glass-soft block w-full rounded-xl p-3.5 text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[0.98rem] font-semibold text-paper">
                      {isFocus && <span className="text-brand">★</span>}
                      {p.category.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{p.category.blurb}</p>
                  </div>
                  <IconChevron className="mt-0.5 h-5 w-5 shrink-0 text-faint" />
                </div>

                {/* Ehrlicher Balken: Anteil BEWIESEN stabiler Wendungen (nicht „erledigt"). */}
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-success transition-[width] duration-700 ease-out"
                    style={{ width: `${filled ? Math.round(share * 100) : 0}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-muted">
                  <span className="text-success">{p.stable}</span> von {p.total} bewiesen stabil
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
