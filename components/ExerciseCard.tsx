'use client';

import React, { useMemo, useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  CheckCircle, 
  Copy, 
  Plus, 
  Trash2, 
  Info, 
  Dumbbell, 
  Repeat, 
  Clock, 
  Zap, 
  History,
  Target 
} from 'lucide-react';
import type { Exercise, SetLog, ExecutionType } from '@/app/page';

export function calculateEstimated1RM(weight: number, reps: number, rpe: number = 10): number {
  const w = Number(weight) || 0;
  const r = Number(reps) || 0;
  const p = Number(rpe) || 10;
  if (w <= 0 || r <= 0) return 0;
  const rir = Math.max(0, 10 - p);
  const effectiveReps = r + rir;
  if (effectiveReps <= 1) return Math.round(w);
  const e1rm = w * (1 + effectiveReps / 30);
  return Math.round(e1rm * 10) / 10;
}

export interface PlannedWeekTargets {
  sets: number;
  reps: string;
  targetWeight: string;
  restSeconds: number;
  rpeTarget?: string;
  tut?: string;
  notes?: string;
  isDeload?: boolean;
}

export interface ExerciseCardProps {
  ex: Exercise;
  isSelected: boolean;
  onSelect: () => void;
  todayLogs: SetLog[];
  isMasterProgram: boolean;
  isBw: boolean;
  getBadgeStyle: (type: ExecutionType) => string;
  estimated1RMPreview?: number | null;
  currentIntensityPreview?: { pct: number; label: string; colorClasses: string } | null;
  lastLoggedSet: SetLog | null;
  handleAutoFillLastLog: () => void;
  currentBodyweightConfig?: { percentage: number } | null;
  sessionBodyWeight?: number | null;
  weight: string;
  setWeight: (val: string) => void;
  adjustWeight: (delta: number) => void;
  reps: string;
  setReps: React.Dispatch<React.SetStateAction<string>>;
  rpe: string;
  setRpe: (val: string) => void;
  handleLogSet: (e: React.SyntheticEvent) => void;
  handleDeleteLog: (id: string) => void;
  getIntensityInfo?: (exName: string, weight: number) => { pct: number; label: string; colorClasses: string } | null;
  plannedTargets?: PlannedWeekTargets;
}

export function ExerciseCard({
  ex, 
  isSelected, 
  onSelect, 
  todayLogs, 
  isMasterProgram, 
  isBw, 
  getBadgeStyle,
  lastLoggedSet, 
  handleAutoFillLastLog,
  weight, 
  setWeight, 
  adjustWeight,
  reps, 
  setReps, 
  rpe, 
  setRpe, 
  handleLogSet, 
  handleDeleteLog,
  plannedTargets,
}: ExerciseCardProps) {
  const [showNotes, setShowNotes] = useState(false);
  const exerciseLogs = useMemo(() => todayLogs.filter(l => l.exerciseName === ex.name), [todayLogs, ex.name]);

  // Target dinamici assegnati dalla settimana selezionata
  const targetSets = plannedTargets?.sets ?? (typeof ex.sets === 'number' && ex.sets > 0 ? ex.sets : 3);
  const targetReps = plannedTargets?.reps ?? (ex.reps ? String(ex.reps) : '8');
  const targetLoad = plannedTargets?.targetWeight ?? (ex.targetWeight ? String(ex.targetWeight) : '');
  const targetRest = plannedTargets?.restSeconds ?? (ex.restSeconds || 90);
  const targetRpe = plannedTargets?.rpeTarget || (ex as any)?.rpeTarget;
  const targetNotes = plannedTargets?.notes || ex.notes;
  const isDeload = plannedTargets?.isDeload;

  const isExerciseCompleted = exerciseLogs.length >= targetSets;

  const firstSetE1RM = useMemo(() => {
    if (exerciseLogs.length === 0) return null;
    const first = exerciseLogs[0];
    const w = Number(first.effectiveLoad ?? first.weight ?? 0);
    const r = Number(first.reps ?? 0);
    const p = Number(first.rpe ?? 10);
    return calculateEstimated1RM(w, r, p);
  }, [exerciseLogs]);

  return (
    <div 
      onClick={onSelect} 
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden outline-none ${
        isSelected 
          ? 'md:col-span-2 bg-[#12151B] border-[#E50914] shadow-[0_0_20px_rgba(229,9,20,0.1)]' 
          : 'bg-zinc-900/40 border-white/5 cursor-pointer hover:bg-zinc-800/40 focus-visible:border-white/20'
      }`}
    >
      {isSelected && <div className="absolute top-0 left-0 w-1 h-full bg-[#E50914]" />}

      {/* HEADER VISIVO */}
      <div className="flex justify-between items-start gap-2 select-none pl-1">
        <div className="w-full">
          <div className="flex justify-between items-center w-full">
            <span className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              {isExerciseCompleted && <CheckCircle className="w-4 h-4 text-emerald-500" />}
              {ex.name}
            </span>
            <div className="text-zinc-500">
              {isSelected ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {(isMasterProgram || ex.executionType !== 'REGULAR') && (
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${getBadgeStyle(ex.executionType)}`}>
                {ex.executionType}
              </span>
            )}
            {isBw && (
              <span className="text-[8px] text-purple-400 font-bold uppercase border border-purple-500/20 rounded px-1.5 py-0.5">
                BW
              </span>
            )}
            {isDeload && (
              <span className="text-[8px] text-sky-400 font-bold uppercase border border-sky-500/20 bg-sky-950/40 rounded px-1.5 py-0.5">
                Deload
              </span>
            )}

            {/* TRACKER PALLINI DINAMICO */}
            {!isSelected && (
              <div className="flex items-center gap-1.5 ml-2">
                <div className="flex gap-1">
                  {Array.from({ length: targetSets }).map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-2.5 h-1.5 rounded-full ${
                        idx < exerciseLogs.length 
                          ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' 
                          : 'bg-zinc-800'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-zinc-400 font-mono">
                  {exerciseLogs.length}/{targetSets}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DETTAGLI & LOGGER */}
      {isSelected && (
        <div onClick={(e) => e.stopPropagation()} className="mt-3 pt-3 border-t border-white/5 space-y-3.5 cursor-default">
          
          {/* CRUSCOTTO PARAMETRI TARGET DELLA SETTIMANA ATTIVA */}
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-black uppercase text-zinc-400 px-0.5">
              <span className="flex items-center gap-1 text-sky-400">
                <Target className="w-3 h-3" /> Obiettivi Settimana
              </span>
              <span className="text-zinc-500 font-mono">Avanzamento: {exerciseLogs.length}/{targetSets}</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 font-mono text-center">
              <div className="bg-zinc-900/80 p-1.5 rounded-lg border border-white/5">
                <span className="text-[8px] text-zinc-500 uppercase block">Serie Target</span>
                <b className="text-white text-xs">{targetSets}</b>
              </div>
              <div className="bg-zinc-900/80 p-1.5 rounded-lg border border-white/5">
                <span className="text-[8px] text-zinc-500 uppercase block">Reps Target</span>
                <b className="text-white text-xs">{targetReps}</b>
              </div>
              <div className="bg-zinc-900/80 p-1.5 rounded-lg border border-white/5">
                <span className="text-[8px] text-zinc-500 uppercase block">Carico Target</span>
                <b className="text-white text-xs">{targetLoad ? `${targetLoad}kg` : 'Libero'}</b>
              </div>
              <div className="bg-zinc-900/80 p-1.5 rounded-lg border border-white/5">
                <span className="text-[8px] text-zinc-500 uppercase block">Recupero</span>
                <b className="text-yellow-400 text-xs">{targetRest}s</b>
              </div>
            </div>

            {(targetRpe || ex.tut) && (
              <div className="flex items-center justify-between px-1 text-[10px] text-zinc-400 font-mono pt-0.5">
                {targetRpe && <span>Intensità: <b className="text-emerald-400">RPE {targetRpe}</b></span>}
                {ex.tut && <span>TUT: <b className="text-amber-400">{ex.tut}</b></span>}
              </div>
            )}
          </div>

          {/* NOTE DEL COACH */}
          {targetNotes && (
            <div className="bg-blue-950/20 p-2 rounded-lg border border-blue-900/30 text-[10px] text-zinc-400">
              <div 
                className="flex justify-between items-center cursor-pointer" 
                onClick={() => setShowNotes(!showNotes)}
              >
                <span className="font-bold flex items-center gap-1 text-blue-400">
                  <Info className="w-3.5 h-3.5"/> Direttive Tecniche Coach
                </span>
                <span className="text-zinc-500">
                  {showNotes ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
                </span>
              </div>
              {showNotes && (
                <div className="mt-2 text-zinc-300 leading-relaxed border-t border-blue-900/30 pt-2">
                  {targetNotes}
                </div>
              )}
            </div>
          )}

          {/* TRACKER SERIE DINAMICO */}
          <div className="flex gap-1.5 w-full pt-1">
            {Array.from({ length: targetSets }).map((_, idx) => {
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
                  title={`Serie ${idx + 1} di ${targetSets}`}
                />
              );
            })}
          </div>

          {/* COPIA RAPIDA SERIE PRECEDENTE OGGI */}
          {lastLoggedSet && !isExerciseCompleted && (
            <div className="flex items-center justify-between bg-zinc-900/60 p-2 rounded-lg border border-white/5">
              <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                <History className="w-3 h-3 text-zinc-500"/>
                Serie precedente: <b className="text-white">{lastLoggedSet.externalLoad ?? lastLoggedSet.weight}kg × {lastLoggedSet.reps}</b> (RPE {lastLoggedSet.rpe})
              </span>
              <button 
                type="button" 
                onClick={handleAutoFillLastLog} 
                className="text-[#E50914] hover:text-red-400 text-[10px] font-bold uppercase flex items-center gap-1 active:scale-95 transition-colors cursor-pointer"
              >
                <Copy className="w-3 h-3"/> Copia Dati
              </button>
            </div>
          )}

          {/* FORM INSERIMENTO DINAMICO */}
          {!isExerciseCompleted ? (
            <form onSubmit={handleLogSet} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                
                {/* Box Carico */}
                <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-1 px-1">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Carico Eseguito</span>
                    <Dumbbell className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <input 
                    type="number" 
                    step="0.5" 
                    min="0" 
                    inputMode="decimal" 
                    required 
                    aria-label="Carico in kg"
                    value={weight} 
                    onChange={e => setWeight(e.target.value)} 
                    placeholder="0 kg" 
                    className="w-full text-center text-xl font-black text-white bg-zinc-900 border border-white/10 rounded-lg py-1 outline-none focus:border-[#E50914] transition-all placeholder:text-zinc-700" 
                  />
                  <div className="grid grid-cols-4 gap-1 mt-1.5">
                    <button type="button" onClick={() => adjustWeight(-5)} className="bg-zinc-800 rounded py-1 text-[10px] font-bold text-zinc-400 active:bg-zinc-700 cursor-pointer">-5</button>
                    <button type="button" onClick={() => adjustWeight(-2.5)} className="bg-zinc-800 rounded py-1 text-[10px] font-bold text-zinc-400 active:bg-zinc-700 cursor-pointer">-2.5</button>
                    <button type="button" onClick={() => adjustWeight(2.5)} className="bg-zinc-800 rounded py-1 text-[10px] font-bold text-emerald-400 active:bg-emerald-900/50 cursor-pointer">+2.5</button>
                    <button type="button" onClick={() => adjustWeight(5)} className="bg-zinc-800 rounded py-1 text-[10px] font-bold text-emerald-400 active:bg-emerald-900/50 cursor-pointer">+5</button>
                  </div>
                </div>

                {/* Box Reps */}
                <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-1 px-1">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Ripetizioni</span>
                    <Repeat className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <div className="flex gap-1">
                    <button 
                      type="button" 
                      onClick={() => setReps(p => Math.max(1, (parseInt(p, 10) || 0) - 1).toString())} 
                      className="w-8 bg-zinc-800 hover:bg-zinc-700 rounded text-sm font-bold text-white active:bg-zinc-700 cursor-pointer"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      inputMode="numeric" 
                      required 
                      aria-label="Numero di ripetizioni"
                      value={reps} 
                      onChange={e => setReps(e.target.value)} 
                      placeholder="Reps" 
                      className="w-full text-center text-xl font-black text-white bg-zinc-900 border border-white/10 rounded-lg py-1 outline-none focus:border-[#E50914] transition-all placeholder:text-zinc-700" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setReps(p => ((parseInt(p, 10) || 0) + 1).toString())} 
                      className="w-8 bg-zinc-800 hover:bg-zinc-700 rounded text-sm font-bold text-emerald-400 active:bg-emerald-900/50 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-1 mt-1.5">
                    {[6, 8, 10, 12].map(r => (
                      <button 
                        key={r} 
                        type="button" 
                        onClick={() => setReps(r.toString())} 
                        className={`rounded py-1 text-[10px] font-bold active:scale-95 transition cursor-pointer ${
                          reps === r.toString() 
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selettore RPE */}
              <div className="bg-black/30 p-1.5 rounded-xl border border-white/5">
                <div className="flex items-center gap-1 justify-center mb-1.5 opacity-50">
                  <Zap className="w-3 h-3 text-amber-500" /> 
                  <span className="text-[9px] uppercase font-black text-amber-500">Buffer / Intensità (RPE)</span>
                </div>
                <div className="flex gap-1 bg-gradient-to-r from-emerald-900/40 via-amber-900/40 to-red-900/40 p-1 rounded-lg overflow-x-auto scrollbar-none">
                  {[
                    { v: '5', color: 'hover:bg-emerald-600' },
                    { v: '5.5', color: 'hover:bg-emerald-500' },
                    { v: '6', color: 'hover:bg-emerald-500' },
                    { v: '6.5', color: 'hover:bg-teal-500' },
                    { v: '7', color: 'hover:bg-teal-400' },
                    { v: '7.5', color: 'hover:bg-amber-400' },
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
                        String(rpe) === item.v 
                          ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.3)] scale-110' 
                          : `bg-black/40 text-zinc-400 ${item.color} hover:text-white`
                      }`}
                    >
                      {item.v}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 bg-[#E50914] hover:bg-red-600 text-white font-black text-xs rounded-xl uppercase tracking-widest flex justify-center items-center gap-2 active:scale-[0.98] transition-transform shadow-lg cursor-pointer"
              >
                <Plus className="w-5 h-5 stroke-[3]" /> Registra Serie {exerciseLogs.length + 1} di {targetSets}
              </button>
            </form>
          ) : (
            <div className="w-full py-3.5 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Tutte le {targetSets} serie previste per questa settimana completate!
            </div>
          )}

          {/* LISTA SERIE COMPLETATE OGGI */}
          {exerciseLogs.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1 pt-3 border-t border-white/5">
              {exerciseLogs.map((log, i) => {
                const setE1rm = calculateEstimated1RM(
                  Number(log.effectiveLoad ?? log.weight ?? 0), 
                  Number(log.reps || 0), 
                  Number(log.rpe || 10)
                );
                const delta = firstSetE1RM && i > 0 && setE1rm > 0
                  ? Math.round(((setE1rm - firstSetE1RM) / firstSetE1RM) * 100) 
                  : null;

                return (
                  <div key={log.id} className="flex items-center gap-2 bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-white/5 shadow-inner">
                    <span className="text-[10px] font-black text-zinc-500 font-mono">S{i + 1}</span>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-white">
                        {log.weight}<span className="text-[9px] text-zinc-500 font-normal">kg</span> × {log.reps}
                        {log.rpe && <span className="text-[9px] text-amber-400 ml-1 font-mono">@{log.rpe}</span>}
                      </span>
                      {setE1rm > 0 && (
                        <span className="text-[8px] text-zinc-400 font-mono">
                          e1RM: <b className="text-zinc-200">{setE1rm}kg</b>
                          {delta !== null && (
                            <span className={delta >= 0 ? ' text-emerald-400 ml-1' : delta >= -5 ? ' text-amber-400 ml-1' : ' text-rose-400 ml-1 font-bold'}>
                              ({delta >= 0 ? `+${delta}%` : `${delta}%`})
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteLog(log.id)} 
                      aria-label={`Elimina serie ${i + 1}`}
                      className="text-zinc-600 hover:text-rose-500 transition-colors ml-1 active:scale-90 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
