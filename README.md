# NEUROLANG

**Die Sprachlern-App, die man nie „durch" hat — weil Behalten das Produkt ist, nicht Lernen.**

Erste Sprache: **Deutsch → Schwedisch.** Zielnutzer: erwachsene Selbstlerner, die schon Duolingo/Babbel/Lingua probiert haben, dabei durchaus etwas gelernt — es aber nie langfristig behalten haben und an der steigenden Schwierigkeit abgesprungen sind.

> **Status:** Meilenstein 1 — schlankes MVP im Aufbau. Das Konzept (M0) ist abgeschlossen; jetzt entsteht das lauffähige Framework: eine installierbare, offline-fähige PWA. Siehe `docs/09-roadmap.md` und **Entwicklung & Installation** unten.

---

## In einfachen Worten (ohne Technik-Kauderwelsch)

*Dieser Abschnitt erklärt das Projekt in Alltagssprache — für alle, die nicht aus der IT kommen.*

**Was ist NEUROLANG?**
Eine App zum Schwedisch-Lernen. Der Unterschied zu Duolingo & Co.: Die meisten Apps helfen dir, etwas *neu* zu lernen — aber nach ein paar Wochen ohne Übung ist das meiste wieder weg. NEUROLANG ist so gebaut, dass du das Gelernte **dauerhaft behältst**. Die App fragt dich immer genau dann wieder ab, kurz bevor du etwas vergessen würdest.

**Wie weit sind wir? — Stell dir vor, wir bauen ein Haus:**
- ✅ **Das Haus steht.** Die App funktioniert bereits: Man kann damit lernen, sie merkt sich den Fortschritt und lässt sich wie eine echte App aufs Handy legen. Ich habe alles selbst durchgetestet — es läuft fehlerfrei.
- 🚧 **Die Einrichtung fehlt noch.** Die schwedischen Beispielsätze in der App sind bisher nur ein Platzhalter zum Ausprobieren. Bevor echte Leute damit lernen, sollte jemand mit Schwedisch als Muttersprache die Sätze einmal durchsehen.

**Die nächsten Schritte — ganz einfach erklärt:**
1. **Ins Internet stellen** — damit du die App im Browser öffnen und aufs Handy legen kannst. Das kann ich vorbereiten; danach müssen nur noch ein paar Einstellungen bei GitHub angeklickt werden.
2. **Schwedisch prüfen lassen** — eine schwedischsprachige Person schaut die Sätze einmal durch. Eine fertige Checkliste dafür liegt schon bereit.
3. **Wirklich ausprobieren** — ein paar Wochen damit lernen und schauen, ob wirklich mehr hängen bleibt als bei anderen Apps.

**Am einfachsten ausprobieren** kannst du die App, sobald Schritt 1 erledigt ist: Dann reicht ein Link im Handy-Browser — ganz ohne Technik-Wissen.

---

## 1. Das Problem (der ehrliche Kern)

Jede große Sprachlern-App optimiert *Erwerb* — Lektionen abschließen, Vokabeln „durchnehmen", Streaks halten. Keine optimiert *Erhalt*.

Die Folge kennt jeder, der das durchgemacht hat: Man baut über Monate etwas auf, nutzt es dann eine Weile nicht — und muss danach über einfachste Wörter nachdenken. Das ist kein persönliches Versagen, sondern ein erforschtes Phänomen: **Sprachattrition.** Produktives Wissen verfällt schneller als rezeptives, und alles Unbenutzte zerfällt — außer man baut Erhalt als *Mechanik* ein.

Drei Ursachen, alle belegbar:
1. Wissen wurde nie bis zur Automatik überlernt.
2. Es hing an wenigen Kontexten und Abrufreizen.
3. Nichts hat es je reaktiviert.

## 2. Die These

NEUROLANG optimiert **messbaren Erhalt** statt Engagement. Der Fortschrittswert ist nicht „Lektionen" oder „Streak", sondern:

> *Was du gerade zuverlässig behältst.*  
> z. B. „340 Chunks aktiv, davon 60 auch nach 90 Tagen ohne Übung stabil."

Das ist die einzige Zahl, die in der Realität etwas bedeutet.

## 3. Was NEUROLANG anders macht

| | Klassische Apps | NEUROLANG |
|---|---|---|
| Optimiert auf | Engagement (Streak, XP) | messbaren Erhalt |
| Lerneinheit | isolierte Vokabel | Chunk im Kontext |
| Schwierigkeit | fixe Lektionskurve → Cliff | adaptives Erfolgsband (~80–85 %) |
| „Fertig" | Kurs abgeschlossen | nie — Wartung läuft ewig weiter |
| Belohnung | Punkte fürs Erscheinen | Signal echter Kompetenz |
| Content | fixer Baum | KI-generiert, on demand, auf i+1 |

## 4. Die Methode: Begegnen → Abrufen → Erhalten

Kein Zaubertrick, sondern die konsequente Verdrahtung weniger sehr robuster Effekte zu **einer Schleife pro Chunk** (Chunk = sinnvolle Wendung im Kontext, nie isolierte Vokabel):

1. **Verständliche Begegnung** — der Chunk erscheint eingebettet in verstandenem Input auf i+1-Niveau. *(Comprehensible Input; Encoding u. a. per Birkenbihl-Dekodierung — siehe `docs/03-method.md`.)*
2. **Aktiver Abruf** — kurz danach selbst herholen, erst Wiedererkennen, später Produktion. *(Testing Effect.)*
3. **Abruf am Vergessenspunkt** — der Chunk kommt exakt dann zurück, wenn Vergessen droht; Intervalle dehnen sich. *(Spacing Effect.)*
4. **Kontextvariation** — Wiederkehr in *anderen* Sätzen/Situationen, nie identisch. *(Direkter Fix gegen kontextgebundenes Verblassen.)*
5. **Wartungsmodus** — ein „gelernter" Chunk verschwindet nie, sondern wandert in einen sich ewig verlängernden Erhalt-Rhythmus. **Das ist der Teil, den keine App hat — und der Grund, warum es diesmal bleibt.**

Details: `docs/03-method.md`.

## 5. Wissenschaftliche Grundlage

Jede Funktion wird begründet und nach **Evidenzstärke gekennzeichnet** (Fels / stark / schwach / widerlegt). Die Grundlage ist ein *Gremium mehrerer Stimmen*, keine einzelne Lehre:

- **Ebbinghaus** — Vergessenskurve, Spacing
- **Roediger & Karpicke** — Retrieval Practice / Testing Effect
- **Krashen** — Comprehensible Input (i+1)
- **Bjork** — Desirable Difficulties
- **Deci & Ryan** — Selbstbestimmungstheorie (Motivation)
- **Csíkszentmihályi** — Flow
- **Vera F. Birkenbihl** — Dekodieren, Anti-Vokabelpauken, gehirngerechtes Encoding *(als eine praxisnahe Stimme, nicht als Fundament)*

Ausdrücklich **draußen** (widerlegt/Deko): „Lernstile", generisches „Brain-Training", „Neuroplastizität" als Design-Prinzip. Details & Quellen: `docs/02-science.md`.

## 6. Die vier Module (statt zehn „Engines")

1. **Content-Pipeline** — erzeugt verständlichen, auf i+1 graduierten schwedischen Input on demand (der Moat). `docs/08-content-pipeline.md`
2. **Comprehension-Loop** — Begegnung → Verständnishilfen → Verständnis-Check → Logging. `docs/04-product.md`
3. **Memory-Engine** — Spacing, Retrieval-Scheduling, Wartung, Kontextvariation. `docs/03-method.md`
4. **Progress-/Measurement-Modul** — die neue, ehrliche Gamification. `docs/06-motivation.md`, `docs/07-measurement.md`

## 7. Der Moat: KI-Content-Pipeline

Für Schwedisch existiert kaum graded Content, und kuratierte Podcasts führen in Lizenzprobleme. Der einzige tragfähige Weg ist eine **KI-Pipeline, die verständlichen Input exakt auf i+1 on demand erzeugt** (LLM → Grading → schwedisches TTS → optional Bild/Kontext) — und Birkenbihls Dekodierung automatisiert, die historisch von Hand gemacht werden musste. Das kann ein fixer Content-Baum strukturell nicht. Das ist der Grund, warum NEUROLANG als KI-natives Produkt überhaupt existieren darf.

## 8. Motivation ohne Dopamin-Tricks

Grundregel: **belohne Kompetenz, nicht Anwesenheit** — und jede Belohnung muss ein *wahres* Signal echten Fortschritts sein (sonst Goodhart: man optimiert den Streak statt die Sprache). Vier Mechaniken: lebendes Gedächtnisfeld · Meilensteine an realer Fähigkeit · Flow-Band · ehrlicher „Streak" als Gesundheitssignal (pflegen statt Kette zerreißen). Details: `docs/06-motivation.md`.

## 9. Roadmap (Kurzform)

- **M0 — Konzept & Doku** *(abgeschlossen)*: README, `CLAUDE.md`, `/docs`.
- **M1 — schlankes MVP** *(diese Phase)*: installierbare Web-App (PWA), *ein* Level, ~20 handgeprüfte schwedische Segmente, der Comprehension-Loop, simple Fortschrittsanzeige. Beweist den Kern an einem echten Lerner. Das Framework steht (siehe **Entwicklung & Installation**); geprüfte Inhalte und Feinschliff folgen.
- **später**: Content-Pipeline automatisieren, Memory-Engine ausbauen, weitere Level/Sprachen, Mobile-Verpackung.

Vollständig: `docs/09-roadmap.md`.

## 10. Was dieses Projekt NICHT ist

- Kein Klon von Duolingo/Babbel/Busuu.
- Kein XP-/Level-/Diamanten-System, kein zerbrechender Streak.
- Kein Vokabelpauken isolierter Wörter.
- Keine unbelegten „Neuro"-Versprechen oder „Lernstile".
- Keine zehn Module in v1. Kein Backend auf Vorrat. Keine Architektur vor dem Konzept.

## 11. Dokumentationsstruktur

```
docs/
  01-vision.md            Vision, Mission, Zielnutzer
  02-science.md           Gremium + Evidenzstufen + Quellen
  03-method.md            Begegnen→Abrufen→Erhalten, Birkenbihl-Fusion
  04-product.md           Comprehension-Loop, täglicher Ablauf
  05-architecture.md      Module, Datenfluss, spätere Technik
  06-motivation.md        Belohnungssystem (SDT, 4 Mechaniken)
  07-measurement.md       Was „Erhalt" numerisch bedeutet
  08-content-pipeline.md  Der Moat: KI-Input + Auto-Dekodierung
  09-roadmap.md           Meilensteine, Prioritäten
  10-open-questions.md    Ehrliche offene Punkte, vertagte Entscheidungen
  11-ideas.md             Parkplatz (z. B. Suno-Songs als Input)
```

## 12. Design- & Qualitätsphilosophie

Praktische, lauffähige Substanz vor architektonischer Komplexität. Jede technische Entscheidung wird dokumentiert und begründet. Doku nur so tief, wie sie eine Entscheidung stützt — kein Markdown-Friedhof. Deutsch für nutzer- und projektnahe Inhalte, Englisch im Code. Technikwahl (Modelle, Stack) wird bei Build-Start **per Live-Recherche** getroffen, nicht aus dem Gedächtnis — dieser Teil veraltet zu schnell.

## 13. Entwicklung & Installation

Stack (bei Build-Start per Live-Recherche gewählt — Begründung in `docs/05-architecture.md`): **Vite + React + TypeScript + Tailwind**, PWA via **`vite-plugin-pwa`**, lokale Daten in **IndexedDB** (`idb`). Kein Backend.

```bash
npm install      # Abhängigkeiten
npm run dev      # lokaler Dev-Server (Vite)
npm run build    # Produktions-Build nach dist/
npm run preview  # Build lokal servieren
npm test         # Unit-Tests (Vitest)
npm run lint     # ESLint
```

**Auf dem Handy installieren:** den Build über **HTTPS** servieren bzw. hosten, im mobilen Browser öffnen → „Zum Startbildschirm hinzufügen". Android/Chrome zeigt zusätzlich den In-App-Button „NEUROLANG installieren"; auf iOS: Teilen → „Zum Home-Bildschirm". Danach läuft NEUROLANG als eigenständige, offline-fähige App.

### App live schalten (kostenlos, über GitHub Pages)

Alles Technische ist schon vorbereitet: ein automatischer Ablauf (`.github/workflows/deploy.yml`)
baut die App und veröffentlicht sie — er prüft vorher Lint + Tests, damit nie eine kaputte
Version live geht. Es fehlen nur **zwei Klicks von dir** auf github.com:

1. **Einmalig anschalten:** Im Repo auf **Settings → Pages** gehen, unter „Build and deployment"
   bei **Source** „**GitHub Actions**" auswählen. (Nur dieses eine Mal nötig.)
2. **Code auf `main` bringen:** Der Veröffentlichungs-Ablauf startet, sobald die Änderungen auf
   dem Haupt-Zweig `main` liegen. Dafür wird der aktuelle Arbeits-Zweig per **Pull Request**
   nach `main` zusammengeführt (sag Bescheid, dann lege ich den Pull Request an).

Danach läuft der Ablauf automatisch und die App erscheint unter
`https://<dein-name>.github.io/<repo>/` — den genauen Link zeigt GitHub nach dem ersten Lauf
unter **Settings → Pages** und in der **Actions**-Übersicht. Diesen Link im Handy-Browser öffnen
→ „Zum Startbildschirm hinzufügen", fertig.

> Hinweis: Die mitgelieferten schwedischen Segmente sind ein **Platzhalter** zum Ausprobieren des Loops — noch **nicht** die geprüften M1-Inhalte (siehe `docs/08-content-pipeline.md`).

### Gebaut vs. konzipiert (Ehrlichkeit, kein Überzeichnen)

Damit Doku und Realität nicht auseinanderdriften — was *heute Code* ist und was noch *Konzept*:

| Konzept-Baustein | Stand |
|---|---|
| Comprehension-Loop (Begegnung → Hilfen → Abruf → Logging) | ✅ gebaut |
| Memory-Engine — Spacing per **FSRS** (DSR-Modell), Stufen, Wartung, Demotion | ✅ gebaut |
| Ehrliche Messung (aktiv · reift · **bewiesen** stabil · Abdeckung) | ✅ gebaut |
| Kontextvariation, Tages-Dosierung neuer Chunks | ✅ gebaut |
| Thematische Struktur — Chunks in Kategorien, ehrliche Themen-Abdeckung („X von Y bewiesen stabil"), Fokus-Wahl für neuen Stoff | ✅ gebaut (`gremium-struktur.md`) |
| Navigation — Übersicht → Thema-Detail (Drill-down mit den einzelnen Wendungen) → fokussierte Lern-Session (mit Fortschritt & Zurück) | ✅ gebaut (client-seitig, kein Router) |
| Installierbare PWA, offline, lokale Daten | ✅ gebaut |
| Adaptives Erfolgsband ~80–85 % (Neuzufuhr passt sich an) | ✅ gebaut (Session-Ebene; Intervall-Feintuning später) |
| Echte Produktionserfassung (Tippen statt Selbstnote) | ✅ Tippen gebaut · Sprechen/ASR später |
| Formatives Feedback bei Tipp-Produktion (Abweichung zeigen + Hinweis + „Nochmal versuchen") | ✅ gebaut |
| Optionale KI-Erklärung „🤖 Warum?" zum Tipp-Fehler (gekennzeichnet, opt-in) | ✅ gebaut (BYOK) |
| Aussprache-Anleitung „🗣️" — deterministische Laut-Hinweise aus der Schreibung (on-device) | ✅ gebaut · ASR-Bewertung 🚧 post-M1 |
| KI-Port-Schicht (anbieter-agnostisch) + nutzerseitige KI-Auswahl & Login | ✅ gebaut (⚙️-Einstellungen, Claude-Adapter per BYOK, On-demand-KI-Dekodierung im Loop) |
| On-device-Sprachausgabe (Web-Speech, zuverlässige sv-Stimme + Langsam-Option) | ✅ gebaut |
| Premium-Design-Handschrift — High-End-**Glasoberfläche** (iPhone-Anmutung): Aurora-Tiefenhintergrund, Milchglas-Karten, Champagner-Gold-Akzent, ruhige Animationen | ✅ erste Umsetzung (`docs/design-handschrift.md`) · eigene Icons/Feinschliff später |
| Natürlicheres schwedisches TTS (neuronal/Cloud) + Audio-QS | 🚧 konzipiert (Entscheidung offen) |
| KI-Content-Pipeline (der Moat) — erste Scheibe: „🤖 Neuer Kontext" erzeugt on demand einen neuen i+1-Satz (gekennzeichnet „nicht geprüft", opt-in, BYOK) | ✅ erste Scheibe gebaut · Grading + schwedische QS 🚧 |

Priorisierte Umsetzung: `docs/gremium-review-M1.md` (Maßnahmenkatalog).

Projektstruktur des App-Codes:

```
src/
  domain/        Chunk, ChunkState — das zentrale Datenmodell
  storage/       IndexedDB-Persistenz (idb)
  modules/
    content/      Content-Pipeline (Seed-Quelle; später KI)
    comprehension/ Comprehension-Loop (UI) + TTS
    memory/       Memory-Engine (Spacing, Scheduling) + Tests
    progress/     Metriken (ehrlicher Erhalt) + lebendes Gedächtnisfeld + Tests
  session/       Tages-Session zusammenstellen (Wartung zuerst)
  ui/            App-Shell-Bausteine (Install-Button …)
```
