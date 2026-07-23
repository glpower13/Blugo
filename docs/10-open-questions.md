# 10 — Offene Fragen & vertagte Entscheidungen

> Regel: hier sammeln, nicht still selbst entscheiden. Jede Entscheidung mit Datum + Begründung dokumentieren, wenn getroffen.

## Technik

**Entschieden bei Build-Start (M1) — Begründung in `05-architecture.md`:**
- Frontend-Stack: Vite + React + TypeScript + Tailwind, PWA via `vite-plugin-pwa`. Speicherung lokal (IndexedDB), kein Backend.
- Spacing: zunächst einfacher Eigen-Scheduler (M1-Skelett) — **am 2026-07-23 durch FSRS ersetzt** (Begründung unten unter „Weiter offen"/entschieden).

**Weiter offen:**
- Welches LLM für Generierung + Dekodierung SV↔DE? *(Gremium-Empfehlung: hinter einer anbieter-agnostischen Port-Schicht bauen, ein erster Adapter zur Entscheidung — `gremium-weltklasse.md` §7.2.)*
- Welches schwedische TTS (Natürlichkeit, Tempo, Lizenz/Kosten)? *Stand:* **on-device Web-Speech ist jetzt zuverlässig verdrahtet** (beste sv-Stimme + Langsam-Option, kostenlos, nichts verlässt das Gerät — `src/modules/comprehension/tts.ts`). **Offen:** herunterladbarer neuronaler Motor (Kokoro/Piper, ~80 MB + WASM, lädt vom Fremd-Server → widerspricht „schlank + keine Drittanbieter zur Laufzeit") **vs.** Cloud-TTS — bewusste Entscheidung, Port-Schicht hält beides offen (`gremium-weltklasse.md` §7.3).
- **KI-Auswahl durch den Nutzer (Nutzerwunsch 2026-07-23):** ✅ **Grundgerüst gebaut** — Einstellungs-/Login-Fläche (`src/modules/content/AiSettings.tsx`, ⚙️ in der Kopfzeile): Anbieter wählen (Gerät/Claude), **eigenen Schlüssel hinterlegen**, Modell wählen, **Verbindung testen**. Erster Cloud-Adapter: Claude-Dekodierung SV→DE (`adapters/anthropic.ts`), anbieter-agnostisch über die Port-Registry, **BYOK** (siehe `05-architecture.md` §Sicherheit, Entscheidung 2026-07-23). **Im Loop nutzbar:** On-demand-Knöpfe „🤖 KI-Dekodierung" **und** „🤖 Neuer Kontext" (nur bei aktivem Cloud-Anbieter; Ergebnis klar als „per KI" bzw. „KI-erzeugt · nicht geprüft" gekennzeichnet — `ComprehensionLoop.tsx`). **Erste Scheibe des Moats gebaut 2026-07-23:** KI-**Generierung** eines neuen i+1-Satzes über den `ContentGenerator`-Port (Claude-Adapter `createAnthropicGenerator`, BYOK — `08-content-pipeline.md`). **Weiter offen:** Grading/Leveling im gewünschten Chunk-Verhältnis, Vorrat/Batch statt nur on-demand, schwedische Muttersprache-QS, weitere Anbieter-Adapter, verwalteter Schlüssel (bräuchte Backend), OAuth-Login statt Schlüssel.
- ~~Reicht der einfache Scheduler, oder eine SRS-Familie (FSRS/SM-2)?~~ **Entschieden 2026-07-23: FSRS** (DSR-Modell, `src/modules/memory/fsrs.ts`) als Terminplaner-Kern; die ehrliche Messung (`provenStableAt`) bleibt bewusst DARÜBER. Begründung: best-belegtes, offenes Verfahren, ~20–30 % weniger Wiederholungen als SM-2 bei gleicher Retention (Effizienz aus Simulation, kein Schüler-RCT; `gremium-weltklasse.md` §5–§6). **Klein weiter offen:** nutzerspezifische Parameter-Optimierung auf echten Review-Logs (der Feinschliff von „FSRS-6") — erst mit Nutzungsdaten.
- Hosting/Deployment über HTTPS (nötig, damit PWA-Installation auf dem Handy greift).
- SessionStart-Hook für Web-Sessions (`npm install` automatisch): bewusst (noch) **nicht** angelegt — Nutzerentscheidung.

## Produkt / Methode
- **Korrektur-Feedback der KI (Nutzerfrage 2026-07-23) — beraten in `gremium-feedback.md`:** fundamental und evidenzbelegt (Li 2010, d = 0,64, dauerhaft), **aber** an die eine Design-Regel gebunden (keine Falsch-Korrektur, keine Schein-Genauigkeit). **Reihenfolge:** (1) ✅ **gebaut** — formatives Tipp-Feedback deterministisch gegen geprüfte Chunks (`answerCheck.ts`, `ComprehensionLoop.tsx`); (2) ✅ **gebaut** — optionale KI-Erklärung „🤖 Warum?", gekennzeichnet „nicht muttersprachlich geprüft" (`Explainer`-Port + Claude-Adapter, BYOK); (3a) ✅ **gebaut** — Aussprache-*Anleitung* (deterministische Laut-Hinweise, on-device; `pronunciation.ts`, `gremium-aussprache.md`); (3b) Aussprache-*Bewertung* per ASR *(post-M1, Anbieter-Entscheidung — `gremium-feedback.md` §6)*. *(alle 2026-07-23)*
- Wie genau werden Chunks segmentiert und geleveled (i+1 operationalisieren)?
- Ab wann kippt Rezeption in Produktion (Kriterium)?
- Wie wird „Kontextvariation" generiert, ohne Bedeutung zu verfälschen?
- Wie wird „stabil" exakt definiert (Intervallschwelle, Erfolgsquote)?

## Motivation / Messung
- Wie viel Sichtbarkeit bekommt der „ehrliche Streak", ohne kontrollierend zu wirken?
- Wie wird CEFR-Näherung transparent kommuniziert, ohne Überversprechen?
- **Verständnis-Abdeckung** ist in M1 nur **stufengewichtet genähert** (Produktion voll, Wiedererkennen halb). Die echte Definition — Verständnis in *neuem Kontext* auf *Zielstufe* — ist noch offen; nachschärfen, sobald Kontext-/Level-Daten vorliegen.

## Recht / Betrieb (später)
- DSGVO, Speicherort, Konten, Sync.
- Umgang mit KI-generiertem Content (Qualität, Haftung, Kennzeichnung).

## Wissenschaft / Evidenz (offene Belege)
- **Kontextvariation** (`02-science.md`, Prinzip 6) hat noch keine eigenständige starke Primärbasis — aktuell nur an Spacing/Desirable Difficulties angelehnt. Belastbaren Direktbeleg (Encoding-Variability) nachtragen.
- **Birkenbihl-Dekodierung als Methode**: keine kontrollierten Primärstudien zur Technik selbst. Als [SCHWACH–mittel] geführt; falls verfügbar, Studien zu Interlinear-/Bilingual-Input nachtragen.
- Passives Hintergrund-/Schlaf-Hören bleibt [WIDERLEGT/SCHWACH] und wird nicht gebaut — nur dokumentieren, nicht als Feature.

## Wirksamkeitsnachweis
- Wie messen wir Erhalt sauber (kleine Selbsttests, A/B gegen Nicht-Spacing)?
