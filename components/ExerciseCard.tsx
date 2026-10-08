'use client';

import React, { useMemo, useState } from 'react';
import { ChevronUp, ChevronDown, CheckCircle, Copy, Plus, Trash2, Info } from 'lucide-react';
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

  return (
    <div 
      onClick={onSelect} 
      className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden ${
        isSelected ? 'md:col-span-2 bg-[#12151B] border-[#E50914] shadow-2xl' : 'bg-zinc-900/40 border-white/5 cursor-pointer hover:bg-zinc-800/40'
      }`}
    >
      {isSelected && <div className="absolute top-0 left-0 w-1 h-full bg-[#E50914]" />}

      {/* HEADER ULTRA COMPATTO */}
      <div className="flex justify-between items-start gap-2 select-none pl-1">
        <div className="w-full">
          <div className="flex justify-between items-center w-full">
            <span className="font-bold text-sm sm:text-base text-white">{ex.name}</span>
            <div className="text-zinc-500">{isSelected ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4" />}</div>
          </div>

          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {hasLoggedToday && (
              <span className="text-[9px] text-green-400 font-bold uppercase bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20 flex items-center gap-1">
                <CheckCircle className="w-2.5 h-2.5"/> {exerciseLogs.length}/{ex.sets}
              </span>
            )}
            {(isMasterProgram || ex.executionType !== 'REGULAR') && (
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${getBadgeStyle(ex.executionType)}`}>
                {ex.executionType}
              </span>
            )}
            {isBw && (
              <span className="text-[8px] text-purple-400 font-bold uppercase border border-purple-500/20 rounded px-1.5 py-0.5">Corpo Libero</span>
            )}
          </div>
        </div>
      </div>

      {/* DETTAGLI (VISIBILI SOLO SE SELEZIONATO) */}
      {isSelected && (
        <div onClick={(e) => e.stopPropagation()} className="mt-3 pt-3 border-t border-white/5 space-y-3 cursor-default">
          
          {/* RIGA 1: TARGET & TUT (Fusi in una riga) */}
          <div className="flex items-center justify-between bg-black/20 px-3 py-2 rounded-lg text-xs border border-white/5">
             <span className="text-zinc-300 font-medium">🎯 <b className="text-white">{ex.sets} × {ex.reps}</b> @ <b className="text-white">{ex.targetWeight} Kg</b></span>
             <span className="text-yellow-500 font-mono">⏱️ {isMasterProgram ? ex.tut : `${ex.restSeconds}s`}</span>
          </div>

          {/* RIGA 2: NOTE COLLASSABILI */}
          {ex.notes && (
            <div className="bg-zinc-900/60 p-2 rounded-lg border border-white/5 text-[10px] text-zinc-400">
              <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowNotes(!showNotes)}>
                 <span className="font-bold flex items-center gap-1"><Info className="w-3 h-3 text-blue-400"/> Info Esecuzione</span>
                 <span className="text-blue-400">{showNotes ? 'Nascondi' : 'Mostra'}</span>
              </div>
              {showNotes && <div className="mt-1.5 italic text-zinc-300 leading-relaxed">{ex.notes}</div>}
            </div>
          )}

          {/* RIGA 3: TRACKER SERIE (Orizzontale e Minimal) */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Serie ({exerciseLogs.length}/{ex.sets})</span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x">
              {Array.from({ length: Math.max(ex.sets, exerciseLogs.length) }).map((_, idx) => {
                const logged = [...exerciseLogs].reverse()[idx];
                if (logged) {
                  return (
                    <div key={idx} className="shrink-0 snap-start bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] font-black text-white">{logged.weight}kg × {logged.reps}</span>
                    </div>
                  );
                }
                if (idx === exerciseLogs.length) {
                  return <div key={idx} className="shrink-0 snap-start bg-[#E50914]/10 border border-[#E50914]/50 px-3 py-1 rounded-md text-[10px] font-black text-[#E50914] animate-pulse">In Corso...</div>;
                }
                return <div key={idx} className="shrink-0 snap-start bg-zinc-800/40 border border-white/5 px-3 py-1 rounded-md text-[10px] font-bold text-zinc-600">S {idx + 1}</div>;
              })}
            </div>
          </div>

          {/* RIGA 4: ULTIMA VOLTA (Compatta) */}
          {lastLoggedSet && (
            <div className="flex items-center justify-between text-[10px] bg-zinc-900/60 p-2 rounded-lg border border-white/5">
              <span className="text-zinc-400">Ultima: <b className="text-white">{lastLoggedSet.externalLoad ?? lastLoggedSet.weight}kg × {lastLoggedSet.reps}</b> (RPE {lastLoggedSet.rpe})</span>
              <button type="button" onClick={handleAutoFillLastLog} className="text-[#E50914] font-bold flex items-center gap-1 hover:underline"><Copy className="w-3 h-3"/> Copia</button>
            </div>
          )}

          {/* RIGA 5: CONTROLLI THUMB-ZONE (Ottimizzati per lo spazio) */}
          <form onSubmit={handleLogSet} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              
              {/* Box Carico */}
              <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                <div className="text-[9px] uppercase font-bold text-zinc-500 mb-1 text-center">Carico (Kg)</div>
                <input type="number" step="0.5" min="0" inputMode="decimal" required value={weight} onChange={e => setWeight(e.target.value)} placeholder={(ex.targetWeight || '0').toString()} className="w-full text-center text-xl font-black text-white bg-zinc-900 border border-white/10 rounded-lg py-1 outline-none focus:border-[#E50914]" />
                <div className="grid grid-cols-4 gap-1 mt-1.5">
                  <button type="button" onClick={() => adjustWeight(-5)} className="bg-zinc-800 rounded py-1 text-[9px] font-bold text-zinc-400">-5</button>
                  <button type="button" onClick={() => adjustWeight(-2.5)} className="bg-zinc-800 rounded py-1 text-[9px] font-bold text-zinc-400">-2</button>
                  <button type="button" onClick={() => adjustWeight(2.5)} className="bg-zinc-800 rounded py-1 text-[9px] font-bold text-emerald-400">+2</button>
                  <button type="button" onClick={() => adjustWeight(5)} className="bg-zinc-800 rounded py-1 text-[9px] font-bold text-emerald-400">+5</button>
                </div>
              </div>

              {/* Box Reps */}
              <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                <div className="text-[9px] uppercase font-bold text-zinc-500 mb-1 text-center">Reps</div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => setReps(p => Math.max(1, (parseInt(p)||0)-1).toString())} className="w-8 bg-zinc-800 rounded text-sm font-bold text-white">-</button>
                  <input type="number" min="1" inputMode="numeric" required value={reps} onChange={e => setReps(e.target.value)} placeholder={(parseInt(String(ex.reps), 10) || 8).toString()} className="w-full text-center text-xl font-black text-white bg-zinc-900 border border-white/10 rounded-lg py-1 outline-none focus:border-[#E50914]" />
                  <button type="button" onClick={() => setReps(p => ((parseInt(p)||0)+1).toString())} className="w-8 bg-zinc-800 rounded text-sm font-bold text-emerald-400">+</button>
                </div>
                <div className="grid grid-cols-4 gap-1 mt-1.5">
                  {(() => {
                    const t = parseInt(String(ex.reps), 10) || 8;
                    return [Math.max(1, t-1), t, t+1, t+2].map(r => (
                      <button key={r} type="button" onClick={() => setReps(r.toString())} className={`rounded py-1 text-[9px] font-bold ${r === t ? 'bg-yellow-400/20 text-yellow-400' : 'bg-zinc-800 text-zinc-400'}`}>{r}</button>
                    ));
                  })()}
                </div>
              </div>

            </div>

            {/* RPE Selector Ultra-Slim */}
            <div className="bg-black/30 p-1.5 rounded-xl border border-white/5 flex justify-between gap-1">
              {['7','7.5','8','8.5','9','9.5','10'].map(v => (
                <button key={v} type="button" onClick={() => setRpe(v)} className={`flex-1 py-1 rounded text-[10px] font-black transition ${String(rpe) === v ? 'bg-[#E50914] text-white' : 'bg-zinc-800/60 text-zinc-500'}`}>
                  {v}
                </button>
              ))}
            </div>

            <button type="submit" className="w-full py-3 bg-[#E50914] text-white font-black text-xs rounded-xl uppercase tracking-wider flex justify-center items-center gap-1.5 active:scale-95 transition">
              <Plus className="w-4 h-4 stroke-[3]" /> Registra (+10 XP)
            </button>
          </form>

          {/* STORICO SERIE LOGGATE OGGI (Minimalista) */}
          {exerciseLogs.length > 0 && (
             <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-white/5">
                {exerciseLogs.map((log, i) => (
                  <div key={log.id} className="flex items-center gap-1.5 bg-zinc-900 px-2 py-1 rounded-md border border-white/5">
                    <span className="text-[9px] text-zinc-500">#{i+1}</span>
                    <span className="text-[10px] font-bold text-white">{log.weight}kg × {log.reps}</span>
                    <button type="button" onClick={() => handleDeleteLog(log.id)} className="text-rose-500 ml-1"><Trash2 className="w-3 h-3"/></button>
                  </div>
                ))}
             </div>
          )}

        </div>
      )}
    </div>
  );
}