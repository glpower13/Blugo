// Bereichsbilder für die Bildkarten der Ebene 1 (docs/gremium-navigation.md §4).
//
// Die Bausteine (Figur, Haus, Nadelbaum, Filter, Korn/Vignette) und die
// Bildregeln stehen in `sceneKit.tsx` — dieselben, die auch die Gesprächs-
// kulissen nutzen. Hier stehen nur noch die Szenen selbst.
//
// Jede Szene hat ihre EIGENE Tageszeit und ihre eigenen Farben; der Bereichston
// tönt nur die Karte drumherum. Die Motive sind echt schwedisch (Falunrot,
// Schärengarten-Fähre, Kanelbullar, Midsommarstång, Dalahäst, Apotek, Bootshaus)
// statt dekorativer Flaggen-Symbolik.

import { C, Figure, House, Spruce } from './sceneKit';

const W = 400;
const H = 150;

/** Himmel je Szene — echte Tageszeit-Farben statt des Bereichstons. */
const SKIES: Record<string, [string, string][]> = {
  'area-basics': [
    ['0%', '#1B2440'],
    ['46%', '#3E4360'],
    ['74%', '#8A6152'],
    ['100%', '#C07A4C'],
  ],
  'area-travel': [
    ['0%', '#0E1B31'],
    ['42%', '#22405F'],
    ['72%', '#6E5A5E'],
    ['100%', '#C4713C'],
  ],
  'area-food': [
    ['0%', '#2A1D14'],
    ['60%', '#3A281B'],
    ['100%', '#241811'],
  ],
  'area-people': [
    ['0%', '#2C3E63'],
    ['44%', '#5E6E92'],
    ['76%', '#C79A62'],
    ['100%', '#E8B565'],
  ],
  'area-shopping': [
    ['0%', '#242A33'],
    ['62%', '#2C333E'],
    ['100%', '#1C2129'],
  ],
  'area-emergency': [
    ['0%', '#080E19'],
    ['58%', '#101A2A'],
    ['100%', '#1A2634'],
  ],
  // Abend vor der offenen Garage — warmes Werkstattlicht gegen kühle Dämmerung
  'area-friends': [
    ['0%', '#151E30'],
    ['52%', '#22293A'],
    ['100%', '#2E2A26'],
  ],
  // Früher Morgen am See — Nebel über dem Wasser, erste Sonne
  'area-outdoors': [
    ['0%', '#1E3348'],
    ['40%', '#456276'],
    ['72%', '#93A69A'],
    ['100%', '#C9C08A'],
  ],
  default: [
    ['0%', '#1B2440'],
    ['100%', '#2C3A4E'],
  ],
};

interface Props {
  areaId: string;
  hue: string;
}

export function AreaArt({ areaId, hue }: Props) {
  const id = `aa-${areaId}`;
  const sky = SKIES[areaId] ?? SKIES.default;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          {sky.map((s, i) => (
            <stop key={i} offset={s[0]} stopColor={s[1]} />
          ))}
        </linearGradient>
        {/* Echte Weichzeichnung für die Ferne — Luftperspektive, nicht nur blasse Farbe. */}
        <filter id={`${id}-far`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.9" />
        </filter>
        {/* Lichtschein um Lampen und Leuchtschilder. */}
        <filter id={`${id}-glow`} x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <radialGradient id={`${id}-vig`} cx="0.5" cy="0.48" r="0.78">
          <stop offset="52%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.62" />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <Scene areaId={areaId} id={id} hue={hue} />
      <rect width={W} height={H} fill={`url(#${id}-vig)`} />
    </svg>
  );
}

function Scene({ areaId, id, hue }: { areaId: string; id: string; hue: string }) {
  const far = `url(#${id}-far)`;
  const glow = `url(#${id}-glow)`;

  switch (areaId) {
    // ── Erste Schritte: Gamla-Stan-Gasse im Morgenlicht ────────────────────
    case 'area-basics':
      return (
        <>
          <g filter={far} opacity="0.75">
            <path d="M28 104 L28 40 L38 16 L48 40 L48 104 Z" fill="#2A3346" />
            <rect x="34" y="48" width="8" height="11" fill={C.lamp} opacity="0.55" />
            <rect x="0" y="66" width="30" height="38" fill="#2E3648" />
          </g>
          <House x={50} y={48} w={64} h={56} color={C.falu} gable />
          <House x={120} y={60} w={56} h={44} color={C.ochre} gable />
          <House x={182} y={44} w={70} h={60} color={C.mustard} gable />
          <House x={258} y={64} w={60} h={40} color={C.faluDark} />
          <House x={324} y={54} w={76} h={50} color={C.falu} gable />
          <line x1="150" y1="104" x2="150" y2="58" stroke="#1A1E26" strokeWidth="2.4" />
          <circle cx="150" cy="55" r="12" fill={C.lamp} opacity="0.5" filter={glow} />
          <circle cx="150" cy="55" r="3.2" fill={C.lampCore} />
          {/* Kopfsteinpflaster, feucht vom Morgen */}
          <rect y="104" width={W} height="46" fill="#20222A" />
          <rect y="104" width={W} height="46" fill={`url(#${id}-cobble)`} />
          <defs>
            <linearGradient id={`${id}-cobble`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5A503E" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <ellipse cx="150" cy="112" rx="56" ry="9" fill={C.lamp} opacity="0.18" />
          <g stroke="#000" strokeOpacity="0.3" strokeWidth="0.8">
            <path d="M0 116 H400 M0 127 H400 M0 140 H400" />
          </g>
          <Figure x={128} y={132} h={46} coat={0} lightFrom="right" />
          <Figure x={168} y={134} h={44} coat={1} flip lightFrom="left" />
          <Figure x={320} y={124} h={34} coat={4} dim={0.5} />
        </>
      );

    // ── Reisen: Schärengarten-Fähre im Abendlicht ──────────────────────────
    case 'area-travel':
      return (
        <>
          <g filter={far} opacity="0.62">
            <rect x="0" y="60" width="40" height="42" fill="#1E2C42" />
            <path d="M46 60 L54 34 L62 60 Z" fill="#1E2C42" />
            <rect x="48" y="60" width="12" height="42" fill="#1E2C42" />
            <rect x="70" y="70" width="34" height="32" fill="#22304A" />
            <rect x="110" y="52" width="14" height="50" fill="#1E2C42" />
            <path d="M110 52 L117 36 L124 52 Z" fill="#1E2C42" />
            <g fill={C.lamp} opacity="0.5">
              <rect x="8" y="72" width="4" height="5" />
              <rect x="20" y="84" width="4" height="5" />
              <rect x="76" y="80" width="4" height="5" />
              <rect x="92" y="76" width="4" height="5" />
            </g>
          </g>
          <g filter={far}>
            <Spruce x={352} y={102} h={40} dim={0.3} />
            <Spruce x={374} y={102} h={30} dim={0.3} />
            <Spruce x={336} y={102} h={24} dim={0.45} />
          </g>
          <rect y="102" width={W} height="48" fill={C.water} />
          <rect y="102" width={W} height="48" fill={`url(#${id}-sea)`} />
          <defs>
            <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C4713C" stopOpacity="0.32" />
              <stop offset="45%" stopColor="#16283C" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#070D18" stopOpacity="0.72" />
            </linearGradient>
          </defs>
          <g fill={C.lamp} opacity="0.32">
            <rect x="150" y="108" width="52" height="1.4" rx="0.7" />
            <rect x="168" y="116" width="70" height="1.4" rx="0.7" />
            <rect x="140" y="124" width="44" height="1.4" rx="0.7" />
            <rect x="196" y="132" width="60" height="1.4" rx="0.7" />
          </g>
          <g>
            <path d="M172 102 L306 102 L294 116 L184 116 Z" fill={C.hull} />
            <path d="M172 102 L306 102 L300 108 L178 108 Z" fill="#fff" opacity="0.22" />
            <path d="M184 116 L294 116 L288 120 L190 120 Z" fill="#0C1622" />
            <rect x="196" y="80" width="84" height="22" fill={C.hull} />
            <rect x="196" y="80" width="84" height="6" fill="#fff" opacity="0.2" />
            <rect x="236" y="64" width="18" height="16" fill="#E8EAE4" />
            <rect x="238" y="68" width="14" height="7" fill={C.lamp} opacity="0.9" />
            <g fill={C.lamp}>
              {Array.from({ length: 8 }, (_, i) => (
                <rect key={i} x={202 + i * 10} y="87" width="6" height="7" opacity="0.9" />
              ))}
            </g>
            <rect x="244" y="46" width="2" height="18" fill="#B8BCB6" />
            <circle cx="245" cy="46" r="5" fill={C.lamp} opacity="0.7" filter={glow} />
          </g>
          <path d="M0 128 L122 128 L122 150 L0 150 Z" fill="#191C22" />
          <rect x="0" y="126" width="124" height="4" fill="#2E333C" />
          <Figure x={72} y={128} h={46} coat={0} lightFrom="right" />
          <rect x="86" y="114" width="15" height="14" rx="2" fill="#33291E" />
          <rect x="86" y="114" width="15" height="4" fill="#fff" opacity="0.12" />
          <rect x="26" y="116" width="10" height="12" rx="4" fill="#2A2E36" />
        </>
      );

    // ── Essen & Café: Fika, warmes Innenlicht ──────────────────────────────
    case 'area-food':
      return (
        <>
          <g filter={far} opacity="0.85">
            <rect x="20" y="36" width="118" height="3" fill={C.wood} />
            <rect x="20" y="62" width="118" height="3" fill={C.wood} />
            {Array.from({ length: 7 }, (_, i) => (
              <g key={i}>
                <path d={`M${28 + i * 16} 36 l0 -9 q5 -2.4 10 0 l0 9 Z`} fill="#C9C4B8" />
                <path d={`M${33 + i * 16} 36 l0 -9 q2.5 -1.2 5 0 l0 9 Z`} fill="#000" opacity="0.22" />
              </g>
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <rect key={i} x={30 + i * 22} y="46" width="14" height="16" rx="1.5" fill={C.brass} opacity="0.55" />
            ))}
          </g>
          {[96, 200, 304].map((x) => (
            <g key={x}>
              <line x1={x} y1="0" x2={x} y2="24" stroke="#241811" strokeWidth="1.6" />
              <path d={`M${x - 13} 34 L${x + 13} 34 L${x + 7} 24 L${x - 7} 24 Z`} fill={C.brass} />
              <path d={`M${x - 13} 34 L${x + 13} 34 L${x + 7} 24 L${x} 24 Z`} fill="#000" opacity="0.3" />
              <ellipse cx={x} cy="35" rx="11" ry="3" fill={C.lampCore} />
              <circle cx={x} cy="38" r="18" fill={C.lamp} opacity="0.45" filter={glow} />
              <path d={`M${x - 13} 35 L${x + 13} 35 L${x + 46} 112 L${x - 46} 112 Z`} fill={C.lamp} opacity="0.09" />
            </g>
          ))}
          <Figure x={272} y={106} h={48} coat={5} flip lightFrom="left" />
          <rect y="106" width={W} height="44" fill={C.wood} />
          <rect y="106" width={W} height="4" fill={C.lampCore} opacity="0.45" />
          <rect y="110" width={W} height="40" fill="#000" opacity="0.42" />
          <g>
            <rect x="128" y="82" width="124" height="24" fill="#0E0A07" opacity="0.5" />
            <rect
              x="128"
              y="82"
              width="124"
              height="24"
              fill="#9ED0DA"
              opacity="0.13"
              stroke="#CFE6EC"
              strokeOpacity="0.32"
              strokeWidth="1"
            />
            <rect x="128" y="82" width="124" height="7" fill="#fff" opacity="0.13" />
            {Array.from({ length: 5 }, (_, i) => (
              <g key={i} transform={`translate(${144 + i * 23} 99)`}>
                <ellipse rx="8.4" ry="4.8" fill={C.bun} />
                <ellipse cy="-1.6" rx="8.4" ry="4" fill="#D89A5C" />
                <path d="M-5 -2.4 q5 -2.6 10 0" stroke={C.icing} strokeWidth="1.4" fill="none" opacity="0.85" />
              </g>
            ))}
          </g>
          <Figure x={72} y={126} h={50} coat={2} lightFrom="right" />
          <g transform="translate(96 100)">
            <path d="M-7 0 q0 8 7 8 q7 0 7 -8 Z" fill="#E4E0D6" />
            <path d="M0 0 q7 0 7 8 q-3.5 0 -7 -8 Z" fill="#000" opacity="0.16" />
            <ellipse rx="7" ry="1.8" fill="#3A2A1C" />
          </g>
        </>
      );

    // ── Menschen & Alltag: Mittsommer, goldene Stunde ──────────────────────
    case 'area-people':
      return (
        <>
          <circle cx="300" cy="92" r="17" fill="#FFD79A" opacity="0.9" filter={glow} />
          <circle cx="300" cy="92" r="9" fill="#FFF0CC" />
          <g filter={far} opacity="0.5">
            {[10, 34, 58, 82, 340, 364, 388].map((x, i) => (
              <Spruce key={x} x={x} y={100} h={26 + (i % 3) * 8} dim={0.4} />
            ))}
          </g>
          {[26, 52, 358].map((x, i) => (
            <g key={x}>
              <rect x={x} y={22 + i * 6} width="4.2" height={80 - i * 6} fill={C.trim} />
              <rect x={x + 2.6} y={22 + i * 6} width="1.6" height={80 - i * 6} fill="#000" opacity="0.24" />
              <g fill="#2A2622" opacity="0.7">
                <rect x={x} y={44 + i * 6} width="4.2" height="2" />
                <rect x={x} y={62 + i * 6} width="4.2" height="1.6" />
                <rect x={x} y={80 + i * 6} width="4.2" height="2.2" />
              </g>
              <ellipse cx={x + 2} cy={20 + i * 6} rx="19" ry="13" fill="#2E4426" />
              <ellipse cx={x - 3} cy={17 + i * 6} rx="12" ry="8" fill="#3C5730" opacity="0.8" />
            </g>
          ))}
          <rect y="100" width={W} height="50" fill={C.meadow} />
          <rect y="100" width={W} height="50" fill={`url(#${id}-grass)`} />
          <defs>
            <linearGradient id={`${id}-grass`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8B565" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0E140A" stopOpacity="0.72" />
            </linearGradient>
          </defs>
          <g>
            <rect x="193" y="8" width="6" height="94" fill="#3E3020" />
            <rect x="196.4" y="8" width="2.6" height="94" fill="#000" opacity="0.32" />
            <rect x="158" y="34" width="80" height="4.6" fill="#3E3020" />
            <rect x="158" y="36.6" width="80" height="2" fill="#000" opacity="0.32" />
            <ellipse cx="196" cy="34" rx="13" ry="7.5" fill="#3C5730" />
            <ellipse cx="196" cy="60" rx="9" ry="13" fill="#33502A" />
            <ellipse cx="196" cy="86" rx="7.5" ry="11" fill="#2C4624" />
            <line x1="162" y1="38" x2="162" y2="50" stroke="#3E3020" strokeWidth="1.8" />
            <line x1="234" y1="38" x2="234" y2="50" stroke="#3E3020" strokeWidth="1.8" />
            <circle cx="162" cy="58" r="8" fill="none" stroke="#3C5730" strokeWidth="3.4" />
            <circle cx="234" cy="58" r="8" fill="none" stroke="#3C5730" strokeWidth="3.4" />
            <path d="M158 36 Q178 58 196 42" fill="none" stroke="#3C5730" strokeWidth="3" />
            <path d="M238 36 Q216 58 196 42" fill="none" stroke="#3C5730" strokeWidth="3" />
            <circle cx="196" cy="6" r="4.6" fill="#3C5730" />
          </g>
          <Figure x={120} y={124} h={40} coat={3} lightFrom="right" />
          <Figure x={148} y={128} h={38} coat={0} flip lightFrom="right" />
          <Figure x={252} y={126} h={41} coat={1} lightFrom="left" />
          <Figure x={278} y={121} h={34} coat={2} flip dim={0.3} lightFrom="left" />
          <Figure x={330} y={134} h={46} coat={5} lightFrom="left" />
        </>
      );

    // ── Einkaufen: Laden mit Regal, Kleiderstange, Dalahäst ────────────────
    case 'area-shopping':
      return (
        <>
          <g>
            <rect x="14" y="30" width="116" height="4" fill={C.wood} />
            <rect x="14" y="62" width="116" height="4" fill={C.wood} />
            <rect x="14" y="94" width="116" height="4" fill={C.wood} />
            {['#5E6E7A', '#7A6A52', '#4E6350', '#7A5A50', '#5A5470', '#6A6A52'].map((c, i) => (
              <g key={i}>
                <rect x={22 + i * 18} y="16" width="12" height="14" rx="1.5" fill={c} />
                <rect x={22 + i * 18} y="16" width="4" height="14" fill="#fff" opacity="0.14" />
              </g>
            ))}
            {['#6A5A44', '#4E6350', '#7A5A50'].map((c, i) => (
              <rect key={i} x={26 + i * 34} y="46" width="26" height="16" rx="2" fill={c} />
            ))}
          </g>
          {/* Dalahäst — rot mit blauem Kurbits-Sattel, wie das echte Souvenir. */}
          <g transform="translate(46 94) scale(1.6)">
            <path
              d="M3 0 L3 -6 L2 -9 Q2 -13 6 -14 L13 -14.5 Q13.5 -19 16 -21.5 L21 -23 L22.5 -20.5
                 L20.5 -18.5 Q19.5 -16 19 -13.5 Q22 -12 22 -8 L22 -6 L20 0 L17.5 0 L18.5 -5.5
                 L14 -4.5 L14 0 L11.5 0 L11.5 -4.5 L7 -4.5 L7 0 Z"
              fill="#B33A2E"
            />
            <path d="M8 -13 q4 -2.6 8 -1 l-1 3 q-3.6 -1.2 -7 0.6 Z" fill="#2E6E9E" />
            <path d="M9.6 -11 q3 -1.4 5.4 -0.6" stroke="#E8C25A" strokeWidth="0.9" fill="none" />
            <circle cx="19.4" cy="-20.2" r="0.8" fill="#161616" />
            <path d="M14.6 -21 L16.4 -23.4 L17.4 -21.2 Z" fill="#B33A2E" />
          </g>
          <line x1="228" y1="24" x2="362" y2="24" stroke="#8A8F96" strokeWidth="2.6" />
          {['#4A5A68', '#6A4A46', '#43584A', '#5A5062', '#6E6250', '#3E4A5A', '#66504A'].map((c, i) => (
            <g key={i}>
              <path d={`M${240 + i * 17} 24 l-7 15 q7 28 7 36 q0 2.4 13 0 q0 -8 7 -36 l-7 -15 Z`} fill={c} />
              <path
                d={`M${240 + i * 17} 24 l-7 15 q4 24 4 33 l4 0 q-1 -20 4 -33 l-5 -15 Z`}
                fill="#fff"
                opacity="0.1"
              />
            </g>
          ))}
          <rect y="108" width={W} height="42" fill="#242A32" />
          <rect y="108" width={W} height="3" fill="#fff" opacity="0.09" />
          <rect x="132" y="88" width="104" height="20" fill={C.wood} />
          <rect x="132" y="88" width="104" height="4" fill="#fff" opacity="0.13" />
          <Figure x={196} y={88} h={44} coat={4} flip lightFrom="left" />
          <Figure x={106} y={130} h={50} coat={1} lightFrom="right" />
          <g transform="translate(126 112)">
            <rect width="16" height="16" rx="1.5" fill="#5E4A38" />
            <path d="M3 0 q5 -6 10 0" stroke="#8A7050" strokeWidth="1.6" fill="none" />
          </g>
        </>
      );

    // ── Notfall & Gesundheit: Apotek bei Nacht ─────────────────────────────
    case 'area-emergency':
      return (
        <>
          <g filter={far} opacity="0.7">
            <rect x="0" y="30" width="140" height="74" fill="#1A222E" />
            <rect x="304" y="44" width="96" height="60" fill="#1A222E" />
            <g fill={C.lamp} opacity="0.42">
              <rect x="14" y="44" width="7" height="9" />
              <rect x="34" y="62" width="7" height="9" />
              <rect x="96" y="50" width="7" height="9" />
              <rect x="322" y="58" width="7" height="9" />
              <rect x="356" y="74" width="7" height="9" />
            </g>
          </g>
          <rect x="140" y="18" width="164" height="86" fill="#2A303A" />
          <rect x="140" y="18" width="164" height="5" fill="#3A424E" />
          <rect x="140" y="18" width="10" height="86" fill="#fff" opacity="0.06" />
          <rect x="154" y="60" width="136" height="44" fill="#0A1018" />
          <rect x="154" y="60" width="136" height="44" fill="#9ED0DA" opacity="0.2" />
          <rect x="154" y="60" width="136" height="10" fill="#CFE6EC" opacity="0.15" />
          <g stroke="#0A1018" strokeWidth="2.4">
            <line x1="199" y1="60" x2="199" y2="104" />
            <line x1="245" y1="60" x2="245" y2="104" />
          </g>
          <g transform="translate(222 38)">
            <circle r="23" fill={C.apotek} opacity="0.6" filter={glow} />
            <rect x="-15" y="-5.4" width="30" height="10.8" rx="2" fill="#7BE8B4" />
            <rect x="-5.4" y="-15" width="10.8" height="30" rx="2" fill="#7BE8B4" />
            <rect x="-15" y="-5.4" width="30" height="4" rx="2" fill="#D6FFEC" opacity="0.7" />
          </g>
          <line x1="72" y1="104" x2="72" y2="40" stroke="#151A22" strokeWidth="2.6" />
          <circle cx="72" cy="38" r="12" fill={C.lamp} opacity="0.55" filter={glow} />
          <circle cx="72" cy="38" r="3.4" fill={C.lampCore} />
          {/* Nasser Asphalt mit Spiegelung des Kreuzes */}
          <rect y="104" width={W} height="46" fill="#12161C" />
          <rect y="104" width={W} height="46" fill={`url(#${id}-wet)`} />
          <defs>
            <linearGradient id={`${id}-wet`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9ED0DA" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <ellipse cx="222" cy="112" rx="66" ry="9" fill={C.apotek} opacity="0.18" />
          <rect x="218" y="104" width="8" height="32" fill={C.apotek} opacity="0.14" />
          <ellipse cx="72" cy="110" rx="34" ry="6" fill={C.lamp} opacity="0.15" />
          <Figure x={210} y={132} h={48} coat={0} lightFrom="right" />
          <Figure x={94} y={124} h={38} coat={4} flip dim={0.4} lightFrom="left" />
        </>
      );

    // ── Freunde & Freizeit: offene Garage am Abend ────────────────────────
    case 'area-friends':
      return (
        <>
          <g filter={far} opacity="0.6">
            <rect x="0" y="52" width="72" height="52" fill="#1E2530" />
            <rect x="330" y="46" width="70" height="58" fill="#1E2530" />
            <g fill={C.lamp} opacity="0.4">
              <rect x="14" y="64" width="7" height="9" />
              <rect x="348" y="60" width="7" height="9" />
            </g>
          </g>
          {/* Garagenwand mit offenem Tor — das warme Licht fällt heraus */}
          <rect x="72" y="20" width="258" height="84" fill="#333A44" />
          <rect x="72" y="20" width="258" height="5" fill="#454E5A" />
          <rect x="96" y="34" width="210" height="70" fill="#1A1610" />
          <rect x="96" y="34" width="210" height="70" fill={C.lamp} opacity="0.22" />
          <rect x="96" y="34" width="210" height="8" fill={C.lampCore} opacity="0.3" />
          {/* Werkstattlampe an der Decke */}
          <line x1="200" y1="34" x2="200" y2="44" stroke="#2A2419" strokeWidth="1.4" />
          <ellipse cx="200" cy="46" rx="12" ry="3.4" fill={C.lampCore} />
          <circle cx="200" cy="48" r="17" fill={C.lamp} opacity="0.5" filter={glow} />
          {/* Werkbank mit Werkzeugtafel */}
          <rect x="106" y="76" width="72" height="6" fill={C.wood} />
          <rect x="112" y="46" width="60" height="26" fill="#2A2A2E" />
          <g stroke="#8A8F96" strokeWidth="1.6">
            <line x1="120" y1="50" x2="120" y2="62" />
            <line x1="130" y1="50" x2="134" y2="62" />
            <line x1="144" y1="50" x2="144" y2="60" />
            <line x1="156" y1="52" x2="162" y2="62" />
          </g>
          {/* Das Auto: Karosserie mit Licht- und Schattenseite, offene Haube */}
          <g>
            <path d="M212 92 L228 72 L282 72 L300 92 Z" fill="#5E6E7E" />
            <path d="M232 76 L278 76 L292 90 L220 90 Z" fill="#0F1620" />
            <path d="M232 76 L256 76 L256 90 L220 90 Z" fill="#9EB4C6" opacity="0.35" />
            <rect x="204" y="90" width="104" height="16" rx="3" fill="#7A2E28" />
            <rect x="204" y="90" width="104" height="5" rx="2" fill="#fff" opacity="0.15" />
            <rect x="204" y="99" width="104" height="7" fill="#000" opacity="0.3" />
            {/* offene Motorhaube */}
            <path d="M204 90 L188 62 L196 60 L212 88 Z" fill="#8A3A32" />
            <circle cx="222" cy="108" r="8" fill="#141418" />
            <circle cx="222" cy="108" r="3.2" fill="#4A4E56" />
            <circle cx="292" cy="108" r="8" fill="#141418" />
            <circle cx="292" cy="108" r="3.2" fill="#4A4E56" />
          </g>
          {/* Boden: Beton mit Lichtpfütze aus dem Tor */}
          <rect y="104" width={W} height="46" fill="#22242A" />
          <path d="M96 104 L306 104 L344 150 L58 150 Z" fill={C.lamp} opacity="0.1" />
          <g stroke="#000" strokeOpacity="0.28" strokeWidth="0.8">
            <path d="M0 118 H400 M0 132 H400" />
          </g>
          {/* Zwei Kumpels: einer arbeitet am Motor, einer kommt dazu */}
          <Figure x={196} y={128} h={46} coat={2} lightFrom="right" />
          <Figure x={330} y={134} h={48} coat={0} flip lightFrom="left" />
        </>
      );

    // ── Sport & Draußen: Angler am See im Morgennebel ─────────────────────
    case 'area-outdoors':
      return (
        <>
          {/* Sonne knapp über dem gegenüberliegenden Ufer */}
          <circle cx="286" cy="86" r="15" fill="#FFE9B4" opacity="0.9" filter={glow} />
          <circle cx="286" cy="86" r="7" fill="#FFF6DC" />
          {/* Fernes Ufer mit Nadelwald, weichgezeichnet (Nebel) */}
          <g filter={far} opacity="0.55">
            {[8, 30, 52, 74, 96, 118, 322, 344, 366, 388].map((x, i) => (
              <Spruce key={x} x={x} y={94} h={22 + (i % 4) * 9} dim={0.4} />
            ))}
            <rect y="90" width={W} height="6" fill="#2A3E36" />
          </g>
          {/* Rotes Bootshaus am Ufer — das schwedische Sommerbild */}
          <g>
            <path d="M340 90 L360 76 L380 90 Z" fill="#2A2A30" />
            <rect x="344" y="90" width="32" height="20" fill={C.falu} />
            <rect x="366" y="90" width="10" height="20" fill="#000" opacity="0.28" />
            <rect x="352" y="96" width="9" height="10" fill="#141820" />
          </g>
          {/* See mit Sonnenstraße und Spiegelungen */}
          <rect y="94" width={W} height="56" fill="#20404C" />
          <rect y="94" width={W} height="56" fill={`url(#${id}-lake)`} />
          <defs>
            <linearGradient id={`${id}-lake`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9C08A" stopOpacity="0.4" />
              <stop offset="42%" stopColor="#2C4A54" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#0A171E" stopOpacity="0.72" />
            </linearGradient>
          </defs>
          <g fill="#FFE9B4" opacity="0.3">
            <rect x="262" y="100" width="48" height="1.4" rx="0.7" />
            <rect x="250" y="108" width="72" height="1.4" rx="0.7" />
            <rect x="268" y="117" width="52" height="1.4" rx="0.7" />
            <rect x="244" y="127" width="88" height="1.4" rx="0.7" />
          </g>
          {/* Steg, der ins Bild läuft */}
          <path d="M0 126 L138 118 L138 128 L0 140 Z" fill="#4A3524" />
          <path d="M0 126 L138 118 L138 121 L0 129 Z" fill="#7A5A38" opacity="0.7" />
          <g fill="#2C1F14">
            <rect x="36" y="128" width="5" height="22" />
            <rect x="104" y="124" width="5" height="26" />
          </g>
          {/* Angler auf dem Steg mit gespannter Rute */}
          <Figure x={86} y={122} h={44} coat={2} lightFrom="right" />
          <path d="M96 100 Q150 88 212 104" stroke="#D8D4C8" strokeWidth="1.4" fill="none" opacity="0.8" />
          <line x1="212" y1="104" x2="214" y2="118" stroke="#D8D4C8" strokeWidth="0.8" opacity="0.6" />
          {/* Ringe im Wasser dort, wo die Schnur eintaucht */}
          <ellipse cx="214" cy="119" rx="11" ry="2.6" fill="none" stroke="#FFE9B4" strokeOpacity="0.4" strokeWidth="1" />
          <ellipse cx="214" cy="119" rx="20" ry="4.4" fill="none" stroke="#FFE9B4" strokeOpacity="0.22" strokeWidth="1" />
          {/* Eimer neben ihm */}
          <path d="M108 112 L122 112 L120 124 L110 124 Z" fill="#3A4A54" />
        </>
      );

    default:
      return (
        <>
          <rect y="104" width={W} height="46" fill="#1A1E26" />
          <ellipse cx="200" cy="110" rx="90" ry="9" fill={hue} opacity="0.2" />
          <Figure x={200} y={132} h={46} coat={0} />
        </>
      );
  }
}
