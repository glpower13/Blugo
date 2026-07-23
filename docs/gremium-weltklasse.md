# Gremium — Weltklasse & Burggraben (Stufe-D-Design-Session)

> **Ehrlicher Rahmen — bitte zuerst lesen**
> - **Was das ist:** eine *rollenbasierte* Design-Session (Stufe D aus `TEST-UND-PRUEF-STANDARD.md`). Ich spiele mehrere Fach-Perspektiven durch — das sind **keine echten, namentlich sprechenden Personen** und **keine erfundenen Zitate**.
> - **Vera Birkenbihl:** nur ihre **dokumentierten Konzepte** als Linse (Dekodieren, Anti-Vokabelpauken, „Kapieren statt Pauken"). Ich lege ihr **kein Wort in den Mund**.
> - **Evidenz:** Jede fachliche Aussage trägt eine Stufe — **[FELS] / [STARK] / [SCHWACH] / [WIDERLEGT]**, konsistent mit `02-science.md`.
> - **Technik-Fakten:** per **Live-Recherche (Juli 2026)**, Quellen am Ende. Nichts aus dem Gedächtnis behauptet (so verlangt es `CLAUDE.md`).
> - **Keine stillen Entscheidungen:** Was gebaut werden soll, steht als **Empfehlung + offene Entscheidung**, nicht als Alleingang. Große Weichen gehen an den Menschen (`10-open-questions.md`).

---

## 0. In einfachen Worten (für Nicht-Techniker)

Wir wollen nicht „noch eine Vokabel-App", sondern die **einzige, die aufs *Behalten* spezialisiert ist**. Andere Apps bringen dir etwas bei und lassen dich damit allein — nach Wochen ist es weg. Unser **Burggraben** (das, was uns schwer kopierbar macht) besteht aus drei Schichten:

1. **Wir wollen etwas, das sonst keiner will:** Behalten statt „möglichst lange in der App". Das widerspricht dem Geschäftsmodell der Großen — deshalb machen sie es nicht.
2. **Wir werden mit jedem Tag besser für *dich*:** Die App merkt sich genau, was *du* schon kannst, und erzeugt neuen Übungsstoff exakt darauf zugeschnitten. Je länger du dabei bist, desto passgenauer — das kann ein fertiger Kurs nie.
3. **Deine Daten gehören dir:** Alles läuft auf deinem Gerät, kein Konto nötig. Das schafft Vertrauen — und macht uns unabhängig von Firmen und Moden.

Der **eine wichtigste nächste Schritt**: den „Erinnerungs-Motor" der App auf das weltweit beste, kostenlose Verfahren (**FSRS**) umstellen. Das bringt das meiste echte Behalten pro Aufwand — und kostet nichts. **✅ Umgesetzt am 2026-07-23** (Schritt A, siehe §6/§7); der nutzerspezifische Feinschliff („FSRS-6") folgt später mit echten Nutzungsdaten.

---

## 1. Der Auftrag (und wie wir „weltbeste" messbar machen)

Ziel: die **weltbeste** Sprachlern-App, deren Produkt **Behalten** ist (nicht Geldverdienen), **so leicht/einfach/schnell wie möglich** und **zukunftssicher**.

„Weltbeste" ist als Wort wertlos (Goodhart-Falle). Wir übersetzen es in **vier Zielgrößen**, gegen die jede Entscheidung geprüft wird:

| Zielgröße | Frage | Warum |
|---|---|---|
| **R — Retention** | Wie viel bleibt nach *Wochen/Monaten Pause* abrufbar? | Der eine echte Wert (`07-measurement.md`). |
| **T — Time-to-Value** | Wie schnell erlebt der Lerner das erste „es bleibt wirklich"? | „leicht & schnell". |
| **F — Friction** | Wie viele Klicks/Entscheidungen bis zur ersten Lernminute? | „einfach". |
| **L — Longevity** | Überlebt die Technik Modell-, Firmen- und Moden-Wechsel? | „zukunftssicher". |

---

## 2. Das Gremium (die Linsen)

| # | Linse | Vertritt (Konzepte) |
|---|---|---|
| L1 | **Kognitionspsychologie / Gedächtnis** | Ebbinghaus, Cepeda, Roediger & Karpicke, Bjork |
| L2 | **Angewandte Linguistik / Spracherwerb** | Krashen (i+1), Nation (Chunks/Coverage), Long (Interaktion) |
| L3 | **Sprachdidaktik / erfahrene Lehrkräfte** | Motivation, Fehlerkorrektur, echte Produktion, Anti-Cliff |
| L4 | **Birkenbihl-Methode (dokumentiert)** | Dekodieren, Verstehen vor Produktion, gehirngerechtes Encoding |
| L5 | **Retention-/Attritionsforschung** | Bahrick (Permastore), Schmid & Köpke (Attrition), Überlernen |
| L6 | **Motivation** | Deci & Ryan (SDT), Csíkszentmihályi (Flow), Locke & Latham (Ziele) |
| L7 | **Software-Architektur / Web** | Local-first, PWA, Ports & Adapters, Testbarkeit, A11y, Datenschutz |
| L8 | **KI-/Content-Pipeline-Architektur** | On-demand i+1-Generierung, Auto-Dekodierung, anbieter-agnostisch |
| L9 | **Produktstrategie / Meta** | Moat-These, Goodhart-Leitplanke, Ehrlichkeit als Positionierung |

---

## 3. Die Kernfrage: Was ist der *echte* Burggraben?

**Falsche Antwort:** „Wir nutzen KI, um Inhalte zu erzeugen." Das ist in 12 Monaten Standard und von jedem kopierbar.

**Richtige Antwort — drei Schichten, die zusammen schwer kopierbar sind:**

- **L9 · Fokus-Moat (Positionierung):** Wir optimieren **Erhalt/Wartung**, nicht Engagement. Das ist *technisch* kopierbar, aber die Platzhirsche **wollen** es nicht — ihre Kennzahlen (tägliche Nutzung, Streak-Bindung) stehen dem entgegen. „Category of one" durch das Ziel, nicht durch einen Trick. **[STARK]** als Strategie; Attritions-Problem real belegt (`02-science.md`).
- **L8/L1 · Daten-/Personalisierungs-Moat (der compoundende Kern):** Ein pro Lerner wachsendes **Gedächtnismodell** (welcher Chunk sitzt wie fest?) **steuert** die Erzeugung von Input — exakt auf i+1, am Vergessenspunkt, in *variiertem* Kontext — und **misst** ehrlich, ob das Behalten real gestiegen ist. Diese Rückkopplung wird mit jedem Tag Nutzung besser. **Nicht das KI-Generieren ist der Moat, sondern die geschlossene Schleife Messen → Erzeugen → Messen.**
- **L7 · Vertrauens-Moat:** **Local-first**, keine Konten, Daten gehören dem Nutzer. In einer Welt der Datenverwertung ist glaubwürdige Ehrlichkeit selbst ein Graben — und zahlt auf die nicht-verhandelbare Design-Regel ein.

> **Merksatz fürs Team:** Kopierbar ist das *Werkzeug* (KI). Nicht kopierbar ist die *Schleife* aus ehrlicher Messung und darauf zugeschnittener Erzeugung — plus der Mut, auf Behalten statt Bindung zu optimieren.

---

## 4. Befunde je Linse (verdichtet: 1 Kernbefund + was „weltbeste" verlangt)

- **L1 Gedächtnis:** Spacing + Retrieval sind **[FELS]**. „Weltbeste" verlangt den **best-belegten Scheduler**, nicht einen Ad-hoc-Eigenbau. → **FSRS-6** (siehe §5, §6). 
- **L2 Spracherwerb:** Verständlicher Input auf i+1 ist Treiber **[STARK]**; Lerneinheit ist der **Chunk**, nicht das Wort **[STARK]**. „Weltbeste" verlangt *unbegrenzten* passgenauen Input → nur per Pipeline erreichbar (Moat). 
- **L3 Didaktik:** Größter Abbrecher-Grund ist die **Schwierigkeits-Klippe**. „Weltbeste" verlangt ein **adaptives Erfolgsband ~80–85 %** über *Intervalle und Inhaltsschwere* (M1 hat es auf Session-Ebene; Intervall-Ebene kommt mit FSRS). **[STARK]**
- **L4 Birkenbihl:** Dekodierung senkt Einstiegshürde (Verstehen ohne Pauken) — **[SCHWACH–mittel]**, an Comprehensible Input anschlussfähig. „Weltbeste" verlangt **automatische** Dekodierung (der historische Handschritt) → Pipeline-Baustein. Passiv-/Schlafhören bleibt **[WIDERLEGT/SCHWACH]** — **nicht bauen**.
- **L5 Attrition:** Sehr lange gehaltenes Wissen („Permastore") entsteht durch **Überlernen + Wartung** **[STARK]**. „Weltbeste" verlangt den **ewigen Wartungs-Rhythmus** als Kern — genau unser Alleinstellungsmerkmal.
- **L6 Motivation:** Belohne **Kompetenz, nicht Anwesenheit** **[STARK]**; extrinsische Punkte können intrinsische Motivation untergraben **[STARK]** (Deci et al. 1999). „Weltbeste" verlangt Fortschrittsanzeigen, die **wahre Signale** sind — kein zerbrechender Streak.
- **L7 Architektur:** „Zukunftssicher" ist ohne **Anbieter-Unabhängigkeit** nicht erreichbar (Modelle veralten monatlich). → **Ports & Adapters** (siehe §5). 
- **L8 Pipeline:** Der Moat lebt/stirbt mit **Grading-Qualität** (wirklich i+1?) und **Dekodier-Treue**. „Weltbeste" verlangt **QS als festen Schritt**, nicht als Nachgedanke.
- **L9 Meta:** Jede sichtbare Zahl gegen **Goodhart** testen. „Weltbeste" verlangt, dass Wachstum ehrlich bleibt, auch wenn eine unehrliche Zahl kurzfristig „besser aussähe".

---

## 5. Zukunftssicherheit — konkret (ehrlich: nicht „absolut")

**Nichts ist absolut zukunftssicher.** Aber diese sechs Entscheidungen maximieren die Langlebigkeit (Zielgröße **L**):

1. **Anbieter-agnostische KI-Schicht (Ports & Adapters).** LLM/TTS/ASR **hinter einer Schnittstelle** definiert (was das Modell *können* muss), Anbieter sind austauschbare Adapter. Modell wird besser/billiger/eingestellt → wir tauschen den Adapter, nicht die App. *(Architektur-Prinzip, deckt sich mit `05-architecture.md`: „Fähigkeiten, nicht Produktnamen".)*
2. **Local-first + Datenportabilität.** Lerndaten bleiben auf dem Gerät, mit **Export/Import**. Überlebt Firmen-/Geschäftsmodell-Änderungen und schafft Vertrauen. *(bereits M1-Realität; Export/Import ergänzen.)*
3. **Offene, evidenzbasierte Bausteine statt Eigenbau.** **FSRS-6** (open source, MIT; in Anki Standard) als Behaltens-Kern: gleiche Behaltensquote mit **~20–30 % weniger Wiederholungen** als SM-2, trainiert auf ~700 Mio. Reviews. **[STARK]** für Vorhersagegenauigkeit (Benchmark 500 Mio.+). **Ehrlicher Vorbehalt:** die Effizienz-Prozente stammen aus **Simulation**, nicht aus einer kontrollierten Schülerstudie — wir übernehmen den Algorithmus wegen Beleglage *und* Community-Pflege, behalten aber unsere eigene ehrliche Messung als Kontrolle.
4. **Offene Standards (PWA/Web).** Kein App-Store-Gatekeeper, läuft auf allen Geräten, installierbar, offline. *(bereits M1.)*
5. **Sprachpaar-agnostische Datenstruktur.** Der Chunk trägt Sprache/Level/Kontext generisch → weitere Paare ohne Umbau. *(Architektur-Ziel bestätigen.)*
6. **Transparenter, getesteter Kern.** Engine & Messung bleiben simpel, lesbar, testbar — gegen Goodhart *und* gegen „Vendor-Magie", die man nicht mehr versteht.

---

## 6. Priorisierter Fahrplan (Reihenfolge: „meistes echtes Behalten pro Aufwand")

Legende Träger: **🤖 autonom** · **🧑 deine Entscheidung** · **👥 Muttersprache**.

| # | Schritt | Zielgröße | Träger | Status / Voraussetzung |
|---|---|---|---|---|
| **A** | **FSRS-Engine** als Behaltens-Kern (ersetzt den Ad-hoc-Scheduler; eigene ehrliche Messung bleibt darüber) | **R, L** | 🤖 + 🧑 | ✅ **gebaut 2026-07-23 (Loop 7)** — `src/modules/memory/fsrs.ts` + Motor umgestellt, 53 Tests grün, Build/E2E grün. Parameter-Optimierung („-6") später mit Nutzungsdaten. |
| **B** | **KI-Port-Schicht** definieren: Interfaces für Generierung/Dekodierung/TTS/ASR (noch ohne Anbieter) | **L** | 🤖 | ✅ **gebaut 2026-07-23** — `src/modules/content/ports.ts` + `aiRegistry.ts` (Ports & Adapters), Standard-Adapter Seed/Web-Speech, TTS bereits über den Port; 61 Tests grün. Legt keinen Anbieter fest, macht die Pipeline andockbar. |
| **C** | **Erste vertikale Scheibe** der Pipeline: **eine** Fähigkeit (**Auto-Dekodierung SV→DE**) hinter dem Port, mit **einem** ersten Adapter | **R, T** | 🤖 + 🧑 | 🟡 **Grundgerüst gebaut 2026-07-23:** nutzerseitige KI-Auswahl + Login (`AiSettings.tsx`), Claude-Dekoder (`adapters/anthropic.ts`, BYOK), „Verbindung testen"; 81 Tests + 2 E2E grün. **Offen:** on-demand-Nutzung im Loop, weitere Anbieter, verwalteter Schlüssel (Backend). |
| **D** | **Schwedische Muttersprache-Prüfung** der Segmente | **R** | 👥 | Bleibt Qualitäts-Gate (Checkliste liegt bereit). |
| **E** | **Adaptives Band auf Intervall-Ebene** feinschleifen (fällt teils mit A zusammen) | **R, T** | 🤖 | Nach A. |
| **F** | **Datenexport/-import** (Datenhoheit sichtbar machen) | **L** | 🤖 | Kleiner Schritt, großer Vertrauensgewinn. |

**Nicht jetzt (bewusst geparkt):** Konten/Sync/Backend, Sprech-/ASR-Produktion, weitere Sprachpaare, Bild-/Song-Input (`11-ideas.md`). Erst nach dem M1-Beweis.

---

## 7. Offene Entscheidungen (an dich — nicht still entschieden)

1. ~~FSRS jetzt einführen?~~ **✅ erledigt 2026-07-23** — Schritt A gebaut und verifiziert (FSRS-Kern + Motor umgestellt, ehrliche Messung bleibt darüber).
2. **Erster KI-Anbieter für die Pipeline (Schritt C)** — Abwägung Qualität / Kosten / Datenschutz. Sobald hier Nutzertext das Gerät verlässt, greifen `05-architecture.md` §Sicherheit (Keys server-seitig, Consent).
3. **TTS-Richtung:** **on-device/open-source** (Piper/Kokoro — kostenlos, datensparsam, Qualität für Schwedisch bei Umsetzung testen) **vs. Cloud** (natürlicher, aber Daten verlassen das Gerät + laufende Kosten). Muss nicht heute fallen — die Port-Schicht (B) hält beide Wege offen.

*Diese drei Punkte werden zusätzlich in `10-open-questions.md` geführt.*

---

## Quellen (Live-Recherche, Juli 2026)

- Spaced Repetition heute (Überblick 2026): https://migaku.com/blog/language-fun/spaced-repetition-in-2026-how-it-actually-works
- FSRS vs. SM-2 (Vergleich, Effizienz): https://www.antiagent.io/blog/fsrs-vs-sm-2
- FSRS — Algorithmus & Projekt (open source): https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm
- FSRS — kuratierte Ressourcen/Implementierungen: https://github.com/open-spaced-repetition/awesome-fsrs
- Offene TTS-Modelle 2026 (u. a. Kokoro, Piper, Qwen3-TTS): https://www.bentoml.com/blog/exploring-the-world-of-open-source-text-to-speech-models
- On-Device-TTS-Benchmark 2026: https://picovoice.ai/blog/on-device-tts/

> **Anschluss an bestehende Doku:** Wissenschaft & Evidenzstufen `02-science.md` · Architektur/Ports `05-architecture.md` · Moat/Pipeline `08-content-pipeline.md` · Messung `07-measurement.md` · offene Entscheidungen `10-open-questions.md` · M1-Review `gremium-review-M1.md`.
