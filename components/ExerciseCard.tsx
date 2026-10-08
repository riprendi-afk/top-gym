'use client';

import React, { useMemo, useState } from 'react';
import { ChevronUp, ChevronDown, CheckCircle, Copy, Plus, Trash2, Info, Dumbbell, Repeat, Target, Clock, Zap, History } from 'lucide-react';
import type { Exercise, SetLog, ExecutionType } from '@/app/page.tsx';

interface ExerciseCardProps {
  ex: Exercise;
  isSelected: boolean;
  onSelect: () => void;
  todayLogs: SetLog[];
  isMasterProgram: boolean;
  isBw: boolean;
  getBadgeStyle: (type: ExecutionType) => string;
  estimated1RMPreview: number | null;
  currentIntensityPreview: { pct: number; label: string; colorClasses: string } | null;
  lastLoggedSet: SetLog | null;
  handleAutoFillLastLog: () => void;
  currentBodyweightConfig: { percentage: number } | null;
  sessionBodyWeight: number | null;
  weight: string;
  setWeight: (val: string) => void;
  adjustWeight: (delta: number) => void;
  reps: string;
  setReps: React.Dispatch<React.SetStateAction<string>>;
  rpe: string;
  setRpe: (val: string) => void;
  handleLogSet: (e: React.SyntheticEvent) => void;
  handleDeleteLog: (id: string) => void;
  getIntensityInfo: (exName: string, weight: number) => { pct: number; label: string; colorClasses: string } | null;
}

export function ExerciseCard({
  ex, isSelected, onSelect, todayLogs, isMasterProgram, isBw, getBadgeStyle,
  estimated1RMPreview, currentIntensityPreview, lastLoggedSet, handleAutoFillLastLog,
  currentBodyweightConfig, sessionBodyWeight, weight, setWeight, adjustWeight,
  reps, setReps, rpe, setRpe, handleLogSet, handleDeleteLog, getIntensityInfo,
}: ExerciseCardProps) {
  
  const [showNotes, setShowNotes] = useState(false);
  const exerciseLogs = useMemo(() => todayLogs.filter(l => l.exerciseName === ex.name), [todayLogs, ex.name]);
  const hasLoggedToday = exerciseLogs.length > 0;
  const isFinished = exerciseLogs.length >= ex.sets;

  return (
    <div 
      onClick={onSelect} 
      className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden ${
        isSelected ? 'md:col-span-2 bg-[#12151B] border-[#E50914] shadow-[0_0_20px_rgba(229,9,20,0.1)]' : 'bg-zinc-900/40 border-white/5 cursor-pointer hover:bg-zinc-800/40'
      }`}
    >
      {isSelected && <div className="absolute top-0 left-0 w-1 h-full bg-[#E50914]" />}

      {/* HEADER VISIVO */}
      <div className="flex justify-between items-start gap-2 select-none pl-1">
        <div className="w-full">
          <div className="flex justify-between items-center w-full">
            <span className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              {isFinished && !isSelected ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : null}
              {ex.name}
            </span>
            <div className="text-zinc-500">{isSelected ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4" />}</div>
          </div>

          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {(isMasterProgram || ex.executionType !== 'REGULAR') && (
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${getBadgeStyle(ex.executionType)}`}>
                {ex.executionType}
              </span>
            )}
            {isBw && (
              <span className="text-[8px] text-purple-400 font-bold uppercase border border-purple-500/20 rounded px-1.5 py-0.5">BW</span>
            )}
            {/* MINI TRACKER "IG STORIES" (Visibile solo a card chiusa per capire a colpo d'occhio) */}
            {!isSelected && (
              <div className="flex gap-0.5 ml-2">
                {Array.from({ length: ex.sets }).map((_, idx) => (
                  <div key={idx} className={`w-3 h-1 rounded-full ${idx < exerciseLogs.length ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DETTAGLI & LOGGER (VISIBILI SOLO SE SELEZIONATO) */}
      {isSelected && (
        <div onClick={(e) => e.stopPropagation()} className="mt-3 pt-3 border-t border-white/5 space-y-4 cursor-default">
          
          {/* TRACKER SERIE VISIVO LUMINOSO (Sostituisce il testo "1 di 4") */}
          <div className="flex gap-1.5 w-full">
            {Array.from({ length: ex.sets }).map((_, idx) => {
              const isCompleted = idx < exerciseLogs.length;
              const isCurrent = idx === exerciseLogs.length;
              return (
                <div 
                  key={idx} 
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    isCompleted ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                    isCurrent ? 'bg-[#E50914] animate-pulse shadow-[0_0_8px_rgba(229,9,20,0.5)]' : 
                    'bg-zinc-800'
                  }`} 
                />
              );
            })}
          </div>

          {/* CRUSCOTTO INFO TARGET (Icone al posto dei testi) */}
          <div className="flex items-center justify-between bg-black/40 px-3 py-2.5 rounded-xl border border-white/5">
             <div className="flex items-center gap-3">
               <span className="flex items-center gap-1 text-xs text-white font-black"><Target className="w-3.5 h-3.5 text-blue-400"/> {ex.sets}×{ex.reps}</span>
               <span className="flex items-center gap-1 text-xs text-white font-black"><Dumbbell className="w-3.5 h-3.5 text-amber-400"/> {ex.targetWeight}</span>
             </div>
             <span className="flex items-center gap-1 text-xs text-white font-black font-mono"><Clock className="w-3.5 h-3.5 text-zinc-400"/> {isMasterProgram ? ex.tut : `${ex.restSeconds}s`}</span>
          </div>

          {/* NOTE A SCOMPARSA VISIVA */}
          {ex.notes && (
            <div className="bg-blue-950/20 p-2 rounded-lg border border-blue-900/30 text-[10px] text-zinc-400">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowNotes(!showNotes)}>
                 <span className="font-bold flex items-center gap-1 text-blue-400"><Info className="w-3.5 h-3.5"/> Direttive Coach</span>
                 <span className="text-zinc-500">{showNotes ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}</span>
              </div>
              {showNotes && <div className="mt-2 text-zinc-300 leading-relaxed border-t border-blue-900/30 pt-2">{ex.notes}</div>}
            </div>
          )}

          {/* RIGA ULTIMA VOLTA COMPATTA */}
          {lastLoggedSet && (
            <div className="flex items-center justify-between bg-zinc-900/60 p-2 rounded-lg border border-white/5">
              <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                <History className="w-3 h-3 text-zinc-500"/>
                <b className="text-white">{lastLoggedSet.externalLoad ?? lastLoggedSet.weight}kg × {lastLoggedSet.reps}</b> (RPE {lastLoggedSet.rpe})
              </span>
              <button type="button" onClick={handleAutoFillLastLog} className="text-[#E50914] text-[10px] font-bold uppercase flex items-center gap-1 active:scale-95"><Copy className="w-3 h-3"/> Copia</button>
            </div>
          )}

          {/* FORM CONTROLLI THUMB-ZONE (Colori & Icone al posto dei Titoli) */}
          <form onSubmit={handleLogSet} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              
              {/* Box Carico: Icona Dumbbell + Stepper */}
              <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                <div className="flex justify-center mb-1"><Dumbbell className="w-4 h-4 text-zinc-500" /></div>
                <input type="number" step="0.5" min="0" inputMode="decimal" required value={weight} onChange={e => setWeight(e.target.value)} placeholder={(ex.targetWeight || '0').toString()} className="w-full text-center text-xl font-black text-white bg-zinc-900 border border-white/10 rounded-lg py-1 outline-none focus:border-[#E50914] transition-all" />
                <div className="grid grid-cols-4 gap-1 mt-1.5">
                  <button type="button" onClick={() => adjustWeight(-5)} className="bg-zinc-800 rounded py-1 text-[10px] font-bold text-zinc-400 active:bg-zinc-700">-5</button>
                  <button type="button" onClick={() => adjustWeight(-2.5)} className="bg-zinc-800 rounded py-1 text-[10px] font-bold text-zinc-400 active:bg-zinc-700">-2</button>
                  <button type="button" onClick={() => adjustWeight(2.5)} className="bg-zinc-800 rounded py-1 text-[10px] font-bold text-emerald-400 active:bg-emerald-900/50">+2</button>
                  <button type="button" onClick={() => adjustWeight(5)} className="bg-zinc-800 rounded py-1 text-[10px] font-bold text-emerald-400 active:bg-emerald-900/50">+5</button>
                </div>
              </div>

              {/* Box Reps: Icona Repeat + Stepper */}
              <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                <div className="flex justify-center mb-1"><Repeat className="w-4 h-4 text-zinc-500" /></div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => setReps(p => Math.max(1, (parseInt(p)||0)-1).toString())} className="w-8 bg-zinc-800 rounded text-sm font-bold text-white active:bg-zinc-700">-</button>
                  <input type="number" min="1" inputMode="numeric" required value={reps} onChange={e => setReps(e.target.value)} placeholder={(parseInt(String(ex.reps), 10) || 8).toString()} className="w-full text-center text-xl font-black text-white bg-zinc-900 border border-white/10 rounded-lg py-1 outline-none focus:border-[#E50914] transition-all" />
                  <button type="button" onClick={() => setReps(p => ((parseInt(p)||0)+1).toString())} className="w-8 bg-zinc-800 rounded text-sm font-bold text-emerald-400 active:bg-emerald-900/50">+</button>
                </div>
                <div className="grid grid-cols-4 gap-1 mt-1.5">
                  {(() => {
                    const t = parseInt(String(ex.reps), 10) || 8;
                    return [Math.max(1, t-1), t, t+1, t+2].map(r => (
                      <button key={r} type="button" onClick={() => setReps(r.toString())} className={`rounded py-1 text-[10px] font-bold active:scale-95 ${r === t ? 'bg-yellow-400/20 text-yellow-400' : 'bg-zinc-800 text-zinc-400'}`}>{r}</button>
                    ));
                  })()}
                </div>
              </div>
            </div>

            {/* RPE Sfumato: Verde (Buffer) -> Rosso (Cedimento) */}
            <div className="bg-black/30 p-1.5 rounded-xl border border-white/5">
              <div className="flex items-center gap-1 justify-center mb-1.5 opacity-50">
                <Zap className="w-3 h-3 text-amber-500" /> <span className="text-[9px] uppercase font-black text-amber-500">Intensità</span>
              </div>
              <div className="flex gap-1 bg-gradient-to-r from-emerald-900/40 via-amber-900/40 to-red-900/40 p-1 rounded-lg">
                {[
                  { v: '7', color: 'hover:bg-emerald-500' },
                  { v: '7.5', color: 'hover:bg-emerald-400' },
                  { v: '8', color: 'hover:bg-amber-500' },
                  { v: '8.5', color: 'hover:bg-amber-600' },
                  { v: '9', color: 'hover:bg-orange-500' },
                  { v: '9.5', color: 'hover:bg-red-500' },
                  { v: '10', color: 'hover:bg-red-600' }
                ].map(item => (
                  <button 
                    key={item.v} 
                    type="button" 
                    onClick={() => setRpe(item.v)} 
                    className={`flex-1 py-1.5 rounded text-[10px] font-black transition-all ${
                      String(rpe) === item.v ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.3)] scale-110' : `bg-black/40 text-zinc-400 ${item.color} hover:text-white`
                    }`}
                  >
                    {item.v}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 bg-[#E50914] hover:bg-red-600 text-white font-black text-xs rounded-xl uppercase tracking-widest flex justify-center items-center gap-2 active:scale-[0.98] transition-transform shadow-lg">
              <Plus className="w-5 h-5 stroke-[3]" /> Conferma
            </button>
          </form>

          {/* LOG MINIMALI (Storico seduta attuale) */}
          {exerciseLogs.length > 0 && (
             <div className="flex flex-wrap gap-2 mt-1 pt-3 border-t border-white/5">
                {exerciseLogs.map((log, i) => (
                  <div key={log.id} className="flex items-center gap-2 bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-white/5 shadow-inner">
                    <span className="text-[10px] font-black text-zinc-600">S{i+1}</span>
                    <span className="text-[11px] font-black text-white">{log.weight}<span className="text-[9px] text-zinc-500 font-normal">kg</span> × {log.reps}</span>
                    <button type="button" onClick={() => handleDeleteLog(log.id)} className="text-zinc-600 hover:text-rose-500 transition-colors ml-1 active:scale-90"><Trash2 className="w-3.5 h-3.5"/></button>
                  </div>
                ))}
             </div>
          )}

        </div>
      )}
    </div>
  );
}