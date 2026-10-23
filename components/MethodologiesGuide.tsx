'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  Flame,
  Zap,
  Shield,
  Target,
  Activity,
  Calendar,
  Award,
  Search,
  Dumbbell,
  TrendingUp,
  Scale,
  Clock,
  HeartPulse,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  UserCheck,
  Timer,
  ChevronRight,
  Info,
  Percent
} from 'lucide-react';

export default function MethodologiesGuide() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'TOPGYM' | 'ACETO' | 'HATFIELD' | 'THEY' | 'NOCERINO' | 'WILSON' | 'HELMS' | 'DONNA'>('ALL');

  const categories = [
    { id: 'ALL', label: 'Tutti i Metodi' },
    { id: 'TOPGYM', label: 'Metodo TOP GYM Classico' },
    { id: 'ACETO', label: 'Chris Aceto (Championship)' },
    { id: 'HATFIELD', label: 'Hatfield & Bompa (DUP)' },
    { id: 'THEY', label: 'Emilio They (Hard BB)' },
    { id: 'NOCERINO', label: 'Piero Nocerino (T13)' },
    { id: 'WILSON', label: 'Wilson & Fitschen' },
    { id: 'HELMS', label: 'Eric Helms (Pyramid)' },
    { id: 'DONNA', label: 'Femminile & Posturale' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* HEADER PRINCIPALE */}
      <div className="bg-[#12151B] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#E50914]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-[#E50914]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                Metodologie di Lavoro & Periodizzazione
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Enciclopedia tecnica, timeline scientifiche e linee guida operative per la programmazione Top Gym.
              </p>
            </div>
          </div>

          {/* BARRA DI RICERCA */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Cerca metodo, autore, RIR, RPE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#E50914]"
            />
          </div>
        </div>

        {/* PILL CATEGORIE */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pt-5 mt-2 border-t border-white/5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                activeCategory === cat.id
                  ? 'bg-[#E50914] border-[#E50914] text-white shadow-lg shadow-red-950/40'
                  : 'bg-black/40 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* SEZIONE 1: CHRIS ACETO (CHAMPIONSHIP BODYBUILDING) */}
      {(activeCategory === 'ALL' || activeCategory === 'ACETO') && (
          <section className="bg-[#12151B] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            {/* HEADER CHRIS ACETO */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <Flame className="w-6 h-6" />
                </span>
                <div>
                  <h2 className="text-lg font-black uppercase text-white tracking-wider flex items-center gap-2">
                    Metodo Chris Aceto &bull; Championship Bodybuilding & Sovraccarico Assoluto
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Reclutamento prioritario fibre IIb, cadenza concentrica esplosiva, piramidale e cedimento selettivo.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold self-start sm:self-auto">
                ONDULAZIONE A 6 SETTIMANE
              </span>
            </div>

            {/* I 3 PILASTRI DELLA METODOLOGIA ACETO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="bg-black/40 border border-amber-500/30 rounded-xl p-4 space-y-2 border-t-2 border-t-amber-500">
                <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                  <Target className="w-4 h-4" /> 1. Regola del Cedimento Selettivo
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Mai raggiungere il cedimento precoce sui primi composti pesanti: esaurire il SNC a inizio seduta abbatte il tonnellaggio totale. Il cedimento concentrico positivo (RIR 0) è riservato esclusivamente all'ultima serie di ogni esercizio.
                </p>
                <div className="text-[10px] font-mono text-amber-300/80 bg-amber-950/20 p-2 rounded border border-amber-500/20">
                  Set 1-2: RIR 2-3 (Reclutamento) &rarr; Set Finale: RIR 0 (Esaurimento Fibre IIb)
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2 border-t-2 border-t-red-500">
                <span className="text-xs font-black uppercase text-red-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> 2. Cadenza Concentrica Esplosiva (CAT)
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Massima accelerazione volontaria nella fase concentrica contro carichi submassimali. Discesa eccentrica frenata in 2-3 secondi per massimizzare la tensione meccanica senza disperdere energia elastica.
                </p>
                <div className="text-[10px] font-mono text-zinc-400 bg-white/5 p-2 rounded">
                  TUT Composti: 2-0-X-0 &bull; Isolamento: 2-1-2-1 con fermo in picco di contrazione
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2 border-t-2 border-t-blue-500">
                <span className="text-xs font-black uppercase text-blue-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> 3. Modulazione delle Pause di Recupero
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Pause complete sui composti (120-180") per ripristinare ATP-CP. Pause compresse sull'isolamento (45-60") per forzare la densità metabolica e la vasodilatazione periferica.
                </p>
                <div className="text-[10px] font-mono text-blue-300/80 bg-blue-950/20 p-2 rounded border border-blue-500/20">
                  W1-W2: Pause Standard &rarr; W3: -15" su ogni set &rarr; W4: Densità & Drop-Set
                </div>
              </div>
            </div>

            {/* ARCHITETTURA DEL MESOCICLO A 6 SETTIMANE */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" /> Il Ciclo a 6 Settimane (Progressione Sinusoidale Aceto)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div className="bg-black/30 border border-white/5 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">W1 &ndash; W2: Acquisizione</span>
                    <span className="text-[9px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">RIR 2</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Calibrazione carichi di riferimento. 8-10 ripetizioni a cedimento positivo solo sull'ultimo set. Volume standard.
                  </p>
                </div>

                <div className="bg-black/30 border border-amber-500/20 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">W3 &ndash; W4: Sovraccarico</span>
                    <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">RIR 1</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Aumento forzato del carico: +2.5kg tronco, +5kg gambe. Taglio di 15" sulle pause per aumentare la densità.
                  </p>
                </div>

                <div className="bg-black/30 border border-red-500/20 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400">W5: Picco & Cedimento</span>
                    <span className="text-[9px] font-mono bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded">RIR 0</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Massima intensità. Inserimento di Back-off al -30% o Stripping a 3 scalate sull'ultimo esercizio di ogni gruppo.
                  </p>
                </div>

                <div className="bg-black/30 border border-blue-500/20 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400">W6: Deload Attivo</span>
                    <span className="text-[9px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">RIR 3</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Rigenerazione recettoriale: -40% volume (massimo 2 set per esercizio), carichi -20%, recuperi completi, no tecniche speciali.
                  </p>
                </div>
              </div>
            </div>

            {/* FREQUENZE E SPLIT RACCOMANDATE */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" /> Frequenze Split Ufficiali Aceto (3, 4, 5 o 6 Giorni)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 font-mono text-xs">
                <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                  <b className="text-white block mb-1">Split 3 Giorni:</b>
                  <span className="text-[11px] text-zinc-400">D1: Spinta (Petto/Spalle/Tri)<br/>D2: Gambe & Addome<br/>D3: Trazione (Dorso/Bicipiti)</span>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                  <b className="text-amber-400 block mb-1">Split 4 Giorni (Classica):</b>
                  <span className="text-[11px] text-zinc-400">D1: Petto & Bicipiti<br/>D2: Gambe & Polpacci<br/>D3: Spalle & Tricipiti<br/>D4: Dorso & Addome</span>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                  <b className="text-white block mb-1">Split 5 Giorni (Specializz.):</b>
                  <span className="text-[11px] text-zinc-400">D1: Petto &bull; D2: Dorso<br/>D3: Gambe &bull; D4: Spalle<br/>D5: Braccia & Punti Carenti</span>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                  <b className="text-white block mb-1">Split 6 Giorni (Avanzata):</b>
                  <span className="text-[11px] text-zinc-400">Rotazione Push / Pull / Legs<br/>ripetuta due volte con 1 giorno di riposo totale.</span>
                </div>
              </div>
            </div>

            {/* ISTRUZIONI NELLA MATRICE COACH */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 space-y-1.5 text-xs">
              <span className="font-bold text-amber-300 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Applicazione nella Matrice Macrociclo
              </span>
              <p className="text-zinc-300 leading-relaxed">
                Nel menu a tendina della Matrice seleziona <b>Chris Aceto - Volume & Densità</b>. L'algoritmo sincronizzerà le 16 settimane a blocchi ripetuti di 6 microcicli con scarico programmato a W6 e W12, e carichi crescenti calcolati in automatico.
              </p>
            </div>
          </section>
        )}

        {(activeCategory === 'ALL' || activeCategory === 'HATFIELD') && (
        <section className="bg-[#12151B] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Zap className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-black uppercase text-white tracking-wider">
                  Hatfield & Tudor Bompa &bull; Holistic Training & DUP Bosco-Colli
                </h2>
                <p className="text-xs text-zinc-400">
                  Triplice stimolo cellulare (Neurale, Meccanico, Metabolico) e microciclo ondulato ormonale.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 font-bold">
              3 COMPARTIMENTI
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wide">
                1. Compartimento Neurale (CAT)
              </span>
              <p className="text-xs text-zinc-300">
                <b>Target:</b> Fibre veloci a contrazione rapida (Tipo IIx) e attivazione del sistema piramidale.
              </p>
              <div className="text-[11px] font-mono text-zinc-400 bg-black/60 p-2.5 rounded-lg border border-white/5 space-y-1">
                <div>&bull; <b>Reps:</b> 2 - 6 ripetizioni</div>
                <div>&bull; <b>Intensità:</b> 80% - 90% 1RM (Compensatory Acceleration)</div>
                <div>&bull; <b>Recupero:</b> 150 - 240 secondi</div>
                <div>&bull; <b>Buffer:</b> RIR 2-3 (Nessun cedimento)</div>
              </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wide">
                2. Compartimento Meccanico (MAV)
              </span>
              <p className="text-xs text-zinc-300">
                <b>Target:</b> Tensione meccanica miofibrillare e reclutamento fibre intermedie (Tipo IIa).
              </p>
              <div className="text-[11px] font-mono text-zinc-400 bg-black/60 p-2.5 rounded-lg border border-white/5 space-y-1">
                <div>&bull; <b>Reps:</b> 6 - 12 ripetizioni</div>
                <div>&bull; <b>Intensità:</b> 70% - 78% 1RM a tensione continua</div>
                <div>&bull; <b>Recupero:</b> 90 - 120 secondi</div>
                <div>&bull; <b>TUT:</b> 2-0-1-0 o 3-0-1-0</div>
              </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wide">
                3. Compartimento Metabolico
              </span>
              <p className="text-xs text-zinc-300">
                <b>Target:</b> Ipertrofia sarcoplasmatica, capillarizzazione e accumulo di metaboliti intracellulari.
              </p>
              <div className="text-[11px] font-mono text-zinc-400 bg-black/60 p-2.5 rounded-lg border border-white/5 space-y-1">
                <div>&bull; <b>Reps:</b> 12 - 25 ripetizioni o Stripping</div>
                <div>&bull; <b>Intensità:</b> 50% - 65% 1RM</div>
                <div>&bull; <b>Recupero:</b> 45 - 60 secondi</div>
                <div>&bull; <b>Buffer:</b> RIR 0-1 (Cedimento metabolico)</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/20 text-xs text-zinc-300 space-y-2">
            <h4 className="font-bold text-sky-300 flex items-center gap-1.5 uppercase tracking-wide">
              <Calendar className="w-4 h-4" /> Periodizzazione Ondulata Mensile (Bosco-Colli)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] text-zinc-400 pt-1">
              <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                <span className="text-white font-bold block">W1: Setup Neurale</span>
                Baseline tecnica, carichi controllati RIR 2.
              </div>
              <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                <span className="text-white font-bold block">W2: Micro-Overload</span>
                +2.5% carico sui fondamentali, volume costante.
              </div>
              <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                <span className="text-white font-bold block">W3: Intensificazione</span>
                +5% carico complessivo, RIR 1 sui meccanici.
              </div>
              <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                <span className="text-sky-400 font-bold block">W4: Deload SNC</span>
                -40% volume, rigenerazione e test massimali.
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SEZIONE 3: EMILIO THEY & PIERO NOCERINO */}
      {(activeCategory === 'ALL' || activeCategory === 'THEY') && (
          <section className="bg-[#12151B] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            {/* HEADER EMILIO THEY */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
                  <Dumbbell className="w-6 h-6" />
                </span>
                <div>
                  <h2 className="text-lg font-black uppercase text-white tracking-wider flex items-center gap-2">
                    Metodo HARDTOPGYM &bull; Emilio They & Bosco-Colli
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Hard Bodybuilding classico, modulazione fisiologica polarizzata (Uomo/Donna), P.O.F. e piramidali diretti.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-red-500/15 text-red-300 border border-red-500/30 font-bold self-start sm:self-auto">
                SCUOLA CLASSICA ITALIANA
              </span>
            </div>

            {/* 1. TARGET FISIOLOGICO DIFFERENZIATO: UOMO VS DONNA */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <UserCheck className="w-4 h-4" /> 1. Differenziazione Fisiologica Target (Uomo vs Donna)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="bg-black/40 border border-amber-500/30 rounded-xl p-4 space-y-2 border-t-2 border-t-amber-500">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-400">👨 Profilo Uomo (Hard BB They)</span>
                    <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">TESTO / GH</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    <b>Cascata Neuro-Endocrina Bosco-Colli:</b><br/>
                    1. <b>CAT Neurale (Testosterone):</b> Grandi composti pesanti a basse reps (10-8-6-4) con massima accelerazione concentrica.<br/>
                    2. <b>Tensione Meccanica:</b> Multiarticolari secondari ad alta tensione continua.<br/>
                    3. <b>Metabolico (GH):</b> Isolamento terminale con bruciore lattacido per stimolare l'asse ipofisario.<br/>
                    4. <b>Struttura P.O.F.</b> (Position of Flexion: Base &rarr; Stretch &rarr; Peak Contraction).
                  </p>
                </div>

                <div className="bg-black/40 border border-pink-500/30 rounded-xl p-4 space-y-2 border-t-2 border-t-pink-500">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-pink-400">👩 Profilo Donna (Glutei & PHA)</span>
                    <span className="text-[9px] font-mono bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded">DRENAGGIO ANTI-STASI</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    <b>Protocollo Fisiologico Specializzato:</b><br/>
                    1. <b>Glutei CAT:</b> Hip Thrust e stacchi con alto reclutamento miofibrillare senza infiammare i quadricipiti.<br/>
                    2. <b>PHA (Peripheral Heart Action):</b> Alternanza continua arti superiori/tronco e arti inferiori per prevenire il ristagno ematico e la cellulite.<br/>
                    3. <b>Pompa Venosa Surale:</b> Attivazione polpacci a fine seduta per favorire il ritorno venoso profondo verso il cuore.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. LE 5 MACRO-FASI DI EMILIO THEY */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-400" /> 2. Le 5 Macro-Fasi di Emilio They
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                <div className="bg-black/30 border border-white/5 rounded-xl p-3 space-y-1">
                  <span className="text-xs font-bold text-white block">Fase 1: Base</span>
                  <span className="text-[10px] text-amber-400 font-mono block">4-6 Settimane</span>
                  <p className="text-[10px] text-zinc-400">CAT Neurale, piramidale diretto 10-8-6-4 e consolidamento carichi submassimali.</p>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-3 space-y-1">
                  <span className="text-xs font-bold text-white block">Fase 2: Avanzata</span>
                  <span className="text-[10px] text-amber-400 font-mono block">6-8 Settimane</span>
                  <p className="text-[10px] text-zinc-400">Cascata neuro-endocrina Bosco-Colli completa e aumento della densità d'urto.</p>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-3 space-y-1">
                  <span className="text-xs font-bold text-white block">Fase 3: Urto/Sblocco</span>
                  <span className="text-[10px] text-amber-400 font-mono block">8-10 Settimane</span>
                  <p className="text-[10px] text-zinc-400">Protocollo P.O.F. completo e Stripping They a 3 scarichi al cedimento.</p>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-3 space-y-1">
                  <span className="text-xs font-bold text-white block">Fase 4: Pre-Contest</span>
                  <span className="text-[10px] text-amber-400 font-mono block">Ultimi 30 Giorni</span>
                  <p className="text-[10px] text-zinc-400">Definizione estrema, gestione carb cycling, separazione e cut idrico.</p>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-3 space-y-1">
                  <span className="text-xs font-bold text-white block">Fase 5: Recovery</span>
                  <span className="text-[10px] text-amber-400 font-mono block">2-4 Settimane</span>
                  <p className="text-[10px] text-zinc-400">Metodo PUMP They: rigenerazione tendinea, capillarizzazione e vascolarizzazione.</p>
                </div>
              </div>
            </div>

            {/* 3. IL MICROCICLO A 4 SETTIMANE & SPECIALIZZAZIONE PMC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2 border-t border-white/5">
              <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Microciclo a 4 Settimane (Ondulazione Mensile)
                </span>
                <ul className="text-xs text-zinc-400 space-y-1 font-mono">
                  <li>&bull; <b>W1: Setup Neurale & CAT:</b> Padroneggiare la traiettoria con carichi all'80%.</li>
                  <li>&bull; <b>W2: Accumulo & Carichi (+):</b> +2.5-5% sui composti pesanti.</li>
                  <li>&bull; <b>W3: Intensificazione / Urto:</b> Serie a cedimento positivo e stripping.</li>
                  <li>&bull; <b>W4: Scarico Attivo (Deload):</b> -40% volume per ripristinare il SNC.</li>
                </ul>
              </div>

              <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Specializzazione Punti Carenti (PMC They)
                </span>
                <p className="text-xs text-zinc-300">
                  Nel metodo They i muscoli carenti vengono posizionati sempre come primo esercizio a inizio settimana e allenati con tecnica P.O.F. specifica prima di qualsiasi affaticamento sistemico.
                </p>
              </div>
            </div>

            {/* GUIDA MATRICE */}
            <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-4 space-y-1.5 text-xs">
              <span className="font-bold text-red-300 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-400" /> Applicazione nella Matrice Macrociclo
              </span>
              <p className="text-zinc-300 leading-relaxed">
                Seleziona <b>Emilio They - Hard Bodybuilding</b> nella testata della Matrice. La griglia calcolerà la piramide decrescente di ripetizioni (10-8-6-4) con carichi proporzionali al tonnellaggio massimale e le 4 settimane ondulate del microciclo.
              </p>
            </div>
          </section>
        )}

        {/* ===================================================================== */}
        {/* SEZIONE SEPARATA: PIERO NOCERINO (T13 & SOVRACCARICO PROGRESSIVO A 4 MESI) */}
        {/* ===================================================================== */}
        {(activeCategory === 'ALL' || activeCategory === 'NOCERINO') && (
          <section className="bg-[#12151B] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            {/* HEADER PIERO NOCERINO */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <Shield className="w-6 h-6" />
                </span>
                <div>
                  <h2 className="text-lg font-black uppercase text-white tracking-wider flex items-center gap-2">
                    Metodo Piero Nocerino &bull; Periodizzazione Progressiva a 4 Mesi (T13)
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Tensione continua senza punti morti, tonnellaggio lineare, split classica a 3 giorni e back-off al 50%.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold self-start sm:self-auto">
                CICLO PROGRESSIVO A 4 MESI
              </span>
            </div>

            {/* I 4 MESI DELLA PERIODIZZAZIONE NOCERINO */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> La Scansione dei 4 Mesi di Progressione
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-black/40 border border-emerald-500/30 rounded-xl p-4 space-y-2 border-t-2 border-t-emerald-500">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-emerald-400">Mese 1: Carico</span>
                    <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">6-8 REPS</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Priorità all'aumento dei carichi submassimali. Serie a 6-8 ripetizioni con recuperi ampi (120-180") sui grandi composti.
                  </p>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2 border-t-2 border-t-blue-500">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-blue-400">Mese 2: Ripetizioni</span>
                    <span className="text-[9px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">8-12 REPS</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    I carichi raggiunti nel Mese 1 vengono mantenuti costanti e si espandono le ripetizioni fino a 10-12 senza calare il peso.
                  </p>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2 border-t-2 border-t-purple-500">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-purple-400">Mese 3: Serie</span>
                    <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">+1 SET / EX</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Incremento del volume: si aggiunge 1 serie allenante a tutti gli esercizi, portandosi a 5-6 serie totali a distretto.
                  </p>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2 border-t-2 border-t-amber-500">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-400">Mese 4: Densità</span>
                    <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">BACK-OFF -50%</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Recuperi compressi a 45-60" e inserimento del Back-off al -50% del carico a 15-20 ripetizioni per la massima deplezione glicogenica.
                  </p>
                </div>
              </div>
            </div>

            {/* LA SPLIT MODULARE CLASSICA A 3 GIORNI DI NOCERINO */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" /> La Split Modulare a 3 Giorni di Piero Nocerino
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide block">
                    Giorno 1: Schiena, Femorali & Bicipiti
                  </span>
                  <ul className="text-[11px] text-zinc-400 space-y-1 font-mono">
                    <li>1. Hyperextension (Warmup): 2x15 (rec 60")</li>
                    <li>2. Stacco da terra: 5x6-8 (rec 180")</li>
                    <li>3. Rematore bilanciere: 5x8 (rec 120")</li>
                    <li>4. Panca lombari peso al petto: 5x12 (rec 30")</li>
                    <li>5. Leg Curl (sdraiato o seduto): 5x12 (rec 120")</li>
                    <li>6. Curl manubri seduto: 5x8 (rec 90")</li>
                  </ul>
                </div>

                <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide block">
                    Giorno 2: Gambe, Lombari & Addome
                  </span>
                  <ul className="text-[11px] text-zinc-400 space-y-1 font-mono">
                    <li>1. Leg Press 45&deg;: 6x20 (rec 180")</li>
                    <li>2. Squat libero o Multipower: 8x12 (rec 180")</li>
                    <li>3. Panca lombari corpo libero: 5x20 (rec 60")</li>
                    <li>4. Crunches al soffitto (palla/disco): 10x20 (rec 45")</li>
                  </ul>
                </div>

                <div className="bg-black/30 border border-white/5 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide block">
                    Giorno 3: Petto, Spalle & Tricipiti
                  </span>
                  <ul className="text-[11px] text-zinc-400 space-y-1 font-mono">
                    <li>1. Panca piana / Chest Press: 5x8 (rec 120")</li>
                    <li>2. Panca inclinata / Spinte: 5x8 (rec 120")</li>
                    <li>3. Cavi incrociati / Croci: 3x20 (rec 60")</li>
                    <li>4. Alzate laterali manubri: 5x15 (rec 60")</li>
                    <li>5. Alzate 90&deg; manubri: 5x12 (rec 60")</li>
                    <li>6. French Press: 5x8 (rec 120")</li>
                    <li>7. French Press Back-Off (-50%): 5x15 (rec 60")</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* GUIDA MATRICE */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-1.5 text-xs">
              <span className="font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Applicazione nella Matrice Macrociclo
              </span>
              <p className="text-zinc-300 leading-relaxed">
                Seleziona <b>Piero Nocerino - Sovraccarico Progressivo</b> nella testata della Matrice. L'algoritmo imposterà la progressione matematica: Mese 1 (Carico), Mese 2 (Reps), Deload centrale a W8, Mese 3 (Serie) e Mese 4 (Densità & Back-off).
              </p>
            </div>
          </section>
        )}

        {(activeCategory === 'ALL' || activeCategory === 'TOPGYM') && (
          <section className="bg-[#12151B] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            {/* INTESTAZIONE SEZIONE */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-[#E50914]/15 text-[#E50914] border border-[#E50914]/30">
                  <Layers className="w-6 h-6" />
                </span>
                <div>
                  <h2 className="text-lg font-black uppercase text-white tracking-wider flex items-center gap-2">
                    Metodo TOP GYM Classico &bull; Manuale Operativo Costruzione Schede
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Linee guida scientifiche per la creazione dei template e la programmazione a 16 e 48 settimane nella Matrice.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold self-start sm:self-auto">
                MASTER SYSTEM &bull; 48 SETTIMANE
              </span>
            </div>

            {/* 1. ARCHITETTURA DELLA SEDUTA: LA TRIADE DEGLI STIMOLI TOP GYM */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Shield className="w-4 h-4" /> 1. Come Costruire la Singola Seduta (La Sequenza degli Stimoli)
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Ogni seduta di allenamento nel Metodo Classico non è un elenco casuale di esercizi, ma segue rigorosamente l'ordine neuromuscolare decrescente:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="bg-black/40 border border-blue-500/30 rounded-xl p-3.5 space-y-2 border-t-2 border-t-blue-500">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-blue-400">1. Stimolo Neurale</span>
                    <span className="text-[9px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">FONDAMENTALE</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    <b>Esercizio Base Multiarticolare:</b> Squat, Panca Piana, Stacco da Terra, Trazioni Sovraccaricate, Lento Avanti con Bilanciere.
                  </p>
                  <ul className="text-[10px] text-zinc-400 space-y-1 font-mono">
                    <li>&bull; <b>Serie & Reps:</b> 5x6 (W1-6) &rarr; 5x8 (W7-10)</li>
                    <li>&bull; <b>Buffer Target:</b> RPE 7.5 &ndash; 8.5 (2-3 RIR)</li>
                    <li>&bull; <b>Recupero:</b> 120 &ndash; 180 secondi</li>
                    <li>&bull; <b>TUT:</b> 2-0-1-0 (massima velocità concentrica)</li>
                  </ul>
                </div>

                <div className="bg-black/40 border border-purple-500/30 rounded-xl p-3.5 space-y-2 border-t-2 border-t-purple-500">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-purple-400">2. Tensione Meccanica</span>
                    <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">IPERTROFICO</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    <b>Multiarticolari Secondari o Macchine:</b> Spinte Panca 30&deg;, Hack Squat, Rematore con Manubri/Pulley, Dip alle Parallele.
                  </p>
                  <ul className="text-[10px] text-zinc-400 space-y-1 font-mono">
                    <li>&bull; <b>Serie & Reps:</b> 4 serie da 8-10 ripetizioni</li>
                    <li>&bull; <b>Intensità:</b> RPE 8.5 &ndash; 9 (1-2 RIR)</li>
                    <li>&bull; <b>Recupero:</b> 90 &ndash; 120 secondi</li>
                    <li>&bull; <b>TUT:</b> 2-0-1-0 controllato sull'eccentrica</li>
                  </ul>
                </div>

                <div className="bg-black/40 border border-emerald-500/30 rounded-xl p-3.5 space-y-2 border-t-2 border-t-emerald-500">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-emerald-400">3. Stress Metabolico</span>
                    <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">ISOLAMENTO</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    <b>Isolamento ai Cavi o Macchine Guidate:</b> Croci ai Cavi, Leg Extension, Alzate Laterali, Pushdown Tricipiti, Curl Cavi.
                  </p>
                  <ul className="text-[10px] text-zinc-400 space-y-1 font-mono">
                    <li>&bull; <b>Serie & Reps:</b> 3-4 serie da 12-15 ripetizioni</li>
                    <li>&bull; <b>Intensità:</b> Cedimento tecnico positivo (RPE 9-10)</li>
                    <li>&bull; <b>Recupero:</b> 45 &ndash; 60 secondi</li>
                    <li>&bull; <b>Tecniche:</b> Stripping, Rest-Pause, 10+MAX</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2. VOLUME SETTIMANALE OTTIMALE (SET TARGET PER DISTRETTO) */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-[#E50914]" /> 2. Volumi Target Settimanali (Serie Allenanti per Gruppo Muscolare)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Petto & Dorso</span>
                  <div className="text-base font-black text-white mt-0.5">14 &ndash; 18 Serie</div>
                  <span className="text-[9px] text-zinc-500 font-mono">5 Neurali + 8 Ipertrofiche + 4 Metaboliche</span>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Cosce (Quad & Femorali)</span>
                  <div className="text-base font-black text-white mt-0.5">16 &ndash; 20 Serie</div>
                  <span className="text-[9px] text-zinc-500 font-mono">5 Neurali + 8 Hack/Pressa + 4 Leg Curl/Ext</span>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Deltoidi (Spalle)</span>
                  <div className="text-base font-black text-white mt-0.5">12 &ndash; 16 Serie</div>
                  <span className="text-[9px] text-zinc-500 font-mono">Focus laterale/posteriore ad alta densità</span>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Braccia (Bicipiti/Tricipiti)</span>
                  <div className="text-base font-black text-white mt-0.5">8 &ndash; 12 Serie Dirette</div>
                  <span className="text-[9px] text-zinc-500 font-mono">Completamento post-trazioni/spinte</span>
                </div>
              </div>
            </div>

            {/* 3. IL MACROCICLO A 3 BLOCCHI (48 SETTIMANE) */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" /> 3. La Timeline Annuale a 3 Blocchi (48 Settimane)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2 border-t-2 border-t-[#E50914]">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wide block">
                    Blocco 1: Forza Ipertrofica (W1 - W16)
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Costruzione del tonnellaggio e della capacità di reclutamento neurale:
                  </p>
                  <ul className="text-[11px] text-zinc-400 space-y-1 font-mono">
                    <li>&bull; <b>W1-W6:</b> Accumulo Volumetrico (5x6 @ RPE 7.5, buffer 2-3)</li>
                    <li>&bull; <b>W7-W10:</b> Conversione Ipertrofica (5x8 @ RPE 8.5)</li>
                    <li>&bull; <b>W11:</b> Scarico Fisiologico SNC (-40% volume)</li>
                    <li>&bull; <b>W12-W15:</b> Picco Neurale (4x3-4 @ RPE 9.5)</li>
                    <li>&bull; <b>W16:</b> Tapering & Test Massimali (1RM)</li>
                  </ul>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2 border-t-2 border-t-amber-500">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide block">
                    Blocco 2: Trasformazione / Ibrido (W17 - W32)
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Conversione della forza massimale in densità e tensione continua:
                  </p>
                  <ul className="text-[11px] text-zinc-400 space-y-1 font-mono">
                    <li>&bull; <b>W17-W22:</b> Volume Ipertrofico con Stripping terminale</li>
                    <li>&bull; <b>W23-W25:</b> Heavy Duty + Back-Off a cedimento</li>
                    <li>&bull; <b>W26:</b> Deload & Scarico Articolare attivo</li>
                    <li>&bull; <b>W27-W32:</b> Densità Massima e recuperi ridotti</li>
                  </ul>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2 border-t-2 border-t-emerald-500">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide block">
                    Blocco 3: Qualità Muscolare (W33 - W48)
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Massima separazione, vascolarizzazione e saturazione glicogenica:
                  </p>
                  <ul className="text-[11px] text-zinc-400 space-y-1 font-mono">
                    <li>&bull; <b>W33-W38:</b> Accumulo ad Alta Densità (Metodo 10+MAX)</li>
                    <li>&bull; <b>W39-W41:</b> Rest-Pause intensivo su macchine</li>
                    <li>&bull; <b>W42:</b> Scarico Fisiologico Metabolico</li>
                    <li>&bull; <b>W43-W48:</b> Pompaggio terminale e Isometrie di picco</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. GUIDA PRATICA: COME USARE LA MATRICE PER QUESTO METODO */}
            <div className="bg-gradient-to-r from-red-950/20 via-black/40 to-black/40 border border-[#E50914]/30 rounded-xl p-4 space-y-2">
              <span className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E50914]" /> Istruzioni Operative per il Coach nella Matrice
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                1. <b>Carica il Template Split:</b> Seleziona una delle split del catalogo (es. 4 giorni A/B/C/D).<br/>
                2. <b>Apri la Matrice Macrociclo:</b> Nel selettore in alto seleziona <i>TopGym Metodo Classico (16 Settimane)</i>.<br/>
                3. <b>Verifica la Progressione Automatica:</b> L'algoritmo imposterà automaticamente W1-6 a 5x6 con buffer, W7-10 a 5x8, il deload a W11 e il picco a W12-15.<br/>
                4. <b>Personalizzazione & Salvataggio:</b> Modifica carichi o note se desiderato e clicca su <b>"SALVA TUTTE LE SETTIMANE"</b> per serializzare l'intero piano su Supabase. L'atleta vedrà subito il microciclo perfettamente sincronizzato.
              </p>
            </div>
          </section>
        )}

      {/* SEZIONE 5: JACOB WILSON & JEREMY FITSCHEN (2014) */}
      {(activeCategory === 'ALL' || activeCategory === 'WILSON') && (
        <section className="bg-[#12151B] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Scale className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-black uppercase text-white tracking-wider">
                  Jacob Wilson & Jeremy Fitschen (2014) &bull; Tabelle 7.4 / 7.5 / 7.6
                </h2>
                <p className="text-xs text-zinc-400">
                  Wave Loading, modulazione scientifica RPE/RIR e reset dei plateau (T29 - T33).
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold">
              PEER-REVIEWED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wide block">
                Tabella 7.4: Wave Loading (PAP)
              </span>
              <p className="text-xs text-zinc-300">
                Sfrutta il potenziamento post-attivazione tramite due onde successive nello stesso esercizio:
              </p>
              <div className="text-[11px] font-mono text-zinc-400 bg-black/60 p-2.5 rounded-lg border border-white/5 space-y-1">
                <div><b>Onda 1:</b> 5 reps (80%) &bull; 3 reps (85%) &bull; 1 rep (90%)</div>
                <div><b>Pausa:</b> 3 minuti di recupero completo</div>
                <div><b>Onda 2:</b> 5 reps (82.5%) &bull; 3 reps (87.5%) &bull; 1 rep (92.5%)</div>
              </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wide block">
                Tabella 7.5: Modulazione RPE / RIR
              </span>
              <p className="text-xs text-zinc-300">
                Correlazione diretta tra ripetizioni in riserva e stimolo allenante ottimale:
              </p>
              <div className="text-[11px] font-mono text-zinc-400 bg-black/60 p-2.5 rounded-lg border border-white/5 space-y-1">
                <div>&bull; <b>RPE 7 (RIR 3):</b> Recupero attivo / Velocità (CAT)</div>
                <div>&bull; <b>RPE 8 (RIR 2):</b> Ipertrofia sostenibile senza fatica cronica</div>
                <div>&bull; <b>RPE 9 (RIR 1):</b> Tensione massima / Reclutamento totale</div>
                <div>&bull; <b>RPE 10 (RIR 0):</b> Cedimento concentrico reale</div>
              </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wide block">
                Tabella 7.6: Reset Anti-Plateau
              </span>
              <p className="text-xs text-zinc-300">
                Protocollo da applicare quando il carico stagna per più di 2 microcicli consecutivi:
              </p>
              <div className="text-[11px] font-mono text-zinc-400 bg-black/60 p-2.5 rounded-lg border border-white/5 space-y-1">
                <div>1. Taglio del 10% del carico target</div>
                <div>2. Reset a 3 serie fisse con aumento di 1 rep</div>
                <div>3. Risalita a step di +2.5% ogni sessione</div>
                <div>4. Superamento del vecchio massimale a W4</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SEZIONE 6: ERIC HELMS (THE MUSCLE AND STRENGTH PYRAMID) */}
      {(activeCategory === 'ALL' || activeCategory === 'HELMS') && (
        <section className="bg-[#12151B] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <TrendingUp className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-black uppercase text-white tracking-wider">
                  Eric Helms &bull; The Muscle & Strength Training Pyramid
                </h2>
                <p className="text-xs text-zinc-400">
                  Gerarchia scientifica dei fattori di crescita: volume settimanale, intensità e progressione periodizzata (T27, T31).
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-bold">
              PIRAMIDE SCIENTIFICA
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl space-y-1.5">
              <span className="font-bold text-indigo-400 uppercase tracking-wider block">1. Aderenza & Frequenza</span>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Frequenza minima 2 volte a settimana per gruppo muscolare per massimizzare la sintesi proteica muscolare (MPS).
              </p>
            </div>
            <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl space-y-1.5">
              <span className="font-bold text-indigo-400 uppercase tracking-wide block">2. Volume Settimanale</span>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Range ottimale compreso tra 10 e 20 serie allenanti per distretto a settimana con effort ad almeno RIR 1-3.
              </p>
            </div>
            <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl space-y-1.5">
              <span className="font-bold text-indigo-400 uppercase tracking-wide block">3. Doppia Progressione</span>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Fissare un range (es. 8-12 reps). Raggiungere il tetto massimo in tutte le serie prima di incrementare il carico del 2-5%.
              </p>
            </div>
            <div className="bg-black/40 border border-white/5 p-3.5 rounded-xl space-y-1.5">
              <span className="font-bold text-indigo-400 uppercase tracking-wide block">4. Selezione & Recuperi</span>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Priorità a catene cinematiche stabili, recuperi superiori a 2 minuti sui composti pesanti per prevenire l'affaticamento centrale.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SEZIONE 7: PROTOCOLLI DONNA / BIKINI & SALUTE POSTURALE */}
      {(activeCategory === 'ALL' || activeCategory === 'DONNA') && (
        <section className="bg-[#12151B] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <HeartPulse className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-black uppercase text-white tracking-wider">
                  Programmazione Femminile (Bikini Wave) & Salute Rachide
                </h2>
                <p className="text-xs text-zinc-400">
                  Specializzazione glutei, salvaguardia circolatoria anti-stasi flebo-linfatica e decompressione del rachide.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30 font-bold">
              BIKINI & POSTURA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wide flex items-center gap-2">
                <Award className="w-4 h-4" /> Principi Bikini Wave & Specializzazione Glutei
              </h3>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc pl-4">
                <li><b>Priorità Vettore Orizzontale:</b> Enfatizzare Hip Thrust, Glute Bridge e Kickback al cavo dove la tensione massima è in accorciamento.</li>
                <li><b>Prevenzione Ipertrofia Quadricipiti:</b> Piede alto e largo alla pressa, box squat guidati e stacco rumeno a ginocchio semiflesso.</li>
                <li><b>Circolazione & Pompa Venosa:</b> Esercizi per polpacci a fine sessione o camminata inclinata per attivare la soletta di Lejars e ridurre la ritenzione idrica.</li>
                <li><b>Enfasi Deltoidi Laterali:</b> Lavoro ad alta frequenza (2-3x a settimana) per esaltare la linea a V e la silhouette estetica.</li>
              </ul>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wide flex items-center gap-2">
                <Shield className="w-4 h-4" /> Decompressione del Rachide & Carico Assiale
              </h3>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc pl-4">
                <li><b>Monitoraggio Carico Assiale:</b> Alternare squat e stacco pesante con leg press orizzontale o stacco manubri per non sovraccaricare il tratto lombare.</li>
                <li><b>Core Anti-Rotazionale:</b> Sostituire sit-up aggressivi con Pallof press, dead-bug, bird-dog e plank isometrici a diaframma attivo.</li>
                <li><b>Trazione Gravitazionale:</b> Appendimenti alla sbarra ed estensioni su panca a 45 gradi con bacino bloccato per distendere le vertebre a fine seduta.</li>
                <li><b>Scoliosi Sicura:</b> Evitare torsioni con carichi compressivi; preferire macchine a camme con supporto toracico (Seal Row, Chest Press).</li>
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
