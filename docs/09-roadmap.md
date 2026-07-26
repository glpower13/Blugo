# 09 — Roadmap, Meilensteine, Prioritäten

## M0 — Konzept & Doku (abgeschlossen)
- README, CLAUDE.md, vollständige `/docs`.
- Evidenzstufen in `02-science.md` mit Primärquellen.
- Kein Anwendungscode.
- **Abnahme (Definition of Done):** siehe `CLAUDE.md` — erfüllt.

## M1 — schlankes MVP (aktuell, der Beweis)
Ziel: den Lern-Loop an *einem echten Lerner* wirksam zeigen.

**Framework (steht):**
- Installierbare, offline-fähige PWA, mobil-first (Vite + React + TS + Tailwind + `vite-plugin-pwa`). Stack-Begründung: `05-architecture.md`.
- Comprehension-Loop: Begegnung → gestufte Hilfen (Dekodierung/Übersetzung) → Abruf-Check → Logging.
- Memory-Engine minimal: echtes Spacing, Stufen-Promotion (Wiedererkennen → Produktion), Wartung fälliger Chunks; lokale Speicherung (IndexedDB).
- Ehrliche Fortschrittsanzeige (aktive/stabile Chunks, lebendes Gedächtnisfeld) mit strenger „stabil"-Definition (`07-measurement.md`).
- Unit-Tests für Scheduling & Messung, Lint und Build grün.

**Offen (bis zum M1-Beweis):**
- **~20 handgeprüfte** schwedische Segmente (Audio + Dekodierung) statt der Platzhalter.
- Feinschliff des Loops (Produktionsabruf, Kontextvariation über mehr Segmente, Verständnis-Abdeckung).
- Deployment über HTTPS, damit „Zum Startbildschirm hinzufügen" auf dem Handy real nutzbar ist.
- **Erfolgskriterium:** Chunks bleiben nach mehrwöchiger Pause messbar stabiler als bei reinem Wiederholen ohne Spacing/Wartung.

## Später (nicht vor MVP-Beweis)
- Content-Pipeline automatisieren + QS skalieren.
- Produktion/Aussprache (ASR), Interleaving ausbauen.
- Weitere Level, weitere Sprachpaare.
- Mobile, Sync/Offline, Konten.
- Optionale Features aus `11-ideas.md`.

## Priorisierungsregel
Was den *Erhalt* messbar verbessert, hat Vorrang. Alles, was nur Engagement erhöht, wird abgelehnt oder geparkt.

> **Standortbestimmung & Reihenfolge nach vorn (2026-07-23):** `gremium-naechste-schritte.md`. Kernbotschaft: Der schnellste Weg zum Ziel führt über **Inhalt (Moat) + Beweis (Deploy)**, nicht über mehr Features. Premium-Design (edel, herausragend, nicht generisch) als **Nordstern jetzt**, volle Umsetzung **nach** der Substanz.

---

## Stand 2026-07-25 — Schwedisch in die Breite gebaut, mit Meilensteinen

Nach der Entscheidung „**erst Schwedisch fertig machen**" (statt sofort Englisch
danebenzustellen) ist der Inhalt in die Breite gegangen:

| | vorher | jetzt |
|---|---|---|
| Bereiche | 8 | **11** |
| Themen | 30 | **55** |
| Wendungen | 179 | **379** |
| Segmente (Kontexte) | 434 | **934** |
| Kontexte je Wendung | 2,70 | **2,89** |

Neu dazugekommen sind unter anderem: Zeit & Uhrzeit, Tage & Jahreszeiten, Fika,
Sprache & Lernen, Small Talk (A1) · Bank, Post & Formulare, Kleidung, Apotheke,
Termine, Einladen & Absagen, Reise planen, Kinder & Schule (A2) · Gefühle,
Reklamation, Medien, Feste & Traditionen, Bewerbung, Meinung & Begründung (B1) ·
Diskutieren, Umwelt & Gesellschaft, Verhandeln, Erzählen, Nuancen,
Redewendungen (B2).

**Warum Meilensteine dazugehören.** Ohne sie ist „379 Wendungen" nur eine
größere Zahl. Mit ihnen beantwortet die App die Frage „wo stehe ich?" — und zwar
mit derselben harten Messlatte wie überall sonst: erreicht ist ein Meilenstein
erst, wenn ≥ 90 % seiner Wendungen **bewiesen** sind. Details und die Grenzen
der Aussage: `07-measurement.md`, Nachtrag (2).

**Was dabei ausdrücklich NICHT behauptet wird.** Der Inhalt ist maschinell
vorgeprüft (jedes Wort ist echtes Schwedisch, Wörterbuch + Korpus), aber
Wortstellung, Idiomatik und Ton hat niemand gegengelesen. Es gibt in diesem
Projekt keine schwedischsprachige Person dafür, und deshalb gibt es dafür auch
keinen Zähler mehr — nur den Satz, der die Grenze nennt
(`content-review-schwedisch.md`).

**Gespräche nachgezogen (2026-07-25, gleicher Tag).** Der Lern-Loop übt eine
Wendung isoliert; ein Gespräch verlangt sie an der richtigen Stelle, mit einer
Antwort davor und danach. Ein Thema ohne Szene bleibt deshalb halb geübt.

| | vorher | jetzt |
|---|---|---|
| Gespräche | 15 | **55** |
| Themen mit Gespräch | 15 von 55 | **55 von 55** |
| Wendungen, die in einem Gespräch vorkommen | 59 | **293** |
| Gesprächszeilen | 172 | **622** |

Dazu vier neue Kulissen (`office`, `home`, `street`, `school`): vorher liefen
über zwanzig Szenen auf der leeren Notfall-Fläche `generic` — eine Figur auf
dunklem Grund. Jetzt hat jedes Gespräch einen Ort, den man in einem Blick
erkennt.

**Und dann die letzten 86 (gleicher Tag).** Nach den 55 Themenszenen kamen
86 Wendungen in keinem Gespräch vor, meist zwei pro Thema. Eine eigene Szene
für zwei Wendungen wäre Füllmaterial gewesen; stattdessen ziehen 13 **gemischte
Szenen** die Reste verwandter Themen zusammen — im Laden geht es dann um Größe,
Umtausch UND Reklamation, so wie im echten Leben. Das ist nicht der Kompromiss,
sondern der bessere Fall: Wer zwischen Themen wechseln muss, ruft härter ab
(Interleaving, `02-science.md`).

**Endstand Gespräche:** 68 Szenen · 794 Zeilen · **379 von 379 Wendungen** kommen
in mindestens einem Gespräch vor · jedes der 55 Themen hat eine Szene.

Zwei Sperrklinken in `seedContent.test.ts` halten das: jedes Thema braucht ein
Gespräch, und mindestens 90 % der Wendungen müssen in einem vorkommen (etwas
Luft, damit neuer Stoff zuerst im Loop landen darf — aber nie so viel, dass der
Gesprächs-Modus wieder zur halben Fläche wird).


---

## Nachtrag (2026-07-26): Startpilot und Inhalts-Ausbau

**Der Startpilot** schließt die Lücke am Anfang. Der Inhalt begann bei
„hur mår du?"; wer noch nie ein schwedisches Wort gesehen hat, stand davor wie
vor einer Wand. Sechzehn Ein-Wort-Äußerungen, je vier begegnen und dieselben
vier abfragen — in etwa fünf Minuten. Danach übernimmt der normale Loop: Beim
Nachmessen enthielt die erste Sitzung genau die Wörter, die in der Probe noch
gewackelt hatten, diesmal in ganzen Sätzen. Genau so soll die Übergabe aussehen.

Er wird nur angeboten, solange **kein einziger Abruf gelungen** ist — sonst
stünde „Fang hier an" vor jemandem, der schon hundert Wendungen kann.

**Der Inhalt** ist in vier Schüben um sechzehn Themen gewachsen:

| Schub | Themen |
|---|---|
| Start | Die ersten Wörter |
| 1 | Am Flughafen · Internet & Technik · Kochen & Rezepte · Beim Friseur |
| 2 | Haustiere · Zelten & Allemansrätten · Musik & Konzerte · Nachbarn & Hausordnung |
| 3 | Beim Zahnarzt · Studium & Kurse · Umzug & Wohnungssuche · Schwimmhalle & Sauna |
| 4 | Farben & Beschreiben · Feiern & Geburtstag · Garten & Balkon · Verein & Ehrenamt |
| 5 | Allergien & Ernährung · Beim Tierarzt · Reparieren zu Hause · Kino & Theater |

Stand: **12 Bereiche, 76 Themen, 534 Wendungen, 1287 Kontext-Sätze, 90
Gespräche.** A1 wuchs von 108 auf 138 — bewusst, weil der Bestand zuletzt vor
allem oben gewachsen war.

„Allergien & Ernährung" steht bewusst weit vorn im Essens-Bereich: Es ist das
einzige Thema dieser App, bei dem ein nicht verstandener Satz gefährlich werden
kann.

**Ein zwölfter Bereich** kam dabei nicht aus dem Stoff, sondern aus dem Ansehen:
„Menschen & Alltag" war auf dreizehn Themen gewachsen und enthielt gleichzeitig
„Alltag & Small Talk" und „Small Talk". Die vier Wohn-Themen bilden jetzt
„Wohnen & Nachbarschaft"; vier Tests halten den Baum lesbar (keine doppelten
Namen, kein Name im anderen enthalten, höchstens zehn Themen je Bereich,
eindeutige Sortierung).
