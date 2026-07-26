# Prüfbericht — Rückübersetzung (Stufe 2)

> **Automatisch erzeugt** von `tools/backtranslation.ts` (`npm run check:backtranslation`). Nicht von Hand ändern — Werkzeug erneut laufen lassen.

## Was dieser Bericht beweist — und was nicht

**Geprüft:** Der Inhalt ist **in sich widerspruchsfrei** — jedes schwedische Wort hat eine Wort-für-Wort-Glosse, jedes Segment enthält die Wendung, die es zu üben behauptet, und dasselbe Wort wird nicht unbemerkt verschieden übersetzt.

**NICHT geprüft:** ob die Übersetzung **richtig** ist. Ein Satz kann vollständig widerspruchsfrei und trotzdem falsch sein. Die Abschnitte C und D sind **Verdachtslisten für einen Menschen** — geordnet, nicht entschieden (`content-review-schwedisch.md`).

## Ergebnis

- Geprüfte Zeilen (Wendungen · Segmente · Gesprächszeilen): **2303**
- ❌ **A** Glossen-Lücken (hart): **0**
- ❌ **B** Kontext-Brüche (hart, Deckung < 0.5): **0**
- ℹ️ **B2** starke Kontextvariation (erwünscht): **12**
- ⚠️ **C** Glossen-Konflikte: **269** — davon **0 zu prüfen**, 32 der App bekannt und dem Lerner erklärt, 35 kontextabhängige Funktionswörter, 202 nur deutsche Beugung
- ❌ **E** Zahl- oder Verneinungsfehler (hart): **0**
- ℹ️ **D** Abstand wörtlich ↔ gemeint: **152** (Deckung < 0.34)

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
| 60 % | s-a1t-igar2 | c-kvartover | klockan, är | Mötet? Det var igår kvart över tre. |
| 67 % | s-betyder2 | c-betyder | det | Ursäkta, vad betyder ordet? |
| 67 % | s-gillar3 | c-utanmjolk | tack | Jag gillar kaffe utan mjölk. |
| 67 % | s-hungrig2 | c-hungrig | jag | Är du hungrig? |
| 67 % | s-torstig2 | c-torstig | jag | Är du törstig? |
| 67 % | s-vader2 | c-vader | vilket | Idag är det vackert väder. |
| 75 % | s-b2n-bokstavligt1 | c-uttrycketbetyderannat | uttrycket | Bokstavligt talat betyder det något annat. |
| 75 % | s-bror2 | c-bror | jag | Har du en bror? |
| 75 % | s-kiloapplen2 | c-kiloapplen | tack | Jag vill ha ett kilo äpplen. |
| 75 % | s-tiominuter2 | c-tiominuter | det | Bussen tar tio minuter. |

## ⚠️ C1 — zu prüfen

Dasselbe schwedische Wort, verschiedene deutsche Bedeutungen — und es ist **kein** Funktionswort, bei dem das normal wäre. Hier erlebt ein Lerner den Unterschied als Widerspruch. Das ist die Liste, die ein Mensch wirklich durchgehen sollte.

Keine. ✅

## ✅ C1b — der App bekannt, dem Lerner erklärt

Auch hier trägt dasselbe Wort zwei Bedeutungen — aber die App sagt es. In der Dekodierung steht ein Satz wie „kort heißt hier »Karte« — es heißt auch »kurz«". Der Lerner erlebt den Unterschied damit als Stoff und nicht als Widerspruch. Gepflegt in `src/modules/content/polysemy.ts`, am Inhalt festgehalten durch `polysemy.test.ts`.

| Schwedisch | Glossen | bekannt kontextabhängig |
|---|---|---|
| **andra** | „anderer" (Wendung c-aandrasidan) · „zweite" (Gespräch dlg-stadium/m8) · „andere" (Gespräch dlg-mix-vag/mv7) · „anderen" (Gespräch dlg-swim/si10) | — |
| **ansökan** | „bewerbung" (Wendung c-skickatansokan) · „der bewerbung" (Segment s-b1j-referens1) · „der antrag" (Gespräch dlg-forsta/fo3) | — |
| **flyttar** | „ziehen" (Wendung c-um-flyttar) · „zieht" (Segment s-b1g-ledsen2) · „verlegen" (Gespräch dlg-mix-jobb/mj5) | — |
| **mitt** | „meinen" (Wendung c-ap-missat) · „mein" (Wendung c-tk-batteri) · „mitten" (Gespräch dlg-berattelse/be5) | — |
| **vägen** | „dem weg" (Wendung c-haltpavagen) · „weg" (Segment s-fe-tk2) · „die straße" (Gespräch dlg-asikt/as1) | — |
| **att** | „zu" (Wendung c-trevligt) · „dass" (Wendung c-tyckerattdetarbra) | — |
| **borta** | „weg" (Wendung c-bortabrahemmabast) · „drüben" (Gespräch dlg-shop/g5) | — |
| **där** | „dort" (Wendung c-fr-sadar) · „wo" (Gespräch dlg-medier/md5) | — |
| **fel** | „fehler" (Wendung c-felpavaran) · „falsch" (Wendung c-detvisadesigvarafel) | — |
| **framme** | „angekommen" (Segment s-a1t-nu2) · „bereit" (Gespräch dlg-mat/mt7) | — |
| **gång** | „mal" (Wendung c-engangtill) · „gang" (Gespräch dlg-mix-telefon/mt5) | — |
| **gott** | „lecker" (Wendung c-vargott) · „gut" (Segment s-fw-gm2) | — |
| **händer** | „passiert" (Gespräch dlg-airport/ap13) · „hände" (Gespräch dlg-forening/ve8) | — |
| **högt** | „hoch" (Segment s-b2v-pris2) · „laut" (Gespräch dlg-traditioner/tr9) | — |
| **ifrån** | „davon" (Gespräch dlg-kanslor/ks11) · „her" (Gespräch dlg-familj/fa1) | — |
| **kort** | „karte" (Wendung c-medkort) · „kurz" (Wendung c-kortsagtgickdetbra) | — |
| **lager** | „lager" (Segment s-a2k-mindre1) · „schichten" (Gespräch dlg-natur/nt11) | — |
| **mål** | „tor" (Wendung c-mal) · „ziel" (Gespräch dlg-mix-sprak/msp13) | — |
| **mycket** | „viel" (Wendung c-tack) · „sehr" (Gespräch dlg-traditioner/tr7) | — |
| **när** | „wann" (Wendung c-nartag) · „wenn" (Segment s-skickarmeddelande1) | — |
| **precis** | „genau" (Gespräch dlg-garage/g5) · „gerade" (Gespräch dlg-trafftid/tt11) | — |
| **ringde** | „klingelte" (Segment s-b2e-samtidigt1) · „riefst an" (Gespräch dlg-berattelse/be7) | — |
| **runt** | „rund" (Segment s-b1f-sjunger1) · „um" (Gespräch dlg-arzt/a11) | — |
| **så** | „so" (Wendung c-tack) · „also" (Gespräch dlg-inbjudan/ib3) | — |
| **skulle** | „würden" (Gespräch dlg-asikt/as3) · „sollte" (Gespräch dlg-mix-nyheter/mn9) | — |
| **slut** | „schluss" (Wendung c-tillslutlostedetsig) · „leer" (Wendung c-tk-batteri) | — |
| **stannade** | „hielt" (Gespräch dlg-berattelse/be5) · „blieb" (Gespräch dlg-familj/fa7) | — |
| **tid** | „zeit" (Wendung c-vilkentidpassar) · „termin" (Wendung c-bokaentid) | — |
| **utanför** | „außerhalb" (Wendung c-utanforbudgeten) · „draußen" (Gespräch dlg-tid/tid7) | — |
| **vad** | „was" (Wendung c-kostar) · „wie" (Wendung c-vadroligt) | — |
| **visst** | „klar" (Wendung c-fw-visst) · „wohl" (Gespräch dlg-halsning/hl1) | — |
| **volymen** | „die lautstärke" (Wendung c-na-volym) · „der menge" (Gespräch dlg-forhandling/fh3) | — |

## ℹ️ C3 — Funktionswörter (Bedeutung kommt aus dem Satz)

`på` heißt auf/an/am/im/über/bei, `var` heißt wo/war/jede. Das ist keine Uneinheitlichkeit, sondern der Unterschied zwischen zwei Sprachen — und genau der Grund, warum überhaupt dekodiert wird. Vollständig aufgeführt, damit nichts stillschweigend verschwindet.

| Schwedisch | Glossen | bekannt kontextabhängig |
|---|---|---|
| **den** | „das" (Wendung c-tardenhar) · „es" (Wendung c-hurfort) · „die" (Wendung c-forstor) · „sie" (Wendung c-dentrasig) · „er" (Wendung c-tk-hangt) · „ihn" (Wendung c-tk-starta) · „dem" (Segment s-b1o-haller2) · „den" (Gespräch dlg-debatt/db1) · „der" (Gespräch dlg-siffror/sf11) · „ihm" (Gespräch dlg-mix-verkstad/mw1) | ja |
| **det** | „das" (Wendung c-kostar) · „es" (Wendung c-vilkendag) · „dem" (Wendung c-harerfarenhet) · „da" (Segment s-vemardet3) · „die" (Segment s-b1j-lon1) · „daran" (Segment s-b1o-argument1) · „sie" (Segment s-b2v-avtal1) · „er" (Gespräch dlg-siffror/sf5) · „ihn" (Gespräch dlg-betala/bt11) | ja |
| **i** | „in" (Wendung c-iblatt) · „am" (Wendung c-imorgon) · „an" (Wendung c-ledigihelgen) · „im" (Wendung c-ijanuari) · „auf" (Wendung c-intehallbart) · „hinein" (Gespräch dlg-fika/fk7) · „ein" (Gespräch dlg-post/po5) · „für" (Gespräch dlg-forhandling/fh1) · „seit" (Gespräch dlg-vardag/vd7) | ja |
| **har** | „hast" (Wendung c-harbarn) · „habe" (Wendung c-bror) · „haben" (Wendung c-ledigtrum) · „habt" (Wendung c-nagotsott) · „hat" (Wendung c-fungeratdaligt) · „bin" (Wendung c-aldrigvaritmed) · „ist" (Segment s-a2te-flytta2) · „bist" (Gespräch dlg-kanslor/ks1) | ja |
| **på** | „auf" (Wendung c-pasvenska) · „an" (Wendung c-hallerpa) · „am" (Wendung c-pamandag) · „im" (Wendung c-pasommaren) · „über" (Wendung c-villklaga) · „seit" (Segment s-a1p-gar2) · „in" (Segment s-a2r-bo1) · „bei" (Segment s-b1f-aldrig1) | ja |
| **till** | „noch" (Wendung c-entill) · „zu" (Wendung c-centrum) · „nach" (Wendung c-hoger) · „für" (Wendung c-fe-present) · „bescheid" (Gespräch dlg-shop/g3) · „bei" (Gespräch dlg-arzt/a1) · „an" (Gespräch dlg-ansokan/an9) · „bis" (Gespräch dlg-mix-hotell/mh11) | ja |
| **om** | „in" (Wendung c-entimme) · „um" (Wendung c-tvaganger) · „über" (Wendung c-sagennyhet) · „am" (Wendung c-ta-borsta) · „wenn" (Segment s-sovaute2) · „ob" (Segment s-b1m-nyhet2) · „von" (Gespräch dlg-mix-vag/mv11) | ja |
| **ska** | „sollen" (Wendung c-sesses) · „werde" (Wendung c-hamtapaket) · „soll" (Wendung c-skrivaunder) · „werdet" (Segment s-a1p-roligt2) · „werden" (Segment s-a2in-komma1) · „sollst" (Gespräch dlg-ticket/t1) · „wirst" (Gespräch dlg-traditioner/tr1) | ja |
| **får** | „bekomme" (Wendung c-pengarnatillbaka) · „darf" (Wendung c-lasamellanraderna) · „darfst" (Segment s-a2ki-mat1) · „bekommen" (Segment s-b2u-skatt1) · „dürfen" (Segment s-ve-mo2) · „bekommt" (Gespräch dlg-moving/um16) | ja |
| **gör** | „machst" (Wendung c-vadgordu) · „macht" (Wendung c-gormigledsen) · „mache" (Segment s-a2b-kortet1) · „mach" (Gespräch dlg-phone/t7) · „tut" (Gespräch dlg-apotek/ap7) · „machen" (Gespräch dlg-tidsbokning/tb9) | ja |
| **var** | „wo" (Wendung c-var-toa) · „war" (Wendung c-vargott) · „waren" (Segment s-b2e-kort2) · „sei" (Segment s-b2n-uttryck2) · „warst" (Gespräch dlg-berattelse/be1) · „jede" (Gespräch dlg-mix-vag/mv13) | ja |
| **går** | „fährt" (Wendung c-nartag) · „geht" (Wendung c-hurfort) · „gehe" (Wendung c-detgarjagmedpa) · „gehen" (Wendung c-si-simhall) · „gestern" (Segment s-b1r-fel2) | ja |
| **åt** | „fest" (Gespräch dlg-garage/g9) · „gegen" (Gespräch dlg-miljo/mj3) · „in" (Gespräch dlg-mix-vag/mv7) · „für" (Gespräch dlg-mix-jobb/mj13) | ja |
| **för** | „für" (Wendung c-bordtva) · „zu" (Wendung c-fordyrt) · „dafür" (Gespräch dlg-asikt/as3) · „vor" (Gespräch dlg-mix-asikt/ma11) | ja |
| **in** | „herein" (Wendung c-valkommenin) · „ein" (Wendung c-st-inlamning) · „rein" (Segment s-fw-visst3) · „hinein" (Gespräch dlg-mix-vag/mv3) | ja |
| **sedan** | „her" (Segment s-a1p-snart1) · „seit" (Segment s-a2ap-hosta1) · „danach" (Segment s-a2r-mix4) · „dann" (Segment s-a2ki-mat1) | ja |
| **som** | „wie" (Wendung c-samtidigtsomdethande) · „der" (Segment s-vemardet2) · „das" (Gespräch dlg-sprak/sp5) · „die" (Gespräch dlg-mix-familj/mf9) | ja |
| **ut** | „heraus" (Wendung c-tautpengar) · „raus" (Wendung c-pe-ut) · „hinaus" (Segment s-tapadigmossa2) · „aus" (Gespräch dlg-lake/f9) | ja |
| **först** | „erst" (Wendung c-si-duscha) · „zuerst" (Segment s-a2b-utpengar2) · „als erster" (Gespräch dlg-track/t6) | ja |
| **från** | „aus" (Wendung c-frantyskland) · „von" (Segment s-spar1) · „ab" (Gespräch dlg-trafftid/tt5) | ja |
| **ingen** | „keine" (Wendung c-ingenfara) · „niemand" (Segment s-b1g-orolig1) · „kein" (Segment s-ap-hand2) | ja |
| **inget** | „kein" (Segment s-a1f-mjolk1) · „keine" (Segment s-b1j-ansokan2) · „nichts" (Segment s-b2u-utslapp1) | ja |
| **innan** | „bevor" (Segment s-tapadigmossa2) · „davor" (Gespräch dlg-tidsbokning/tb7) · „vorher" (Gespräch dlg-trafftid/tt5) | ja |
| **sen** | „später" (Wendung c-ringerdig) · „spät" (Wendung c-blirlitesen) · „dann" (Gespräch dlg-weg/w4) | ja |
| **än** | „als" (Wendung c-laterhardare) · „noch" (Segment s-fw-kanske3) | ja |
| **ändå** | „trotzdem" (Segment s-b1m-mix4) · „doch" (Gespräch dlg-mix-asikt/ma7) | ja |
| **av** | „von" (Wendung c-harerfarenhet) · „ab" (Segment s-valkommenin2) | ja |
| **då** | „dann" (Wendung c-hejda) · „denn" (Gespräch dlg-berattelse/be5) | ja |
| **dig** | „dich" (Wendung c-ringerdig) · „dir" (Wendung c-vilkentidpassar) | ja |
| **kvar** | „übrig" (Segment s-a2k-kvitto2) · „zurück" (Segment s-ca-skr2) | ja |
| **med** | „mit" (Wendung c-jobbar) · „dabei" (Segment s-b1f-nar2) | ja |
| **mig** | „mir" (Wendung c-hjalpa) · „mich" (Wendung c-ursaktamig) | ja |
| **ner** | „unten" (Gespräch dlg-post/po7) · „nieder" (Gespräch dlg-mix-restaurang/mr3) | ja |
| **tack** | „danke" (Wendung c-fw-tack) · „bitte" (Wendung c-entill) | ja |
| **upp** | „auf" (Wendung c-atuppmaten) · „hinauf" (Gespräch dlg-familj/fa9) | ja |

## ℹ️ C2 — nur deutsche Beugung (erwartet)

Vollständigkeit statt Schönfärberei: Diese Fälle stehen hier, damit nichts verschwiegen wird — aber „är" als „ist/bin/bist/sind" ist deutsche Grammatik, kein Befund. Die Trennung gibt es, weil eine Liste aus 248 Zeilen nicht gelesen wird und damit ihren Zweck verfehlt.

| Schwedisch | Glossen | bekannt kontextabhängig |
|---|---|---|
| **hela** | „die ganze" (Wendung c-fungeratdaligt) · „den ganzen" (Segment s-vilketvader1) · „ganzen" (Segment s-a1t-klockan2) · „ganze" (Segment s-a1v-sommar1) · „das ganze" (Gespräch dlg-forhandling/fh5) · „dem ganzen" (Gespräch dlg-vader/vr5) | — |
| **är** | „ist" (Wendung c-var-toa) · „bin" (Wendung c-hungrig) · „bist" (Wendung c-gammal) · „sind" (Wendung c-daarvioverens) · „seid" (Gespräch dlg-familj/fa5) | ja |
| **din** | „deins" (Segment s-vilkenbil2) · „dein" (Gespräch dlg-fw-dorren/fd3) · „deine" (Gespräch dlg-fika/fk1) · „deinem" (Gespräch dlg-forsta/fo9) · „deinen" (Gespräch dlg-artighet/ar5) | — |
| **en** | „eine" (Wendung c-entill) · „einer" (Wendung c-entimme) · „einen" (Wendung c-bror) · „ein" (Wendung c-biljett) · „einem" (Wendung c-bormedkompis) | ja |
| **ett** | „ein" (Wendung c-bokatrum) · „einem" (Wendung c-jobbarpakontor) · „eine" (Wendung c-skickarmejl) · „einen" (Segment s-bordtva3) · „eins" (Segment s-a2ap-utan1) | ja |
| **min** | „meine" (Wendung c-familj) · „meinem" (Segment s-a2b-overfor1) · „meiner" (Segment s-b1f-midsommar1) · „meinen" (Gespräch dlg-inbjudan/ib1) · „mein" (Gespräch dlg-resa/rs9) | — |
| **behöver** | „brauche" (Wendung c-lakare) · „brauchen" (Wendung c-behoverforsakring) · „brauchst" (Gespräch dlg-shop/g1) · „braucht" (Gespräch dlg-apotek/ap7) | — |
| **betalar** | „zahle" (Wendung c-kontant) · „zahlst" (Gespräch dlg-shop/g7) · „zahlen" (Gespräch dlg-reklamation/rk11) · „zahlt" (Gespräch dlg-miljo/mj9) | — |
| **bor** | „wohnst" (Wendung c-bordu) · „wohne" (Wendung c-borilagenhet) · „wohnt" (Segment s-familj3) · „wohnen" (Gespräch dlg-pets/pe1) | — |
| **bra** | „gut" (Wendung c-marbra) · „guter" (Wendung c-braformad) · „gutes" (Wendung c-ettbraargument) · „gute" (Gespräch dlg-kanslor/ks7) | — |
| **fin** | „schön" (Wendung c-fa-fin) · „schöne" (Segment s-hurmangarum1) · „schöner" (Segment s-akaskidor1) · „schönen" (Gespräch dlg-halsning/hl11) | — |
| **ha** | „haben" (Wendung c-vill-ha) · „hab" (Wendung c-hadetbra) · „habe" (Segment s-a1v-nasta1) · „ha" (Gespräch dlg-nyanser/ny11) | — |
| **hör** | „hörst" (Wendung c-horduemig) · „höre" (Wendung c-hordumig) · „hör" (Gespräch dlg-phone/t5) · „hören" (Gespräch dlg-dentist/ta16) | — |
| **kan** | „kann" (Wendung c-hjalpa) · „kannst" (Wendung c-upprepa) · „können" (Wendung c-bokaettmote) · „könnt" (Wendung c-narkannileverera) | — |
| **kom** | „komm" (Wendung c-fw-kom) · „kamt" (Wendung c-fe-tack) · „kam" (Segment s-b2i-sent1) · „kamst" (Gespräch dlg-garage/g1) | — |
| **kommer** | „kommst" (Wendung c-varifran) · „komme" (Wendung c-centrum) · „kommt" (Wendung c-narkommerbrevet) · „kommen" (Gespräch dlg-nodfall/nd7) | — |
| **nästa** | „nächste" (Wendung c-nastavecka) · „nächsten" (Gespräch dlg-lake/f11) · „nächster" (Gespräch dlg-post/po1) · „nächstes" (Gespräch dlg-mix-telefon/mt11) | — |
| **ser** | „siehst" (Wendung c-vilkenserie) · „sehe" (Segment s-ap-bag2) · „sieht" (Segment s-mu-fram2) · „sehen" (Gespräch dlg-mix-verkstad/mw11) | — |
| **tycker** | „meine" (Wendung c-tyckerattdetarbra) · „meinst" (Wendung c-vadtyckerduomdet) · „meinen" (Gespräch dlg-sprak/sp5) · „meint" (Gespräch dlg-swim/si5) | — |
| **vilken** | „welcher" (Wendung c-vilkendag) · „welche" (Wendung c-storlek) · „welch ein" (Wendung c-vilkenbil) · „welch" (Segment s-pe-klapp2) | — |
| **vilket** | „welches" (Wendung c-vaddatum) · „welchem" (Segment s-spar1) · „welch" (Segment s-vader3) · „welch ein" (Gespräch dlg-stadium/m6) | — |
| **år** | „jahre" (Wendung c-fyllerar) · „jahr" (Wendung c-ga-vaxer) · „jahren" (Gespräch dlg-vardag/vd7) | — |
| **blir** | „wird" (Wendung c-blirdet) · „werde" (Wendung c-blirlitesen) · „werden" (Segment s-a2in-van2) | — |
| **börjar** | „beginnt" (Wendung c-loppet) · „beginne" (Wendung c-borjarpamandag) · „beginnen" (Gespräch dlg-sprak/sp3) | — |
| **byter** | „tauscht" (Segment s-b1r-pengar1) · „tauschen" (Gespräch dlg-reklamation/rk11) · „tausche" (Gespräch dlg-garden/ga14) | — |
| **frågar** | „frage" (Gespräch dlg-fw-dorren/fd9) · „fragst" (Gespräch dlg-pets/pe16) · „fragt" (Gespräch dlg-colours/fa6) | — |
| **god** | „guten" (Wendung c-fw-godmorgon) · „gute" (Wendung c-fw-godnatt) · „gut" (Segment s-a1f-kopp1) | — |
| **hade** | „hatte" (Segment s-b1g-besviken1) · „hattest" (Gespräch dlg-post/po11) · „hatten" (Gespräch dlg-barn/br3) | — |
| **håller** | „hältst" (Wendung c-hallerpa) · „halte" (Wendung c-hallermeddig) · „halten" (Gespräch dlg-inbjudan/ib5) | — |
| **helgen** | „dem wochenende" (Wendung c-vadgordu) · „wochenende" (Wendung c-ca-talta) · „das wochenende" (Segment s-b2v-tanka1) | — |
| **hinner** | „schaffe" (Wendung c-st-hinner) · „schaffen" (Segment s-b2d-aterkomma2) · „schaffst" (Gespräch dlg-mix-jobb/mj7) | — |
| **jobbar** | „arbeitest" (Wendung c-jobbar) · „arbeite" (Wendung c-jobbarpakontor) · „arbeiten" (Wendung c-st-grupp) | — |
| **jobbet** | „der arbeit" (Segment s-sesses2) · „arbeit" (Segment s-b1j-lon1) · „die arbeit" (Segment s-b1j-borjar2) | — |
| **kör** | „fahr" (Segment s-raktfram2) · „fahre" (Gespräch dlg-vardag/vd7) · „fahren" (Gespräch dlg-mix-spel/ms3) | — |
| **ligger** | „liegt" (Wendung c-stationen) · „liegen" (Wendung c-vihalleross) · „liegst" (Gespräch dlg-studies/st5) | — |
| **liten** | „klein" (Wendung c-forliten) · „kleine" (Gespräch dlg-bank/bk5) · „kleines" (Gespräch dlg-miljo/mj3) | — |
| **måste** | „muss" (Wendung c-maste-lagga-pa) · „müssen" (Wendung c-sessnart) · „musst" (Gespräch dlg-forsta/fo7) | — |
| **minns** | „erinnere mich" (Wendung c-jagminnsattdetregnade) · „erinnere" (Segment s-b2e-minns2) · „erinnert sich" (Gespräch dlg-traditioner/tr7) | — |
| **nytt** | „neuer" (Wendung c-nytt-rekord) · „neues" (Segment s-b1m-serie2) · „neue" (Gespräch dlg-mix-telefon/mt3) | — |
| **ring** | „ruf an" (Wendung c-ringpolis) · „ruf" (Segment s-hjalp3) · „rufe an" (Gespräch dlg-tidsbokning/tb9) | — |
| **ringer** | „rufe an" (Wendung c-ringerdig) · „ruft an" (Segment s-vemardet2) · „rufst an" (Gespräch dlg-mix-jobb/mj7) | — |
| **sa** | „sagte" (Segment s-b2i-sent2) · „sagtest" (Gespräch dlg-fw-dorren/fd14) · „sagten" (Gespräch dlg-mix-nyheter/mn7) | — |
| **säger** | „sagt" (Wendung c-pasvenska) · „sagen" (Wendung c-dasagervisa) · „sage" (Segment s-b2i-droppen1) | — |
| **sjön** | „dem see" (Segment s-ca-talt2) · „den see" (Gespräch dlg-traning/tn3) · „see" (Gespräch dlg-natur/nt7) | — |
| **skriver** | „schreibe" (Wendung c-um-kontrakt) · „schreiben" (Gespräch dlg-forhandling/fh11) · „schreibst" (Gespräch dlg-mix-jobb/mj15) | — |
| **sover** | „schlafen" (Wendung c-sovaute) · „schlafe" (Segment s-a2ap-hosta2) · „schläfst" (Gespräch dlg-apotek/ap3) | — |
| **spelar** | „spielst" (Wendung c-vilketspel) · „spielt" (Wendung c-vemspelar) · „spiele" (Wendung c-mu-gitarr) | — |
| **står** | „steht" (Wendung c-hurstardet) · „stehen" (Wendung c-mu-fram) · „stehst" (Gespräch dlg-mix-verkstad/mw1) | — |
| **stationen** | „der bahnhof" (Wendung c-stationen) · „den bahnhof" (Segment s-ursaktamig3) · „dem bahnhof" (Gespräch dlg-tid/tid5) | — |
| **stor** | „großer" (Wendung c-storfisk) · „groß" (Wendung c-forstor) · „großes" (Gespräch dlg-stadium/m3) | — |
| **tar** | „nimmt" (Wendung c-tiominuter) · „nehme" (Wendung c-tardenhar) · „nehmen" (Wendung c-vitarcykeln) | — |
| **väntar** | „warten" (Gespräch dlg-gaming/z9) · „warte" (Gespräch dlg-tid/tid7) · „wartet" (Gespräch dlg-fika/fk1) | — |
| **varje** | „jeden" (Wendung c-ovarvarjedag) · „jedes" (Segment s-b1f-midsommar2) · „jede" (Gespräch dlg-studies/st1) | — |
| **veckan** | „der woche" (Wendung c-jagtranar) · „die woche" (Segment s-b1g-vila2) · „woche" (Segment s-st-te2) | — |
| **vet** | „weiß" (Segment s-fw-kanske3) · „wissen" (Segment s-b2u-hallbart1) · „weißt" (Gespräch dlg-nodfall/nd9) | — |
| **vill** | „will" (Wendung c-vill-ha) · „willst" (Wendung c-villdukomma) · „wollen" (Gespräch dlg-asikt/as1) | — |
| **åker** | „fahre" (Segment s-a1v-helg2) · „fahren" (Gespräch dlg-resa/rs1) | — |
| **allt** | „alles" (Wendung c-st-hinner) · „allem" (Segment s-b2e-kort1) | — |
| **annan** | „andere" (Wendung c-annanfarg) · „anderes" (Segment s-a1p-synd1) | — |
| **annonsen** | „der anzeige" (Segment s-b1j-lon2) · „die anzeige" (Gespräch dlg-moving/um1) | — |
| **apoteket** | „die apotheke" (Wendung c-apoteket) · „der apotheke" (Gespräch dlg-bank/bk9) | — |
| **året** | „jahr" (Gespräch dlg-forhandling/fh5) · „dem jahr" (Gespräch dlg-forening/ve5) | — |
| **avtalet** | „die vereinbarung" (Segment s-b2v-villkor2) · „dem vertrag" (Gespräch dlg-ansokan/an11) | — |
| **backen** | „der hang" (Gespräch dlg-traning/tn7) · „dem hang" (Gespräch dlg-vinter/vi9) | — |
| **barn** | „kinder" (Wendung c-harbarn) · „kindern" (Gespräch dlg-familj/fa9) | — |
| **bättre** | „besser" (Wendung c-battresentanaldrig) · „besseres" (Gespräch dlg-vader/vr11) | — |
| **berätta** | „erzähle" (Segment s-b1m-handlar2) · „erzähl" (Gespräch dlg-arzt/a5) | — |
| **billigare** | „billiger" (Segment s-bormedkompis2) · „billigeres" (Segment s-fordyrt3) | — |
| **blå** | „blaue" (Wendung c-fa-bla) · „blau" (Segment s-a2k-farg1) | — |
| **blanketten** | „dem formular" (Segment s-a2po-under2) · „das formular" (Gespräch dlg-forsta/fo1) | — |
| **bord** | „tisch" (Wendung c-bordtva) · „tische" (Gespräch dlg-fika/fk3) | — |
| **borde** | „solltest" (Gespräch dlg-reklamation/rk5) · „sollten" (Gespräch dlg-halsning/hl9) | — |
| **bordet** | „den tisch" (Segment s-b1f-sjunger1) · „dem tisch" (Gespräch dlg-mat/mt9) | — |
| **brukar** | „pflegt" (Segment s-b2e-slut1) · „pflegen" (Gespräch dlg-vardag/vd9) | — |
| **budgeten** | „des budgets" (Wendung c-utanforbudgeten) · „das budget" (Gespräch dlg-debatt/db3) | — |
| **dagen** | „den tag" (Wendung c-tvaganger) · „tag" (Wendung c-ta-borsta) | — |
| **ditt** | „deine" (Wendung c-dittpersonnummer) · „deinen" (Wendung c-ap-pass) | — |
| **dörren** | „der tür" (Gespräch dlg-fika/fk1) · „die tür" (Gespräch dlg-mix-hotell/mh9) | — |
| **eftermiddagen** | „den nachmittag" (Gespräch dlg-vader/vr3) · „nachmittag" (Gespräch dlg-mix-nyheter/mn7) | — |
| **färskt** | „frisches" (Segment s-harbrod2) · „frisch" (Gespräch dlg-mix-restaurang/mr9) | — |
| **festen** | „das fest" (Wendung c-narborjarfesten) · „dem fest" (Segment s-a2in-van1) | — |
| **fick** | „bekam" (Segment s-b1j-borjar2) · „bekamen" (Gespräch dlg-smalltalk/st5) | — |
| **fika** | „kaffeepause machen" (Wendung c-skavifika) · „kaffee" (Gespräch dlg-halsning/hl9) | — |
| **finns** | „gibt es" (Wendung c-finnsmjolk) · „gibt" (Segment s-fordyrt3) | — |
| **fint** | „schönes" (Segment s-sovaute2) · „schön" (Segment s-koketlitet1) | — |
| **firar** | „feiern" (Wendung c-firarmidsommar) · „feiert" (Wendung c-narfirarnidet) | — |
| **fixar** | „richte" (Wendung c-fixardet) · „richten" (Gespräch dlg-dentist/ta9) | — |
| **fler** | „mehrere" (Segment s-b2v-pris1) · „mehr" (Gespräch dlg-medier/md11) | — |
| **flera** | „mehrere" (Segment s-b2d-enkelt2) · „mehreren" (Gespräch dlg-colours/fa4) | — |
| **följer** | „folge" (Wendung c-ko-recept) · „folgen" (Segment s-b2u-samhalle2) | — |
| **fönstret** | „dem fenster" (Segment s-a1f-sitta2) · „das fenster" (Gespräch dlg-vader/vr1) | — |
| **förslaget** | „den vorschlag" (Wendung c-ve-rosta) · „der vorschlag" (Segment s-b2v-budget2) | — |
| **första** | „erste" (Segment s-b1r-klaga1) · „ersten" (Gespräch dlg-moving/um3) | — |
| **förstår** | „verstehe" (Wendung c-forstar) · „verstehst" (Segment s-b2n-fel1) | — |
| **fortsätter** | „fahren fort" (Segment s-b2e-sammanfatta1) · „fährt fort" (Gespräch dlg-vinter/vi3) | — |
| **fråga** | „frage" (Wendung c-st-fraga) · „fragen" (Gespräch dlg-siffror/sf3) | — |
| **fram** | „vorwärts" (Wendung c-raktfram) · „vorne" (Wendung c-mu-fram) | — |
| **gå** | „gehen" (Wendung c-mastega) · „geh" (Segment s-raktfram1) | — |
| **gammal** | „alt" (Wendung c-gammal) · „alte" (Wendung c-gammaltradition) | — |
| **gillar** | „mag" (Wendung c-gillar) · „magst" (Wendung c-mu-gillar) | — |
| **gjorde** | „machtest" (Gespräch dlg-kanslor/ks7) · „machte" (Gespräch dlg-artighet/ar3) | — |
| **hämtar** | „hole" (Wendung c-hamtapadagis) · „holt" (Wendung c-ap-bagage) | — |
| **heter** | „heiße" (Wendung c-heter) · „heißt" (Wendung c-fa-vad) | — |
| **hittar** | „finde" (Wendung c-tappatvaska) · „findest" (Gespräch dlg-fw-dorren/fd10) | — |
| **hjälp** | „hilfe" (Wendung c-hjalp) · „hilf" (Segment s-fw-snalla2) | — |
| **hjälper** | „hilft" (Segment s-b2u-utslapp1) · „helfen" (Segment s-na-stad2) | — |
| **hyr** | „mieten" (Wendung c-hyraenbil) · „mietet" (Gespräch dlg-resa/rs9) | — |
| **jobbade** | „arbeiteten" (Segment s-b1g-nojd2) · „arbeitete" (Segment s-b1j-erfarenhet2) | — |
| **kakan** | „dem kuchen" (Segment s-a1f-te2) · „der kuchen" (Segment s-a1f-smakar2) | — |
| **kallt** | „kalt" (Wendung c-kallt) · „kaltes" (Wendung c-ta-kansligt) | — |
| **kassan** | „die kasse" (Wendung c-kassan) · „der kasse" (Gespräch dlg-apotek/ap11) | — |
| **klockan** | „die uhr" (Wendung c-klockan) · „uhr" (Gespräch dlg-work/w7) | — |
| **koden** | „den code" (Wendung c-glomtkoden) · „der code" (Segment s-a2po-hamta1) | — |
| **kolla** | „schau" (Gespräch dlg-gaming/z5) · „schauen" (Gespräch dlg-trafftid/tt3) | — |
| **kommunen** | „die gemeinde" (Segment s-b2u-ansvar1) · „der gemeinde" (Gespräch dlg-mix-asikt/ma1) | — |
| **köpte** | „kaufte" (Segment s-b1r-fel2) · „kauftest" (Gespräch dlg-reklamation/rk3) | — |
| **kortet** | „die karte" (Wendung c-kortetfungerar) · „der karte" (Segment s-a2b-koden1) | — |
| **kursen** | „der kurs" (Segment s-a1v-nasta2) · „dem kurs" (Gespräch dlg-mix-sprak/msp1) | — |
| **kvällen** | „dem abend" (Segment s-b1f-ater1) · „abend" (Gespräch dlg-apotek/ap9) | — |
| **kvittot** | „der bon" (Wendung c-kvitto) · „den bon" (Wendung c-harkvittot) | — |
| **lagret** | „dem lager" (Gespräch dlg-klader/kl5) · „lager" (Gespräch dlg-colours/fa14) | — |
| **lång** | „lange" (Wendung c-hurlangtid) · „lang" (Wendung c-hurlangresan) | — |
| **läraren** | „die lehrkraft" (Wendung c-vemarlararen) · „die lehrerin" (Gespräch dlg-studies/st13) | — |
| **läst** | „gelesen" (Gespräch dlg-ansokan/an5) · „gelernt" (Gespräch dlg-ansokan/an7) | — |
| **låter** | „klingt" (Wendung c-lateskul) · „klingst" (Gespräch dlg-halsning/hl7) | — |
| **ledigt** | „freies" (Wendung c-ledigtrum) · „frei" (Segment s-a1f-sitta1) | — |
| **levererar** | „liefert" (Segment s-b2v-medpa1) · „liefern" (Gespräch dlg-debatt/db5) | — |
| **lite** | „wenig" (Wendung c-vantalite) · „ein wenig" (Segment s-fw-snalla3) | — |
| **litet** | „klein" (Wendung c-koketlitet) · „kleines" (Gespräch dlg-dentist/ta7) | — |
| **lyssna** | „hör" (Segment s-latarkonstigt2) · „höre" (Gespräch dlg-sprak/sp7) | — |
| **man** | „man" (Wendung c-pasvenska) · „mann" (Gespräch dlg-familj/fa9) | — |
| **mår** | „befindest" (Wendung c-hej) · „befinde" (Wendung c-marbra) | — |
| **menar** | „meine" (Wendung c-laterhardare) · „meinst" (Gespräch dlg-asikt/as7) | — |
| **mötet** | „das treffen" (Wendung c-motetborjar) · „dem treffen" (Segment s-b2d-aterkomma1) | — |
| **några** | „einige" (Wendung c-fe-tal) · „einigen" (Gespräch dlg-nodfall/nd7) | — |
| **natten** | „die nacht" (Segment s-a1v-sommar1) · „nacht" (Gespräch dlg-natur/nt11) | — |
| **ny** | „neu" (Segment s-a2b-konto2) · „neue" (Gespräch dlg-smalltalk/st5) | — |
| **nyckeln** | „der schlüssel" (Wendung c-nyckeln) · „den schlüssel" (Segment s-nyckeln3) | — |
| **öppna** | „öffnen" (Wendung c-oppnakonto) · „öffne" (Segment s-fe-pr2) | — |
| **ord** | „wort" (Wendung c-vadardetforord) · „worte" (Wendung c-fe-tal) | — |
| **passar** | „passt" (Wendung c-vilkentidpassar) · „passt auf" (Wendung c-pe-passar) | — |
| **passet** | „den pass" (Wendung c-glomintepasset) · „der pass" (Segment s-ap-bag3) | — |
| **perfekt** | „perfekt" (Segment s-a2te-sager2) · „perfektes" (Gespräch dlg-natur/nt5) | — |
| **prata** | „sprechen" (Wendung c-langsam) · „sprich" (Segment s-a1s-engelska1) | — |
| **pratar** | „spreche" (Wendung c-pratarlite) · „sprechen" (Gespräch dlg-berattelse/be1) | — |
| **priset** | „den preis" (Wendung c-forhandlaompriset) · „der preis" (Segment s-b2i-hund1) | — |
| **prognosen** | „die vorhersage" (Gespräch dlg-vader/vr11) · „der vorhersage" (Gespräch dlg-vinter/vi3) | — |
| **prova** | „probieren" (Wendung c-prova) · „probiere" (Gespräch dlg-bank/bk11) | — |
| **provrummet** | „die umkleidekabine" (Wendung c-provrum) · „die umkleide" (Segment s-prova3) | — |
| **rätt** | „richtige" (Segment s-b1r-vem2) · „richtig" (Gespräch dlg-uttryck/ut11) | — |
| **rekommenderar** | „empfiehlst" (Wendung c-rekommenderar) · „empfehle" (Gespräch dlg-restaurant/r6) | — |
| **resa** | „reisen" (Segment s-a1p-roligt2) · „reise" (Gespräch dlg-ticket/t7) | — |
| **resan** | „die reise" (Wendung c-hurlangresan) · „der reise" (Segment s-a2b-utpengar1) | — |
| **reser** | „reist" (Segment s-b1f-jul1) · „reisen" (Segment s-pe-pass2) | — |
| **röda** | „rote" (Wendung c-fa-rod) · „rot" (Segment s-ga-sd2) | — |
| **såg** | „sah" (Wendung c-sagennyhet) · „sahen" (Gespräch dlg-mix-halsa/mha9) | — |
| **säg** | „sag" (Gespräch dlg-fw-morgon/fm15) · „sage" (Gespräch dlg-sprak/sp7) | — |
| **samma** | „gleiche" (Gespräch dlg-gaming/z5) · „gleichen" (Gespräch dlg-pets/pe1) | — |
| **se** | „sehen" (Wendung c-fa-denhar) · „sieh" (Gespräch dlg-natur/nt5) | — |
| **ses** | „sehen uns" (Wendung c-vises) · „sehen" (Gespräch dlg-fw-dorren/fd12) | — |
| **sidan** | „seite" (Wendung c-aenasidan) · „die seite" (Gespräch dlg-forening/ve7) | — |
| **sista** | „letzte" (Wendung c-sistaavsnittet) · „letzter" (Segment s-ve-an2) | — |
| **sitter** | „sitzen" (Wendung c-ga-balkong) · „sitzt" (Wendung c-ve-styrelse) | — |
| **skärmen** | „dem bildschirm" (Gespräch dlg-mix-verkstad/mw11) · „den bildschirm" (Gespräch dlg-airport/ap9) | — |
| **skicka** | „schicken" (Wendung c-skickalank) · „schicke" (Gespräch dlg-tech/tk14) | — |
| **skickar** | „schicke" (Wendung c-skickarmejl) · „schicken" (Gespräch dlg-tidsbokning/tb7) | — |
| **slå** | „schlagt" (Gespräch dlg-mix-restaurang/mr3) · „schlage" (Gespräch dlg-dentist/ta1) | — |
| **smaklig** | „schmackhaft" (Wendung c-smaklig) · „schmackhafte" (Segment s-smaklig3) | — |
| **snön** | „dem schnee" (Segment s-a2ki-leker1) · „der schnee" (Gespräch dlg-vinter/vi9) | — |
| **snygg** | „schön" (Segment s-hurfort2) · „schick" (Segment s-tarden3) | — |
| **söker** | „suche" (Wendung c-sokerjobb) · „suchst" (Gespräch dlg-weg/w2) | — |
| **sov** | „schliefst" (Segment s-fw-gm2) · „schlaf" (Segment s-fw-gn2) | — |
| **stänger** | „schließt" (Wendung c-narstanger) · „schließen" (Gespräch dlg-apotek/ap11) | — |
| **stannar** | „bleibe" (Segment s-a1v-omvecka2) · „bleiben" (Segment s-b1f-jul2) | — |
| **starta** | „starte" (Wendung c-tk-starta) · „starten" (Gespräch dlg-vinter/vi11) | — |
| **startar** | „startet" (Wendung c-startarinte) · „starten" (Gespräch dlg-gaming/z3) | — |
| **staten** | „der staat" (Segment s-b2u-ansvar1) · „den staat" (Gespräch dlg-miljo/mj11) | — |
| **stod** | „stand" (Wendung c-stoditidningen) · „standet" (Gespräch dlg-berattelse/be9) | — |
| **stora** | „große" (Segment s-ko-stek2) · „großen" (Gespräch dlg-nodfall/nd11) | — |
| **sväng** | „bieg ab" (Segment s-hoger1) · „bieg" (Segment s-hoger3) | — |
| **svarar** | „antworte" (Segment s-b2v-tanka2) · „antwortet" (Gespräch dlg-studies/st15) | — |
| **svårt** | „schwer" (Segment s-a1s-heter1) · „schwerer" (Segment s-a1s-stavar2) | — |
| **ta** | „nimm" (Wendung c-tamedparaply) · „nehmen" (Wendung c-tautpengar) | — |
| **tåget** | „der zug" (Wendung c-nartag) · „dem zug" (Segment s-b2e-samtidigt2) | — |
| **talar** | „sprichst" (Wendung c-engelska) · „spricht" (Gespräch dlg-celebrate/fe14) | — |
| **tänker** | „denkst" (Segment s-b1o-inte2) · „denke" (Segment s-b2d-forklara1) | — |
| **telefonen** | „das telefon" (Segment s-b2e-samtidigt1) · „dem telefon" (Segment s-mu-bil2) | — |
| **tiden** | „die zeit" (Wendung c-flyttatiden) · „der zeit" (Gespräch dlg-mix-restaurang/mr5) | — |
| **tittar** | „schaue" (Wendung c-tittarbara) · „schauen" (Gespräch dlg-mix-verkstad/mw3) | — |
| **träden** | „die bäume" (Gespräch dlg-vader/vr5) · „den bäumen" (Gespräch dlg-camping/ca10) | — |
| **tredje** | „dritten" (Wendung c-na-vaning) · „dritter" (Gespräch dlg-mix-hotell/mh3) | — |
| **trevlig** | „schönen" (Gespräch dlg-restaurant/r10) · „schöne" (Gespräch dlg-ticket/t7) | — |
| **ugnen** | „den ofen" (Wendung c-ko-ugnen) · „der ofen" (Gespräch dlg-cooking/ko7) | — |
| **utmärkt** | „ausgezeichnet" (Gespräch dlg-restaurant/r8) · „ausgezeichnete" (Gespräch dlg-shop/g7) | — |
| **våningen** | „der etage" (Wendung c-na-vaning) · „etage" (Gespräch dlg-mix-hotell/mh3) | — |
| **vänster** | „links" (Wendung c-vanster) · „linker" (Segment s-ta-on2) | — |
| **varsågod** | „bitte" (Wendung c-varsagod) · „bitte sehr" (Gespräch dlg-fw-morgon/fm7) | — |
| **väskan** | „die tasche" (Wendung c-packavaskan) · „der tasche" (Segment s-a2k-kvitto1) | — |
| **vattnet** | „das wasser" (Wendung c-lugntvatten) · „dem wasser" (Gespräch dlg-resa/rs9) | — |
| **vem** | „wer" (Wendung c-vemvann) · „wen" (Gespräch dlg-inbjudan/ib11) | — |
| **ville** | „wollten" (Segment s-a1p-synd2) · „wollte" (Gespräch dlg-siffror/sf3) | — |
| **vintern** | „dem winter" (Segment s-morkttidigt1) · „den winter" (Segment s-a2k-skor1) | — |

## ❌ E — Zahlen und Verneinung

Zwei Dinge müssen in beiden Sprachen dasselbe sein, egal wie frei übersetzt wird: **die Zahl** und **ob der Satz verneint ist**. Wer `tre` mit „vier" übersetzt oder `inte` unterschlägt, dreht die Aussage um — der teuerste Fehler, den es hier geben kann, und einer der wenigen, die eine Maschine sicher sehen kann. Deshalb **hart**: Ein Befund lässt den Prüflauf scheitern.

Keine. ✅

## ℹ️ D — Abstand zwischen wörtlich und gemeint

Wie weit der Wort-für-Wort-Rückbau von der freien Übersetzung wegliegt. **Das ist keine Fehlerliste** — es ist der Birkenbihl-Effekt, gemessen: „smaklig måltid" heißt wörtlich „schmackhaft Mahlzeit" und gemeint „Guten Appetit", und genau diesen Abstand sichtbar zu machen ist der Zweck des Dekodierens. Beim Durchsehen aller Zeilen war keine einzige falsch. Die Liste stand vorher als ⚠️ „mögliche Bedeutungsdrift" hier und warnte damit vor dem Produkt; was sich maschinell wirklich prüfen lässt, steht jetzt oben unter E. Größter Abstand zuerst — hier stehen die Wendungen, die am meisten Sprache enthalten.

| Deckung | Schwedisch | wörtlich zurück | gemeint | Wo |
|---|---|---|---|---|
| 0 % | Hej då ! | hallo dann | Tschüss ! | Gespräch dlg-phone/t9 |
| 0 % | Där! Han sköt! | dort er schoss | Da! Er hat geschossen! | Gespräch dlg-stadium/m4 |
| 0 % | Vad tycker du om det? Jag håller med dig. | was meinst du über das ich halte mit dir | Was hältst du davon? Ich stimme dir zu. | Segment s-b1o-mix1 |
| 0 % | Till slut löste det sig, som det brukar. | zu Schluss löste es sich wie es pflegt | Am Ende hat es sich gelöst, wie meistens. | Segment s-b2e-slut1 |
| 0 % | Ta det lugnt, det är ingen ko på isen. | nimm es ruhig es ist keine Kuh auf dem Eis | Immer mit der Ruhe, es eilt nicht. | Segment s-b2i-ko1 |
| 0 % | Här ligger en hund begraven, och det var droppen. | hier liegt ein Hund begraben und das war der Tropfen | Da stimmt etwas nicht, und das war zu viel des Guten. | Segment s-b2i-mix3 |
| 0 % | En gång till! | ein Mal noch | Noch einmal! | Segment s-engang1 |
| 0 % | Skål! | Schale | Prost! | Segment s-fe-sk1 |
| 0 % | Skål för dig! | Schale für dich | Prost auf dich! | Segment s-fe-sk2 |
| 0 % | Ha det bra! | hab es gut | Alles Gute! | Segment s-hadetbra1 |
| 0 % | Vad håller du på med där? | was hältst du an mit dort | Was machst du da gerade? | Segment s-hallerpa2 |
| 0 % | Hej då, ha det bra! | hallo dann hab es gut | Tschüss, alles Gute! | Segment s-hejda3 |
| 0 % | Jag är med! | ich bin mit | Ich bin dabei! | Segment s-jagarmed1 |
| 0 % | Absolut, jag är med. | absolut ich bin mit | Auf jeden Fall, ich bin dabei. | Segment s-jagarmed2 |
| 0 % | Vad jobbar du med? | was arbeitest du mit | Was machst du beruflich? | Segment s-jobbar1 |
| 0 % | Och vad jobbar du med? | und was arbeitest du mit | Und was machst du beruflich? | Segment s-jobbar2 |
| 0 % | Det låter konstigt. | das klingt seltsam | Das hört sich komisch an. | Segment s-latarkonstigt1 |
| 0 % | Jag har ont här. | ich habe Schmerz hier | Mir tut es hier weh. | Segment s-onthar1 |
| 0 % | Det gör ont här. | es macht Schmerz hier | Es tut hier weh. | Segment s-onthar2 |
| 0 % | Det är för varmt för mig. | es ist zu warm für mich | Es ist mir zu heiß. | Segment s-si-va1 |
| 0 % | Smaklig måltid! | schmackhaft Mahlzeit | Guten Appetit! | Segment s-smaklig1 |
| 0 % | Den har hängt sig. | er hat gehängt sich | Er ist abgestürzt. | Segment s-tk-hang1 |
| 0 % | Trevligt att träffas! | nett zu treffen | Schön, dich kennenzulernen! | Segment s-trevligt1 |
| 0 % | var är incheckningen? | wo ist die Eincheckung | wo ist der Check-in? | Wendung c-ap-incheck |
| 0 % | jag är orolig för det | ich bin besorgt für das | ich mache mir Sorgen darüber | Wendung c-arorolig |
| 0 % | det blåser mycket | es weht viel | es ist sehr windig | Wendung c-blasermycket |
| 0 % | bokstavligt talat | buchstäblich gesprochen | wörtlich genommen | Wendung c-bokstavligttalat |
| 0 % | det går jag med på | dem gehe ich mit auf | darauf lasse ich mich ein | Wendung c-detgarjagmedpa |
| 0 % | det var droppen | das war der Tropfen | das war zu viel des Guten | Wendung c-detvardroppen |
| 0 % | en gång till! | ein Mal noch | noch einmal! | Wendung c-engangtill |
| 0 % | skål! | Schale | prost! | Wendung c-fe-skal |
| 0 % | jag fixar det | ich richte das | ich mache das | Wendung c-fixardet |
| 0 % | förlåt | verzeih | Entschuldigung | Wendung c-forlat |
| 0 % | ha det bra | hab es gut | alles Gute | Wendung c-hadetbra |
| 0 % | jag håller inte med | ich halte nicht mit | ich stimme nicht zu | Wendung c-hallerintemed |
| 0 % | jag håller med dig | ich halte mit dir | ich stimme dir zu | Wendung c-hallermeddig |
| 0 % | vad håller du på med? | was hältst du an mit | was machst du gerade? | Wendung c-hallerpa |
| 0 % | hur mår du? | wie befindest du | wie geht es dir? | Wendung c-hej |
| 0 % | hej då | hallo dann | tschüss | Wendung c-hejda |
| 0 % | här ligger en hund begraven | hier liegt ein Hund begraben | da stimmt etwas nicht | Wendung c-hundbegraven |
| 0 % | hur går det? | wie geht es | wie läuft es? | Wendung c-hurgardet |
| 0 % | hur stavar man det? | wie buchstabiert man es | wie schreibt man das? | Wendung c-hurstavar |
| 0 % | det är ingen ko på isen | es ist keine Kuh auf dem Eis | es eilt nicht | Wendung c-ingenkopaisen |
| 0 % | det är inte hållbart i längden | das ist nicht haltbar auf die Länge | das ist auf Dauer nicht tragfähig | Wendung c-intehallbart |
| 0 % | jag är med | ich bin mit | ich bin dabei | Wendung c-jagarmed |
| 0 % | jag fryser | ich friere | mir ist kalt | Wendung c-jagfryser |
| 0 % | vad jobbar du med? | was arbeitest du mit | was machst du beruflich? | Wendung c-jobbar |
| 0 % | vad är klockan? | was ist die Uhr | wie spät ist es? | Wendung c-klockan |
| 0 % | det låter konstigt | das klingt seltsam | das hört sich komisch an | Wendung c-latarkonstigt |
| 0 % | jag har ont här | ich habe Schmerz hier | mir tut es hier weh | Wendung c-onthär |
| 0 % | jag är på väg | ich bin auf Weg | ich bin unterwegs | Wendung c-pavag |
| 0 % | det är för varmt för mig | es ist zu warm für mich | es ist mir zu heiß | Wendung c-si-varmt |
| 0 % | smaklig måltid | schmackhaft Mahlzeit | guten Appetit | Wendung c-smaklig |
| 0 % | till slut löste det sig | zu Schluss löste es sich | am Ende hat es sich gelöst | Wendung c-tillslutlostedetsig |
| 0 % | den har hängt sig | er hat gehängt sich | er ist abgestürzt | Wendung c-tk-hangt |
| 0 % | trevligt att träffas | nett zu treffen | schön, dich kennenzulernen | Wendung c-trevligt |
| 0 % | vad handlar den om? | was handelt sie um | worum geht es darin? | Wendung c-vadhandlardenom |
| 0 % | vad roligt! | wie lustig | wie schön! | Wendung c-vadroligt |
| 0 % | vad tycker du om det? | was meinst du über das | was hältst du davon? | Wendung c-vadtyckerduomdet |
| 0 % | jag vill ha | ich will haben | ich möchte | Wendung c-vill-ha |
| 0 % | jag vill klaga på det här | ich will klagen über das hier | ich möchte mich darüber beschweren | Wendung c-villklaga |
| 14 % | Skämtar du? Du sa ju precis att du var på väg! | scherzt du du sagtest ja gerade dass du warst auf Weg | Machst du Witze? Du hast doch gerade gesagt, du bist unterwegs! | Gespräch dlg-trafftid/tt11 |
| 20 % | Den klär dig faktiskt. Något mer i dag? | sie kleidet dich tatsächlich etwas mehr am Tag | Sie steht dir wirklich. Sonst noch etwas heute? | Gespräch dlg-klader/kl9 |
| 20 % | Gör det! Ha det bra så länge, . | mach das hab es gut so lange | Mach das! Bis dahin alles Gute, . | Gespräch dlg-tid/tid11 |
| 20 % | Förlåt, jag blir lite sen i dag. | verzeih ich werde wenig spät am Tag | Entschuldige, ich komme heute etwas später. | Segment s-a2te-sen2 |
| 20 % | För att sammanfatta: vi fortsätter som förut. | für zu zusammenfassen wir fahren fort wie vorher | Um es zusammenzufassen: wir machen weiter wie bisher. | Segment s-b2e-sammanfatta1 |
| 25 % | Samma här. Vad är närmast i tiden? | gleiche hier was ist am nächsten in der Zeit | Bei mir genauso. Was steht als Nächstes an? | Gespräch dlg-studies/st7 |
| 25 % | Kan jag ta med en vän till festen? | kann ich nehmen mit einen Freund zu dem Fest | Kann ich jemanden zur Feier mitbringen? | Segment s-a2in-van1 |
| 25 % | Vad handlar den om? Är den spännande? | was handelt sie um ist sie spannend | Worum geht es darin? Ist es spannend? | Segment s-b1m-handlar1 |
| 25 % | Det visade sig vara fel, men till slut löste det sig. | es zeigte sich sein falsch aber zu Schluss löste es sich | Es stellte sich als falsch heraus, aber am Ende hat es sich gelöst. | Segment s-b2e-mix2 |
| 25 % | Det var droppen, nu säger jag upp mig. | das war der Tropfen jetzt sage ich auf mich | Das war zu viel des Guten, jetzt kündige ich. | Segment s-b2i-droppen1 |
| 25 % | Det är ingen ko på isen, ingen fara på taket. | es ist keine Kuh auf dem Eis keine Gefahr auf dem Dach | Es eilt nicht, kein Grund zur Sorge. | Segment s-b2i-mix1 |
| 25 % | Ingen fara på taket, jag fixar det. | keine Gefahr auf dem Dach ich richte es | Kein Grund zur Sorge, ich mache das. | Segment s-b2i-taket1 |
| 25 % | Vi tar med skräpet hem. | wir nehmen mit den Abfall heim | Wir nehmen den Müll mit nach Hause. | Segment s-ca-skr1 |
| 25 % | Jag vill klippa mig. | ich will schneiden mich | Ich möchte mir die Haare schneiden lassen. | Segment s-fr-klipp1 |
| 25 % | Lyssna, det låter konstigt. | hör das klingt seltsam | Hör mal, das hört sich komisch an. | Segment s-latarkonstigt2 |
| 25 % | Varsågod! Smaklig måltid! | bitte schmackhafte Mahlzeit | Bitte sehr! Guten Appetit! | Segment s-smaklig3 |
| 25 % | vi tar med skräpet hem | wir nehmen mit den Abfall heim | wir nehmen den Müll mit nach Hause | Wendung c-ca-skrap |
| 25 % | det visade sig vara fel | es zeigte sich sein falsch | es stellte sich als falsch heraus | Wendung c-detvisadesigvarafel |
| 25 % | jag vill klippa mig | ich will schneiden mich | ich möchte mir die Haare schneiden lassen | Wendung c-fr-klippa |
| 25 % | jag såg en nyhet om det | ich sah eine Nachricht über das | ich habe eine Nachricht darüber gesehen | Wendung c-sagennyhet |
| 33 % | Jag förstår. Var gör det ont? | ich verstehe wo macht es Schmerz | Ich verstehe. Wo tut es weh? | Gespräch dlg-arzt/a3 |
| 33 % | Hittade du en skruvmejsel? | fandest du einen Schraubenzieher | Hast du einen Schraubenzieher gefunden? | Gespräch dlg-fw-dorren/fd7 |
| 33 % | När satte du ner dem? | wann setztest du nieder sie | Wann hast du sie gesetzt? | Gespräch dlg-garden/ga10 |
| 33 % | Och förresten: du sa ifrån på mötet. Det var modigt. | und übrigens du sagtest davon auf dem Treffen das war mutig | Und übrigens: du hast im Meeting etwas gesagt. Das war mutig. | Gespräch dlg-kanslor/ks11 |
| 33 % | Hej! Vad gäller det? | hallo was gilt es | Hallo! Worum geht es? | Gespräch dlg-reklamation/rk1 |
| 33 % | Utmärkt! Smaklig måltid. | ausgezeichnet schmackhaft Mahlzeit | Ausgezeichnet! Guten Appetit. | Gespräch dlg-restaurant/r8 |
| 33 % | Självklart. Spring du, ! | selbstverständlich lauf du | Natürlich. Lauf du nur, ! | Gespräch dlg-smalltalk/st11 |
| 33 % | Just det! Du hänger med redan, . | gerade das du hängst mit schon | Genau! Du kommst schon mit, . | Gespräch dlg-traditioner/tr11 |
| 33 % | Hej då och hälsa hemma! | hallo dann und grüße daheim | Tschüss und grüß zu Hause! | Segment s-a1p-halsa1 |
| 33 % | Vad roligt! Grattis till dig. | wie lustig Glückwunsch zu dir | Wie schön! Herzlichen Glückwunsch. | Segment s-a1p-roligt1 |
| 33 % | Var är incheckningen för Stockholm? | wo ist die Eincheckung für Stockholm | Wo ist der Check-in nach Stockholm? | Segment s-ap-incheck2 |
| 33 % | Var är incheckningen? Jag är sen. | wo ist die Eincheckung ich bin spät | Wo ist der Check-in? Ich bin spät dran. | Segment s-ap-incheck3 |
| 33 % | Jag är orolig för det, ingen har hört av sig. | ich bin besorgt für das niemand hat gehört von sich | Ich mache mir Sorgen darüber, niemand hat sich gemeldet. | Segment s-b1g-orolig1 |
| 33 % | Vilken serie ser du på? Vad handlar den om? | welche Serie siehst du auf was handelt sie um | Welche Serie schaust du? Worum geht es darin? | Segment s-b1m-mix1 |
| 33 % | Jag såg en nyhet om det i morse. | ich sah eine Nachricht über das am Morgen | Ich habe heute Morgen eine Nachricht darüber gesehen. | Segment s-b1m-nyhet1 |
| 33 % | På den punkten håller jag med dig. | auf dem Punkt halte ich mit dir | In diesem Punkt stimme ich dir zu. | Segment s-b1o-haller2 |
| 33 % | Tvärtom, det tror jag inte alls. | umgekehrt das glaube ich nicht überhaupt | Im Gegenteil, das glaube ich gar nicht. | Segment s-b1o-tvartom1 |
| 33 % | Vad tycker du om det, ärligt? | was meinst du über das ehrlich | Was hältst du davon, ehrlich? | Segment s-b1o-vadtycker1 |
| 33 % | Vad tycker du om det? Jag är inte säker. | was meinst du über das ich bin nicht sicher | Was hältst du davon? Ich bin mir nicht sicher. | Segment s-b1o-vadtycker2 |
| 33 % | Gäller garantin fortfarande? Jag köpte den i fjol. | gilt die Garantie weiterhin ich kaufte sie im Vorjahr | Gilt die Garantie noch? Ich habe es letztes Jahr gekauft. | Segment s-b1r-garanti1 |
| 33 % | Jag vill klaga på det här. Vem kan jag prata med? | ich will klagen über das hier wer kann ich sprechen mit | Ich möchte mich darüber beschweren. Mit wem kann ich sprechen? | Segment s-b1r-mix2 |
| 33 % | Det tog en vecka, men till slut löste det sig. | es nahm eine Woche aber zu Schluss löste es sich | Es dauerte eine Woche, aber am Ende hat es sich gelöst. | Segment s-b2e-slut2 |
| 33 % | Här ligger en hund begraven, tro mig. | hier liegt ein Hund begraben glaube mir | Da stimmt etwas nicht, glaub mir. | Segment s-b2i-hund2 |
| 33 % | Lagom är bäst, och borta bra men hemma bäst. | gerade genug ist am besten und weg gut aber daheim am besten | Das rechte Maß ist am besten, und daheim ist es doch am schönsten. | Segment s-b2i-mix2 |
| 33 % | Okej, det går jag med på. | okay dem gehe ich mit auf | Okay, darauf lasse ich mich ein. | Segment s-b2v-medpa2 |
| 33 % | Det blåser mycket idag. | es weht viel heute | Es ist heute sehr windig. | Segment s-blasermycket1 |
| 33 % | Kom igen, en gång till! | komm wieder ein Mal noch | Komm schon, noch einmal! | Segment s-engang2 |
| 33 % | Ingen fara, jag fixar det. | keine Gefahr ich richte das | Kein Problem, ich mache das. | Segment s-fixardet1 |
| 33 % | Hej! Trevligt att träffas. | hallo nett zu treffen | Hallo! Schön, dich kennenzulernen. | Segment s-fw-hej3 |
| 33 % | Jag klipper gräset på lördag. | ich schneide das Gras am Samstag | Ich mähe am Samstag den Rasen. | Segment s-ga-kl1 |
| 33 % | Tack, ha det bra! | danke hab es gut | Danke, alles Gute! | Segment s-hadetbra2 |
| 33 % | Hej! Vad håller du på med? | hallo was hältst du an mit | Hallo! Was machst du gerade? | Segment s-hallerpa1 |
| 33 % | Förlåt! – Ingen fara. | verzeih keine Gefahr | Entschuldigung! – Kein Problem. | Segment s-ingenfara2 |
| 33 % | Jag fryser, ska vi gå in? | ich friere sollen wir gehen herein | Mir ist kalt, sollen wir reingehen? | Segment s-jagfryser1 |
| 33 % | Det låter kul! | das klingt schön | Das klingt nach Spaß! | Segment s-lateskul1 |
| 33 % | Loppet börjar snart. | das Rennen beginnt bald | Das Rennen fängt gleich an. | Segment s-loppet1 |
| 33 % | Förlåt, jag måste lägga på. | verzeih ich muss legen auf | Entschuldigung, ich muss auflegen. | Segment s-maste-lagga-pa2 |
| 33 % | Grannen klagade. | der Nachbar klagte | Der Nachbar hat sich beschwert. | Segment s-na-gra1 |
| 33 % | Grannen klagade — kan du sänka volymen? | der Nachbar klagte kannst du senken die Lautstärke | Der Nachbar hat sich beschwert — kannst du leiser machen? | Segment s-na-gra3 |
| 33 % | Kan du sänka volymen? | kannst du senken die Lautstärke | Kannst du leiser machen? | Segment s-na-vol1 |
| 33 % | Vänta lite, jag är på väg. | warte wenig ich bin auf Weg | Warte kurz, ich bin unterwegs. | Segment s-pavag2 |
| 33 % | Tack, smaklig måltid! | danke schmackhaft Mahlzeit | Danke, guten Appetit! | Segment s-smaklig2 |
| 33 % | Ska vi springa? | sollen wir laufen | Wollen wir laufen gehen? | Segment s-springa1 |
| 33 % | Det gör ont här nere. | es macht Schmerz hier unten | Es tut hier unten weh. | Segment s-ta-on1 |
| 33 % | Hej, trevligt att träffas! | hallo nett zu treffen | Hallo, schön dich kennenzulernen! | Segment s-trevligt2 |
| 33 % | Vem vann? | wer gewann | Wer hat gewonnen? | Segment s-vemvann1 |
| 33 % | det beror på hur man säger det | es beruht auf wie man sagt es | es kommt darauf an, wie man es sagt | Wendung c-berorpahurmansager |
| 33 % | jag blir lite sen | ich werde wenig spät | ich komme etwas später | Wendung c-blirlitesen |
| 33 % | kan vi boka ett möte? | können wir buchen ein Treffen | können wir einen Termin machen? | Wendung c-bokaettmote |
| 33 % | det började helt vanligt | es begann ganz gewöhnlich | es fing ganz normal an | Wendung c-borjadehelvanligt |
| 33 % | borta bra men hemma bäst | weg gut aber daheim am besten | daheim ist es doch am schönsten | Wendung c-bortabrahemmabast |
| 33 % | kan vi flytta tiden? | können wir verlegen die Zeit | können wir den Termin verschieben? | Wendung c-flyttatiden |
| 33 % | när fyller du år? | wann füllst du Jahre | wann hast du Geburtstag? | Wendung c-fyllerar |
| 33 % | jag klipper gräset på lördag | ich schneide das Gras am Samstag | ich mähe am Samstag den Rasen | Wendung c-ga-klippa |
| 33 % | ingen fara på taket | keine Gefahr auf dem Dach | kein Grund zur Sorge | Wendung c-ingenfarapataket |
| 33 % | kan jag få kvittot? | kann ich bekommen der Bon | kann ich den Beleg haben? | Wendung c-kvitto |
| 33 % | lagom är bäst | gerade genug ist am besten | das rechte Maß ist am besten | Wendung c-lagomarbast |
| 33 % | det låter kul | das klingt schön | das klingt nach Spaß | Wendung c-lateskul |
| 33 % | loppet börjar snart | das Rennen beginnt bald | das Rennen fängt gleich an | Wendung c-loppet |
| 33 % | jag måste tänka på saken | ich muss denken an die Sache | ich muss darüber nachdenken | Wendung c-mastetankapasaken |
| 33 % | grannen klagade | der Nachbar klagte | der Nachbar hat sich beschwert | Wendung c-na-grannen |
| 33 % | kan du sänka volymen? | kannst du senken die Lautstärke | kannst du leiser machen? | Wendung c-na-volym |
| 33 % | jag vill öppna ett konto | ich will öffnen ein Konto | ich möchte ein Konto eröffnen | Wendung c-oppnakonto |
| 33 % | övning ger färdighet | Übung gibt Fertigkeit | Übung macht den Meister | Wendung c-ovninggerfardighet |
| 33 % | ska vi ses? | sollen wir sehen uns | wollen wir uns treffen? | Wendung c-sesses |
| 33 % | ska vi fika? | sollen wir Kaffeepause machen | wollen wir Kaffee trinken? | Wendung c-skavifika |
| 33 % | ska vi springa? | sollen wir laufen | wollen wir laufen gehen? | Wendung c-skavispringa |
| 33 % | det gör ont här nere | es macht Schmerz hier unten | es tut hier unten weh | Wendung c-ta-varmed |
| 33 % | kan jag ta med en vän? | kann ich nehmen mit einen Freund | kann ich jemanden mitbringen? | Wendung c-tamedenvan |
| 33 % | jag behöver ta ut pengar | ich brauche nehmen heraus Geld | ich muss Geld abheben | Wendung c-tautpengar |
| 33 % | vem vann? | wer gewann | wer hat gewonnen? | Wendung c-vemvann |

