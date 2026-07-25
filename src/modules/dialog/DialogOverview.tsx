// Reiter „Gespräche" (docs/gremium-navigation.md, Schritt 1).
//
// Die Szenen lagen bisher DREI Klicks tief (Übersicht → Bereich → Thema), also
// war unser stärkstes Unterscheidungsmerkmal praktisch unsichtbar. Hier bekommen
// sie einen eigenen Raum, nach Bereichen gruppiert.
//
// EHRLICHKEIT: Eine Szene zeigt an, wie viele ihrer „du"-Zeilen bereits bewiesen
// sind — dieselbe Messung wie überall (`07-measurement.md`). Kein „Szene
// abgeschlossen"-Haken: eine Szene ist nie fertig, sie wird gehalten.

import type { Area, Category, ChunkState } from '../../domain/chunk';
import type { Dialog } from '../../domain/dialog';
import { isStable } from '../progress/metrics';
import { areaVisual, AreaBadge } from '../../ui/areaTheme';
import { IconChevron } from '../../ui/icons';

interface Props {
  dialogs: Dialog[];
  categories: Category[];
  areas: Area[];
  states: Record<string, ChunkState>;
  onOpen: (dialogId: string) => void;
}

/** Wie viele der produzierten Wendungen einer Szene sind bewiesen stabil? */
function sceneProof(dialog: Dialog, states: Record<string, ChunkState>) {
  const ids = [
    ...new Set(
      dialog.turns
        .filter((t) => t.speaker === 'you')
        .map((t) => t.chunkId)
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  // Ein noch nie begegneter Chunk hat keinen Zustand — das ist kein Fehler,
  // sondern schlicht „noch nichts bewiesen".
  const stable = ids.filter((id) => {
    const s = states[id];
    return s !== undefined && isStable(s);
  }).length;
  return { total: ids.length, stable };
}

export function DialogOverview({ dialogs, categories, areas, states, onOpen }: Props) {
  const areaOfCategory = new Map(categories.map((c) => [c.id, c.areaId]));

  // Nach Bereichen gruppieren, in Bereichs-Reihenfolge; leere Bereiche fallen weg.
  const groups = [...areas]
    .sort((a, b) => a.order - b.order)
    .map((area) => ({
      area,
      items: dialogs.filter((d) => areaOfCategory.get(d.categoryId) === area.id),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 md:max-w-xl">
      <header className="px-1 pt-1">
        <h1 className="font-display text-[1.5rem] font-semibold leading-tight text-paper">
          Gespräche
        </h1>
        <p className="mt-1 text-xs text-faint">
          Ganze Alltagsszenen — du hörst zu und antwortest selbst.
        </p>
      </header>

      {groups.map(({ area, items }) => {
        const { hue, Icon } = areaVisual(area.id);
        return (
          <section key={area.id} className="glass rounded-2xl p-4">
            <div className="mb-3 flex items-center gap-2.5">
              <AreaBadge hue={hue} Icon={Icon} />
              <h2 className="font-display text-[1.02rem] font-semibold text-paper">{area.title}</h2>
            </div>
            <ul className="flex flex-col gap-2">
              {items.map((d) => {
                const { total, stable } = sceneProof(d, states);
                return (
                  <li key={d.id}>
                    <button
                      onClick={() => onOpen(d.id)}
                      className="glass-soft flex w-full items-start gap-3 rounded-xl p-3 text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-[0.95rem] font-semibold text-paper">
                          {d.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">{d.blurb}</p>
                        <p className="mt-1.5 text-[0.7rem] text-faint">
                          {d.turns.length} Zeilen · <span className="text-success">{stable}</span> von{' '}
                          {total} deiner Antworten bewiesen
                        </p>
                      </div>
                      <IconChevron className="mt-0.5 h-5 w-5 shrink-0 text-faint" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
