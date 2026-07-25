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
| **Wörterbuch** (Hunspell `dictionary-sv`, ~154.000 Einträge) | Rechtschreibung, gültige Wortform, å/ä/ö | Idiomatik | **stark**, aber eng |
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
- `dictionary-sv` (npm, devDependency) — Hunspell-Wörterbuch, ~154.000 Einträge.

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

## 5. Was damit ausdrücklich NICHT bewiesen ist

- **Wortstellung und Satzbau.**
- **Idiomatik** — ob ein Kellner in Stockholm wirklich `Vad får det lov att vara?` sagt.
- **Register** (Du/Sie, Höflichkeitsgrad) über eine Szene hinweg.
- **Die Birkenbihl-Dekodierungen** — Wort-für-Wort-Glossen stehen in keinem Korpus.

Deshalb bleibt Stufe 3 nötig. Der Gewinn ist nicht, sie zu ersetzen, sondern sie
**klein genug zu machen, dass sie tatsächlich passiert**.

## 6. Offen / nächste Schritte

- Status-Feld am Inhalt + ehrliches Abzeichen in der App (Stufe 4).
- Rückübersetzungs-Prüfung (Stufe 2).
- Wortfolgen-Abgleich gegen ein echtes Korpus, sobald erreichbar (Korp/Språkbanken).
- Kompakte Restliste für die menschliche Prüfung erzeugen.

> **Anschluss:** menschliche Prüfliste `content-review-schwedisch.md` · Messung/Ehrlichkeit `07-measurement.md` · Content-Pipeline `08-content-pipeline.md` · offene Punkte `10-open-questions.md`.
