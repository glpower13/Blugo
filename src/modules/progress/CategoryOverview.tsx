// Themen-Übersicht: pro Kategorie die EHRLICHE Abdeckung (bewiesen stabil von
// gesamt) plus eine Fokus-Wahl für neuen Stoff (Autonomie, docs/gremium-struktur.md).
//
// Bewusst KEIN „Lektion erledigt"-Balken: der Balken zeigt den Anteil BEWIESEN
// stabiler Wendungen — ein wahres Signal, kein Anwesenheits-Fortschritt
// (docs/07-measurement.md; CLAUDE.md „die eine Design-Regel").

import type { CategoryProgress } from './categories';

interface Props {
  progress: CategoryProgress[];
  focusId: string | null;
  onFocus: (categoryId: string | null) => void;
}

export function CategoryOverview({ progress, focusId, onFocus }: Props) {
  if (progress.length === 0) return null;
  return (
    <section className="rounded-2xl bg-surface p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-slate-100">Themen</h2>
        {focusId && (
          <button
            onClick={() => onFocus(null)}
            className="text-xs text-slate-400 underline underline-offset-2"
          >
            Fokus aufheben
          </button>
        )}
      </div>

      <ul className="flex flex-col gap-3">
        {progress.map((p) => {
          const isFocus = p.category.id === focusId;
          const share = p.total === 0 ? 0 : p.stable / p.total;
          return (
            <li key={p.category.id} className="rounded-xl border border-slate-700 bg-base p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-100">{p.category.title}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{p.category.blurb}</p>
                </div>
                <button
                  onClick={() => onFocus(isFocus ? null : p.category.id)}
                  aria-pressed={isFocus}
                  className={
                    'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ' +
                    (isFocus
                      ? 'bg-brand text-white'
                      : 'border border-brand/50 text-brand')
                  }
                >
                  {isFocus ? '★ Fokus' : 'Fokus'}
                </button>
              </div>

              {/* Ehrlicher Balken: Anteil BEWIESEN stabiler Wendungen (nicht „erledigt"). */}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${Math.round(share * 100)}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                <span className="text-emerald-400">{p.stable}</span> von {p.total} bewiesen stabil
                {p.active > 0 && <> · {p.active} aktiv</>}
                {p.dueNow > 0 && <> · {p.dueNow} fällig</>}
              </p>
            </li>
          );
        })}
      </ul>

      {focusId && (
        <p className="mt-3 text-xs text-slate-500">
          Neuer Stoff kommt bevorzugt aus diesem Thema. Fällige Wiederholungen bleiben
          unberührt — Erhalt geht vor.
        </p>
      )}
    </section>
  );
}
