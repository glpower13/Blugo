# Gremium — Korrektur-Feedback der KI (Stufe-D-Beratung)

> **Ehrlicher Rahmen — bitte zuerst lesen**
> - Rollenbasierte Beratung (Stufe D). Ich spiele Fach-Perspektiven durch — **keine echten Personen**, keine erfundenen Zitate.
> - Jede fachliche Aussage trägt eine **Evidenzstufe** ([FELS]/[STARK]/[SCHWACH]/[WIDERLEGT]) wie in `02-science.md`, mit verifizierten Primärquellen (Live-Recherche Juli 2026, Quellen unten).
> - **Auftrag (Nutzerfrage 2026-07-23):** Wäre es fundamental, wenn die KI auf Fehler hinweist — in der **Schreibweise** (getippte Antwort) und später in der **Aussprache** — und *richtigstellt*, um Richtung **muttersprachliches Niveau** zu optimieren?
> - **Kurzantwort: Ja, fundamental — mit einer harten Bedingung** (siehe §4).

---

## 0. In einfachen Worten (für Nicht-Techniker)

Ja, das ist ein **großer, wissenschaftlich gut belegter Hebel.** Wenn man beim Lernen *selbst etwas produziert* (tippen, später sprechen) und dann einen **gezielten, freundlichen Hinweis** bekommt, was noch nicht stimmt, lernt man deutlich besser und behält es länger.

**Aber es gibt einen Haken, der genau eure wichtigste Regel trifft:** Ein **falscher** Hinweis ist schlimmer als gar keiner — er bringt dir etwas Falsches bei *und* zerstört das Vertrauen in die App. Und genau hier lauern zwei Fehlerquellen: (1) eine KI, die frei „korrigiert", kann sich irren, und (2) Aussprache-Erkennung versteht Anfänger oft falsch. Deshalb lautet die Empfehlung: **Ja bauen — aber zuerst dort, wo wir die richtige Antwort sicher kennen** (unsere geprüften Sätze), und **nie eine Schummel-Prozentzahl** anzeigen, die nur „nach Fortschritt aussieht".

---

## 1. Das Gremium (die Linsen)

| # | Linse | Vertritt (Konzepte) |
|---|---|---|
| L1 | **Kognitionspsychologie** | Noticing (Schmidt), Testing/Retrieval, Desirable Difficulties (Bjork) |
| L2 | **Spracherwerb / SLA** | Corrective Feedback (Li; Lyster & Ranta/Saito), Pushed Output (Swain), Focus on Form (Long) |
| L3 | **Schreibdidaktik** | Written-CF-Debatte (Truscott ↔ Ferris/Bitchener) |
| L4 | **Aussprache / Phonetik** | Computer-Assisted Pronunciation Training (CAPT), ASR-Feedback |
| L5 | **Motivation** | Affective Filter (Krashen), Selbstbestimmung (Deci & Ryan): Kompetenz + Autonomie |
| L6 | **Retention / Attrition** | Überlernen bis zur Automatik, Fehler früh verhindern |
| L7 | **Meta / Design-Regel** | Goodhart-Leitplanke: jede Zahl/Rückmeldung muss ein *wahres* Signal sein |

---

## 2. Befunde je Linse (verdichtet, mit Evidenz)

- **L2 · Korrektur-Feedback wirkt und hält.** Meta-Analyse: mittlerer Gesamteffekt **d = 0,64**, über die Zeit **stabil**. **[STARK]** — Li (2010). Im Klassenraum (mündlich) ebenfalls belegt, **Prompts** (zur Selbstkorrektur anregen) oft wirksamer als bloßes Vormachen. **[STARK]** — Lyster & Saito (2010); Taxonomie: Lyster & Ranta (1997).
- **L1 · Warum es wirkt: „Noticing".** Man lernt eine Form erst, wenn man die **Lücke bemerkt**; Feedback macht sie sichtbar. **[STARK]** als Heuristik — Schmidt (1990).
- **L2 · „Pushed Output".** Selbst produzieren *und* zu Genauigkeit gedrängt werden treibt den Erwerb — genau das tut getipptes/gesprochenes Antworten + Hinweis. **[STARK]** — Swain (1995).
- **L2 · Im Kontext, nicht als Grammatik-Drill.** Kurze Aufmerksamkeit auf die **Form innerhalb bedeutungsvoller Kommunikation** („Focus on Form") ist optimal — passt exakt zum Chunk-im-Kontext-Loop. **[STARK]** — Long (1991).
- **L3 · Die ehrliche Gegenstimme.** Truscott (1996) hielt schriftliche Fehlerkorrektur für „wirkungslos und schädlich". Widerlegt/relativiert durch Belege, dass **fokussierte, gut gemachte** Korrektur die Genauigkeit verbessert. **[STARK–mittel]**, Debatte bis heute — Truscott (1996) vs. Bitchener (2008), Ferris. *Lehre:* **gezielt und sparsam** korrigieren, kein Rotstift-Flächenbrand.
- **L4 · Aussprache per ASR: wirksam, aber heikel.** Meta-Analyse CAPT/ASR: mittlerer Effekt **g ≈ 0,69**, mit **explizitem** Feedback groß (**g ≈ 0,86**); **stark bei Einzellauten**, schwach bei Satzmelodie/Rhythmus. **[STARK]** für CAPT-mit-Feedback insgesamt — aber die **ASR-Genauigkeit bei Anfänger-Akzent ist ein echter Limiter** **[SCHWACH–mittel]** → Gefahr *falscher* Korrekturen.
- **L5 · Ton entscheidet.** Harte Korrektur hebt Angst/„Affective Filter" und demotiviert; sanftes, lernergesteuertes Feedback stärkt **Kompetenz + Autonomie**. **[SCHWACH–mittel]** als Konstrukt, motivational aber real — Krashen (1985); Deci & Ryan (2000).
- **L7 · Die Leitplanke.** Jede Rückmeldung ist auch ein Signal. Eine **falsche** Korrektur oder eine **erfundene „Genauigkeits-Prozentzahl"** koppelt vom echten Können ab → Goodhart, verletzt die eine Design-Regel. **[Leitplanke]** — Strathern (1997).

---

## 3. Der entscheidende Konflikt (und seine Auflösung)

Feedback ist **fürs Lernen** klar wertvoll (§2). Für **dieses Produkt** wird es aber an der einen Design-Regel gemessen: *nur wahre Signale.* Zwei konkrete Fallen:

1. **Falsch-Korrektur durch die KI.** Eine frei „korrigierende" KI kann eine **richtige** (oder eine *zulässige Variante*) als falsch markieren. Das ist der schädlichste Fall.
2. **Schein-Genauigkeit.** Eine hübsche „82 % korrekt"-Zahl (v. a. aus wackliger ASR) sieht nach Fortschritt aus, misst ihn aber nicht → Goodhart.

**Auflösung — drei Regeln:**
- **A. Zuerst dort, wo die Wahrheit feststeht.** Bei unseren **geprüften Seed-Chunks** kennen wir die Zielantwort. Feedback kann dort **deterministisch** sein (Vergleich getippt ↔ Ziel, Abweichung zeigen, sanfter Hinweis, Wiederholung erlauben) — **ohne KI-Irrtums-Risiko**. Das ist der sichere, sofort baubare Kern.
- **B. Freie KI-Hinweise nur als *Zweitmeinung* und *gekennzeichnet.*** Wo keine geprüfte Wahrheit vorliegt, darf die (Cloud-)KI *erklären* („warum") — aber **klar als „KI-Hinweis (nicht muttersprachlich geprüft)"** markiert und **konservativ** (im Zweifel nicht korrigieren, akzeptierte Varianten nicht anmeckern).
- **C. Keine Schummel-Zahl.** Lieber **qualitativer, umsetzbarer Hinweis** („‚sj' klang wie ‚sch' — versuch's weicher") als eine Prozent-Note. Produktions-Genauigkeit *darf* in die **ehrliche Messung** einfließen (der Produktions-Schritt existiert schon) — aber keine gamifizierte „Accuracy %".

---

## 4. Empfehlung (was, wie, wann)

**Urteil: Ja, fundamental — und es stärkt genau den schwächsten, wertvollsten Schritt (Produktion).** Umsetzung in der Reihenfolge „meiste echte Wirkung pro Risiko":

| # | Schritt | Evidenz | Träger | Risiko |
|---|---|---|---|---|
| **1** | ✅ **gebaut 2026-07-23.** Formatives Tipp-Feedback: **Abweichung** getippt↔Ziel (grün = fehlt, rot = zu viel), **ein** Hinweis, **„Nochmal versuchen"** (Pushed Output). Deterministisch gegen den geprüften Chunk — **keine KI, kein Irrtumsrisiko** (`answerCheck.ts` + `ComprehensionLoop.tsx`, 85 Tests grün). | [STARK] | 🤖 | **niedrig** |
| **2** | **Optionale KI-Erklärung (jetzt möglich).** Wenn Cloud-KI aktiv: kurzes „warum" zum Fehler, **als „KI-Hinweis" gekennzeichnet**, konservativ. Über den vorhandenen Port. | [STARK] Konzept | 🤖 + 🧑 (Anbieter) | mittel (Kennzeichnung!) |
| **3** | **Aussprache-Feedback per ASR (später, post-M1).** Zuerst **Einzellaute** (dort ist die Evidenz stark), **konservativ**, **keine Prozent-Note**, geprüfte Referenz. Braucht ASR-Anbieter-Entscheidung. | [STARK] mit Vorbehalt | 🧑 (Anbieter) + 🤖 | höher (ASR-Fehler) |

**Leitplanken für alles:** gezielt (ein Punkt), freundlich (Affective Filter), lernergesteuert (Autonomie), im **Erfolgsband ~80–85 %** (kein Rotstift-Cliff), und **jede sichtbare Zahl gegen Goodhart geprüft**.

---

## 5. Offene Entscheidungen (an dich)

1. **Schritt 1 jetzt bauen?** *Empfehlung: ja* — größter Hebel, kein Risiko, stärkt die Produktion.
2. **Freie KI-Korrektur (Schritt 2):** ok mit Pflicht-Kennzeichnung „nicht muttersprachlich geprüft" und konservativer Haltung?
3. **Aussprache/ASR (Schritt 3):** später; Anbieterwahl + Regel „keine Schein-Genauigkeit" + Einzellaute zuerst.

*Diese Punkte werden zusätzlich in `10-open-questions.md` geführt. Schritt 1 ist gebaut (2026-07-23); das Prinzip „Korrektiv-Feedback" steht mit Evidenzstufe in `02-science.md`.*

---

## 6. Umsetzung von Schritt 2 & 3 (Gremium — „Wie bauen")

### Schritt 2 — optionale KI-Erklärung („warum"), gekennzeichnet *(jetzt baubar)*

**Der Trick, der das Risiko fast auflöst:** Weil wir die **richtige Antwort schon kennen** (geprüfter Chunk + deterministisches Feedback aus Schritt 1), muss die KI **nicht urteilen, nur erklären**. Sie bekommt Ziel + Eingabe + bekannte Abweichung und formuliert 1–2 freundliche Sätze „warum" — die gefährlichste Fehlerquelle (Falsch-Korrektur) ist damit praktisch ausgeschlossen.

- **Wie:** neue Fähigkeit im Port (z. B. `Explainer.explain(ziel, eingabe)`), erster Adapter = Claude (erweitert `adapters/anthropic.ts`), an dieselbe BYOK-Einstellung angedockt.
- **Auslösung:** Knopf „🤖 Warum?" im Feedback-Panel — **opt-in, pro Klick** (Kostenkontrolle), nur bei aktiver Cloud-KI.
- **Ehrlichkeit:** Ergebnis klar als „KI-Hinweis (nicht muttersprachlich geprüft)"; konservativer Prompt („wenn die Eingabe eine akzeptable Variante ist, sag das; erfinde keine Fehler").
- **Aufwand/Risiko:** niedrig–mittel; testbar wie der Dekoder (reiner Prompt-Bau + Antwort-Parse + simuliertes Netz).

### Schritt 3 — Aussprache-Feedback per ASR *(post-M1)*

Live-Recherche (Juli 2026) — **drei Wege, mit ehrlichen Grenzen:**

| Weg | Was | Grenzen | Eignung |
|---|---|---|---|
| **Browser-Spracherkennung** (Web Speech API) | „nachsprechen → Transkript → mit Ziel vergleichen" | kostenlos, aber **streamt Audio an Google/Azure** (nicht lokal), Schwedisch schwach, **nur Transkript, keine Laut-Bewertung**, wackelig bei Akzent | billiges Experiment; **indirekt**, nur „moderat" wirksam |
| **Aussprache-Bewertungs-Dienst** (SpeechAce, Azure) | **Laut-/Silben-Bewertung** — genau die *explizite* Rückmeldung, die am stärksten wirkt (g ≈ 0,86) | **Cloud, kostenpflichtig, Audio verlässt das Gerät**; Anbieterwahl; Azure teils unzuverlässige Laut-Scores | der „echte" muttersprach-optimierende Weg |
| **On-device** (Whisper via WebGPU/WASM; neue ~17-MB-Engines) | lokal, datensparsam | Whisper = **nur Transkript**, schwer; Laut-Scoring on-device erst im Kommen, für Schwedisch/Browser **unbelegt** | zukünftig interessant, heute unreif |

- **Architektur:** passt in den bereits definierten `SpeechRecognizer`-Port — ein Adapter genügt, ohne App-Umbau.
- **Guardrails (die eine Design-Regel):** **keine Schein-Prozentzahl** für Ungemessenes; **Einzellaute zuerst** (dort starke Evidenz, Satzmelodie schwach); **konservativ + freundlich** („klang eher wie X — versuch Y", nie „falsch"); **Fehl-Hören** einkalkulieren → nur bei hoher Sicherheit anmerken, immer „trotzdem weiter" erlauben.
- **Empfehlung:** **post-M1 lassen** (so schon `09-roadmap.md`). Wenn drangenommen: **Laut-Bewertungs-Dienst hinter dem Port** + Guardrails; das freie Browser-„Nachsprechen" höchstens als klar gekennzeichnetes Experiment.

### Empfohlene Reihenfolge
1. **Schritt 2 jetzt** — klein, sicher, hoher Nutzen (die KI *erklärt* nur das schon bekannte Richtige).
2. **Schritt 3 nach dem M1-Beweis** — mit Anbieter-Entscheidung (Datenschutz/Kosten) und den Guardrails oben.

---

## Quellen (Live-Recherche, Juli 2026 — verifiziert)

- **Li, S. (2010).** The Effectiveness of Corrective Feedback in SLA: A Meta-Analysis. *Language Learning, 60*(2), 309–365. https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9922.2010.00561.x
- **Lyster, R., & Saito, K. (2010).** Oral Feedback in Classroom SLA: A Meta-Analysis. *Studies in Second Language Acquisition, 32.* https://www.researchgate.net/publication/234580927_Oral_Feedback_in_Classroom_SLA_A_Meta-Analysis
- **Lyster, R., & Ranta, L. (1997).** Corrective Feedback and Learner Uptake. *Studies in Second Language Acquisition, 19*(1), 37–66. https://l2aquisition.wordpress.com/wp-content/uploads/2017/06/corrective-feedback-over-a-decade-of-research-since-lyster-and-ranta-1997-where-do-we-stand-today.pdf
- **Truscott, J. (1996).** The Case Against Grammar Correction in L2 Writing Classes. *Language Learning, 46*(2), 327–369. — Debatte (2021): https://link.springer.com/article/10.1186/s40862-021-00110-9
- **Bitchener, J. (2008).** Evidence in Support of Written Corrective Feedback. *Journal of Second Language Writing, 17*(2), 102–118. https://www.sciencedirect.com/science/article/abs/pii/S1060374307000823
- **ASR-Aussprache — Meta-Analyse (ReCALL, Cambridge):** The effectiveness of automatic speech recognition in ESL/EFL pronunciation. https://www.cambridge.org/core/journals/recall/article/effectiveness-of-automatic-speech-recognition-in-eslefl-pronunciation-a-metaanalysis/A915444CF252B61D14961D2FE733822D
- **CAPT — systematisches Review (ReCALL, Cambridge):** Computer-assisted pronunciation training: A systematic review. https://www.cambridge.org/core/journals/recall/article/computerassisted-pronunciation-training-a-systematic-review/71E786F7DFC99727837909FDED7A2320
- **Web Speech API (MDN):** Grenzen der Browser-Spracherkennung. https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- **SpeechAce — Aussprache-/Laut-Bewertung (API-Doku):** https://api-docs.speechace.com/features/scripted-activities/pronunciation-scoring
- **Azure Pronunciation Assessment (Microsoft Learn):** https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment
- **Browser-Whisper-Landschaft 2026 (Überblick):** https://offlinetts.com/blog/browser-speech-recognition-whisper-comparison/
- **Klassiker (textlich):** Schmidt, R. (1990) Noticing, *Applied Linguistics 11*; Swain, M. (1995) Pushed Output; Long, M. (1991) Focus on Form; Krashen, S. (1985) Affective Filter; Deci & Ryan (2000) SDT; Strathern, M. (1997) Goodhart.

> **Anschluss:** Wissenschaft `02-science.md` · Messung/Ehrlichkeit `07-measurement.md` · Produkt-Loop `04-product.md` · Ports/KI `08-content-pipeline.md` · offene Entscheidungen `10-open-questions.md` · Weltklasse/Moat `gremium-weltklasse.md`.
