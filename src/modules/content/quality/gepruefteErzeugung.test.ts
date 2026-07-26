import { describe, expect, it } from 'vitest';
import type { Chunk, Segment } from '../../../domain/chunk';
import type { ContentGenerator, GenerateSegmentRequest } from '../ports';
import { erzeugeGeprueft, NichtBestanden } from './gepruefteErzeugung';
import { wissenAus } from './wissen';

const CHUNK: Chunk = {
  id: 'tack',
  sv: 'tack',
  de: 'danke',
  categoryId: 'hoeflich',
  decoding: [{ sv: 'tack', de: 'danke' }],
};

const WISSEN = wissenAus(['tack', 'så', 'mycket', 'jag', 'säger'], { tack: ['danke'] });

const REQ: GenerateSegmentRequest = {
  chunkId: 'tack',
  sv: 'tack',
  de: 'danke',
  level: 2,
};

/** Ein Generator, der die vorgegebenen Sätze der Reihe nach liefert. */
function generatorMit(...sätze: Partial<Segment>[]): ContentGenerator & { gesehen: GenerateSegmentRequest[] } {
  const gesehen: GenerateSegmentRequest[] = [];
  let i = 0;
  return {
    id: 'test',
    gesehen,
    async generate(req) {
      gesehen.push(req);
      const s = sätze[Math.min(i, sätze.length - 1)];
      i++;
      return {
        id: `ai:${i}`,
        level: 2,
        sv: '',
        de: '',
        decoding: [],
        chunkIds: ['tack'],
        ...s,
      } as Segment;
    },
  };
}

const GUT: Partial<Segment> = {
  sv: 'tack så mycket',
  de: 'danke schön',
  decoding: [
    { sv: 'tack', de: 'danke' },
    { sv: 'så', de: 'so' },
    { sv: 'mycket', de: 'viel' },
  ],
};

// Kaputt: „tack" kommt im Satz gar nicht vor — der Satz übt die Wendung nicht.
const OHNE_WENDUNG: Partial<Segment> = {
  sv: 'jag säger så',
  de: 'ich sage so',
  decoding: [
    { sv: 'jag', de: 'ich' },
    { sv: 'säger', de: 'sage' },
    { sv: 'så', de: 'so' },
  ],
};

describe('erzeugeGeprueft', () => {
  it('gibt einen sauberen Satz beim ersten Versuch zurück', async () => {
    const { segment, ergebnis, versuche } = await erzeugeGeprueft(
      generatorMit(GUT),
      REQ,
      CHUNK,
      WISSEN,
    );
    expect(segment.sv).toBe('tack så mycket');
    expect(ergebnis.angenommen).toBe(true);
    expect(versuche).toBe(1);
  });

  it('verwirft den kaputten Satz und nimmt den zweiten', async () => {
    const gen = generatorMit(OHNE_WENDUNG, GUT);
    const { segment, versuche } = await erzeugeGeprueft(gen, REQ, CHUNK, WISSEN);
    expect(segment.sv).toBe('tack så mycket');
    expect(versuche).toBe(2);
    // Der abgelehnte Satz wird beim zweiten Anlauf ausdrücklich gemieden —
    // sonst käme plausibel derselbe Fehler zurück.
    expect(gen.gesehen[1].avoidSegmentIds).toContain('ai:1');
  });

  it('wirft nach zwei Fehlversuchen — und zeigt NICHTS', async () => {
    await expect(erzeugeGeprueft(generatorMit(OHNE_WENDUNG), REQ, CHUNK, WISSEN)).rejects.toThrow(
      NichtBestanden,
    );
  });

  it('sagt im Fehlertext, WORAN es lag', async () => {
    let fehler: NichtBestanden | null = null;
    try {
      await erzeugeGeprueft(generatorMit(OHNE_WENDUNG), REQ, CHUNK, WISSEN);
    } catch (e) {
      fehler = e as NichtBestanden;
    }
    expect(fehler).toBeInstanceOf(NichtBestanden);
    expect(fehler!.message).toContain('tack');
    expect(fehler!.message).toMatch(/nicht wiederzuerkennen/);
    // Und dass der geprüfte Satz weiter gilt — der Lerner steht nicht ohne da.
    expect(fehler!.message).toMatch(/geprüfte Satz oben gilt weiter/);
  });

  it('probiert nicht endlos — zwei Versuche, nicht fünf', async () => {
    const gen = generatorMit(OHNE_WENDUNG);
    await erzeugeGeprueft(gen, REQ, CHUNK, WISSEN).catch(() => undefined);
    expect(gen.gesehen).toHaveLength(2);
  });
});
