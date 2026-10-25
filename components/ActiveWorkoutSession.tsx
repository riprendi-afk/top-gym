'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Dumbbell, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { ExerciseCard, PlannedWeekTargets } from './ExerciseCard';
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

  // 1. STATO SETTIMANA SELEZIONATA (W1 - W16) & GIORNATA ATTIVA
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // 2. SANITIZZAZIONE GIORNI (SOLO SIGLE COMPATTE G1, G2, G3...)
  const sanitizedDays = useMemo(() => {
    if (!Array.isArray(programDays) || programDays.length === 0) return [];
    
    return programDays.map((d, dIdx) => {
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
        title: `G${d?.dayNumber || dIdx + 1}`,
        exercises,
        weekOverrides: d?.weekOverrides || {},
      };
    });
  }, [programDays]);

  const activeDay = sanitizedDays[selectedDayIndex] || sanitizedDays[0];
  const activeExercises = activeDay?.exercises || [];

  // Calcolo dinamico dello stato di Deload della settimana
  const isDeloadWeek = useMemo(() => {
    if (selectedWeek === 4 || selectedWeek === 10 || selectedWeek === 16) return true;
    const currentDayOverrides = activeDay?.weekOverrides || (programDays && (programDays[0] as any)?.weekOverrides) || {};
    const currentWeekData = currentDayOverrides?.[selectedWeek] || currentDayOverrides?.[String(selectedWeek)] || {};
    return Object.values(currentWeekData).some((ov: any) => ov?.isDeload === true);
  }, [selectedWeek, activeDay, programDays]);

  const [currentExId, setCurrentExId] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('8');
  const [rpe, setRpe] = useState<string>('8');

  // Logs locali sicuri
  const [todayLogs, setTodayLogs] = useState<SetLog[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Timer di Recupero
  const [restTimeLeft, setRestTimeLeft] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  // Ripristino Logs da LocalStorage
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

  const saveLogsSafely = (logs: SetLog[]) => {
    setTodayLogs(logs);
    if (typeof window === 'undefined' || !athleteId) return;
    try {
      localStorage.setItem(`topgym_session_logs_${athleteId}`, JSON.stringify(logs));
    } catch {}
  };

  // Helper per estrarre i target della settimana per il dato esercizio
  const getPlannedTargetsForEx = (ex: any): PlannedWeekTargets => {
    const weekOverrides = activeDay?.weekOverrides || (programDays && (programDays[0] as any)?.weekOverrides) || {};
    const weekOv = weekOverrides?.[selectedWeek]?.[ex.id] || weekOverrides?.[String(selectedWeek)]?.[ex.id];

    const plannedSets = (weekOv?.sets !== undefined && weekOv?.sets !== null && weekOv?.sets !== '')
      ? Number(weekOv.sets)
      : (weekOv?.isDeload ? Math.max(2, Math.round(Number(ex.sets || 3) * 0.6)) : Number(ex.sets) || 3);

    const plannedReps = (weekOv?.reps !== undefined && weekOv?.reps !== null && weekOv?.reps !== '')
      ? String(weekOv.reps)
      : String(ex.reps || '8');

    const plannedWeight = (weekOv?.targetWeight !== undefined && weekOv?.targetWeight !== null && weekOv?.targetWeight !== '')
      ? String(weekOv.targetWeight)
      : (ex.targetWeight ? String(ex.targetWeight) : '');

    const plannedRest = (weekOv?.restSeconds !== undefined && weekOv?.restSeconds !== null && weekOv?.restSeconds !== '')
      ? Number(weekOv.restSeconds)
      : Number(ex.restSeconds) || 90;

    return {
      sets: plannedSets,
      reps: plannedReps,
      targetWeight: plannedWeight,
      restSeconds: plannedRest,
      rpeTarget: weekOv?.rpeTarget || ex.rpeTarget,
      tut: ex.tut,
      notes: weekOv?.notes || ex.notes,
      isDeload: weekOv?.isDeload || isDeloadWeek,
    };
  };

  const handleSelectExercise = (ex: any) => {
    if (currentExId === ex.id) {
      setCurrentExId('');
      return;
    }
    setCurrentExId(ex.id);

    // 1) Se serie già eseguite oggi, usa l'ultima serie
    const exTodayLogs = todayLogs.filter((l: any) => l.exerciseName === ex.name);
    if (exTodayLogs.length > 0) {
      const last = exTodayLogs[0];
      setWeight(String(last.weight));
      setReps(String(last.reps));
      setRpe(String(last.rpe || '8'));
      return;
    }

    // 2) Altrimenti precompila coi target della settimana selezionata
    const targets = getPlannedTargetsForEx(ex);
    setWeight(targets.targetWeight || '');
    setReps(targets.reps || '8');
    setRpe(targets.rpeTarget || '8');
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
    const currentEx = activeExercises.find((exItem: any) => exItem.id === currentExId);
    if (!currentEx) return;

    // Tetto dinamico basato esattamente sulle serie previste per questa settimana
    const targets = getPlannedTargetsForEx(currentEx);
    const exTodayCount = todayLogs.filter((l: any) => l.exerciseName === currentEx.name).length;
    if (exTodayCount >= targets.sets) return;

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

    // Avvio Timer col tempo di recupero della settimana
    const rest = targets.restSeconds || 90;
    setRestTimeLeft(rest);
    setIsTimerActive(true);
    triggerVibrate(50);
  };

  const handleDeleteLog = (logId: string) => {
    const updated = todayLogs.filter((l: any) => l.id !== logId);
    saveLogsSafely(updated);
  };

  const parseSafeNumber = (val: any): number => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const str = String(val).replace(',', '.').replace(/[^0-9.-]/g, '');
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  };

  const executeSaveWorkout = async () => {
    if (!athleteId) {
      setStatusMessage('⚠ Errore: Atleta non identificato.');
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
        dayName: `G${activeDay?.dayNumber || selectedDayIndex + 1} (W${selectedWeek})`,
        totalVolume: totalVol,
        exercisesCount: activeExercises.length,
        logs: sanitizedLogs as any,
      });

      if (!res?.success) {
        setStatusMessage('⚠ Errore durante il salvataggio: ' + (res?.error || 'Verifica la connessione.'));
        setIsSaving(false);
        return;
      }

      setShowConfirmModal(false);
      setTodayLogs([]);
      if (typeof window !== 'undefined') {
        try { localStorage.removeItem(`topgym_session_logs_${athleteId}`); } catch {}
      }

      triggerVibrate([100, 50, 100]);
      await onWorkoutSaved();
    } catch (err: any) {
      setStatusMessage('⚠ Eccezione salvataggio: ' + (err?.message || 'Riprova.'));
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

  // Calcolo totale serie previste per questa giornata nella settimana scelta
  const totalWorkoutSets = useMemo(() => {
    return activeExercises.reduce((acc: number, ex: any) => {
      const tg = getPlannedTargetsForEx(ex);
      return acc + tg.sets;
    }, 0);
  }, [activeExercises, selectedWeek, activeDay]);

  const workoutProgressPct = totalWorkoutSets > 0 
    ? Math.min(100, Math.round((todayLogs.length / totalWorkoutSets) * 100)) 
    : 0;

  return (
    /* pb-32 sm:pb-16 garantisce che l'ultimo pulsante sia sempre completamente visibile e cliccabile sopra la barra mobile */
    <div className="space-y-4 pb-32 sm:pb-16">
      
      {/* BOX PRINCIPALE */}
      <div className="bg-[#12151B] p-4 sm:p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md space-y-4">
        
        {/* HEADER SCHEDA */}
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Dumbbell className="text-[#E50914] w-6 h-6" /> Scheda: {programName || 'TOP GYM'}
          </h2>
          <span className="text-xs font-bold text-zinc-400 bg-zinc-900 border border-white/5 px-2.5 py-1 rounded-lg">
            Atleta: {athleteName}
          </span>
        </div>

        {/* 1. SELETTORE SETTIMANA ORIZZONTALE (W1 - W16) */}
        <div className="bg-black/40 border border-white/5 rounded-xl p-2.5 space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
              Settimana (Microciclo)
            </span>
            <span className="text-[10px] font-mono text-sky-400 font-bold">
              {isDeloadWeek ? 'Fase Scarico / Deload' : `Microciclo W${selectedWeek}`}
            </span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x">
            {Array.from({ length: 16 }, (_, i) => i + 1).map((wNum) => {
              const isDeload = wNum === 4 || wNum === 10 || wNum === 16;
              const isSelected = selectedWeek === wNum;
              return (
                <button
                  key={wNum}
                  type="button"
                  onClick={() => setSelectedWeek(wNum)}
                  className={`shrink-0 snap-start px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#E50914] border-[#E50914] text-white shadow-md shadow-red-950/50'
                      : isDeload
                      ? 'bg-blue-950/30 border-blue-500/30 text-blue-300 hover:bg-blue-900/40'
                      : 'bg-black/40 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>W{wNum}</span>
                  {isDeload && <span className="text-[8px] block opacity-80 leading-none">Deload</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. SELETTORE GIORNATE: SOLO G1, G2, G3... */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Giornata:</span>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5 snap-x flex-1">
            {sanitizedDays.map((day, index) => {
              const isSelected = selectedDayIndex === index;
              const label = `G${day.dayNumber || index + 1}`;
              return (
                <button
                  key={day.id || index}
                  type="button"
                  onClick={() => {
                    setSelectedDayIndex(index);
                    setCurrentExId('');
                  }}
                  className={`shrink-0 snap-start px-4 py-2 rounded-xl text-xs font-black transition-all border cursor-pointer font-mono ${
                    isSelected
                      ? 'bg-[#E50914] border-[#E50914] text-white shadow-md shadow-red-950/40 scale-105'
                      : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* BARRA AVANZAMENTO */}
        <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Avanzamento Seduta
            </span>
            <span className="text-[11px] font-black text-white">{workoutProgressPct}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-[#E50914] transition-all duration-700 ease-out"
              style={{ width: `${workoutProgressPct}%` }}
            />
          </div>
        </div>

        {/* LISTA ESERCIZI */}
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

              const plannedTargets = getPlannedTargetsForEx(ex);

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
                  plannedTargets={plannedTargets}
                />
              );
            })}
          </div>
        )}

      </div>

      {/* PULSANTE TERMINA ALLENAMENTO INDIPENDENTE (CON MARGINE AGGIUNTO) */}
      <div className="pt-3">
        <button
          type="button"
          onClick={() => setShowConfirmModal(true)}
          className="w-full py-4 bg-[#E50914] hover:bg-red-600 text-white font-black text-sm rounded-2xl uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-xl shadow-red-950/40 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Check className="w-5 h-5 stroke-[3]" /> Termina Sessione & Salva
        </button>
      </div>

      {/* FLOATING REST TIMER: POSIZIONATO A bottom-20 SU MOBILE CON z-[70] PER ESSERE SEMPRE PERFETTAMENTE VISIBILE SOPRA LA BARRA BOTTOM */}
      {isTimerActive && restTimeLeft > 0 && (
        <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-[70] bg-[#0c0e12]/95 border border-[#E50914]/60 shadow-[0_10px_35px_rgba(229,9,20,0.45)] backdrop-blur-xl px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl flex items-center justify-between gap-3 sm:gap-4 max-w-[92vw] w-auto whitespace-nowrap animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#E50914] animate-pulse shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Recupero</span>
              <span className="text-base sm:text-lg font-black font-mono text-white tracking-widest">
                {Math.floor(restTimeLeft / 60)}:{(restTimeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
            <button
              type="button"
              onClick={() => setRestTimeLeft(prev => prev + 30)}
              className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-lg text-[10px] font-black text-zinc-300 hover:text-white active:scale-95 transition-all cursor-pointer"
              title="Aggiungi 30 secondi"
            >
              +30s
            </button>
            <button
              type="button"
              onClick={() => { setIsTimerActive(false); setRestTimeLeft(0); }}
              className="px-2.5 py-1.5 bg-zinc-900 hover:bg-rose-950/40 border border-white/10 hover:border-rose-500/30 rounded-lg text-[10px] font-black text-zinc-400 hover:text-rose-400 active:scale-95 transition-all cursor-pointer"
              title="Salta recupero"
            >
              Salta
            </button>
          </div>
        </div>
      )}

      {/* MODALE DI CONFERMA SALVATAGGIO */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
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
