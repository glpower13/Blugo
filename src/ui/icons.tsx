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

/** KI — Funkeln (die zeitgemäße, edle „AI"-Signatur statt Roboter). */
export function IconSparkle({ className }: P) {
  return (
    <svg {...box(className)} fill="currentColor">
      <path d="M12 2.5 L13.7 8.3 L19.5 10 L13.7 11.7 L12 17.5 L10.3 11.7 L4.5 10 L10.3 8.3 Z" />
      <path d="M18.5 3 L19.2 5.3 L21.5 6 L19.2 6.7 L18.5 9 L17.8 6.7 L15.5 6 L17.8 5.3 Z" opacity="0.7" />
    </svg>
  );
}
