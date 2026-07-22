# 05 — Architektur: Module, Datenfluss, spätere Technik

*Zweck: Die vier Module und wie Daten zwischen ihnen fließen. Konzeptionell — in M0 wird kein Code geschrieben.*

> **Warnung an mein späteres Ich:** Dies ist eine *Konzept*-Architektur, kein Bauplan. Konkrete Technik (Stack, Modelle, TTS, DB) wird bei Build-Start per Live-Recherche entschieden, nicht hier festgeschrieben ([`10-open-questions.md`](10-open-questions.md)). Keine Architektur vor dem Konzept.

## Vier Module (statt zehn „Engines")

Bewusst nur vier. Jede weitere „Engine" muss sich rechtfertigen, bevor sie existiert.

### 1. Content-Pipeline (der Moat)
Erzeugt verständlichen, auf i+1 graduierten schwedischen Input on demand. LLM → Grading → schwedisches TTS → optional Bild/Kontext, plus automatisierte Birkenbihl-Dekodierung. Details: [`08-content-pipeline.md`](08-content-pipeline.md).
**Output:** Segmente mit Chunks, Dekodierung, Audio, Schwierigkeitseinstufung.

### 2. Comprehension-Loop
Die Nutzer-sichtbare Schleife: Begegnung → Verständnishilfen → Verständnis-Check → Logging. Details: [`04-product.md`](04-product.md).
**Input:** Segmente von der Pipeline + fällige Chunks von der Memory-Engine.
**Output:** Abruf-Ereignisse (Ergebnis + Kontext) ans Log.

### 3. Memory-Engine
Spacing, Retrieval-Scheduling, Wartung, Kontextvariation. Details: [`03-method.md`](03-method.md).
**Input:** Abruf-Ereignisse.
**Output:** Fälligkeitsplan (welcher Chunk wann, in welcher Abrufstufe, in welchem neuen Kontext).

### 4. Progress-/Measurement-Modul
Die ehrliche Gamification und die Erhalt-Metriken. Details: [`06-motivation.md`](06-motivation.md), [`07-measurement.md`](07-measurement.md).
**Input:** Chunk-Zustände + Abruf-Historie aus der Memory-Engine.
**Output:** lebendes Gedächtnisfeld, Erhalt-Zahlen, Meilensteine.

## Datenfluss (konzeptionell)

```
                 ┌──────────────────────┐
                 │  Content-Pipeline     │  (i+1-Segmente, Dekodierung, Audio)
                 └──────────┬───────────┘
                            │ Segmente
                            ▼
   fällige Chunks   ┌──────────────────────┐   Abruf-Ereignisse
   ┌───────────────►│  Comprehension-Loop   ├───────────────┐
   │                └──────────────────────┘                │
   │                                                         ▼
┌──┴───────────────┐                              ┌────────────────────┐
│  Memory-Engine    │◄─────────────────────────────┤  (Abruf-Log)       │
│  (Spacing/Wartung)│      Zustands-Updates         └────────────────────┘
└──────────┬────────┘
           │ Chunk-Zustände + Historie
           ▼
┌────────────────────────────┐
│ Progress-/Measurement-Modul │  (Erhalt-Zahlen, Gedächtnisfeld)
└────────────────────────────┘
```

Kernidee: **Content ist Nachschub, Memory ist der Kreislauf.** Die Pipeline liefert Material; der eigentliche Wert entsteht in der Schleife Memory ↔ Comprehension-Loop, die einen Chunk immer wieder in neuen Kontexten fällig stellt.

## Zentrale Datenentität: der Chunk-Zustand

Konzeptionell hält das System pro (Nutzer × Chunk) mindestens:
- Chunk-Identität + kanonische Bedeutung/Dekodierung,
- Abrufstufe (Wiedererkennen / Produktion),
- Stabilität / aktuelles Intervall / nächste Fälligkeit,
- Abruf-Historie (Zeit, Ergebnis),
- gesehene Kontexte (für Variation und Anti-Wiederholung).

Aus diesen Feldern speisen sich Scheduling *und* Messung — sie sind der Kern, den ein späteres Datenmodell abbilden muss.

## Bewusst offen (nicht in M0 entscheiden)

- Web-Stack, Datenhaltung, Auth, Hosting.
- SRS-Algorithmus (SM-2 / FSRS / eigen).
- LLM- und TTS-Anbieter.
- Client-only vs. Backend für M1.

Alle offenen Technikpunkte gesammelt in [`10-open-questions.md`](10-open-questions.md). M1 darf hier radikal simpel sein ([`09-roadmap.md`](09-roadmap.md)).
