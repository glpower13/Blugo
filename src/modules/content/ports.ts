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

// --- Sparringspartner (P4, docs/gremium-sprachpartner.md §9) --------------------

/** Eine gesagte Zeile im laufenden Gespräch. */
export interface SparringLine {
  who: 'partner' | 'you';
  sv: string;
}

/** Anfrage an den Gesprächspartner: was sagt er als Nächstes? */
export interface SparringRequest {
  /** Die Szene in einem deutschen Satz (Café, Werkstatt …) — Kulisse für den Partner. */
  scene: string;
  /**
   * Die Kennung der Kulisse (`cafe`, `garage`, …) — dieselbe Wertemenge wie
   * `Dialog.scene`. Der Cloud-Partner braucht sie nicht, er liest den Satz. Der
   * Grund-Partner schon: Ohne sie zieht er seine Zeilen aus irgendeinem
   * Gespräch, und im Café redet plötzlich jemand über die Werkstatt (beim
   * Selbst-Ansehen aufgefallen).
   */
  sceneId?: string;
  /** Wie der Partner heißt und wer er ist (z. B. „Kellnerin Elin"). */
  partner: string;
  /** Vorname des Lerners (leer = keiner). */
  learnerName: string;
  /**
   * Wendungen, die der Partner HERVORLOCKEN soll — der ganze Zweck des Modus.
   * Er darf sie nicht selbst aussprechen, sondern muss Fragen stellen, auf die
   * sie die natürliche Antwort sind.
   */
  targets: KnownPhrase[];
  /** Bisheriger Verlauf (älteste zuerst). */
  history: SparringLine[];
}

/** Was der Partner sagt. */
export interface SparringReply {
  sv: string; // seine Zeile auf Schwedisch
  de: string; // deutsche Übersetzung derselben Zeile
}

/**
 * Ein gesprächsfähiger Partner (P4). Bewusst als eigener Port: heute ein
 * Text-Modell, dessen Antwort die vorhandene Sprachausgabe vorliest; später
 * kann ein echter Sprach-zu-Sprach-Dienst denselben Port belegen, ohne dass eine
 * aufrufende Stelle sich ändert (`docs/gremium-sprachpartner.md` §9).
 */
export interface SparringPartner {
  readonly id: string;
  reply(req: SparringRequest): Promise<SparringReply>;
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
