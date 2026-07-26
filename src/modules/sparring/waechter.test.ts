// Der Wächter. Zwei Fragen entscheiden über ihn, und beide werden hier gestellt:
// Fängt er das, wofür er gebaut ist? Und lässt er echte Zeilen in Ruhe?
//
// Die zweite ist die wichtigere. Ein Wächter, der richtige Antworten verwirft,
// macht den Modus kaputt, den er schützen soll.

import { describe, expect, it } from 'vitest';
import { seedDialogs } from '../content/seedDialogs';
import { befundText, MAX_ZEICHEN, pruefeAntwort } from './waechter';

const antwort = (sv: string) => ({ sv, de: 'egal' });

describe('Was der Wächter fangen MUSS', () => {
  it('erkennt eine deutsche Antwort', () => {
    // Der Fall aus der Nutzerfrage: „Den könnte ich ja theoretisch alles fragen."
    const b = pruefeAntwort(antwort('Ich kann dir gerne alles über Quantenphysik erklären.'), []);
    expect(b?.art).toBe('nicht-schwedisch');
  });

  it('erkennt eine englische Antwort', () => {
    const b = pruefeAntwort(antwort('Sure, I can help you with that.'), []);
    expect(b?.art).toBe('nicht-schwedisch');
  });

  it('erkennt einen Vortrag statt einer Gesprächszeile', () => {
    const b = pruefeAntwort(antwort('hej '.repeat(MAX_ZEICHEN)), []);
    expect(b?.art).toBe('kein-gespraech');
  });

  it('erkennt es, wenn der Partner die Lösung vorsagt', () => {
    // Die Regel, die den ganzen Modus trägt — sie stand bisher nur im Prompt.
    const b = pruefeAntwort(antwort('Du kan säga tack så mycket nu.'), [
      { sv: 'tack så mycket', de: 'vielen Dank' },
    ]);
    expect(b?.art).toBe('verraet-loesung');
  });

  it('erkennt eine leere Antwort', () => {
    expect(pruefeAntwort(antwort('   '), [])?.art).toBe('leer');
  });

  it('sagt in jedem Fall einen verständlichen Satz', () => {
    const faelle = [
      pruefeAntwort(antwort('Ich bin nicht hier.'), [])!,
      pruefeAntwort(antwort('hej '.repeat(MAX_ZEICHEN)), [])!,
      pruefeAntwort(antwort('säg tack'), [{ sv: 'tack', de: 'danke' }])!,
      pruefeAntwort(antwort(''), [])!,
    ];
    for (const f of faelle) expect(befundText(f).length).toBeGreaterThan(10);
  });
});

describe('Was der Wächter in RUHE lassen muss', () => {
  it('beanstandet keine einzige echte Partner-Zeile', () => {
    // Geeicht an allen 603 Zeilen des kuratierten Inhalts. Dabei fielen `den`
    // und `dem` aus der Wortliste — beides sind ganz gewöhnliche schwedische
    // Wörter, und mit ihnen hätte der Wächter 51 richtige Zeilen verworfen.
    const verstoesse: string[] = [];
    for (const d of seedDialogs) {
      for (const t of d.turns) {
        if (t.speaker !== 'partner') continue;
        const b = pruefeAntwort({ sv: t.sv, de: t.de }, []);
        if (b) verstoesse.push(`${d.id}: „${t.sv}" — ${befundText(b)}`);
      }
    }
    expect(verstoesse).toEqual([]);
  });

  it('lässt „den" und „dem" durch — die sind schwedisch', () => {
    expect(pruefeAntwort(antwort('Här är den.'), [])).toBeNull();
    expect(pruefeAntwort(antwort('Ge det till dem.'), [])).toBeNull();
  });

  it('prüft die FORM, nicht das Thema', () => {
    // Keine Themenpolizei: Worüber der Partner redet, ist Gespräch.
    expect(pruefeAntwort(antwort('Vad tycker du om vädret idag?'), [])).toBeNull();
    expect(pruefeAntwort(antwort('Min katt heter Pelle.'), [])).toBeNull();
  });

  it('stört sich nicht an der deutschen Übersetzung — nur die sv-Zeile zählt', () => {
    expect(pruefeAntwort({ sv: 'Vad vill du ha?', de: 'Was möchtest du haben?' }, [])).toBeNull();
  });
});
