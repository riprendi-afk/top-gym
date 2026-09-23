'use client';

import React from 'react';
import { Activity, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { EngineWorkoutDay } from '@/lib/topgym-engine';
import { AthleteGender } from '@/lib/topgym-templates';
import { calculateWeeklyVolumeRadar, MuscleVolumeStatus } from '@/lib/topgym-volume';

interface WeeklyVolumeRadarProps {
  days: EngineWorkoutDay[];
  athleteName?: string;
  athleteGender?: AthleteGender;
}

export default function WeeklyVolumeRadar({
  days,
  athleteName = 'Atleta',
  athleteGender = 'MALE'
}: WeeklyVolumeRadarProps) {
  const volumeData = calculateWeeklyVolumeRadar(days, athleteGender);

  const totalWeeklySets = volumeData.reduce((acc, curr) => acc + curr.directSets, 0);

  return (
    <div className="bg-[#12151B] border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-6">
      
      {/* HEADER RADAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#E50914]" />
            Radar del Volume Settimanale (MEV · MAV · MRV)
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Analisi volumetrica per <b className="text-white">{athleteName}</b> · Profilo{' '}
            <span className="text-[#E50914] font-bold">
              {athleteGender === 'FEMALE' ? 'Donna (Priorità Catena Posteriore)' : 'Uomo'}
            </span>
          </p>
        </div>

        <div className="bg-black/40 border border-white/5 px-3 py-1.5 rounded-xl text-right">
          <span className="text-[10px] text-zinc-500 uppercase font-mono block">Serie Dirette Totali</span>
          <b className="text-sm text-white font-mono">{totalWeeklySets} set/settimana</b>
        </div>
      </div>

      {/* LEGENDA SCIENTIFICA RAPIDA */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
        <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-white/5">
          <span className="text-zinc-400 font-bold block">Sotto MEV (&lt; MEV)</span>
          <span className="text-[10px] text-zinc-500">Mantenimento o sotto-stimolo.</span>
        </div>
        <div className="bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
          <span className="text-emerald-400 font-bold block">MAV Ottimale (MEV-MAV)</span>
          <span className="text-[10px] text-emerald-300/70">Massima crescita e recupero.</span>
        </div>
        <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
          <span className="text-amber-400 font-bold block">Overreaching (MAV-MRV)</span>
          <span className="text-[10px] text-amber-300/70">Fase intensiva, scarico vicino.</span>
        </div>
        <div className="bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
          <span className="text-rose-400 font-bold block">Eccessivo (&gt; MRV)</span>
          <span className="text-[10px] text-rose-300/70">Rischio catabolismo e stallo.</span>
        </div>
      </div>

      {/* GRIGLIA BARRE MUSCOLARI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {volumeData.map((item: MuscleVolumeStatus) => {
          let barBg = 'bg-emerald-500';
          if (item.status === 'SUB_MEV') barBg = 'bg-zinc-600';
          if (item.status === 'OVERREACHING') barBg = 'bg-amber-500';
          if (item.status === 'EXCESSIVE') barBg = 'bg-rose-500';

          return (
            <div 
              key={item.muscle} 
              className="bg-zinc-900/50 border border-white/5 p-3.5 rounded-xl space-y-2 hover:border-white/10 transition"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  {item.muscle}
                  {item.status === 'OPTIMAL' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {item.status === 'EXCESSIVE' && <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${item.colorClass}`}>
                    {item.totalSets} set ({item.statusLabel})
                  </span>
                </div>
              </div>

              {/* BARRA GRAFICA PROGRESSIONE */}
              <div className="space-y-1">
                <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/5 relative">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>MEV: {item.mev}</span>
                  <span className="text-zinc-400">MAV: {item.mav}</span>
                  <span>MRV: {item.mrv}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}