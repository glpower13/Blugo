# NEUROLANG

**Die Sprachlern-App, die man nie „durch" hat — weil Behalten das Produkt ist, nicht Lernen.**

Erste Sprache: **Deutsch → Schwedisch.** Zielnutzer: erwachsene Selbstlerner, die schon Duolingo/Babbel/Lingua probiert haben, dabei durchaus etwas gelernt — es aber nie langfristig behalten haben und an der steigenden Schwierigkeit abgesprungen sind.

> **Status:** Meilenstein 0 — Konzept & Dokumentation. Es wird in dieser Phase bewusst **keine** Anwendung programmiert. Siehe `docs/09-roadmap.md`.

---

## 1. Das Problem (der ehrliche Kern)

Jede große Sprachlern-App optimiert *Erwerb* — Lektionen abschließen, Vokabeln „durchnehmen", Streaks halten. Keine optimiert *Erhalt*.

Die Folge kennt jeder, der das durchgemacht hat: Man baut über Monate etwas auf, nutzt es dann eine Weile nicht — und muss danach über einfachste Wörter nachdenken. Das ist kein persönliches Versagen, sondern ein erforschtes Phänomen: **Sprachattrition.** Produktives Wissen verfällt schneller als rezeptives, und alles Unbenutzte zerfällt — außer man baut Erhalt als *Mechanik* ein.

Drei Ursachen, alle belegbar:
1. Wissen wurde nie bis zur Automatik überlernt.
2. Es hing an wenigen Kontexten und Abrufreizen.
3. Nichts hat es je reaktiviert.

## 2. Die These

NEUROLANG optimiert **messbaren Erhalt** statt Engagement. Der Fortschrittswert ist nicht „Lektionen" oder „Streak", sondern:

> *Was du gerade zuverlässig behältst.*  
> z. B. „340 Chunks aktiv, davon 60 auch nach 90 Tagen ohne Übung stabil."

Das ist die einzige Zahl, die in der Realität etwas bedeutet.

## 3. Was NEUROLANG anders macht

| | Klassische Apps | NEUROLANG |
|---|---|---|
| Optimiert auf | Engagement (Streak, XP) | messbaren Erhalt |
| Lerneinheit | isolierte Vokabel | Chunk im Kontext |
| Schwierigkeit | fixe Lektionskurve → Cliff | adaptives Erfolgsband (~80–85 %) |
| „Fertig" | Kurs abgeschlossen | nie — Wartung läuft ewig weiter |
| Belohnung | Punkte fürs Erscheinen | Signal echter Kompetenz |
| Content | fixer Baum | KI-generiert, on demand, auf i+1 |

## 4. Die Methode: Begegnen → Abrufen → Erhalten

Kein Zaubertrick, sondern die konsequente Verdrahtung weniger sehr robuster Effekte zu **einer Schleife pro Chunk** (Chunk = sinnvolle Wendung im Kontext, nie isolierte Vokabel):

1. **Verständliche Begegnung** — der Chunk erscheint eingebettet in verstandenem Input auf i+1-Niveau. *(Comprehensible Input; Encoding u. a. per Birkenbihl-Dekodierung — siehe `docs/03-method.md`.)*
2. **Aktiver Abruf** — kurz danach selbst herholen, erst Wiedererkennen, später Produktion. *(Testing Effect.)*
3. **Abruf am Vergessenspunkt** — der Chunk kommt exakt dann zurück, wenn Vergessen droht; Intervalle dehnen sich. *(Spacing Effect.)*
4. **Kontextvariation** — Wiederkehr in *anderen* Sätzen/Situationen, nie identisch. *(Direkter Fix gegen kontextgebundenes Verblassen.)*
5. **Wartungsmodus** — ein „gelernter" Chunk verschwindet nie, sondern wandert in einen sich ewig verlängernden Erhalt-Rhythmus. **Das ist der Teil, den keine App hat — und der Grund, warum es diesmal bleibt.**

Details: `docs/03-method.md`.

## 5. Wissenschaftliche Grundlage

Jede Funktion wird begründet und nach **Evidenzstärke gekennzeichnet** (Fels / stark / schwach / widerlegt). Die Grundlage ist ein *Gremium mehrerer Stimmen*, keine einzelne Lehre:

- **Ebbinghaus** — Vergessenskurve, Spacing
- **Roediger & Karpicke** — Retrieval Practice / Testing Effect
- **Krashen** — Comprehensible Input (i+1)
- **Bjork** — Desirable Difficulties
- **Deci & Ryan** — Selbstbestimmungstheorie (Motivation)
- **Csíkszentmihályi** — Flow
- **Vera F. Birkenbihl** — Dekodieren, Anti-Vokabelpauken, gehirngerechtes Encoding *(als eine praxisnahe Stimme, nicht als Fundament)*

Ausdrücklich **draußen** (widerlegt/Deko): „Lernstile", generisches „Brain-Training", „Neuroplastizität" als Design-Prinzip. Details & Quellen: `docs/02-science.md`.

## 6. Die vier Module (statt zehn „Engines")

1. **Content-Pipeline** — erzeugt verständlichen, auf i+1 graduierten schwedischen Input on demand (der Moat). `docs/08-content-pipeline.md`
2. **Comprehension-Loop** — Begegnung → Verständnishilfen → Verständnis-Check → Logging. `docs/04-product.md`
3. **Memory-Engine** — Spacing, Retrieval-Scheduling, Wartung, Kontextvariation. `docs/03-method.md`
4. **Progress-/Measurement-Modul** — die neue, ehrliche Gamification. `docs/06-motivation.md`, `docs/07-measurement.md`

## 7. Der Moat: KI-Content-Pipeline

Für Schwedisch existiert kaum graded Content, und kuratierte Podcasts führen in Lizenzprobleme. Der einzige tragfähige Weg ist eine **KI-Pipeline, die verständlichen Input exakt auf i+1 on demand erzeugt** (LLM → Grading → schwedisches TTS → optional Bild/Kontext) — und Birkenbihls Dekodierung automatisiert, die historisch von Hand gemacht werden musste. Das kann ein fixer Content-Baum strukturell nicht. Das ist der Grund, warum NEUROLANG als KI-natives Produkt überhaupt existieren darf.

## 8. Motivation ohne Dopamin-Tricks

Grundregel: **belohne Kompetenz, nicht Anwesenheit** — und jede Belohnung muss ein *wahres* Signal echten Fortschritts sein (sonst Goodhart: man optimiert den Streak statt die Sprache). Vier Mechaniken: lebendes Gedächtnisfeld · Meilensteine an realer Fähigkeit · Flow-Band · ehrlicher „Streak" als Gesundheitssignal (pflegen statt Kette zerreißen). Details: `docs/06-motivation.md`.

## 9. Roadmap (Kurzform)

- **M0 — Konzept & Doku** *(diese Phase)*: README, `CLAUDE.md`, `/docs`. Kein App-Code.
- **M1 — schlankes MVP**: Web-App, *ein* Level, ~20 handgeprüfte KI-generierte schwedische Segmente, der Comprehension-Loop, simple Fortschrittsanzeige. Beweist den Kern an einem echten Lerner.
- **später**: Content-Pipeline automatisieren, Memory-Engine ausbauen, weitere Level/Sprachen, Mobile.

Vollständig: `docs/09-roadmap.md`.

## 10. Was dieses Projekt NICHT ist

- Kein Klon von Duolingo/Babbel/Busuu.
- Kein XP-/Level-/Diamanten-System, kein zerbrechender Streak.
- Kein Vokabelpauken isolierter Wörter.
- Keine unbelegten „Neuro"-Versprechen oder „Lernstile".
- Keine zehn Module in v1. Kein Backend auf Vorrat. Keine Architektur vor dem Konzept.

## 11. Dokumentationsstruktur

```
docs/
  01-vision.md            Vision, Mission, Zielnutzer
  02-science.md           Gremium + Evidenzstufen + Quellen
  03-method.md            Begegnen→Abrufen→Erhalten, Birkenbihl-Fusion
  04-product.md           Comprehension-Loop, täglicher Ablauf
  05-architecture.md      Module, Datenfluss, spätere Technik
  06-motivation.md        Belohnungssystem (SDT, 4 Mechaniken)
  07-measurement.md       Was „Erhalt" numerisch bedeutet
  08-content-pipeline.md  Der Moat: KI-Input + Auto-Dekodierung
  09-roadmap.md           Meilensteine, Prioritäten
  10-open-questions.md    Ehrliche offene Punkte, vertagte Entscheidungen
  11-ideas.md             Parkplatz (z. B. Suno-Songs als Input)
```

## 12. Design- & Qualitätsphilosophie

Praktische, lauffähige Substanz vor architektonischer Komplexität. Jede technische Entscheidung wird dokumentiert und begründet. Doku nur so tief, wie sie eine Entscheidung stützt — kein Markdown-Friedhof. Deutsch für nutzer- und projektnahe Inhalte, Englisch im Code. Technikwahl (Modelle, Stack) wird bei Build-Start **per Live-Recherche** getroffen, nicht aus dem Gedächtnis — dieser Teil veraltet zu schnell.
