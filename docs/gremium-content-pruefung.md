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
| `machine` | jedes Wort ist belegtes Schwedisch (Wörterbuch 152.719 Einträge + Korpushäufigkeit) | 146 |
| `unchecked` | mindestens ein Wort ist selten oder unbelegt | 3 |

**Wie es entsteht:** `check-swedish.py` schreibt seine Urteile jetzt zusätzlich maschinenlesbar
nach `tools/flagged-words.json`; `tools/build-verification.ts` bildet daraus den Stand je Chunk.
Beides aus **demselben Lauf** — Bericht und App-Anzeige können nicht auseinanderlaufen.

**Was in der App steht:**
- Im Thema bekommt **nur die auffällige** Wendung ein Zeichen, samt Grund („selten belegt:
  provrummet"). Die anderen 146 bekommen **keinen Haken** — ein Siegel an 146 Wendungen wäre
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
