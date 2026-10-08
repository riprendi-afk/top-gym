'use client';

import React, { useEffect } from 'react';
import { Plus, Minus, X, CheckCircle, Loader2 } from 'lucide-react';
import { useWorkoutSession } from '../lib/useWorkoutSession';

// 1. Dichiariamo i props per risolvere l'errore TypeScript
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
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 text-white shadow-2xl z-50 flex items-center justify-between pb-safe">
      
      {/* STATO 1: TIMER ATTIVO */}
      {isRestActive && restSecondsRemaining !== null ? (
        <>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Recupero</span>
            <span className="text-3xl font-bold font-mono tracking-tighter text-blue-400">
              {formatTime(restSecondsRemaining)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => adjustRestTime(-30)}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Togli 30 secondi"
            >
              <Minus size={20} className="text-gray-300" />
            </button>
            <button
              onClick={() => adjustRestTime(30)}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Aggiungi 30 secondi"
            >
              <Plus size={20} className="text-gray-300" />
            </button>
            <button
              onClick={stopRestTimer}
              className="p-2 bg-red-900/50 hover:bg-red-900 rounded-full border border-red-800 transition-colors ml-2"
              aria-label="Termina recupero"
            >
              <X size={20} className="text-red-400" />
            </button>
          </div>
        </>
      ) : (
        
        /* STATO 2: NESSUN RECUPERO (MOSTRA PULSANTE FINE ALLENAMENTO) */
        <>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Sessione</span>
            <span className="text-sm font-bold text-gray-200">
              {todayLogsCount} serie completate
            </span>
          </div>
          
          <button
            onClick={onFinishWorkout}
            disabled={isSavingWorkout}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {isSavingWorkout ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <CheckCircle size={20} />
            )}
            {isSavingWorkout ? 'Salvataggio...' : 'Fine Workout'}
          </button>
        </>
      )}
    </div>
  );
}