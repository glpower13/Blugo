# 03 — Methode: Begegnen → Abrufen → Erhalten

Die zentrale Einheit ist der **Chunk**: eine sinnvolle Wendung im Kontext (z. B. „kan du hjälpa mig?"), niemals eine isolierte Vokabel. Jeder Chunk durchläuft eine Schleife aus fünf robusten Effekten.

## Die Schleife
1. **Verständliche Begegnung** — Chunk eingebettet in verstandenem Input auf i+1. Ein Moment des Verstehens, keine Karteikarte. *(Comprehensible Input)*
2. **Aktiver Abruf** — kurz danach selbst herholen: erst Wiedererkennen, später Produktion. *(Testing Effect)*
3. **Abruf am Vergessenspunkt** — Wiederkehr genau dann, wenn Vergessen droht; Intervalle dehnen sich. *(Spacing)*
4. **Kontextvariation** — Wiederkehr in *anderen* Sätzen/Situationen, nie identisch. Erinnerung klebt nicht an einem Reiz.
5. **Wartungsmodus** — ein „gelernter" Chunk verschwindet nie; er wandert in einen sich ewig verlängernden Erhalt-Rhythmus (Wochen → Monate). **Der Teil, der Attrition verhindert.**

## Encoding-Schritt im Detail (Birkenbihl-Baustein)
Um Input auf i+1 verständlich zu machen, ohne Vokabelpauken, nutzen wir **Dekodierung**:
- Wort-für-Wort-Interlinearübersetzung Schwedisch→Deutsch (bewusst *nicht* eingedeutscht), damit die Satzstruktur direkt sichtbar wird.
- Danach **aktives Hören**: Audio hören + Dekodierung mitlesen, bis der Text ohne die deutsche „Krücke" verstanden wird.
- Historische Hürde: Dekodieren musste von Hand gemacht werden. **Wir automatisieren es per LLM** (siehe `08-content-pipeline.md`).
- Birkenbihls passives Hintergrund-/Schlaf-Hören wird **nicht** als Kernmechanik gebaut (Evidenz schwach); optionales Wiederholungshören bereits verstandener Segmente ist erlaubt.
- **Mehrdeutige Wörter werden benannt, nicht geglättet.** Die Wort-für-Wort-Ebene erzwingt eine Entscheidung pro Wort — aber `kort` heißt „Karte" *und* „kurz". Eine Bedeutung zu erzwingen macht die Dekodierung an der anderen Stelle falsch; beide unkommentiert zu zeigen, lässt den Lerner den Fehler bei sich suchen. Deshalb sagt die App an der Dekodierung, dass das Wort eine zweite Bedeutung hat und woran man sie erkennt (`src/modules/content/polysemy.ts`). Aus dem scheinbaren Widerspruch wird der Moment, in dem man etwas über die Sprache lernt.

## Adaptive Schwierigkeit (der Anti-Cliff)
Das System hält den Nutzer im **Erfolgsband ~80–85 %**. Wird etwas zu hart, wird nicht durchgedrückt: erst mehr verständlicher Input + leichtere Variante, dann neue Annäherung. Konstruktionsbedingt keine Klippe.

Das gilt auf **zwei Ebenen** — die zweite fehlte bis 2026-07-26 und ist nachgetragen:

**Ebene 1 — die Sitzung.** Liegt die Erfolgsquote unter dem Band, kommt weniger neuer Stoff herein (`difficulty.ts`: 5 → 3 → 1 neue Wendungen). Die Einstellung des Lerners kann nur bremsen, nie über das Band hinaus beschleunigen.

**Ebene 2 — die einzelne Wendung.** Ein „Nochmal" heißt: *ich kann das gerade nicht.* Drei Dinge passieren daraufhin, und alle drei zusammen sind die Anti-Klippe:

1. **Leichtere Abrufform.** Die Wendung wird von Produktion auf Wiedererkennen zurückgestuft (`memoryEngine.ts`).
2. **Derselbe Kontext.** Sie kommt im **gleichen** Satz zurück, nicht in einem neuen. Kontextvariation ist Schritt 4 des Loops und gehört *hinter* den Erfolg — direkt nach dem Scheitern macht eine neue Verpackung die Sache schwerer, nicht leichter (`pickSegmentForChunk`).
3. **Offene Stütze.** Dekodierung und Bedeutung stehen von selbst offen, ohne dass jemand sie aufziehen muss (`scaffoldShouldOpen`). Nach dem nächsten „Sitzt" schließen sie sich wieder — die Hilfe ist eine Krücke, kein Zustand.

Punkt 2 und 3 fehlten: Wer scheiterte, bekam die Wendung wenige Minuten später in einem **neuen** Satz und mit **zugeklappter** Hilfe zurück. Beim Wiedersehen war sie damit schwerer als beim Scheitern — genau die Klippe, gegen die dieses Projekt gebaut ist. Als e2e-Test festgehalten, der ohne jede der beiden Korrekturen nachweislich scheitert.

## Die Rückkehr nach einer Pause — die Klippe am anderen Ende *(2026-07-26)*

Attrition ist das Problem, gegen das dieses Produkt antritt. Der Moment, in dem
sie entschieden wird, ist die **Rückkehr**: Jemand war Wochen weg und öffnet die
App wieder. Genau dort stand bis 2026-07-26 die schlimmste Klippe der ganzen App.

**Der Befund** (simuliert, `session/rueckkehr.test.ts` hält ihn fest): Ein Lerner
mit 120 geübten Wendungen macht 30 Tage Pause. Auf „Heute" stand danach:

> Weiterlernen · **120 Wendungen**

Und die Reihenfolge war „am längsten überfällig zuerst" — das sind ausgerechnet
die **schwächsten**. Die ersten zwölf Wendungen hatten im Schnitt **3 %**
Abrufchance, während der Durchschnitt aller fälligen bei 37 % lag. Der Rückkehrer
bekam also einen Berg vorgesetzt *und* scheiterte an den ersten zwölf fast sicher.

**Was sich NICHT ändert: die Zahl.** 120 sind fällig, und das steht weiter da.
Gelogen war nie die Zahl — gelogen war, sie als *eine Sitzung* hinzustellen.

**Was sich ändert, sind drei Dinge:**

1. **Eine Sitzung trägt eine Portion** (`PORTION` = 20), nicht den Rückstand. Die
   Oberfläche versprach das längst („der Rest wartet — bewusst auf die nächsten
   Sitzungen verteilt"); gebaut war es nie. Die Portion begrenzt **eine Sitzung**,
   nicht den Tag: Eine zweite ist einen Knopfdruck entfernt.
2. **Zuerst kommt, was noch zu retten ist.** Sortiert wird nach Abrufchance
   (`retrievability`), nicht nach Überfälligkeit. Innerhalb des noch Abrufbaren
   bleibt „am längsten überfällig zuerst" — das rutscht gerade weg.
3. **Der Zustrom wird gedrosselt.** Bei einer Rückkehr kommt **eine** neue Wendung
   dazu statt bis zu fünf. Solange ein Rückstand da ist, geht Retten vor
   Nachlegen — sonst wächst der Berg von morgen, während der von heute steht.
   Nicht auf null: Eine Rückkehr, die nur aus Reparatur besteht, ist keine
   Einladung.

**Und die App sagt es.** Kein Schweigen über den Rest, keine Schuldzuweisung:
„60 Wendungen sind fällig. Das ist kein Rückstand und nichts, was du aufholen
musst — so funktioniert Vergessen. Wir fangen mit 20 an, und zwar mit denen, die
noch am ehesten sitzen. 30 sind stark verblasst — die kommen später wieder, dann
wie neuer Stoff. Sie zuerst abzufragen hieße nur, dich scheitern zu lassen."

### Evidenzstufen dieser Entscheidung

| Aussage | Stufe |
|---|---|
| Abrufübung wirkt (Testing Effect) | **Fels** |
| Ein Abruf, der mit Mühe *gelingt*, bringt pro Minute mehr als ein gescheiterter | **stark** |
| Gescheiterte Abrufe mit Rückmeldung helfen auch — nur langsamer | **stark** |
| Wo genau die Grenze „noch da / weg" liegt (`RETTBAR_MINIMUM` = 0,2) | **schwach** |

Deshalb ist es eine **Schwelle** und kein „optimaler Zielwert": Die Behauptung
„ab hier lohnt es noch" ist tragbar, die Behauptung „genau bei 0,6 ist es am
besten" wäre es nicht.

### Was ein täglicher Nutzer davon merkt: nichts

Wer nie weg war, hat weniger fällig als eine Portion. Für ihn ändert sich weder
die Menge noch die Reihenfolge, und die Rückkehr-Ansprache erscheint nicht —
sie wäre Theater. Ein eigener Test hält genau das fest, denn eine Verbesserung
für den Rückkehrer, die den Alltag verschlechtert, wäre keine.

## Produktion vs. Rezeption
Rezeptives Verstehen zuerst (der Keil), Produktion als Verstärker (nicht Konkurrenz). Produktive Abrufe kommen gestuft dazu, sobald Rezeption stabil ist — weil produktives Wissen schneller verfällt und mehr Pflege braucht.

## Der Startpilot — die Stufe vor der ersten Stufe

Der Inhalt begann bei „hur mår du?" und „jag förstår inte". Wer noch nie ein
schwedisches Wort gesehen hat, steht davor wie vor einer Wand — das ist die
Anti-Klippe, nur am anderen Ende: nicht die Schwierigkeit steigt zu schnell,
sondern der Anfang liegt zu hoch.

Der Startpilot führt in etwa fünf Minuten durch **sechzehn Ein-Wort-Äußerungen**
(`hej`, `tack`, `kanske`, `tyvärr` …): je vier begegnen, dann dieselben vier
abfragen, viermal. Danach verschwindet er von „Heute" und bleibt in den
Einstellungen erreichbar.

**Warum das kein Vokabel-Drill ist** (`CLAUDE.md`, Anti-Ziel): Jedes dieser
Wörter ist eine **vollständige Äußerung**. `tack` ist kein Bauteil, das später in
einen Satz muss — es ist der Satz. Die Aufnahmeregel lautet deshalb: nur was
allein stehen kann, im Alltag wirklich fällt und höchstens zwei Wörter lang ist.
Alles, was einen Trägersatz braucht (`bord` = Tisch), gehört nicht hinein.

**Was die Probe misst — und was nicht.** Sie zeigt die deutsche Bedeutung und
lässt aus drei schwedischen Möglichkeiten wählen. Das ist der **leichteste
Abruf, den es gibt**, und er findet Minuten nach der Begegnung statt. Er läuft
durch dieselbe Memory-Engine wie alles andere (kein zweiter Zähler), kann aber
konstruktionsbedingt nichts beweisen: `provenStableAt` verlangt die
Produktions-Stufe nach über neunzig Tagen. Genau das sagt der Abschluss auch:
„Es zählt als Anfang, nicht als Beweis."

Die Ablenker stammen aus demselben Vorrat von sechzehn Wörtern. Ein Ablenker,
den der Lerner nie gesehen hat, wäre als falsch erkennbar, ohne dass er das
richtige Wort kennt — die Frage würde nichts messen. Ein Test hält das fest.
