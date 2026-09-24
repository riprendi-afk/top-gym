// components/HardTopGymCabina.tsx
'use client';

import React, { useState } from 'react';
import { 
  Flame, Zap, Trophy, ShieldCheck, 
  Dumbbell, CheckCircle2, Sliders, Calendar
} from 'lucide-react';
import { 
  HardPhase, 
  HardSplit, 
  generateHardTopGymProgram 
} from '@/lib/hardtopgym-engine';

interface HardTopGymCabinaProps {
  activeAthlete: { displayName: string };
  onApplyProgram: (newDays: any[]) => void;
}

export default function HardTopGymCabina({
  activeAthlete,
  onApplyProgram
}: HardTopGymCabinaProps) {
  const [phase, setPhase] = useState<HardPhase>('PHASE_2_ADVANCED');
  const [split, setSplit] = useState<HardSplit>('4_DAYS');
  const [weakPoint, setWeakPoint] = useState('Cosce/Femorali');
  const [contestDaysLeft, setContestDaysLeft] = useState(30);

  const handleGenerateAndApply = () => {
    const generated = generateHardTopGymProgram(phase, split, weakPoint, contestDaysLeft);
    onApplyProgram(generated);
  };

  return (
    <div className="bg-[#12151B] p-6 rounded-2xl border border-amber-500/30 shadow-2xl backdrop-blur-md space-y-6">
      
      {/* HEADER CABINA HARDTOPGYM */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-base font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" /> Cabina di Regia · Metodo HARDTOPGYM
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Sintesi Metodologica: <b>Emilio They</b> (Hard Bodybuilding) & <b>Bosco-Colli</b> (Cascata Neuro-Endocrina).
          </p>
        </div>
        <span className="text-xs text-zinc-400 font-mono bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
          Atleta: <b className="text-white">{activeAthlete.displayName}</b>
        </span>
      </div>

      {/* 1. SELEZIONE DELLE 5 MACRO-FASI DI EMILIO THEY */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
          1. Seleziona Macro-Fase del Ciclo They:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {[
            { id: 'PHASE_1_BASE', title: 'Fase 1: Base', subtitle: '4-6 sett · Bulk & CAT Neurale' },
            { id: 'PHASE_2_ADVANCED', title: 'Fase 2: Avanzata', subtitle: '6-8 sett · Antagonisti & Ibrido' },
            { id: 'PHASE_3_DEEP_SHOCK', title: 'Fase 3: Urto/Sblocco', subtitle: '8-10 sett · P.O.F. & Stripping' },
            { id: 'PHASE_4_PRE_CONTEST', title: 'Fase 4: Pre-Gara', subtitle: 'Ultimi 30 gg · Carbing Down/Up' },
            { id: 'PHASE_5_RECOVERY', title: 'Fase 5: Post-Gara', subtitle: '2-4 sett · Metodo PUMP' },
          ].map(item => {
            const isSelected = phase === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPhase(item.id as HardPhase)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-900/30'
                    : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <b className={`text-xs block ${isSelected ? 'text-amber-400' : 'text-zinc-200'}`}>
                  {item.title}
                </b>
                <span className="text-[10px] text-zinc-500 block mt-1">
                  {item.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. PARAMETRI AGGIUNTIVI (SPLIT, PMC & PRE-GARA) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-black/30 p-4 rounded-xl border border-white/5">
        <div>
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
            Suddivisione Split Settimanale
          </label>
          <select
            value={split}
            onChange={e => setSplit(e.target.value as HardSplit)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-amber-400"
          >
            <option value="3_DAYS">3 Giorni (Costruzione Base / Spinta-Trazione-Gambe)</option>
            <option value="4_DAYS">4 Giorni (Split Antagonisti They / Upper-Lower)</option>
            <option value="5_DAYS_PMC">5 Giorni (Specializzazione PMC Punti Carenti)</option>
            <option value="6_DAYS_MONO">6 Giorni (Monomuscolare Off-Season / Pre-Gara)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
            Punto Carente (PMC Potenziale di Crescita)
          </label>
          <select
            value={weakPoint}
            onChange={e => setWeakPoint(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-amber-400"
          >
            <option value="Cosce/Femorali">Cosce & Catena Posteriore</option>
            <option value="Braccia">Braccia (Bicipiti / Tricipiti)</option>
            <option value="Deltoidi">Spalle & Deltoidi Posteriori</option>
            <option value="Dorso">Dorso & Spessore Schiena</option>
            <option value="Petto">Petto & Cassa Toracica</option>
          </select>
        </div>

        {phase === 'PHASE_4_PRE_CONTEST' ? (
          <div>
            <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5">
              Countdown al D-Day (Giorni Mancanti)
            </label>
            <input
              type="number"
              min="0"
              max="30"
              value={contestDaysLeft}
              onChange={e => setContestDaysLeft(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-zinc-900 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold outline-none focus:border-amber-400"
            />
          </div>
        ) : (
          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Cascata Neuro-Endocrina Bosco-Colli
            </label>
            <div className="text-[11px] text-zinc-400 font-mono py-1.5 flex items-center gap-1.5">
              <span className="text-blue-400 font-bold">1. Testo (CAT)</span> →
              <span className="text-emerald-400 font-bold">2. Mecc</span> →
              <span className="text-amber-400 font-bold">3. GH (Latt.)</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. TASTO AZIONE DI CARICAMENTO SCHEDA */}
      <button
        type="button"
        onClick={handleGenerateAndApply}
        className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-xl shadow-amber-900/30 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
      >
        <Zap className="w-4 h-4 fill-black" />
        Genera & Carica Scheda HARDTOPGYM ({activeAthlete.displayName})
      </button>

    </div>
  );
}