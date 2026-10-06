'use client';

import React, { useState } from 'react';
import {
  calculateNocerinoState,
  applyNocerinoToCustomExercises,
  ModularDayPlan,
  ModularExerciseInput,
  CalculatedNocerinoExercise
} from '@/lib/nocerino-engine';

// Template di default modificabile dei 3 giorni
const DEFAULT_NOCERINO_DAYS: ModularDayPlan[] = [
  {
    dayIndex: 0,
    title: 'Giorno 1: Schiena, Femorali & Bicipiti',
    exercises: [
      { id: 'd1_1', name: 'Hyperextension (riscaldamento)', baseSets: 2, baseReps: 15, baseRestSeconds: 60, isWarmup: true },
      { id: 'd1_2', name: 'Stacco da terra', baseSets: 5, baseReps: '6-8', baseRestSeconds: 180 },
      { id: 'd1_3', name: 'Rematore con bilanciere/manubrio', baseSets: 5, baseReps: 8, baseRestSeconds: 120 },
      { id: 'd1_4', name: 'Panca lombari con peso al petto', baseSets: 5, baseReps: 12, baseRestSeconds: 30 },
      { id: 'd1_5', name: 'Leg Curl (sdraiato o seduto)', baseSets: 5, baseReps: 12, baseRestSeconds: 120 },
      { id: 'd1_6', name: 'Curl manubri seduto', baseSets: 5, baseReps: 8, baseRestSeconds: 90 }
    ]
  },
  {
    dayIndex: 1,
    title: 'Giorno 2: Gambe, Lombari & Addominali',
    exercises: [
      { id: 'd2_1', name: 'Leg Press 45°', baseSets: 6, baseReps: 20, baseRestSeconds: 180 },
      { id: 'd2_2', name: 'Squat libero o Multipower', baseSets: 8, baseReps: 12, baseRestSeconds: 180 },
      { id: 'd2_3', name: 'Panca lombari corpo libero', baseSets: 5, baseReps: 20, baseRestSeconds: 60 },
      { id: 'd2_4', name: 'Crunches al soffitto (palla/disco)', baseSets: 10, baseReps: 20, baseRestSeconds: 45 }
    ]
  },
  {
    dayIndex: 2,
    title: 'Giorno 3: Petto, Spalle & Tricipiti',
    exercises: [
      { id: 'd3_1', name: 'Panca piana / Chest Press', baseSets: 5, baseReps: 8, baseRestSeconds: 120 },
      { id: 'd3_2', name: 'Panca inclinata / Spinte manubri', baseSets: 5, baseReps: 8, baseRestSeconds: 120 },
      { id: 'd3_3', name: 'Cavi incrociati o croci', baseSets: 3, baseReps: 20, baseRestSeconds: 60 },
      { id: 'd3_4', name: 'Alzate laterali manubri', baseSets: 5, baseReps: 15, baseRestSeconds: 60 },
      { id: 'd3_5', name: 'Alzate 90° manubri', baseSets: 5, baseReps: 12, baseRestSeconds: 60 },
      { id: 'd3_6', name: 'French Press bilanciere sagomato', baseSets: 5, baseReps: 8, baseRestSeconds: 120 },
      { id: 'd3_7', name: 'French Press Back-Off (-50% peso)', baseSets: 5, baseReps: 15, baseRestSeconds: 60 }
    ]
  }
];

interface NocerinoCabinaProps {
    workoutHistory?: any[];
    onApplyProgram?: (newDays: any[]) => void;
  }

// In components/NocerinoCabina.tsx

interface NocerinoCabinaProps {
    workoutHistory?: any[];
    onApplyProgram?: (newDays: any[]) => void;
  }
  
  export default function NocerinoCabina({
    workoutHistory = [],
    onApplyProgram
  }: NocerinoCabinaProps) {
    // Calcolo deterministico dai workout salvati in storico
    const completedWorkoutsCount = workoutHistory?.length || 0;
    const state = calculateNocerinoState(completedWorkoutsCount);
    const [selectedDayIndex, setSelectedDayIndex] = useState<0 | 1 | 2>(state.dayIndex);
    const [plans] = useState<ModularDayPlan[]>(DEFAULT_NOCERINO_DAYS);
  
    const activePlan = plans[selectedDayIndex];
    const calculatedExercises = applyNocerinoToCustomExercises(activePlan.exercises, state);
  
    const handleApply = () => {
      if (onApplyProgram) {
        // Formatta tutti e 3 i giorni del ciclo con i parametri della fase corrente
        const formattedDays = plans.map((plan, idx) => {
          const exercisesCalculated = applyNocerinoToCustomExercises(plan.exercises, state);
          return {
            id: `nocerino_day_${idx + 1}`,
            title: `${plan.title} (${state.phaseLabel})`,
            isPeriodized: true,
            method: 'NOCERINO',
            exercises: exercisesCalculated.map((ex, exIdx) => ({
              id: ex.id || `noc_ex_${idx}_${exIdx}`,
              name: ex.name,
              sets: ex.sets,
              reps: ex.reps,
              rest: ex.restSeconds,
              restSeconds: ex.restSeconds,
              tut: ex.tut,
              notes: `${ex.notes} | ${ex.loadInstruction}`.trim(),
              targetMuscle: ex.targetMuscle,
              isWarmup: ex.isWarmup
            }))
          };
        });
  
        onApplyProgram(formattedDays);
      }
    };
  
    // ... (il resto del JSX rimane invariato)

  return (
    <div className="bg-zinc-950 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-6 text-white my-6">
      {/* HEADER CABINA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-black uppercase tracking-wider bg-emerald-500 text-black rounded-md">
              Metodo Piero Nocerino
            </span>
            <span className="text-xs text-zinc-400">Periodizzazione Progressiva a 4 Mesi</span>
          </div>
          <h2 className="text-xl font-bold mt-2 text-white">Cabina di Controllo & Programmazione</h2>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-400">Workout Registrati</div>
          <div className="text-2xl font-black text-emerald-400">{completedWorkoutsCount}</div>
        </div>
      </div>

      {/* STATO MATEMATICO DEL MOTORE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5">
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Fase Corrente</div>
          <div className="text-sm font-bold text-emerald-400 mt-1 truncate">{state.phaseLabel}</div>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5">
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Mese / Microciclo</div>
          <div className="text-sm font-bold text-white mt-1">
            Mese {state.monthNumber} · Micro {state.weekInPhase}/4
          </div>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5">
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Giorno di Rotazione</div>
          <div className="text-sm font-bold text-emerald-400 mt-1">
            Giorno {state.dayIndex + 1} di 3 (Auto)
          </div>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5">
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Avanzamento Macrociclo</div>
          <div className="text-sm font-bold text-white mt-1">{state.overallProgressPercentage}%</div>
        </div>
      </div>

      {/* DIRETTIVA DELLA FASE ATTIVA */}
      <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
          🎯 Direttiva Scientifica del Periodo:
        </div>
        <p className="text-sm text-zinc-200">{state.phaseDirective}</p>
        <p className="text-xs text-zinc-400 mt-2 font-mono">
          Focus: {state.activeFocus} · TUT di riferimento: 2-0-2 (24&quot; di Tensione Meccanica a 6 reps)
        </p>
      </div>

      {/* SELETTORE GIORNO DELLA SCHEDA */}
      <div className="flex flex-wrap gap-2 pt-2">
        {plans.map((p) => {
          const isSelected = selectedDayIndex === p.dayIndex;
          const isEngineSuggested = state.dayIndex === p.dayIndex;
          return (
            <button
              key={p.dayIndex}
              type="button"
              onClick={() => setSelectedDayIndex(p.dayIndex)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                isSelected
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              {p.title.split(':')[0]} {isEngineSuggested && '⚡ Consigliato'}
            </button>
          );
        })}
      </div>

      {/* TABELLA ESERCIZI CON SERIE, REPS E RECUPERO CALCOLATI */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50">
        <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
          <span className="text-sm font-bold text-white">{activePlan.title}</span>
          <span className="text-xs text-emerald-400 font-mono">Parametri modulati per la fase</span>
        </div>
        <div className="divide-y divide-zinc-800/60">
          {calculatedExercises.map((ex) => (
            <div key={ex.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  {ex.name}
                  {ex.isWarmup && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Riscaldamento
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-400">{ex.notes}</div>
                <div className="text-xs text-emerald-400 font-medium">{ex.loadInstruction}</div>
              </div>
              <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                <div className="bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 text-center">
                  <div className="text-[10px] text-zinc-500 uppercase">Serie</div>
                  <div className="text-sm font-bold text-white">{ex.sets}</div>
                </div>
                <div className="bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 text-center">
                  <div className="text-[10px] text-zinc-500 uppercase">Reps</div>
                  <div className="text-sm font-bold text-emerald-400">{ex.reps}</div>
                </div>
                <div className="bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 text-center">
                  <div className="text-[10px] text-zinc-500 uppercase">Rest</div>
                  <div className="text-sm font-bold text-white">{ex.restSeconds}&quot;</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* APPLICAZIONE / SALVATAGGIO */}
      {onApplyProgram && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
          >
            Applica Scheda alla Sessione Live
          </button>
        </div>
      )}
    </div>
  );
}