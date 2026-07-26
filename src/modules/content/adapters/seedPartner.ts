// Der Grund-Partner: ein Gesprächspartner OHNE Cloud, ohne Schlüssel, ohne Netz.
//
// ── WARUM ES IHN GIBT (Nutzerwunsch 2026-07-26) ──────────────────────────────
//
// Bis heute stand in der Registry `partner: null`. Wer keinen eigenen
// Cloud-Zugang eingerichtet hatte, bekam beim Sparring einen Erklärtext statt
// eines Gesprächs. Der Sparringspartner — der Modus, in dem man das Gelernte
// tatsächlich SAGT — war damit für die meisten gar nicht vorhanden.
//
// ── WORAUS ER BESTEHT ────────────────────────────────────────────────────────
//
// Aus den 90 kuratierten Gesprächen. Jedes davon hat Partner-Zeilen und
// „du"-Zeilen, und jede „du"-Zeile trägt die Wendung, die dort produziert wird.
// Die Partner-Zeile DAVOR ist also bereits das, was ein Sparringspartner können
// muss: eine Äußerung, auf die die Ziel-Wendung die natürliche Antwort ist —
// nur eben von Hand geschrieben und geprüft statt erzeugt.
//
// ── WAS ER KANN UND WAS NICHT ────────────────────────────────────────────────
//
//   KANN   · echtes, geprüftes Schwedisch — besser als jedes Modell es hier
//            liefern würde, weil es dieselbe Prüfkette durchlaufen hat
//          · gezielt auf fällige Wendungen zusteuern
//          · offline, kostenlos, ohne dass irgendetwas das Gerät verlässt
//
//   KANN NICHT · auf das eingehen, was der Lerner WIRKLICH geantwortet hat.
//                Er folgt einem Faden, er führt kein freies Gespräch.
//
// Das ist keine Schwäche, die man verschweigt — es ist der Unterschied zwischen
// den zwei Stufen, und die Fläche sagt ihn. Ein Erklärtext statt eines Modus war
// die schlechtere Antwort darauf.
//
// ── DIE EINE REGEL, DIE HIER IM CODE STEHT STATT IM PROMPT ───────────────────
//
// Der Partner darf die Ziel-Wendung NIEMALS selbst aussprechen — sonst kann der
// Lerner sie nur nachplappern, und eine nachgeplapperte Wendung ist kein Abruf.
// Beim Cloud-Partner steht das (zweimal) im Prompt und bleibt eine Bitte. Hier
// ist es eine Bedingung: Eine Zeile, die die Wendung enthält, wird nicht
// ausgewählt.

import type { SparringPartner, SparringReply, SparringRequest } from '../ports';

// ERST BEIM ERSTEN SATZ GELADEN, nicht beim Start der App. Ein statischer Import
// zog die 277 kB Gespräche ins Startbündel — es wuchs von 833 kB auf 1.119 kB,
// also ein Drittel mehr Ladezeit für JEDEN, auch für die, die nie ein Gespräch
// öffnen. Der Build hat es gemeldet, und die Zahl stand im Protokoll.
async function ladeDialoge() {
  const m = await import('../seedDialogs');
  return m.seedDialogs;
}

const norm = (t: string): string =>
  t
    .toLowerCase()
    .replace(/\{[a-zA-Z]+\}/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

interface Anstoss {
  /** Die Partner-Zeile. */
  sv: string;
  de: string;
  /** Welche Wendung sie hervorlockt (leer = allgemeine Gesprächszeile). */
  zielSv: string;
  categoryId: string;
  /** Die Kulisse des Gesprächs, aus dem die Zeile stammt (`cafe`, `garage`, …). */
  scene: string;
  /** Ist es die ERSTE Partner-Zeile ihres Gesprächs? Dann taugt sie als Einstieg. */
  eroeffnung: boolean;
}

/**
 * Alle Partner-Zeilen der kuratierten Gespräche, jeweils mit der Wendung, die
 * unmittelbar danach vom Lerner kommt. Einmal beim Laden gebaut.
 */
function baueAnstoesse(seedDialogs: Awaited<ReturnType<typeof ladeDialoge>>): Anstoss[] {
  const raus: Anstoss[] = [];
  for (const d of seedDialogs) {
    for (let i = 0; i < d.turns.length; i++) {
      const t = d.turns[i];
      if (t.speaker !== 'partner') continue;
      const danach = d.turns[i + 1];
      const zielSv = danach?.speaker === 'you' ? danach.sv : '';
      // Die Regel: Eine Zeile, die die Wendung schon selbst sagt, lockt nichts
      // hervor — sie liefert die Antwort mit.
      if (zielSv && norm(t.sv).includes(norm(zielSv))) continue;
      const erste = d.turns.findIndex((x) => x.speaker === 'partner');
      raus.push({
        sv: t.sv,
        de: t.de,
        zielSv,
        categoryId: d.categoryId,
        scene: d.scene,
        eroeffnung: i === erste,
      });
    }
  }
  return raus;
}

/** Der einmal gebaute Vorrat an Anstößen — plus Wendung → Thema. */
export interface Anstossliste {
  alle: Anstoss[];
  /** Zu welchem Thema eine Wendung gehört — für den Themen-Treffer zweiter Wahl. */
  thema: Map<string, string>;
}

let gecacht: Promise<Anstossliste> | null = null;

export function ladeAnstossliste(): Promise<Anstossliste> {
  return (gecacht ??= ladeDialoge().then((dialoge) => {
    const thema = new Map<string, string>();
    for (const d of dialoge) {
      for (const t of d.turns) {
        if (t.speaker === 'you' && !thema.has(norm(t.sv))) thema.set(norm(t.sv), d.categoryId);
      }
    }
    return { alle: baueAnstoesse(dialoge), thema };
  }));
}

/**
 * Die nächste Partner-Zeile — in drei Stufen, alle aus geprüftem Inhalt.
 *
 *   1. Eine Zeile, die GENAU eine der offenen Ziel-Wendungen hervorlockt.
 *      Das ist der eigentliche Zweck des Modus.
 *   2. Sonst eine Zeile aus demselben THEMA — das Gespräch bleibt beim Thema,
 *      auch wenn es für diese Wendung keine kuratierte Frage gibt.
 *   3. Sonst irgendeine noch ungesagte Zeile, damit das Gespräch weiterläuft
 *      statt abzubrechen.
 *
 * Rein bis auf den Seed-Zugriff — deshalb einzeln testbar.
 */
export function waehleAnstoss(liste: Anstossliste, req: SparringRequest): Anstoss | null {
  const gesagt = new Set(req.history.filter((l) => l.who === 'partner').map((l) => norm(l.sv)));
  const frei = liste.alle.filter((a) => !gesagt.has(norm(a.sv)));
  if (frei.length === 0) return null;

  const ziele = req.targets.map((t) => norm(t.sv));
  const themen = new Set(
    req.targets.map((t) => liste.thema.get(norm(t.sv))).filter(Boolean) as string[],
  );

  // Am ANFANG eines Gesprächs zählt zweierlei zusätzlich: Es soll eine
  // Eröffnungszeile sein (nicht ein Satz aus der Mitte einer fremden Szene), und
  // sie soll zur gewählten Kulisse passen. Beim Selbst-Ansehen sagte die
  // Bedienung im Café als Erstes „Kaffe?" — mitten hineingestolpert.
  const beginn = req.history.length === 0;
  const passtZurKulisse = (a: Anstoss) => !req.sceneId || a.scene === req.sceneId;

  const suche = (kandidaten: Anstoss[]): Anstoss | undefined =>
    // Erst mit Kulisse, dann ohne: Ein passender Ort ist schön, aber die fällige
    // Wendung ist wichtiger als die Deko.
    kandidaten.find((a) => passtZurKulisse(a) && (!beginn || a.eroeffnung)) ??
    kandidaten.find((a) => !beginn || a.eroeffnung) ??
    kandidaten.find(passtZurKulisse) ??
    kandidaten[0];

  // 1. Direkter Treffer auf eine offene Wendung.
  const treffer = suche(frei.filter((a) => a.zielSv && ziele.includes(norm(a.zielSv))));
  if (treffer) return treffer;

  // 2. Gleiches Thema wie eine offene Wendung.
  const imThema = suche(frei.filter((a) => themen.has(a.categoryId)));
  if (imThema) return imThema;

  // 3. Irgendetwas Geprüftes, damit das Gespräch nicht mitten im Satz endet.
  return suche(frei) ?? null;
}

/**
 * Setzt den Vornamen ein — oder räumt die Lücke auf, wenn keiner hinterlegt ist.
 *
 * BEIM SELBST-ANSEHEN AUFGEFALLEN: „Hej {name}, välkommen!" wurde ohne Namen zu
 * „Hej , välkommen!" — ein Leerzeichen vor dem Komma. Den Platzhalter zu löschen
 * reicht nicht, die Zeichensetzung muss mit.
 */
export function nameEinsetzen(s: string, name: string): string {
  const n = name.trim();
  if (n) return s.replace(/\{name\}/g, n);
  return s
    .replace(/\{name\}/g, '')
    .replace(/\s+([,.!?;:])/g, '$1') // „Hej , välkommen" → „Hej, välkommen"
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Der Grund-Partner. `id: 'seed'` — dieselbe Kennung wie die anderen
 * Seed-Adapter, damit die Fläche an EINER Stelle erkennt, ob eine echte Cloud-KI
 * eingerichtet ist.
 */
export const seedPartner: SparringPartner = {
  id: 'seed',
  async reply(req: SparringRequest): Promise<SparringReply> {
    const a = waehleAnstoss(await ladeAnstossliste(), req);
    if (!a) {
      throw new Error(
        'Der Grund-Partner hat alle kuratierten Zeilen gesagt. Mit einem eigenen ' +
          'KI-Zugang geht das Gespräch frei weiter.',
      );
    }
    return { sv: nameEinsetzen(a.sv, req.learnerName), de: nameEinsetzen(a.de, req.learnerName) };
  },
};
