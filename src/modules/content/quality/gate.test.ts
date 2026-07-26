// Ein Tor, das alles durchlässt, ist kein Tor. Diese Tests füttern absichtlich
// kaputte Sätze ein — jeder Fall entspricht einem Fehler, den ein Sprachmodell
// wirklich macht.

import { describe, expect, it } from 'vitest';
import { beschriftung, pruefeSegment, type Wissen } from './gate';
import type { Chunk, Segment } from '../../../domain/chunk';

const chunk: Chunk = {
  id: 'c-test',
  categoryId: 'cat-test',
  sv: 'jag har ont här',
  de: 'mir tut es hier weh',
  decoding: [
    { sv: 'jag', de: 'ich' },
    { sv: 'har', de: 'habe' },
    { sv: 'ont', de: 'Schmerz' },
    { sv: 'här', de: 'hier' },
  ],
};

const wissen: Wissen = {
  woerter: new Set(['jag', 'har', 'ont', 'här', 'och', 'det', 'gör', 'inte', 'ont', 'två', 'dagar']),
  glossen: { ont: ['schmerz'], här: ['hier'], jag: ['ich'], har: ['habe'] },
  // Grobe Beugungs-Regel für den Test: gemeinsamer Stamm ab drei Zeichen.
  istBeugung: (a, b) => a.slice(0, 3) === b.slice(0, 3),
};

const seg = (o: Partial<Segment>): Segment => ({
  id: 'ai:c-test',
  level: 1,
  sv: 'jag har ont här idag',
  de: 'mir tut es hier heute weh',
  decoding: [
    { sv: 'jag', de: 'ich' },
    { sv: 'har', de: 'habe' },
    { sv: 'ont', de: 'Schmerz' },
    { sv: 'här', de: 'hier' },
    { sv: 'idag', de: 'heute' },
  ],
  chunkIds: ['c-test'],
  ...o,
});

describe('Tor für KI-erzeugte Sätze', () => {
  it('lässt einen sauberen Satz durch', () => {
    const r = pruefeSegment(seg({}), chunk, wissen);
    expect(r.angenommen).toBe(true);
    expect(r.befunde.filter((b) => b.art === 'hart')).toEqual([]);
  });

  it('verwirft einen Satz ohne die Ziel-Wendung', () => {
    // Der häufigste Modellfehler: ein schöner Satz, der das Ziel nicht übt.
    const r = pruefeSegment(
      seg({
        sv: 'vi ses i morgon',
        decoding: [
          { sv: 'vi', de: 'wir' },
          { sv: 'ses', de: 'sehen uns' },
          { sv: 'i', de: 'am' },
          { sv: 'morgon', de: 'Morgen' },
        ],
      }),
      chunk,
      wissen,
    );
    expect(r.angenommen).toBe(false);
    expect(r.befunde.some((b) => b.text.includes('nicht wiederzuerkennen'))).toBe(true);
  });

  it('verwirft eine unvollständige Dekodierung', () => {
    // Eine Lücke verschiebt die ganze interlineare Zuordnung.
    const r = pruefeSegment(
      seg({ decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }] }),
      chunk,
      wissen,
    );
    expect(r.angenommen).toBe(false);
    expect(r.befunde.some((b) => b.text.includes('Ohne Wort-für-Wort-Bedeutung'))).toBe(true);
  });

  it('verwirft eine Dekodierung mit erfundenen Wörtern', () => {
    const r = pruefeSegment(
      seg({ decoding: [...seg({}).decoding, { sv: 'kaffe', de: 'Kaffee' }] }),
      chunk,
      wissen,
    );
    expect(r.angenommen).toBe(false);
    expect(r.befunde.some((b) => b.text.includes('im Satz nicht stehen'))).toBe(true);
  });

  it('verwirft eine gedrehte Verneinung', () => {
    // Der teuerste Fehler: Der Lerner lernt das Gegenteil.
    const r = pruefeSegment(
      seg({ sv: 'jag har inte ont här', de: 'mir tut es hier weh',
        decoding: [...seg({}).decoding.slice(0, 2), { sv: 'inte', de: 'nicht' }, ...seg({}).decoding.slice(2, 4)] }),
      chunk,
      wissen,
    );
    expect(r.angenommen).toBe(false);
    expect(r.befunde.some((b) => b.text.includes('verneint'))).toBe(true);
  });

  it('verwirft eine Glosse, die dem geprüften Inhalt widerspricht', () => {
    const r = pruefeSegment(
      seg({ decoding: seg({}).decoding.map((t) => (t.sv === 'ont' ? { sv: 'ont', de: 'Freude' } : t)) }),
      chunk,
      wissen,
    );
    expect(r.angenommen).toBe(false);
    expect(r.befunde.some((b) => b.text.includes('im geprüften Inhalt aber'))).toBe(true);
  });

  it('hält eine BEUGUNG derselben Bedeutung nicht für einen Widerspruch', () => {
    // Bewusst an einem INHALTSWORT geprüft: Funktionswörter kommen unten ohnehin
    // durch, an ihnen wäre die Beugungsregel nicht nachgewiesen.
    const r = pruefeSegment(
      seg({ decoding: seg({}).decoding.map((t) => (t.sv === 'ont' ? { sv: 'ont', de: 'Schmerzen' } : t)) }),
      chunk,
      wissen,
    );
    expect(r.angenommen).toBe(true);
  });

  it('verwirft KEINE abweichende Glosse bei einem Funktionswort', () => {
    // `har` heißt je nach Satz „habe/hat/ist/hast" — das Deutsche bildet der
    // Satz, nicht das schwedische Wort. Das Tor darf hier nicht strenger sein
    // als die Bauprüfung, sonst wirft es gute Sätze weg.
    const r = pruefeSegment(
      seg({ decoding: seg({}).decoding.map((t) => (t.sv === 'har' ? { sv: 'har', de: 'ist' } : t)) }),
      chunk,
      wissen,
    );
    expect(r.angenommen).toBe(true);
  });

  it('verwirft KEINE zweite Bedeutung, die die App selbst erklärt', () => {
    // `kort` steht in `polysemy.ts` mit „Karte" UND „kurz". Genau an so einem
    // Satz greift der Mehrdeutigkeits-Hinweis — ihn zu verwerfen hieße, den
    // Lernmoment wegzuwerfen.
    const r = pruefeSegment(
      seg({
        sv: 'jag har ont här kort',
        de: 'mir tut es hier kurz weh',
        decoding: [...seg({}).decoding.slice(0, 4), { sv: 'kort', de: 'kurz' }],
      }),
      chunk,
      { ...wissen, glossen: { ...wissen.glossen, kort: ['karte'] } },
    );
    expect(r.angenommen).toBe(true);
  });

  it('verwirft einen leeren Satz', () => {
    expect(pruefeSegment(seg({ sv: '' }), chunk, wissen).angenommen).toBe(false);
    expect(pruefeSegment(seg({ de: '' }), chunk, wissen).angenommen).toBe(false);
  });

  it('verwirft einen Satz ganz ohne Dekodierung', () => {
    const r = pruefeSegment(seg({ decoding: [] }), chunk, wissen);
    expect(r.angenommen).toBe(false);
    expect(r.befunde.some((b) => b.text.includes('keine Wort-für-Wort-Dekodierung'))).toBe(true);
  });

  it('lässt neue Wörter DURCH, nennt sie aber', () => {
    // Neue Wörter sind der Sinn von neuem Stoff — kein Fehler, aber die Grenze
    // dessen, was die App bestätigen kann.
    const r = pruefeSegment(
      seg({
        sv: 'jag har ont här på axeln',
        de: 'mir tut es hier an der Schulter weh',
        decoding: [...seg({}).decoding.slice(0, 4), { sv: 'på', de: 'an' }, { sv: 'axeln', de: 'der Schulter' }],
      }),
      chunk,
      wissen,
    );
    expect(r.angenommen).toBe(true);
    expect(r.unbekannt).toContain('axeln');
    expect(r.befunde.some((b) => b.art === 'offen')).toBe(true);
  });
});

describe('Beschriftung', () => {
  it('sagt, was geprüft wurde — und was nicht', () => {
    const t = beschriftung({ angenommen: true, befunde: [], unbekannt: [] });
    expect(t).toContain('Maschinell geprüft');
    expect(t).toContain('Muttersprachler');
  });

  it('nennt neue Wörter beim Namen, statt sie zu verschweigen', () => {
    const t = beschriftung({ angenommen: true, befunde: [], unbekannt: ['axeln'] });
    expect(t).toContain('axeln');
    expect(t).toContain('Neu für die App');
  });
});

describe('Stufe: ist der Satz noch i+1?', () => {
  const chunkTack: Chunk = {
    id: 'tack',
    categoryId: 'c',
    sv: 'tack',
    de: 'danke',
    decoding: [{ sv: 'tack', de: 'danke' }],
  };
  const segTack = (sv: string): Segment => ({
    id: 'ai:tack',
    level: 2,
    sv,
    de: 'irgendeine Bedeutung',
    decoding: sv.split(' ').map((w) => ({ sv: w, de: 'x' })),
    chunkIds: ['tack'],
  });
  const wissenMit = (gelernt?: string[]): Wissen => ({
    woerter: new Set<string>(),
    glossen: {},
    istBeugung: () => false,
    ...(gelernt ? { gelernt: new Set(gelernt) } : {}),
  });

  it('lässt einen Satz aus lauter Bekanntem durch', () => {
    const r = pruefeSegment(
      segTack('tack så mycket'),
      chunkTack,
      wissenMit(['så', 'mycket']),
    );
    expect(r.angenommen).toBe(true);
  });

  it('verwirft eine Wand aus lauter Unbekanntem', () => {
    const r = pruefeSegment(
      segTack('tack för hjälpen med den trasiga cykeln igår kväll'),
      chunkTack,
      wissenMit(['så']),
    );
    expect(r.angenommen).toBe(false);
    expect(r.befunde.some((b) => b.text.includes('Zu viel auf einmal'))).toBe(true);
  });

  it('rechnet die ZIEL-Wendung nicht als Last — sie IST das erlaubte „+1"', () => {
    const chunkLang: Chunk = { ...chunkTack, sv: 'kan du hjälpa mig', de: 'kannst du mir helfen' };
    const r = pruefeSegment(
      { ...segTack('kan du hjälpa mig'), chunkIds: ['tack'] },
      chunkLang,
      wissenMit([]), // der Lerner kennt NICHTS — trotzdem in Ordnung
    );
    expect(r.angenommen).toBe(true);
  });

  it('prüft die Stufe GAR NICHT, wenn kein Lernstand da ist', () => {
    // Raten wäre schlimmer als nicht prüfen — und die Beschriftung behauptet
    // den Punkt dann auch nicht.
    const r = pruefeSegment(
      segTack('tack för hjälpen med den trasiga cykeln igår kväll'),
      chunkTack,
      wissenMit(undefined),
    );
    expect(r.angenommen).toBe(true);
    expect(beschriftung(r, false)).not.toContain('schon kennst');
    expect(beschriftung(r, true)).toContain('schon kennst');
  });
});
