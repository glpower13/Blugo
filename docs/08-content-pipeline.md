# 08 — Content-Pipeline (der Moat)

## Warum zwingend
Für Schwedisch existiert kaum graded Content auf i+1; kuratierte Podcasts/Sender führen in Lizenzprobleme. Ewige **Kontextvariation** und **Wartung** brauchen praktisch unbegrenzten, passgenauen Input. Fertiger Content reicht dafür strukturell nie. Deshalb ist KI-generierter, on-demand graduierter Input kein Komfort, sondern die Existenzberechtigung des Produkts.

## Pipeline (konzeptionell)
1. **Skript-Generierung** — LLM erzeugt kurze schwedische Segmente, die gezielt Ziel-Chunks auf i+1 enthalten und bekannte Chunks in *neuem* Kontext wiederbringen.
2. **Grading/Leveling** — Prüfung/Anpassung auf die Zielstufe (Anteil bekannter vs. neuer Chunks im gewünschten Verhältnis).
3. **Dekodierung** — automatische interlineare Wort-für-Wort-Übersetzung SV→DE (Birkenbihl-Baustein), historisch der teuerste Handschritt, hier automatisiert.
4. **TTS** — natürliches Schwedisch, variables Tempo.
5. **Optional Bild/Kontext** — zur Verständlichmachung (Dual Coding, moderat).
6. **Qualitätssicherung** — in M1 handgeprüft (~20 Segmente); später teilautomatisiert mit Stichprobenprüfung.

## Risiken / offene Punkte
- Faktentreue & Natürlichkeit generierter Sätze → menschliche Stichprobe.
- Qualität schwedischer Dekodierung/Idiomatik → Prüfheuristiken.
- Konkrete Modellwahl (LLM/TTS) → erst M1, per Live-Recherche.
