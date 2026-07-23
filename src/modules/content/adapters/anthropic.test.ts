// Tests des Claude-Decoder-Adapters: Request-Bau, Antwort-Parsing, Fehler.
// Das Netzwerk wird simuliert — kein echter Schlüssel, kein echter Aufruf.

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildDecodeBody,
  buildExplainBody,
  buildGenerateBody,
  createAnthropicDecoder,
  createAnthropicExplainer,
  createAnthropicGenerator,
  extractText,
  friendlyError,
  parseDecoding,
  parseSegment,
} from './anthropic';

const GEN_REQ = { chunkId: 'c-heter', sv: 'jag heter', de: 'ich heiße', level: 2 };

afterEach(() => vi.unstubAllGlobals());

describe('anthropic — reine Bausteine', () => {
  it('buildDecodeBody enthält Modell + Nachricht und KEINE Sampling-Parameter', () => {
    const body = JSON.parse(buildDecodeBody('hej', 'claude-opus-4-8'));
    expect(body.model).toBe('claude-opus-4-8');
    expect(body.messages[0].content).toBe('hej');
    expect(body.temperature).toBeUndefined();
    expect(body.top_p).toBeUndefined();
  });

  it('extractText fügt nur Text-Blöcke zusammen', () => {
    const json = { content: [{ type: 'text', text: '{"tokens":' }, { type: 'text', text: '[]}' }] };
    expect(extractText(json)).toBe('{"tokens":[]}');
  });

  it('parseDecoding liest Wortpaare, auch mit umgebendem Text', () => {
    const tokens = parseDecoding('Hier: {"tokens":[{"sv":"hur","de":"wie"},{"sv":"mår","de":"befindest"}]} ok');
    expect(tokens).toEqual([
      { sv: 'hur', de: 'wie' },
      { sv: 'mår', de: 'befindest' },
    ]);
  });

  it('parseDecoding wirft bei fehlendem/ungültigem JSON', () => {
    expect(() => parseDecoding('kein json hier')).toThrow();
    expect(() => parseDecoding('{kaputt}')).toThrow();
    expect(() => parseDecoding('{"tokens":[]}')).toThrow(/keine Wortpaare/i);
  });

  it('friendlyError bildet Status auf klare Meldungen ab', () => {
    expect(friendlyError(401)).toMatch(/ung[üu]ltig/i);
    expect(friendlyError(429)).toMatch(/warten/i);
    expect(friendlyError(500)).toMatch(/Problem/i);
  });
});

describe('anthropic — Decoder-Adapter (simuliertes Netzwerk)', () => {
  it('id trägt das Modell', () => {
    expect(createAnthropicDecoder({ apiKey: 'k', model: 'claude-haiku-4-5' }).id).toBe(
      'anthropic:claude-haiku-4-5',
    );
  });

  it('decode() liefert die Wortpaare bei Erfolg und sendet die richtigen Header', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ content: [{ type: 'text', text: '{"tokens":[{"sv":"hej","de":"hallo"}]}' }] }),
    }));
    vi.stubGlobal('fetch', fetchMock);

    const dec = createAnthropicDecoder({ apiKey: 'secret', model: 'claude-opus-4-8' });
    const tokens = await dec.decode('hej');
    expect(tokens).toEqual([{ sv: 'hej', de: 'hallo' }]);

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(headers['x-api-key']).toBe('secret');
    expect(headers['anthropic-dangerous-direct-browser-access']).toBe('true');
  });

  it('decode() wirft eine klare Meldung bei HTTP-Fehler', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 401, json: async () => ({}) })));
    const dec = createAnthropicDecoder({ apiKey: 'bad', model: 'claude-opus-4-8' });
    await expect(dec.decode('hej')).rejects.toThrow(/401/);
  });

  it('decode() wirft bei Netzwerkfehler', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new Error('offline');
    }));
    const dec = createAnthropicDecoder({ apiKey: 'k', model: 'claude-opus-4-8' });
    await expect(dec.decode('hej')).rejects.toThrow(/Netzwerk/);
  });
});

describe('anthropic — Explainer ("Warum?")', () => {
  it('buildExplainBody enthält korrekt + getippt + Bedeutung', () => {
    const body = JSON.parse(
      buildExplainBody({ target: 'jag heter', typed: 'jag hetar', meaning: 'ich heiße' }, 'claude-opus-4-8'),
    );
    expect(body.model).toBe('claude-opus-4-8');
    expect(body.messages[0].content).toContain('jag heter');
    expect(body.messages[0].content).toContain('jag hetar');
    expect(body.messages[0].content).toContain('ich heiße');
    expect(body.temperature).toBeUndefined();
  });

  it('explain() liefert den Erklärungstext bei Erfolg', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ content: [{ type: 'text', text: 'Du hast „a" statt „e" geschrieben.' }] }),
      })),
    );
    const ex = createAnthropicExplainer({ apiKey: 'k', model: 'claude-opus-4-8' });
    const text = await ex.explain({ target: 'jag heter', typed: 'jag hetar' });
    expect(text).toMatch(/statt/);
  });

  it('explain() wirft eine klare Meldung bei HTTP-Fehler', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 401, json: async () => ({}) })));
    const ex = createAnthropicExplainer({ apiKey: 'bad', model: 'claude-opus-4-8' });
    await expect(ex.explain({ target: 'a', typed: 'b' })).rejects.toThrow(/401/);
  });
});

describe('anthropic — Generator (der Moat)', () => {
  it('buildGenerateBody enthält Ziel-Wendung + Bedeutung', () => {
    const body = JSON.parse(buildGenerateBody(GEN_REQ, 'claude-opus-4-8'));
    expect(body.model).toBe('claude-opus-4-8');
    expect(body.messages[0].content).toContain('jag heter');
    expect(body.messages[0].content).toContain('ich heiße');
  });

  it('buildGenerateBody listet bekannte Wörter für echtes i+1', () => {
    const body = JSON.parse(
      buildGenerateBody(
        { ...GEN_REQ, known: [{ sv: 'tack', de: 'danke' }, { sv: 'hej', de: 'hallo' }] },
        'claude-opus-4-8',
      ),
    );
    const content = body.messages[0].content as string;
    expect(content).toContain('tack');
    expect(content).toContain('hej');
    expect(content).toMatch(/bekannt/i); // weist die KI an, daraus zu bauen
  });

  it('buildGenerateBody ohne bekannte Wörter → Hinweis „maximal einfach"', () => {
    const content = JSON.parse(buildGenerateBody(GEN_REQ, 'claude-opus-4-8')).messages[0]
      .content as string;
    expect(content).toMatch(/einfach/i);
  });

  it('parseSegment baut ein Segment mit sv/de/decoding und trägt die chunkId', () => {
    const seg = parseSegment(
      'Hier: {"sv":"Hej, jag heter Anna.","de":"Hallo, ich heiße Anna.","decoding":[{"sv":"jag","de":"ich"},{"sv":"heter","de":"heiße"}]}',
      GEN_REQ,
    );
    expect(seg.sv).toBe('Hej, jag heter Anna.');
    expect(seg.de).toBe('Hallo, ich heiße Anna.');
    expect(seg.decoding).toHaveLength(2);
    expect(seg.chunkIds).toEqual(['c-heter']);
    expect(seg.id).toBe('ai:c-heter');
  });

  it('parseSegment wirft ohne schwedischen Satz', () => {
    expect(() => parseSegment('{"de":"nur deutsch"}', GEN_REQ)).toThrow(/schwedischer Satz/i);
  });

  it('generate() liefert ein Segment bei Erfolg', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          content: [{ type: 'text', text: '{"sv":"Jag heter Erik.","de":"Ich heiße Erik.","decoding":[]}' }],
        }),
      })),
    );
    const gen = createAnthropicGenerator({ apiKey: 'k', model: 'claude-opus-4-8' });
    const seg = await gen.generate(GEN_REQ);
    expect(seg.sv).toBe('Jag heter Erik.');
    expect(seg.chunkIds).toEqual(['c-heter']);
  });
});
