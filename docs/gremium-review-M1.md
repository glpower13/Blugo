# Gremium-Review M1 + Maßnahmenkatalog

> **Was das ist:** Stufe **D (Rollen-Gremium)** aus `docs/TEST-UND-PRUEF-STANDARD.md`.
> **Ehrlichkeitshinweis:** Dies ist ein **rollenbasiertes Review** — ich prüfe den
> aktuellen M1-Stand aus mehreren Fachperspektiven (die Stufe-D-Technik), **keine**
> Aussage echter, namentlich benannter Personen. Wo echte Prüfung nötig ist
> (schwedische Muttersprache), ist das als Maßnahme mit „braucht Mensch" markiert.
>
> **Stand:** bis Commit `823b472` (nach Loop 1). Kaskade A/B/C + Lint grün, 29 Tests.

---

## 1. Die Fachlinsen & Befunde

Schwere: **P1** blockierend · **P2** wichtig · **P3** klein. Beleg = Datei/Doku.

### Linse A — Lernwissenschaft
| ID | Befund | Beleg | Schwere | Status |
|---|---|---|---|---|
| W1 | „stabil" war **geschätzt** (Intervall ≥ 90) statt **gemessen** → Goodhart-Risiko am Kernwert | `metrics.ts` | P2 | **behoben (Loop 1)** — `provenStableAt` |
| W2 | **Adaptives Erfolgsband ~80–85 %** ist im Konzept versprochen, aber **nicht im Code** (Schwierigkeit/Level fix) | `04-product.md` vs. `App.tsx` | P2 | **behoben (Loop 5)** — `difficulty.ts` (Neuzufuhr); Intervall-Ebene später |
| W3 | „Verständnis-Abdeckung" zählt jeden letzten `good` (auch Wiedererkennen) → misst nicht „Verständnis im neuen Kontext auf Zielstufe" | `metrics.ts`, `07-measurement.md` | P3 | offen |
| W4 | Interleaving nur implizit (Wartung mischt), keine bewusste Typ-Durchmischung | `buildQueue.ts` | P3 | für M1 ok |

### Linse B — Sprachdidaktik / Sprachlehrer
| ID | Befund | Beleg | Schwere | Status |
|---|---|---|---|---|
| D1 | Content **11 Segmente** (< ~20), begrenzte Situationen; Glossen strittig (`mår→befindest`, `tack→bitte`) | `seedSegments.ts`, `content-review-schwedisch.md` | P2 | offen (**braucht Mensch**) |
| D2 | „Produktion" ist **Selbsteinschätzung** (Auflösen → Selbstnote), keine echte Produktionserfassung | `ComprehensionLoop.tsx` | P2 | offen (später: Eingabe/ASR) |
| D3 | Kein Audio-QS; Web-Speech-TTS evtl. ohne sv-Stimme/Fehlbetonung | `tts.ts` | P3 | offen |
| D4 | Hilfenutzung (Dekodierung/Übersetzung gezogen?) wird nicht erfasst — „ohne Hilfe verstehen" ist laut Konzept selbst ein Signal | `ComprehensionLoop.tsx`, `04-product.md` | P3 | offen |

### Linse C — Retention / Sprachattrition
| ID | Befund | Beleg | Schwere | Status |
|---|---|---|---|---|
| R1 | Ohne Beweis-Messung überzeichnet die App Erhalt → verfehlt den Kern-Zweck | `metrics.ts` | P1-Relevanz | **entschärft (Loop 1)** |
| R2 | „stabil" wird real erst nach ~90 echten Tagen sichtbar → **Fortschritt wirkt unsichtbar**; es fehlt ein Reife-Zwischensignal | `App.tsx`, `07-measurement.md` | P2 | offen (Loop 2) |
| R3 | Wartungs-Intervall wächst unbegrenzt, kein Lifetime-Rhythmus definiert | `memoryEngine.ts` | P3 | für M1 ok |

### Linse D — App-Entwicklung
| ID | Befund | Beleg | Schwere | Status |
|---|---|---|---|---|
| E1 | Kein **committed E2E** (Playwright) → CI fährt Stufe B nicht | `.github/workflows/deploy.yml` | P3 | offen |
| E2 | Schreibfehler (IndexedDB) beim Bewerten werden nicht sichtbar gemacht (nur Bootstrap hat Fehlerzustand) | `App.tsx` | P3 | offen |
| E3 | Kein Update-Hinweis beim SW-Update (autoUpdate lädt still) | `main.tsx` | P3 | minor |
| E4 | A11y: Grade-Buttons ohne aria-Kontext; Farbkontrast ungeprüft | `ComprehensionLoop.tsx` | P3 | offen |
| E5 | Doppel-Tap-Race · Bootstrap-Fehler still | `App.tsx` | P3 | **behoben** `28f65f8` |

### Linse E — Meta / Architektur / unterstützende höhere Intelligenz
| ID | Befund | Schwere | Status |
|---|---|---|---|
| M1 | **Die eine Design-Regel** (nur wahre Signale) war an zwei Zahlen verletzbar (stable, coverage). Stable behoben; coverage bleibt zu beobachten. Grundsatz: jede sichtbare Zahl gegen Goodhart testen. | Leitplanke | laufend |
| M2 | **Konzept-Code-Drift**: mehrere Doku-Versprechen (adaptives Band, echtes Audio, echte Produktion) sind noch nicht Code → Gefahr der Überzeichnung. „Gebaut vs. versprochen" muss sichtbar getrennt sein. | P2 | offen (Loop 2) |
| M3 | Der eigentliche Moat (KI-Content-Pipeline) ist bewusst noch nicht angefasst (nach M1) — kein Handlungsbedarf jetzt, aber strategisch im Blick behalten. | strategisch | geparkt |

**Gesamturteil:** M1-Kern ist nach Loop 1 **tragfähig und ehrlich** — **kein offenes P1**. Die offenen P2 sind teils bewusste M1-Grenzen (Content-Umfang, adaptives Band, Produktionserfassung) und teils sofort umsetzbar (Reife-Signal, Drift-Transparenz). Priorisiert unten.

---

## 2. Maßnahmenkatalog (priorisiert, umsetzungsbereit)

Legende Träger: **🤖 autonom** (ich) · **🧑 du/Entscheidung** · **👥 Mensch/Muttersprache**.

| # | Maßnahme | adressiert | Prio | Träger | Konkreter Schritt |
|---|---|---|---|---|---|
| ✅1 | Ehrliche „stabil"-Messung (`provenStableAt`) | W1/R1 | P2 | 🤖 | **erledigt (Loop 1)** |
| ✅2 | Stufen-Demotion bei Fehler | ISTQB E-1 | P3 | 🤖 | **erledigt (Loop 1)** |
| 3 | **Reifegrad-Signal** „reift" zwischen aktiv und stabil, damit Fortschritt sichtbar ist | R2 | P2 | 🤖 | Metrik `maturing` + Anzeige + Test **(Loop 2)** |
| 4 | **„Gebaut vs. versprochen"** in README/Roadmap klar trennen (Anti-Überzeichnung) | M2 | P2 | 🤖 | Abschnitt/Statusspalte ergänzen **(Loop 2)** |
| ✅5 | „Verständnis-Abdeckung" stufengewichtet (Produktion voll, Wiedererkennen halb) | W3 | P3 | 🤖 | **erledigt (Loop 3)** |
| 🟡6 | **Content auf ~20 Segmente** erweitern (mehr Alltagssituationen) | D1 | P2 | 🤖-Entwurf → 👥-Prüfung | **Entwurf erledigt (Loop 4): 21 Segmente / 11 Chunks** — jetzt `content-review-schwedisch.md` durch 👥 abhaken |
| ✅7 | Committed **Playwright-E2E** + CI-Workflow (Stufe B in CI) | E1 | P3 | 🤖 | **erledigt (Loop 3)** — `e2e/`, `ci.yml` |
| ✅8 | Hilfenutzung erfassen (Krücke gezogen?) als Signal | D4 | P3 | 🤖 | **erledigt (Loop 4)** — `helpUsed` im Session-Log |
| ✅9 | Schreibfehler beim Bewerten sichtbar machen | E2 | P3 | 🤖 | **erledigt (Loop 3)** |
| ✅10 | A11y-Runde (aria-Labels, `lang="sv"`) | E4 | P3 | 🤖 | **erledigt (Loop 3)** |
| ✅11 | **Adaptives Erfolgsband** real bauen (Neuzufuhr an Erfolgsquote koppeln) | W2 | P2 | 🤖 | **erledigt (Loop 5)** — `difficulty.ts`; Intervall-Feintuning bleibt später |
| 🟡12 | Echte **Produktionserfassung** (Texteingabe-Abgleich → später ASR) | D2 | P2 | 🤖 | **Tippen erledigt (Loop 6)** — `answerCheck.ts`; Sprechen/ASR bleibt post-M1 (`11-ideas.md`) |
| 13 | Schwedisches **TTS** in der Pipeline (Audio-QS) | D3 | P2 | 🧑 (Anbieterwahl) + 🤖 | bei Content-Pipeline (nach M1) |

---

## 3. Loop-Plan (schrittweise, jeder Loop mit Kaskade)

- **Loop 1 ✅** — #1, #2 (ehrliche Messung + Demotion). *Erledigt, verifiziert.*
- **Loop 2** — #3, #4 (Reife-Signal + „gebaut vs. versprochen"). *Autonom, als Nächstes.*
- **Loop 3 ✅** — #5, #7, #9, #10 (Abdeckung gewichtet, E2E in CI, Schreibfehler sichtbar, A11y). *Erledigt, verifiziert.*
- **Loop 4 ✅** — #6 (Content-Entwurf auf 21 Segmente) + #8 (Hilfenutzung im Log). *Erledigt; Content wartet nur noch auf 👥 Muttersprache-Prüfung.*
- **Loop 5 ✅** — #11 (adaptives Erfolgsband über die Neuzufuhr). *Erledigt, verifiziert.*
- **Loop 6 ✅** — #12 (getippte Produktionserfassung, `answerCheck.ts`). *Erledigt, verifiziert.*
- **Loop 7+ (post-M1)** — #13 (schwedisches TTS) + Sprech-/ASR-Produktion — Richtung Content-Pipeline, braucht Anbieter-Entscheidungen.

Jeder Loop: bauen → Kaskade A→E → bei Bedarf B ansehen → committen → Katalog fortschreiben. P2/P3 offen bleiben transparent, kein Weichzeichnen.
