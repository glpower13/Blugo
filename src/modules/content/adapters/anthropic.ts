// Anthropic-(Claude-)Adapter für den Decoder-Port. Ruft die Messages-API direkt
// aus dem Browser auf ("bring your own key": der Nutzer hinterlegt seinen EIGENEN
// Schlüssel; der schwedische Text geht an den Anbieter). Bewusst per `fetch`
// statt SDK, um die PWA schlank zu halten (ein einziger Endpunkt).
// Sicherheits-/Datenschutz-Abwägung: docs/05-architecture.md §Sicherheit.

import type { DecodingToken } from '../../../domain/chunk';
import type { Decoder, ExplainRequest, Explainer } from '../ports';

const API_URL = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2023-06-01';

export interface AnthropicConfig {
  apiKey: string;
  model: string;
}

const SYSTEM_PROMPT =
  'Du bist ein Werkzeug für interlineare Wort-für-Wort-Dekodierung Schwedisch→Deutsch ' +
  '(Methode Birkenbihl): gib jedem schwedischen Wort die WÖRTLICHE deutsche Entsprechung, ' +
  'nicht die schöne Übersetzung. Antworte AUSSCHLIESSLICH als JSON in der Form ' +
  '{"tokens":[{"sv":"<wort>","de":"<wörtlich>"}]} — keine Erklärung, kein Markdown.';

/** Baut den Request-Body (rein, testbar). Bewusst ohne Sampling-Parameter. */
export function buildDecodeBody(sv: string, model: string): string {
  return JSON.stringify({
    model,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: sv }],
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

/** Parst die Wort-für-Wort-Dekodierung aus dem Modelltext (rein, tolerant). */
export function parseDecoding(text: string): DecodingToken[] {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new Error('Die Antwort enthielt kein lesbares Ergebnis.');
  }
  let obj: unknown;
  try {
    obj = JSON.parse(text.slice(start, end + 1));
  } catch {
    throw new Error('Die Antwort war kein gültiges JSON.');
  }
  const tokens = (obj as { tokens?: unknown })?.tokens;
  if (!Array.isArray(tokens)) throw new Error('Die Antwort enthielt keine Wortpaare.');
  const result: DecodingToken[] = [];
  for (const t of tokens) {
    const sv = (t as { sv?: unknown })?.sv;
    const de = (t as { de?: unknown })?.de;
    if (typeof sv === 'string' && typeof de === 'string') result.push({ sv, de });
  }
  if (result.length === 0) throw new Error('Es kamen keine Wortpaare zurück.');
  return result;
}

/** Übersetzt HTTP-Fehler in eine klare, nicht-technische Meldung (rein). */
export function friendlyError(status: number): string {
  if (status === 401) return 'Zugangs-Schlüssel ungültig (401) — bitte prüfen.';
  if (status === 403) return 'Kein Zugriff mit diesem Schlüssel (403).';
  if (status === 429) return 'Zu viele Anfragen (429) — kurz warten.';
  if (status >= 500) return 'Der Anbieter hat gerade ein Problem — später erneut.';
  return `Anfrage fehlgeschlagen (HTTP ${status}).`;
}

// --- Schritt 2: Fehler-Erklärung ("Warum?") ------------------------------------

const EXPLAIN_SYSTEM =
  'Du bist ein geduldiger Schwedisch-Lernbegleiter. Der Lernende hat eine Antwort getippt; ' +
  'die KORREKTE Form ist bekannt und gilt. Erkläre in 1–2 kurzen, freundlichen deutschen ' +
  'Sätzen den Unterschied (Rechtschreibung/Grammatik) — konkret und ermutigend. Wenn die ' +
  'Eingabe in Wahrheit eine akzeptable Variante ist, sag das und erfinde KEINEN Fehler. ' +
  'Antworte nur mit der Erklärung, ohne Vorwort, ohne Markdown.';

/** Baut den Request-Body für die Erklärung (rein, testbar). */
export function buildExplainBody(req: ExplainRequest, model: string): string {
  const user =
    `Korrekt: „${req.target}"\nGetippt: „${req.typed}"` +
    (req.meaning ? `\nBedeutung: „${req.meaning}"` : '');
  return JSON.stringify({
    model,
    max_tokens: 300,
    system: EXPLAIN_SYSTEM,
    messages: [{ role: 'user', content: user }],
  });
}

/** Erzeugt einen Explainer-Adapter, der Claude nutzt. */
export function createAnthropicExplainer(config: AnthropicConfig): Explainer {
  return {
    id: 'anthropic:' + config.model,
    async explain(req: ExplainRequest): Promise<string> {
      let res: Response;
      try {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-api-key': config.apiKey,
            'anthropic-version': API_VERSION,
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: buildExplainBody(req, config.model),
        });
      } catch {
        throw new Error('Verbindung zum Anbieter fehlgeschlagen (Netzwerk).');
      }
      if (!res.ok) throw new Error(friendlyError(res.status));
      const text = extractText((await res.json()) as unknown);
      if (!text) throw new Error('Es kam keine Erklärung zurück.');
      return text;
    },
  };
}

/** Erzeugt einen Decoder-Adapter, der Claude nutzt. */
export function createAnthropicDecoder(config: AnthropicConfig): Decoder {
  return {
    id: 'anthropic:' + config.model,
    async decode(sv: string): Promise<DecodingToken[]> {
      let res: Response;
      try {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-api-key': config.apiKey,
            'anthropic-version': API_VERSION,
            // Nötig, damit der Browser die API direkt aufrufen darf (CORS).
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: buildDecodeBody(sv, config.model),
        });
      } catch {
        throw new Error('Verbindung zum Anbieter fehlgeschlagen (Netzwerk).');
      }
      if (!res.ok) throw new Error(friendlyError(res.status));
      const json = (await res.json()) as unknown;
      return parseDecoding(extractText(json));
    },
  };
}
