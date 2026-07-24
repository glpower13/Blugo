// Bereichs-Detail (mittlere Ebene): die Themen (Unterpunkte) EINES Bereichs, mit
// seiner ehrlichen Gesamt-Abdeckung. Navigation: Übersicht → hier → Thema-Detail.
// Die Themen-Liste teilt sich die Optik mit der Übersicht (CategoryOverview).

import type { AreaProgress } from './categories';
import { CategoryOverview } from './CategoryOverview';
import { IconBack, IconPlay } from '../../ui/icons';

interface Props {
  areaProgress: AreaProgress;
  focusId: string | null;
  onOpenCategory: (categoryId: string) => void;
  onClearFocus: () => void;
  onBack: () => void;
  onPractice: () => void; // den ganzen Bereich üben
}

export function AreaDetail({
  areaProgress,
  focusId,
  onOpenCategory,
  onClearFocus,
  onBack,
  onPractice,
}: Props) {
  const { area, total, stable, dueNow } = areaProgress;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      {/* Navigations-Leiste mit Zurück zur Übersicht */}
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
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-faint">Bereich</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-paper">{area.title}</h1>
        <p className="mt-1 text-sm text-muted">{area.blurb}</p>
        <p className="mt-3 text-sm text-muted">
          <span className="text-success">{stable}</span> von {total} bewiesen stabil
          {dueNow > 0 && <> · {dueNow} fällig</>}
        </p>

        <button
          onClick={onPractice}
          className="btn-gold mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium text-ink"
        >
          <IconPlay className="h-3.5 w-3.5" /> Diesen Bereich üben
        </button>
      </section>

      {/* Die Themen des Bereichs (gleiche Optik wie die Übersicht). */}
      <CategoryOverview
        progress={areaProgress.categories}
        focusId={focusId}
        onOpen={onOpenCategory}
        onClearFocus={onClearFocus}
      />
    </div>
  );
}
