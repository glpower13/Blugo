# Prüfbericht — schwedischer Inhalt (maschinelle Vorprüfung)

> **Automatisch erzeugt** von `tools/check-swedish.py`. Nicht von Hand ändern — Skript erneut laufen lassen.

## Was dieser Bericht beweist — und was nicht

**Geprüft:** Jedes schwedische **Wort** ist ein echtes, real verwendetes schwedisches Wort. Grundlage: korpusbasierte Häufigkeiten (`wordfreq`, Zipf-Skala 0–8) plus Abgleich mit einem Wörterbuch (152.719 Einträge, Hunspell `dictionary-sv`).

**NICHT geprüft:** Wortstellung, Satzbau, Idiomatik („sagt man das so?"), Register/Situationspassung und die Birkenbihl-Dekodierungen. Dafür bleibt eine **menschliche Prüfung** nötig (`content-review-schwedisch.md`) — dieser Bericht macht sie nur klein genug, um machbar zu sein.

## Ergebnis

- Geprüfte schwedische Zeichenketten: **1764**
- Verschiedene Wörter: **248**
- ✅ alltagshäufig belegt (Zipf ≥ 3.0): **245**
- ⚠️ selten belegt: **3**
- ❌ nicht belegt (Tippfehler-Verdacht): **0**

## ❌ Nicht belegt — zuerst anschauen

Keine. ✅

## ⚠️ Selten belegt — kurz gegenlesen

Existiert, ist aber ungewöhnlich. Für Anfänger-Inhalt oft ein Zeichen, dass es ein geläufigeres Wort gäbe.

| Wort | Zipf | im Wörterbuch | kommt vor in |
|---|---|---|---|
| **provrummet** | 2.22 | — | „Ursäkta, var är provrummet?" · „Var är provrummet?" |
| **trettiofem** | 2.68 | ja | „Trettiofem kronor, tack." · „trettiofem" |
| **smaklig** | 2.82 | ja | „Smaklig måltid!" · „Tack, smaklig måltid!" |

## Sätze mit auffälligen Wörtern

| Schwedisch | auffällige Wörter |
|---|---|
| Smaklig måltid! | smaklig |
| Tack, smaklig måltid! | smaklig |
| Trettiofem kronor, tack. | trettiofem |
| Ursäkta, var är provrummet? | provrummet |
| Utmärkt! Smaklig måltid. | smaklig |
| Var är provrummet? | provrummet |
| Visst! Provrummet är där borta. | provrummet |
| provrummet | provrummet |
| smaklig | smaklig |
| smaklig måltid | smaklig |
| trettiofem | trettiofem |
| var är provrummet? | provrummet |

