// Eigene, feine Linien-Icons (docs/gremium-design-weltklasse.md): ersetzen die
// Emoji, damit alles aus einem Guss ist. currentColor → erben die Textfarbe.

interface P {
  className?: string;
}

const box = (className = 'h-4 w-4') => ({
  className,
  viewBox: '0 0 24 24',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true as const,
});

/** Einstellungen — Schieberegler (moderner als ein Zahnrad). */
export function IconSettings({ className }: P) {
  return (
    <svg {...box(className ?? 'h-5 w-5')} fill="none">
      <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <line x1="4" y1="8.5" x2="20" y2="8.5" />
        <line x1="4" y1="15.5" x2="20" y2="15.5" />
      </g>
      <circle cx="9" cy="8.5" r="2.6" fill="currentColor" />
      <circle cx="15" cy="15.5" r="2.6" fill="currentColor" />
    </svg>
  );
}

/** Abspielen / Hören. */
export function IconPlay({ className }: P) {
  return (
    <svg {...box(className)} fill="currentColor">
      <path d="M8 5.2 L18.5 12 L8 18.8 Z" />
    </svg>
  );
}

/** Langsam — Schildkröte (die vertraute „langsam"-Metapher, fein gezeichnet). */
export function IconSlow({ className }: P) {
  return (
    <svg {...box(className)} fill="currentColor">
      <path d="M4 14.5 C4 10.9 7 8.5 11 8.5 C15 8.5 17.5 10.9 17.5 14 L4 14 Z" />
      <circle cx="19.5" cy="12" r="2" />
      <rect x="6" y="14.5" width="1.8" height="3.2" rx="0.9" />
      <rect x="13.5" y="14.5" width="1.8" height="3.2" rx="0.9" />
    </svg>
  );
}

/** Aussprache — Klang-/Sprachwelle. */
export function IconWave({ className }: P) {
  return (
    <svg {...box(className)} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <line x1="4" y1="10" x2="4" y2="14" />
      <line x1="8" y1="7" x2="8" y2="17" />
      <line x1="12" y1="4.5" x2="12" y2="19.5" />
      <line x1="16" y1="8" x2="16" y2="16" />
      <line x1="20" y1="10.5" x2="20" y2="13.5" />
    </svg>
  );
}

/** Zurück (Chevron links). */
export function IconBack({ className }: P) {
  return (
    <svg {...box(className)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5 L8 12 L15 19" />
    </svg>
  );
}

/** Aufklappen / hinein (Chevron rechts). */
export function IconChevron({ className }: P) {
  return (
    <svg {...box(className)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5 L16 12 L9 19" />
    </svg>
  );
}

// ── Bereichs-Icons (Wayfinding v2): Icon + Farbe je Bereich, unverwechselbar. ──

/** Erste Schritte — Spross (Anfang, Wachstum). */
export function IconSprout({ className }: P) {
  return (
    <svg {...box(className)} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21v-8" />
      <path d="M12 13c0-3.3 2.2-5.5 5.5-5.5C17.5 10.8 15.3 13 12 13Z" />
      <path d="M12 15.5c0-2.6-2.1-4.5-5-4.5 0 2.6 2.1 4.5 5 4.5Z" />
    </svg>
  );
}

/** Reisen & Unterwegs — Papierflieger. */
export function IconPlane({ className }: P) {
  return (
    <svg {...box(className)} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13.5 20 6l-6.5 15-2.3-6.2L3 13.5Z" />
    </svg>
  );
}

/** Essen & Café — Tasse. */
export function IconCup({ className }: P) {
  return (
    <svg {...box(className)} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9h11v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Z" />
      <path d="M16 10h2.2a2 2 0 1 1 0 4H16" />
    </svg>
  );
}

/** Menschen & Alltag — zwei Personen. */
export function IconPeople({ className }: P) {
  return (
    <svg {...box(className)} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="2.6" />
      <circle cx="16" cy="10" r="2.1" />
      <path d="M4.5 18c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" />
      <path d="M14.5 18c0-1.8 1.3-3 3-3 1.4 0 2.5.9 2.9 2.2" />
    </svg>
  );
}

/** Einkaufen — Tasche. */
export function IconBag({ className }: P) {
  return (
    <svg {...box(className)} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8h12l-1.2 11.5H7.2L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  );
}

/** Notfall & Gesundheit — Kreuz. */
export function IconCross({ className }: P) {
  return (
    <svg {...box(className)} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="14" rx="3" />
      <path d="M12 9v6M9 12h6" />
    </svg>
  );
}

/** Üben — Ziel/Abruf (Modus-Abzeichen gegenüber „Gespräch"). */
export function IconTarget({ className }: P) {
  return (
    <svg {...box(className)} fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Gespräch — Sprechblase (Dialog-Modus). */
export function IconChat({ className }: P) {
  return (
    <svg {...box(className)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H9l-4 3.5V16H5a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 5 5.5Z" />
    </svg>
  );
}

/** KI — Funkeln (die zeitgemäße, edle „AI"-Signatur statt Roboter). */
export function IconSparkle({ className }: P) {
  return (
    <svg {...box(className)} fill="currentColor">
      <path d="M12 2.5 L13.7 8.3 L19.5 10 L13.7 11.7 L12 17.5 L10.3 11.7 L4.5 10 L10.3 8.3 Z" />
      <path d="M18.5 3 L19.2 5.3 L21.5 6 L19.2 6.7 L18.5 9 L17.8 6.7 L15.5 6 L17.8 5.3 Z" opacity="0.7" />
    </svg>
  );
}

/** Heute — Sonne über dem Horizont (der Tages-Verteiler, docs/gremium-navigation.md). */
export function IconToday({ className }: P) {
  return (
    <svg {...box(className)} fill="none">
      <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <circle cx="12" cy="12.5" r="4.2" />
        <line x1="12" y1="3.5" x2="12" y2="5.5" />
        <line x1="12" y1="19.5" x2="12" y2="21.5" />
        <line x1="3.5" y1="12.5" x2="5.5" y2="12.5" />
        <line x1="18.5" y1="12.5" x2="20.5" y2="12.5" />
        <line x1="6" y1="6.5" x2="7.4" y2="7.9" />
        <line x1="16.6" y1="17.1" x2="18" y2="18.5" />
        <line x1="18" y1="6.5" x2="16.6" y2="7.9" />
        <line x1="7.4" y1="17.1" x2="6" y2="18.5" />
      </g>
    </svg>
  );
}

/** Fortschritt — steigende Säulen (gemessenes Können, keine Trophäe). */
export function IconChart({ className }: P) {
  return (
    <svg {...box(className)} fill="none">
      <g stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
        <line x1="5.5" y1="19" x2="5.5" y2="14.5" />
        <line x1="12" y1="19" x2="12" y2="10" />
        <line x1="18.5" y1="19" x2="18.5" y2="5.5" />
      </g>
    </svg>
  );
}
