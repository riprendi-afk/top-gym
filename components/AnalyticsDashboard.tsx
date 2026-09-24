// components/AnalyticsDashboard.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, Calendar, Layers, Activity, CheckCircle2, 
  ShieldAlert, ChevronUp, ChevronDown, Trash2, Sparkles, Zap, 
  ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import { AthleteGender } from '@/lib/topgym-templates';
import { 
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
  onDeleteWorkout?: (workoutId?: string) => void;
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

  // 1. Calcolo del Radar Settimanale
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

  // 2. Mappa dei Massimali (1RM) per calcolo Intensità
  const best1RMByExercise = useMemo(() => {
    const map = new Map<string, number>();
    const register1RM = (name: string, weight: number, reps: number) => {
      if (!name || weight <= 0 || reps <= 0) return;
      const est1RM = reps === 1 ? weight : Math.round(weight * (1 + reps / 30));
      const cur = map.get(name) || 0;
      if (est1RM > cur) map.set(name, est1RM);
    };

    logs.forEach(l => {
      const w = Number(l.effectiveLoad ?? l.weight) || 0;
      const r = Number(l.reps) || 0;
      register1RM(l.exerciseName, w, r);
    });

    workoutHistory.forEach(w => {
      if (Array.isArray(w.logs)) {
        w.logs.forEach((l: any) => {
          const weight = Number(l.effectiveLoad ?? l.weight) || 0;
          const reps = Number(l.reps) || 0;
          register1RM(l.exerciseName, weight, reps);
        });
      }
    });

    return map;
  }, [logs, workoutHistory]);

  // 3. Serie Storiche e Metriche per Grafico
  const volumeIntensitySeries = useMemo(() => {
    const sessions = workoutHistory.slice(0, 10).reverse();
    return sessions.map((item, idx) => {
      const volume = item.total_volume || item.totalVolume || 0;
      const sessionLogs: any[] = Array.isArray(item.logs) ? item.logs : [];

      const intensities: number[] = [];
      const rpes: number[] = [];

      sessionLogs.forEach(l => {
        const w = Number(l.effectiveLoad ?? l.weight) || 0;
        const best = best1RMByExercise.get(l.exerciseName);
        if (best && best > 0 && w > 0) {
          intensities.push((w / best) * 100);
        }
        if (l.rpe && Number(l.rpe) > 0) {
          rpes.push(Number(l.rpe));
        }
      });

      const avgIntensity = intensities.length
        ? Math.round(intensities.reduce((a, b) => a + b, 0) / intensities.length)
        : null;

      const avgRpe = rpes.length
        ? (rpes.reduce((a, b) => a + b, 0) / rpes.length).toFixed(1)
        : null;

      const dateStr = item.created_at
        ? new Date(item.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })
        : (item.date || `#${idx + 1}`);

      return {
        key: item.id || item._id || `s-${idx}`,
        dayName: item.day_name || item.dayName || 'Allenamento',
        dateStr,
        volume,
        avgIntensity,
        avgRpe,
        totalSets: sessionLogs.length
      };
    });
  }, [workoutHistory, best1RMByExercise]);

  const maxVolume = useMemo(
    () => volumeIntensitySeries.reduce((max, s) => Math.max(max, s.volume), 0) || 1000,
    [volumeIntensitySeries]
  );

  // 4. Medie Globali e KPI
  const kpiStats = useMemo(() => {
    if (volumeIntensitySeries.length === 0) {
      return { avgVol: 0, avgInt: 0, avgRpe: '0.0', trend: 'NEUTRAL' as const };
    }
    const totVol = volumeIntensitySeries.reduce((a, b) => a + b.volume, 0);
    const validInt = volumeIntensitySeries.filter(s => s.avgIntensity !== null);
    const totInt = validInt.reduce((a, b) => a + (b.avgIntensity || 0), 0);
    const validRpe = volumeIntensitySeries.filter(s => s.avgRpe !== null);
    const totRpe = validRpe.reduce((a, b) => a + parseFloat(b.avgRpe || '0'), 0);

    const avgVol = Math.round(totVol / volumeIntensitySeries.length);
    const avgInt = validInt.length ? Math.round(totInt / validInt.length) : 0;
    const avgRpe = validRpe.length ? (totRpe / validRpe.length).toFixed(1) : '0.0';

    let trend: 'UP' | 'DOWN' | 'NEUTRAL' = 'NEUTRAL';
    if (volumeIntensitySeries.length >= 2) {
      const last = volumeIntensitySeries[volumeIntensitySeries.length - 1].volume;
      const prev = volumeIntensitySeries[volumeIntensitySeries.length - 2].volume;
      if (last > prev * 1.05) trend = 'UP';
      else if (last < prev * 0.95) trend = 'DOWN';
    }

    return { avgVol, avgInt, avgRpe, trend };
  }, [volumeIntensitySeries]);

  // 5. Algoritmo di Coaching Insight
  const coachingInsight = useMemo(() => {
    if (volumeIntensitySeries.length < 2) {
      return {
        badge: 'Inizio Monitoraggio',
        badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        title: 'Dati in fase di raccolta',
        description: 'Registra almeno due allenamenti per calcolare il trend volume-intensità.',
        action: 'Mantieni i carichi target a buffer (RIR 2-3) e cura la pulizia esecutiva.'
      };
    }

    const recent = volumeIntensitySeries.slice(-3);
    const latest = recent[recent.length - 1];
    const prev = recent[0];

    const volDiff = ((latest.volume - prev.volume) / (prev.volume || 1)) * 100;
    const intDiff = (latest.avgIntensity || 0) - (prev.avgIntensity || 0);
    const latestRpe = parseFloat(latest.avgRpe || '8');

    if (volDiff >= 5 && intDiff >= -2 && latestRpe <= 8.5) {
      return {
        badge: 'Sovraccarico Ottimale',
        badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        title: 'Progressione ad Alta Efficienza Meccanica',
        description: `Tonnellaggio aumentato del +${Math.round(volDiff)}% preservando un'intensità elevata (${latest.avgIntensity}% 1RM).`,
        action: 'Risposta eccellente. Continua con lo schema attuale o valuta un micro-incremento (+1.5/2.5 kg) sui multiarticolari.'
      };
    }

    if (volDiff > 10 && (intDiff < -5 || latestRpe >= 9.2)) {
      return {
        badge: 'Rischio Volume Spazzatura',
        badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        title: 'Accumulo di Fatica e Perdita di Carico Specifico',
        description: `Volume elevato ma intensità in calo (${latest.avgIntensity}% 1RM) e fatica percepita alta (RPE ${latest.avgRpe}).`,
        action: 'Riduci 1 o 2 serie sui complementari di isolamento ed estendi il recupero a 2-3 minuti sui fondamentali.'
      };
    }

    if (volDiff <= -5 && intDiff >= 3) {
      return {
        badge: 'Fase di Intensificazione',
        badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        title: 'Espressione di Forza Pura',
        description: `Volume totale ridotto a fronte di un'intensità media più alta (${latest.avgIntensity}% 1RM).`,
        action: 'Fase ottimale per consolidare i carichi submassimali. Esplosività massima.'
      };
    }

    return {
      badge: 'Andamento Costante',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      title: 'Lavoro Ipertrofico Regolare',
      description: `Lavoro stabile a circa ${latest.avgIntensity || 70}% 1RM con ${latest.totalSets} serie per seduta.`,
      action: 'Continua secondo la periodizzazione stabilita dal blocco.'
    };
  }, [volumeIntensitySeries]);

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

  return (
    <div className="space-y-6">
      {/* 1. HEADER ANALISI PROGRESSI */}
      <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <BarChart3 className="text-[#E50914] w-6 h-6" /> 
            Analisi & Volume {userRole === 'COACH' ? `(${athleteName})` : ''}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Monitoraggio scientifico del volume settimanale e correlazione carico / intensità.
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

      {/* 3. SUGGERIMENTI RISERVATI ESCLUSIVAMENTE AL COACH */}
      {userRole === 'COACH' && (
        <div className="bg-gradient-to-r from-[#12151B] via-zinc-900/70 to-[#12151B] border border-white/10 p-5 rounded-2xl shadow-xl backdrop-blur-md space-y-3">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-xs uppercase font-black tracking-wider text-white">
                Insight Intelligente sull&apos;Andamento (Vista Coach)
              </span>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${coachingInsight.badgeColor}`}>
              {coachingInsight.badge}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">{coachingInsight.title}</h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{coachingInsight.description}</p>
          </div>

          <div className="bg-black/40 border border-white/5 p-3 rounded-xl flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-200">
              <b className="text-yellow-400">Suggerimento Tecnico:</b> {coachingInsight.action}
            </p>
          </div>
        </div>
      )}

      {/* 4. GRAFICO MODERNO VOLUME & INTENSITÀ (% 1RM) */}
      <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md space-y-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#E50914]" /> Andamento Volume & Intensità Storica
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Correlazione dinamica tra Tonnellaggio totale (Kg) e % media dell&apos;1RM per sessione.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-3 h-1 rounded-full bg-cyan-400 inline-block" /> Volume (Kg)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-0.5 border-b-2 border-dashed border-amber-400 inline-block" /> Intensità (% 1RM)
            </span>
          </div>
        </div>

        {/* KPI Mini Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-zinc-900/60 border border-white/5 p-3 rounded-xl">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Volume Medio</span>
            <div className="text-base font-black text-cyan-400 mt-0.5">
              {kpiStats.avgVol.toLocaleString('it-IT')} <span className="text-xs font-normal text-zinc-400">kg</span>
            </div>
          </div>
          <div className="bg-zinc-900/60 border border-white/5 p-3 rounded-xl">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">Intensità Media</span>
            <div className="text-base font-black text-amber-400 mt-0.5">
              {kpiStats.avgInt > 0 ? `${kpiStats.avgInt}%` : 'N/D'} <span className="text-xs font-normal text-zinc-400">1RM</span>
            </div>
          </div>
          <div className="bg-zinc-900/60 border border-white/5 p-3 rounded-xl">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">RPE Medio</span>
            <div className="text-base font-black text-white mt-0.5">
              {kpiStats.avgRpe !== '0.0' ? `@ ${kpiStats.avgRpe}` : 'N/D'}
            </div>
          </div>
          <div className="bg-zinc-900/60 border border-white/5 p-3 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Trend Carico</span>
              <span className="text-xs font-bold text-white mt-0.5 block">
                {kpiStats.trend === 'UP' ? 'In Aumento' : kpiStats.trend === 'DOWN' ? 'In Calo' : 'Costante'}
              </span>
            </div>
            {kpiStats.trend === 'UP' && <ArrowUpRight className="w-5 h-5 text-emerald-400" />}
            {kpiStats.trend === 'DOWN' && <ArrowDownRight className="w-5 h-5 text-rose-400" />}
            {kpiStats.trend === 'NEUTRAL' && <Minus className="w-5 h-5 text-zinc-500" />}
          </div>
        </div>

        {/* GRAFICO SVG MODERNO A DOPPIA CURVA */}
        {volumeIntensitySeries.length === 0 ? (
          <div className="bg-black/30 p-8 rounded-xl border border-white/5 text-center text-xs text-zinc-400 italic">
            Nessun allenamento ancora registrato nello storico dell&apos;atleta.
          </div>
        ) : (
          <div className="bg-black/40 p-4 rounded-xl border border-white/5 overflow-hidden">
            {(() => {
              const chartW = 650;
              const chartH = 170;
              const padX = 35;
              const padTop = 15;
              const padBottom = 25;
              const drawH = chartH - padTop - padBottom;
              const n = volumeIntensitySeries.length;
              const stepX = n > 1 ? (chartW - padX * 2) / (n - 1) : 0;

              const xAt = (i: number) => (n === 1 ? chartW / 2 : padX + stepX * i);
              const yVolAt = (v: number) => padTop + drawH - (Math.min(1, v / (maxVolume * 1.15)) * drawH);
              const yIntAt = (pct: number) => padTop + drawH - (Math.min(1, Math.max(0, pct) / 100) * drawH);

              const volPoints = volumeIntensitySeries.map((s, i) => `${xAt(i)},${yVolAt(s.volume)}`);
              const volPolyline = volPoints.join(' ');
              const volArea = `M ${xAt(0)},${padTop + drawH} ` + volPoints.map(p => `L ${p}`).join(' ') + ` L ${xAt(n - 1)},${padTop + drawH} Z`;

              const intDataPoints = volumeIntensitySeries
                .map((s, i) => (s.avgIntensity !== null ? { x: xAt(i), y: yIntAt(s.avgIntensity), pct: s.avgIntensity, key: s.key } : null))
                .filter((p): p is { x: number; y: number; pct: number; key: string } => p !== null);
              const intPolyline = intDataPoints.map(p => `${p.x},${p.y}`).join(' ');

              return (
                <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-56" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {[0, 0.33, 0.66, 1].map(f => {
                    const y = padTop + f * drawH;
                    return (
                      <g key={f}>
                        <line x1={padX} x2={chartW - padX} y1={y} y2={y} stroke="#27272a" strokeWidth="1" strokeDasharray="3 3" />
                      </g>
                    );
                  })}

                  {n > 1 && <path d={volArea} fill="url(#volGrad)" />}
                  {n > 1 && <polyline points={volPolyline} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

                  {volumeIntensitySeries.map((s, i) => (
                    <circle
                      key={`vol-dot-${s.key}`}
                      cx={xAt(i)}
                      cy={yVolAt(s.volume)}
                      r="3.5"
                      fill="#06b6d4"
                    >
                      <title>{`${s.dayName} · ${s.volume} kg`}</title>
                    </circle>
                  ))}

                  {intDataPoints.length >= 2 && (
                    <polyline points={intPolyline} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" />
                  )}

                  {intDataPoints.map(p => (
                    <g key={`int-dot-${p.key}`}>
                      <circle cx={p.x} cy={p.y} r="3.5" fill="#f59e0b" stroke="#12151B" strokeWidth="1.5" />
                      <text x={p.x} y={p.y - 8} fontSize="9" fill="#f59e0b" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
                        {p.pct}%
                      </text>
                    </g>
                  ))}

                  {volumeIntensitySeries.map((s, i) => (
                    <text
                      key={`x-lbl-${s.key}`}
                      x={xAt(i)}
                      y={chartH - 4}
                      fontSize="9"
                      fill="#a1a1aa"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {s.dateStr}
                    </text>
                  ))}
                </svg>
              );
            })()}
          </div>
        )}
      </div>

      {/* 5. TABELLA STORICO ALLENAMENTI */}
      <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#E50914]" /> Dettaglio Sedute Registrate nello Storico
        </h3>

        {workoutHistory.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">Nessun allenamento registrato.</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}