// Reiter „Gespräche" (docs/gremium-navigation.md, Schritt 1).
//
// Die Szenen lagen bisher DREI Klicks tief (Übersicht → Bereich → Thema), also
// war unser stärkstes Unterscheidungsmerkmal praktisch unsichtbar. Hier bekommen
// sie einen eigenen Raum, nach Bereichen gruppiert.
//
// EHRLICHKEIT: Eine Szene zeigt an, wie viele ihrer „du"-Zeilen bereits bewiesen
// sind — dieselbe Messung wie überall (`07-measurement.md`). Kein „Szene
// abgeschlossen"-Haken: eine Szene ist nie fertig, sie wird gehalten.
//
// FORMSPRACHE (Schritt 2): Gespräche sind ein eigener Raum, also bekommen sie
// ein eigenes Zeichen — zwei Sprechblasen, die gefüllte für die Szene-Person,
// die offene für dich. Der Anteil ist gefüllt wie der Beweis-Anteil der Szene:
// eine BILDLICHE Wiederholung derselben Zahl, kein zusätzlicher Punktestand.

import type { Area, Category, ChunkState } from '../../domain/chunk';
import type { Dialog } from '../../domain/dialog';
import { isStable } from '../progress/metrics';
import { areaVisual, AreaBadge } from '../../ui/areaTheme';
import { IconChat, IconChevron } from '../../ui/icons';

interface Props {
  dialogs: Dialog[];
  categories: Category[];
  areas: Area[];
  states: Record<string, ChunkState>;
  onOpen: (dialogId: string) => void;
  onOpenSparring: () => void;
  /** Ist ein eigener KI-Zugang hinterlegt? Sonst kann der Partner nicht denken. */
  sparringReady: boolean;
  /** Wie viele Wendungen der Partner gerade hervorlocken würde. */
  sparringTargets: number;
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

export function DialogOverview({
  dialogs,
  categories,
  areas,
  states,
  onOpen,
  onOpenSparring,
  sparringReady,
  sparringTargets,
}: Props) {
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

      {/* Der Sparringspartner steht OBEN — immer. Zuerst war er versteckt,
          solange kein eigener KI-Zugang hinterlegt war; gefunden hat ihn dann
          niemand (2026-07-25). Jetzt sagt er selbst, was ihm fehlt. */}
      <button
        onClick={onOpenSparring}
        className={
          'relative w-full overflow-hidden rounded-2xl px-4 py-3.5 text-left ' +
          (sparringReady
            ? 'border border-[#63C9B6]/45 bg-[#63C9B6]/10'
            : 'border border-line bg-white/[0.04]')
        }
      >
        <span
          className={
            'flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] ' +
            (sparringReady ? 'text-[#7EE0C4]' : 'text-paper')
          }
        >
          <IconChat className="h-3.5 w-3.5" /> Sparring · frei sprechen
        </span>
        <p className="mt-1 font-display text-[1.05rem] font-semibold leading-tight text-paper">
          Rede mit jemandem, der dir zuhört
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-paper/85">
          {!sparringReady
            ? 'Gerade ist kein Gesprächspartner eingerichtet.'
            : sparringTargets > 0
              ? `Er versucht, dir ${sparringTargets} fällige ${
                  sparringTargets === 1 ? 'Wendung' : 'Wendungen'
                } zu entlocken. Was du selbst sagst, zählt.`
              : 'Gerade ist nichts fällig — reden geht, gemessen wird dann aber nichts.'}
        </p>
      </button>

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
                      className="glass-soft flex w-full items-start gap-2.5 rounded-xl p-3 text-left sm:gap-3"
                    >
                      <SpeechMark hue={hue} filled={total > 0 ? stable / total : 0} />
                      <div className="min-w-0 flex-1">
                        <p className="hyphens-auto break-words font-display text-[0.95rem] font-semibold text-paper">
                          {d.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">{d.blurb}</p>
                        <p className="mt-1.5 text-[0.7rem] text-faint">
                          {d.turns.length} Zeilen · <span className="text-success">{stable}</span> von{' '}
                          {total} deiner Antworten bewiesen
                        </p>
                      </div>
                      <IconChevron className="mt-0.5 h-[20px] w-[20px] shrink-0 text-faint" />
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

/**
 * Zwei Sprechblasen als Zeichen des Gesprächs-Raums. Die hintere (die Szene-Person)
 * ist gefüllt, die vordere (du) offen — und ihr Füllstand entspricht dem Anteil
 * bewiesener eigener Antworten. Rein bildlich, dieselbe gemessene Zahl wie im Text.
 */
function SpeechMark({ hue, filled }: { hue: string; filled: number }) {
  const clamped = Math.max(0, Math.min(1, filled));
  return (
    <svg
      viewBox="0 0 40 34"
      className="mt-0.5 h-[36px] w-[40px] shrink-0"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Von unten nach oben auffüllen — wie ein Pegel, nicht wie ein Balken. */}
        <linearGradient id={`sm-${clamped.toFixed(3)}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset={`${clamped * 100}%`} stopColor="#5FD0A0" stopOpacity="0.85" />
          <stop offset={`${clamped * 100}%`} stopColor="#5FD0A0" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* hinten: die Szene-Person spricht */}
      <path
        d="M3 3h22a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H12l-6 5v-5H3a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z"
        transform="translate(1 0)"
        fill={hue}
        opacity="0.34"
      />
      {/* vorne: deine Antwort — offen, Pegel = bewiesener Anteil */}
      <path
        d="M15 12h20a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-3v5l-6-5H15a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3Z"
        fill={`url(#sm-${clamped.toFixed(3)})`}
        stroke="#5FD0A0"
        strokeOpacity="0.5"
        strokeWidth="1.3"
      />
    </svg>
  );
}
