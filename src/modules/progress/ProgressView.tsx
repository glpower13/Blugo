// Reiter „Fortschritt" (docs/gremium-navigation.md, Schritt 1).
//
// Alles, was bisher auf der Startseite klebte und dort um Aufmerksamkeit
// konkurrierte, bekommt hier seinen eigenen Raum: der Ring, das Gedächtnisfeld,
// die Abdeckung, das Flow-Band.
//
// EHRLICHKEIT (`07-measurement.md`): „bewiesen" zählt nur nach echtem langem
// Intervall in der Produktions-Richtung; „reift" ist die zweite gemessene Zone.
// „aktiv" ist bewusst nur eine nüchterne Textzahl — bloße Anwesenheit darf nie
// wie Fortschritt aussehen.

import type { ChunkState } from '../../domain/chunk';
import { MemoryRing } from './MemoryRing';
import { MemoryField } from './MemoryField';
import { bandStatus } from '../memory/difficulty';

interface Props {
  states: ChunkState[];
  stable: number;
  maturing: number;
  active: number;
  dueNow: number;
  coverage: number;
  totalChunks: number;
  successRate: number | null;
  spoken: number; // Wendungen, die laut gesagt und richtig erkannt wurden (P3)
}

export function ProgressView({
  states,
  stable,
  maturing,
  active,
  dueNow,
  coverage,
  totalChunks,
  successRate,
  spoken,
}: Props) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 md:max-w-xl">
      <header className="px-1 pt-1">
        <h1 className="font-display text-[1.5rem] font-semibold leading-tight text-paper">
          Fortschritt
        </h1>
        <p className="mt-1 text-xs text-faint">Was du wirklich behalten hast — nichts anderes.</p>
      </header>

      <section className="glass rounded-2xl p-5">
        <div className="flex items-center gap-5">
          <MemoryRing stable={stable} maturing={maturing} total={totalChunks} />
          <div className="flex flex-1 items-baseline justify-between gap-3">
            <Stat value={active} label="aktiv" />
            <Stat value={maturing} label="reift" />
            <Stat value={stable} label="stabil" accent />
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">
          {dueNow} jetzt fällig · Verständnis-Abdeckung {Math.round(coverage * 100)} %
        </p>
        {successRate !== null && (
          <p className="mt-1 text-xs text-faint">
            Flow-Band: {bandStatus(successRate)} ({Math.round(successRate * 100)} % zuletzt)
          </p>
        )}
        {/* Gesprochenes bekommt bewusst KEINE große Zahl: es ist eine Eigenschaft
            der Abrufe, keine zweite Währung neben „stabil" (P3). Erst sichtbar,
            wenn es sie wirklich gibt — eine 0 wäre eine Aufforderung. */}
        {spoken > 0 && (
          <p className="mt-1 text-xs text-[#63C9B6]">
            {spoken} {spoken === 1 ? 'Wendung' : 'Wendungen'} schon laut gesagt und richtig erkannt
          </p>
        )}
        <div className="mt-3">
          <MemoryField states={states} />
        </div>
      </section>

      <section className="glass-soft rounded-2xl p-4">
        <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">
          Was die Zahlen bedeuten
        </h2>
        <dl className="mt-3 space-y-2.5 text-xs leading-relaxed">
          <div>
            <dt className="font-semibold text-success">stabil</dt>
            <dd className="text-faint">
              Nach über 90 Tagen Pause selbst gesagt — und es saß. Das ist der Beweis.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-paper">reift</dt>
            <dd className="text-faint">
              Über 21 Tage überstanden, selbst produziert, aber noch nicht bewiesen.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-muted">aktiv</dt>
            <dd className="text-faint">
              Schon einmal begegnet. Kein Fortschritt — nur der Umfang deines Repertoires.
            </dd>
          </div>
          {spoken > 0 && (
            <div>
              <dt className="font-semibold text-[#63C9B6]">laut gesagt</dt>
              <dd className="text-faint">
                Du hast sie gesprochen und die Erkennung hat genau diese Wendung verstanden.
                Über die Aussprache-Qualität sagt das nichts — dafür bräuchte es eine
                Lautbewertung, die es hier ehrlich noch nicht gibt.
              </dd>
            </div>
          )}
        </dl>
      </section>
    </div>
  );
}

function Stat({ value, label, accent }: { value: number; label: string; accent?: boolean }) {
  return (
    <div>
      <div
        className={`tnum font-sans text-[2.4rem] font-bold leading-none ${accent ? 'text-success glow-success' : 'text-paper'}`}
      >
        {value}
      </div>
      <div className="mt-1.5 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted">
        {label}
      </div>
    </div>
  );
}
