// components/CoachDashboard.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Award, Scale, Calendar, Activity, 
  ArrowRight, Shield, Flame, CheckCircle, BarChart2 
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

  return (
    <div className="space-y-6">
      {/* Header & Ricerca */}
      <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#E50914]" /> Dashboard Atleti Coach
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Supervisione completa dei parametri, stato di forma e progressioni atleti.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Cerca atleta..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-[#E50914]"
            />
          </div>
          <select
            value={filterSort}
            onChange={e => setFilterSort(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white font-bold"
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

          return (
            <div
              key={ath.id}
              onClick={() => onSelectAthlete(ath.id)}
              className={`p-5 rounded-xl border transition cursor-pointer relative overflow-hidden ${
                isSelected ? 'bg-red-950/20 border-[#E50914] shadow-lg shadow-red-950/30' : 'bg-[#1E1E1E] border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-black text-base text-white">{ath.displayName}</h3>
                  <span className="text-[11px] text-zinc-400 font-mono">{ath.email}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-yellow-500 font-mono block">{ath.xp} XP</span>
                  <span className="text-[10px] text-zinc-400">Lvl {level}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs">
                <span className="text-zinc-400 flex items-center gap-1">
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