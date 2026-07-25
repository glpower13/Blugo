// Anthropic-(Claude-)Adapter für den Decoder-Port. Ruft die Messages-API direkt
// aus dem Browser auf ("bring your own key": der Nutzer hinterlegt seinen EIGENEN
// Schlüssel; der schwedische Text geht an den Anbieter). Bewusst per `fetch`
// statt SDK, um die PWA schlank zu halten (ein einziger Endpunkt).
// Sicherheits-/Datenschutz-Abwägung: docs/05-architecture.md §Sicherheit.

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

/** Extrahiert das erste JSON-Objekt aus dem Modelltext (rein, tolerant). */
function parseJsonLoose(text: string): Record<string, unknown> {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new Error('Die Antwort enthielt kein lesbares Ergebnis.');
  }
  try {
    return JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    throw new Error('Die Antwort war kein gültiges JSON.');
  }
}

/** Validiert eine Wort-für-Wort-Liste [{sv,de}] (rein). */
function toDecodingTokens(value: unknown): DecodingToken[] {
  const out: DecodingToken[] = [];
  if (Array.isArray(value)) {
    for (const t of value) {
      const sv = (t as { sv?: unknown })?.sv;
      const de = (t as { de?: unknown })?.de;
      if (typeof sv === 'string' && typeof de === 'string') out.push({ sv, de });
    }
  }
  return out;
}

/** Parst die Wort-für-Wort-Dekodierung aus dem Modelltext (rein, tolerant). */
export function parseDecoding(text: string): DecodingToken[] {
  const tokens = toDecodingTokens(parseJsonLoose(text).tokens);
  if (tokens.length === 0) throw new Error('Es kamen keine Wortpaare zurück.');
  return tokens;
}

/**
 * Übersetzt HTTP-Fehler in eine klare, nicht-technische Meldung (rein).
 * `detail` ist die ECHTE Fehlermeldung des Anbieters (falls vorhanden) — sie zu
 * zeigen ist der Unterschied zwischen "geht nicht" und "weiß, warum es nicht geht".
 */
export function friendlyError(status: number, detail?: string): string {
  const extra = detail && detail.trim() ? ` — ${detail.trim()}` : '';
  if (status === 400) return `Anfrage abgelehnt (400)${extra}.`;
  if (status === 401)
    return `Zugangs-Schlüssel ungültig (401)${extra}. Er muss mit „sk-ant-…" beginnen — bitte prüfen.`;
  if (status === 403) return `Kein Zugriff mit diesem Schlüssel (403)${extra}.`;
  if (status === 404)
    return (
      `Modell nicht verfügbar (404)${extra}. ` +
      'Tipp: Wähle unten ein anderes Modell (z. B. Haiku) — dein Schlüssel hat evtl. keinen Zugriff auf dieses.'
    );
  if (status === 429) return `Zu viele Anfragen (429)${extra} — kurz warten und erneut testen.`;
  if (status >= 500) return `Der Anbieter hat gerade ein Problem (HTTP ${status})${extra} — später erneut.`;
  return `Anfrage fehlgeschlagen (HTTP ${status})${extra}.`;
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

/** Liest die eigentliche Fehlermeldung aus dem Antwort-Body (rein, tolerant). */
async function readErrorDetail(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: { message?: unknown } };
    const msg = data?.error?.message;
    return typeof msg === 'string' ? msg.trim() : '';
  } catch {
    return '';
  }
}

/**
 * Ein Aufruf der Messages-API — gebündelte, robuste Fehlerbehandlung für alle
 * drei Adapter (Decoder/Explainer/Generator). Wirft ausschließlich klare,
 * nicht-technische deutsche Meldungen und reicht die echte Anbieter-Meldung durch.
 */
async function callMessages(config: AnthropicConfig, body: string): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(API_URL, { method: 'POST', headers: headers(config.apiKey), body });
  } catch {
    // `fetch` wirft nur bei Netzwerk/CORS — nicht bei HTTP-Fehlern (die sind !res.ok).
    throw new Error(
      'Keine Verbindung zur Cloud-KI (Netzwerk). Prüfe die Internet-Verbindung — ' +
        'ein Ad-/Tracking-Blocker oder ein Firmen-/Schul-Netz kann api.anthropic.com blockieren.',
    );
  }
  if (!res.ok) throw new Error(friendlyError(res.status, await readErrorDetail(res)));
  return (await res.json()) as unknown;
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
      const json = await callMessages(config, buildExplainBody(req, config.model));
      const text = extractText(json);
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
      const json = await callMessages(config, buildDecodeBody(sv, config.model));
      return parseDecoding(extractText(json));
    },
  };
}

// --- Der Moat: KI-Content-Generierung (i+1-Segment on demand) -------------------

const GENERATE_SYSTEM =
  'Du bist Autor für verständlichen schwedischen Lern-Input (Comprehensible Input, Stufe i+1). ' +
  'Erzeuge EINEN kurzen, natürlichen und KORREKTEN schwedischen Satz, der die vorgegebene Wendung ' +
  'natürlich enthält. WICHTIG (i+1): Baue den Rest des Satzes so weit wie möglich aus den als ' +
  'BEKANNT gelisteten Wörtern; führe außer der Ziel-Wendung möglichst NICHTS Neues ein. Gibt es ' +
  'keine bekannten Wörter, halte den Rest maximal einfach und alltäglich. Antworte NUR als JSON ' +
  '{"sv":"<satz>","de":"<idiomatische deutsche Übersetzung>","decoding":[{"sv":"<wort>","de":"<wörtlich>"}]} ' +
  '— „decoding" ist die Wort-für-Wort-Übersetzung. Keine Erklärung, kein Markdown.';

/** Baut den Request-Body für die Segment-Generierung (rein, testbar). */
export function buildGenerateBody(req: GenerateSegmentRequest, model: string): string {
  const known = (req.known ?? []).map((k) => k.sv).filter(Boolean);
  const knownLine =
    known.length > 0
      ? `\nSchon bekannt (daraus bauen, nichts anderes Neues): ${known.join(', ')}.`
      : '\n(Noch keine bekannten Wörter — den Rest maximal einfach halten.)';
  const user =
    `Ziel-Wendung (muss vorkommen, ist das EINZIGE Neue): „${req.sv}" (Bedeutung: „${req.de}").` +
    knownLine +
    '\nBaue sie in einen NEUEN, anderen Alltagssatz ein (i+1).';
  return JSON.stringify({
    model,
    max_tokens: 600,
    system: GENERATE_SYSTEM,
    messages: [{ role: 'user', content: user }],
  });
}

/** Baut aus dem Modelltext ein Segment (rein, tolerant). */
export function parseSegment(text: string, req: GenerateSegmentRequest): Segment {
  const obj = parseJsonLoose(text);
  const sv = typeof obj.sv === 'string' ? obj.sv.trim() : '';
  const de = typeof obj.de === 'string' ? obj.de.trim() : '';
  if (!sv) throw new Error('Es kam kein schwedischer Satz zurück.');
  return {
    id: 'ai:' + req.chunkId,
    level: req.level,
    sv,
    de,
    decoding: toDecodingTokens(obj.decoding),
    chunkIds: [req.chunkId],
  };
}

/** Erzeugt einen ContentGenerator-Adapter, der Claude nutzt (der Moat). */
export function createAnthropicGenerator(config: AnthropicConfig): ContentGenerator {
  return {
    id: 'anthropic:' + config.model,
    async generate(req: GenerateSegmentRequest): Promise<Segment> {
      const json = await callMessages(config, buildGenerateBody(req, config.model));
      return parseSegment(extractText(json), req);
    },
  };
}

// --- P4: Der Sparringspartner (docs/gremium-sprachpartner.md §9) ----------------
//
// Der Unterschied zu jedem Wettbewerber steckt in DIESEM Prompt: Der Partner ist
// nicht angehalten, ein schönes Gespräch zu führen, sondern BESTIMMTE fällige
// Wendungen hervorzulocken, ohne sie selbst zu sagen. Sagt er sie, kann der Lerner
// sie nur nachplappern — und eine nachgeplapperte Wendung ist kein Abruf. Genau
// deshalb steht das Verbot doppelt im Prompt und wird zusätzlich im Abgleich
// erzwungen (`matchedTargets` prüft gegen die letzte Partner-Zeile).

const SPARRING_SYSTEM =
  'Du spielst eine Person in einer schwedischen Alltagsszene und sprichst mit einem ' +
  'Deutschen, der Schwedisch lernt. Regeln:\n' +
  '1. Sprich AUSSCHLIESSLICH einfaches, natürliches Schwedisch — ein bis zwei kurze Sätze.\n' +
  '2. Deine Aufgabe ist es, den Lernenden dazu zu bringen, die ZIEL-WENDUNGEN selbst zu ' +
  'sagen. Stelle Fragen, auf die eine Ziel-Wendung die natürliche Antwort wäre.\n' +
  '3. Sage die Ziel-Wendungen NIEMALS selbst und umschreibe sie nicht wörtlich — sonst ' +
  'kann der Lernende sie nur nachsprechen, und das ist wertlos.\n' +
  '4. Bleib in der Rolle. Keine Erklärungen, keine Korrekturen, kein Deutsch in der ' +
  'schwedischen Zeile.\n' +
  '5. Antworte NUR als JSON {"sv":"<deine schwedische Zeile>","de":"<deutsche Übersetzung>"} ' +
  '— kein Markdown, kein Vorwort.';

/** Baut den Request-Body für eine Partner-Zeile (rein, testbar). */
export function buildSparringBody(req: SparringRequest, model: string): string {
  const targets = req.targets.map((t) => `„${t.sv}" (= ${t.de})`).join(' · ');
  const name = req.learnerName.trim();
  const lines = req.history
    .map((l) => `${l.who === 'partner' ? 'DU' : 'LERNENDER'}: ${l.sv}`)
    .join('\n');
  const user =
    `Szene: ${req.scene}\nDu bist: ${req.partner}\n` +
    (name ? `Der Lernende heißt ${name}.\n` : '') +
    `Ziel-Wendungen, die du hervorlocken sollst (NIE selbst sagen): ${targets || '—'}\n\n` +
    (lines ? `Bisher:\n${lines}\n\n` : '') +
    'Sage jetzt deine nächste Zeile.';
  return JSON.stringify({
    model,
    max_tokens: 400,
    system: SPARRING_SYSTEM,
    messages: [{ role: 'user', content: user }],
  });
}

/** Liest die Partner-Zeile aus dem Modelltext (rein, tolerant). */
export function parseSparringReply(text: string): SparringReply {
  const obj = parseJsonLoose(text);
  const sv = typeof obj.sv === 'string' ? obj.sv.trim() : '';
  const de = typeof obj.de === 'string' ? obj.de.trim() : '';
  if (!sv) throw new Error('Der Gesprächspartner hat nichts gesagt.');
  return { sv, de };
}

/** Erzeugt einen Sparringspartner-Adapter, der Claude nutzt (BYOK). */
export function createAnthropicSparringPartner(config: AnthropicConfig): SparringPartner {
  return {
    id: 'anthropic:' + config.model,
    async reply(req: SparringRequest): Promise<SparringReply> {
      const json = await callMessages(config, buildSparringBody(req, config.model));
      return parseSparringReply(extractText(json));
    },
  };
}
