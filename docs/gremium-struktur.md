# Gremium — Kategorien & Struktur (Stufe-D-Beratung)

> **Ehrlicher Rahmen:** rollenbasierte Beratung (Stufe D), Fach-*Perspektiven*, keine echten Personen. Auftrag (Nutzer 2026-07-23): „Bau die App so auf, dass wir gewisse Kategorien und Strukturen dahinter haben." Diese Notiz hält die Struktur-Entscheidung fest, bevor sie ins Datenmodell wandert (CLAUDE.md: nicht still selbst entscheiden).

---

## 0. In einfachen Worten

Bisher war der Lernstoff **ein flacher Haufen** von Wendungen. Ab jetzt gehört jede Wendung zu einem **Thema** (z. B. „Im Café", „Begrüßen"). Das gibt dir drei Dinge: **Ordnung** (du siehst, worum es geht), **einen ehrlichen Überblick** (in jedem Thema: wie viel sitzt *bewiesen*), und **eine Wahl** (aus welchem Thema soll neuer Stoff zuerst kommen). Wichtig: Themen sind **kein „Level, das man abschließt"** — der Erinnerungs-Motor bestimmt weiter, was drankommt.

---

## 1. Die Gefahr (warum das heikel ist)

Die naheliegende Lösung — „Kategorie → Lektion → abhaken, 100 % erreicht" — ist genau die **Duolingo-Mechanik, die CLAUDE.md verbietet** und die **die eine Design-Regel bricht**: „100 % im Thema" wäre ein Fortschrittsbalken, der sich vom echten Können *abkoppelt*. Man hakt Lektionen ab und vergisst trotzdem (Goodhart). Struktur ja — aber ohne eine neue Schein-Zahl einzuführen.

## 2. Die Linsen (Kurz-Voten)

- **Lernwissenschaft:** Thematische Bündel helfen beim Enkodieren (verwandter Kontext), solange sie den **Spacing-/Wartungs-Rhythmus nicht überstimmen**. Erhalt schlägt Themen-Reihenfolge.
- **Content/Moat:** Themen sind das **Rückgrat der KI-Content-Fabrik** — die KI erzeugt Stoff *innerhalb eines Themas*, dadurch bleibt der Nachschub kohärent und die Abdeckung lesbar.
- **Motivation (Autonomie):** Den Lerner **wählen lassen, aus welchem Thema neuer Stoff kommt**, stützt Autonomie (`06-motivation.md`) — ohne ihn in eine feste Reihenfolge zu zwingen.
- **Meta/Ehrlichkeit (Goodhart-Leitplanke):** Der einzige erlaubte „Fortschritt" pro Thema ist die **gleiche ehrliche Zahl wie überall**: *bewiesen stabil* (`07-measurement.md`). Kein „Lektion erledigt".

## 3. Entscheidung (2026-07-23)

**Kategorie = Ordnungs- und Abdeckungs-*Linse* + Autonomie-Wahl für neuen Stoff — NICHT eine abzuschließende Lektion.**

Konkret gebaut (erste Scheibe):
1. **Datenmodell:** neuer Typ `Category`; jeder `Chunk` trägt eine `categoryId` (`src/domain/chunk.ts`). Vier Seed-Themen (`seedCategories`): Begrüßen & Kennenlernen · Sich verständigen · Im Café & Einkaufen · Unterwegs & Hilfe.
2. **Ehrliche Themen-Übersicht** (`CategoryOverview.tsx`, `categories.ts`): pro Thema „**X von Y bewiesen stabil**" (+ aktiv/fällig). Der Balken zeigt den Anteil *bewiesen* stabiler Wendungen — dieselbe Messung wie global, kein Anwesenheits-Balken.
3. **Fokus-Wahl** (`session/focus.ts`): der Lerner tippt ein Thema an → **neuer** Stoff kommt bevorzugt daraus (`buildQueue` mit `NewFocus`). **Fällige Wiederholungen bleiben unberührt** — Erhalt geht vor, immer. Lokal gespeichert.

**Warum das die Design-Regel wahrt:** Die einzige Zahl pro Thema ist *bewiesen stabil*; nichts belohnt bloßes Anklicken oder Abschließen. Man „erledigt" ein Thema nie — die Wartung hält es lebendig.

## 4. Bewusst (noch) NICHT gebaut

- Kein Thema-„Abschluss", kein Prozent-Ziel, kein Freischalt-Pfad (verletzt die Regel / Anti-Ziele).
- Kein feiner Grad an Leveling *innerhalb* eines Themas (Anteil bekannter vs. neuer Chunks) — das gehört zur nächsten Moat-Ausbaustufe (`08-content-pipeline.md`).
- Keine Lerner-Anlage neuer Themen, kein Sortieren/Verstecken — später, wenn ein echter Bedarf da ist (Umfangsdisziplin).

## 5. Offen

- Wie werden Themen genau geschnitten, wenn der KI-Content wächst (Größe, Überlappung)? → `10-open-questions.md`.
- Sollen Themen eine grobe Reihenfolge/Empfehlung tragen (Anfänger-Pfad), ohne zur Klippe zu werden? Später prüfen.

## 6. Erweiterung 2026-07-23 (abends) — echter Baum: Bereich → Thema → Wendung

**Auftrag (Nutzer):** „Bau einen vernünftigen Baum mit Themen, dass man sich nicht in
die Ewigkeit scrollen muss … Kategorien für Reisen, für Einkaufen … und dann darunter
die Unterpunkte." → Also **eine Ebene mehr über dem Thema**, damit die Startseite kurz
bleibt und der Stoff wie bei den Top-Apps flach durchsuchbar ist.

**Entscheidung:** Drei Ebenen statt zwei — **Bereich (`Area`) → Thema (`Category`) →
Wendung (`Chunk`)**. Ein Bereich ist dieselbe *ehrliche Linse* wie ein Thema (kein Kurs
zum Abschließen); seine Zahl ist die **Summe** der ehrlichen Themen-Zahlen darunter
(*bewiesen stabil* von gesamt) — kein neuer Schein-Indikator (die eine Design-Regel bleibt gewahrt).

Konkret gebaut:
1. **Datenmodell:** neuer Typ `Area`; jede `Category` trägt eine `areaId` (`src/domain/chunk.ts`).
2. **Aggregation:** `areaProgress()` (`progress/categories.ts`) summiert die Themen je Bereich; leere Bereiche fallen weg (kein Phantom-Eimer).
3. **Navigation:** Übersicht → Bereich → Thema → Session (`AreaOverview.tsx`, `AreaDetail.tsx`, `App.tsx`), mit richtungsabhängigen View-Transitions und kontextuellem „Zurück".
4. **Üben pro Ebene:** „Diesen Bereich üben" / „Dieses Thema üben"; unscoped bleibt der ehrliche globale Fällig-Satz (die Memory-Engine treibt den Loop). Der Themen-Fokus biast nur **neuen** Stoff, nie die Wiederholungen.

**Startbestand (Seed, nicht muttersprachlich geprüft):** 6 Bereiche · 17 Themen · 98 Wendungen ·
195 Kontexte. Bereiche: Erste Schritte · Reisen & Unterwegs · Essen & Café · Menschen & Alltag ·
Einkaufen · Notfall & Gesundheit.

> **Anschluss:** Moat/Content `08-content-pipeline.md` · Messung `07-measurement.md` · Motivation/Autonomie `06-motivation.md` · Roadmap-Standort `gremium-naechste-schritte.md` · offene Punkte `10-open-questions.md`.
