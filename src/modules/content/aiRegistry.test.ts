// Tests der KI-Port-Schicht: Standard-Belegung, Austauschbarkeit (Ports & Adapters)
// und das ehrliche Verhalten der Seed-Adapter.

import { afterEach, describe, expect, it } from 'vitest';
import { aiRegistry, resetAiPorts, setAiPorts } from './aiRegistry';
import { seedDecoder, seedGenerator } from './adapters/seed';
import type { ContentGenerator } from './ports';

afterEach(() => resetAiPorts());

describe('aiRegistry — Ports & Adapters', () => {
  it('liefert die Standard-Adapter (Seed + Web-Speech in beide Richtungen)', () => {
    expect(aiRegistry.generator.id).toBe('seed');
    expect(aiRegistry.decoder.id).toBe('seed');
    expect(aiRegistry.synthesizer.id).toBe('web-speech');
    // Seit P1 (docs/gremium-sprachpartner.md §9) ist auch das Zuhören belegt.
    expect(aiRegistry.recognizer?.id).toBe('web-speech');
    expect(aiRegistry.explainer).toBeNull();
  });

  it('meldet die Spracheingabe ohne Browser als nicht verfügbar (kein toter Knopf)', () => {
    expect(aiRegistry.recognizer?.isAvailable()).toBe(false);
  });

  it('erlaubt das Tauschen eines Adapters, ohne die Aufrufer zu ändern', () => {
    const fake: ContentGenerator = {
      id: 'fake-provider',
      async generate() {
        throw new Error('nur ein Platzhalter');
      },
    };
    setAiPorts({ generator: fake });
    expect(aiRegistry.generator.id).toBe('fake-provider');
    resetAiPorts();
    expect(aiRegistry.generator.id).toBe('seed');
  });

  it('synthesizer.isAvailable() liefert einen Boolean und speak() wirft nicht', async () => {
    expect(typeof aiRegistry.synthesizer.isAvailable()).toBe('boolean');
    await expect(aiRegistry.synthesizer.speak({ text: 'hej' })).resolves.toBeUndefined();
  });
});

describe('seedGenerator — bedient Seed-Kontexte (Kontextvariation)', () => {
  const hej = { chunkId: 'c-hej', sv: 'hur mår du?', de: 'wie geht es dir?', level: 1 };

  it('liefert ein Segment, das den Ziel-Chunk enthält', async () => {
    const seg = await seedGenerator.generate(hej);
    expect(seg.chunkIds).toContain('c-hej');
  });

  it('bevorzugt einen noch ungesehenen Kontext', async () => {
    const first = await seedGenerator.generate(hej);
    const second = await seedGenerator.generate({ ...hej, avoidSegmentIds: [first.id] });
    expect(second.id).not.toBe(first.id);
  });

  it('ist ehrlich: unbekannter Chunk → Fehler statt erfundenem Inhalt', async () => {
    await expect(
      seedGenerator.generate({ chunkId: 'gibt-es-nicht', sv: 'x', de: 'y', level: 1 }),
    ).rejects.toThrow(/Anbieter-Adapter/);
  });
});

describe('seedDecoder — kennt nur Seed-Inhalt', () => {
  it('liefert die bekannte Dekodierung eines Seed-Chunks', async () => {
    const tokens = await seedDecoder.decode('jag heter');
    expect(tokens).toEqual([
      { sv: 'jag', de: 'ich' },
      { sv: 'heter', de: 'heiße' },
    ]);
  });

  it('Fallback für unbekannten Text: Wort-für-Wort mit offener DE-Seite', async () => {
    const tokens = await seedDecoder.decode('okänt ord');
    expect(tokens).toEqual([
      { sv: 'okänt', de: '?' },
      { sv: 'ord', de: '?' },
    ]);
  });
});
