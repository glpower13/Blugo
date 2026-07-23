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
  enterDelay?: string; // gestaffeltes Einschweben (Choreografie)
}

export function CategoryOverview({ progress, focusId, onFocus, enterDelay }: Props) {
  if (progress.length === 0) return null;
  return (
    <section className="glass rise rounded-2xl p-5" style={{ animationDelay: enterDelay }}>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-display text-base font-semibold tracking-wide text-paper">Themen</h2>
        {focusId && (
          <button
            onClick={() => onFocus(null)}
            className="text-xs text-muted underline underline-offset-2"
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
            <li key={p.category.id} className="glass-soft rounded-xl p-3.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-paper">{p.category.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{p.category.blurb}</p>
                </div>
                <button
                  onClick={() => onFocus(isFocus ? null : p.category.id)}
                  aria-pressed={isFocus}
                  className={
                    'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ' +
                    (isFocus
                      ? 'btn-gold text-ink'
                      : 'border border-brand/50 text-brand')
                  }
                >
                  {isFocus ? '★ Fokus' : 'Fokus'}
                </button>
              </div>

              {/* Ehrlicher Balken: Anteil BEWIESEN stabiler Wendungen (nicht „erledigt"). */}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-success"
                  style={{ width: `${Math.round(share * 100)}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted">
                <span className="text-success">{p.stable}</span> von {p.total} bewiesen stabil
                {p.active > 0 && <> · {p.active} aktiv</>}
                {p.dueNow > 0 && <> · {p.dueNow} fällig</>}
              </p>
            </li>
          );
        })}
      </ul>

      {focusId && (
        <p className="mt-3 text-xs text-faint">
          Neuer Stoff kommt bevorzugt aus diesem Thema. Fällige Wiederholungen bleiben
          unberührt — Erhalt geht vor.
        </p>
      )}
    </section>
  );
}
