// Wayfinding v2 (docs/gremium-dialog.md, Nutzerwunsch 2026-07-24): jeder Bereich
// bekommt ein ICON + eine gedämpfte Kennfarbe. Reine PRÄSENTATION (kein Domänen-
// Modell) — so bleibt der Content sauber. Die Farbe orientiert, sie belohnt nichts
// (die eine Design-Regel): Gold bleibt für Aktionen reserviert.

import type { ComponentType } from 'react';
import {
  IconSprout,
  IconPlane,
  IconCup,
  IconPeople,
  IconBag,
  IconCross,
  IconWheel,
  IconPeak,
  IconForm,
  IconScales,
  IconQuote,
  IconHouse,
} from './icons';

export interface AreaVisual {
  hue: string; // gedämpfte Kennfarbe (dunkler Glas-Look)
  Icon: ComponentType<{ className?: string }>;
}

// Fallback für später hinzukommende Bereiche (kein hartes Scheitern).
const DEFAULT: AreaVisual = { hue: '#E7C08A', Icon: IconSprout };

const MAP: Record<string, AreaVisual> = {
  'area-basics': { hue: '#63C9B6', Icon: IconSprout }, // Teal
  'area-travel': { hue: '#7FB2E6', Icon: IconPlane }, // Himmelblau
  'area-food': { hue: '#E0936F', Icon: IconCup }, // Terrakotta
  'area-people': { hue: '#AEA2E6', Icon: IconPeople }, // Lavendel
  'area-home': { hue: '#E0B98A', Icon: IconHouse }, // Warmes Licht im Fenster
  'area-shopping': { hue: '#83C98C', Icon: IconBag }, // Grün
  'area-emergency': { hue: '#E68983', Icon: IconCross }, // Rot
  'area-friends': { hue: '#D9A05B', Icon: IconWheel }, // Bernstein
  'area-outdoors': { hue: '#7FC7A8', Icon: IconPeak }, // Seegrün
  'area-services': { hue: '#9FB6C9', Icon: IconForm }, // Stahlblau (Papierkram)
  'area-society': { hue: '#C9A0C4', Icon: IconScales }, // Mauve (abwägen)
  'area-language': { hue: '#C9B77F', Icon: IconQuote }, // Sand (Feinheiten)
};

export function areaVisual(areaId: string | undefined): AreaVisual {
  return (areaId && MAP[areaId]) || DEFAULT;
}

/**
 * Leiser Bereichs-Schimmer am oberen Rand (statt bunter Sticker auf jeder Karte).
 * Als erstes Kind eines `relative`-Containers einsetzen; der Inhalt darüber bekommt
 * `relative z-10`. Respektiert reduzierte Bewegung (rein statisch, kein Flackern).
 */
export function AreaWash({ hue }: { hue: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -top-2 -z-10 h-44"
      style={{
        background: `radial-gradient(80% 100% at 25% 0%, ${hue}33, transparent 72%)`,
      }}
    />
  );
}

/** Icon-Plättchen in der Bereichsfarbe (für Kacheln/Köpfe). */
export function AreaBadge({
  hue,
  Icon,
  size = 'md',
}: {
  hue: string;
  Icon: ComponentType<{ className?: string }>;
  size?: 'sm' | 'md';
}) {
  const box = size === 'sm' ? 'h-9 w-9 rounded-[10px]' : 'h-11 w-11 rounded-xl';
  const ic = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <span
      className={`flex shrink-0 items-center justify-center ${box}`}
      style={{ background: `${hue}22`, color: hue }}
    >
      <Icon className={ic} />
    </span>
  );
}
