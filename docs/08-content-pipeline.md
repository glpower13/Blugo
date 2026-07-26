# 08 — Content-Pipeline (der Moat)

## Warum zwingend
Für Schwedisch existiert kaum graded Content auf i+1; kuratierte Podcasts/Sender führen in Lizenzprobleme. Ewige **Kontextvariation** und **Wartung** brauchen praktisch unbegrenzten, passgenauen Input. Fertiger Content reicht dafür strukturell nie. Deshalb ist KI-generierter, on-demand graduierter Input kein Komfort, sondern die Existenzberechtigung des Produkts.

## Pipeline (konzeptionell)
1. **Skript-Generierung** — LLM erzeugt kurze schwedische Segmente, die gezielt Ziel-Chunks auf i+1 enthalten und bekannte Chunks in *neuem* Kontext wiederbringen.
2. **Grading/Leveling** — Prüfung/Anpassung auf die Zielstufe (Anteil bekannter vs. neuer Chunks im gewünschten Verhältnis).
3. **Dekodierung** — automatische interlineare Wort-für-Wort-Übersetzung SV→DE (Birkenbihl-Baustein), historisch der teuerste Handschritt, hier automatisiert.
4. **TTS** — natürliches Schwedisch, variables Tempo.
5. **Optional Bild/Kontext** — zur Verständlichmachung (Dual Coding, moderat).
6. **Qualitätssicherung** — in M1 handgeprüft (~20 Segmente); später teilautomatisiert mit Stichprobenprüfung.

## Port-Schicht (Ports & Adapters) — der Andockpunkt *(gebaut 2026-07-23, Schritt B)*

Damit ein Anbieter später angebunden werden kann, **ohne die App umzubauen**, hängt
die Pipeline an genormten **Ports** (Fähigkeits-Interfaces), nicht an Produkten
(`src/modules/content/ports.ts`). Vier Fähigkeiten:

| Port | Fähigkeit | Standard-Adapter heute | Anbieter-Adapter (Schritt C) |
|---|---|---|---|
| `ContentGenerator` | i+1-Segment on demand erzeugen (der Moat) | `seed` (bedient Seed-Kontexte) | ✅ Claude (`adapters/anthropic.ts`, BYOK) · weitere LLM |
| `Decoder` | interlineare Dekodierung SV→DE | `seed` (kennt nur Seed) | ✅ Claude (`adapters/anthropic.ts`, BYOK) · weitere LLM |
| `Explainer` | Tipp-Fehler freundlich erklären („Warum?") | — (nur mit Cloud) | ✅ Claude (BYOK) |
| `SpeechSynthesizer` | Schwedisch vorlesen (TTS) | `web-speech` (on-device, zuverlässige sv-Stimme + Langsam) | natürliches TTS |
| `SpeechRecognizer` | Schwedisch erkennen (ASR) | — (nur Vertrag) | ASR (post-M1) |

Die **Registry** (`src/modules/content/aiRegistry.ts`) ist der EINE Ort, an dem die
App ihre KI-Fähigkeit bezieht; ein Adapter wird per `setAiPorts(...)` getauscht.
Die aufrufenden Stellen (z. B. die Sprachausgabe im Comprehension-Loop) ändern sich
dabei nicht. **Zukunftssicherheit:** Modelle wechseln monatlich — die App bleibt.
**Ehrlich:** Die Seed-Adapter erfinden nichts; was der Seed nicht kennt, liefert er
nicht (Fehler statt Halluzination).

> **Sicherheit ab Schritt C:** Sobald ein echter Adapter Nutzertext an einen Dritten
> schickt, greift `05-architecture.md` §Sicherheit (API-Keys server-seitig, nie im
> Client; Rate-Limits; Consent/Datenschutz).

## Erste Scheibe der KI-Content-Fabrik *(gebaut 2026-07-23)*

Hinter dem `ContentGenerator`-Port steht jetzt der **Claude-Adapter** (BYOK,
`createAnthropicGenerator`). Im Lern-Loop erscheint bei aktivem Cloud-Anbieter der
Knopf **„🤖 Neuer Kontext"**: die KI schreibt on demand **einen** neuen, natürlichen
i+1-Satz, der die Ziel-Wendung in *anderem* Alltagskontext einbettet (Kontextvariation,
Schritt 4 des Loops), samt Wort-für-Wort-Dekodierung und Vorlese-Knopf.

- **Opt-in & kostenbewusst:** nur auf Klick, nur mit eingerichtetem eigenen Schlüssel.
- **Warum das der Moat ist:** unbegrenzter, passgenauer Input statt endlicher Content-Bibliothek
  (siehe „Warum zwingend" oben). Die menschliche Stichprobe (schwedische Muttersprache-QS) bleibt
  die nächste Ausbaustufe.
- **Bis 2026-07-26 unfertig:** die Karte trug „🤖 KI-erzeugt · nicht geprüft" — ein
  Warnhinweis anstelle einer Prüfung. Was das Tor daraus gemacht hat, steht unten.

## Das Tor: erzeugter Inhalt wird geprüft, nicht beschriftet *(gebaut 2026-07-26)*

**Der eigentliche Burggraben in einem Satz:** Sätze erzeugen kann jeder. Erzeugte
Sätze automatisch auf **denselben Stand** prüfen wie die handgeschriebenen — das
ist der Unterschied.

Befund vor dem Bau: `parseSegment` prüfte genau eine Sache — ob überhaupt Text
zurückkam. Der handgeschriebene Inhalt musste vier Prüfungen bestehen, der
KI-erzeugte keine einzige. Der Aufkleber „nicht geprüft" verschob die Verantwortung
auf den Lerner, der sie nicht tragen kann: Er lernt gerade Schwedisch — er kann
nicht beurteilen, ob eine Verneinung gedreht ist.

**Eine Regel, ein Ort.** Die Prüfungen liegen jetzt in
`src/modules/content/quality/checks.ts`, im Browser lauffähig. Die Build-Werkzeuge
importieren von dort (`tools/backtranslation.ts` reicht `nurBeugung` nur noch
weiter). Zwei Kopien derselben Regel driften; dann prüft die Laufzeit anders als
der Bau, und die Laufzeit-Prüfung ist eine Behauptung.

**Zwei Sorten Befund** (`quality/gate.ts`), und der Unterschied ist die ganze
Ehrlichkeit:

| | Bedeutung | Folge |
|---|---|---|
| **hart** | Der Satz ist als Lernmaterial kaputt | verworfen, **nie** beschriftet |
| **offen** | Brauchbar, aber die App kann etwas nicht bestätigen | gezeigt **und benannt** |

Hart sind: kein Satz/keine Bedeutung · die Ziel-Wendung ist nicht wiederzuerkennen
(Deckung < 0,5) · die Wort-für-Wort-Dekodierung ist unvollständig oder nennt Wörter,
die im Satz fehlen · Zahl oder Verneinung stimmen zwischen den Sprachen nicht · eine
Glosse widerspricht dem geprüften Inhalt. Offen ist genau eines: ein Wort, das im
geprüften Bestand nie vorkam. Das ist **kein Fehler** — neue Wörter sind der Sinn
von neuem Stoff —, aber es ist die Grenze dessen, was die App bestätigen kann, und
sie wird beim Namen genannt.

**Wogegen geprüft wird.** `npm run build:wissen` (`tools/build-quality-knowledge.ts`)
zieht aus dem geprüften Inhalt jedes vorkommende schwedische Wort und die Glossen,
die dort dafür stehen (1.540 Wörter, `quality/wissen.generated.ts`). Die Datei wird
**erst beim ersten KI-Satz nachgeladen** — die meisten Lerner drücken den Knopf nie
und sollen seine Ladezeit nicht bezahlen.

**Wo das Tor absichtlich nicht zuschlägt.** Bei Funktionswörtern (`på` heißt
auf/an/am/im/über/bei) und bei den Wörtern, deren zweite Bedeutung die App selbst
erklärt (`polysemy.ts`, z. B. `kort` = Karte *und* kurz). Dort bildet der Satz das
Deutsche, nicht das schwedische Wort; ein Widerspruch wäre keiner. Ein Tor, das gute
Sätze wegwirft, kostet den Lerner Geld auf seinem eigenen Zugang und Vertrauen.

**Der Weg durchs Tor ist der einzige Weg.** `erzeugeGeprueft()`
(`quality/gepruefteErzeugung.ts`) erzeugt und prüft als *eine* Handlung, die man
nicht halb ausführen kann. Ein harter Befund kostet **einen** zweiten Versuch (der
abgelehnte Satz wird dabei ausdrücklich gemieden); scheitert auch der, wird nichts
gezeigt und die App sagt, **woran** es lag und dass der geprüfte Satz oben weiter gilt.
Zweimal, nicht fünfmal: jeder Versuch kostet echtes Geld und Sekunden vor einem
sich drehenden Rad.

**Was die Beschriftung sagt.** Statt „nicht geprüft" jetzt aufzählend, was geprüft
wurde — und im selben Atemzug, was nicht: *„Ob der Satz so gesagt wird, sagt
niemand — dafür bräuchte es einen Muttersprachler."* „Geprüft" allein wäre ein
Siegel, das diese Prüfung nicht deckt.

**Wie belegt ist, dass die Latte stimmt.** `quality/kalibrierung.test.ts` schickt
**jedes** handgeschriebene Segment durch das Tor. Kommt der eigene geprüfte Bestand
nicht durch sein eigenes Tor, ist das Tor falsch — nicht der Inhalt. Eine zu hohe
Latte ist kein „sicherheitshalber streng": sie wirft gute Sätze weg und lässt die
KI-Funktion kaputt aussehen, obwohl das Modell geliefert hat.

## Der Vorrat: schreiben, bevor jemand wartet *(gebaut 2026-07-26)*

Das Tor hat einen Preis: Ein verworfener Satz kostet einen zweiten Aufruf, und der
Lerner steht vor einem drehenden Rad in genau dem Moment, in dem er lernen wollte.
Der Vorrat (`src/modules/content/vorrat.ts`) verlegt beides nach hinten — erzeugt
wird, **während** er ohnehin arbeitet; abgerufen wird sofort.

### Die Ehrlichkeitsfrage, die dieses Stück entscheidet

Bisher galt ein einfacher Vertrag: **ein Klick, ein Aufruf, ein paar Cent** auf dem
eigenen Zugang des Lerners. Der Vorrat bricht ihn — er gibt Geld aus, ohne dass
jemand geklickt hat. Das ist kein Detail, das ist eine andere Abmachung. Sie ist nur
zulässig, wenn alles drei gilt, nicht eines davon:

1. **Aus, bis der Lerner ihn einschaltet** (`Preferences.vorratAn`, Voreinstellung
   `false`; `normalizePreferences` akzeptiert nur ein ausdrückliches `true` — eine
   alte oder kaputte Datei darf die App nie zum Geldausgeben bringen).
2. **Hart gedeckelt und sichtbar:** höchstens `VORRAT_MAX` = 12 Sätze insgesamt,
   höchstens `NACHSCHUB_PRO_SITZUNG` = 4 neue je Sitzung. Beide Zahlen stehen im
   Klartext an dem Schalter, der sie auslöst.
3. **Nachsehbar und wegwerfbar:** Die Einstellungen zeigen die echte Zahl aus der
   Ablage und haben einen Knopf, der sie auf null setzt.

### Wann gefüllt wird

Beim **Sitzungsstart**, für die Wendungen, die in dieser Warteschlange noch kommen
(`queue.slice(1)` — für die laufende käme der Nachschub zu spät). Beim App-Start zu
füllen hieße, für das bloße Öffnen Geld auszugeben.

Nacheinander, nicht gleichzeitig: Vier parallele Aufrufe treffen eher ein
Anbieter-Limit und verbrennen im Fehlerfall vier Beträge statt einem. **Beim ersten
Fehler ist Schluss** — wer bei Aufruf eins ein 429 bekommt, bekommt es bei Aufruf
zwei auch. Ein misslungener Nachschub wirft nie: Er ist Komfort-Verlust, kein
Fehler, den der Lerner mitten im Lernen vorgehalten bekommt.

### Warum das Urteil nicht mitgespeichert wird

Naheliegend wäre, die Beschriftung beim Erzeugen festzuhalten. Sie wäre aber ein
**Urteil von gestern**: Kommt neuer geprüfter Inhalt dazu, ändert sich, was „nicht
im geprüften Bestand" heißt; werden die Regeln strenger, wäre ein damals
angenommener Satz heute vielleicht keiner mehr. Gespeichert wird deshalb nur der
**Satz**. Geprüft wird beim Herausnehmen, mit den Regeln von jetzt. Ein Satz, der
die heutige Prüfung nicht besteht, wird verworfen — nicht mit einem alten Freispruch
angezeigt.

### Was der Vorrat NICHT ist

Kein Lernstand. Er liegt in einem eigenen IndexedDB-Speicher (`vorrat`, DB-Fassung 2),
wandert **nicht** in die Sicherung (`transfer.ts` nimmt nur Lernstände und
Einstellungen) und fließt in keine Messung ein. Wer ihn löscht, verliert nichts als
Wartezeit — und genau das sagt die Fläche auch.

### Echtes i+1: aus Bekanntem bauen *(gebaut 2026-07-23)*

Der Generator bekommt jetzt die Wendungen mit, die der Lerner **schon kann**
(`GenerateSegmentRequest.known`, abgeleitet in `session/knownChunks.ts` aus den
begegneten Chunks). Der Prompt weist die KI an, den neuen Satz **möglichst aus diesen
bekannten Wörtern** zu bauen und außer der Ziel-Wendung **nichts anderes Neues**
einzuführen — das ist die Kern-Bedingung für verständlichen Input (nur *ein* neues
Element pro Begegnung, `03-method.md`). Das ist die erste Stufe des Gradings; das feine
Leveling (gewünschtes Verhältnis bekannter vs. neuer Chunks, Vorrat/Batch) folgt.
Ehrlich: „bekannt" heißt hier *begegnet* (Verständlichkeit), es ist **kein**
Fortschritts-Anspruch — das ehrliche „stabil" bleibt in `07-measurement.md`.

## Thematisches Rückgrat: Kategorien *(gebaut 2026-07-23)*

Der Content ist in **Themen** (`Category`) gegliedert; jeder `Chunk` trägt eine
`categoryId` (`src/domain/chunk.ts`, Seed: `seedCategories`). Das ist die Struktur,
an der die Content-Fabrik hängt: die KI erzeugt Stoff **innerhalb eines Themas**,
dadurch bleibt der Nachschub kohärent und die Abdeckung lesbar.

- **Ehrliche Themen-Übersicht** (`modules/progress/categories.ts`, `CategoryOverview.tsx`):
  pro Thema „X von Y **bewiesen stabil**" — dieselbe ehrliche Messung wie global
  (`07-measurement.md`), **kein** „Lektion-erledigt"-Balken.
- **Fokus-Wahl** (`session/focus.ts`): der Lerner wählt, aus welchem Thema **neuer**
  Stoff bevorzugt kommt (`buildQueue` · `NewFocus`); **fällige Wiederholungen bleiben
  unberührt** — Erhalt geht vor. Design-Entscheidung: `gremium-struktur.md`.

## QS des Inhalts: Prüfkette statt einzelner Prüfer *(entschieden 2026-07-25)*

Die muttersprachliche Prüfung ist der Flaschenhals der ganzen Pipeline. Entscheidung
(Herleitung: `gremium-content-pruefung.md`): **aufteilen statt ersetzen.**

1. **Maschinell, für alles** — `npm run check:content` (`tools/check-swedish.py`) prüft
   jedes schwedische Wort gegen Korpus-Häufigkeiten (`wordfreq`, Zipf-Skala) und ein
   Wörterbuch (Hunspell `dictionary-sv`, 152.719 Einträge) und schreibt
   `content-pruefbericht.md`. Nicht belegte Wörter lassen den Lauf **fehlschlagen**.
2. **Rückübersetzung** — `npm run check:backtranslation` (`tools/backtranslation.ts`) baut
   jeden Satz aus seinen Birkenbihl-Glossen zurück ins Deutsche und prüft die
   Widerspruchsfreiheit: Glossen-Lücken und Kontext-Brüche lassen den Lauf
   **fehlschlagen**, Glossen-Konflikte und Bedeutungsdrift landen als geordnete
   Verdachtsliste in `content-rueckuebersetzung.md`. Bewusst **ohne KI-Übersetzer** —
   derselbe Trainings-Bias wäre kein Beweis (`gremium-content-pruefung.md`).
3. **Menschlich, nur wo nötig** — Wortstellung, Idiomatik, Register, Dekodierungen
   (`content-review-schwedisch.md`).
4. **Ehrliche Kennzeichnung** am Inhalt: *ungeprüft* · *maschinell vorgeprüft* ·
   *muttersprachlich geprüft*. Nie mehr behaupten, als gemessen ist.

Für KI-erzeugten Stoff gilt derselbe Weg — seit 2026-07-26 nicht mehr als Vorsatz,
sondern als Tor (siehe oben): Stufe 2 läuft zur **Laufzeit** aus derselben
Bibliothek, harte Befunde führen zum Verwerfen, und die Kennzeichnung nennt genau
das, was geprüft wurde. Stufe 3 (muttersprachlich) deckt sie weiterhin **nicht** und
behauptet es auch nicht.

## Risiken / offene Punkte
- Faktentreue & Natürlichkeit generierter Sätze → menschliche Stichprobe.
- Qualität schwedischer Dekodierung/Idiomatik → Prüfheuristiken; Wortexistenz ist seit
  2026-07-25 maschinell abgedeckt (Stufe 1), Wortfolgen noch nicht.
- Konkrete Modellwahl (LLM/TTS) → Anbieter-Entscheidung offen (`10-open-questions.md`); die Port-Schicht hält alle Wege offen.
