# 10 — Offene Fragen & vertagte Entscheidungen

> Regel: hier sammeln, nicht still selbst entscheiden. Jede Entscheidung mit Datum + Begründung dokumentieren, wenn getroffen.

## Technik

**Entschieden bei Build-Start (M1) — Begründung in `05-architecture.md`:**
- Frontend-Stack: Vite + React + TypeScript + Tailwind, PWA via `vite-plugin-pwa`. Speicherung lokal (IndexedDB), kein Backend.
- Spacing: zunächst einfacher Eigen-Scheduler (M1-Skelett) — **am 2026-07-23 durch FSRS ersetzt** (Begründung unten unter „Weiter offen"/entschieden).

**Weiter offen:**
- Welches LLM für Generierung + Dekodierung SV↔DE? *(Gremium-Empfehlung: hinter einer anbieter-agnostischen Port-Schicht bauen, ein erster Adapter zur Entscheidung — `gremium-weltklasse.md` §7.2.)*
- Welches schwedische TTS (Natürlichkeit, Tempo, Lizenz/Kosten)? *Stand:* **on-device Web-Speech ist jetzt zuverlässig verdrahtet** (beste sv-Stimme + Langsam-Option, kostenlos, nichts verlässt das Gerät — `src/modules/comprehension/tts.ts`). **Offen:** herunterladbarer neuronaler Motor (Kokoro/Piper, ~80 MB + WASM, lädt vom Fremd-Server → widerspricht „schlank + keine Drittanbieter zur Laufzeit") **vs.** Cloud-TTS — bewusste Entscheidung, Port-Schicht hält beides offen (`gremium-weltklasse.md` §7.3).
- **KI-Auswahl durch den Nutzer (Nutzerwunsch 2026-07-23):** ✅ **Grundgerüst gebaut** — Einstellungs-/Login-Fläche (`src/modules/content/AiSettings.tsx`, ⚙️ in der Kopfzeile): Anbieter wählen (Gerät/Claude), **eigenen Schlüssel hinterlegen**, Modell wählen, **Verbindung testen**. Erster Cloud-Adapter: Claude-Dekodierung SV→DE (`adapters/anthropic.ts`), anbieter-agnostisch über die Port-Registry, **BYOK** (siehe `05-architecture.md` §Sicherheit, Entscheidung 2026-07-23). **Im Loop nutzbar:** On-demand-Knöpfe „🤖 KI-Dekodierung" **und** „🤖 Neuer Kontext" (nur bei aktivem Cloud-Anbieter; Ergebnis klar als „per KI" bzw. „KI-erzeugt · maschinell geprüft" gekennzeichnet — `ComprehensionLoop.tsx`). **Erste Scheibe des Moats gebaut 2026-07-23:** KI-**Generierung** eines neuen i+1-Satzes über den `ContentGenerator`-Port (Claude-Adapter `createAnthropicGenerator`, BYOK — `08-content-pipeline.md`). **Qualitäts-Tor gebaut 2026-07-26:** erzeugte Sätze laufen zur Laufzeit durch dieselbe Prüf-Bibliothek wie der handgeschriebene Inhalt (`quality/gate.ts`); harte Befunde werden verworfen statt beschriftet, ein zweiter Versuch, dann eine ehrliche Absage — `08-content-pipeline.md` §Das Tor. **Vorrat gebaut 2026-07-26:** Sätze entstehen im Hintergrund während der Sitzung, ausdrücklich eingeschaltet und hart gedeckelt (12 gesamt / 4 je Sitzung) — `08-content-pipeline.md` §Der Vorrat. **Grading/Leveling gebaut 2026-07-26:** Erzeugte Sätze werden gegen den ECHTEN Lernstand gemessen — höchstens `STUFE_MAX` = 4 unbekannte Wörter neben der Ziel-Wendung, die Latte aus 2.291 Begegnungen mit dem eigenen Inhalt geeicht (`08-content-pipeline.md` §Stufe). **Weiter offen:** schwedische Muttersprache-QS, weitere Anbieter-Adapter, verwalteter Schlüssel (bräuchte Backend), OAuth-Login statt Schlüssel.
- ~~Reicht der einfache Scheduler, oder eine SRS-Familie (FSRS/SM-2)?~~ **Entschieden 2026-07-23: FSRS** (DSR-Modell, `src/modules/memory/fsrs.ts`) als Terminplaner-Kern; die ehrliche Messung (`provenStableAt`) bleibt bewusst DARÜBER. Begründung: best-belegtes, offenes Verfahren, ~20–30 % weniger Wiederholungen als SM-2 bei gleicher Retention (Effizienz aus Simulation, kein Schüler-RCT; `gremium-weltklasse.md` §5–§6). **Klein weiter offen:** nutzerspezifische Parameter-Optimierung auf echten Review-Logs (der Feinschliff von „FSRS-6") — erst mit Nutzungsdaten.
- Hosting/Deployment über HTTPS (nötig, damit PWA-Installation auf dem Handy greift).
- SessionStart-Hook für Web-Sessions (`npm install` automatisch): bewusst (noch) **nicht** angelegt — Nutzerentscheidung.

## Produkt / Methode
- **Korrektur-Feedback der KI (Nutzerfrage 2026-07-23) — beraten in `gremium-feedback.md`:** fundamental und evidenzbelegt (Li 2010, d = 0,64, dauerhaft), **aber** an die eine Design-Regel gebunden (keine Falsch-Korrektur, keine Schein-Genauigkeit). **Reihenfolge:** (1) ✅ **gebaut** — formatives Tipp-Feedback deterministisch gegen geprüfte Chunks (`answerCheck.ts`, `ComprehensionLoop.tsx`); (2) ✅ **gebaut** — optionale KI-Erklärung „🤖 Warum?", gekennzeichnet „nicht muttersprachlich geprüft" (`Explainer`-Port + Claude-Adapter, BYOK); (3a) ✅ **gebaut** — Aussprache-*Anleitung* (deterministische Laut-Hinweise, on-device; `pronunciation.ts`, `gremium-aussprache.md`); (3b) Aussprache-*Bewertung* per ASR *(post-M1, Anbieter-Entscheidung — `gremium-feedback.md` §6)*. *(alle 2026-07-23)*
- **Kategorien/Struktur (Nutzerwunsch 2026-07-23) — entschieden in `gremium-struktur.md`:** Themen sind eine **Ordnungs-/Abdeckungs-Linse + Autonomie-Wahl für neuen Stoff**, KEINE abzuschließenden Lektionen (sonst Goodhart-Bruch). ✅ **gebaut:** `Category`-Modell + `categoryId` je Chunk, ehrliche Themen-Übersicht („X von Y bewiesen stabil"), Fokus-Wahl (`session/focus.ts`, `buildQueue` biast nur *neuen* Stoff, nie Wartung). **Offen:** Themen-Schnitt bei wachsendem KI-Content (Größe/Überlappung); optionaler grober Anfänger-Pfad, ohne zur Klippe zu werden.
- Wie genau werden Chunks segmentiert und geleveled (i+1 operationalisieren)?
- **Satz-Darstellung (Nutzerfrage 2026-07-23) — beraten in `gremium-darstellung.md`, ✅ gebaut 2026-07-23:** **Zielsprache oben**; **Bedeutung/Dekodierung bei NEUEM Chunk auto-offen** (`scaffoldOpen` = noch kein erfolgreicher Abruf), bei bekanntem eingeklappt (Testing-Effekt); **Produktion als Lücke im Kontext** (`clozeSentence`, behebt zugleich den Spoiler — Volltext/Ton/Dekodierung erst nach dem Auflösen). Offen: Schwelle „bekannt genug" (erste Näherung: erster `good`); Cloze bei mehreren Ziel-Chunks pro Satz.
- Ab wann kippt Rezeption in Produktion (Kriterium)?
- Wie wird „Kontextvariation" generiert, ohne Bedeutung zu verfälschen?
- Wie wird „stabil" exakt definiert (Intervallschwelle, Erfolgsquote)?

## Motivation / Messung
- Wie viel Sichtbarkeit bekommt der „ehrliche Streak", ohne kontrollierend zu wirken?
- Wie wird CEFR-Näherung transparent kommuniziert, ohne Überversprechen?
- **Trefferquote** — bis 2026-07-25 „Verständnis-Abdeckung"; umbenannt, weil der alte Name den Anteil *am Stoff* versprach, während über die *begonnenen* Wendungen gerechnet wurde — ist in M1 nur **stufengewichtet genähert** (Produktion voll, Wiedererkennen halb). Die echte Definition — Verständnis in *neuem Kontext* auf *Zielstufe* — ist noch offen; nachschärfen, sobald Kontext-/Level-Daten vorliegen.

## Navigation (seit `gremium-navigation.md`)
- ~~„Weiterlernen · N fällig" verspricht mehr, als die Session hält.~~ **Entschieden
  2026-07-25:** Der Knopf zeigt die **tatsächliche Sitzungsgröße**. Eine Wand aus 98 ist die
  Klippe, gegen die dieses Projekt gebaut ist; die Zahl ganz wegzulassen nähme die
  Orientierung. Die Sitzungsgröße ist klein, endlich **und wahr**. Herleitung:
  `gremium-navigation.md` §7c.
- Reiterleiste unten (Daumen) oder ab `md` oben? Aktuell beides — gleiche Struktur, andere
  Position. Beobachten, ob der Wechsel irritiert.
- Reiner Stöber-Modus für die Gegenrichtung Schwedisch → Deutsch (Minderheitsposition des
  Gremiums, `gremium-navigation.md` §5): nur bauen, wenn er **nichts** misst.

## Sprechen / KI-Sprachpartner (seit `gremium-sprachpartner.md`, Nutzerfrage 2026-07-25)
- **Entschieden 2026-07-25 (Richtung):** Sprechen wird gebaut, aber der Burggraben ist
  **nicht** „mit einer KI reden" (das haben Duolingo Max, Speak und TalkPal bereits, TalkPal
  auch auf Schwedisch) — sondern dass gesprochene Abrufe in **dieselbe ehrliche Messung**
  laufen wie getippte. Redezeit wird **nie** zu Fortschritt verrechnet. Herleitung:
  `gremium-sprachpartner.md`.
- ~~**Backend ja/nein für den echten Sprachpartner?**~~ **Umgangen 2026-07-25:** Der
  Sparringspartner ist aus drei vorhandenen Teilen gebaut — Web-Speech-Erkennung (Ohr),
  Claude über den eigenen Schlüssel (Kopf), Web-Speech-Ausgabe (Mund). Damit **kein
  Backend, kein neuer Anbieter, keine zusätzlichen Kosten**; Preis ist Latenz (~1–3 s statt
  ~0,3 s). Für einen *Lern*-Partner ist eine Denkpause kein Mangel. Herleitung:
  `gremium-sprachpartner.md` §9.
- **Echte Sprach-zu-Sprach-Verarbeitung** bleibt eine spätere Austausch-Option hinter
  demselben `SparringPartner`-Port. Dann wieder offen: server-ausgestellte Token (also doch
  ein Backend) und Kosten — gemessene Praxiswerte ~0,06–0,24 $/min (OpenAI Realtime, mit
  Caching ~0,05–0,10), Gemini Flash Live ~0,005 $ ein / 0,018 $ aus je Minute; bei 15 min/Tag
  grob **3 € bis 30 € im Monat**.
- **Schwedische Stimmqualität** der Realtime-Anbieter: unbelegt, muss **angehört** werden,
  bevor irgendetwas versprochen wird. Aus dieser Umgebung nicht prüfbar. Gilt auch für die
  Gerätestimme, die den Partner heute vorliest.
- **Wie viele Ziele pro Gespräch?** Aktuell vier (`pickTargets`, Voreinstellung). Zu viele
  machen das Gespräch zum Verhör, zu wenige verschenken die fällige Wiederholung. Beobachten.
- **Datenschutz bei Stufe 0 (Nachsprechen):** Chrome/Safari schicken das Audio standardmäßig
  zum Hersteller-Server. Der On-Device-Pfad existiert
  (`SpeechRecognition.available({ processLocally: true })` + `install()`), ist für **Schwedisch**
  aber gerätespezifisch und fehlerbehaftet. Offen: Standard-Einstellung, Formulierung des
  Hinweises.
- **Was gilt als „gesagt"?** Der Transkript-Abgleich muss Erkennungsfehler verzeihen, ohne
  Falsches durchzuwinken. Die Schwelle ist eine echte Entscheidung, kein Detail.
- **Langzeit-Erhalt durch Sprechen** ist **[SCHWACH]** belegt (Studien laufen Wochen, nicht
  Monate) — darf nicht behauptet werden, auch wenn es plausibel ist.

## Recht / Betrieb (später)
- DSGVO, Speicherort, Konten, Sync.
- Umgang mit KI-generiertem Content (Qualität, Haftung, Kennzeichnung).

## Wissenschaft / Evidenz (offene Belege)
- **Kontextvariation** (`02-science.md`, Prinzip 6) hat noch keine eigenständige starke Primärbasis — aktuell nur an Spacing/Desirable Difficulties angelehnt. Belastbaren Direktbeleg (Encoding-Variability) nachtragen.
- **Birkenbihl-Dekodierung als Methode**: keine kontrollierten Primärstudien zur Technik selbst. Als [SCHWACH–mittel] geführt; falls verfügbar, Studien zu Interlinear-/Bilingual-Input nachtragen.
- Passives Hintergrund-/Schlaf-Hören bleibt [WIDERLEGT/SCHWACH] und wird nicht gebaut — nur dokumentieren, nicht als Feature.

## Wirksamkeitsnachweis
- Wie messen wir Erhalt sauber (kleine Selbsttests, A/B gegen Nicht-Spacing)?

- ~~**„Fast" führt nie zum Beweis.**~~ **Geklärt 2026-07-25.** Die Frage löste
  sich an einer Tatsache auf, die im Code stand: `gradeTyped` schlägt „Fast"
  vor, wenn die Antwort bis zu zwei Zeichen daneben lag — in der Produktion
  heißt der Knopf also „war nicht ganz richtig", nicht „ich habe gezögert". Kein
  Beweis daraus ist richtig. Der schmale Restfall (exakt getippt, trotzdem
  „Fast" gedrückt) ist behoben, indem Messung und Terminplanung getrennt wurden:
  Der Beweis kommt aus der Prüfung der Eingabe, der Termin aus der
  Selbsteinschätzung. Einzelheiten im Nachtrag von
  `docs/ISTQB-Testbericht-Messung.md`.
