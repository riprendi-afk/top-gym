// components/AcetoCabina.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  generateAcetoSplit,
  AcetoSplitDays,
  AcetoProgram,
  AcetoWorkoutDay,
  AcetoExercise,
} from "@/lib/Aceto-engine";

interface AcetoCabinaProps {
  activeAthlete?: any;
  onApplyProgram: (newDays: any[]) => void;
}


export default function AcetoCabina({
  activeAthlete,
  onApplyProgram,
}: AcetoCabinaProps) {
  const [selectedSplit, setSelectedSplit] = useState<AcetoSplitDays>(4);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [activeDayTab, setActiveDayTab] = useState<number>(0);

  const program: AcetoProgram = useMemo(() => {
    return generateAcetoSplit(selectedSplit, selectedWeek);
  }, [selectedSplit, selectedWeek]);

  const activeDay: AcetoWorkoutDay = program.workout_days[activeDayTab] ?? program.workout_days[0];

  const handleApply = () => {
    const timestamp = Date.now();
    const formattedDays = program.workout_days.map((day: AcetoWorkoutDay, dIdx: number) => ({
      id: `aceto-day-${day.day_number}-${timestamp}-${dIdx}`,
      day_number: day.day_number,
      name: day.day_label,
      target_muscles: day.target_muscles,
      exercises: day.exercises.map((ex: AcetoExercise, eIdx: number) => ({
        id: `aceto-ex-${ex.order}-${timestamp}-${eIdx}`,
        name: ex.name,
        category: ex.category,
        sets: ex.sets,
        reps: ex.reps,
        load_guideline: ex.load_guideline,
        rir: ex.rir,
        rest_seconds: ex.rest_seconds,
        notes: ex.notes,
      })),
    }));

    onApplyProgram(formattedDays);
  };

  return (
    <div className="bg-zinc-950 border border-red-900/30 rounded-3xl p-5 md:p-7 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600/20 text-red-500 border border-red-600/30">
              Championship Bodybuilding
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              Metodologia Chris Aceto
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            Cabina Periodizzazione Sovraccarico Assoluto
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Reclutamento fibre IIb, cadenza concentrica esplosiva, piramidale e cedimento positivo.
          </p>
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="bg-red-600 hover:bg-red-500 text-white font-black text-xs md:text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-red-950 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <span>🏆</span>
          <span>Applica Scheda {activeAthlete?.nome ? `a ${activeAthlete.nome}` : ""}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/60 space-y-2">
          <label className="text-[11px] font-black tracking-wider text-zinc-400 uppercase">
            Frequenza Settimanale (Split)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {([3, 4, 5, 6] as AcetoSplitDays[]).map((d: AcetoSplitDays) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setSelectedSplit(d);
                  setActiveDayTab(0);
                }}
                className={`py-2 text-xs font-bold rounded-lg border transition ${
                  selectedSplit === d
                    ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-950"
                    : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-white"
                }`}
              >
                {d} Giorni
              </button>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/60 space-y-2">
          <label className="text-[11px] font-black tracking-wider text-zinc-400 uppercase">
            Settimana Mesociclo (1–6)
          </label>
          <div className="grid grid-cols-6 gap-1.5">
            {([1, 2, 3, 4, 5, 6] as number[]).map((w: number) => (
              <button
                key={w}
                type="button"
                onClick={() => setSelectedWeek(w)}
                className={`py-2 text-xs font-bold rounded-lg border transition ${
                  selectedWeek === w
                    ? "bg-white text-black border-white shadow-md"
                    : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-white"
                }`}
              >
                W{w}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 p-3.5 rounded-xl flex items-center justify-between text-xs">
        <span className="font-semibold text-zinc-300">
          Obiettivo Fase Settimana {selectedWeek}:
        </span>
        <span className="font-black text-red-400">
          {selectedWeek <= 2 && "Acquisizione Carico Base (Cedimento 8-10 reps)"}
          {selectedWeek >= 3 && selectedWeek <= 4 && "Sovraccarico Assoluto (+2.5kg tronco / +5kg gambe)"}
          {selectedWeek === 5 && "Picco Intensità (Back-Off o Stripping finale)"}
          {selectedWeek === 6 && "Deload Rigenerativo (Volume -40%, Carichi -20%, RIR 2)"}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {program.workout_days.map((d: AcetoWorkoutDay, idx: number) => (
            <button
              key={d.day_number}
              type="button"
              onClick={() => setActiveDayTab(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition border ${
                activeDayTab === idx
                  ? "bg-zinc-800 text-white border-zinc-600 shadow-md"
                  : "bg-zinc-950/60 text-zinc-400 border-zinc-800/80 hover:text-white"
              }`}
            >
              Giorno {d.day_number}
            </button>
          ))}
        </div>

        {activeDay && (
          <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800/80 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-black text-white">
                {activeDay.day_label}
              </h3>
              <div className="flex gap-1.5">
                {activeDay.target_muscles.map((m: string) => (
                  <span
                    key={m}
                    className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md font-semibold"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-800/60">
                    <th className="pb-2 font-bold uppercase text-[10px]">#</th>
                    <th className="pb-2 font-bold uppercase text-[10px]">Esercizio</th>
                    <th className="pb-2 font-bold uppercase text-[10px]">Tipo</th>
                    <th className="pb-2 font-bold uppercase text-[10px] text-center">Set × Reps</th>
                    <th className="pb-2 font-bold uppercase text-[10px] text-center">Recupero</th>
                    <th className="pb-2 font-bold uppercase text-[10px]">Indicazioni Carico &amp; TUT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {activeDay.exercises.map((ex: AcetoExercise) => (
                    <tr key={ex.order} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 text-zinc-500 font-mono">{ex.order}</td>
                      <td className="py-2.5 font-bold text-white pr-2">{ex.name}</td>
                      <td className="py-2.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/60 text-zinc-400 border border-zinc-700/50">
                          {ex.category}
                        </span>
                      </td>
                      <td className="py-2.5 text-center font-black text-red-400">
                        {ex.sets} × {ex.reps}
                      </td>
                      <td className="py-2.5 text-center text-zinc-300 font-mono">
                        {ex.rest_seconds}&quot;
                      </td>
                      <td className="py-2.5 text-zinc-400 text-[11px]">
                        <div>{ex.load_guideline}</div>
                        <div className="text-[10px] text-zinc-500">{ex.notes}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}