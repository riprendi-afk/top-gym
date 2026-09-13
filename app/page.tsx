'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveCompletedWorkoutToSupabase, getWorkoutHistoryFromSupabase } from '@/lib/store';
import {
  Trophy, Shield, Dumbbell, UserCheck,
  Timer, Plus, CheckCircle, Clock, TrendingUp, BarChart3,
  Zap, Award, Volume2, VolumeX, Lock, Unlock, Eye,
  AlertTriangle, Copy, Sparkles, Scale, LogOut, Medal,
  Moon, HeartPulse, Brain, BatteryCharging, Gauge, CalendarDays, Trash2, History, Settings, Key, UserX
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Inizializzazione sicura di Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

type DayCount = 2 | 3 | 4 | 5 | 6;
type UserRole = 'ATHLETE' | 'COACH';
type ExecutionType = 'REGULAR' | 'SUPERSET' | 'REST_PAUSE' | 'DROP_SET' | 'CLUSTER';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  targetWeight: string;
  rpeTarget: number;
  restSeconds: number;
  executionType: ExecutionType;
  tut: string;
  notes?: string;
}

interface WorkoutDay {
  id: string;
  dayNumber: number;
  title: string;
  exercises: Exercise[];
}

interface SetLog {
  id: string;
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  rpe: number;
  estimated1RM: number;
  volume: number;
  date: string;
  time: string;
}

interface ReadinessLog {
  id: string;
  date: string;
  sleepHours: number;
  sleepQuality: number;
  stressLevel: number;
  domsLevel: number;
  energyLevel: number;
  bodyWeight?: number;
  readinessScore: number;
  recommendation: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface Athlete {
  id: string;
  displayName: string;
  email: string;
  xp: number;
}

const todayIso = () => new Date().toISOString().split('T')[0];

export default function TopGymApp() {
  const router = useRouter();

  // Autenticazione Supabase
  const [user, setUser] = useState<any>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Stato Gestione Account
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  // Atleti per modalità Coach
  const [athletes, setAthletes] = useState<Athlete[]>([
    { id: 'ath-1', displayName: 'Marco Rossi', email: 'marco@topgym.it', xp: 340 },
    { id: 'ath-2', displayName: 'Giuseppe Di Girolamo', email: 'giuseppe@topgym.it', xp: 520 },
    { id: 'ath-3', displayName: 'Elena Bianchi', email: 'elena@topgym.it', xp: 180 },
  ]);
  const [activeAthleteId, setActiveAthleteId] = useState('ath-2');

  // Gestione Ruolo di Default: ATHLETE
  const [userRole, setUserRole] = useState<UserRole>('ATHLETE');
  const [showCoachPinModal, setShowCoachPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Navigation & XP State
  const [activeTab, setActiveTab] = useState<'workout' | 'readiness' | 'analytics' | 'builder' | 'leaderboard' | 'settings'>('workout');
  const [userXp, setUserXp] = useState(520);

  // Sound & Rest Timer
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Impostazione Giorni Builder
  const [selectedDayCount, setSelectedDayCount] = useState<DayCount>(4);

  // Readiness Inputs & Storico
  const [sleepHours, setSleepHours] = useState('7.5');
  const [sleepQuality, setSleepQuality] = useState(8);
  const [stressLevel, setStressLevel] = useState(3);
  const [domsLevel, setDomsLevel] = useState(2);
  const [energyLevel, setEnergyLevel] = useState(8);
  const [bodyWeight, setBodyWeight] = useState('78.5');
  const [readinessSuccessMessage, setReadinessSuccessMessage] = useState<string | null>(null);
  const [readinessHistory, setReadinessHistory] = useState<ReadinessLog[]>([
    {
      id: 'r1',
      date: todayIso(),
      sleepHours: 7.5,
      sleepQuality: 8,
      stressLevel: 3,
      domsLevel: 2,
      energyLevel: 8,
      bodyWeight: 78.5,
      readinessScore: 88,
      recommendation: 'Pronto per la massima intensità! Segui i carichi target e spingi al 100%.'
    }
  ]);

  // Programma Esercizi
  const [programName, setProgramName] = useState('Scheda Ipertrofia / Forza');
  const [programDays, setProgramDays] = useState<WorkoutDay[]>([
    {
      id: 'd1',
      dayNumber: 1,
      title: 'Spinta (Push)',
      exercises: [
        { id: 'ex1', name: 'Panca Piana Bilanciere', sets: 4, reps: '8', targetWeight: '90', rpeTarget: 8, restSeconds: 120, executionType: 'REGULAR', tut: '3-0-1-0', notes: 'Fermo al petto di 1 secondo' },
        { id: 'ex2', name: 'Spinte Inclinata Manubri', sets: 3, reps: '10', targetWeight: '32', rpeTarget: 8.5, restSeconds: 90, executionType: 'REST_PAUSE', tut: '2-0-1-0', notes: '20s rest pause all ultima serie' }
      ]
    },
    {
      id: 'd2',
      dayNumber: 2,
      title: 'Trazione (Pull)',
      exercises: [
        { id: 'ex3', name: 'Trazioni Zavorrate', sets: 4, reps: '6', targetWeight: '15', rpeTarget: 8, restSeconds: 120, executionType: 'REGULAR', tut: '2-0-1-0', notes: 'Estensione completa dei gomiti' },
        { id: 'ex4', name: 'Rematore Bilanciere', sets: 3, reps: '8', targetWeight: '75', rpeTarget: 8, restSeconds: 90, executionType: 'REGULAR', tut: '2-0-1-0', notes: 'Schiena a 45 gradi costante' }
      ]
    },
    {
      id: 'd3',
      dayNumber: 3,
      title: 'Gambe (Legs)',
      exercises: [
        { id: 'ex5', name: 'Squat Bilanciere', sets: 4, reps: '6', targetWeight: '110', rpeTarget: 8.5, restSeconds: 150, executionType: 'REGULAR', tut: '3-0-1-0', notes: 'Buca il parallelo' }
      ]
    },
    {
      id: 'd4',
      dayNumber: 4,
      title: 'Spalle & Braccia',
      exercises: [
        { id: 'ex6', name: 'Military Press', sets: 4, reps: '8', targetWeight: '50', rpeTarget: 8, restSeconds: 120, executionType: 'REGULAR', tut: '2-0-1-0', notes: 'Core ben contratto' }
      ]
    }
  ]);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [currentExId, setCurrentExId] = useState('ex1');

  // Form Inserimento Serie (Atleta)
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('8');
  const [logs, setLogs] = useState<SetLog[]>([
    { id: 'l1', exerciseId: 'ex1', exerciseName: 'Panca Piana Bilanciere', weight: 90, reps: 8, rpe: 8, estimated1RM: 114, volume: 720, date: todayIso(), time: '10:15' }
  ]);

  // Form Builder Coach
  const [builderExName, setBuilderExName] = useState('');
  const [builderSets, setBuilderSets] = useState(3);
  const [builderReps, setBuilderReps] = useState('8-10');
  const [builderWeight, setBuilderWeight] = useState('60');
  const [builderRpe, setBuilderRpe] = useState(8);
  const [builderRest, setBuilderRest] = useState(90);
  const [builderType, setBuilderType] = useState<ExecutionType>('REGULAR');
  const [builderTut, setBuilderTut] = useState('2-0-1-0');
  const [builderNotes, setBuilderNotes] = useState('');

  // Sincronizzazione dell'utente attivo nell'elenco degli atleti
  const syncUserToAthletes = (authUser: any) => {
    if (!authUser) return;
    const name = authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'Nuovo Atleta';
    setAthletes(prev => {
      const exists = prev.some(a => a.id === authUser.id || a.email === authUser.email);
      if (!exists) {
        return [...prev, { id: authUser.id, displayName: name, email: authUser.email, xp: 0 }];
      }
      return prev;
    });
  };

  // Controllo Auth con Supabase
  useEffect(() => {
    if (!supabase) return;
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) syncUserToAthletes(currentUser);
    };
    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) syncUserToAthletes(currentUser);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Gestione Login / Registrazione Supabase
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setErrorMessage('');

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username: username || email.split('@')[0] } }
      });
      if (error) setErrorMessage(error.message);
      else alert('Registrazione completata! Ora puoi accedere.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorMessage(error.message);
    }
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  };

  // Recupero Password via Email
  const handlePasswordReset = async () => {
    if (!user?.email || !supabase) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: window.location.origin
    });
    if (error) {
      setSettingsMessage(`⚠️ Errore: ${error.message}`);
    } else {
      setSettingsMessage('📩 Email per il recupero password inviata con successo! Controlla la tua casella di posta.');
    }
  };

  // Cancellazione Account Utente
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Sei sicuro di voler eliminare il tuo account? Questa azione non può essere annullata.');
    if (!confirmDelete || !supabase) return;

    try {
      const { error } = await supabase.rpc('delete_user');
      if (error) {
        setSettingsMessage(`⚠️ Impossibile eliminare l'account automaticamente. Contatta l'amministratore: ${error.message}`);
      } else {
        alert('Account eliminato con successo.');
        await handleLogout();
      }
    } catch (e: any) {
      await handleLogout();
    }
  };

  // Sound & Rest Timer
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
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    } catch (e) {
      console.log('Audio non abilitato');
    }
  };

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

  // Switch Ruolo Coach con PIN
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
      if (activeTab === 'workout') setActiveTab('builder');
    } else {
      setPinError(true);
    }
  };

  const calculate1RM = (w: number, r: number) => {
    if (r === 1) return w;
    return Math.round(w * (1 + r / 30));
  };

  const activeAthlete = athletes.find(a => a.id === activeAthleteId) || athletes[1];
  const activeDay = programDays[selectedDayIndex] ?? programDays[0];
  const activeRoutine = activeDay?.exercises ?? [];
  const currentExercise = activeRoutine.find(e => e.id === currentExId) || activeRoutine[0];

  const exerciseHistory = currentExercise ? logs.filter(l => l.exerciseName === currentExercise.name) : [];
  const lastLoggedSet = exerciseHistory[0];

  const handleAutoFillLastLog = () => {
    if (lastLoggedSet) {
      setWeight(lastLoggedSet.weight.toString());
      setReps(lastLoggedSet.reps.toString());
      setRpe(lastLoggedSet.rpe.toString());
    }
  };

  const computeReadiness = () => {
    const sleepFactor = (sleepQuality * 10) * 0.35;
    const energyFactor = (energyLevel * 10) * 0.30;
    const stressFactor = ((11 - stressLevel) * 10) * 0.20;
    const domsFactor = ((11 - domsLevel) * 10) * 0.15;
    const totalScore = Math.round(sleepFactor + energyFactor + stressFactor + domsFactor);

    let rec = '';
    if (totalScore >= 80) rec = 'Pronto per la massima intensità! Segui i carichi target e spingi al 100%.';
    else if (totalScore >= 60) rec = 'Stato discreto. Allenamento regolare, ma mantieni 1 rep di margine.';
    else rec = 'Fatica/Stress elevati. Consigliato scarico attivo o riduzione carichi/volume del 15-20%.';

    return { totalScore, rec };
  };

  const handleSaveReadiness = (e: React.FormEvent) => {
    e.preventDefault();
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
    setReadinessHistory([newReadiness, ...readinessHistory]);
    setUserXp(prev => prev + 20);
    setReadinessSuccessMessage('🎉 Check Readiness registrato con successo! (+20 XP)');
    setTimeout(() => setReadinessSuccessMessage(null), 4000);
  };

  // Gestione Giorni 2-6 nel Builder Coach
  const handleDayCountChange = (count: DayCount) => {
    setSelectedDayCount(count);
    setProgramDays(prev => {
      if (prev.length < count) {
        const newDays = [...prev];
        for (let i = prev.length + 1; i <= count; i++) {
          newDays.push({
            id: `d${i}`,
            dayNumber: i,
            title: `Giorno ${i}`,
            exercises: []
          });
        }
        return newDays;
      } else {
        return prev.slice(0, count);
      }
    });
  };

  const [workoutSuccessMessage, setWorkoutSuccessMessage] = useState<string | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);

  const loadHistory = async () => {
    const data = await getWorkoutHistoryFromSupabase('default-user');
    setWorkoutHistory(data || []);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleFinishAndSaveWorkout = async () => {
    const dayName = activeDay ? activeDay.title : 'Giornata di Allenamento';
    const totalVol = todayLogs.reduce((acc, curr) => acc + curr.volume, 0) || 12000;

    const result = await saveCompletedWorkoutToSupabase({
      userId: 'default-user',
      dayName: dayName,
      totalVolume: totalVol,
      exercisesCount: activeRoutine.length,
    });

    if (result.success) {
      setUserXp(prev => prev + 50);
      setWorkoutSuccessMessage('🎉 Allenamento completato e salvato! +50 XP');
      await loadHistory();
      setTimeout(() => setWorkoutSuccessMessage(null), 4000);
    } else {
      setWorkoutSuccessMessage('⚠️ Errore nel salvataggio dell\'allenamento.');
      setTimeout(() => setWorkoutSuccessMessage(null), 4000);
    }
  };

  const handleLogSet = (e: React.FormEvent) => {
    e.preventDefault();
    const numWeight = parseFloat(weight);
    const numReps = parseInt(reps, 10);
    const numRpe = parseFloat(rpe);
    if (!numWeight || !numReps) return;
    const est1RM = calculate1RM(numWeight, numReps);
    const setVolume = numWeight * numReps;

    const newLog: SetLog = {
      id: crypto.randomUUID(),
      exerciseId: currentExId,
      exerciseName: currentExercise?.name || 'Esercizio',
      weight: numWeight,
      reps: numReps,
      rpe: numRpe,
      estimated1RM: est1RM,
      volume: setVolume,
      date: todayIso(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setLogs([newLog, ...logs]);
    setUserXp(prev => prev + 10);

    if (currentExercise?.restSeconds) {
      startRestTimer(currentExercise.restSeconds);
    }
    setWeight('');
    setReps('');
  };

  const handleAddExerciseToDay = (e: React.FormEvent, dayId: string) => {
    e.preventDefault();
    if (!builderExName.trim()) return;

    const newEx: Exercise = {
      id: crypto.randomUUID(),
      name: builderExName.trim(),
      sets: builderSets,
      reps: builderReps,
      targetWeight: builderWeight,
      rpeTarget: builderRpe,
      restSeconds: builderRest,
      executionType: builderType,
      tut: builderTut,
      notes: builderNotes.trim() || undefined
    };

    setProgramDays(prev => prev.map(day => day.id === dayId ? { ...day, exercises: [...day.exercises, newEx] } : day));
    setBuilderExName('');
    setBuilderNotes('');
  };

  const handleRemoveExerciseFromDay = (dayId: string, exerciseId: string) => {
    setProgramDays(prev => prev.map(day => day.id === dayId ? { ...day, exercises: day.exercises.filter(ex => ex.id !== exerciseId) } : day));
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

  const userLevel = Math.floor(userXp / 100) + 1;
  const todayLogs = logs.filter(l => l.date === todayIso());
  const latestReadiness = readinessHistory[0];

  const recentRpeLogs = logs.slice(0, 4);
  const highFatigueDetected = recentRpeLogs.length >= 2 && recentRpeLogs.every(l => l.rpe >= 9.5);

  const achievements: Achievement[] = [
    { id: '1', title: 'Club dei 100kg', description: 'Solleva 100kg o più in un esercizio', icon: '🏋️', unlocked: logs.some(l => l.weight >= 100) },
    { id: '2', title: 'PR Breaker', description: 'Supera il tuo massimale stimato', icon: '🔥', unlocked: logs.length >= 3 },
    { id: '3', title: 'Atleta Consapevole', description: 'Registra Check di Readiness', icon: '🧠', unlocked: readinessHistory.length >= 1 },
    { id: '4', title: 'Costanza d\'Acciaio', description: 'Accumula oltre 500 XP', icon: '⚡', unlocked: userXp >= 500 }
  ];

  // Nome Utente Dinamico
  const displayUserName = user?.user_metadata?.username || (user?.email ? user.email.split('@')[0] : 'Atleta');

  // --- SCHERMATA LOGIN / REGISTRAZIONE ---
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-white font-sans">
        <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
          <h1 className="mb-2 text-center text-3xl font-black uppercase tracking-wider text-[#E50914] flex items-center justify-center gap-2">
            <Dumbbell className="w-8 h-8"/> TOP GYM
          </h1>
          <p className="text-xs text-center text-zinc-400 mb-6">PWA Gestione Allenamenti & Coaching</p>

          {errorMessage && (
            <div className="mb-4 rounded bg-red-950/60 p-3 text-xs text-red-200 border border-red-800">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="mb-1 block text-xs uppercase font-semibold text-zinc-400">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded bg-zinc-800 p-2.5 text-white border border-zinc-700 outline-none focus:border-[#E50914]"
                  placeholder="Nome Atleta"
                />
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs uppercase font-semibold text-zinc-400">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded bg-zinc-800 p-2.5 text-white border border-zinc-700 outline-none focus:border-[#E50914]"
                placeholder="atleta@topgym.it"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase font-semibold text-zinc-400">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded bg-zinc-800 p-2.5 text-white border border-zinc-700 outline-none focus:border-[#E50914]"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded bg-[#E50914] py-3 font-bold uppercase text-white hover:bg-red-700 transition tracking-wider"
            >
              {isSignUp ? 'Crea Account' : 'Accedi al Dashboard'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-400">
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setErrorMessage(''); }}
              className="font-semibold text-[#E50914] hover:underline"
            >
              {isSignUp ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD PRINCIPALE ---
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans p-4 md:p-8">
      {/* HEADER UTENTE */}
      <header className="max-w-5xl mx-auto bg-[#1E1E1E] rounded-xl p-6 border border-zinc-800 shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-wider text-[#E50914] flex items-center gap-2">
              <Dumbbell className="w-8 h-8" /> TOP GYM
            </h1>
            <p className="text-sm text-zinc-300 mt-1 font-bold">Utente: <span className="text-[#E50914]">{displayUserName}</span></p>

            <div className="flex items-center gap-3 mt-3 flex-wrap">
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
                    onChange={e => setActiveAthleteId(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-white text-xs rounded px-2.5 py-1 font-bold outline-none"
                  >
                    {athletes.map(ath => (
                      <option key={ath.id} value={ath.id}>{ath.displayName}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Audio Attivo' : 'Audio Disattivato'}
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

            {latestReadiness && (
              <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800">
                <Gauge className={`w-5 h-5 ${latestReadiness.readinessScore >= 80 ? 'text-green-400' : 'text-yellow-400'}`} />
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
                <div className="text-sm font-bold text-yellow-500">{userXp} XP</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg"
            >
              <LogOut className="w-4 h-4 text-red-500"/> Esci
            </button>
          </div>
        </div>
      </header>

      {/* MODALE PIN COACH */}
      {showCoachPinModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2">
              <Lock className="text-[#E50914]" /> Area Riservata Coach
            </h3>
            <p className="text-xs text-zinc-400 mb-4">Inserisci il PIN per accedere alla gestione schede (Demo PIN: 1234).</p>

            <form onSubmit={verifyCoachPin} className="space-y-4">
              <input
                type="password"
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                placeholder="PIN (Es. 1234)"
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-2.5 text-center text-lg font-mono text-white outline-none focus:border-[#E50914]"
                autoFocus
              />
              {pinError && <p className="text-xs text-[#E50914] text-center font-bold">PIN Errato!</p>}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCoachPinModal(false)}
                  className="w-1/2 bg-zinc-800 py-2 rounded text-xs font-bold text-zinc-300"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#E50914] py-2 rounded text-xs font-bold text-white uppercase"
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
        {userRole === 'ATHLETE' && (
          <button onClick={() => setActiveTab('workout')} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'workout' ? 'bg-[#E50914] text-white' : 'bg-[#1E1E1E] text-zinc-400 hover:text-white'}`}>Esegui Allenamento</button>
        )}
        <button onClick={() => setActiveTab('readiness')} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'readiness' ? 'bg-[#E50914] text-white' : 'bg-[#1E1E1E] text-zinc-400 hover:text-white'}`}><Gauge className="w-4 h-4 text-green-400" /> Check Readiness</button>
        <button onClick={() => setActiveTab('analytics')} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-[#E50914] text-white' : 'bg-[#1E1E1E] text-zinc-400 hover:text-white'}`}><TrendingUp className="w-4 h-4" /> Progressi</button>

        {userRole === 'COACH' && (
          <button onClick={() => setActiveTab('builder')} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-1.5 ${activeTab === 'builder' ? 'bg-[#E50914] text-white' : 'bg-[#1E1E1E] text-zinc-400 hover:text-white'}`}>
            <UserCheck className="w-4 h-4" /> Gestisci Scheda (Coach)
          </button>
        )}

        <button onClick={() => setActiveTab('leaderboard')} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'leaderboard' ? 'bg-[#E50914] text-white' : 'bg-[#1E1E1E] text-zinc-400 hover:text-white'}`}><Trophy className="w-4 h-4 text-yellow-500" /> Classifica & Badge</button>

        {/* TAB IMPOSTAZIONI ACCOUNT PER ATLETA */}
        {userRole === 'ATHLETE' && (
          <button onClick={() => setActiveTab('settings')} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-[#E50914] text-white' : 'bg-[#1E1E1E] text-zinc-400 hover:text-white'}`}><Settings className="w-4 h-4 text-zinc-300" /> Impostazioni</button>
        )}
      </div>

      {/* CONTENUTO PRINCIPALE */}
      <main className="max-w-5xl mx-auto">
        {/* TAB 1: ESEGUI ALLENAMENTO (ACCESSIBILE SOLO PER ATLETA) */}
        {activeTab === 'workout' && userRole === 'ATHLETE' && (
          <div className="space-y-6">
            {highFatigueDetected && (
              <div className="bg-amber-950/40 border border-amber-600/60 p-4 rounded-xl flex items-start gap-3 text-amber-300">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-amber-200">Livello di Fatica Accumulata Elevato!</h4>
                  <p className="text-xs text-amber-300/80 mt-1">
                    Hai registrato serie consecutive ad RPE 9.5+. Considera di estendere il recupero di 30s.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <h2 className="text-xl font-bold flex items-center gap-2"><Dumbbell className="text-[#E50914]" /> Scheda: {programName}</h2>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {programDays.map((day, index) => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => { setSelectedDayIndex(index); if (day.exercises[0]) setCurrentExId(day.exercises[0].id); }}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${selectedDayIndex === index ? 'bg-[#E50914] border-[#E50914] text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                  >
                    Giorno {day.dayNumber} · {day.title}
                  </button>
                ))}
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {activeRoutine.map((ex) => (
                  <div
                    key={ex.id}
                    onClick={() => setCurrentExId(ex.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${currentExId === ex.id ? 'bg-red-950/20 border-[#E50914]' : 'bg-zinc-900 border-zinc-800'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-lg text-white">{ex.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getBadgeStyle(ex.executionType)}`}>
                        {ex.executionType}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs text-zinc-400 mt-2 border-t border-zinc-800/60 pt-2">
                      <div>Serie/Reps: <b className="text-white">{ex.sets} × {ex.reps}</b></div>
                      <div>Target: <b className="text-white">{ex.targetWeight} Kg</b></div>
                      <div>TUT: <b className="text-yellow-500 font-mono">{ex.tut}</b></div>
                    </div>
                    {ex.notes && (
                      <div className="text-[11px] text-zinc-400 italic mt-2 border-t border-zinc-800/40 pt-1">
                        Note: {ex.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {currentExercise && (
              <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
                <div className="mb-4 pb-4 border-b border-zinc-800 flex justify-between items-end">
                  <div>
                    <h3 className="text-2xl font-black text-white">{currentExercise.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1">Target: {currentExercise.sets} Serie × {currentExercise.reps} Reps @ {currentExercise.targetWeight} Kg (RPE {currentExercise.rpeTarget})</p>
                  </div>

                  {weight && reps && (
                    <div className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg text-right">
                      <div className="text-[10px] text-zinc-400 uppercase font-bold">1RM Stimato</div>
                      <div className="text-lg font-black text-[#E50914]">{calculate1RM(parseFloat(weight), parseInt(reps, 10))} Kg</div>
                    </div>
                  )}
                </div>

                {lastLoggedSet && (
                  <div className="mb-4 bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 flex items-center justify-between flex-wrap gap-2">
                    <div className="text-xs text-zinc-400">
                      Ultimo Carico: <b className="text-white">{lastLoggedSet.weight} kg × {lastLoggedSet.reps} reps</b> (RPE {lastLoggedSet.rpe})
                    </div>
                    <button type="button" onClick={handleAutoFillLastLog} className="text-xs text-[#E50914] font-bold flex items-center gap-1">
                      <Copy className="w-3.5 h-3.5"/> Copia Ultimo Carico
                    </button>
                  </div>
                )}

                <form onSubmit={handleLogSet} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1">Carico (Kg)</label>
                      <input type="number" step="0.5" required value={weight} onChange={e => setWeight(e.target.value)} placeholder="80" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1">Reps</label>
                      <input type="number" required value={reps} onChange={e => setReps(e.target.value)} placeholder="8" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1">RPE</label>
                      <select value={rpe} onChange={e => setRpe(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold">
                        {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(val => (<option key={val} value={val}>{val}</option>))}
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-[#E50914] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 uppercase">
                    <Plus className="w-5 h-5"/> Registra Serie (+10 XP)
                  </button>
                </form>

                <div className="mt-6">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Serie Registrate Oggi</h4>
                  <div className="space-y-2">
                    {todayLogs.map((log, i) => (
                      <div key={log.id} className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 flex justify-between items-center text-xs">
                        <span className="font-bold text-zinc-400">Set {i + 1} ({log.exerciseName})</span>
                        <span className="text-white font-bold">{log.weight} Kg × {log.reps} reps</span>
                        <span className="text-zinc-400">RPE: {log.rpe}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PULSANTE TERMINA E SALVA ALLENAMENTO */}
            <div className="mt-8 pt-6 border-t border-zinc-800 space-y-4">
              {workoutSuccessMessage && (
                <div className="bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl text-center font-bold text-sm">
                  {workoutSuccessMessage}
                </div>
              )}

              <button
                onClick={handleFinishAndSaveWorkout}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black py-4 rounded-xl uppercase tracking-wider shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <span>✅ Termina e Salva Allenamento</span>
              </button>
            </div>

            {/* SEZIONE STORICO SCHEDE E ALLENAMENTI SALVATI */}
            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800 mt-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <History className="text-[#E50914]" /> Storico Allenamenti Completati
              </h3>
              {workoutHistory.length === 0 ? (
                <p className="text-xs text-zinc-400">Nessun allenamento ancora salvato nel database.</p>
              ) : (
                <div className="space-y-2">
                  {workoutHistory.map((item, idx) => (
                    <div key={item.id || idx} className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white block">{item.day_name || item.dayName || 'Allenamento'}</span>
                        <span className="text-zinc-400 text-[11px] font-mono">
                          Data: <b className="text-white">{item.created_at ? new Date(item.created_at).toLocaleDateString('it-IT') : (item.date || todayIso())}</b>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-400 block">{item.total_volume || item.totalVolume || 0} kg tot.</span>
                        <span className="text-zinc-400 text-[10px]">{item.exercises_count || item.exercisesCount || 0} esercizi</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CHECK READINESS */}
        {activeTab === 'readiness' && (
          <div className="space-y-6">
            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800 space-y-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><Gauge className="text-green-400"/> Check-in Giornaliero dello Stato di Forma</h2>
                <p className="text-xs text-zinc-400 mt-1">Valuta le tue variabili biologiche per calcolare il punteggio di recupero e ricevere indicazioni sul volume o intensità.</p>
              </div>

              {readinessSuccessMessage && (
                <div className="bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg text-center font-bold text-xs">
                  {readinessSuccessMessage}
                </div>
              )}

              {/* COMPILAZIONE CHECK READINESS (SOLO PER ATLETA) */}
              {userRole === 'ATHLETE' && (
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
                        <span className="text-zinc-400 flex items-center gap-1.5"><Dumbbell className="w-4 h-4 text-red-400"/> Fatica Muscolare / DOMS (1 = Nessun dolore, 10 = Dolore estremo)</span>
                        <span className="text-red-400 font-mono">{domsLevel} / 10</span>
                      </div>
                      <input type="range" min="1" max="10" value={domsLevel} onChange={e => setDomsLevel(Number(e.target.value))} className="w-full accent-[#E50914]" />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-zinc-400 flex items-center gap-1.5"><BatteryCharging className="w-4 h-4 text-green-400"/> Energia / Motivazione</span>
                        <span className="text-green-400 font-mono">{energyLevel} / 10</span>
                      </div>
                      <input type="range" min="1" max="10" value={energyLevel} onChange={e => setEnergyLevel(Number(e.target.value))} className="w-full accent-[#E50914]" />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-zinc-400 flex items-center gap-1.5"><Brain className="w-4 h-4 text-purple-400"/> Stress Percepito</span>
                        <span className="text-purple-400 font-mono">{stressLevel} / 10</span>
                      </div>
                      <input type="range" min="1" max="10" value={stressLevel} onChange={e => setStressLevel(Number(e.target.value))} className="w-full accent-[#E50914]" />
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-400 uppercase font-bold">Score Stimato ({todayIso()}):</span>
                      <span className="text-lg font-black text-[#E50914]">{computeReadiness().totalScore}%</span>
                    </div>
                    <p className="text-xs text-zinc-300 font-medium">
                      <b>Consigliato:</b> {computeReadiness().rec}
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#E50914] hover:bg-red-700 text-white font-bold py-3 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Gauge className="w-5 h-5"/> Salva Check Readiness (+20 XP)
                  </button>
                </form>
              )}
            </div>

            {/* STORICO CHECK READINESS GIORNO PER GIORNO */}
            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <History className="text-green-400" /> Storico Check Readiness ({userRole === 'COACH' ? activeAthlete.displayName : displayUserName})
              </h3>
              {readinessHistory.length === 0 ? (
                <p className="text-xs text-zinc-400">Nessun check readiness ancora registrato.</p>
              ) : (
                <div className="space-y-3">
                  {readinessHistory.map((item) => (
                    <div key={item.id} className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 space-y-2 text-xs">
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <CalendarDays className="w-4 h-4 text-zinc-400" /> Data: {item.date}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded font-black text-sm ${item.readinessScore >= 80 ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-yellow-950 text-yellow-400 border border-yellow-800'}`}>
                          Score: {item.readinessScore}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-zinc-400 pt-1">
                        <div>Sonno: <b className="text-white">{item.sleepHours}h ({item.sleepQuality}/10)</b></div>
                        <div>Peso: <b className="text-white">{item.bodyWeight ? `${item.bodyWeight} kg` : 'N/D'}</b></div>
                        <div>DOMS: <b className="text-white">{item.domsLevel}/10</b></div>
                        <div>Energia: <b className="text-white">{item.energyLevel}/10</b></div>
                      </div>
                      <p className="text-[11px] text-zinc-300 italic pt-1 border-t border-zinc-800/40">
                        Indicazione: {item.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* VISTA COACH: STORICO ALLENAMENTI INTEGRATO */}
            {userRole === 'COACH' && (
              <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <History className="text-[#E50914]" /> Storico Allenamenti Atleta ({activeAthlete.displayName})
                </h3>
                {workoutHistory.length === 0 ? (
                  <p className="text-xs text-zinc-400">Nessun allenamento registrato per questo atleta.</p>
                ) : (
                  <div className="space-y-2">
                    {workoutHistory.map((item, idx) => (
                      <div key={item.id || idx} className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-white block">{item.day_name || item.dayName || 'Allenamento'}</span>
                          <span className="text-zinc-400 text-[11px] font-mono">
                            Data: <b className="text-white">{item.created_at ? new Date(item.created_at).toLocaleDateString('it-IT') : (item.date || todayIso())}</b>
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-400 block">{item.total_volume || item.totalVolume || 0} kg tot.</span>
                          <span className="text-zinc-400 text-[10px]">{item.exercises_count || item.exercisesCount || 0} esercizi</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BUILDER COACH */}
        {activeTab === 'builder' && userRole === 'COACH' && (
          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800 space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 border-b border-zinc-800">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><UserCheck className="text-[#E50914]"/> Area Coach / Gestione Programma ({activeAthlete.displayName})</h2>
                <p className="text-xs text-zinc-400 mt-1">Imposta la frequenza settimanale e componi gli esercizi per ciascuna giornata.</p>
              </div>

              {/* SELETTORE GIORNI 2-3-4-5-6 */}
              <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                <span className="text-xs font-bold text-zinc-400">Giorni/settimana:</span>
                <div className="flex gap-1">
                  {([2, 3, 4, 5, 6] as DayCount[]).map((num) => (
                    <button
                      key={num}
                      onClick={() => handleDayCountChange(num)}
                      className={`px-2.5 py-1 text-xs font-black rounded border transition-all ${
                        selectedDayCount === num
                          ? 'bg-[#E50914] border-[#E50914] text-white'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {programDays.map((day) => (
              <div key={day.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white">Giorno {day.dayNumber}: {day.title}</h3>
                  <span className="text-xs text-zinc-500 font-mono">{day.exercises.length} esercizi</span>
                </div>

                <div className="space-y-2">
                  {day.exercises.map((ex) => (
                    <div key={ex.id} className="bg-[#1E1E1E] p-3 rounded-lg border border-zinc-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{ex.name}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${getBadgeStyle(ex.executionType)}`}>
                            {ex.executionType}
                          </span>
                        </div>
                        <div className="text-zinc-400 mt-0.5">{ex.sets} × {ex.reps} @ {ex.targetWeight} kg | RPE: {ex.rpeTarget} | Rec: {ex.restSeconds}s | TUT: {ex.tut}</div>
                        {ex.notes && <div className="text-[10px] text-zinc-500 italic mt-0.5">Note: {ex.notes}</div>}
                      </div>
                      <button onClick={() => handleRemoveExerciseFromDay(day.id, ex.id)} className="text-red-500 hover:text-red-400 p-1">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={e => handleAddExerciseToDay(e, day.id)} className="space-y-3 pt-2 border-t border-zinc-800/80">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <input type="text" placeholder="Nome Esercizio" value={builderExName} onChange={e => setBuilderExName(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white" />
                    <input type="number" placeholder="Serie" value={builderSets} onChange={e => setBuilderSets(Number(e.target.value))} className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white" />
                    <input type="text" placeholder="Reps (es. 8-10)" value={builderReps} onChange={e => setBuilderReps(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white" />
                    <input type="text" placeholder="Carico Target (kg)" value={builderWeight} onChange={e => setBuilderWeight(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <select value={builderType} onChange={e => setBuilderType(e.target.value as ExecutionType)} className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs text-white">
                      <option value="REGULAR">Tecnica: REGULAR</option>
                      <option value="SUPERSET">Tecnica: SUPERSET</option>
                      <option value="REST_PAUSE">Tecnica: REST_PAUSE</option>
                      <option value="DROP_SET">Tecnica: DROP_SET</option>
                      <option value="CLUSTER">Tecnica: CLUSTER</option>
                    </select>

                    <input type="text" placeholder="TUT (es. 2-0-1-0)" value={builderTut} onChange={e => setBuilderTut(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white" />
                    <input type="number" placeholder="Recupero (sec)" value={builderRest} onChange={e => setBuilderRest(Number(e.target.value))} className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white" />
                    <input type="number" step="0.5" placeholder="RPE Target" value={builderRpe} onChange={e => setBuilderRpe(Number(e.target.value))} className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white" />
                  </div>

                  <div className="flex gap-2">
                    <input type="text" placeholder="Note del Coach (opzionale)" value={builderNotes} onChange={e => setBuilderNotes(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white" />
                    <button type="submit" className="bg-[#E50914] text-xs font-bold px-4 py-1.5 rounded text-white hover:bg-red-700 transition flex-shrink-0">Aggiungi</button>
                  </div>
                </form>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: PROGRESSI */}
        {activeTab === 'analytics' && (
          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><BarChart3 className="text-[#E50914]"/> Analisi Volume & Progressi</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-bold">Volume Oggi</div>
                <div className="text-xl font-black text-white mt-1">{todayLogs.reduce((acc, curr) => acc + curr.volume, 0)} kg</div>
              </div>
              <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                <div className="text-[10px] text-zinc-400 uppercase font-bold">Serie Totali</div>
                <div className="text-xl font-black text-white mt-1">{todayLogs.length}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LEADERBOARD & BADGE */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-500"/> Classifica Palestra
              </h2>
              <div className="space-y-2">
                {athletes
                  .map(ath => ({
                    ...ath,
                    displayName: (ath.id === user?.id || ath.email === user?.email) ? displayUserName : ath.displayName,
                    currentXp: (ath.id === user?.id || ath.email === user?.email) ? userXp : ath.xp
                  }))
                  .sort((a, b) => b.currentXp - a.currentXp)
                  .map((ath, index) => (
                    <div key={ath.id} className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-zinc-500">#{index + 1}</span>
                        <span className="font-bold text-white">{ath.displayName}</span>
                      </div>
                      <span className="font-black text-yellow-500">{ath.currentXp} XP</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Medal className="text-yellow-500"/> Trofei & Traguardi
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {achievements.map(ach => (
                  <div key={ach.id} className={`p-4 rounded-lg border flex items-center gap-3 ${ach.unlocked ? 'bg-zinc-900 border-yellow-600/50' : 'bg-zinc-900/40 border-zinc-800 opacity-50'}`}>
                    <span className="text-2xl">{ach.icon}</span>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        {ach.title}
                        {ach.unlocked && <CheckCircle className="w-3.5 h-3.5 text-green-400"/>}
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: IMPOSTAZIONI ACCOUNT (SOLO PER ATLETA) */}
        {activeTab === 'settings' && userRole === 'ATHLETE' && (
          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800 space-y-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-white"><Settings className="text-[#E50914]"/> Impostazioni Account</h2>
              <p className="text-xs text-zinc-400 mt-1">Gestisci le credenziali del tuo profilo atleta e le opzioni di sicurezza.</p>
            </div>

            {settingsMessage && (
              <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg text-xs font-bold text-zinc-200">
                {settingsMessage}
              </div>
            )}

            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><Key className="w-4 h-4 text-yellow-500"/> Password e Sicurezza</h3>
              <p className="text-xs text-zinc-400">Invia un link alla tua email (<b className="text-white">{user?.email}</b>) per cambiare o reimpostare la tua password.</p>
              <button
                type="button"
                onClick={handlePasswordReset}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-4 py-2 rounded-lg border border-zinc-700 transition flex items-center gap-2 cursor-pointer"
              >
                Invia Email Recupero Password
              </button>
            </div>

            <div className="bg-red-950/20 p-4 rounded-xl border border-red-900/50 space-y-3">
              <h3 className="text-sm font-bold text-red-400 flex items-center gap-2"><UserX className="w-4 h-4 text-red-500"/> Zona Pericolo: Cancellazione Account</h3>
              <p className="text-xs text-zinc-400">Rimuovi definitivamente il tuo profilo Atleta e i dati di avanzamento registrati dal database.</p>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer"
              >
                Cancella Definitivamente Account
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}