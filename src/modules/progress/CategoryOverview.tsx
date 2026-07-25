// Ebene 2 des Baums — SCHMALE ZEILEN (docs/gremium-navigation.md §4, Schritt 2).
//
// Eine Ebene tiefer als die Bildkarten: kein Bild mehr, nur noch ein kleines
// Zeichen in der Bereichsfarbe, engere Zeilen, ein dünner Deckungsbalken rechts.
// Der Sprung in der Form IST die Ortsangabe — man sieht ohne zu lesen, dass man
// nicht mehr an der Wurzel steht.
//
// EHRLICHKEIT (docs/07-measurement.md): weiterhin zwei GEMESSENE Zonen
// (bewiesen · reift), kein „Lektion erledigt". Die Fokus-Wahl liegt im Detail.

import type { CategoryProgress } from './categories';
import { IconChevron } from '../../ui/icons';

interface Props {
  progress: CategoryProgress[];
  focusId: string | null;
  hue: string; // Kennfarbe des übergeordneten Bereichs
  onOpen: (categoryId: string) => void;
  onClearFocus: () => void;
}

export function CategoryOverview({ progress, focusId, hue, onOpen, onClearFocus }: Props) {
  if (progress.length === 0) return null;

  const focused = progress.find((p) => p.category.id === focusId);

  return (
    <section>
      <div className="mb-2.5 flex items-baseline justify-between gap-3 px-1">
        <h2 className="font-display text-[1.05rem] font-semibold tracking-[0.01em] text-paper">
          Themen
        </h2>
        {focused && (
          <button onClick={onClearFocus} className="text-xs text-muted underline underline-offset-2">
            Fokus: {focused.category.title} · aufheben
          </button>
        )}
      </div>

      <ul className="flex flex-col gap-1.5">
        {progress.map((p) => {
          const isFocus = p.category.id === focusId;
          const proven = p.total > 0 ? (p.stable / p.total) * 100 : 0;
          const ripening = p.total > 0 ? (p.maturing / p.total) * 100 : 0;
          return (
            <li key={p.category.id}>
              <button
                onClick={() => onOpen(p.category.id)}
                className="flex w-full items-center gap-3 rounded-xl border border-line bg-white/[0.045] px-3 py-2.5 text-left transition-colors hover:bg-white/[0.075]"
              >
                {/* Kleines Zeichen in der Bereichsfarbe — kein Bild mehr. */}
                <span
                  aria-hidden="true"
                  className="h-7 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: hue, opacity: isFocus ? 0.95 : 0.45 }}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    {isFocus && <span className="text-[0.7rem] text-brand">★</span>}
                    <span className="hyphens-auto break-words font-sans text-[0.88rem] font-semibold text-paper">
                      {p.category.title}
                    </span>
                  </span>
                  {/* Deckungsbalken: kräftig = bewiesen, blass = reift. */}
                  <span className="mt-1.5 flex h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                    <span
                      className="h-full bg-success transition-[width] duration-700 ease-out"
                      style={{ width: `${proven}%` }}
                    />
                    <span
                      className="h-full bg-success/40 transition-[width] duration-700 ease-out"
                      style={{ width: `${ripening}%` }}
                    />
                  </span>
                </span>
                <span className="shrink-0 text-[0.68rem] tabular-nums text-faint">
                  {p.stable}/{p.total}
                  {p.dueNow > 0 && <span className="ml-1.5 text-brand">·{p.dueNow}</span>}
                </span>
                <IconChevron className="h-4 w-4 shrink-0 text-faint" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
