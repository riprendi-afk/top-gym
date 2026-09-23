'use client';

import React, { useState } from 'react';
import { Activity, ShieldAlert, CheckCircle2, Calendar, Layers } from 'lucide-react';
import { EngineWorkoutDay } from '@/lib/topgym-engine';
import { AthleteGender } from '@/lib/topgym-templates';
import { 
  calculateWeeklyVolumeRadar, 
  calculateFromMuscleMap, 
  MuscleVolumeStatus 
} from '@/lib/topgym-volume';

interface WeeklyVolumeRadarProps {
  days: EngineWorkoutDay[];
  athleteName?: string;
  athleteGender?: AthleteGender;
  weeklyMuscleSetsMap?: Record<string, number>;
  weekRangeText?: string;
  analyticsDate?: string;
  onDateChange?: (date: string) => void;
}

export default function WeeklyVolumeRadar({
  days,
  athleteName = 'Atleta',
  athleteGender = 'MALE',
  weeklyMuscleSetsMap = {},
  weekRangeText = 'Settimana Selezionata',
  analyticsDate,
  onDateChange
}: WeeklyVolumeRadarProps) {
  // Modalità di default: 'LOGGED' (serie realmente svolte dall'atleta)
  const [viewMode, setViewMode] = useState<'LOGGED' | 'PLANNED'>('LOGGED');
  const [includeIndirect, setIncludeIndirect] = useState<boolean>(false);

  const volumeData: MuscleVolumeStatus[] = viewMode === 'LOGGED'
    ? calculateFromMuscleMap(weeklyMuscleSetsMap, athleteGender)
    : calculateWeeklyVolumeRadar(days, athleteGender, includeIndirect);

  const totalDirectSets = volumeData.reduce((acc, curr) => acc + curr.directSets, 0);

  return (
    <div className="bg-[#12151B] border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-6">
      
      {/* HEADER RADAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#E50914]" />
            Radar del Volume Settimanale (MEV · MAV · MRV)
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Analisi per <b className="text-white">{athleteName}</b> · Profilo{' '}
            <span className="text-[#E50914] font-bold">
              {athleteGender === 'FEMALE' ? 'Donna (Priorità Glutei)' : 'Uomo'}
            </span>
            {viewMode === 'LOGGED' && (
              <span className="text-zinc-400 font-mono ml-2">({weekRangeText})</span>
            )}
          </p>
        </div>

        {/* CONTROLLI E SELETTORI */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* SELETTORE VISTA */}
          <div className="bg-black/50 p-1 rounded-xl border border-white/10 flex">
            <button
              type="button"
              onClick={() => setViewMode('LOGGED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'LOGGED'
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Svolto sul Campo
            </button>
            <button
              type="button"
              onClick={() => setViewMode('PLANNED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'PLANNED'
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Scheda Completa (Preventivo)
            </button>
          </div>

          {/* CALENDARIO FILTRO SETTIMANA (SE IN MODALITÀ SVOlTO SUL CAMPO) */}
          {viewMode === 'LOGGED' && analyticsDate && onDateChange && (
            <input 
              type="date" 
              value={analyticsDate} 
              onChange={e => onDateChange(e.target.value)} 
              className="bg-zinc-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold outline-none focus:border-[#E50914] cursor-pointer"
              title="Filtra settimana di riferimento"
            />
          )}

          {/* PULSANTE VOLUME INDIRETTO (SE IN MODALITÀ PREVENTIVO) */}
          {viewMode === 'PLANNED' && (
            <button
              type="button"
              onClick={() => setIncludeIndirect(!includeIndirect)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition cursor-pointer ${
                includeIndirect 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                  : 'bg-black/40 border-white/5 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {includeIndirect ? '✓ Volume Indiretto' : '+ Indiretto'}
            </button>
          )}
        </div>
      </div>

      {/* STATISTICHE COMPATTE */}
      <div className="flex justify-between items-center bg-black/30 p-3 rounded-xl border border-white/5 text-xs">
        <span className="text-zinc-400">
          Modalità attiva:{' '}
          <b className="text-white">
            {viewMode === 'LOGGED' 
              ? 'Serie effettivamente eseguite e registrate nella settimana selezionata' 
              : 'Totale delle serie previste dalla split settimanale (tutte le sedute)'}
          </b>
        </span>
        <span className="text-white font-mono font-bold bg-zinc-900 px-3 py-1 rounded-lg border border-white/5">
          {totalDirectSets} Serie Totali
        </span>
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