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
