// Der ehrliche Fortschritts-Balken (docs/07-measurement.md, Nutzer-Rückfrage
// 2026-07-24: „warum bewegt sich der Balken nicht?").
//
// Vorher zählte der Balken NUR „bewiesen stabil" — die härteste Messlatte
// (Produktion nach 90+ Tagen Pause). Ehrlich, aber als Rückmeldung unbrauchbar:
// er stand realistisch MONATE bei null und wirkte kaputt.
//
// Jetzt zwei Zonen, beide **echt gemessen**, nur an verschiedenen Horizonten:
//   · kräftig  = bewiesen stabil (Produktion nach ≥ 90 Tagen überstanden)
//   · blasser  = reift (schon produziert und ≥ 21 Tage überstanden)
//
// Bewusst NICHT im Balken: „aktiv/angefasst". Das wäre bloße Anwesenheit — und
// genau die darf nie wie Fortschritt aussehen (die eine Design-Regel).
// Die beiden Zonen überschneiden sich nie (isMaturing schließt isStable aus).

import { useEffect, useState } from 'react';

interface Props {
  stable: number;
  maturing: number;
  total: number;
}

export function HonestBar({ stable, maturing, total }: Props) {
  // Beim Erscheinen weich füllen (von 0 auf den echten Anteil).
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));
  const stablePct = filled ? pct(stable) : 0;
  const maturingPct = filled ? pct(maturing) : 0;

  return (
    <div className="mt-2.5 flex h-1.5 w-full overflow-hidden rounded-full bg-line">
      {/* bewiesen stabil — die Wahrheitsfarbe, voll deckend */}
      <div
        className="h-full bg-success transition-[width] duration-700 ease-out"
        style={{ width: `${stablePct}%` }}
      />
      {/* reift — dieselbe Farbe, halb transparent: unterwegs, noch nicht bewiesen */}
      <div
        className="h-full bg-success/40 transition-[width] duration-700 ease-out"
        style={{ width: `${maturingPct}%` }}
      />
    </div>
  );
}
