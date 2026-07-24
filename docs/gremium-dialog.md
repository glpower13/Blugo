# Gremium — Dialog-Modus & „geliehene Optik" (Stufe-D-Beratung)

> **Ehrlicher Rahmen:** rollenbasierte Beratung (Stufe D), Fach-*Perspektiven*, keine echten Personen, keine erfundenen Zitate. Auftrag (Nutzer 2026-07-24): zwei Vorbild-Apps prüfen (Mondly-artige **Dialoge**; ein Habit-Screen mit **Punkten/„Aura"/Wochenziel**), Ideen als **premium Vorschau** zeigen, dann umsetzen — „was du unten rauslassen willst, lass raus". Diese Notiz hält die Entscheidung fest, bevor/während sie in den Code wandert.

---

## 0. In einfachen Worten

Wir bauen einen **Dialog-Modus**: ein echtes Alltagsgespräch (Restaurant, Hotel, Weg), das dich führt — **hören → verstehen → selbst antworten**. Der Stoff sind deine vorhandenen Wendungen, jetzt im zusammenhängenden Kontext. Zusätzlich leihen wir uns die *ruhige Optik* eines Fortschritts-Rings — aber die Zahl darin bleibt **wahr**. Die Punkte-/„Aura"-/Wochenziel-Mechaniken lassen wir bewusst **weg**.

## 1. Die drei Urteile (mit Evidenz)

| Idee | Urteil | Warum | Evidenz |
|---|---|---|---|
| **Dialog-Modus** (Szenen-Gespräch) | ✅ **übernehmen** | Verständlicher Input im Kontext + echte Produktion am Antwort-Schritt. Passt genau auf den Bereich-Baum. | Comprehensible Input **[Fels]**, Output/Interaktion **[stark]**, Testing-Effekt **[Fels]** |
| **Hör-zuerst + Szenenbild** | ✅ **übernehmen** (Teil des Dialogs) | Erst Klang, dann Text/Bild aufdecken → Bedeutung über Ohr + Kontext, ohne sofortige Übersetzung. | Hören-zuerst **[stark]**, Dual Coding **[stark]** |
| **Fortschritts-Ring** (Optik des Habit-Screens) | ◐ **nur Optik leihen** | Die ruhige Ring-Anmutung ja — aber der Ring zeigt **bewiesen stabil / gesamt**, kein erfundenes „66 % Wochenziel". | Messung: `07-measurement.md` |
| **Punkte · „Aura" · Krone · Streak · Shop · Bestenliste** | ✕ **ablehnen** | Belohnungen, die sich vom echten Können abkoppeln → man optimiert den Zähler statt die Sprache (Goodhart). | CLAUDE.md „die eine Design-Regel" + Anti-Ziele |

## 2. Wie der Dialog die Design-Regel wahrt

Eine **„du"-Zeile** referenziert einen echten Chunk (`chunkId`) und speist beim Bewerten **dieselbe Memory-Engine** wie der normale Loop (`schedule` → `putChunkState`/`logEvent`, Kontext-ID `dialog:<id>:<turn>`). Fortschritt aus einem Gespräch ist also **echtes, gemessenes Können** — kein separater Schein-Zähler. Vorschläge und korrektives Feedback sind abschaltbare Krücken und werden als `helpUsed` ehrlich markiert. Die korrekte Form steht vorher fest → die KI **erklärt** nur („Warum?"), sie erfindet keinen Fehler (Falsch-Korrektur-Schutz, `gremium-feedback.md`).

## 3. Konkret gebaut (erste Scheibe)

1. **Datenmodell:** `src/domain/dialog.ts` (`Dialog`, `DialogTurn` mit `speaker` partner/you, `chunkId`, `suggestions`, `listenFirst`).
2. **Inhalt (Seed, nicht muttersprachlich geprüft):** `seedDialogs.ts` — 3 Szenen: **Im Restaurant** (cat-restaurant), **Im Hotel** (cat-hotel), **Nach dem Weg fragen** (cat-around). Jede „du"-Zeile = ein vorhandener Chunk; Integritäts-Test bewacht das.
3. **View:** `src/modules/dialog/DialogScene.tsx` — Chat mit Partner-Zeilen (hören/aufdecken/dekodieren, Hör-zuerst) und „Du bist dran"-Zeilen (Vorschläge → tippen → prüfen → ehrlich bewerten, „Warum?" bei Cloud-KI). Dezente Szenen-Stimmung (Dual Coding, edel — kein Clipart).
4. **Einstieg:** im Thema-Detail (`CategoryDetail`) als „Im Gespräch üben"; neue View `dialog` in `App.tsx`, richtungsabhängige Übergänge, Zurück zum Thema.
5. **Ring:** `src/modules/progress/MemoryRing.tsx` — auf der Übersicht, füllt sich auf **bewiesen stabil / gesamt** (Mint = Wahrheitsfarbe). Reduced-motion-fest.

## 4. Bewusst (noch) NICHT

- Kein XP/Aura/Streak/Krone/Shop/Bestenliste (Anti-Ziele, Regel).
- Keine freie KI-Chat-Konversation mit Live-Bewertung (Falsch-Korrektur-Risiko) — erst, wenn die Bewertung sicher an bekannten Zielen verankert bleibt.
- Kein „Level-Abschluss" pro Szene; der Erhalt-Rhythmus (FSRS) bleibt der Takt.

## 5. Offen

- Mehr Szenen je Bereich (Einkaufen, Notfall, Café-Small-Talk); Verzweigungen (mehrere gültige Antworten).
- Natürlicheres schwedisches TTS als Web-Speech (Anforderung, `05-architecture.md`).
- Szenenbild: aktuell dezenter Farb-Schimmer; später evtl. echte, ruhige Illustration (offline-sicher, edel).

## 6. Nachtrag 2026-07-24 — Wayfinding v2 (Orientierung sichtbar machen)

**Auftrag (Nutzer):** „Man muss sehen, in welchem Ast man ist — und farblich, ob ich im
Dialog oder im normalen Modus bin. Das muss premium wirken, nicht wie aus Versehen."
Nach einer v1-Vorschau (zu viele bunte Tupfer → „gemacht") entschied das Gremium **v2: Ruhe
schafft Orientierung**.

Gebaut:
1. **Icon + Farbe je Bereich** (`src/ui/areaTheme.tsx`, `areaVisual()`): jeder Bereich hat
   ein feines Icon (Spross/Flieger/Tasse/Leute/Tasche/Kreuz) + eine gedämpfte Kennfarbe.
   Reine Präsentation, kein Domänen-Modell; Fallback für neue Bereiche.
2. **Leiser Bereichs-Schimmer** (`AreaWash`) am oberen Rand jeder Detail-Ansicht — die Farbe
   liegt zart über dem Screen, **nicht** als Sticker auf jeder Karte (Restraint = premium).
3. **Kontextueller Kopf** statt Web-Brotkrumen: Icon + Bereichsname (in Farbe) + großer Titel;
   der Zurück-Knopf **benennt** die Ebene darüber und trägt die Farbe.
4. **Modus-Abzeichen:** „● Gespräch" (Teal, Chat-Icon) im Dialog vs. „◎ Üben" (Gold, Ziel-Icon)
   im normalen Loop — der Modus ist auf einen Blick klar.
5. **Wahrheits-Farbe bleibt konsistent:** der „bewiesen stabil"-Balken/Ring ist überall Mint —
   Bereichsfarben orientieren nur, sie belohnen nichts (die eine Design-Regel). Gold nur für Aktionen.

**Laden schneller & stabiler:** `AiSettings` und `DialogScene` werden per `React.lazy` erst bei
Bedarf geladen (kleineres Startbündel), ein Shimmer-Lade-Gerüst ersetzt den „weißen Blitz", und
eine `ErrorBoundary` fängt Render-Fehler mit „Neu laden" ab (nie eine weiße Seite).

**Copyright:** dezente Fußzeile „© 2026 Andreas Fink · neurolang" (voller Name als
Rechteinhaber, Nutzerentscheidung).

## 7. Nachtrag 2026-07-24 — Namens-Personalisierung

**Auftrag (Nutzer):** „Vorne in der App den Namen eintragen und im Dialog beim Üben mit
dem Vornamen angesprochen werden."

**Urteil des Gremiums: bauen — und zwar nicht nur als Gimmick.** Persönlich relevanter
Input wird nachweislich besser behalten (**Selbstbezugs-Effekt, Evidenz: stark**). Wenn
der Kellner „Hej Andreas, välkommen!" sagt, ist die Situation echter → besseres Encoding.

**Bricht es die eine Design-Regel?** Nein. Der Name ist **keine Belohnung und keine Zahl** —
er personalisiert nur den *Input*. Es entsteht kein Indikator, der vom Können abkoppeln könnte.

Gebaut:
1. **`src/session/profile.ts`** — Vorname lokal (localStorage + In-Memory-Fallback), `cleanName()`
   (getrimmt, einzeilig, max. 24) und `fillName()`: ersetzt `{name}`; **ohne** Namen wird der
   Platzhalter *samt* führendem Leerzeichen entfernt, damit der Satz natürlich bleibt
   („Hej {name}, välkommen!" → „Hej, välkommen!").
2. **`src/ui/NameEditor.tsx`** — kleines, edles Overlay; erklärt, dass der Name auf dem Gerät bleibt.
3. **Übersicht:** Einstieg „＋ Dein Name", danach die Begrüßung „Hej, *Andreas*! ✎" (antippbar zum Ändern).
4. **Gespräch:** Partner-Zeilen tragen `{name}` in **Anrede/Gruß** (Restaurant r1/r10, Hotel h1/h9,
   Weg w2) — bewusst nie mitten im schwedischen Satz, sonst klänge es holprig. Auch die
   Sprachausgabe liest den personalisierten Satz.

**Leitplanke (Tests):** `{name}` darf **nie** in einer „du"-Zeile oder ihren Vorschlägen stehen —
sonst hinge die geprüfte Antwort am Namen. Zwei Integritäts-Tests erzwingen das (+ `sv`/`de` nutzen
den Platzhalter konsistent), dazu Unit-Tests für `cleanName`/`fillName` und ein e2e-Durchlauf.

## 8. Nachtrag 2026-07-24 — Szenenbilder (aus §5 „Offen" eingelöst)

Bisher trug nur ein Farbschimmer die Szene. Jetzt gibt es eine **gezeichnete Kulisse**
je Szene (`src/ui/SceneArt.tsx`) — dieselbe Bildsprache wie der Nordlicht-Hintergrund:
**SVG** (offline-sicher, gestochen scharf, ~4 kB für alle Szenen zusammen), feine
Linien und Silhouetten in der **Kennfarbe des Bereichs**.

Motive: **Café** (Fensterfront, Hängelampen, Tresen, Tasse mit Dampf) · **Hotel**
(Bogenfenster mit Vorhängen, Rezeptionstresen, Tischlampe, Empfangsklingel) ·
**Bahnhof** (Bahnsteigdach, Säulen, fluchtende Gleise, Bahnhofsuhr) · **Geschäft**
(Markise, Regale, Preisschild) · **neutral** (ruhige Bögen).

**Zwei verworfene Fassungen — und was sie gelehrt haben (Nutzer-Feedback):**
1. *Zarte Linien hinter dem Text.* Dezent, aber der Titel verlor die Schärfe. Verworfen.
2. *Vignette oben rechts, blass.* Rückmeldung des Nutzers: **„die sind sehr schlecht,
   man muss sie vernünftig erkennen."** Zu Recht — ein Bild, das man **nicht erkennt**,
   kann die Situation auch nicht stützen; der ganze Dual-Coding-Nutzen verpufft, und
   übrig bleiben zufällig wirkende Striche. Verworfen.

**Jetzt (dritte Fassung):**
- **Eigenes Bildband** am Kopf der Karte (volle Breite, feste Höhe). Das Bild bekommt
  echten Platz — und der Text darunter bleibt vollständig unbehelligt. Kein Kompromiss
  mehr zwischen „sichtbar" und „lesbar", weil beide ihre eigene Zone haben.
- **Gefüllte Silhouetten in Tiefenebenen** (Himmel → Kulisse → Vordergrund) statt
  dünner Striche — das macht die Form auf einen Blick lesbar.
- **Ein unverwechselbares Hauptmotiv je Szene:** Tasse · Zug · Empfangsklingel · Einkaufstüte.

**Warum überhaupt Bild:** Bedeutung über Ohr **und** Auge (Dual Coding, Evidenz: stark)
— das Bild deutet die Situation an, statt sie zu übersetzen. Es bleibt bewusst
zurückhaltend: **nie Inhalt, immer nur Atmosphäre** (die eine Design-Regel).

## 9. Nachtrag 2026-07-24 — fünf weitere Szenen + Mikro-Bewegung

**Inhalt (aus §5 „Offen"):** jetzt **8 Gespräche** statt 3. Neu: **Im Café** (bestellen
und zahlen) · **Im Geschäft** (anprobieren und kaufen) · **Im Supermarkt** (finden und
zahlen) · **Beim Arzt** (sagen, was weh tut) · **Am Schalter** (Ticket kaufen).
Damit hat jeder Bereich außer „Menschen & Alltag" mindestens ein Gespräch.

Wie gehabt: jede **„du"-Zeile ist ein vorhandener Chunk** — die Integritäts-Tests
erzwingen das, also fließt auch der neue Stoff in dieselbe Memory-Engine. Neue
Kulisse **`clinic`** (Kreuz-Schild, Medikamenten-Regal, Hauptmotiv **Stethoskop**).
Alle Partner-Zeilen sind **nicht muttersprachlich geprüft** (`content-review-schwedisch.md`).

**Mikro-Bewegung (aus der Design-Liste):**
- Eine neue Zeile **gleitet von ihrer Seite herein** (Gesprächsperson von links, deine
  Antwort von rechts) — das Gespräch *baut sich auf*, statt zu springen.
- Das **Szenenbild blendet ruhig auf** (0,9 s, leichter Zoom-out) — Atem, kein Zappeln.
- Beides respektiert `prefers-reduced-motion`: dann ist alles sofort da, ohne Bewegung.

## 10. Nachtrag 2026-07-24 — aus Piktogrammen werden Bilder

Rückmeldung zur zweiten Fassung: **„schäbige Mini-Darstellung — mach mal was
Vernünftiges."** Zutreffend: es waren *erkennbare Icons*, aber keine Bilder. Ein
einzelnes freistehendes Objekt auf einer Fläche erzählt keinen Ort.

**Was ein Piktogramm von einem BILD unterscheidet — die vier Hebel:**
1. **Tiefe.** Vier Ebenen mit Luftperspektive: fern blass und kühl, nah fast schwarz.
   Vorher lag alles auf einer Fläche.
2. **Licht.** Lampen werfen Kegel, auf Tresen und Boden liegen Lichtpfützen,
   Fensterflächen leuchten. Erst dadurch wirkt ein Raum bewohnt.
3. **Menschen.** Eine Silhouette macht aus einer Kulisse einen **Ort, an dem gerade
   jemand steht und mit dir spricht** — der mit Abstand größte Sprung. Jede Figur
   bekommt Gegenlicht, sonst verschwindet sie im Dunkeln.
4. **Dichte.** Regale, Flaschen, Kleiderstangen, Koffer, Gleise, Anzeigetafel: Details,
   die die Situation erzählen.

**Jetzt je Szene:** *Café* — Barista am Tresen, Rückbuffet mit Espressomaschine,
Stadt hinter der Fensterfront · *Hotel* — Rezeptionist, Schlüsselfächer, Bogenfenster,
Koffer im Vordergrund · *Bahnhof* — Wartende mit Gepäck, Zug mit beleuchteten Fenstern
und Fahrgästen, Anzeigetafel, Uhr, Sicherheitslinie · *Geschäft* — Verkäuferin,
Kleiderstange, Wandregale, Deckenstrahler · *Praxis* — Ärztin mit Stethoskop,
Untersuchungsliege, Kreuz-Schild, Medikamentenregal.

Bildband auf **176 px** erhöht (vorher 112), damit die Szene Raum hat. Weiterhin reines
SVG: ~26 kB für den ganzen Dialog-Baustein inkl. aller fünf Szenen, offline-fest.

> **Anschluss:** Struktur/Baum `gremium-struktur.md` · Feedback/Erklärung `gremium-feedback.md` · Messung `07-measurement.md` · Content-QS `content-review-schwedisch.md`.
