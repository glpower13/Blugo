// KI-Port-Schicht (Ports & Adapters) — der anbieter-agnostische Andockpunkt der
// Content-Pipeline (docs/08-content-pipeline.md; docs/gremium-weltklasse.md §5–§6, Schritt B).
//
// Diese Interfaces beschreiben FÄHIGKEITEN, keine Produkte: Was ein Modell/Dienst
// KÖNNEN muss, damit die App ihn nutzen kann. Konkrete Anbieter sind austauschbare
// Adapter (Schritt C — braucht Anbieter-Entscheidung, docs/10-open-questions.md).
// So bleibt die App zukunftssicher: Modelle wechseln, die App bleibt.

import type { DecodingToken, Segment } from '../../domain/chunk';

/** Eine Wendung, die der Lerner schon kann (bekannter Grund für echtes i+1). */
export interface KnownPhrase {
  sv: string;
  de: string;
}

/** Anfrage: erzeuge ein verständliches i+1-Segment, das die Ziel-Wendung einbettet. */
export interface GenerateSegmentRequest {
  chunkId: string; // Kennung des Ziel-Chunks (für ID/Zuordnung)
  sv: string; // Ziel-Wendung (SV), die im Segment vorkommen soll (das „+1")
  de: string; // ihre Bedeutung (DE) — ein Cloud-Modell kennt unsere IDs nicht
  level: number; // Zielstufe (i+1-Graduierung)
  avoidSegmentIds?: string[]; // schon gesehene Kontexte meiden (Kontextvariation)
  // Wendungen, die der Lerner schon beherrscht: der Satz soll MÖGLICHST daraus
  // gebaut werden, sodass NUR die Ziel-Wendung neu ist — das ist echtes i+1
  // (verständlicher Input, docs/03-method.md; docs/08-content-pipeline.md).
  known?: KnownPhrase[];
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

/** Anfrage: erkläre den Unterschied zwischen getippter und korrekter Antwort. */
export interface ExplainRequest {
  target: string; // die KORREKTE schwedische Form (bekannt → die KI urteilt nicht, sie erklärt)
  typed: string; // die Eingabe des Lernenden
  meaning?: string; // deutsche Bedeutung (Kontext)
}

/**
 * Erklärt einen Tipp-Fehler in freundlichen Worten (docs/gremium-feedback.md, Schritt 2).
 * Weil die korrekte Antwort bereits feststeht, ist die Falsch-Korrektur-Gefahr minimal.
 */
export interface Explainer {
  readonly id: string;
  explain(req: ExplainRequest): Promise<string>;
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
