// Szenenbilder für den Dialog-Modus (docs/gremium-dialog.md §8/§10).
//
// VIERTE FASSUNG — auf dasselbe Niveau gehoben wie die Bereichsbilder.
// Vorher: eine Bereichsfarbe plus Fast-Schwarz und flache Silhouetten. Auf
// demselben Bildschirm sah man dadurch zwei Qualitätsstufen nebeneinander.
//
// Jetzt aus `sceneKit.tsx`: Eigenfarbe statt Bereichston, Volumen mit Licht- und
// Schattenseite, echte Weichzeichnung für die Ferne, Lichtstreuung an Lampen,
// Korn und Vignette — und Menschen mit Körper, Kleidungsfarbe und Kontaktschatten.
//
// Jede Szene hat ihre eigene Tageszeit. Der Bereichston (`hue`) tönt nur noch das
// Umgebungslicht bzw. Bildschirme, damit die Karte zum Bereich passt, ohne das
// ganze Bild einzufärben.
//
// Reines SVG: offline, gestochen scharf, wenige kByte. Nie Inhalt, immer Atmosphäre.

import type { DialogScene } from '../domain/dialog';
import { C, Figure, Pendant, Pool, Spruce, SceneDefs, Finish } from './sceneKit';

const W = 400;
const H = 180;

interface Props {
  scene: DialogScene;
  hue: string; // Kennfarbe des Bereichs — tönt nur das Umgebungslicht
}

/** Himmel/Raumlicht je Szene — echte Tageszeit, nicht der Bereichston. */
const SKIES: Record<string, [string, string][]> = {
  cafe: [
    ['0%', '#2A1D14'],
    ['58%', '#3A281B'],
    ['100%', '#241811'],
  ],
  hotel: [
    ['0%', '#1A1726'],
    ['60%', '#241E33'],
    ['100%', '#161320'],
  ],
  station: [
    ['0%', '#0E1B2E'],
    ['48%', '#1C3049'],
    ['100%', '#2A3E52'],
  ],
  shop: [
    ['0%', '#242A33'],
    ['62%', '#2C333E'],
    ['100%', '#1C2129'],
  ],
  clinic: [
    ['0%', '#182430'],
    ['60%', '#20303C'],
    ['100%', '#16222C'],
  ],
  garage: [
    ['0%', '#151E30'],
    ['54%', '#22293A'],
    ['100%', '#2E2A26'],
  ],
  gaming: [
    ['0%', '#12121E'],
    ['58%', '#181828'],
    ['100%', '#0E0E18'],
  ],
  track: [
    ['0%', '#0C1626'],
    ['52%', '#182A3E'],
    ['100%', '#243646'],
  ],
  lake: [
    ['0%', '#1E3348'],
    ['40%', '#456276'],
    ['72%', '#93A69A'],
    ['100%', '#C9C08A'],
  ],
  stadium: [
    ['0%', '#0A1420'],
    ['54%', '#12222E'],
    ['100%', '#1A2E28'],
  ],
  generic: [
    ['0%', '#1B2440'],
    ['100%', '#2C3A4E'],
  ],
};

/** Bildband am Kopf der Gesprächskarte. */
export function SceneArt({ scene, hue }: Props) {
  const id = `sc-${scene}`;
  const sky = SKIES[scene] ?? SKIES.generic;
  return (
    <div
      className="scene-in pointer-events-none relative h-44 w-full overflow-hidden sm:h-52"
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <SceneDefs id={id}>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            {sky.map((s, i) => (
              <stop key={i} offset={s[0]} stopColor={s[1]} />
            ))}
          </linearGradient>
          {/* Unterkante weich ins Glas auslaufen lassen. */}
          <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="76%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={`${id}-mask`}>
            <rect width={W} height={H} fill={`url(#${id}-fade)`} />
          </mask>
        </SceneDefs>

        <g mask={`url(#${id}-mask)`}>
          <rect width={W} height={H} fill={`url(#${id}-sky)`} />
          <Scene scene={scene} hue={hue} id={id} />
          <Finish id={id} w={W} h={H} />
        </g>
      </svg>
      <span className="grain-soft" aria-hidden="true" />
    </div>
  );
}

function Scene({ scene, hue, id }: { scene: DialogScene; hue: string; id: string }) {
  const far = `url(#${id}-far)`;
  const glow = `url(#${id}-glow)`;

  switch (scene) {
    // ── CAFÉ: Tresen mit Kanelbullar, Pendelleuchten, Barista ──────────────
    case 'cafe':
      return (
        <>
          <g filter={far} opacity="0.85">
            <rect x="22" y="40" width="120" height="3.4" fill={C.wood} />
            <rect x="22" y="70" width="120" height="3.4" fill={C.wood} />
            {Array.from({ length: 7 }, (_, i) => (
              <g key={i}>
                <path d={`M${30 + i * 16} 40 l0 -10 q5 -2.6 10 0 l0 10 Z`} fill="#C9C4B8" />
                <path d={`M${35 + i * 16} 40 l0 -10 q2.5 -1.3 5 0 l0 10 Z`} fill="#000" opacity="0.22" />
              </g>
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <rect key={i} x={32 + i * 22} y="52" width="14" height="18" rx="1.6" fill={C.brass} opacity="0.5" />
            ))}
          </g>
          {[92, 200, 308].map((x) => (
            <Pendant key={x} x={x} y={38} glow={glow} spread={50} floor={126} />
          ))}
          <Figure x={276} y={124} h={52} coat={5} flip lightFrom="left" seated />
          <rect y="124" width={W} height="56" fill={C.wood} />
          <rect y="124" width={W} height="4" fill={C.lampCore} opacity="0.45" />
          <rect y="128" width={W} height="52" fill="#000" opacity="0.42" />
          <rect x="126" y="98" width="128" height="26" fill="#0E0A07" opacity="0.5" />
          <rect
            x="126"
            y="98"
            width="128"
            height="26"
            fill={C.glass}
            opacity="0.13"
            stroke="#CFE6EC"
            strokeOpacity="0.32"
            strokeWidth="1"
          />
          <rect x="126" y="98" width="128" height="7" fill="#fff" opacity="0.13" />
          {Array.from({ length: 5 }, (_, i) => (
            <g key={i} transform={`translate(${143 + i * 24} 116)`}>
              <ellipse rx="8.6" ry="5" fill={C.bun} />
              <ellipse cy="-1.6" rx="8.6" ry="4.2" fill="#D89A5C" />
              <path d="M-5 -2.4 q5 -2.8 10 0" stroke={C.icing} strokeWidth="1.4" fill="none" opacity="0.85" />
            </g>
          ))}
          <Figure x={66} y={146} h={54} coat={2} lightFrom="right" />
          <g transform="translate(92 118)">
            <path d="M-7.5 0 q0 8.5 7.5 8.5 q7.5 0 7.5 -8.5 Z" fill="#E4E0D6" />
            <path d="M0 0 q7.5 0 7.5 8.5 q-3.8 0 -7.5 -8.5 Z" fill="#000" opacity="0.16" />
            <ellipse rx="7.5" ry="1.9" fill="#3A2A1C" />
          </g>
        </>
      );

    // ── HOTEL: Rezeption mit Schlüsselfächern, Lampe, Pflanze ──────────────
    case 'hotel':
      return (
        <>
          <rect x="30" y="26" width="150" height="76" rx="3" fill="#2A2438" />
          {Array.from({ length: 18 }, (_, i) => (
            <g key={i}>
              <rect
                x={38 + (i % 6) * 24}
                y={34 + Math.floor(i / 6) * 24}
                width="18"
                height="18"
                rx="1.5"
                fill="#1A1626"
              />
              <rect
                x={38 + (i % 6) * 24}
                y={34 + Math.floor(i / 6) * 24}
                width="18"
                height="4"
                fill="#fff"
                opacity="0.07"
              />
              {i % 3 !== 2 && (
                <circle
                  cx={47 + (i % 6) * 24}
                  cy={46 + Math.floor(i / 6) * 24}
                  r="2.4"
                  fill={C.brass}
                  opacity="0.7"
                />
              )}
            </g>
          ))}
          <Pendant x={310} y={44} glow={glow} spread={56} floor={126} />
          <g transform="translate(212 126)">
            <path d="M-11 0 L11 0 L8 -18 L-8 -18 Z" fill={C.wood} />
            <ellipse cy="-18" rx="8" ry="2.4" fill="#2C1F14" />
            <ellipse cx="-6" cy="-30" rx="9" ry="13" fill="#2E4426" />
            <ellipse cx="6" cy="-34" rx="8" ry="14" fill="#3C5730" opacity="0.9" />
            <ellipse cx="0" cy="-44" rx="6" ry="10" fill="#2E4426" />
          </g>
          <rect y="126" width={W} height="54" fill="#3A3048" />
          <rect y="126" width={W} height="4" fill="#fff" opacity="0.12" />
          <rect y="130" width={W} height="50" fill="#000" opacity="0.4" />
          <rect x="252" y="112" width="42" height="14" rx="2" fill="#1A1626" />
          <rect x="256" y="115" width="34" height="8" fill={C.glass} opacity="0.3" />
          <Pool cx={310} cy={130} rx={72} o={0.12} />
          <Figure x={330} y={148} h={54} coat={3} flip lightFrom="left" seated />
          <Figure x={110} y={162} h={56} coat={0} lightFrom="right" />
        </>
      );

    // ── BAHNHOF: Bahnsteig, Zug mit erleuchteten Fenstern, Anzeigetafel ────
    case 'station':
      return (
        <>
          <rect y="0" width={W} height="26" fill="#141E2A" />
          <g stroke="#22303E" strokeWidth="2.6">
            {[60, 160, 260, 360].map((x) => (
              <line key={x} x1={x} y1="26" x2={x} y2="112" />
            ))}
          </g>
          <rect x="118" y="30" width="128" height="30" rx="2" fill="#0A0F16" />
          <g fill={C.lamp} opacity="0.85">
            <rect x="126" y="37" width="34" height="4" rx="2" />
            <rect x="126" y="46" width="52" height="4" rx="2" />
            <rect x="206" y="37" width="30" height="4" rx="2" />
            <rect x="216" y="46" width="20" height="4" rx="2" />
          </g>
          <rect x="118" y="30" width="128" height="30" rx="2" fill={C.lamp} opacity="0.09" filter={glow} />
          <rect x="0" y="66" width={W} height="46" rx="6" fill="#5A6470" />
          <rect x="0" y="66" width={W} height="9" fill="#fff" opacity="0.16" />
          <rect x="0" y="100" width={W} height="12" fill="#000" opacity="0.35" />
          <rect x="0" y="80" width={W} height="4" fill="#2E6E9E" opacity="0.7" />
          <g fill={C.lamp} opacity="0.9">
            {Array.from({ length: 9 }, (_, i) => (
              <rect key={i} x={12 + i * 44} y="86" width="26" height="12" rx="1.5" />
            ))}
          </g>
          <rect y="112" width={W} height="68" fill="#252A31" />
          <rect y="112" width={W} height="5" fill="#C9A24A" opacity="0.8" />
          <g fill="#000" opacity="0.16">
            {Array.from({ length: 4 }, (_, i) => (
              <rect key={i} y={124 + i * 15} width={W} height="7" />
            ))}
          </g>
          <Pool cx={200} cy={122} rx={150} o={0.09} />
          <Figure x={92} y={158} h={56} coat={0} lightFrom="right" />
          <rect x="108" y="140" width="17" height="18" rx="2" fill="#33291E" />
          <rect x="108" y="140" width="17" height="5" fill="#fff" opacity="0.12" />
          <Figure x={306} y={150} h={46} coat={4} flip dim={0.35} lightFrom="left" />
        </>
      );

    // ── LADEN: Regale, Kleiderstange, Kasse, Dalahäst ──────────────────────
    case 'shop':
      return (
        <>
          <rect x="14" y="34" width="120" height="4" fill={C.wood} />
          <rect x="14" y="70" width="120" height="4" fill={C.wood} />
          <rect x="14" y="106" width="120" height="4" fill={C.wood} />
          {['#5E6E7A', '#7A6A52', '#4E6350', '#7A5A50', '#5A5470', '#6A6A52'].map((c, i) => (
            <g key={i}>
              <rect x={22 + i * 19} y="18" width="13" height="16" rx="1.5" fill={c} />
              <rect x={22 + i * 19} y="18" width="4" height="16" fill="#fff" opacity="0.14" />
            </g>
          ))}
          {['#6A5A44', '#4E6350', '#7A5A50'].map((c, i) => (
            <rect key={i} x={26 + i * 36} y="52" width="28" height="18" rx="2" fill={c} />
          ))}
          {/* Dalahäst im Regal — der schwedische Augenzwinkerer */}
          <g transform="translate(44 106) scale(1.6)">
            <path
              d="M3 0 L3 -6 L2 -9 Q2 -13 6 -14 L13 -14.5 Q13.5 -19 16 -21.5 L21 -23 L22.5 -20.5
                 L20.5 -18.5 Q19.5 -16 19 -13.5 Q22 -12 22 -8 L22 -6 L20 0 L17.5 0 L18.5 -5.5
                 L14 -4.5 L14 0 L11.5 0 L11.5 -4.5 L7 -4.5 L7 0 Z"
              fill="#B33A2E"
            />
            <path d="M8 -13 q4 -2.6 8 -1 l-1 3 q-3.6 -1.2 -7 0.6 Z" fill="#2E6E9E" />
            <circle cx="19.4" cy="-20.2" r="0.8" fill="#161616" />
          </g>
          <line x1="226" y1="28" x2="368" y2="28" stroke={C.steel} strokeWidth="2.8" />
          {['#4A5A68', '#6A4A46', '#43584A', '#5A5062', '#6E6250', '#3E4A5A', '#66504A'].map((c, i) => (
            <g key={i}>
              <path d={`M${238 + i * 18} 28 l-7.5 16 q7.5 30 7.5 39 q0 2.6 14 0 q0 -9 7.5 -39 l-7.5 -16 Z`} fill={c} />
              <path
                d={`M${238 + i * 18} 28 l-7.5 16 q4.5 26 4.5 36 l4.5 0 q-1 -22 4.5 -36 l-5.5 -16 Z`}
                fill="#fff"
                opacity="0.1"
              />
            </g>
          ))}
          <rect y="126" width={W} height="54" fill="#242A32" />
          <rect y="126" width={W} height="3.4" fill="#fff" opacity="0.09" />
          <rect x="130" y="102" width="108" height="24" fill={C.wood} />
          <rect x="130" y="102" width="108" height="4.4" fill="#fff" opacity="0.13" />
          <rect x="196" y="88" width="26" height="14" rx="2" fill="#1A1E26" />
          <rect x="200" y="91" width="18" height="8" fill={C.glass} opacity="0.35" />
          <Figure x={172} y={102} h={50} coat={4} flip lightFrom="left" seated />
          <Figure x={92} y={152} h={56} coat={1} lightFrom="right" />
          <g transform="translate(112 130)">
            <rect width="18" height="18" rx="1.6" fill="#5E4A38" />
            <path d="M3.4 0 q5.6 -6.6 11.2 0" stroke="#8A7050" strokeWidth="1.7" fill="none" />
          </g>
        </>
      );

    // ── PRAXIS: Fenster, Schrank, grünes Kreuz, Behandlungsliege ───────────
    case 'clinic':
      return (
        <>
          <rect x="24" y="24" width="96" height="70" rx="3" fill={C.glass} opacity="0.2" />
          <rect
            x="24"
            y="24"
            width="96"
            height="70"
            rx="3"
            fill="none"
            stroke="#CFE6EC"
            strokeOpacity="0.3"
            strokeWidth="1.4"
          />
          <line x1="72" y1="24" x2="72" y2="94" stroke="#0A1018" strokeWidth="2.4" />
          <line x1="24" y1="58" x2="120" y2="58" stroke="#0A1018" strokeWidth="2.4" />
          <rect x="266" y="34" width="110" height="60" rx="3" fill="#20303C" />
          <rect x="266" y="34" width="110" height="60" rx="3" fill={C.glass} opacity="0.12" />
          <rect x="266" y="62" width="110" height="3" fill="#2E4452" />
          {['#7BE8B4', '#CFE6EC', '#E8C25A', '#CFE6EC', '#7BE8B4'].map((c, i) => (
            <rect key={i} x={276 + i * 20} y="44" width="10" height="18" rx="1.6" fill={c} opacity="0.55" />
          ))}
          <g transform="translate(200 50)">
            <circle r="20" fill={C.apotek} opacity="0.4" filter={glow} />
            <rect x="-13" y="-4.6" width="26" height="9.2" rx="1.8" fill="#7BE8B4" />
            <rect x="-4.6" y="-13" width="9.2" height="26" rx="1.8" fill="#7BE8B4" />
          </g>
          <rect y="118" width={W} height="62" fill="#1E2A34" />
          <rect x="150" y="104" width="150" height="16" rx="4" fill="#D8DEE2" />
          <rect x="150" y="104" width="150" height="5" rx="2.5" fill="#fff" opacity="0.35" />
          <rect x="150" y="114" width="150" height="6" fill="#000" opacity="0.25" />
          <g fill="#5A646E">
            <rect x="162" y="120" width="5" height="24" />
            <rect x="284" y="120" width="5" height="24" />
          </g>
          <Pool cx={200} cy={122} rx={120} color={C.glass} o={0.09} />
          <Figure x={318} y={156} h={54} coat={4} flip lightFrom="left" />
          <Figure x={96} y={160} h={56} coat={1} lightFrom="right" />
        </>
      );

    // ── WERKSTATT: Auto mit offener Haube, Werkzeugtafel, Hängelampe ───────
    case 'garage':
      return (
        <>
          <rect x="26" y="34" width="110" height="48" rx="2" fill="#24242A" />
          <g stroke={C.steel} strokeWidth="2.2">
            <line x1="42" y1="42" x2="42" y2="64" />
            <line x1="60" y1="42" x2="66" y2="64" />
            <line x1="86" y1="42" x2="86" y2="60" />
            <line x1="110" y1="44" x2="120" y2="64" />
          </g>
          <rect x="22" y="96" width="120" height="7" fill={C.wood} />
          <rect x="22" y="96" width="120" height="2.4" fill={C.woodLit} opacity="0.7" />
          <Pendant x={236} y={32} glow={glow} spread={70} floor={132} />
          <path d="M186 110 L206 82 L272 82 L296 110 Z" fill="#5E6E7E" />
          <path d="M210 86 L268 86 L284 108 L196 108 Z" fill="#0F1620" />
          <path d="M210 86 L240 86 L240 108 L196 108 Z" fill="#9EB4C6" opacity="0.32" />
          <rect x="176" y="110" width="132" height="22" rx="4" fill="#7A2E28" />
          <rect x="176" y="110" width="132" height="7" rx="3.5" fill="#fff" opacity="0.15" />
          <rect x="176" y="126" width="132" height="6" fill="#000" opacity="0.3" />
          <path d="M176 110 L154 70 L165 68 L186 108 Z" fill="#8A3A32" />
          <circle cx="198" cy="134" r="11" fill="#141418" />
          <circle cx="198" cy="134" r="4.4" fill="#4A4E56" />
          <circle cx="286" cy="134" r="11" fill="#141418" />
          <circle cx="286" cy="134" r="4.4" fill="#4A4E56" />
          <rect y="140" width={W} height="40" fill="#22242A" />
          <Pool cx={236} cy={142} rx={120} o={0.13} />
          <g stroke="#000" strokeOpacity="0.25" strokeWidth="0.9">
            <path d="M0 152 H400 M0 166 H400" />
          </g>
          <Figure x={152} y={158} h={54} coat={2} lightFrom="right" />
          <Figure x={344} y={162} h={56} coat={0} flip lightFrom="left" />
        </>
      );

    // ── ZOCKEN: Monitor als Lichtquelle, Headset, Tastatur ─────────────────
    case 'gaming':
      return (
        <>
          <g filter={far} opacity="0.75">
            <rect x="20" y="52" width="72" height="48" rx="3" fill="#0A0D14" />
            <rect x="24" y="56" width="64" height="40" fill={hue} opacity="0.22" />
            <rect x="312" y="62" width="68" height="4" fill="#2A2A30" />
            <rect x="320" y="46" width="13" height="16" rx="1.6" fill={hue} opacity="0.32" />
            <rect x="340" y="46" width="13" height="16" rx="1.6" fill="#7A5A50" opacity="0.5" />
          </g>
          <rect x="122" y="26" width="164" height="94" rx="5" fill="#0A0D14" />
          <rect x="128" y="32" width="152" height="82" fill={hue} opacity="0.34" />
          <rect x="128" y="32" width="152" height="22" fill={hue} opacity="0.2" />
          <g fill={hue} opacity="0.6">
            <rect x="137" y="41" width="50" height="4.4" rx="2.2" />
            <rect x="137" y="52" width="76" height="4.4" rx="2.2" />
            <rect x="137" y="98" width="38" height="4.4" rx="2.2" />
          </g>
          <rect x="122" y="26" width="164" height="94" rx="5" fill={hue} opacity="0.1" filter={glow} />
          <rect x="196" y="120" width="18" height="14" fill="#1A1E26" />
          <rect x="176" y="134" width="58" height="5" rx="2.5" fill="#1A1E26" />
          <rect y="138" width={W} height="42" fill="#2A2118" />
          <rect y="138" width={W} height="4" fill={C.woodLit} opacity="0.55" />
          <rect y="142" width={W} height="38" fill="#000" opacity="0.4" />
          <Pool cx={200} cy={140} rx={140} color={hue} o={0.12} />
          <rect x="140" y="148" width="126" height="15" rx="3" fill="#15181F" />
          <g fill={hue} opacity="0.55">
            {Array.from({ length: 11 }, (_, i) => (
              <rect key={i} x={147 + i * 11} y="152" width="7" height="7" rx="1" />
            ))}
          </g>
          <ellipse cx="292" cy="156" rx="9" ry="6" fill="#15181F" />
          <Figure x={332} y={172} h={58} coat={3} flip lightFrom="left" />
          {/* Headset über dem Kopf der Figur */}
          <g>
            <path d="M322 130 q10 -12 20 0" stroke={hue} strokeOpacity="0.65" strokeWidth="3" fill="none" />
            <rect x="318" y="130" width="6" height="10" rx="2.4" fill={hue} opacity="0.65" />
            <rect x="340" y="130" width="6" height="10" rx="2.4" fill={hue} opacity="0.65" />
          </g>
        </>
      );

    // ── RENNSTRECKE: Bolide, Curbs, Flutlicht, Zuschauer ───────────────────
    case 'track':
      return (
        <>
          <g filter={far} opacity="0.6">
            <path d="M0 92 L128 64 L128 100 L0 100 Z" fill={C.far} />
            {Array.from({ length: 14 }, (_, i) => (
              <circle key={i} cx={10 + i * 9} cy={84 - i * 1.6} r="2.6" fill={hue} opacity="0.4" />
            ))}
          </g>
          <line x1="332" y1="100" x2="332" y2="26" stroke={C.mid} strokeWidth="2.8" />
          <rect x="314" y="18" width="38" height="9" rx="2" fill={C.mid} />
          <circle cx="333" cy="24" r="16" fill={C.lampCore} opacity="0.55" filter={glow} />
          <rect y="100" width={W} height="34" fill="#1C1F26" />
          {Array.from({ length: 20 }, (_, i) => (
            <rect key={i} x={i * 21} y="100" width="11" height="6" fill={i % 2 ? '#C4443A' : '#E8E4DC'} opacity="0.8" />
          ))}
          <Pool cx={210} cy={122} rx={110} o={0.12} />
          <path d="M148 124 L172 108 L248 108 L272 124 Z" fill="#B8432E" />
          <path d="M182 110 L228 110 L240 122 L170 122 Z" fill="#0F1620" />
          <rect x="136" y="118" width="150" height="9" rx="3.4" fill="#8E3324" />
          <rect x="136" y="118" width="150" height="3.4" rx="1.7" fill="#fff" opacity="0.18" />
          <rect x="124" y="106" width="18" height="4.4" rx="1" fill="#1A1A1E" />
          <rect x="278" y="100" width="22" height="4.4" rx="1" fill="#1A1A1E" />
          <rect x="285" y="100" width="4.4" height="18" fill="#1A1A1E" />
          <circle cx="164" cy="129" r="10" fill="#111114" />
          <circle cx="254" cy="129" r="10" fill="#111114" />
          <circle cx="204" cy="112" r="5.4" fill="#E8E4DC" opacity="0.85" />
          <g fill={C.lampCore} opacity="0.3">
            <rect x="292" y="112" width="52" height="2.2" rx="1.1" />
            <rect x="300" y="120" width="66" height="2.2" rx="1.1" />
            <rect x="296" y="128" width="42" height="2.2" rx="1.1" />
          </g>
          <rect y="134" width={W} height="46" fill="#1A1D24" />
          <rect y="132" width={W} height="5" fill="#3A3E46" />
          <rect y="132" width={W} height="1.6" fill="#fff" opacity="0.16" />
          <Figure x={52} y={166} h={54} coat={0} lightFrom="right" />
          <Figure x={86} y={170} h={48} coat={5} flip dim={0.25} lightFrom="right" />
          <Figure x={352} y={168} h={52} coat={1} flip lightFrom="left" />
        </>
      );

    // ── SEE: Steg, Angler, Bootshaus, Morgenlicht ──────────────────────────
    case 'lake':
      return (
        <>
          <circle cx="292" cy="86" r="16" fill="#FFE9B4" opacity="0.9" filter={glow} />
          <circle cx="292" cy="86" r="8" fill="#FFF6DC" />
          <g filter={far} opacity="0.55">
            {[8, 32, 56, 80, 104, 320, 346, 372].map((x, i) => (
              <Spruce key={x} x={x} y={100} h={24 + (i % 4) * 10} dim={0.35} />
            ))}
            <rect y="96" width={W} height="6" fill="#2A3E36" />
          </g>
          <path d="M336 96 L356 80 L376 96 Z" fill={C.slate} />
          <rect x="340" y="96" width="32" height="22" fill={C.falu} />
          <rect x="362" y="96" width="10" height="22" fill="#000" opacity="0.28" />
          <rect x="348" y="102" width="9" height="11" fill="#141820" />
          <rect y="100" width={W} height="80" fill="#20404C" />
          <rect y="100" width={W} height="80" fill={`url(#${id}-lake)`} />
          <defs>
            <linearGradient id={`${id}-lake`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9C08A" stopOpacity="0.4" />
              <stop offset="42%" stopColor="#2C4A54" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#0A171E" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <g fill="#FFE9B4" opacity="0.3">
            <rect x="264" y="108" width="52" height="1.6" rx="0.8" />
            <rect x="250" y="118" width="78" height="1.6" rx="0.8" />
            <rect x="270" y="130" width="56" height="1.6" rx="0.8" />
            <rect x="242" y="144" width="94" height="1.6" rx="0.8" />
          </g>
          <path d="M0 140 L148 128 L148 142 L0 158 Z" fill={C.wood} />
          <path d="M0 140 L148 128 L148 132 L0 145 Z" fill={C.woodLit} opacity="0.65" />
          <rect x="40" y="144" width="6" height="30" fill="#2C1F14" />
          <rect x="112" y="136" width="6" height="34" fill="#2C1F14" />
          <Figure x={90} y={134} h={52} coat={2} lightFrom="right" />
          <path d="M102 102 Q168 84 244 108" stroke="#D8D4C8" strokeWidth="1.6" fill="none" opacity="0.8" />
          <line x1="244" y1="108" x2="246" y2="126" stroke="#D8D4C8" strokeWidth="0.9" opacity="0.6" />
          <ellipse cx="246" cy="127" rx="13" ry="3" fill="none" stroke="#FFE9B4" strokeOpacity="0.4" strokeWidth="1.2" />
          <ellipse cx="246" cy="127" rx="24" ry="5.4" fill="none" stroke="#FFE9B4" strokeOpacity="0.2" strokeWidth="1.2" />
          <path d="M116 126 L132 126 L129 140 L119 140 Z" fill="#3A4A54" />
        </>
      );

    // ── STADION: Flutlicht, Rasen mit Mähstreifen, Tribüne ─────────────────
    case 'stadium':
      return (
        <>
          <path d="M0 76 L400 58 L400 100 L0 100 Z" fill={C.mid} />
          <g fill={hue} opacity="0.3">
            {Array.from({ length: 44 }, (_, i) => (
              <circle key={i} cx={6 + i * 9} cy={80 - i * 0.4} r="2.4" />
            ))}
            {Array.from({ length: 40 }, (_, i) => (
              <circle key={`b${i}`} cx={12 + i * 10} cy={92 - i * 0.36} r="2.2" opacity="0.7" />
            ))}
          </g>
          {[56, 344].map((x) => (
            <g key={x}>
              <line x1={x} y1="100" x2={x} y2="20" stroke={C.night} strokeWidth="2.8" />
              <rect x={x - 19} y="12" width="38" height="9" rx="2" fill={C.night} />
              <circle cx={x} cy="18" r="17" fill={C.lampCore} opacity="0.5" filter={glow} />
              <path
                d={`M${x - 19} 21 L${x + 19} 21 L${x + 88} 130 L${x - 88} 130 Z`}
                fill={C.lampCore}
                opacity="0.07"
              />
            </g>
          ))}
          <rect y="100" width={W} height="80" fill="#24452C" />
          <g fill="#000" opacity="0.14">
            {Array.from({ length: 5 }, (_, i) => (
              <rect key={i} y={104 + i * 16} width={W} height="8" />
            ))}
          </g>
          <Pool cx={200} cy={120} rx={150} color="#DFF0D8" o={0.09} />
          <g stroke="#E8EAE4" strokeOpacity="0.5" strokeWidth="1.8" fill="none">
            <line x1="0" y1="130" x2="400" y2="130" />
            <circle cx="200" cy="130" r="28" />
            <path d="M14 112 L14 100 L58 100 L58 112" />
          </g>
          <Figure x={148} y={126} h={30} coat={0} dim={0.3} lightFrom="right" />
          <Figure x={238} y={130} h={32} coat={1} flip dim={0.3} lightFrom="left" />
          <rect y="152" width={W} height="28" fill={C.night} />
          <Figure x={62} y={170} h={58} coat={4} lightFrom="right" />
          <Figure x={334} y={172} h={54} coat={5} flip lightFrom="left" />
        </>
      );

    default:
      return (
        <>
          <rect y="122" width={W} height="58" fill={C.night} />
          <Pool cx={200} cy={126} rx={110} color={hue} o={0.16} />
          <Figure x={200} y={156} h={56} coat={0} lightFrom="right" />
        </>
      );
  }
}
