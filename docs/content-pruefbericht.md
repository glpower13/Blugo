# Prüfbericht — schwedischer Inhalt (maschinelle Vorprüfung)

> **Automatisch erzeugt** von `tools/check-swedish.py`. Nicht von Hand ändern — Skript erneut laufen lassen.

## Was dieser Bericht beweist — und was nicht

**Geprüft:** Jedes schwedische **Wort** ist ein echtes, real verwendetes schwedisches Wort. Grundlage: korpusbasierte Häufigkeiten (`wordfreq`, Zipf-Skala 0–8) plus Abgleich mit einem Wörterbuch (152.719 Einträge, Hunspell `dictionary-sv`).

**NICHT geprüft:** Wortstellung, Satzbau, Idiomatik („sagt man das so?"), Register/Situationspassung und die Birkenbihl-Dekodierungen. Dafür bleibt eine **menschliche Prüfung** nötig (`content-review-schwedisch.md`) — dieser Bericht macht sie nur klein genug, um machbar zu sein.

## Ergebnis

- Geprüfte schwedische Zeichenketten: **12313**
- Verschiedene Wörter: **1169**
- ✅ alltagshäufig belegt (Zipf ≥ 3.0): **1154**
- ⚠️ selten belegt: **15**
- ❌ nicht belegt (Tippfehler-Verdacht): **0**

## ❌ Nicht belegt — zuerst anschauen

Keine. ✅

## ⚠️ Selten belegt — kurz gegenlesen

Existiert, ist aber ungewöhnlich. Für Anfänger-Inhalt oft ein Zeichen, dass es ein geläufigeres Wort gäbe.

| Wort | Zipf | im Wörterbuch | kommt vor in |
|---|---|---|---|
| **punkterat** | 1.78 | — | „Däcket är punkterat." · „Titta, däcket är punkterat!" |
| **fyrtiotvå** | 1.98 | ja | „Fyrtiotvå. Äldre än jag ser ut, brukar folk säga." · „fyrtiotvå" |
| **offerten** | 2.06 | — | „De levererar snabbt, står det i offerten." · „offerten" |
| **provrummet** | 2.22 | — | „Kan jag prova den? Var är provrummet?" · „Ursäkta, var är provrummet?" |
| **jackorna** | 2.53 | — | „Jaså? Jackorna sitter ofta lite löst." · „jackorna" |
| **trettiofem** | 2.68 | ja | „Trettiofem kronor, tack." · „trettiofem" |
| **rätterna** | 2.69 | — | „Precis. Och mellan rätterna sjunger alla, högt och falskt." · „rätterna" |
| **offert** | 2.70 | ja | „Här är vår offert. Priset gäller i två veckor." · „offert" |
| **skruven** | 2.80 | — | „Tack! Nu drar jag åt den sista skruven." · „skruven" |
| **smaklig** | 2.82 | ja | „Smaklig måltid!" · „Smaklig måltid." |
| **bakad** | 2.85 | ja | „Varsågod. Kakan är bakad i morse." · „bakad" |
| **handske** | 2.88 | ja | „Du tappade förresten din handske där borta." · „handske" |
| **automaten** | 2.93 | — | „Tyvärr, kortet fungerar inte i automaten." · „automaten" |
| **bifoga** | 2.94 | ja | „Gärna. Och du måste bifoga ett intyg också." · „bifoga" |
| **trehundra** | 2.98 | ja | „Trehundra kronor jämnt." · „trehundra" |

## Sätze mit auffälligen Wörtern

| Schwedisch | auffällige Wörter |
|---|---|
| De levererar snabbt, står det i offerten. | offerten |
| Du tappade förresten din handske där borta. | handske |
| Däcket är punkterat. | punkterat |
| Fyrtiotvå. Äldre än jag ser ut, brukar folk säga. | fyrtiotvå |
| Gärna. Och du måste bifoga ett intyg också. | bifoga |
| Här är vår offert. Priset gäller i två veckor. | offert |
| Jaså? Jackorna sitter ofta lite löst. | jackorna |
| Kan jag prova den? Var är provrummet? | provrummet |
| Precis. Och mellan rätterna sjunger alla, högt och falskt. | rätterna |
| Smaklig måltid! | smaklig |
| Smaklig måltid. | smaklig |
| Tack! Nu drar jag åt den sista skruven. | skruven |
| Tack, smaklig måltid! | smaklig |
| Titta, däcket är punkterat! | punkterat |
| Trehundra kronor jämnt. | trehundra |
| Trettiofem kronor, tack. | trettiofem |
| Tyvärr, kortet fungerar inte i automaten. | automaten |
| Ursäkta, var är provrummet? | provrummet |
| Utmärkt! Smaklig måltid. | smaklig |
| Var är provrummet? | provrummet |
| Varsågod! Smaklig måltid! | smaklig |
| Varsågod. Kakan är bakad i morse. | bakad |
| Visst! Provrummet är där borta. | provrummet |
| automaten | automaten |
| bakad | bakad |
| bifoga | bifoga |
| däcket är punkterat | punkterat |
| fyrtiotvå | fyrtiotvå |
| handske | handske |
| jackorna | jackorna |
| offert | offert |
| offerten | offerten |
| provrummet | provrummet |
| punkterat | punkterat |
| rätterna | rätterna |
| skruven | skruven |
| smaklig | smaklig |
| smaklig måltid | smaklig |
| trehundra | trehundra |
| trettiofem | trettiofem |
| var är provrummet? | provrummet |

