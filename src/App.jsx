import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Search, Shuffle, Info, BookOpen } from "lucide-react";

/**
 * KA Frågebank – Facit & Resonemang
 * - Tre lägen per fråga: Fråga → Facit → Resonemang
 * - Filter, slumpning, progress sparas i localStorage
 */

const STORAGE_KEY = "ka-qa-bank-v1";

const QUESTION_BANK = [
  // Vecka 1 — PBL-grunder
  {
    id: "w1",
    title: "Vecka 1 – PBL-grunder",
    questions: [
      {
        id: "w1q1",
        type: "mcq",
        q: "Vilken lag styr bygglovsprocessen i Sverige?",
        options: ["Miljöbalken", "Plan- och bygglagen (PBL)", "Jordabalken", "Fastighetsbildningslagen"],
        answerIndex: 1,
        reasoning:
          "PBL sätter ramarna för planläggning/bygglov/tillsyn. Andra lagar kan beröra bygg men bygglovsprocessen ligger i PBL."
      },
      {
        id: "w1q2",
        type: "mcq",
        q: "Vilket PBL-kapitel behandlar bygglov och andra lov?",
        options: ["Kap 3", "Kap 5", "Kap 9", "Kap 11"],
        answerIndex: 2,
        reasoning:
          "PBL 9 kap. tar upp bygglov, rivningslov och marklov. Kap. 10 rör bl.a. kontroll/KA, kap. 11 tillsyn/ingripanden."
      },
      {
        id: "w1q3",
        type: "mcq",
        q: "Vem har huvudansvaret för att kontrollplanen tas fram och följs?",
        options: ["Byggnadsnämnden", "Byggherren", "Kontrollansvarig", "Entreprenören"],
        answerIndex: 1,
        reasoning:
          "Byggherren ansvarar för att kraven i lag/beslut följs. KA stödjer med förslag till kontrollplan och uppföljning."
      },
      {
        id: "w1q4",
        type: "mcq",
        q: "När krävs normalt en kontrollansvarig (KA)?",
        options: [
          "Vid alla åtgärder utan undantag",
          "Vid de flesta lov-/anmälanspliktiga åtgärder utom enkla ärenden",
          "Endast vid rivning",
          "Endast vid statliga projekt"
        ],
        answerIndex: 1,
        reasoning:
          "KA krävs vid flertalet åtgärder som inte är små/enkla. Nämnden kan besluta att KA inte behövs i enklare ärenden."
      },
      {
        id: "w1q5",
        type: "short",
        q: "Förklara kort skillnaden mellan bygglov och startbesked.",
        answer:
          "Bygglov = juridiskt tillstånd att genomföra åtgärden. Startbesked = klartecken efter tekniskt samråd att börja bygga.",
        reasoning:
          "Ordningen säkrar att tekniska förutsättningar/kontrollplan är på plats före byggstart."
      },
      {
        id: "w1q6",
        type: "short",
        q: "Ge två exempel på när KA normalt inte krävs.",
        answer: "Mindre inre ändringar i en-/tvåbostadshus; enkla ärenden där nämnden beslutat att KA inte behövs.",
        reasoning: "Låg risk/komplexitet → byggherren klarar uppföljning utan KA."
      },
      {
        id: "w1q7",
        type: "case",
        q: "Villaägare uppför fristående garage. Behövs KA? Motivera.",
        answer:
          "Ofta ja – ny byggnad med bärförmåga/brand/fukt. Undantag kan finnas för små komplementbyggnader om ärendet bedöms enkelt.",
        reasoning:
          "Risken gör att KA normalt behövs. Bedömning utifrån omfattning och riskprofil."
      },
      {
        id: "w1q8",
        type: "case",
        q: "Bygglov finns för tillbyggnad. Vad återstår innan byggstart och varför?",
        answer:
          "Tekniskt samråd och startbesked. Samrådet säkrar handlingar/kontrollplan; startbesked behövs för att lagligt få börja.",
        reasoning:
          "Lov → samråd → startbesked skapar kontroll innan byggstart."
      },
      // Extra (från dina 20 tillägg)
      {
        id: "w1q9",
        type: "mcq",
        q: "Vilken instans ansvarar för tillsyn enligt PBL?",
        options: ["Byggherren", "Byggnadsnämnden", "Länsstyrelsen", "Kontrollansvarig"],
        answerIndex: 1,
        reasoning: "Byggnadsnämnden är tillsynsmyndighet och kan ingripa."
      },
      {
        id: "w1q10",
        type: "short",
        q: "Vad reglerar PBL kapitel 8?",
        answer: "Tekniska egenskapskrav på byggnadsverk.",
        reasoning: "Krav på bärförmåga, brandskydd, energi, hygien, säkerhet m.m."
      },
      {
        id: "w1q11",
        type: "case",
        q: "Byggherren vill bygga till utan bygglov. Hur agerar du som KA?",
        answer: "Informera att bygglov krävs enligt PBL 9 kap; annars olovligt. Rekommendera korrekt ansökan.",
        reasoning: "KA värnar lagkrav. Olovligt byggande kan ge byggsanktionsavgift."
      }
    ]
  },

  // Vecka 2 — PBF & Byggprocessen
  {
    id: "w2",
    title: "Vecka 2 – PBF & byggprocessen",
    questions: [
      {
        id: "w2q1",
        type: "mcq",
        q: "När i processen hålls tekniskt samråd?",
        options: ["Före bygglov", "Efter bygglov men före startbesked", "Efter slutsamråd", "Efter slutbesked"],
        answerIndex: 1,
        reasoning: "Samråd efter lov, innan startbesked. Går igenom kontrollplan och tekniska handlingar."
      },
      {
        id: "w2q2",
        type: "mcq",
        q: "Vilket beslut krävs för att byggnation lagligen får påbörjas?",
        options: ["Bygglov", "Delegationsbeslut", "Startbesked", "Detaljplan"],
        answerIndex: 2,
        reasoning: "Startbesked är formellt klartecken efter bedömning av tekniska förutsättningar."
      },
      {
        id: "w2q3",
        type: "mcq",
        q: "Vad är syftet med slutsamrådet?",
        options: [
          "Planera bygglovsprövningen",
          "Följa upp kontrollplan och underlag inför slutbesked",
          "Besluta om entreprenadform",
          "Fastställa budget"
        ],
        answerIndex: 1,
        reasoning: "Slutsamråd är uppföljning inför slutbesked."
      },
      {
        id: "w2q4",
        type: "mcq",
        q: "Vilket är sista formella steget innan byggnaden får tas i bruk?",
        options: ["Tekniskt samråd", "Startbesked", "Slutsamråd", "Slutbesked"],
        answerIndex: 3,
        reasoning: "Slutbesked = beslut att åtgärden får tas i bruk."
      },
      {
        id: "w2q5",
        type: "short",
        q: "Nämn tre handlingar som brukar krävas till tekniskt samråd.",
        answer: "Förslag till kontrollplan, konstruktionsritningar/beräkningar, brandskyddsbeskrivning, energiberäkningar (ange tre).",
        reasoning: "Visar hur krav uppfylls och hur kontroller planeras."
      },
      {
        id: "w2q6",
        type: "short",
        q: "Vad dokumenteras normalt i en kontrollplan?",
        answer: "Vad som ska kontrolleras, mot vad, av vem, hur och hur det dokumenteras.",
        reasoning: "Kontrollplanen möjliggör spårbar uppföljning."
      },
      {
        id: "w2q7",
        type: "case",
        q: "Du är KA för en tillbyggnad. Vilka riskmoment prioriterar du och varför?",
        answer:
          "Bärande konstruktioner, fuktsäkerhet, brandskydd, energikrav – hög påverkan på säkerhet/kvalitet; svåra att rätta i efterhand.",
        reasoning: "Riskbaserad kontroll ger störst verkan."
      },
      {
        id: "w2q8",
        type: "case",
        q: "Byggherren vill starta direkt efter bygglov. Vad svarar du?",
        answer: "Inte tillåtet utan startbesked. Först samråd, fastställa kontrollplan, få startbesked.",
        reasoning: "Lagkrav."
      },
      // Extra (från tilläggen)
      {
        id: "w2q9",
        type: "mcq",
        q: "Vad reglerar PBF i första hand?",
        options: ["Detaljkrav på material", "Komplettering av PBL och tillämpning", "EU:s byggproduktförordning", "Arbetsmiljö"],
        answerIndex: 1,
        reasoning: "PBF kompletterar PBL med detaljer om process och tillämpning."
      },
      {
        id: "w2q10",
        type: "short",
        q: "Vilka möten är KA skyldig att delta i?",
        answer: "Tekniskt samråd, arbetsplatsbesök, slutsamråd.",
        reasoning: "Centralt i KA:s uppdrag enligt PBF."
      },
      {
        id: "w2q11",
        type: "case",
        q: "Byggherren vill hoppa över slutsamrådet. Vad säger du?",
        answer: "Slutsamråd hålls när tekniskt samråd förekommit; krävs för slutbesked.",
        reasoning: "Nämnden behöver KA:s utlåtande/underlag för beslut."
      }
    ]
  },

  // Vecka 3 — BBR
  {
    id: "w3",
    title: "Vecka 3 – Boverkets byggregler (BBR)",
    questions: [
      {
        id: "w3q1",
        type: "mcq",
        q: "Vilken karaktär har kraven i BBR?",
        options: ["Detaljerade materialkrav", "Funktionskrav", "Arbetsmiljökrav", "Planbestämmelser"],
        answerIndex: 1,
        reasoning:
          "BBR anger funktionskrav. Uppfyllnad kan ske via allmänt råd eller verifierade alternativa lösningar."
      },
      {
        id: "w3q2",
        type: "mcq",
        q: "Vilket område omfattas av BBR?",
        options: ["Endast brandskydd", "Endast energi", "Endast tillgänglighet", "Brandskydd, energi, tillgänglighet m.fl."],
        answerIndex: 3,
        reasoning: "BBR omfattar bl.a. brand, energi, hygien, buller och tillgänglighet."
      },
      {
        id: "w3q3",
        type: "mcq",
        q: "Vad innebär tillgänglighetskraven i BBR i bostäder?",
        options: ["Endast hisskrav", "Användbarhet för personer med nedsatt rörelse/Orienterbarhet", "Inga krav för småhus", "Bara mått på dörrar"],
        answerIndex: 1,
        reasoning: "Tillgänglighet är bredare än mått: vändytor, ramper, kontraster, orienterbarhet m.m."
      },
      {
        id: "w3q4",
        type: "mcq",
        q: "Hur hanteras buller i BBR?",
        options: ["Inga krav", "Endast råd", "Funktionskrav på högsta ljudnivåer m.m.", "Endast kommunala riktlinjer"],
        answerIndex: 2,
        reasoning: "BBR ställer funktionskrav på ljudklassning och högsta ljudnivåer."
      },
      {
        id: "w3q5",
        type: "short",
        q: "Ge två exempel på energiverifiering enligt BBR.",
        answer: "Primärenergital, U-värden/klimatskärm, täthetsprovning (ange två).",
        reasoning: "Beräkning + mätning/tryckprovning verifierar energi."
      },
      {
        id: "w3q6",
        type: "short",
        q: "Nämn tre brandskyddsåtgärder som ofta kontrolleras.",
        answer: "Brandcellsindelning, genomföringstätningar, utrymningsvägar/skyltning, dörrklassning (ange tre).",
        reasoning: "Begränsa spridning, säker utrymning, bärförmåga under brand."
      },
      {
        id: "w3q7",
        type: "case",
        q: "Nybyggd förskola har hög ljudnivå. Vilka BBR-aspekter utreder du?",
        answer:
          "Ljudklassning, installationers ljud, efterklang/akustik, byggskedets otätheter.",
        reasoning: "BBR ställer funktionskrav på ljudmiljö; verifiering mot projekterade krav."
      },
      {
        id: "w3q8",
        type: "case",
        q: "I ombyggnad blir badrum små. Hur tolkar du tillgänglighetskraven?",
        answer:
          "Rimlighetsbedömning: eftersträva användbarhet; dokumentera skäl för lättnader/alternativa lösningar.",
        reasoning: "I ombyggnad medges avsteg där full uppfyllelse är orimlig."
      },
      // Extra
      {
        id: "w3q9",
        type: "mcq",
        q: "BBR kapitel 5 reglerar främst…",
        options: ["Tillgänglighet", "Brandskydd", "Energihushållning", "Hygien, hälsa och miljö"],
        answerIndex: 1,
        reasoning: "Kap. 5 = brand."
      },
      {
        id: "w3q10",
        type: "mcq",
        q: "BBR kapitel 9 reglerar…",
        options: ["Tillgänglighet", "Buller", "Energi", "Väderskydd"],
        answerIndex: 2,
        reasoning: "Kap. 9 = energi."
      },
      {
        id: "w3q11",
        type: "short",
        q: "Vad är ett ‘allmänt råd’ i BBR?",
        answer: "En rekommenderad lösning; föreskriften är bindande men rådet vägleder.",
        reasoning: "Alternativa lösningar möjliga om funktionen visas."
      },
      {
        id: "w3q12",
        type: "case",
        q: "Byggherre vill ta bort vilplan i trappa. Hur resonerar du?",
        answer: "Avråder; strider mot tillgänglighet/användbarhet enligt BBR.",
        reasoning: "Vilplan behövs för säker och användbar förflyttning."
      }
    ]
  },

  // Vecka 4 — EKS & Tekniska regler
  {
    id: "w4",
    title: "Vecka 4 – EKS & tekniska regler",
    questions: [
      {
        id: "w4q1",
        type: "mcq",
        q: "Vad är EKS?",
        options: ["Europeiska konstruktionsstandarder", "Boverkets konstruktionsregler", "Planbestämmelser", "Anvisningar för buller"],
        answerIndex: 1,
        reasoning: "EKS anger hur Eurokoder tillämpas i Sverige."
      },
      {
        id: "w4q2",
        type: "mcq",
        q: "Vad bygger EKS främst på?",
        options: ["Nationella standarder", "Eurokoder", "Miljöbalken", "CE-märkning"],
        answerIndex: 1,
        reasoning: "Eurokoder + nationella val i EKS."
      },
      {
        id: "w4q3",
        type: "mcq",
        q: "Varför är CE-märkning relevant i byggprojekt?",
        options: ["Påverkar endast garanti", "Visar överensstämmelse med harmoniserade standarder", "Gäller bara möbler", "Ersätter kontrollplan"],
        answerIndex: 1,
        reasoning: "CE visar uppfyllelse av harmoniserade standarder och möjliggör verifiering."
      },
      {
        id: "w4q4",
        type: "mcq",
        q: "Vilket påstående stämmer om relationen BBR/EKS?",
        options: [
          "BBR detaljstyr konstruktioner, EKS anger funktionskrav",
          "BBR ställer funktionskrav; EKS anger tekniska lösningar/beräkningsregler",
          "EKS gäller bara inredning",
          "De överlappar inte alls"
        ],
        answerIndex: 1,
        reasoning: "BBR = funktion; EKS/Eurokoder = dimensionering/utförande."
      },
      {
        id: "w4q5",
        type: "short",
        q: "Ge två exempel på verifiering av bärförmåga/stabilitet.",
        answer: "Eurokod-beräkningar, konstruktionsritningar, kontrollintyg (ange två).",
        reasoning: "Visar uppfyllelse av bärförmåga/stadga."
      },
      {
        id: "w4q6",
        type: "short",
        q: "När kan tredjepartskontroll vara motiverad?",
        answer: "Vid komplicerade/riskfyllda konstruktioner eller otillräcklig egenkontroll.",
        reasoning: "Oberoende granskning minskar risk."
      },
      {
        id: "w4q7",
        type: "case",
        q: "Hallbyggnad i stål ska uppföras. Vilka EKS-kontroller prioriterar du?",
        answer:
          "Dimensionering (laster/tvärsnitt), utförandeklass, svets/bult, montagetoleranser, CE på bärande komponenter.",
        reasoning: "Fel i förband/toleranser kan ge stabilitetsproblem."
      },
      {
        id: "w4q8",
        type: "case",
        q: "Ny byggprodukt utan CE-märkning ska användas. Vad gör du?",
        answer:
          "Begär dokumentation; finns harmoniserad standard → CE krävs. Annars accepteras inte produkten. Dokumentera avvikelse.",
        reasoning: "Spårbar verifiering är central."
      },
      // Extra
      {
        id: "w4q9",
        type: "mcq",
        q: "Vilket av följande är en Eurokod?",
        options: ["EN 1991 – Laster", "EN 1992 – Betong", "EN 1993 – Stål", "Alla ovan"],
        answerIndex: 3,
        reasoning: "Samtliga är Eurokoder."
      },
      {
        id: "w4q10",
        type: "short",
        q: "Vad är en nationell bilaga i Eurokoderna?",
        answer: "Sveriges egna tillämpningsval av parametrar.",
        reasoning: "Kompletterar EU-standarden med nationella värden."
      }
    ]
  },

  // Vecka 5 — Kontrollplan & KA:s arbete
  {
    id: "w5",
    title: "Vecka 5 – Kontrollplan & KA:s arbete",
    questions: [
      {
        id: "w5q1",
        type: "mcq",
        q: "Vem tar normalt fram förslag till kontrollplan?",
        options: ["Byggnadsnämnden", "Byggherren", "KA", "Entreprenören"],
        answerIndex: 2,
        reasoning: "Byggherren ansvarar – KA tar normalt fram förslag och följer upp."
      },
      {
        id: "w5q2",
        type: "mcq",
        q: "Vad ska alltid framgå av en kontrollplan?",
        options: ["Vilka kontroller", "Vem utför", "Mot vad/hur dokumenteras", "Allt ovan"],
        answerIndex: 3,
        reasoning: "Planen måste vara spårbar och möjlig att följa upp."
      },
      {
        id: "w5q3",
        type: "mcq",
        q: "Vilket beskriver bäst KA:s roll vid slutsamråd?",
        options: [
          "Beslutar om slutbesked",
          "Redovisar hur kontrollplanen följts och lämnar utlåtande",
          "Fastställer entreprenadens slutkostnad",
          "Genomför egen slutbesiktning"
        ],
        answerIndex: 1,
        reasoning: "Nämnden beslutar om slutbesked. KA:s utlåtande är underlag."
      },
      {
        id: "w5q4",
        type: "short",
        q: "Nämn tre riskmoment i kontrollplan för småhus.",
        answer: "Bärande konstruktioner, brandskydd, fuktsäkerhet/tätskikt, energi/ventilation (ange tre).",
        reasoning: "Hög påverkan på säkerhet/hälsa/funktion."
      },
      {
        id: "w5q5",
        type: "case",
        q: "Branddörrar utan intyg är monterade. Hur hanterar du?",
        answer:
          "Stoppa vidare montage, begär prestandadeklaration/klassningsintyg, verifiera märkning, dokumentera avvikelse och åtgärd.",
        reasoning: "Utan verifiering uppfylls inte BBR:s brandkrav."
      },
      {
        id: "w5q6",
        type: "case",
        q: "Entreprenören vill byta material till ‘likvärdigt’. Vad kräver du?",
        answer:
          "Underlag som visar likvärdig prestanda (CE/DoP/provningar). Godkännande av projekterande och dokumenterad ändring.",
        reasoning: "Likvärdighet måste vara verifierbar för att funktionskrav ska uppfyllas."
      }
    ]
  },

  // Vecka 6 — Provträning (blandade)
  {
    id: "w6",
    title: "Vecka 6 – Provträning (blandade frågor)",
    questions: [
      {
        id: "w6q1",
        type: "mcq",
        q: "Vilket underlag behöver nämnden för slutbesked?",
        options: ["Bygglovsritningar", "KA:s utlåtande + verifierad dokumentation", "Entreprenadkontrakt", "Nytt startbesked"],
        answerIndex: 1,
        reasoning: "Slutbesked grundas på uppfyllda krav och KA:s utlåtande."
      },
      {
        id: "w6q2",
        type: "mcq",
        q: "Vad är en vanlig orsak till fördröjt slutbesked?",
        options: ["För många kontroller i kontrollplanen", "Bristande dokumentation", "För lågt energiprestanda", "För få möten med KA"],
        answerIndex: 1,
        reasoning: "Ofullständigt underlag är typisk flaskhals – planera insamling löpande."
      },
      {
        id: "w6q3",
        type: "short",
        q: "Två sätt att effektivisera provförberedelser?",
        answer: "Träna uppslag i PBL/BBR/EKS; öva fallstudier med motiveringar; egna register/post-its.",
        reasoning: "Provtiden är begränsad; struktur + snabb uppslagning ger poäng."
      },
      {
        id: "w6q4",
        type: "short",
        q: "Vilka tre delar bör alltid finnas i ett resonemangssvar?",
        answer: "(1) Relevant lagrum/regel, (2) Tillämpning på fallet, (3) Slutsats/åtgärd.",
        reasoning: "Visar behärskning av regelverket + praktisk tillämpning."
      },
      {
        id: "w6q5",
        type: "case",
        q: "Fukt i bjälklag under byggtid – hur speglas i kontrollplan och uppföljning?",
        answer:
          "Väderskydd/sekvensplan, mät fukt före inbyggnad, dokumentera mätning, åtgärdsplan vid överskridna gränser.",
        reasoning:
          "Fuktsäkerhet kräver spårbar mätning innan inbyggnad för långsiktig funktion."
      },
      {
        id: "w6q6",
        type: "case",
        q: "Ombyggnad med trång planlösning – tillgänglighetsanpassning möjligt?",
        answer:
          "Ombyggnad medger rimlighetsavvägning. Eftersträva funktionell användbarhet, dokumentera skäl till lättnader och alternativa lösningar.",
        reasoning:
          "BBR tillåter avsteg där full uppfyllelse är orimlig – men kraven ska optimeras inom förutsättningarna."
      }
    ]
  }
];

function useStoredState(defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultValue;
      const parsed = JSON.parse(raw);
      return { ...defaultValue, ...parsed };
    } catch {
      return defaultValue;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);
  return [state, setState];
}

export default function App() {
  const [app, setApp] = useStoredState({
    completed: {},
    mcqAnswers: {},
    reveal: {},
    filters: { week: "all", type: "all", query: "", onlyPending: false },
  });

  const flat = useMemo(() => {
    const a = [];
    QUESTION_BANK.forEach(w => w.questions.forEach(q => a.push({ ...q, weekId: w.id, weekTitle: w.title })));
    return a;
  }, []);

  const filtered = useMemo(() => {
    const { week, type, query, onlyPending } = app.filters;
    const q = query.trim().toLowerCase();
    return flat.filter(it => {
      if (week !== "all" && it.weekId !== week) return false;
      if (type !== "all" && it.type !== type) return false;
      if (onlyPending && app.completed[it.id]) return false;
      if (!q) return true;
      const hay = [it.q, it?.options?.join(" "), it?.answer, it?.reasoning, it.weekTitle]
        .filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [app.filters, flat, app.completed]);

  const overall = useMemo(() => {
    const total = flat.length;
    const done = flat.filter(q => app.completed[q.id]).length;
    return { total, done, pct: total ? Math.round(done / total * 100) : 0 };
  }, [flat, app.completed]);

  const [shuffled, setShuffled] = useState([]);
  useEffect(() => {
    const arr = [...filtered];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr);
  }, [filtered]);

  const setFilter = (k, v) => setApp(s => ({ ...s, filters: { ...s.filters, [k]: v } }));
  const answerMcq = (id, idx) => setApp(s => ({ ...s, mcqAnswers: { ...s.mcqAnswers, [id]: idx } }));
  const toggleReveal = (id, key) =>
    setApp(s => ({ ...s, reveal: { ...s.reveal, [id]: { ...(s.reveal[id] || {}), [key]: !(s.reveal[id]?.[key]) } } }));
  const markDone = (id, val = true) => setApp(s => ({ ...s, completed: { ...s.completed, [id]: val } }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <BookOpen className="w-7 h-7" />
          <h1 className="text-2xl font-semibold">KA Frågebank – Facit & Resonemang</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="mb-6">
          <div className="rounded-2xl shadow-sm border border-slate-200 p-5 bg-white">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">Översikt</h2>
                <p className="text-sm text-slate-600">Klart: {overall.done} / {overall.total} ({overall.pct}%)</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative w-56">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                    placeholder="Sök i frågor, svar, resonemang..."
                    value={app.filters.query}
                    onChange={e=>setFilter("query", e.target.value)}
                  />
                </div>
                <select className="px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        value={app.filters.week} onChange={e=>setFilter("week", e.target.value)}>
                  <option value="all">Alla veckor</option>
                  {QUESTION_BANK.map(w => <option key={w.id} value={w.id}>{w.title}</option>)}
                </select>
                <select className="px-3 py-2 rounded-xl border border-slate-300 text-sm"
                        value={app.filters.type} onChange={e=>setFilter("type", e.target.value)}>
                  <option value="all">Alla typer</option>
                  <option value="mcq">Flervalsfrågor</option>
                  <option value="short">Kortfrågor</option>
                  <option value="case">Fallstudier</option>
                </select>
                <button
                  onClick={()=>{
                    const arr=[...filtered];
                    for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}
                    setShuffled(arr);
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-sm flex items-center gap-1">
                  <Shuffle className="w-4 h-4" /> Slumpa
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {shuffled.map(q => (
            <QuestionCard key={q.id} q={q}
              picked={app.mcqAnswers[q.id]}
              reveal={app.reveal[q.id] || {answer:false, reasoning:false}}
              done={!!app.completed[q.id]}
              onPick={idx=>answerMcq(q.id, idx)}
              onReveal={key=>toggleReveal(q.id, key)}
              onDone={val=>markDone(q.id, val)}
            />
          ))}
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-10 text-center text-xs text-slate-500">
        <p>All progress sparas lokalt i denna webbläsare. Publicera på Netlify/Vercel för att dela med vänner.</p>
      </footer>
    </div>
  );
}

function QuestionCard({ q, picked, reveal, done, onPick, onReveal, onDone }) {
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
      className={`rounded-2xl border p-5 bg-white shadow-sm ${done ? "border-emerald-300" : "border-slate-200"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-slate-500 mb-1">{q.type.toUpperCase()} • {q.weekTitle}</div>
          <h3 className="font-medium">{q.q}</h3>
        </div>
        {done ? <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-1" /> : <Circle className="w-6 h-6 text-slate-300 mt-1" />}
      </div>

      {q.type === "mcq" && (
        <div className="mt-3 space-y-2">
          {q.options.map((opt, idx) => {
            const selected = picked === idx;
            const correct = reveal.answer && q.answerIndex === idx;
            const wrongSel = reveal.answer && selected && idx !== q.answerIndex;
            return (
              <label key={idx}
                className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                  correct ? "border-emerald-300 bg-emerald-50" :
                  wrongSel ? "border-rose-300 bg-rose-50" :
                  selected ? "border-slate-300 bg-slate-50" : "border-slate-200"}`}>
                <input type="radio" name={q.id} checked={selected} onChange={()=>onPick(idx)} className="mt-1 accent-slate-800" />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>
      )}

      {q.type !== "mcq" && (
        <div className="mt-3 text-sm text-slate-600"><em>Svara själv – visa sedan facit och resonemang.</em></div>
      )}

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <button onClick={()=>onReveal("answer")} className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm">
          {reveal.answer ? "Dölj facit" : "Visa facit"}
        </button>
        <button onClick={()=>onReveal("reasoning")} className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm">
          {reveal.reasoning ? "Dölj resonemang" : "Visa resonemang"}
        </button>
        <button onClick={()=>onDone(!done)} className={`px-3 py-1.5 rounded-lg border text-sm ${done?"border-emerald-300 bg-emerald-50":"border-slate-300 hover:bg-slate-50"}`}>
          {done ? "Markera som ej klar" : "Markera som klar"}
        </button>
      </div>

      <AnimatePresence>
        {reveal.answer && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
            className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <div className="font-medium mb-1">Facit</div>
            <div>{q.type === "mcq" ? <span>Korrekt svar: <strong>{q.options[q.answerIndex]}</strong></span> : <span>{q.answer}</span>}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reveal.reasoning && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
            className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-sm">
            <div className="font-medium mb-1">Resonemang</div>
            <div className="text-slate-700">{q.reasoning}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
