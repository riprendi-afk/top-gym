'use client';

import React, { useMemo } from 'react';
import { ChevronUp, ChevronDown, CheckCircle, History, Copy, Plus, Trash2 } from 'lucide-react';
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
  ex,
  isSelected,
  onSelect,
  todayLogs,
  isMasterProgram,
  isBw,
  getBadgeStyle,
  estimated1RMPreview,
  currentIntensityPreview,
  lastLoggedSet,
  handleAutoFillLastLog,
  currentBodyweightConfig,
  sessionBodyWeight,
  weight,
  setWeight,
  adjustWeight,
  reps,
  setReps,
  rpe,
  setRpe,
  handleLogSet,
  handleDeleteLog,
  getIntensityInfo,
}: ExerciseCardProps) {
  
  const exerciseLogs = useMemo(() => todayLogs.filter(l => l.exerciseName === ex.name), [todayLogs, ex.name]);
  const hasLoggedToday = exerciseLogs.length > 0;

  return (
    <div 
      onClick={onSelect} 
      className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
        isSelected 
          ? 'md:col-span-2 bg-[#12151B] border-[#E50914] ring-1 ring-[#E50914]/50 shadow-2xl' 
          : 'bg-zinc-900/40 border-white/5 hover:border-zinc-700 cursor-pointer'
      }`}
    >
      {isSelected && <div className="absolute top-0 left-0 w-1.5 h-full bg-[#E50914]" />}

      {/* INTESTAZIONE CARD ESERCIZIO */}
      <div className="flex justify-between items-start gap-2 select-none">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-base text-white">{ex.name}</span>
            {isSelected && (
              <span className="text-[9px] bg-red-500/10 border border-red-500/20 text-[#E50914] px-2 py-0.5 rounded-md font-bold uppercase">
                In Esecuzione
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {isMasterProgram && (
              <span className="text-[10px] text-zinc-400 font-mono">
                {ex.stimulusType === 'NEURAL' ? '⚡ Neurale' : ex.stimulusType === 'METABOLIC' ? '🔥 Metabolico' : '💪 Ipertrofico'}
              </span>
            )}
            {isBw && (
              <span className="text-[9px] text-purple-400 font-bold uppercase bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                Corpo Libero
              </span>
            )}
            {hasLoggedToday && (
              <span className="text-[9px] text-green-400 font-bold uppercase bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20 flex items-center gap-1">
                <CheckCircle className="w-2.5 h-2.5"/> {exerciseLogs.length}/{ex.sets} serie completate
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(isMasterProgram || ex.executionType !== 'REGULAR') && (
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${getBadgeStyle(ex.executionType)}`}>
              {ex.executionType}
            </span>
          )}
          <div className="text-zinc-400 p-1">
            {isSelected ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* TARGET E RECUPERO */}
      <div className="grid grid-cols-3 gap-2 text-xs bg-black/30 p-2.5 rounded-xl border border-white/5 mt-3">
        <div>
          <span className="text-[9px] text-zinc-400 uppercase font-bold block">Serie/Reps</span>
          <b className="text-white">{ex.sets} × {ex.reps}</b>
        </div>
        <div>
          <span className="text-[9px] text-zinc-400 uppercase font-bold block">Target</span>
          <b className="text-white">{ex.targetWeight} Kg</b>
        </div>
        <div>
          <span className="text-[9px] text-zinc-400 uppercase font-bold block">{isMasterProgram ? 'TUT' : 'Recupero'}</span>
          <b className="text-yellow-500 font-mono">{isMasterProgram ? (ex.tut || '2-0-1-0') : `${ex.restSeconds || 90}s`}</b>
        </div>
      </div>

      {ex.notes && (
        <div className="text-[11px] text-zinc-400 italic mt-2.5 pt-2 border-t border-white/5">
          Note: {ex.notes}
        </div>
      )}

      {/* ZONA LOGGER: ATTIVA SOLO DENTRO L'ESERCIZIO SELEZIONATO */}
      {isSelected && (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="mt-5 pt-5 border-t border-white/10 space-y-4 cursor-default animate-in fade-in duration-200"
        >
          {/* BADGE PROGRESSIONE SERIE TARGET */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <span>Progressione Serie</span>
              <span className="text-white font-mono">{exerciseLogs.length} di {ex.sets} completate</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(() => {
                const chronologicalLogs = [...exerciseLogs].reverse();
                return Array.from({ length: Math.max(ex.sets, exerciseLogs.length) }).map((_, idx) => {
                  const setNum = idx + 1;
                  const logged = chronologicalLogs[idx];
                  const isCurrent = idx === exerciseLogs.length;

                  if (logged) {
                    return (
                      <div 
                        key={idx}
                        className="bg-emerald-950/30 border border-emerald-500/40 p-2.5 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex flex-col">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase">
                            Serie {setNum}
                          </span>
                          <span className="text-xs font-black text-white">
                            {logged.weight} kg × {logged.reps}
                          </span>
                        </div>
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      </div>
                    );
                  }

                  if (isCurrent) {
                    return (
                      <div 
                        key={idx}
                        className="bg-[#E50914]/10 border border-[#E50914]/60 p-2.5 rounded-xl flex items-center justify-between animate-pulse"
                      >
                        <div className="flex flex-col">
                          <span className="text-[10px] text-red-400 font-bold uppercase">
                            Serie {setNum}
                          </span>
                          <span className="text-xs font-black text-white">
                            In corso...
                          </span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-[#E50914]" />
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={idx}
                      className="bg-zinc-900/40 border border-white/5 p-2.5 rounded-xl flex flex-col justify-center opacity-60"
                    >
                      <span className="text-[10px] text-zinc-500 font-bold uppercase">
                        Serie {setNum}
                      </span>
                      <span className="text-xs font-medium text-zinc-400">
                        Target: {ex.reps}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* 1RM & INTENSITÀ STIMATA */}
          {estimated1RMPreview !== null && (
            <div className="bg-black/40 border border-white/10 p-3 rounded-xl flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider block">1RM Stimato</span>
                <span className="text-xl font-black text-[#E50914]">{estimated1RMPreview} Kg</span>
              </div>
              {currentIntensityPreview && (
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md border uppercase ${currentIntensityPreview.colorClasses}`}>
                  {currentIntensityPreview.pct}% 1RM · {currentIntensityPreview.label}
                </span>
              )}
            </div>
          )}

          {/* CONFRONTO SESSIONE PRECEDENTE */}
          {lastLoggedSet && (
            <div className="bg-zinc-900/60 p-3 rounded-xl border border-white/5 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="text-zinc-400 flex items-center gap-2">
                <History className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>
                  Ultima volta:{' '}
                  {lastLoggedSet.isBodyweight && lastLoggedSet.bodyWeightUsed ? (
                    <b className="text-white">
                      BW {lastLoggedSet.bodyWeightUsed} kg + {lastLoggedSet.externalLoad ?? lastLoggedSet.weight} kg × {lastLoggedSet.reps} reps
                    </b>
                  ) : (
                    <b className="text-white">
                      {lastLoggedSet.externalLoad ?? lastLoggedSet.weight} kg × {lastLoggedSet.reps} reps
                    </b>
                  )}{' '}
                  <span className="text-red-400 font-semibold">(RPE {lastLoggedSet.rpe})</span>
                </span>
              </div>
              <button 
                type="button" 
                onClick={handleAutoFillLastLog} 
                className="text-xs text-[#E50914] font-bold flex items-center gap-1.5 hover:underline cursor-pointer shrink-0"
              >
                <Copy className="w-3.5 h-3.5"/> Copia Ultimo Carico
              </button>
            </div>
          )}

          {/* PROMEMORIA CORPO LIBERO */}
          {currentBodyweightConfig && (
            <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl text-xs text-purple-200">
              <span className="font-bold">Modalità Corpo Libero ({Math.round(currentBodyweightConfig.percentage * 100)}%): </span>
              {sessionBodyWeight ? (
                <span>
                  Peso: <b>{sessionBodyWeight} kg</b>. Quota: <b>{Math.round(sessionBodyWeight * currentBodyweightConfig.percentage * 10) / 10} kg</b>. Inserisci <b>0</b> per corpo libero puro o il valore della <b>zavorra</b>.
                </span>
              ) : (
                <span className="text-amber-300">
                  ⚠️ Inserisci il peso nel Check Readiness per il carico effettivo.
                </span>
              )}
            </div>
          )}

          {/* FORM INTERATTIVO */}
          <form onSubmit={handleLogSet} className="space-y-3">
            <div className="grid grid-cols-2 gap-2 w-full">
              
              {/* BOX CARICO */}
              <div className="min-w-0 bg-black/40 p-2 sm:p-2.5 rounded-xl border border-white/5 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] uppercase font-black tracking-wider text-zinc-400 truncate">
                    {currentBodyweightConfig ? 'Zavorra' : 'Carico (Kg)'}
                  </label>
                  {currentBodyweightConfig && (
                    <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded shrink-0">BW</span>
                  )}
                </div>
                <div className="flex items-center justify-center my-0.5 w-full min-w-0">
                  <input 
                    type="number" 
                    step="0.5" 
                    min="0"
                    inputMode="decimal"
                    required 
                    value={weight} 
                    onChange={e => setWeight(e.target.value)} 
                    placeholder={currentBodyweightConfig ? '0' : (ex.targetWeight || '80')} 
                    className="w-full min-w-0 text-center text-xl sm:text-2xl font-black text-white bg-zinc-900/90 border border-white/10 rounded-lg py-1 sm:py-1.5 outline-none focus:border-[#E50914] transition" 
                  />
                </div>
                <div className="grid grid-cols-4 gap-1 pt-1 w-full">
                  <button type="button" onClick={() => adjustWeight(-5)} className="h-7 min-w-0 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-[9px] sm:text-[10px] font-bold text-zinc-400 rounded-md transition text-center">-5</button>
                  <button type="button" onClick={() => adjustWeight(-2.5)} className="h-7 min-w-0 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-[9px] sm:text-[10px] font-bold text-zinc-400 rounded-md transition text-center">-2.5</button>
                  <button type="button" onClick={() => adjustWeight(2.5)} className="h-7 min-w-0 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-[9px] sm:text-[10px] font-bold text-emerald-400 rounded-md transition text-center">+2.5</button>
                  <button type="button" onClick={() => adjustWeight(5)} className="h-7 min-w-0 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-[9px] sm:text-[10px] font-bold text-emerald-400 rounded-md transition text-center">+5</button>
                </div>
              </div>

              {/* BOX RIPETIZIONI */}
              <div className="min-w-0 bg-black/40 p-2 sm:p-2.5 rounded-xl border border-white/5 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] uppercase font-black tracking-wider text-zinc-400 truncate">Reps</label>
                  <span className="text-[9px] text-zinc-500 font-mono shrink-0">Target: {ex.reps}</span>
                </div>
                <div className="flex items-center gap-1 my-0.5 w-full min-w-0">
                  <button
                    type="button"
                    onClick={() => setReps(prev => Math.max(1, (parseInt(prev, 10) || 0) - 1).toString())}
                    className="w-7 h-8 sm:w-8 sm:h-9 shrink-0 rounded-lg bg-zinc-800 hover:bg-zinc-700 active:scale-90 text-base sm:text-lg font-black text-white border border-white/5 flex items-center justify-center transition cursor-pointer"
                  >
                    -
                  </button>
                  <input 
  type="number" 
  min="1"
  inputMode="numeric"
  required 
  value={reps} 
  onChange={e => setReps(e.target.value)} 
  placeholder={(parseInt(String(ex.reps), 10) || 8).toString()} 
  className="w-full min-w-0 flex-1 h-8 sm:h-9 text-center text-lg sm:text-xl font-black text-white bg-zinc-900/90 border border-white/10 rounded-lg outline-none focus:border-[#E50914] px-1" 
/>
                  <button
                    type="button"
                    onClick={() => setReps(prev => ((parseInt(prev, 10) || 0) + 1).toString())}
                    className="w-7 h-8 sm:w-8 sm:h-9 shrink-0 rounded-lg bg-zinc-800 hover:bg-zinc-700 active:scale-90 text-base sm:text-lg font-black text-emerald-400 border border-white/5 flex items-center justify-center transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
                
                {/* CHIP SUGGERIMENTI REPS */}
                <div className="grid grid-cols-4 gap-1 pt-1 w-full">
                  {(() => {
                    const targetR = parseInt(ex.reps, 10) || 8;
                    const suggestions = [
                      Math.max(1, targetR - 1),
                      targetR,
                      targetR + 1,
                      targetR + 2,
                    ];
                    return suggestions.map((rVal, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setReps(rVal.toString())}
                        className={`h-7 min-w-0 active:scale-95 text-[9px] sm:text-[10px] font-bold rounded-md transition text-center border ${
                          rVal === targetR
                            ? "bg-yellow-400/20 text-yellow-400 border-yellow-400/40"
                            : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border-white/5"
                        }`}
                      >
                        {rVal}
                      </button>
                    ));
                  })()}
                </div>
              </div>

            </div>

            {/* RIGA 2: SELETTORE RPE */}
            <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] uppercase font-black tracking-wider text-zinc-400">Intensità RPE</span>
                <span className="text-[10px] text-amber-400 font-mono font-bold">
                  {parseFloat(rpe) === 10 ? 'Cedimento Totale' : `${Math.max(0, 10 - parseFloat(rpe || '8'))} RIR (Buffer)`}
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {[
                  { val: '7', rir: '3' },
                  { val: '7.5', rir: '2.5' },
                  { val: '8', rir: '2' },
                  { val: '8.5', rir: '1.5' },
                  { val: '9', rir: '1' },
                  { val: '9.5', rir: '0.5' },
                  { val: '10', rir: 'MAX' },
                ].map(item => {
                  const rpeSelected = String(rpe) === item.val;
                  return (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setRpe(item.val)}
                      className={`h-9 rounded-lg border text-center transition flex flex-col items-center justify-center cursor-pointer active:scale-95 ${
                        rpeSelected
                          ? 'bg-[#E50914] border-[#E50914] text-white shadow-md shadow-red-900/30'
                          : 'bg-zinc-800/60 border-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-black leading-none">{item.val}</span>
                      <span className={`text-[7px] font-bold mt-0.5 ${rpeSelected ? 'text-white/80' : 'text-zinc-500'}`}>
                        {item.rir}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PULSANTE CONFERMA SERIE */}
            <button 
              type="submit" 
              className="w-full h-12 bg-[#E50914] hover:brightness-110 text-white font-black text-sm rounded-xl uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5 stroke-[3] inline"/> Registra Serie (+10 XP)
            </button>
          </form>

          {/* SERIE REGISTRATE PER QUESTO ESERCIZIO */}
          {exerciseLogs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
              <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Serie Registrate ({exerciseLogs.length}/{ex.sets})
              </h4>
              <div className="space-y-2">
                {exerciseLogs.map((log, i) => {
                  const intensity = getIntensityInfo(log.exerciseName, log.effectiveLoad || log.weight);
                  return (
                    <div key={log.id} className="bg-zinc-900/80 p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-zinc-500 font-mono w-6">#{i + 1}</span>
                        <div>
                          <span className="text-zinc-300 font-mono text-[11px]">
                            {log.isBodyweight && log.effectiveLoad !== null ? (
                              <>Zav: {log.weight} Kg · Effettivo: <b className="text-white">{log.effectiveLoad} Kg</b> × {log.reps} reps (RPE {log.rpe})</>
                            ) : (
                              <><b className="text-white">{log.weight} Kg</b> × {log.reps} reps (RPE {log.rpe})</>
                            )}
                          </span>
                        </div>
                        {intensity && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${intensity.colorClasses}`}>
                            {intensity.pct}%
                          </span>
                        )}
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handleDeleteLog(log.id)} 
                        title="Elimina serie" 
                        className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}