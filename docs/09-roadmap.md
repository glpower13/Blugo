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

> **Standortbestimmung & Reihenfolge nach vorn (2026-07-23):** `gremium-naechste-schritte.md`. Kernbotschaft: Der schnellste Weg zum Ziel führt über **Inhalt (Moat) + Beweis (Deploy)**, nicht über mehr Features. Premium-Design (edel, herausragend, nicht generisch) als **Nordstern jetzt**, volle Umsetzung **nach** der Substanz.

---

## Stand 2026-07-25 — Schwedisch in die Breite gebaut, mit Meilensteinen

Nach der Entscheidung „**erst Schwedisch fertig machen**" (statt sofort Englisch
danebenzustellen) ist der Inhalt in die Breite gegangen:

| | vorher | jetzt |
|---|---|---|
| Bereiche | 8 | **11** |
| Themen | 30 | **55** |
| Wendungen | 179 | **379** |
| Segmente (Kontexte) | 434 | **934** |
| Kontexte je Wendung | 2,70 | **2,89** |

Neu dazugekommen sind unter anderem: Zeit & Uhrzeit, Tage & Jahreszeiten, Fika,
Sprache & Lernen, Small Talk (A1) · Bank, Post & Formulare, Kleidung, Apotheke,
Termine, Einladen & Absagen, Reise planen, Kinder & Schule (A2) · Gefühle,
Reklamation, Medien, Feste & Traditionen, Bewerbung, Meinung & Begründung (B1) ·
Diskutieren, Umwelt & Gesellschaft, Verhandeln, Erzählen, Nuancen,
Redewendungen (B2).

**Warum Meilensteine dazugehören.** Ohne sie ist „379 Wendungen" nur eine
größere Zahl. Mit ihnen beantwortet die App die Frage „wo stehe ich?" — und zwar
mit derselben harten Messlatte wie überall sonst: erreicht ist ein Meilenstein
erst, wenn ≥ 90 % seiner Wendungen **bewiesen** sind. Details und die Grenzen
der Aussage: `07-measurement.md`, Nachtrag (2).

**Was dabei ausdrücklich NICHT behauptet wird.** Der Inhalt ist maschinell
vorgeprüft (jedes Wort ist echtes Schwedisch, Wörterbuch + Korpus), aber
Wortstellung, Idiomatik und Ton hat niemand gegengelesen. Es gibt in diesem
Projekt keine schwedischsprachige Person dafür, und deshalb gibt es dafür auch
keinen Zähler mehr — nur den Satz, der die Grenze nennt
(`content-review-schwedisch.md`).

**Nächster Schritt am Inhalt (offen):** Gespräche. 15 Szenen decken 59 der 379
Wendungen ab; alles Neue ist bisher nur im Lern-Loop, nicht im Dialog.
