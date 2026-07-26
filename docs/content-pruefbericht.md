# Prüfbericht — schwedischer Inhalt (maschinelle Vorprüfung)

> **Automatisch erzeugt** von `tools/check-swedish.py`. Nicht von Hand ändern — Skript erneut laufen lassen.

## Was dieser Bericht beweist — und was nicht

**Geprüft:** Jedes schwedische **Wort** ist ein echtes, real verwendetes schwedisches Wort. Grundlage: korpusbasierte Häufigkeiten (`wordfreq`, Zipf-Skala 0–8) plus Abgleich mit einem Wörterbuch (152.719 Einträge, Hunspell `dictionary-sv`).

**NICHT geprüft:** Wortstellung, Satzbau, Idiomatik („sagt man das so?"), Register/Situationspassung und die Birkenbihl-Dekodierungen. Dafür bleibt eine **menschliche Prüfung** nötig (`content-review-schwedisch.md`) — dieser Bericht macht sie nur klein genug, um machbar zu sein.

## Ergebnis

- Geprüfte schwedische Zeichenketten: **15349**
- Verschiedene Wörter: **1386**
- ✅ alltagshäufig belegt (Zipf ≥ 3.0): **1358**
- ⚠️ selten belegt: **28**
- ❌ nicht belegt (Tippfehler-Verdacht): **0**

## ❌ Nicht belegt — zuerst anschauen

Keine. ✅

## ⚠️ Selten belegt — kurz gegenlesen

Existiert, ist aber ungewöhnlich. Für Anfänger-Inhalt oft ein Zeichen, dass es ein geläufigeres Wort gäbe.

| Wort | Zipf | im Wörterbuch | kommt vor in |
|---|---|---|---|
| **punkterat** | 1.78 | — | „Däcket är punkterat." · „Titta, däcket är punkterat!" |
| **sophämtningen** | 1.88 | — | „Vet du när sophämtningen kommer?" · „sophämtningen" |
| **fyrtiotvå** | 1.98 | ja | „Fyrtiotvå. Äldre än jag ser ut, brukar folk säga." · „fyrtiotvå" |
| **offerten** | 2.06 | — | „De levererar snabbt, står det i offerten." · „offerten" |
| **provrummet** | 2.22 | — | „Kan jag prova den? Var är provrummet?" · „Ursäkta, var är provrummet?" |
| **framhjulet** | 2.25 | — | „I lådan. Titta förresten på framhjulet." · „framhjulet" |
| **papperen** | 2.47 | — | „Bra. Ta med papperen — och passet, alltid." · „papperen" |
| **städdag** | 2.48 | ja | „Vi har städdag på lördag, alla hjälper till." · „Vi har städdag på lördag." |
| **jackorna** | 2.53 | — | „Jaså? Jackorna sitter ofta lite löst." · „jackorna" |
| **grannhuset** | 2.55 | — | „Hon som bor i grannhuset. Snäll, säger barnen." · „grannhuset" |
| **borrmaskin** | 2.62 | ja | „Får jag låna en borrmaskin en stund?" · „Får jag låna en borrmaskin?" |
| **incheckningen** | 2.64 | — | „Ursäkta, var är incheckningen?" · „Var är incheckningen för Stockholm?" |
| **trettiofem** | 2.68 | ja | „Trettiofem kronor, tack." · „trettiofem" |
| **rätterna** | 2.69 | — | „Precis. Och mellan rätterna sjunger alla, högt och falskt." · „rätterna" |
| **offert** | 2.70 | ja | „Här är vår offert. Priset gäller i två veckor." · „offert" |
| **släckas** | 2.78 | — | „Elden måste släckas innan vi sover." · „Elden måste släckas — det är torrt i skogen." |
| **skruven** | 2.80 | — | „Tack! Nu drar jag åt den sista skruven." · „skruven" |
| **pelaren** | 2.80 | — | „Precis. Och vid pelaren svänger du." · „pelaren" |
| **smaklig** | 2.82 | ja | „Smaklig måltid!" · „Smaklig måltid." |
| **bakad** | 2.85 | ja | „Varsågod. Kakan är bakad i morse." · „bakad" |
| **handske** | 2.88 | ja | „Du tappade förresten din handske där borta." · „handske" |
| **skruvmejsel** | 2.92 | ja | „Har du en skruvmejsel?" · „Hittade du en skruvmejsel?" |
| **automaten** | 2.93 | — | „Tyvärr, kortet fungerar inte i automaten." · „automaten" |
| **bifoga** | 2.94 | ja | „Gärna. Och du måste bifoga ett intyg också." · „bifoga" |
| **tjugonde** | 2.95 | ja | „Var tjugonde minut. Men taxi går fortare." · „tjugonde" |
| **trehundra** | 2.98 | ja | „Trehundra kronor jämnt." · „trehundra" |
| **föräldramöte** | 2.98 | ja | „Vi ska förresten på föräldramöte på tisdag." · „föräldramöte" |
| **handbagage** | 2.99 | ja | „Ingen väska, jag har bara handbagage." · „Jag har bara handbagage, går det snabbare då?" |

## Sätze mit auffälligen Wörtern

| Schwedisch | auffällige Wörter |
|---|---|
| Bra. Ta med papperen — och passet, alltid. | papperen |
| De levererar snabbt, står det i offerten. | offerten |
| Du tappade förresten din handske där borta. | handske |
| Däcket är punkterat. | punkterat |
| Elden måste släckas innan vi sover. | släckas |
| Elden måste släckas — det är torrt i skogen. | släckas |
| Elden måste släckas. | släckas |
| Fyrtiotvå. Äldre än jag ser ut, brukar folk säga. | fyrtiotvå |
| Får jag låna en borrmaskin en stund? | borrmaskin |
| Får jag låna en borrmaskin? | borrmaskin |
| Gärna. Och du måste bifoga ett intyg också. | bifoga |
| Har du en skruvmejsel? | skruvmejsel |
| Hittade du en skruvmejsel? | skruvmejsel |
| Hon som bor i grannhuset. Snäll, säger barnen. | grannhuset |
| Här är vår offert. Priset gäller i två veckor. | offert |
| I lådan. Titta förresten på framhjulet. | framhjulet |
| Ingen väska, jag har bara handbagage. | handbagage |
| Jag har bara handbagage, går det snabbare då? | handbagage |
| Jag har bara handbagage. | handbagage |
| Jaså? Jackorna sitter ofta lite löst. | jackorna |
| Kan jag prova den? Var är provrummet? | provrummet |
| Precis. Och mellan rätterna sjunger alla, högt och falskt. | rätterna |
| Precis. Och vid pelaren svänger du. | pelaren |
| Smaklig måltid! | smaklig |
| Smaklig måltid. | smaklig |
| Tack! Nu drar jag åt den sista skruven. | skruven |
| Tack, smaklig måltid! | smaklig |
| Titta, däcket är punkterat! | punkterat |
| Trehundra kronor jämnt. | trehundra |
| Trettiofem kronor, tack. | trettiofem |
| Tyvärr, kortet fungerar inte i automaten. | automaten |
| Ursäkta, var är incheckningen? | incheckningen |
| Ursäkta, var är provrummet? | provrummet |
| Utmärkt! Smaklig måltid. | smaklig |
| Var tjugonde minut. Men taxi går fortare. | tjugonde |
| Var är incheckningen för Stockholm? | incheckningen |
| Var är incheckningen? Jag är sen. | incheckningen |
| Var är provrummet? | provrummet |
| Varsågod! Smaklig måltid! | smaklig |
| Varsågod. Kakan är bakad i morse. | bakad |
| Vet du när sophämtningen kommer? | sophämtningen |
| Vi har städdag på lördag, alla hjälper till. | städdag |
| Vi har städdag på lördag. | städdag |
| Vi ska förresten på föräldramöte på tisdag. | föräldramöte |
| Visst! Provrummet är där borta. | provrummet |
| automaten | automaten |
| bakad | bakad |
| bifoga | bifoga |
| borrmaskin | borrmaskin |
| däcket är punkterat | punkterat |
| elden måste släckas | släckas |
| framhjulet | framhjulet |
| fyrtiotvå | fyrtiotvå |
| får jag låna en borrmaskin? | borrmaskin |
| föräldramöte | föräldramöte |
| grannhuset | grannhuset |
| handbagage | handbagage |
| handske | handske |
| incheckningen | incheckningen |
| jackorna | jackorna |
| jag har bara handbagage | handbagage |
| offert | offert |
| offerten | offerten |
| papperen | papperen |
| pelaren | pelaren |
| provrummet | provrummet |
| punkterat | punkterat |
| rätterna | rätterna |
| skruven | skruven |
| skruvmejsel | skruvmejsel |
| släckas | släckas |
| smaklig | smaklig |
| smaklig måltid | smaklig |
| sophämtningen | sophämtningen |
| städdag | städdag |
| tjugonde | tjugonde |
| trehundra | trehundra |
| trettiofem | trettiofem |
| var är incheckningen? | incheckningen |
| var är provrummet? | provrummet |
| vi har städdag på lördag | städdag |

