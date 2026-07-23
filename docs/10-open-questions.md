# 10 — Offene Fragen & vertagte Entscheidungen

> Regel: hier sammeln, nicht still selbst entscheiden. Jede Entscheidung mit Datum + Begründung dokumentieren, wenn getroffen.

## Technik

**Entschieden bei Build-Start (M1) — Begründung in `05-architecture.md`:**
- Frontend-Stack: Vite + React + TypeScript + Tailwind, PWA via `vite-plugin-pwa`. Speicherung lokal (IndexedDB), kein Backend.
- Spacing: zunächst einfacher Eigen-Scheduler (M1-Skelett) — **am 2026-07-23 durch FSRS ersetzt** (Begründung unten unter „Weiter offen"/entschieden).

**Weiter offen:**
- Welches LLM für Generierung + Dekodierung SV↔DE? *(Gremium-Empfehlung: hinter einer anbieter-agnostischen Port-Schicht bauen, ein erster Adapter zur Entscheidung — `gremium-weltklasse.md` §7.2.)*
- Welches schwedische TTS (Natürlichkeit, Tempo, Lizenz/Kosten)? *Stand:* **on-device Web-Speech ist jetzt zuverlässig verdrahtet** (beste sv-Stimme + Langsam-Option, kostenlos, nichts verlässt das Gerät — `src/modules/comprehension/tts.ts`). **Offen:** herunterladbarer neuronaler Motor (Kokoro/Piper, ~80 MB + WASM, lädt vom Fremd-Server → widerspricht „schlank + keine Drittanbieter zur Laufzeit") **vs.** Cloud-TTS — bewusste Entscheidung, Port-Schicht hält beides offen (`gremium-weltklasse.md` §7.3).
- **KI-Auswahl durch den Nutzer (später, Nutzerwunsch 2026-07-23):** eine Einstellungs-/Login-Fläche, auf der der Nutzer den **KI-Anbieter wählt** und seinen **Zugang hinterlegt** (API-Schlüssel oder OAuth-Login). Technisch anbieter-agnostisch über die Port-Schicht (`aiRegistry.setAiPorts(...)`) — die App muss dafür nicht umgebaut werden. Schlüssel-/Datenschutz-Behandlung nach `05-architecture.md` §Sicherheit (Keys nie im Klartext-Client „auf Vorrat"; Consent, sobald Text das Gerät verlässt). Baubar mit dem Cloud-Schritt (C).
- ~~Reicht der einfache Scheduler, oder eine SRS-Familie (FSRS/SM-2)?~~ **Entschieden 2026-07-23: FSRS** (DSR-Modell, `src/modules/memory/fsrs.ts`) als Terminplaner-Kern; die ehrliche Messung (`provenStableAt`) bleibt bewusst DARÜBER. Begründung: best-belegtes, offenes Verfahren, ~20–30 % weniger Wiederholungen als SM-2 bei gleicher Retention (Effizienz aus Simulation, kein Schüler-RCT; `gremium-weltklasse.md` §5–§6). **Klein weiter offen:** nutzerspezifische Parameter-Optimierung auf echten Review-Logs (der Feinschliff von „FSRS-6") — erst mit Nutzungsdaten.
- Hosting/Deployment über HTTPS (nötig, damit PWA-Installation auf dem Handy greift).
- SessionStart-Hook für Web-Sessions (`npm install` automatisch): bewusst (noch) **nicht** angelegt — Nutzerentscheidung.

## Produkt / Methode
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
