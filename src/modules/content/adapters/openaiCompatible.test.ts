// Der generische Adapter. Die Port-Schicht behauptet seit Monaten, Anbieter
// seien austauschbar — diese Tests sind der Beleg dafür, und sie prüfen genau
// das, woran ein Nutzer in der Praxis scheitert: die Adresse.

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildBody,
  createOpenAiDecoder,
  createOpenAiSparringPartner,
  endpunkt,
  extractText,
  type OpenAiCompatibleConfig,
} from './openaiCompatible';
import { GENERATE_SYSTEM, generateUser, SPARRING_SYSTEM, sparringUser } from './prompts';
import { buildGenerateBody, buildSparringBody } from './anthropic';

const CFG: OpenAiCompatibleConfig = {
  baseUrl: 'https://api.example.com/v1',
  apiKey: 'sk-test',
  model: 'irgendein-modell',
};

afterEach(() => vi.unstubAllGlobals());

/** Antwortet wie ein OpenAI-kompatibler Dienst. */
function stub(inhalt: string) {
  // Die Parameter werden nicht benutzt, aber getypt: Nur so kommt der Test
  // später typsicher an die mitgeschickten Kopfzeilen.
  const fetchSpy = vi.fn((url: string, init: RequestInit) => {
    void url;
    void init;
    return Promise.resolve(
      new Response(JSON.stringify({ choices: [{ message: { content: inhalt } }] }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
  });
  vi.stubGlobal('fetch', fetchSpy);
  return fetchSpy;
}

describe('Die Adresse — daran scheitern Nutzer wirklich', () => {
  it('ergänzt den Pfad, egal wie viel schon dasteht', () => {
    const ziel = 'https://api.example.com/v1/chat/completions';
    expect(endpunkt('https://api.example.com')).toBe(ziel);
    expect(endpunkt('https://api.example.com/')).toBe(ziel);
    expect(endpunkt('https://api.example.com/v1')).toBe(ziel);
    expect(endpunkt('https://api.example.com/v1/')).toBe(ziel);
    expect(endpunkt('  https://api.example.com/v1/chat/completions  ')).toBe(ziel);
  });

  it('funktioniert auch für einen Server auf dem eigenen Rechner', () => {
    expect(endpunkt('http://localhost:11434/v1')).toBe(
      'http://localhost:11434/v1/chat/completions',
    );
  });

  it('sagt es, wenn gar keine Adresse dasteht', () => {
    expect(() => endpunkt('   ')).toThrow(/Adresse/);
  });
});

describe('Der Draht', () => {
  it('schickt Systemanweisung und Nutzertext als zwei Nachrichten', () => {
    const body = JSON.parse(buildBody('SYS', 'USER', 'm', 42));
    expect(body.messages).toEqual([
      { role: 'system', content: 'SYS' },
      { role: 'user', content: 'USER' },
    ]);
    // Beide Namen für dieselbe Grenze: Viele Dienste kennen nur den alten.
    expect(body.max_tokens).toBe(42);
    expect(body.max_completion_tokens).toBe(42);
  });

  it('liest den Text aus der Antwort — auch als Teile-Liste', () => {
    expect(extractText({ choices: [{ message: { content: ' hallo ' } }] })).toBe('hallo');
    expect(
      extractText({ choices: [{ message: { content: [{ text: 'a' }, { text: 'b' }] } }] }),
    ).toBe('ab');
    expect(extractText({})).toBe('');
  });

  it('schickt OHNE Zugang keinen Authorization-Header', async () => {
    // Lokale Server antworten sonst mit 401 — und dann sucht der Nutzer den
    // Fehler bei sich, obwohl er alles richtig gemacht hat.
    const f = stub(JSON.stringify({ tokens: [{ sv: 'hur', de: 'wie' }] }));
    await createOpenAiDecoder({ ...CFG, apiKey: '' }).decode('hur mår du?');
    const kopf = f.mock.calls[0][1].headers as Record<string, string>;
    expect(kopf.authorization).toBeUndefined();
  });

  it('schickt MIT Zugang einen Bearer-Header', async () => {
    const f = stub(JSON.stringify({ tokens: [{ sv: 'hur', de: 'wie' }] }));
    await createOpenAiDecoder(CFG).decode('hur mår du?');
    const kopf = f.mock.calls[0][1].headers as Record<string, string>;
    expect(kopf.authorization).toBe('Bearer sk-test');
  });
});

describe('Anbieter sind wirklich austauschbar', () => {
  it('beide Adapter stellen die GLEICHE Aufgabe — nur anders verpackt', () => {
    // Der Beleg für die Port-Schicht: Systemanweisung und Nutzertext sind
    // identisch, es unterscheidet sich nur das Format der Anfrage.
    const req = { chunkId: 'c', sv: 'tack', de: 'danke', level: 2 };
    const anthropic = JSON.parse(buildGenerateBody(req, 'claude'));
    const offen = JSON.parse(buildBody(GENERATE_SYSTEM, generateUser(req), 'anderes', 600));

    expect(anthropic.system).toBe(offen.messages[0].content);
    expect(anthropic.messages[0].content).toBe(offen.messages[1].content);
  });

  it('auch für den Sparringspartner', () => {
    const req = {
      scene: 'Café',
      partner: 'Elin',
      learnerName: 'Anna',
      targets: [{ sv: 'tack', de: 'danke' }],
      history: [],
    };
    const anthropic = JSON.parse(buildSparringBody(req, 'claude'));
    const offen = JSON.parse(buildBody(SPARRING_SYSTEM, sparringUser(req), 'anderes', 400));
    expect(anthropic.system).toBe(offen.messages[0].content);
    expect(anthropic.messages[0].content).toBe(offen.messages[1].content);
  });

  it('der Sparringspartner antwortet über den generischen Adapter', async () => {
    stub(JSON.stringify({ sv: 'Vad vill du ha?', de: 'Was möchtest du?' }));
    const r = await createOpenAiSparringPartner(CFG).reply({
      scene: 'Café',
      partner: 'Elin',
      learnerName: '',
      targets: [{ sv: 'en kaffe tack', de: 'einen Kaffee bitte' }],
      history: [],
    });
    expect(r.sv).toBe('Vad vill du ha?');
    expect(r.de).toBe('Was möchtest du?');
  });
});
