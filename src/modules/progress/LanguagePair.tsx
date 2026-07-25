// Sprachpaar-Fläche (docs/gremium-navigation.md §5, Schritt 4).
//
// DER WUNSCH WAR EIN SCHALTER: Deutsch→Schwedisch / Schwedisch→Deutsch wählen.
// Das Gremium hat ihn abgelehnt und etwas Besseres vorgeschlagen — hier ist es.
//
// WARUM KEIN SCHALTER: Die Richtung ist in NEUROLANG schon gebaut, aber als
// GEMESSENE STUFE. Die Memory-Engine führt jede Wendung von „du verstehst sie"
// zu „du sagst sie selbst", sobald genug echte Abrufe gelungen sind — und NUR
// ein Produktions-Abruf zählt für „bewiesen stabil". Wer die leichte Richtung
// wählen könnte, bekäme weiter Fortschritt angezeigt, ohne die schwere je zu
// bestehen. Das ist genau der Goodhart-Fall, den die eine Design-Regel verbietet.
//
// STATTDESSEN: Die Richtung wird SICHTBAR statt wählbar. Diese Fläche sagt, wie
// viele Wendungen gerade in welcher Richtung stehen — eine Auskunft, die kein
// Wettbewerber gibt (dort stehen zwei Fähnchen).

import type { DirectionSplit } from './metrics';
import { IconBack } from '../../ui/icons';

interface Props {
  split: DirectionSplit;
  onClose: () => void;
}

export function LanguagePair({ split, onClose }: Props) {
  const total = split.untouched + split.struggling + split.recognition + split.production;
  const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/70 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Sprachpaar und Richtung"
      onClick={onClose}
    >
      <div
        className="glass max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-3xl p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:rounded-3xl sm:pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-brand">
              Sprachpaar
            </p>
            <h2 className="mt-1 font-display text-[1.4rem] font-semibold leading-tight text-paper">
              Deutsch → Schwedisch
            </h2>
          </div>
          <button
            onClick={onClose}
            className="glass-soft flex shrink-0 items-center gap-1 rounded-full py-1.5 pl-2 pr-3 text-sm text-paper"
          >
            <IconBack className="h-4 w-4" /> Zurück
          </button>
        </header>

        {/* Der Kern: die Richtung als gemessener Stand, nicht als Einstellung. */}
        <section className="mt-5">
          <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">
            Wo deine {total} Wendungen stehen
          </h3>

          <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full bg-success transition-[width] duration-700 ease-out"
              style={{ width: `${pct(split.production)}%` }}
            />
            <div
              className="h-full bg-brand/60 transition-[width] duration-700 ease-out"
              style={{ width: `${pct(split.recognition)}%` }}
            />
            <div
              className="h-full bg-warn/50 transition-[width] duration-700 ease-out"
              style={{ width: `${pct(split.struggling)}%` }}
            />
          </div>

          <dl className="mt-4 space-y-3.5">
            <Row
              swatch="bg-success"
              value={split.production}
              title="sprichst du selbst"
              note={'Schwedisch aktiv erzeugen — die schwere Richtung. Nur sie zählt für „bewiesen stabil".'}
            />
            <Row
              swatch="bg-brand/60"
              value={split.recognition}
              title="verstehst du"
              note="Du erkennst sie im Kontext. Die App hebt sie von selbst an, sobald der Abruf sitzt."
            />
            {/* Eigener Eimer, seit dem Ehrlichkeits-Audit: Vorher zählte eine
                dreimal misslungene Wendung als „verstehst du". */}
            <Row
              swatch="bg-warn/50"
              value={split.struggling}
              title="begegnet, noch nicht gekonnt"
              note="Schon gesehen, aber noch kein gelungener Abruf. Bewusst getrennt gezählt — Scheitern ist kein Verständnis."
            />
            <Row
              swatch="bg-line"
              value={split.untouched}
              title="noch nicht begegnet"
              note={'Bewusst getrennt gezählt: eine nie gesehene Wendung als „verstanden" zu führen wäre falsch.'}
            />
          </dl>
        </section>

        {/* Die Erklärung, warum hier nichts umzuschalten ist. */}
        <section className="mt-6 rounded-2xl border border-line bg-white/[0.04] p-4">
          <h3 className="font-display text-[0.98rem] font-semibold text-paper">
            Warum du die Richtung nicht umstellen kannst
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Sie ist keine Einstellung, sondern ein <span className="text-paper">Messwert</span>.
            Jede Wendung wandert von „verstehst du" zu „sprichst du selbst", sobald du sie
            wirklich abrufen kannst — die App entscheidet das, nicht ein Schalter.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-faint">
            Könntest du auf die leichte Richtung stellen, würde dir weiter Fortschritt
            angezeigt, ohne dass du die schwere je bestanden hast. Genau das soll diese App
            nicht tun.
          </p>
        </section>

        <p className="mt-4 text-center text-[0.7rem] leading-relaxed text-faint">
          Weitere Sprachpaare sind technisch vorgesehen, es gibt dafür aber noch keinen
          Inhalt — deshalb steht hier auch keiner.
        </p>
      </div>
    </div>
  );
}

function Row({
  swatch,
  value,
  title,
  note,
}: {
  swatch: string;
  value: number;
  title: string;
  note: string;
}) {
  return (
    <div className="flex gap-3">
      <span aria-hidden="true" className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${swatch}`} />
      <div className="min-w-0 flex-1">
        <dt className="flex items-baseline gap-2">
          <span className="tnum font-sans text-[1.35rem] font-bold leading-none text-paper">
            {value}
          </span>
          <span className="text-sm font-medium text-paper">{title}</span>
        </dt>
        <dd className="mt-1 text-xs leading-relaxed text-faint">{note}</dd>
      </div>
    </div>
  );
}
