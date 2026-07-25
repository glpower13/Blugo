# Design-Handschrift — der Nordstern für das Aussehen

> **Auftrag (Nutzer):** ein **absolut High-End / Premium** Aussehen, **sehr edel** — eine **Glasoberfläche (Glassmorphism)** in Richtung **iPhone-Sperrbildschirm**, mit Tiefe und dezenten Animationen. Ausdrücklich **nicht** flach/billig („wie von einem Kind gemacht"). Diese Datei legt die **Identität** fest, an der jede Design-Arbeit gemessen wird. Umsetzung (Glas-Richtung): 2026-07-23.

---

## 0. In einfachen Worten

Die App liegt auf einer **tiefen, atmosphärischen Bühne** (weiche, langsam driftende Farb-Lichter — wie ein iPhone-Sperrbildschirm). Darüber schweben **Milchglas-Karten**: durchscheinend, mit feiner Lichtkante, weichem Schatten und viel Ruhe. Edel wirkt das durch **Tiefe, Licht und Zurückhaltung**, nicht durch bunte Effekte.

## 1. Das Leitprinzip

**High-End-Glas mit Zurückhaltung.** Tiefe und Material (Unschärfe, Lichtbrechung, Schichten) statt Deko. Jede Bewegung ist weich und *erzählt* einen Zustand — sie lärmt nie. Passt zur einen Design-Regel: edel heißt **wahrhaftig**, nicht dekoriert (CLAUDE.md; `06-motivation.md`).

## 2. Bewusst gemieden

- **Billiges** Glas: milchige Kästen ohne etwas dahinter (Glas braucht einen lebendigen Hintergrund zum Brechen), harte Kanten, zu viele Ebenen.
- Grelle Verläufe, Neon, schwebende Partikel, „AI-Glow", Konfetti/Dopamin-Effekte.
- Laute, verspielte Animationen; „Badges" und Zahlen ohne Bedeutung.

## 3. Die Handschrift (Identität)

**Bühne — atmosphärischer Tiefen-Hintergrund.**
Ein fast schwarzer Grund (`#06060a`) mit **weichen, langsam driftenden Farb-Lichtern** in einer **ruhigen Zwei-Ton-Luxuswelt: tiefes Petrol/Teal + ein Gold-Schimmer** (nordischer Fjord in der Dämmerung — edel statt Regenbogen). Dazu eine schemenhafte **Nordlicht-Bildsprache** (Aurora-Bänder über Bergsilhouette, `ui/Backdrop.tsx`), **Filmkorn** und **Vignette** für Tiefe (`index.css`, `body::before`).

**Flächen — dunkel getöntes Milchglas (iOS „dark material").**
Karten sind **dunkel getönt durchscheinend** (`rgba(13,15,24,0.56)`) mit **Unschärfe** und einer **feinen Lichtkante** oben — so bleibt heller Text **klar lesbar**, während der Hintergrund gedämpft durchschimmert. Klasse `.glass` (Karten) und `.glass-soft` (innere Panels/Pillen). Große Radien, poliertes Gold für die primäre Aktion (`.btn-gold`).

**Farbe — ein Akzent, mit Bedeutung.**
Genau **ein** edler Akzent: **Champagner-Gold** (`brand #E7C08A`) — glüht auf dem Glas, souverän, sparsam (Wortmarke, primäre Aktion, aktiver Fokus). Farbe trägt sonst nur **Bedeutung**: Grün (`success`) = *bewiesen* stabil (das eine Wahrheitssignal), Ampel `warn`/`danger` nur für die Selbsteinschätzung. Text in **Apple-Label-Farben** (`paper #F5F5F7`, `muted`, `faint`). Solides Tiefdunkel (`ink`) für Text auf goldenen Flächen.

| Rolle | Token | Wert |
|---|---|---|
| Bühne (Grund) | — | `#06060a` + Aurora |
| Karte (Milchglas) | `.glass` | weiß-alpha 0.08 + blur |
| Kante | `line` | `rgba(255,255,255,0.12)` |
| **Akzent (Champagner-Gold)** | `brand` | `#E7C08A` |
| Text auf Gold | `ink` | `#0B0A12` |
| Text (Apple-Weiß) | `paper` | `#F5F5F7` |
| Text sekundär / tertiär | `muted` / `faint` | iOS-Label-Alpha |
| **Wahrheit: bewiesen stabil** | `success` | `#5FD0A0` |
| Ampel „schwer"/„nochmal" | `warn`/`danger` | `#F0B354` / `#F28C7C` |

**Typografie — zwei Stimmen (aktualisiert 2026-07-24).**
Weil die App zweisprachig ist, tragen **zwei** Schriften die Struktur — das ist Information, keine Deko:

| Stimme | Schrift | Wofür |
|---|---|---|
| „Die App spricht **mit dir**" | **Fraunces Variable** (Serife, Achse `opsz`) | deutsche Titel & Überschriften, Wortmarke |
| „Die **Sprache**, die du lernst" | **Manrope Variable** (Grotesk) | schwedische Sätze, Bedienelemente, Zahlen |

Warum so: die Serife gibt der Oberfläche einen editorialen, hochwertigen Ton (die `opsz`-Achse verfeinert
große Titel automatisch und hält kleine robust); die Grotesk hält das **Schwedische gestochen klar** —
å/ä/ö dürfen den Lerner nie raten lassen, und Kennzahlen brauchen verlässliche Tabellenziffern (`tnum`).
Nebeneffekt: man sieht auf einen Blick, was Oberfläche und was Lernstoff ist.

**Offline-sicher:** beide Schriften werden **mitgeliefert** (`public/fonts`, nur Latin-Teilmenge,
zusammen ~92 kB, im Service-Worker vorgehalten) — kein CDN, kein Fremd-Server (`05-architecture.md`).
Lizenz SIL OFL 1.1 (`public/fonts/LICENSE-*.txt`). Systemschriften bleiben als Rückfallebene.

**Bewegung — ruhig & tastbar.**
Langsame Aurora-Drift; Karten steigen beim Erscheinen sanft auf (`.rise`); Knöpfe geben ein dezentes Eindrücken auf Tap. Weiche Kurve (`cubic-bezier`). `prefers-reduced-motion` schaltet alles ab.

## 4. Erste Umsetzung (2026-07-23)

Gebaut: Aurora-Tiefenhintergrund + `.glass`/`.glass-soft` (`index.css`, `tailwind.config.js`), Champagner-Gold-Akzent, Apple-System-Schrift, ruhige Bewegung (Aurora-Drift, `.rise`, Tap-Feedback), dunkle Statusleiste (`theme-color #06060a`). Alle Flächen (Kopf, Kennzahlen, Themen, Lern-Loop, Einstellungs-Sheet mit unscharfem Hintergrund) auf Glas + Tokens umgestellt.

Bewusst **dunkel-only** (`index.css` `color-scheme: dark`).

## 5. Weltklasse-Pass gebaut (2026-07-23)

Fünf Hebel von „Top-40" auf Weltklasse (`gremium-design-weltklasse.md`):
1. **Gedächtnisfeld als Nachthimmel** — jede Wendung ein Stern; nur *bewiesen* Stabiles leuchtet/pulsiert (`MemoryField.tsx`, ehrlich).
2. **Eigene Linien-Icons** statt Emoji (Schieberegler, Play, Schildkröte, Klangwelle, KI-Funkeln — `ui/icons.tsx`).
3. **Lebendige Bewegung**: Zahlen zählen hoch, Balken füllen sich, Aurora-Parallaxe beim Scrollen, Tap-Glühen (`useCountUp.ts`).
4. **Editorial-Typografie**: der schwedische Satz als Hero, selbstbewusste Kennzahlen, klare Hierarchie.
5. **Zwei-Ton-Luxuswelt**: Petrol/Teal + Gold statt Regenbogen.

**Fundamentale Struktur (Navigation):** Weg von der einen langen Seite hin zu klaren „Räumen": **Übersicht** (Nachthimmel + Kennzahlen + „Weiterlernen" + Themen) → **Thema-Detail** (Drill-down: die einzelnen Wendungen mit Einzelstatus, Fokus-Wahl, „dieses Thema üben") → **fokussierte Session** (mit Fortschritt & Zurück). Client-seitig, kein Router (`App.tsx` `View`; `CategoryDetail.tsx`).

## 6. Bewusst später (nicht jetzt)

- ~~Optional eine eigene, lizenzierte **Marken-Schrift** statt reiner Systemschrift.~~
  **Erledigt 2026-07-24:** Fraunces + Manrope, mitgeliefert (siehe §3 Typografie).
- Feinschliff mit einem echten Art-Director am realen Gerät, **wenn echte Inhalte** stehen — sonst poliert man Platzhalter (`gremium-naechste-schritte.md` §4).

> **Anschluss:** Vision `gremium-naechste-schritte.md` §4 · Motivation/Ehrlichkeit `06-motivation.md` · Produkt-Ruhe `04-product.md` · Architektur (offline, keine Fremd-Server) `05-architecture.md`.

## Nachtrag 2026-07-25 — App-Zeichen und Navigations-Dock

### Das App-Zeichen: schwedisches Kreuz als Aussparung

Das alte Zeichen war ein indigofarbenes Quadrat mit einem weißen **N** — austauschbar
und ohne Aussage. Der Ersatz macht drei Dinge bewusst anders als die Kategorie:

| Alle machen | Wir machen |
|---|---|
| Maskottchen (Eule, Figur) | — |
| Sprechblase | — |
| Buchstabe / Wortmarke | — |
| | **Negativraum-Zeichen**: das schwedische Kreuz ist aus einer Goldplatte *ausgespart*, dahinter liegt Tiefe |

Zwei Aussagen in einer Form:
- **Herkunft** — echte Flaggen-Geometrie (Querbalken mittig, Längsbalken zur Stange
  versetzt). Erkennbar schwedisch, nicht bloß ein Pluszeichen.
- **Die eine Design-Regel** — im Schnittpunkt der Balken sitzt **ein** Lichtpunkt:
  das eine wahre Signal, um das die ganze App gebaut ist.

Champagner-Gold auf tiefem Petrol (dieselbe Palette wie die App). Alles Wesentliche
liegt in der mittleren 62 %, damit jeder `maskable`-Zuschnitt (Kreis, Squircle) es
unbeschadet lässt. Getestet bis **16 px** — dort trägt es noch.

Quelle ist `public/favicon.svg`; die PNGs werden daraus gerendert, es gibt also nur
**eine** Wahrheit für das Zeichen.

### Das Dock: unten, größer, nach dem goldenen Schnitt

Drei Änderungen (Nutzerrückmeldung 2026-07-25):

1. **Immer sichtbar.** Ein echter Fehler: Die Leiste lag in `<main>`, und dort erzwingt
   `view-transition-name` ein `contain: layout`. Damit bezog sich `position: fixed` auf
   `<main>` statt aufs Fenster — am Listenende scrollte die Leiste weg. Sie steht jetzt
   als Geschwister **neben** `<main>`. Ein e2e-Test misst die Unterkante gegen die
   Fensterhöhe, damit das nicht zurückkommt.
2. **Immer unten.** Vorher ab `md` oben. Eine Navigationsleiste gehört immer an dieselbe
   Stelle; auf breiten Geräten schwebt sie als zentriertes Dock über dem Rand.
3. **Größer, in φ-Rhythmus.** Icons von 1,15 rem auf **1,5 rem**. Die senkrechte
   Gliederung folgt dem goldenen Schnitt: Icon + Abstand (1,5 + 0,28 = 1,78 rem) zur
   Beschriftungszeile (1,1 rem) steht bei **1,62** — also φ. Proportion statt Schätzung.

## Nachtrag 2026-07-25 (später) — ein Bausteinkasten für alle Bilder

Die Bereichsbilder waren auf Eigenfarbe, Volumen und echte Figuren umgebaut, die
**Gesprächskulissen blieben flache Silhouetten** — auf demselben Bildschirm sah
man zwei Qualitätsstufen nebeneinander.

Statt den Code zu verdoppeln liegen die Bausteine jetzt in **`ui/sceneKit.tsx`**:
Farbpalette, `Figure`, `House`, `Spruce`, `Pendant`, `Pool`, die Filter
(Weichzeichnung/Schein/Korn) und `Finish` (Korn + Vignette). `AreaArt` und
`SceneArt` nutzen beide dasselbe — **jede künftige Szene erbt das Niveau
automatisch**, und die Bildregeln stehen an genau einer Stelle.

Alle **zehn** Gesprächskulissen sind damit neu: Café mit Kanelbullar-Vitrine und
drei Lichtkegeln, Hotel mit Schlüsselwand und Pflanze, Bahnhof mit beleuchtetem
Zug am Bahnsteig, Laden mit Kleiderstange und Dalahäst, Praxis mit Liege und
grünem Kreuz, Werkstatt, Zocken (Monitor als einzige Lichtquelle), Rennstrecke,
See im Morgenlicht, Stadion unter Flutlicht.

Der Bereichston (`hue`) färbt nicht mehr das ganze Bild, sondern nur noch
Umgebungslicht und Bildschirme — jede Szene hat ihre **eigene Tageszeit**.

## Nachtrag 2026-07-25 — warum das neue Zeichen auf dem Handy nicht ankam

**Beobachtung des Nutzers:** „Warum ist das Symbol auf meinem Handy immer noch das alte?"

**Befund — ein echter Fehler im Deploy, nicht im Bild.** Der Server lieferte das
neue Zeichen korrekt aus. Aber ich hatte nur den **Inhalt** der Dateien getauscht,
nicht ihre **Namen** (`icons/icon-192.png` blieb `icons/icon-192.png`). Für ein
installiertes PWA reicht das nicht:

- **Android** baut beim Installieren ein **WebAPK** mit eingebackenem Icon. Später
  fragt Chrome regelmäßig nur noch das **Manifest** ab, um Änderungen zu erkennen.
  Bei gleichen Dateinamen ist das Manifest byte-gleich → „keine Änderung" → das
  alte Icon bleibt **dauerhaft** auf dem Startbildschirm.
- **Der Favicon-Cache** der Browser ist zusätzlich außergewöhnlich zäh und
  ignoriert übliche Cache-Regeln oft.

**Behebung:** Version im Dateinamen (`favicon-v2.svg`, `icon-192-v2.png`,
`icon-512-v2.png`). Damit ändert sich das Manifest wirklich, Android holt ein
neues WebAPK, und jeder Cache greift ins Leere.

**Regel ab jetzt:** Ändert sich das Zeichen, wird `ICON_VERSION` in
`tools/render-icons.mjs` erhöht und in `index.html` + `vite.config.ts` nachgezogen.
`npm run icons` rendert die PNGs aus `favicon.svg` — **eine** Quelle für das Zeichen.

**Was ich NICHT beheben kann:** Ein bereits auf den **iOS**-Startbildschirm gelegtes
Symbol wird nie aktualisiert — dort hilft nur entfernen und neu ablegen. Das ist
Verhalten des Betriebssystems.

## Nachtrag 2026-07-25 — der Reiterwechsel stotterte

**Beobachtung des Nutzers:** „Die Navigationsleiste hakt immer beim Umschalten."

**Gemessen statt geraten:** 700–940 ms pro Reiterwechsel. Zwei Ursachen, beide behoben:

| Ursache | Behebung |
|---|---|
| Jeder Reiterwechsel lief durch die **Ansichts-Überblendung** (0,36 s Animation plus ein `flushSync`-Vollrender) | Reiterwechsel ist **Seitwärts**-Navigation, kein Weg im Baum — jetzt ohne Überblendung. Richtungsanimationen bleiben dem Drill-down vorbehalten, wo sie etwas bedeuten. |
| Das Korn lief als **`feTurbulence` pro Bild** über die volle Fläche — bei acht Bereichskarten acht Rauschberechnungen | Gekachelte Hintergrundgrafik `.grain-soft` über dem Bild-Container: der Browser rastert sie **einmal** und nutzt sie überall wieder. Optisch identisch. |

Dazu bekam die Leiste einen eigenen `view-transition-name`. Beim Drill-down wird sie
dadurch **nicht mitgeblendet**, sondern bleibt stehen — vorher sprang die aktive
Markierung während des Übergangs sichtbar hin und her.

**Ergebnis:** 52–100 ms in der Seite gemessen. Unter 100 ms wird eine Reaktion als
unmittelbar wahrgenommen — das Stottern ist damit weg, nicht nur kleiner.
