// Szenenbilder für den Dialog-Modus (docs/gremium-dialog.md §8/§10).
//
// DRITTE Überarbeitung nach klarer Rückmeldung („schäbige Mini-Darstellung —
// mach was Vernünftiges"). Was ein Piktogramm von einem BILD unterscheidet:
//   1. TIEFE — vier Ebenen mit Luftperspektive (fern = blass & kühl,
//      nah = fast schwarz), nicht alles auf einer Fläche.
//   2. LICHT — Lampen werfen Kegel, auf Tresen/Boden liegen Lichtpfützen,
//      Fensterflächen leuchten. Erst dadurch wirkt ein Raum bewohnt.
//   3. MENSCHEN — eine Silhouette macht aus einer Kulisse einen ORT, an dem
//      gerade jemand steht und mit dir spricht. Das ist der größte Sprung.
//   4. DICHTE — Regale, Flaschen, Stühle, Koffer, Gleise: Details, die die
//      Situation erzählen, statt eines einzelnen freistehenden Objekts.
//
// Weiterhin reines SVG (offline-sicher, gestochen scharf, wenige kByte) in der
// Kennfarbe des Bereichs. Nie Inhalt, immer Atmosphäre (die eine Design-Regel).

import type { DialogScene } from '../domain/dialog';

interface Props {
  scene: DialogScene;
  hue: string; // Kennfarbe des Bereichs
}

// Tiefenebenen (Luftperspektive): je näher, desto dunkler und kontrastreicher.
const NIGHT = '#060910'; // Vordergrund / Silhouetten
const MIDDARK = '#0A111C'; // Mittelgrund

/** Bildband am Kopf der Gesprächskarte. */
export function SceneArt({ scene, hue }: Props) {
  const id = `sc-${scene}`;
  return (
    <div
      className="scene-in pointer-events-none relative h-44 w-full overflow-hidden sm:h-52"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 180"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          {/* Raumlicht von oben — der Grundton der Szene. */}
          <linearGradient id={`${id}-air`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={hue} stopOpacity="0.34" />
            <stop offset="52%" stopColor={hue} stopOpacity="0.1" />
            <stop offset="100%" stopColor={hue} stopOpacity="0.02" />
          </linearGradient>
          {/* Lichtkegel einer Lampe. */}
          <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={hue} stopOpacity="0.34" />
            <stop offset="100%" stopColor={hue} stopOpacity="0" />
          </linearGradient>
          {/* Leuchtende Fensterfläche. */}
          <linearGradient id={`${id}-pane`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={hue} stopOpacity="0.3" />
            <stop offset="100%" stopColor={hue} stopOpacity="0.08" />
          </linearGradient>
          {/* Unterkante weich ins Glas auslaufen lassen. */}
          <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="78%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={`${id}-mask`}>
            <rect x="0" y="0" width="400" height="180" fill={`url(#${id}-fade)`} />
          </mask>
        </defs>

        <g mask={`url(#${id}-mask)`}>
          <rect x="0" y="0" width="400" height="180" fill={`url(#${id}-air)`} />
          <Scene scene={scene} hue={hue} id={id} />
        </g>
      </svg>
    </div>
  );
}

/* ── Wiederkehrende Bausteine ────────────────────────────────────────────── */

/** Menschliche Silhouette (Kopf + Schultern) — macht die Kulisse zum ORT. */
function Person({
  x,
  y,
  s = 1,
  fill = NIGHT,
  opacity = 1,
}: {
  x: number;
  y: number;
  s?: number;
  fill?: string;
  opacity?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill} fillOpacity={opacity}>
      <circle cx="0" cy="-30" r="10.5" />
      <path d="M-15 0c0-13 6-21 15-21s15 8 15 21z" />
    </g>
  );
}

/** Lichtkegel unter einer Lampe. */
function Beam({ x, y, w, h, id }: { x: number; y: number; w: number; h: number; id: string }) {
  return <path d={`M${x - 6} ${y}h12l${w / 2} ${h}h-${w}z`} fill={`url(#${id}-beam)`} />;
}

/** Lichtpfütze auf einer waagerechten Fläche. */
function Pool({ cx, cy, rx, hue }: { cx: number; cy: number; rx: number; hue: string }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.16} fill={hue} fillOpacity="0.16" />;
}

function Scene({ scene, hue, id }: { scene: DialogScene; hue: string; id: string }) {
  switch (scene) {
    case 'cafe':
      return <Cafe hue={hue} id={id} />;
    case 'hotel':
      return <Hotel hue={hue} id={id} />;
    case 'station':
      return <Station hue={hue} id={id} />;
    case 'shop':
      return <Shop hue={hue} id={id} />;
    case 'clinic':
      return <Clinic hue={hue} id={id} />;
    case 'garage':
      return <Garage hue={hue} id={id} />;
    case 'gaming':
      return <Gaming hue={hue} id={id} />;
    case 'track':
      return <Track hue={hue} id={id} />;
    default:
      return <Generic hue={hue} />;
  }
}

/* ── CAFÉ: Innenraum mit Barista hinter dem Tresen ───────────────────────── */
function Cafe({ hue, id }: { hue: string; id: string }) {
  return (
    <g>
      {/* FERN: Fensterfront, dahinter Stadt bei Nacht */}
      <rect x="0" y="0" width="400" height="118" fill={MIDDARK} fillOpacity="0.5" />
      <g>
        <rect x="14" y="18" width="118" height="76" rx="3" fill={`url(#${id}-pane)`} />
        <rect x="268" y="18" width="118" height="76" rx="3" fill={`url(#${id}-pane)`} />
        {/* Häuser draußen */}
        <path d="M20 94V64h20v30M46 94V52h16v42M70 94V72h22v22M100 94V58h24v36" fill={NIGHT} fillOpacity="0.5" />
        <path d="M274 94V70h22v24M302 94V54h18v40M326 94V66h20v28M352 94V60h28v34" fill={NIGHT} fillOpacity="0.5" />
        {/* winzige erleuchtete Fenster */}
        {[
          [50, 60],
          [56, 72],
          [78, 80],
          [108, 66],
          [114, 78],
          [308, 62],
          [314, 74],
          [332, 74],
          [360, 68],
          [370, 80],
        ].map(([cx, cy], i) => (
          <rect key={i} x={cx} y={cy} width="4" height="5" fill={hue} fillOpacity="0.55" />
        ))}
        {/* Sprossen */}
        <path d="M73 18v76M14 56h118M327 18v76M268 56h118" stroke={hue} strokeOpacity="0.25" strokeWidth="1.6" />
        <rect x="14" y="18" width="118" height="76" rx="3" fill="none" stroke={hue} strokeOpacity="0.4" strokeWidth="2" />
        <rect x="268" y="18" width="118" height="76" rx="3" fill="none" stroke={hue} strokeOpacity="0.4" strokeWidth="2" />
      </g>

      {/* MITTE: Rückbuffet mit Regal, Flaschen und Espressomaschine */}
      <rect x="140" y="52" width="120" height="66" rx="3" fill={MIDDARK} fillOpacity="0.9" />
      <path d="M146 84h108" stroke={hue} strokeOpacity="0.3" strokeWidth="1.8" />
      {[152, 164, 176, 188, 232, 244].map((x, i) => (
        <rect key={i} x={x} y={i % 2 ? 68 : 64} width="7" height={i % 2 ? 16 : 20} rx="2" fill={hue} fillOpacity="0.4" />
      ))}
      {/* Espressomaschine */}
      <rect x="200" y="62" width="26" height="22" rx="3" fill={hue} fillOpacity="0.5" />
      <rect x="206" y="84" width="4" height="7" fill={hue} fillOpacity="0.5" />

      {/* Hängelampen mit Lichtkegeln */}
      {[
        [96, 0, 24],
        [200, 0, 16],
        [304, 0, 24],
      ].map(([x, y, len], i) => (
        <g key={i}>
          <path d={`M${x} ${y}v${len}`} stroke={hue} strokeOpacity="0.5" strokeWidth="1.8" />
          <path d={`M${x - 14} ${len}h28l-7 11h-14z`} fill={hue} fillOpacity="0.7" />
          <Beam x={x} y={len + 11} w={46} h={40} id={id} />
        </g>
      ))}

      {/* MENSCH: Barista hinter dem Tresen — mit Gegenlicht, damit die
          Silhouette gegen das dunkle Buffet überhaupt lesbar ist. */}
      <ellipse cx="200" cy="104" rx="46" ry="34" fill={hue} fillOpacity="0.22" />
      <Person x={200} y={118} s={1.15} opacity={0.95} />

      {/* NAH: Tresenplatte mit Lichtpfützen, Tasse und Pflanze */}
      <rect x="0" y="118" width="400" height="62" fill={NIGHT} fillOpacity="0.96" />
      <path d="M0 118h400" stroke={hue} strokeOpacity="0.55" strokeWidth="2.2" />
      <Pool cx={96} cy={121} rx={40} hue={hue} />
      <Pool cx={304} cy={121} rx={40} hue={hue} />

      {/* Tasse mit Untertasse + Dampf */}
      <g transform="translate(300 118)">
        <path d="M-22 0v-16h34v16z" fill={hue} fillOpacity="0.85" />
        <path d="M12 -13h5a8 8 0 0 1 0 15h-3" fill="none" stroke={hue} strokeOpacity="0.85" strokeWidth="3.4" strokeLinecap="round" />
        <ellipse cx="-5" cy="1" rx="27" ry="4" fill={hue} fillOpacity="0.6" />
        <path
          d="M-14 -22c4-5-4-8 0-13M-4 -22c4-5-4-8 0-13M6 -22c4-5-4-8 0-13"
          fill="none"
          stroke={hue}
          strokeOpacity="0.45"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      {/* Pflanze links auf dem Tresen: Topf + runde Blätterkrone */}
      <g transform="translate(70 118)">
        <path d="M-10 0l2-15h16l2 15z" fill={hue} fillOpacity="0.6" />
        <ellipse cx="-7" cy="-24" rx="9" ry="7" fill={hue} fillOpacity="0.42" />
        <ellipse cx="7" cy="-26" rx="8" ry="6.5" fill={hue} fillOpacity="0.36" />
        <ellipse cx="0" cy="-33" rx="7.5" ry="6" fill={hue} fillOpacity="0.3" />
      </g>
    </g>
  );
}

/* ── HOTEL: Lobby mit Rezeptionist, Schlüsselfächern und Koffer ──────────── */
function Hotel({ hue, id }: { hue: string; id: string }) {
  return (
    <g>
      {/* FERN: hohe Bogenfenster, Nacht dahinter */}
      <rect x="0" y="0" width="400" height="122" fill={MIDDARK} fillOpacity="0.55" />
      {[36, 190].map((x, i) => (
        <g key={i}>
          <path d={`M${x} 112V44a30 30 0 0 1 60 0v68z`} fill={`url(#${id}-pane)`} />
          <path d={`M${x} 112V44a30 30 0 0 1 60 0v68z`} fill="none" stroke={hue} strokeOpacity="0.4" strokeWidth="2" />
          <path d={`M${x + 30} 14v98M${x} 74h60`} stroke={hue} strokeOpacity="0.24" strokeWidth="1.6" />
        </g>
      ))}
      {/* Vorhänge */}
      <path d="M20 12c9 34 8 70 0 100M126 12c-8 34-7 70 0 100M174 12c9 34 8 70 0 100M280 12c-8 34-7 70 0 100" stroke={hue} strokeOpacity="0.22" strokeWidth="3" fill="none" />

      {/* Schlüsselfächer an der Wand rechts */}
      <rect x="296" y="26" width="92" height="66" rx="3" fill={MIDDARK} fillOpacity="0.95" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect
          key={i}
          x={302 + (i % 4) * 22}
          y={32 + Math.floor(i / 4) * 20}
          width="17"
          height="15"
          rx="1.5"
          fill={hue}
          fillOpacity={i % 3 === 0 ? 0.42 : 0.16}
        />
      ))}
      <rect x="296" y="26" width="92" height="66" rx="3" fill="none" stroke={hue} strokeOpacity="0.35" strokeWidth="1.6" />

      {/* MENSCH: Rezeptionist hinter dem Tresen (mit Gegenlicht) */}
      <ellipse cx="252" cy="108" rx="44" ry="32" fill={hue} fillOpacity="0.2" />
      <Person x={252} y={122} s={1.12} opacity={0.95} />

      {/* NAH: Rezeptionstresen */}
      <rect x="0" y="122" width="400" height="58" fill={NIGHT} fillOpacity="0.96" />
      <path d="M0 122h400" stroke={hue} strokeOpacity="0.55" strokeWidth="2.2" />
      <Pool cx={110} cy={125} rx={46} hue={hue} />

      {/* Tischlampe mit Lichtschein */}
      <g transform="translate(110 122)">
        <path d="M-15 0h30l-8-18h-14z" fill={hue} fillOpacity="0.65" />
        <ellipse cx="0" cy="-20" rx="34" ry="20" fill={hue} fillOpacity="0.1" />
      </g>
      {/* Empfangsklingel */}
      <g transform="translate(186 122)">
        <path d="M-19 0a19 19 0 0 1 38 0z" fill={hue} fillOpacity="0.85" />
        <rect x="-24" y="0" width="48" height="4" rx="2" fill={hue} fillOpacity="0.7" />
        <path d="M0 -19v-5" stroke={hue} strokeOpacity="0.85" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="0" cy="-26" r="3.4" fill={hue} fillOpacity="0.9" />
      </g>
      {/* Koffer im Vordergrund */}
      <g transform="translate(44 180)">
        <rect x="-24" y="-44" width="48" height="44" rx="4" fill={NIGHT} />
        <rect x="-24" y="-44" width="48" height="44" rx="4" fill="none" stroke={hue} strokeOpacity="0.5" strokeWidth="2" />
        <path d="M-9 -44v-9a9 9 0 0 1 18 0v9" fill="none" stroke={hue} strokeOpacity="0.5" strokeWidth="2.6" />
        <path d="M-24 -28h48" stroke={hue} strokeOpacity="0.3" strokeWidth="1.6" />
      </g>
    </g>
  );
}

/* ── BAHNHOF: Bahnsteig mit Zug, Wartenden, Anzeigetafel und Uhr ─────────── */
function Station({ hue, id }: { hue: string; id: string }) {
  return (
    <g>
      {/* FERN: Dachkonstruktion mit Trägern */}
      <rect x="0" y="0" width="400" height="14" fill={MIDDARK} fillOpacity="0.85" />
      <path d="M0 14h400" stroke={hue} strokeOpacity="0.3" strokeWidth="1.6" />
      {[30, 130, 270, 372].map((x, i) => (
        <path key={i} d={`M${x} 14v${i === 0 || i === 3 ? 108 : 52}`} stroke={hue} strokeOpacity="0.26" strokeWidth="2.6" />
      ))}
      {/* Deckenlampen mit Kegeln */}
      {[80, 200, 320].map((x, i) => (
        <g key={i}>
          <path d={`M${x} 14v10`} stroke={hue} strokeOpacity="0.5" strokeWidth="1.6" />
          <ellipse cx={x} cy="26" rx="9" ry="4" fill={hue} fillOpacity="0.7" />
          <Beam x={x} y={30} w={40} h={34} id={id} />
        </g>
      ))}

      {/* Anzeigetafel */}
      <rect x="42" y="30" width="72" height="34" rx="3" fill={MIDDARK} fillOpacity="0.95" />
      <rect x="42" y="30" width="72" height="34" rx="3" fill="none" stroke={hue} strokeOpacity="0.4" strokeWidth="1.6" />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <rect x="48" y={36 + r * 9} width="30" height="4" rx="2" fill={hue} fillOpacity="0.45" />
          <rect x="84" y={36 + r * 9} width="24" height="4" rx="2" fill={hue} fillOpacity="0.25" />
        </g>
      ))}
      {/* Bahnhofsuhr */}
      <g transform="translate(148 46)">
        <circle r="16" fill={MIDDARK} fillOpacity="0.95" />
        <circle r="16" fill="none" stroke={hue} strokeOpacity="0.6" strokeWidth="2" />
        <path d="M0 0v-9M0 0l7 5" stroke={hue} strokeOpacity="0.9" strokeWidth="2.2" strokeLinecap="round" />
      </g>

      {/* MITTE: Zug am Bahnsteig */}
      <g>
        <path d="M196 122V60a12 12 0 0 1 12-12h148a44 44 0 0 1 44 44v30z" fill={hue} fillOpacity="0.42" />
        <path d="M196 122V60a12 12 0 0 1 12-12h148a44 44 0 0 1 44 44v30z" fill="none" stroke={hue} strokeOpacity="0.75" strokeWidth="2" />
        {/* Seitenfenster mit Licht + Fahrgästen */}
        {[212, 258, 304].map((x, i) => (
          <g key={i}>
            <rect x={x} y="60" width="36" height="22" rx="3" fill={hue} fillOpacity="0.3" />
            <rect x={x} y="60" width="36" height="22" rx="3" fill="none" stroke={hue} strokeOpacity="0.5" strokeWidth="1.4" />
            <Person x={x + 18} y={82} s={0.42} opacity={0.55} />
          </g>
        ))}
        {/* Führerstand */}
        <path d="M352 56h6a36 36 0 0 1 34 34h-40z" fill={MIDDARK} fillOpacity="0.9" />
        <path d="M352 56h6a36 36 0 0 1 34 34h-40z" fill="none" stroke={hue} strokeOpacity="0.5" strokeWidth="1.6" />
        {/* Türen */}
        <path d="M240 90v32M290 90v32" stroke={hue} strokeOpacity="0.3" strokeWidth="1.6" />
        {/* Scheinwerfer + Lichtwurf */}
        <circle cx="384" cy="106" r="5.5" fill="#FFF4DB" fillOpacity="0.9" />
        <ellipse cx="384" cy="122" rx="26" ry="6" fill="#FFF4DB" fillOpacity="0.12" />
        {/* Räder */}
        <circle cx="238" cy="124" r="10" fill={NIGHT} />
        <circle cx="304" cy="124" r="10" fill={NIGHT} />
      </g>

      {/* MENSCHEN: Wartende mit Koffer */}
      <Person x={78} y={122} s={1.05} />
      <Person x={104} y={122} s={0.92} opacity={0.85} />
      <g transform="translate(122 122)">
        <rect x="-9" y="-20" width="18" height="20" rx="2" fill={NIGHT} />
        <path d="M-4 -20v-4a4 4 0 0 1 8 0v4" fill="none" stroke={NIGHT} strokeWidth="2" />
      </g>
      <Person x={166} y={122} s={0.98} opacity={0.9} />

      {/* NAH: Bahnsteig mit Sicherheitslinie und Gleis */}
      <rect x="0" y="122" width="400" height="58" fill={NIGHT} fillOpacity="0.96" />
      <path d="M0 122h400" stroke={hue} strokeOpacity="0.6" strokeWidth="2.4" />
      <path d="M0 132h400" stroke={hue} strokeOpacity="0.25" strokeWidth="3" strokeDasharray="14 10" />
    </g>
  );
}

/* ── GESCHÄFT: Laden mit Kleiderstange, Regalen und Verkäuferin ──────────── */
function Shop({ hue, id }: { hue: string; id: string }) {
  return (
    <g>
      {/* FERN: Wand mit Deckenstrahlern */}
      <rect x="0" y="0" width="400" height="122" fill={MIDDARK} fillOpacity="0.5" />
      <rect x="0" y="0" width="400" height="12" fill={MIDDARK} fillOpacity="0.9" />
      {[60, 200, 340].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy="14" rx="10" ry="4" fill={hue} fillOpacity="0.65" />
          <Beam x={x} y={18} w={52} h={44} id={id} />
        </g>
      ))}

      {/* Wandregale mit Waren */}
      <path d="M14 60h116M14 96h116" stroke={hue} strokeOpacity="0.32" strokeWidth="2" />
      {[
        [22, 60, 16, 18],
        [44, 60, 12, 24],
        [62, 60, 18, 14],
        [86, 60, 13, 22],
        [106, 60, 16, 16],
        [22, 96, 14, 20],
        [42, 96, 18, 15],
        [66, 96, 12, 23],
        [84, 96, 16, 18],
        [106, 96, 14, 21],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y - h} width={w} height={h} rx="2" fill={hue} fillOpacity={0.24 + (i % 3) * 0.12} />
      ))}

      {/* Kleiderstange mit hängenden Stücken */}
      <path d="M252 40h124" stroke={hue} strokeOpacity="0.5" strokeWidth="2.4" />
      <path d="M260 22v18M368 22v18" stroke={hue} strokeOpacity="0.35" strokeWidth="2" />
      {[266, 288, 310, 332, 354].map((x, i) => (
        <g key={i}>
          <path d={`M${x} 40v6`} stroke={hue} strokeOpacity="0.5" strokeWidth="1.4" />
          <path
            d={`M${x} 46l-11 8 4 40h14l4-40z`}
            fill={hue}
            fillOpacity={0.22 + (i % 3) * 0.1}
          />
        </g>
      ))}

      {/* MENSCH: Verkäuferin (mit Gegenlicht) */}
      <ellipse cx="186" cy="108" rx="44" ry="32" fill={hue} fillOpacity="0.2" />
      <Person x={186} y={122} s={1.12} opacity={0.95} />

      {/* NAH: Kassentresen mit Einkaufstüte */}
      <rect x="0" y="122" width="400" height="58" fill={NIGHT} fillOpacity="0.96" />
      <path d="M0 122h400" stroke={hue} strokeOpacity="0.55" strokeWidth="2.2" />
      <Pool cx={200} cy={125} rx={54} hue={hue} />
      <g transform="translate(96 122)">
        <path d="M-26 0l6-40h40l6 40z" fill={hue} fillOpacity="0.75" />
        <path d="M-26 0l6-40h40l6 40z" fill="none" stroke={hue} strokeOpacity="0.9" strokeWidth="2" />
        <path d="M-11 -40a11 11 0 0 1 22 0" fill="none" stroke={hue} strokeOpacity="0.9" strokeWidth="3" />
      </g>
    </g>
  );
}

/* ── ARZT: Praxis mit Ärztin, Liege, Kreuz-Schild und Regal ──────────────── */
function Clinic({ hue, id }: { hue: string; id: string }) {
  return (
    <g>
      {/* FERN: Wand mit Fenster und Deckenlicht */}
      <rect x="0" y="0" width="400" height="122" fill={MIDDARK} fillOpacity="0.5" />
      <rect x="286" y="18" width="100" height="62" rx="3" fill={`url(#${id}-pane)`} />
      <rect x="286" y="18" width="100" height="62" rx="3" fill="none" stroke={hue} strokeOpacity="0.35" strokeWidth="1.8" />
      <path d="M336 18v62M286 49h100" stroke={hue} strokeOpacity="0.2" strokeWidth="1.4" />
      {[110, 250].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy="12" rx="11" ry="4" fill={hue} fillOpacity="0.6" />
          <Beam x={x} y={16} w={50} h={40} id={id} />
        </g>
      ))}

      {/* Kreuz-Schild an der Wand */}
      <rect x="24" y="20" width="52" height="52" rx="9" fill={hue} fillOpacity="0.24" />
      <rect x="24" y="20" width="52" height="52" rx="9" fill="none" stroke={hue} strokeOpacity="0.5" strokeWidth="2" />
      <path d="M50 32v28M36 46h28" stroke={hue} strokeOpacity="0.95" strokeWidth="9" strokeLinecap="round" />

      {/* Regal mit Medikamenten */}
      <path d="M96 92h96" stroke={hue} strokeOpacity="0.32" strokeWidth="2" />
      {[
        [102, 16, 22],
        [124, 12, 28],
        [142, 18, 20],
        [166, 13, 25],
      ].map(([x, w, h], i) => (
        <rect key={i} x={x} y={92 - h} width={w} height={h} rx="2" fill={hue} fillOpacity={0.3 + (i % 2) * 0.15} />
      ))}

      {/* Untersuchungsliege */}
      <g transform="translate(300 122)">
        <rect x="-60" y="-24" width="120" height="12" rx="6" fill={hue} fillOpacity="0.4" />
        <rect x="-60" y="-32" width="42" height="10" rx="5" fill={hue} fillOpacity="0.5" />
        <path d="M-48 -12v12M44 -12v12" stroke={hue} strokeOpacity="0.35" strokeWidth="3" />
      </g>

      {/* MENSCH: Ärztin mit Stethoskop um den Hals (mit Gegenlicht) */}
      <g>
        <ellipse cx="210" cy="106" rx="46" ry="34" fill={hue} fillOpacity="0.2" />
        <Person x={210} y={122} s={1.18} opacity={0.95} />
        <path
          d="M198 96c-4 14 4 22 12 24M222 96c4 14-4 22-12 24"
          fill="none"
          stroke={hue}
          strokeOpacity="0.85"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <circle cx="210" cy="122" r="5.5" fill={hue} fillOpacity="0.9" />
      </g>

      {/* NAH: Schreibtisch */}
      <rect x="0" y="122" width="400" height="58" fill={NIGHT} fillOpacity="0.96" />
      <path d="M0 122h400" stroke={hue} strokeOpacity="0.55" strokeWidth="2.2" />
      <Pool cx={110} cy={125} rx={44} hue={hue} />
      {/* Klemmbrett + Stift */}
      <g transform="translate(96 122)">
        <rect x="-20" y="-28" width="40" height="28" rx="3" fill={hue} fillOpacity="0.5" />
        <rect x="-8" y="-32" width="16" height="6" rx="2" fill={hue} fillOpacity="0.75" />
        <path d="M-12 -20h24M-12 -13h16" stroke={NIGHT} strokeOpacity="0.55" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </g>
  );
}

/* ── NEUTRAL: Nordlicht über einer Bergsilhouette ────────────────────────── */
function Generic({ hue }: { hue: string }) {
  return (
    <g>
      <path
        d="M-20 74C70 32 160 88 250 46s130-22 170 4"
        fill="none"
        stroke={hue}
        strokeOpacity="0.42"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M-20 100C80 60 170 118 260 74s130-14 170 10"
        fill="none"
        stroke={hue}
        strokeOpacity="0.24"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M0 140l70-38 62 30 66-40 70 38 62-28 70 34v44H0z" fill={MIDDARK} fillOpacity="0.85" />
      <path d="M0 160l64-26 70 30 62-24 68 28 66-22 70 26v28H0z" fill={NIGHT} fillOpacity="0.95" />
    </g>
  );
}

/* ── WERKSTATT: Auto auf Böcken, Werkzeugtafel, zwei Kumpels ─────────────── */
function Garage({ hue, id }: { hue: string; id: string }) {
  return (
    <>
      {/* Rückwand mit Werkzeugtafel */}
      <rect y="0" width="400" height="180" fill={MIDDARK} opacity="0.5" />
      <rect x="34" y="34" width="104" height="44" fill="#24242A" />
      <g stroke="#8A8F96" strokeWidth="2">
        <line x1="48" y1="42" x2="48" y2="62" />
        <line x1="64" y1="42" x2="70" y2="62" />
        <line x1="88" y1="42" x2="88" y2="58" />
        <line x1="110" y1="44" x2="120" y2="62" />
      </g>
      <rect x="30" y="92" width="112" height="7" fill="#4A3524" />
      {/* Hängelampe über dem Auto */}
      <line x1="230" y1="0" x2="230" y2="24" stroke={NIGHT} strokeWidth="1.6" />
      <ellipse cx="230" cy="27" rx="13" ry="4" fill="#FFE6BC" />
      <Beam x={230} y={30} w={130} h={92} id={id} />
      <Pool cx={230} cy={128} rx={62} hue={hue} />
      {/* Auto mit offener Haube */}
      <path d="M182 104 L200 80 L266 80 L288 104 Z" fill="#5E6E7E" />
      <path d="M204 84 L262 84 L278 102 L192 102 Z" fill="#0F1620" />
      <path d="M204 84 L234 84 L234 102 L192 102 Z" fill="#9EB4C6" opacity="0.32" />
      <rect x="172" y="104" width="128" height="20" rx="4" fill="#7A2E28" />
      <rect x="172" y="104" width="128" height="6" rx="3" fill="#fff" opacity="0.14" />
      <path d="M172 104 L152 68 L162 66 L182 102 Z" fill="#8A3A32" />
      <circle cx="194" cy="128" r="10" fill="#141418" />
      <circle cx="194" cy="128" r="4" fill="#4A4E56" />
      <circle cx="280" cy="128" r="10" fill="#141418" />
      <circle cx="280" cy="128" r="4" fill="#4A4E56" />
      {/* Boden */}
      <rect y="136" width="400" height="44" fill={NIGHT} />
      {/* Zwei Kumpels */}
      <Person x={150} y={150} s={1.35} />
      <Person x={330} y={152} s={1.25} fill={MIDDARK} />
    </>
  );
}

/* ── ZOCKEN: Schreibtisch, Monitor, Headset, Sprachchat ──────────────────── */
function Gaming({ hue, id }: { hue: string; id: string }) {
  return (
    <>
      <rect y="0" width="400" height="180" fill={MIDDARK} opacity="0.55" />
      {/* Monitor als Hauptlichtquelle — das Gesicht wird von ihm beleuchtet */}
      <rect x="128" y="28" width="152" height="86" rx="4" fill="#0A0D14" />
      <rect x="134" y="34" width="140" height="74" fill={hue} opacity="0.34" />
      <rect x="134" y="34" width="140" height="20" fill={hue} opacity="0.22" />
      <g fill={hue} opacity="0.55">
        <rect x="142" y="42" width="46" height="4" rx="2" />
        <rect x="142" y="52" width="70" height="4" rx="2" />
        <rect x="142" y="92" width="34" height="4" rx="2" />
      </g>
      <Beam x={204} y={112} w={190} h={44} id={id} />
      <rect x="196" y="114" width="16" height="12" fill="#1A1E26" />
      <rect x="180" y="126" width="48" height="4" rx="2" fill="#1A1E26" />
      {/* Tastatur mit hinterleuchteten Tasten */}
      <rect x="146" y="140" width="116" height="14" rx="3" fill="#15181F" />
      <g fill={hue} opacity="0.5">
        {Array.from({ length: 11 }, (_, i) => (
          <rect key={i} x={152 + i * 10} y="144" width="6" height="6" rx="1" />
        ))}
      </g>
      {/* Zwei Bildschirme im Hintergrund und ein Regal */}
      <rect x="26" y="52" width="70" height="46" rx="3" fill="#0A0D14" />
      <rect x="30" y="56" width="62" height="38" fill={hue} opacity="0.2" />
      <rect x="308" y="60" width="66" height="4" fill="#2A2A30" />
      <g fill={hue} opacity="0.3">
        <rect x="316" y="46" width="12" height="14" rx="1.5" />
        <rect x="334" y="46" width="12" height="14" rx="1.5" />
      </g>
      {/* Spieler mit Headset, vom Monitor angeleuchtet */}
      <Person x={318} y={162} s={1.4} />
      <path d="M310 118 q8 -10 16 0" stroke={hue} strokeOpacity="0.6" strokeWidth="2.6" fill="none" />
      <rect x="306" y="118" width="5" height="8" rx="2" fill={hue} opacity="0.6" />
      <rect x="325" y="118" width="5" height="8" rx="2" fill={hue} opacity="0.6" />
      <rect y="156" width="400" height="24" fill={NIGHT} />
    </>
  );
}

/* ── RENNSTRECKE: Leitplanke, Boliden, Zuschauer ─────────────────────────── */
function Track({ hue, id }: { hue: string; id: string }) {
  return (
    <>
      {/* Tribüne in der Ferne */}
      <path d="M0 88 L120 62 L120 96 L0 96 Z" fill="#111C2A" />
      <g fill={hue} opacity="0.28">
        {Array.from({ length: 14 }, (_, i) => (
          <rect key={i} x={8 + i * 8} y={80 - i * 1.4} width="5" height="5" rx="1" />
        ))}
      </g>
      {/* Flutlichtmast */}
      <line x1="330" y1="96" x2="330" y2="30" stroke={MIDDARK} strokeWidth="2.4" />
      <rect x="314" y="24" width="34" height="8" rx="2" fill={MIDDARK} />
      <Beam x={330} y={32} w={150} h={70} id={id} />
      {/* Streckenband mit Curbs */}
      <rect y="96" width="400" height="30" fill="#1C1F26" />
      <g>
        {Array.from({ length: 20 }, (_, i) => (
          <rect key={i} x={i * 21} y="96" width="11" height="5" fill={i % 2 ? '#C4443A' : '#E8E4DC'} opacity="0.75" />
        ))}
      </g>
      <Pool cx={210} cy={118} rx={96} hue={hue} />
      {/* Rennwagen: flach, mit Flügel und Startnummer */}
      <g>
        <path d="M150 118 L172 106 L246 106 L268 118 Z" fill="#B8432E" />
        <path d="M182 108 L226 108 L236 116 L172 116 Z" fill="#0F1620" />
        <rect x="140" y="112" width="140" height="8" rx="3" fill="#8E3324" />
        <rect x="140" y="112" width="140" height="3" rx="1.5" fill="#fff" opacity="0.16" />
        <rect x="130" y="102" width="16" height="4" rx="1" fill="#1A1A1E" />
        <rect x="272" y="98" width="20" height="4" rx="1" fill="#1A1A1E" />
        <rect x="278" y="98" width="4" height="16" fill="#1A1A1E" />
        <circle cx="166" cy="122" r="9" fill="#111114" />
        <circle cx="252" cy="122" r="9" fill="#111114" />
        <circle cx="204" cy="110" r="5" fill="#E8E4DC" opacity="0.85" />
      </g>
      {/* Bewegungsstreifen — das Auto ist schnell */}
      <g fill={hue} opacity="0.3">
        <rect x="290" y="108" width="46" height="2" rx="1" />
        <rect x="300" y="116" width="60" height="2" rx="1" />
        <rect x="296" y="124" width="38" height="2" rx="1" />
      </g>
      {/* Zuschauer an der Leitplanke */}
      <rect y="126" width="400" height="54" fill={NIGHT} />
      <rect y="124" width="400" height="4" fill="#3A3E46" />
      <Person x={54} y={158} s={1.3} />
      <Person x={84} y={160} s={1.2} fill={MIDDARK} />
      <Person x={352} y={156} s={1.25} />
    </>
  );
}
