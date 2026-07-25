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
- **Ehrlich gekennzeichnet:** die Karte trägt sichtbar „Neuer Kontext · 🤖 KI-erzeugt ·
  nicht geprüft". Kein Fortschrittssignal koppelt daran (die eine Design-Regel) — es ist
  zusätzlicher verständlicher Input, kein bewertetes Können.
- **Warum das der Moat ist:** unbegrenzter, passgenauer Input statt endlicher Content-Bibliothek
  (siehe „Warum zwingend" oben). Die menschliche Stichprobe (schwedische Muttersprache-QS) bleibt
  die nächste Ausbaustufe.

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

Für KI-erzeugten Stoff gilt derselbe Weg: Stufe 1 ist automatisierbar, die Kennzeichnung
„🤖 KI-erzeugt · nicht geprüft" bleibt, bis eine Stufe sie wirklich deckt.

## Risiken / offene Punkte
- Faktentreue & Natürlichkeit generierter Sätze → menschliche Stichprobe.
- Qualität schwedischer Dekodierung/Idiomatik → Prüfheuristiken; Wortexistenz ist seit
  2026-07-25 maschinell abgedeckt (Stufe 1), Wortfolgen noch nicht.
- Konkrete Modellwahl (LLM/TTS) → Anbieter-Entscheidung offen (`10-open-questions.md`); die Port-Schicht hält alle Wege offen.
