// Eine Regel zur Wortstellung ist nur so gut wie ihre FEHLtreffer-Quote. Diese
// Tests fahren deshalb beide Richtungen: Sie muss die zwei Fehler fangen, für
// die sie gebaut ist — und sie muss richtiges Schwedisch in Ruhe lassen, auch
// dort, wo es dem Muster ähnlich sieht.

import { describe, expect, it } from 'vitest';
import { wortstellung } from './checks';

const meldet = (sv: string) => wortstellung(sv).length > 0;

describe('Wortstellung — was gefangen werden MUSS', () => {
  it('meldet die deutsche Stellung der Verneinung', () => {
    // Der Fehler, den ein aus dem Deutschen denkendes Modell wirklich macht.
    expect(meldet('jag inte förstår')).toBe(true);
    expect(meldet('vi inte kan komma idag')).toBe(true);
    expect(meldet('han aldrig kommer hit')).toBe(true);
  });

  it('meldet die fehlende Umstellung nach einem Vorfeld', () => {
    expect(meldet('imorgon jag kommer till dig')).toBe(true);
    expect(meldet('idag vi äter middag')).toBe(true);
    expect(meldet('tyvärr jag kan inte')).toBe(true);
  });

  it('sagt im Befund, WAS falsch steht', () => {
    const [b] = wortstellung('jag inte förstår');
    expect(b.was).toContain('inte');
    expect(b.was).toContain('HINTER dem Verb');
  });

  it('findet den Fehler auch im zweiten Satz', () => {
    expect(meldet('Hej! Imorgon jag kommer till dig.')).toBe(true);
  });
});

describe('Wortstellung — was in Ruhe gelassen werden MUSS', () => {
  it('lässt die richtige Stellung durch', () => {
    expect(meldet('jag förstår inte')).toBe(false);
    expect(meldet('imorgon kommer jag till dig')).toBe(false);
    expect(meldet('idag äter vi middag')).toBe(false);
  });

  it('lässt den NEBENSATZ durch — dort steht die Verneinung genau so', () => {
    // Der Grund, warum die Regeln nur am Satzanfang greifen: „att jag inte
    // förstår" ist richtig, „jag inte förstår" ist es nicht.
    expect(meldet('han sa att jag inte förstår')).toBe(false);
    expect(meldet('om du inte kan komma, ring mig')).toBe(false);
    expect(meldet('jag vet att vi inte hinner')).toBe(false);
  });

  it('lässt den Einschub mit Komma durch', () => {
    // Fünfmal im eigenen geprüften Inhalt — ohne diese Ausnahme hätte die Regel
    // den Bestand angemeckert, gegen den sie geeicht wurde.
    expect(meldet('Tyvärr, jag kan inte')).toBe(false);
    expect(meldet('Förresten, det är kalas hos min syster snart')).toBe(false);
  });

  it('lässt die echten Ausnahmen des Schwedischen durch', () => {
    // `kanske` verlangt keine Umstellung — die berühmte Ausnahme.
    expect(meldet('kanske jag kan komma')).toBe(false);
    // `sedan`, `då` und `där` leiten auch Nebensätze ein.
    expect(meldet('sedan jag kom hit har allt varit bra')).toBe(false);
    expect(meldet('då jag var liten bodde vi här')).toBe(false);
    expect(meldet('där jag bor finns ingen affär')).toBe(false);
  });

  it('lässt Modalpartikeln durch, die gesprochen vorkommen', () => {
    // „det bara händer" ist Umgangssprache, kein Fehler. Eine Regel, die
    // gesprochenes Schwedisch anmeckert, ist eine Meinung, keine Regel.
    expect(meldet('det bara händer')).toBe(false);
    expect(meldet('du nog vet det')).toBe(false);
  });

  it('meldet nichts bei zu kurzen Fetzen', () => {
    expect(meldet('jag inte')).toBe(false);
    expect(meldet('hej')).toBe(false);
    expect(meldet('')).toBe(false);
  });
});
