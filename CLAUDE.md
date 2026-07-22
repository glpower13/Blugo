# CLAUDE.md — Arbeitsanweisung für Claude Code

Diese Datei steuert, wie du (Claude Code) an NEUROLANG arbeitest. Lies sie vor jeder Aufgabe. Lies zusätzlich `README.md` und die relevanten Dateien in `/docs`.

---

## Projekt in einem Satz

Eine Sprachlern-App (Deutsch → Schwedisch), deren Produkt **langfristiger Erhalt** ist, nicht das Lernen selbst. Sie löst gezielt das Problem, dass Nutzer Gelerntes nach Wochen wieder verlieren (Sprachattrition) und an steigender Schwierigkeit abspringen.

## Die eine Design-Regel (nicht verhandelbar)

**Jede Belohnung, jede Zahl, jeder Fortschrittsindikator muss ein *wahres* Signal echten, überprüften Lernfortschritts sein.**
Sobald ein Indikator vom echten Können abkoppelt (z. B. Punkte fürs bloße Erscheinen), optimiert der Nutzer den Indikator statt die Sprache — Goodharts Gesetz. Wenn du unsicher bist, ob ein Feature diese Regel verletzt, baue es nicht und notiere die Frage in `docs/10-open-questions.md`.

## Aktueller Meilenstein: M0 — nur Doku

**In dieser Phase wird KEIN Anwendungscode geschrieben.** Deine Aufgaben:
- Die Dokumente in `/docs` schärfen, vervollständigen und konsistent halten.
- Jede fachliche Aussage in `docs/02-science.md` nach Evidenzstärke kennzeichnen: **Fels / stark / schwach / widerlegt.** Fehlt Evidenz, kennzeichne das ausdrücklich — nichts beschönigen.
- Offene Entscheidungen in `docs/10-open-questions.md` sammeln, nicht still selbst entscheiden.

Erst wenn M0 abgenommen ist, beginnt M1 (schlankes MVP, siehe `docs/09-roadmap.md`).

## Umfangsdisziplin (gegen Scope-Creep)

- **Vier Module, nicht zehn.** Content-Pipeline, Comprehension-Loop, Memory-Engine, Progress/Measurement. Alles andere ist später oder Parkplatz (`docs/11-ideas.md`).
- Kein Backend, keine Datenbank, keine Auth „auf Vorrat". Ein Element entsteht erst, wenn eine konkrete Entscheidung es braucht.
- Doku nur so tief, wie sie eine Entscheidung stützt. Kein Markdown-Friedhof.
- Der MVP (M1) baut **einen** Lern-Loop für **ein** Level, nicht die ganze Plattform.

## Was du NICHT baust (Anti-Ziele)

- Kein XP, keine Level-Zahlen, keine Diamanten, **kein zerbrechender Streak**.
- Kein Drill isolierter Vokabeln. Lerneinheit ist immer der **Chunk im Kontext**.
- Keine unbelegten Behauptungen („Neuroplastizität" als Design-Prinzip, „Lernstile", „Lernen im Schlaf", generisches Brain-Training). Wenn so etwas auftaucht: als *widerlegt/schwach* kennzeichnen, nicht als Feature einbauen.
- Kein Nachbau von Duolingo-Mechaniken „weil es alle so machen".

## Der Lern-Loop (Referenz)

Begegnen → Abrufen → Erhalten, pro Chunk:
1. Verständliche Begegnung (Comprehensible Input, i+1; Encoding u. a. per Birkenbihl-Dekodierung)
2. Aktiver Abruf (Testing Effect)
3. Abruf am Vergessenspunkt (Spacing)
4. Kontextvariation
5. Wartungsmodus (ewiger Erhalt-Rhythmus)

Adaptive Schwierigkeit hält den Nutzer im Erfolgsband ~80–85 %. Wird etwas zu hart, **nicht durchdrücken**: erst mehr verständlichen Input + leichtere Variante nachschieben, dann neu annähern. Es darf keine Klippe geben, an der der Nutzer abspringt.

## Birkenbihl — Rolle klarstellen

Vera F. Birkenbihls Dekodieren (wörtliche interlineare Übersetzung → Struktur der Zielsprache begreifen, ohne Vokabelpauken) ist ein **Baustein des Encodings (Schritt 1)** und eine von mehreren wissenschaftlichen Stimmen. Sie ist **nicht** das Fundament des Systems. Ihr schwach belegter Teil (passives Hintergrund-/Schlaf-Hören) wird als solcher gekennzeichnet und nicht als Kernmechanik gebaut.

## Konventionen

- **Sprache:** Doku und nutzerseitige Inhalte auf **Deutsch**; Code, Bezeichner, Commit-Messages auf **Englisch**.
- **Doku-Stil:** knapp, entscheidungsorientiert, mit Begründung. Jede technische Entscheidung dokumentieren.
- **Zielsprachpaar:** Deutsch → Schwedisch (Architektur aber so halten, dass weitere Paare später möglich sind).
- **Chunk** ist die zentrale Dateneinheit — nicht „Wort", nicht „Lektion".

## Technikentscheidungen — bewusst vertagt

Konkrete Modelle (schwedisches TTS/ASR, LLM für Generierung & Dekodierung), Framework und Stack werden **erst bei Build-Start (M1) und per aktueller Recherche** festgelegt — nicht jetzt aus dem Gedächtnis, weil dieser Bereich schnell veraltet. Bis dahin bleiben sie in `docs/05-architecture.md` als Anforderungen (was das Modell können muss), nicht als Produktnamen.

## Definition of Done für M0

- `/docs` vollständig, in sich konsistent, ohne Widersprüche zu `README.md`.
- Jede fachliche Aussage in `docs/02-science.md` mit Evidenzstufe.
- Alle offenen Punkte in `docs/10-open-questions.md`.
- Ein klar umrissener, umsetzbarer M1-Scope in `docs/09-roadmap.md`.
