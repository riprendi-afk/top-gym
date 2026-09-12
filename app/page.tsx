'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Trophy, Shield, Dumbbell, UserCheck,
  Timer, Plus, CheckCircle, Clock, TrendingUp, BarChart3,
  Zap, Award, Volume2, VolumeX, Lock, Unlock, Eye,
  AlertTriangle, Copy, Sparkles, Scale, LogOut, Medal,
  Moon, HeartPulse, Brain, BatteryCharging, Gauge, CalendarDays, Trash2
} from 'lucide-react';
import {
  DAY_COUNT_OPTIONS,
  XP_PER_LEVEL,
  XP_PER_READINESS,
  XP_PER_SET,
  levelFromXp,
  type DayCount,
  type Exercise,
  type ExerciseDraft,
  type ExecutionType,
  type LeaderboardEntry,
  type ReadinessLog,
  type SessionUser,
  type SetLog,
  type UserRole,
  type WorkoutDay,
} from '@/lib/types';
import { defaultExerciseDraft, resizeProgramDays } from '@/lib/program';
import {
  getCurrentSession,
  loadAthletes,
  loadGymState,
  loadLeaderboard,
  saveProgram,
  saveReadinessLog,
  saveSetLog,
  signOutAccount,
} from '@/lib/store';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const todayIso = () => new Date().toISOString().split('T')[0];

export default function TopGymApp() {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [activeAthleteId, setActiveAthleteId] = useState('');
  const [athletes, setAthletes] = useState<SessionUser[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [programName, setProgramName] = useState('Scheda Personale');

  // Gestione Ruolo e Accesso
  const [userRole, setUserRole] = useState<UserRole>('ATHLETE');
  const [showCoachPinModal, setShowCoachPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Tab Attiva
  const [activeTab, setActiveTab] = useState<'workout' | 'readiness' | 'analytics' | 'builder' | 'leaderboard'>('workout');
  const [userXp, setUserXp] = useState(0);

  // Impostazioni Audio Timer
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Timer di Recupero
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Form Check Readiness
  const [sleepHours, setSleepHours] = useState('7.5');
  const [sleepQuality, setSleepQuality] = useState(8);
  const [stressLevel, setStressLevel] = useState(3);
  const [domsLevel, setDomsLevel] = useState(3);
  const [energyLevel, setEnergyLevel] = useState(8);
  const [bodyWeight, setBodyWeight] = useState('');

  const [readinessHistory, setReadinessHistory] = useState<ReadinessLog[]>([]);

  // Scheda Attiva (2-6 giorni, ognuno con titolo/focus ed esercizi)
  const [daysCount, setDaysCount] = useState<DayCount>(4);
  const [programDays, setProgramDays] = useState<WorkoutDay[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [dayDrafts, setDayDrafts] = useState<Record<string, ExerciseDraft>>({});

  // Form Inserimento Serie (Atleta)
  const [currentExId, setCurrentExId] = useState('1');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('8');

  // Storico Log Serie
  const [logs, setLogs] = useState<SetLog[]>([]);

  // Selezione esercizio per Analisi
  const [selectedAnalyticsEx, setSelectedAnalyticsEx] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const session = await getCurrentSession();
      if (!session) {
        router.replace('/login');
        return;
      }
      if (cancelled) return;
      setSessionUser(session);
      setActiveAthleteId(session.id);
      setUserRole(session.role);
      const [state, board, people] = await Promise.all([
        loadGymState(session.id),
        loadLeaderboard(),
        loadAthletes().catch(() => [session]),
      ]);
      if (cancelled) return;
      applyLoadedState(state, session.id);
      setLeaderboard(board);
      setAthletes(people.length ? people : [session]);
      setBootstrapping(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const applyLoadedState = (state: Awaited<ReturnType<typeof loadGymState>>, athleteId: string) => {
    setProgramName(state.programName);
    setDaysCount(state.daysCount);
    setProgramDays(state.programDays);
    setLogs(state.logs);
    setReadinessHistory(state.readinessHistory);
    setUserXp(state.xp);
    setSelectedDayIndex(0);
    const firstEx = state.programDays[0]?.exercises[0];
    setCurrentExId(firstEx?.id || '');
    const firstLogged = state.logs[0]?.exerciseName || firstEx?.name || '';
    setSelectedAnalyticsEx(firstLogged);
    setActiveAthleteId(athleteId);
  };

  const persistCurrentProgram = async (
    nextDays: WorkoutDay[],
    nextCount: DayCount = daysCount,
    nextName: string = programName
  ) => {
    if (!activeAthleteId) return;
    await saveProgram(activeAthleteId, {
      programName: nextName,
      daysCount: nextCount,
      programDays: nextDays,
    });
  };

  const refreshLeaderboard = async () => {
    setLeaderboard(await loadLeaderboard());
  };

  const handleLogout = async () => {
    await signOutAccount();
    router.replace('/login');
  };

  const handleSelectAthlete = async (athleteId: string) => {
    const state = await loadGymState(athleteId);
    applyLoadedState(state, athleteId);
  };

  const activeDay = programDays[selectedDayIndex] ?? programDays[0];
  const activeRoutine = activeDay?.exercises ?? [];

  const getDayDraft = (dayId: string): ExerciseDraft => dayDrafts[dayId] ?? defaultExerciseDraft();

  const updateDayDraft = (dayId: string, patch: Partial<ExerciseDraft>) => {
    setDayDrafts(prev => ({
      ...prev,
      [dayId]: { ...(prev[dayId] ?? defaultExerciseDraft()), ...patch }
    }));
  };

  const handleDaysCountChange = (count: DayCount) => {
    setDaysCount(count);
    setProgramDays(prev => {
      const next = resizeProgramDays(prev, count);
      void persistCurrentProgram(next, count);
      return next;
    });
    setSelectedDayIndex(prev => Math.min(prev, count - 1));
  };

  const handleDayTitleChange = (dayId: string, title: string) => {
    setProgramDays(prev => {
      const next = prev.map(day => (day.id === dayId ? { ...day, title } : day));
      void persistCurrentProgram(next);
      return next;
    });
  };

  // Audio Timer
  const playTimerSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);

      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch (e) {
      console.log('Audio Context bloccato o non supportato');
    }
  };

  // Gestione Timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && restTimer !== null && restTimer > 0) {
      interval = setInterval(() => setRestTimer(prev => (prev ? prev - 1 : 0)), 1000);
    } else if (restTimer === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playTimerSound();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, restTimer]);

  const startRestTimer = (seconds: number) => {
    setRestTimer(seconds);
    setIsTimerRunning(true);
  };

  // Switch Ruolo con PIN
  const handleRoleSwitchRequest = (targetRole: UserRole) => {
    if (targetRole === 'COACH' && userRole !== 'COACH') {
      setShowCoachPinModal(true);
    } else {
      setUserRole('ATHLETE');
      if (activeTab === 'builder') setActiveTab('workout');
    }
  };

  const verifyCoachPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234') {
      setUserRole('COACH');
      setShowCoachPinModal(false);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Calcolo 1RM (Epley)
  const calculate1RM = (w: number, r: number) => {
    if (r === 1) return w;
    return Math.round(w * (1 + r / 30));
  };

  // Auto-fill Ultimo Carico
  const currentExercise = activeRoutine.find(e => e.id === currentExId) || activeRoutine[0];
  const exerciseHistory = currentExercise
    ? logs.filter(l => l.exerciseName === currentExercise.name)
    : [];
  const lastLoggedSet = exerciseHistory[0];
  const lastSessionDate = exerciseHistory.find(l => l.date !== todayIso())?.date;
  const lastSessionSets = lastSessionDate
    ? exerciseHistory.filter(l => l.date === lastSessionDate)
    : [];

  const handleAutoFillLastLog = () => {
    if (lastLoggedSet) {
      setWeight(lastLoggedSet.weight.toString());
      setReps(lastLoggedSet.reps.toString());
      setRpe(lastLoggedSet.rpe.toString());
    }
  };

  // CALCOLO READINESS SCORE
  const computeReadiness = () => {
    const sleepFactor = (sleepQuality * 10) * 0.35;
    const energyFactor = (energyLevel * 10) * 0.30;
    const stressFactor = ((11 - stressLevel) * 10) * 0.20;
    const domsFactor = ((11 - domsLevel) * 10) * 0.15;

    const totalScore = Math.round(sleepFactor + energyFactor + stressFactor + domsFactor);

    let rec = '';
    if (totalScore >= 80) {
      rec = 'Pronto per la massima intensità! Segui i carichi target e spingi al 100%.';
    } else if (totalScore >= 60) {
      rec = 'Stato discreto. Allenamento regolare, ma mantieni 1 rep di margine nei fondamentali.';
    } else {
      rec = 'Fatica/Stress elevati. Consigliato scarico attivo o riduzione carichi/volume del 15-20%.';
    }

    return { totalScore, rec };
  };

  // SALVATAGGIO READINESS
  const handleSaveReadiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAthleteId) return;
    const { totalScore, rec } = computeReadiness();

    const newReadiness: ReadinessLog = {
      id: crypto.randomUUID(),
      date: todayIso(),
      sleepHours: parseFloat(sleepHours) || 7,
      sleepQuality,
      stressLevel,
      domsLevel,
      energyLevel,
      bodyWeight: bodyWeight ? parseFloat(bodyWeight) : undefined,
      readinessScore: totalScore,
      recommendation: rec
    };

    const nextXp = userXp + XP_PER_READINESS;
    setReadinessHistory([newReadiness, ...readinessHistory]);
    setUserXp(nextXp);
    await saveReadinessLog(activeAthleteId, newReadiness, nextXp);
    await refreshLeaderboard();
    setActiveTab('workout');
  };

  const handleLogSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAthleteId) return;
    const numWeight = parseFloat(weight);
    const numReps = parseInt(reps, 10);
    const numRpe = parseFloat(rpe);

    if (!numWeight || !numReps) return;

    const exerciseObj = activeRoutine.find(e => e.id === currentExId);
    const est1RM = calculate1RM(numWeight, numReps);
    const setVolume = numWeight * numReps;

    const newLog: SetLog = {
      id: crypto.randomUUID(),
      exerciseId: currentExId,
      exerciseName: exerciseObj?.name || 'Esercizio',
      weight: numWeight,
      reps: numReps,
      rpe: numRpe,
      estimated1RM: est1RM,
      volume: setVolume,
      date: todayIso(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextXp = userXp + XP_PER_SET;
    const nextDays = programDays.map(day => ({
      ...day,
      exercises: day.exercises.map(ex =>
        ex.id === currentExId || ex.name === exerciseObj?.name
          ? { ...ex, targetWeight: String(numWeight) }
          : ex
      ),
    }));

    setLogs([newLog, ...logs]);
    setUserXp(nextXp);
    setProgramDays(nextDays);
    await saveSetLog(activeAthleteId, newLog, nextXp, nextDays);
    await refreshLeaderboard();

    if (exerciseObj?.restSeconds) {
      startRestTimer(exerciseObj.restSeconds);
    }

    setWeight('');
    setReps('');
  };

  const handleAddExerciseToDay = (e: React.FormEvent, dayId: string) => {
    e.preventDefault();
    if (userRole !== 'COACH') return;

    const draft = getDayDraft(dayId);
    if (!draft.name.trim()) return;

    const newExercise: Exercise = {
      id: crypto.randomUUID(),
      name: draft.name.trim(),
      sets: draft.sets,
      reps: draft.reps,
      targetWeight: draft.weight || 'N.D.',
      rpeTarget: draft.rpe,
      restSeconds: draft.rest,
      executionType: draft.type,
      tut: draft.tut || '2-0-1-0',
      notes: draft.notes || 'Nessuna nota'
    };

    setProgramDays(prev => {
      const next = prev.map(day =>
        day.id === dayId ? { ...day, exercises: [...day.exercises, newExercise] } : day
      );
      void persistCurrentProgram(next);
      return next;
    });
    setDayDrafts(prev => ({ ...prev, [dayId]: defaultExerciseDraft() }));
  };

  const handleRemoveExerciseFromDay = (dayId: string, exerciseId: string) => {
    if (userRole !== 'COACH') return;
    setProgramDays(prev => {
      const next = prev.map(day =>
        day.id === dayId
          ? { ...day, exercises: day.exercises.filter(ex => ex.id !== exerciseId) }
          : day
      );
      void persistCurrentProgram(next);
      return next;
    });
  };

  const handleSelectWorkoutDay = (index: number) => {
    setSelectedDayIndex(index);
    const firstEx = programDays[index]?.exercises[0];
    if (firstEx) setCurrentExId(firstEx.id);
  };

  const getBadgeStyle = (type: ExecutionType) => {
    switch (type) {
      case 'SUPERSET': return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'REST_PAUSE': return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'DROP_SET': return 'bg-red-950 text-red-300 border-red-800';
      case 'CLUSTER': return 'bg-blue-950 text-blue-300 border-blue-800';
      default: return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  const userLevel = levelFromXp(userXp);
  const todayLogs = logs.filter(l => l.date === todayIso());
  const activeAthleteName =
    athletes.find(a => a.id === activeAthleteId)?.displayName || sessionUser?.displayName || 'Atleta';

  // METRICHE
  const totalVolumeToday = todayLogs.reduce((acc, curr) => acc + curr.volume, 0);
  const totalSetsToday = todayLogs.length;
  const exerciseLogs = logs.filter(l => l.exerciseName === selectedAnalyticsEx);
  const maxWeightForEx = exerciseLogs.length > 0 ? Math.max(...exerciseLogs.map(l => l.weight)) : 0;
  const max1RMForEx = exerciseLogs.length > 0 ? Math.max(...exerciseLogs.map(l => l.estimated1RM)) : 0;
  const totalExVolume = exerciseLogs.reduce((acc, curr) => acc + curr.volume, 0);
  const uniqueLoggedExercises = Array.from(new Set(logs.map(l => l.exerciseName)));

  // Ultimo score readiness
  const latestReadiness = readinessHistory[0];

  // Alert Fatica
  const recentRpeLogs = logs.slice(0, 4);
  const highFatigueDetected = recentRpeLogs.length >= 2 && recentRpeLogs.every(l => l.rpe >= 9.5);

  // Badge Gamification
  const achievements: Achievement[] = [
    { id: '1', title: 'Club dei 100kg', description: 'Solleva 100kg o più in un esercizio', icon: '🏋️', unlocked: logs.some(l => l.weight >= 100) },
    { id: '2', title: 'PR Breaker', description: 'Supera il tuo massimale stimato', icon: '🔥', unlocked: logs.length >= 3 },
    { id: '3', title: 'Atleta Consapevole', description: 'Registra 5 Check di Readiness', icon: '🧠', unlocked: readinessHistory.length >= 2 },
    { id: '4', title: 'Costanza d\'Acciaio', description: 'Mantieni 5 giorni di frequenza', icon: '⚡', unlocked: new Set(logs.map(l => l.date)).size >= 5 }
  ];

  if (bootstrapping || !sessionUser) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <p className="text-sm text-zinc-400 font-bold tracking-wider">Caricamento scheda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans p-4 md:p-8">
      {/* HEADER UTENTE */}
      <header className="max-w-5xl mx-auto bg-[#1E1E1E] rounded-xl p-6 border border-zinc-800 shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-wider text-[#E50914] flex items-center gap-2">
              <Dumbbell className="w-8 h-8" /> TOP GYM
            </h1>
            <p className="text-sm text-zinc-300 mt-1 font-bold">{sessionUser.displayName}</p>
            <p className="text-xs text-zinc-500">{sessionUser.email}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs font-bold">
                <button 
                  onClick={() => handleRoleSwitchRequest('ATHLETE')}
                  className={`px-3 py-1 rounded transition-all flex items-center gap-1 ${userRole === 'ATHLETE' ? 'bg-[#E50914] text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                  <Eye className="w-3.5 h-3.5" /> Atleta
                </button>
                <button 
                  onClick={() => handleRoleSwitchRequest('COACH')}
                  className={`px-3 py-1 rounded transition-all flex items-center gap-1 ${userRole === 'COACH' ? 'bg-[#E50914] text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                  {userRole === 'COACH' ? <Unlock className="w-3.5 h-3.5 text-green-400" /> : <Lock className="w-3.5 h-3.5" />} Trainer / Coach
                </button>
              </div>

              {userRole === 'COACH' && (
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-xs font-bold">Gestisci Atleta:</span>
                  <select 
                    value={activeAthleteId} 
                    onChange={e => void handleSelectAthlete(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-white text-xs rounded px-2 py-1 font-bold outline-none"
                  >
                    {athletes.map(athlete => (
                      <option key={athlete.id} value={athlete.id}>{athlete.displayName}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between flex-wrap">
            {/* TIMER RECUPERO CON AUDIO */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)} 
                title={soundEnabled ? 'Audio Timer Attivo' : 'Audio Disattivato'}
                className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5 text-green-400" /> : <VolumeX className="w-5 h-5 text-zinc-600" />}
              </button>

              {restTimer !== null && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-mono font-bold ${restTimer === 0 ? 'bg-green-950 border-green-600 text-green-400' : 'bg-red-950/40 border-[#E50914] text-white'}`}>
                  <Timer className="w-5 h-5 animate-pulse text-[#E50914]" />
                  <span>{restTimer === 0 ? 'RECUPERO FINE!' : `${Math.floor(restTimer / 60)}:${(restTimer % 60).toString().padStart(2, '0')}`}</span>
                </div>
              )}
            </div>

            {/* BADGE READINESS NELL'HEADER */}
            {latestReadiness && (
              <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800">
                <Gauge className={`w-5 h-5 ${latestReadiness.readinessScore >= 80 ? 'text-green-400' : latestReadiness.readinessScore >= 60 ? 'text-yellow-400' : 'text-[#E50914]'}`} />
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-bold">READINESS</div>
                  <div className="text-sm font-black">{latestReadiness.readinessScore}%</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800">
              <Shield className="text-yellow-500 w-5 h-5" />
              <div>
                <div className="text-xs text-zinc-400">LIVELLO {userLevel}</div>
                <div className="text-sm font-bold">{userXp} XP</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleLogout()}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg"
            >
              <LogOut className="w-4 h-4" /> Esci
            </button>
          </div>
        </div>
      </header>

      {/* MODALE AUTENTICAZIONE COACH */}
      {showCoachPinModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2">
              <Lock className="text-[#E50914]" /> Area Riservata Coach
            </h3>
            <p className="text-xs text-zinc-400 mb-4">Inserisci il PIN di sicurezza del Trainer per modificare o creare schede di allenamento.</p>
            
            <form onSubmit={verifyCoachPin} className="space-y-4">
              <div>
                <input 
                  type="password" 
                  value={pinInput} 
                  onChange={e => setPinInput(e.target.value)}
                  placeholder="Inserisci PIN (Es. 1234)"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-2.5 text-center text-lg font-mono text-white outline-none focus:border-[#E50914]"
                  autoFocus
                />
                {pinError && <p className="text-xs text-[#E50914] mt-1 text-center font-bold">PIN errato! Riprova (Demo PIN: 1234)</p>}
              </div>

              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => { setShowCoachPinModal(false); setPinError(false); setPinInput(''); }} 
                  className="w-1/2 bg-zinc-800 hover:bg-zinc-700 py-2 rounded text-xs font-bold text-zinc-300"
                >
                  Annulla
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 bg-[#E50914] hover:bg-red-700 py-2 rounded text-xs font-bold text-white uppercase tracking-wider"
                >
                  Sblocca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NAVIGAZIONE TAB */}
      <div className="max-w-5xl mx-auto flex flex-wrap gap-2 mb-6">
        <button onClick={() => setActiveTab('workout')} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'workout' ? 'bg-[#E50914] text-white' : 'bg-[#1E1E1E] text-zinc-400 hover:text-white'}`}>Esegui Allenamento</button>
        <button onClick={() => setActiveTab('readiness')} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'readiness' ? 'bg-[#E50914] text-white' : 'bg-[#1E1E1E] text-zinc-400 hover:text-white'}`}><Gauge className="w-4 h-4 text-green-400" /> Check Readiness</button>
        <button onClick={() => setActiveTab('analytics')} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-[#E50914] text-white' : 'bg-[#1E1E1E] text-zinc-400 hover:text-white'}`}><TrendingUp className="w-4 h-4" /> Analisi & Progressi</button>
        
        {userRole === 'COACH' && (
          <button onClick={() => setActiveTab('builder')} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-1.5 ${activeTab === 'builder' ? 'bg-[#E50914] text-white' : 'bg-[#1E1E1E] text-zinc-400 hover:text-white'}`}>
            <UserCheck className="w-4 h-4" /> Gestisci Scheda (Trainer)
          </button>
        )}

        <button onClick={() => setActiveTab('leaderboard')} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'leaderboard' ? 'bg-[#E50914] text-white' : 'bg-[#1E1E1E] text-zinc-400 hover:text-white'}`}><Trophy className="w-4 h-4 text-yellow-500" /> Classifica & Badge</button>
      </div>

      {/* CONTENUTO PRINCIPALE */}
      <main className="max-w-5xl mx-auto">
        {/* TAB 1: ESEGUI SCHEDA */}
        {activeTab === 'workout' && (
          <div className="space-y-6">
            {/* ALERT READINESS SE PRESENTE */}
            {latestReadiness && (
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${latestReadiness.readinessScore >= 80 ? 'bg-green-950/30 border-green-800 text-green-200' : latestReadiness.readinessScore >= 60 ? 'bg-yellow-950/30 border-yellow-800 text-yellow-200' : 'bg-red-950/30 border-red-800 text-red-200'}`}>
                <Gauge className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm flex items-center gap-2">
                    Score Readiness Odierno: <span className="text-base font-black">{latestReadiness.readinessScore}%</span>
                  </div>
                  <p className="text-xs opacity-90 mt-1">{latestReadiness.recommendation}</p>
                </div>
              </div>
            )}

            {highFatigueDetected && (
              <div className="bg-amber-950/40 border border-amber-600/60 p-4 rounded-xl flex items-start gap-3 text-amber-300">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-amber-200">Livello di Fatica Accumulata Elevato!</h4>
                  <p className="text-xs text-amber-300/80 mt-1">
                    Hai registrato serie consecutive ad RPE 9.5+. Considera di estendere il tempo di recupero di 30 secondi o di ridurre leggermente il carico nella prossima serie.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <h2 className="text-xl font-bold flex items-center gap-2"><Dumbbell className="text-[#E50914]" /> Scheda di {activeAthleteName}: {programName}</h2>
                <span className="text-xs bg-zinc-900 border border-zinc-800 px-3 py-1 rounded text-zinc-400 font-bold">{daysCount} giorni / settimana</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {programDays.map((day, index) => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => handleSelectWorkoutDay(index)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${selectedDayIndex === index ? 'bg-[#E50914] border-[#E50914] text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'}`}
                  >
                    Giorno {day.dayNumber}
                    {day.title ? ` · ${day.title}` : ''}
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <p className="text-sm font-black text-white">
                  Giorno {activeDay?.dayNumber}: {activeDay?.title || 'Focus da definire'}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">Titolo/Focus personalizzato dal coach (es. Push, Pull, Legs).</p>
              </div>
              
              {activeRoutine.length === 0 ? (
                <p className="text-sm text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-lg p-4">Nessun esercizio assegnato a questo giorno.</p>
              ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {activeRoutine.map((ex) => (
                  <div 
                    key={ex.id} 
                    onClick={() => setCurrentExId(ex.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${currentExId === ex.id ? 'bg-red-950/20 border-[#E50914]' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-lg text-white">{ex.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getBadgeStyle(ex.executionType)}`}>
                        {ex.executionType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs text-zinc-400 mt-2 border-t border-zinc-800/60 pt-2">
                      <div>Serie/Reps: <b className="text-white">{ex.sets} × {ex.reps}</b></div>
                      <div>Target: <b className="text-white">{ex.targetWeight} Kg</b></div>
                      <div>TUT: <b className="text-yellow-500 font-mono">{ex.tut}</b></div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-zinc-400 mt-2">
                      <span>RPE Target: <b className="text-white">{ex.rpeTarget}</b></span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#E50914]" /> {ex.restSeconds}s rec</span>
                    </div>

                    {ex.notes && <p className="text-xs text-zinc-500 italic mt-2">Note Coach: {ex.notes}</p>}
                  </div>
                ))}
              </div>
              )}
            </div>

            {currentExercise && (
            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
              <div className="mb-4 pb-4 border-b border-zinc-800 flex justify-between items-end">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#E50914] font-bold uppercase tracking-wider">Esercizio Selezionato</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getBadgeStyle(currentExercise.executionType)}`}>
                      {currentExercise.executionType.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white">{currentExercise.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1">Target: {currentExercise.sets} Serie × {currentExercise.reps} Reps @ {currentExercise.targetWeight} Kg (RPE {currentExercise.rpeTarget}) | TUT: <span className="text-yellow-500 font-mono font-bold">{currentExercise.tut}</span></p>
                </div>

                {weight && reps && (
                  <div className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg text-right">
                    <div className="text-[10px] text-zinc-400 uppercase font-bold">1RM Stimato</div>
                    <div className="text-lg font-black text-[#E50914]">{calculate1RM(parseFloat(weight), parseInt(reps))} Kg</div>
                  </div>
                )}
              </div>

              {lastLoggedSet && (
                <div className="mb-4 bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-zinc-400">
                      <span className="text-zinc-500 font-bold uppercase mr-2">Ultimo carico salvato:</span>
                      <b className="text-white">{lastLoggedSet.weight} Kg</b> × <b className="text-white">{lastLoggedSet.reps} reps</b> (RPE {lastLoggedSet.rpe})
                      <span className="text-zinc-500 ml-2">{lastLoggedSet.date}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoFillLastLog}
                      className="flex items-center gap-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded font-bold border border-zinc-700 transition-all"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#E50914]" /> Riprendi ultimo carico
                    </button>
                  </div>
                  {lastSessionSets.length > 0 && (
                    <p className="text-[11px] text-zinc-500">
                      Ultima sessione ({lastSessionDate}): {lastSessionSets.map(s => `${s.weight}kg × ${s.reps}`).join(' · ')}
                    </p>
                  )}
                </div>
              )}

              <form onSubmit={handleLogSet} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Carico Usato (Kg)</label>
                  <input type="number" step="0.5" value={weight} onChange={e => setWeight(e.target.value)} placeholder={`Es. ${currentExercise.targetWeight}`} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:border-[#E50914] outline-none font-bold" required />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Reps Eseguite</label>
                  <input type="number" value={reps} onChange={e => setReps(e.target.value)} placeholder={`Es. ${currentExercise.reps}`} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:border-[#E50914] outline-none font-bold" required />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">RPE Reale (1-10)</label>
                  <input type="number" step="0.5" value={rpe} onChange={e => setRpe(e.target.value)} min="1" max="10" className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:border-[#E50914] outline-none font-bold" />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full bg-[#E50914] hover:bg-red-700 py-2.5 rounded font-bold transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-1 shadow-lg shadow-red-950">
                    <CheckCircle className="w-4 h-4" /> Registra Serie
                  </button>
                </div>
              </form>

              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Serie Eseguite Oggi</h4>
              <div className="space-y-2">
                {todayLogs.length === 0 ? <p className="text-zinc-600 text-sm">Ancora nessuna serie registrata per questa sessione.</p> : todayLogs.map((log) => (
                  <div key={log.id} className="flex justify-between items-center bg-zinc-900 p-3 rounded border border-zinc-800 text-sm">
                    <div>
                      <span className="font-bold text-white mr-2">{log.exerciseName}</span>
                      <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">Vol: {log.volume} kg</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-[#E50914] text-base">{log.weight} Kg × {log.reps}</span>
                      <span className="text-xs text-zinc-400 bg-zinc-800/80 px-2 py-1 rounded">RPE {log.rpe}</span>
                      <span className="text-xs text-yellow-500 font-bold hidden sm:inline">1RM ~{log.estimated1RM}kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>
        )}

        {/* TAB 2: CHECK READINESS COMPLETO (RIPRISTINATO COMPLETO) */}
        {activeTab === 'readiness' && (
          <div className="space-y-6">
            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Gauge className="text-green-400" /> Check Readiness Pre-Allenamento
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Registra i parametri di recupero per determinare lo stato di prontezza neurale e muscolare prima di iniziare la sessione.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-right">
                  <div className="text-[10px] text-zinc-400 uppercase font-bold">Stima Score Readiness</div>
                  <div className="text-2xl font-black text-green-400">{computeReadiness().totalScore}%</div>
                </div>
              </div>

              <form onSubmit={handleSaveReadiness} className="space-y-6 bg-zinc-900 p-5 rounded-xl border border-zinc-800">
                {/* ORE E QUALITÀ DEL SONNO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-zinc-800">
                  <div>
                    <label className="text-xs text-zinc-400 font-bold block mb-1 flex items-center gap-1.5">
                      <Moon className="w-4 h-4 text-blue-400" /> Ore di Sonno Effettive
                    </label>
                    <input 
                      type="number" 
                      step="0.5" 
                      value={sleepHours} 
                      onChange={e => setSleepHours(e.target.value)} 
                      placeholder="Es. 7.5" 
                      className="w-full bg-[#0A0A0A] border border-zinc-800 rounded px-3 py-2 text-white font-bold outline-none focus:border-[#E50914]" 
                      required 
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-zinc-400 font-bold mb-1">
                      <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-yellow-400" /> Qualità del Sonno</span>
                      <span className="text-white font-black">{sleepQuality} / 10</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={sleepQuality} 
                      onChange={e => setSleepQuality(Number(e.target.value))} 
                      className="w-full accent-[#E50914] cursor-pointer" 
                    />
                  </div>
                </div>

                {/* STRESS E ENERGIA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-zinc-800">
                  <div>
                    <div className="flex justify-between text-xs text-zinc-400 font-bold mb-1">
                      <span className="flex items-center gap-1.5"><Brain className="w-4 h-4 text-purple-400" /> Livello di Stress Percepito</span>
                      <span className="text-white font-black">{stressLevel} / 10</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={stressLevel} 
                      onChange={e => setStressLevel(Number(e.target.value))} 
                      className="w-full accent-[#E50914] cursor-pointer" 
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                      <span>1 = Relax Totale</span>
                      <span>10 = Stress Altissimo</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-zinc-400 font-bold mb-1">
                      <span className="flex items-center gap-1.5"><BatteryCharging className="w-4 h-4 text-green-400" /> Carica / Energia</span>
                      <span className="text-white font-black">{energyLevel} / 10</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={energyLevel} 
                      onChange={e => setEnergyLevel(Number(e.target.value))} 
                      className="w-full accent-[#E50914] cursor-pointer" 
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                      <span>1 = Apatia / Sfinito</span>
                      <span>10 = Carico Massimo</span>
                    </div>
                  </div>
                </div>

                {/* DOMS E PESO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs text-zinc-400 font-bold mb-1">
                      <span className="flex items-center gap-1.5"><HeartPulse className="w-4 h-4 text-[#E50914]" /> DOMS / Dolori Muscolari</span>
                      <span className="text-white font-black">{domsLevel} / 10</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={domsLevel} 
                      onChange={e => setDomsLevel(Number(e.target.value))} 
                      className="w-full accent-[#E50914] cursor-pointer" 
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                      <span>1 = Nessun Danno</span>
                      <span>10 = DOMS Debilitanti</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 font-bold block mb-1 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-zinc-400" /> Peso Corporeo del Mattino (Kg)
                    </label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={bodyWeight} 
                      onChange={e => setBodyWeight(e.target.value)} 
                      placeholder="Es. 78.5 (Opzionale)" 
                      className="w-full bg-[#0A0A0A] border border-zinc-800 rounded px-3 py-2 text-white font-bold outline-none focus:border-[#E50914]" 
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#0A0A0A] rounded-lg border border-zinc-800/80">
                  <div className="text-xs text-zinc-400 font-bold uppercase mb-1">Consiglio Operativo Generato:</div>
                  <p className="text-sm font-semibold text-zinc-200">{computeReadiness().rec}</p>
                </div>

                <button type="submit" className="w-full bg-[#E50914] hover:bg-red-700 py-3.5 rounded-lg font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950">
                  <CheckCircle className="w-5 h-5" /> Conferma Readiness & Salva (+100 XP)
                </button>
              </form>
            </div>

            {/* STORICO READINESS */}
            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Storico Readiness & Stato Biometrico</h3>
              
              <div className="space-y-3">
                {readinessHistory.map(item => (
                  <div key={item.id} className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-500 font-mono font-bold">{item.date}</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded font-black border ${item.readinessScore >= 80 ? 'bg-green-950 text-green-400 border-green-800' : item.readinessScore >= 60 ? 'bg-yellow-950 text-yellow-400 border-yellow-800' : 'bg-red-950 text-red-400 border-red-800'}`}>
                          Score: {item.readinessScore}%
                        </span>
                        {item.bodyWeight && <span className="text-xs text-zinc-400 font-bold">{item.bodyWeight} Kg</span>}
                      </div>
                      <div className="text-xs text-zinc-400 font-mono">
                        Sonno: <b className="text-white">{item.sleepHours}h</b> (Qualità {item.sleepQuality}/10)
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 italic">{item.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANALISI E PROGRESSI */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#1E1E1E] p-5 rounded-xl border border-zinc-800 flex items-center gap-4">
                <div className="p-3 bg-red-950/50 border border-[#E50914] rounded-lg text-[#E50914]">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 font-bold uppercase">Tonnellaggio Oggi</div>
                  <div className="text-2xl font-black text-white">{totalVolumeToday.toLocaleString()} <span className="text-sm text-zinc-500 font-normal">Kg</span></div>
                </div>
              </div>

              <div className="bg-[#1E1E1E] p-5 rounded-xl border border-zinc-800 flex items-center gap-4">
                <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-yellow-500">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 font-bold uppercase">Serie Totali Oggi</div>
                  <div className="text-2xl font-black text-white">{totalSetsToday} <span className="text-sm text-zinc-500 font-normal">Work Sets</span></div>
                </div>
              </div>

              <div className="bg-[#1E1E1E] p-5 rounded-xl border border-zinc-800 flex items-center gap-4">
                <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-green-500">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-zinc-400 font-bold uppercase">Stato Progressivo</div>
                  <div className="text-lg font-bold text-green-400 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> Sovraccarico Attivo
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-zinc-800">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="text-[#E50914]" /> Curve di Progressione 1RM
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Grafico visuale dell'andamento dei carichi nel tempo.</p>
                </div>

                <select 
                  value={selectedAnalyticsEx}
                  onChange={e => setSelectedAnalyticsEx(e.target.value)}
                  className="bg-zinc-900 border border-zinc-700 text-white font-bold rounded-lg px-4 py-2 outline-none text-sm w-full md:w-auto"
                >
                  {uniqueLoggedExercises.length > 0 ? (
                    uniqueLoggedExercises.map(exName => (
                      <option key={exName} value={exName}>{exName}</option>
                    ))
                  ) : (
                    <option value="Panca Piana Bilanciere">Panca Piana Bilanciere</option>
                  )}
                </select>
              </div>

              {/* GRAFICO VISUALE SVG DI PROGRESSIONE 1RM */}
              <div className="mb-8 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Progressione Massimale Stimato (1RM)</h4>
                {exerciseLogs.length >= 2 ? (
                  <div className="h-44 w-full flex items-end gap-6 pt-6 pb-2 px-4 border-b border-zinc-800">
                    {exerciseLogs.map((log) => {
                      const min1RM = Math.min(...exerciseLogs.map(l => l.estimated1RM)) * 0.9;
                      const max1RM = Math.max(...exerciseLogs.map(l => l.estimated1RM)) * 1.1;
                      const heightPercent = Math.round(((log.estimated1RM - min1RM) / (max1RM - min1RM)) * 100);

                      return (
                        <div key={log.id} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                          <div className="absolute -top-6 text-[11px] font-bold text-[#E50914] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                            {log.estimated1RM} kg
                          </div>
                          <div 
                            style={{ height: `${heightPercent}%` }} 
                            className="w-full max-w-[40px] bg-gradient-to-t from-red-950 to-[#E50914] rounded-t transition-all group-hover:brightness-125"
                          ></div>
                          <span className="text-[10px] text-zinc-500 mt-2 font-mono">{log.date.substring(5)}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 text-center py-8">Servono almeno 2 registrazioni per generare la curva del grafico.</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6 bg-zinc-900/60 p-4 rounded-lg border border-zinc-800/80">
                <div className="text-center border-r border-zinc-800">
                  <div className="text-xs text-zinc-400 font-bold uppercase">Carico Max Registrato</div>
                  <div className="text-2xl font-black text-white mt-1">{maxWeightForEx} <span className="text-xs text-zinc-500">Kg</span></div>
                </div>
                <div className="text-center border-r border-zinc-800">
                  <div className="text-xs text-zinc-400 font-bold uppercase">Miglior 1RM Stimato</div>
                  <div className="text-2xl font-black text-[#E50914] mt-1">{max1RMForEx} <span className="text-xs text-zinc-500">Kg</span></div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-zinc-400 font-bold uppercase">Volume Esercizio</div>
                  <div className="text-2xl font-black text-white mt-1">{totalExVolume} <span className="text-xs text-zinc-500">Kg</span></div>
                </div>
              </div>

              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Registro Prestazioni ({selectedAnalyticsEx})</h4>
              {exerciseLogs.length === 0 ? (
                <p className="text-zinc-500 text-sm py-4 text-center">Nessun dato registrato per questo esercizio.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-xs text-zinc-400 uppercase bg-zinc-900/40">
                        <th className="py-3 px-4">Data/Ora</th>
                        <th className="py-3 px-4">Carico (Kg)</th>
                        <th className="py-3 px-4">Reps</th>
                        <th className="py-3 px-4">RPE</th>
                        <th className="py-3 px-4">1RM Stimato</th>
                        <th className="py-3 px-4">Tonnellaggio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {exerciseLogs.map(log => (
                        <tr key={log.id} className="hover:bg-zinc-900/30 transition-all">
                          <td className="py-3 px-4 text-zinc-400 text-xs">{log.date} <span className="text-zinc-600">({log.time})</span></td>
                          <td className="py-3 px-4 font-black text-white">{log.weight} Kg</td>
                          <td className="py-3 px-4 text-zinc-300 font-bold">{log.reps}</td>
                          <td className="py-3 px-4 text-zinc-400">RPE {log.rpe}</td>
                          <td className="py-3 px-4 font-bold text-yellow-500">{log.estimated1RM} Kg</td>
                          <td className="py-3 px-4 text-zinc-400 font-mono">{log.volume} Kg</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CREA/MODIFICA SCHEDA (ESCLUSIVA TRAINER) */}
        {activeTab === 'builder' && userRole === 'COACH' && (
          <div className="space-y-6">
            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><UserCheck className="text-[#E50914]" /> Editor Schede per {activeAthleteName}</h2>
              <p className="text-xs text-zinc-400 mb-5">Scegli da 2 a 6 giorni, poi per ogni giorno imposta Titolo/Focus (es. Push, Pull, Legs) e gli esercizi con serie e ripetizioni.</p>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-[#E50914]" /> Giorni settimanali
                </span>
                <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                  {DAY_COUNT_OPTIONS.map(count => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => handleDaysCountChange(count)}
                      className={`min-w-10 px-3 py-1.5 rounded text-sm font-black transition-all ${daysCount === count ? 'bg-[#E50914] text-white' : 'text-zinc-400 hover:text-white'}`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {programDays.map(day => {
              const draft = getDayDraft(day.id);
              return (
                <div key={day.id} className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
                  <div className="flex flex-col md:flex-row md:items-end gap-4 mb-5 pb-4 border-b border-zinc-800">
                    <div className="text-xs font-black uppercase tracking-wider text-[#E50914]">Giorno {day.dayNumber}</div>
                    <div className="flex-1">
                      <label className="text-xs text-zinc-400 block mb-1">Titolo / Focus</label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={e => handleDayTitleChange(day.id, e.target.value)}
                        placeholder="Es. Push, Pull, Legs, Upper, Lower..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white font-bold outline-none focus:border-[#E50914]"
                      />
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Esercizi del giorno</h4>
                  {day.exercises.length === 0 ? (
                    <p className="text-xs text-zinc-500 mb-4">Nessun esercizio. Aggiungi nome, serie e ripetizioni qui sotto.</p>
                  ) : (
                    <div className="space-y-2 mb-5">
                      {day.exercises.map(ex => (
                        <div key={ex.id} className="flex items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5">
                          <div className="min-w-0">
                            <div className="font-bold text-sm text-white truncate">{ex.name}</div>
                            <div className="text-xs text-zinc-400">{ex.sets} serie × {ex.reps} reps</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveExerciseFromDay(day.id, ex.id)}
                            className="p-2 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-800"
                            title="Rimuovi esercizio"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={e => handleAddExerciseToDay(e, day.id)} className="space-y-4 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="text-xs text-zinc-400 block mb-1">Nome Esercizio</label>
                        <input type="text" value={draft.name} onChange={e => updateDayDraft(day.id, { name: e.target.value })} placeholder="Es. Stacco da Terra Bilanciere" className="w-full bg-[#0A0A0A] border border-zinc-800 rounded px-3 py-2 text-white" required />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Tecnica Speciale</label>
                        <select value={draft.type} onChange={e => updateDayDraft(day.id, { type: e.target.value as ExecutionType })} className="w-full bg-[#0A0A0A] border border-zinc-800 rounded px-3 py-2 text-white font-bold">
                          <option value="NORMAL">Esecuzione Normale</option>
                          <option value="SUPERSET">Super Set / Jump Set</option>
                          <option value="REST_PAUSE">Rest-Pause</option>
                          <option value="DROP_SET">Drop Set / Scarico</option>
                          <option value="CLUSTER">Cluster Set</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Serie Target</label>
                        <input type="number" min={1} value={draft.sets} onChange={e => updateDayDraft(day.id, { sets: Number(e.target.value) })} className="w-full bg-[#0A0A0A] border border-zinc-800 rounded px-3 py-2 text-white" />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Reps Target</label>
                        <input type="text" value={draft.reps} onChange={e => updateDayDraft(day.id, { reps: e.target.value })} placeholder="Es. 8-10" className="w-full bg-[#0A0A0A] border border-zinc-800 rounded px-3 py-2 text-white" />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Carico Target (Kg)</label>
                        <input type="text" value={draft.weight} onChange={e => updateDayDraft(day.id, { weight: e.target.value })} placeholder="Es. 100" className="w-full bg-[#0A0A0A] border border-zinc-800 rounded px-3 py-2 text-white" />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">TUT (Esecuzione)</label>
                        <input type="text" value={draft.tut} onChange={e => updateDayDraft(day.id, { tut: e.target.value })} placeholder="Es. 3-0-1-0" className="w-full bg-[#0A0A0A] border border-zinc-800 rounded px-3 py-2 text-white font-mono" />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Recupero (Sec)</label>
                        <input type="number" value={draft.rest} onChange={e => updateDayDraft(day.id, { rest: Number(e.target.value) })} placeholder="90" className="w-full bg-[#0A0A0A] border border-zinc-800 rounded px-3 py-2 text-white" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Note Tecniche / Esecuzione</label>
                      <input type="text" value={draft.notes} onChange={e => updateDayDraft(day.id, { notes: e.target.value })} placeholder="Es. Fermo al petto 1s, focus sulla contrazione di picco" className="w-full bg-[#0A0A0A] border border-zinc-800 rounded px-3 py-2 text-white" />
                    </div>

                    <button type="submit" className="w-full bg-[#E50914] hover:bg-red-700 py-3 rounded font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                      <Plus className="w-5 h-5" /> Aggiungi esercizio a Giorno {day.dayNumber}
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 5: BADGE & TRAGUARDI */}
        {activeTab === 'leaderboard' && (
          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><Trophy className="text-yellow-500" /> Badge & Traguardi Personali</h2>
                <p className="text-xs text-zinc-400 mt-1">Sblocca trofei completando le sessioni e superando i tuoi record personali.</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-400">Progresso XP</div>
                <div className="text-lg font-black text-yellow-500">{userXp} / {userLevel * 500} XP</div>
              </div>
            </div>

            <div className="w-full bg-zinc-900 rounded-full h-3 border border-zinc-800 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${((userXp % 500) / 500) * 100}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${item.unlocked ? 'bg-zinc-900/80 border-yellow-500/40' : 'bg-zinc-950/40 border-zinc-850 opacity-50'}`}
                >
                  <div className={`text-3xl p-3 rounded-xl ${item.unlocked ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-zinc-900'}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-white text-base">{item.title}</h4>
                      {item.unlocked && <span className="text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-bold px-2 py-0.5 rounded uppercase">Sbloccato</span>}
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}