# Design-Handschrift — der Nordstern für das Aussehen

> **Auftrag (Nutzer):** ein „viel, viel besseres, herausragenderes" Aussehen, **absolut High-End / Premium, sehr edel** — aber **nicht** das typische Übertriebene. Diese Datei legt die **Identität** fest (jetzt), an der jede spätere Design-Arbeit gemessen wird. Erste Umsetzung: 2026-07-23.

---

## 0. In einfachen Worten

Edel wirkt die App nicht durch **mehr** (mehr Farben, mehr Effekte, mehr Glanz), sondern durch **Ruhe und Sorgfalt**: eine warme, zurückhaltende Bühne, **eine** edle Akzentfarbe, eine Schrift mit Charakter und viel Luft. Weniger, aber genauer. Das liest sich hochwertig, weil es *bewusst* wirkt — nicht wie eine Vorlage.

## 1. Das Leitprinzip

**Zurückhaltung + Handwerk statt Effekte.** Jede Entscheidung soll man *spüren*, ohne sie zu bemerken. Das passt zur einen Design-Regel des Projekts: edel heißt **wahrhaftig**, nicht dekoriert (CLAUDE.md; `06-motivation.md`).

## 2. Bewusst gemieden (was 2026 „billig"/nach Vorlage wirkt)

- Generisches **KI-Indigo/Violett**, blaue Farbverläufe, „AI-Glow".
- Schwebende Partikel, Glas-Overkill, Neon, Konfetti/Dopamin-Effekte.
- Laute, verspielte Animationen; „Badges" und Zahlen ohne Bedeutung.

## 3. Die Handschrift (Identität)

**Farbe — warmes Tinten-Dunkel + ein Messing-Akzent.**
Weg vom kalten Marineblau, hin zu einem **warmen, tiefen Tinten-Schwarz** mit kaum sichtbarem Wärme-Verlauf (Materialgefühl). Genau **ein** edler Akzent: **gedämpftes Messing/Gold** — souverän, ruhig, hochwertig; sparsam eingesetzt (Wortmarke, primäre Aktion, aktiver Fokus). Tokens in `tailwind.config.js`:

| Rolle | Token | Wert |
|---|---|---|
| Hintergrund (Tinte) | `base` | `#16130F` |
| Fläche (gehoben) | `surface` | `#201B15` |
| Haarlinie / Rand | `line` | `#312A22` |
| **Akzent (Messing)** | `brand` | `#C6A15A` |
| Text (warmes Off-White) | `paper` | `#ECE3D5` |
| Text sekundär | `muted` | `#A99D89` |
| Text sehr leise | `faint` | `#786E5F` |
| **Wahrheit: bewiesen stabil** | `success` | `#77B893` |
| Ampel „schwer" / „nochmal" | `warn` / `danger` | `#D8A657` / `#C97A6D` |

> **Farbe trägt Bedeutung, nicht Deko:** Messing = Identität/Aktion. Grün = *bewiesenes* Können (das eine Wahrheitssignal). Die Ampel nur für die Selbsteinschätzung. Nichts Buntes „weil hübsch".

**Typografie — eine Stimme mit Charakter.**
Eine ruhige **Editorial-Serif** als Markenstimme (Wortmarke, Überschriften, der schwedische Begegnungssatz) trägt die Emotion; eine klare **humanistische Sans** fürs Funktionale. Bewusst **Systemschriften** (offline-sicher, kein Fremd-Server zur Laufzeit — passt zu `05-architecture.md`); eine lizenzierte, mitgelieferte Marken-Serif ist ein späterer, bewusster Schritt. Weite Laufweite (`tracking`) bei Kapitälchen-Labels für den edlen, komponierten Eindruck.

**Raum & Material.** Echter Weißraum, großzügige Radien, **weiche, tiefe** Schatten statt harter Kanten, Haarlinien statt dicker Rahmen. Ruhe vor Dichte.

**Bewegung.** Sparsam und weich (`cubic-bezier`, sanftes Fade). Bewegung *erzählt* (Zustandswechsel), sie lärmt nie. `prefers-reduced-motion` respektiert.

**Spezifisch statt generisch.** Für genau diesen Job gestaltet — ruhiges, konzentriertes Erhalten. Eine dezente nordische Sensibilität (passend zu Schwedisch) als Haltung, nicht als Klischee (keine Flaggenfarben).

## 4. Erste Umsetzung (2026-07-23)

Gebaut: warme Token-Palette + Verlauf (`tailwind.config.js`, `index.css`), Messing-Akzent statt Indigo, Editorial-Serif für Wortmarke/Kennzahlen/Begegnungssatz/Überschriften, weite Kapitälchen-Labels, weiche Schatten/Haarlinien, ruhige Bewegungskurve, dunkle Statusleiste (`theme-color`). Die gesamte Oberfläche (Kopf, Kennzahlen, Themen, Lern-Loop) wurde auf die neuen Tokens umgestellt.

Bewusst **dunkel-only**: eine edle, warme Dunkelbühne ist die Produktentscheidung (`index.css` `color-scheme: dark`).

## 5. Bewusst später (nicht jetzt)

- Eine **eigene, lizenzierte Marken-Serif** mitliefern (statt Systemschrift).
- Eigene **Icons** statt Emoji (⚙️/▶︎/🐢/🗣️/🤖) — „ruhige Souveränität".
- Feiner Feinschliff (Mikro-Interaktionen, Sound-Design-Frage), **wenn echte Inhalte** stehen — sonst poliert man Platzhalter (`gremium-naechste-schritte.md` §4).

> **Anschluss:** Vision `gremium-naechste-schritte.md` §4 · Motivation/Ehrlichkeit `06-motivation.md` · Produkt-Ruhe `04-product.md` · Architektur (offline, keine Fremd-Server) `05-architecture.md`.
