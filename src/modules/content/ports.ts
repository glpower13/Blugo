// KI-Port-Schicht (Ports & Adapters) — der anbieter-agnostische Andockpunkt der
// Content-Pipeline (docs/08-content-pipeline.md; docs/gremium-weltklasse.md §5–§6, Schritt B).
//
// Diese Interfaces beschreiben FÄHIGKEITEN, keine Produkte: Was ein Modell/Dienst
// KÖNNEN muss, damit die App ihn nutzen kann. Konkrete Anbieter sind austauschbare
// Adapter (Schritt C — braucht Anbieter-Entscheidung, docs/10-open-questions.md).
// So bleibt die App zukunftssicher: Modelle wechseln, die App bleibt.

import type { DecodingToken, Segment } from '../../domain/chunk';

/** Anfrage: erzeuge ein verständliches i+1-Segment, das die Ziel-Chunks einbettet. */
export interface GenerateSegmentRequest {
  targetChunkIds: string[]; // diese Chunks sollen vorkommen (das „+1")
  knownChunkIds?: string[]; // bekannte Chunks, die als Kontext wiederkehren dürfen (das „i")
  level: number; // Zielstufe (i+1-Graduierung)
  avoidSegmentIds?: string[]; // schon gesehene Kontexte meiden (Kontextvariation)
}

/** Erzeugt verständlichen Input on demand — die LLM-Fähigkeit (der Moat). */
export interface ContentGenerator {
  readonly id: string; // Adapter-Kennung, z. B. „seed" (heute), später ein Anbieter
  generate(req: GenerateSegmentRequest): Promise<Segment>;
}

/** Erzeugt die interlineare Wort-für-Wort-Dekodierung SV→DE (Birkenbihl-Baustein). */
export interface Decoder {
  readonly id: string;
  decode(sv: string): Promise<DecodingToken[]>;
}

/** Anfrage an die Sprachausgabe. */
export interface SpeakRequest {
  text: string;
  lang?: string; // Standard: „sv-SE"
  rate?: number; // Tempo (1 = normal)
}

/** Wandelt Text in gesprochenes Schwedisch — die TTS-Fähigkeit. */
export interface SpeechSynthesizer {
  readonly id: string;
  isAvailable(): boolean;
  speak(req: SpeakRequest): Promise<void>;
}

/** Ergebnis einer Spracherkennung. */
export interface RecognitionResult {
  transcript: string;
  confidence?: number;
}

/**
 * Erkennt gesprochenes Schwedisch — die ASR-Fähigkeit.
 * Erst post-M1 (für echte Aussprache-Produktion, docs/11-ideas.md): hier nur der
 * Vertrag, damit die Architektur den späteren Adapter bereits kennt.
 */
export interface SpeechRecognizer {
  readonly id: string;
  isAvailable(): boolean;
  recognizeOnce(lang?: string): Promise<RecognitionResult>;
}
