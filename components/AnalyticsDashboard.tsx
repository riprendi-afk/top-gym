// components/AnalyticsDashboard.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Calendar, Layers, Activity, CheckCircle2, ShieldAlert, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { AthleteGender } from '@/lib/topgym-templates';
import { 
  MuscleTarget, 
  getWeekDateRange, 
  calculateLoggedWeeklySets, 
  calculatePlannedWeeklySets, 
  buildMuscleVolumeStatuses,
  parseLocalDate 
} from '@/lib/topgym-volume';

interface AnalyticsDashboardProps {
  logs: any[];
  workoutHistory: any[];
  programDays: any[];
  athleteName?: string;
  athleteGender?: AthleteGender;
  userRole?: 'ATHLETE' | 'COACH';
  onDeleteWorkout?: (workoutId: string) => void;
}

export default function AnalyticsDashboard({
  logs,
  workoutHistory,
  programDays,
  athleteName = 'Atleta',
  athleteGender = 'MALE',
  userRole = 'ATHLETE',
  onDeleteWorkout
}: AnalyticsDashboardProps) {
  const [viewMode, setViewMode] = useState<'LOGGED' | 'PLANNED'>('LOGGED');
  const [analyticsDate, setAnalyticsDate] = useState(() => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  const { startOfWeek, endOfWeek, startOfMonth, endOfMonth } = useMemo(
    () => getWeekDateRange(analyticsDate),
    [analyticsDate]
  );

  // Calcolo automatico delle serie reali e previste
  const loggedMap = useMemo(
    () => calculateLoggedWeeklySets(logs, workoutHistory, programDays, analyticsDate),
    [logs, workoutHistory, programDays, analyticsDate]
  );

  const plannedMap = useMemo(
    () => calculatePlannedWeeklySets(programDays),
    [programDays]
  );

  const activeMap = viewMode === 'LOGGED' ? loggedMap : plannedMap;
  const volumeStatuses = useMemo(
    () => buildMuscleVolumeStatuses(activeMap, athleteGender),
    [activeMap, athleteGender]
  );

  const totalDirectSets = useMemo(
    () => volumeStatuses.reduce((acc, curr) => acc + curr.directSets, 0),
    [volumeStatuses]
  );

  // Statistiche generali
  const monthlySetsCount = useMemo(() => {
    let count = 0;
    logs.forEach(l => {
      const d = parseLocalDate(l.date);
      if (d && d >= startOfMonth && d <= endOfMonth) count++;
    });
    workoutHistory.forEach(w => {
      const d = parseLocalDate(w.created_at || w.date);
      if (d && d >= startOfMonth && d <= endOfMonth && Array.isArray(w.logs)) {
        count += w.logs.length;
      }
    });
    return count;
  }, [logs, workoutHistory, startOfMonth, endOfMonth]);

  const totalSetsEver = useMemo(
    () => workoutHistory.reduce((acc, w) => acc + (Array.isArray(w.logs) ? w.logs.length : 0), 0) + logs.length,
    [workoutHistory, logs]
  );

  // Serie per grafico storico
  const maxHistoryVolume = useMemo(
    () => workoutHistory.reduce((max, w) => Math.max(max, w.total_volume || w.totalVolume || 0), 0) || 1,
    [workoutHistory]
  );

  const volumeIntensitySeries = useMemo(() => {
    const sessions = workoutHistory.slice(0, 12).reverse();
    return sessions.map((item, idx) => {
      const volume = item.total_volume || item.totalVolume || 0;
      const dateStr = item.created_at
        ? new Date(item.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })
        : (item.date || `#${idx + 1}`);
      return { key: item.id || item._id || `s-${idx}`, dateStr, volume };
    });
  }, [workoutHistory]);

  return (
    <div className="space-y-6">
      {/* 1. HEADER ANALISI PROGRESSI */}
      <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="text-[#E50914]" /> 
            Analisi Progressi & Volume {userRole === 'COACH' ? `(${athleteName})` : ''}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Monitoraggio scientifico del volume settimanale (MEV · MAV · MRV) e andamento storico.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/5 text-center">
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">Serie Mensili</span>
            <span className="text-lg font-black text-blue-400">{monthlySetsCount}</span>
          </div>
          <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/5 text-center">
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">Serie Complete</span>
            <span className="text-lg font-black text-white">{totalSetsEver}</span>
          </div>
        </div>
      </div>

      {/* 2. RADAR DEL VOLUME SETTIMANALE */}
      <div className="bg-[#12151B] border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#E50914]" /> Radar del Volume Settimanale (MEV · MAV · MRV)
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Analisi per <b className="text-white">{athleteName}</b> · Profilo{' '}
              <span className="text-[#E50914] font-bold">
                {athleteGender === 'FEMALE' ? 'Donna (Priorità Glutei)' : 'Uomo'}
              </span>
              {viewMode === 'LOGGED' && (
                <span className="text-zinc-400 font-mono ml-2">
                  ({startOfWeek.toLocaleDateString('it-IT')} - {endOfWeek.toLocaleDateString('it-IT')})
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-black/50 p-1 rounded-xl border border-white/10 flex">
              <button
                type="button"
                onClick={() => setViewMode('LOGGED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'LOGGED' ? 'bg-[#E50914] text-white shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" /> Svolto sul Campo
              </button>
              <button
                type="button"
                onClick={() => setViewMode('PLANNED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'PLANNED' ? 'bg-[#E50914] text-white shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Scheda Completa (Preventivo)
              </button>
            </div>

            {viewMode === 'LOGGED' && (
              <input 
                type="date" 
                value={analyticsDate} 
                onChange={e => setAnalyticsDate(e.target.value)} 
                className="bg-zinc-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold outline-none focus:border-[#E50914] cursor-pointer"
                title="Seleziona la data di riferimento"
              />
            )}
          </div>
        </div>

        <div className="flex justify-between items-center bg-black/30 p-3 rounded-xl border border-white/5 text-xs">
          <span className="text-zinc-400">
            Modalità:{' '}
            <b className="text-white">
              {viewMode === 'LOGGED' ? 'Serie realmente completate' : 'Serie totali previste dalla split'}
            </b>
          </span>
          <span className="text-white font-mono font-bold bg-zinc-900 px-3 py-1 rounded-lg border border-white/5">
            {totalDirectSets} Serie Totali
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {volumeStatuses.map((item) => {
            let barBg = 'bg-emerald-500';
            if (item.status === 'SUB_MEV') barBg = 'bg-zinc-600';
            if (item.status === 'OVERREACHING') barBg = 'bg-amber-500';
            if (item.status === 'EXCESSIVE') barBg = 'bg-rose-500';

            return (
              <div key={item.muscle} className="bg-zinc-900/50 border border-white/5 p-3.5 rounded-xl space-y-2 hover:border-white/10 transition">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    {item.muscle}
                    {item.status === 'OPTIMAL' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {item.status === 'EXCESSIVE' && <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${item.colorClass}`}>
                    {item.directSets} set ({item.statusLabel})
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/5 relative">
                    <div className={`h-full rounded-full transition-all duration-500 ${barBg}`} style={{ width: `${item.percentage}%` }} />
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

      {/* 3. GRAFICO INTENSITÀ & STORICO ALLENAMENTI */}
      <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#E50914]" /> Storico Allenamenti & Volume
        </h3>

        {workoutHistory.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">Nessun allenamento registrato.</p>
        ) : (
          <div className="space-y-4">
            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
              {(() => {
                const chartW = 600;
                const chartH = 140;
                const padX = 24;
                const n = volumeIntensitySeries.length;
                const stepX = n > 1 ? (chartW - padX * 2) / (n - 1) : 0;
                const xAt = (i: number) => padX + stepX * i;
                const yVolAt = (v: number) => chartH - (Math.min(1, v / maxHistoryVolume) * (chartH - 20)) - 10;
                const volPoints = volumeIntensitySeries.map((s, i) => `${xAt(i)},${yVolAt(s.volume)}`).join(' ');

                return (
                  <svg viewBox={`0 0 ${chartW} ${chartH + 24}`} className="w-full h-44" preserveAspectRatio="none">
                    {[0, 0.5, 1].map(f => (
                      <line key={f} x1={padX} x2={chartW - padX} y1={10 + f * (chartH - 20)} y2={10 + f * (chartH - 20)} stroke="#27272a" strokeWidth="1" />
                    ))}
                    <polyline points={volPoints} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                    {volumeIntensitySeries.map((s, i) => (
                      <circle key={s.key} cx={xAt(i)} cy={yVolAt(s.volume)} r="3.5" fill="#3b82f6" />
                    ))}
                    {volumeIntensitySeries.map((s, i) => (
                      <text key={`lbl-${s.key}`} x={xAt(i)} y={chartH + 16} fontSize="9" fill="#a1a1aa" textAnchor="middle" fontFamily="monospace">
                        {s.dateStr}
                      </text>
                    ))}
                  </svg>
                );
              })()}
              <div className="text-center text-[11px] text-blue-400 mt-2 font-medium flex items-center justify-center gap-1.5">
                <span className="w-3 h-0.5 rounded-full bg-blue-500 inline-block" /> Volume totale per seduta (Kg)
              </div>
            </div>

            <div className="overflow-x-auto pt-2 space-y-2">
              <table className="w-full text-xs text-left text-zinc-300">
                <thead className="bg-black/40 text-zinc-400 uppercase text-[10px] border-b border-white/5">
                  <tr>
                    <th className="py-2.5 px-3">Data</th>
                    <th className="py-2.5 px-3">Scheda</th>
                    <th className="py-2.5 px-3 text-right">Volume</th>
                    <th className="py-2.5 px-3 text-center">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {workoutHistory.map((item, idx) => {
                    const rowKey = item.id || item._id || `row-${idx}`;
                    const isExpanded = expandedHistoryId === rowKey;
                    return (
                      <React.Fragment key={rowKey}>
                        <tr className="hover:bg-zinc-800/30 transition">
                          <td className="py-2.5 px-3 font-mono text-zinc-400">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString('it-IT') : (item.date || 'Oggi')}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-white">{item.day_name || item.dayName || 'Allenamento'}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                            {(item.total_volume || item.totalVolume || 0).toLocaleString('it-IT')} kg
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex justify-center gap-2">
                              <button type="button" onClick={() => setExpandedHistoryId(isExpanded ? null : rowKey)} className="bg-zinc-800 hover:bg-zinc-700 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 transition">
                                {isExpanded ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>} Dettagli
                              </button>
                              {userRole === 'COACH' && onDeleteWorkout && (
                                <button type="button" onClick={() => onDeleteWorkout(item.id || item._id)} className="text-zinc-500 hover:text-rose-400 p-1">
                                  <Trash2 className="w-4 h-4"/>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-black/30">
                            <td colSpan={4} className="p-3">
                              {item.logs && Array.isArray(item.logs) && item.logs.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                  {item.logs.map((log: any, lIdx: number) => (
                                    <div key={lIdx} className="bg-zinc-900 border border-white/5 p-2.5 rounded-xl text-[11px]">
                                      <div className="font-bold text-white mb-1">{log.exerciseName}</div>
                                      <div className="text-zinc-400 flex justify-between">
                                        <span>{log.weight} kg × {log.reps}</span>
                                        <span className="text-red-400 font-semibold">RPE: {log.rpe}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-[11px] text-zinc-500 italic text-center">Nessun dettaglio disponibile.</div>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}