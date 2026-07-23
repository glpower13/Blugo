// Thema-Detail (Drill-down): die einzelnen Wendungen eines Themas, sauber
// gegliedert, mit ihrem EHRLICHEN Einzelstatus (bewiesen/reift/lernt/neu) —
// plus Fokus-Wahl und „dieses Thema üben". Navigation: Übersicht → hier hinein.

import type { Category, Chunk, ChunkState } from '../../domain/chunk';
import { isStable } from './metrics';
import { IconBack, IconPlay } from '../../ui/icons';

interface Props {
  category: Category;
  chunks: Chunk[];
  states: Record<string, ChunkState>;
  isFocus: boolean;
  onToggleFocus: () => void;
  onBack: () => void;
  onPractice: () => void;
}

interface Status {
  label: string;
  dot: string;
}

function statusOf(s: ChunkState | undefined): Status {
  if (!s || (s.status === 'new' && s.history.length === 0)) return { label: 'neu', dot: 'bg-warn' };
  if (isStable(s)) return { label: 'sitzt', dot: 'bg-success dot-glow' };
  if (s.status === 'maintenance') return { label: 'reift', dot: 'bg-success' };
  return { label: 'am Lernen', dot: 'bg-brand' };
}

export function CategoryDetail({
  category,
  chunks,
  states,
  isFocus,
  onToggleFocus,
  onBack,
  onPractice,
}: Props) {
  const items = chunks.filter((c) => c.categoryId === category.id);
  const stable = items.filter((c) => isStable(states[c.id])).length;

  return (
    <div className="rise flex flex-col gap-4">
      {/* Navigations-Leiste mit Zurück */}
      <nav className="flex items-center gap-2 px-1">
        <button
          onClick={onBack}
          className="glass-soft flex items-center gap-1 rounded-full py-1.5 pl-2 pr-3 text-sm text-paper"
          aria-label="Zurück zur Übersicht"
        >
          <IconBack className="h-4 w-4" /> Übersicht
        </button>
      </nav>

      <section className="glass rounded-2xl p-5">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-faint">Thema</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-paper">{category.title}</h1>
        <p className="mt-1 text-sm text-muted">{category.blurb}</p>
        <p className="mt-3 text-sm text-muted">
          <span className="text-success">{stable}</span> von {items.length} bewiesen stabil
        </p>

        {/* Fokus für neuen Stoff (Autonomie) */}
        <button
          onClick={onToggleFocus}
          aria-pressed={isFocus}
          className={
            'mt-3 rounded-full px-4 py-1.5 text-sm font-medium ' +
            (isFocus ? 'btn-gold text-ink' : 'border border-brand/50 text-brand')
          }
        >
          {isFocus ? '★ Im Fokus für neuen Stoff' : 'Als Fokus für neuen Stoff'}
        </button>

        {/* Die einzelnen Wendungen, sauber gegliedert (breit: zwei Spalten). */}
        <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {items.map((c) => {
            const st = statusOf(states[c.id]);
            return (
              <li key={c.id} className="glass-soft flex items-center gap-3 rounded-xl px-3.5 py-3">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${st.dot}`} />
                <div className="min-w-0">
                  <p lang="sv" className="truncate font-medium text-paper">
                    {c.sv}
                  </p>
                  <p className="truncate text-xs text-muted">{c.de}</p>
                </div>
                <span className="ml-auto shrink-0 text-[0.7rem] uppercase tracking-wide text-faint">
                  {st.label}
                </span>
              </li>
            );
          })}
        </ul>

        <button
          onClick={onPractice}
          className="btn-gold mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium text-ink"
        >
          <IconPlay className="h-3.5 w-3.5" /> Dieses Thema üben
        </button>
      </section>
    </div>
  );
}
