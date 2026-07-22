# 03 — Methode: Begegnen → Abrufen → Erhalten

*Zweck: Die Kernschleife pro Chunk und die Fusion mit Birkenbihls Dekodierung.*

## Was ist ein Chunk?

Ein **Chunk** ist eine sinnvolle Wendung im Kontext — nie eine isolierte Vokabel. Beispiele (SV → DE):

- *"Kan du hjälpa mig?"* — „Kannst du mir helfen?"
- *"Jag skulle vilja ha..."* — „Ich hätte gern..."
- *"Det spelar ingen roll."* — „Das spielt keine Rolle."

Warum Chunks: Sie tragen Kollokation, Grammatik-im-Gebrauch und Abrufreiz in *einer* Einheit. Isolierte Wörter zerfallen schneller und lassen sich nicht produzieren (siehe Attrition, [`02-science.md`](02-science.md)).

Die Chunk-Granularität ist eine offene Justierungsfrage → [`10-open-questions.md`](10-open-questions.md).

## Die Schleife (eine pro Chunk)

Kein Zaubertrick — die konsequente Verdrahtung weniger robuster Effekte zu einer Schleife:

### 1. Verständliche Begegnung · *(Comprehensible Input — stark)*
Der Chunk erscheint **eingebettet** in verstandenem Input auf i+1-Niveau, nie als nackte Karteikarte. Encoding-Hilfe u. a. per Birkenbihl-Dekodierung (unten). Ziel: Bedeutung ist da, bevor irgendetwas abgefragt wird.

### 2. Aktiver Abruf · *(Testing Effect — Fels)*
Kurz nach der Begegnung holt der Nutzer den Chunk **selbst** her. Zwei Stufen:
- **Wiedererkennen** (früh): aus Optionen/Kontext wiederfinden.
- **Produktion** (später): aktiv herstellen, weil produktives Wissen zuerst verfällt und daher gezielt trainiert werden muss.

### 3. Abruf am Vergessenspunkt · *(Spacing Effect — Fels)*
Der Chunk kehrt **genau dann** zurück, wenn Vergessen droht, nicht früher (langweilt) und nicht später (verloren). Jeder erfolgreiche Abruf **dehnt** das nächste Intervall; ein Fehlabruf **staucht** es. Umsetzung: Memory-Engine, siehe Scheduling unten.

### 4. Kontextvariation · *(Desirable Difficulties — stark)*
Wiederkehr immer in **anderen** Sätzen/Situationen, nie identisch. Direkter Gegengift gegen kontextgebundenes Verblassen (Ursache 2 der Attrition): der Chunk wird an viele Abrufreize gebunden statt an einen.

### 5. Wartungsmodus · *(Spacing/Overlearning — Fels)*
Ein „gelernter" Chunk **verschwindet nie**. Er wandert in einen sich ewig verlängernden Erhalt-Rhythmus (Wochen → Monate → länger). **Das ist der Teil, den keine App hat** — und der strukturelle Grund, warum es diesmal bleibt. Wartung ist kein Zusatz, sondern das Produkt (siehe [`01-vision.md`](01-vision.md)).

## Birkenbihl-Fusion: Dekodierung als Encoding-Hilfe

Birkenbihls Kern-Technik ist die **Wort-für-Wort-Dekodierung**: unter den fremdsprachigen Satz wird eine wörtliche Übersetzung gelegt, die die *Struktur* der Zielsprache sichtbar macht — nicht die schöne Zielübersetzung.

```
Kan   du   hjälpa   mig?
Kann  du   helfen   mir?      (Dekodierung, wörtlich)
→ „Kannst du mir helfen?"     (idiomatisch)
```

Nutzen: Der Lerner *sieht* die schwedische Logik, statt zu pauken. Historisch musste diese Dekodierung von Hand erstellt werden — der Hauptgrund, warum die Methode nie skaliert hat. NEUROLANG **automatisiert sie in der Content-Pipeline** ([`08-content-pipeline.md`](08-content-pipeline.md)). Das ist der Teil von Birkenbihl, den wir übernehmen — als Technik, nicht als Gehirn-Theorie ([`02-science.md`](02-science.md)).

## Scheduling-Logik (konzeptionell, nicht implementiert)

Pro Chunk hält die Memory-Engine mindestens:
- letzten Abrufzeitpunkt und -ergebnis,
- aktuelles Intervall / Stabilitätsschätzung,
- Abrufstufe (Wiedererkennen vs. Produktion),
- Liste bereits gesehener Kontexte (für Variation).

Daraus folgt der nächste Fälligkeitszeitpunkt. Das konkrete Algorithmus-Modell (klassisches SRS wie SM-2/FSRS vs. eigenes) ist bewusst **offen** und wird bei Build-Start per Live-Recherche entschieden → [`10-open-questions.md`](10-open-questions.md). M1 darf hier absichtlich simpel sein → [`09-roadmap.md`](09-roadmap.md).
