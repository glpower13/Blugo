# 07 — Messung: Was „Erhalt" numerisch bedeutet

Die Leitzahl ist nicht „Lektionen" oder „Streak", sondern **zuverlässig behaltene Chunks**.

## Kernmetriken
- **Aktive Chunks** — aktuell im Repertoire.
- **Stabile Chunks** — korrekt abgerufen nach langem Intervall ohne Zwischenübung (z. B. „stabil ≥ 90 Tage"). Die eigentliche Erfolgszahl.
- **Verständnis-Abdeckung** — Anteil verstandener Chunks in neuem Kontext auf einer Zielstufe (z. B. „82 % von Level-2-Input in nativem Tempo").
- **Tempo-Toleranz** — bei welchem Sprechtempo Verständnis noch trägt.
- **CEFR-Näherung** — grobe Einordnung (A1…), transparent als Näherung gekennzeichnet.

## Anti-Gaming (Goodhart-Schutz)
- „Stabil" zählt nur nach echtem langem Intervall, nicht nach Massen-Wiederholung am selben Tag.
- Erfolg = Abruf in *variiertem* Kontext, nicht Wiedererkennen desselben Items.
- Keine Metrik belohnt reine Zeit oder reine Anwesenheit.

## Dashboard-Leitsatz
Eine dominante, ehrliche Zahl + das lebende Gedächtnisfeld. Beispiel:
> „340 aktiv · 60 langfristig stabil · du verstehst 82 % von Level-2 in nativem Tempo."

## Nachtrag 2026-07-24 — der Fortschrittsbalken in zwei Zonen

**Beobachtung des Nutzers:** „Warum bewegt sich der Balken nicht?"

**Befund (kein Fehler, sondern Design):** Der Balken zählte ausschließlich
**bewiesen stabil** (`provenStableAt`). Dafür müssen drei Dinge zusammenkommen
(`memoryEngine.ts`): ein **Produktions**-Abruf, ein davor bereits erreichtes
Intervall von **≥ 90 Tagen** (`STABLE_INTERVAL_DAYS`) — und der muss gelingen.
Realistisch bewegt sich so ein Balken **frühestens nach ~3 Monaten**.

**Das Problem:** Ein Indikator, der monatelang bei null steht, ist als Rückmeldung
unbrauchbar — er wirkt kaputt, und der Lerner sieht nicht, dass er sehr wohl
vorankommt. Ehrlichkeit ohne Lesbarkeit hilft niemandem.

**Entscheidung:** Der Balken bekommt **zwei Zonen** (`HonestBar.tsx`):

| Zone | Bedeutung | Bedingung |
|---|---|---|
| kräftig (Mint) | **bewiesen** | Produktion nach ≥ 90 Tagen überstanden (`isStable`) |
| blasser (Mint 40 %) | **reift** | Produktion und ≥ 21 Tage überstanden, noch nicht bewiesen (`isMaturing`) |

Beides ist **gemessenes Können**, nur an zwei Horizonten — der Balken lebt damit
nach Wochen statt nach Monaten. Derselbe Aufbau im Ring auf der Übersicht
(blasser Bogen hinter dem kräftigen).

**Was bewusst NICHT im Balken steht:** „aktiv/angefasst". Das wäre bloße
Anwesenheit, und die darf nie wie Fortschritt aussehen (die eine Design-Regel).
Sie bleibt eine nüchterne Zahl im Text.

**Leitplanke:** Die beiden Zonen sind per Definition disjunkt (`isMaturing`
schließt `isStable` aus) — zwei Tests in `categories.test.ts` sichern, dass keine
Wendung doppelt zählt und der Balken nie über 100 % läuft.

---

## Selbstauskunft: „Warum jetzt?" *(gebaut 2026-07-25)*

Jede Lern-App entscheidet, was du als Nächstes siehst, und keine sagt dir, warum. Man soll
dem Algorithmus glauben. Für eine App, deren Versprechen „unsere Zahlen sind wahr" lautet,
ist das ein Widerspruch: **Eine Messung, die man nicht nachvollziehen kann, ist eine
Behauptung.**

In der Sitzung steht deshalb neben der Kopfzeile ein „Warum jetzt?". Dahinter, aus dem
echten Zustand gerechnet (`src/modules/memory/explain.ts`):

- warum sie fällig ist (pünktlich · seit N Tagen überfällig · Kurzzeit-Wiederholung · neu),
- wann sie zuletzt dran war,
- auf welcher Stufe sie steht und wie oft sie in Folge saß,
- **wann sie wiederkommt, wenn es jetzt sitzt**,
- ob sie bewiesen stabil ist — und wenn nicht, **was genau dafür noch fehlt**.

**Die Regel, die das ehrlich hält:** Die Vorschau läuft durch **dieselbe** `schedule()`, die
gleich auch wirklich plant — kein zweiter, hübscherer Rechenweg. Ein Test vergleicht die
vorhergesagte mit der tatsächlichen Zahl; sie müssen gleich sein. Und „was noch fehlt" ist
bewusst eine **Liste von Bedingungen**, kein Fortschrittsbalken: Der Beweis ist eine
Prüfung, die man besteht oder nicht, kein Weg mit Prozenten.
