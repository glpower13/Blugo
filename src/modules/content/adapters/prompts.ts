// Was die KI tun soll — anbieterunabhängig.
//
// WARUM ES DIESE DATEI GIBT (2026-07-26): Die Prompts und die Auswertung der
// Antworten lagen im Claude-Adapter. Ein zweiter Anbieter hätte sie kopieren
// müssen — und zwei Kopien eines Prompts driften genauso auseinander wie zwei
// Kopien einer Prüfregel. Dann verhält sich die App je nach Anbieter anders,
// ohne dass es jemand entschieden hat.
//
// Hier steht deshalb ALLES, was für jeden Anbieter gleich ist:
//   · die vier Systemanweisungen (Dekodieren, Erklären, Erzeugen, Sparring)
//   · der jeweilige Nutzer-Text
//   · das Auslesen der Antwort
//
// Was NICHT hier steht: der Draht. Anthropic und OpenAI-kompatible Dienste
// bauen ihre Anfrage unterschiedlich, und genau das ist der Unterschied
// zwischen ihnen — mehr aber auch nicht.

import type { DecodingToken, Segment } from '../../../domain/chunk';
import type { ExplainRequest, GenerateSegmentRequest, SparringReply, SparringRequest } from '../ports';

// ── Antworten auslesen ───────────────────────────────────────────────────────

/** Extrahiert das erste JSON-Objekt aus dem Modelltext (rein, tolerant). */
export function parseJsonLoose(text: string): Record<string, unknown> {
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
export function toDecodingTokens(value: unknown): DecodingToken[] {
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

// ── 1. Dekodieren (Birkenbihl-Baustein) ──────────────────────────────────────

export const DECODE_SYSTEM =
  'Du bist ein Werkzeug für interlineare Wort-für-Wort-Dekodierung Schwedisch→Deutsch ' +
  '(Methode Birkenbihl): gib jedem schwedischen Wort die WÖRTLICHE deutsche Entsprechung, ' +
  'nicht die schöne Übersetzung. Antworte AUSSCHLIESSLICH als JSON in der Form ' +
  '{"tokens":[{"sv":"<wort>","de":"<wörtlich>"}]} — keine Erklärung, kein Markdown.';

export const decodeUser = (sv: string): string => sv;

/** Parst die Wort-für-Wort-Dekodierung aus dem Modelltext (rein, tolerant). */
export function parseDecoding(text: string): DecodingToken[] {
  const tokens = toDecodingTokens(parseJsonLoose(text).tokens);
  if (tokens.length === 0) throw new Error('Es kamen keine Wortpaare zurück.');
  return tokens;
}

// ── 2. Fehler erklären („Warum?") ────────────────────────────────────────────

export const EXPLAIN_SYSTEM =
  'Du bist ein geduldiger Schwedisch-Lernbegleiter. Der Lernende hat eine Antwort getippt; ' +
  'die KORREKTE Form ist bekannt und gilt. Erkläre in 1–2 kurzen, freundlichen deutschen ' +
  'Sätzen den Unterschied (Rechtschreibung/Grammatik) — konkret und ermutigend. Wenn die ' +
  'Eingabe in Wahrheit eine akzeptable Variante ist, sag das und erfinde KEINEN Fehler. ' +
  'Antworte nur mit der Erklärung, ohne Vorwort, ohne Markdown.';

export const explainUser = (req: ExplainRequest): string =>
  `Korrekt: „${req.target}"\nGetippt: „${req.typed}"` +
  (req.meaning ? `\nBedeutung: „${req.meaning}"` : '');

// ── 3. Neuen i+1-Kontext erzeugen (der Moat) ─────────────────────────────────

export const GENERATE_SYSTEM =
  'Du bist Autor für verständlichen schwedischen Lern-Input (Comprehensible Input, Stufe i+1). ' +
  'Erzeuge EINEN kurzen, natürlichen und KORREKTEN schwedischen Satz, der die vorgegebene Wendung ' +
  'natürlich enthält. WICHTIG (i+1): Baue den Rest des Satzes so weit wie möglich aus den als ' +
  'BEKANNT gelisteten Wörtern; führe außer der Ziel-Wendung möglichst NICHTS Neues ein. Gibt es ' +
  'keine bekannten Wörter, halte den Rest maximal einfach und alltäglich. Antworte NUR als JSON ' +
  '{"sv":"<satz>","de":"<idiomatische deutsche Übersetzung>","decoding":[{"sv":"<wort>","de":"<wörtlich>"}]} ' +
  '— „decoding" ist die Wort-für-Wort-Übersetzung. Keine Erklärung, kein Markdown.';

export function generateUser(req: GenerateSegmentRequest): string {
  const known = (req.known ?? []).map((k) => k.sv).filter(Boolean);
  const knownLine =
    known.length > 0
      ? `\nSchon bekannt (daraus bauen, nichts anderes Neues): ${known.join(', ')}.`
      : '\n(Noch keine bekannten Wörter — den Rest maximal einfach halten.)';
  return (
    `Ziel-Wendung (muss vorkommen, ist das EINZIGE Neue): „${req.sv}" (Bedeutung: „${req.de}").` +
    knownLine +
    '\nBaue sie in einen NEUEN, anderen Alltagssatz ein (i+1).'
  );
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

// ── 4. Der Sparringspartner ──────────────────────────────────────────────────
//
// Der Unterschied zu jedem Wettbewerber steckt in DIESEM Prompt: Der Partner ist
// nicht angehalten, ein schönes Gespräch zu führen, sondern BESTIMMTE fällige
// Wendungen hervorzulocken, ohne sie selbst zu sagen. Sagt er sie, kann der
// Lerner sie nur nachplappern — und eine nachgeplapperte Wendung ist kein Abruf.
// Genau deshalb steht das Verbot doppelt im Prompt und wird zusätzlich im
// Abgleich erzwungen (`matchedTargets` prüft gegen die letzte Partner-Zeile).

export const SPARRING_SYSTEM =
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

export function sparringUser(req: SparringRequest): string {
  const targets = req.targets.map((t) => `„${t.sv}" (= ${t.de})`).join(' · ');
  const name = req.learnerName.trim();
  const lines = req.history
    .map((l) => `${l.who === 'partner' ? 'DU' : 'LERNENDER'}: ${l.sv}`)
    .join('\n');
  return (
    `Szene: ${req.scene}\nDu bist: ${req.partner}\n` +
    (name ? `Der Lernende heißt ${name}.\n` : '') +
    `Ziel-Wendungen, die du hervorlocken sollst (NIE selbst sagen): ${targets || '—'}\n\n` +
    (lines ? `Bisher:\n${lines}\n\n` : '') +
    'Sage jetzt deine nächste Zeile.'
  );
}

/** Liest die Partner-Zeile aus dem Modelltext (rein, tolerant). */
export function parseSparringReply(text: string): SparringReply {
  const obj = parseJsonLoose(text);
  const sv = typeof obj.sv === 'string' ? obj.sv.trim() : '';
  const de = typeof obj.de === 'string' ? obj.de.trim() : '';
  if (!sv) throw new Error('Der Sparringspartner hat nichts gesagt.');
  return { sv, de };
}

// ── Wie viele Zeichen die Antwort höchstens braucht ──────────────────────────
export const MAX_TOKENS = { decode: 1024, explain: 300, generate: 600, sparring: 400 } as const;
