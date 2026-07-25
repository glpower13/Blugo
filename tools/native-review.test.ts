// Tests für das Register der muttersprachlichen Gegenlesung.
//
// „Muttersprachlich geprüft" ist die am leichtesten zu fälschende Zahl der App:
// Sie steht in einer JSON-Datei. Diese Tests sind die Wand dagegen — jede Art,
// wie ein Eintrag unbelegbar sein kann, hat hier ihren Fall.

import { describe, expect, it } from 'vitest';
import { nativeChunkIds, validate, type Register } from './native-review';
import { buildLevels } from './build-verification';

const BEKANNT = new Set(['c-eins', 'c-zwei', 'c-drei']);

const PRUEFENDE = [{ id: 'elin', name: 'Elin', herkunft: 'Muttersprachlerin, Göteborg' }];

function register(eintraege: Register['eintraege']): Register {
  return { pruefende: PRUEFENDE, eintraege };
}

describe('Register der muttersprachlichen Prüfung', () => {
  it('nimmt einen vollständigen Eintrag an', () => {
    const r = register([{ chunkId: 'c-eins', pruefer: 'elin', am: '2026-08-14', urteil: 'ok' }]);
    expect(validate(r, BEKANNT)).toEqual([]);
    expect(nativeChunkIds(r)).toEqual(new Set(['c-eins']));
  });

  it('weist eine Wendung ab, die es nicht gibt', () => {
    const r = register([{ chunkId: 'c-erfunden', pruefer: 'elin', am: '2026-08-14', urteil: 'ok' }]);
    expect(validate(r, BEKANNT).join()).toMatch(/gibt es nicht/);
  });

  it('weist eine unbekannte prüfende Person ab', () => {
    const r = register([{ chunkId: 'c-eins', pruefer: 'niemand', am: '2026-08-14', urteil: 'ok' }]);
    expect(validate(r, BEKANNT).join()).toMatch(/unbekannte prüfende Person/);
  });

  it('verlangt ein ISO-Datum', () => {
    for (const am of ['gestern', '14.08.2026', '', '2026-8-4']) {
      const r = register([{ chunkId: 'c-eins', pruefer: 'elin', am, urteil: 'ok' }]);
      expect(validate(r, BEKANNT).join(), am).toMatch(/Datum/);
    }
  });

  it('verlangt bei „korrigiert" die alte Fassung', () => {
    const ohne = register([
      { chunkId: 'c-eins', pruefer: 'elin', am: '2026-08-14', urteil: 'korrigiert' },
    ]);
    expect(validate(ohne, BEKANNT).join()).toMatch(/nicht nachvollziehbar/);

    const mit = register([
      {
        chunkId: 'c-eins',
        pruefer: 'elin',
        am: '2026-08-14',
        urteil: 'korrigiert',
        vorher: 'so stand es vorher',
      },
    ]);
    expect(validate(mit, BEKANNT)).toEqual([]);
  });

  it('lässt dieselbe Wendung nicht zweimal zählen', () => {
    const r = register([
      { chunkId: 'c-eins', pruefer: 'elin', am: '2026-08-14', urteil: 'ok' },
      { chunkId: 'c-eins', pruefer: 'elin', am: '2026-08-15', urteil: 'ok' },
    ]);
    expect(validate(r, BEKANNT).join()).toMatch(/doppelt geprüft/);
  });

  it('verlangt bei der prüfenden Person auch die Herkunft', () => {
    // Ein bloßer Name belegt keine Sprachkompetenz.
    const r: Register = {
      pruefende: [{ id: 'x', name: 'Jemand', herkunft: '' }],
      eintraege: [],
    };
    expect(validate(r, BEKANNT).join()).toMatch(/unvollständig/);
  });

  it('ein leeres Register ist gültig und ergibt null geprüfte Wendungen', () => {
    const r: Register = { pruefende: [], eintraege: [] };
    expect(validate(r, BEKANNT)).toEqual([]);
    expect(nativeChunkIds(r).size).toBe(0);
  });
});

describe('Prüf-Stand: „native" sticht die maschinellen Stufen', () => {
  // Die Chunk-Liste kommt aus dem echten Seed; wir prüfen nur das Verhalten der
  // Einstufung, nicht den Inhalt.
  const flagged = {
    dictionaryEntries: 100,
    wordsChecked: 0,
    stringsChecked: 0,
    flagged: {},
  };

  it('ohne Register bleibt „native" bei null', () => {
    const r = buildLevels(flagged);
    expect(r.meta.native).toBe(0);
    expect(Object.values(r.levels)).not.toContain('native');
  });

  it('eine gegengelesene Wendung wird „native" und zählt nicht mehr als maschinell', () => {
    const ohne = buildLevels(flagged);
    const mit = buildLevels(flagged, new Set(['c-hejda']));
    expect(mit.levels['c-hejda']).toBe('native');
    expect(mit.meta.native).toBe(1);
    expect(mit.meta.machine).toBe(ohne.meta.machine - 1);
  });

  it('die drei Stufen ergeben zusammen immer die Gesamtzahl', () => {
    const r = buildLevels(flagged, new Set(['c-hejda', 'c-tack']));
    const gesamt = Object.keys(r.levels).length;
    expect(r.meta.native + r.meta.machine + r.meta.unchecked).toBe(gesamt);
  });
});
