// Der Vorrat: Sätze werden erzeugt, BEVOR der Lerner sie braucht.
//
// WAS ER LÖST: Bisher hieß „Neuer Kontext" — warten. Ein Modell-Aufruf dauert
// Sekunden, und wird der Satz vom Tor verworfen, kommt ein zweiter Aufruf
// obendrauf. Der Lerner steht dann vor einem drehenden Rad in genau dem Moment,
// in dem er lernen wollte. Der Vorrat verlegt beides nach hinten: Erzeugt wird,
// während er ohnehin arbeitet; abgerufen wird sofort.
//
// ── DIE EHRLICHKEITSFRAGE, DIE DIESE DATEI ENTSCHEIDET ───────────────────────
//
// Bisher galt ein einfacher Vertrag: EIN Klick, EIN Modell-Aufruf, ein paar
// Cent auf dem EIGENEN Zugang des Lerners. Der Vorrat bricht diesen Vertrag —
// er gibt Geld aus, ohne dass jemand geklickt hat. Das ist kein Detail, das ist
// eine andere Abmachung. Deshalb gilt hier alles drei, nicht nur eines davon:
//
//   1. AUS, bis der Lerner ihn einschaltet. Kein „hilfreiches" Vorbelegen.
//   2. GEDECKELT, hart und sichtbar: höchstens `VORRAT_MAX` Sätze insgesamt,
//      höchstens `NACHSCHUB_PRO_SITZUNG` neue je Sitzung. Kein „füllt sich
//      selbst nach" ohne Obergrenze — das wäre ein offener Wasserhahn an einer
//      fremden Rechnung.
//   3. SICHTBAR und löschbar: Die Einstellungen sagen, wie viele Sätze liegen,
//      und ein Knopf wirft sie weg.
//
// ── WARUM DAS URTEIL NICHT MITGESPEICHERT WIRD ───────────────────────────────
//
// Naheliegend wäre, die Beschriftung beim Erzeugen festzuhalten. Sie wäre aber
// ein Urteil von gestern: Kommt neuer geprüfter Inhalt dazu, ändert sich, was
// „nicht im geprüften Bestand" heißt; werden die Regeln strenger, wäre ein
// damals angenommener Satz heute vielleicht keiner mehr. Gespeichert wird
// deshalb nur der SATZ. Geprüft wird beim Herausnehmen, mit den Regeln von
// jetzt. Ein Satz, der die heutige Prüfung nicht besteht, wird verworfen, statt
// mit einem alten Freispruch angezeigt zu werden.

import type { Chunk, Segment } from '../../domain/chunk';
import type { VorratEintrag } from '../../storage/db';
import type { ContentGenerator, KnownPhrase } from './ports';
import { erzeugeGeprueft } from './quality/gepruefteErzeugung';
import { pruefeSegment, type Pruefergebnis, type Wissen } from './quality/gate';

/** Wie viele vorab erzeugte Sätze höchstens herumliegen dürfen. */
export const VORRAT_MAX = 12;

/**
 * Wie viele je Sitzung höchstens NACHgelegt werden. Bewusst klein: Der Deckel
 * begrenzt den Bestand, diese Zahl begrenzt die Rechnung eines einzelnen Tages.
 */
export const NACHSCHUB_PRO_SITZUNG = 4;

/** Die Ablage — als Schnittstelle, damit Tests ohne IndexedDB laufen. */
export interface VorratSpeicher {
  fuer(chunkId: string): Promise<VorratEintrag[]>;
  anzahl(): Promise<number>;
  hinzu(eintrag: VorratEintrag): Promise<void>;
  weg(id: string): Promise<void>;
}

export interface AusDemVorrat {
  segment: Segment;
  ergebnis: Pruefergebnis;
  erzeugtAm: number;
  modell: string;
}

/**
 * Nimmt einen passenden Satz aus dem Vorrat — oder `null`, wenn keiner (mehr)
 * taugt. Der Eintrag wird IMMER entfernt, ob er die Prüfung besteht oder nicht:
 * Ein Satz, der heute durchfällt, fällt auch morgen durch und soll nicht bei
 * jedem Versuch erneut geprüft werden.
 */
export async function nimmAusVorrat(
  speicher: VorratSpeicher,
  chunk: Chunk,
  wissen: Wissen,
): Promise<AusDemVorrat | null> {
  const liegend = await speicher.fuer(chunk.id);
  // Ältester zuerst: Er hat am längsten Platz belegt.
  for (const e of [...liegend].sort((a, b) => a.erzeugtAm - b.erzeugtAm)) {
    await speicher.weg(e.id);
    const ergebnis = pruefeSegment(e.segment, chunk, wissen);
    if (ergebnis.angenommen) {
      return { segment: e.segment, ergebnis, erzeugtAm: e.erzeugtAm, modell: e.modell };
    }
  }
  return null;
}

export interface NachschubAuftrag {
  /** Wofür vorgesorgt wird — die Wendungen der laufenden Sitzung, in ihrer Reihenfolge. */
  chunks: Chunk[];
  /** Was der Lerner schon kann, je Wendung (für echtes i+1). */
  bekanntFuer: (chunk: Chunk) => KnownPhrase[];
  generator: ContentGenerator;
  wissen: Wissen;
  modell: string;
  /** Uhrzeit — hereingereicht, damit Tests nicht auf die Uhr angewiesen sind. */
  jetzt?: number;
  /** Erlaubt es, einen laufenden Nachschub abzubrechen (Sitzung verlassen). */
  abbruch?: () => boolean;
}

export interface NachschubErgebnis {
  erzeugt: number;
  /** Wie oft das Tor einen Satz verworfen hat — für die ehrliche Anzeige. */
  verworfen: number;
  /** Warum aufgehört wurde: Deckel, Tagesration, Abbruch, Fehler oder fertig. */
  ende: 'fertig' | 'deckel' | 'ration' | 'abbruch' | 'fehler';
}

/**
 * Legt für die kommenden Wendungen Sätze an. Läuft im Hintergrund und darf
 * niemals etwas werfen — ein misslungener Nachschub ist ein Komfort-Verlust,
 * kein Fehler, den der Lerner sehen muss.
 *
 * NACHEINANDER, nicht gleichzeitig: Vier parallele Aufrufe treffen eher ein
 * Anbieter-Limit (429) und verbrennen im Fehlerfall vier Beträge statt einem.
 * Beim ersten Fehler wird abgebrochen — wer bei Aufruf eins scheitert,
 * scheitert bei Aufruf zwei mit derselben Ursache.
 */
export async function fuelleVorrat(
  speicher: VorratSpeicher,
  auftrag: NachschubAuftrag,
): Promise<NachschubErgebnis> {
  const jetzt = auftrag.jetzt ?? Date.now();
  let erzeugt = 0;
  let verworfen = 0;

  for (const chunk of auftrag.chunks) {
    if (auftrag.abbruch?.()) return { erzeugt, verworfen, ende: 'abbruch' };
    if (erzeugt >= NACHSCHUB_PRO_SITZUNG) return { erzeugt, verworfen, ende: 'ration' };
    if ((await speicher.anzahl()) >= VORRAT_MAX) return { erzeugt, verworfen, ende: 'deckel' };
    // Eine Wendung, die schon versorgt ist, braucht keine zweite Vorsorge —
    // sonst füllt eine kurze Sitzung den ganzen Deckel mit einem einzigen Wort.
    if ((await speicher.fuer(chunk.id)).length > 0) continue;

    try {
      const { segment, versuche } = await erzeugeGeprueft(
        auftrag.generator,
        {
          chunkId: chunk.id,
          sv: chunk.sv,
          de: chunk.de,
          // Eine Stufe über der Begegnung — derselbe Gedanke wie im Loop.
          level: 2,
          // Ohne das Bekannte wäre der Vorrat KEIN i+1 mehr, sondern nur ein
          // schneller Satz: Der Rest darf nur aus Wörtern bestehen, die der
          // Lerner schon getroffen hat (docs/03-method.md, Schritt 1).
          known: auftrag.bekanntFuer(chunk),
        },
        chunk,
        auftrag.wissen,
      );
      verworfen += versuche - 1;
      await speicher.hinzu({
        id: `vorrat:${chunk.id}:${jetzt + erzeugt}`,
        chunkId: chunk.id,
        segment: { ...segment, id: `vorrat:${chunk.id}:${jetzt + erzeugt}` },
        erzeugtAm: jetzt,
        modell: auftrag.modell,
      });
      erzeugt++;
    } catch {
      // Sowohl „Tor zweimal nicht bestanden" als auch Netz-/Anbieter-Fehler.
      // Beides heißt: jetzt nicht weitermachen.
      //
      // `verworfen` bleibt, wie es ist: Ein abgebrochener Aufruf hat keinen
      // Satz verworfen, er hat gar keinen geliefert. Die Zahl soll zählen, was
      // das TOR aussortiert hat — sonst misst sie zwei verschiedene Dinge.
      return { erzeugt, verworfen, ende: 'fehler' };
    }
  }
  return { erzeugt, verworfen, ende: 'fertig' };
}
