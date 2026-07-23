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

**Typografie — Apple-System (SF).**
`-apple-system`/SF Pro — die iPhone-Anmutung, offline-sicher (kein Fremd-Server, `05-architecture.md`). Große, klare Hierarchie; weite Laufweite bei Kapitälchen-Labels für den komponierten, edlen Eindruck.

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

## 6. Bewusst später (nicht jetzt)

- Optional eine eigene, lizenzierte **Marken-Schrift** statt reiner Systemschrift.
- Feinschliff mit einem echten Art-Director am realen Gerät, **wenn echte Inhalte** stehen — sonst poliert man Platzhalter (`gremium-naechste-schritte.md` §4).

> **Anschluss:** Vision `gremium-naechste-schritte.md` §4 · Motivation/Ehrlichkeit `06-motivation.md` · Produkt-Ruhe `04-product.md` · Architektur (offline, keine Fremd-Server) `05-architecture.md`.
