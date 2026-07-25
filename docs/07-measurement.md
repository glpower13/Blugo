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
| blasser (Mint 40 %) | **reift** | Produktion und ≥ 21 Tage tatsächlich überstanden, noch nicht bewiesen (`isMaturing`, Vermerk `maturedAt`) |

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

---

## Nachtrag 2026-07-25 — Ehrlichkeits-Audit: drei Zahlen, die zu viel behaupteten

Ein eigener Prüfdurchgang hat die Frage gestellt, die dieses Projekt an sich selbst
stellen muss: **Behauptet irgendeine Zahl mehr, als sie gemessen hat?** Drei Befunde
wurden im Browser reproduziert, nicht vermutet — und alle drei sind behoben.

### 1. „reift" hing an einer Prognose, nicht an einer Messung

`isMaturing` prüfte `intervalDays >= 21` — das gerade **neu geplante** Intervall. Eine
Wendung galt also als „21 Tage überstanden", sobald die Engine 21 Tage *vorschlug*;
tatsächlich überstanden waren im reproduzierten Fall 3 Tage.

**Behoben:** Neues Feld `maturedAt` (`domain/chunk.ts`), gesetzt von `schedule()` beim
ersten gelungenen Produktions-Abruf, dessen **vorheriges** Intervall bereits
≥ 21 Tage (`MATURING_INTERVAL_DAYS`) war — exakt dasselbe Muster wie `provenStableAt`
am 90-Tage-Horizont, nur kürzer. `isMaturing` liest nur noch diesen Vermerk.

### 2. Ein erbrachter Beweis blieb stehen, nachdem die App das Gegenteil gemessen hatte

`provenStableAt` ist ein historischer Vermerk: einmal gesetzt, blieb er. Fiel die
Wendung danach wieder durch („Nochmal", Stufe zurück auf `recognition`, Intervall 0),
zählte sie in der großen Zahl **weiter als bewiesen stabil**. Die Überschrift daneben
lautet „Was du wirklich behalten hast" — Gegenwart. Das war die Zahl, gegen die dieses
Projekt gebaut ist.

**Behoben:** Neues Feld `lapsedAt` (Zeitpunkt des letzten Fehlschlags). `isStable` und
`isMaturing` laufen über `stillHolds()`: Ein Vermerk gilt nur, solange kein **späterer**
Fehlschlag danebensteht. Der historische Vermerk bleibt in den Daten — die Anzeige
rechnet ihn heraus. Gelingt der Beweis erneut, zählt er wieder.

### 3. „Verständnis-Abdeckung 100 %" bei drei angefassten Wendungen

`coverage` rechnete über die **begonnenen** Wendungen, der Name versprach den Anteil
**am Stoff**. Wer drei von 179 Wendungen einmal richtig hatte, las „100 %".

**Behoben:** Die Zahl heißt jetzt **Trefferquote** und nennt ihre Bezugsgröße mit:
„Trefferquote 100 % von 3 begonnenen (179 insgesamt)". Zwei Zahlen, weil eine allein
irreführt — `coverageBase` in `Metrics` liefert den Nenner.

### 4. Nebenbefund: „begegnet, aber noch nie gekonnt" lief unter „du verstehst sie"

`directionSplit` kannte drei Eimer. Wer eine Wendung dreimal hintereinander **nicht**
konnte, stand trotzdem unter „verstehst du" — weil die Stufe per Voreinstellung
`recognition` heißt. Eine Fläche, die damit wirbt, die Richtung sei ein Messwert, darf
kein Scheitern als Verständnis führen.

**Behoben:** Vierter Eimer `struggling` (begegnet, noch nie ein gelungener Abruf), im
Sprachpaar-Overlay als eigene, gedämpfte Zone sichtbar.

**Leitplanke:** Sechs neue Tests sichern die vier Regeln (`metrics.test.ts`,
`memoryEngine.test.ts`) — darunter der Fall „Beweis, dann Fehlschlag" und
„nur geplantes Intervall zählt nicht".


---

## Nachtrag 2026-07-25 — Messung und Selbsteinschätzung sind zweierlei

Der Beweis hing bis hierher am **Knopf**: nur `result === 'good'` konnte ihn
setzen. Das sah sauber aus und hatte ein Loch.

In der Produktions-Stufe prüft die App die Eingabe wirklich (`answerCheck.ts`).
Wer nach 90 Tagen exakt richtig tippt, aber aus Gewissenhaftigkeit „Fast"
drückt, bekam **keinen** Beweis — wer aufrundete, schon. Ein Indikator, der
Aufrunden belohnt, erzeugt genau das Verhalten, gegen das dieses Projekt
gebaut ist.

**Die Trennung, die das auflöst:**

| Frage | Antwort kommt aus | Steuert |
|---|---|---|
| Ist der Abruf gelungen? | der **Prüfung der Eingabe** (`ReviewMeta.exact`) | den Beweis |
| Wie sicher fühlte es sich an? | dem **Knopf** des Lerners | den nächsten Termin |

Der Beweis wird dadurch nicht weicher — er verlangt weiterhin einen exakten
Produktions-Abruf nach einer tatsächlich überstandenen Pause von ≥ 90 Tagen.
Geändert hat sich nur, **woher** die App weiß, dass er exakt war.

Was ausdrücklich gleich bleibt: Ein „Nochmal" beweist nie etwas, auch nicht mit
`exact` daneben. Und im Wiedererkennen gibt es keine geprüfte Eingabe — dort
bleibt es beim Knopf, und dort kann ohnehin nichts bewiesen werden.
