# Content-Prüfliste — Schwedisch (Seed für M1)

> **⚠️ Erweiterung 2026-07-23 (abends):** Der Seed steht jetzt in einem **Baum**
> (Bereich → Thema → Wendung) und wurde erneut deutlich vergrößert — jetzt **6 Bereiche,
> 17 Themen, 98 Wendungen, 195 Kontext-Sätze** (Quelle: `src/modules/content/seedSegments.ts`).
> Die Tabellen A/B unten decken nur den **ursprünglichen** Kern (11 Wendungen) ab; der
> **gesamte** neue Inhalt ist **ebenfalls NICHT muttersprachlich geprüft** und braucht
> dieselbe Prüfung. Neue Bereiche/Themen: Einkaufen (Im Geschäft, Bezahlen, Im Supermarkt),
> Notfall & Gesundheit (Beim Arzt & Apotheke, Notfall & Hilfe), Höflich & Basics,
> Bus/Bahn & Taxi, Im Hotel, Im Restaurant + Ausbau der bestehenden. Bekannte
> Wackelkandidaten: siehe §„Erweiterung" unten.

> **Zweck:** die im Code liegenden **noch ungeprüften Segmente** von einer
> schwedischsprachigen (oder gleichwertig qualifizierten) Person prüfen lassen,
> bevor sie als geprüfter M1-Inhalt gelten (`docs/08-content-pipeline.md`, QS;
> `docs/09-roadmap.md`, „~20 handgeprüfte Segmente").
>
> **Quelle:** `src/modules/content/seedSegments.ts`. Ändert sich der Code, hier
> nachziehen (oder umgekehrt nach Freigabe).
>
> **So abhaken:** je Zeile `OK` eintragen **oder** die Korrektur notieren.
> Erst wenn alles OK ist, im Code den Platzhalter-Hinweis entfernen und den
> Roadmap-Punkt schließen.

## Prüfkriterien (pro Eintrag)

1. **Idiomatik:** Ist die schwedische Wendung natürlich und korrekt (nicht nur
   grammatisch)? Sagt man das so?
2. **Idiomatische DE-Übersetzung:** trifft sie die Bedeutung?
3. **Wörtliche Dekodierung (Birkenbihl):** ist jede SV→DE-Glosse als
   *strukturelle* Wort-für-Wort-Entsprechung vertretbar? (Bewusst unidiomatisch —
   z. B. `mår → befindest` — aber nicht *falsch*.)
4. **Niveau:** A1 / i+1 angemessen (kurz, hochfrequent, alltagsnah)?
5. **Natürlichkeit im Kontext:** passt der Satz als echte Alltagsäußerung?
6. **Keine False Friends / Fehlbetonung**, die den Lerner in die Irre führen.

Legende: **✅ OK** · **✏️ Korrektur:** …

---

## A. Chunks (die Lerneinheit)

| ID | SV | wörtliche Dekodierung | idiomatische DE | Urteil |
|---|---|---|---|---|
| c-hej | hur mår du? | hur=wie · mår=befindest · du=du | wie geht es dir? | ⬜ |
| c-heter | jag heter | jag=ich · heter=heiße | ich heiße | ⬜ |
| c-hjalpa | kan du hjälpa mig? | kan=kann · du=du · hjälpa=helfen · mig=mir | kannst du mir helfen? | ⬜ |
| c-kostar | vad kostar det? | vad=was · kostar=kostet · det=das | was kostet das? | ⬜ |
| c-forstar | jag förstår inte | jag=ich · förstår=verstehe · inte=nicht | ich verstehe nicht | ⬜ |
| c-langsam | kan du prata långsammare? | kan=kann · du=du · prata=sprechen · långsammare=langsamer | kannst du langsamer sprechen? | ⬜ |
| c-tack | tack så mycket | tack=danke · så=so · mycket=viel | danke vielmals | ⬜ |
| c-marbra | jag mår bra | jag=ich · mår=befinde · bra=gut | mir geht es gut | ⬜ |
| c-var-toa | var är toaletten? | var=wo · är=ist · toaletten=die Toilette | wo ist die Toilette? | ⬜ |
| c-vill-ha | jag vill ha | jag=ich · vill=will · ha=haben | ich möchte | ⬜ |
| c-engelska | talar du engelska? | talar=sprichst · du=du · engelska=Englisch | sprichst du Englisch? | ⬜ |

## B. Segmente (Chunk im Kontext, je ≥ 2 Kontexte)

| ID | SV | idiomatische DE | enthält Chunk(s) | Urteil |
|---|---|---|---|---|
| s-cafe | Hej! Hur mår du idag? | Hallo! Wie geht es dir heute? | c-hej | ⬜ |
| s-morgon | God morgon! Hur mår du? | Guten Morgen! Wie geht es dir? | c-hej | ⬜ |
| s-namn1 | Jag heter Anna. Vad heter du? | Ich heiße Anna. Wie heißt du? | c-heter | ⬜ |
| s-namn2 | Hej, jag heter Erik. | Hallo, ich heiße Erik. | c-heter | ⬜ |
| s-butik | Ursäkta, kan du hjälpa mig? Vad kostar det? | Entschuldigung, kannst du mir helfen? Was kostet das? | c-hjalpa, c-kostar | ⬜ |
| s-hjalp2 | Kan du hjälpa mig, tack? | Kannst du mir helfen, bitte? | c-hjalpa | ⬜ |
| s-pris2 | Ursäkta, vad kostar det? | Entschuldigung, was kostet das? | c-kostar | ⬜ |
| s-forstar1 | Förlåt, jag förstår inte. | Verzeihung, ich verstehe nicht. | c-forstar | ⬜ |
| s-forstar2 | Vänta, jag förstår inte riktigt. | Warte, ich verstehe nicht ganz. | c-forstar | ⬜ |
| s-langsam1 | Kan du prata långsammare, tack? | Kannst du langsamer sprechen, bitte? | c-langsam | ⬜ |
| s-langsam2 | Ursäkta, kan du prata långsammare? | Entschuldigung, kannst du langsamer sprechen? | c-langsam | ⬜ |
| s-tack1 | Tack så mycket för hjälpen! | Vielen Dank für die Hilfe! | c-tack | ⬜ |
| s-tack2 | Tack så mycket, hej då! | Vielen Dank, tschüss! | c-tack | ⬜ |
| s-marbra1 | Tack, jag mår bra. | Danke, mir geht es gut. | c-marbra | ⬜ |
| s-marbra2 | Jag mår bra idag. | Mir geht es heute gut. | c-marbra | ⬜ |
| s-toa1 | Ursäkta, var är toaletten? | Entschuldigung, wo ist die Toilette? | c-var-toa | ⬜ |
| s-toa2 | Var är toaletten, tack? | Wo ist die Toilette, bitte? | c-var-toa | ⬜ |
| s-vill1 | Jag vill ha en kaffe, tack. | Ich möchte einen Kaffee, bitte. | c-vill-ha | ⬜ |
| s-vill2 | Jag vill ha vatten, tack. | Ich möchte Wasser, bitte. | c-vill-ha | ⬜ |
| s-eng1 | Ursäkta, talar du engelska? | Entschuldigung, sprichst du Englisch? | c-engelska | ⬜ |
| s-eng2 | Hej, talar du engelska? | Hallo, sprichst du Englisch? | c-engelska | ⬜ |

---

## Offene Fragen an die Prüfperson (bekannte Zweifelsfälle)

- **`tack`** ist in `s-hjalp2`/`s-langsam1` mit „bitte" idiomatisch übersetzt
  (Höflichkeitsfloskel), wörtlich aber „danke". Ist die idiomatische Wahl hier
  richtig, oder besser „danke"?
- **`mår` → „befindest"** als Glosse: vertretbar, oder verwirrend? Alternative
  Glosse?
- **`förlåt` vs. `ursäkta`** (beide „Entschuldigung/Verzeihung"): sind die
  jeweiligen Kontexte natürlich gewählt?
- **`hej då` → „tschüss"** (Abschied): Glosse ok? Wörtlich eher „hallo/hej + då/dann".
- **`jag vill ha` → „ich möchte"**: idiomatisch richtig, wörtlich „ich will haben" — passt die Glosse?
- Reicht die Zahl/Streuung für ein M1-Level, oder fehlen Alltagssituationen?
  (Ziel laut Roadmap: ~20 geprüfte Segmente — **aktuell 21** (11 Chunks).)

## Erweiterung 2026-07-23 — neue Wendungen (ebenfalls ungeprüft)

Die neuen Themen/Wendungen stehen kompakt in `src/modules/content/seedSegments.ts`
(je ≥ 2 Kontexte). Statt sie hier komplett zu doppeln, hier die **bekannten Zweifelsfälle**
zum gezielten Draufschauen:

- **Partikel-/Funktionswort-Glossen** (Kontext-abhängig, nur Näherung): `till` (= zu/nach/noch),
  `om` (= in/um), `med` (= mit), `få` (= bekommen).
- **Idiomatische Wendungen** (wörtliche Glosse holprig, aber gewollt): `smaklig måltid`
  („guten Appetit", wörtl. „schmackhafte Mahlzeit"), `ha det bra` („alles Gute/mach's gut"),
  `hej då` („tschüss").
- **`jobbar du med?`** → „was machst du beruflich?" (wörtl. „arbeitest du mit?").
- **`gillar` vs. `tycker om`** für „mögen": bewusst `gillar` gewählt (ein Wort, weniger
  Partikelverb-Verwirrung) — natürlich genug?
- **Groß-/Kleinschreibung** von Ländernamen (`Tyskland`) / Satzanfängen.
- **Register/Natürlichkeit** der neuen Alltagssätze (Wetter, Familie, Wegbeschreibung) —
  sagt man das *wirklich* so?

## Erweiterung 2026-07-23 (abends) — Baum-Batch (ebenfalls ungeprüft)

Gezielt draufschauen (bekannte Zweifelsfälle des neuen Batches):

- **`varsågod` → „bitte"**: als **eine** Glosse geführt (feste Höflichkeitsformel, kein
  echtes Wort-für-Wort). Ok so, oder aufspalten (`var·så·god`)?
- **`ont` → „Schmerz"** in `jag har ont här` (idiom. „mir tut es hier weh") und
  `det gör ont här`: strukturell vertretbar oder verwirrend?
- **`ring` → „ruf an"** (`ring polisen`, `ring en ambulans`): Partikel-Glosse ok?
- **`blått` (Neutrum)** in `har ni den i blått?`: natürlich? (Farb-/Genus-Form.)
- **`den här`/`den` → „das"/„es"**: Demonstrativ vs. Pronomen sauber getrennt?
- **Register `har ni …` („haben Sie")** vs. `har du`: konsistent/natürlich in Laden,
  Hotel, Restaurant?
- **`spår` → „Gleis"**, **`hållplats` → „Haltestelle"**, **`nödsituation` → „Notfall"**:
  natürlichste Alltagswörter?
- **`mätt` → „satt"**, **`kvittot` → „der Beleg"**, **`påse` → „Tüte"**: Wortwahl ok?

## Nach der Freigabe (Checkliste)

- [ ] Korrekturen in `src/modules/content/seedSegments.ts` eingepflegt.
- [ ] Platzhalter-Warnhinweis im Dateikopf entfernt/entschärft.
- [ ] Ggf. auf ~20 Segmente ergänzt (weitere Alltagssituationen).
- [ ] `docs/09-roadmap.md`: M1-Punkt „~20 handgeprüfte Segmente" abhaken.
- [ ] Kaskade erneut (A→C) grün; B angesehen.
