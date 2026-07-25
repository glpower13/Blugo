// Die Meilenstein-Leiste (A1 … B2) im Reiter „Fortschritt".
//
// WIE SIE SICH VON JEDER ANDEREN LERN-APP UNTERSCHEIDET: Dort ist ein Level
// etwas, das man durch Anwesenheit erreicht — Lektionen abhaken, Tage sammeln.
// Hier bewegt sich der Meilenstein AUSSCHLIESSLICH an bewiesenen Wendungen
// (`isStable`): selbst gesagt, nach über 90 Tagen Pause, und es saß.
//
// Das heißt auch: Er bewegt sich lange gar nicht. Genau deshalb steht die
// weiche Zahl daneben („reift") — als Wegmarke, nicht als zweite Währung. Und
// deshalb steht unter der Leiste ein Satz, der die Grenze der Aussage nennt:
// Das ist kein Zertifikat.

import type { MilestoneProgress } from './milestones';
import { whatIsMissing } from './milestones';

/** Was auf jedem Meilenstein sprachlich möglich wird — knapp, in Kann-Form. */
const KANN: Record<string, string> = {
  A1: 'Dich vorstellen, einkaufen, nach dem Weg fragen, im Café bestellen.',
  A2: 'Alltag bewältigen: Termine, Wohnen, Arbeit, Arzt, kleine Erzählungen.',
  B1: 'Zusammenhängend erzählen, Meinungen begründen, unerwartete Lagen meistern.',
  B2: 'Fließend diskutieren, Fachliches verstehen, Standpunkte abwägen.',
};

export function Milestones({ progress }: { progress: MilestoneProgress[] }) {
  const sichtbar = progress.filter((m) => m.total > 0);
  if (sichtbar.length === 0) return null;

  return (
    <section className="glass-soft rounded-2xl p-4">
      <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">
        Sprachliche Meilensteine
      </h2>

      <ul className="mt-3 flex flex-col gap-3">
        {sichtbar.map((m) => (
          <li key={m.level}>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span
                className={`font-sans text-[1.05rem] font-bold ${
                  m.reached ? 'text-success' : m.current ? 'text-brand' : 'text-muted'
                }`}
              >
                {m.level}
              </span>
              {m.reached && (
                <span className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-success">
                  erreicht
                </span>
              )}
              {m.current && (
                <span className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-brand">
                  hier bist du
                </span>
              )}
              <span className="ml-auto whitespace-nowrap text-xs tabular-nums text-muted">
                {m.proven} / {m.total} bewiesen
              </span>
            </div>

            {/* Zwei Zonen wie im großen Balken: kräftig = bewiesen, blass = reift.
                Der blasse Teil entscheidet NICHTS über „erreicht" — er zeigt nur,
                dass da Arbeit liegt, die noch keinen Beweis hat. */}
            <div className="mt-1.5 flex h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full bg-success transition-[width] duration-700 ease-out"
                style={{ width: `${m.total === 0 ? 0 : (m.proven / m.total) * 100}%` }}
              />
              <div
                className="h-full bg-success/40 transition-[width] duration-700 ease-out"
                style={{ width: `${m.total === 0 ? 0 : (m.maturing / m.total) * 100}%` }}
              />
            </div>

            <p className="mt-1 text-[0.7rem] leading-relaxed text-faint">
              {KANN[m.level]} <span className="text-muted">{whatIsMissing(m)}</span>
            </p>
          </li>
        ))}
      </ul>

      {/* Die Grenze der Aussage — genauso wichtig wie die Aussage selbst. */}
      <p className="mt-4 border-t border-line pt-3 text-[0.7rem] leading-relaxed text-faint">
        Das ist <span className="text-paper">kein Zertifikat</span>. Der Europäische
        Referenzrahmen beschreibt Niveaus über das, was man kann — nicht über Wendungslisten.
        Hier steht nur, wie viele Wendungen <span className="text-paper">dieser App</span> du
        auf diesem Niveau bewiesen hast: selbst gesagt, nach über 90 Tagen Pause, und es saß.
      </p>
    </section>
  );
}
