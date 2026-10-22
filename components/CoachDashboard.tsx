// components/CoachDashboard.tsx
'use client';

import React, { useState, useMemo } from 'react';
import {
  Users, Search, Shield, ArrowRight, Gauge, Activity,
  TrendingUp, TrendingDown, Minus, Calendar
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
  onOpenTimeline?: (athleteId: string) => void;
  workoutHistory: any[];
  readinessHistory: any[];
}

export default function CoachDashboard({
  athletes,
  activeAthleteId,
  onSelectAthlete,
  onNavigateToBuilder,
  onOpenTimeline,
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

  return (
    <div className="space-y-6">
      {/* Header & Ricerca */}
      <div className="bg-[#12151B]/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#E50914]" /> Dashboard Atleti Coach
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Seleziona un atleta per monitorare lo stato di forma e programmare la scheda con il Metodo TOPGYM.
          </p>
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

      {/* Griglia Atleti */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAthletes.map(ath => {
          const isSelected = ath.id === activeAthleteId;
          const level = Math.min(99, Math.floor(Math.sqrt(ath.xp / 25)));

          const athleteLogs = (readinessHistory || [])
            .filter((r: any) => (r.athleteId === ath.id || r.user_id === ath.id) && (r.readinessScore !== undefined || r.readiness_score !== undefined))
            .map((r: any) => ({
              score: Number(r.readinessScore ?? r.readiness_score) || 0,
              date: r.date || ''
            }))
            .filter(r => r.score > 0);

          const sampleSize = Math.min(athleteLogs.length, 7);
          const recentLogs = athleteLogs.slice(0, sampleSize);
          const movingAvgScore = sampleSize > 0
            ? Math.round(recentLogs.reduce((acc, curr) => acc + curr.score, 0) / sampleSize)
            : null;

          let trend: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';
          if (recentLogs.length >= 2) {
            const diff = recentLogs[0].score - recentLogs[1].score;
            if (diff >= 4) trend = 'UP';
            else if (diff <= -4) trend = 'DOWN';
          }

          let decision = null;
          if (movingAvgScore !== null) {
            if (movingAvgScore >= 75) {
              decision = {
                label: '🟢 Spinta / Sovraccarico',
                action: 'Progressione carichi e volume',
                badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                textColor: 'text-emerald-400',
                dotColor: 'bg-emerald-400'
              };
            } else if (movingAvgScore >= 55) {
              decision = {
                label: '🟡 Mantenimento',
                action: 'Carichi e volume invariati',
                badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
                textColor: 'text-amber-300',
                dotColor: 'bg-amber-400'
              };
            } else {
              decision = {
                label: '🔴 Deload / Scarico',
                action: 'Fatica elevata: consiglia scarico attivo',
                badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/40',
                textColor: 'text-rose-400',
                dotColor: 'bg-rose-500'
              };
            }
          }

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

              {movingAvgScore !== null && decision ? (
                <div className={`mb-3 p-3 rounded-xl border space-y-2 ${decision.badgeClass}`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Gauge className={`w-3.5 h-3.5 ${decision.textColor}`} /> Media Stato di Forma:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {trend === 'UP' && <span title="Trend in miglioramento"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /></span>}
                      {trend === 'DOWN' && <span title="Trend in calo"><TrendingDown className="w-3.5 h-3.5 text-rose-400" /></span>}
                      {trend === 'STABLE' && <span title="Trend stabile"><Minus className="w-3.5 h-3.5 text-zinc-400" /></span>}
                      <b className="font-mono text-xs">{(movingAvgScore / 10).toFixed(1)}/10</b>
                      <span className="text-[10px] opacity-75 font-mono">({movingAvgScore}%)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/10">
                    <span className="font-black flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full animate-pulse ${decision.dotColor}`} />
                      {decision.label}
                    </span>
                    <span className="text-[10px] opacity-75 font-mono">
                      {sampleSize} check-in (7-14gg)
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-3 bg-black/20 p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-zinc-600" /> Media Stato di Forma:
                  </span>
                  <span className="font-mono text-zinc-500 text-[11px]">Nessun Check-in</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#E50914]" /> {isSelected ? 'Atleta Selezionato' : 'Tocca per selezionare'}
                </span>
                
                <div className="flex items-center gap-2">
                  {onOpenTimeline && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAthlete(ath.id);
                        onOpenTimeline(ath.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 font-bold flex items-center gap-1.5 text-[11px] cursor-pointer transition active:scale-95"
                      title="Apri Matrice & Timeline del Macrociclo"
                    >
                      <Calendar className="w-3 h-3 text-[#E50914]" />
                      <span>Timeline</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAthlete(ath.id);
                      onNavigateToBuilder();
                    }}
                    className="text-[#E50914] font-bold flex items-center gap-1 hover:underline text-[11px] cursor-pointer"
                  >
                    Gestisci Scheda <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
