# 08 — Der Moat: KI-Content-Pipeline & Auto-Dekodierung

*Zweck: Warum die Content-Erzeugung der eigentliche Verteidigungswall ist und wie sie konzeptionell funktioniert.*

## Warum überhaupt ein Moat hier

Die Methode ([`03-method.md`](03-method.md)) ist erklärbar und kopierbar. Der Wettbewerbsvorteil liegt nicht in der Idee, sondern in dem, was klassische Apps **strukturell nicht können**: verständlichen Input **exakt auf i+1**, **on demand**, für jeden einzelnen Nutzer und Chunk erzeugen — inklusive der Birkenbihl-Dekodierung, die historisch von Hand gemacht werden musste.

Ein fixer Content-Baum ist für alle gleich und kann nicht auf den individuellen Erhalt-Zustand reagieren. Genau das braucht aber die Memory-Engine: „gib mir ein *neues* Segment auf i+1, das die Chunks A, C und F in *anderem* Kontext enthält." Das ist nur generativ lösbar. **Deshalb ist NEUROLANG als KI-natives Produkt überhaupt sinnvoll.**

## Warum Schwedisch das zuspitzt

- Für Schwedisch existiert **kaum graded Content** (anders als für Englisch/Spanisch).
- Kuratierte Podcasts/Texte führen in **Lizenzprobleme** und sind nicht auf i+1 steuerbar.
- Also: entweder mühsam von Hand kuratieren (skaliert nie) oder generieren. Wir generieren.

## Die Pipeline (konzeptionell)

```
Bedarf (von Memory-Engine):
  „Segment auf Niveau i+1, enthält Chunks {A,C,F} in neuem Kontext"
        │
        ▼
1. LLM-Generierung ── schwedisches Segment, das die Ziel-Chunks natürlich einbettet
        │
        ▼
2. Grading ── prüft/justiert Schwierigkeit auf i+1 (Wortschatz, Satzbau, Länge)
        │
        ▼
3. Auto-Dekodierung ── Birkenbihl: wörtliche Wort-für-Wort-Zeile + idiomatische Übersetzung
        │
        ▼
4. Schwedisches TTS ── Audio zum Segment
        │
        ▼
5. optional: Bild/Kontext ── visuelle/situative Verankerung
        │
        ▼
   fertiges Segment → Comprehension-Loop
```

### Zu den Schritten

- **Generierung:** Der schwierige Teil ist nicht „schreib etwas auf Schwedisch", sondern „schreib etwas, das *genau diese* Chunks natürlich enthält und *dieses* Niveau trifft". Prompt-/Constraint-Design ist Kern-IP.
- **Grading:** i+1 ist eine relative Größe pro Nutzer. Grading braucht ein Schwierigkeitsmodell, gegen das generierter Text geprüft (und ggf. neu erzeugt) wird. Wie Niveaus operationalisiert werden, ist offen → [`10-open-questions.md`](10-open-questions.md).
- **Auto-Dekodierung:** automatisiert Birkenbihls Handarbeit ([`03-method.md`](03-method.md)). Der größte Hebel, weil er die Methode erst skalierbar macht.
- **TTS:** natürliche schwedische Aussprache; Anbieterwahl bei Build-Start per Live-Recherche.
- **Bild/Kontext:** optional, nachrangig; nur wenn es den Erhalt messbar stützt.

## Qualitätssicherung

Generativer Content **halluziniert und macht Sprachfehler**. Deshalb:
- In **M1** sind die ~20 Segmente **handgeprüft** — die Pipeline liefert Rohmaterial, ein Mensch verifiziert. Erst wird der Kern bewiesen, dann automatisiert ([`09-roadmap.md`](09-roadmap.md)).
- Später: automatisierte Checks (Rückübersetzung, muttersprachliche Validierungsschritte, Stichproben), bevor Content einen Nutzer erreicht.
- Grundsatz: lieber weniger, geprüfter Content als viel fehlerhafter — falscher Input vergiftet den Erhalt.

## Kosten- und Latenzrealität

On-demand-Generierung kostet pro Segment Geld und Zeit. Konzeptionelle Antworten (nicht in M0 festzurren): Caching/Wiederverwendung generierter Segmente, Vorab-Generierung fälliger Chunks, Balance zwischen „frisch generiert" und „aus Vorrat variiert". Details offen → [`10-open-questions.md`](10-open-questions.md).

## Warum das ein echter Wall ist

Nicht wegen eines geheimen Modells (Modelle sind mietbar), sondern wegen der **Verzahnung**: Schwierigkeitsmodell + Chunk-Zustand + Dekodier-Automatik + QS-Schleife, alle auf Erhalt getrimmt. Diese Integration — nicht das LLM — ist schwer nachzubauen.
