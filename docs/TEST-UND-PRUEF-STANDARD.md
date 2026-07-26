# Test- & Prüf-Standard (portabel für Claude Code)

> **Eine Datei. Ein Verfahren. Für jedes Projekt.**
> Diese MD beschreibt, **wie ein Baustein geprüft wird, bevor er als „fertig" gilt** —
> risikobasiert, adversarial, mit Screen-/Druck-Prüfung, Regression, ISTQB und
> Stabilitätstests. Sie ist **projektunabhängig** geschrieben: der einzige
> projektspezifische Teil ist der **Adapter (§8)** — den einmal je Repo ausfüllen,
> alles andere bleibt wie es steht.
>
> **So einsetzen:** diese Datei ins Repo legen (z. B. `docs/TEST-UND-PRUEF-STANDARD.md`),
> in der `CLAUDE.md`/`AGENTS.md` einen Satz ergänzen: *„Vor jedem ‚fertig' die
> Prüfkaskade aus `docs/TEST-UND-PRUEF-STANDARD.md` durchlaufen."* — dann §8 ausfüllen.

---

## 0. Grundhaltung (die Regeln, die alles tragen)

1. **Kein Baustein ist fertig, solange eine Stufe der Kaskade (§2) fehlt.** „Läuft bei
   mir" ist kein Nachweis. Der Nachweis ist ein **grüner, reproduzierbarer Lauf** +
   **eigenes Ansehen** des Ergebnisses.
2. **Befunde immer selbst gegenprüfen.** Ein adversarialer Agent/Review liefert
   Verdachtsfälle — jeder wird am Code verifiziert, bevor er als Bug gilt und bevor
   ein Fix gebaut wird. **Keine Falschmeldung übernehmen, keinen Fix ins Blaue.**
3. **Ehrlicher Bericht.** Schlägt ein Test fehl → das sagen, mit Ausgabe. Wurde ein
   Schritt übersprungen → das sagen. Erst wenn alles grün und angesehen ist, „fertig"
   ohne Weichzeichnen.
4. **Reproduzierbar & isoliert.** Jeder Test setzt seinen Zustand selbst auf und räumt
   auf; er darf keine echten Daten/Ordner/Ports des Betriebs anfassen.
5. **Datenhygiene.** Tests nutzen **ausschließlich FAKE-Daten**. Nie echte Namen,
   E-Mails, Preise, Zugangsdaten, Pfade in Testdaten oder ins Repo.
6. **Regression ist Pflicht, nicht Kür.** Nach jedem Baustein läuft der **ganze**
   Test-Bestand der schnellen Stufe (§2 C), nicht nur der neue Test. Der häufigste
   Schaden ist der stille Bruch eines Nachbarmoduls.

---

## 1. Wann geprüft wird

- **Nach jedem Baustein** (Feature/Fix): Kaskade **A → E** (Syntax → funktional →
  Regression → adversarialer Faktencheck), minimal.
- **An jedem Modul-Meilenstein** (Modul „im Kern fertig", vor Produktivbetrieb, nach
  einer großen Welle): **zusätzlich F (ISTQB)** — mit Bericht.
- **Vor Release / bei kritischer Infrastruktur** (Server, Auth, Datenpfade, Geld):
  **zusätzlich G (Stabilität/Realismus)**.
- **Stehende Regel:** Wird überhaupt ein Prüf-/Gremium-/Stabilitätslauf gemacht,
  gehört der **ISTQB-Durchlauf im Anschluss fest dazu** — ein Gremiumstest ohne
  nachgelagerten ISTQB gilt als unvollständig.

---

## 2. Die Prüfkaskade A–G (in dieser Reihenfolge)

### A · Syntax / statische Prüfung (Sekunden, immer zuerst)
- Alle geänderten + alle vom Projekt getragenen Quelldateien durch den
  Syntax-/Typcheck (`node --check`, `tsc --noEmit`, `ruff`/`mypy`, `go vet`, …).
- Fängt den mit Abstand häufigsten Regressionsfall (Tippfehler in einem Template,
  ein `}` zu viel) in Sekunden. Läuft **in jeder Stufe** als Erstes.

### B · Funktionale Headless-Verifikation (der Kern)
Das geänderte Verhalten **real ausführen** und die Wirkung prüfen — nicht die
Existenz von Code behaupten. Für UI: Headless-Browser; für Logik: die echten
Funktionen aufrufen (nicht nachbauen). Jede B-Prüfung deckt ab:
- **Funktion:** die neue Fähigkeit tut, was sie soll (positiv **und** negativ —
  auch der Fehl-/Leerfall).
- **0 Konsolenfehler** (Netzwerk-/Favicon-Rauschen herausfiltern).
- **Ansehen (Pflicht):** Screenshot/Render **hell + dunkel** und — bei druckbaren
  Artefakten — **Druck** (Seitenumbruch, Kopf/Fuß je Seite, nichts abgeschnitten).
  Der Validator prüft Farbe/Logik, **nicht** Layout — Layout muss man ansehen.
- **Rollen/Rechte:** wo Berechtigungen greifen, jede relevante Rolle prüfen —
  besonders **fail-closed** (unberechtigt = kein Zugriff, auch bei Direktaufruf).

### C · Zentrale Regression (der ganze Bestand)
- **Ein** Befehl, der Syntax + alle schnellen Modul-Tests fährt (§8 Adapter).
- Läuft **immer komplett** (keine „nur geänderte Tests"-Auswahl — zu fragil).
- Exit-Code ≠ 0 bei irgendeinem Rot → CI-tauglich.
- Neuen Test **sofort** in den zentralen Lauf eintragen (sonst verrottet er).

### D · Rollen-Gremium (bei größeren Bausteinen)
- 3–5 Perspektiven, die das Feature im Alltag benutzen (fach-/rollen-typisch),
  prüfen kritisch: was fehlt, was ist unklar, wo bricht es im echten Ablauf.
- **Beleg-Pflicht:** jeder Befund mit Datei:Zeile / reproduzierbarem Schritt.
- Ergebnis: priorisierte Liste **P1 (blockierend) / P2 / P3** + Gesamturteil.

### E · Adversarialer Faktencheck (Code-Review gegen sich selbst)
- Den Diff **feindlich** lesen: Rechen-/Grenzwertfehler, Zustandsübergänge,
  Nebenläufigkeit/Race, Escaping/Injektion, fail-open-Lücken, stiller Datenverlust.
- Am wirksamsten mit **parallelen Prüf-Linsen** (je eine für Rechnung/Grenzwerte,
  eine für Sicherheit/Escaping, eine für Integration/Zustand).
- **Jeden Befund selbst am Code gegenprüfen** (§0.2), dann fixen, dann re-verifizieren.

### F · ISTQB-Durchlauf (am Modul-Meilenstein, Pflicht)
Strukturiertes Testdesign statt Bauchgefühl — deckt genau die Randklassen auf, die
die ad-hoc-Läufe übersehen:
- **Risikobasierte Priorisierung** (was tut am meisten weh, wenn es falsch ist).
- **Zustandsübergangs-Tests** für Lebenszyklen/Workflows (jeder erlaubte + verbotene
  Übergang).
- **Entscheidungstabellen** für Regelverzweigungen (jede Kombination der Bedingungen).
- **Grenzwertanalyse (BVA)** für Schwellen (genau darunter / genau auf / genau
  darüber; 0/leer/negativ/Überlauf).
- **Statische Prüfung** (adversariales Review, siehe E).
- **Bug-Log** mit codebelegten Befunden (Schwere, Datei:Zeile, Reproduktion, Fix) +
  **Rückverfolgbarkeit** (welcher Test deckt welche Anforderung) + **Stabilitätsurteil**.
- **P1 vor Produktivbetrieb schließen.** Bericht als `docs/ISTQB-Testbericht-<Modul>.md`.

### G · Stabilität & Realismus (vor Release / kritische Teile)
Mit **echten Datenmengen** und **echten Klickwegen** — nicht mit Spielzeugdaten:
- **Last** (viele gleichzeitige Nutzer/Requests gegen die echte Instanz).
- **Nebenläufigkeit** (parallele Schreiber auf denselben Datensatz → keine
  Überbuchung/kein Lost-Update; Idempotenz).
- **Property-/Invarianten-Fuzzing** (mathematische Gesetze über zufällige Eingaben,
  10 000+ Fälle je Eigenschaft).
- **Fault-Injection / Chaos** (korrupte Datei, fehlender Schlüssel, Quota,
  Prozess-Neustart → fail-closed, kein stiller Verlust, Selbstheilung).
- **Security-Probe** (aktiv angreifen: Rechte-Matrix, Auth, Pfad-Traversal,
  Geheimnis-Leck, Rate-Limit-Umgehung).
- **DR** (Backup → Katastrophe → Restore = byte-genau zurück).
- **Soak** (Dauerlast → kein Speicher-/Handle-Leck).
- **Zeit/Kalender-Grenzfälle** (Sommer-/Winterzeit, Jahres-/Monatswechsel,
  Schaltjahr, Feiertage — unter fixer Zeitzone).

---

## 3. Architektur-Invarianten (in jeder E/F-Prüfung mitprüfen)

Diese vier Fehlerklassen kosten am meisten und sind im Review leicht zu übersehen:

1. **Kein stiller Datenverlust.** Bei beschädigten/fehlenden Daten wird gesichert +
   sichtbar gewarnt, **nie** still auf Default/Reseed zurückgefallen. Löschen ist
   bestätigt + reversibel/protokolliert.
2. **Fail-closed.** Fehlt eine Berechtigung/ein Zustand, ist die Antwort „nein" —
   auch bei direktem Aufruf (Defense-in-Depth), nicht nur ausgeblendet in der UI.
3. **Eine Rechenquelle.** Dieselbe Kennzahl wird an genau einer Stelle berechnet und
   überall gelesen — nie an zwei Stellen leicht abweichend nachgebaut.
4. **Mehrbenutzer-sicher.** Zwei Bearbeiter an verschiedenen Datensätzen kollidieren
   nicht (getrennte Schlüssel/Transaktionen). Nebenläufige Schreiber auf denselben
   Datensatz sind definiert (atomar / letzter-gewinnt bewusst dokumentiert).

---

## 4. Escaping / Injektion — der eine Test, den man nie vergisst

Jeder benutzerkontrollierte Wert, der in HTML/SQL/Shell/JS landet, bekommt **einen
gezielten Angriffs-Testfall** mit Sonderzeichen (`' " < > & \ ;` / `');...//`):

- **HTML-Text:** entity-escapen (`& < >`).
- **HTML-Attribut:** zusätzlich `"` → `&quot;`.
- **JS-String in einem HTML-Attribut** (z. B. `onclick="fn('<wert>')"`): **doppelt**
  maskieren — erst JS (`\` und `'`), dann Attribut. `attr()` allein **lässt `'`
  durch** → klassische Lücke. Testfall: ein `'` im Wert darf den Handler nicht
  aufbrechen und kein Skript feuern.
- **SQL/Shell:** parametrisiert / gequotet, nie interpoliert.

---

## 5. Häufige Test-Fallen (teuer gelernt, hier gesammelt)

**Zustand & Reihenfolge**
- Rolle/Zustand **im selben synchronen Schritt unmittelbar vor** der geprüften Aktion
  setzen — **nicht** in einem früheren Schritt: ein Reload / eine Init-Routine kann
  ihn still zurücksetzen (Rollen-Race → falsch-rot/falsch-grün).
- Seeds, die einen Reload überleben müssen, **reload-sicher guarden** (nur setzen,
  wenn noch nicht vorhanden) — sonst re-injiziert der Reload den Altzustand und
  überschreibt das Testergebnis.

**Persistenz / Storage**
- **Browser-`localStorage` unter `file://` überlebt einen Reload nicht zuverlässig.**
  Zustand, der einen Reload braucht, über einen **frisch vorgeseedeten Kontext**
  laden statt über Reload.
- Läuft ein **Demo-/Erst-Seeder mit Auto-Reload**, im Test die **Seed-Guards setzen**
  (Flags), sonst Endlos-Reload-Schleife.

**DOM-Assertions**
- **Werte von `<input>` stehen NICHT im `textContent`** → über
  `querySelector('input').value` prüfen, nie über den Textinhalt der Zeile.
- **Nie gegen `document.body.textContent` prüfen, wenn ein gebündeltes/inline-Artefakt
  geladen ist** — der enthält den **Quelltext** der Inline-Skripte und matcht
  irreführend. Immer auf den **konkreten Ziel-Container** scopen.
- Ein Element im DOM ≠ sichtbar: bei Sichtbarkeits-Aussagen die berechneten Stile /
  Bounding-Box prüfen, nicht nur die Existenz.

**Zeit**
- Datums-/wochentagsabhängige E2E: die **Uhr einfrieren** (Datum-Mock auf einen zu den
  Seeds passenden Werktag; die exakte Signatur/Argumentzahl durchreichen, sonst
  „Invalid Date"). Zeit-Grenzfälle unter fixer Zeitzone testen.

**Generierte / verschachtelte Artefakte**
- Wer aus Quelltext ein Embed/Bundle **stringifiziert**, parst kein JS → neu
  verschachtelte Template-Strings/Handler **headless gegen `typeof` + echtes Rendern**
  prüfen (ein Tippfehler killt sonst das ganze Skript, ohne Syntaxfehler in der
  Quelldatei).
- Nach Quelländerung das **Bundle/Embed neu bauen, bevor** der Test es lädt — sonst
  prüft der Test den alten Stand (häufigste Ursache für „mein Fix wirkt nicht").

**Server-/Integrationstests**
- Immer eine **isolierte Instanz** (eigener Port, eigener Datenordner, eigene Config,
  eigene Nutzer) hochziehen und **aufräumen**. Nie gegen den echten Betrieb.
- Abgestürzte Läufe hinterlassen **laufende Prozesse auf den Testports** → vor der
  Wiederholung beenden, sonst Phantom-Portkonflikte.
- Mocks vollständig: wer eine Ausgabe-/Fenster-API mockt, auch deren
  Hilfsmethoden mocken (sonst „is not a function").

---

## 6. Der adversariale-Review-Auftrag (Vorlage)

> „Lies **nur** den Diff/diese Datei feindlich. Suche konkret nach: Rechen-/
> Grenzwertfehlern; ungültigen/fehlenden Zustandsübergängen; Nebenläufigkeit/Race;
> Escaping/Injektion (jeder benutzerkontrollierte Wert in HTML/JS/SQL/Shell);
> fail-open-Lücken; stillem Datenverlust. Für **jeden** Befund: Datei:Zeile, ein
> konkreter Reproduktionsfall (Eingaben → falsches Ergebnis) und die Schwere
> (P1 blockierend / P2 / P3). Erfinde nichts — wenn unsicher, als P3 kennzeichnen.
> Kein Fix, nur Befunde." — Danach **jeden Befund selbst am Code gegenprüfen**,
> die echten fixen, re-verifizieren.

---

## 7. Definition of Done (Checkliste je Baustein)

- [ ] **A** Syntax/Typecheck grün (alle geänderten + getragenen Dateien).
- [ ] **B** Funktion real ausgeführt: positiv **und** negativ/Leerfall; **0 Konsolenfehler**.
- [ ] **B** Angesehen: **hell + dunkel** (+ **Druck**, falls druckbar) — Layout ok,
      nichts abgeschnitten.
- [ ] **B** Rollen/Rechte geprüft, inkl. **fail-closed** bei Direktaufruf.
- [ ] **§3** Invarianten gehalten (kein stiller Verlust · fail-closed · eine
      Rechenquelle · mehrbenutzer-sicher).
- [ ] **§4** Escaping-Angriffstestfall für jeden neuen user-Wert.
- [ ] **C** Zentrale Regression **komplett** grün; neuer Test **eingetragen**.
- [ ] **D/E** (ab mittlerer Größe) Gremium + adversarialer Faktencheck; Befunde
      gegengeprüft + gefixt.
- [ ] **F** (am Meilenstein) ISTQB-Durchlauf + Bericht; **kein offenes P1**.
- [ ] **G** (Release/kritisch) Stabilität/Realismus abgedeckt.
- [ ] **Datenhygiene:** kein echtes Datum/Geheimnis in Test/Diff (Leak-Scan).
- [ ] Nach Quelländerung **Bundle/Embed neu gebaut**; Artefakt getestet.
- [ ] Ehrlicher Kurzbericht: was grün, was bewusst offen (P2/P3), womit.

---

## 8. PROJEKT-ADAPTER (ausgefüllt für NEUROLANG)

| Punkt | Für dieses Projekt |
|---|---|
| **Syntax-Check (A)** | `npm run typecheck` (`tsc -b`, strikt). Deckt **`src/`, `tools/` UND `e2e/`** ab — Letzteres erst seit `tsconfig.e2e.json` (Befund A-1: die E2E-Dateien standen in keinem `include` und wurden nie typgeprüft) |
| **Funktionaler Runner (B)** | Logik: `npm test` (Vitest ruft die echten Funktionen, kein Nachbau). UI headless: Playwright/Chromium (vorinstalliert unter `/opt/pw-browsers/chromium`) gegen die Vite-Preview — Konsolenfehler = 0, Screenshots **hell + dunkel** |
| **Zentraler Lauf (C)** | **`npm run verify`** — EIN Befehl: typecheck · lint · vitest · `check:content` · `check:decoding` · `check:backtranslation` · `check:native` · `verify:build` · `check:generated` · build. Mit E2E: `npm run verify:all`. Vorher standen hier nur die Unit-Tests, und die Inhalts-Wächter liefen in CI gar nicht (Befund D-1 der Kaskade 2026-07-25) |
| **Stabilitätslauf (G)** | **`src/modules/memory/stability.test.ts`** (läuft in `npm run verify` mit): Property-Fuzzing über die Mess-Invarianten mit 10 000 Fällen je Gesetz · Fault-Injection auf die Sicherungsdatei (11 Beschädigungsarten) · Idempotenz und Verlustfreiheit des Zusammenführens · Zeit-/Kalender-Grenzfälle (Sommerzeit, Jahreswechsel, Schalttag). **Weiterhin offen, weil es sie hier nicht gibt:** Last, Nebenläufigkeit über Prozesse, Security-Probe, DR, Soak — die kommen mit einem Backend |
| **Bundle/Embed-Rebuild** | `npm run build` (Vite). Kein stringifiziertes Embed — nach Quelländerung Preview/Build neu, **bevor** ein B-Test lädt |
| **Artefakt für B-Tests** | Vite-Preview: `npm run preview -- --port 4173` → `http://localhost:4173/` (bzw. `npm run dev`). Nach dem Lauf Prozess beenden |
| **Rollen/Rechte-Modell** | Entfällt (kein Auth, keine Rollen, client-only). Fällt an, sobald Konten/Backend kommen → dann fail-closed serverseitig prüfen |
| **Seeds & Guards** | Kein Auto-Reload-Seeder. Logik-Tests bauen Zustände als reine Objekte (keine DB). Für E2E: **frischer Browser-Context pro Test**; IndexedDB liegt pro Origin isoliert |
| **Zeit einfrieren** | Kernlogik nimmt `now` als **expliziten Parameter** (`schedule(state, result, seg, now)`, `computeMetrics(states, now)`) → kein globaler Date-Mock nötig; Tests setzen `NOW` fest. Für E2E ggf. `page.clock` |
| **Isolierte Serverinstanz** | Entfällt (kein Backend). Vite-Preview auf eigenem Port hochziehen, danach Prozess beenden (vor Wiederholung ggf. Port freimachen) |
| **ISTQB-Bericht-Ablage** | `docs/ISTQB-Testbericht-<Modul>.md` |
| **Leak-Scan** | `git diff` gegen echte Daten/Geheimnisse: E-Mails (`@…\.`), `passwo`/`api[_-]?key`/`secret`/`token`, `€`/Preise, echte Pfade. `.gitignore` deckt `.env*`, `*.key`. Insb. **nicht** die echte Nutzer-E-Mail in Repo/Tests |
| **Branch/Commit** | Zielbranch steht in der Aufgabenstellung, nicht hier — ein fest eingetragener Zweig veraltet mit dem ersten Wechsel (er tat es: hier stand monatelang ein Zweig, auf dem längst nicht mehr gearbeitet wurde). Englische Commits, Trailer wie in `CLAUDE.md`; kein PR ohne ausdrückliche Bitte |

---

*Verfahren invariant, Werte im Adapter. Wird der Ablauf verbessert, hier pflegen —
dann trägt jedes Projekt, das diese Datei kopiert, die Verbesserung mit.*
