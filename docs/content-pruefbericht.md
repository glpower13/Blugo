# Prüfbericht — schwedischer Inhalt (maschinelle Vorprüfung)

> **Automatisch erzeugt** von `tools/check-swedish.py`. Nicht von Hand ändern — Skript erneut laufen lassen.

## Was dieser Bericht beweist — und was nicht

**Geprüft:** Jedes schwedische **Wort** ist ein echtes, real verwendetes schwedisches Wort. Grundlage: korpusbasierte Häufigkeiten (`wordfreq`, Zipf-Skala 0–8) plus Abgleich mit einem Wörterbuch (152.719 Einträge, Hunspell `dictionary-sv`).

**NICHT geprüft:** Wortstellung, Satzbau, Idiomatik („sagt man das so?"), Register/Situationspassung und die Birkenbihl-Dekodierungen. Dafür bleibt eine **menschliche Prüfung** nötig (`content-review-schwedisch.md`) — dieser Bericht macht sie nur klein genug, um machbar zu sein.

## Ergebnis

- Geprüfte schwedische Zeichenketten: **17794**
- Verschiedene Wörter: **1537**
- ✅ alltagshäufig belegt (Zipf ≥ 3.0): **1495**
- ⚠️ selten belegt: **42**
- ❌ nicht belegt (Tippfehler-Verdacht): **0**

## ❌ Nicht belegt — zuerst anschauen

Keine. ✅

## ⚠️ Selten belegt — kurz gegenlesen

Existiert, ist aber ungewöhnlich. Für Anfänger-Inhalt oft ein Zeichen, dass es ein geläufigeres Wort gäbe.

| Wort | Zipf | im Wörterbuch | kommt vor in |
|---|---|---|---|
| **bakbenet** | 1.65 | — | „Den haltar på bakbenet sedan promenaden." · „Den haltar på bakbenet." |
| **punkterat** | 1.78 | — | „Däcket är punkterat." · „Titta, däcket är punkterat!" |
| **laktosen** | 1.85 | — | „Visst. Är det laktosen?" · „laktosen" |
| **sophämtningen** | 1.88 | — | „Vet du när sophämtningen kommer?" · „sophämtningen" |
| **fyrtiotvå** | 1.98 | ja | „Fyrtiotvå. Äldre än jag ser ut, brukar folk säga." · „fyrtiotvå" |
| **badrumsdörren** | 2.03 | — | „Och badrumsdörren?" · „badrumsdörren" |
| **offerten** | 2.06 | — | „De levererar snabbt, står det i offerten." · „offerten" |
| **brådskar** | 2.07 | — | „Det kan vänta till helgen, inget brådskar." · „brådskar" |
| **provrummet** | 2.22 | — | „Kan jag prova den? Var är provrummet?" · „Ursäkta, var är provrummet?" |
| **framhjulet** | 2.25 | — | „I lådan. Titta förresten på framhjulet." · „framhjulet" |
| **textad** | 2.34 | — | „textad" · „Är filmen textad på svenska?" |
| **medlemsavgiften** | 2.44 | — | „Vad kostar medlemsavgiften per år?" · „Vad kostar medlemsavgiften?" |
| **papperen** | 2.47 | — | „Bra. Ta med papperen — och passet, alltid." · „papperen" |
| **städdag** | 2.48 | ja | „Vi har städdag på lördag, alla hjälper till." · „Vi har städdag på lördag." |
| **jackorna** | 2.53 | — | „Jaså? Jackorna sitter ofta lite löst." · „jackorna" |
| **grannhuset** | 2.55 | — | „Hon som bor i grannhuset. Snäll, säger barnen." · „grannhuset" |
| **borrmaskin** | 2.62 | ja | „Får jag låna en borrmaskin en stund?" · „Får jag låna en borrmaskin?" |
| **incheckningen** | 2.64 | — | „Ursäkta, var är incheckningen?" · „Var är incheckningen för Stockholm?" |
| **glutenfritt** | 2.65 | — | „Finns det något glutenfritt på menyn?" · „Finns det något glutenfritt?" |
| **trettiofem** | 2.68 | ja | „Trettiofem kronor, tack." · „trettiofem" |
| **rätterna** | 2.69 | — | „Precis. Och mellan rätterna sjunger alla, högt och falskt." · „rätterna" |
| **offert** | 2.70 | ja | „Här är vår offert. Priset gäller i två veckor." · „offert" |
| **tandtråd** | 2.74 | ja | „Bra. Använd tandtråd också." · „tandtråd" |
| **släckas** | 2.78 | — | „Elden måste släckas innan vi sover." · „Elden måste släckas — det är torrt i skogen." |
| **skruven** | 2.80 | — | „Tack! Nu drar jag åt den sista skruven." · „skruven" |
| **pelaren** | 2.80 | — | „Precis. Och vid pelaren svänger du." · „pelaren" |
| **smaklig** | 2.82 | ja | „Smaklig måltid!" · „Smaklig måltid." |
| **havremjölk** | 2.82 | — | „Jag tål inte laktos, har ni havremjölk?" · „havremjölk" |
| **glödlampan** | 2.83 | — | „Lampan fungerar inte, kanske är det glödlampan." · „glödlampan" |
| **bakad** | 2.85 | ja | „Varsågod. Kakan är bakad i morse." · „bakad" |
| **rabarber** | 2.87 | ja | „Säg till, jag byter gärna mot rabarber." · „rabarber" |
| **handske** | 2.88 | ja | „Du tappade förresten din handske där borta." · „handske" |
| **skruvmejsel** | 2.92 | ja | „Har du en skruvmejsel?" · „Hittade du en skruvmejsel?" |
| **automaten** | 2.93 | — | „Tyvärr, kortet fungerar inte i automaten." · „automaten" |
| **bifoga** | 2.94 | ja | „Gärna. Och du måste bifoga ett intyg också." · „bifoga" |
| **tjugonde** | 2.95 | ja | „Var tjugonde minut. Men taxi går fortare." · „tjugonde" |
| **tandvärk** | 2.97 | ja | „Jag har tandvärk och kan inte sova." · „Jag har tandvärk sedan i går." |
| **tomaterna** | 2.97 | — | „Precis rätt. Och tomaterna?" · „Vi skördar tomaterna snart, de är nästan röda." |
| **åttio** | 2.97 | ja | „Den är på åttio grader nu." · „åttio" |
| **trehundra** | 2.98 | ja | „Trehundra kronor jämnt." · „trehundra" |
| **föräldramöte** | 2.98 | ja | „Vi ska förresten på föräldramöte på tisdag." · „föräldramöte" |
| **handbagage** | 2.99 | ja | „Ingen väska, jag har bara handbagage." · „Jag har bara handbagage, går det snabbare då?" |

## Sätze mit auffälligen Wörtern

| Schwedisch | auffällige Wörter |
|---|---|
| Bra. Använd tandtråd också. | tandtråd |
| Bra. Ta med papperen — och passet, alltid. | papperen |
| De levererar snabbt, står det i offerten. | offerten |
| Den haltar på bakbenet sedan promenaden. | bakbenet |
| Den haltar på bakbenet. | bakbenet |
| Den är på åttio grader nu. | åttio |
| Det kan vänta till helgen, inget brådskar. | brådskar |
| Du tappade förresten din handske där borta. | handske |
| Däcket är punkterat. | punkterat |
| Elden måste släckas innan vi sover. | släckas |
| Elden måste släckas — det är torrt i skogen. | släckas |
| Elden måste släckas. | släckas |
| Finns det något glutenfritt på menyn? | glutenfritt |
| Finns det något glutenfritt? | glutenfritt |
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
| Jag har tandvärk och kan inte sova. | tandvärk |
| Jag har tandvärk sedan i går. | tandvärk |
| Jag har tandvärk. | tandvärk |
| Jag tål inte laktos, har ni havremjölk? | havremjölk |
| Jaså? Jackorna sitter ofta lite löst. | jackorna |
| Kan jag prova den? Var är provrummet? | provrummet |
| Lampan fungerar inte, kanske är det glödlampan. | glödlampan |
| Och badrumsdörren? | badrumsdörren |
| Precis rätt. Och tomaterna? | tomaterna |
| Precis. Och mellan rätterna sjunger alla, högt och falskt. | rätterna |
| Precis. Och vid pelaren svänger du. | pelaren |
| Smaklig måltid! | smaklig |
| Smaklig måltid. | smaklig |
| Säg till, jag byter gärna mot rabarber. | rabarber |
| Tack! Nu drar jag åt den sista skruven. | skruven |
| Tack, smaklig måltid! | smaklig |
| Titta, däcket är punkterat! | punkterat |
| Trehundra kronor jämnt. | trehundra |
| Trettiofem kronor, tack. | trettiofem |
| Tyvärr, kortet fungerar inte i automaten. | automaten |
| Ursäkta, var är incheckningen? | incheckningen |
| Ursäkta, var är provrummet? | provrummet |
| Utmärkt! Smaklig måltid. | smaklig |
| Vad kostar medlemsavgiften per år? | medlemsavgiften |
| Vad kostar medlemsavgiften? | medlemsavgiften |
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
| Vi skördar tomaterna snart, de är nästan röda. | tomaterna |
| Vi skördar tomaterna snart. | tomaterna |
| Visst! Provrummet är där borta. | provrummet |
| Visst. Är det laktosen? | laktosen |
| automaten | automaten |
| badrumsdörren | badrumsdörren |
| bakad | bakad |
| bakbenet | bakbenet |
| bifoga | bifoga |
| borrmaskin | borrmaskin |
| brådskar | brådskar |
| den haltar på bakbenet | bakbenet |
| däcket är punkterat | punkterat |
| elden måste släckas | släckas |
| finns det något glutenfritt? | glutenfritt |
| framhjulet | framhjulet |
| fyrtiotvå | fyrtiotvå |
| får jag låna en borrmaskin? | borrmaskin |
| föräldramöte | föräldramöte |
| glutenfritt | glutenfritt |
| glödlampan | glödlampan |
| grannhuset | grannhuset |
| handbagage | handbagage |
| handske | handske |
| havremjölk | havremjölk |
| incheckningen | incheckningen |
| jackorna | jackorna |
| jag har bara handbagage | handbagage |
| jag har tandvärk | tandvärk |
| laktosen | laktosen |
| medlemsavgiften | medlemsavgiften |
| offert | offert |
| offerten | offerten |
| papperen | papperen |
| pelaren | pelaren |
| provrummet | provrummet |
| punkterat | punkterat |
| rabarber | rabarber |
| rätterna | rätterna |
| skruven | skruven |
| skruvmejsel | skruvmejsel |
| släckas | släckas |
| smaklig | smaklig |
| smaklig måltid | smaklig |
| sophämtningen | sophämtningen |
| städdag | städdag |
| tandtråd | tandtråd |
| tandvärk | tandvärk |
| textad | textad |
| tjugonde | tjugonde |
| tomaterna | tomaterna |
| trehundra | trehundra |
| trettiofem | trettiofem |
| vad kostar medlemsavgiften? | medlemsavgiften |
| var är incheckningen? | incheckningen |
| var är provrummet? | provrummet |
| vi har städdag på lördag | städdag |
| vi skördar tomaterna snart | tomaterna |
| Är filmen textad på svenska? | textad |
| Är filmen textad? | textad |
| är filmen textad? | textad |
| åttio | åttio |

