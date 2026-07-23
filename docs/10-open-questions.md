# 10 — Offene Fragen & vertagte Entscheidungen

> Regel: hier sammeln, nicht still selbst entscheiden. Jede Entscheidung mit Datum + Begründung dokumentieren, wenn getroffen.

## Technik

**Entschieden bei Build-Start (M1) — Begründung in `05-architecture.md`:**
- Frontend-Stack: Vite + React + TypeScript + Tailwind, PWA via `vite-plugin-pwa`. Speicherung lokal (IndexedDB), kein Backend.
- Spacing (M1): einfacher eigener Scheduler (Intervall × Ease, Stufen-Promotion) — bewusst simpel.

**Weiter offen:**
- Welches LLM für Generierung + Dekodierung SV↔DE?
- Welches schwedische TTS (Natürlichkeit, Tempo, Lizenz/Kosten)?
- Reicht der einfache Scheduler, oder später eine SRS-Familie (FSRS/SM-2)? Evaluieren, sobald echte Nutzungsdaten vorliegen.
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

## Recht / Betrieb (später)
- DSGVO, Speicherort, Konten, Sync.
- Umgang mit KI-generiertem Content (Qualität, Haftung, Kennzeichnung).

## Wissenschaft / Evidenz (offene Belege)
- **Kontextvariation** (`02-science.md`, Prinzip 6) hat noch keine eigenständige starke Primärbasis — aktuell nur an Spacing/Desirable Difficulties angelehnt. Belastbaren Direktbeleg (Encoding-Variability) nachtragen.
- **Birkenbihl-Dekodierung als Methode**: keine kontrollierten Primärstudien zur Technik selbst. Als [SCHWACH–mittel] geführt; falls verfügbar, Studien zu Interlinear-/Bilingual-Input nachtragen.
- Passives Hintergrund-/Schlaf-Hören bleibt [WIDERLEGT/SCHWACH] und wird nicht gebaut — nur dokumentieren, nicht als Feature.

## Wirksamkeitsnachweis
- Wie messen wir Erhalt sauber (kleine Selbsttests, A/B gegen Nicht-Spacing)?
