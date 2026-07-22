# 10 — Offene Fragen & vertagte Entscheidungen

*Zweck: Ehrlicher Sammelplatz für alles, was bewusst noch nicht entschieden ist. Besser hier als in vage formulierten Docs versteckt.*

Konvention: Jede offene Frage nennt **worum es geht**, **warum vertagt**, und **wann/wie entschieden**. „Live-Recherche bei Build-Start" heißt: nicht aus dem Gedächtnis festschreiben, weil es zu schnell veraltet.

## Wissenschaft & Methode

- **Chunk-Granularität.** Wie groß ist ein Chunk optimal (Wendung, Teilsatz, ganzer Satz)? → empirisch in M1 justieren, nicht vorab festlegen. ([`03-method.md`](03-method.md))
- **Produktions- vs. Wiedererkennungs-Übergang.** Wann genau wechselt ein Chunk von Wiedererkennen zu Produktion? → offen, Messfrage.
- **Referenzhorizont für „stabil".** 30 / 60 / 90 Tage — oder mehrere Stufen? Arbeitsannahme 90 Tage. → in M1 nur simpel, volle Definition später. ([`07-measurement.md`](07-measurement.md))
- **Erfolgsband-Zielwert.** ~80–85 % ist Design-Richtung, kein gemessener Wert. → in M1 beobachten und justieren. ([`04-product.md`](04-product.md))

## Messung

- **Produktions-Prüfkriterium.** Wie streng zählt „richtig produziert" (Tippfehler? Wortstellung? Synonyme?)? → offen.
- **Stabilität messen ohne zu nerven.** Wie prüft man Erhalt nach Pause, ohne den Nutzer mit reinen Testabrufen zu frustrieren? → Designfrage für die volle Messung.

## Content-Pipeline

- **Niveau-Operationalisierung.** Wie wird i+1 pro Nutzer konkret gemessen/definiert (CEFR? eigenes Wortschatzmodell?)? → offen. ([`08-content-pipeline.md`](08-content-pipeline.md))
- **QS bei Automatisierung.** Welche automatischen Checks fangen Halluzinationen/Sprachfehler zuverlässig ab? → nach M1.
- **Kosten & Latenz.** Caching vs. Frisch-Generierung, Vorab-Generierung fälliger Chunks. → nach M1.

## Technik (alles per Live-Recherche bei Build-Start)

- **Web-Stack** für M1 (und ob Client-only genügt).
- **Datenhaltung / Auth / Hosting.**
- **SRS-Algorithmus:** klassisch (SM-2 / FSRS) vs. eigen. In M1 bewusst simpel. ([`03-method.md`](03-method.md), [`05-architecture.md`](05-architecture.md))
- **LLM-Anbieter/Modell** für Generierung & Grading.
- **Schwedisches TTS**-Anbieter.

## Produkt & Motivation

- **Verbundenheit (dritte SDT-Säule).** Ob/wie soziale Elemente rein, ohne in Goodhart/Ranglisten zu kippen. → default draußen, offen. ([`06-motivation.md`](06-motivation.md))
- **Gedächtnisfeld-Visualisierung.** Konkrete Form des „lebenden Feldes" — noch nicht gestaltet.
- **Onboarding.** Wie steigt ein Nutzer ohne Level-Baum sinnvoll ein? → offen.

## Geschäft / Recht (nachrangig in M0)

- **Monetarisierung.** Nicht Gegenstand von M0/M1.
- **Content-Rechte** an generiertem Material. → vor öffentlicher Nutzung klären.

---

*Wird eine Frage entschieden, wandert die Antwort in die zuständige Doc und wird hier gestrichen (oder als „entschieden: …" markiert).*
