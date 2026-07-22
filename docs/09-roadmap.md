# 09 — Roadmap: Meilensteine & Prioritäten

*Zweck: Was in welcher Reihenfolge entsteht — und was bewusst noch nicht.*

## Leitprinzip

**Praktische, lauffähige Substanz vor architektonischer Komplexität.** Jeder Meilenstein muss eine konkrete Frage beantworten, bevor der nächste beginnt. Kein Backend auf Vorrat, keine Architektur vor dem Konzept.

## M0 — Konzept & Doku *(diese Phase)*

**Ziel:** Das Konzept steht schriftlich, widerspruchsfrei und begründet.

**Liefergegenstände:**
- `README.md` — das Konzept auf einer Seite.
- `CLAUDE.md` — Leitplanken für die Arbeit am Repo.
- `/docs` (01–11) — Vision, Wissenschaft, Methode, Produkt, Architektur, Motivation, Messung, Content-Pipeline, Roadmap, offene Fragen, Ideen.

**Ausdrücklich NICHT in M0:** kein App-Code, kein Stack, keine Modelle festgelegt, kein Backend.

**Fertig-Kriterium:** Ein neuer Leser versteht in 15 Minuten, was NEUROLANG ist, warum es anders ist, und was als Nächstes gebaut wird — ohne Widersprüche zwischen den Docs.

## M1 — schlankes MVP

**Ziel:** Den Kern an *einem echten Lerner* beweisen: Führt der Comprehension-Loop zu spürbarem Erhalt?

**Umfang (bewusst minimal):**
- Web-App (Stack per Live-Recherche bei Build-Start).
- **Ein** Level.
- **~20 handgeprüfte**, KI-generierte schwedische Segmente (Pipeline liefert Roh, Mensch prüft — [`08-content-pipeline.md`](08-content-pipeline.md)).
- Der **Comprehension-Loop**: Begegnung → gestufte Hilfen → Verständnis-Check → Logging ([`04-product.md`](04-product.md)).
- **Simple** Fortschrittsanzeige (noch nicht die volle Erhalt-Messung).
- Eine **einfache** Memory-Engine (simples Spacing reicht; kein ausgefeiltes SRS nötig).

**Ausdrücklich NICHT in M1:** automatische Content-Generierung im Betrieb, ausgebaute Messung, mehrere Level/Sprachen, Mobile, Konten/Social.

**Fertig-Kriterium:** Ein realer Nutzer durchläuft den Loop über mehrere Sitzungen; wir sehen erste Signale, ob Chunks nach Pausen halten.

## Später (nach M1, ungeordnet priorisiert)

- **Content-Pipeline automatisieren** — von handgeprüft zu QS-gestützt on demand.
- **Memory-Engine ausbauen** — echtes Retrieval-Scheduling, Kontextvariation, Wartungsmodus, Produktionsstufe.
- **Volle Erhalt-Messung** — die stabile-Chunks-Metrik nach [`07-measurement.md`](07-measurement.md).
- **Ehrliche Gamification** — lebendes Gedächtnisfeld, Meilensteine, Flow-Band, ehrlicher Streak ([`06-motivation.md`](06-motivation.md)).
- **Weitere Level / Sprachen**, dann **Mobile**.

## Priorisierungsregel

Bei jeder „sollen wir X schon bauen?"-Frage gilt die Reihenfolge:
1. Beweist es den **Erhalt**-Kern? → jetzt.
2. Stützt es eine **schon getroffene** Entscheidung? → bald.
3. Ist es „nice to have" / auf Vorrat? → [`11-ideas.md`](11-ideas.md), nicht bauen.

## Technikentscheidungen: erst bei Build-Start

Modelle, TTS, Stack, SRS-Algorithmus veralten schnell und werden **per Live-Recherche** bei Build-Beginn entschieden, nicht aus dem Gedächtnis in M0 ([`10-open-questions.md`](10-open-questions.md)).
