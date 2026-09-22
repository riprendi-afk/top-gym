// components/CoachDashboard.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Shield, ArrowRight, Gauge, 
  Dumbbell, AlertTriangle, CheckCircle, Activity, 
  Flame, BatteryCharging, Zap, Layers, RefreshCw,
  Calendar, ChevronRight, Sliders
} from 'lucide-react';
import { autoDetectMuscleGroup, MuscleGroup } from '@/app/page';

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

export type MacroBlock = 'BLOCCO_1_FORZA' | 'BLOCCO_2_TRASFORMAZIONE' | 'BLOCCO_3_QUALITA';
export type MicroWeek = 1 | 2 | 3 | 4;

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

  // Gestione Macrociclo, Mesociclo e Microciclo
  const [selectedBlock, setSelectedBlock] = useState<MacroBlock>('BLOCCO_1_FORZA');
  const [selectedWeek, setSelectedWeek] = useState<MicroWeek>(1);
  const [focusedMuscle, setFocusedMuscle] = useState<MuscleGroup>('Petto');

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

  // 1. Ultimo Check Readiness
  const latestReadiness = useMemo(() => {
    if (!readinessHistory || readinessHistory.length === 0) return null;
    return readinessHistory[0];
  }, [readinessHistory]);

  // 2. Autoregolazione SNC
  const readinessGuidance = useMemo(() => {
    if (!latestReadiness) return null;
    const score = latestReadiness.readinessScore ?? 0;
    if (score >= 80) {
      return {
        badge: 'SNC Ottimale (Spinta Massima)',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        advice: 'Ottimo recupero: applica progressioni sui fondamentali (RIR 1-2).'
      };
    }
    if (score >= 60) {
      return {
        badge: 'Recupero Standard',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        advice: 'Allenamento regolare. Mantieni i target ma preserva almeno 1 rep di margine.'
      };
    }
    return {
      badge: 'Fatica Sistemica Elevata',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      advice: 'SNC affaticato: suggerito taglio di 1 serie sui multiarticolari o recupero esteso.'
    };
  }, [latestReadiness]);

  // 3. CALCOLO VOLUME CORRETTO: SERIE PER SINGOLO GRUPPO MUSCOLARE (Ultimi 7 Giorni)
  const muscleVolumeAnalysis = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentWorkouts = workoutHistory.filter(w => {
      const wDate = new Date(w.created_at || w.date || 0).getTime();
      return wDate >= oneWeekAgo;
    });

    const setsPerMuscle: Record<MuscleGroup, number> = {
      Petto: 0,
      Dorso: 0,
      Spalle: 0,
      Quadricipiti: 0,
      Femorali: 0,
      Glutei: 0,
      Bicipiti: 0,
      Tricipiti: 0,
      Polpacci: 0,
      Addome: 0
    };

    let totalSetsAll = 0;
    let totalVolumeKg = 0;

    recentWorkouts.forEach(w => {
      totalVolumeKg += Number(w.total_volume || w.totalVolume || 0);
      if (Array.isArray(w.logs)) {
        w.logs.forEach((log: any) => {
          totalSetsAll++;
          const mg = (log.muscleGroup || autoDetectMuscleGroup(log.exerciseName || '')) as MuscleGroup;
          if (mg && typeof setsPerMuscle[mg] === 'number') {
            setsPerMuscle[mg] += 1;
          }
        });
      }
    });

    // Valutazione specifica per il muscolo selezionato
    const currentMuscleSets = setsPerMuscle[focusedMuscle] || 0;
    const isCut = selectedBlock === 'BLOCCO_3_QUALITA';

    let status = 'Sotto Volume Efficace (<10 Set)';
    let statusColor = 'text-zinc-400 border-zinc-700 bg-zinc-800/40';

    if (isCut) {
      if (currentMuscleSets >= 18 && currentMuscleSets <= 22) {
        status = 'Volume Ideale Cut (18-22 Set)';
        statusColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      } else if (currentMuscleSets > 22) {
        status = 'Attenzione: Volume Troppo Alto in Cut (>22 Set)';
        statusColor = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      } else if (currentMuscleSets >= 12) {
        status = 'Volume Sufficiente di Mantenimento';
        statusColor = 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      }
    } else {
      if (currentMuscleSets >= 15 && currentMuscleSets <= 25) {
        status = 'Volume Ottimale Ipertrofia (MAV: 15-25 Set)';
        statusColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      } else if (currentMuscleSets > 25) {
        status = 'Rischio Sovrallenamento (MRV Superato: >25 Set)';
        statusColor = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      } else if (currentMuscleSets >= 10) {
        status = 'Minimo Efficace Raggiunto (MEV: 10-14 Set)';
        statusColor = 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      }
    }

    return {
      setsPerMuscle,
      currentMuscleSets,
      status,
      statusColor,
      totalSetsAll,
      totalVolumeKg,
      recentCount: recentWorkouts.length
    };
  }, [workoutHistory, focusedMuscle, selectedBlock]);

  return (
    <div className="space-y-6">
      {/* Header & Ricerca */}
      <div className="bg-[#12151B]/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#E50914]" /> Dashboard Atleti Coach
          </h2>
          <p className="text-xs text-zinc-400 mt-1">Gestione scientifica periodizzazione (Macrociclo, Mesociclo, Microciclo) e volumi muscolari.</p>
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

      {/* PANNELLO STRUTTURA PERIODIZZAZIONE: MACRO, MESO E MICROCICLI */}
      <div className="bg-[#12151B]/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#E50914]" />
            <h3 className="text-base font-black text-white uppercase tracking-wider">
              Pianificazione Periodizzazione (Metodo Invictus / Hatfield)
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Macrociclo Annuale (12 Mesi)</span>
        </div>

        {/* 1. SELETTORE FASE / MESOCICLO */}
        <div>
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
            1. Seleziona Blocco / Mesociclo Attivo:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedBlock('BLOCCO_1_FORZA')}
              className={`p-3 rounded-xl border text-left transition ${
                selectedBlock === 'BLOCCO_1_FORZA'
                  ? 'bg-zinc-900 border-[#E50914] ring-1 ring-[#E50914]'
                  : 'bg-black/20 border-white/5 text-zinc-400 hover:bg-zinc-900/40'
              }`}
            >
              <b className="text-white text-xs block font-black">Blocco 1: Forza Ipertrofica</b>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Focus: Tecnica, Neurale, Accumulo Volume sui Fondamentali</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedBlock('BLOCCO_2_TRASFORMAZIONE')}
              className={`p-3 rounded-xl border text-left transition ${
                selectedBlock === 'BLOCCO_2_TRASFORMAZIONE'
                  ? 'bg-zinc-900 border-[#E50914] ring-1 ring-[#E50914]'
                  : 'bg-black/20 border-white/5 text-zinc-400 hover:bg-zinc-900/40'
              }`}
            >
              <b className="text-white text-xs block font-black">Blocco 2: Trasformazione</b>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Focus: Reps 6-12, Complementari Principali, Stripping</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedBlock('BLOCCO_3_QUALITA')}
              className={`p-3 rounded-xl border text-left transition ${
                selectedBlock === 'BLOCCO_3_QUALITA'
                  ? 'bg-zinc-900 border-[#E50914] ring-1 ring-[#E50914]'
                  : 'bg-black/20 border-white/5 text-zinc-400 hover:bg-zinc-900/40'
              }`}
            >
              <b className="text-white text-xs block font-black">Blocco 3: Qualità Muscolare (Cut)</b>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Focus: Mantenimento Forza, Volume Ristretto (18-22 set), Pompaggio</span>
            </button>
          </div>
        </div>

        {/* 2. STRUTTURA DELLE 4 SETTIMANE (MICROCICLI) */}
        <div>
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
            2. Progressione Microcicli Mesociclo (4 Settimane):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { w: 1, title: 'Week 1 · Intro / Accumulo', sub: 'RIR 2 · Carico Target' },
              { w: 2, title: 'Week 2 · Sovraccarico', sub: 'RIR 1-2 · +Carico/Set' },
              { w: 3, title: 'Week 3 · Overreaching', sub: 'RIR 0 · Max Effort' },
              { w: 4, title: 'Week 4 · Deload / Scarico', sub: '-40% Volume · RIR 3-4' }
            ].map(item => (
              <button
                key={item.w}
                type="button"
                onClick={() => setSelectedWeek(item.w as MicroWeek)}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedWeek === item.w
                    ? 'bg-[#E50914] border-[#E50914] text-white shadow-md shadow-red-950/40'
                    : 'bg-black/30 border-white/5 text-zinc-400 hover:bg-zinc-900'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-black ${selectedWeek === item.w ? 'text-white' : 'text-zinc-200'}`}>
                    {item.title}
                  </span>
                  {item.w === 4 && <RefreshCw className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-[10px] block mt-1 ${selectedWeek === item.w ? 'text-white/80' : 'text-zinc-500'}`}>
                  {item.sub}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PANORAMICA SCIENTIFICA DELL'ATLETA SELEZIONATO */}
      {activeAthlete && (
        <div className="bg-[#12151B]/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Atleta Monitorato</span>
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
              <span>Configura Scheda nel Builder</span>
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
                <p className="text-[11px] text-zinc-500 italic pt-2">Nessun check readiness registrato dall&apos;atleta.</p>
              )}
            </div>

            {/* Widget 2: VOLUME SPECIFICO PER GRUPPO MUSCOLARE */}
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#E50914]" /> Volume Muscolare (7gg)
                </span>
                <select
                  value={focusedMuscle}
                  onChange={e => setFocusedMuscle(e.target.value as MuscleGroup)}
                  className="bg-black/60 border border-white/10 text-white font-bold text-xs rounded-lg px-2 py-0.5 outline-none cursor-pointer"
                >
                  {(['Petto', 'Dorso', 'Spalle', 'Quadricipiti', 'Femorali', 'Glutei', 'Bicipiti', 'Tricipiti', 'Polpacci', 'Addome'] as MuscleGroup[]).map(mg => (
                    <option key={mg} value={mg}>{mg}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-zinc-400">{focusedMuscle}:</span>
                  <b className="text-white text-base font-mono">{muscleVolumeAnalysis.currentMuscleSets} Serie</b>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase inline-block ${muscleVolumeAnalysis.statusColor}`}>
                  {muscleVolumeAnalysis.status}
                </span>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  Target: <b className="text-white">15-25 set/settimana</b> per muscolo. Totale corporeo registrato: {muscleVolumeAnalysis.totalSetsAll} set.
                </p>
              </div>
            </div>

            {/* Widget 3: Tonnellaggio e Sessioni */}
            <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-blue-400" /> Tonnellaggio Ultimi 7gg
                </span>
                <span className="font-black text-emerald-400 text-sm font-mono">
                  {muscleVolumeAnalysis.totalVolumeKg.toLocaleString('it-IT')} Kg
                </span>
              </div>
              <div className="space-y-1.5 pt-1 text-[11px] text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Allenamenti chiusi:</span>
                  <b className="text-white">{muscleVolumeAnalysis.recentCount} sessioni</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Microciclo selezionato:</span>
                  <b className="text-amber-400 font-mono">Week {selectedWeek} / 4</b>
                </div>
              </div>
            </div>
          </div>

          {/* RIPARTIZIONE VOLUME PER TUTTI I DISTRETTI */}
          <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#E50914]" /> Dettaglio Serie Settimanali per Singolo Distretto
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              {(Object.keys(muscleVolumeAnalysis.setsPerMuscle) as MuscleGroup[]).map(mg => {
                const count = muscleVolumeAnalysis.setsPerMuscle[mg];
                const isSelected = focusedMuscle === mg;
                return (
                  <div
                    key={mg}
                    onClick={() => setFocusedMuscle(mg)}
                    className={`p-2 rounded-lg border cursor-pointer transition flex justify-between items-center ${
                      isSelected 
                        ? 'bg-zinc-900 border-[#E50914] text-white' 
                        : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{mg}</span>
                    <b className={`font-mono ${count >= 15 && count <= 25 ? 'text-emerald-400' : (count > 25 ? 'text-rose-400' : 'text-zinc-300')}`}>
                      {count} set
                    </b>
                  </div>
                );
              })}
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