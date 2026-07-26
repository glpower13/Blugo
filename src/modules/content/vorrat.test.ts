// Der Vorrat gibt Geld aus, ohne dass jemand klickt. Diese Tests halten die
// drei Zusagen fest, unter denen das erlaubt ist: gedeckelt, abbrechbar, und
// nie mit einem Freispruch von gestern.

import { describe, expect, it } from 'vitest';
import type { Chunk, Segment } from '../../domain/chunk';
import type { VorratEintrag } from '../../storage/db';
import type { ContentGenerator, GenerateSegmentRequest } from './ports';
import { wissenAus } from './quality/wissen';
import {
  fuelleVorrat,
  nimmAusVorrat,
  NACHSCHUB_PRO_SITZUNG,
  VORRAT_MAX,
  type VorratSpeicher,
} from './vorrat';

const WISSEN = wissenAus(['tack', 'så', 'mycket', 'hej', 'då', 'jag', 'säger'], {
  tack: ['danke'],
});

function chunk(id: string, sv: string, de: string): Chunk {
  return { id, sv, de, categoryId: 'c', decoding: [{ sv, de }] };
}

/** Ablage im Arbeitsspeicher — dieselbe Schnittstelle, ohne IndexedDB. */
function speicher(): VorratSpeicher & { inhalt: VorratEintrag[] } {
  const inhalt: VorratEintrag[] = [];
  return {
    inhalt,
    async fuer(chunkId) {
      return inhalt.filter((e) => e.chunkId === chunkId);
    },
    async anzahl() {
      return inhalt.length;
    },
    async hinzu(e) {
      inhalt.push(e);
    },
    async weg(id) {
      const i = inhalt.findIndex((e) => e.id === id);
      if (i >= 0) inhalt.splice(i, 1);
    },
  };
}

/** Generator, der zu jeder Wendung einen sauberen Satz liefert. */
function guterGenerator(): ContentGenerator & { rufe: GenerateSegmentRequest[] } {
  const rufe: GenerateSegmentRequest[] = [];
  return {
    id: 'test',
    rufe,
    async generate(req) {
      rufe.push(req);
      return {
        id: `ai:${req.chunkId}`,
        level: 2,
        sv: req.sv,
        de: req.de,
        decoding: [{ sv: req.sv, de: req.de }],
        chunkIds: [req.chunkId],
      } satisfies Segment;
    },
  };
}

const auftrag = (chunks: Chunk[], generator: ContentGenerator, extra = {}) => ({
  chunks,
  bekanntFuer: () => [{ sv: 'hej', de: 'hallo' }],
  generator,
  wissen: WISSEN,
  modell: 'test-modell',
  jetzt: 1_000,
  ...extra,
});

describe('Vorrat füllen', () => {
  it('legt für jede kommende Wendung einen Satz an', async () => {
    const s = speicher();
    const r = await fuelleVorrat(s, auftrag([chunk('a', 'tack', 'danke')], guterGenerator()));
    expect(r.erzeugt).toBe(1);
    expect(r.ende).toBe('fertig');
    expect(s.inhalt[0].chunkId).toBe('a');
  });

  it('baut aus BEKANNTEM — sonst wäre es kein i+1 mehr', async () => {
    const g = guterGenerator();
    await fuelleVorrat(speicher(), auftrag([chunk('a', 'tack', 'danke')], g));
    expect(g.rufe[0].known).toEqual([{ sv: 'hej', de: 'hallo' }]);
  });

  it('hält die Tagesration ein', async () => {
    const s = speicher();
    const viele = Array.from({ length: NACHSCHUB_PRO_SITZUNG + 3 }, (_, i) =>
      chunk(`c${i}`, 'tack', 'danke'),
    );
    const r = await fuelleVorrat(s, auftrag(viele, guterGenerator()));
    expect(r.erzeugt).toBe(NACHSCHUB_PRO_SITZUNG);
    expect(r.ende).toBe('ration');
  });

  it('hält den Deckel ein, auch über Sitzungen hinweg', async () => {
    const s = speicher();
    // Vorrat schon randvoll aus früheren Sitzungen.
    for (let i = 0; i < VORRAT_MAX; i++) {
      await s.hinzu({
        id: `alt${i}`,
        chunkId: `alt${i}`,
        segment: {} as Segment,
        erzeugtAm: 1,
        modell: 'x',
      });
    }
    const r = await fuelleVorrat(s, auftrag([chunk('neu', 'tack', 'danke')], guterGenerator()));
    expect(r.erzeugt).toBe(0);
    expect(r.ende).toBe('deckel');
  });

  it('versorgt dieselbe Wendung nicht zweimal', async () => {
    const s = speicher();
    const c = chunk('a', 'tack', 'danke');
    await fuelleVorrat(s, auftrag([c], guterGenerator()));
    const r = await fuelleVorrat(s, auftrag([c], guterGenerator()));
    expect(r.erzeugt).toBe(0);
    expect(s.inhalt).toHaveLength(1);
  });

  it('bricht ab, wenn die Sitzung verlassen wird', async () => {
    const s = speicher();
    let raus = false;
    const g: ContentGenerator = {
      id: 't',
      async generate(req) {
        raus = true; // nach dem ersten Aufruf verlässt der Lerner die Sitzung
        return {
          id: 'x',
          level: 2,
          sv: req.sv,
          de: req.de,
          decoding: [{ sv: req.sv, de: req.de }],
          chunkIds: [req.chunkId],
        };
      },
    };
    const r = await fuelleVorrat(
      s,
      auftrag([chunk('a', 'tack', 'danke'), chunk('b', 'hej', 'hallo')], g, {
        abbruch: () => raus,
      }),
    );
    expect(r.ende).toBe('abbruch');
    expect(r.erzeugt).toBe(1);
  });

  it('hört beim ersten Fehler auf, statt weiter Geld auszugeben', async () => {
    const s = speicher();
    let rufe = 0;
    const kaputt: ContentGenerator = {
      id: 't',
      async generate() {
        rufe++;
        throw new Error('429');
      },
    };
    const r = await fuelleVorrat(
      s,
      auftrag([chunk('a', 'tack', 'danke'), chunk('b', 'hej', 'hallo')], kaputt),
    );
    expect(r.ende).toBe('fehler');
    // GENAU EIN Aufruf. Der zweite Anlauf des Tors gilt nur einem verworfenen
    // Satz — bei einem Anbieter-Fehler (429, Netz weg) sofort nachzuschlagen
    // hieße, in eine Sperre hineinzurennen. Und für die zweite Wendung wird
    // gar nicht erst angesetzt.
    expect(rufe).toBe(1);
    // Nichts wurde verworfen — es kam ja nichts an.
    expect(r.verworfen).toBe(0);
  });

  it('wirft nie — ein misslungener Nachschub ist kein Fehler des Lerners', async () => {
    const explodiert: ContentGenerator = {
      id: 't',
      async generate() {
        throw new Error('Netz weg');
      },
    };
    await expect(
      fuelleVorrat(speicher(), auftrag([chunk('a', 'tack', 'danke')], explodiert)),
    ).resolves.toMatchObject({ ende: 'fehler' });
  });
});

describe('Vorrat verbrauchen', () => {
  const c = chunk('a', 'tack', 'danke');

  const eintrag = (sv: string, erzeugtAm = 1): VorratEintrag => ({
    id: `v:${sv}:${erzeugtAm}`,
    chunkId: 'a',
    segment: {
      id: `v:${sv}`,
      level: 2,
      sv,
      de: 'danke',
      decoding: [{ sv: 'tack', de: 'danke' }],
      chunkIds: ['a'],
    },
    erzeugtAm,
    modell: 'test',
  });

  it('gibt einen liegenden Satz heraus und entfernt ihn', async () => {
    const s = speicher();
    await s.hinzu(eintrag('tack'));
    const raus = await nimmAusVorrat(s, c, WISSEN);
    expect(raus?.segment.sv).toBe('tack');
    expect(s.inhalt).toHaveLength(0);
  });

  it('gibt null zurück, wenn nichts bereitliegt', async () => {
    expect(await nimmAusVorrat(speicher(), c, WISSEN)).toBeNull();
  });

  it('prüft mit den Regeln von JETZT, nicht mit dem Freispruch von damals', async () => {
    const s = speicher();
    // Der Satz enthält die Wendung „tack" nicht mehr — er würde heute verworfen.
    await s.hinzu({
      ...eintrag('jag säger så'),
      segment: {
        id: 'v:alt',
        level: 2,
        sv: 'jag säger så',
        de: 'ich sage so',
        decoding: [
          { sv: 'jag', de: 'ich' },
          { sv: 'säger', de: 'sage' },
          { sv: 'så', de: 'so' },
        ],
        chunkIds: ['a'],
      },
    });
    expect(await nimmAusVorrat(s, c, WISSEN)).toBeNull();
    // Und er ist weg: Was heute durchfällt, fällt morgen wieder durch.
    expect(s.inhalt).toHaveLength(0);
  });

  it('nimmt den ältesten zuerst', async () => {
    const s = speicher();
    await s.hinzu(eintrag('tack så mycket', 200));
    await s.hinzu(eintrag('tack', 100));
    expect((await nimmAusVorrat(s, c, WISSEN))?.segment.sv).toBe('tack');
  });
});
