'use client';

import React, { useEffect } from 'react';
import { Plus, Minus, X, CheckCircle, Loader2 } from 'lucide-react';
import { useWorkoutSession } from '../lib/useWorkoutSession';

interface RestTimerBarProps {
  todayLogsCount: number;
  onFinishWorkout: () => void;
  isSavingWorkout: boolean;
}

export function RestTimerBar({
  todayLogsCount,
  onFinishWorkout,
  isSavingWorkout
}: RestTimerBarProps) {
  const {
    restSecondsRemaining,
    isRestActive,
    completeSet,
    adjustRestTime,
    stopRestTimer,
  } = useWorkoutSession();

  // Ascolto del CustomEvent isolato
  useEffect(() => {
    const handleStartRest = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      const seconds = customEvent.detail;
      completeSet('metabolic', seconds);
    };

    window.addEventListener('topgym:start-rest', handleStartRest);
    return () => window.removeEventListener('topgym:start-rest', handleStartRest);
  }, [completeSet]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* 1. SEZIONE FINE WORKOUT (IN-FLOW A FINE SCHEDA, DOPO L'ULTIMO ESERCIZIO) */}
      <div className="mt-8 mb-16 p-4 sm:p-5 bg-zinc-900/90 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center text-lg">
            🏋️
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
              Riepilogo Sessione
            </span>
            <span className="text-sm font-black text-white">
              {todayLogsCount} {todayLogsCount === 1 ? 'serie completata' : 'serie completate'} oggi
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onFinishWorkout}
          disabled={isSavingWorkout}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#E50914] hover:bg-red-700 active:scale-95 text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-all disabled:opacity-50 shadow-lg shadow-red-950/40 cursor-pointer"
        >
          {isSavingWorkout ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <CheckCircle size={18} className="stroke-[2.5]" />
          )}
          {isSavingWorkout ? 'Salvataggio...' : 'Concludi Allenamento'}
        </button>
      </div>

      {/* 2. PILL FLUTTUANTE COMPATTO PER IL TIMER (SOLO SE ATTIVO, NESSUNA BARRA FISSA A SCHERMO INTERO) */}
      {isRestActive && restSecondsRemaining !== null && (
        <div className="fixed bottom-24 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:w-auto z-[9999] bg-zinc-950/95 backdrop-blur-md border border-cyan-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.85)] rounded-2xl px-4 py-2.5 flex items-center gap-3 text-white animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex flex-col">
            <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Recupero
            </span>
            <span className="text-3xl font-black font-mono text-cyan-300 tracking-tight text-white leading-none mt-0.5">
              {formatTime(restSecondsRemaining)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-2 border-l border-white/10 pl-3">
            <button
              type="button"
              onClick={() => adjustRestTime(-30)}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 active:scale-95 rounded-lg text-zinc-300 transition-colors"
              title="Togli 30 secondi"
              aria-label="Togli 30 secondi"
            >
              <Minus size={15} />
            </button>
            <button
              type="button"
              onClick={() => adjustRestTime(30)}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 active:scale-95 rounded-lg text-zinc-300 transition-colors"
              title="Aggiungi 30 secondi"
              aria-label="Aggiungi 30 secondi"
            >
              <Plus size={15} />
            </button>
            <button
              type="button"
              onClick={stopRestTimer}
              className="p-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 active:scale-95 rounded-lg text-rose-300 transition-colors ml-1"
              title="Termina recupero"
              aria-label="Termina recupero"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
