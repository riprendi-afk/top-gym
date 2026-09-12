'use client';

import React, { useState } from 'react';
import { 
  Dumbbell, 
  Gauge, 
  BarChart3, 
  UserCheck, 
  Trophy, 
  Plus, 
  Copy, 
  Trash2, 
  Moon, 
  Scale, 
  Sparkles, 
  BatteryCharging, 
  Brain, 
  HeartPulse, 
  CalendarDays, 
  Medal, 
  CheckCircle 
} from 'lucide-react';

// Tipologie e opzioni
type TabType = 'workout' | 'readiness' | 'analytics' | 'builder' | 'leaderboard';
type RoleType = 'ATHLETE' | 'COACH';
type ExecutionType = 'REGULAR' | 'SUPERSET' | 'REST_PAUSE' | 'DROP_SET' | 'CLUSTER';

export default function WorkoutDashboard() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<TabType>('workout');
  const [userRole, setUserRole] = useState<RoleType>('COACH'); // Impostato di default su COACH per accedere subito

  // Mock State Esercizio Attivo
  const [currentExercise, setCurrentExercise] = useState({
    id: 'ex-1',
    name: 'Panca Piana Bilanciere',
    sets: 4,
    reps: '8-10',
    targetWeight: '90',
    rpeTarget: 8,
    tut: '3-0-1-0',
    executionType: 'REGULAR' as ExecutionType,
  });

  // Inputs Form Logging
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('8');
  const [todayLogs, setTodayLogs] = useState<any[]>([]);

  // Readiness Form Inputs
  const [sleepHours, setSleepHours] = useState('7.5');
  const [bodyWeight, setBodyWeight] = useState('');
  const [sleepQuality, setSleepQuality] = useState(8);
  const [energyLevel, setEnergyLevel] = useState(8);
  const [stressLevel, setStressLevel] = useState(3);
  const [domsLevel, setDomsLevel] = useState(2);
  const [readinessHistory, setReadinessHistory] = useState<any[]>([]);

  // Helper 1RM
  const calculate1RM = (w: number, r: number) => {
    if (!w || !r) return 0;
    return Math.round(w * (1 + r / 30));
  };

  const handleLogSet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !reps) return;
    const newLog = {
      id: Date.now().toString(),
      exerciseName: currentExercise.name,
      weight: parseFloat(weight),
      reps: parseInt(reps, 10),
      rpe: parseFloat(rpe),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString(),
      estimated1RM: calculate1RM(parseFloat(weight), parseInt(reps, 10)),
      volume: parseFloat(weight) * parseInt(reps, 10)
    };
    setTodayLogs([newLog, ...todayLogs]);
    setWeight('');
    setReps('');
  };

  const handleSaveReadiness = (e: React.FormEvent) => {
    e.preventDefault();
    const score = Math.round(((Number(sleepHours) / 8) * 20) + (sleepQuality * 3) + (energyLevel * 3) + ((10 - stressLevel) * 1) + ((10 - domsLevel) * 1));
    const finalScore = Math.min(100, Math.max(20, score));
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      readinessScore: finalScore,
      sleepHours,
      bodyWeight,
      recommendation: finalScore > 85 ? 'Stato Forma Ottimale: Spingi sul carico!' : 'Recupero Medio: Mantieni i carichi target.'
    };
    setReadinessHistory([newEntry, ...readinessHistory]);
    alert(`Readiness salvata! Punteggio: ${finalScore}%`);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      {/* HEADER PRINCIPALE CON NAVIGAZIONE E SELETTORE RUOLO */}
      <header className="bg-[#1E1E1E] border-b border-zinc-800 sticky top-0 z-50 p-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-[#E50914] tracking-wider">FITNESS</span>
            <span className="text-xl font-black text-white">PRO</span>
          </div>

          {/* BARRA DEI MENU PER PASSARE DA UNA TAB ALL'ALTRA */}
          <nav className="flex items-center gap-1 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 overflow-x-auto">
            <button
              onClick={() => setActiveTab('workout')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'workout' ? 'bg-[#E50914] text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-4 h-4"/> Allenamento
            </button>

            <button
              onClick={() => setActiveTab('readiness')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'readiness' ? 'bg-[#E50914] text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Gauge className="w-4 h-4"/> Check Readiness
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'analytics' ? 'bg-[#E50914] text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4"/> Progressi
            </button>

            {/* PULSANTE COACH VISIBILE SOLO SE RUOLO === 'COACH' */}
            {userRole === 'COACH' && (
              <button
                onClick={() => setActiveTab('builder')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'builder' ? 'bg-[#E50914] text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4"/> Area Coach
              </button>
            )}

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'leaderboard' ? 'bg-[#E50914] text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4"/> Classifica
            </button>
          </nav>

          {/* CONTROLLO PER PASSARE DA ATLETA A COACH */}
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
            <span className="text-xs text-zinc-400 font-bold">Ruolo:</span>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as RoleType)}
              className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
            >
              <option value="ATHLETE" className="bg-zinc-900">Atleta</option>
              <option value="COACH" className="bg-zinc-900">Coach / Trainer</option>
            </select>
          </div>
        </div>
      </header>

      {/* CONTENUTO PRINCIPALE IN BASE ALLA TAB SELEZIONATA */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {/* TAB 1: ALLENAMENTO */}
        {activeTab === 'workout' && (
          <div className="space-y-6">
            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
              <div className="mb-4 pb-4 border-b border-zinc-800 flex justify-between items-end flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#E50914] font-bold uppercase tracking-wider">Esercizio Selezionato</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-300 uppercase">
                      {currentExercise.executionType}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white mt-1">{currentExercise.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1">Target: {currentExercise.sets} Serie × {currentExercise.reps} Reps @ {currentExercise.targetWeight} Kg | TUT: <span className="text-yellow-500 font-mono font-bold">{currentExercise.tut}</span></p>
                </div>

                {weight && reps && (
                  <div className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg text-right">
                    <div className="text-[10px] text-zinc-400 uppercase font-bold">1RM Stimato</div>
                    <div className="text-lg font-black text-[#E50914]">{calculate1RM(parseFloat(weight), parseInt(reps, 10))} Kg</div>
                  </div>
                )}
              </div>

              {/* FORM LOG SET */}
              <form onSubmit={handleLogSet} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Carico (Kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      placeholder="es. 80"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold outline-none focus:border-[#E50914]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Reps</label>
                    <input
                      type="number"
                      required
                      value={reps}
                      onChange={e => setReps(e.target.value)}
                      placeholder="es. 8"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold outline-none focus:border-[#E50914]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">RPE</label>
                    <select
                      value={rpe}
                      onChange={e => setRpe(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold outline-none focus:border-[#E50914]"
                    >
                      {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(val => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#E50914] hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 uppercase tracking-wider transition-all"
                >
                  <Plus className="w-5 h-5"/> Registra Serie
                </button>
              </form>

              {/* LOGS SALVATI OGGI */}
              <div className="mt-6">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Serie Registrate Oggi</h4>
                {todayLogs.length === 0 ? (
                  <p className="text-xs text-zinc-600 italic">Nessuna serie salvata in questa sessione.</p>
                ) : (
                  <div className="space-y-2">
                    {todayLogs.map((log, i) => (
                      <div key={log.id} className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 flex justify-between items-center text-xs">
                        <span className="font-bold text-zinc-400">Set {todayLogs.length - i}</span>
                        <span className="text-white font-bold">{log.weight} Kg × {log.reps} reps</span>
                        <span className="text-zinc-400">RPE: {log.rpe}</span>
                        <span className="text-zinc-500 font-mono">{log.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CHECK READINESS */}
        {activeTab === 'readiness' && (
          <div className="space-y-6">
            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2"><Gauge className="text-green-400"/> Check-in Giornaliero dello Stato di Forma</h2>
              <p className="text-xs text-zinc-400 mb-6">Valuta le tue variabili biologiche per calcolare l'algoritmo di autoregolazione.</p>

              <form onSubmit={handleSaveReadiness} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1 flex items-center gap-1.5"><Moon className="w-4 h-4 text-indigo-400"/> Ore di Sonno</label>
                    <input
                      type="number"
                      step="0.5"
                      value={sleepHours}
                      onChange={e => setSleepHours(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold outline-none focus:border-[#E50914]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1 flex items-center gap-1.5"><Scale className="w-4 h-4 text-blue-400"/> Peso Corporeo (Kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={bodyWeight}
                      onChange={e => setBodyWeight(e.target.value)}
                      placeholder="es. 78.5"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold outline-none focus:border-[#E50914]"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-zinc-400 flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-yellow-400"/> Qualità del Sonno</span>
                      <span className="text-yellow-400 font-mono">{sleepQuality} / 10</span>
                    </div>
                    <input type="range" min="1" max="10" value={sleepQuality} onChange={e => setSleepQuality(Number(e.target.value))} className="w-full accent-[#E50914]" />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-zinc-400 flex items-center gap-1.5"><BatteryCharging className="w-4 h-4 text-green-400"/> Livello di Energia</span>
                      <span className="text-green-400 font-mono">{energyLevel} / 10</span>
                    </div>
                    <input type="range" min="1" max="10" value={energyLevel} onChange={e => setEnergyLevel(Number(e.target.value))} className="w-full accent-[#E50914]" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#E50914] hover:bg-red-700 text-white font-bold py-3 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <Gauge className="w-5 h-5"/> Salva Check Readiness
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: AREA COACH (BUILDER) */}
        {activeTab === 'builder' && userRole === 'COACH' && (
          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><UserCheck className="text-[#E50914]"/> Area Gestione Schede (Coach)</h2>
            <p className="text-xs text-zinc-400 mb-6">Da qui puoi creare, modificare ed assegnare i programmi di allenamento agli atleti della palestra.</p>
            
            <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 text-sm text-zinc-300">
              ✓ Pannello Coach attivo e sincronizzato.
            </div>
          </div>
        )}

        {/* TAB 4: PROGRESSI */}
        {activeTab === 'analytics' && (
          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><BarChart3 className="text-[#E50914]"/> Analisi & Progressi</h2>
            <p className="text-xs text-zinc-400">Riepilogo volumi di allenamento e progressione dei carichi.</p>
          </div>
        )}

        {/* TAB 5: CLASSIFICA */}
        {activeTab === 'leaderboard' && (
          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Trophy className="text-yellow-500"/> Classifica & Trofei Palestra</h2>
            <p className="text-xs text-zinc-400">Punteggi XP e traguardi raggiunti.</p>
          </div>
        )}
      </main>
    </div>
  );
}