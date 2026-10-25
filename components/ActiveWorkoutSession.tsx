'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Dumbbell, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  RotateCcw, 
  Check, 
  X, 
  AlertCircle 
} from 'lucide-react';
import { ExerciseCard } from './ExerciseCard';
import { saveCompletedWorkoutToSupabase } from '@/lib/store';
import { computeEffectiveLoad, findBodyweightConfig } from '@/lib/lib/bodyweight';
import type { ExecutionType, SetLog } from '@/app/page';

interface ActiveWorkoutSessionProps {
  programDays: any[];
  programName: string;
  athleteId: string;
  athleteName: string;
  sessionBodyWeight?: number | null;
  workoutHistory?: any[];
  onWorkoutSaved: () => Promise<void> | void;
}

export default function ActiveWorkoutSession({
  programDays,
  programName,
  athleteId,
  athleteName,
  sessionBodyWeight = null,
  workoutHistory = [],
  onWorkoutSaved,
}: ActiveWorkoutSessionProps) {

  // 1. SANITIZZAZIONE RIGOROSA E STATICA DEI GIORNI E DEGLI ESERCIZI
  const sanitizedDays = useMemo(() => {
    if (!Array.isArray(programDays) || programDays.length === 0) return [];
    
    return programDays.map((d, dIdx) => {
      const rawTitle = d?.title || d?.dayName || `Giorno ${dIdx + 1}`;
      const cleanTitle = String(rawTitle).includes('undefined')
        ? `Giorno ${dIdx + 1}`
        : String(rawTitle).replace(/^Giorno\s*\d+\s*[:\-\.]?\s*/i, '').trim();

      const exercises = Array.isArray(d?.exercises) ? d.exercises.map((ex: any, exIdx: number) => {
        const rawWeight = String(ex?.targetWeight ?? '').trim();
        const cleanWeight = (rawWeight === 'undefined' || rawWeight === 'NaN' || rawWeight === 'null') ? '' : rawWeight;
        const rawReps = String(ex?.reps ?? '8').trim();
        const cleanReps = rawReps.includes('undefined') ? '8' : rawReps;
        const cleanSets = (typeof ex?.sets === 'number' && ex.sets > 0) ? ex.sets : (parseInt(String(ex?.sets), 10) || 3);
        const cleanRest = parseInt(String(ex?.restSeconds), 10) || 90;

        return {
          ...ex,
          id: ex?.id || `ex-${dIdx}-${exIdx}`,
          name: String(ex?.name || 'Esercizio').trim(),
          sets: cleanSets,
          reps: cleanReps,
          targetWeight: cleanWeight,
          restSeconds: cleanRest,
          executionType: (ex?.executionType || 'REGULAR') as ExecutionType,
          tut: (ex?.tut && !String(ex.tut).includes('undefined')) ? String(ex.tut) : '2-0-1-0',
          notes: (ex?.notes && !String(ex.notes).includes('undefined')) ? String(ex.notes) : '',
        };
      }) : [];

      return {
        ...d,
        id: d?.id || `day-${dIdx}`,
        dayNumber: d?.dayNumber || dIdx + 1,
        title: cleanTitle || `Giorno ${dIdx + 1}`,
        exercises,
      };
    });
  }, [programDays]);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const activeDay = sanitizedDays[selectedDayIndex] || sanitizedDays[0];
  const activeExercises = activeDay?.exercises || [];

  const [currentExId, setCurrentExId] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('8');
  const [rpe, setRpe] = useState<string>('8');

  // Gestione Logs locali con salvataggio sicuro anti-crash iOS
  const [todayLogs, setTodayLogs] = useState<SetLog[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Timer di Recupero
  const [restTimeLeft, setRestTimeLeft] = useState<number>(0);
  const [restTotalTime, setRestTotalTime] = useState<number>(90);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  // Ripristino Logs da LocalStorage al caricamento (Safe per Safari)
  useEffect(() => {
    if (typeof window === 'undefined' || !athleteId) return;
    try {
      const key = `topgym_session_logs_${athleteId}`;
      const cached = localStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) setTodayLogs(parsed);
      }
    } catch {}
  }, [athleteId]);

  // Persistenza sicura dei Logs
  const saveLogsSafely = (logs: SetLog[]) => {
    setTodayLogs(logs);
    if (typeof window === 'undefined' || !athleteId) return;
    try {
      localStorage.setItem(`topgym_session_logs_${athleteId}`, JSON.stringify(logs));
    } catch {}
  };

  // 2. SINCRONIZZAZIONE AUTOMATICA DEGLI INPUT QUANDO SI APRE UN ESERCIZIO
  const handleSelectExercise = (ex: any) => {
    if (currentExId === ex.id) {
      setCurrentExId('');
      return;
    }
    setCurrentExId(ex.id);

    // 1) Ultima serie eseguita oggi
    const exTodayLogs = todayLogs.filter((l: any) => l.exerciseName === ex.name);
    if (exTodayLogs.length > 0) {
      const last = exTodayLogs[0];
      setWeight(String(last.weight));
      setReps(String(last.reps));
      setRpe(String(last.rpe || '8'));
      return;
    }

    // 2) Ultima serie registrata nello storico precedente
    let pastLog: any = null;
    for (const w of workoutHistory) {
      if (Array.isArray(w.logs)) {
        const found = w.logs.find((l: any) => l.exerciseName === ex.name);
        if (found) { pastLog = found; break; }
      }
    }
    if (pastLog) {
      setWeight(String(pastLog.externalLoad ?? pastLog.weight ?? ''));
      setReps(String(pastLog.reps ?? '8'));
      setRpe(String(pastLog.rpe ?? '8'));
      return;
    }

    // 3) Valore target assegnato dalla Matrice
    setWeight(ex.targetWeight || '');
    const parsedReps = parseInt(String(ex.reps), 10);
    setReps(!isNaN(parsedReps) && parsedReps > 0 ? String(parsedReps) : '8');
    setRpe('8');
  };

  const adjustWeight = (delta: number) => {
    const current = parseFloat(weight) || 0;
    const updated = Math.max(0, current + delta);
    setWeight(updated.toString());
  };

  const triggerVibrate = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try { navigator.vibrate(pattern); } catch {}
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && restTimeLeft > 0) {
      interval = setInterval(() => {
        setRestTimeLeft((prev: number) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerActive(false);
            triggerVibrate([200, 100, 200]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, restTimeLeft]);

  // Registrazione Serie
  const handleLogSet = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const currentEx = activeExercises.find((e: any) => e.id === currentExId);
    if (!currentEx) return;

    // Tetto massimo statico a 5 serie per esercizio
    const MAX_SETS_LIMIT = 5;
    const exTodayCount = todayLogs.filter((l: any) => l.exerciseName === currentEx.name).length;
    if (exTodayCount >= MAX_SETS_LIMIT) return;

    // Normalizzazione sicura virgole decimali iOS
    const cleanW = String(weight).replace(',', '.');
    const numWeight = parseFloat(cleanW) || 0;
    const numReps = parseInt(String(reps), 10) || 0;
    const numRpe = parseFloat(String(rpe).replace(',', '.')) || 8;

    if (numReps <= 0) return;

    const effectiveCalc = computeEffectiveLoad(
      currentEx.name,
      numWeight,
      numReps,
      sessionBodyWeight
    );

    const newLog: SetLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      exerciseId: currentEx.id,
      exerciseName: currentEx.name,
      muscleGroup: (currentEx.muscleGroup as any) || undefined,
      weight: numWeight,
      reps: numReps,
      rpe: numRpe,
      estimated1RM: numWeight > 0 ? Math.round(numWeight * (1 + numReps / 30) * 10) / 10 : 0,
      volume: numWeight * numReps,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isBodyweight: effectiveCalc.isBodyweight,
      externalLoad: effectiveCalc.externalLoad,
      bodyWeightUsed: effectiveCalc.bodyWeightUsed,
      percentageUsed: effectiveCalc.percentageUsed,
      bodyweightLoad: effectiveCalc.bodyweightLoad,
      effectiveLoad: effectiveCalc.effectiveLoad,
      effectiveVolume: effectiveCalc.effectiveVolume,
    };

    const updated = [newLog, ...todayLogs];
    saveLogsSafely(updated);

    // Avvio Timer
    const rest = currentEx.restSeconds || 90;
    setRestTotalTime(rest);
    setRestTimeLeft(rest);
    setIsTimerActive(true);
    triggerVibrate(50);
  };

  const handleDeleteLog = (logId: string) => {
    const updated = todayLogs.filter((l: any) => l.id !== logId);
    saveLogsSafely(updated);
  };

  // Helper parsing numerico anti-virgola iOS per Supabase
  const parseSafeNumber = (val: any): number => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const str = String(val).replace(',', '.').replace(/[^0-9.-]/g, '');
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  };

  // SALVATAGGIO SEDUTA SU SUPABASE (100% Compatibile con iOS PWA Standalone)
  const executeSaveWorkout = async () => {
    if (!athleteId) {
      setStatusMessage('⚠️ Errore: Atleta non identificato.');
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    const totalVol = Math.round(
      todayLogs.reduce((acc, curr) => {
        const w = parseSafeNumber(curr.weight);
        const r = parseSafeNumber(curr.reps);
        const eff = parseSafeNumber(curr.effectiveVolume);
        const validEff = eff > 0 && eff < 100000 ? eff : (w * r);
        return acc + validEff;
      }, 0) * 10
    ) / 10;

    const sanitizedLogs = todayLogs.map(l => ({
      ...l,
      weight: parseSafeNumber(l.weight),
      reps: parseSafeNumber(l.reps),
      volume: parseSafeNumber(l.weight) * parseSafeNumber(l.reps),
    }));

    try {
      const res = await saveCompletedWorkoutToSupabase({
        userId: athleteId,
        dayName: activeDay?.title || 'Allenamento TOPGYM',
        totalVolume: totalVol,
        exercisesCount: activeExercises.length,
        logs: sanitizedLogs as any,
      });

      if (!res?.success) {
        setStatusMessage('⚠️ Errore durante il salvataggio: ' + (res?.error || 'Verifica la connessione.'));
        setIsSaving(false);
        return;
      }

      // Successo
      setShowConfirmModal(false);
      setTodayLogs([]);
      if (typeof window !== 'undefined') {
        try { localStorage.removeItem(`topgym_session_logs_${athleteId}`); } catch {}
      }

      triggerVibrate([100, 50, 100]);
      await onWorkoutSaved();
    } catch (err: any) {
      setStatusMessage('⚠️ Eccezione salvataggio: ' + (err?.message || 'Riprova.'));
    } finally {
      setIsSaving(false);
    }
  };

  const getBadgeStyle = (type: ExecutionType) => {
    switch (type) {
      case 'STRIPPING': return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'REST_PAUSE': return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'SUPERSET': return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      case 'CLUSTER': return 'bg-rose-950 text-rose-300 border-rose-800';
      default: return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  const totalWorkoutSets = useMemo(() => {
    return activeExercises.reduce((acc: number, ex: any) => acc + (ex.sets || 0), 0);
  }, [activeExercises]);

  const workoutProgressPct = totalWorkoutSets > 0 
    ? Math.min(100, Math.round((todayLogs.length / totalWorkoutSets) * 100)) 
    : 0;

  return (
    <div className="space-y-4">
      
      {/* BOX PRINCIPALE */}
      <div className="bg-[#12151B] p-4 sm:p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
        
        {/* HEADER SCHEDA */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Dumbbell className="text-[#E50914] w-6 h-6" /> Scheda: {programName || 'TOP GYM'}
          </h2>
          <span className="text-xs font-bold text-zinc-400 bg-zinc-900 border border-white/5 px-2.5 py-1 rounded-lg">
            Atleta: {athleteName}
          </span>
        </div>

        {/* SELETTORE GIORNI ORIZZONTALE */}
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-none pb-1 snap-x w-full">
          {sanitizedDays.map((day, index) => {
            const isSelected = selectedDayIndex === index;
            return (
              <button
                key={day.id || index}
                type="button"
                onClick={() => {
                  setSelectedDayIndex(index);
                  if (day.exercises && day.exercises.length > 0) {
                    handleSelectExercise(day.exercises[0]);
                  } else {
                    setCurrentExId('');
                  }
                }}
                className={`shrink-0 snap-start px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#E50914] border-[#E50914] text-white shadow-md'
                    : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${isSelected ? 'bg-black/30' : 'bg-white/5'}`}>
                  G{day.dayNumber || index + 1}
                </span>
                <span>{day.title.length > 18 ? day.title.substring(0, 18) + '...' : day.title}</span>
              </button>
            );
          })}
        </div>

        {/* BARRA AVANZAMENTO */}
        <div className="mb-5 bg-black/40 p-3 rounded-xl border border-white/5">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Avanzamento Sessione
            </span>
            <span className="text-[12px] font-black text-white">{workoutProgressPct}%</span>
          </div>
          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-[#E50914] transition-all duration-700 ease-out"
              style={{ width: `${workoutProgressPct}%` }}
            />
          </div>
        </div>

        {/* LISTA ESERCIZI (RENDERIZZATA ATTRAVERSO ExerciseCard) */}
        {activeExercises.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-sm">
            Nessun esercizio presente in questa giornata.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {activeExercises.map((ex: any) => {
              const isSelected = currentExId === ex.id;
              const isBw = !!findBodyweightConfig(ex.name);
              const exTodayLogs = todayLogs.filter(l => l.exerciseName === ex.name);
              const lastLog = exTodayLogs.length > 0 ? exTodayLogs[0] : null;

              return (
                <ExerciseCard
                  key={ex.id}
                  ex={ex}
                  isSelected={isSelected}
                  onSelect={() => handleSelectExercise(ex)}
                  todayLogs={todayLogs}
                  isMasterProgram={false}
                  isBw={isBw}
                  getBadgeStyle={getBadgeStyle}
                  lastLoggedSet={lastLog}
                  handleAutoFillLastLog={() => {
                    if (lastLog) {
                      setWeight(String(lastLog.weight));
                      setReps(String(lastLog.reps));
                      setRpe(String(lastLog.rpe || '8'));
                    }
                  }}
                  weight={weight}
                  setWeight={setWeight}
                  adjustWeight={adjustWeight}
                  reps={reps}
                  setReps={setReps}
                  rpe={rpe}
                  setRpe={setRpe}
                  handleLogSet={handleLogSet}
                  handleDeleteLog={handleDeleteLog}
                />
              );
            })}
          </div>
        )}

      </div>

      {/* PULSANTE TERMINA ALLENAMENTO INDIPENDENTE A FINE SCHEDA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowConfirmModal(true)}
          className="w-full py-4 bg-[#E50914] hover:bg-red-600 text-white font-black text-sm rounded-2xl uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-xl shadow-red-950/30 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Check className="w-5 h-5 stroke-[3]" /> Termina Sessione & Salva
        </button>
      </div>

      {/* FLOATING REST TIMER (VISIBILE ESCLUSIVAMENTE QUANDO IL RECUPERO È ATTIVO) */}
      {isTimerActive && restTimeLeft > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/95 border border-[#E50914]/50 shadow-[0_0_30px_rgba(229,9,20,0.35)] backdrop-blur-md px-5 py-3 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#E50914] animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Recupero</span>
              <span className="text-base font-black font-mono text-white tracking-widest">
                {Math.floor(restTimeLeft / 60)}:{(restTimeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
            <button
              type="button"
              onClick={() => setRestTimeLeft(prev => prev + 30)}
              className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-lg text-[10px] font-black text-zinc-300 hover:text-white active:scale-95 transition-all cursor-pointer"
              title="Aggiungi 30 secondi di recupero"
            >
              +30s
            </button>
            <button
              type="button"
              onClick={() => { setIsTimerActive(false); setRestTimeLeft(0); }}
              className="px-2.5 py-1.5 bg-zinc-900 hover:bg-rose-950/40 border border-white/10 hover:border-rose-500/30 rounded-lg text-[10px] font-black text-zinc-400 hover:text-rose-400 active:scale-95 transition-all cursor-pointer"
              title="Interrompi recupero"
            >
              Salta
            </button>
          </div>
        </div>
      )}

      {/* MODALE DI CONFERMA SALVATAGGIO IN-APP (RISOLVE IL BLOCCO DI WINDOW.CONFIRM SU IPHONE / SAFARI) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12151B] border border-white/10 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2.5 bg-red-950/50 border border-red-500/30 rounded-xl text-[#E50914]">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base">Termina Allenamento</h3>
                <p className="text-xs text-zinc-400">Salvataggio nello storico</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {todayLogs.length === 0 ? (
                <span className="text-amber-400 flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Non hai ancora registrato alcuna serie oggi. Vuoi salvare comunque la seduta?
                </span>
              ) : (
                `Hai completato ${todayLogs.length} serie in questa seduta. Vuoi procedere con il salvataggio definitivo su TOP GYM?`
              )}
            </p>

            {statusMessage && (
              <div className="text-[11px] p-2 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300">
                {statusMessage}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl border border-white/10 transition-colors"
              >
                Annulla
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={executeSaveWorkout}
                className="flex-1 py-2.5 bg-[#E50914] hover:bg-red-600 text-white font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Conferma e Salva'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
