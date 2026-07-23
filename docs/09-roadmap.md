# 09 — Roadmap, Meilensteine, Prioritäten

## M0 — Konzept & Doku (abgeschlossen)
- README, CLAUDE.md, vollständige `/docs`.
- Evidenzstufen in `02-science.md` mit Primärquellen.
- Kein Anwendungscode.
- **Abnahme (Definition of Done):** siehe `CLAUDE.md` — erfüllt.

## M1 — schlankes MVP (aktuell, der Beweis)
Ziel: den Lern-Loop an *einem echten Lerner* wirksam zeigen.

**Framework (steht):**
- Installierbare, offline-fähige PWA, mobil-first (Vite + React + TS + Tailwind + `vite-plugin-pwa`). Stack-Begründung: `05-architecture.md`.
- Comprehension-Loop: Begegnung → gestufte Hilfen (Dekodierung/Übersetzung) → Abruf-Check → Logging.
- Memory-Engine minimal: echtes Spacing, Stufen-Promotion (Wiedererkennen → Produktion), Wartung fälliger Chunks; lokale Speicherung (IndexedDB).
- Ehrliche Fortschrittsanzeige (aktive/stabile Chunks, lebendes Gedächtnisfeld) mit strenger „stabil"-Definition (`07-measurement.md`).
- Unit-Tests für Scheduling & Messung, Lint und Build grün.

**Offen (bis zum M1-Beweis):**
- **~20 handgeprüfte** schwedische Segmente (Audio + Dekodierung) statt der Platzhalter.
- Feinschliff des Loops (Produktionsabruf, Kontextvariation über mehr Segmente, Verständnis-Abdeckung).
- Deployment über HTTPS, damit „Zum Startbildschirm hinzufügen" auf dem Handy real nutzbar ist.
- **Erfolgskriterium:** Chunks bleiben nach mehrwöchiger Pause messbar stabiler als bei reinem Wiederholen ohne Spacing/Wartung.

## Später (nicht vor MVP-Beweis)
- Content-Pipeline automatisieren + QS skalieren.
- Produktion/Aussprache (ASR), Interleaving ausbauen.
- Weitere Level, weitere Sprachpaare.
- Mobile, Sync/Offline, Konten.
- Optionale Features aus `11-ideas.md`.

## Priorisierungsregel
Was den *Erhalt* messbar verbessert, hat Vorrang. Alles, was nur Engagement erhöht, wird abgelehnt oder geparkt.
