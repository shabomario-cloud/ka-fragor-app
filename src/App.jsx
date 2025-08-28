import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Home, Timer, ArrowLeft, ArrowRight, ListX, History, RefreshCcw } from "lucide-react";

const STORAGE_KEY = "ka-qa-bank-v5";

/** ------------------------------------
 *  Frågebank (40 frågor, numrerade)
 *  ------------------------------------ */
const BANK = [
  {
    id: "grp-pbl",
    title: "PBL – Plan- och bygglagen",
    questions: [
      { id:"Q1", type:"mcq", q:"Vilken instans ansvarar för tillsyn enligt PBL?", options:["Byggherren","Byggnadsnämnden","Länsstyrelsen","Kontrollansvarig"], answerIndex:1, reasoning:"Kommunens byggnadsnämnd utövar tillsyn (PBL 11 kap. 5 §). Byggherren ansvarar för efterlevnad men är inte myndighet. Källa: PBL 11 kap. 5 §." },
      { id:"Q2", type:"mcq", q:"Vad reglerar PBL kapitel 8 främst?", options:["Detaljplaner","Tekniska egenskapskrav","Fastighetsbildning","Upphandling"], answerIndex:1, reasoning:"PBL 8 kap. 4–6 §§: bärförmåga, brandskydd, hygien, energi, buller, tillgänglighet m.m. Källa: PBL 8 kap." },
      { id:"Q3", type:"mcq", q:"Vilket krävs för att åtgärden ska få påbörjas?", options:["Bygglov","Startbesked","Slutbesked","Planprogram"], answerIndex:1, reasoning:"Startbesked krävs för att påbörja (PBL 10 kap. 3 §). Bygglov rör lovprövningen (9 kap.). Källa: PBL 10:3." },
      { id:"Q4", type:"mcq", q:"Vilket krävs för att ta en byggnad i bruk?", options:["Startbesked","Slutbesked","Kontrollplan","Arbetsmiljöplan"], answerIndex:1, reasoning:"Slutbesked behövs innan brukande (PBL 10 kap. 34 §). Källa: PBL 10:34." },
      { id:"Q5", type:"mcq", q:"Vem ansvarar för att det finns en kontrollplan?", options:["Byggnadsnämnden","Byggherren","KA","Entreprenören"], answerIndex:1, reasoning:"Byggherren ansvarar (PBL 10 kap. 6 §). KA bistår men övertar inte ansvaret. Källa: PBL 10:6." },
      { id:"Q6", type:"mcq", q:"När hålls tekniskt samråd?", options:["Före bygglov","Efter bygglov men före startbesked","Efter slutsamråd","Efter slutbesked"], answerIndex:1, reasoning:"Tekniskt samråd enligt PBL 10 kap. 14–16 §§. Källa: PBL 10:14–16." },
      { id:"Q7", type:"mcq", q:"Vilket av följande kräver bygglov enligt PBL 9 kap.?", options:["Friggebod 15 kvm","Tillbyggnad av bostad","Vindsisolering","Byte av köksluckor"], answerIndex:1, reasoning:"Tillbyggnad är lovpliktig (PBL 9 kap. 2 §). Källa: PBL 9:2." },
      { id:"Q8", type:"short", q:"Vad är rivningslov?", answer:"Tillstånd att riva en byggnad (PBL 9 kap. 10–13 §§).", reasoning:"Krävs normalt inom detaljplan; syftar till att skydda stads- och kulturmiljö. Källa: PBL 9:10–13." },
      { id:"Q9", type:"case", q:"Byggherre startar utan startbesked. Hur agerar KA?", answer:"Påpeka olaglig byggstart, dokumentera, underrätta nämnden vid allvarlig avvikelse.", reasoning:"Byggstart före startbesked är förbjudet (PBL 10 kap. 3 §); sanktionsavgifter kan följa (11 kap. 51 §). Källor: PBL 10:3, 11:51." },
      { id:"Q10", type:"mcq", q:"Vad prövas primärt i bygglovet?", options:["Tekniska lösningar","Plan- och lovplikt","Energiprestanda","Entreprenadform"], answerIndex:1, reasoning:"Lovprövningen rör plan- och lovfrågor (PBL 9 kap.); tekniken hanteras inför startbesked (10 kap.). Källa: PBL 9 kap., 10 kap." },
    ]
  },
  {
    id: "grp-pbf",
    title: "PBF – Plan- och byggförordningen",
    questions: [
      { id:"Q11", type:"mcq", q:"Var finns detaljerade undantag från bygglov?", options:["PBL","PBF","BBR","EKS"], answerIndex:1, reasoning:"PBF kap. 6–9 preciserar lovpliktsundantag. Källa: PBF 6–9 kap." },
      { id:"Q12", type:"mcq", q:"Vilken regel styr komplementbostadshus (Attefall, 30 kvm)?", options:["PBF 6 kap.","PBF 9 kap. 4 a §","PBF 10 kap.","PBL 8 kap."], answerIndex:1, reasoning:"Komplementbostadshus/Attefall i PBF 9 kap. 4 a §. Källa: PBF 9:4a." },
      { id:"Q13", type:"mcq", q:"Friggebod ≤ 15 kvm kräver:", options:["Bygglov","Rivningslov","Anmälan","Varken lov eller anmälan"], answerIndex:3, reasoning:"Friggebod kan vara lov- och anmälningsfri med villkor. Källa: PBF 9:4." },
      { id:"Q14", type:"mcq", q:"Var regleras KA:s behörighetskrav?", options:["PBL 10 kap.","PBF 10 kap.","BBR 1:2","EKS 1:1"], answerIndex:1, reasoning:"PBF 10 kap. anger behörighet, oberoende och certifiering. Källa: PBF 10 kap." },
      { id:"Q15", type:"mcq", q:"Attefallshus närmare gräns än 4,5 m kräver:", options:["Inget extra","Grannes medgivande","Bygglov","Rivningslov"], answerIndex:1, reasoning:"Kräver grannemedgivande vid < 4,5 m. Källa: PBF 9:4a." },
      { id:"Q16", type:"mcq", q:"KA:s oberoende enligt PBF innebär att KA:", options:["Måste vara kommunanställd","Får inte ha jäv/intressekonflikt","Måste vara entreprenör","Måste vara arkitekt"], answerIndex:1, reasoning:"KA ska vara oberoende i förhållande till uppdraget. Källa: PBF 10:9." },
      { id:"Q17", type:"short", q:"Vad reglerar PBF 6 kap. 1 §?", answer:"Lovbefriade underhållsåtgärder m.m.", reasoning:"Detaljer om åtgärder som inte kräver lov men kan vara anmälningspliktiga. Källa: PBF 6 kap." },
      { id:"Q18", type:"case", q:"Granneyttrande saknas för Attefall nära gräns. Hur resonerar KA?", answer:"Utan medgivande är placeringen inte tillåten trots lovfrihet.", reasoning:"PBF 9 kap. 4 a § kräver grannemedgivande vid < 4,5 m. Källa: PBF 9:4a." },
    ]
  },
  {
    id: "grp-bbr",
    title: "BBR – Boverkets byggregler",
    questions: [
      { id:"Q19", type:"mcq", q:"BBR är främst:", options:["Detaljkrav på material","Funktionskrav med råd","Upphandlingsregler","Planbestämmelser"], answerIndex:1, reasoning:"BBR anger funktionskrav; allmänna råd visar exempel på lösningar. Källa: BBR 1:2." },
      { id:"Q20", type:"mcq", q:"Vilket avsnitt reglerar energihushållning?", options:["BBR 3","BBR 5","BBR 6","BBR 9"], answerIndex:3, reasoning:"BBR avsnitt 9 rör energi. Källa: BBR avsnitt 9." },
      { id:"Q21", type:"mcq", q:"Brandskydd återfinns främst i:", options:["BBR 3","BBR 5","BBR 6","BBR 8"], answerIndex:1, reasoning:"BBR avsnitt 5: brand. Källa: BBR avsnitt 5." },
      { id:"Q22", type:"mcq", q:"Tillgänglighet och användbarhet finns i:", options:["BBR 3","BBR 5","BBR 8","BBR 9"], answerIndex:0, reasoning:"BBR avsnitt 3: bostadsutformning, tillgänglighet. Källa: BBR avsnitt 3." },
      { id:"Q23", type:"mcq", q:"Radon och luftkvalitet behandlas i:", options:["BBR 6","BBR 8","BBR 9","BBR 5"], answerIndex:0, reasoning:"BBR avsnitt 6: hygien, hälsa och miljö. Källa: BBR avsnitt 6." },
      { id:"Q24", type:"mcq", q:"Normal rumshöjd i bostäder enligt BBR:", options:["2,0 m","2,2 m","2,4 m","2,7 m"], answerIndex:2, reasoning:"BBR 3:3 anger normalt ≥ 2,4 m i bostadsrum. Källa: BBR 3:3." },
      { id:"Q25", type:"mcq", q:"Riktvärde U-värde yttervägg småhus:", options:["0,30","0,24","0,18","0,10"], answerIndex:2, reasoning:"Riktvärden i BBR 9:2/tabeller – alternativt verifiera total energiprestanda. Källa: BBR 9:2." },
      { id:"Q26", type:"case", q:"Förskola med hög ljudnivå – vad utreder KA?", answer:"Ljudklass, installationers ljud, efterklang, otätheter – jämför mot projekterade krav.", reasoning:"BBR avsnitt 7 (buller) + 6 och 3 för inomhusmiljö. Källor: BBR 7, 6, 3." },
    ]
  },
  {
    id: "grp-eks",
    title: "EKS – Konstruktionsregler (Eurokoder)",
    questions: [
      { id:"Q27", type:"mcq", q:"EKS syftar främst till att säkerställa:", options:["Tillgänglighet","Brandskydd","Bärförmåga och stabilitet","Rumshöjd"], answerIndex:2, reasoning:"EKS (BFS 2011:10) anger nationell tillämpning av Eurokoder. Källa: PBL 8:4, EKS." },
      { id:"Q28", type:"mcq", q:"Vad står γ (gamma) för i dimensionering?", options:["Brandklass","Partialkoefficient","Isolervärde","Fuktsäkerhet"], answerIndex:1, reasoning:"Partialkoefficienter för laster/material i Eurokoder/EKS. Källa: EKS." },
      { id:"Q29", type:"mcq", q:"Vilken lastkombination beaktas normalt?", options:["Endast egenlast","Endast snölast","Karakteristisk kombination av laster","Ingen"], answerIndex:2, reasoning:"Kombinationer av egenlast, nyttig last, vind, snö m.m. Källa: Eurokod/EKS." },
      { id:"Q30", type:"short", q:"Vem utfärdar EKS?", answer:"Boverket.", reasoning:"EKS är Boverkets föreskrifter som kompletterar Eurokoderna. Källa: BFS 2011:10 m.fl." },
      { id:"Q31", type:"case", q:"Ny produkt utan CE-märkning för bärande konstruktioner – agerande?", answer:"Begär DoP/CE enligt harmoniserad standard; annars använd inte.", reasoning:"Spårbar säkerhet kräver CE/DoP där standard finns. Källor: CPR, EKS." },
      { id:"Q32", type:"mcq", q:"Vid komplicerad bärande konstruktion kan vara motiverat med:", options:["Ingen kontroll","Endast egenkontroll","Tredjepartsgranskning","Färre kontroller"], answerIndex:2, reasoning:"Oberoende granskning minskar risk i komplexa/livsviktiga konstruktioner. Källa: Praxis/EKS." },
    ]
  },
  {
    id: "grp-ka",
    title: "Kontrollplan & KA:s arbete",
    questions: [
      { id:"Q33", type:"mcq", q:"Vem tar fram förslag till kontrollplan normalt?", options:["Byggnadsnämnden","Byggherren","KA","Entreprenören"], answerIndex:2, reasoning:"Byggherren ansvarar men KA tar ofta fram förslag och följer upp. Källa: PBL 10:6." },
      { id:"Q34", type:"mcq", q:"Vad ska framgå i kontrollplanen?", options:["Vad, vem, mot vad/hur, dokumentation","Endast ritningar","Endast besiktning","Endast CE-intyg"], answerIndex:0, reasoning:"Kontrollplanen ska vara spårbar och uppföljningsbar. Källor: PBL 10:6, PBF." },
      { id:"Q35", type:"mcq", q:"När kan nämnden besluta att KA inte behövs?", options:["Aldrig","Vid små/enkla ärenden","Endast vid Attefall","När entreprenör kräver det"], answerIndex:1, reasoning:"Undantag för små/enkla åtgärder. Källa: PBL 10:10." },
      { id:"Q36", type:"case", q:"Branddörrar utan intyg har monterats. Vad gör KA?", answer:"Stoppa vidare montage, begär DoP/klassningsintyg, verifiera märkning, dokumentera avvikelse.", reasoning:"BBR 5-krav måste verifieras. Källa: BBR 5." },
      { id:"Q37", type:"short", q:"Nämn tre riskmoment i småhus att ha i kontrollplan.", answer:"Bärande konstruktioner, brandskydd, fuktsäkerhet/tätskikt (ev. ventilation/energi).", reasoning:"Stor påverkan och svåra att åtgärda i efterhand. Källa: PBL 8 kap., BBR 5/6/9." },
      { id:"Q38", type:"mcq", q:"Vilka möten ska KA delta i enligt PBL/PBF?", options:["Tekniskt samråd, arbetsplatsbesök, slutsamråd","Endast tekniskt samråd","Endast slutsamråd","Inga"], answerIndex:0, reasoning:"Kärnuppgifter i KA-rollen. Källor: PBL 10 kap., PBF 10 kap." },
    ]
  },
  {
    id: "grp-mix",
    title: "Blandade/Provträning",
    questions: [
      { id:"Q39", type:"mcq", q:"Vilket underlag behöver nämnden för slutbesked?", options:["Entreprenadkontrakt","KA:s utlåtande + verifierad dokumentation","Nytt startbesked","Arbetsmiljöplan"], answerIndex:1, reasoning:"Slutbesked baseras på uppfyllda krav + KA:s utlåtande. Källa: PBL 10:32–34." },
      { id:"Q40", type:"mcq", q:"Vad är skillnaden mellan bygglov och startbesked?", options:["Inga","Lov = plan/juridik, start = tekniskt klartecken","Lov = energi, start = brand","Lov = entreprenad, start = budget"], answerIndex:1, reasoning:"Lov = plan- och lovplikt (9 kap.), Startbesked = tekniskt klartecken (10 kap.). Källor: PBL 9 kap., 10 kap." },
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
      reviewingWrongOnly: false
    },
    mcqAnswers: {},          // id:number
    textAnswers: {},         // id:string (för case/short)
    reveal: {},              // id:{answer,reasoning} (visas efter rättning)
    results: []              // historik över slutförda prov
  });

  // Räkna hur många frågor av en typ som finns
  const counts = useMemo(() => {
    const c = { mcq:0, case:0, short:0 };
    ALL.forEach(q => { c[q.type]++; });
    return c;
  }, []);

  // Sätt standard-antal till MAX tillgängligt
  useEffect(() => {
    setApp(s => ({
      ...s,
      quiz: {
        ...s.quiz,
        size: s.quiz.type==="mcq" ? counts.mcq : s.quiz.type==="case" ? counts.case : counts.short
      }
    }));
    // eslint-disable-next-line
  }, []);

  /* --- starta prov för viss kategori --- */
  const startQuizFor = (type, order, size, groupId="all") => {
    const pool = ALL.filter(q => (type==="all" ? true : q.type===type) && (groupId==="all" ? true : q.groupId===groupId));
    if (pool.length === 0) { alert("Inga frågor matchar valet."); return; }
    const idsChrono = pool.map(q => q.id);
    const idsOrdered = order === "random" ? shuffle(idsChrono) : idsChrono;
    const picked = idsOrdered.slice(0, Math.min(size, idsOrdered.length));

    const newReveal = { ...app.reveal };
    picked.forEach(id => newReveal[id] = { answer:false, reasoning:false });

    setApp(s => ({
      ...s,
      mode:"quiz",
      reveal:newReveal,
      quiz:{ type, order, size: picked.length, ids:picked, index:0, graded:false, incorrectIds:[], reviewingWrongOnly:false }
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* --- rätta allt (bara MCQ poängsätts) --- */
  const gradeAll = () => {
    if (app.quiz.type !== "mcq") {
      // För case/short – ingen poäng, men vi går till sammanfattning för jämförelse
      setApp(s => ({ ...s, mode:"summary", quiz:{ ...s.quiz, graded:true, incorrectIds:[] } }));
      // Spara resultat i historik (antal besvarade)
      const answered = app.quiz.ids.filter(id => {
        const q = ALL_BY_ID.get(id);
        if (q.type === "mcq") return app.mcqAnswers[id] !== undefined;
        return (app.textAnswers[id] || "").trim().length > 0;
      }).length;
      appendResult({
        type: app.quiz.type,
        size: app.quiz.ids.length,
        answered,
        right: null, wrong: null, percent: null
      });
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

  /* --- jump to question from summary (fel-lista) --- */
  const jumpToQuestion = (id) => {
    let ids = app.quiz.ids;
    if (!ids.includes(id)) ids = [id];
    const idx = ids.indexOf(id);
    const newReveal = { ...app.reveal, [id]: { answer:true, reasoning:true } };
    setApp(s => ({ ...s, mode:"quiz", reveal:newReveal, quiz:{ ...s.quiz, ids, index: idx } }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* --- resultathistorik --- */
  const appendResult = (entry) => {
    const stamp = new Date().toISOString();
    setApp(s => ({ ...s, results: [{ ...entry, stamp }, ...s.results].slice(0, 50) })); // spara max 50
  };
  const clearResults = () => {
    if (!confirm("Rensa tidigare resultat?")) return;
    setApp(s => ({ ...s, results: [] }));
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
            clearResults={clearResults}
            setApp={setApp}
          />
        )}

        {app.mode === "quiz" && (
          <QuizView
            app={app}
            setApp={setApp}
            gradeAll={gradeAll}
          />
        )}

        {app.mode === "summary" && (
          <Summary
            app={app}
            setApp={setApp}
            jumpToQuestion={jumpToQuestion}
            regrade={regrade}
          />
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-10 text-center text-xs text-slate-500">
        <p>Framsteg (svar/visningar) och resultat sparas lokalt i webbläsaren.</p>
      </footer>
    </div>
  );
}

/* ---------- Översikt (ENDA sidan innan prov) ---------- */
function Overview({ app, counts, startQuizFor, quizProgress, clearResults, setApp }) {
  const [mcq, setMcq] = useState({ order: "random", size: counts.mcq });
  const [cas, setCas] = useState({ order: "random", size: counts.case });
  const [sho, setSho] = useState({ order: "random", size: counts.short });

  // Fortsätt prov-kort (om något prov finns)
  const hasOngoing = app.quiz.ids.length > 0 && app.mode !== "quiz"; // visa knapp att fortsätta
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
              <button onClick={()=>setApp(s=>({...s, quiz:{...s.quiz, ids:[], index:0, graded:false, incorrectIds:[]}}))} className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-sm">
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
            {[counts.mcq, 30, 25, 20, 15, 10].filter((v,i,self)=>self.indexOf(v)===i).map(n=><option key={n} value={n}>{n}</option>)}
          </select>
          <button onClick={()=>startQuizFor("mcq", mcq.order, mcq.size)} className="px-4 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-sm flex items-center gap-2">
            <Timer className="w-4 h-4" /> Starta prov (MCQ)
          </button>
        </div>
      </div>

      {/* CASE */}
      <div className="rounded-2xl border border-slate-200 p-5 bg-white">
        <h3 className="text-base font-semibold mb-2">Case</h3>
        <p className="text-sm text-slate-600 mb-3">Tillgängliga: {counts.case}</p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm">Ordning</label>
          <select className="px-3 py-2 rounded-xl border border-slate-300 text-sm" value={cas.order} onChange={e=>setCas(v=>({...v,order:e.target.value}))}>
            <option value="random">Slumpmässig</option>
            <option value="chronological">Kronologisk</option>
          </select>
          <label className="text-sm ml-2">Antal</label>
          <select className="px-3 py-2 rounded-xl border border-slate-300 text-sm" value={cas.size} onChange={e=>setCas(v=>({...v,size:Number(e.target.value)}))}>
            {[counts.case, 20, 15, 10, 5].filter((v,i,self)=>self.indexOf(v)===i).map(n=><option key={n} value={n}>{n}</option>)}
          </select>
          <button onClick={()=>startQuizFor("case", cas.order, cas.size)} className="px-4 py-2 rounded-xl border border-indigo-300 bg-indigo-50 text-indigo-800 text-sm flex items-center gap-2">
            <Timer className="w-4 h-4" /> Starta prov (Case)
          </button>
        </div>
      </div>

      {/* KORTFRÅGOR */}
      <div className="rounded-2xl border border-slate-200 p-5 bg-white">
        <h3 className="text-base font-semibold mb-2">Kortfrågor</h3>
        <p className="text-sm text-slate-600 mb-3">Tillgängliga: {counts.short}</p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm">Ordning</label>
          <select className="px-3 py-2 rounded-xl border border-slate-300 text-sm" value={sho.order} onChange={e=>setSho(v=>({...v,order:e.target.value}))}>
            <option value="random">Slumpmässig</option>
            <option value="chronological">Kronologisk</option>
          </select>
          <label className="text-sm ml-2">Antal</label>
          <select className="px-3 py-2 rounded-xl border border-slate-300 text-sm" value={sho.size} onChange={e=>setSho(v=>({...v,size:Number(e.target.value)}))}>
            {[counts.short, 20, 15, 10, 5].filter((v,i,self)=>self.indexOf(v)===i).map(n=><option key={n} value={n}>{n}</option>)}
          </select>
          <button onClick={()=>startQuizFor("short", sho.order, sho.size)} className="px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-sm flex items-center gap-2">
            <Timer className="w-4 h-4" /> Starta prov (Kort)
          </button>
        </div>
      </div>

      {/* RESULTAT-historik */}
      <div className="rounded-2xl border border-slate-200 p-5 bg-white">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold flex items-center gap-2"><History className="w-4 h-4" /> Resultat</h3>
          {app.results.length>0 && (
            <button onClick={clearResults} className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs flex items-center gap-1">
              <RefreshCcw className="w-3.5 h-3.5" /> Rensa
            </button>
          )}
        </div>
        {app.results.length===0 ? (
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
                {app.results.map((r, i) => {
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
    </motion.div>
  );
}

/* ---------- Quiz: en fråga i taget ---------- */
function QuizView({ app, setApp, gradeAll }) {
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

  // Visa facit & resonemang endast efter rättning/sammanfattning
  const showAnswer = graded && app.reveal[q.id]?.answer;
  const showReason = graded && app.reveal[q.id]?.reasoning;

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="rounded-2xl shadow-sm border border-slate-200 p-5 bg-white">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-slate-600">Fråga {idx+1} / {total}{app.quiz.reviewingWrongOnly && " • (endast fel)"}</div>
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
            <p className="text-xs text-slate-500 mt-2">Facit & resonemang visas i sammanfattningen efter sista frågan.</p>
          </div>
        )}

        {/* Facit & resonemang endast EFTER rättning/sammanfattning */}
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
              <div className="text-slate-700">{q.reasoning}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigering – Föregående vänster, Nästa höger, Rätta allt/Slutför endast sista frågan */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <button onClick={goPrev} disabled={idx===0} className="justify-self-start px-4 py-2 rounded-xl border border-slate-300 text-sm disabled:opacity-50">
          <ArrowLeft className="inline w-4 h-4 mr-1" /> Föregående
        </button>

        <div className="justify-self-center self-center text-xs text-slate-500 text-center px-2">
          {app.quiz.type==="mcq" && !app.quiz.graded ? "Rätta allt finns på sista frågan" : ""}
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
    </motion.div>
  );
}

/* ---------- Sammanfattning ---------- */
function Summary({ app, setApp, jumpToQuestion, regrade }) {
  const total = app.quiz.ids.length;
  const wrong = app.quiz.incorrectIds.length;
  const right = total - wrong;

  // Öppna facit & resonemang för alla frågor automatiskt i text-typer
  useEffect(()=>{
    const rev = { ...app.reveal };
    app.quiz.ids.forEach(id => {
      if (app.quiz.type!=="mcq") rev[id] = { answer:true, reasoning:true };
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
        <p className="text-slate-700 mb-4">Prov av typ: {app.quiz.type.toUpperCase()}. Jämför dina svar med facit & resonemang nedan.</p>
      )}

      {/* Fel-lista (klickbar) för MCQ */}
      {app.quiz.type==="mcq" && (
        <>
          <div className="text-sm font-medium mb-2">Felaktiga frågor</div>
          {wrong === 0 ? (
            <p className="text-sm text-emerald-700 mb-4">Inga fel – snyggt jobbat!</p>
          ) : (
            <ol className="list-decimal ml-6 space-y-1 mb-4">
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
        </>
      )}

      {/* Genomgång av alla frågor med ditt svar + facit (speciellt för case/short) */}
      <div className="mt-4 space-y-4">
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
          onClick={()=>setApp(s=>({...s,mode:"quiz", quiz:{...s.quiz, index:0}}))}
          className="px-4 py-2 rounded-xl border border-slate-300 text-sm"
        >
          Gå igenom provet igen
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
