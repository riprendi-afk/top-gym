// components/CoachDashboard.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Shield, ArrowRight, Gauge, 
  Dumbbell, AlertTriangle, CheckCircle, Activity, 
  Flame, BatteryCharging, Zap, Layers, RefreshCw
} from 'lucide-react';

interface Athlete {
  id: string;
  displayName: string;
  email: string;
  xp: number;
}

interface CoachDashboardProps {
  athletes: Athlete[];
  activeAthleteId: string;
  onSelectAthlete: (athleteId: string) => void;
  onNavigateToBuilder: () => void;
  workoutHistory: any[];
  readinessHistory: any[];
}

export default function CoachDashboard({
  athletes,
  activeAthleteId,
  onSelectAthlete,
  onNavigateToBuilder,
  workoutHistory,
  readinessHistory
}: CoachDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSort, setFilterSort] = useState<'xp' | 'name'>('xp');

  const filteredAthletes = useMemo(() => {
    return athletes
      .filter(a => 
        a.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (filterSort === 'xp') return b.xp - a.xp;
        return a.displayName.localeCompare(b.displayName);
      });
  }, [athletes, searchTerm, filterSort]);

  const activeAthlete = athletes.find(a => a.id === activeAthleteId) || athletes[0];

  // 1. Ultimo Check Readiness dell'atleta attivo
  const latestReadiness = useMemo(() => {
    if (!readinessHistory || readinessHistory.length === 0) return null;
    return readinessHistory[0];
  }, [readinessHistory]);

  // 2. Valutazione scientifica del Readiness Score (SNC / Recupero)
  const readinessGuidance = useMemo(() => {
    if (!latestReadiness) return null;
    const score = latestReadiness.readinessScore ?? 0;
    if (score >= 80) {
      return {
        badge: 'Pronto per la Massima Intensità (SNC Ottimale)',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        advice: 'Ottima freschezza neurale: applica progressioni di carico sui fondamentali con RIR 1-2.'
      };
    }
    if (score >= 60) {
      return {
        badge: 'Recupero Standard / Carico Regolare',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        advice: 'Allenamento regolare. Mantieni i target ma preserva almeno 1 rep di margine (evita cedimenti precoci).'
      };
    }
    return {
      badge: 'Fatica Sistemica / Rischio Overreaching',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      advice: 'SNC affaticato: suggerito taglio di 1-2 serie sui multiarticolari o estensione dei recuperi di 30-45s.'
    };
  }, [latestReadiness]);

  // 3. Calcolo serie dell'ultima settimana e classificazione volume (MEV, MAV, MRV - Mike Israetel / Brunaccioni)
  const volumeStats = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentWorkouts = workoutHistory.filter(w => {
      const wDate = new Date(w.created_at || w.date || 0).getTime();
      return wDate >= oneWeekAgo;
    });

    let totalSets = 0;
    let totalVolumeKg = 0;

    recentWorkouts.forEach(w => {
      totalVolumeKg += Number(w.total_volume || w.totalVolume || 0);
      if (Array.isArray(w.logs)) {
        totalSets += w.logs.length;
      }
    });

    let status = 'Sotto Volume Efficace (MV/MEV)';
    let statusColor = 'text-zinc-400 border-zinc-700 bg-zinc-800/40';
    if (totalSets >= 15 && totalSets <= 25) {
      status = 'Volume Ottimale Ipertrofia (MAV)';
      statusColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    } else if (totalSets > 25) {
      status = 'Attenzione: Volume Elevato (Rischio MRV / Fatica)';
      statusColor = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    } else if (totalSets >= 10) {
      status = 'Minimo Efficace Raggiunto (MEV)';
      statusColor = 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    }

    return { totalSets, totalVolumeKg, status, statusColor, recentCount: recentWorkouts.length };
  }, [workoutHistory]);

  return (
    <div className="space-y-6">
      {/* Header & Ricerca */}
      <div className="bg-[#12151B]/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#E50914]" /> Dashboard Atleti Coach
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Supervisione parametri, carichi, recupero e periodizzazione scientifica.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Cerca atleta..."
              className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-[#E50914] transition"
            />
          </div>
          <select
            value={filterSort}
            onChange={e => setFilterSort(e.target.value as any)}
            className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none cursor-pointer"
          >
            <option value="xp">Ordina per XP</option>
            <option value="name">Ordina per Nome</option>
          </select>
        </div>
      </div>

      {/* PANORAMICA SCIENTIFICA DELL'ATLETA SELEZIONATO */}
      {activeAthlete && (
        <div className="bg-[#12151B]/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Atleta Selezionato</span>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                {activeAthlete.displayName}
                <span className="text-xs text-amber-400 font-mono font-normal">({activeAthlete.xp} XP)</span>
              </h3>
            </div>
            <button
              onClick={() => {
                onSelectAthlete(activeAthlete.id);
                onNavigateToBuilder();
              }}
              className="bg-gradient-to-r from-[#E50914] to-red-600 hover:brightness-110 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md shadow-red-950/40 cursor-pointer"
            >
              <span>Programma Scheda Atleta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Widget 1: Readiness & Autoregolazione SNC */}
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-emerald-400" /> Stato di Forma (Readiness)
                </span>
                {latestReadiness && (
                  <span className="font-black text-white text-sm font-mono">{latestReadiness.readinessScore}%</span>
                )}
              </div>
              {latestReadiness && readinessGuidance ? (
                <div className="space-y-2 pt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase inline-block ${readinessGuidance.color}`}>
                    {readinessGuidance.badge}
                  </span>
                  <p className="text-[11px] text-zinc-300 leading-snug">{readinessGuidance.advice}</p>
                </div>
              ) : (
                <p className="text-[11px] text-zinc-500 italic pt-2">Nessun check readiness recente registrato dall&apos;atleta.</p>
              )}
            </div>

            {/* Widget 2: Volume Settimanale (MEV / MAV / MRV) */}
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#E50914]" /> Volume Ultimi 7 Giorni
                </span>
                <span className="font-black text-white text-sm font-mono">{volumeStats.totalSets} Set</span>
              </div>
              <div className="space-y-2 pt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase inline-block ${volumeStats.statusColor}`}>
                  {volumeStats.status}
                </span>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  Target ipertrofico consigliato: <b className="text-white">15-25 serie/sett</b>. In cut mantenere tra 18 e 22 serie.
                </p>
              </div>
            </div>

            {/* Widget 3: Tonnellaggio e Aderenza */}
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-blue-400" /> Tonnellaggio Settimanale
                </span>
                <span className="font-black text-emerald-400 text-sm font-mono">
                  {volumeStats.totalVolumeKg.toLocaleString('it-IT')} Kg
                </span>
              </div>
              <div className="space-y-1 pt-1 text-[11px] text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Allenamenti chiusi:</span>
                  <b className="text-white">{volumeStats.recentCount} sessioni</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Storico registrato:</span>
                  <b className="text-white">{workoutHistory.length} totali</b>
                </div>
              </div>
            </div>
          </div>

          {/* Guida Rapida Metodo Hatfield per la Programmazione */}
          <div className="bg-black/30 p-4 rounded-xl border border-white/5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2.5">
              <Flame className="w-4 h-4 text-[#E50914]" /> Linee Guida Programmazione (Metodo Hatfield)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-zinc-900/70 p-2.5 rounded-lg border border-white/5">
                <b className="text-white block font-bold">1. Esercizio Neurale (Forza)</b>
                <span className="text-[11px] text-zinc-400 block mt-0.5">2 - 6 reps @ 80-90% 1RM</span>
                <span className="text-[10px] text-zinc-500 font-mono">Recupero: 2'30" - 4' · RIR 2</span>
              </div>
              <div className="bg-zinc-900/70 p-2.5 rounded-lg border border-white/5">
                <b className="text-white block font-bold">2. Complementare (Tensione)</b>
                <span className="text-[11px] text-zinc-400 block mt-0.5">6 - 12 reps @ 70-80% 1RM</span>
                <span className="text-[10px] text-zinc-500 font-mono">Recupero: 1'30" - 2'30" · RIR 1</span>
              </div>
              <div className="bg-zinc-900/70 p-2.5 rounded-lg border border-white/5">
                <b className="text-white block font-bold">3. Isolamento (Metabolico)</b>
                <span className="text-[11px] text-zinc-400 block mt-0.5">12 - 20+ reps @ &lt;65% 1RM</span>
                <span className="text-[10px] text-zinc-500 font-mono">Recupero: 45" - 1'15" · Cedimento</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Griglia Atleti */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAthletes.map(ath => {
          const isSelected = ath.id === activeAthleteId;
          const level = Math.min(99, Math.floor(Math.sqrt(ath.xp / 25)));

          return (
            <div
              key={ath.id}
              onClick={() => onSelectAthlete(ath.id)}
              className={`p-5 rounded-2xl border transition cursor-pointer relative overflow-hidden ${
                isSelected 
                  ? 'bg-zinc-900/90 border-[#E50914] ring-1 ring-[#E50914]/50 shadow-lg shadow-black/40' 
                  : 'bg-[#12151B]/80 border-white/10 hover:border-zinc-700 hover:bg-zinc-900/50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 w-1 h-full bg-[#E50914]" />
              )}

              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-black text-base text-white">{ath.displayName}</h3>
                  <span className="text-[11px] text-zinc-400 font-mono">{ath.email}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-amber-400 font-mono block">{ath.xp} XP</span>
                  <span className="text-[10px] text-zinc-400">Lvl {level}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#E50914]" /> Atleta Attivo
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAthlete(ath.id);
                    onNavigateToBuilder();
                  }}
                  className="text-[#E50914] font-bold flex items-center gap-1 hover:underline text-[11px]"
                >
                  Gestisci Scheda <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}