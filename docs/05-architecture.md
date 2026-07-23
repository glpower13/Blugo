# 05 — Architektur

> Prinzip: Konzept vor Code. Kein Element „auf Vorrat". Konkrete Produktnamen/Modelle erst bei Build-Start per Live-Recherche.

## Die vier Module (und wo sie im Code liegen)
1. **Content-Pipeline** — erzeugt/graduiert schwedischen Input + Dekodierung. Details `08-content-pipeline.md`. → `src/modules/content/` (M1: Seed-Quelle mit gleicher Schnittstelle wie die spätere KI-Pipeline).
2. **Comprehension-Loop** — die Kern-Interaktion (siehe `04-product.md`). → `src/modules/comprehension/`.
3. **Memory-Engine** — Scheduling (Spacing), Retrieval-Auswahl, Interleaving, Wartung, Kontextvariation. → `src/modules/memory/`.
4. **Progress/Measurement** — Metriken & Belohnungslogik (siehe `06`, `07`). → `src/modules/progress/`.

Datenmodell in `src/domain/`, Persistenz in `src/storage/`, Tages-Session in `src/session/`.

## M1-Stack (entschieden bei Build-Start, per Live-Recherche)
Anforderungen aus dem Konzept: schlank, Web zuerst, **installierbar** und **offline-fähig** (Nutzerwunsch: „auf dem Handy laufen lassen"), lokale Speicherung, kein Backend auf Vorrat.

- **Vite + React + TypeScript** — schneller, ausgereifter Build; TS-first für ein testbares Datenmodell.
- **Tailwind** — ruhige, fokussierte, mobil-first UI (kein „Konfetti-Lärm", `04-product.md`).
- **`vite-plugin-pwa`** (Workbox) — Web-App-Manifest + Service Worker → installierbar („Zum Startbildschirm hinzufügen") und offline lauffähig.
- **IndexedDB via `idb`** — lokale, offline-first Persistenz der Chunk-Zustände und Logs; kein Server.
- **Spacing (M1):** bewusst **einfacher eigener Scheduler** (Intervall × Ease, Stufen-Promotion). Eine ausgereifte SRS-Familie (FSRS/SM-2) bleibt offen, bis echte Daten vorliegen (`10-open-questions.md`).

Nicht in M1 entschieden (weiter vertagt): schwedisches TTS/ASR, LLM für Generierung & Dekodierung — siehe unten und `10-open-questions.md`.

## Datenmodell (Kern)
- **Chunk**: Text (SV), Dekodierung (DE), Audio-Referenz, Level/i+1-Stufe, Kontext-Varianten, Tags.
- **Nutzer-Chunk-Status**: Stabilität, letztes/ nächstes Abrufdatum, Intervall, Erfolgshistorie, Modus (neu/lernend/Wartung).
- **Session-Log**: Abrufe, Ergebnisse, Latenz, genutzte Hilfen.

## Anforderungen an noch offene Technik (nicht: Produktwahl)
Für die Content-Pipeline (nach M1) — als Fähigkeiten formuliert, nicht als Produktnamen:
- **LLM**: schwedische Generierung graded auf i+1 + zuverlässige Interlinear-Dekodierung DE↔SV.
- **TTS**: natürliches Schwedisch, variables Tempo.
- **ASR** (später, für Produktion/Aussprache): schwedische Erkennung.

Frontend, Speicherung und der M1-Scheduler sind entschieden — siehe „M1-Stack" oben.

## Querschnitt (bewusst vertagt)
Auth, Cloud, Sync, Offline, Datenschutz, Security: als offene Fragen erfasst, nicht in M1 vorgebaut. Datenschutz (DSGVO) wird spätestens bei Nutzerdaten/Serverbetrieb konkret.
