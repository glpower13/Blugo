// Fortschritts-Ring — die im Gremium beschlossene „geliehene Optik" (docs/gremium-dialog.md).
// Die ruhige Ring-Anmutung der Vorbild-Apps, aber die Zahl ist WAHR: der Anteil
// BEWIESEN stabiler Wendungen (nicht ein erfundenes „Wochenziel"). Wächst langsam
// und ehrlich — genau das will die eine Design-Regel (anti-Goodhart).

import { useEffect, useState } from 'react';

interface Props {
  stable: number; // bewiesen stabil
  maturing: number; // schon produziert und ≥21 Tage überstanden, noch nicht bewiesen
  total: number; // Wendungen gesamt
}

const SIZE = 96;
const STROKE = 9;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

export function MemoryRing({ stable, maturing, total }: Props) {
  const share = total > 0 ? stable / total : 0;
  // Der äußere (blasse) Bogen reicht bis „bewiesen + reift" — er liegt HINTER
  // dem kräftigen, sodass der reifende Teil als Verlängerung sichtbar wird.
  const shareWithMaturing = total > 0 ? (stable + maturing) / total : 0;
  // Beim Erscheinen weich von 0 auf den echten Anteil füllen (reduced-motion: sofort).
  const [fill, setFill] = useState(0);
  const [fillOuter, setFillOuter] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setFill(share);
      setFillOuter(shareWithMaturing);
      return;
    }
    const id = requestAnimationFrame(() => {
      setFill(share);
      setFillOuter(shareWithMaturing);
    });
    return () => cancelAnimationFrame(id);
  }, [share, shareWithMaturing]);

  const pct = Math.round(share * 100);

  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={STROKE}
          />
          {/* reift — blasser, liegt hinten und reicht weiter */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="#5FD0A0"
            strokeOpacity="0.4"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - fillOuter)}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)' }}
          />
          {/* bewiesen stabil — kräftig, liegt vorn */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="#5FD0A0"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - fill)}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            style={{
              transition: 'stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)',
              filter: 'drop-shadow(0 0 6px rgba(95,208,160,0.5))',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="tnum font-sans text-2xl font-bold leading-none text-success">
            {stable}
          </span>
          <span className="mt-0.5 text-[0.6rem] font-medium text-faint">von {total}</span>
        </div>
      </div>
      <span
        className="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-muted"
        aria-label={`${stable} von ${total} bewiesen stabil, ${pct} Prozent`}
      >
        bewiesen stabil
      </span>
    </div>
  );
}
