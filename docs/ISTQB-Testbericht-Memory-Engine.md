# ISTQB-Testbericht — Modul „Memory-Engine" (+ Messung)

> Stufe **F** aus `docs/TEST-UND-PRUEF-STANDARD.md`, Modul-Meilenstein M1.
> Belegt durch echte Tests — Rückverfolgbarkeit über die Test-IDs in
> `src/modules/memory/memoryEngine.istqb.test.ts` (ST/DT/BVA).

**Prüfgegenstand:** `src/modules/memory/memoryEngine.ts` (Spacing, Scheduling,
Stufen-Promotion, Wartung), `src/modules/progress/metrics.ts` (Erhalt-Messung),
`src/session/buildQueue.ts` (Tages-Dosierung).
**Stand:** Commit-Reihe bis `28f65f8`. **Testlauf:** A (Typecheck) grün ·
C (28 Unit-Tests) grün · B (Playwright headless) grün · Lint grün.

---

## 1. Risikobasierte Priorisierung

| Risiko | Wirkung falls falsch | Priorität |
|---|---|---|
| Falsches Scheduling-Intervall | Chunk kehrt nicht am Vergessenspunkt zurück → Attrition, der Kern-Zweck scheitert | **hoch** |
| „stabil" falsch gezählt | falsches Erfolgssignal → Goodhart, verletzt die eine Design-Regel | **hoch** |
| Stufen-Promotion (Wiedererkennen→Produktion) zu früh/spät | Produktion zu früh = Frust; zu spät = kein produktives Können | mittel |
| Tages-Dosierung neuer Chunks | Über-/Unterforderung, Erfolgsband verlassen | mittel |

Testtiefe entsprechend: Scheduling + Messung am dichtesten geprüft.

## 2. Zustandsübergangs-Tests (ST)

Modell (status × Auslöser):

| Von | Auslöser | Nach | Test |
|---|---|---|---|
| new | good | learning | ST1 |
| recognition | 2× good | production (Stage) | ST2 |
| learning | again | new (Intervall 0, Streak 0) | ST3 |
| maintenance | again | learning (Demotion, nicht bis new) | ST4 |
| new → … | 7× good | maintenance, Intervall ≥ 90 | ST5 |

Alle erlaubten Übergänge grün. Verbotener/undefinierter Übergang: keiner
möglich, da `schedule` total ist (jede Kombination liefert einen definierten
Folgezustand).

## 3. Entscheidungstabelle (DT) — `schedule(result × wasNew)`

| Regel | wasNew | result | Intervall-Ergebnis | Test |
|---|---|---|---|---|
| DT1 | ja | good | 1 | ✓ |
| DT2 | ja | hard | 1 | ✓ |
| DT3 | ja | again | 0 | ✓ |
| DT4 | nein | good | round(interval × ease), wächst | ✓ |
| DT5 | nein | hard | round(interval × 1.2) | ✓ |
| DT6 | nein | again | 0 (Relearn) | ✓ |

Alle 6 Regeln (vollständige Abdeckung der Bedingungskombinationen) grün.

## 4. Grenzwertanalyse (BVA)

| Schwelle | Grenzen geprüft | Test |
|---|---|---|
| `STABLE_INTERVAL_DAYS = 90` | 89 = nicht stabil · 90 = stabil · 91 = stabil | BVA1 |
| `MAX_NEW_PER_SESSION = 3` | 2→2 · 3→3 · 4→3 (Deckel) | BVA2 |
| ease-Klemme `[1.3, 2.8]` | Unterlauf → 1.3 · Überlauf → ≤ 2.8 | BVA3 |
| Fälligkeit `dueAt ≤ now` | genau `= now` zählt · Zukunft nicht | BVA4 |
| Promotion `successStreak ≥ 2` | 1 = recognition · 2 = production | ST2 |

## 5. Statische Prüfung (adversariales Review, Stufe E)

Feindlich gelesen auf Rechen-/Grenzwertfehler, Zustandsübergänge, Race,
Escaping, fail-open, stillen Datenverlust. Ergebnis: **kein P1/P2.** Escaping
(§4) entfällt — in M1 kein benutzerkontrollierter Wert in HTML/JS/SQL/Shell
(statischer Content, React escaped, kein Freitext).

## 6. Bug-Log

| ID | Schwere | Ort | Befund / Repro | Status |
|---|---|---|---|---|
| E-1 | P3 | `memoryEngine.ts` (Stage-Logik) | Stage ist **monoton**: nach Promotion zu `production` keine Demotion, auch bei wiederholtem `again`. Ein wieder wackliger Chunk wird weiter auf Produktionsniveau abgefragt. | offen (dokumentiert) |
| E-2 | P3 | `memoryEngine.ts` (`deriveStatus`) | `learning --again--> 'new'` setzt den Status voll zurück, obwohl History existiert. `isActive` bleibt korrekt (History > 0), also **kein** Zählfehler; rein semantisch/kosmetisch (Gedächtnisfeld-Farbe). | offen (dokumentiert) |
| E-3 | P3 | `App.tsx` (`handleResult`) | Doppel-Tap könnte denselben Chunk zweimal bewerten. | **behoben** `28f65f8` (submitting-Guard) |
| I-1 | P3 | `App.tsx` (Bootstrap) | Ladefehler blieb still auf „Lädt…". | **behoben** `28f65f8` (sichtbarer Fehlerzustand) |
| I-2 | P3 | `App.tsx` (Done-Screen) | „N fällig" vs. Dosierung wirkte widersprüchlich. | **behoben** `28f65f8` (Deferred-Hinweis) |

## 7. Architektur-Invarianten (§3 des Standards)

| Invariante | Befund |
|---|---|
| Kein stiller Datenverlust | ✓ Ladefehler sichtbar (I-1 behoben); kein Auto-Reseed |
| Fail-closed | N/A (kein Auth/keine Rollen in M1) |
| Eine Rechenquelle | ✓ `isStable`/Metriken nur in `metrics.ts`; Schwellen als einzelne Konstanten |
| Mehrbenutzer-sicher | N/A (client-only, IndexedDB pro Origin) |

## 8. Rückverfolgbarkeit (Anforderung → Test)

| Anforderung (Doku) | Test |
|---|---|
| Spacing dehnt bei Erfolg, staucht bei Fehler (`03-method.md`) | DT4/DT5/DT6, ST3/ST4 |
| Wiedererkennen → Produktion gestuft (`03-method.md`) | ST2, BVA (Streak 2) |
| „stabil" streng: maintenance + Produktion + ≥ 90 T. (`07-measurement.md`) | BVA1, `metrics.test.ts` |
| Tages-Dosierung 1–3 neue (`04-product.md`) | BVA2 |
| Kontextvariation: ungesehener Kontext bevorzugt (`03-method.md`) | `buildQueue.test.ts` |

## 9. Stabilitätsurteil

Der Modul-Kern (Scheduling + Messung + Dosierung) ist für das M1-Skelett
**stabil und freigegeben**: **kein offenes P1/P2**, vollständige Abdeckung der
Entscheidungsregeln und Schwellen, alle Zustandsübergänge grün. Die drei
offenen **P3** (E-1, E-2 rein qualitativ; plus Beobachtungen) sind dokumentiert
und nicht blockierend.

**Vor Produktivbetrieb / mit echten Lernern** neu zu bewerten: E-1 (Stage-Demotion
sinnvoll?) und — sobald Nutzungsdaten vorliegen — ob der einfache Scheduler
gegen eine SRS-Familie (FSRS/SM-2) getauscht wird (`10-open-questions.md`).
Dann zusätzlich Stufe **G** (Property-Fuzzing über die Scheduling-Invarianten,
Fault-Injection auf IndexedDB).
