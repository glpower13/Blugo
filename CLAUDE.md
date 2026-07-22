# CLAUDE.md

Leitfaden für Claude Code (und andere Agenten) bei der Arbeit an diesem Repository.

## Was das hier ist

**NEUROLANG** — eine Sprachlern-App, die auf **messbaren Erhalt** statt Engagement optimiert. Erste Sprachrichtung: Deutsch → Schwedisch. Volle Konzeptbeschreibung: [`README.md`](README.md).

## Aktueller Status: Meilenstein 0 (Konzept & Doku)

**In dieser Phase wird bewusst KEIN Anwendungscode geschrieben.** M0 liefert ausschließlich Konzept und Dokumentation: `README.md`, dieses `CLAUDE.md`, und `/docs`. Erst M1 baut ein schlankes MVP. Siehe [`docs/09-roadmap.md`](docs/09-roadmap.md).

Konkret heißt das für Beiträge in M0:
- **Keinen** App-Code, kein Backend „auf Vorrat", keine Build-Tooling-Gerüste, keine `package.json` mit App-Dependencies.
- Erlaubt sind: Dokumentation, Diagramme (als Markdown/Text), Beispiel-Content-Skizzen, README-Pflege.
- Wenn eine Aufgabe App-Code verlangt, ist das ein Signal, dass die Roadmap-Phase hinterfragt werden sollte — nicht, dass man M0 überspringt. Nachfragen statt vorpreschen.

## Sprachregeln

- **Deutsch** für alle nutzer- und projektnahen Inhalte: Doku, README, Konzepttexte, Commit-Beschreibungen dürfen deutsch sein.
- **Englisch** im Code: Bezeichner, Kommentare, technische APIs (relevant ab M1).
- Fachbegriffe, die etabliert englisch sind (Chunk, Spacing, Retrieval, i+1, Flow), bleiben englisch — nicht zwanghaft eindeutschen.

## Inhaltliche Leitplanken

Diese Prinzipien sind das Projekt. Beiträge, die sie verletzen, gehören nicht rein:

1. **Erhalt vor Erwerb.** Der Nordstern ist „Was behält der Nutzer zuverlässig?", nicht „Wie lange bleibt er in der App?". Kein Design, das Anwesenheit statt Kompetenz belohnt.
2. **Chunks, keine isolierten Vokabeln.** Lerneinheit ist immer eine sinnvolle Wendung im Kontext.
3. **Evidenz-Kennzeichnung ist Pflicht.** Jede lernpsychologische Behauptung bekommt eine Evidenzstufe: **Fels / stark / schwach / widerlegt**. Keine unbelegten „Neuro"-Versprechen. Stufen und Quellen: [`docs/02-science.md`](docs/02-science.md).
4. **Gremium, keine Einzellehre.** Kein Autor (auch nicht Birkenbihl) ist das Fundament. Mehrere Stimmen, gegeneinander abgewogen.
5. **Kein Dopamin-Casino.** Keine XP, keine zerbrechenden Streaks, keine Diamanten. Motivation über Kompetenzsignale (SDT). Goodhart im Blick behalten: nie eine Metrik belohnen, die man optimieren kann, ohne die Sprache zu lernen.
6. **Kein Markdown-Friedhof.** Doku nur so tief, wie sie eine Entscheidung stützt. Lieber eine klare Seite als fünf vage.
7. **Technikwahl per Live-Recherche bei Build-Start.** Modelle, TTS, Stack veralten schnell — nicht aus dem Gedächtnis festschreiben. In M0 bleiben solche Entscheidungen bewusst offen ([`docs/10-open-questions.md`](docs/10-open-questions.md)).

## Dokumentationsstruktur

```
docs/
  01-vision.md            Vision, Mission, Zielnutzer
  02-science.md           Gremium + Evidenzstufen + Quellen
  03-method.md            Begegnen→Abrufen→Erhalten, Birkenbihl-Fusion
  04-product.md           Comprehension-Loop, täglicher Ablauf
  05-architecture.md      Module, Datenfluss, spätere Technik
  06-motivation.md        Belohnungssystem (SDT, 4 Mechaniken)
  07-measurement.md       Was „Erhalt" numerisch bedeutet
  08-content-pipeline.md  Der Moat: KI-Input + Auto-Dekodierung
  09-roadmap.md           Meilensteine, Prioritäten
  10-open-questions.md    Ehrliche offene Punkte, vertagte Entscheidungen
  11-ideas.md             Parkplatz
```

Beim Ändern eines Konzepts: die zuständige `docs/`-Datei aktualisieren **und** prüfen, ob README/andere Docs dem nicht mehr widersprechen. Querverweise konsistent halten.

## Konventionen für Doku

- Dateinamen: `NN-thema.md`, zweistellig nummeriert, kebab-case.
- Jede Doc beginnt mit einem H1-Titel und einem Ein-Satz-Zweck.
- Behauptungen mit Evidenzbezug tragen die Stufe inline (z. B. „*(Spacing Effect — Fels)*").
- Offene Entscheidungen wandern nach `10-open-questions.md`, nicht in Fußnoten verstreut.
