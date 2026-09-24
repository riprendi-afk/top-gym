// components/TopGymClassicCabina.tsx
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
      title: 'Blocco 1: Forza Ipertrofica',
      badge: 'Neurale & Buffer',
      icon: Shield,
      accent: 'border-blue-500/40 text-blue-400',
      activeBg: 'bg-blue-500/10 border-blue-500 ring-1 ring-blue-500',
      desc: 'Consolida gli schemi motori, costruisce efficienza neurale e alza i carichi base. Lavoro a Buffer controllato.'
    },
    {
      id: 'BLOCCO_2_TRASFORMAZIONE' as ClassicBlock,
      title: 'Blocco 2: Trasformazione',
      badge: 'Ibrido & Back-off',
      icon: Zap,
      accent: 'border-[#E50914]/40 text-[#E50914]',
      activeBg: 'bg-[#E50914]/10 border-[#E50914] ring-1 ring-[#E50914]',
      desc: 'Lavoro ibrido pesante + back-off. Si spinge l\'effort fino al cedimento concentrico nei complementari.'
    },
    {
      id: 'BLOCCO_3_QUALITA' as ClassicBlock,
      title: 'Blocco 3: Qualità Muscolare',
      badge: 'Intensità & Densità',
      icon: Flame,
      accent: 'border-amber-500/40 text-amber-400',
      activeBg: 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500',
      desc: 'Massimo stimolo metabolico e densità. Tecniche di intensità pesanti (Stripping, Rest-Pause, Cedimento).'
    }
  ];

  return (
    <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md space-y-6">
      
      {/* HEADER CABINA CLASSICA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#E50914]" /> Cabina di Regia Periodizzazione · Metodo TOPGYM
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Motore scientifico: <b>Volume Landmarks (MEV / MAV / MRV)</b>, Macroblocchi e Microcicli progressivi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-mono bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
            Atleta: <b className="text-white">{activeAthlete.displayName}</b>
          </span>
          <span className="text-xs font-mono bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/20 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Fase Auto: {calculatedCurrentPhase}
          </span>
        </div>
      </div>

      {/* SEZIONE 1: SCELTA DEL BLOCCO / MESOCICLO */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
          1. Seleziona Mesociclo / Macroblocco Attivo:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {blocksConfig.map(b => {
            const isSelected = currentBlock === b.id;
            const IconComp = b.icon;

            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setCurrentBlock(b.id)}
                className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? `${b.activeBg} text-white shadow-xl`
                    : 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:bg-zinc-900/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`p-1.5 rounded-lg bg-black/40 border border-white/5 ${isSelected ? 'text-white' : 'text-zinc-500'}`}>
                      <IconComp className="w-4 h-4" />
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${isSelected ? 'bg-white/10 text-white border-white/20' : 'bg-black/20 text-zinc-500 border-white/5'}`}>
                      {b.badge}
                    </span>
                  </div>
                  <b className={`text-xs block font-black ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                    {b.title}
                  </b>
                  <p className="text-[10px] text-zinc-400 mt-1.5 leading-relaxed">
                    {b.desc}
                  </p>
                </div>

                {isSelected && (
                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Blocco Selezionato
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SEZIONE 2: FASI DEL MICROCICLO & AZIONI MOTORE */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
            2. Fasi del Microciclo (Settimane di Carico & Scarico):
          </label>

          {/* TOOLBAR PULSANTI AZIONE */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <button
              type="button"
              onClick={onApplyEngine}
              className="text-xs bg-[#E50914] hover:bg-[#b80710] text-white px-3.5 py-2 rounded-xl font-black flex items-center justify-center gap-1.5 shadow-lg shadow-red-900/30 cursor-pointer transition active:scale-95 flex-1 sm:flex-initial"
            >
              <Sparkles className="w-3.5 h-3.5" /> Applica Progressione Motore
            </button>

            <button
              type="button"
              onClick={onApplyDeload}
              className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 px-3 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 flex-1 sm:flex-initial"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Scarico Forzato
            </button>

            <button
              type="button"
              onClick={onOpenTemplateModal}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 px-3.5 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 flex-1 sm:flex-initial"
            >
              <Layers className="w-3.5 h-3.5 text-[#E50914]" /> Template Split (1-14)
            </button>
          </div>
        </div>

        {/* GRIGLIA DELLE 4 FASI */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {([1, 2, 3, 4] as MicroWeek[]).map(w => {
            const desc = getPhaseDescription(currentBlock, w);
            const isCalculatedAuto = calculatedCurrentPhase === w;

            return (
              <button
                key={w}
                type="button"
                onClick={() => setManualWeek(w)}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isCalculatedAuto
                    ? 'bg-[#E50914] border-[#E50914] text-white shadow-xl shadow-red-900/40 ring-2 ring-red-400/40'
                    : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[9px] font-black uppercase tracking-wider font-mono ${isCalculatedAuto ? 'text-white/80' : 'text-zinc-500'}`}>
                      Fase {w}
                    </span>
                    {isCalculatedAuto && (
                      <span className="text-[8px] bg-white text-black font-black px-1.5 py-0.5 rounded uppercase">
                        Attiva
                      </span>
                    )}
                  </div>
                  <b className={`text-xs block ${isCalculatedAuto ? 'text-white' : 'text-zinc-200'}`}>
                    {desc.title}
                  </b>
                </div>

                <span className={`text-[10px] block mt-2 leading-snug ${isCalculatedAuto ? 'text-white/90' : 'text-zinc-500'}`}>
                  {desc.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}