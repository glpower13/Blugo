# Gremium — Prüfung: Lernt man damit wirklich? (Stufe-D, kritisch)

> **Ehrlicher Rahmen:** rollenbasierte Beratung (Stufe D), Fach-*Perspektiven*, keine echten Personen, keine erfundenen Zitate. Auftrag (Nutzer 2026-07-23): „Testet die App auf und ab und sagt mir ehrlich, ob Lernerfolg eintritt — ob man so lernen kann oder ob das Quatsch ist." Bewusst **kritisch**, kein Schönreden. Evidenzstufen wie in `02-science.md`: **Fels / stark / schwach / widerlegt.**

---

## 0. Das ehrliche Urteil (zuerst)

**Kein Quatsch.** Die *Art* zu lernen ist auf den **best-belegten Prinzipien** für dauerhaftes Sprachenlernen gebaut. Wenn die App mit echtem, geprüftem Inhalt gefüllt und **regelmäßig** genutzt wird, *sollte* echter, bleibender Lernerfolg entstehen — bei Erhalt sogar besser als bei den üblichen Apps, weil hier nur **bewiesenes** Können zählt.

**ABER, genauso ehrlich:** Bewiesen ist das **an echten Menschen noch nicht** — kein Lerner hat sie über Wochen genutzt, es gibt **keine Messdaten**. Und es fehlt der **Inhalt**: ~11 handgeschriebene Sätze, ein Level, **nicht** muttersprachlich geprüft. Kurz: **Ein wissenschaftlich richtiger Motor — der aber fast keinen Sprit im Tank hat und noch keine Probefahrt hinter sich.**

---

## 1. Was geprüft wurde (Durchgang durch die gebaute App)

Übersicht → Thema-Detail (einzelne Wendungen) → Session (Begegnung, Hilfen, Abruf, Selbstnote), neuer vs. bekannter Satz, Produktion mit Lücke, Einstellungen. Technisch **läuft sie sauber durch** (E2E grün, keine Fehler). Bewertet wird hier aber nicht „läuft", sondern **„lernt man"**.

## 2. Die Linsen (ehrliche Einzel-Voten)

- **SLA / Spracherwerb:** Der Kern — **verständlicher Input in der Zielsprache + aktiver Abruf** — ist genau das, was Erwerb erzeugt. Richtig gebaut. **[Fels/stark]**
- **Gedächtnisforschung:** **Spacing** (Wiederholung am Vergessenspunkt, FSRS) ist *der* Hebel für Langzeit-Erhalt — das eigentliche Versprechen der App. Mechanik sitzt. **[Fels]** Effizienz von FSRS ist aus Simulation, nicht aus unserem Test — ehrlich so gekennzeichnet.
- **Didaktik/Lehrkräfte:** **Chunk-im-Kontext** statt Vokabelliste, **Lückentext** bei Produktion, **Stütze die verblasst** — methodisch sauber. Schwäche: **nur ein Level**, „i+1" ist noch grob (Platzhalter-Stufe), also die Feindosierung der Schwierigkeit fehlt.
- **Retention/Attrition:** Der **Wartungsmodus** (ewiger Erhalt) adressiert genau das Abfallen nach Wochen. Konzept stark **[Fels-nah]**, aber **in der Praxis ungetestet**.
- **Sprechen/Hören:** **Größte Lücke.** TTS ist nur die Geräte-Stimme (roboterhaft), **keine ASR** — Aussprache ist nur *Anleitung*, kein geprüftes Sprechen. Wer flüssig sprechen will, bekommt hier (noch) zu wenig.
- **Meta/Ehrlichkeit (Goodhart-Leitplanke):** **Stärke und Alleinstellung.** Jede Zahl ist ein *wahres* Signal (nur `provenStableAt` zählt als „stabil"). Die App **lügt dich nicht an** über deinen Fortschritt — anders als XP/Streak-Apps, die Aktivität statt Können belohnen.

## 3. Wirkt der Lernerfolg? — pro Mechanik, ehrlich

| Mechanik | Wirkt sie? | Evidenz |
|---|---|---|
| Verständlicher Input (Zielsprache zuerst, Bedeutung verfügbar) | ja, Kern des Erwerbs | **Fels** |
| Aktiver Abruf (Wiedererkennen, Tippen, Lückentext) | ja, schlägt Wiederlesen deutlich | **stark** |
| Spacing / FSRS (Wiederholung am Vergessenspunkt) | ja — der Erhalt-Hebel | **Fels** (Spacing); FSRS-Effizienz: **stark**, simuliert |
| Chunk im Kontext, Kontextvariation | ja | **stark** |
| Ehrliche Messung (nur bewiesen = stabil) | schützt vor Selbstbetrug | Design-Prinzip |
| Birkenbihl-Dekodierung als Encoding-Hilfe | plausibel, kein starker Direktbeleg | **schwach–mittel** |
| Passives Hintergrund-/Schlaf-Hören | **wird nicht gebaut** | **widerlegt/schwach** |

## 4. Wo es (noch) NICHT trägt — die harten Punkte

1. **Inhalt = fast leer.** Mit 11 Sätzen lernt niemand Schwedisch. Der Moat (KI-Content) ist erst eine Scheibe; die **muttersprachliche Qualitätssicherung fehlt** → Fehler-Risiko im Kern.
2. **Null Praxis-Beweis.** Kein echter Lerner über Wochen, **keine Erhalts-Messung**, kein A/B. Das Versprechen ist *geliehen* aus der Literatur, nicht *gemessen* an uns.
3. **Sprechen/Hören unterentwickelt** (keine ASR, Roboter-TTS).
4. **Adhärenz ist die Wette.** Erhalt entsteht nur, wenn man **wiederkommt**. Die App verzichtet bewusst auf manipulative Streaks (ehrlich, richtig) — ob echte Fortschritts-Signale allein genug ziehen, ist **unbewiesen**.
5. **„Stabil"-Schwelle & i+1** noch grob operationalisiert (`10-open-questions.md`).

## 5. Verdikt

- **Lernt man so? — Ja, das ist die richtige Art.** Begegnen → Abrufen → am Vergessenspunkt wiederholen → erhalten: genau der Weg, den die Forschung für *dauerhaftes* Können stützt. **Nicht Quatsch.**
- **Ist der Erfolg bewiesen? — Nein, noch nicht.** Er ist **plausibel und gut begründet**, aber an *dieser* App **ungemessen**.
- **Was den größten Unterschied macht (Reihenfolge):** (1) **echter, geprüfter Inhalt** (Moat + Muttersprachler-QS), (2) **live schalten + ein echter Lerner über Wochen** (der M1-Beweis, `09-roadmap.md`), (3) Sprechen/Hören ausbauen.

> Kernsatz fürs Protokoll: **Der Motor ist wissenschaftlich richtig gebaut. Jetzt braucht er Sprit (Inhalt) und eine Probefahrt (echter Lerner) — dann wird aus „sollte wirken" ein „wirkt nachweislich".**

## 6. Wie wir Lernerfolg ehrlich messen würden (Testdesign)

- **Kleine Selbsttests** nach Tagen/Wochen (Erhalt statt Tagesform) — schon vorhanden: `provenStableAt`.
- **Verzögerter Nachtest** (1–4 Wochen) vs. sofort — misst *Erhalt*, nicht Kurzzeit.
- **A/B**: Spacing an vs. aus → zeigt, ob unser Kern-Versprechen greift.
- **Adhärenz-Kurve**: kommen echte Nutzer ohne Streak-Druck wieder?

> **Anschluss:** Wissenschaft `02-science.md` · Methode `03-method.md` · Messung `07-measurement.md` · Roadmap/Beweis `09-roadmap.md` · Content/Moat `08-content-pipeline.md` · Darstellung `gremium-darstellung.md` · offene Punkte `10-open-questions.md`.
