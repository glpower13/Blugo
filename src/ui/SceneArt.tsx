// Szenenbilder für den Dialog-Modus (docs/gremium-dialog.md §8).
//
// Bildsprache wie der Nordlicht-Hintergrund: **SVG** (offline-sicher, gestochen
// scharf, kByte statt MByte), reine Silhouetten und feine Linien in der Kennfarbe
// des Bereichs. Bewusst SEHR zurückhaltend — die Szene soll die Situation
// *andeuten* (Dual Coding: Bild + Sprache), nicht mit dem Text konkurrieren.
// Nie Inhalt, immer nur Atmosphäre (die eine Design-Regel).
//
// Aufbau je Szene: weiche Lichtquelle im Hintergrund → Architektur (Fenster,
// Bahnsteig, Regal) → kleine erzählende Details (Tasse, Klingel, Uhr).
// Unten läuft alles per Verlaufsmaske ins Glas aus.

import type { DialogScene } from '../domain/dialog';

interface Props {
  scene: DialogScene;
  hue: string; // Kennfarbe des Bereichs
}

export function SceneArt({ scene, hue }: Props) {
  const id = `scene-${scene}`;
  return (
    // Bewusste Komposition statt Tapete: die Kulisse sitzt als Vignette OBEN RECHTS
    // und löst sich nach links und unten auf — so behält der Titel freie Fläche.
    <div
      className="pointer-events-none absolute right-0 top-0 h-44 w-[74%] overflow-hidden"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 150"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          {/* Warme Lichtquelle der Szene (Fenster, Lampe, Bahnsteiglicht). */}
          <radialGradient id={`${id}-glow`} cx="58%" cy="26%" r="62%">
            <stop offset="0%" stopColor={hue} stopOpacity="0.3" />
            <stop offset="100%" stopColor={hue} stopOpacity="0" />
          </radialGradient>
          {/* Zwei Verläufe: nach unten UND nach links ausblenden → weiche Ecke. */}
          <linearGradient id={`${id}-fade-y`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="58%" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-fade-x`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="42%" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#fff" stopOpacity="1" />
          </linearGradient>
          <mask id={`${id}-mask`}>
            <g style={{ mixBlendMode: 'multiply' }}>
              <rect x="0" y="0" width="400" height="150" fill={`url(#${id}-fade-y)`} />
              <rect x="0" y="0" width="400" height="150" fill={`url(#${id}-fade-x)`} />
            </g>
          </mask>
        </defs>

        <g mask={`url(#${id}-mask)`}>
          <rect x="0" y="0" width="400" height="150" fill={`url(#${id}-glow)`} />
          <Scene scene={scene} hue={hue} />
        </g>
      </svg>
    </div>
  );
}

/** Feine Linie in Bereichsfarbe (die Szene ist eine Zeichnung, kein Foto). */
const line = (hue: string, opacity: number) => ({
  fill: 'none',
  stroke: hue,
  strokeOpacity: opacity,
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

function Scene({ scene, hue }: { scene: DialogScene; hue: string }) {
  switch (scene) {
    case 'cafe':
      return <Cafe hue={hue} />;
    case 'hotel':
      return <Hotel hue={hue} />;
    case 'station':
      return <Station hue={hue} />;
    case 'shop':
      return <Shop hue={hue} />;
    default:
      return <Generic hue={hue} />;
  }
}

/** Café/Restaurant: großes Fenster, Hängelampen, Tresen, Tasse mit Dampf. */
function Cafe({ hue }: { hue: string }) {
  return (
    <g>
      {/* Fensterfront mit Sprossen */}
      <path d="M56 150 V44 h96 v106" {...line(hue, 0.3)} />
      <path d="M104 44 V150 M56 92 h96" {...line(hue, 0.18)} />
      <path d="M248 150 V44 h96 v106" {...line(hue, 0.3)} />
      <path d="M296 44 V150 M248 92 h96" {...line(hue, 0.18)} />
      {/* Hängelampen */}
      <path d="M170 0 v34 M230 0 v26" {...line(hue, 0.26)} />
      <path d="M158 34 h24 l-6 10 h-12 z" fill={hue} fillOpacity="0.3" />
      <path d="M218 26 h24 l-6 10 h-12 z" fill={hue} fillOpacity="0.3" />
      <circle cx="170" cy="48" r="7" fill={hue} fillOpacity="0.16" />
      <circle cx="230" cy="40" r="7" fill={hue} fillOpacity="0.16" />
      {/* Tresen */}
      <path d="M0 122 h400" {...line(hue, 0.24)} />
      {/* Tasse mit Dampf */}
      <path d="M182 122 v-11 h22 v11" {...line(hue, 0.42)} />
      <path d="M204 105 c9 0 9 10 0 10" {...line(hue, 0.34)} />
      <path d="M188 98 c4-5 -4-9 0-14 M197 98 c4-5 -4-9 0-14" {...line(hue, 0.24)} />
    </g>
  );
}

/** Hotel: hohes Fenster mit Vorhang, Rezeptionstresen, Tischlampe, Klingel. */
function Hotel({ hue }: { hue: string }) {
  return (
    <g>
      {/* Hohes Fenster mit Bogen */}
      <path d="M150 150 V60 a50 50 0 0 1 100 0 v90" {...line(hue, 0.3)} />
      <path d="M200 10 V150 M150 78 h100" {...line(hue, 0.16)} />
      {/* Vorhänge links/rechts */}
      <path d="M126 24 c10 40 8 84 0 126 M274 24 c-10 40 -8 84 0 126" {...line(hue, 0.2)} />
      {/* Rezeptionstresen */}
      <path d="M0 126 h400" {...line(hue, 0.26)} />
      {/* Tischlampe */}
      <path d="M64 126 v-14 M52 112 h24 l-5 -14 h-14 z" {...line(hue, 0.34)} />
      <circle cx="64" cy="104" r="14" fill={hue} fillOpacity="0.12" />
      {/* Empfangsklingel */}
      <path d="M320 126 a14 14 0 0 1 28 0 z" {...line(hue, 0.4)} />
      <path d="M334 108 v-5" {...line(hue, 0.4)} />
    </g>
  );
}

/** Bahnhof: Bahnsteigdach, Säulen, fluchtende Gleise, Bahnhofsuhr. */
function Station({ hue }: { hue: string }) {
  return (
    <g>
      {/* Bahnsteigdach */}
      <path d="M0 30 h400" {...line(hue, 0.26)} />
      {/* Säulen mit Perspektive */}
      <path d="M40 30 v100 M110 30 v96 M290 30 v96 M360 30 v100" {...line(hue, 0.22)} />
      {/* Fluchtende Gleise → Tiefe */}
      <path d="M0 150 L176 96 M400 150 L224 96" {...line(hue, 0.3)} />
      <path d="M0 132 h400" {...line(hue, 0.2)} />
      {/* Schwellen */}
      <path d="M150 108 h100 M132 120 h136 M112 134 h176" {...line(hue, 0.12)} />
      {/* Bahnhofsuhr */}
      <circle cx="200" cy="52" r="17" {...line(hue, 0.42)} />
      <path d="M200 52 v-9 M200 52 l7 5" {...line(hue, 0.42)} />
      <path d="M200 35 v-5" {...line(hue, 0.26)} />
    </g>
  );
}

/** Geschäft: Markise, Regale mit Waren, Preisschild. */
function Shop({ hue }: { hue: string }) {
  return (
    <g>
      {/* Markise mit Bögen */}
      <path
        d="M30 46 h340 v14 c-24 0 -24 12 -48 12 s-24 -12 -48 -12 -24 12 -48 12 -24 -12 -48 -12 -24 12 -48 12 -24 -12 -48 -12 -24 12 -48 12 z"
        {...line(hue, 0.3)}
      />
      {/* Regalbretter */}
      <path d="M60 104 h280 M60 138 h280" {...line(hue, 0.24)} />
      {/* Waren als ruhige Silhouetten */}
      <path d="M78 104 v-16 h14 v16 M104 104 v-22 h12 v22 M128 104 v-13 h16 v13" {...line(hue, 0.34)} />
      <path d="M262 104 v-19 h13 v19 M286 104 v-14 h15 v14" {...line(hue, 0.34)} />
      <path d="M84 138 v-15 h18 v15 M116 138 v-20 h13 v20 M274 138 v-17 h16 v17" {...line(hue, 0.26)} />
      {/* Preisschild */}
      <path d="M186 78 h28 l8 10 -8 10 h-28 z" {...line(hue, 0.4)} />
      <circle cx="196" cy="88" r="2.2" fill={hue} fillOpacity="0.5" />
    </g>
  );
}

/** Neutral: ruhige Nordlicht-Bögen (wenn eine Szene keine eigene Kulisse hat). */
function Generic({ hue }: { hue: string }) {
  return (
    <g>
      <path d="M-20 96 C 80 52, 180 118, 300 66 S 420 46, 420 76" {...line(hue, 0.24)} />
      <path d="M-20 122 C 90 84, 190 144, 310 96 S 420 78, 420 106" {...line(hue, 0.16)} />
      <path d="M0 148 L70 118 L140 146 L210 112 L280 148 L350 120 L400 146" {...line(hue, 0.12)} />
    </g>
  );
}
