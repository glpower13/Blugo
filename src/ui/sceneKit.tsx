// Gemeinsame Bausteine für ALLE Bilder der App — Bereichskarten (`AreaArt`) und
// Gesprächskulissen (`SceneArt`).
//
// WARUM EIN MODUL: Die Bereichsbilder wurden auf Eigenfarbe, Volumen und echte
// Figuren umgebaut, die Gesprächskulissen blieben flache Silhouetten — derselbe
// Bildschirm zeigte zwei Qualitätsstufen. Statt den Code zu verdoppeln liegen die
// Bausteine jetzt hier. Jede künftige Szene erbt das Niveau automatisch.
//
// WAS EIN BILD VON EINEM PIKTOGRAMM UNTERSCHEIDET (die Regeln, die hier stecken):
//   1. EIGENFARBE — ein Haus ist rot, ein Birkenstamm weiß. Nicht „Bereichston
//      in 40 % Deckkraft"; genau daran scheiterten die ersten Fassungen.
//   2. VOLUMEN — jede Fläche hat eine Licht- und eine Schattenseite.
//   3. LUFTPERSPEKTIVE — die Ferne wird zusätzlich weichgezeichnet.
//   4. LICHTSTREUUNG — Lampen und Leuchtschilder bekommen echten Schein.
//   5. KORN + VIGNETTE — nimmt der Vektorgrafik das Klinische, führt den Blick.
//   6. MENSCHEN MIT KÖRPER — Kopf mit Haar, Schultern, Arme, Beine, Schuhe,
//      Kleidungsfarbe, Streiflicht UND Kontaktschatten. Ohne den schwebt jede
//      Figur; er ist nach der Eigenfarbe der stärkste Realismus-Hinweis.

import type { ReactNode } from 'react';

/** Echte Farben, keine abgeleiteten Bereichstöne. */
export const C = {
  falu: '#8B3A2F', // Falu rödfärg
  faluDark: '#5E2620',
  ochre: '#A8804A',
  mustard: '#997A3E',
  trim: '#E6E0D2', // Fenstergewände, Birkenstamm, Porzellan
  slate: '#242A34', // Dächer
  lamp: '#F0C078', // Glühlicht
  lampCore: '#FFE6BC',
  wood: '#4A3524',
  woodLit: '#7A5A38',
  brass: '#C08840',
  bun: '#C4864A', // Kanelbulle
  icing: '#EDE2CE',
  spruce: '#1B2E22',
  meadow: '#2C3A22',
  water: '#16283C',
  hull: '#D2D4CE',
  apotek: '#3CB878',
  glass: '#9ED0DA', // Vitrinen, Schaufenster
  steel: '#8A8F96',
  skin: '#8A6A55',
  night: '#05080E',
  mid: '#0A111C',
  far: '#111C2A',
};

/** Kleidungsfarben — gedeckt und nordisch, nie bunt. */
export const COATS = ['#3A4A5E', '#5E3A38', '#3E4A3A', '#4A3E52', '#2E3A44', '#6A5240'];

export interface FigureProps {
  x: number;
  y: number; // Standfläche (Füße)
  h?: number; // Körperhöhe
  coat?: number;
  flip?: boolean;
  lightFrom?: 'left' | 'right';
  dim?: number; // 0..1 für Hintergrundfiguren (Luftperspektive)
  /** Sitzend/lehnend — Beine kürzer, für Tresen und Schreibtisch. */
  seated?: boolean;
}

/**
 * Eine Person mit Körper statt einer Silhouette. Der größte einzelne Unterschied
 * zwischen „da ist eine Form" und „da steht jemand".
 */
export function Figure({
  x,
  y,
  h = 42,
  coat = 0,
  flip,
  lightFrom = 'left',
  dim = 0,
  seated,
}: FigureProps) {
  const s = h / 42;
  const body = COATS[coat % COATS.length];
  const rim = lightFrom === 'left' ? -1 : 1;
  const legTop = seated ? -12 : -16;
  return (
    <g opacity={1 - dim * 0.55}>
      <ellipse cx={x + rim * -1.5 * s} cy={y} rx={9 * s} ry={2.4 * s} fill="#000" opacity="0.42" />
      <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
        <path d={`M-5.5 ${legTop} L-6 -0.5 L-2.4 -0.5 L-1.4 ${legTop} Z`} fill="#241B14" />
        <path d={`M1.4 ${legTop} L2.4 -0.5 L6 -0.5 L5.5 ${legTop} Z`} fill="#191319" />
        <path d="M-6.4 -1.6 L-6.6 0.6 L-1.8 0.6 L-1.8 -1.6 Z" fill="#12100E" />
        <path d="M1.8 -1.6 L1.8 0.6 L6.6 0.6 L6.4 -1.6 Z" fill="#12100E" />
        <path d={`M-7 -34 Q0 -37 7 -34 L8.5 -15 Q0 -12.5 -8.5 -15 Z`} fill={body} />
        <path d={`M-7 -34 Q0 -37 7 -34 L8.5 -15 Q0 -12.5 -8.5 -15 Z`} fill="#000" opacity="0.3" />
        <path
          d={`M${rim * 6.4} -34.4 Q${rim * 7.4} -25 ${rim * 8} -15.4 L${rim * 5.2} -14.6 Q${rim * 4.8} -25 ${rim * 4.4} -34 Z`}
          fill="#fff"
          opacity="0.15"
        />
        <path d="M-7.6 -33 L-10 -19 L-7.4 -18.4 L-5.6 -31 Z" fill={body} opacity="0.9" />
        <path d="M7.6 -33 L10 -19 L7.4 -18.4 L5.6 -31 Z" fill={body} opacity="0.55" />
        <rect x="-1.8" y="-38" width="3.6" height="4" fill={C.skin} opacity="0.8" />
        <ellipse cx="0" cy="-41.5" rx="4.6" ry="5.4" fill={C.skin} />
        <path
          d="M-4.7 -41.6 Q-4.9 -47.4 0 -47.4 Q4.9 -47.4 4.7 -41.6
             Q4.7 -44.2 3.2 -44.6 Q0 -45.4 -3.2 -44.6 Q-4.7 -44.2 -4.7 -41.6 Z"
          fill="#1E181C"
        />
        <path
          d={`M${rim * -3.2} -45.6 Q${rim * -5.1} -41 ${rim * -4.2} -37.6 L${rim * -2} -38.8 Z`}
          fill="#1E181C"
        />
        <ellipse cx={rim * 1.7} cy="-41.6" rx="1.8" ry="2.9" fill="#fff" opacity="0.13" />
      </g>
    </g>
  );
}

/** Nadelbaum mit Licht- und Schattenhälfte. */
export function Spruce({ x, y, h, dim = 0 }: { x: number; y: number; h: number; dim?: number }) {
  const w = h * 0.44;
  const d = `M${x} ${y - h} L${x + w / 2} ${y - h * 0.4} L${x + w * 0.3} ${y - h * 0.4}
             L${x + w * 0.6} ${y} L${x - w * 0.6} ${y} L${x - w * 0.3} ${y - h * 0.4}
             L${x - w / 2} ${y - h * 0.4} Z`;
  return (
    <g opacity={1 - dim * 0.6}>
      <path d={d} fill={C.spruce} />
      <path
        d={`M${x} ${y - h} L${x + w / 2} ${y - h * 0.4} L${x + w * 0.6} ${y} L${x} ${y} Z`}
        fill="#000"
        opacity="0.3"
      />
    </g>
  );
}

/** Fassade mit Dach, Eigenfarbe, Schattenseite und warm erleuchteten Fenstern. */
export function House({
  x,
  y,
  w,
  h,
  color,
  gable,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  gable?: boolean;
}) {
  const cols = Math.max(2, Math.floor(w / 22));
  const rows = Math.max(1, Math.floor(h / 26));
  return (
    <g transform={`translate(${x} ${y})`}>
      {gable && (
        <>
          <path d={`M-4 0 L${w / 2} ${-h * 0.32} L${w + 4} 0 Z`} fill={C.slate} />
          <path d={`M${w / 2} ${-h * 0.32} L${w + 4} 0 L${w / 2} 0 Z`} fill="#000" opacity="0.32" />
        </>
      )}
      <rect width={w} height={h} fill={color} />
      <rect x={w * 0.62} width={w * 0.38} height={h} fill="#000" opacity="0.26" />
      <rect width={w} height={h * 0.12} fill="#fff" opacity="0.06" />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, i) => {
          const px = 7 + i * ((w - 14) / cols);
          const py = 9 + r * 26;
          const on = (i + r * 3) % 4 !== 3;
          return (
            <g key={`${r}-${i}`}>
              <rect x={px - 1.6} y={py - 1.6} width="11.2" height="14.2" fill={C.trim} opacity="0.55" />
              <rect
                x={px}
                y={py}
                width="8"
                height="11"
                fill={on ? C.lamp : '#141820'}
                opacity={on ? 0.85 : 0.92}
              />
            </g>
          );
        }),
      )}
    </g>
  );
}

/** Hängelampe mit Schirm, Kern und echtem Schein. */
export function Pendant({
  x,
  top = 0,
  y = 34,
  glow,
  spread = 46,
  floor = 112,
}: {
  x: number;
  top?: number;
  y?: number;
  glow: string;
  spread?: number;
  floor?: number;
}) {
  return (
    <g>
      <line x1={x} y1={top} x2={x} y2={y - 10} stroke="#241811" strokeWidth="1.6" />
      <path d={`M${x - 13} ${y} L${x + 13} ${y} L${x + 7} ${y - 10} L${x - 7} ${y - 10} Z`} fill={C.brass} />
      <path d={`M${x - 13} ${y} L${x + 13} ${y} L${x + 7} ${y - 10} L${x} ${y - 10} Z`} fill="#000" opacity="0.3" />
      <ellipse cx={x} cy={y + 1} rx="11" ry="3" fill={C.lampCore} />
      <circle cx={x} cy={y + 4} r="18" fill={C.lamp} opacity="0.45" filter={glow} />
      <path
        d={`M${x - 13} ${y + 1} L${x + 13} ${y + 1} L${x + spread} ${floor} L${x - spread} ${floor} Z`}
        fill={C.lamp}
        opacity="0.09"
      />
    </g>
  );
}

/** Die Filter- und Verlaufs-Definitionen, die jede Szene braucht. */
export function SceneDefs({ id, children }: { id: string; children?: ReactNode }) {
  return (
    <defs>
      {/* Echte Weichzeichnung für die Ferne — Luftperspektive, nicht nur blasse Farbe. */}
      <filter id={`${id}-far`} x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="0.9" />
      </filter>
      {/* Lichtschein um Lampen und Leuchtschilder. */}
      <filter id={`${id}-glow`} x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
      {/* Feines Korn gegen die Vektor-Sterilität. */}
      <filter id={`${id}-grain`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <radialGradient id={`${id}-vig`} cx="0.5" cy="0.48" r="0.78">
        <stop offset="52%" stopColor="#000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.62" />
      </radialGradient>
      {children}
    </defs>
  );
}

/** Korn und Vignette zum Schluss über die Szene legen. */
export function Finish({ id, w, h }: { id: string; w: number; h: number }) {
  return (
    <>
      <rect width={w} height={h} filter={`url(#${id}-grain)`} opacity="0.07" />
      <rect width={w} height={h} fill={`url(#${id}-vig)`} />
    </>
  );
}

/** Lichtpfütze auf einer waagerechten Fläche. */
export function Pool({ cx, cy, rx, color = C.lamp, o = 0.16 }: { cx: number; cy: number; rx: number; color?: string; o?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.15} fill={color} opacity={o} />;
}
