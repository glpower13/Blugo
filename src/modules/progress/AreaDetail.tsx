// Bereichs-Detail (mittlere Ebene): die Themen (Unterpunkte) EINES Bereichs, mit
// seiner ehrlichen Gesamt-Abdeckung. Navigation: Übersicht → hier → Thema-Detail.
// Die Themen-Liste teilt sich die Optik mit der Übersicht (CategoryOverview).

import type { AreaProgress } from './categories';
import { CategoryOverview } from './CategoryOverview';
import { IconBack, IconPlay } from '../../ui/icons';
import { areaVisual, AreaWash, AreaBadge } from '../../ui/areaTheme';

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
  const { hue, Icon } = areaVisual(area.id);

  return (
    <div className="relative isolate mx-auto flex w-full max-w-2xl flex-col gap-4">
      <AreaWash hue={hue} />
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
        {/* Kontextueller Kopf: Icon + Bereichsname; großer Titel darunter. */}
        <div className="flex items-center gap-3">
          <AreaBadge hue={hue} Icon={Icon} />
          <div>
            <p
              className="text-[0.66rem] font-semibold uppercase tracking-[0.18em]"
              style={{ color: hue }}
            >
              Bereich
            </p>
            <h1 className="font-display text-2xl font-semibold leading-tight text-paper">
              {area.title}
            </h1>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted">{area.blurb}</p>
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
