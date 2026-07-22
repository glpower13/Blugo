# 05 — Architektur

> Prinzip: Konzept vor Code. Kein Element „auf Vorrat". Konkrete Produktnamen/Modelle erst bei M1 per Live-Recherche.

## Die vier Module
1. **Content-Pipeline** — erzeugt/graduiert schwedischen Input + Dekodierung. Details `08-content-pipeline.md`.
2. **Comprehension-Loop** — die Kern-Interaktion (siehe `04-product.md`).
3. **Memory-Engine** — Scheduling (Spacing), Retrieval-Auswahl, Interleaving, Wartung, Kontextvariation.
4. **Progress/Measurement** — Metriken & Belohnungslogik (siehe `06`, `07`).

## Datenmodell (Kern)
- **Chunk**: Text (SV), Dekodierung (DE), Audio-Referenz, Level/i+1-Stufe, Kontext-Varianten, Tags.
- **Nutzer-Chunk-Status**: Stabilität, letztes/ nächstes Abrufdatum, Intervall, Erfolgshistorie, Modus (neu/lernend/Wartung).
- **Session-Log**: Abrufe, Ergebnisse, Latenz, genutzte Hilfen.

## Anforderungen an spätere Technik (nicht: Produktwahl)
- **LLM**: schwedische Generierung graded auf i+1 + zuverlässige Interlinear-Dekodierung DE↔SV.
- **TTS**: natürliches Schwedisch, variables Tempo.
- **ASR** (später, für Produktion/Aussprache): schwedische Erkennung.
- **Scheduling**: bewährter Spacing-Algorithmus (z. B. Familie der modernen SRS-Verfahren) — konkrete Wahl in M1.
- **Frontend**: schlank, Web zuerst; offline-/Sync-Fragen in `10-open-questions.md`.
- **Speicherung**: zunächst lokal/leichtgewichtig; Backend erst, wenn eine Entscheidung es zwingt.

## Querschnitt (bewusst vertagt)
Auth, Cloud, Sync, Offline, Datenschutz, Security: als offene Fragen erfasst, nicht in M1 vorgebaut. Datenschutz (DSGVO) wird spätestens bei Nutzerdaten/Serverbetrieb konkret.
