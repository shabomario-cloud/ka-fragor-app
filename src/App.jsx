import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Home, Timer, ArrowLeft, ArrowRight, ListX, History } from "lucide-react";

const STORAGE_KEY = "ka-qa-bank-v8";

/** ------------------------------------
 *  Frågebank – 100 frågor
 *  Fördelning: PBL 25, PBF 20, BBR 25, EKS 15, KA 10, Blandat 5
 *  Resonemang uppdaterade/utförligare
 *  ------------------------------------ */
const BANK = [
  /* ========== PBL (25) ========== */
  {
    id: "grp-pbl",
    title: "PBL – Plan- och bygglagen",
    questions: [
      { id:"Q1", type:"mcq", q:"Vilken instans ansvarar för tillsyn enligt PBL?", options:["Byggherren","Byggnadsnämnden","Länsstyrelsen","Kontrollansvarig"], answerIndex:1, reasoning:"Byggnadsnämnden är den kommunala tillsynsmyndigheten som ser till att bestämmelser i PBL, PBF och beslut följs. Nämnden kan ge förelägganden och besluta om byggsanktionsavgifter. Källa: PBL 11 kap. 5 §, 11 kap. i övrigt." },
      { id:"Q2", type:"mcq", q:"Vad reglerar PBL kapitel 8 främst?", options:["Detaljplaner","Tekniska egenskapskrav","Fastighetsbildning","Upphandling"], answerIndex:1, reasoning:"Kapitel 8 anger övergripande tekniska egenskapskrav (t.ex. bärförmåga, brandskydd, hygien, energi). Själva detaljnivån återfinns i Boverkets föreskrifter (BBR/EKS). Källa: PBL 8 kap." },
      { id:"Q3", type:"mcq", q:"Vilket krävs för att åtgärden ska få påbörjas?", options:["Bygglov","Startbesked","Slutbesked","Planprogram"], answerIndex:1, reasoning:"Även om bygglov finns får åtgärden inte starta förrän startbesked getts. Startbeskedet grundas bl.a. på tekniskt samråd, kontrollplan och tekniska handlingar. Källa: PBL 10 kap. 3 §, 10:14–18." },
      { id:"Q4", type:"mcq", q:"Vilket krävs för att ta en byggnad i bruk?", options:["Startbesked","Slutbesked","Kontrollplan","Arbetsmiljöplan"], answerIndex:1, reasoning:"Slutbesked visar att samtliga krav är verifierade och eventuella villkor uppfyllda. Utan slutbesked får byggnaden normalt inte tas i bruk. Källa: PBL 10 kap. 34 §." },
      { id:"Q5", type:"mcq", q:"Vem ansvarar för att det finns en kontrollplan?", options:["Byggnadsnämnden","Byggherren","KA","Entreprenören"], answerIndex:1, reasoning:"Byggherren har huvudansvaret att ta fram och se till att kontrollplanen följs. KA bistår med framtagande och uppföljning. Kontrollplanen fastställs i startbeskedet. Källa: PBL 10 kap. 5–6 §§." },
      { id:"Q6", type:"mcq", q:"När hålls tekniskt samråd?", options:["Före bygglov","Efter bygglov men före startbesked","Efter slutsamråd","Efter slutbesked"], answerIndex:1, reasoning:"Tekniskt samråd hålls när KA krävs eller nämnden bedömer det. Man går igenom bl.a. arbetets planering, kontrollplan, riskmoment och behov av arbetsplatsbesök. Källa: PBL 10 kap. 14–18 §§." },
      { id:"Q7", type:"mcq", q:"Vilket av följande kräver bygglov enligt PBL 9 kap.?", options:["Friggebod 15 kvm","Tillbyggnad av bostad","Vindsisolering","Byte av köksluckor"], answerIndex:1, reasoning:"Tillbyggnad är lovpliktig som huvudregel. Vissa små åtgärder kan vara lov- eller anmälningsbefriade, men tillbyggnad faller under 9 kap. PBL. Källa: PBL 9 kap. 2 §." },
      { id:"Q8", type:"short", q:"Vad är rivningslov?", answer:"Tillstånd att riva en byggnad inom detaljplan m.m.", reasoning:"Rivningslov prövas av byggnadsnämnden, bl.a. för att skydda kulturhistoriska värden och beakta planintresset. Startbesked krävs därefter innan rivning påbörjas. Källor: PBL 9 kap. 10–13 §§; 10 kap. 3 §." },
      { id:"Q9", type:"case", q:"Byggherre startar utan startbesked. Hur agerar KA?", answer:"Påpeka olaglig byggstart, dokumentera, underrätta nämnden vid allvarlig avvikelse.", reasoning:"Byggstart utan startbesked är förbjudet. KA ska verka för att krav uppfylls och kan vid väsentlig avvikelse underrätta nämnden. Sanktionsavgift kan bli aktuell. Källor: PBL 10:3, 11 kap. (tillsyn och sanktionsavgifter)." },
      { id:"Q10", type:"mcq", q:"Vad prövas primärt i bygglovet?", options:["Tekniska lösningar","Plan- och lovplikt","Energiprestanda","Entreprenadform"], answerIndex:1, reasoning:"Bygglovet rör planfrågor (användning, placering, utformning) och lovplikt. Tekniska krav hanteras inför startbeskedet. Källor: PBL 9 kap.; 10 kap." },

      // Några extra PBL-frågor med utförligare resonemang
      { id:"Q41", type:"mcq", q:"När fastställs kontrollplanen formellt?", options:["I bygglovsbeslutet","I startbeskedet","I slutsamrådet","I slutbeskedet"], answerIndex:1, reasoning:"Kontrollplanen hör till den tekniska prövningen och fastställs i startbeskedet så att det blir tydligt vad som ska kontrolleras och hur. Källa: PBL 10 kap. 6 §." },
      { id:"Q42", type:"mcq", q:"När krävs tekniskt samråd?", options:["Endast vid små åtgärder","När KA krävs eller nämnden bedömer det","Endast vid rivning","Aldrig vid ändringar"], answerIndex:1, reasoning:"Om ärendet kräver KA hålls i normalfallet tekniskt samråd. Nämnden kan även kalla till samråd i andra fall om det behövs. Källa: PBL 10 kap. 14 §." },
      { id:"Q43", type:"short", q:"Vad är slutsamråd?", answer:"Möte nära färdigställande för att stämma av krav och underlag inför slutbesked.", reasoning:"Man går igenom hur kontrollplanen följts, avvikelser, intyg och dokumentation. Detta utgör underlag till slutbesked. Källor: PBL 10 kap. 30–33 §§." },
      { id:"Q44", type:"case", q:"Avvikelse mot kontrollplan upptäcks. Hur agerar KA?", answer:"Dokumentera, föreslå åtgärd, följ upp och underrätta nämnden vid behov.", reasoning:"KA ska medverka till att kontroller sker enligt plan och att avvikelser hanteras spårbart. Vid allvarliga avvikelser kan nämnden behöva underrättas. Källa: PBL 10 kap. samt PBF 10 kap. om KA." },
      { id:"Q45", type:"mcq", q:"Vem ansvarar ytterst för att kraven i PBL uppfylls?", options:["KA","Byggherren","Entreprenören","Kontrollorganet"], answerIndex:1, reasoning:"Byggherren ansvarar för att lagstiftningens krav uppfylls. KA är ett stöd men tar inte över byggherrens ansvar. Källa: PBL 10 kap. 5 §." },
      { id:"Q46", type:"mcq", q:"När kan tillfälligt slutbesked ges?", options:["Aldrig","När mindre krav återstår men förutsättning finns att följa upp","Endast vid rivning","Endast i nödläge"], answerIndex:1, reasoning:"Nämnden kan ge tillfälligt slutbesked om endast mindre frågor återstår och det finns rutiner för uppföljning. Det är tids- eller villkorsbundet. Källa: PBL 10 kap. 36 §." },
      { id:"Q47", type:"mcq", q:"Vad behandlar PBL kapitel 11?", options:["Bygglov","Tekniska egenskaper","Tillsyn och påföljder","Planprocessen"], answerIndex:2, reasoning:"Kapitel 11 samlar tillsyn, förelägganden och sanktionssystemet inklusive byggsanktionsavgifter. Källa: PBL 11 kap." },
      { id:"Q48", type:"mcq", q:"Vad krävs för att påbörja rivning inom detaljplan?", options:["Rivningsanmälan","Rivningslov och startbesked","Endast bygglov","Ingenting"], answerIndex:1, reasoning:"Rivningslov prövar lämpligheten att riva; startbesked krävs sedan före start, precis som vid andra åtgärder. Källor: PBL 9:10–13 och 10:3." },
      { id:"Q49", type:"short", q:"Vad avses ofta med 'Attefallsåtgärder'?", answer:"Lovbefriade åtgärder (t.ex. komplementbostadshus, tillbyggnad) enligt PBF med anmälningsplikt.", reasoning:"Dessa är undantag från lovplikt men oftast anmälningspliktiga och kräver startbesked. Källa: PBF 6–9 kap. (bl.a. 9:4a)." },
      { id:"Q50", type:"mcq", q:"I vilket kapitel regleras bygglovsprövningen?", options:["PBL 8 kap.","PBL 9 kap.","PBL 10 kap.","PBL 11 kap."], answerIndex:1, reasoning:"Bygglov, förhandsbesked och planfrågor regleras i 9 kap. PBL, medan tekniska frågor hanteras i 10 kap. PBL." },
      { id:"Q51", type:"mcq", q:"Är rivningsanmälan och rivningslov samma sak?", options:["Ja","Nej"], answerIndex:1, reasoning:"Rivningslov är ett beslut om tillstånd; anmälan avser anmälningspliktiga åtgärder. Båda kan förekomma beroende på åtgärdens art och plats. Källor: PBL 9 kap.; PBF 6 kap." },
      { id:"Q52", type:"case", q:"Granne klagar på buller under byggtid. Hur hanteras det?", answer:"Informera byggherren, hänvisa till miljöförvaltningen och ordningsregler; PBL:s krav rör byggåtgärderna, inte alla driftstörningar.", reasoning:"Byggtidsstörningar hanteras ofta enligt miljöbalken/kommunala föreskrifter. KA:s roll är främst PBL-relaterad kontroll. Källor: PBL 10–11 kap., Miljöbalken." },
      { id:"Q53", type:"mcq", q:"När kan nämnden kräva utökad kontroll?", options:["Aldrig","När åtgärden är riskfylld/komplex","Vid småhus","När entreprenör begär det"], answerIndex:1, reasoning:"Om risknivån är hög eller komplexiteten stor kan nämnden föreskriva fler kontroller eller särskilt sakkunnig. Källa: PBL 10 kap. 8 §, samt praxis." },
      { id:"Q54", type:"short", q:"Vad är KA:s slutliga utlåtande?", answer:"Skriftligt underlag inför slutbesked om hur kontrollplanen följts och att kraven är uppfyllda.", reasoning:"Utlåtandet sammanfattar genomförda kontroller, avvikelser och kvarstående frågor. Källa: PBL 10 kap. 32–33 §§." },
      { id:"Q55", type:"mcq", q:"Vad avser förhandsbesked?", options:["Teknikval","Lokaliseringens lämplighet","Entreprenadform","Energiprestanda"], answerIndex:1, reasoning:"Förhandsbesked bedömer platsens lämplighet innan projektering/bygglov, vilket minskar risken för onödigt arbete. Källa: PBL 9:17–18." },
    ]
  },

  /* ========== PBF (20) ========== */
  {
    id: "grp-pbf",
    title: "PBF – Plan- och byggförordningen",
    questions: [
      { id:"Q11", type:"mcq", q:"Var finns detaljerade undantag från bygglov?", options:["PBL","PBF","BBR","EKS"], answerIndex:1, reasoning:"PBF preciserar lovpliktsundantag och anmälningsplikt (t.ex. friggebod, Attefall). PBL är ramen, PBF ger detaljer. Källa: PBF 6–9 kap." },
      { id:"Q12", type:"mcq", q:"Vilken regel styr komplementbostadshus (Attefall, 30 kvm)?", options:["PBF 6 kap.","PBF 9 kap. 4 a §","PBF 10 kap.","PBL 8 kap."], answerIndex:1, reasoning:"Komplementbostadshus (s.k. Attefall) regleras i PBF 9:4a och är normalt anmälningspliktigt även om lovfritt. Startbesked krävs. Källa: PBF 9:4a och PBL 10:3." },
      { id:"Q13", type:"mcq", q:"Friggebod ≤ 15 kvm kräver:", options:["Bygglov","Rivningslov","Anmälan","Varken lov eller anmälan"], answerIndex:3, reasoning:"Friggebod upp till angiven storlek och inom övriga villkor är lov- och anmälningsfri. Kontrollera lokala planer och skyddsbestämmelser. Källa: PBF 9:4." },
      { id:"Q14", type:"mcq", q:"Var regleras KA:s behörighetskrav?", options:["PBL 10 kap.","PBF 10 kap.","BBR 1:2","EKS 1:1"], answerIndex:1, reasoning:"PBF 10 kap. anger bl.a. krav på lämplighet, erfarenhet och oberoende för kontrollansvarig (certifiering). Källa: PBF 10 kap." },
      { id:"Q15", type:"mcq", q:"Attefallshus närmare gräns än 4,5 m kräver:", options:["Inget extra","Grannes medgivande","Bygglov","Rivningslov"], answerIndex:1, reasoning:"Placering närmare gräns än 4,5 m fordrar grannens medgivande även för lovfria åtgärder. Källa: PBF 9:4a." },
      { id:"Q16", type:"mcq", q:"KA:s oberoende enligt PBF innebär att KA:", options:["Måste vara kommunanställd","Får inte ha jäv/intressekonflikt","Måste vara entreprenör","Måste vara arkitekt"], answerIndex:1, reasoning:"KA ska vara oberoende i förhållande till den kontrollerade verksamheten för att säkerställa objektivitet. Källa: PBF 10:9." },
      { id:"Q17", type:"short", q:"Vad reglerar PBF 6 kap. 1 §?", answer:"Vilka åtgärder som är anmälningspliktiga respektive undantagna från lov.", reasoning:"Bestämmelsen pekar ut åtgärder som inte kräver bygglov men som ändå kan vara anmälningspliktiga, t.ex. eldstad. Källa: PBF 6 kap." },
      { id:"Q18", type:"case", q:"Granneyttrande saknas för Attefall nära gräns. Hur resonerar KA?", answer:"Utan medgivande är placeringen inte tillåten trots lovfrihet. Rekommendera omplacering eller inhämtat medgivande.", reasoning:"Grannes medgivande är ett uttryckligt villkor i PBF. Utan detta strider åtgärden mot förordningen. Källa: PBF 9:4a." },

      // Fler PBF
      { id:"Q56", type:"mcq", q:"Ändring av bärande konstruktion kräver:", options:["Bygglov","Anmälan","Inget","Rivningslov"], answerIndex:1, reasoning:"Väsentlig ändring av bärande delar påverkar tekniska egenskapskrav och är anmälningspliktig. Startbesked krävs innan arbete. Källa: PBF 6 kap.; PBL 10:3." },
      { id:"Q57", type:"mcq", q:"Installation av eldstad/kamin kräver oftast:", options:["Bygglov","Anmälan","Inget","Rivningslov"], answerIndex:1, reasoning:"Eldstad och rökkanal är normalt anmälningspliktigt och fordrar startbesked. Kontrollera även brandskyddskraven. Källa: PBF 6 kap.; BBR 5/6." },
      { id:"Q58", type:"mcq", q:"Skylt/ljusanordning är:", options:["Alltid lovfritt","Ofta bygglovspliktigt","Endast anmälningspliktigt","Förbjudet"], answerIndex:1, reasoning:"Skyltar kan påverka stadsbild och trafiksäkerhet och är därför ofta lovpliktiga enligt PBF och lokala planer. Källa: PBF 6–9 kap.; lokal detaljplan." },
      { id:"Q59", type:"mcq", q:"Väsentlig ändring av planlösning är:", options:["Lovpliktig","Anmälningspliktig","Lov- och anmälningsfri","Rivningspliktig"], answerIndex:1, reasoning:"Ändringar som rör t.ex. brandcellsindelning eller tillgänglighet påverkar tekniska egenskaper och blir anmälningspliktiga. Källa: PBF 6 kap." },
      { id:"Q60", type:"mcq", q:"Friggebodens maxhöjd (cirka) är:", options:["2,0 m","2,5 m","3,0 m","3,5 m"], answerIndex:2, reasoning:"Som huvudregel gäller ungefär 3 m nockhöjd (kontrollera lokal reglering). Källa: PBF 9:4 och lokala bestämmelser." },
      { id:"Q61", type:"mcq", q:"Attefallstillbyggnad (t.ex. 15 kvm) är:", options:["Bygglovspliktig","Anmälningspliktig","Alltid fri","Rivningspliktig"], answerIndex:1, reasoning:"Tillbyggnaden är lovbefriad men anmälningspliktig och kräver startbesked. Källa: PBF 9 kap.; PBL 10:3." },
      { id:"Q62", type:"short", q:"Vad är bygganmälan?", answer:"Anmälan till byggnadsnämnden för anmälningspliktiga åtgärder.", reasoning:"Anmälan ger nämnden underlag för teknisk prövning och startbesked. Källa: PBF 6 kap.; PBL 10 kap." },
      { id:"Q63", type:"mcq", q:"Mur/plank inom detaljplan är:", options:["Alltid lovfritt","Ofta lovpliktigt","Endast anmälan","Endast vid hörntomt"], answerIndex:1, reasoning:"Mur och plank påverkar stadsbild och grannar; de är därför ofta lovpliktiga. Källa: PBF 6–9 kap.; lokala planer." },
      { id:"Q64", type:"mcq", q:"Gäller startbesked för anmälningsärenden?", options:["Nej","Ja, krävs före start","Endast vid småhus","Endast vid rivning"], answerIndex:1, reasoning:"Även anmälningspliktiga åtgärder kräver startbesked innan arbetet får påbörjas. Källa: PBL 10 kap. 3 §." },
      { id:"Q65", type:"mcq", q:"Friggebod inom sammanhållen bebyggelse är:", options:["Förbjuden","Lovfri inom villkor","Alltid lovpliktig","Endast med detaljplan"], answerIndex:1, reasoning:"Lovfriheten gäller om samtliga villkor är uppfyllda (storlek, placering m.m.). Kontrollera även skyddsbestämmelser. Källa: PBF 9:4." },
      { id:"Q66", type:"case", q:"Attefall närmare gata än 4,5 m utan medgivande.", answer:"Inte tillåtet; flytta åtgärden, skaffa medgivande eller sök lov.", reasoning:"4,5 m-regeln gäller gentemot tomtgräns/granne. Undantag med medgivande, annars strid mot PBF. Källa: PBF 9:4a." },
      { id:"Q67", type:"short", q:"Vad bör anmälan innehålla?", answer:"Ritningar/beskrivningar, förslag till KA, förslag till kontrollplan m.m.", reasoning:"Underlaget ska möjliggöra nämndens bedömning av tekniska krav innan startbesked. Källa: PBF 6 kap.; PBL 10 kap." },
    ]
  },

  /* ========== BBR (25) ========== */
  {
    id: "grp-bbr",
    title: "BBR – Boverkets byggregler",
    questions: [
      { id:"Q19", type:"mcq", q:"BBR är främst:", options:["Detaljkrav på material","Funktionskrav med råd","Upphandlingsregler","Planbestämmelser"], answerIndex:1, reasoning:"BBR anger funktionskrav (vad som ska uppnås) och kompletteras av allmänna råd (exempel på hur). Det ger flexibilitet i val av tekniska lösningar. Källa: BBR avsnitt 1:2." },
      { id:"Q20", type:"mcq", q:"Vilket avsnitt reglerar energihushållning?", options:["BBR 3","BBR 5","BBR 6","BBR 9"], answerIndex:3, reasoning:"Avsnitt 9 ställer krav på byggnadens primärenergital (kWh/m² Atemp, år), systemutformning samt verifiering. Källa: BBR avsnitt 9." },
      { id:"Q21", type:"mcq", q:"Brandskydd återfinns främst i:", options:["BBR 3","BBR 5","BBR 6","BBR 8"], answerIndex:1, reasoning:"BBR 5 omfattar bl.a. brandtekniska klasser, utrymning, brandcellsindelning och brandtekniska installationer. Källa: BBR avsnitt 5." },
      { id:"Q22", type:"mcq", q:"Tillgänglighet och användbarhet finns i:", options:["BBR 3","BBR 5","BBR 8","BBR 9"], answerIndex:0, reasoning:"Avsnitt 3 behandlar bostadsutformning, tillgänglighet och användbarhet (entréer, hygienrum, ledstråk m.m.). Källa: BBR avsnitt 3." },
      { id:"Q23", type:"mcq", q:"Radon och luftkvalitet behandlas i:", options:["BBR 6","BBR 8","BBR 9","BBR 5"], answerIndex:0, reasoning:"Avsnitt 6 omfattar hygien, hälsa och miljö: bl.a. ventilation, radon, fuktsäkerhet och termiskt klimat. Källa: BBR avsnitt 6." },
      { id:"Q24", type:"mcq", q:"Normal rumshöjd i bostäder enligt BBR:", options:["2,0 m","2,2 m","2,4 m","2,7 m"], answerIndex:2, reasoning:"Riktvärde för bostadsrum är i normalfallet omkring 2,4 m (undantag för snedtak, loft m.m. kan förekomma). Kontrollera detaljkrav i aktuellt avsnitt. Källa: BBR avsnitt 3." },
      { id:"Q25", type:"mcq", q:"Riktvärde U-värde yttervägg småhus:", options:["0,30","0,24","0,18","0,10"], answerIndex:2, reasoning:"U-värdesnivåer används i energiberäkning, men krav mäts på primärenergital. Angivna värden är typiska riktvärden – projektspecifika krav styr. Källa: BBR 9 samt råd/tabeller." },
      { id:"Q26", type:"case", q:"Förskola med hög ljudnivå – vad utreder KA?", answer:"Ljudklass, installationers ljud, efterklang, otätheter – jämför mot projekterade krav.", reasoning:"Barnmiljö har skärpta krav på ljud och inomhusklimat. Kontrollera SS 25268/25267, BBR 6–7, samt entreprenörens mätprotokoll och åtgärda brister." },

      // Fler BBR
      { id:"Q68", type:"mcq", q:"Ventilation dimensioneras främst för:", options:["Estetik","Hygien/komfort och hälsa","Enbart energi","Enbart buller"], answerIndex:1, reasoning:"Målet är god luftkvalitet, fuktbalans och komfort. Energifrågor och buller beaktas men hygien/komfort är grund. Källa: BBR avsnitt 6." },
      { id:"Q69", type:"mcq", q:"EI60 betyder:", options:["Bärförmåga 60 min","Integritet+isolering 60 min","Endast rök 60 min","Inget"], answerIndex:1, reasoning:"E=integritet (täthet), I=isolering. 60 anger tid i minuter. Används för t.ex. branddörrar och väggar i brandcellsgräns. Källa: BBR 5." },
      { id:"Q70", type:"mcq", q:"Brandcellsgränser ska vara:", options:["Delvis öppna","Täta och genomföringar brandtätas","Endast målade","Ej provade"], answerIndex:1, reasoning:"Genomföringar måste brandtätas med godkända system (dokumentation krävs). Brister här är vanliga avvikelser. Källa: BBR 5." },
      { id:"Q71", type:"mcq", q:"Energiprestanda uttrycks som:", options:["Installerad effekt","Primärenergatal (kWh/m² Atemp,år)","U-värde","COP"], answerIndex:1, reasoning:"Primärenergitalet gör olika energibärare jämförbara via viktningsfaktorer. Verifieras i drift. Källa: BBR avsnitt 9." },
      { id:"Q72", type:"mcq", q:"Täthet verifieras ofta med:", options:["Färganalys","Tryckprovning (blower door)","Vibrationsmätning","Ljudmätning"], answerIndex:1, reasoning:"Luftläckage påverkar energi, fukt och komfort. Tryckprovning ger kvantitativt mått (t.ex. l/s m² vid visst tryck). Källa: BBR 9/6." },
      { id:"Q73", type:"mcq", q:"Fuktsäkerhetsprojektering behövs för att:", options:["Sänka kostnad","Undvika mögel/fuktskador","Öka buller","Sänka takhöjd"], answerIndex:1, reasoning:"Fuktkritiska skeden (gjutning, torktid, väderskydd) måste planeras. Dokumentation ska kunna visas för nämnden. Källa: BBR 6 (hygien, hälsa, miljö)." },
      { id:"Q74", type:"short", q:"Vad är Atemp?", answer:"Den invändiga area som värms till mer än 10 °C.", reasoning:"Begreppet används i energiberäkningar för att normalisera energianvändning. Korrekt areabestämning är kritisk. Källa: BBR definitioner." },
      { id:"Q75", type:"mcq", q:"Säkerhet vid användning omfattar t.ex.:", options:["Barnsäkring, glas, räcken","Anbudsregler","Upphandling","Entreprenadform"], answerIndex:0, reasoning:"BBR 8 tar sikte på risker i användningsskedet: fallrisk, glas, skydd mot klämning m.m. Källa: BBR avsnitt 8." },
      { id:"Q76", type:"mcq", q:"Tillgänglig entré bör ha:", options:["Trappa utan räcke","Stegfrihet/ramp vid behov","Endast skylt","Endast ringklocka"], answerIndex:1, reasoning:"Krav på tillgänglighet innebär bl.a. att nivåskillnader hanteras. Ramp/lutning, kontraster och fri passagemått är typiska aspekter. Källa: BBR 3." },
      { id:"Q77", type:"mcq", q:"Ljudklass C i bostäder är:", options:["Ingen standard","Baskrav i standard","Endast skolor","Endast kontor"], answerIndex:1, reasoning:"Ljudklasser definieras i SS 25267/25268. Klass C är ofta projektens minimimål; högre klasser kan krävas av beställare. Koppling till BBR 7 (buller)." },
      { id:"Q78", type:"case", q:"Kondens på kallvind. Åtgärder?", answer:"Säkra lufttäthet/ångbroms, rätt ventilation och isolering, kontrollera köldbryggor.", reasoning:"Kondens tyder ofta på varm fuktig inomhusluft som läcker upp. Tätning, ventilationsbalans och fuktsäkerhetsprojektering krävs. Källor: BBR 6; ByggaF." },
      { id:"Q79", type:"mcq", q:"Dagsljuskrav:", options:["Inget krav","Funktionskrav på tillräckligt dagsljus","Endast lux-tal","Endast söderfönster"], answerIndex:1, reasoning:"BBR anger funktionskrav; verifiering kan ske med dagsljusfaktor/simulering. Kravet är inte ‘solinstrålning’ i sig. Källa: BBR 3/6 och allmänna råd." },
      { id:"Q80", type:"mcq", q:"OVK gäller:", options:["Aldrig","Vid nybyggnad och återkommande i vissa byggnader","Endast småhus","Endast industri"], answerIndex:1, reasoning:"Obligatorisk ventilationskontroll gäller både nybyggnad (slut-/första besiktning) och återkommande i vissa byggnadstyper. Separat förordning, koppling till BBR 6." },
      { id:"Q81", type:"short", q:"Vad betyder REI i brandklass?", answer:"R=bärförmåga, E=integritet, I=isolering.", reasoning:"Klassbeteckningar visar hur länge en byggnadsdel upprätthåller funktioner vid brand. Exempel: REI 60. Källa: BBR 5." },
      { id:"Q82", type:"mcq", q:"Verifiering av brandskydd kan ske via:", options:["Endast förenklad dimensionering","Förenklad eller analytisk dimensionering","Endast beräkning","Endast provning"], answerIndex:1, reasoning:"Båda angreppssätten är möjliga. Analytisk dimensionering används vid komplexa byggnader/funktionskrav då förenklad metod inte räcker. Källa: BBR avsnitt 5." },
      { id:"Q83", type:"mcq", q:"Högsta rekommenderade radonhalt i bostäder:", options:["1000 Bq/m³","400 Bq/m³","200 Bq/m³","50 Bq/m³"], answerIndex:2, reasoning:"Riktvärde för årsmedelvärde är 200 Bq/m³ i bostäder/lokaler där människor vistas varaktigt. Källa: BBR 6 samt Strålsäkerhetsmyndighetens råd." },
      { id:"Q84", type:"case", q:"Utrymningsdörr öppnas mot flyktriktningen i publik lokal.", answer:"Projektera om så att dörrar öppnas i utrymningsriktningen och uppfyller bredd/antal krav.", reasoning:"I publika lokaler ska utrymning kunna ske snabbt utan hinder. Dörrars öppningsriktning, fri bredd och antalet utrymningsvägar kontrolleras. Källa: BBR 5." },
    ]
  },

  /* ========== EKS (15) ========== */
  {
    id: "grp-eks",
    title: "EKS – Konstruktionsregler (Eurokoder)",
    questions: [
      { id:"Q27", type:"mcq", q:"EKS syftar främst till att säkerställa:", options:["Tillgänglighet","Brandskydd","Bärförmåga och stabilitet","Rumshöjd"], answerIndex:2, reasoning:"EKS (BFS 2011:10 m.fl.) anger svenska nationella val till Eurokoderna och säkerställer rätt säkerhetsnivå i dimensionering. Källa: EKS, inledande kapitel." },
      { id:"Q28", type:"mcq", q:"Vad står γ (gamma) för i dimensionering?", options:["Brandklass","Partialkoefficient","Isolervärde","Fuktsäkerhet"], answerIndex:1, reasoning:"Partialkoefficienter används på laster/material för att ta höjd för osäkerheter – del i säkerhetskonceptet. Källa: Eurokoder/EKS, EC0/EC1." },
      { id:"Q29", type:"mcq", q:"Vilken lastkombination beaktas normalt?", options:["Endast egenlast","Endast snölast","Karakteristisk kombination av laster","Ingen"], answerIndex:2, reasoning:"Man kombinerar permanenta och variabla laster enligt EC1 (t.ex. egenlast, nyttig last, snö, vind). Källa: Eurokod 1 och EKS." },
      { id:"Q30", type:"short", q:"Vem utfärdar EKS?", answer:"Boverket.", reasoning:"EKS är Boverkets föreskrifter om tillämpningen av Eurokoderna i Sverige. Källa: BFS 2011:10 (EKS) m.fl." },
      { id:"Q31", type:"case", q:"Ny bärverksprodukt saknar CE.", answer:"Använd inte produkten förrän DoP/CE finns; begär full verifiering eller byt produkt.", reasoning:"Bärverksdelar som omfattas av harmoniserade standarder ska CE-märkas och ha prestandadeklaration. Annars saknas spårbar verifiering. Källa: EN 1090 m.fl.; EKS." },
      { id:"Q32", type:"mcq", q:"Vid komplicerad bärande konstruktion kan motiveras:", options:["Ingen kontroll","Endast egenkontroll","Tredjepartsgranskning","Färre kontroller"], answerIndex:2, reasoning:"Oberoende granskning (t.ex. kontrollklass K2/K3) minskar risken i komplexa projekt. Källa: EKS om kontrollklasser." },

      { id:"Q85", type:"mcq", q:"Konsekvensklass för vanligt bostadshus:", options:["CC1","CC2","CC3","CC0"], answerIndex:1, reasoning:"Normalt CC2 (medel). CC3 kan gälla särskilda byggnader där kollaps får stora konsekvenser. Källa: EKS/EC0." },
      { id:"Q86", type:"mcq", q:"Kontrollklass enligt EKS:", options:["K0–K2","K1–K3","A–C","REI"], answerIndex:1, reasoning:"Kontrollklass (K1–K3) väljs utifrån risk/komplexitet. Högre klass → mer omfattande kontroll. Källa: EKS." },
      { id:"Q87", type:"mcq", q:"ULS respektive SLS avser:", options:["Brand och ljud","Brottgräns och bruksgräns","Fukt och energi","Vind och snö"], answerIndex:1, reasoning:"ULS = ultimate limit state (brott), SLS = serviceability limit state (bruk). Båda måste uppfyllas. Källa: EC0/EC1 och respektive materialstandard." },
      { id:"Q88", type:"short", q:"Vad är egenlast (G)?", answer:"Beständig last från konstruktionen själv.", reasoning:"Ingår i lastkombinationer som dimensioneringen baseras på. Källa: EC1/EKS." },
      { id:"Q89", type:"mcq", q:"Snölast beaktas enligt:", options:["BBR 3","Eurokod 1/EKS","PBL 9","PBF 6"], answerIndex:1, reasoning:"EC1 behandlar miljölaster (snö/vind). EKS anger svenska nationella parametrar och zoner. Källa: Eurokod 1; EKS." },
      { id:"Q90", type:"mcq", q:"Säkerhetsformat i Eurokoder bygger på:", options:["Deterministiska värden","Partialkoefficienter","Inga säkerhetsfaktorer","Endast provning"], answerIndex:1, reasoning:"Genom att multiplicera med partialkoefficienter hanteras osäkerheter i belastning/material. Källa: EC0/EC1 och respektive materialstandard." },
      { id:"Q91", type:"case", q:"Vindstabilitet bristfällig i högt trapphus.", answer:"Analysera stabiliseringssystem (skivor/kryss/ram), öka styvhet eller införa ytterligare stabiliserande element.", reasoning:"Horisontallaster måste tas om hand av ett robust system. Dokumentera beräkning och åtgärd i enlighet med EKS/Eurokoder." },
      { id:"Q92", type:"mcq", q:"Geoteknisk kategori (GK) används för:", options:["Ventilation","Fuktsäkerhet","Grundläggnings-/georisknivå","Tillgänglighet"], answerIndex:2, reasoning:"GK1–GK3 beskriver komplexitet/risk i geoteknik och styr kraven på undersökning och kontroll. Källa: Eurokod 7; EKS." },
      { id:"Q93", type:"short", q:"Vad innebär CE enligt EN 1090 för stål?", answer:"CE-märkning enligt harmoniserad standard med prestandadeklaration (DoP).", reasoning:"Visar att komponenten uppfyller deklarerad bärförmåga/stabilitet och kan användas i bärverk. Källa: EN 1090; EKS." },
    ]
  },

  /* ========== KA (10) ========== */
  {
    id: "grp-ka",
    title: "Kontrollplan & KA:s arbete",
    questions: [
      { id:"Q33", type:"mcq", q:"Vem tar fram förslag till kontrollplan normalt?", options:["Byggnadsnämnden","Byggherren","KA","Entreprenören"], answerIndex:2, reasoning:"Byggherren ansvarar men KA tar i praktiken fram kontrollplanens innehåll (vad, hur, mot vad och dokumentation). Nämnden fastställer i startbeskedet. Källa: PBL 10:5–6." },
      { id:"Q34", type:"mcq", q:"Vad ska framgå i kontrollplanen?", options:["Vad, vem, mot vad/hur, dokumentation","Endast ritningar","Endast besiktning","Endast CE-intyg"], answerIndex:0, reasoning:"Kontrollplanen ska vara spårbar: vilka moment, ansvarig, kontrollmetod/regel och hur detta dokumenteras. Källa: PBL 10:6 och allmänna råd." },
      { id:"Q35", type:"mcq", q:"När kan nämnden besluta att KA inte behövs?", options:["Aldrig","Vid små/enkla ärenden","Endast vid Attefall","När entreprenör kräver det"], answerIndex:1, reasoning:"För enkla ärenden kan KA undantas. Bedömningen görs av nämnden utifrån risk och komplexitet. Källa: PBL 10:10." },
      { id:"Q36", type:"case", q:"Branddörrar utan intyg har monterats. Vad gör KA?", answer:"Stoppa montage, begär DoP/klassningsintyg, verifiera märkning, dokumentera avvikelse.", reasoning:"Utan verifierad prestanda riskeras otillåten lösning. KA ska säkerställa att BBR 5-kraven uppfylls och att intyg finns i egenkontroll/relationshandlingar." },
      { id:"Q37", type:"short", q:"Nämn tre riskmoment i småhus för kontrollplan.", answer:"Bärande konstruktion, brandskydd, fuktsäkerhet/tätskikt.", reasoning:"Momenten påverkar säkerhet och beständighet och är svåra/dyra att rätta i efterhand. Därför bör de alltid kontrolleras noga." },
      { id:"Q38", type:"mcq", q:"Vilka möten ska KA delta i enligt PBL/PBF?", options:["Tekniskt samråd, arbetsplatsbesök, slutsamråd","Endast tekniskt samråd","Endast slutsamråd","Inga"], answerIndex:0, reasoning:"Detta är kärnuppgifter för KA. Antalet arbetsplatsbesök styrs av risk/komplexitet och kontrollplanens innehåll. Källa: PBL 10 kap.; PBF 10 kap." },
      { id:"Q94", type:"mcq", q:"KA ska dokumentera:", options:["Inget","Arbetsplatsbesök och iakttagelser","Endast telefonsamtal","Endast slutbesked"], answerIndex:1, reasoning:"Dokumentation gör kontrollen spårbar och möjliggör nämndens uppföljning. Underlag används i KA:s utlåtande. Källa: PBF 10 kap.; PBL 10:32–33." },
      { id:"Q95", type:"mcq", q:"KA:s oberoende innebär bl.a. att KA inte bör:", options:["Granska handlingar","Utföra entreprenörens egenkontroll","Delta i samråd","Lämna utlåtande"], answerIndex:1, reasoning:"KA får inte hamna i jäv/låta kontrolluppdraget bli egenkontroll av eget arbete. Rollerna ska vara åtskilda. Källa: PBF 10:9." },
      { id:"Q96", type:"case", q:"Allvarlig avvikelse upptäcks sent.", answer:"Dokumentera, föreslå åtgärd, underrätta nämnden, följ upp åtgärd.", reasoning:"Spårbar avvikelsehantering och tidig eskalering minskar risk. Nämnden kan kräva ytterligare verifiering. Källa: PBL 10–11 kap." },
      { id:"Q97", type:"short", q:"Vad ska KA:s utlåtande inför slutbesked belysa?", answer:"Om kontrollplan följts, avvikelser och att krav uppfyllts.", reasoning:"Utlåtandet knyter ihop kontrollarbetet och ligger till grund för slutbeskedet. Källa: PBL 10:32–34." },
    ]
  },

  /* ========== Blandat (5) ========== */
  {
    id: "grp-mix",
    title: "Blandade/Provträning",
    questions: [
      { id:"Q39", type:"mcq", q:"Vilket underlag behöver nämnden för slutbesked?", options:["Entreprenadkontrakt","KA:s utlåtande + verifierad dokumentation","Nytt startbesked","Arbetsmiljöplan"], answerIndex:1, reasoning:"Slutbesked bygger på att projektet visar uppfyllnad av krav. KA:s utlåtande och spårbar dokumentation (provningar, intyg) är centralt. Källa: PBL 10:32–34." },
      { id:"Q40", type:"mcq", q:"Skillnaden mellan bygglov och startbesked?", options:["Inga","Lov=plan/juridik, start=tekniskt klartecken","Lov=energi, start=brand","Lov=entreprenad, start=budget"], answerIndex:1, reasoning:"Lovet prövar planfrågor/lovplikt; startbesked granskar tekniska lösningar, kontrollplan och riskhantering innan start. Källa: PBL 9 kap. resp. 10 kap." },
      { id:"Q98", type:"mcq", q:"Tillfälligt slutbesked innebär:", options:["Att allt är klart","Att vissa villkor återstår men brukande kan medges","Att ärendet avskrivs","Att startbesked upphör"], answerIndex:1, reasoning:"Brukande kan medges villkorat, men återstående krav ska följas upp. Tids- och villkorsstyrt. Källa: PBL 10:36." },
      { id:"Q99", type:"mcq", q:"Vem beslutar om byggsanktionsavgift?", options:["Domstol","Byggnadsnämnden","KA","Entreprenören"], answerIndex:1, reasoning:"Tillsynsmyndigheten är byggnadsnämnden som kan besluta om avgift enligt kap. 11. Beslut kan överklagas. Källa: PBL 11 kap." },
      { id:"Q100", type:"short", q:"Nämn tre centrala regelkällor i KA-arbetet.", answer:"PBL, PBF, BBR/EKS (samt lokala planer/AFS/OVK-regler vid behov).", reasoning:"Dessa ramar täcker planjuridik, tekniska krav och konstruktion. Komplettera med lokala bestämmelser och tillämpliga standarder." },
    ]
  },
];

/* ---------- hjälp ---------- */
function flatQuestions() {
  const a = [];
  BANK.forEach(g => g.questions.forEach(q => a.push({ ...q, groupId: g.id, groupTitle: g.title })));
  return a;
}
const ALL = flatQuestions();
const ALL_BY_ID = new Map(ALL.map(q => [q.id, q]));

function useStoredState(defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...defaultValue, ...JSON.parse(raw) } : defaultValue;
    } catch { return defaultValue; }
  });
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {} }, [state]);
  return [state, setState];
}
function shuffle(ids) {
  const a = [...ids];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/* ---------- App ---------- */
export default function App() {
  const [app, setApp] = useStoredState({
    mode: "study", // "study" | "quiz" | "summary"
    quiz: {
      type: "mcq",          // "mcq" | "case" | "short"
      order: "random",      // "random" | "chronological"
      size: 20,
      ids: [],
      index: 0,
      graded: false,
      incorrectIds: [],
      reviewingWrongOnly: false,
      sessionId: null       // nytt: varje prov får unik session
    },
    mcqAnswers: {},          // id:number
    textAnswers: {},         // id:string (för case/short)
    reveal: {},              // id:{answer,reasoning}
    results: []              // historik över slutförda prov
  });

  // Räkna hur många frågor av en typ som finns
  const counts = useMemo(() => {
    const c = { mcq:0, case:0, short:0 };
    ALL.forEach(q => { c[q.type]++; });
    return c;
  }, []);

  // Sätt standard-antal till MAX tillgängligt för vald typ
  useEffect(() => {
    setApp(s => ({
      ...s,
      quiz: {
        ...s.quiz,
        size: s.quiz.type==="mcq" ? counts.mcq : s.quiz.type==="case" ? ALL.filter(q=>q.type==="case").length : ALL.filter(q=>q.type==="short").length
      }
    }));
    // eslint-disable-next-line
  }, []);

  /* --- starta prov för viss kategori (nollställer tidigare svar) --- */
  const startQuizFor = (type, order, size, groupId="all") => {
    const pool = ALL.filter(q => (type==="all" ? true : q.type===type) && (groupId==="all" ? true : q.groupId===groupId));
    if (pool.length === 0) { alert("Inga frågor matchar valet."); return; }
    const idsChrono = pool.map(q => q.id);
    const idsOrdered = order === "random" ? shuffle(idsChrono) : idsChrono;
    const picked = idsOrdered.slice(0, Math.min(size, idsOrdered.length));

    // NYTT: nollställ svar och reveal vid nytt prov
    const newReveal = {};
    picked.forEach(id => newReveal[id] = { answer:false, reasoning:false });

    const newSessionId = `sess_${Date.now()}`;

    setApp(s => ({
      ...s,
      mode:"quiz",
      mcqAnswers: {},          // ← nollställ
      textAnswers: {},         // ← nollställ
      reveal:newReveal,
      quiz:{ type, order, size: picked.length, ids:picked, index:0, graded:false, incorrectIds:[], reviewingWrongOnly:false, sessionId:newSessionId }
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* --- resultathistorik helper --- */
  const appendResult = (entry) => {
    const stamp = new Date().toISOString();
    setApp(s => ({ ...s, results: [{ ...entry, stamp }, ...s.results].slice(0, 100) }));
  };

  /* --- rätta allt (MCQ poängsätts, Case/Kort till sammanfattning) --- */
  const gradeAll = () => {
    if (app.quiz.type !== "mcq") {
      const answered = app.quiz.ids.filter(id => {
        const q = ALL_BY_ID.get(id);
        if (q.type === "mcq") return app.mcqAnswers[id] !== undefined;
        return (app.textAnswers[id] || "").trim().length > 0;
      }).length;
      setApp(s => ({ ...s, mode:"summary", quiz:{ ...s.quiz, graded:true, incorrectIds:[] } }));
      appendResult({ sessionId: app.quiz.sessionId, type: app.quiz.type, size: app.quiz.ids.length, answered, right: null, wrong: null, percent: null });
      return;
    }
    const incorrect = [];
    app.quiz.ids.forEach(id => {
      const q = ALL_BY_ID.get(id);
      const picked = app.mcqAnswers[id];
      if (picked !== q.answerIndex) incorrect.push(id);
    });
    setApp(s => ({ ...s, mode:"summary", quiz:{ ...s.quiz, graded:true, incorrectIds:incorrect } }));
    appendResult({
      sessionId: app.quiz.sessionId,
      type: "mcq",
      size: app.quiz.ids.length,
      answered: app.quiz.ids.filter(id => app.mcqAnswers[id] !== undefined).length,
      right: app.quiz.ids.length - incorrect.length,
      wrong: incorrect.length,
      percent: Math.round(((app.quiz.ids.length - incorrect.length) / app.quiz.ids.length) * 100)
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* --- regrade (efter ändrade svar) --- */
  const regrade = () => {
    if (app.quiz.type !== "mcq") return;
    const incorrect = [];
    app.quiz.ids.forEach(id => {
      const q = ALL_BY_ID.get(id);
      const picked = app.mcqAnswers[id];
      if (picked !== q.answerIndex) incorrect.push(id);
    });
    setApp(s => ({ ...s, quiz:{ ...s.quiz, graded:true, incorrectIds: incorrect } }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* --- felgenomgång (klickbar lista + knapp) --- */
  const reviewWrong = () => {
    if (app.quiz.incorrectIds.length === 0) return;
    const ids = app.quiz.incorrectIds;
    const newReveal = { ...app.reveal };
    ids.forEach(id => newReveal[id] = { answer:true, reasoning:true });
    setApp(s => ({ ...s, mode:"quiz", reveal:newReveal, quiz:{ ...s.quiz, ids, index:0, reviewingWrongOnly:true } }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* --- hoppa till specifik felaktig fråga --- */
  const jumpToQuestion = (id) => {
    let ids = app.quiz.ids;
    if (!ids.includes(id)) ids = [id];
    const idx = ids.indexOf(id);
    const newReveal = { ...app.reveal, [id]: { answer:true, reasoning:true } };
    setApp(s => ({ ...s, mode:"quiz", reveal:newReveal, quiz:{ ...s.quiz, ids, index: idx, reviewingWrongOnly:true } }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* --- avsluta prov och tillbaka till översikt --- */
  const finishAndExit = () => {
    setApp(s => ({ ...s, mode:"study", quiz:{ ...s.quiz, ids:[], index:0, graded:false, incorrectIds:[], reviewingWrongOnly:false } }));
  };

  /* --- fortskridande/progress för 'fortsätt prov' --- */
  const quizProgress = useMemo(() => {
    const total = app.quiz.ids.length || 0;
    if (!total) return { answered:0, total:0, pct:0 };
    let answered = 0;
    app.quiz.ids.forEach(id => {
      const q = ALL_BY_ID.get(id);
      if (q.type === "mcq") {
        if (app.mcqAnswers[id] !== undefined) answered++;
      } else {
        if ((app.textAnswers[id] || "").trim().length > 0) answered++;
      }
    });
    return { answered, total, pct: Math.round((answered/total)*100) };
  }, [app.quiz, app.mcqAnswers, app.textAnswers]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <BookOpen className="w-7 h-7" />
          <h1 className="text-2xl font-semibold">KA Frågebank – Översikt & Prov</h1>
          <div className="ml-auto">
            <button onClick={()=>setApp(s=>({...s,mode:"study"}))} className={`px-3 py-1.5 rounded-lg border text-sm ${app.mode==="study"?"border-emerald-300 bg-emerald-50":"border-slate-300"}`}>
              <Home className="inline w-4 h-4 mr-1" /> Översikt
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {app.mode === "study" && (
          <Overview
            app={app}
            counts={counts}
            startQuizFor={startQuizFor}
            quizProgress={quizProgress}
            setApp={setApp}
          />
        )}

        {app.mode === "quiz" && (
          <QuizView
            app={app}
            setApp={setApp}
            gradeAll={gradeAll}
            regrade={regrade}
            finishAndExit={finishAndExit}
          />
        )}

        {app.mode === "summary" && (
          <Summary
            app={app}
            setApp={setApp}
            jumpToQuestion={jumpToQuestion}
            regrade={regrade}
            reviewWrong={reviewWrong}
            finishAndExit={finishAndExit}
          />
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-10 text-center text-xs text-slate-500">
        <p>Framsteg och resultat sparas lokalt i denna webbläsare.</p>
      </footer>
    </div>
  );
}

/* ---------- Översikt ---------- */
function Overview({ app, counts, startQuizFor, quizProgress, setApp }) {
  const [mcq, setMcq] = useState({ order: "random", size: counts.mcq });
  const [cas, setCas] = useState({ order: "random", size: ALL.filter(q=>q.type==="case").length });
  const [sho, setSho] = useState({ order: "random", size: ALL.filter(q=>q.type==="short").length });

  const hasOngoing = app.quiz.ids.length > 0 && app.mode !== "quiz";

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-6">
      {/* Fortsätt pågående prov */}
      {hasOngoing && (
        <div className="rounded-2xl border border-emerald-300 p-5 bg-emerald-50/60">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Fortsätt pågående prov</h2>
              <p className="text-sm text-slate-700">
                Typ: <strong>{app.quiz.type.toUpperCase()}</strong> • {quizProgress.answered}/{quizProgress.total} besvarade ({quizProgress.pct}%)
              </p>
              <div className="mt-2 w-full max-w-md h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${quizProgress.pct}%` }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>setApp(s=>({...s, mode:"quiz"}))} className="px-4 py-2 rounded-xl border border-emerald-500 bg-white text-emerald-700 text-sm">
                Fortsätt
              </button>
              <button onClick={()=>setApp(s=>({...s, quiz:{...s.quiz, ids:[], index:0, graded:false, incorrectIds:[], reviewingWrongOnly:false}}))} className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm">
                Avsluta utan att spara
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MCQ */}
      <div className="rounded-2xl border border-slate-200 p-5 bg-white">
        <h3 className="text-base font-semibold mb-2">Flervalsfrågor (MCQ)</h3>
        <p className="text-sm text-slate-600 mb-3">Tillgängliga: {counts.mcq}</p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm">Ordning</label>
          <select className="px-3 py-2 rounded-xl border border-slate-300 text-sm" value={mcq.order} onChange={e=>setMcq(v=>({...v,order:e.target.value}))}>
            <option value="random">Slumpmässig</option>
            <option value="chronological">Kronologisk</option>
          </select>
          <label className="text-sm ml-2">Antal</label>
          <select className="px-3 py-2 rounded-xl border border-slate-300 text-sm" value={mcq.size} onChange={e=>setMcq(v=>({...v,size:Number(e.target.value)}))}>
            {[counts.mcq, 40, 30, 20, 10].filter((v,i,self)=>self.indexOf(v)===i).map(n=><option key={n} value={n}>{n}</option>)}
          </select>
          <button onClick={()=>startQuizFor("mcq", mcq.order, mcq.size)} className="px-4 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-sm flex items-center gap-2">
            <Timer className="w-4 h-4" /> Starta prov (MCQ)
          </button>
        </div>
      </div>

      {/* CASE */}
      <div className="rounded-2xl border border-slate-200 p-5 bg-white">
        <h3 className="text-base font-semibold mb-2">Case</h3>
        <p className="text-sm text-slate-600 mb-3">Tillgängliga: {ALL.filter(q=>q.type==="case").length}</p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm">Ordning</label>
          <select className="px-3 py-2 rounded-xl border border-slate-300 text-sm" value={cas.order} onChange={e=>setCas(v=>({...v,order:e.target.value}))}>
            <option value="random">Slumpmässig</option>
            <option value="chronological">Kronologisk</option>
          </select>
          <label className="text-sm ml-2">Antal</label>
          <select className="px-3 py-2 rounded-xl border border-slate-300 text-sm" value={cas.size} onChange={e=>setCas(v=>({...v,size:Number(e.target.value)}))}>
            {[ALL.filter(q=>q.type==="case").length, 20, 15, 10, 5].filter((v,i,self)=>self.indexOf(v)===i).map(n=><option key={n} value={n}>{n}</option>)}
          </select>
          <button onClick={()=>startQuizFor("case", cas.order, cas.size)} className="px-4 py-2 rounded-xl border border-indigo-300 bg-indigo-50 text-indigo-800 text-sm flex items-center gap-2">
            <Timer className="w-4 h-4" /> Starta prov (Case)
          </button>
        </div>
      </div>

      {/* KORTFRÅGOR */}
      <div className="rounded-2xl border border-slate-200 p-5 bg-white">
        <h3 className="text-base font-semibold mb-2">Kortfrågor</h3>
        <p className="text-sm text-slate-600 mb-3">Tillgängliga: {ALL.filter(q=>q.type==="short").length}</p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm">Ordning</label>
          <select className="px-3 py-2 rounded-xl border border-slate-300 text-sm" value={sho.order} onChange={e=>setSho(v=>({...v,order:e.target.value}))}>
            <option value="random">Slumpmässig</option>
            <option value="chronological">Kronologisk</option>
          </select>
          <label className="text-sm ml-2">Antal</label>
          <select className="px-3 py-2 rounded-xl border border-slate-300 text-sm" value={sho.size} onChange={e=>setSho(v=>({...v,size:Number(e.target.value)}))}>
            {[ALL.filter(q=>q.type==="short").length, 20, 15, 10, 5].filter((v,i,self)=>self.indexOf(v)===i).map(n=><option key={n} value={n}>{n}</option>)}
          </select>
          <button onClick={()=>startQuizFor("short", sho.order, sho.size)} className="px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-sm flex items-center gap-2">
            <Timer className="w-4 h-4" /> Starta prov (Kort)
          </button>
        </div>
      </div>

      {/* RESULTAT-historik */}
      <ResultsTable results={app.results} />
    </motion.div>
  );
}

function ResultsTable({ results }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5 bg-white">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold flex items-center gap-2"><History className="w-4 h-4" /> Resultat</h3>
      </div>
      {results.length===0 ? (
        <p className="text-sm text-slate-600 mt-2">Inga slutförda prov ännu.</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50">
              <tr className="text-left">
                <th className="px-3 py-2">Datum</th>
                <th className="px-3 py-2">Typ</th>
                <th className="px-3 py-2">Antal</th>
                <th className="px-3 py-2">Besvarade</th>
                <th className="px-3 py-2">Rätt</th>
                <th className="px-3 py-2">Fel</th>
                <th className="px-3 py-2">% rätt</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const d = new Date(r.stamp);
                const dateStr = `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}`;
                return (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2 whitespace-nowrap">{dateStr}</td>
                    <td className="px-3 py-2 uppercase">{r.type}</td>
                    <td className="px-3 py-2">{r.size}</td>
                    <td className="px-3 py-2">{r.answered ?? "-"}</td>
                    <td className="px-3 py-2">{r.right ?? "-"}</td>
                    <td className="px-3 py-2">{r.wrong ?? "-"}</td>
                    <td className="px-3 py-2">{r.percent !== null && r.percent !== undefined ? `${r.percent}%` : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------- Quiz: en fråga i taget ---------- */
function QuizView({ app, setApp, gradeAll, regrade, finishAndExit }) {
  const idx = app.quiz.index;
  const total = app.quiz.ids.length;
  const qid = app.quiz.ids[idx];
  const q = qid ? ALL_BY_ID.get(qid) : null;
  const picked = q ? app.mcqAnswers[q.id] : undefined;
  const isMcq = q?.type === "mcq";
  const graded = app.quiz.graded;

  const goPrev = () => setApp(s => ({ ...s, quiz:{ ...s.quiz, index: Math.max(0, s.quiz.index-1) } }));
  const goNext = () => setApp(s => ({ ...s, quiz:{ ...s.quiz, index: Math.min(s.quiz.ids.length-1, s.quiz.index+1) } }));

  if (!q) return (
    <div className="rounded-2xl border border-slate-200 p-5 bg-white">
      <p>Inga frågor i provet.</p>
      <button onClick={()=>setApp(s=>({...s,mode:"study"}))} className="mt-3 px-3 py-2 rounded-xl border border-slate-300 text-sm">Till översikt</button>
    </div>
  );

  const isLast = idx === total-1;
  const showRattaAll = app.quiz.type==="mcq" && !graded && isLast;
  const showToSummary = (app.quiz.type==="case" || app.quiz.type==="short") && isLast;

  const showAnswer = graded && app.reveal[q.id]?.answer;
  const showReason = graded && app.reveal[q.id]?.reasoning;

  const showFinishOnReview = app.quiz.reviewingWrongOnly === true;

  const quickRegradeAndFinish = () => {
    if (app.quiz.type === "mcq") {
      const incorrect = [];
      app.quiz.ids.forEach(id => {
        const qx = ALL_BY_ID.get(id);
        const pickedX = app.mcqAnswers[id];
        if (pickedX !== qx.answerIndex) incorrect.push(id);
      });
      setApp(s => ({
        ...s,
        mode: "study",
        results: [
          { sessionId: app.quiz.sessionId, type:"mcq", size: app.quiz.ids.length, answered: app.quiz.ids.filter(id => app.mcqAnswers[id] !== undefined).length, right: app.quiz.ids.length - incorrect.length, wrong: incorrect.length, percent: Math.round(((app.quiz.ids.length - incorrect.length) / app.quiz.ids.length) * 100), stamp: new Date().toISOString() },
          ...s.results
        ],
        quiz: { ...s.quiz, ids: [], index: 0, graded: true, incorrectIds: [], reviewingWrongOnly: false }
      }));
    } else {
      setApp(s => ({
        ...s,
        mode: "study",
        results: [
          { sessionId: app.quiz.sessionId, type: app.quiz.type, size: app.quiz.ids.length, answered: app.quiz.ids.filter(id => (app.textAnswers[id] || "").trim().length > 0).length, right: null, wrong: null, percent: null, stamp: new Date().toISOString() },
          ...s.results
        ],
        quiz: { ...s.quiz, ids: [], index: 0, graded: true, incorrectIds: [], reviewingWrongOnly: false }
      }));
    }
  };

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="rounded-2xl shadow-sm border border-slate-200 p-5 bg-white">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-slate-600 flex items-center gap-3 flex-wrap">
          <span>Fråga {idx+1} / {total}</span>
          {app.quiz.reviewingWrongOnly && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-rose-50 text-rose-700 border border-rose-200">Genomgång: felaktiga svar</span>
          )}
        </div>
        <button onClick={()=>setApp(s=>({...s,mode:"study"}))} className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm">
          <Home className="inline w-4 h-4 mr-1" /> Översikt
        </button>
      </div>

      <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-white">
        <div className="text-xs text-slate-500 mb-1">{q.id} • {q.type.toUpperCase()}</div>
        <h3 className="font-medium">{q.q}</h3>

        {isMcq ? (
          <div className="mt-4 space-y-2">
            {q.options.map((opt, i) => {
              const selected = picked === i;
              return (
                <label key={i} className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer text-sm ${selected?"border-slate-300 bg-slate-50":"border-slate-200"}`}>
                  <input
                    type="radio"
                    name={q.id}
                    className="mt-1 accent-slate-800"
                    checked={selected||false}
                    onChange={()=>setApp(s=>({...s, mcqAnswers:{...s.mcqAnswers, [q.id]:i}}))}
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="mt-4">
            <label className="text-sm text-slate-700">Ditt svar</label>
            <textarea
              className="mt-1 w-full min-h-[120px] p-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Skriv ditt resonemang/svar här..."
              value={app.textAnswers[q.id] || ""}
              onChange={(e)=>setApp(s=>({...s, textAnswers:{...s.textAnswers, [q.id]: e.target.value}}))}
            />
            <p className="text-xs text-slate-500 mt-2">Facit & resonemang visas i sammanfattningen (eller direkt här vid felgenomgång).</p>
          </div>
        )}

        {/* Facit & resonemang visas efter rättning / i felgenomgång */}
        <AnimatePresence>
          {showAnswer && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
              <div className="font-medium mb-1">Facit</div>
              <div>{isMcq ? <span>Korrekt svar: <strong>{q.options[q.answerIndex]}</strong></span> : <span>{q.answer}</span>}</div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showReason && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-sm">
              <div className="font-medium mb-1">Resonemang (med källhänvisning)</div>
              <div className="text-slate-700 whitespace-pre-wrap">{q.reasoning}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigering – Föregående vänster, Nästa höger, Rätta allt/Slutför endast sista */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <button onClick={goPrev} disabled={idx===0} className="justify-self-start px-4 py-2 rounded-xl border border-slate-300 text-sm disabled:opacity-50">
          <ArrowLeft className="inline w-4 h-4 mr-1" /> Föregående
        </button>

        <div className="justify-self-center self-center text-xs text-slate-500 text-center px-2">
          {app.quiz.type==="mcq" && !app.quiz.graded ? "Rätta allt finns på sista frågan" : app.quiz.reviewingWrongOnly ? "Felgenomgång" : ""}
        </div>

        {showRattaAll ? (
          <button onClick={gradeAll} className="justify-self-end px-4 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-sm">
            Rätta allt
          </button>
        ) : showToSummary ? (
          <button onClick={gradeAll} className="justify-self-end px-4 py-2 rounded-xl border border-indigo-300 bg-indigo-50 text-indigo-800 text-sm">
            Till sammanfattning
          </button>
        ) : (
          <button onClick={goNext} disabled={idx===total-1} className="justify-self-end px-4 py-2 rounded-xl border border-slate-300 text-sm disabled:opacity-50">
            Nästa <ArrowRight className="inline w-4 h-4 ml-1" />
          </button>
        )}
      </div>

      {/* Extra handlingsknapp vid felgenomgång */}
      {showFinishOnReview && (
        <div className="mt-3">
          <button
            onClick={quickRegradeAndFinish}
            className="px-4 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-sm"
            title="Räkna om och avsluta provet"
          >
            Rätta och avsluta prov
          </button>
        </div>
      )}
    </motion.div>
  );
}

/* ---------- Sammanfattning ---------- */
function Summary({ app, setApp, jumpToQuestion, regrade, reviewWrong, finishAndExit }) {
  const total = app.quiz.ids.length;
  const wrong = app.quiz.incorrectIds.length;
  const right = total - wrong;

  // Öppna facit & resonemang automatiskt för Case/Kort
  useEffect(()=>{
    const rev = { ...app.reveal };
    app.quiz.ids.forEach(id => {
      const q = ALL_BY_ID.get(id);
      if (q.type!=="mcq") rev[id] = { answer:true, reasoning:true };
    });
    setApp(s => ({ ...s, reveal: rev }));
    // eslint-disable-next-line
  }, []);

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="rounded-2xl shadow-sm border border-slate-200 p-5 bg-white">
      <h2 className="text-xl font-semibold mb-1">Sammanfattning</h2>

      {/* Resultatrad */}
      {app.quiz.type==="mcq" ? (
        <p className="text-slate-700 mb-4">{right} rätt • {wrong} fel av {total} frågor</p>
      ) : (
        <p className="text-slate-700 mb-4">Provtyp: {app.quiz.type.toUpperCase()}. Jämför dina svar med facit & resonemang nedan.</p>
      )}

      {/* Fel-lista (klickbar) + tydlig rubrik */}
      {app.quiz.type==="mcq" && (
        <>
          <div className="text-sm font-semibold mb-2 flex items-center gap-2">
            <ListX className="w-4 h-4 text-rose-700" />
            Felaktiga svar – klicka för genomgång
          </div>
          {wrong === 0 ? (
            <p className="text-sm text-emerald-700 mb-4">Inga fel – snyggt jobbat!</p>
          ) : (
            <ol className="list-decimal ml-6 space-y-1 mb-3">
              {app.quiz.incorrectIds.map(id => (
                <li key={id} className="text-sm">
                  <button
                    onClick={()=>jumpToQuestion(id)}
                    className="underline underline-offset-2 text-rose-700 hover:text-rose-900"
                    title="Öppna denna felaktiga fråga"
                  >
                    {id}
                  </button>
                </li>
              ))}
            </ol>
          )}
          {wrong > 0 && (
            <div className="mb-5">
              <button
                onClick={reviewWrong}
                className="px-4 py-2 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 text-sm"
              >
                Gå igenom felaktiga svar
              </button>
            </div>
          )}
        </>
      )}

      {/* Genomgång: alla frågor – visar ”Ditt svar” + Facit + Resonemang */}
      <div className="mt-2 space-y-4">
        {app.quiz.ids.map((id, i) => {
          const q = ALL_BY_ID.get(id);
          const isMcq = q.type === "mcq";
          const picked = app.mcqAnswers[id];
          const userText = app.textAnswers[id] || "";
          const wrongSel = isMcq && app.quiz.graded && picked !== q.answerIndex;

          return (
            <div key={id} className={`rounded-xl border p-4 ${wrongSel ? "border-rose-300 bg-rose-50/40" : "border-slate-200 bg-white"}`}>
              <div className="text-xs text-slate-500 mb-1">{q.id} • {q.type.toUpperCase()}</div>
              <div className="font-medium">{i+1}. {q.q}</div>

              {/* Ditt svar */}
              <div className="mt-2 text-sm">
                <div className="font-medium">Ditt svar</div>
                {isMcq ? (
                  <div>{picked !== undefined ? q.options[picked] : <em className="text-slate-500">Inget val</em>}</div>
                ) : (
                  <div className="whitespace-pre-wrap">{userText.trim() ? userText : <em className="text-slate-500">Inget svar</em>}</div>
                )}
              </div>

              {/* Facit & Resonemang */}
              <div className="mt-3 grid gap-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                  <div className="font-medium">Facit</div>
                  {isMcq ? (
                    <div>Korrekt svar: <strong>{q.options[q.answerIndex]}</strong></div>
                  ) : (
                    <div className="whitespace-pre-wrap">{q.answer}</div>
                  )}
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                  <div className="font-medium">Resonemang (med källhänvisning)</div>
                  <div className="text-slate-700 whitespace-pre-wrap">{q.reasoning}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Åtgärds-knappar */}
      <div className="mt-5 flex items-center gap-2 flex-wrap">
        {app.quiz.type==="mcq" && (
          <button
            onClick={regrade}
            className="px-4 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-sm"
            title="Räkna om efter att du ändrat svar"
          >
            Rätta igen
          </button>
        )}
        <button
          onClick={finishAndExit}
          className="px-4 py-2 rounded-xl border border-slate-300 text-sm"
          title="Avsluta och gå till översikt"
        >
          Rätta och avsluta prov
        </button>
        <button
          onClick={()=>setApp(s=>({...s,mode:"study"}))}
          className="px-4 py-2 rounded-xl border border-slate-300 text-sm"
        >
          Till översikt
        </button>
      </div>
    </motion.div>
  );
}
