// Bereichsbilder für die Bildkarten der Ebene 1 (docs/gremium-navigation.md §4).
//
// WAS DIESE BILDER ANDERS MACHEN als die Icons: Ein Icon sagt „Kategorie", ein
// Bild sagt „Ort". Übernommen aus `SceneArt.tsx` (dritte Fassung, angenommen):
// Tiefe in vier Ebenen mit Luftperspektive, Licht mit Kegeln und Pfützen,
// Menschen-Silhouetten und Dichte statt eines freistehenden Objekts.
//
// SCHWEDISCH, NICHT SCHWEDEN-KITSCH (Nutzerwunsch 2026-07-25, „ein bisschen
// authentischer"): jedes Bild trägt echte Motive — Falunrot mit weißen
// Fenstergewänden, Gamla-Stan-Giebel, Schärengarten-Fähre, Kanelbullar auf dem
// Tresen, Midsommarstång, Dalahäst im Regal, das Apotheken-Kreuz. Dazu liegt in
// JEDEM Bild das schwedische Kreuz als sehr blasses Wasserzeichen im Himmel —
// wiederkehrende Signatur statt aufgeklebter Fahne.
//
// Reines SVG: offline-sicher, gestochen scharf, wenige kByte, keine Ladezeit.
// Nie Inhalt, immer Atmosphäre (die eine Design-Regel).

const NIGHT = '#05080E'; // Vordergrund-Silhouetten
const MIDDARK = '#0A111C'; // Mittelgrund
const FAR = '#111C2A'; // Ferne
const FALU = '#7A2E26'; // Falu rödfärg — die schwedische Hausfarbe
const TRIM = '#E8E2D6'; // gebrochenes Weiß der Fenstergewände
const FLAG_BLUE = '#006AA7';
const FLAG_YELLOW = '#FECC00';

const W = 400;
const H = 150;

/** Stehende Person — der größte Sprung von Kulisse zu Ort. */
function Person({ x, y, s = 1, fill = NIGHT }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <circle cx="0" cy="-26" r="7.5" />
      <path d="M-8 -18 Q0 -21 8 -18 L10 6 Q0 9 -10 6 Z" />
    </g>
  );
}

/** Zwei Personen zugewandt — „hier spricht gerade jemand mit dir". */
function Pair({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Person x={-13} y={0} s={0.95} />
      <Person x={13} y={2} s={0.88} fill={MIDDARK} />
    </g>
  );
}

/** Fassade in Falunrot mit hellen Fenstern — das Bild von „Schweden". */
function FaluHouse({
  x,
  y,
  w,
  h,
  hue,
  gable,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  hue: string;
  gable?: boolean;
}) {
  const cols = Math.max(2, Math.round(w / 22));
  return (
    <g transform={`translate(${x} ${y})`}>
      {gable && <path d={`M0 0 L${w / 2} ${-h * 0.32} L${w} 0 Z`} fill={FALU} opacity="0.5" />}
      <rect width={w} height={h} fill={FALU} opacity="0.42" />
      {Array.from({ length: cols }, (_, i) => {
        const px = 6 + i * ((w - 12) / cols);
        return (
          <g key={i}>
            <rect x={px} y={h * 0.22} width="9" height="12" fill={hue} opacity="0.5" />
            <rect
              x={px - 1.2}
              y={h * 0.22 - 1.2}
              width="11.4"
              height="14.4"
              fill="none"
              stroke={TRIM}
              strokeWidth="1"
              opacity="0.3"
            />
          </g>
        );
      })}
    </g>
  );
}

/** Nadelbaum-Silhouette (Schärengarten, Mittsommerwiese). */
function Spruce({ x, y, h, fill = NIGHT }: { x: number; y: number; h: number; fill?: string }) {
  const w = h * 0.42;
  return (
    <path
      d={`M${x} ${y - h} L${x + w / 2} ${y - h * 0.42} L${x + w * 0.3} ${y - h * 0.42}
          L${x + w * 0.62} ${y} L${x - w * 0.62} ${y} L${x - w * 0.3} ${y - h * 0.42}
          L${x - w / 2} ${y - h * 0.42} Z`}
      fill={fill}
    />
  );
}

interface Props {
  areaId: string;
  hue: string;
}

export function AreaArt({ areaId, hue }: Props) {
  const id = `aa-${areaId}`;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        {/* Himmel/Raumlicht im Bereichston. */}
        <linearGradient id={`${id}-air`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={hue} stopOpacity="0.30" />
          <stop offset="55%" stopColor={hue} stopOpacity="0.09" />
          <stop offset="100%" stopColor={hue} stopOpacity="0.02" />
        </linearGradient>
        {/* Lichtkegel / leuchtende Fläche. */}
        {/* Boden: vorn fast schwarz, zum Horizont hin aufgehellt — Tiefe. */}
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={hue} stopOpacity="0.12" />
          <stop offset="35%" stopColor="#05080E" stopOpacity="1" />
          <stop offset="100%" stopColor="#05080E" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={hue} stopOpacity="0.32" />
          <stop offset="100%" stopColor={hue} stopOpacity="0" />
        </linearGradient>
        {/* Unterkante weich auslaufen lassen, damit die Karte nicht abschneidet. */}
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="72%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.15" />
        </linearGradient>
        <mask id={`${id}-mask`}>
          <rect width={W} height={H} fill={`url(#${id}-fade)`} />
        </mask>
        {/* Die Kreuzbalken laufen an beiden Enden aus — dritte Fassung. Harte
            Rechteckkanten lasen sich als aufgelegte Grafik, nicht als Struktur. */}
        <linearGradient id="cross-h" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={FLAG_YELLOW} stopOpacity="0" />
          <stop offset="45%" stopColor={FLAG_YELLOW} stopOpacity="0.055" />
          <stop offset="100%" stopColor={FLAG_YELLOW} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cross-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={FLAG_YELLOW} stopOpacity="0" />
          <stop offset="35%" stopColor={FLAG_YELLOW} stopOpacity="0.055" />
          <stop offset="100%" stopColor={FLAG_YELLOW} stopOpacity="0" />
        </linearGradient>
      </defs>

      <g mask={`url(#${id}-mask)`}>
        <rect width={W} height={H} fill={`url(#${id}-air)`} />
        <NordicMark />
        <Scene areaId={areaId} hue={hue} id={id} />
      </g>
      {/* Ganz leichter Bodenschatten, damit die Karte unten sauber schließt. */}
      <rect y={H - 10} width={W} height="10" fill="#080B12" opacity="0.55" />
    </svg>
  );
}

/**
 * Das schwedische Kreuz als Wasserzeichen — die wiederkehrende Signatur.
 * Flaggen-Geometrie (Querbalken mittig, Längsbalken zur Stange versetzt), aber
 * so blass, dass sie nur als Struktur im Himmel wahrgenommen wird. Eine echte
 * Fahne in jeder Karte wäre Kitsch; hier ist sie Herkunft.
 */
function NordicMark() {
  // Zwei Fassungen verworfen: erst ein grelles Kreuz, dann ein blasses — aber
  // mit dem BEGRENZTEN Flaggenfeld, dessen Kanten mitten im Bild sichtbar blieben.
  // Jetzt nur die beiden Balken, über den Rand hinaus: keine Kante außer dem
  // Kreuz selbst. Man sieht es nicht, man spürt die Herkunft.
  return (
    <g opacity="0.5">
      <rect x="0" y="24" width={W} height="13" fill="url(#cross-h)" />
      <rect x="284" y="0" width="13" height="104" fill="url(#cross-v)" />
    </g>
  );
}

function Scene({ areaId, hue, id }: { areaId: string; hue: string; id: string }) {
  const beam = `url(#${id}-beam)`;

  switch (areaId) {
    // ── Erste Schritte: Gassen-Morgen in der Altstadt, zwei Leute grüßen sich ──
    case 'area-basics':
      return (
        <>
          {/* Ferne: Kirchturm über den Giebeln */}
          <path d={`M40 118 L40 44 L48 26 L56 44 L56 118 Z`} fill={FAR} />
          <rect x="45" y="52" width="6" height="8" fill={hue} opacity="0.45" />
          {/* Mittelgrund: Giebelhäuser der Altstadt */}
          <FaluHouse x={62} y={52} w={78} h={66} hue={hue} gable />
          <g opacity="0.9">
            <FaluHouse x={148} y={60} w={64} h={58} hue={hue} gable />
          </g>
          <rect x="220" y="58" width="70" height="60" fill={MIDDARK} />
          <rect x="230" y="68" width="10" height="13" fill={hue} opacity="0.4" />
          <rect x="250" y="68" width="10" height="13" fill={hue} opacity="0.4" />
          <rect x="270" y="68" width="10" height="13" fill={hue} opacity="0.4" />
          {/* Fahnenmast — hier darf die Fahne einmal wirklich hängen, klein */}
          <line x1="330" y1="118" x2="330" y2="34" stroke={MIDDARK} strokeWidth="2" />
          <g opacity="0.3">
            <rect x="332" y="36" width="24" height="15" fill={FLAG_BLUE} />
            <rect x="332" y="42" width="24" height="3.6" fill={FLAG_YELLOW} />
            <rect x="339" y="36" width="3.6" height="15" fill={FLAG_YELLOW} />
          </g>
          {/* Vordergrund: Kopfsteinpflaster + Lichtpfütze + Begegnung */}
          <rect y="100" width={W} height={50} fill={NIGHT} />
          <ellipse cx="180" cy="122" rx="110" ry="11" fill={hue} opacity="0.2" />
          {/* Kopfsteinpflaster-Andeutung: Fugen fangen das Laternenlicht. */}
          <g stroke={hue} strokeOpacity="0.13" strokeWidth="1">
            <path d="M0 126 H400 M0 134 H400 M0 143 H400" />
          </g>
          <Pair x={186} y={128} s={1.15} />
          <Person x={310} y={126} s={0.8} fill={MIDDARK} />
        </>
      );

    // ── Reisen: Schärengarten-Fähre am Kai, Stockholmer Silhouette ──
    case 'area-travel':
      return (
        <>
          {/* Ferne: Stadtsilhouette mit Türmen */}
          <rect x="10" y="62" width="46" height="38" fill={FAR} />
          <path d="M64 62 L72 40 L80 62 Z" fill={FAR} />
          <rect x="66" y="62" width="12" height="38" fill={FAR} />
          <rect x="88" y="70" width="38" height="30" fill={FAR} />
          <rect x="134" y="56" width="16" height="44" fill={FAR} />
          <path d="M134 56 L142 42 L150 56 Z" fill={FAR} />
          {/* Nadelbäume auf der Schäre */}
          <Spruce x={352} y={100} h={34} fill={FAR} />
          <Spruce x={370} y={100} h={26} fill={FAR} />
          {/* Wasser mit Spiegelung */}
          <rect y="100" width={W} height={20} fill={MIDDARK} />
          <g opacity="0.32" fill={hue}>
            <rect x="30" y="105" width="46" height="1.6" />
            <rect x="120" y="110" width="70" height="1.6" />
            <rect x="240" y="107" width="54" height="1.6" />
            <rect x="300" y="114" width="40" height="1.6" />
          </g>
          {/* Fähre: Rumpf, Aufbau, beleuchtete Fensterreihe */}
          <path d="M196 100 L318 100 L308 114 L206 114 Z" fill={NIGHT} />
          <rect x="216" y="80" width="82" height="20" fill={NIGHT} />
          <rect x="252" y="66" width="16" height="14" fill={NIGHT} />
          <g fill={hue} opacity="0.55">
            {Array.from({ length: 7 }, (_, i) => (
              <rect key={i} x={224 + i * 11} y="86" width="7" height="7" />
            ))}
          </g>
          <path d="M258 66 L258 46" stroke={MIDDARK} strokeWidth="1.6" />
          {/* Kai im Vordergrund: Reisender mit Koffer, Poller */}
          <rect y="126" width={W} height="24" fill={`url(#${id}-floor)`} />
          <ellipse cx="110" cy="128" rx="70" ry="7" fill={hue} opacity="0.14" />
          <Person x={98} y={128} s={1.1} />
          <rect x="112" y="116" width="13" height="12" rx="1.5" fill={NIGHT} />
          <rect x="40" y="118" width="9" height="10" rx="3" fill={MIDDARK} />
        </>
      );

    // ── Essen & Café: Fika — Tresen mit Kanelbullar, Pendelleuchten ──
    case 'area-food':
      return (
        <>
          {/* Rückwand mit Regal und Tassen */}
          <rect y="0" width={W} height={150} fill={MIDDARK} opacity="0.5" />
          <rect x="24" y="34" width="120" height="2.5" fill={NIGHT} />
          <g fill={NIGHT}>
            {Array.from({ length: 7 }, (_, i) => (
              <path key={i} d={`M${32 + i * 16} 34 l0 -9 q5 -2 9 0 l0 9 Z`} />
            ))}
          </g>
          {/* Pendelleuchten mit Kegeln */}
          {[110, 200, 290].map((x) => (
            <g key={x}>
              <line x1={x} y1="0" x2={x} y2="26" stroke={NIGHT} strokeWidth="1.4" />
              <path d={`M${x - 11} 34 L${x + 11} 34 L${x + 6} 26 L${x - 6} 26 Z`} fill={NIGHT} />
              <path d={`M${x - 11} 34 L${x + 11} 34 L${x + 40} 104 L${x - 40} 104 Z`} fill={beam} />
            </g>
          ))}
          {/* Barista hinter dem Tresen */}
          <Person x={252} y={110} s={1.15} fill={MIDDARK} />
          {/* Tresen mit Glasvitrine und Kanelbullar */}
          <rect y="112" width={W} height="38" fill={`url(#${id}-floor)`} />
          <rect x="150" y="76" width="112" height="20" fill={NIGHT} opacity="0.85" />
          <rect
            x="150"
            y="76"
            width="112"
            height="20"
            fill={hue}
            opacity="0.16"
            stroke={hue}
            strokeOpacity="0.3"
            strokeWidth="1"
          />
          <g fill={hue} opacity="0.6">
            {Array.from({ length: 5 }, (_, i) => (
              <g key={i} transform={`translate(${164 + i * 21} 89)`}>
                <ellipse rx="7" ry="4.4" />
                <ellipse rx="3" ry="1.8" fill={NIGHT} opacity="0.5" />
              </g>
            ))}
          </g>
          {/* Gast am Tresen mit Tasse */}
          <Person x={86} y={126} s={1.25} />
          <path d="M100 96 q0 -7 7 -7 q7 0 7 7 Z" fill={hue} opacity="0.5" />
          <ellipse cx="107" cy="96" rx="9" ry="2" fill={hue} opacity="0.22" />
        </>
      );

    // ── Menschen & Alltag: Midsommarstång auf der Wiese, Birken ──
    case 'area-people':
      return (
        <>
          {/* Mittsommer-Abendhimmel: die Sonne steht tief HINTER dem Baum, damit
              seine Silhouette überhaupt lesbar wird. */}
          <ellipse cx="196" cy="118" rx="150" ry="76" fill={hue} opacity="0.26" />
          <ellipse cx="196" cy="118" rx="96" ry="52" fill={hue} opacity="0.22" />
          <circle cx="196" cy="96" r="26" fill={hue} opacity="0.22" />
          {/* Birken (heller Stamm — sehr nordisch) */}
          {[24, 46, 366].map((x, i) => (
            <g key={x}>
              <rect x={x} y={30 + i * 5} width="3.6" height={88 - i * 5} fill={TRIM} opacity="0.3" />
              <ellipse cx={x + 1.8} cy={28 + i * 5} rx="17" ry="12" fill={NIGHT} opacity="0.85" />
            </g>
          ))}
          <Spruce x={80} y={118} h={34} fill={FAR} />
          {/* Der Mittsommerbaum: Mast, Querbalken, zwei Kränze */}
          <line x1="196" y1="118" x2="196" y2="10" stroke={NIGHT} strokeWidth="5" />
          <line x1="162" y1="40" x2="230" y2="40" stroke={NIGHT} strokeWidth="3.4" />
          {/* Kränze hängen an kurzen Schnüren UNTER den Balkenenden — sonst
              liest sich das Ganze als Waage statt als Midsommarstång. */}
          <line x1="160" y1="34" x2="160" y2="44" stroke={NIGHT} strokeWidth="2" />
          <line x1="232" y1="34" x2="232" y2="44" stroke={NIGHT} strokeWidth="2" />
          <circle cx="160" cy="57" r="13" fill="none" stroke={NIGHT} strokeWidth="3.6" />
          <circle cx="232" cy="57" r="13" fill="none" stroke={NIGHT} strokeWidth="3.6" />
          <circle cx="196" cy="16" r="4.5" fill={NIGHT} />
          {/* Laubkranz um den Mast — der Baum ist grün geschmückt. */}
          <ellipse cx="196" cy="34" rx="13" ry="7" fill={NIGHT} />
          {/* Wiese + Leute drumherum */}
          <rect y="118" width={W} height="32" fill={`url(#${id}-floor)`} />
          <ellipse cx="196" cy="120" rx="120" ry="10" fill={hue} opacity="0.15" />
          <Person x={132} y={126} s={1.05} />
          <Person x={158} y={130} s={0.9} fill={MIDDARK} />
          <Person x={244} y={128} s={1.0} />
          <Person x={272} y={124} s={0.85} fill={MIDDARK} />
        </>
      );

    // ── Einkaufen: Laden mit Regalen, Kleiderstange und Dalahäst ──
    case 'area-shopping':
      return (
        <>
          <rect width={W} height={150} fill={MIDDARK} opacity="0.45" />
          {/* Regalwand links */}
          <g fill={NIGHT}>
            <rect x="18" y="30" width="104" height="3" />
            <rect x="18" y="58" width="104" height="3" />
            <rect x="18" y="86" width="104" height="3" />
          </g>
          <g fill={hue} opacity="0.34">
            {Array.from({ length: 6 }, (_, i) => (
              <rect key={i} x={26 + i * 16} y="18" width="10" height="12" rx="1.5" />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <rect key={`b${i}`} x={26 + i * 16} y="46" width="10" height="12" rx="1.5" />
            ))}
          </g>
          {/* Dalahäst auf dem mittleren Brett — der schwedische Augenzwinkerer */}
          <g transform="translate(56 88) scale(1.25)" fill={hue} opacity="0.85">
            {/* Dalahäst: gedrungener Rumpf, steil aufgerichteter Hals, kleiner
                Kopf mit Schnauze, vier gerade Beine. Das schwedischste Souvenir. */}
            <path d="M3 0 L3 -6 L2 -9 Q2 -13 6 -14 L13 -14.5
                     Q13.5 -19 16 -21.5 L21 -23 L22.5 -20.5 L20.5 -18.5
                     Q19.5 -16 19 -13.5 Q22 -12 22 -8 L22 -6 L20 0 L17.5 0
                     L18.5 -5.5 L14 -4.5 L14 0 L11.5 0 L11.5 -4.5 L7 -4.5 L7 0 Z" />
          </g>
          {/* Kleiderstange rechts */}
          <line x1="238" y1="26" x2="352" y2="26" stroke={NIGHT} strokeWidth="2.4" />
          <g fill={NIGHT}>
            {Array.from({ length: 7 }, (_, i) => (
              <path key={i} d={`M${248 + i * 15} 26 l-6 14 q6 26 6 34 q0 2 12 0 q0 -8 6 -34 l-6 -14 Z`} />
            ))}
          </g>
          {/* Tresen, Verkäuferin, Kundin */}
          <rect y="118" width={W} height="32" fill={`url(#${id}-floor)`} />
          <rect x="140" y="84" width="96" height="18" fill={NIGHT} />
          <ellipse cx="188" cy="86" rx="52" ry="6" fill={hue} opacity="0.18" />
          <Person x={196} y={84} s={1.05} fill={MIDDARK} />
          <Person x={116} y={130} s={1.2} />
          {/* Einkaufstasche */}
          <rect x="130" y="118" width="14" height="14" rx="1.5" fill={NIGHT} />
          <path d="M133 118 q4 -5 8 0" stroke={hue} strokeOpacity="0.5" strokeWidth="1.4" fill="none" />
        </>
      );

    // ── Notfall & Gesundheit: Apotheke bei Nacht, beleuchtetes Kreuz ──
    case 'area-emergency':
      return (
        <>
          {/* Straßenzug */}
          <rect x="0" y="40" width="150" height="78" fill={FAR} />
          <rect x="300" y="52" width="100" height="66" fill={FAR} />
          {/* Apothekenfassade mit Schaufenster */}
          <rect x="150" y="26" width="150" height="92" fill={MIDDARK} />
          <g fill={hue} opacity="0.3">
            {Array.from({ length: 4 }, (_, i) => (
              <rect key={i} x={162 + i * 34} y="60" width="14" height="16" rx="1" />
            ))}
          </g>
          <rect
            x="164"
            y="52"
            width="122"
            height="50"
            fill={hue}
            opacity="0.22"
            stroke={hue}
            strokeOpacity="0.34"
            strokeWidth="1.2"
          />
          <path d="M164 118 L286 118 L318 150 L132 150 Z" fill={`url(#${id}-beam)`} opacity="0.55" />
          {/* Das Kreuz — hier grün, weil es überall auf der Welt grün ist */}
          <g transform="translate(225 38)">
            <rect x="-14" y="-5" width="28" height="10" rx="2" fill="#5FD0A0" opacity="0.75" />
            <rect x="-5" y="-14" width="10" height="28" rx="2" fill="#5FD0A0" opacity="0.75" />
            <circle r="26" fill="#5FD0A0" opacity="0.12" />
          </g>
          {/* Straßenlaterne */}
          <line x1="72" y1="118" x2="72" y2="46" stroke={NIGHT} strokeWidth="2" />
          <path d="M62 46 L82 46 L96 118 L48 118 Z" fill={`url(#${id}-beam)`} opacity="0.4" />
          {/* Vordergrund: jemand auf dem Weg zur Tür */}
          <rect y="118" width={W} height="32" fill={`url(#${id}-floor)`} />
          <Person x={214} y={130} s={1.2} />
          <Person x={92} y={126} s={0.85} fill={MIDDARK} />
        </>
      );

    default:
      return (
        <>
          <rect y="118" width={W} height="32" fill={`url(#${id}-floor)`} />
          <ellipse cx="200" cy="120" rx="110" ry="9" fill={hue} opacity="0.15" />
          <Person x={200} y={128} s={1.1} />
        </>
      );
  }
}
