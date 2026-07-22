# 04 — Produkt: Comprehension-Loop & täglicher Ablauf

*Zweck: Wie sich die Methode für den Nutzer anfühlt — der konkrete Ablauf einer Session.*

## Der Comprehension-Loop

Der Comprehension-Loop ist die Nutzer-sichtbare Umsetzung der Methodenschleife ([`03-method.md`](03-method.md)). Vier Phasen, pro Segment:

1. **Begegnung** — ein kurzes schwedisches Segment auf i+1 (Text + TTS-Audio), in dem der/die Ziel-Chunk(s) eingebettet vorkommen.
2. **Verständnishilfen** — auf Abruf, gestuft: erst Birkenbihl-Dekodierung (wörtlich), dann idiomatische Übersetzung, dann optional Ton/Bild/Kontext. Der Nutzer zieht nur so viel Hilfe, wie er braucht (Autonomie, [`06-motivation.md`](06-motivation.md)).
3. **Verständnis-Check** — kurzer Abruf: Hat der Nutzer die Bedeutung? Erst Wiedererkennen, später Produktion. Kein Ratespiel um XP, sondern ein echtes Signal für die Memory-Engine.
4. **Logging** — Ergebnis (verstanden / mit Hilfe / nicht) und Kontext werden pro Chunk protokolliert. Das speist Scheduling und Messung ([`07-measurement.md`](07-measurement.md)).

Danach entscheidet die Memory-Engine, wann jeder Chunk wiederkommt — und in welchem *anderen* Kontext.

## Ein typischer Tag

Kurz, endlich, ohne Zwang zum „Weitermachen bis der Balken voll ist":

1. **Fällige Wartung zuerst.** Chunks, die heute am Vergessenspunkt stehen, kommen als kurze Abrufe zurück — in neuen Sätzen. Das ist das Herz, nicht der Nachtisch.
2. **Etwas Neues, dosiert.** Ein bis wenige neue Segmente auf i+1, nur wenn das Erfolgsband (~80–85 %) es zulässt. Bei Überforderung: weniger Neues, mehr Festigung.
3. **Ehrlicher Abschluss.** Die Session endet, wenn das sinnvolle Tagespensum erreicht ist — nicht, wenn eine Belohnung winkt. Anzeige: was heute stabilisiert wurde, nicht „Streak gerettet".

Es gibt bewusst **kein** „Lektion abgeschlossen"-Ende und keinen Zwang, täglich zu erscheinen (siehe „ehrlicher Streak", [`06-motivation.md`](06-motivation.md)).

## Adaptives Erfolgsband

Statt fixer Lektionskurve (die den „Cliff" erzeugt) hält das Produkt den Nutzer in einem **Erfolgsband von ~80–85 %**: schwer genug für Desirable Difficulties, leicht genug für Flow ([`02-science.md`](02-science.md)). Zu leicht → mehr/schwierigeres Neues und längere Intervalle. Zu schwer → mehr Festigung, kürzere Intervalle, mehr Kontextstützen. Die genaue Zielgröße ist eine Messfrage → [`10-open-questions.md`](10-open-questions.md).

## Was der Nutzer NICHT sieht

- Keine XP-Zahl, kein Level-Up-Konfetti, keine Diamanten.
- Keinen zerbrechenden Streak-Zähler mit Drohkulisse.
- Keine „Lektion X von Y"-Fortschrittsleiste, die Endlichkeit vortäuscht.

Stattdessen: das lebende Gedächtnisfeld und ehrliche Erhalt-Zahlen ([`06-motivation.md`](06-motivation.md), [`07-measurement.md`](07-measurement.md)).

## MVP-Zuschnitt (M1)

Für M1 ist der Loop bewusst auf das Nötigste reduziert: *ein* Level, ~20 handgeprüfte Segmente, Begegnung + gestufte Hilfe + einfacher Check + Logging, plus eine simple Fortschrittsanzeige. Kein automatischer Content, keine ausgebaute Engine. Details: [`09-roadmap.md`](09-roadmap.md).
