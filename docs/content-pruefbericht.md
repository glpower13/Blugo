# Prüfbericht — schwedischer Inhalt (maschinelle Vorprüfung)

> **Automatisch erzeugt** von `tools/check-swedish.py`. Nicht von Hand ändern — Skript erneut laufen lassen.

## Was dieser Bericht beweist — und was nicht

**Geprüft:** Jedes schwedische **Wort** ist ein echtes, real verwendetes schwedisches Wort. Grundlage: korpusbasierte Häufigkeiten (`wordfreq`, Zipf-Skala 0–8) plus Abgleich mit einem Wörterbuch (152.719 Einträge, Hunspell `dictionary-sv`).

**NICHT geprüft:** Wortstellung, Satzbau, Idiomatik („sagt man das so?"), Register/Situationspassung und die Birkenbihl-Dekodierungen. Dafür bleibt eine **menschliche Prüfung** nötig (`content-review-schwedisch.md`) — dieser Bericht macht sie nur klein genug, um machbar zu sein.

## Ergebnis

- Geprüfte schwedische Zeichenketten: **3423**
- Verschiedene Wörter: **434**
- ✅ alltagshäufig belegt (Zipf ≥ 3.0): **429**
- ⚠️ selten belegt: **5**
- ❌ nicht belegt (Tippfehler-Verdacht): **0**

## ❌ Nicht belegt — zuerst anschauen

Keine. ✅

## ⚠️ Selten belegt — kurz gegenlesen

Existiert, ist aber ungewöhnlich. Für Anfänger-Inhalt oft ein Zeichen, dass es ein geläufigeres Wort gäbe.

| Wort | Zipf | im Wörterbuch | kommt vor in |
|---|---|---|---|
| **punkterat** | 1.78 | — | „Däcket är punkterat." · „Titta, däcket är punkterat!" |
| **provrummet** | 2.22 | — | „Ursäkta, var är provrummet?" · „Var är provrummet?" |
| **trettiofem** | 2.68 | ja | „Trettiofem kronor, tack." · „trettiofem" |
| **skruven** | 2.80 | — | „Tack! Nu drar jag åt den sista skruven." · „skruven" |
| **smaklig** | 2.82 | ja | „Smaklig måltid!" · „Tack, smaklig måltid!" |

## Sätze mit auffälligen Wörtern

| Schwedisch | auffällige Wörter |
|---|---|
| Däcket är punkterat. | punkterat |
| Smaklig måltid! | smaklig |
| Tack! Nu drar jag åt den sista skruven. | skruven |
| Tack, smaklig måltid! | smaklig |
| Titta, däcket är punkterat! | punkterat |
| Trettiofem kronor, tack. | trettiofem |
| Ursäkta, var är provrummet? | provrummet |
| Utmärkt! Smaklig måltid. | smaklig |
| Var är provrummet? | provrummet |
| Visst! Provrummet är där borta. | provrummet |
| däcket är punkterat | punkterat |
| provrummet | provrummet |
| punkterat | punkterat |
| skruven | skruven |
| smaklig | smaklig |
| smaklig måltid | smaklig |
| trettiofem | trettiofem |
| var är provrummet? | provrummet |

