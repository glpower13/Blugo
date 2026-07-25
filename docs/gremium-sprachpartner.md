# Gremium — KI-Sprachpartner zum Sprechen (Stufe-D-Beratung)

> **Ehrlicher Rahmen**
> - Rollenbasierte Beratung (Stufe D). Fach-*Perspektiven*, keine echten Personen; **keine erfundenen Zitate**.
> - Markt- und Technikfakten aus **Live-Recherche Juli 2026**, mit Quellen unten. Nichts aus dem Gedächtnis.
> - **Auftrag (Nutzerfrage 2026-07-25):** „Besteht die Möglichkeit, eine KI einzubauen, die wie ein Sparringspartner funktioniert — mit der ich direkt sprechen kann wie mit einem Lehrer, der mir Rede und Antwort steht, im Voice? Ich glaube, das ist der absolute Burggraben."
> - **Antwort in einem Satz:** Bauen ja — aber der Burggraben liegt **nicht** im Sprechen. Er liegt darin, dass bei uns das Gesprochene **zählt**, und zwar wahr.

---

## 0. In einfachen Worten

Ja, das geht technisch. Man kann heute im Browser mit einer KI auf Schwedisch sprechen, und sie antwortet in etwa einer halben Sekunde mit Stimme.

Aber: **Das haben die anderen schon.** Duolingo hat es (Video Call mit „Lily"), Speak hat es, TalkPal hat es — und TalkPal kann sogar Schwedisch. Wer sagt „wir bauen eine Sprech-KI", baut 2026 das, was alle bauen. Das ist kein Burggraben, das ist Aufholen.

Der Burggraben liegt woanders, und wir sitzen zufällig genau darauf: **Bei allen Wettbewerbern endet das Gespräch mit Lob.** Eine Rezension zu TalkPal hält fest, dass die App auch bei klar falscher Aussprache positives Feedback gibt. Man redet fünf Minuten, bekommt ein Häkchen, und niemand weiß, ob man etwas gelernt hat — auch man selbst nicht.

NEUROLANG ist die einzige App, die dafür schon eine ehrliche Messung hat. Wenn wir Sprechen einbauen, dann so: **Der Partner lockt gezielt die Wendungen hervor, die heute dran sind, prüft, ob sie wirklich kamen, und füttert damit dieselbe Erinnerungs-Maschine wie das Tippen.** Dann heißt „ich habe gesprochen" nicht mehr „ich war da", sondern „drei Wendungen sind jetzt bewiesen — laut ausgesprochen, nicht getippt".

Das kann kein Wettbewerber kopieren, ohne seine eigenen Zahlen zu entwerten.

---

## 1. Die unbequeme Wahrheit zuerst: Der Markt ist besetzt

| Anbieter | Was es kann | Stand Juli 2026 |
|---|---|---|
| **Duolingo Max — Video Call** | Freies Gespräch mit der Figur „Lily", erinnert sich an frühere Gespräche, korrigiert nebenbei, ruft von sich aus an | iOS **und** Android; 6+ Sprachen. **Schwedisch nicht dabei.** ~168 $/Jahr |
| **Speak** | Strukturierte Kurse + Rollenspiele, sehr saubere Stimmen | 15+ Sprachen. Rezensionen: Rückmeldung dünn, Inhalt wiederholt sich oben |
| **TalkPal** | GPT-Gespräche, Debattenmodus, Rollenspiel | ~35 Sprachen, **inkl. Schwedisch**, ~6,25 $/Monat. Rezension: Stimmen roboterhaft, **Aussprache-Rückmeldung unzuverlässig — lobt auch klar Falsches** |

**Was das Gremium daraus schließt:**

1. „Mit einer KI sprechen" ist 2026 eine **Massenware**, keine Auszeichnung. Als alleiniges Verkaufsargument ist es 18 Monate zu spät.
2. **Für Schwedisch ist die Lage dünner** als für Spanisch/Französisch — Duolingos Video Call kann es gar nicht, TalkPal kann es mit mäßigen Stimmen. Das ist eine echte, aber schmale Lücke.
3. Der wiederkehrende Vorwurf in *allen* Rezensionen ist derselbe: **Die Rückmeldung ist zu dünn, und man weiß hinterher nicht, was hängen geblieben ist.** Genau dort ist unsere Stärke.

---

## 2. Wo der Burggraben wirklich liegt

Das Gremium formuliert es scharf, weil die Unterscheidung über den ganzen Bau entscheidet:

> **Nicht:** „Bei uns kannst du mit einer KI sprechen."
> **Sondern:** „Bei uns *zählt* das Sprechen — und die Zahl, die dabei herauskommt, ist wahr."

Warum das nur wir können:

- Wir haben bereits eine **Produktionsstufe** (`RetrievalStage = 'production'`) — die schwere Richtung, Schwedisch selbst erzeugen. Sprechen ist die reinste Form davon.
- Wir haben bereits ein **ehrliches Beweiskriterium** (`provenStableAt`: nur bei `good` **und** Produktionsstufe **und** Intervall ≥ 90 Tage). Es gibt in dieser App keine Punkte fürs Erscheinen.
- Wir haben bereits den **Dialog-Modus**, in dem „du bist dran"-Zeilen über `dialog:<id>:<turn>` in **dieselbe** Memory-Engine laufen wie das Lernen.

Ein Wettbewerber kann in zwei Wochen Sprach-Chat nachbauen. Er kann **nicht** in zwei Wochen eine ehrliche Messung nachrüsten — denn seine bestehenden Zahlen (XP, Streak, „Level 12") würden dann sichtbar bedeutungslos. Der Burggraben ist die Ehrlichkeit, nicht das Mikrofon.

---

## 3. Die Kollision mit der einen Design-Regel — und wie wir sie auflösen

Die Regel aus `CLAUDE.md`: *Jede Zahl muss ein wahres Signal echten, überprüften Lernfortschritts sein.*

**Freies Gespräch bricht diese Regel fast zwangsläufig.** Wer 10 Minuten frei plaudert, hat vielleicht viel gelernt, vielleicht nichts — messbar ist daran nur die Zeit. Würden wir Redezeit in Fortschritt umrechnen, wäre das exakt der Goodhart-Bruch, gegen den dieses Projekt gebaut ist. Das ist der Fehler, den der Markt macht.

**Die Auflösung — zwei sauber getrennte Betriebsarten:**

| | **Geführtes Sprechen** *(zählt)* | **Freies Gespräch** *(zählt nicht)* |
|---|---|---|
| Was passiert | Der Partner stellt eine Frage, die eine **bestimmte fällige Wendung** als Antwort verlangt | Man redet worüber man will |
| Prüfung | Gesagtes wird gegen den geprüften Chunk verglichen (`answerCheck.ts`, existiert) | keine |
| Wirkung | echter Abruf → `schedule()` → Erinnerungs-Maschine | nichts |
| Anzeige | „2 Wendungen bewiesen — gesprochen" | „12 Minuten geübt" — **ohne** Fortschrittsbalken, ausdrücklich als Übung ohne Messung gekennzeichnet |

Freies Gespräch ist wertvoll (Sprechangst, Sprechbereitschaft — dazu unten Evidenz) und darf existieren. Es bekommt nur **keine Zahl**. Das auszusprechen ist selbst ein Verkaufsargument: *„Wir sagen dir, wann Reden Übung war und wann es Beweis war."*

---

## 4. Geht das technisch? (Live-Recherche, Juli 2026)

**Ja — es gibt zwei technische Wege, und sie unterscheiden sich fundamental.**

### Weg A — Nachsprechen im Browser (Web Speech API)
Der Lerner **spricht** die vorhandenen „du bist dran"-Zeilen, statt sie zu tippen. Kein neuer Anbieter, kein Vertrag.

- Unterstützt in **Chrome, Edge, Safari** (dort mit `webkit`-Präfix). **Firefox: nein** (hinter einem Schalter, praktisch nicht verfügbar).
- **Wichtige Ehrlichkeit:** Standardmäßig ist das **nicht lokal** — Chrome und Safari schicken das Audio zur Erkennung an einen Server. Es gibt neuerdings einen echten On-Device-Pfad (`SpeechRecognition.available({ langs, processLocally: true })` und `SpeechRecognition.install(...)` mit heruntergeladenem Sprachpaket), aber ob es für **Schwedisch** auf dem jeweiligen Gerät vorhanden ist, muss zur Laufzeit geprüft werden; es gibt dokumentierte Fehler in aktuellen Chrome-Fassungen.
- Liefert **nur ein Transkript**, keine Laut-Bewertung. Für unseren Zweck reicht das: Wir wollen wissen, ob die **richtige Wendung** kam — nicht, wie sauber das „sj" saß.
- Kosten: **null.**

### Weg B — Echter Gesprächspartner (Realtime-Sprachmodell)
Sprache rein, Sprache raus, ohne Umweg über Text; Antwortbeginn unter ~0,5 s. Über WebRTC direkt aus dem Browser.

- Anbieter: OpenAI Realtime, Google Gemini Live (seit I/O 2026 allgemein verfügbar), weitere.
- **Der Haken für uns:** Beide verlangen ausdrücklich **kurzlebige Zugangs-Token, die ein Server ausstellt** („Never put an API key in frontend code"). Wir haben **kein Backend** — das ist eine bewusste Architekturentscheidung (`05-architecture.md`).
- Kosten sind **deutlich höher als oft behauptet**: gemessene Praxiswerte liegen bei ~0,06–0,24 $/Minute für typische Sprach-Agenten (mit Zwischenspeicherung ~0,05–0,10 $/min); Gemini Flash Live liegt mit ~0,005 $ ein / ~0,018 $ aus je Minute deutlich darunter. **Bei 15 Minuten täglich sind das je nach Anbieter grob 3 € bis 30 € im Monat.**
- Gemini Live begrenzt Sitzungen auf **15 Minuten** (nur Audio).
- Schwedische Sprachqualität dieser Stimmen ist **von hier aus nicht prüfbar** und muss vor jedem Versprechen gehört werden.

**Der Unterschied in einem Satz:** Weg A macht aus Tippen Sprechen — sofort, kostenlos, ohne neue Abhängigkeit. Weg B macht daraus ein echtes Gegenüber — mit Backend-Frage, laufenden Kosten und Datenschutz-Entscheidung.

---

## 5. Evidenz (mit Stufen, nichts beschönigt)

| Aussage | Stufe | Begründung |
|---|---|---|
| Lautes Produzieren der Zielsprache ist echter Abruf und stärkt das Behalten | **FELS** | Testing-Effekt + „pushed output" (Swain); dieselbe Grundlage, auf der die Produktionsstufe schon steht |
| KI-Gesprächsbots verbessern **Sprechen und Hören** messbar | **STARK** | Meta-Analysen 2024–2025 berichten mittlere bis große Effekte; Sprechen/Hören profitieren am deutlichsten |
| KI-Gespräche senken **Sprechangst** und erhöhen die Sprechbereitschaft | **STARK** | mehrere Studien, u. a. eine Mixed-Methods-Arbeit 2025; Geduld und Nicht-Bewertung sind der Wirkmechanismus |
| KI-Gespräche wirken auch auf **Langzeit-Erhalt** (unser eigentliches Produkt) | **SCHWACH** | Die Studien laufen Wochen, nicht Monate; Erhalt nach 6 Monaten ist praktisch unerforscht. **Wir dürfen das nicht behaupten.** |
| Ob der Bot „lehrhaft" oder „einfach Gesprächspartner" gestaltet ist, macht einen Unterschied | **SCHWACH** | Eine Meta-Analyse 2025 findet diesen Faktor **nicht** signifikant — ein Hinweis, dass Aufwand in die *Messung* besser investiert ist als in die *Persönlichkeit* |
| KI-**Aussprachebewertung** ist heute verlässlich | **WIDERLEGT (in der Praxis)** | Rezensionen dokumentieren Lob bei klar falscher Aussprache; unsere eigene Analyse in `gremium-feedback.md` §6 kommt zum selben Schluss |

**Folgerung des Gremiums:** Sprechen einbauen — ja. Mit Aussprache-*Noten* werben — nein. Mit „hält länger, weil du sprichst" werben — nein, dafür fehlt der Beleg.

---

## 6. Der Bauplan — drei Stufen, jede für sich nützlich

### Stufe 0 — **Sprechen statt Tippen** *(empfohlen: als Nächstes)*
Die vorhandenen „du bist dran"-Zeilen im Dialog-Modus und die Produktions-Abrufe im Lern-Loop bekommen ein **Mikrofon neben dem Eingabefeld**. Man sagt die schwedische Wendung; das Transkript geht durch dieselbe Prüfung wie getippter Text; dasselbe `schedule()` wird aufgerufen.

- **Nutzen pro Aufwand am höchsten:** Aus jedem bestehenden Abruf wird ein *gesprochener* Abruf — die schwerste und wertvollste Form.
- Kostet nichts, braucht kein Backend, kein Anbieter-Vertrag, füttert die ehrliche Messung ab der ersten Minute.
- Der `SpeechRecognizer`-Port steht seit Juli 2026 in `ports.ts` — es fehlt genau ein Adapter.
- **Ehrlich anzuzeigen:** „Die Erkennung läuft je nach Gerät über den Browser-Hersteller — dein Audio verlässt dabei das Gerät." Wenn On-Device verfügbar ist, nutzen wir es und sagen es.
- Tippen bleibt **immer** gleichwertig (Regel aus `gremium-navigation.md`: eine Bedienart nie zur einzigen machen).

### Stufe 1 — **Der geführte Sparringspartner** *(das, was der Nutzer meint)*
Ein echtes Sprachgespräch — aber **szenengebunden**: Der Partner spielt eine unserer 13 Szenen (Werkstatt, Café, Bahnhof, Rally …) und ist darauf angesetzt, genau die heute fälligen Wendungen hervorzulocken. Nach dem Gespräch: „Diese 4 Wendungen hast du selbst gesagt — sie sind gewertet. Diese 2 kamen nicht vor."

- Braucht: Anbieter-Entscheidung, **Backend-Frage** (Token-Ausstellung) oder eine bewusst dokumentierte BYOK-Ausnahme, Kostenrahmen, Anhören der schwedischen Stimme.
- **Nicht** ohne diese Entscheidungen bauen.

### Stufe 2 — **Freies Gespräch, ausdrücklich ungemessen**
Reden worüber man will, mit Rückblick („diese Wörter hast du gesucht"), **ohne Fortschrittszahl**. Wert: Sprechangst, Sprechbereitschaft. Kennzeichnung: „Übung, kein Beweis."

---

## 7. Was das Gremium ablehnt

- **Redezeit als Fortschritt.** Minuten sind Anwesenheit. Das ist der Bruch der einen Regel.
- **Eine Aussprache-Prozentzahl**, solange sie nicht auf einer echten Laut-Bewertung beruht (`gremium-feedback.md` §6). Lieber gar keine Zahl als eine erfundene.
- **Eine Figur mit Namen und Gesicht, die „anruft".** Duolingos Lily ruft von sich aus an — das ist eine Engagement-Mechanik, keine Lern-Mechanik, und sie erzeugt genau den Druck, gegen den wir den zerbrechenden Streak abgeschafft haben.
- **Sprechen als Pflicht.** Nicht jeder kann oder will laut sprechen (Umgebung, Stimme, Scham). Sprechen ist ein zweiter Weg zum selben Beweis, nie der einzige.

---

## 8. Offene Entscheidungen (gehören nach `10-open-questions.md`)

1. **Backend ja/nein für Stufe 1?** Realtime-Anbieter verlangen server-ausgestellte Token. Entweder erstes Backend (bricht „kein Backend") oder dokumentierte BYOK-Ausnahme mit dem Schlüssel im Browser (größere Angriffsfläche als heute, weil Realtime-Schlüssel Sprachminuten kosten).
2. **Anbieter + Kostenrahmen** — 3 €/Monat oder 30 €/Monat sind unterschiedliche Produkte.
3. **Schwedische Stimmqualität** — muss angehört werden, bevor irgendetwas versprochen wird. Von dieser Umgebung aus nicht prüfbar.
4. **Datenschutz-Text** — Stufe 0 schickt Audio je nach Gerät an Google/Apple. Formulierung, Standard-Einstellung (an/aus), On-Device-Erkennung bevorzugen.
5. **Was gilt als „gesagt"?** Transkript-Abgleich muss Erkennungsfehler verzeihen, ohne Falsches durchzuwinken — die Schwelle ist eine echte Entscheidung, kein Detail.

---

## 9. Maßnahmenplan *(Auftrag 2026-07-25: „setze alles komplett um, Stück für Stück")*

Das Gremium hat den Bauplan aus §6 in **sechs abarbeitbare Phasen** zerlegt. Jede Phase ist
für sich nutzbar, wird **einzeln geprüft** (Kaskade aus `TEST-UND-PRUEF-STANDARD.md`) und
**einzeln ausgeliefert** — nicht ein großer Wurf am Ende.

| Phase | Was entsteht | Abnahme („fertig" heißt) | Stand |
|---|---|---|---|
| **P1** | Spracherkennungs-Adapter hinter dem vorhandenen `SpeechRecognizer`-Port. On-Device bevorzugt, Verfügbarkeit **ehrlich** gemeldet | Adapter + Tests grün; auf einem Gerät ohne Erkennung erscheint **nichts** (kein toter Knopf) | ✅ `speech.ts`, `adapters/webSpeechRecognizer.ts` |
| **P2** | Mikrofon im Lern-Loop (Produktion) und in der „du bist dran"-Zeile im Gespräch | Gesprochenes läuft durch **dieselbe** Prüfung und **dasselbe** `schedule()` wie Getipptes; Tippen bleibt gleichwertig | ✅ `useSpeechInput.ts`, `SpeakButton.tsx` |
| **P3** | Gesprochene Abrufe werden als solche **festgehalten und ehrlich angezeigt** | „davon gesprochen: N" ist eine **Teilmenge** des Bewiesenen, keine zweite Währung | ✅ `ReviewEvent.spoken`, `spokenAloud()` |
| **P4** | Szenengebundener Sparringspartner: Erkennung → Antwort auf Schwedisch → Sprachausgabe | Er lockt **fällige Wendungen** hervor, prüft sie gegen den geprüften Chunk, füttert die Engine; ohne Schlüssel unsichtbar | ✅ `modules/sparring/` |
| **P5** | Freies Gespräch — ausdrücklich **ohne Messung** | Kein Fortschrittsbalken, keine Zahl, sichtbare Kennzeichnung „Übung, kein Beweis" | ✅ Modus-Wahl „Frei · zählt nicht" |
| **P6** | Kaskade, e2e, Screenshots hell/dunkel, Doku, Auslieferung | grüner, reproduzierbarer Lauf **plus eigenes Ansehen** | ✅ 14 e2e, 196 Tests |

### Ausbau nach P5 *(2026-07-25, „bau es noch weiter aus")*

Drei Dinge, die beim Benutzen fehlten:

1. **Freihändig.** Nach jeder Zeile des Partners geht das Mikrofon von selbst an — man
   redet, statt zu bedienen. Technisch hängt das an einer Kleinigkeit: Die Sprachausgabe
   meldet jetzt, wann sie **fertig** ist (`speakSwedish` liefert ein Versprechen), sonst
   hörte das Mikrofon die eigene Stimme des Geräts. **Voreinstellung: aus.** Ein Mikrofon,
   das ungefragt zuhört, wäre ein Übergriff, kein Komfort.
2. **Ein Ende mit Abrechnung.** Das Gespräch lief endlos. Jetzt endet es — von selbst, wenn
   alle Zielwendungen gesagt sind, oder auf Knopfdruck — und zeigt eine Bilanz: welche
   Wendung **selbst gesagt** wurde und welche **nicht vorkam**. Beides steht da; nur die
   Erfolge zu zeigen wäre die halbe Wahrheit. Ohne fällige Wendungen sagt die Bilanz
   ausdrücklich, dass es keine Zahl gibt. „Weiterreden" bleibt möglich — beendet ist keine
   Sackgasse.
3. **Fast-Treffer.** Wer „jag skulle vilja **har**" sagt statt „…vilja **ha**", hat die
   Wendung erkennbar abgerufen und nur die Endung verfehlt — bisher passierte in diesem
   Fall **nichts**, und keine Rückmeldung ist die schlechteste Rückmeldung. Jetzt steht
   dort: *„Fast — du hast ‚…' gesagt, gemeint ist ‚…'."* Mit dem entscheidenden Zusatz:
   **Zählt noch nicht.** „Fast" ist nicht „gesagt"; der Hinweis geht an den Menschen, nicht
   in die Messung. Toleranz: höchstens zwei Zeichen Abweichung, gesucht in einem Fenster
   von einem Wort mehr oder weniger.
4. **Zehn Kulissen statt fünf.** Alle vorhandenen Szenenbilder sind jetzt auch als
   Sparring-Ort wählbar — inklusive der modernen: **Zocken über Discord**, **Rallye-Strecke**,
   **beim Spiel**. In deren Auftragssatz steht ausdrücklich „normales Erwachsenen-Schwedisch,
   keine Jugendsprache" (Projektvorgabe). Die Liste liegt jetzt in `settings.ts` — ohne React,
   damit ein Test sie prüfen kann: keine doppelte Kulisse, kein Kürzel ohne Bild, kein zu
   kurzer Auftragssatz (dann würde sich der Partner die Szene selbst ausdenken).
5. **Sichtbar, auch ohne Zugang** *(Korrektur 2026-07-25, nach Rückmeldung)*. Zuerst war der
   Einstieg versteckt, solange kein eigener KI-Zugang hinterlegt war — begründet mit „kein
   toter Knopf". Der Nutzer hat den Modus daraufhin schlicht **nicht gefunden**. Die Regel war
   richtig, ihre Anwendung falsch: Ein Knopf, der ehrlich sagt, was ihm fehlt, und den Weg
   dorthin zeigt, ist kein toter Knopf. Ein unsichtbarer Modus ist dagegen ein Modus, den es
   für den Nutzer nicht gibt. Jetzt steht der Einstieg immer da — gedämpft und mit der Zeile
   „Braucht deinen eigenen KI-Zugang — hier steht, wie das geht", dahinter eine Anleitung in
   drei Schritten und ein Knopf, der die Einstellungen öffnet.
6. **Sprechen auf der ersten Seite.** Der Einstieg steht jetzt auch auf „Heute" — mit der
   ehrlichen Unterzeile: entweder *„N fällige Wendungen im Gespräch selbst sagen"* oder
   *„Gerade nichts fällig — reden geht, gemessen wird nichts."*

**Was beim Bauen dazukam — die Anti-Nachplapper-Regel.** Der Prompt verbietet dem Partner,
die Zielwendungen selbst auszusprechen. Ein Modell hält sich aber nicht immer an ein Verbot,
und eine Messung, die sich auf ein Versprechen verlässt, ist keine Messung. Deshalb filtert
`matchedTargets()` zusätzlich hart: Was in der letzten Partner-Zeile stand, zählt beim
Lerner nicht. Lieber eine echte Leistung übersehen als eine erfundene zählen.

### Die Anbieterfrage — vom Gremium neu entschieden

§8 nennt als offenen Punkt, ob wir für Phase 4 ein Backend brauchen. Beim Zerlegen fiel auf,
dass die Frage **umgangen** werden kann: Wir besitzen bereits alle drei Teile eines
Sprachgesprächs.

```
Ohr:   Web-Speech-Erkennung (P1, kostenlos, kein Vertrag)
Kopf:  Claude über BYOK  (schon gebaut, schon bezahlt vom Nutzer selbst)
Mund:  Web-Speech-Ausgabe (schon gebaut, sv-Stimme wird bereits gewählt)
```

Zusammengesetzt ergibt das ein **echtes gesprochenes Gespräch** — ohne neuen Anbieter, ohne
Backend, ohne Token-Ausstellung, ohne zusätzlichen Schlüssel. Der Preis ist Latenz: statt
~0,3 s bei echter Sprach-zu-Sprach-Verarbeitung liegen wir bei grob 1–3 s pro Antwort.

**Das Gremium hält diesen Tausch für richtig** — aus zwei Gründen:
1. Für einen **Lern**-Partner ist eine kurze Denkpause kein Mangel. Ein Lehrer, der 1,5 s
   überlegt, wirkt nicht defekt. Ein Wettbewerber optimiert auf Gesprächs-*Gefühl*; wir
   optimieren auf **Behalten**.
2. Es hält die Architektur sauber (kein Backend) und die Kosten bei **null zusätzlich**.

Echte Sprach-zu-Sprach-Verarbeitung bleibt eine **spätere Austausch-Option hinter demselben
Port** — genau dafür ist die Port-Schicht da. Damit ist die Backend-Frage aus §8 für P4
**vertagt statt blockierend**.

### Reihenfolge und Begründung

P1 → P2 → P3 → P4 → P5 → P6. Nicht verhandelbar ist die Position von **P3 vor P4**: Erst muss
feststehen, wie ein gesprochener Abruf **gezählt** wird, dann darf ein Gesprächspartner
welche erzeugen. Andersherum entstünde genau der Zustand, den §3 verbietet — Reden ohne
Messung, das trotzdem irgendwie „zählt".

---

## Quellen (Live-Recherche, Juli 2026 — verifiziert)

**Markt**
- Duolingo — Video Call auf Android, Sprachliste: https://investors.duolingo.com/news-releases/news-release-details/duolingo-launches-ai-powered-video-call-android
- Duolingo Blog — „Get to know the AI behind every Video Call": https://blog.duolingo.com/ai-and-video-call/
- TalkPal-Rezension (Schwedisch; unzuverlässige Aussprache-Rückmeldung): https://languatalk.com/blog/talkpal-review/
- Speak-Rezension: https://languatalk.com/blog/speak-app-review/

**Technik**
- OpenAI — Realtime API mit WebRTC (kurzlebige Token aus dem eigenen Server): https://developers.openai.com/api/docs/guides/realtime-webrtc
- Gemini Developer API — Preise: https://ai.google.dev/gemini-api/docs/pricing
- Gemini Live in Produktion (Vertex AI, I/O 2026): https://byteiota.com/gemini-live-api-production-vertex-ai/
- Gemessene Realtime-Kosten aus ~4 000 Sitzungen: https://hackernoon.com/openai-realtime-api-pricing-in-2026-real-world-data-from-4000-measured-sessions
- MDN — `SpeechRecognition`: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
- MDN — `SpeechRecognition.processLocally`: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/processLocally
- MDN — `SpeechRecognition.available()` (statisch): https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/available_static
- Erklärung On-Device-Spracherkennung (W3C-Arbeitsgruppe): https://github.com/WebAudio/web-speech-api/blob/main/explainers/on-device-speech-recognition.md

**Evidenz**
- Lyu et al. (2025), Meta-Analyse Chatbots im Sprachenlernen, *International Journal of Applied Linguistics*: https://onlinelibrary.wiley.com/doi/full/10.1111/ijal.12668
- Systematisches Review KI-Chatbots in der Zweitsprachbildung (2025), *ScienceDirect*: https://www.sciencedirect.com/science/article/pii/S2215039025000086
- Sprechfertigkeit und Sprechangst mit KI-Bots (2025), *Humanities and Social Sciences Communications*: https://www.nature.com/articles/s41599-025-05550-z
- Chatbot-gestütztes Lernen, Meta-Analyse, *Education and Information Technologies*: https://dl.acm.org/doi/abs/10.1007/s10639-023-11805-6

> **Anschluss:** Feedback/ASR-Grenzen `gremium-feedback.md` §6 · Aussprache-Anleitung `gremium-aussprache.md` · Messung/Ehrlichkeit `07-measurement.md` · Architektur/Ports `05-architecture.md` · offene Entscheidungen `10-open-questions.md`.
