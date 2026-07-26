// Dialog-Modus (Szenen-Gespräch) — die im Gremium beschlossene Ausbaustufe
// (docs/gremium-dialog.md). Ein Dialog ist eine gescriptete Alltagsszene, gebaut
// aus VORHANDENEN Chunks: der Lerner hört/versteht die Partner-Zeilen
// (Comprehensible Input) und PRODUZIERT selbst an den „Du bist dran"-Zeilen.
//
// Ehrlichkeit (die eine Design-Regel): eine „du"-Zeile ist ein echter Abruf ihres
// Chunks und speist DIESELBE Memory-Engine wie der normale Loop — der Fortschritt
// aus einem Gespräch ist also echtes Können, kein separater Schein-Zähler.

import type { DecodingToken } from './chunk';

/** Wer spricht: die Szene-Person (Input) oder der Lerner (Produktion). */
export type Speaker = 'partner' | 'you';

/** Kulisse für die (dezente, edle) Szenen-Stimmung — kein verspieltes Clipart. */
export type DialogScene =
  | 'cafe'
  | 'hotel'
  | 'station'
  | 'shop'
  | 'clinic'
  | 'garage'
  | 'gaming'
  | 'track'
  | 'lake'
  | 'stadium'
  // Vier Kulissen für die Gespräche der neuen Themen. Vorher liefen über zwanzig
  // Szenen auf `generic` — eine leere Fläche mit einer Figur darauf. Eine Szene
  // ist keine Deko: sie sagt in einem Blick, WO man gerade steht, und genau das
  // fehlte diesen Gesprächen (Befund beim Ansehen 2026-07-25).
  | 'office' // Beratung über den Schreibtisch: Bank, Termin, Bewerbung, Verhandlung
  | 'home' // Küchentisch daheim: Kinder, Einladung, Gefühle, Gesellschaft
  | 'street' // Draußen zwischen Häusern: Small Talk, Wetter, Winter, Nachbarn
  | 'school' // Kursraum mit Tafel: Sprache, Meinung, Medien, Nuancen
  | 'generic';

export interface DialogTurn {
  id: string;
  speaker: Speaker;
  sv: string; // Schwedisch (Partner: Input · Du: das Ziel, das du sagen sollst)
  de: string; // idiomatische deutsche Bedeutung
  decoding?: DecodingToken[]; // Partner: Wort-für-Wort (Birkenbihl-Baustein)
  // „du"-Zeile: welcher Chunk hier produziert wird → speist die Memory-Engine.
  chunkId?: string;
  suggestions?: string[]; // „du"-Zeile: optionale Vorschläge (abschaltbare Krücke)
  // Partner-Zeile: erst nur hören, Text auf Tipp aufdecken (Hör-zuerst, Dual Coding).
  listenFirst?: boolean;
}

export interface Dialog {
  id: string;
  categoryId: string; // zu welchem Thema die Szene gehört (Category.id)
  title: string; // Deutsch, z. B. „Im Restaurant: einen Tisch bekommen"
  blurb: string; // eine kurze deutsche Zeile
  scene: DialogScene;
  partnerName: string; // Rolle der Szene-Person, z. B. „Kellner"
  turns: DialogTurn[];
}
