# Gremium — Design von „Top-40" auf Weltklasse (Stufe-D-Beratung)

> **Ehrlicher Rahmen:** rollenbasierte Beratung (Stufe D), Fach-*Perspektiven*, keine echten Personen. Auftrag (Nutzer 2026-07-23): „Sieht schon aus wie die Top-40-Apps — muss aber **noch besser**. Dazu gehört eine edle **Bildsprache**: High-End-Bilder **schemenhaft** im Hintergrund, kein Icon-Kram." Diese Notiz hält die Elevations-Entscheidung fest.

---

## 0. In einfachen Worten

„Top-40" wirkt sauber, aber **digital-flach**. Was Apps auf das **oberste** Niveau hebt, sind drei unscheinbare Dinge: **Textur** (feines Filmkorn nimmt der Fläche das Klinische), eine **Bildsprache** (ein wiederkehrendes, ruhiges Motiv im Hintergrund — bei uns: **Polarlicht**, passend zu Schweden), und **Tiefe/Licht** (Vignette, Schichten, lebendige Bewegung). Kein Bild schreit — alles bleibt **schemenhaft** und trägt die Stimmung.

## 1. Warum nicht einfach Fotos?

Weltklasse-Apps (Linear, Arc, Things, Apple selbst) nutzen im Bedien-Chrome **fast nie Stockfotos** — die altern schnell, sind Lizenz-/Gewichts-Ballast und offline unpraktisch (`05-architecture.md`: nichts vom Fremd-Server zur Laufzeit). Stattdessen eine **eigene, generierte Atmosphäre** (Vektor/SVG, Verläufe, Korn). Das ist zeitlos, gestochen scharf auf jedem Display, **kByte statt MByte** — und unverwechselbar unser.

## 2. Die Linsen (Kurz-Voten)

- **Art Direction:** Das Fundament (Glas + Aurora) ist gut. Es fehlt **Textur** und ein **Signatur-Motiv**. Ohne Korn bleibt Glas „Vorlage".
- **Motion:** Hintergrund darf **atmen** (sehr langsame Drift), Karten gestaffelt einschweben. Ein *einziger* Signatur-Moment schlägt zehn Effekte.
- **Typografie:** optische Feinheiten — Ziffern tabellarisch, engere Laufweite bei großen Zahlen, klarere Hierarchie.
- **Meta/Ehrlichkeit:** Bildsprache ist **Atmosphäre, nie Inhalt** — sie darf kein Fortschrittssignal vortäuschen (die eine Design-Regel bleibt).

## 3. Entscheidung — die Elevations-Hebel (2026-07-23)

1. **Filmkorn** über allem (SVG-Rauschen, sehr fein, ~5 %). Der größte einzelne „teuer"-Effekt: nimmt Verläufen das Banding, der Fläche das Klinische.
2. **Bildsprache = Polarlicht-Signatur.** Ein **schemenhaftes** Aurora-Band (SVG-Ribbons, weich, tief unscharf) zieht hinter dem Glas durch — echte, gezeichnete Bildsprache, nordisch, edel, nie laut. Wiederkehrendes Motiv = Wiedererkennung.
3. **Tiefe:** dezente **Vignette** (dunklere Ränder) + Schichtung (Aurora → Motiv → Korn), damit das Glas *auf* etwas liegt.
4. **Licht & Bewegung:** wärmerer, langsamerer Aurora-Fluss; **gestaffeltes** Einschweben der Karten; sanftes Leuchten auf Wortmarke und *bewiesen* stabilen Punkten (das Wahrheitssignal glimmt).
5. **Typo-Feinschliff:** tabellarische Ziffern, engere Laufweite bei den großen Kennzahlen.

**Bewusst dunkel-only**, `prefers-reduced-motion` schaltet Korn-/Bewegungs-Ebenen ab.

## 4. Bewusst später

- Ein noch reicheres, **saisonales/tageszeitliches** Aurora-Motiv (Stimmung ändert sich über den Tag) — reizvoll, aber erst nach Substanz.
- Eigene **Icons** statt Emoji (separater Schritt).
- Feinschliff-Runde mit einem echten Art-Director am realen Gerät.

> **Anschluss:** Handschrift `design-handschrift.md` · Vision `gremium-naechste-schritte.md` §4 · Architektur (offline) `05-architecture.md` · Motivation/Ehrlichkeit `06-motivation.md`.
