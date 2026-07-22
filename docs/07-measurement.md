# 07 — Was „Erhalt" numerisch bedeutet

*Zweck: Die operative Definition der einen Zahl, die für NEUROLANG zählt.*

## Warum das die wichtigste Doc ist

Wenn Erhalt der Nordstern ist ([`01-vision.md`](01-vision.md)), dann steht und fällt das Produkt mit seiner **messbaren Definition**. Eine vage „du machst Fortschritte"-Anzeige wäre genau der Selbstbetrug, den wir bei anderen Apps kritisieren.

## Die Nordstern-Aussage

> „340 Chunks aktiv, davon 60 auch nach 90 Tagen ohne Übung stabil."

Diese Aussage zerlegt sich in zwei Zahlen mit klarer Bedeutung.

## Kern-Metriken

### Aktive Chunks
Chunks, die aktuell in der Schleife sind (begegnet + mindestens einmal erfolgreich abgerufen, noch nicht als „stabil" verabschiedet). Wächst mit neuem Lernen. **Allein ist diese Zahl fast wertlos** — sie ist nur der Nenner.

### Stabile Chunks (die eigentliche Zahl)
Ein Chunk gilt als **stabil**, wenn er nach einer definierten Pause **ohne zwischenzeitliche Übung** erfolgreich abgerufen wird — auf Produktionsniveau, in einem *neuen* Kontext. Der Referenzhorizont ist zunächst **90 Tage** (Arbeitsannahme, justierbar → [`10-open-questions.md`](10-open-questions.md)).

Wichtig: Stabilität wird **gemessen, nicht geschätzt**. Der einzige ehrliche Beleg ist ein erfolgreicher Abruf nach echter Pause. Ein Modell (SRS-Stabilität) darf *vorhersagen*, wann geprüft wird — aber die Zahl „stabil" zählt nur bestandene reale Abrufe nach Pause.

## Warum diese Definition streng sein muss (Goodhart)

Jede Lockerung öffnet eine Scheinmetrik ([`06-motivation.md`](06-motivation.md)):
- Zählte man Wiedererkennen statt Produktion → man könnte „behalten", ohne produzieren zu können (genau der Attritions-Fehler).
- Zählte man Abruf im *gleichen* Kontext → man misst Kontextbindung, nicht Erhalt.
- Zählte man ohne Pause → man misst Kurzzeitgedächtnis.

Die drei Bedingungen — **nach Pause**, **Produktion**, **neuer Kontext** — sind kein Zufall, sondern der direkte Gegenentwurf zu den drei Attritions-Ursachen ([`01-vision.md`](01-vision.md)).

## Sekundäre Signale (nachrangig, nie das Ziel)

- **Erhalt-Rate:** stabile / je aktiv gewesene Chunks — misst, wie gut die Methode hält.
- **Zeit-bis-stabil:** wie lange ein Chunk braucht, um Stabilität zu erreichen.
- **Gefährdungsanteil:** Anteil aktiver Chunks nahe am Vergessenspunkt — steuert die Tagesplanung ([`04-product.md`](04-product.md)).

Diese Signale helfen dem *System* (Scheduling, Erfolgsband). Dem *Nutzer* zeigen wir primär die stabile Zahl und das Gedächtnisfeld — nicht ein Cockpit voller Kennzahlen.

## Was wir dem Nutzer zeigen

- Die stabile Zahl, ehrlich und schlicht.
- Das lebende Gedächtnisfeld als qualitative Ergänzung.
- Meilensteine an realer Fähigkeit.

Kein XP, kein Streak-Zähler mit Drohkulisse.

## Offen

Referenzhorizont (30/60/90 Tage? mehrere Stufen?), Produktions-Prüfkriterium (wie streng zählt „richtig produziert"?), und wie man Stabilität misst, ohne den Nutzer mit reinen Prüfabrufen zu nerven — alles in [`10-open-questions.md`](10-open-questions.md). In M1 reicht eine **simple** Fortschrittsanzeige; die volle Messung kommt später ([`09-roadmap.md`](09-roadmap.md)).
