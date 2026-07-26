// ISTQB-Durchlauf für das Modul „Messung" (Stufe F der Prüfkaskade,
// docs/TEST-UND-PRUEF-STANDARD.md §2 F). Bericht:
// docs/ISTQB-Testbericht-Messung.md
//
// Strukturiertes Testdesign statt Bauchgefühl. Die drei Techniken, die hier
// etwas finden, das die Beispieltests übersehen:
//
//   · GRENZWERTANALYSE (BVA) — genau darunter / genau auf / genau darüber an
//     jeder Schwelle. Beide Schwellen dieses Projekts (21 und 90 Tage) sind
//     `>=`; ein `>` an einer der Stellen wäre ein Fehler, den kein Beispieltest
//     mit „50 Tagen" je bemerkt.
//   · ZUSTANDSÜBERGANGS-TESTS — jeder erlaubte und jeder verbotene Übergang im
//     Lebenszyklus einer Wendung.
//   · ENTSCHEIDUNGSTABELLE — jede Kombination der Bedingungen, aus denen sich
//     „bewiesen / reift / keins von beidem" ergibt.

import { describe, expect, it } from 'vitest';
import {
  DAY_MS,
  MATURING_INTERVAL_DAYS,
  STABLE_INTERVAL_DAYS,
  initialState,
  schedule,
} from '../memory/memoryEngine';
import { isMaturing, isStable } from './metrics';
import type { ChunkState, RetrievalStage } from '../../domain/chunk';

const T0 = 1_700_000_000_000;

/** Ein Zustand kurz VOR dem Abruf: Stufe und bereits überstandenes Intervall. */
function vorDemAbruf(stage: RetrievalStage, intervalDays: number): ChunkState {
  return {
    ...initialState('c', T0),
    stage,
    status: 'maintenance',
    intervalDays,
    stability: Math.max(1, intervalDays),
    difficulty: 5,
    successStreak: 3,
    lastReviewedAt: T0 - intervalDays * DAY_MS,
  };
}

describe('F · Grenzwertanalyse an den beiden Schwellen', () => {
  // Die Schwellen sind die einzigen Zahlen im Produkt, an denen „bewiesen"
  // hängt. Je drei Punkte: knapp darunter, exakt, knapp darüber.
  const faelle: Array<{ schwelle: number; feld: 'maturedAt' | 'provenStableAt'; name: string }> = [
    { schwelle: MATURING_INTERVAL_DAYS, feld: 'maturedAt', name: 'reift (21 Tage)' },
    { schwelle: STABLE_INTERVAL_DAYS, feld: 'provenStableAt', name: 'bewiesen (90 Tage)' },
  ];

  for (const { schwelle, feld, name } of faelle) {
    it(`${name}: genau darunter zählt NICHT`, () => {
      const s = schedule(vorDemAbruf('production', schwelle - 1), 'good', 'seg', T0);
      expect(s[feld]).toBeNull();
    });

    it(`${name}: genau AUF der Schwelle zählt`, () => {
      const s = schedule(vorDemAbruf('production', schwelle), 'good', 'seg', T0);
      expect(s[feld]).toBe(T0);
    });

    it(`${name}: knapp darüber zählt`, () => {
      const s = schedule(vorDemAbruf('production', schwelle + 1), 'good', 'seg', T0);
      expect(s[feld]).toBe(T0);
    });
  }

  it('Intervall 0 und negative Eingaben erzeugen keinen Vermerk', () => {
    for (const iv of [0, -1, -1000]) {
      const s = schedule(vorDemAbruf('production', iv), 'good', 'seg', T0);
      expect(s.maturedAt).toBeNull();
      expect(s.provenStableAt).toBeNull();
    }
  });

  it('ein absurd großes Intervall bleibt endlich und wohldefiniert', () => {
    const s = schedule(vorDemAbruf('production', 100_000), 'good', 'seg', T0);
    expect(Number.isFinite(s.dueAt)).toBe(true);
    expect(s.provenStableAt).toBe(T0);
  });
});

describe('F · Entscheidungstabelle: woraus „bewiesen / reift" folgt', () => {
  // Bedingungen: Ergebnis · Stufe VOR dem Abruf · überstandenes Intervall.
  // Alle sinnvollen Kombinationen, nicht nur die erwarteten.
  const tabelle: Array<{
    ergebnis: 'again' | 'hard' | 'good';
    stufe: RetrievalStage;
    intervall: number;
    reift: boolean;
    bewiesen: boolean;
  }> = [
    { ergebnis: 'good', stufe: 'production', intervall: 120, reift: false, bewiesen: true },
    { ergebnis: 'good', stufe: 'production', intervall: 30, reift: true, bewiesen: false },
    { ergebnis: 'good', stufe: 'production', intervall: 5, reift: false, bewiesen: false },
    // Wiedererkennen zählt nie — der Beweis ist ausdrücklich der PRODUKTIONS-Abruf.
    { ergebnis: 'good', stufe: 'recognition', intervall: 120, reift: false, bewiesen: false },
    { ergebnis: 'good', stufe: 'recognition', intervall: 30, reift: false, bewiesen: false },
    // „Fast" OHNE objektiven Treffer ist kein Beweis: `gradeTyped` schlägt es
    // vor, wenn die Antwort bis zu zwei Zeichen daneben lag — also falsch war.
    { ergebnis: 'hard', stufe: 'production', intervall: 120, reift: false, bewiesen: false },
    { ergebnis: 'hard', stufe: 'production', intervall: 30, reift: false, bewiesen: false },
    // Ein Fehlschlag erst recht nicht.
    { ergebnis: 'again', stufe: 'production', intervall: 120, reift: false, bewiesen: false },
    { ergebnis: 'again', stufe: 'recognition', intervall: 30, reift: false, bewiesen: false },
  ];

  for (const z of tabelle) {
    it(`${z.ergebnis} · ${z.stufe} · ${z.intervall} Tage → reift=${z.reift} bewiesen=${z.bewiesen}`, () => {
      const s = schedule(vorDemAbruf(z.stufe, z.intervall), z.ergebnis, 'seg', T0);
      expect(isStable(s), 'bewiesen').toBe(z.bewiesen);
      expect(isMaturing(s), 'reift').toBe(z.reift);
    });
  }
});

describe('F · Zustandsübergänge im Lebenszyklus einer Wendung', () => {
  it('erlaubt: neu → Wiedererkennen → Produktion', () => {
    let s = initialState('c', T0);
    expect(s.stage).toBe('recognition');
    expect(s.status).toBe('new');
    s = schedule(s, 'good', 'seg', T0);
    expect(s.stage).toBe('recognition'); // ein Erfolg reicht nicht
    s = schedule(s, 'good', 'seg2', T0 + DAY_MS);
    expect(s.stage).toBe('production'); // zwei in Folge schon
  });

  it('erlaubt: Produktion → Wiedererkennen bei Fehlschlag (Rückstufung)', () => {
    let s = schedule(schedule(initialState('c', T0), 'good', 'a', T0), 'good', 'b', T0 + DAY_MS);
    expect(s.stage).toBe('production');
    s = schedule(s, 'again', 'c', T0 + 2 * DAY_MS);
    expect(s.stage).toBe('recognition');
    expect(s.successStreak).toBe(0);
    expect(s.intervalDays).toBe(0); // in derselben Sitzung erneut fällig
  });

  it('verboten: ein Fehlschlag darf die Stufe nie ANHEBEN', () => {
    const s = schedule(vorDemAbruf('recognition', 10), 'again', 'seg', T0);
    expect(s.stage).toBe('recognition');
  });

  it('verboten: die Historie darf nie schrumpfen', () => {
    let s = initialState('c', T0);
    let laenge = 0;
    for (let i = 0; i < 10; i++) {
      s = schedule(s, i % 3 === 0 ? 'again' : 'good', `seg${i}`, T0 + i * DAY_MS);
      expect(s.history.length).toBe(laenge + 1);
      laenge = s.history.length;
    }
  });

  it('verboten: ein einmal gesetzter Vermerk darf nie auf null zurückfallen', () => {
    // Die Vermerke sind historische Tatsachen. Die ANZEIGE rechnet sie heraus
    // (stillHolds), die Daten behalten sie — sonst wäre der Verlauf gefälscht.
    let s = schedule(vorDemAbruf('production', 120), 'good', 'seg', T0);
    expect(s.provenStableAt).not.toBeNull();
    expect(s.maturedAt).not.toBeNull();
    s = schedule(s, 'again', 'seg2', T0 + DAY_MS);
    expect(s.provenStableAt).not.toBeNull();
    expect(s.maturedAt).not.toBeNull();
    // … aber die Anzeige zeigt sie nicht mehr.
    expect(isStable(s)).toBe(false);
    expect(isMaturing(s)).toBe(false);
  });

  it('der Status durchläuft neu → learning → maintenance und fällt nicht zurück auf neu', () => {
    let s = initialState('c', T0);
    const gesehen: string[] = [s.status];
    let t = T0;
    for (let i = 0; i < 12; i++) {
      t += Math.max(1, s.intervalDays) * DAY_MS;
      s = schedule(s, 'good', `seg${i}`, t);
      if (s.status !== gesehen[gesehen.length - 1]) gesehen.push(s.status);
    }
    expect(gesehen[0]).toBe('new');
    expect(gesehen).not.toContain('new-again');
    expect(gesehen.slice(1)).not.toContain('new'); // nie zurück auf „neu"
  });
});

describe('F · Rückverfolgbarkeit: jede Anforderung hat ihren Test', () => {
  // §7 des Standards verlangt Rückverfolgbarkeit. Diese Fälle bilden die
  // Kernversprechen aus docs/07-measurement.md eins zu eins ab.
  it('A1 · „stabil" nur nach echtem langem Intervall, nie nach Massenwiederholung', () => {
    // Zehnmal am selben Tag „Sitzt" darf keinen Beweis erzeugen.
    let s = initialState('c', T0);
    for (let i = 0; i < 10; i++) s = schedule(s, 'good', `seg${i}`, T0);
    expect(s.provenStableAt).toBeNull();
    expect(isStable(s)).toBe(false);
  });

  it('A2 · keine Metrik belohnt reine Anwesenheit', () => {
    // Eine Wendung nur ansehen (kein Abruf) erzeugt keinerlei Fortschritt.
    const s = initialState('c', T0);
    expect(isStable(s)).toBe(false);
    expect(isMaturing(s)).toBe(false);
    expect(s.history).toHaveLength(0);
  });

  it('A3 · Sprechen ist ein zweiter Weg zum selben Beweis, kein leichterer', () => {
    const getippt = schedule(vorDemAbruf('production', 120), 'good', 'seg', T0);
    const gesprochen = schedule(vorDemAbruf('production', 120), 'good', 'seg', T0, {
      spoken: true,
    });
    expect(gesprochen.provenStableAt).toBe(getippt.provenStableAt);
    expect(gesprochen.dueAt).toBe(getippt.dueAt);
    expect(gesprochen.intervalDays).toBe(getippt.intervalDays);
  });
});


describe('F · Messung und Selbsteinschätzung sind zweierlei (geklärt 2026-07-25)', () => {
  // Die offene Frage war: „Fast" führt nie zum Beweis — bestraft das ehrliche
  // Selbsteinschätzung? Die Antwort hängt daran, was „Fast" bedeutet.
  //
  // In der PRODUKTION schlägt `gradeTyped` „Fast" vor, wenn die Antwort bis zu
  // zwei Zeichen daneben lag. Dort heißt es also „war nicht ganz richtig" — und
  // dass daraus kein Beweis wird, ist genau richtig.
  //
  // Es blieb ein schmaler Rest: exakt richtig getippt, aus Gewissenhaftigkeit
  // trotzdem „Fast" gedrückt. Da hing der Beweis am Knopf statt an der Messung,
  // und Aufrunden wurde belohnt. Genau das ist jetzt getrennt.

  it('exakt richtig, aber „Fast" gedrückt: der Beweis zählt trotzdem', () => {
    const s = schedule(vorDemAbruf('production', 120), 'hard', 'seg', T0, { exact: true });
    expect(isStable(s), 'die Messung sagt: exakt nach 120 Tagen').toBe(true);
  });

  it('„Fast" ohne objektiven Treffer beweist weiterhin nichts', () => {
    const s = schedule(vorDemAbruf('production', 120), 'hard', 'seg', T0);
    expect(isStable(s)).toBe(false);
    expect(isMaturing(s)).toBe(false);
  });

  it('ein Fehlschlag beweist nichts, auch nicht mit exaktem Treffer davor', () => {
    // `again` heißt: nicht abgerufen. Ein `exact` daneben wäre widersprüchlich —
    // die Engine darf daraus trotzdem nie einen Beweis machen.
    const s = schedule(vorDemAbruf('production', 120), 'again', 'seg', T0, { exact: true });
    expect(isStable(s)).toBe(false);
    expect(s.stage).toBe('recognition');
  });

  it('die Selbsteinschätzung steuert weiterhin den Termin', () => {
    // Wer zögert, sieht die Wendung früher wieder — das ist der Sinn des Knopfes
    // und bleibt unberührt.
    const sicher = schedule(vorDemAbruf('production', 120), 'good', 'seg', T0, { exact: true });
    const zoegernd = schedule(vorDemAbruf('production', 120), 'hard', 'seg', T0, { exact: true });
    expect(zoegernd.intervalDays).toBeLessThan(sicher.intervalDays);
    // … aber beide haben denselben Beweis erbracht.
    expect(isStable(zoegernd)).toBe(true);
    expect(isStable(sicher)).toBe(true);
  });

  it('Wiedererkennen beweist auch mit exaktem Treffer nichts', () => {
    // Dort gibt es keine geprüfte Eingabe — der Beweis bleibt der Produktion
    // vorbehalten.
    const s = schedule(vorDemAbruf('recognition', 120), 'hard', 'seg', T0, { exact: true });
    expect(isStable(s)).toBe(false);
  });
});
