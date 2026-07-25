# Gremium — Alternative zur Muttersprachler-Prüfung (Stufe-D-Beratung)

> **Ehrlicher Rahmen:** rollenbasierte Beratung (Stufe D), Fach-*Perspektiven*, keine echten Personen, keine erfundenen Zitate. Auftrag (Nutzer 2026-07-25): „Mit dem Muttersprachler-Test müssen wir uns eine Alternative überlegen."

---

## 0. In einfachen Worten

Der ganze schwedische Inhalt war **von uns/der KI verfasst und ungeprüft**. Eine
muttersprachliche Prüfung ist der sauberste Weg — aber praktisch ein Flaschenhals.
Die Lösung ist **kein Ersatz, sondern eine Aufteilung**: was eine Maschine besser
kann als ein Mensch, macht die Maschine; der Mensch bekommt nur den Rest.

## 1. Die Kernerkenntnis

Das Gremium dreht die Frage um:

> Ein Muttersprachler ist **eine Meinung eines Menschen**.
> Ein Korpus ist die **tatsächliche Sprachverwendung von tausenden Muttersprachlern**.

Für „**Ist das echtes Schwedisch?**" ist der Korpus-Beleg damit sogar *objektiver*.
Für „**Passt das hier, stimmt der Ton?**" gewinnt der Mensch. Zwei verschiedene
Fragen → zwei verschiedene Werkzeuge.

## 2. Bewertung der Wege

| Weg | Beweist | Beweist **nicht** | Evidenz |
|---|---|---|---|
| **Korpus-Häufigkeit** (`wordfreq`, Zipf-Skala) | Wort wird **real verwendet**, und wie häufig | Satzbau, Idiomatik, Register | **stark** |
| **Wörterbuch** (Hunspell `dictionary-sv`, 152.719 Einträge) | Rechtschreibung, gültige Wortform, å/ä/ö | Idiomatik | **stark**, aber eng |
| **Rückübersetzung** SV→DE | Bedeutung ist nicht verrutscht | Natürlichkeit | mittel |
| **Community** (r/Svenska, Tandem) | Echte Muttersprachler, kostenlos | Langsam, ungleichmäßig | mittel |
| **KI-Jury** (mehrere Modelle stimmen ab) | Grobe Schnitzer fallen auf | **Nichts sicher** | **schwach** |

### Ausdrückliche Warnung des Gremiums

**Die KI-Jury darf nie als „Prüfung" ausgewiesen werden.** Mehrere Modelle, die sich
einig sind, sind nicht geprüft — sie teilen dieselbe Trainingsbasis und damit
dieselben Fehler. Als *Vorfilter* nützlich, als *Beweis* wertlos. Sie so zu labeln
wäre genau der Etikettenschwindel, den die eine Design-Regel verbietet.

## 3. Entscheidung: Prüfkette statt Prüfer

1. **Maschinell, für alles** — jedes schwedische Wort gegen Korpus + Wörterbuch.
2. **Rückübersetzung** — später, prüft die Bedeutungstreue.
3. **Menschlich, nur wo nötig** — die Sätze, die Stufe 1/2 nicht sauber bestehen,
   plus die bekannten Zweifelsfälle. Aus „98 Wendungen prüfen" wird eine kurze Liste.
4. **Ehrliche Kennzeichnung** — der Status steht am Inhalt: *ungeprüft* ·
   *maschinell vorgeprüft* · *muttersprachlich geprüft*. Nie mehr behaupten, als gemessen ist.

## 4. Stufe 1 gebaut (2026-07-25)

`tools/check-swedish.py` → schreibt `docs/content-pruefbericht.md`.

**Datenquellen (beide offline nach Installation, passend zur Kein-Backend-Architektur):**
- `wordfreq` (PyPI) — korpusbasierte Worthäufigkeiten, Zipf-Skala 0–8, inkl. Schwedisch.
- `dictionary-sv` (npm, devDependency) — Hunspell-Wörterbuch, 152.719 Einträge.

> **Randnotiz zur Umgebung:** Die Korp-Schnittstelle von Språkbanken (Uni Göteborg)
> wäre die reichhaltigere Quelle (echte Belegstellen, n-Gramme), ist aus dieser
> Umgebung aber durch die Netz-Richtlinie gesperrt (`403` auf CONNECT). Die
> Paket-Register sind offen — daher der Weg über `wordfreq`/`dictionary-sv`, der
> **dieselbe Frage beantwortet** (wird das Wort real verwendet?) und zusätzlich
> offline funktioniert. Ein späterer Korp-Abgleich für **Wortfolgen** bleibt der
> nächste Ausbauschritt.

**Erstes Ergebnis (2026-07-25):**

| | |
|---|---|
| geprüfte schwedische Zeichenketten | **1.764** |
| verschiedene Wörter | **248** |
| ✅ alltagshäufig belegt | **245** |
| ⚠️ selten belegt | **3** (`provrummet`, `trettiofem`, `smaklig`) |
| ❌ nicht belegt / Tippfehler | **0** |

**Lesart:** Kein einziges erfundenes Wort, kein Tippfehler, kein fehlendes å/ä/ö.
Die drei seltenen sind sachlich in Ordnung (Umkleidekabine · fünfunddreißig ·
„smaklig måltid" = guten Appetit) — nur eben nicht alltagshäufig.

## 4b. Stufe 2 gebaut (2026-07-25) — Rückübersetzung

`tools/backtranslation.ts` → `npm run check:backtranslation` → schreibt
`docs/content-rueckuebersetzung.md`.

**Warum kein KI-Übersetzer:** Der naheliegende Weg (Satz von einer KI zurück ins
Deutsche übersetzen lassen) scheitert an derselben Warnung wie die KI-Jury —
dieselbe Trainingsbasis, dieselben Fehler, kein Beweis. Stattdessen wird
**gegen die eigenen Birkenbihl-Glossen** zurückgebaut. Das ist deterministisch,
offline, kostenlos und prüft eine echte Eigenschaft: **Widerspruchsfreiheit**.

Das Werkzeug liest den TypeScript-Seed **direkt** (nicht über Textmuster) — die
Prüfung kann damit nicht von den Daten abdriften.

| | prüft | Art |
|---|---|---|
| **A** Glossen-Lücken | schwedisches Wort ohne Wort-für-Wort-Entsprechung | **hart** |
| **B** Kontext-Brüche | Segment übt eine Wendung, die darin nicht wiederzuerkennen ist | **hart** |
| **B2** starke Kontextvariation | wo die Wiedererkennung am dünnsten wird | Hinweis |
| **C** Glossen-Konflikte | dasselbe Wort, verschiedene deutsche Glossen | Verdachtsliste |
| **D** Bedeutungsdrift | wörtlicher Rückbau deckt die behauptete Bedeutung kaum | Verdachtsliste |

**Wichtige Design-Korrektur:** B verlangte zuerst, dass das Segment die Wendung
**wörtlich** enthält — und meldete prompt 13 Fehler, die alle keine waren.
Kontextvariation ist Schritt 4 des Loops: „jag har ont här" *soll* im zweiten
Kontext als „det gör ont här" auftauchen. B misst deshalb jetzt **Deckung** mit
Toleranz für Beugung und Zusammensetzung (`buss`/`bussen`, `gott`/`jättegott`)
und schlägt erst unter 50 % an. Ein Prüfwerkzeug, das bei gesundem Inhalt Alarm
schlägt, wird abgeschaltet — dann prüft gar nichts mehr.

**Erstes Ergebnis (2026-07-25):** 332 Zeilen · **A 0 · B 0** · C 33 · D 23.

**Ein echter Fund in C:** `hej` ist in `c-hejda` (`hej då`) mit **„tschüss"**
glossiert, sonst mit „hallo". `hej` heißt nie „tschüss" — die Glosse trägt die
Bedeutung der ganzen Wendung auf ein einzelnes Wort. Genau die Frage steht schon
in `content-review-schwedisch.md` als Zweifelsfall; das Werkzeug hat sie
unabhängig gefunden. **Nicht still korrigiert** — die Entscheidung
(`hej då` als eine Formel führen oder `hej`/`då` sauber trennen) gehört zur
menschlichen Prüfung.

Die übrigen C-Einträge sind ganz überwiegend deutsche Beugung (`är` → ist/bin/bist)
und schwedische Homographen (`var` = wo *und* war, `sen` = spät *und* dann) — also
richtig. D ist erwartungsgemäß fast vollständig der Birkenbihl-Effekt selbst
(`jag vill ha` = wörtlich „ich will haben", gemeint „ich möchte"). Beide Listen
sind **Lesehilfe, kein Urteil**.

Die harten Regeln (A, B) laufen als Tests in der normalen Kaskade mit
(`tools/backtranslation.test.ts`), damit neuer Inhalt sie nicht unbemerkt bricht.

## 5. Was damit ausdrücklich NICHT bewiesen ist

Nach Stufe 1 **und** 2 bleibt offen:

- **Wortstellung und Satzbau.** Beide Stufen prüfen Wörter und Widerspruchs-
  freiheit, keine Reihenfolge.
- **Idiomatik** — ob ein Kellner in Stockholm wirklich `Vad får det lov att vara?` sagt.
- **Register** (Du/Sie, Höflichkeitsgrad) über eine Szene hinweg.
- **Ob die Übersetzung stimmt.** Ein Satz kann lückenlos glossiert, in sich
  widerspruchsfrei — und trotzdem falsch übersetzt sein.

Deshalb bleibt Stufe 3 nötig. Der Gewinn ist nicht, sie zu ersetzen, sondern sie
**klein genug zu machen, dass sie tatsächlich passiert**: aus „1.764 Sätze
durchackern" sind ~56 geordnete Verdachtsfälle plus die Frage nach Satzbau und Ton
geworden.

## 4c. Stufe 4 gebaut (2026-07-25) — der Prüf-Stand je Wendung

**Was fehlte:** Die Stufen 1–3 prüfen den Inhalt und schreiben Berichte für *uns*. Der Lerner
stand weiter vor einer Wendung, ohne zu wissen, wie geprüft sie ist.

**Was jetzt existiert:** `npm run verify:build` erzeugt `src/modules/content/verification.generated.ts` —
für **jede** Wendung eine von drei Stufen:

| Stufe | Bedeutung | Anzahl |
|---|---|---|
| `native` | von einer schwedischsprachigen Person gegengelesen | **0** — und das Werkzeug vergibt sie NIE von selbst |
| `machine` | jedes Wort ist belegtes Schwedisch (Wörterbuch 152.719 Einträge + Korpushäufigkeit) | 176 (Stand 2026-07-25; die Zahl steht erzeugt in `verification.generated.ts`) |
| `unchecked` | mindestens ein Wort ist selten oder unbelegt | 3 |

**Wie es entsteht:** `check-swedish.py` schreibt seine Urteile jetzt zusätzlich maschinenlesbar
nach `tools/flagged-words.json`; `tools/build-verification.ts` bildet daraus den Stand je Chunk.
Beides aus **demselben Lauf** — Bericht und App-Anzeige können nicht auseinanderlaufen.

**Was in der App steht:**
- Im Thema bekommt **nur die auffällige** Wendung ein Zeichen, samt Grund („selten belegt:
  provrummet"). Die anderen bekommen **keinen Haken** — ein Siegel an allen Wendungen wäre
  ein Versprechen, das die maschinelle Prüfung nicht decken kann.
- Im Fortschritt steht die ganze Wahrheit, inklusive der unbequemen Zeile
  **„0 muttersprachlich geprüft"**.

**Der Fehler, der beim Bauen auffiel:** Der erste Entwurf zählte auch uneinheitliche
Wort-für-Wort-Glossen als „ungeprüft" — und stufte damit **128 von 149** Wendungen ab, obwohl
der Inhalt gesund ist. Dasselbe schwedische Wort hat je nach Satz eine andere wörtliche
Entsprechung; genau das ist Kontextvariation. Kriterium gestrichen. (Dieselbe Lehre wie bei
Prüfung B in §4b: *Ein Prüfwerkzeug, das bei gesundem Inhalt Alarm schlägt, wird abgeschaltet.*)

**Wächter:** Fünf Tests in `seedContent.test.ts` — jede Wendung hat einen Stand, kein Stand
zeigt auf eine entfernte Wendung, nirgends steht `native`, jede ungeprüfte hat einen Grund,
und die Kennzahlen zählen dasselbe wie die Liste. Neuer Inhalt ohne `verify:build` lässt die
Kaskade also rot werden, statt still zu veralten.

---

## 6. Offen / nächste Schritte

- ~~Status-Feld am Inhalt + ehrliches Abzeichen in der App (Stufe 4).~~ **Gebaut 2026-07-25**, siehe §4c.
- Wortfolgen-Abgleich gegen ein echtes Korpus, sobald erreichbar (Korp/Språkbanken).
- Entscheidung zu `hej då` (siehe 4b) durch die menschliche Prüfung.

> **Anschluss:** menschliche Prüfliste `content-review-schwedisch.md` · Messung/Ehrlichkeit `07-measurement.md` · Content-Pipeline `08-content-pipeline.md` · offene Punkte `10-open-questions.md`.

---

## Nachtrag 2026-07-25 — eine Liste, die niemand liest, prüft nichts

Stufe 2 (Rückübersetzung) meldete **248 Glossen-Konflikte**. Formal korrekt,
praktisch wertlos: Fast jede Zeile war deutsche Beugung — `är` als
„ist/bin/bist/sind" ist Grammatik, kein Befund. Eine Verdachtsliste, in der ein
echter Fehler zwischen 240 Nicht-Fehlern steht, wird nicht durchgegangen. Damit
verfehlt sie ihren einzigen Zweck: die menschliche Prüfung klein genug zu machen,
dass sie stattfindet.

**Der Bericht sortiert jetzt in drei Tabellen:**

| | was drinsteht | Zahl |
|---|---|---|
| **C1 — zu prüfen** | verschiedene Bedeutungen, kein Funktionswort | **38** |
| **C3 — Funktionswörter** | `på` = auf/an/am/im/über/bei — der Unterschied zwischen zwei Sprachen | 35 |
| **C2 — nur Beugung** | „ist/bin", „der Bon/den Bon" | 157 |

Nichts verschwindet: Alle drei Tabellen stehen vollständig im Bericht. Es ändert
sich nur, unter welcher Überschrift eine Zeile steht — und damit, ob die Liste
lesbar ist.

**Was dabei sofort sichtbar wurde** (drei echte Fehler, die 248 Zeilen lang
unentdeckt waren):

1. `hej` in „hej då" war als **„tschüss"** glossiert. Wörtlich heißt es „hallo
   dann" — und genau diesen Abstand sichtbar zu machen, ist der ganze Zweck des
   Dekodierens.
2. **„Prov igen"** war kein Schwedisch. Der Imperativ von `prova` ist `prova`;
   `prov` ist das Substantiv.
3. `provet` stand als „die Prüfung", die deutsche Bedeutung daneben sagte „die
   Arbeit" — und „Arbeit" ist in dieser App schon `jobbet`.

Dazu 26 Wörter mit uneinheitlicher Glosse vereinheitlicht (kvittot, tycker, tid,
menyn, hemma …).

**Und ein Fehler im Prüfwerkzeug selbst**, gefunden beim Gegenlesen der eigenen
Änderung: Die Glossen werden vor dem Vergleich umlautgefaltet (ä→a), die
Beugungsfamilien standen ungefaltet da. „konnen" traf „können" also nie, und
`kan` (kann/kannst/können/könnt) landete als angeblicher Bedeutungs-Konflikt in
der Prüfliste. Drei Tests halten die Trennung jetzt fest — ein Klassifikator, der
zu großzügig wird, verschluckt echte Funde still.

---

## Nachtrag 2 (2026-07-25): von 38 auf 0 — und was die App jetzt selbst erklärt

Die 38 Zeilen aus Nachtrag 1 wurden einzeln durchgegangen. Beim Nachsehen im
echten Inhalt zerfielen sie in drei Gruppen — und die größte war überhaupt kein
Fehler.

### Vier echte Fehler

1. `vilse` war zweimal als **„irre"** glossiert. „Jag har gått vilse" heißt „ich
   habe mich verirrt"; „irre" heißt auf Deutsch verrückt. → „verirrt".
2. `täckning` stand dreimal als „Abdeckung", einmal als „Empfang". Die wörtliche
   Ebene bleibt „Abdeckung", die freie Übersetzung sagt „Empfang" — genau diese
   Trennung ist der Sinn der Dekodierung. → vereinheitlicht.
3. `trevligt` stand siebenmal als „nett", einmal als „angenehm". → „nett".
4. `hyr` in „hyr ut" war als **„vermietet"** glossiert, `ut` daneben als „aus" —
   wörtlich gelesen ergab das „vermietet aus". `hyra ut` ist ein Partikelverb:
   `hyr` = mietet, `ut` = aus. → „mietet".

### Drei Fälle deutscher Beugung, die das Werkzeug nicht sah

„sehen"/**„sieh"** und „wer"/**„wen"** teilen nur zwei Anfangsbuchstaben, die
Schwelle liegt bei drei. Statt die Schwelle zu senken (und damit echte Funde zu
verschlucken) wurden zwei Beugungsfamilien ergänzt. Bei der Gelegenheit fiel auf,
dass `ARTIKEL` die Familien über ihren **Index** ansprach — eine neue Zeile in
der Liste hätte still aus Artikeln Fürwörter gemacht. Jetzt über den Namen.

### Und der eigentliche Punkt: 29 Wörter waren nie ein Fehler

`kort` heißt wirklich „Karte" **und** „kurz". `mycket` heißt „viel" **und**
„sehr". `när` heißt „wann" **und** „wenn". Das ist kein Widerspruch im Inhalt,
das ist Schwedisch.

Für den Lerner sah es trotzdem aus wie einer: Er lernt eine Bedeutung, trifft
später die andere, und hält entweder die App für kaputt oder sich selbst für
vergesslich. Beides ist falsch, und beides kostet Vertrauen.

Statt eine Bedeutung zu erzwingen (und damit **falsch** zu werden), **sagt die
App es jetzt.** In der Dekodierung steht unter dem Satz:

> **kort** heißt hier „Karte" — es heißt auch „kurz". „med kort" ist mit Karte,
> „kort sagt" heißt kurz gesagt.

Gepflegt in `src/modules/content/polysemy.ts` (29 Wörter, jedes mit einem Satz,
woran man erkennt, welche Bedeutung gerade gilt). Der Hinweis hängt an der
Dekodierung — wer Wort-für-Wort-Hilfe zieht, bekommt sie ganz; wer ohne Krücke
liest, wird nicht zugetextet. Höchstens zwei Hinweise pro Satz.

**Die Behauptung wird gehalten, nicht geglaubt:** `polysemy.test.ts` prüft für
jedes Wort, dass es im Inhalt vorkommt und dort tatsächlich mit mehr als einer
Bedeutung glossiert ist. Ein erfundener Eintrag lässt den Lauf scheitern.

### Stand

| | vorher | jetzt |
|---|---|---|
| **C1 — ein Mensch muss ran** | 38 | **0** |
| **C1b — dem Lerner erklärt** | — | 29 |
| C3 — Funktionswörter | 35 | 35 |
| C2 — nur deutsche Beugung | 157 | 160 |

Ein Fehler im Anzeige-Filter kam noch heraus, gefunden vom eigenen Test: Die
Prüfung „ist das nur die gebeugte Form?" verglich Zeichenketten, und „also"
enthält „so" — bei `så` blieb an der Bedeutung „so" also nichts mehr zu sagen
übrig. Jetzt werden ganze Wörter verglichen.
