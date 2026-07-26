// Anthropic-(Claude-)Adapter. Ruft die Messages-API direkt aus dem Browser auf
// („bring your own key": der Nutzer hinterlegt seinen EIGENEN Schlüssel; der
// schwedische Text geht an den Anbieter). Bewusst per `fetch` statt SDK, um die
// PWA schlank zu halten. Sicherheits-/Datenschutz-Abwägung:
// docs/05-architecture.md §Sicherheit.
//
// SEIT 2026-07-26 NUR NOCH DER DRAHT: Was die KI tun soll, steht in
// `prompts.ts`; wie Fehler klingen, in `shared.ts`. Hier bleibt genau das, was
// Anthropic von anderen Anbietern unterscheidet — das Format der Anfrage und
// der Ort, an dem der Text in der Antwort steht.

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
import { callJson, friendlyError } from './shared';

const API_URL = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2023-06-01';

/** Anbieterabhängiger Hinweis bei 401 — bei Claude beginnt der Zugang so. */
const SCHLUESSEL_HINWEIS = 'Er muss mit „sk-ant-…" beginnen — bitte prüfen.';

export interface AnthropicConfig {
  apiKey: string;
  model: string;
}

/** Baut einen Anfrage-Body im Anthropic-Format (rein, testbar). */
function body(system: string, user: string, model: string, maxTokens: number): string {
  return JSON.stringify({
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: user }],
  });
}

/** Zieht den zusammenhängenden Text aus einer Messages-API-Antwort (rein). */
export function extractText(json: unknown): string {
  const content = (json as { content?: Array<{ type?: string; text?: string }> })?.content;
  if (!Array.isArray(content)) return '';
  return content
    .filter((b) => b?.type === 'text' && typeof b.text === 'string')
    .map((b) => b.text as string)
    .join('')
    .trim();
}

/** Header für den direkten Browser-Aufruf (inkl. CORS-Freigabe). */
function headers(apiKey: string): Record<string, string> {
  return {
    'content-type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': API_VERSION,
    // Nötig, damit der Browser die API direkt aufrufen darf (CORS).
    'anthropic-dangerous-direct-browser-access': 'true',
  };
}

async function ruf(cfg: AnthropicConfig, system: string, user: string, max: number): Promise<string> {
  const json = await callJson(API_URL, headers(cfg.apiKey), body(system, user, cfg.model, max), SCHLUESSEL_HINWEIS);
  return extractText(json);
}

// Für die bestehenden Tests: die Body-Bauer bleiben einzeln prüfbar.
export const buildDecodeBody = (sv: string, model: string): string =>
  body(DECODE_SYSTEM, decodeUser(sv), model, MAX_TOKENS.decode);
export const buildExplainBody = (req: ExplainRequest, model: string): string =>
  body(EXPLAIN_SYSTEM, explainUser(req), model, MAX_TOKENS.explain);
export const buildGenerateBody = (req: GenerateSegmentRequest, model: string): string =>
  body(GENERATE_SYSTEM, generateUser(req), model, MAX_TOKENS.generate);
export const buildSparringBody = (req: SparringRequest, model: string): string =>
  body(SPARRING_SYSTEM, sparringUser(req), model, MAX_TOKENS.sparring);

export { parseDecoding, parseSegment, parseSparringReply };
export const friendlyErrorAnthropic = (status: number, detail?: string): string =>
  friendlyError(status, detail, SCHLUESSEL_HINWEIS);
export { friendlyErrorAnthropic as friendlyError };

/** Erzeugt einen Decoder-Adapter, der Claude nutzt. */
export function createAnthropicDecoder(config: AnthropicConfig): Decoder {
  return {
    id: 'anthropic:' + config.model,
    async decode(sv: string): Promise<DecodingToken[]> {
      return parseDecoding(await ruf(config, DECODE_SYSTEM, decodeUser(sv), MAX_TOKENS.decode));
    },
  };
}

/** Erzeugt einen Explainer-Adapter, der Claude nutzt. */
export function createAnthropicExplainer(config: AnthropicConfig): Explainer {
  return {
    id: 'anthropic:' + config.model,
    async explain(req: ExplainRequest): Promise<string> {
      const text = await ruf(config, EXPLAIN_SYSTEM, explainUser(req), MAX_TOKENS.explain);
      if (!text) throw new Error('Es kam keine Erklärung zurück.');
      return text;
    },
  };
}

/** Erzeugt einen ContentGenerator-Adapter, der Claude nutzt (der Moat). */
export function createAnthropicGenerator(config: AnthropicConfig): ContentGenerator {
  return {
    id: 'anthropic:' + config.model,
    async generate(req: GenerateSegmentRequest): Promise<Segment> {
      return parseSegment(await ruf(config, GENERATE_SYSTEM, generateUser(req), MAX_TOKENS.generate), req);
    },
  };
}

/** Erzeugt einen Sparringspartner-Adapter, der Claude nutzt (BYOK). */
export function createAnthropicSparringPartner(config: AnthropicConfig): SparringPartner {
  return {
    id: 'anthropic:' + config.model,
    async reply(req: SparringRequest): Promise<SparringReply> {
      return parseSparringReply(await ruf(config, SPARRING_SYSTEM, sparringUser(req), MAX_TOKENS.sparring));
    },
  };
}
