// Der Grund-Partner. Die wichtigste Prüfung steht zuerst: Er darf die Wendung,
// die er hervorlocken soll, NIEMALS selbst sagen — sonst plappert der Lerner nur
// nach, und eine nachgeplapperte Wendung ist kein Abruf.

import { describe, expect, it } from 'vitest';
import { nameEinsetzen, seedPartner, waehleAnstoss } from './seedPartner';
import { seedDialogs } from '../seedDialogs';
import type { SparringRequest } from '../ports';

const norm = (s: string) =>
  s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();

const anfrage = (o: Partial<SparringRequest> = {}): SparringRequest => ({
  scene: 'Ein Café in Stockholm.',
  partner: 'Bedienung',
  learnerName: '',
  targets: [],
  history: [],
  ...o,
});

/**
 * Eine Wendung, die im kuratierten Inhalt wirklich hervorgelockt wird.
 *
 * BEIM ERSTEN LAUF DANEBENGEGRIFFEN: Das erste Partner→Du-Paar im Inhalt ist ein
 * Gruß-Wechsel — der Partner sagt „God morgon!", und der Lerner sagt dasselbe
 * zurück. Genau solche Zeilen wirft der Grund-Partner absichtlich weg (er würde
 * die Antwort mitliefern). Das Beispiel muss also eines sein, das die Regel
 * ÜBERLEBT, sonst prüft der Test das Gegenteil von dem, was er behauptet.
 */
function einZiel(): { sv: string; de: string } {
  const enthaelt = (a: string, b: string) => norm(a).includes(norm(b));
  for (const d of seedDialogs) {
    for (let i = 1; i < d.turns.length; i++) {
      const vorher = d.turns[i - 1];
      const t = d.turns[i];
      if (t.speaker !== 'you' || vorher.speaker !== 'partner') continue;
      if (enthaelt(vorher.sv, t.sv)) continue;
      return { sv: t.sv, de: t.de };
    }
  }
  throw new Error('Kein Gespräch mit brauchbarem Partner→Du-Paar gefunden');
}

describe('Der Grund-Partner sagt die Ziel-Wendung nie selbst', () => {
  it('wählt keine Zeile, die die gesuchte Wendung enthält', () => {
    // Über ALLE kuratierten Wendungen geprüft, nicht an einem Beispiel: Diese
    // Regel steht hier im Code statt in einem Prompt, also muss sie auch überall
    // halten.
    const verstoesse: string[] = [];
    for (const d of seedDialogs) {
      for (const t of d.turns) {
        if (t.speaker !== 'you') continue;
        const a = waehleAnstoss(anfrage({ targets: [{ sv: t.sv, de: t.de }] }));
        if (a && norm(a.sv).includes(norm(t.sv))) {
          verstoesse.push(`${d.id}: „${a.sv}" enthält „${t.sv}"`);
        }
      }
    }
    expect(verstoesse).toEqual([]);
  });
});

describe('Der Grund-Partner steuert auf die fällige Wendung zu', () => {
  it('wählt die kuratierte Zeile, die genau diese Wendung hervorlockt', () => {
    const ziel = einZiel();
    const a = waehleAnstoss(anfrage({ targets: [ziel] }));
    expect(a).not.toBeNull();
    expect(norm(a!.zielSv)).toBe(norm(ziel.sv));
  });

  it('wiederholt sich nicht — was gesagt wurde, kommt nicht noch einmal', () => {
    const ziel = einZiel();
    const erste = waehleAnstoss(anfrage({ targets: [ziel] }))!;
    const zweite = waehleAnstoss(
      anfrage({ targets: [ziel], history: [{ who: 'partner', sv: erste.sv }] }),
    );
    expect(zweite).not.toBeNull();
    expect(norm(zweite!.sv)).not.toBe(norm(erste.sv));
  });

  it('bricht nicht ab, wenn es für die Wendung keine kuratierte Frage gibt', () => {
    // Dritte Stufe: irgendetwas Geprüftes, damit das Gespräch weiterläuft.
    const a = waehleAnstoss(anfrage({ targets: [{ sv: 'xyzåäö', de: 'gibt es nicht' }] }));
    expect(a).not.toBeNull();
  });
});

describe('Der Grund-Partner antwortet wie ein Partner', () => {
  it('liefert schwedische UND deutsche Zeile', async () => {
    const r = await seedPartner.reply(anfrage({ targets: [einZiel()] }));
    expect(r.sv.length).toBeGreaterThan(0);
    expect(r.de.length).toBeGreaterThan(0);
  });

  it('trägt dieselbe Kennung wie die anderen Grund-Adapter', () => {
    // Die Fläche erkennt an EINER Stelle, ob eine echte Cloud-KI eingerichtet ist.
    expect(seedPartner.id).toBe('seed');
  });

  it('setzt den Namen ein, wo die Szene ihn vorsieht', async () => {
    const mitPlatz = seedDialogs
      .flatMap((d) => d.turns)
      .find((t) => t.speaker === 'partner' && t.sv.includes('{name}'));
    if (!mitPlatz) return; // kein Platzhalter im Inhalt — dann gibt es nichts zu prüfen
    const r = await seedPartner.reply(
      anfrage({ learnerName: 'Anna', history: [], targets: [] }),
    );
    expect(r.sv).not.toContain('{name}');
  });

  it('sagt ehrlich Bescheid, wenn wirklich alles gesagt ist', async () => {
    const alle = seedDialogs
      .flatMap((d) => d.turns)
      .filter((t) => t.speaker === 'partner')
      .map((t) => ({ who: 'partner' as const, sv: t.sv }));
    await expect(seedPartner.reply(anfrage({ history: alle }))).rejects.toThrow(/eigenen/);
  });
});

describe('Der Grund-Partner steigt passend ein', () => {
  it('eröffnet mit einer Eröffnungszeile, nicht mit einem Satz aus der Mitte', () => {
    // BEIM SELBST-ANSEHEN AUFGEFALLEN: Die Bedienung im Café sagte als Erstes
    // „Kaffe?" — eine Zeile aus der Mitte eines fremden Gesprächs. Man stolperte
    // mitten hinein.
    const a = waehleAnstoss(anfrage({ sceneId: 'cafe' }));
    expect(a).not.toBeNull();
    expect(a!.eroeffnung).toBe(true);
  });

  it('bleibt in der gewählten Kulisse', () => {
    const a = waehleAnstoss(anfrage({ sceneId: 'cafe' }));
    expect(a!.scene).toBe('cafe');
  });

  it('stellt die fällige Wendung ÜBER die Kulisse', () => {
    // Der Ort ist Rahmen, die Wendung ist der Zweck. Gibt es die kuratierte
    // Frage nur in einer anderen Kulisse, gilt trotzdem die Frage.
    const ziel = einZiel();
    const a = waehleAnstoss(
      anfrage({ sceneId: 'lake', targets: [ziel], history: [{ who: 'partner', sv: 'x' }] }),
    );
    expect(a).not.toBeNull();
    expect(norm(a!.zielSv)).toBe(norm(ziel.sv));
  });
});

describe('Der Name in der Zeile', () => {
  it('setzt den Vornamen ein, wo die Szene ihn vorsieht', () => {
    expect(nameEinsetzen('Hej {name}, välkommen!', 'Anna')).toBe('Hej Anna, välkommen!');
  });

  it('räumt die Zeichensetzung auf, wenn kein Name hinterlegt ist', () => {
    // Beim Selbst-Ansehen aufgefallen: „Hej , välkommen!" — ein Leerzeichen vor
    // dem Komma. Den Platzhalter zu löschen reicht nicht.
    expect(nameEinsetzen('Hej {name}, välkommen!', '')).toBe('Hej, välkommen!');
    expect(nameEinsetzen('Hej {name}!', '   ')).toBe('Hej!');
  });

  it('lässt Zeilen ohne Platzhalter in Ruhe', () => {
    expect(nameEinsetzen('Vad vill du ha?', 'Anna')).toBe('Vad vill du ha?');
  });
});
