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

## Produktion vs. Rezeption
Rezeptives Verstehen zuerst (der Keil), Produktion als Verstärker (nicht Konkurrenz). Produktive Abrufe kommen gestuft dazu, sobald Rezeption stabil ist — weil produktives Wissen schneller verfällt und mehr Pflege braucht.
