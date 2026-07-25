# Prüfbericht — Rückübersetzung (Stufe 2)

> **Automatisch erzeugt** von `tools/backtranslation.ts` (`npm run check:backtranslation`). Nicht von Hand ändern — Werkzeug erneut laufen lassen.

## Was dieser Bericht beweist — und was nicht

**Geprüft:** Der Inhalt ist **in sich widerspruchsfrei** — jedes schwedische Wort hat eine Wort-für-Wort-Glosse, jedes Segment enthält die Wendung, die es zu üben behauptet, und dasselbe Wort wird nicht unbemerkt verschieden übersetzt.

**NICHT geprüft:** ob die Übersetzung **richtig** ist. Ein Satz kann vollständig widerspruchsfrei und trotzdem falsch sein. Die Abschnitte C und D sind **Verdachtslisten für einen Menschen** — geordnet, nicht entschieden (`content-review-schwedisch.md`).

## Ergebnis

- Geprüfte Zeilen (Wendungen · Segmente · Gesprächszeilen): **515**
- ❌ **A** Glossen-Lücken (hart): **0**
- ❌ **B** Kontext-Brüche (hart, Deckung < 0.5): **0**
- ℹ️ **B2** starke Kontextvariation (erwünscht): **9**
- ⚠️ **C** Glossen-Konflikte: **47** (davon bekannt kontextabhängig: 3)
- ⚠️ **D** mögliche Bedeutungsdrift: **44** (Deckung < 0.34)

## ❌ A — Glossen-Lücken

Keine. ✅ Jedes schwedische Wort im Inhalt hat eine Wort-für-Wort-Entsprechung.

## ❌ B — Kontext-Brüche

Keine. ✅ In jedem Segment ist die geübte Wendung wiederzuerkennen.

## ℹ️ B2 — starke Kontextvariation

Hier weicht der zweite Kontext deutlich von der Wendung ab. **Das soll so sein** — Kontextvariation ist Schritt 4 des Loops (`03-method.md`); dieselbe Wendung in anderer Verpackung ist genau der Punkt. Die Liste steht hier nur, damit sichtbar bleibt, wo die Wiedererkennung am dünnsten wird.

| Deckung | Segment | Wendung | fehlt im Satz | Satz |
|---|---|---|---|---|
| 50 % | s-kvitto2 | c-kvitto | kan, få | Får jag kvittot, tack? |
| 50 % | s-onthar2 | c-onthär | jag, har | Det gör ont här. |
| 67 % | s-betyder2 | c-betyder | det | Ursäkta, vad betyder ordet? |
| 67 % | s-hungrig2 | c-hungrig | jag | Är du hungrig? |
| 67 % | s-torstig2 | c-torstig | jag | Är du törstig? |
| 67 % | s-vader2 | c-vader | vilket | Idag är det vackert väder. |
| 75 % | s-bror2 | c-bror | jag | Har du en bror? |
| 75 % | s-kiloapplen2 | c-kiloapplen | tack | Jag vill ha ett kilo äpplen. |
| 75 % | s-tiominuter2 | c-tiominuter | det | Bussen tar tio minuter. |

## ⚠️ C — Glossen-Konflikte

Dasselbe schwedische Wort mit verschiedenen deutschen Glossen. **Vieles davon ist richtig** — deutsche Beugung („bist"/„bin") und kontextabhängige Partikeln. Verdächtig ist, wo sich die Bedeutungen wirklich unterscheiden.

| Schwedisch | Glossen | bekannt kontextabhängig |
|---|---|---|
| **till** | „noch" (Wendung c-entill) · „zu" (Wendung c-centrum) · „nach" (Wendung c-hoger) · „zum" (Wendung c-flygplatsen) · „bescheid" (Gespräch dlg-shop/g3) · „bei" (Gespräch dlg-arzt/a1) | ja |
| **en** | „eine" (Wendung c-entill) · „einer" (Wendung c-entimme) · „einen" (Wendung c-bror) · „ein" (Wendung c-biljett) | — |
| **är** | „ist" (Wendung c-var-toa) · „bin" (Wendung c-hungrig) · „bist" (Wendung c-gammal) | — |
| **den** | „das" (Wendung c-tardenhar) · „es" (Wendung c-tarden) · „sie" (Gespräch dlg-groceries/m7) | — |
| **ett** | „ein" (Wendung c-bokatrum) · „einen" (Segment s-bordtva1) · „eins" (Gespräch dlg-stadium/m6) | — |
| **har** | „hast" (Wendung c-harbarn) · „habe" (Wendung c-bror) · „haben" (Wendung c-ledigtrum) | — |
| **kommer** | „kommst" (Wendung c-varifran) · „komme" (Wendung c-centrum) · „kommt" (Gespräch dlg-cafe/k3) | — |
| **på** | „auf" (Wendung c-pasvenska) · „an" (Wendung c-hallerpa) · „am" (Segment s-sesses1) | — |
| **sen** | „später" (Wendung c-ringerdig) · „spät" (Segment s-forlat2) · „dann" (Gespräch dlg-weg/w4) | — |
| **vilken** | „welcher" (Wendung c-vilkendag) · „welche" (Wendung c-storlek) · „welches" (Wendung c-vilkenbil) | — |
| **att** | „zu" (Wendung c-trevligt) · „dass" (Segment s-forlat2) | — |
| **behöver** | „brauche" (Wendung c-lakare) · „brauchst" (Gespräch dlg-shop/g1) | — |
| **betalar** | „zahle" (Wendung c-kontant) · „zahlst" (Gespräch dlg-shop/g7) | — |
| **bra** | „gut" (Wendung c-marbra) · „guter" (Wendung c-braformad) | — |
| **där** | „dort" (Segment s-hallerpa2) · „da" (Gespräch dlg-shop/g5) | — |
| **det** | „das" (Wendung c-kostar) · „es" (Wendung c-vilkendag) | — |
| **dig** | „dich" (Wendung c-ringerdig) · „dir" (Gespräch dlg-groceries/m1) | — |
| **får** | „darf" (Segment s-ursaktamig1) · „bekomme" (Segment s-kvitto2) | — |
| **för** | „für" (Wendung c-bordtva) · „zu" (Wendung c-fordyrt) | — |
| **från** | „aus" (Wendung c-frantyskland) · „von" (Segment s-spar1) | — |
| **går** | „fährt" (Wendung c-nartag) · „geht" (Wendung c-hurfort) | — |
| **gör** | „machst" (Wendung c-vadgordu) · „macht" (Segment s-onthar2) | — |
| **ha** | „haben" (Wendung c-vill-ha) · „hab" (Wendung c-hadetbra) | — |
| **hej** | „tschüss" (Wendung c-hejda) · „hallo" (Segment s-cafe) | — |
| **heter** | „heiße" (Wendung c-heter) · „heißt" (Segment s-namn1) | — |
| **hjälp** | „hilfe" (Wendung c-hjalp) · „hilf" (Segment s-hjalpe2) | — |
| **ingen** | „keine" (Wendung c-ingenfara) · „kein" (Gespräch dlg-gaming/z9) | — |
| **kan** | „kann" (Wendung c-hjalpa) · „kannst" (Wendung c-upprepa) | — |
| **kom** | „komm" (Segment s-loppet2) · „kamst" (Gespräch dlg-garage/g1) | — |
| **kul** | „lustig" (Wendung c-lateskul) · „schön" (Gespräch dlg-garage/g1) | — |
| **ligger** | „liegt" (Wendung c-stationen) · „liegen" (Wendung c-vihalleross) | — |
| **mår** | „befindest" (Wendung c-hej) · „befinde" (Wendung c-marbra) | — |
| **mig** | „mir" (Wendung c-hjalpa) · „mich" (Wendung c-ursaktamig) | — |
| **nästa** | „nächste" (Segment s-narbuss2) · „nächsten" (Gespräch dlg-lake/f11) | — |
| **om** | „in" (Wendung c-entimme) · „wenn" (Segment s-sovaute2) | ja |
| **rekommenderar** | „empfiehlst" (Wendung c-rekommenderar) · „empfehle" (Gespräch dlg-restaurant/r6) | — |
| **ses** | „sehen uns" (Wendung c-vises) · „uns sehen" (Wendung c-sesses) | — |
| **ska** | „sollen" (Wendung c-sesses) · „sollst" (Gespräch dlg-ticket/t1) | — |
| **spelar** | „spielst" (Wendung c-vilketspel) · „spielt" (Wendung c-vemspelar) | — |
| **startar** | „startet" (Wendung c-startarinte) · „starten" (Gespräch dlg-gaming/z3) | — |
| **stor** | „großer" (Wendung c-storfisk) · „großes" (Gespräch dlg-stadium/m3) | — |
| **tack** | „danke" (Wendung c-tack) · „bitte" (Wendung c-entill) | ja |
| **tar** | „nimmt" (Wendung c-tiominuter) · „nehme" (Wendung c-tardenhar) | — |
| **trevlig** | „schönen" (Gespräch dlg-restaurant/r10) · „angenehme" (Gespräch dlg-ticket/t7) | — |
| **utmärkt** | „ausgezeichnet" (Gespräch dlg-restaurant/r8) · „ausgezeichnete" (Gespräch dlg-shop/g7) | — |
| **var** | „wo" (Wendung c-var-toa) · „war" (Wendung c-vargott) | — |
| **vilket** | „welches" (Wendung c-vaddatum) · „welchem" (Segment s-spar1) | — |

## ⚠️ D — mögliche Bedeutungsdrift

Der wörtliche Rückbau aus den Glossen deckt die behauptete Bedeutung kaum. **Oft völlig in Ordnung** — genau das ist ja der Birkenbihl-Effekt („jag vill ha" = wörtlich „ich will haben", gemeint „ich möchte"). Aber hier würde sich ein echter Übersetzungsfehler verstecken, deshalb steht die Liste vollständig hier, schwächste Deckung zuerst.

| Deckung | Schwedisch | wörtlich zurück | behauptete Bedeutung | Wo |
|---|---|---|---|---|
| 0 % | Där! Han sköt! | da er schoss | Da! Er hat geschossen! | Gespräch dlg-stadium/m4 |
| 0 % | En gång till! | ein Mal noch | Noch einmal! | Segment s-engang1 |
| 0 % | Ha det bra! | hab es gut | Alles Gute! | Segment s-hadetbra1 |
| 0 % | Vad håller du på med där? | was hältst du an mit dort | Was machst du da gerade? | Segment s-hallerpa2 |
| 0 % | Jag är med! | ich bin mit | Ich bin dabei! | Segment s-jagarmed1 |
| 0 % | Absolut, jag är med. | absolut ich bin mit | Auf jeden Fall, ich bin dabei. | Segment s-jagarmed2 |
| 0 % | Vad jobbar du med? | was arbeitest du mit | Was machst du beruflich? | Segment s-jobbar1 |
| 0 % | Och vad jobbar du med? | und was arbeitest du mit | Und was machst du beruflich? | Segment s-jobbar2 |
| 0 % | Jag har ont här. | ich habe Schmerz hier | Mir tut es hier weh. | Segment s-onthar1 |
| 0 % | Det gör ont här. | es macht Schmerz hier | Es tut hier weh. | Segment s-onthar2 |
| 0 % | Smaklig måltid! | schmackhaft Mahlzeit | Guten Appetit! | Segment s-smaklig1 |
| 0 % | Trevligt att träffas! | nett zu treffen | Schön, dich kennenzulernen! | Segment s-trevligt1 |
| 0 % | en gång till! | ein Mal noch | noch einmal! | Wendung c-engangtill |
| 0 % | jag fixar det | ich richte das | ich mache das | Wendung c-fixardet |
| 0 % | förlåt | verzeih | Entschuldigung | Wendung c-forlat |
| 0 % | ha det bra | hab es gut | alles Gute | Wendung c-hadetbra |
| 0 % | vad håller du på med? | was hältst du an mit | was machst du gerade? | Wendung c-hallerpa |
| 0 % | hur mår du? | wie befindest du | wie geht es dir? | Wendung c-hej |
| 0 % | jag är med | ich bin mit | ich bin dabei | Wendung c-jagarmed |
| 0 % | vad jobbar du med? | was arbeitest du mit | was machst du beruflich? | Wendung c-jobbar |
| 0 % | vad är klockan? | was ist die Uhr | wie spät ist es? | Wendung c-klockan |
| 0 % | jag har ont här | ich habe Schmerz hier | mir tut es hier weh | Wendung c-onthär |
| 0 % | jag är på väg | ich bin auf Weg | ich bin unterwegs | Wendung c-pavag |
| 0 % | smaklig måltid | schmackhaft Mahlzeit | guten Appetit | Wendung c-smaklig |
| 0 % | trevligt att träffas | nett zu treffen | schön, dich kennenzulernen | Wendung c-trevligt |
| 0 % | jag vill ha | ich will haben | ich möchte | Wendung c-vill-ha |
| 33 % | Jag förstår. Var gör det ont? | ich verstehe wo macht es Schmerz | Ich verstehe. Wo tut es weh? | Gespräch dlg-arzt/a3 |
| 33 % | Utmärkt! Smaklig måltid. | ausgezeichnet schmackhaft Mahlzeit | Ausgezeichnet! Guten Appetit. | Gespräch dlg-restaurant/r8 |
| 33 % | Kom igen, en gång till! | komm wieder ein Mal noch | Komm schon, noch einmal! | Segment s-engang2 |
| 33 % | Ingen fara, jag fixar det. | keine Gefahr ich richte das | Kein Problem, ich mache das. | Segment s-fixardet1 |
| 33 % | Tack, ha det bra! | danke hab es gut | Danke, alles Gute! | Segment s-hadetbra2 |
| 33 % | Hej! Vad håller du på med? | hallo was hältst du an mit | Hallo! Was machst du gerade? | Segment s-hallerpa1 |
| 33 % | Förlåt! – Ingen fara. | verzeih keine Gefahr | Entschuldigung! – Kein Problem. | Segment s-ingenfara2 |
| 33 % | Loppet börjar snart. | das Rennen beginnt bald | Das Rennen fängt gleich an. | Segment s-loppet1 |
| 33 % | Vänta lite, jag är på väg. | warte wenig ich bin auf Weg | Warte kurz, ich bin unterwegs. | Segment s-pavag2 |
| 33 % | Tack, smaklig måltid! | danke schmackhaft Mahlzeit | Danke, guten Appetit! | Segment s-smaklig2 |
| 33 % | Ska vi springa? | sollen wir laufen | Wollen wir laufen gehen? | Segment s-springa1 |
| 33 % | Hej, trevligt att träffas! | hallo nett zu treffen | Hallo, schön dich kennenzulernen! | Segment s-trevligt2 |
| 33 % | Vem vann? | wer gewann | Wer hat gewonnen? | Segment s-vemvann1 |
| 33 % | loppet börjar snart | das Rennen beginnt bald | das Rennen fängt gleich an | Wendung c-loppet |
| 33 % | kan jag få menyn? | kann ich bekommen die Speisekarte | kann ich die Karte haben? | Wendung c-menyn |
| 33 % | ska vi ses? | sollen wir uns sehen | wollen wir uns treffen? | Wendung c-sesses |
| 33 % | ska vi springa? | sollen wir laufen | wollen wir laufen gehen? | Wendung c-skavispringa |
| 33 % | vem vann? | wer gewann | wer hat gewonnen? | Wendung c-vemvann |

