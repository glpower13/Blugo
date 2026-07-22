# 01 — Vision, Mission, Zielnutzer

*Zweck: Wofür NEUROLANG existiert, für wen, und woran wir Erfolg messen.*

## Vision

Eine Sprachlern-App, die man **nie „durch" hat** — weil das Produkt nicht das Lernen ist, sondern das **Behalten**. Der Nutzer soll in drei Jahren noch abrufen können, was er in Woche eins gebaut hat, ohne es je bewusst „wiederholt" zu haben.

## Mission

Wir bauen die erste Sprachlern-App, deren zentrale Metrik **messbarer Erhalt** ist statt Engagement. Alles Weitere — Content, UI, Motivation, Technik — leitet sich aus dieser einen Entscheidung ab.

## Das Problem, das wir lösen

Klassische Apps optimieren *Erwerb*: Lektionen abschließen, Streaks halten, Vokabeln „durchnehmen". Der Nutzer lernt real etwas — und verliert es wieder, sobald er pausiert. Das ist **Sprachattrition** (siehe [`02-science.md`](02-science.md)), kein Willensproblem. Drei belegbare Ursachen:

1. Wissen wurde nie bis zur Automatik überlernt.
2. Es hing an wenigen Kontexten und Abrufreizen.
3. Nichts hat es je reaktiviert.

NEUROLANG greift genau an diesen drei Punkten an — als **Mechanik**, nicht als guter Vorsatz des Nutzers.

## Zielnutzer

**Erwachsene Selbstlerner**, die schon Duolingo/Babbel/Lingua o. ä. probiert haben. Sie sind nicht naiv: Sie *haben* etwas gelernt. Aber sie sind entweder

- an der steigenden Schwierigkeit abgesprungen (der „Cliff", wenn die fixe Lektionskurve die eigene Kompetenz überholt), oder
- nach einer Pause frustriert, weil kaum etwas geblieben ist.

Sie wollen kein Casino. Sie wollen den ehrlichen Beweis, dass ihre Zeit sich sammelt.

**Erste Sprachrichtung: Deutsch → Schwedisch.** Bewusst gewählt: nah genug am Deutschen für schnelle erste Erfolge, aber mit dünner Angebotslage bei graded Content — was unseren KI-Content-Moat sofort relevant macht (siehe [`08-content-pipeline.md`](08-content-pipeline.md)).

### Ausdrücklich nicht Zielnutzer (in v1)

- Absolute Erstkontakt-Lerner ohne jede Lernerfahrung.
- Nutzer, die primär Prüfungs-Cramming für einen fixen Termin wollen (das ist Erwerb, nicht Erhalt).
- Kinder (andere Motivations- und Rechtsanforderungen).

## Woran wir Erfolg messen

Nicht an DAU/Streak-Länge/Session-Zeit. Sondern am **Erhalt**: Wie viele Chunks hält ein Nutzer nach definierten Pausen ohne Übung stabil? Die operative Definition steht in [`07-measurement.md`](07-measurement.md).

Ein Nordstern-Satz, den ein Nutzer über sich sagen können soll:

> „Ich habe 60 Chunks, die auch nach 90 Tagen ohne Üben noch sitzen — und die Zahl wächst."

## Nicht-Ziele

Siehe README §10. Kurz: kein Duolingo-Klon, kein XP/Diamanten/zerbrechender Streak, kein Vokabelpauken, keine unbelegten „Neuro"-Versprechen, keine Architektur vor dem Konzept.
