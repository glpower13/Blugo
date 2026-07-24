// Szenenbilder für den Dialog-Modus (docs/gremium-dialog.md §8, überarbeitet).
//
// LEHRE aus der ersten Fassung: zarte Linien hinter dem Text waren zwar dezent,
// aber man ERKANNTE die Szene nicht — und ein Bild, das man nicht erkennt, kann
// die Situation auch nicht stützen (Dual Coding). Deshalb jetzt:
//   1. ein eigenes BILDBAND oben in der Karte (das Bild bekommt Platz, der Text
//      bleibt komplett unbehelligt und gestochen scharf),
//   2. GEFÜLLTE Silhouetten in Tiefenebenen (Himmel → Kulisse → Vordergrund)
//      statt dünner Striche,
//   3. je Szene EIN unverwechselbares Hauptmotiv (Tasse · Zug · Klingel · Tüte).
//
// Weiterhin: reines SVG (offline-sicher, gestochen scharf, wenige kByte) in der
// Kennfarbe des Bereichs. Nie Inhalt, immer Atmosphäre (die eine Design-Regel).

import type { DialogScene } from '../domain/dialog';

interface Props {
  scene: DialogScene;
  hue: string; // Kennfarbe des Bereichs
}

/** Bildband am Kopf der Gesprächskarte (volle Breite, fester Höhenanteil). */
export function SceneArt({ scene, hue }: Props) {
  const id = `sc-${scene}`;
  return (
    <div
      className="scene-in pointer-events-none relative h-28 w-full overflow-hidden sm:h-32"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 120"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          {/* Lichtquelle der Szene (Fenster, Bahnsteiglicht, Ladenbeleuchtung). */}
          <radialGradient id={`${id}-sky`} cx="50%" cy="8%" r="86%">
            <stop offset="0%" stopColor={hue} stopOpacity="0.4" />
            <stop offset="55%" stopColor={hue} stopOpacity="0.13" />
            <stop offset="100%" stopColor={hue} stopOpacity="0" />
          </radialGradient>
          {/* Unterkante weich ins Glas auslaufen lassen — kein harter Bildschnitt. */}
          <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="72%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={`${id}-mask`}>
            <rect x="0" y="0" width="400" height="120" fill={`url(#${id}-fade)`} />
          </mask>
        </defs>

        <g mask={`url(#${id}-mask)`}>
          <rect x="0" y="0" width="400" height="120" fill={`url(#${id}-sky)`} />
          <Scene scene={scene} hue={hue} />
        </g>
      </svg>
    </div>
  );
}

// Tiefenebenen: je weiter hinten, desto blasser; der Vordergrund ist fast schwarz.
const BACK = '#0A121C';
const FRONT = '#070B12';

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
    case 'clinic':
      return <Clinic hue={hue} />;
    default:
      return <Generic hue={hue} />;
  }
}

/** CAFÉ — Hauptmotiv: große Tasse mit Untertasse und Dampf, davor der Tresen. */
function Cafe({ hue }: { hue: string }) {
  return (
    <g>
      {/* Kulisse: Fensterfront mit Sprossen */}
      <rect x="18" y="14" width="104" height="74" rx="4" fill={hue} fillOpacity="0.1" />
      <rect x="18" y="14" width="104" height="74" rx="4" fill="none" stroke={hue} strokeOpacity="0.3" strokeWidth="1.6" />
      <path d="M70 14v74M18 51h104" stroke={hue} strokeOpacity="0.22" strokeWidth="1.4" />
      <rect x="278" y="14" width="104" height="74" rx="4" fill={hue} fillOpacity="0.1" />
      <rect x="278" y="14" width="104" height="74" rx="4" fill="none" stroke={hue} strokeOpacity="0.3" strokeWidth="1.6" />
      <path d="M330 14v74M278 51h104" stroke={hue} strokeOpacity="0.22" strokeWidth="1.4" />

      {/* Hängelampen mit Lichtkegel */}
      <path d="M152 0v16M248 0v10" stroke={hue} strokeOpacity="0.5" strokeWidth="1.6" />
      <path d="M138 16h28l-7 11h-14z" fill={hue} fillOpacity="0.65" />
      <path d="M234 10h28l-7 11h-14z" fill={hue} fillOpacity="0.65" />
      <path d="M145 27h14l14 34h-42z" fill={hue} fillOpacity="0.1" />
      <path d="M241 21h14l14 40h-42z" fill={hue} fillOpacity="0.08" />

      {/* Dampf über der Tasse */}
      <path
        d="M186 36c6-7-6-12 0-19M200 34c6-7-6-12 0-19M214 36c6-7-6-12 0-19"
        fill="none"
        stroke={hue}
        strokeOpacity="0.5"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* HAUPTMOTIV: Tasse mit Henkel + Untertasse */}
      <path d="M172 52h56v20a14 14 0 0 1-14 14h-28a14 14 0 0 1-14-14z" fill={hue} fillOpacity="0.85" />
      <path d="M228 56h8a13 13 0 0 1 0 26h-4" fill="none" stroke={hue} strokeOpacity="0.85" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="200" cy="90" rx="46" ry="7" fill={hue} fillOpacity="0.6" />

      {/* Vordergrund: Tresen */}
      <rect x="0" y="94" width="400" height="26" fill={FRONT} fillOpacity="0.92" />
      <path d="M0 94h400" stroke={hue} strokeOpacity="0.4" strokeWidth="1.6" />
    </g>
  );
}

/** HOTEL — Hauptmotiv: Empfangsklingel + Schlüssel, davor der Tresen, hinten die Fassade. */
function Hotel({ hue }: { hue: string }) {
  const windows = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 9; c++) {
      const lit = (r + c) % 3 !== 0;
      windows.push(
        <rect
          key={`${r}-${c}`}
          x={16 + c * 42}
          y={10 + r * 24}
          width={22}
          height={14}
          rx="2"
          fill={hue}
          fillOpacity={lit ? 0.4 : 0.12}
        />,
      );
    }
  }
  return (
    <g>
      {/* Kulisse: Fassade mit erleuchteten Fenstern */}
      <rect x="0" y="0" width="400" height="86" fill={BACK} fillOpacity="0.55" />
      {windows}

      {/* Vordergrund: Rezeptionstresen */}
      <rect x="0" y="86" width="400" height="34" fill={FRONT} fillOpacity="0.94" />
      <path d="M0 86h400" stroke={hue} strokeOpacity="0.45" strokeWidth="1.8" />

      {/* HAUPTMOTIV: Empfangsklingel auf dem Tresen */}
      <path d="M168 86a32 32 0 0 1 64 0z" fill={hue} fillOpacity="0.85" />
      <rect x="160" y="86" width="80" height="5" rx="2.5" fill={hue} fillOpacity="0.7" />
      <path d="M200 54v-7" stroke={hue} strokeOpacity="0.85" strokeWidth="3" strokeLinecap="round" />
      <circle cx="200" cy="45" r="4.5" fill={hue} fillOpacity="0.9" />

      {/* Schlüssel mit Anhänger daneben */}
      <circle cx="292" cy="76" r="8" fill="none" stroke={hue} strokeOpacity="0.75" strokeWidth="3.4" />
      <path d="M300 76h24M318 76v7M310 76v6" stroke={hue} strokeOpacity="0.75" strokeWidth="3.4" strokeLinecap="round" />

      {/* Tischlampe links: Schirm, Fuß, Lichtschein */}
      <ellipse cx="92" cy="70" rx="32" ry="20" fill={hue} fillOpacity="0.09" />
      <path d="M78 70h28l-7-17H85z" fill={hue} fillOpacity="0.6" />
      <path d="M92 70v16" stroke={hue} strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
      <path d="M82 86h20" stroke={hue} strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

/** BAHNHOF — Hauptmotiv: einfahrender Zug, dazu Bahnsteig, Dach und Uhr. */
function Station({ hue }: { hue: string }) {
  return (
    <g>
      {/* Bahnsteigdach mit Trägern */}
      <rect x="0" y="0" width="400" height="10" fill={BACK} fillOpacity="0.75" />
      <path d="M26 10v40M120 10v34M374 10v40" stroke={hue} strokeOpacity="0.28" strokeWidth="2.4" />

      {/* Bahnhofsuhr */}
      <circle cx="66" cy="34" r="17" fill={BACK} fillOpacity="0.8" />
      <circle cx="66" cy="34" r="17" fill="none" stroke={hue} strokeOpacity="0.7" strokeWidth="2.2" />
      <path d="M66 34v-9M66 34l7 5" stroke={hue} strokeOpacity="0.85" strokeWidth="2.2" strokeLinecap="round" />

      {/* HAUPTMOTIV: Zug, der von rechts einfährt */}
      <path d="M196 86V38a10 10 0 0 1 10-10h150a44 44 0 0 1 44 44v14z" fill={hue} fillOpacity="0.5" />
      <path d="M196 86V38a10 10 0 0 1 10-10h150a44 44 0 0 1 44 44v14z" fill="none" stroke={hue} strokeOpacity="0.8" strokeWidth="2" />
      {/* Frontscheibe + Seitenfenster */}
      <path d="M352 36h6a34 34 0 0 1 32 30h-38z" fill={BACK} fillOpacity="0.85" />
      <rect x="212" y="40" width="34" height="20" rx="3" fill={BACK} fillOpacity="0.8" />
      <rect x="256" y="40" width="34" height="20" rx="3" fill={BACK} fillOpacity="0.8" />
      <rect x="300" y="40" width="34" height="20" rx="3" fill={BACK} fillOpacity="0.8" />
      {/* Scheinwerfer */}
      <circle cx="382" cy="76" r="5" fill="#FFF3D6" fillOpacity="0.85" />
      {/* Räder */}
      <circle cx="240" cy="88" r="9" fill={FRONT} fillOpacity="0.95" />
      <circle cx="300" cy="88" r="9" fill={FRONT} fillOpacity="0.95" />

      {/* Bahnsteigkante + Gleis */}
      <rect x="0" y="92" width="400" height="28" fill={FRONT} fillOpacity="0.92" />
      <path d="M0 92h400" stroke={hue} strokeOpacity="0.5" strokeWidth="2" />
      <path d="M0 104h400" stroke={hue} strokeOpacity="0.16" strokeWidth="1.4" />
    </g>
  );
}

/** GESCHÄFT — Hauptmotiv: Einkaufstüte, dazu gestreifte Markise und Regale. */
function Shop({ hue }: { hue: string }) {
  const stripes = [];
  for (let i = 0; i < 8; i++) {
    stripes.push(
      <path
        key={i}
        d={`M${16 + i * 46} 8h46l-6 20h-46z`}
        fill={hue}
        fillOpacity={i % 2 ? 0.5 : 0.24}
      />,
    );
  }
  return (
    <g>
      {/* Markise */}
      <rect x="0" y="0" width="400" height="10" fill={BACK} fillOpacity="0.7" />
      <g transform="translate(-16 0)">{stripes}</g>
      <path d="M0 28h400" stroke={hue} strokeOpacity="0.45" strokeWidth="2" />

      {/* Regale mit Waren im Hintergrund */}
      <path d="M20 68h100M280 68h100" stroke={hue} strokeOpacity="0.3" strokeWidth="2" />
      <path d="M34 68V52h14v16M60 68V46h12v22M86 68V56h14v12" fill={hue} fillOpacity="0.3" />
      <path d="M294 68V50h13v18M320 68V57h15v11M348 68V46h12v22" fill={hue} fillOpacity="0.3" />

      {/* HAUPTMOTIV: Einkaufstüte */}
      <path d="M164 46h72l-8 48h-56z" fill={hue} fillOpacity="0.75" />
      <path d="M164 46h72l-8 48h-56z" fill="none" stroke={hue} strokeOpacity="0.9" strokeWidth="2" />
      <path d="M182 46a18 18 0 0 1 36 0" fill="none" stroke={hue} strokeOpacity="0.9" strokeWidth="3.4" />

      {/* Vordergrund: Boden */}
      <rect x="0" y="94" width="400" height="26" fill={FRONT} fillOpacity="0.92" />
      <path d="M0 94h400" stroke={hue} strokeOpacity="0.4" strokeWidth="1.6" />
    </g>
  );
}

/** ARZT/APOTHEKE — Hauptmotiv: Stethoskop, dazu Kreuz-Schild und Medikamenten-Regal. */
function Clinic({ hue }: { hue: string }) {
  return (
    <g>
      {/* Wand mit beleuchtetem Kreuz-Schild */}
      <rect x="0" y="0" width="400" height="88" fill={BACK} fillOpacity="0.5" />
      <rect x="40" y="16" width="52" height="52" rx="8" fill={hue} fillOpacity="0.22" />
      <path d="M66 28v28M52 42h28" stroke={hue} strokeOpacity="0.9" strokeWidth="9" strokeLinecap="round" />

      {/* Regal mit Medikamenten-Fläschchen */}
      <path d="M296 62h84" stroke={hue} strokeOpacity="0.35" strokeWidth="2" />
      <path d="M306 62V44h13v18M328 62V38h12v24M350 62V47h14v15" fill={hue} fillOpacity="0.4" />

      {/* HAUPTMOTIV: Stethoskop */}
      <path
        d="M150 20v14a26 26 0 0 0 52 0V20"
        fill="none"
        stroke={hue}
        strokeOpacity="0.85"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="150" cy="17" r="6" fill={hue} fillOpacity="0.9" />
      <circle cx="202" cy="17" r="6" fill={hue} fillOpacity="0.9" />
      <path
        d="M176 60c0 18 26 12 26 26"
        fill="none"
        stroke={hue}
        strokeOpacity="0.85"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="204" cy="88" r="15" fill={hue} fillOpacity="0.85" />
      <circle cx="204" cy="88" r="15" fill="none" stroke={hue} strokeOpacity="0.95" strokeWidth="2.4" />

      {/* Vordergrund: Tresen */}
      <rect x="0" y="94" width="400" height="26" fill={FRONT} fillOpacity="0.92" />
      <path d="M0 94h400" stroke={hue} strokeOpacity="0.45" strokeWidth="1.8" />
    </g>
  );
}

/** NEUTRAL — ruhige Nordlicht-Bögen über einer Bergsilhouette. */
function Generic({ hue }: { hue: string }) {
  return (
    <g>
      <path
        d="M-20 56C70 20 150 66 240 34s140-16 180 4"
        fill="none"
        stroke={hue}
        strokeOpacity="0.4"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M-20 76C80 44 160 88 250 58s130-10 170 8"
        fill="none"
        stroke={hue}
        strokeOpacity="0.22"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M0 104l64-30 58 26 62-34 66 32 60-24 90 34v12H0z" fill={FRONT} fillOpacity="0.9" />
      <path d="M0 104l64-30 58 26 62-34 66 32 60-24 90 34" fill="none" stroke={hue} strokeOpacity="0.35" strokeWidth="1.8" />
    </g>
  );
}
