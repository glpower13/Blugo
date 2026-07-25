# Gremium — Die große Prüfung: fünf Prüfer, ein Tag

**Auslöser (Nutzer, 2026-07-25):** „Bei Notfällen im Dialog überlappen sich die
Bereiche. Geh nochmal Stück für Stück alle Seiten durch, alle Kontextmenüs, und
teste, wie sie angezeigt werden. Anschließend testen wir die App mit 50 Leuten
… so eine Mannschaft von 5 Agenten, die die ganzen Hinweise aufschreiben."

**Vorgehen:** Fünf voneinander unabhängige Prüfungen, alle **lesend** (kein
Prüfer durfte Code ändern, damit niemand seinen eigenen Befund wegräumt). Jeder
Befund musste **gemessen oder im Browser reproduziert** werden — Vermutungen
wurden ausdrücklich als solche gekennzeichnet und nicht behoben.

| # | Prüfung | Umfang | Befunde |
|---|---|---|---|
| 1 | **Ehrlichkeit der Zahlen** | jede angezeigte Zahl gegen ihre Rechnung | 4 schwere + 8 kleinere |
| 2 | **Darstellung bei großer Schrift** | 12 Konfigurationen (320–430 px × 16–24 px), 36 Flächen, ~5.900 Messungen | 6 |
| 3 | **Barrierefreiheit & Bedienung** | Tastatur, Vorlese-Programm, Kontrast an echten Pixeln, Tippflächen | 11 |
| 4 | **Text & schwedischer Inhalt** | alle Oberflächentexte, 179 Wendungen, 615 Zeilen, 15 Gespräche | 21 + 14 |
| 5 | **Dauerlauf** | 47 parallele Nutzer, 996 Bewertungen, 292 Sitzungen | 5 |

---

## 1 · Die Zahlen haben mehr behauptet, als sie gemessen hatten

Der schwerste Block, weil er die eine Design-Regel trifft. Vier Befunde, alle
im Browser nachgestellt, alle behoben — Einzelheiten in
`07-measurement.md`, Nachtrag 2026-07-25:

- **„reift" hing an einer Prognose.** Gezählt wurde das gerade neu *geplante*
  Intervall, angezeigt wurde „21 Tage überstanden". Im nachgestellten Fall:
  geplant 11 Tage, tatsächlich überstanden 3.
- **Ein Beweis blieb stehen, nachdem die App das Gegenteil gemessen hatte.**
  Nach einem späteren „Nochmal" zählte die Wendung weiter als *bewiesen stabil*.
- **„100 % Verständnis-Abdeckung" bei 3 von 179 angefassten Wendungen.**
- **Dreimaliges Scheitern lief unter „du verstehst sie."**

Dazu behoben: „fällig" zählte alle 179 nie gesehenen Wendungen mit (Rückstand,
wo keiner ist) · die Prüf-Warnung stand nur in der Themenliste, nicht dort, wo
gelernt wird · „Die Stimme kommt vom Gerät" war ein Versprechen, obwohl die
Auswahl notfalls auf eine Netz-Stimme fällt — jetzt steht der echte Zustand da ·
die KI-Knöpfe kosten Geld, das stand nirgends daneben · „aktiv" stand
typografisch so laut wie die gemessenen Zahlen und ist jetzt leiser · widerspricht
die Prüfung der Selbsteinschätzung, sagt die Fläche das offen.

**Was das Gremium bewusst NICHT geändert hat:** Die Selbsteinschätzung bleibt
beim Lerner. Ein Tippfehler ist kein Gedächtnisfehler, und die Prüfung ist nicht
unfehlbar — Autonomie schlägt hier Automatik. Ehrlich ist nicht, dem Lerner die
Entscheidung wegzunehmen, sondern ihm zu sagen, wogegen er gerade entscheidet.

---

## 2 · Die Überlappung des Nutzers hatte eine einzige Ursache

Der Prüfer hat zuerst seinen **eigenen** Fehler gefunden und gemeldet: Sein
erster Durchlauf lief faktisch mit 16 px, weil `document.documentElement` zum
Zeitpunkt des Setup-Skripts noch `null` ist. Und er hat 196 gemeldete
„Überlappungen" wieder verworfen — `getBoundingClientRect()` liefert bei
mehrzeiligem Text einen Hüllkasten über beide Zeilen. **Zeilenweise gemessen
gab es null echte Text-über-Text-Überlappungen.** Das ist der Umgang mit
Messfehlern, den dieses Projekt braucht.

Die echten Befunde teilten sich **eine Ursache**: `flex … justify-between` mit
einem Textkind ohne `min-w-0` neben einem `shrink-0`-Element. Der Text kann
nicht schrumpfen, also wird der Nachbar hinausgedrückt:

| Wo | Was passierte |
|---|---|
| Lern-Sitzung | „Langsam vorlesen" lag **70 px außerhalb** des Bildschirms — nicht antippbar |
| Sprechblase im Gespräch | „Hören" **63 px außerhalb**, von `overflow-hidden` abgeschnitten |
| Fortschritt | von drei Kennzahlen war **eine** sichtbar; „reift" und „stabil" fehlten ganz |
| Bereichskopf | „Notfall & Gesundheit" ragte 15 px über den Rand |

Behoben durch `flex-wrap` + `min-w-0` an genau diesen vier Stellen. Dazu: In der
Gesprächsliste wuchs das Sprech-Zeichen mit der Systemschrift mit und ließ der
Textspalte 58 px — Titel brachen mitten im Wort. Zeichen und Pfeil sind Beiwerk
und stehen jetzt in Pixeln; der Text darf wachsen.

**Nachgemessen nach der Reparatur:** kein waagerechter Scrollbalken auf keiner
Fläche in keiner der vier Konfigurationen. Was noch über den Rand ragt, sind
ausschließlich die dekorativen Hintergrund-Grafiken — die sollen das.

---

## 3 · Bedienbarkeit: die Tastatur führte ins Leere

Der härteste Befund war unsichtbar: Die Einstellungen waren nur ein
`<div class="fixed inset-0">`. Gemessen mit 42 Tabulator-Sprüngen landeten **15
hinter der zu 95 % deckenden Fläche** — der Fokusring war nicht zu sehen, aber
die Eingabetaste startete dort eine Lern-Sitzung *unter* dem offenen Fenster.
Escape schloss projektweit **nichts** (0 Treffer in `src/`).

Gebaut wurde ein gemeinsamer Baustein `ui/Overlay.tsx` (~60 Zeilen, kein
Fremdpaket) für alle drei Überlagerungen: `role="dialog"`, Fokus hinein und beim
Schließen zurück, Tabulator im Kreis, Hintergrund `inert`, Escape schließt. Zwei
E2E-Tests halten das fest — 30 Sprünge dürfen die Fläche nicht verlassen.

Weiter behoben:
- **Kontrast.** `text-faint` lag auf dem wandernden Aurora-Hintergrund bis
  hinunter auf **2,27:1** (Soll 4,5:1). Der Prüfer hat auch den Beweis für die
  Ursache geliefert: Auf der Einstellungen-Fläche mit deckendem Grund war
  **keine von 20** Textstellen zu schwach — es lag am Untergrund, nicht an der
  Schriftgröße. Beide Grautöne angehoben, das Glas deckender. Nachgemessen an
  echten Pixeln: **0 zu schwache Stellen** auf allen drei geprüften Flächen.
- **Tippflächen.** 37 Ziele unter 44×44 px, darunter das „✕" mit **13×24 px**.
  Durchgehend auf `min-h-11` gebracht.
- **Die Lern-Sitzung hatte 0 Überschriften** — für ein Vorlese-Programm kein
  Einstieg. Jetzt eine unsichtbare `h1`, dazu eine höfliche Ansage des Zählers.
- **Fokus nach Ansichtswechsel** stand auf `<body>`; jetzt auf der neuen Überschrift.
- **Die Überschrift der Startseite lag in einem Knopf** — ARIA wertet
  Knopf-Inhalte als darstellend, die Seite hatte damit faktisch keine `h1`.
- **WCAG 2.5.3** („Label in Name"): fünf Knöpfe hießen sichtbar anders als für
  die Sprachsteuerung. „Tippe auf Fertig" schlug fehl.
- **Fokus-Ring** ist jetzt eigen definiert statt vom Browser geerbt.

**Ausdrücklich gelobt und unverändert:** `prefers-reduced-motion` wird
vollständig respektiert (0 animierte Elemente im Kontext gemessen), kein
Bedienelement ohne zugänglichen Namen, keine Tastaturfalle, und **jeder**
schwedische Inhaltstext trägt `lang="sv"` — bei 1042 geprüften Zeichenketten
genau eine Lücke („Hej!" in der Begrüßung, behoben).

---

## 4 · Der Lernstoff hatte echte Fehler

Der Prüfer hat vorweggeschickt, dass er kein Muttersprachler ist, und jeden
Befund mit einer Sicherheit versehen. Er hat außerdem festgehalten, dass die
Grundlagen (V2-Inversion, bestimmte/unbestimmte Form, en/ett) im Korpus
**überwiegend korrekt** sind — er hat keine Fehler erfunden, um die Liste zu
füllen. Behoben wurde nur das Eindeutige; alles Unsichere steht als Frage in
`content-review-schwedisch.md`.

Die vier schwersten: die **BIFF-Regel** (`inte` stand im `att`-Nebensatz hinter
dem Verb) · **`hej` in „hej då" als „hallo" glossiert**, wörtlich also „hallo
dann" für „tschüss" · **neun Zeilen mit fehlender Glosse**, was die interlineare
Zuordnung verschiebt und dem Lerner die falsche Paarung beibringt · **`ni` als
„Sie"**, obwohl Schwedisch seit der du-Reform keine Höflichkeitsform hat — genau
die Gleichsetzung, die das Dekodieren verhindern soll.

Dazu **sechs Gespräche**, in denen die Antwort nicht zur Frage passte (im
Stadion nannte der Partner den Spielstand, danach fragte der Lerner „wie steht
es?"), und ein Gespräch, in dem der Partner eine Frage stellte und dann selbst
weitersprach — der Lerner kam nie zu Wort.

**Neuer Wächter:** `npm run check:decoding` läuft über alle 499 Zeilen und
scheitert bei jeder fehlenden Glosse. Was einmal gefunden wurde, darf nicht
zurückkommen.

Bei den **Oberflächentexten** war der Befund weniger dramatisch, aber
zahlreicher: „Was bedeutet „hur mår du?"?" mit zwei Fragezeichen · „Erfolgsband:
im Flow-Band" · „grün = fehlt", wo grün überall sonst „bewiesen" heißt · vier
Namen für den KI-Partner, fünf für den Zugang, drei für den Sprech-Knopf. Alles
auf je einen Begriff gebracht.

---

## 5 · Dauerlauf: die Maschine hält, der Ausgang war zu schmal

47 von 50 Nutzern liefen durch (der Prüfer meldet die drei fehlenden
ausdrücklich, statt sie zu verschweigen). **996 Bewertungen, 292 Sitzungen.**

**Was hielt:** null Konsolen-Fehler, null Seitenabstürze, null fehlgeschlagene
Anfragen — über 47 Nutzer und zwei Neubauten des Bundles hinweg. 47 von 47
behielten ihren Stand über das Neuladen. Jede Bewertung erzeugte genau einen
gespeicherten Eintrag. Keine unplausible Zahl, kein „NaN", kein springender
Zähler. „Bewiesen stabil" stand bei allen auf 0 und blieb dort — **korrekt**,
der Beweis braucht echte Pausen.

**Was auffiel:** ein harter Hänger auf 996 Bewertungen (0,1 %), nicht
reproduzierbar — bleibt ungeklärt und ist hier festgehalten, statt weggelassen
zu werden. Und der Sitzungsstart ist unter sechsfacher Last träge (Median
2,3 s, schlechtester Wert 4,2 s; ohne Last 0,3–1,0 s).

**Der Befund, der etwas geändert hat:** In Sitzung, Gespräch und Sparring ist
die Reiterleiste bewusst ausgeblendet — der Zurück-Knopf ist der **einzige**
Ausweg. Bleibt dort etwas hängen, sitzt der Nutzer fest. Escape führt jetzt aus
jeder dieser Flächen zurück auf „Heute". Eine zweite Tür kostet nichts.

---

## Was das Gremium daraus als Regel mitnimmt

1. **Ein Prüfer, der Code ändern darf, prüft nicht.** Alle fünf liefen
   ausdrücklich lesend. Zwei haben eigene Messfehler gemeldet — das wäre nicht
   passiert, wenn sie unter Erfolgsdruck gestanden hätten.
2. **Gemessen schlägt geprüft-mit-dem-Auge.** Die vier schwersten Befunde
   (Prognose statt Messung, verfallener Beweis, 2,27:1 Kontrast, 70 px außerhalb
   des Bildschirms) waren mit bloßem Hinsehen **unsichtbar**.
3. **Jeder behobene Befund bekommt einen Wächter**, sonst kommt er wieder:
   `check:decoding`, zwei E2E-Tests für Tastatur und Überschriften, sechs
   Unit-Tests für die neuen Messregeln.
4. **Unsicheres wird nicht behoben, sondern aufgeschrieben.** Die schwedischen
   Zweifelsfälle stehen als Fragen an die muttersprachliche Prüfung — eine
   geratene Korrektur wäre schlimmer als der Ist-Zustand, weil sie sich als
   geprüft ausgäbe.
