// Der GENERISCHE Cloud-Adapter: alles, was die OpenAI-Chat-Schnittstelle
// spricht — und das ist inzwischen fast alles.
//
// ── WARUM ES IHN GIBT (Nutzerwunsch 2026-07-26) ──────────────────────────────
//
// „Die KI, die wir einsetzen, kann ja eine ganz andere sein. Das muss nicht
// Claude sein." Die Port-Schicht war dafür immer gebaut — es gab nur nie einen
// zweiten Adapter, der das BEWEIST. Eine Architektur, deren Austauschbarkeit nie
// jemand ausprobiert hat, ist eine Behauptung.
//
// Dieser Adapter deckt mit EINEM Stück Code unter anderem ab:
//   · OpenAI, Groq, Mistral, DeepSeek, Together, OpenRouter, Fireworks
//   · lokale Server: Ollama, LM Studio, llama.cpp, vLLM (dann ohne Schlüssel
//     und ohne dass irgendetwas das Gerät verlässt)
//
// Der Nutzer trägt drei Dinge ein: Adresse, Schlüssel, Modellname. Mehr braucht
// es nicht, weil alles Inhaltliche in `prompts.ts` steht und für jeden Anbieter
// gleich ist.
//
// ── DIE EHRLICHE GRENZE ──────────────────────────────────────────────────────
//
// Die App kann NICHT wissen, wie gut ein fremdes Modell Schwedisch kann. Deshalb
// ist es gut, dass das Tor (`quality/gate.ts`) hinter JEDEM Anbieter steht:
// Was ein schwaches Modell liefert, fällt dort durch, statt beim Lerner zu
// landen. Der Adapter macht die Anbieter austauschbar — die Prüfung macht sie
// vergleichbar.

import type { DecodingToken, Segment } from '../../../domain/chunk';
import type {
  ContentGenerator,
  Decoder,
  ExplainRequest,
  Explainer,
  GenerateSegmentRequest,
  SparringPartner,
  SparringReply,
  SparringRequest,
} from '../ports';
import {
  DECODE_SYSTEM,
  decodeUser,
  EXPLAIN_SYSTEM,
  explainUser,
  GENERATE_SYSTEM,
  generateUser,
  MAX_TOKENS,
  parseDecoding,
  parseSegment,
  parseSparringReply,
  SPARRING_SYSTEM,
  sparringUser,
} from './prompts';
import { callJson } from './shared';

export interface OpenAiCompatibleConfig {
  /** Basis-Adresse, z. B. `https://api.openai.com/v1` oder `http://localhost:11434/v1`. */
  baseUrl: string;
  /** Zugang des Nutzers. Bei lokalen Servern oft leer — dann wird kein Header gesetzt. */
  apiKey: string;
  model: string;
}

const SCHLUESSEL_HINWEIS = 'Prüfe Adresse und Zugang beim Anbieter.';

/**
 * Setzt die Endpunkt-Adresse zusammen — nachsichtig gegenüber dem, was Leute
 * wirklich eintragen.
 *
 * WARUM SO NACHSICHTIG: Der eine kopiert `https://api.openai.com`, der nächste
 * `https://api.openai.com/v1`, der dritte gleich die volle
 * `.../v1/chat/completions`. Alle drei meinen dasselbe. Sie an einem Schrägstrich
 * scheitern zu lassen, wäre eine selbstgemachte Hürde.
 */
export function endpunkt(baseUrl: string): string {
  const b = baseUrl.trim().replace(/\/+$/, '');
  if (!b) throw new Error('Es fehlt die Adresse des Anbieters.');
  if (b.endsWith('/chat/completions')) return b;
  if (b.endsWith('/v1')) return `${b}/chat/completions`;
  return `${b}/v1/chat/completions`;
}

/** Baut den Anfrage-Body im OpenAI-Chat-Format (rein, testbar). */
export function buildBody(system: string, user: string, model: string, maxTokens: number): string {
  return JSON.stringify({
    model,
    // `max_completion_tokens` ist der neuere Name; viele Dienste kennen nur
    // `max_tokens`. Beide zu senden ist der Weg, der überall funktioniert.
    max_tokens: maxTokens,
    max_completion_tokens: maxTokens,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  });
}

/** Zieht den Text aus einer Chat-Completions-Antwort (rein). */
export function extractText(json: unknown): string {
  const c = (json as { choices?: Array<{ message?: { content?: unknown } }> })?.choices;
  const inhalt = Array.isArray(c) ? c[0]?.message?.content : undefined;
  if (typeof inhalt === 'string') return inhalt.trim();
  // Manche Dienste liefern den Inhalt als Teile-Liste.
  if (Array.isArray(inhalt)) {
    return inhalt
      .map((t) => (typeof (t as { text?: unknown })?.text === 'string' ? (t as { text: string }).text : ''))
      .join('')
      .trim();
  }
  return '';
}

function headers(apiKey: string): Record<string, string> {
  const h: Record<string, string> = { 'content-type': 'application/json' };
  // Lokale Server (Ollama, LM Studio) brauchen keinen Schlüssel. Einen leeren
  // mitzuschicken lässt manche von ihnen mit 401 antworten.
  if (apiKey.trim()) h.authorization = `Bearer ${apiKey.trim()}`;
  return h;
}

async function ruf(
  cfg: OpenAiCompatibleConfig,
  system: string,
  user: string,
  max: number,
): Promise<string> {
  const json = await callJson(
    endpunkt(cfg.baseUrl),
    headers(cfg.apiKey),
    buildBody(system, user, cfg.model, max),
    SCHLUESSEL_HINWEIS,
  );
  return extractText(json);
}

const kennung = (cfg: OpenAiCompatibleConfig) => `openai:${cfg.model}`;

export function createOpenAiDecoder(cfg: OpenAiCompatibleConfig): Decoder {
  return {
    id: kennung(cfg),
    async decode(sv: string): Promise<DecodingToken[]> {
      return parseDecoding(await ruf(cfg, DECODE_SYSTEM, decodeUser(sv), MAX_TOKENS.decode));
    },
  };
}

export function createOpenAiExplainer(cfg: OpenAiCompatibleConfig): Explainer {
  return {
    id: kennung(cfg),
    async explain(req: ExplainRequest): Promise<string> {
      const text = await ruf(cfg, EXPLAIN_SYSTEM, explainUser(req), MAX_TOKENS.explain);
      if (!text) throw new Error('Es kam keine Erklärung zurück.');
      return text;
    },
  };
}

export function createOpenAiGenerator(cfg: OpenAiCompatibleConfig): ContentGenerator {
  return {
    id: kennung(cfg),
    async generate(req: GenerateSegmentRequest): Promise<Segment> {
      return parseSegment(await ruf(cfg, GENERATE_SYSTEM, generateUser(req), MAX_TOKENS.generate), req);
    },
  };
}

export function createOpenAiSparringPartner(cfg: OpenAiCompatibleConfig): SparringPartner {
  return {
    id: kennung(cfg),
    async reply(req: SparringRequest): Promise<SparringReply> {
      return parseSparringReply(await ruf(cfg, SPARRING_SYSTEM, sparringUser(req), MAX_TOKENS.sparring));
    },
  };
}
