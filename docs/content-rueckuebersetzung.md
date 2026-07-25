# Prüfbericht — Rückübersetzung (Stufe 2)

> **Automatisch erzeugt** von `tools/backtranslation.ts` (`npm run check:backtranslation`). Nicht von Hand ändern — Werkzeug erneut laufen lassen.

## Was dieser Bericht beweist — und was nicht

**Geprüft:** Der Inhalt ist **in sich widerspruchsfrei** — jedes schwedische Wort hat eine Wort-für-Wort-Glosse, jedes Segment enthält die Wendung, die es zu üben behauptet, und dasselbe Wort wird nicht unbemerkt verschieden übersetzt.

**NICHT geprüft:** ob die Übersetzung **richtig** ist. Ein Satz kann vollständig widerspruchsfrei und trotzdem falsch sein. Die Abschnitte C und D sind **Verdachtslisten für einen Menschen** — geordnet, nicht entschieden (`content-review-schwedisch.md`).

## Ergebnis

- Geprüfte Zeilen (Wendungen · Segmente · Gesprächszeilen): **1392**
- ❌ **A** Glossen-Lücken (hart): **0**
- ❌ **B** Kontext-Brüche (hart, Deckung < 0.5): **0**
- ℹ️ **B2** starke Kontextvariation (erwünscht): **12**
- ⚠️ **C** Glossen-Konflikte: **145** (davon bekannt kontextabhängig: 4)
- ⚠️ **D** mögliche Bedeutungsdrift: **113** (Deckung < 0.34)

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

## ⚠️ C — Glossen-Konflikte

Dasselbe schwedische Wort mit verschiedenen deutschen Glossen. **Vieles davon ist richtig** — deutsche Beugung („bist"/„bin") und kontextabhängige Partikeln. Verdächtig ist, wo sich die Bedeutungen wirklich unterscheiden.

| Schwedisch | Glossen | bekannt kontextabhängig |
|---|---|---|
| **på** | „auf" (Wendung c-pasvenska) · „an" (Wendung c-hallerpa) · „am" (Wendung c-pamandag) · „im" (Wendung c-pasommaren) · „über" (Wendung c-villklaga) · „seit" (Segment s-a1p-gar2) · „in" (Segment s-a2r-bo1) · „bei" (Segment s-b1f-aldrig1) | — |
| **det** | „das" (Wendung c-kostar) · „es" (Wendung c-vilkendag) · „dem" (Wendung c-harerfarenhet) · „da" (Segment s-vemardet3) · „die" (Segment s-b1j-lon1) · „daran" (Segment s-b1o-argument1) · „sie" (Segment s-b2v-avtal1) | — |
| **har** | „hast" (Wendung c-harbarn) · „habe" (Wendung c-bror) · „haben" (Wendung c-ledigtrum) · „habt" (Wendung c-nagotsott) · „hat" (Wendung c-fungeratdaligt) · „bin" (Wendung c-aldrigvaritmed) · „ist" (Segment s-a2te-flytta2) | — |
| **den** | „das" (Wendung c-tardenhar) · „es" (Wendung c-hurfort) · „die" (Wendung c-forstor) · „sie" (Wendung c-dentrasig) · „er" (Segment s-b1m-roman1) · „dem" (Segment s-b1o-haller2) | — |
| **ska** | „sollen" (Wendung c-sesses) · „werde" (Wendung c-hamtapaket) · „soll" (Wendung c-skrivaunder) · „werdet" (Segment s-a1p-roligt2) · „werden" (Segment s-a2in-komma1) · „sollst" (Gespräch dlg-ticket/t1) | — |
| **till** | „noch" (Wendung c-entill) · „zu" (Wendung c-centrum) · „nach" (Wendung c-hoger) · „für" (Segment s-a2k-skor1) · „bescheid" (Gespräch dlg-shop/g3) · „bei" (Gespräch dlg-arzt/a1) | ja |
| **en** | „eine" (Wendung c-entill) · „einer" (Wendung c-entimme) · „einen" (Wendung c-bror) · „ein" (Wendung c-biljett) · „einem" (Wendung c-bormedkompis) | — |
| **ett** | „ein" (Wendung c-bokatrum) · „einem" (Wendung c-jobbarpakontor) · „eine" (Wendung c-skickarmejl) · „einen" (Segment s-bordtva3) · „eins" (Segment s-a2ap-utan1) | — |
| **går** | „fährt" (Wendung c-nartag) · „geht" (Wendung c-hurfort) · „gehe" (Wendung c-detgarjagmedpa) · „gehen" (Segment s-tapadigmossa2) · „gestern" (Segment s-b1r-fel2) | — |
| **i** | „in" (Wendung c-iblatt) · „am" (Wendung c-imorgon) · „an" (Wendung c-ledigihelgen) · „im" (Wendung c-ijanuari) · „auf" (Wendung c-intehallbart) | — |
| **om** | „in" (Wendung c-entimme) · „um" (Wendung c-tvaganger) · „über" (Wendung c-sagennyhet) · „wenn" (Segment s-sovaute2) · „ob" (Segment s-b1m-nyhet2) | ja |
| **är** | „ist" (Wendung c-var-toa) · „bin" (Wendung c-hungrig) · „bist" (Wendung c-gammal) · „sind" (Wendung c-daarvioverens) | — |
| **får** | „bekomme" (Wendung c-pengarnatillbaka) · „darf" (Wendung c-lasamellanraderna) · „darfst" (Segment s-a2ki-mat1) · „bekommen" (Segment s-b2u-skatt1) | — |
| **gör** | „machst" (Wendung c-vadgordu) · „macht" (Wendung c-gormigledsen) · „mache" (Segment s-a2b-kortet1) · „mach" (Gespräch dlg-phone/t7) | — |
| **hela** | „die ganze" (Wendung c-fungeratdaligt) · „den ganzen" (Segment s-vilketvader1) · „ganzen" (Segment s-a1t-klockan2) · „ganze" (Segment s-a1v-sommar1) | — |
| **kan** | „kann" (Wendung c-hjalpa) · „kannst" (Wendung c-upprepa) · „können" (Wendung c-bokaettmote) · „könnt" (Wendung c-narkannileverera) | — |
| **kvittot** | „der beleg" (Wendung c-kvitto) · „den bon" (Wendung c-harkvittot) · „den beleg" (Segment s-kontant3) · „der bon" (Segment s-a2k-byta2) | — |
| **sedan** | „her" (Segment s-a1p-snart1) · „seit" (Segment s-a2ap-hosta1) · „danach" (Segment s-a2r-mix4) · „dann" (Segment s-a2ki-mat1) | — |
| **var** | „wo" (Wendung c-var-toa) · „war" (Wendung c-vargott) · „waren" (Segment s-b2e-kort2) · „sei" (Segment s-b2n-uttryck2) | — |
| **vilket** | „welches" (Wendung c-vaddatum) · „welchem" (Segment s-spar1) · „welch" (Segment s-vader3) · „welch ein" (Gespräch dlg-stadium/m6) | — |
| **behöver** | „brauche" (Wendung c-lakare) · „brauchen" (Wendung c-behoverforsakring) · „brauchst" (Gespräch dlg-shop/g1) | — |
| **blir** | „wird" (Wendung c-blirdet) · „werde" (Wendung c-blirlitesen) · „werden" (Segment s-a2in-van2) | — |
| **bor** | „wohnst" (Wendung c-bordu) · „wohne" (Wendung c-borilagenhet) · „wohnt" (Segment s-familj3) | — |
| **bra** | „gut" (Wendung c-marbra) · „guter" (Wendung c-braformad) · „gutes" (Wendung c-ettbraargument) | — |
| **fin** | „schön" (Segment s-tarden2) · „schöne" (Segment s-hurmangarum1) · „schöner" (Segment s-akaskidor1) | — |
| **fram** | „voraus" (Wendung c-raktfram) · „vorwärts" (Wendung c-narkommerbrevet) · „voran" (Segment s-hoger3) | — |
| **god** | „guten" (Segment s-morgon) · „gut" (Segment s-a1f-kopp1) · „gute" (Segment s-a2ki-sova1) | — |
| **ha** | „haben" (Wendung c-vill-ha) · „hab" (Wendung c-hadetbra) · „habe" (Segment s-a1v-nasta1) | — |
| **hör** | „hörst" (Wendung c-horduemig) · „höre" (Wendung c-hordumig) · „hör" (Gespräch dlg-phone/t5) | — |
| **ingen** | „keine" (Wendung c-ingenfara) · „niemand" (Segment s-b1g-orolig1) · „kein" (Gespräch dlg-arzt/a5) | — |
| **inget** | „kein" (Segment s-a1f-mjolk1) · „keine" (Segment s-b1j-ansokan2) · „nichts" (Segment s-b2u-utslapp1) | — |
| **jobbet** | „der arbeit" (Segment s-sesses2) · „stelle" (Segment s-b1j-lon1) · „die stelle" (Segment s-b1j-borjar2) | — |
| **kom** | „komm" (Segment s-loppet2) · „kam" (Segment s-b2i-sent1) · „kamst" (Gespräch dlg-garage/g1) | — |
| **kommer** | „kommst" (Wendung c-varifran) · „komme" (Wendung c-centrum) · „kommt" (Wendung c-narkommerbrevet) | — |
| **min** | „meine" (Wendung c-familj) · „meinem" (Segment s-a2b-overfor1) · „meiner" (Segment s-b1f-midsommar1) | — |
| **säger** | „sagt" (Wendung c-pasvenska) · „sagen" (Wendung c-dasagervisa) · „sage" (Segment s-b2i-droppen1) | — |
| **sen** | „später" (Wendung c-ringerdig) · „spät" (Wendung c-blirlitesen) · „dann" (Gespräch dlg-weg/w4) | — |
| **ses** | „sehen uns" (Wendung c-vises) · „uns sehen" (Wendung c-sesses) · „sehen" (Segment s-ledigidag1) | — |
| **stor** | „großer" (Wendung c-storfisk) · „groß" (Wendung c-forstor) · „großes" (Gespräch dlg-stadium/m3) | — |
| **tar** | „nimmt" (Wendung c-tiominuter) · „nehme" (Wendung c-tardenhar) · „nehmen" (Wendung c-vitarcykeln) | — |
| **ut** | „heraus" (Wendung c-tautpengar) · „hinaus" (Segment s-tapadigmossa2) · „aus" (Gespräch dlg-lake/f9) | — |
| **vilken** | „welcher" (Wendung c-vilkendag) · „welche" (Wendung c-storlek) · „welch ein" (Wendung c-vilkenbil) | — |
| **allt** | „alles" (Segment s-a1s-engelska2) · „allem" (Segment s-b2e-kort1) | — |
| **än** | „als" (Wendung c-laterhardare) · „noch" (Segment s-a2r-bo2) | — |
| **andra** | „anderer" (Wendung c-aandrasidan) · „zweite" (Gespräch dlg-stadium/m8) | — |
| **annan** | „andere" (Wendung c-annanfarg) · „anderes" (Segment s-a1p-synd1) | — |
| **ansökan** | „bewerbung" (Wendung c-skickatansokan) · „der bewerbung" (Segment s-b1j-referens1) | — |
| **år** | „jahre" (Wendung c-fyllerar) · „jahr" (Segment s-a2b-avgift1) | — |
| **att** | „zu" (Wendung c-trevligt) · „dass" (Wendung c-tyckerattdetarbra) | — |
| **av** | „von" (Wendung c-harerfarenhet) · „ab" (Segment s-valkommenin2) | — |
| **berätta** | „erzähle" (Segment s-b1m-handlar2) · „erzähl" (Gespräch dlg-arzt/a5) | — |
| **betalar** | „zahle" (Wendung c-kontant) · „zahlst" (Gespräch dlg-shop/g7) | — |
| **billigare** | „billiger" (Segment s-bormedkompis2) · „billigeres" (Segment s-fordyrt3) | — |
| **börjar** | „beginnt" (Wendung c-loppet) · „beginne" (Wendung c-borjarpamandag) | — |
| **borta** | „weg" (Wendung c-bortabrahemmabast) · „drüben" (Gespräch dlg-shop/g5) | — |
| **dagen** | „den tag" (Wendung c-tvaganger) · „tag" (Segment s-vilketvader1) | — |
| **dålig** | „schlechte" (Wendung c-daligtackning) · „schlechten" (Segment s-daligtackning3) | — |
| **där** | „dort" (Segment s-hallerpa2) · „da" (Gespräch dlg-shop/g5) | — |
| **dig** | „dich" (Wendung c-ringerdig) · „dir" (Wendung c-vilkentidpassar) | — |
| **fel** | „fehler" (Wendung c-felpavaran) · „falsch" (Wendung c-detvisadesigvarafel) | — |
| **festen** | „das fest" (Wendung c-narborjarfesten) · „dem fest" (Segment s-a2in-van1) | — |
| **finns** | „gibt es" (Wendung c-finnsmjolk) · „gibt" (Segment s-fordyrt3) | — |
| **fint** | „schönes" (Segment s-sovaute2) · „schön" (Segment s-koketlitet1) | — |
| **firar** | „feiern" (Wendung c-firarmidsommar) · „feiert" (Wendung c-narfirarnidet) | — |
| **för** | „für" (Wendung c-bordtva) · „zu" (Wendung c-fordyrt) | — |
| **förlåt** | „verzeih" (Wendung c-forlat) · „entschuldige" (Segment s-a2te-sen2) | — |
| **först** | „zuerst" (Segment s-a2b-utpengar2) · „als erster" (Gespräch dlg-track/t6) | — |
| **förstår** | „verstehe" (Wendung c-forstar) · „verstehst" (Segment s-b2n-fel1) | — |
| **från** | „aus" (Wendung c-frantyskland) · „von" (Segment s-spar1) | — |
| **gå** | „gehen" (Wendung c-mastega) · „geh" (Segment s-raktfram1) | — |
| **gammal** | „alt" (Wendung c-gammal) · „alte" (Wendung c-gammaltradition) | — |
| **göra** | „tun" (Wendung c-vadjobbardu) · „machen" (Segment s-a2ki-laxor2) | — |
| **gott** | „lecker" (Wendung c-vargott) · „gut" (Segment s-a1t-tre1) | — |
| **håller** | „hältst" (Wendung c-hallerpa) · „halte" (Wendung c-hallermeddig) | — |
| **hej** | „tschüss" (Wendung c-hejda) · „hallo" (Segment s-cafe) | — |
| **helgen** | „dem wochenende" (Wendung c-vadgordu) · „das wochenende" (Segment s-b2v-tanka1) | — |
| **hemma** | „daheim" (Wendung c-halsahemma) · „zu hause" (Segment s-hurmangarum2) | — |
| **heter** | „heiße" (Wendung c-heter) · „heißt" (Segment s-namn1) | — |
| **hinner** | „schaffe" (Segment s-a2ap-stanger2) · „schaffen" (Segment s-b2d-aterkomma2) | — |
| **hjälp** | „hilfe" (Wendung c-hjalp) · „hilf" (Segment s-hjalpe2) | — |
| **in** | „herein" (Wendung c-valkommenin) · „ein" (Segment s-a2po-pnr2) | — |
| **jobbade** | „arbeiteten" (Segment s-b1g-nojd2) · „arbeitete" (Segment s-b1j-erfarenhet2) | — |
| **jobbar** | „arbeitest" (Wendung c-jobbar) · „arbeite" (Wendung c-jobbarpakontor) | — |
| **kakan** | „dem kuchen" (Segment s-a1f-te2) · „der kuchen" (Segment s-a1f-smakar2) | — |
| **klockan** | „die uhr" (Wendung c-klockan) · „uhr" (Gespräch dlg-work/w7) | — |
| **koden** | „den code" (Wendung c-glomtkoden) · „der code" (Segment s-a2po-hamta1) | — |
| **konstigt** | „komisch" (Wendung c-latarkonstigt) · „seltsam" (Segment s-b1g-besviken2) | — |
| **kort** | „karte" (Wendung c-medkort) · „kurz" (Wendung c-kortsagtgickdetbra) | — |
| **kortet** | „die karte" (Wendung c-kortetfungerar) · „der karte" (Segment s-a2b-koden1) | — |
| **kul** | „spaß" (Wendung c-lateskul) · „schön" (Gespräch dlg-garage/g1) | — |
| **lång** | „lange" (Wendung c-hurlangtid) · „lang" (Wendung c-hurlangresan) | — |
| **ledigt** | „freies" (Wendung c-ledigtrum) · „frei" (Segment s-a1f-sitta1) | — |
| **ligger** | „liegt" (Wendung c-stationen) · „liegen" (Wendung c-vihalleross) | — |
| **lite** | „wenig" (Wendung c-vantalite) · „etwas" (Wendung c-blirlitesen) | — |
| **mår** | „befindest" (Wendung c-hej) · „befinde" (Wendung c-marbra) | — |
| **måste** | „muss" (Wendung c-maste-lagga-pa) · „müssen" (Wendung c-sessnart) | — |
| **med** | „mit" (Wendung c-jobbar) · „dabei" (Segment s-b1f-nar2) | ja |
| **menyn** | „die speisekarte" (Wendung c-menyn) · „die karte" (Segment s-hungrig3) | — |
| **mig** | „mir" (Wendung c-hjalpa) · „mich" (Wendung c-ursaktamig) | — |
| **minns** | „erinnere mich" (Wendung c-jagminnsattdetregnade) · „erinnere" (Segment s-b2e-minns2) | — |
| **morse** | „morgen" (Segment s-b1m-nyhet1) · „frühe" (Gespräch dlg-lake/f3) | — |
| **mötet** | „das treffen" (Wendung c-motetborjar) · „dem treffen" (Segment s-b2d-aterkomma1) | — |
| **när** | „wann" (Wendung c-nartag) · „wenn" (Segment s-skickarmeddelande1) | — |
| **nästa** | „nächste" (Wendung c-nastavecka) · „nächsten" (Gespräch dlg-lake/f11) | — |
| **nyckeln** | „der schlüssel" (Wendung c-nyckeln) · „den schlüssel" (Segment s-nyckeln3) | — |
| **nytt** | „neuer" (Wendung c-nytt-rekord) · „neues" (Segment s-b1m-serie2) | — |
| **paraply** | „regenschirm" (Wendung c-tamedparaply) · „schirm" (Segment s-regnar3) | — |
| **prata** | „sprechen" (Wendung c-langsam) · „sprich" (Segment s-a1s-engelska1) | — |
| **priset** | „den preis" (Wendung c-forhandlaompriset) · „der preis" (Segment s-b2i-hund1) | — |
| **provrummet** | „die umkleidekabine" (Wendung c-provrum) · „die umkleide" (Segment s-prova3) | — |
| **rekommenderar** | „empfiehlst" (Wendung c-rekommenderar) · „empfehle" (Gespräch dlg-restaurant/r6) | — |
| **resa** | „reisen" (Segment s-a1p-roligt2) · „reise" (Gespräch dlg-ticket/t7) | — |
| **resan** | „die reise" (Wendung c-hurlangresan) · „der reise" (Segment s-a2b-utpengar1) | — |
| **ring** | „ruf an" (Wendung c-ringpolis) · „ruf" (Segment s-hjalp3) | — |
| **ringer** | „rufe an" (Wendung c-ringerdig) · „anruft" (Segment s-vemardet2) | — |
| **runt** | „rund" (Segment s-b1f-sjunger1) · „um" (Gespräch dlg-arzt/a11) | — |
| **smaklig** | „schmackhaft" (Wendung c-smaklig) · „schmackhafte" (Segment s-smaklig3) | — |
| **snygg** | „schön" (Segment s-hurfort2) · „schick" (Segment s-tarden3) | — |
| **söker** | „suche" (Wendung c-sokerjobb) · „suchst" (Gespräch dlg-weg/w2) | — |
| **som** | „wie" (Wendung c-samtidigtsomdethande) · „der" (Segment s-vemardet2) | — |
| **sover** | „schlafen" (Wendung c-sovaute) · „schlafe" (Segment s-a2ap-hosta2) | — |
| **spelar** | „spielst" (Wendung c-vilketspel) · „spielt" (Wendung c-vemspelar) | — |
| **stannar** | „bleibe" (Segment s-a1v-omvecka2) · „bleiben" (Segment s-b1f-jul2) | — |
| **startar** | „startet" (Wendung c-startarinte) · „starten" (Gespräch dlg-gaming/z3) | — |
| **stationen** | „der bahnhof" (Wendung c-stationen) · „den bahnhof" (Segment s-ursaktamig3) | — |
| **sväng** | „bieg ab" (Segment s-hoger1) · „bieg" (Segment s-hoger3) | — |
| **svårt** | „schwer" (Segment s-a1s-heter1) · „schwerer" (Segment s-a1s-stavar2) | — |
| **ta** | „nimm" (Wendung c-tamedparaply) · „nehmen" (Wendung c-tautpengar) | — |
| **tack** | „danke" (Wendung c-tack) · „bitte" (Wendung c-entill) | ja |
| **täckning** | „abdeckung" (Wendung c-daligtackning) · „empfang" (Segment s-daligtackning3) | — |
| **tåget** | „der zug" (Wendung c-nartag) · „dem zug" (Segment s-b2e-samtidigt2) | — |
| **tänker** | „denkst" (Segment s-b1o-inte2) · „denke" (Segment s-b2d-forklara1) | — |
| **tid** | „zeit" (Wendung c-vilkentidpassar) · „termin" (Wendung c-hartidklockannio) | — |
| **trevlig** | „schönen" (Gespräch dlg-restaurant/r10) · „angenehme" (Gespräch dlg-ticket/t7) | — |
| **trevligt** | „nett" (Wendung c-trevligt) · „angenehm" (Segment s-trevligt3) | — |
| **tycker** | „meine" (Wendung c-tyckerattdetarbra) · „meinst" (Wendung c-vadtyckerduomdet) | — |
| **utmärkt** | „ausgezeichnet" (Gespräch dlg-restaurant/r8) · „ausgezeichnete" (Gespräch dlg-shop/g7) | — |
| **vad** | „was" (Wendung c-kostar) · „wie" (Wendung c-vadroligt) | — |
| **varje** | „jeden" (Wendung c-ovarvarjedag) · „jedes" (Segment s-b1f-midsommar2) | — |
| **väskan** | „die tasche" (Wendung c-packavaskan) · „der tasche" (Segment s-a2k-kvitto1) | — |
| **veckan** | „der woche" (Wendung c-jagtranar) · „die woche" (Segment s-b1g-vila2) | — |
| **vet** | „weiß" (Segment s-pasvenska3) · „wissen" (Segment s-b2u-hallbart1) | — |
| **vill** | „will" (Wendung c-vill-ha) · „willst" (Wendung c-villdukomma) | — |
| **vilse** | „verirrt" (Wendung c-vilse) · „irre" (Segment s-vilse3) | — |
| **vintern** | „dem winter" (Segment s-morkttidigt1) · „den winter" (Segment s-a2k-skor1) | — |

## ⚠️ D — mögliche Bedeutungsdrift

Der wörtliche Rückbau aus den Glossen deckt die behauptete Bedeutung kaum. **Oft völlig in Ordnung** — genau das ist ja der Birkenbihl-Effekt („jag vill ha" = wörtlich „ich will haben", gemeint „ich möchte"). Aber hier würde sich ein echter Übersetzungsfehler verstecken, deshalb steht die Liste vollständig hier, schwächste Deckung zuerst.

| Deckung | Schwedisch | wörtlich zurück | behauptete Bedeutung | Wo |
|---|---|---|---|---|
| 0 % | Där! Han sköt! | da er schoss | Da! Er hat geschossen! | Gespräch dlg-stadium/m4 |
| 0 % | Vad tycker du om det? Jag håller med dig. | was meinst du über das ich halte mit dir | Was hältst du davon? Ich stimme dir zu. | Segment s-b1o-mix1 |
| 0 % | Till slut löste det sig, som det brukar. | zu Schluss löste es sich wie es pflegt | Am Ende hat es sich gelöst, wie meistens. | Segment s-b2e-slut1 |
| 0 % | Ta det lugnt, det är ingen ko på isen. | nimm es ruhig es ist keine Kuh auf dem Eis | Immer mit der Ruhe, es eilt nicht. | Segment s-b2i-ko1 |
| 0 % | Här ligger en hund begraven, och det var droppen. | hier liegt ein Hund begraben und das war der Tropfen | Da stimmt etwas nicht, und das war zu viel des Guten. | Segment s-b2i-mix3 |
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
| 0 % | jag är orolig för det | ich bin besorgt für das | ich mache mir Sorgen darüber | Wendung c-arorolig |
| 0 % | det blåser mycket | es weht viel | es ist sehr windig | Wendung c-blasermycket |
| 0 % | bokstavligt talat | buchstäblich gesprochen | wörtlich genommen | Wendung c-bokstavligttalat |
| 0 % | det går jag med på | dem gehe ich mit auf | darauf lasse ich mich ein | Wendung c-detgarjagmedpa |
| 0 % | det var droppen | das war der Tropfen | das war zu viel des Guten | Wendung c-detvardroppen |
| 0 % | en gång till! | ein Mal noch | noch einmal! | Wendung c-engangtill |
| 0 % | jag fixar det | ich richte das | ich mache das | Wendung c-fixardet |
| 0 % | förlåt | verzeih | Entschuldigung | Wendung c-forlat |
| 0 % | ha det bra | hab es gut | alles Gute | Wendung c-hadetbra |
| 0 % | jag håller inte med | ich halte nicht mit | ich stimme nicht zu | Wendung c-hallerintemed |
| 0 % | jag håller med dig | ich halte mit dir | ich stimme dir zu | Wendung c-hallermeddig |
| 0 % | vad håller du på med? | was hältst du an mit | was machst du gerade? | Wendung c-hallerpa |
| 0 % | hur mår du? | wie befindest du | wie geht es dir? | Wendung c-hej |
| 0 % | här ligger en hund begraven | hier liegt ein Hund begraben | da stimmt etwas nicht | Wendung c-hundbegraven |
| 0 % | hur går det? | wie geht es | wie läuft es? | Wendung c-hurgardet |
| 0 % | hur gick provet? | wie ging die Prüfung | wie lief die Arbeit? | Wendung c-hurgickprovet |
| 0 % | hur stavar man det? | wie buchstabiert man es | wie schreibt man das? | Wendung c-hurstavar |
| 0 % | det är ingen ko på isen | es ist keine Kuh auf dem Eis | es eilt nicht | Wendung c-ingenkopaisen |
| 0 % | det är inte hållbart i längden | das ist nicht haltbar auf die Länge | das ist auf Dauer nicht tragfähig | Wendung c-intehallbart |
| 0 % | jag är med | ich bin mit | ich bin dabei | Wendung c-jagarmed |
| 0 % | jag fryser | ich friere | mir ist kalt | Wendung c-jagfryser |
| 0 % | vad jobbar du med? | was arbeitest du mit | was machst du beruflich? | Wendung c-jobbar |
| 0 % | vad är klockan? | was ist die Uhr | wie spät ist es? | Wendung c-klockan |
| 0 % | jag har ont här | ich habe Schmerz hier | mir tut es hier weh | Wendung c-onthär |
| 0 % | jag är på väg | ich bin auf Weg | ich bin unterwegs | Wendung c-pavag |
| 0 % | smaklig måltid | schmackhaft Mahlzeit | guten Appetit | Wendung c-smaklig |
| 0 % | till slut löste det sig | zu Schluss löste es sich | am Ende hat es sich gelöst | Wendung c-tillslutlostedetsig |
| 0 % | trevligt att träffas | nett zu treffen | schön, dich kennenzulernen | Wendung c-trevligt |
| 0 % | vad handlar den om? | was handelt sie um | worum geht es darin? | Wendung c-vadhandlardenom |
| 0 % | vad roligt! | wie lustig | wie schön! | Wendung c-vadroligt |
| 0 % | vad tycker du om det? | was meinst du über das | was hältst du davon? | Wendung c-vadtyckerduomdet |
| 0 % | jag vill ha | ich will haben | ich möchte | Wendung c-vill-ha |
| 0 % | jag vill klaga på det här | ich will klagen über das hier | ich möchte mich darüber beschweren | Wendung c-villklaga |
| 20 % | För att sammanfatta: vi fortsätter som förut. | für zu zusammenfassen wir fahren fort wie vorher | Um es zusammenzufassen: wir machen weiter wie bisher. | Segment s-b2e-sammanfatta1 |
| 25 % | Kan jag ta med en vän till festen? | kann ich nehmen mit einen Freund zu dem Fest | Kann ich jemanden zur Feier mitbringen? | Segment s-a2in-van1 |
| 25 % | Vad handlar den om? Är den spännande? | was handelt sie um ist sie spannend | Worum geht es darin? Ist es spannend? | Segment s-b1m-handlar1 |
| 25 % | Det visade sig vara fel, men till slut löste det sig. | es zeigte sich sein falsch aber zu Schluss löste es sich | Es stellte sich als falsch heraus, aber am Ende hat es sich gelöst. | Segment s-b2e-mix2 |
| 25 % | Det var droppen, nu säger jag upp mig. | das war der Tropfen jetzt sage ich auf mich | Das war zu viel des Guten, jetzt kündige ich. | Segment s-b2i-droppen1 |
| 25 % | Det är ingen ko på isen, ingen fara på taket. | es ist keine Kuh auf dem Eis keine Gefahr auf dem Dach | Es eilt nicht, kein Grund zur Sorge. | Segment s-b2i-mix1 |
| 25 % | Ingen fara på taket, jag fixar det. | keine Gefahr auf dem Dach ich richte es | Kein Grund zur Sorge, ich mache das. | Segment s-b2i-taket1 |
| 25 % | Varsågod! Smaklig måltid! | bitte schmackhafte Mahlzeit | Bitte sehr! Guten Appetit! | Segment s-smaklig3 |
| 25 % | det visade sig vara fel | es zeigte sich sein falsch | es stellte sich als falsch heraus | Wendung c-detvisadesigvarafel |
| 25 % | jag såg en nyhet om det | ich sah eine Nachricht über das | ich habe eine Nachricht darüber gesehen | Wendung c-sagennyhet |
| 33 % | Jag förstår. Var gör det ont? | ich verstehe wo macht es Schmerz | Ich verstehe. Wo tut es weh? | Gespräch dlg-arzt/a3 |
| 33 % | Utmärkt! Smaklig måltid. | ausgezeichnet schmackhaft Mahlzeit | Ausgezeichnet! Guten Appetit. | Gespräch dlg-restaurant/r8 |
| 33 % | Hej då och hälsa hemma! | hallo dann und grüße daheim | Tschüss und grüß zu Hause! | Segment s-a1p-halsa1 |
| 33 % | Vad roligt! Grattis till dig. | wie lustig Glückwunsch zu dir | Wie schön! Herzlichen Glückwunsch. | Segment s-a1p-roligt1 |
| 33 % | Hur gick provet i matte? | wie ging die Prüfung in Mathe | Wie lief die Arbeit in Mathe? | Segment s-a2ki-provet1 |
| 33 % | Hur gick provet? Var det svårt? | wie ging die Prüfung war es schwer | Wie lief die Arbeit? War sie schwer? | Segment s-a2ki-provet2 |
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
| 33 % | Tack, ha det bra! | danke hab es gut | Danke, alles Gute! | Segment s-hadetbra2 |
| 33 % | Hej! Vad håller du på med? | hallo was hältst du an mit | Hallo! Was machst du gerade? | Segment s-hallerpa1 |
| 33 % | Hej då, ha det bra! | tschüss dann hab es gut | Tschüss, alles Gute! | Segment s-hejda3 |
| 33 % | Förlåt! – Ingen fara. | verzeih keine Gefahr | Entschuldigung! – Kein Problem. | Segment s-ingenfara2 |
| 33 % | Jag fryser, ska vi gå in? | ich friere sollen wir gehen herein | Mir ist kalt, sollen wir reingehen? | Segment s-jagfryser1 |
| 33 % | Loppet börjar snart. | das Rennen beginnt bald | Das Rennen fängt gleich an. | Segment s-loppet1 |
| 33 % | Förlåt, jag måste lägga på. | verzeih ich muss legen auf | Entschuldigung, ich muss auflegen. | Segment s-maste-lagga-pa2 |
| 33 % | Vänta lite, jag är på väg. | warte wenig ich bin auf Weg | Warte kurz, ich bin unterwegs. | Segment s-pavag2 |
| 33 % | Tack, smaklig måltid! | danke schmackhaft Mahlzeit | Danke, guten Appetit! | Segment s-smaklig2 |
| 33 % | Ska vi springa? | sollen wir laufen | Wollen wir laufen gehen? | Segment s-springa1 |
| 33 % | Hej, trevligt att träffas! | hallo nett zu treffen | Hallo, schön dich kennenzulernen! | Segment s-trevligt2 |
| 33 % | Vem vann? | wer gewann | Wer hat gewonnen? | Segment s-vemvann1 |
| 33 % | det beror på hur man säger det | es beruht auf wie man sagt es | es kommt darauf an, wie man es sagt | Wendung c-berorpahurmansager |
| 33 % | jag vill boka en tid | ich will buchen einen Zeit | ich möchte einen Termin buchen | Wendung c-bokaentid |
| 33 % | kan vi boka ett möte? | können wir buchen ein Treffen | können wir einen Termin machen? | Wendung c-bokaettmote |
| 33 % | det började helt vanligt | es begann ganz gewöhnlich | es fing ganz normal an | Wendung c-borjadehelvanligt |
| 33 % | borta bra men hemma bäst | weg gut aber daheim am besten | daheim ist es doch am schönsten | Wendung c-bortabrahemmabast |
| 33 % | kan vi flytta tiden? | können wir verlegen die Zeit | können wir den Termin verschieben? | Wendung c-flyttatiden |
| 33 % | när fyller du år? | wann füllst du Jahre | wann hast du Geburtstag? | Wendung c-fyllerar |
| 33 % | ingen fara på taket | keine Gefahr auf dem Dach | kein Grund zur Sorge | Wendung c-ingenfarapataket |
| 33 % | lagom är bäst | gerade genug ist am besten | das rechte Maß ist am besten | Wendung c-lagomarbast |
| 33 % | loppet börjar snart | das Rennen beginnt bald | das Rennen fängt gleich an | Wendung c-loppet |
| 33 % | jag måste tänka på saken | ich muss denken an die Sache | ich muss darüber nachdenken | Wendung c-mastetankapasaken |
| 33 % | kan jag få menyn? | kann ich bekommen die Speisekarte | kann ich die Karte haben? | Wendung c-menyn |
| 33 % | jag vill öppna ett konto | ich will öffnen ein Konto | ich möchte ein Konto eröffnen | Wendung c-oppnakonto |
| 33 % | övning ger färdighet | Übung gibt Fertigkeit | Übung macht den Meister | Wendung c-ovninggerfardighet |
| 33 % | ska vi ses? | sollen wir uns sehen | wollen wir uns treffen? | Wendung c-sesses |
| 33 % | ska vi fika? | sollen wir Kaffeepause machen | wollen wir Kaffee trinken? | Wendung c-skavifika |
| 33 % | ska vi springa? | sollen wir laufen | wollen wir laufen gehen? | Wendung c-skavispringa |
| 33 % | kan jag ta med en vän? | kann ich nehmen mit einen Freund | kann ich jemanden mitbringen? | Wendung c-tamedenvan |
| 33 % | jag behöver ta ut pengar | ich brauche nehmen heraus Geld | ich muss Geld abheben | Wendung c-tautpengar |
| 33 % | vem vann? | wer gewann | wer hat gewonnen? | Wendung c-vemvann |

