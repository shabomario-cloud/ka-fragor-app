import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle2, Circle, Search, Timer, XCircle, ListX, ArrowLeft, ArrowRight, Home } from "lucide-react";

const STORAGE_KEY = "ka-qa-bank-v2";

/** ------------------------------------
 *  Frågebank (40 frågor, numrerade)
 *  Grupper: PBL (10), PBF (8), BBR (8), EKS (6), KA & Kontrollplan (6), Blandat (2)
 *  MCQ prioriteras för autogradering; vissa 'short'/'case' ingår för övning.
 *  ------------------------------------ */
const BANK = [
  {
    id: "grp-pbl",
    title: "PBL – Plan- och bygglagen",
    questions: [
      { id:"Q1", type:"mcq", q:"Vilken instans ansvarar för tillsyn enligt PBL?", options:["Byggherren","Byggnadsnämnden","Länsstyrelsen","Kontrollansvarig"], answerIndex:1, reasoning:"Kommunens byggnadsnämnd utövar tillsyn (PBL 11 kap. 5 §). Byggherren ansvarar för efterlevnad men är inte myndighet." },
      { id:"Q2", type:"mcq", q:"Vad reglerar PBL kapitel 8 främst?", options:["Detaljplaner","Tekniska egenskapskrav","Fastighetsbildning","Upphandling"], answerIndex:1, reasoning:"PBL 8 kap. 4–6 §§: bärförmåga, brandskydd, hygien, energi, buller, tillgänglighet m.m." },
      { id:"Q3", type:"mcq", q:"Vilket krävs för att åtgärden ska få påbörjas?", options:["Bygglov","Startbesked","Slutbesked","Planprogram"], answerIndex:1, reasoning:"Startbesked krävs för att påbörja (PBL 10 kap. 3 §). Bygglov rör lovprövningen (9 kap.)." },
      { id:"Q4", type:"mcq", q:"Vilket krävs för att ta en byggnad i bruk?", options:["Startbesked","Slutbesked","Kontrollplan","Arbetsmiljöplan"], answerIndex:1, reasoning:"Slutbesked behövs innan brukande (PBL 10 kap. 34 §)." },
      { id:"Q5", type:"mcq", q:"Vem ansvarar för att det finns en kontrollplan?", options:["Byggnadsnämnden","Byggherren","KA","Entreprenören"], answerIndex:1, reasoning:"Byggherren ansvarar (PBL 10 kap. 6 §). KA bistår men övertar inte ansvaret." },
      { id:"Q6", type:"mcq", q:"När hålls tekniskt samråd?", options:["Före bygglov","Efter bygglov men före startbesked","Efter slutsamråd","Efter slutbesked"], answerIndex:1, reasoning:"Tekniskt samråd enligt PBL 10 kap. 14–16 §§, för att bedöma förutsättningarna inför startbesked." },
      { id:"Q7", type:"mcq", q:"Vilket av följande kräver bygglov enligt PBL 9 kap.?", options:["Friggebod 15 kvm","Tillbyggnad av bostad","Vindsisolering","Byte av köksluckor"], answerIndex:1, reasoning:"Tillbyggnad är lovpliktig (PBL 9 kap. 2 §). Övriga kan vara undantag/underhåll." },
      { id:"Q8", type:"short", q:"Vad är rivningslov?", answer:"Tillstånd att riva en byggnad (PBL 9 kap. 10–13 §§).", reasoning:"Krävs normalt inom detaljplan; kommunen prövar konsekvenser för stads-/kulturmiljö." },
      { id:"Q9", type:"case", q:"Byggherre startar utan startbesked. Hur agerar KA?", answer:"Påpeka olaglig byggstart, dokumentera, underrätta nämnden vid allvarlig avvikelse.", reasoning:"Byggstart före startbesked är förbjudet (PBL 10 kap. 3 §); sanktionsavgifter kan följa (11 kap. 51 §)." },
      { id:"Q10", type:"mcq", q:"Vad prövas primärt i bygglovet?", options:["Tekniska lösningar","Plan- och lovplikt","Energiprestanda","Entreprenadform"], answerIndex:1, reasoning:"Lovprövningen rör plan- och lovfrågor (PBL 9 kap.); tekniken hanteras inför startbesked (10 kap.)." },
    ]
  },
  {
    id: "grp-pbf",
    title: "PBF – Plan- och byggförordningen",
    questions: [
      { id:"Q11", type:"mcq", q:"Var finns detaljerade undantag från bygglov?", options:["PBL","PBF","BBR","EKS"], answerIndex:1, reasoning:"PBF kap. 6–9 preciserar lovpliktsundantag (friggebod, Attefall m.m.)." },
      { id:"Q12", type:"mcq", q:"Vilken regel styr komplementbostadshus (Attefall, 30 kvm)?", options:["PBF 6 kap.","PBF 9 kap. 4 a §","PBF 10 kap.","PBL 8 kap."], answerIndex:1, reasoning:"Attefall (komplementbostadshus) i PBF 9 kap. 4 a §; ofta anmälningsplikt även om lovfritt." },
      { id:"Q13", type:"mcq", q:"Friggebod ≤ 15 kvm kräver:", options:["Bygglov","Rivningslov","Anmälan","Varken lov eller anmälan"], answerIndex:3, reasoning:"PBF 9 kap. 4 §: friggebodar kan vara lov- och anmälningsfria (med villkor)."},
      { id:"Q14", type:"mcq", q:"Var regleras KA:s behörighetskrav?", options:["PBL 10 kap.","PBF 10 kap.","BBR 1:2","EKS 1:1"], answerIndex:1, reasoning:"PBF 10 kap. anger behörighet, oberoende och certifiering för KA." },
      { id:"Q15", type:"mcq", q:"Attefallshus närmare gräns än 4,5 m kräver:", options:["Inget extra","Grannes medgivande","Bygglov","Rivningslov"], answerIndex:1, reasoning:"PBF 9 kap. 4 a §: närmare än 4,5 m kräver grannemedgivande." },
      { id:"Q16", type:"mcq", q:"KA:s oberoende enligt PBF innebär att KA:", options:["Måste vara kommunanställd","Får inte ha jäv/intressekonflikt","Måste vara entreprenör","Måste vara arkitekt"], answerIndex:1, reasoning:"PBF 10 kap. 9 §: KA ska vara oberoende i förhållande till uppdraget." },
      { id:"Q17", type:"short", q:"Vad reglerar PBF 6 kap. 1 §?", answer:"Lovbefriade underhållsåtgärder m.m.", reasoning:"Detaljer om åtgärder som inte kräver lov men kan vara anmälningspliktiga." },
      { id:"Q18", type:"case", q:"Granneyttrande saknas för Attefall nära gräns. Hur resonerar KA?", answer:"Utan medgivande är placeringen inte tillåten trots lovfrihet.", reasoning:"PBF 9 kap. 4 a § kräver grannemedgivande vid < 4,5 m." },
    ]
  },
  {
    id: "grp-bbr",
    title: "BBR – Boverkets byggregler",
    questions: [
      { id:"Q19", type:"mcq", q:"BBR är främst:", options:["Detaljkrav på material","Funktionskrav med råd","Upphandlingsregler","Planbestämmelser"], answerIndex:1, reasoning:"BBR anger funktionskrav; allmänna råd visar exempel på lösningar." },
      { id:"Q20", type:"mcq", q:"Vilket avsnitt reglerar energihushållning?", options:["BBR 3","BBR 5","BBR 6","BBR 9"], answerIndex:3, reasoning:"BBR avsnitt 9 rör energi (primärenergatal, isolering, täthet)." },
      { id:"Q21", type:"mcq", q:"Brandskydd återfinns främst i:", options:["BBR 3","BBR 5","BBR 6","BBR 8"], answerIndex:1, reasoning:"BBR avsnitt 5: brand (utrymning, bärförmåga, avskiljning, installationer)." },
      { id:"Q22", type:"mcq", q:"Tillgänglighet och användbarhet finns i:", options:["BBR 3","BBR 5","BBR 8","BBR 9"], answerIndex:0, reasoning:"BBR avsnitt 3 behandlar bostadsutformning, tillgänglighet, rumshöjder m.m." },
      { id:"Q23", type:"mcq", q:"Radon och luftkvalitet behandlas i:", options:["BBR 6","BBR 8","BBR 9","BBR 5"], answerIndex:0, reasoning:"BBR avsnitt 6: hygien, hälsa och miljö (fukt, ventilation, radon)." },
      { id:"Q24", type:"mcq", q:"Normal rumshöjd i bostäder enligt BBR:", options:["2,0 m","2,2 m","2,4 m","2,7 m"], answerIndex:2, reasoning:"BBR 3:3 anger normalt ≥ 2,4 m i bostadsrum (undantag i vissa utrymmen)." },
      { id:"Q25", type:"mcq", q:"Vilket är ett vanligt riktvärde för U-värde yttervägg småhus?", options:["0,30","0,24","0,18","0,10"], answerIndex:2, reasoning:"BBR 9:2 tabellnivåer/riktvärden – alternativt verifieras via total energiprestanda." },
      { id:"Q26", type:"case", q:"Förskola med hög ljudnivå – vad utreder KA?", answer:"Ljudklass, installationers ljud, efterklang, otätheter – jämför mot projekterade krav.", reasoning:"BBR avsnitt 7 (buller) tillsammans med funktionskrav i 6 och 3 för god inomhusmiljö." },
    ]
  },
  {
    id: "grp-eks",
    title: "EKS – Konstruktionsregler (Eurokoder)",
    questions: [
      { id:"Q27", type:"mcq", q:"EKS syftar främst till att säkerställa:", options:["Tillgänglighet","Brandskydd","Bärförmåga och stabilitet","Rumshöjd"], answerIndex:2, reasoning:"EKS (BFS 2011:10) anger hur Eurokoder tillämpas i Sverige; kopplat till PBL 8 kap. 4 §." },
      { id:"Q28", type:"mcq", q:"Vad står γ (gamma) för i dimensionering?", options:["Brandklass","Partialkoefficient","Isolervärde","Fuktsäkerhet"], answerIndex:1, reasoning:"Partialkoefficienter i Eurokoder/EKS ger säkerhetsmarginaler för laster/material." },
      { id:"Q29", type:"mcq", q:"Vilken lastkombination beaktas normalt?", options:["Endast egenlast","Endast snölast","Karakteristisk kombination av laster","Ingen – fri dimensionering"], answerIndex:2, reasoning:"Eurokoder kräver kombinationer av egenlast, nyttig last, vind, snö m.m." },
      { id:"Q30", type:"short", q:"Vem utfärdar EKS?", answer:"Boverket.", reasoning:"EKS är Boverkets föreskrifter som kompletterar Eurokoderna nationellt." },
      { id:"Q31", type:"case", q:"Ny produkt utan CE-märkning för bärande konstruktioner – agerande?", answer:"Begär DoP/CE enligt harmoniserad standard; annars använd inte.", reasoning:"Bärverk ska verifieras via standarder/CE där sådana finns; annars saknas spårbar säkerhet." },
      { id:"Q32", type:"mcq", q:"Vid komplicerad bärande konstruktion kan vara motiverat med:", options:["Ingen kontroll","Endast egenkontroll","Tredjepartsgranskning","Färre kontroller"], answerIndex:2, reasoning:"Oberoende granskning minskar risk i komplexa/livsviktiga konstruktioner (praxis)."},
    ]
  },
  {
    id: "grp-ka",
    title: "Kontrollplan & KA:s arbete",
    questions: [
      { id:"Q33", type:"mcq", q:"Vem tar fram förslag till kontrollplan normalt?", options:["Byggnadsnämnden","Byggherren","KA","Entreprenören"], answerIndex:2, reasoning:"Byggherren ansvarar men KA tar ofta fram förslag och följer upp (PBL 10 kap. 6 §)." },
      { id:"Q34", type:"mcq", q:"Vad ska framgå i kontrollplanen?", options:["Vad, vem, mot vad/hur, dokumentation","Endast ritningar","Endast besiktning","Endast CE-intyg"], answerIndex:0, reasoning:"Kontrollplanen ska vara spårbar och uppföljningsbar (PBL 10 kap. 6 §, PBF)."},
      { id:"Q35", type:"mcq", q:"När kan nämnden besluta att KA inte behövs?", options:["Aldrig","Vid små/enkla ärenden","Endast vid Attefall","När entreprenör kräver det"], answerIndex:1, reasoning:"PBL 10 kap. 10 §: undantag för små/enkla åtgärder." },
      { id:"Q36", type:"case", q:"Branddörrar utan intyg har monterats. Vad gör KA?", answer:"Stoppa vidare montage, begär DoP/klassningsintyg, verifiera märkning, dokumentera avvikelse.", reasoning:"Utan verifiering uppfylls inte BBR 5-krav. Åtgärda innan fortsatt arbete." },
      { id:"Q37", type:"short", q:"Nämn tre riskmoment i småhus att ha i kontrollplan.", answer:"Bärande konstruktioner, brandskydd, fuktsäkerhet/tätskikt (ev. ventilation/energi).", reasoning:"Hög påverkan på säkerhet/hälsa/funktion; svåra att åtgärda i efterhand." },
      { id:"Q38", type:"mcq", q:"Vilka möten ska KA delta i enligt PBL/PBF?", options:["Tekniskt samråd, arbetsplatsbesök, slutsamråd","Endast tekniskt samråd","Endast slutsamråd","Inga"], answerIndex:0, reasoning:"Kärnuppgifter i KA-rollen (PBL 10 kap., PBF 10 kap.)." },
    ]
  },
  {
    id: "grp-mix",
    title: "Blandade/Provträning",
    questions: [
      { id:"Q39", type:"mcq", q:"Vilket underlag behöver nämnden för slutbesked?", options:["Entreprenadkontrakt","KA:s utlåtande + verifierad dokumentation","Nytt startbesked","Arbetsmiljöplan"], answerIndex:1, reasoning:"Slutbesked baseras på uppfyllda krav + KA:s utlåtande (PBL 10 kap. 32–34 §§)." },
      { id:"Q40", type:"mcq", q:"Vad är skillnaden mellan bygglov och startbesked?", options:["Inga","Lov = plan/juridik, start = tekniskt klartecken","Lov = energi, start = brand","Lov = entreprenad, start = budget"], answerIndex:1, reasoning:"Bygglov (9 kap.) rör plan- och lovplikt; startbesked (10 kap.) medger byggstart efter teknisk prövning." },
    ]
  },
];

/** ------------------------------------
 *  Hjälpfunktioner & state
 *  ------------------------------------ */
function flatQuestions() {
  const a = [];
  BANK.forEach(g => g.questions.forEach(q => a.push({ ...q, groupId: g.id, groupTitle: g.title })));
  return a;
}
const ALL = flatQuestions();
const ALL_BY_ID = new Map(ALL.map(q => [q.id, q]));
const MCQ_IDS = ALL.filter(q => q.type === "mcq").map(q => q.id);

function useStoredState(defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultValue;
      const parsed = JSON.parse(raw);
      return { ...defaultValue, ...parsed };
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

/** ------------------------------------
 *  App-komponent
 *  ------------------------------------ */
export default function App() {
  const [app, setApp] = useStoredState({
    mode: "study", // "study" | "quiz" | "summary"
    filters: { group: "all", type: "all", query: "" },
    completed: {},           // id:boolean
    mcqAnswers: {},          // id:number (index)
    reveal: {},              // id:{answer:boolean, reasoning:boolean}
    quiz: {
      size: 20,
      ids: [],               // frågeset i provet
      index: 0,              // aktuell fråga i prov
      graded: false,
      incorrectIds: [],
      reviewingWrongOnly: false
    }
  });

  const groups = BANK.map(g => ({ id: g.id, title: g.title }));

  // Studie-lista (filtrering)
  const filteredStudy = useMemo(() => {
    const { group, type, query } = app.filters;
    const q = query.trim().toLowerCase();
    return ALL.filter(it => {
      if (group !== "all" && it.groupId !== group) return false;
      if (type !== "all" && it.type !== type) return false;
      if (!q) return true;
      const hay = [it.q, ...(it.options||[]), it.answer, it.reasoning, it.groupTitle].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [app.filters]);

  const overall = useMemo(() => {
    const total = ALL.length;
    const done = ALL.filter(q => app.completed[q.id]).length;
    const byGroup = {};
    BANK.forEach(g => {
      const items = g.questions;
      const totalG = items.length;
      const doneG = items.filter(q => app.completed[q.id]).length;
      byGroup[g.id] = { total: totalG, done: doneG, pct: totalG ? Math.round((doneG/totalG)*100) : 0 };
    });
    return { total, done, pct: total? Math.round((done/total)*100):0, byGroup };
  }, [app.completed]);

  // UI helpers
  const setFilter = (k, v) => setApp(s => ({ ...s, filters: { ...s.filters, [k]: v } }));
  const toggleReveal = (id, key) => setApp(s => ({ ...s, reveal: { ...s.reveal, [id]: { ...(s.reveal[id]||{}), [key]: !(s.reveal[id]?.[key]) } } }));
  const markDone = (id, val=true) => setApp(s => ({ ...s, completed: { ...s.completed, [id]: val } }));
  const answerMcq = (id, idx) => setApp(s => ({ ...s, mcqAnswers: { ...s.mcqAnswers, [id]: idx } }));

  /** ---------- Provläge ---------- */
  const startQuiz = () => {
    const pool = MCQ_IDS.filter(id => app.filters.group==="all" || ALL_BY_ID.get(id).groupId===app.filters.group);
    if (pool.length === 0) { alert("Inga flervalsfrågor i det valda filtret."); return; }
    const size = Math.min(app.quiz.size, pool.length);
    const ids = shuffle(pool).slice(0, size);
    // reset reveals for quiz ids
    const newReveal = { ...app.reveal };
    ids.forEach(id => newReveal[id] = { answer:false, reasoning:false });
    setApp(s => ({ ...s, mode:"quiz", reveal:newReveal, quiz:{ ...s.quiz, ids, index:0, graded:false, incorrectIds:[], reviewingWrongOnly:false } }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const quizQ = app.quiz.ids[app.quiz.index] ? ALL_BY_ID.get(app.quiz.ids[app.quiz.index]) : null;
  const goNext = () => setApp(s => ({ ...s, quiz:{ ...s.quiz, index: Math.min(s.quiz.index+1, s.quiz.ids.length-1) } }));
  const goPrev = () => setApp(s => ({ ...s, quiz:{ ...s.quiz, index: Math.max(s.quiz.index-1, 0) } }));
  const exitToStudy = () => setApp(s => ({ ...s, mode:"study" }));

  const gradeQuiz = () => {
    const incorrect = [];
    app.quiz.ids.forEach(id => {
      const q = ALL_BY_ID.get(id);
      const picked = app.mcqAnswers[id];
      if (picked !== q.answerIndex) incorrect.push(id);
    });
    setApp(s => ({ ...s, mode:"summary", quiz:{ ...s.quiz, graded:true, incorrectIds:incorrect, reviewingWrongOnly:false } }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reviewWrong = () => {
    if (app.quiz.incorrectIds.length === 0) return;
    const ids = app.quiz.incorrectIds;
    const newReveal = { ...app.reveal };
    ids.forEach(id => newReveal[id] = { answer:true, reasoning:true });
    setApp(s => ({ ...s, mode:"quiz", reveal:newReveal, quiz:{ ...s.quiz, ids, index:0, graded:true, reviewingWrongOnly:true } }));
  };

  const reviewAllAgain = () => {
    const ids = app.quiz.ids;
    const newReveal = { ...app.reveal };
    ids.forEach(id => newReveal[id] = { answer:false, reasoning:false });
    setApp(s => ({ ...s, mode:"quiz", reveal:newReveal, quiz:{ ...s.quiz, ids, index:0, graded:false, reviewingWrongOnly:false } }));
  };

  /** ---------- Render ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <BookOpen className="w-7 h-7" />
          <h1 className="text-2xl font-semibold">KA Frågebank – Prov & Övning</h1>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={()=>setApp(s=>({...s,mode:"study"}))} className={`px-3 py-1.5 rounded-lg border text-sm flex items-center gap-1 ${app.mode==="study"?"border-emerald-300 bg-emerald-50":"border-slate-300"}`}>
              <Home className="w-4 h-4" /> Översikt
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {app.mode === "study" && <StudyView
          app={app} setFilter={setFilter} groups={BANK.map(g=>({id:g.id,title:g.title}))}
          overall={overall} filteredStudy={filteredStudy}
          toggleReveal={toggleReveal} markDone={markDone}
          answerMcq={answerMcq} startQuiz={startQuiz}
          setApp={setApp}
        />}

        {app.mode === "quiz" && <QuizView
          app={app} quizQ={quizQ} answerMcq={answerMcq}
          toggleReveal={toggleReveal} goNext={goNext}
          goPrev={goPrev} gradeQuiz={gradeQuiz}
          exitToStudy={exitToStudy}
        />}

        {app.mode === "summary" && <SummaryView
          app={app} ALL_BY_ID={ALL_BY_ID}
          reviewWrong={reviewWrong} reviewAllAgain={reviewAllAgain}
          exitToStudy={exitToStudy}
        />}
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-10 text-center text-xs text-slate-500">
        <p>All progress sparas lokalt i denna webbläsare. Publicera via Netlify/Vercel för att dela med andra.</p>
      </footer>
    </div>
  );
}

/** ---------- Översikt/Studie-läge ---------- */
function StudyView({ app, setFilter, groups, overall, filteredStudy, toggleReveal, markDone, answerMcq, startQuiz, setApp }) {
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
      {/* Översiktspanel */}
      <div className="rounded-2xl shadow-sm border border-slate-200 p-5 bg-white mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1">Översikt</h2>
            <p className="text-sm text-slate-600">Klart totalt: {overall.done} / {overall.total} ({overall.pct}%)</p>
            <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {groups.map(g=>{
                const gStat = overall.byGroup[g.id];
                return (
                  <div key={g.id} className="border border-slate-200 rounded-xl p-3">
                    <div className="text-sm font-medium">{g.title}</div>
                    <div className="text-xs text-slate-500">Klart: {gStat.done}/{gStat.total} ({gStat.pct}%)</div>
                    <div className="mt-2 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400" style={{width:`${gStat.pct}%`}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Provläge-kort */}
          <div className="border border-slate-200 rounded-2xl p-4">
            <div className="text-sm font-medium mb-2">Provläge (flervalsfrågor)</div>
            <div className="flex items-center gap-2 flex-wrap">
              <select className="px-3 py-2 rounded-xl border border-slate-300 text-sm"
                value={app.quiz.size}
                onChange={e=>setApp(s=>({...s,quiz:{...s.quiz,size:Number(e.target.value)}}))}>
                {[10,15,20,25,30].map(n=><option key={n} value={n}>{n} frågor</option>)}
              </select>
              <button onClick={startQuiz} className="px-4 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-sm flex items-center gap-2">
                <Timer className="w-4 h-4" /> Starta prov
              </button>
            </div>
            <div className="text-xs text-slate-500 mt-2">Provet väljer slumpmässigt bland MCQ inom valt avsnitt.</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="rounded-2xl shadow-sm border border-slate-200 p-5 bg-white mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
              placeholder="Sök i frågor, svar, resonemang..."
              value={app.filters.query} onChange={e=>setFilter("query", e.target.value)} />
          </div>
          <select className="px-3 py-2 rounded-xl border border-slate-300 text-sm"
            value={app.filters.group} onChange={e=>setFilter("group", e.target.value)}>
            <option value="all">Alla avsnitt</option>
            {groups.map(g=><option key={g.id} value={g.id}>{g.title}</option>)}
          </select>
          <select className="px-3 py-2 rounded-xl border border-slate-300 text-sm"
            value={app.filters.type} onChange={e=>setFilter("type", e.target.value)}>
            <option value="all">Alla typer</option>
            <option value="mcq">Flervalsfrågor</option>
            <option value="short">Kortfrågor</option>
            <option value="case">Fallstudier</option>
          </select>
          <button onClick={()=>setApp(s=>({...s,filters:{...s.filters, query:""}}))}
            className="px-3 py-2 rounded-xl border border-slate-300 text-sm">Rensa filter</button>
        </div>
      </div>

      {/* Studie-kort */}
      <div className="grid md:grid-cols-2 gap-5">
        {filteredStudy.map(q => (
          <StudyCard key={q.id} q={q}
            reveal={app.reveal[q.id]||{answer:false,reasoning:false}}
            done={!!app.completed[q.id]}
            onReveal={key=>toggleReveal(q.id, key)}
            onDone={val=>markDone(q.id, val)}
            picked={app.mcqAnswers[q.id]}
            onPick={(idx)=>answerMcq(q.id, idx)}
          />
        ))}
      </div>
    </motion.div>
  );
}

function StudyCard({ q, reveal, done, onReveal, onDone, picked, onPick }) {
  const isMcq = q.type === "mcq";
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className={`rounded-2xl border p-5 bg-white shadow-sm ${done?"border-emerald-300":"border-slate-200"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-slate-500 mb-1">{q.id} • {q.type.toUpperCase()} • {q.groupTitle}</div>
          <h3 className="font-medium">{q.q}</h3>
        </div>
        {done ? <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-1"/> : <Circle className="w-6 h-6 text-slate-300 mt-1" />}
      </div>

      {isMcq ? (
        <div className="mt-3 space-y-2">
          {q.options.map((opt, idx)=>{
            const selected = picked === idx;
            return (
              <label key={idx} className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer text-sm ${selected?"border-slate-300 bg-slate-50":"border-slate-200"}`}>
                <input type="radio" name={q.id} className="mt-1 accent-slate-800" checked={selected||false} onChange={()=>onPick(idx)} />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 text-sm text-slate-600"><em>Svara själv – visa facit/resonemang nedan.</em></div>
      )}

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <button onClick={()=>onReveal("answer")} className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm">{reveal.answer ? "Dölj facit" : "Visa facit"}</button>
        <button onClick={()=>onReveal("reasoning")} className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm">{reveal.reasoning ? "Dölj resonemang" : "Visa resonemang"}</button>
        <button onClick={()=>onDone(!done)} className={`px-3 py-1.5 rounded-lg border text-sm ${done?"border-emerald-300 bg-emerald-50":"border-slate-300"}`}>{done?"Markera som ej klar":"Markera som klar"}</button>
      </div>

      <AnimatePresence>
        {reveal.answer && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <div className="font-medium mb-1">Facit</div>
            <div>{q.type==="mcq" ? <span>Korrekt svar: <strong>{q.options[q.answerIndex]}</strong></span> : <span>{q.answer}</span>}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reveal.reasoning && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-sm">
            <div className="font-medium mb-1">Resonemang</div>
            <div className="text-slate-700">{q.reasoning}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** ---------- Provläge (en fråga i taget) ---------- */
function QuizView({ app, quizQ, answerMcq, toggleReveal, goNext, goPrev, gradeQuiz, exitToStudy }) {
  if (!quizQ) return (
    <div className="rounded-2xl border border-slate-200 p-5 bg-white">
      <p>Inga frågor i provet.</p>
      <button onClick={exitToStudy} className="mt-3 px-3 py-2 rounded-xl border border-slate-300 text-sm">Till översikt</button>
    </div>
  );

  const idx = app.quiz.index;
  const total = app.quiz.ids.length;
  const picked = app.mcqAnswers[quizQ.id];
  const isMcq = quizQ.type === "mcq";
  const graded = app.quiz.graded;

  const isCorrect = graded && isMcq && picked === quizQ.answerIndex;
  const isWrong = graded && isMcq && picked !== quizQ.answerIndex;

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="rounded-2xl shadow-sm border border-slate-200 p-5 bg-white">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-slate-600">Fråga {idx+1} / {total} {app.quiz.reviewingWrongOnly && "• (Endast fel)"}</div>
        <div className="flex items-center gap-2">
          <button onClick={exitToStudy} className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm flex items-center gap-1"><Home className="w-4 h-4"/> Översikt</button>
        </div>
      </div>

      <div className={`mt-4 p-4 rounded-xl border ${isCorrect?"border-emerald-300 bg-emerald-50":isWrong?"border-rose-300 bg-rose-50":"border-slate-200 bg-white"}`}>
        <div className="text-xs text-slate-500 mb-1">{quizQ.id} • {quizQ.type.toUpperCase()} • {quizQ.groupTitle}</div>
        <h3 className="font-medium">{quizQ.q}</h3>

        {isMcq ? (
          <div className="mt-4 space-y-2">
            {quizQ.options.map((opt, i) => {
              const selected = picked === i;
              const showCorrect = graded && i === quizQ.answerIndex;
              const showWrongSel = graded && selected && i !== quizQ.answerIndex;
              return (
                <label key={i} className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                  showCorrect ? "border-emerald-300 bg-emerald-50" :
                  showWrongSel ? "border-rose-300 bg-rose-50" :
                  selected ? "border-slate-300 bg-slate-50" : "border-slate-200"
                }`}>
                  <input type="radio" name={quizQ.id} className="mt-1 accent-slate-800"
                    checked={selected||false} onChange={()=>answerMcq(quizQ.id, i)} disabled={graded} />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="mt-3 text-sm text-slate-600"><em>Svara själv – facit visas efter rättning.</em></div>
        )}

        {/* Facit/Resonemang efter rättning */}
        {graded && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <button onClick={()=>toggleReveal(quizQ.id, "answer")} className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm">
              { (app.reveal[quizQ.id]?.answer) ? "Dölj facit" : "Visa facit" }
            </button>
            <button onClick={()=>toggleReveal(quizQ.id, "reasoning")} className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm">
              { (app.reveal[quizQ.id]?.reasoning) ? "Dölj resonemang" : "Visa resonemang" }
            </button>
          </div>
        )}

        <AnimatePresence>
          {graded && app.reveal[quizQ.id]?.answer && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
              <div className="font-medium mb-1">Facit</div>
              <div>{isMcq ? <span>Korrekt svar: <strong>{quizQ.options[quizQ.answerIndex]}</strong></span> : <span>{quizQ.answer}</span>}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {graded && app.reveal[quizQ.id]?.reasoning && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-sm">
              <div className="font-medium mb-1">Resonemang</div>
              <div className="text-slate-700">{quizQ.reasoning}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigering & åtgärder */}
      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
        <button onClick={goPrev} disabled={idx===0} className="px-4 py-2 rounded-xl border border-slate-300 text-sm flex items-center gap-2 disabled:opacity-50">
          <ArrowLeft className="w-4 h-4" /> Föregående
        </button>

        {!app.quiz.graded ? (
          <button onClick={gradeQuiz} className="px-4 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-sm">
            Rätta
          </button>
        ) : (
          <div className="text-sm text-slate-600">Provet är rättat. Använd facit/resonemang och navigera mellan frågorna.</div>
        )}

        <button onClick={goNext} disabled={idx===total-1} className="px-4 py-2 rounded-xl border border-slate-300 text-sm flex items-center gap-2 disabled:opacity-50">
          Nästa <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/** ---------- Sammanfattning efter rättning ---------- */
function SummaryView({ app, ALL_BY_ID, reviewWrong, reviewAllAgain, exitToStudy }) {
  const total = app.quiz.ids.length;
  const wrong = app.quiz.incorrectIds.length;
  const right = total - wrong;

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="rounded-2xl shadow-sm border border-slate-200 p-5 bg-white">
      <h2 className="text-xl font-semibold mb-1">Sammanfattning</h2>
      <p className="text-slate-700 mb-4">{right} rätt • {wrong} fel av {total} frågor</p>

      {wrong>0 && (
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Felaktiga frågor</div>
          <ol className="list-decimal ml-6 space-y-1">
            {app.quiz.incorrectIds.map(id => {
              const q = ALL_BY_ID.get(id);
              return <li key={id} className="text-sm">{q.id}: {q.q} <span className="text-slate-500">({q.groupTitle})</span></li>
            })}
          </ol>
          <div className="text-xs text-slate-500 mt-2">Tips: Välj “Gå igenom fel” så visas enbart de felaktiga med facit och resonemang.</div>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {wrong>0 && (
          <button onClick={reviewWrong} className="px-4 py-2 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 text-sm flex items-center gap-2">
            <ListX className="w-4 h-4" /> Gå igenom fel
          </button>
        )}
        <button onClick={reviewAllAgain} className="px-4 py-2 rounded-xl border border-slate-300 text-sm">Gör om alla provfrågor</button>
        <button onClick={exitToStudy} className="px-4 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-sm">Till översikt</button>
      </div>
    </motion.div>
  );
}
