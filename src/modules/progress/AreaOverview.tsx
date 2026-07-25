// Ebene 1 des Baums — BILDKARTEN (docs/gremium-navigation.md §4, Schritt 2).
//
// Die Formsprache-Regel: je tiefer man kommt, desto mehr weicht Bild dem Text,
// desto enger die Karten. Ganz oben steht deshalb das größte Bild — eine
// Bereichskarte sieht wie nichts anderes in der App aus, und genau daran
// erkennt man, dass man an der Wurzel steht.
//
// EHRLICHKEIT unverändert (docs/07-measurement.md): der Balken zeigt zwei
// GEMESSENE Zonen (bewiesen · reift), nie „Kurs erledigt", nie Anwesenheit.
// Das Bild ist Atmosphäre und trägt kein Fortschrittssignal.

import type { AreaProgress } from './categories';
import { areaVisual } from '../../ui/areaTheme';
import { AreaArt } from '../../ui/AreaArt';
import { HonestBar } from './HonestBar';

interface Props {
  progress: AreaProgress[];
  focusTitle: string | null; // Titel des fokussierten Themas (global), falls gesetzt
  onOpen: (areaId: string) => void;
  onClearFocus: () => void;
}

export function AreaOverview({ progress, focusTitle, onOpen, onClearFocus }: Props) {
  if (progress.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between gap-3 px-1">
        <h2 className="font-display text-lg font-semibold tracking-[0.01em] text-paper">Bereiche</h2>
        {focusTitle && (
          <button onClick={onClearFocus} className="text-xs text-muted underline underline-offset-2">
            Fokus: {focusTitle} · aufheben
          </button>
        )}
      </div>

      <ul className="flex flex-col gap-3.5">
        {progress.map((p) => {
          const themes = p.categories.length;
          const { hue } = areaVisual(p.area.id);
          return (
            <li key={p.area.id}>
              <button
                onClick={() => onOpen(p.area.id)}
                className="group relative block w-full overflow-hidden rounded-2xl border border-line text-left transition-transform active:scale-[0.995]"
                style={{ backgroundColor: '#080B12' }}
              >
                {/* Das Bild bekommt den ganzen Streifen für sich. Erster Entwurf
                    legte die Schrift darüber — der nötige Verlauf verschluckte
                    genau die Bodenzone mit den Menschen, also das, was aus einer
                    Kulisse einen Ort macht. Text steht deshalb darunter. */}
                <div className="relative h-36 w-full sm:h-40">
                  <AreaArt areaId={p.area.id} hue={hue} />
                  <span className="grain-soft" aria-hidden="true" />
                </div>

                <div className="px-4 pb-3.5 pt-3">
                  <p className="font-display text-[1.22rem] font-semibold leading-tight tracking-[0.01em] text-paper">
                    {p.area.title}
                  </p>
                  <p className="mt-0.5 text-[0.76rem] leading-snug text-muted">{p.area.blurb}</p>
                  <HonestBar stable={p.stable} maturing={p.maturing} total={p.total} />
                  <p className="mt-1.5 text-xs text-muted">
                    {themes} {themes === 1 ? 'Thema' : 'Themen'} ·{' '}
                    <span className="text-success">{p.stable}</span> von {p.total} bewiesen
                    {p.maturing > 0 && (
                      <>
                        {' · '}
                        <span className="text-success/70">{p.maturing}</span> {p.maturing === 1 ? 'reift' : 'reifen'}
                      </>
                    )}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
