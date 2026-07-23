# Gremium — Schwedische Aussprache lernen (Stufe-D-Beratung + Umsetzung)

> **Ehrlicher Rahmen**
> - Rollenbasierte Beratung (Stufe D). Fach-*Perspektiven*, keine echten Personen; keine erfundenen Zitate.
> - Sprachfakten sind **Beschreibungen der schwedischen Phonologie** (gut belegt), mit Evidenzstufen und verifizierten Quellen (Live-Recherche Juli 2026, unten).
> - **Auftrag (Nutzerwunsch 2026-07-23):** die schwedische *Lautsprache* anschauen, aus Regeln/Lehrbüchern **ableiten, wie man ausspricht**, und das ins Lernen einbauen — dann bauen.
> - **Kern-Entscheidung:** Wir bauen die **Aussprache-Anleitung** (deterministisch, on-device, ehrlich). Die Aussprache-*Bewertung* per Spracherkennung (ASR) bleibt getrennt und **post-M1** (`gremium-feedback.md` §6).

---

## 0. In einfachen Worten

Schwedisch schreibt sich fast wie man's spricht — **außer bei einer Handvoll Stolpersteinen**, die für Deutsche ungewohnt sind (z. B. der „sj"-Laut, das „o", das oft wie „u" klingt). Diese Regeln sind **fest und bekannt**. Also lassen wir die App **aus der Schreibweise ableiten**, welche Stolpersteine in einem Satz stecken, und zeigen dazu einen **kurzen, deutschfreundlichen Tipp** — ganz ohne Mithören, ohne Internet, ohne Fehlerrisiko. Genau das ist jetzt gebaut.

---

## 1. Die kniffligen schwedischen Laute für Deutsch-Muttersprachler *(die Ableitungs-Regeln)*

Evidenz: Die Laut-Schreib-Zuordnungen sind **[FELS]** (etablierte Phonologie); *explizite* Ausspracheschulung von **Einzellauten** wirkt **[STARK]** (CAPT, `gremium-feedback.md`); Tonakzent (Satzmelodie) **[SCHWACH–mittel]**.

**Konsonanten:**
- **sje-Laut /ɧ/** — geschrieben `sj, skj, stj, sk`+weicher Vokal, `sch`, Endung `-tion`. Tiefes, gehauchtes „sch" ohne genaue deutsche Entsprechung; **regional verschieden** (Süd [xʷ], Nord [ʂ]).
- **tje-Laut /ɕ/** — geschrieben `tj, kj, k`+weicher Vokal. Weiches „sch"/„ch-in-ich" (z. B. `köpa`, `kilo`).
- **Weiches g** — `g`+weicher Vokal (und `gj`) klingt wie „j": `ge` ≈ „je", `göra` ≈ „jöra".
- **Harte vs. weiche Vokale:** weich = **e, i, y, ä, ö**; hart = a, o, u, å. Vor harten Vokalen bleiben g/k/sk hart.
- **Retroflexe:** `rd, rt, rn, rl` → r verschmilzt mit dem Folgekonsonanten zu einem Laut [ɖ ʈ ɳ ɭ]; `rs` → [ʂ] („sch"). Fehlt im Süden (uvulares r).

**Vokale (9 Qualitäten, lang/kurz):**
- **o** klingt **oft wie deutsches „u"** (`bok` ≈ „buuk") — klassische Falle.
- **u** /ʉː/ sehr rund, weit vorne — **kein** deutsches „u".
- **å** /oː/ ≈ deutsches langes „o"; **y** ≈ „ü"; **ä** ≈ „ä"; **ö** ≈ „ö".

**Häufige Reduktionen (wort-genau):** `jag`→„jaa", `och`→„ok/o", `det`→„de", `de`→„dom", `mig/dig/sig`→„mej/dej/sej", `vad`→„vaa", `med`→„me(d)". *(Ehrlich: kein lückenloses Regelwerk — Rest übers Hören.)*

---

## 2. Wie wir es bauen (Entscheidung des Gremiums)

**Deterministische Regel-Engine statt KI/ASR:** `src/modules/comprehension/pronunciation.ts` scannt die Schreibung eines Segments auf die obigen Muster und liefert **kurze, deutschfreundliche Hinweise** (`pronunciationTips(sv)`), begrenzt und dedupliziert. Angezeigt als **„🗣️ Aussprache"-Hilfe** im Loop (immer verfügbar, kostenlos).

**Warum so — und nicht ASR-Bewertung?**
- **Ehrlich & sicher:** feste Sprachregeln → **kein Fehl-Hören, keine Falsch-Korrektur, keine Schein-Prozentzahl** (die eine Design-Regel).
- **On-device:** kein Anbieter, keine Kosten, nichts verlässt das Gerät; passt zu „schlank + keine Drittanbieter zur Laufzeit".
- **Skaliert:** funktioniert auch für später KI-generierte Sätze, weil es aus der Schreibung ableitet.
- Ergänzt die vorhandene **Audio-Ausgabe** („▶︎ Hören", „🐢 langsam"): *hören* + *verstehen, warum* = starke Kombination (Focus on Form).

**Guardrails/Ehrlichkeit:**
- **Kein IPA-Volltranskript** (wäre fehleranfällig) — nur belastbare Einzel-Hinweise.
- **Regionale Varianz** benannt (sje-Laut, Retroflexe).
- Vokal-Fallen als „oft, nicht immer" formuliert.

---

## 3. Was offen bleibt (post-M1)

- **Aussprache-*Bewertung* (ASR):** „habe ich es richtig gesagt?" — Wege & Guardrails in `gremium-feedback.md` §6 (Laut-Bewertungs-Dienst hinter dem `SpeechRecognizer`-Port; keine Schein-Zahl). **Anbieter-Entscheidung nötig.**
- **Tonakzent (accent 1/2):** kulturell wichtig, Evidenz schwächer → später, vorsichtig.
- **Natürliches TTS + Audio-QS** für Einzellaute (mit der Content-Pipeline).

---

## Quellen (Live-Recherche, Juli 2026 — verifiziert)

- **Swedish phonology (Wikipedia):** Vokalsystem, Retroflexe. https://en.wikipedia.org/wiki/Swedish_phonology
- **Sj-sound (Wikipedia):** sje-Laut, Schreibungen, regionale Varianz. https://en.wikipedia.org/wiki/Sj-sound
- **Elon.io — Tricky Consonant Spellings:** g/k/sk vor weichen Vokalen. https://elon.io/grammar/swedish/pronunciation/consonant-spellings
- **Elon.io — Retroflex Consonants:** rd/rt/rn/rl/rs. https://elon.io/grammar/swedish/pronunciation/retroflex-assimilation
- **Glottopedia — Swedish Phonology:** http://www.glottopedia.org/index.php/Swedish_Phonology
- **Omniglot — Swedish:** Überblick Alphabet/Aussprache. https://www.omniglot.com/writing/swedish.htm

> **Anschluss:** Wissenschaft `02-science.md` · Produkt-Loop `04-product.md` · Feedback/ASR `gremium-feedback.md` · offene Entscheidungen `10-open-questions.md`.
