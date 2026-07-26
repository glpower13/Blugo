# ISTQB-Testbericht — Modul „Messung" (Metrics + Memory-Engine + Overlay)

**Datum:** 2026-07-25 · **Anlass:** vollständiger Durchlauf der Prüfkaskade A–G
(`docs/TEST-UND-PRUEF-STANDARD.md`) auf Bitte des Nutzers.
**Stehende Regel §1:** Nach einem Gremiums-/Prüflauf gehört der ISTQB-Durchlauf
fest dazu — der 5-Agenten-Lauf vom selben Tag hat ihn ausgelöst.

**Ergebnis:** **kein offenes P1.** Zwei P1 wurden im Lauf gefunden, im Browser
bzw. im Testlauf reproduziert, behoben und mit Tests festgehalten. Ein P2 und
zwei P3 ebenfalls behoben. Eine inhaltliche Frage geht ungelöst an
`docs/10-open-questions.md`, statt sie still zu entscheiden.

---

## 1. Risikobasierte Priorisierung

Was tut am meisten weh, wenn es falsch ist? In dieser App ist das nicht der
Absturz, sondern die **falsche Zahl** — das Produkt ist die Behauptung „was du
siehst, hast du wirklich gekonnt".

| Rang | Risiko | Warum es oben steht | Abdeckung |
|---|---|---|---|
| R1 | Eine Kennzahl behauptet mehr, als gemessen wurde | Bricht die eine Design-Regel; der Nutzer optimiert dann den Indikator | BVA + Entscheidungstabelle + 10 000-Fälle-Fuzzing |
| R2 | Stiller Lernstandverlust (Zusammenführen, Sicherungsdatei) | Monate Arbeit weg, ohne Meldung | Fault-Injection (11 Beschädigungsarten) + Verlustfreiheits-Gesetz |
| R3 | Die App ist mit Tastatur/Vorlese-Programm unbedienbar | Schließt Menschen aus; fällt beim Sehen nicht auf | E2E-Fokusfang + Tipp-Test + Überschriften-Test |
| R4 | Ein Wächter läuft nicht mehr mit | Ein Fehler kehrt unbemerkt zurück | `npm run verify` + CI |
| R5 | Terminplanung driftet über Zeitzonen/Kalender | Falsche Fälligkeit = falsche Messung | Kalender-Grenzfälle |

---

## 2. Angewandte Techniken

### 2.1 Grenzwertanalyse (BVA)

Beide Schwellen des Produkts sind `>=`. Ein `>` an einer der Stellen wäre ein
Fehler, den kein Beispieltest mit „50 Tagen" je bemerkt. Je drei Punkte geprüft:

| Schwelle | genau darunter | genau auf | knapp darüber |
|---|---|---|---|
| `MATURING_INTERVAL_DAYS` = 21 | kein Vermerk ✓ | Vermerk ✓ | Vermerk ✓ |
| `STABLE_INTERVAL_DAYS` = 90 | kein Vermerk ✓ | Vermerk ✓ | Vermerk ✓ |

Zusätzlich: Intervall 0, −1, −1000 → kein Vermerk ✓ · Intervall 100 000 → endlich
und wohldefiniert ✓.

### 2.2 Entscheidungstabelle

Neun Kombinationen aus **Ergebnis × Stufe × überstandenem Intervall**, alle
geprüft (`measurement.istqb.test.ts`). Die vier, die eine Aussage tragen:

| Ergebnis | Stufe davor | Intervall | reift | bewiesen |
|---|---|---|---|---|
| good | production | 120 | nein | **ja** |
| good | production | 30 | **ja** | nein |
| good | **recognition** | 120 | nein | nein |
| **hard** | production | 120 | nein | nein |

Die dritte Zeile ist der Anti-Goodhart-Kern: Wiedererkennen zählt nie, egal wie
lang die Pause war. Die vierte hat eine ungeschriebene Produkt-Eigenschaft
sichtbar gemacht — siehe §6.

### 2.3 Zustandsübergangs-Tests

| Übergang | erlaubt? | geprüft |
|---|---|---|
| neu → Wiedererkennen → Produktion (2 Erfolge) | ja | ✓ |
| Produktion → Wiedererkennen (Fehlschlag, Rückstufung) | ja | ✓ |
| Fehlschlag hebt die Stufe an | **nein** | ✓ bleibt unten |
| Historie schrumpft | **nein** | ✓ wächst über 10 Schritte streng |
| Ein gesetzter Vermerk fällt auf null zurück | **nein** | ✓ bleibt in den Daten, wird nur nicht mehr angezeigt |
| Status fällt zurück auf „neu" | **nein** | ✓ über 12 Schritte |

### 2.4 Property-Fuzzing (Stufe G)

10 000 zufällige, aber deterministisch erzeugte Abrufverläufe je Gesetz
(`stability.test.ts`, xorshift32 mit festem Startwert — ein roter Lauf muss
reproduzierbar sein):

- kein Zustand wird je NaN, negativ oder unendlich
- „bewiesen" und „reift" überschneiden sich nie (sonst liefe der Balken über 100 %)
- ein Beweis gilt nie, wenn ein späterer Fehlschlag danebensteht
- kein Vermerk ohne tatsächlich überstandene Pause in Produktion
- die vier Richtungs-Eimer ergeben immer genau die Gesamtzahl
- `dueNow ⊆ active`, `coverage ∈ [0,1]`, `stable + maturing ≤ n`

### 2.5 Fault-Injection

11 Beschädigungsarten der Sicherungsdatei (leer, abgeschnitten, fremde App,
`null`, Array, Zahl, Version aus der Zukunft, Zustände als Müll …). Jede muss
**abbrechen** und eine Meldung liefern, die ein Mensch versteht — geprüft wird
ausdrücklich, dass kein „unexpected token" durchschlägt.

### 2.6 Statische Prüfung (adversariales Review)

Der Diff der letzten sechs Commits feindlich gelesen. Hier kamen die beiden P1
her — **nicht** aus dem strukturierten Testdesign. Das ist ein Befund über die
Methode selbst und steht so in §7.

---

## 3. Bug-Log

### P1-1 · Fokus springt beim Tippen aus dem Feld

**Datei:** `src/ui/Overlay.tsx:86` (vor der Reparatur) · **Schwere:** P1 ·
**Status:** behoben, Test `e2e/loop.spec.ts` „Fokus bleibt beim Tippen im Feld".

`useEffect(..., [onClose])`. Alle drei Aufrufstellen (`App.tsx:823, 828, 838`)
übergeben eine Inline-Funktion — neue Identität bei jedem Rendern. Der
Aufbau-Effekt lief damit bei **jedem** Rendern der Elternfläche erneut und setzte
den Fokus jedes Mal auf das erste Bedienelement zurück.

**Reproduktion (im Browser gemessen):** Einstellungen öffnen → ins Feld
„Vorname" klicken → „Andreas" tippen.
**Vorher:** nach dem ersten Zeichen liegt der Fokus auf „Fertig"; im Feld steht
`"A"`. **Nachher:** im Feld steht `"Andreas"`, Fokus bleibt im Feld.

**Ursache im Kleinen:** eine Abhängigkeitsliste, die eine Identität statt eines
Werts beobachtet. **Fix:** `closeRef` + Aufbau-Effekt mit `[]`.

### P1-2 · „reift" ist nach einem Fehlschlag nie wieder erreichbar

**Datei:** `src/modules/memory/memoryEngine.ts:141-144` · **Schwere:** P1 ·
**Status:** behoben, Tests in `memoryEngine.test.ts` („beide Nachweise sind
wieder erreichbar").

`maturedAt` hielt den **ersten** Nachweis fest (`state.maturedAt ?? now`). Nach
einem Fehlschlag lag dieser Zeitpunkt für immer **vor** `lapsedAt`, und
`stillHolds()` gab dauerhaft `false` zurück. Der strenge 90-Tage-Beweis
erneuerte sich (`? now :`), der weiche nicht — genau verkehrt herum.

**Reproduktion (Testlauf):** 30-Tage-Pause in Produktion überstanden → `reift`
✓ · Fehlschlag → `reift` ✗ (richtig) · zurück auf Produktion, erneut 40 Tage
überstanden → **`reift` immer noch ✗** (falsch).
**Nachher:** `reift` ✓, `maturedAt > lapsedAt`.

**Warum es schwer wiegt:** Der 21-Tage-Vermerk existiert genau deshalb, damit
sich die Anzeige nach Wochen bewegt statt nach Monaten. Ein einziger Durchfaller
hätte ihn dauerhaft entwertet.

### P2-1 · Die Inhalts-Wächter liefen nicht in CI

**Datei:** `.github/workflows/ci.yml` · **Status:** behoben.

CI fuhr `typecheck`, `lint`, `test`, `test:e2e` — aber **nicht**
`check:content`, `check:decoding`, `check:backtranslation`, `verify:build`. Der
Dekodierungs-Wächter, am selben Tag gebaut, hätte nie einen Build rot gemacht.
§2 C verlangt ausdrücklich **einen** Befehl, der immer komplett läuft: das ist
jetzt `npm run verify`. Neu dazu: `check:generated` bricht ab, wenn der
eingecheckte Prüf-Stand veraltet ist (nachgewiesen: absichtlich verändert →
Abbruch mit Klartext; zurückgesetzt → grün).

### P3-1 · Die E2E-Dateien wurden nie typgeprüft

**Datei:** `tsconfig.json` · **Status:** behoben (`tsconfig.e2e.json`).

`e2e/**` stand in keinem `include`. Ein Typfehler dort fiel erst beim
Playwright-Lauf auf, Minuten statt Sekunden später. **Nachgewiesen:** eine
Sonde mit `const n: number = 'text'` wird jetzt vom Typecheck gefangen; nach
dem Löschen wieder grün.

### P3-2 · Zwei Rechenquellen für „begonnen"

**Datei:** `src/modules/progress/categories.ts:31` · **Status:** behoben.

`isActive` stand wortgleich in `metrics.ts` **und** `categories.ts`. §3.3
verbietet das ausdrücklich: eine Änderung an einer Stelle hätte die
Themen-Zählung stumm von der Gesamtzahl abweichen lassen. Jetzt exportiert
`metrics.ts` die eine Fassung.

### P3-3 · Die Inhalts-Prüfung lief ohne Wörterbuch weiter

**Datei:** `tools/check-swedish.py:122` · **Status:** behoben (fail-closed).

Fehlte `dictionary-sv`, gab `find_dictionary()` eine leere Menge zurück und die
Prüfung lief durch. Der Bericht meldete dann „0 Einträge" — und die App zeigt
diese Zahl im Ehrlichkeits-Abschnitt an („gegen ein Wörterbuch mit N
Einträgen"). Eine Prüfung behaupten, die nicht stattgefunden hat, ist genau der
Fehler, gegen den dieses Projekt gebaut ist. Jetzt bricht der Lauf ab.

### P3-4 · Reiterwechsel wurde nicht angesagt

**Datei:** `src/App.tsx:573` · **Status:** behoben.

Ein Reiterwechsel läuft bewusst nicht über `navigate()` (sofort, ohne
Überblendung) — damit lief dort auch `focusNewView()` nicht, und ein
Vorlese-Programm meldete den Wechsel gar nicht. Dasselbe beim Wischen. Statt den
Fokus zu stehlen (der gehört bei Reitern auf den Reiter) sagt jetzt eine höfliche
Ansage, wo man gelandet ist.

---

## 4. Rückverfolgbarkeit

| Anforderung (`07-measurement.md`) | Test |
|---|---|
| „stabil" nur nach echtem langem Intervall, nie nach Massenwiederholung | `measurement.istqb.test.ts` A1 (10× am selben Tag → kein Beweis) |
| Keine Metrik belohnt reine Anwesenheit | A2 (unberührte Wendung → keinerlei Fortschritt) |
| Sprechen ist ein zweiter Weg zum selben Beweis, kein leichterer | A3 (gesprochen ≡ getippt in Termin, Intervall, Beweis) |
| Beweis nur in der Produktions-Richtung | Entscheidungstabelle Zeile 3 |
| Die zwei Balken-Zonen überschneiden sich nie | Fuzzing-Gesetz 2 (10 000 Fälle) |
| Ein Beweis, dem ein Fehlschlag folgt, zählt nicht mehr | Fuzzing-Gesetz 3 + `metrics.test.ts` |
| „fällig" ist Wiederholung, nicht Vorrat | `metrics.test.ts` „zählt nie begegnete Wendungen NICHT als fällig" |
| Kein stiller Datenverlust bei Import | Fault-Injection, 11 Fälle |

---

## 5. Stabilitätsurteil

**Das Modul „Messung" ist stabil genug für den Weiterbetrieb.**

- 306 Unit-Tests grün, davon 54 in diesem Durchlauf neu (28 Stabilität, 26 ISTQB).
- 22 E2E-Tests grün, davon 3 aus diesem und dem vorigen Lauf neu.
- Alle Wächter laufen ab jetzt in einem Befehl und in CI.
- Kein offenes P1.

**Was dieses Urteil NICHT abdeckt** (ehrlich benannt, §0.3): Last über Prozesse,
Nebenläufigkeit mehrerer Geräte auf demselben Datensatz, Security-Probe, Backup
→ Katastrophe → Restore, Dauerlast-Soak. Diese Teile von Stufe G brauchen ein
Backend, das es hier nicht gibt. Sie sind im Adapter §8 als offen vermerkt und
nicht stillschweigend abgehakt.

---

## 6. Nachtrag 2026-07-25 — die „Fast"-Frage, geklärt

Der Bericht hatte oben festgehalten: „Fast" führe nie zum Beweis und bestrafe
damit ehrliche Selbsteinschätzung. **Diese Formulierung war zu scharf**, und der
Grund steht eine Ebene tiefer im Code.

`gradeTyped` (`answerCheck.ts:40`) schlägt „Fast" vor, wenn die Antwort **bis zu
zwei Zeichen daneben** liegt; „Sitzt" nur bei exaktem Treffer. In der
Produktions-Stufe heißt „Fast" also nicht „ich habe gezögert", sondern **„war
nicht ganz richtig"**. Dass daraus kein Beweis wird, ist genau richtig — und im
Wiedererkennen stellt sich die Frage gar nicht, weil dort ohnehin nichts
bewiesen werden kann.

**Was übrig blieb, war ein schmaler, aber echter Fall:** exakt richtig getippt
und aus Gewissenhaftigkeit trotzdem „Fast" gedrückt. Da hing der Beweis am
Knopf statt an der Messung — und Aufrunden wurde belohnt. Das ist ein Anreiz,
sich besser darzustellen, als man ist, also derselbe Goodhart-Fall, gegen den
diese App gebaut ist.

**Entscheidung:** Messung und Terminplanung werden getrennt.

| | Quelle | Wirkung |
|---|---|---|
| **Ob der Abruf gelungen ist** | die Prüfung der Eingabe (`ReviewMeta.exact`) | entscheidet über den Beweis |
| **Wie sicher es sich anfühlte** | der Knopf des Lerners | entscheidet über den nächsten Termin |

Der Beweis wird dadurch **nicht weicher**: Er verlangt weiterhin einen exakten
Produktions-Abruf nach einer tatsächlich überstandenen langen Pause. Nur die
Quelle der Aussage „exakt" ist jetzt die Prüfung statt der Knopf. Fünf Tests in
`measurement.istqb.test.ts` halten das fest — darunter, dass „Fast" **ohne**
objektiven Treffer weiterhin nichts beweist und ein Fehlschlag auch mit
`exact` nichts beweist.

---

## 7. Was der Durchlauf über die Methode gelernt hat

**Das strukturierte Testdesign hat keinen der beiden P1 gefunden.** BVA,
Entscheidungstabelle und Zustandsübergänge waren beim ersten Lauf vollständig
grün. Beide P1 kamen aus dem **adversarialen Lesen des Diffs** (Stufe E) — der
eine aus „diese Abhängigkeitsliste beobachtet eine Identität", der andere aus
„dieser Ausdruck erneuert sich, jener nicht, warum eigentlich".

Daraus zwei Konsequenzen:

1. **E ist nicht der Vorlauf zu F, sondern die Stufe mit der höchsten Ausbeute.**
   ISTQB deckt die Randklassen ab, die man *kennt*; das feindliche Lesen findet
   die, die man nicht kennt. Beide werden gebraucht, aber E darf nie ausfallen,
   wenn es eng wird.
2. **Was strukturiertes Design leistet, ist etwas anderes: Es hält fest.** Die 26
   ISTQB-Fälle haben heute nichts gefunden — aber sie sind ab jetzt die Wand, an
   der eine künftige Änderung an den Schwellen scheitert. Ihr Wert liegt in der
   Zukunft, nicht in diesem Bericht.
