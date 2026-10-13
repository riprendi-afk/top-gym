'use client';

import React from 'react';
import {
  Shield, Zap, Flame, RefreshCw, Layers,
  CheckCircle2, Sparkles, SlidersHorizontal, Activity
} from 'lucide-react';

export type ClassicBlock = 'BLOCCO_1_FORZA' | 'BLOCCO_2_TRASFORMAZIONE' | 'BLOCCO_3_QUALITA';
export type MicroWeek = 1 | 2 | 3 | 4;

interface TopGymClassicCabinaProps {
  activeAthlete: { displayName: string };
  currentBlock: ClassicBlock;
  setCurrentBlock: (block: ClassicBlock) => void;
  calculatedCurrentPhase: number;
  setManualWeek: (week: MicroWeek) => void;
  getPhaseDescription: (block: ClassicBlock, week: MicroWeek) => { title: string; desc: string };
  onApplyEngine: () => void;
  onApplyDeload: () => void;
  onOpenTemplateModal: () => void;
}

export default function TopGymClassicCabina({
  activeAthlete,
  currentBlock,
  setCurrentBlock,
  calculatedCurrentPhase,
  setManualWeek,
  getPhaseDescription,
  onApplyEngine,
  onApplyDeload,
  onOpenTemplateModal
}: TopGymClassicCabinaProps) {

  const blocksConfig = [
    {
      id: 'BLOCCO_1_FORZA' as ClassicBlock,
      shortTitle: '1. Forza Ipertrofica',
      badge: 'Neurale',
      icon: Shield,
      accent: 'text-blue-400',
      activeClass: 'bg-blue-600/20 text-white border-blue-500 shadow-md shadow-blue-950/50',
    },
    {
      id: 'BLOCCO_2_TRASFORMAZIONE' as ClassicBlock,
      shortTitle: '2. Trasformazione',
      badge: 'Ibrido',
      icon: Zap,
      accent: 'text-[#E50914]',
      activeClass: 'bg-[#E50914]/20 text-white border-[#E50914] shadow-md shadow-red-950/50',
    },
    {
      id: 'BLOCCO_3_QUALITA' as ClassicBlock,
      shortTitle: '3. Qualità Muscolare',
      badge: 'Intensità',
      icon: Flame,
      accent: 'text-amber-400',
      activeClass: 'bg-amber-600/20 text-white border-amber-500 shadow-md shadow-amber-950/50',
    }
  ];

  const phaseNames: Record<MicroWeek, string> = {
    1: 'Accumulo',
    2: 'Conversione',
    3: 'Scarico (Deload)',
    4: 'Intensificazione'
  };

  const activePhaseInfo = getPhaseDescription(currentBlock, (calculatedCurrentPhase as MicroWeek) || 1);

  return (
    <div className="bg-[#12151B] p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md space-y-3.5">
      
      {/* RIGA 1: HEADER COMPATTO + MOTORI AZIONE INTEGRATI */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E50914]/15 border border-[#E50914]/30 text-[#E50914]">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <span className="text-xs font-black text-white uppercase tracking-wider">
              Cabina Periodizzazione
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono bg-black/40 px-2.5 py-1 rounded-lg border border-white/5 text-zinc-300">
              Atleta: <b className="text-white">{activeAthlete.displayName}</b>
            </span>
            <span className="text-[11px] font-mono bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/20 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5">
              <Activity className="w-3 h-3" /> Fase Auto: {calculatedCurrentPhase}
            </span>
          </div>
        </div>

        {/* TOOLBAR MOTORI AZIONE */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onApplyEngine}
            className="text-xs bg-[#E50914] hover:bg-[#b80710] text-white px-3 py-1.5 rounded-xl font-black flex items-center gap-1.5 shadow-md shadow-red-900/30 cursor-pointer transition active:scale-95"
            title="Applica l'algoritmo di progressione al programma"
          >
            <Sparkles className="w-3.5 h-3.5" /> Applica Progressione
          </button>

          <button
            type="button"
            onClick={onApplyDeload}
            className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition active:scale-95"
            title="Forza lo scarico attivo per questa settimana"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Scarico Forzato
          </button>

          <button
            type="button"
            onClick={onOpenTemplateModal}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition active:scale-95"
            title="Apri il catalogo dei template split"
          >
            <Layers className="w-3.5 h-3.5 text-[#E50914]" /> Template Split (1-14)
          </button>
        </div>
      </div>

      {/* RIGA 2: COMMAND BAR A PILLOLE ORIZZONTALI (MESOCICLO & MICROCICLO) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-center">
        
        {/* SELETTORE MESOCICLO A PILLOLE (5 COLONNE SU XL) */}
        <div className="xl:col-span-5 space-y-1.5">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Mesociclo Attivo:
          </span>
          <div className="grid grid-cols-3 gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
            {blocksConfig.map(b => {
              const isSelected = currentBlock === b.id;
              const IconComp = b.icon;

              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setCurrentBlock(b.id)}
                  className={`px-2 py-2 rounded-lg text-left transition cursor-pointer border flex flex-col justify-center ${
                    isSelected
                      ? b.activeClass
                      : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="flex items-center gap-1.5 text-xs font-black truncate">
                      <IconComp className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : b.accent}`} />
                      <span className="truncate">{b.shortTitle}</span>
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono mt-0.5 uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-zinc-500'}`}>
                    {b.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SELETTORE FASI MICROCICLO (7 COLONNE SU XL) */}
        <div className="xl:col-span-7 space-y-1.5">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Fase Microciclo (Settimana di carico/scarico):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
            {([1, 2, 3, 4] as MicroWeek[]).map(w => {
              const isSelected = calculatedCurrentPhase === w;

              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => setManualWeek(w)}
                  className={`px-2.5 py-2 rounded-lg text-left transition cursor-pointer border flex flex-col justify-center ${
                    isSelected
                      ? 'bg-[#E50914] text-white border-[#E50914] shadow-md shadow-red-950/60 ring-1 ring-red-400/50'
                      : 'border-transparent text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
                      Fase {w}
                    </span>
                    {isSelected && (
                      <span className="text-[8px] bg-white text-[#E50914] font-black px-1 rounded uppercase">
                        ON
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-black truncate mt-0.5 ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                    {phaseNames[w]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TICKER INFORMATIVO A LINEA SINGOLA (PRESERVA LA TEORIA SCIENTIFICA SENZA OCCUPARE SPAZIO) */}
      <div className="bg-black/30 border border-white/5 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
        <span className="text-[11px] font-bold text-zinc-300 shrink-0">{activePhaseInfo.title}:</span>
        <span className="text-[11px] text-zinc-400 truncate">{activePhaseInfo.desc}</span>
      </div>

    </div>
  );
}
