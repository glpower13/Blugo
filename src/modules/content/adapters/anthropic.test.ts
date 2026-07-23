// Tests des Claude-Decoder-Adapters: Request-Bau, Antwort-Parsing, Fehler.
// Das Netzwerk wird simuliert — kein echter Schlüssel, kein echter Aufruf.

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildDecodeBody,
  createAnthropicDecoder,
  extractText,
  friendlyError,
  parseDecoding,
} from './anthropic';

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
