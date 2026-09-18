// components/PersonalRecords.tsx
'use client';

import React, { useMemo } from 'react';
import { Trophy, Award, Flame, Calendar, Info } from 'lucide-react';
import { findBodyweightConfig } from '@/lib/lib/bodyweight';

interface PRRecord {
  exerciseName: string;
  isBodyweight: boolean;
  bestExternalWeight: number;
  bestEffectiveLoad: number | null;
  bestBWUsed: number | null;
  bestPercentage: number | null;
  bestReps: number;
  best1RM: number;
  date: string;
}

interface PersonalRecordsProps {
  workoutHistory: any[];
  currentLogs: any[];
  athleteName: string;
}

export default function PersonalRecords({ workoutHistory, currentLogs, athleteName }: PersonalRecordsProps) {
  const records = useMemo(() => {
    const map = new Map<string, PRRecord>();

    const allSets: any[] = [];
    currentLogs.forEach(l => allSets.push(l));
    workoutHistory.forEach(w => {
      if (Array.isArray(w.logs)) {
        w.logs.forEach((l: any) => {
          allSets.push({
            ...l,
            date: l.date || w.created_at || w.date
          });
        });
      }
    });

    allSets.forEach((set) => {
      const name = set.exerciseName?.trim();
      if (!name) return;

      const weight = Number(set.weight ?? set.externalLoad ?? 0);
      const reps = Number(set.reps || 0);
      const effectiveLoad = set.effectiveLoad !== undefined && set.effectiveLoad !== null ? Number(set.effectiveLoad) : null;
      const bwUsed = set.bodyWeightUsed !== undefined ? Number(set.bodyWeightUsed) : null;
      const pctUsed = set.percentageUsed !== undefined ? Number(set.percentageUsed) : null;
      const est1RM = Number(set.estimated1RM || (reps === 1 ? weight : Math.round(weight * (1 + reps / 30))));
      const date = set.date ? new Date(set.date).toLocaleDateString('it-IT') : 'Recente';

      const config = findBodyweightConfig(name);
      const isBw = !!config || !!set.isBodyweight;

      const existing = map.get(name);
      if (!existing) {
        map.set(name, {
          exerciseName: name,
          isBodyweight: isBw,
          bestExternalWeight: weight,
          bestEffectiveLoad: effectiveLoad,
          bestBWUsed: bwUsed,
          bestPercentage: pctUsed || config?.percentage || null,
          bestReps: reps,
          best1RM: est1RM,
          date
        });
      } else {
        const candidateScore = effectiveLoad !== null ? effectiveLoad : weight;
        const currentBestScore = existing.bestEffectiveLoad !== null ? existing.bestEffectiveLoad : existing.bestExternalWeight;

        if (candidateScore > currentBestScore || (candidateScore === currentBestScore && reps > existing.bestReps)) {
          map.set(name, {
            exerciseName: name,
            isBodyweight: isBw,
            bestExternalWeight: weight,
            bestEffectiveLoad: effectiveLoad,
            bestBWUsed: bwUsed || existing.bestBWUsed,
            bestPercentage: pctUsed || existing.bestPercentage,
            bestReps: reps,
            best1RM: Math.max(est1RM, existing.best1RM),
            date
          });
        }
      }
    });

    return Array.from(map.values()).sort((a, b) => (b.bestEffectiveLoad || b.bestExternalWeight) - (a.bestEffectiveLoad || a.bestExternalWeight));
  }, [workoutHistory, currentLogs]);

  return (
    <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800 space-y-5">
      <div className="flex justify-between items-center flex-wrap gap-2 pb-3 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Record Personali (PR)
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">Migliori prestazioni ricavate dallo storico reale di {athleteName}.</p>
        </div>
        <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800">
          {records.length} Esercizi tracciati
        </span>
      </div>

      {records.length === 0 ? (
        <div className="p-8 text-center bg-zinc-900/50 rounded-xl border border-zinc-800 text-zinc-500 text-xs italic">
          Nessun record ancora registrato. Completa gli allenamenti per generare i tuoi massimali reali.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {records.map((pr) => (
            <div key={pr.exerciseName} className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-bold text-white text-sm">{pr.exerciseName}</span>
                {pr.isBodyweight ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300 uppercase">
                    Corpo Libero
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 uppercase">
                    Carico Esterno
                  </span>
                )}
              </div>

              {pr.isBodyweight ? (
                <div className="space-y-1 pt-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-zinc-400">Carico Effettivo:</span>
                    <span className="text-lg font-black text-[#E50914]">
                      {pr.bestEffectiveLoad !== null ? `${pr.bestEffectiveLoad} Kg` : 'Calcolo in attesa di peso'}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 bg-zinc-950/60 p-2 rounded border border-zinc-800/80 flex flex-wrap justify-between gap-1">
                    <span>Zavorra: <b className="text-white">+{pr.bestExternalWeight} kg</b></span>
                    {pr.bestBWUsed && <span>BW: <b className="text-white">{pr.bestBWUsed} kg</b></span>}
                    {pr.bestPercentage && <span>Quota: <b className="text-white">{Math.round(pr.bestPercentage * 100)}%</b></span>}
                    <span>Reps: <b className="text-white">{pr.bestReps}</b></span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 pt-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-zinc-400">Max Carico:</span>
                    <span className="text-lg font-black text-white">{pr.bestExternalWeight} Kg × {pr.bestReps} reps</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 flex justify-between pt-1">
                    <span>1RM Stimato: <b className="text-emerald-400">{pr.best1RM} Kg</b></span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/40 font-mono">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {pr.date}</span>
                <span className="flex items-center gap-1 text-yellow-500 font-bold"><Flame className="w-3 h-3" /> PR Confermato</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}