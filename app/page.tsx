'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  saveCompletedWorkoutToSupabase, 
  getWorkoutHistoryFromSupabase, 
  deleteWorkoutHistoryFromSupabase,
  saveProgramToSupabase,
  getProgramFromSupabase 
} from '@/lib/store';
import {
  Trophy, Shield, Dumbbell, UserCheck,
  Timer, Plus, CheckCircle, TrendingUp, BarChart3,
  Volume2, VolumeX, Lock, Unlock, Eye,
  AlertTriangle, Copy, Sparkles, Scale, LogOut, Medal,
  Moon, Brain, BatteryCharging, Gauge, CalendarDays, Trash2, History, Settings, Key, UserX, ChevronDown, ChevronUp, Pencil
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Inizializzazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

type DayCount = 2 | 3 | 4 | 5 | 6;
type UserRole = 'ATHLETE' | 'COACH';
type ExecutionType = 'REGULAR' | 'SUPERSET' | 'REST_PAUSE' | 'DROP_SET' | 'CLUSTER';

export type MuscleGroup = 
  | 'Petto' 
  | 'Dorso' 
  | 'Spalle' 
  | 'Quadricipiti' 
  | 'Femorali' 
  | 'Glutei' 
  | 'Bicipiti' 
  | 'Tricipiti' 
  | 'Polpacci' 
  | 'Addome';

export const autoDetectMuscleGroup = (exerciseName: string): MuscleGroup => {
  const name = exerciseName.toLowerCase().trim();
  if (name.includes('panca') || name.includes('chest') || name.includes('croci') || name.includes('dip') || name.includes('push up') || name.includes('piegament') || name.includes('pectoral') || name.includes('spinte') || name.includes('fly')) return 'Petto';
  if (name.includes('trazioni') || name.includes('lat') || name.includes('rematore') || name.includes('pulley') || name.includes('stacco') || name.includes('pull down') || name.includes('chin up') || name.includes('row')) return 'Dorso';
  if (name.includes('shoulder') || name.includes('military') || name.includes('lento') || name.includes('alzate') || name.includes('deltoid') || name.includes('arnold') || name.includes('press spalle') || name.includes('shrug')) return 'Spalle';
  if (name.includes('squat') || name.includes('pressa') || name.includes('leg ext') || name.includes('affondi') || name.includes('lunge') || name.includes('hack') || name.includes('quadricipit')) return 'Quadricipiti';
  if (name.includes('leg curl') || name.includes('stacco rumeno') || name.includes('rdl') || name.includes('femorale') || name.includes('hamstring')) return 'Femorali';
  if (name.includes('hip thrust') || name.includes('glute') || name.includes('abductor') || name.includes('bridge')) return 'Glutei';
  if (name.includes('curl') || name.includes('bicipit') || name.includes('biceps') || name.includes('hammer') || name.includes('scott')) return 'Bicipiti';
  if (name.includes('pushdown') || name.includes('french') || name.includes('tricipit') || name.includes('triceps') || name.includes('skull crusher')) return 'Tricipiti';
  if (name.includes('polpacc') || name.includes('calf') || name.includes('calves')) return 'Polpacci';
  if (name.includes('crunch') || name.includes('plank') || name.includes('addominal') || name.includes('core') || name.includes('leg raise') || name.includes('sit up')) return 'Addome';
  return 'Petto';
};

export interface Exercise {
  id: string;
  name: string;
  muscleGroup?: MuscleGroup;
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

const todayIso = () => {
  // Data locale (evita lo sfasamento di fuso orario di toISOString)
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const clampDayCount = (n: number): DayCount => (Math.min(6, Math.max(2, n)) as DayCount);

// crypto.randomUUID non è disponibile su http o browser datati: serve un fallback
const makeId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

// Interpreta 'YYYY-MM-DD' come data locale, non UTC
const parseLocalDate = (value: string | Date | undefined | null): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

export default function TopGymApp() {
  const [user, setUser] = useState<any>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [activeAthleteId, setActiveAthleteId] = useState<string>('');

  const [userRole, setUserRole] = useState<UserRole>('ATHLETE');
  const [showCoachPinModal, setShowCoachPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<'workout' | 'readiness' | 'analytics' | 'builder' | 'leaderboard' | 'settings'>('workout');
  const [userXp, setUserXp] = useState(0);
  const userXpRef = useRef(0);
  useEffect(() => { userXpRef.current = userXp; }, [userXp]);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [analyticsDate, setAnalyticsDate] = useState(todayIso());

  // Readiness States partono da 0
  const [selectedDayCount, setSelectedDayCount] = useState<DayCount>(4);
  const [sleepHours, setSleepHours] = useState('0');
  const [sleepQuality, setSleepQuality] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);
  const [domsLevel, setDomsLevel] = useState(0);
  const [energyLevel, setEnergyLevel] = useState(0);
  const [bodyWeight, setBodyWeight] = useState('');
  
  const [readinessSuccessMessage, setReadinessSuccessMessage] = useState<string | null>(null);
  const [builderSuccessMessage, setBuilderSuccessMessage] = useState<string | null>(null);
  const [workoutSuccessMessage, setWorkoutSuccessMessage] = useState<string | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  const [readinessHistory, setReadinessHistory] = useState<ReadinessLog[]>([]);
  const [readinessLoadError, setReadinessLoadError] = useState<string | null>(null);

  const [programName, setProgramName] = useState('Scheda Ipertrofia / Forza');
  const [programDays, setProgramDays] = useState<WorkoutDay[]>([]);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [currentExId, setCurrentExId] = useState('ex1');

  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('8');
  const [logs, setLogs] = useState<SetLog[]>([]);

  const [builderExName, setBuilderExName] = useState('');
  const [builderMuscleGroup, setBuilderMuscleGroup] = useState<MuscleGroup>('Petto');
  const [builderSets, setBuilderSets] = useState(3);
  const [builderReps, setBuilderReps] = useState('8-10');
  const [builderWeight, setBuilderWeight] = useState('0');
  const [builderRpe, setBuilderRpe] = useState(8);
  const [builderRest, setBuilderRest] = useState(0);
  const [builderType, setBuilderType] = useState<ExecutionType>('REGULAR');
  const [builderTut, setBuilderTut] = useState('2-0-1-0');
  const [builderNotes, setBuilderNotes] = useState('');
  const [editingDayId, setEditingDayId] = useState<string | null>(null);
  const [editingExId, setEditingExId] = useState<string | null>(null);

  const handleStartEditExercise = (dayId: string, ex: Exercise) => {
    setEditingDayId(dayId);
    setEditingExId(ex.id);
    setBuilderExName(ex.name);
    setBuilderMuscleGroup(ex.muscleGroup || autoDetectMuscleGroup(ex.name));
    setBuilderSets(ex.sets);
    setBuilderReps(ex.reps);
    setBuilderWeight(ex.targetWeight);
    setBuilderRpe(ex.rpeTarget);
    setBuilderRest(ex.restSeconds);
    setBuilderType(ex.executionType);
    setBuilderTut(ex.tut);
    setBuilderNotes(ex.notes || '');
  };

  const handleCancelEdit = () => {
    setEditingDayId(null);
    setEditingExId(null);
    setBuilderExName('');
    setBuilderNotes('');
    setBuilderSets(3);
    setBuilderReps('8-10');
    setBuilderWeight('60');
    setBuilderRpe(8);
    setBuilderRest(90);
    setBuilderType('REGULAR');
    setBuilderTut('2-0-1-0');
  };

  const displayUserName = user?.user_metadata?.username || (user?.email ? user.email.split('@')[0] : 'Atleta');
  const targetUserId = userRole === 'COACH' ? (activeAthleteId || user?.id || 'default-user') : (user?.id || 'default-user');
  const targetAthleteName = useMemo(
    () => athletes.find(a => a.id === targetUserId)?.displayName ?? 'Atleta',
    [athletes, targetUserId]
  );

  // Caricamento atleti e XP salvato
  useEffect(() => {
    if (!supabase) return;
    const fetchAthletes = async () => {
      const { data: profiles } = await supabase.from('profiles').select('id, username, email, xp');
      if (profiles) {
        const formatted: Athlete[] = profiles.map((p: any) => ({
          id: p.id,
          displayName: p.username || (p.email ? p.email.split('@')[0] : 'Atleta'),
          email: p.email || '',
          xp: p.xp || 0
        }));
        setAthletes(formatted);
        if (formatted.length > 0 && !activeAthleteId) {
          setActiveAthleteId(formatted[0].id);
        }
      }
    };
    fetchAthletes();

    const loadXp = (userId: string) => {
      supabase!.from('profiles').select('xp').eq('id', userId).single().then(({ data }) => {
        if (data && typeof data.xp === 'number') setUserXp(data.xp);
      });
    };

    // Ripristina subito la sessione già attiva (evita il flash della schermata di login)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadXp(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadXp(session.user.id);
      else setUserXp(0);
    });
    return () => subscription.unsubscribe();
  }, []);

  const addXp = useCallback(async (amount: number) => {
    // Uso il ref: evita XP persi quando si registrano più serie una dopo l'altra
    const newXp = userXpRef.current + amount;
    userXpRef.current = newXp;
    setUserXp(newXp);
    const uid = user?.id;
    if (supabase && uid) {
      await supabase.from('profiles').update({ xp: newXp }).eq('id', uid);
      setAthletes(prev => prev.map(a => (a.id === uid ? { ...a, xp: newXp } : a)));
    }
  }, [user?.id]);

  const loadHistory = useCallback(async (userId: string) => {
    if (!userId) return;
    try {
      const data = await getWorkoutHistoryFromSupabase(userId);
      setWorkoutHistory(Array.isArray(data) ? data : []);
    } catch {
      setWorkoutHistory([]);
    }
  }, []);

  const loadReadinessHistory = useCallback(async (userId: string) => {
    if (!supabase || !userId) {
      setReadinessLoadError(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('readiness_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Errore caricamento storico readiness:', error.message);
        setReadinessLoadError(error.message);
        return;
      }

      setReadinessLoadError(null);
      const formatted = (data || []).map((r: any) => ({
        id: r.id,
        date: r.date,
        sleepHours: r.sleep_hours,
        sleepQuality: r.sleep_quality,
        stressLevel: r.stress_level,
        domsLevel: r.doms_level,
        energyLevel: r.energy_level,
        bodyWeight: r.body_weight,
        readinessScore: r.readiness_score,
        recommendation: r.recommendation
      }));
      setReadinessHistory(formatted);
    } catch (e: any) {
      setReadinessHistory([]);
      setReadinessLoadError(e?.message || 'Errore di rete durante il caricamento.');
    }
  }, []);

  useEffect(() => {
    if (!supabase || !targetUserId) return;
    let isMounted = true;
    setProgramDays([]);
    setSelectedDayIndex(0);
    getProgramFromSupabase(targetUserId).then(data => {
      if (!isMounted) return;
      if (data && data.days_data && data.days_data.length > 0) {
        setProgramDays(data.days_data);
        setSelectedDayCount(clampDayCount(data.days_data.length));
        if (data.program_name) setProgramName(data.program_name);
      } else {
        const timestamp = Date.now();
        setProgramDays([
          { id: `day-1-${timestamp}`, dayNumber: 1, title: 'Spinta (Push)', exercises: [] },
          { id: `day-2-${timestamp}`, dayNumber: 2, title: 'Trazione (Pull)', exercises: [] },
          { id: `day-3-${timestamp}`, dayNumber: 3, title: 'Gambe (Legs)', exercises: [] },
          { id: `day-4-${timestamp}`, dayNumber: 4, title: 'Spalle & Braccia', exercises: [] }
        ]);
        setSelectedDayCount(4);
        setProgramName(`Scheda Personalizzata - ${targetAthleteName}`);
      }
    }).catch(() => {
      if (isMounted) setProgramDays([]);
    });
    loadHistory(targetUserId);
    loadReadinessHistory(targetUserId);
    return () => { isMounted = false; };
  }, [targetUserId, userRole, targetAthleteName, loadHistory, loadReadinessHistory]);

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

  const handlePasswordReset = async () => {
    if (!user?.email || !supabase) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, { redirectTo: window.location.origin });
    setSettingsMessage(error ? `⚠️ Errore: ${error.message}` : '📩 Email per il recupero password inviata con successo!');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Sei sicuro di voler eliminare il tuo account? Questa azione non può essere annullata.') || !supabase) return;
    try {
      const { error } = await supabase.rpc('delete_user');
      if (error) setSettingsMessage(`⚠️ Impossibile eliminare l'account: ${error.message}`);
      else {
        alert('Account eliminato con successo.');
        await handleLogout();
      }
    } catch (e: any) {
      await handleLogout();
    }
  };

  const playTimerSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
      // Rilascia le risorse audio a fine suono
      osc.onended = () => { audioCtx.close().catch(() => {}); };
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([200, 100, 200]);
    } catch {
      console.log('Audio non abilitato');
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (!isTimerRunning || restTimer === null) return;
    if (restTimer > 0) {
      const interval = setInterval(() => setRestTimer(prev => (prev && prev > 0 ? prev - 1 : 0)), 1000);
      return () => clearInterval(interval);
    }
    setIsTimerRunning(false);
    playTimerSound();
  }, [isTimerRunning, restTimer, playTimerSound]);

  const startRestTimer = (seconds: number) => {
    setRestTimer(seconds);
    setIsTimerRunning(true);
  };

  const handleRoleSwitchRequest = (targetRole: UserRole) => {
    if (targetRole === 'COACH' && userRole !== 'COACH') setShowCoachPinModal(true);
    else {
      setUserRole('ATHLETE');
      if (activeTab === 'builder') setActiveTab('workout');
    }
  };

  // Lista email autorizzate al ruolo Coach
  const ALLOWED_COACH_EMAILS = [
    'riprendi@gmail.com',
    'maggiopaolo34@gmail.com'
  ];

  const verifyCoachPin = (e: React.FormEvent) => {
    e.preventDefault();

    const isAuthorizedEmail = ALLOWED_COACH_EMAILS.includes(user?.email || '');

    if (pinInput === '1234' && isAuthorizedEmail) {
      setUserRole('COACH');
      setShowCoachPinModal(false);
      setPinInput('');
      setPinError(false);
      if (activeTab === 'workout') setActiveTab('builder');
    } else {
      setPinError(true);
    }
  };

  // --- Tabella RPE → % 1RM (Ripetizioni in Riserva), standard powerlifting/forza ---
  // Righe: RPE da 6 a 10 (step 0.5), Colonne: ripetizioni da 1 a 10.
  // Fonte: tabella fornita dall'utente (RPE Chart). Non tocca conteggi/volumi: incide solo sulla stima del massimale.
  const RPE_PERCENT_1RM_TABLE: Record<string, number[]> = {
    '10':  [100, 96, 92, 89, 86, 84, 81, 79, 76, 74],
    '9.5': [98,  94, 91, 88, 85, 82, 80, 77, 75, 72],
    '9':   [96,  92, 89, 86, 84, 81, 79, 76, 74, 71],
    '8.5': [94,  91, 88, 85, 82, 80, 77, 75, 72, 69],
    '8':   [92,  89, 86, 84, 81, 79, 76, 74, 71, 68],
    '7.5': [91,  88, 85, 82, 80, 77, 75, 72, 69, 67],
    '7':   [89,  86, 84, 81, 79, 76, 74, 71, 68, 65],
    '6.5': [87,  85, 82, 80, 77, 75, 72, 69, 67, 64],
    '6':   [86,  84, 81, 79, 76, 74, 71, 68, 65, 62],
  };

  // Formula di Epley: fallback generico quando l'RPE non è tra quelli in tabella o le reps superano 10
  const calculate1RM = (w: number, r: number) => (r === 1 ? w : Math.round(w * (1 + r / 30)));

  // Stima 1RM basata su RPE reale della serie (più precisa di Epley): usa la tabella se reps 1-10 e RPE in tabella,
  // altrimenti ricade sulla formula generica. weight/reps non validi -> null (nessuna stima possibile).
  const calculateEstimated1RM = useCallback((weight: number, reps: number, rpe?: number): number | null => {
    if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(reps) || reps <= 0) return null;
    if (rpe !== undefined && Number.isFinite(rpe) && reps <= 10) {
      const row = RPE_PERCENT_1RM_TABLE[String(rpe)];
      if (row) {
        const pct = row[Math.round(reps) - 1];
        if (pct > 0) return Math.round(weight / (pct / 100));
      }
    }
    return calculate1RM(weight, reps);
  }, []);

  // Tutte le serie mai registrate (log di oggi + storico Supabase), usate per stimare il vero 1RM per esercizio
  const allLoggedSets = useMemo(() => {
    const items: { exerciseName: string; weight: number; estimated1RM: number }[] = [];
    logs.forEach(l => {
      if (l.weight > 0 && l.reps > 0) {
        items.push({
          exerciseName: l.exerciseName,
          weight: l.weight,
          estimated1RM: l.estimated1RM || calculateEstimated1RM(l.weight, l.reps, l.rpe) || calculate1RM(l.weight, l.reps)
        });
      }
    });
    workoutHistory.forEach(w => {
      if (Array.isArray(w.logs)) {
        w.logs.forEach((l: any) => {
          const weight = Number(l?.weight) || 0;
          const reps = Number(l?.reps) || 0;
          const rpeVal = Number(l?.rpe);
          if (weight > 0 && reps > 0) {
            items.push({
              exerciseName: l.exerciseName || '',
              weight,
              estimated1RM: Number(l.estimated1RM) || calculateEstimated1RM(weight, reps, Number.isFinite(rpeVal) ? rpeVal : undefined) || calculate1RM(weight, reps)
            });
          }
        });
      }
    });
    return items;
  }, [logs, workoutHistory, calculateEstimated1RM]);

  // Miglior 1RM stimato per esercizio, calcolato su tutto lo storico disponibile
  const best1RMByExercise = useMemo(() => {
    const map = new Map<string, number>();
    allLoggedSets.forEach(({ exerciseName, estimated1RM }) => {
      if (!exerciseName) return;
      if (estimated1RM > (map.get(exerciseName) || 0)) map.set(exerciseName, estimated1RM);
    });
    return map;
  }, [allLoggedSets]);

  // Intensità di carico (% 1RM) secondo le fasce standard forza/ipertrofia
  const getIntensityInfo = useCallback((exerciseName: string, weight: number) => {
    const best1RM = best1RMByExercise.get(exerciseName);
    if (!best1RM || best1RM <= 0 || !weight) return null;
    const pct = Math.round((weight / best1RM) * 100);
    let label = 'Attivazione';
    let colorClasses = 'bg-zinc-800 text-zinc-300 border-zinc-700';
    if (pct >= 90) { label = 'Picco Massimale'; colorClasses = 'bg-red-950 text-red-300 border-red-800'; }
    else if (pct >= 75) { label = 'Forza'; colorClasses = 'bg-amber-950 text-amber-300 border-amber-800'; }
    else if (pct >= 55) { label = 'Ipertrofia'; colorClasses = 'bg-emerald-950 text-emerald-300 border-emerald-800'; }
    return { pct, label, colorClasses };
  }, [best1RMByExercise]);

  // Anteprima 1RM: usa l'RPE selezionato nel form (più precisa); null se i campi non sono validi (prima mostrava NaN)
  const estimated1RMPreview = useMemo(() => {
    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    const rpeVal = parseFloat(rpe);
    if (!Number.isFinite(w) || !Number.isFinite(r) || w <= 0 || r <= 0) return null;
    return calculateEstimated1RM(w, r, Number.isFinite(rpeVal) ? rpeVal : undefined);
  }, [weight, reps, rpe, calculateEstimated1RM]);

  // Percentuale di 1RM associata a RPE+reps selezionati, letta direttamente dalla tabella (senza passare dal peso)
  const rpeTablePreviewPct = useMemo(() => {
    const r = Math.min(10, Math.max(1, parseInt(reps, 10) || 1));
    const row = RPE_PERCENT_1RM_TABLE[rpe];
    return row ? row[r - 1] : null;
  }, [rpe, reps]);

  const activeAthlete = athletes.find(a => a.id === activeAthleteId) || (athletes.length > 0 ? athletes[0] : { id: 'default', displayName: 'Atleta', email: '', xp: 0 });
  const activeDay = programDays[selectedDayIndex] ?? programDays[0];
  const activeRoutine = activeDay?.exercises ?? [];
  const currentExercise = activeRoutine.find(e => e.id === currentExId) || activeRoutine[0];

  const currentIntensityPreview = useMemo(() => {
    if (!currentExercise) return null;
    const w = parseFloat(weight);
    if (!Number.isFinite(w) || w <= 0) return null;
    return getIntensityInfo(currentExercise.name, w);
  }, [currentExercise, weight, getIntensityInfo]);

  const exerciseHistory = currentExercise ? logs.filter(l => l.exerciseName === currentExercise.name) : [];
  const lastLoggedSet = exerciseHistory[0];

  const handleAutoFillLastLog = () => {
    if (lastLoggedSet) {
      setWeight(lastLoggedSet.weight.toString());
      setReps(lastLoggedSet.reps.toString());
      setRpe(lastLoggedSet.rpe.toString());
    }
  };

  const computeReadiness = useCallback(() => {
    const sleepFactor = (sleepQuality * 10) * 0.35;
    const energyFactor = (energyLevel * 10) * 0.30;
    const stressFactor = ((11 - (stressLevel || 1)) * 10) * 0.20;
    const domsFactor = ((11 - (domsLevel || 1)) * 10) * 0.15;
    const totalScore = Math.round(sleepFactor + energyFactor + stressFactor + domsFactor);
    let rec = '';
    if (totalScore >= 80) rec = 'Pronto per la massima intensità! Segui i carichi target e spingi al 100%.';
    else if (totalScore >= 60) rec = 'Stato discreto. Allenamento regolare, ma mantieni 1 rep di margine.';
    else rec = 'Fatica/Stress elevati. Consigliato scarico attivo o riduzione carichi/volume del 15-20%.';
    return { totalScore, rec };
  }, [sleepQuality, energyLevel, stressLevel, domsLevel]);

  const currentReadiness = useMemo(() => computeReadiness(), [computeReadiness]);

  const handleSaveReadiness = async (e: React.FormEvent) => {
    e.preventDefault();
    const { totalScore, rec } = computeReadiness();
    const newReadiness: ReadinessLog = {
      id: makeId(),
      date: todayIso(),
      sleepHours: parseFloat(sleepHours) || 0,
      sleepQuality,
      stressLevel,
      domsLevel,
      energyLevel,
      bodyWeight: bodyWeight ? parseFloat(bodyWeight) : undefined,
      readinessScore: totalScore,
      recommendation: rec
    };
    setReadinessHistory(prev => [newReadiness, ...prev]);
    if (supabase && targetUserId) {
      const { error } = await supabase.from('readiness_logs').insert([{
        id: newReadiness.id,
        user_id: targetUserId,
        date: newReadiness.date,
        sleep_hours: newReadiness.sleepHours,
        sleep_quality: newReadiness.sleepQuality,
        stress_level: newReadiness.stressLevel,
        doms_level: newReadiness.domsLevel,
        energy_level: newReadiness.energyLevel,
        body_weight: newReadiness.bodyWeight,
        readiness_score: newReadiness.readinessScore,
        recommendation: newReadiness.recommendation
      }]);
      if (error) {
        setReadinessHistory(prev => prev.filter(r => r.id !== newReadiness.id));
        setReadinessSuccessMessage('⚠️ Errore nel salvataggio del check readiness.');
        setTimeout(() => setReadinessSuccessMessage(null), 4000);
        return;
      }
    }
    await addXp(20);
    setReadinessSuccessMessage('🎉 Check Readiness salvato nello storico dell\'atleta! (+20 XP)');
    // Reset valori a 0
    setSleepHours('0');
    setSleepQuality(0);
    setStressLevel(0);
    setDomsLevel(0);
    setEnergyLevel(0);
    setBodyWeight('');
    setTimeout(() => setReadinessSuccessMessage(null), 4000);
  };

  const handleDayCountChange = (count: DayCount) => {
    setSelectedDayCount(count);
    setProgramDays(prev => {
      if (prev.length < count) {
        const newDays = [...prev];
        for (let i = prev.length + 1; i <= count; i++) {
          newDays.push({ id: `day-${i}-${makeId()}`, dayNumber: i, title: `Giorno ${i}`, exercises: [] });
        }
        return newDays;
      }
      return prev.slice(0, count);
    });
    setSelectedDayIndex(prev => Math.min(prev, count - 1));
  };

  const todayLogs = useMemo(() => {
    const today = todayIso();
    return logs.filter(l => l.date === today);
  }, [logs]);

  const handleFinishAndSaveWorkout = async () => {
    const dayName = activeDay ? activeDay.title : 'Giornata di Allenamento';
    const totalVol = todayLogs.reduce((acc, curr) => acc + curr.volume, 0) || 0;
    
    // Il campo 'logs' viene ora salvato correttamente da saveCompletedWorkoutToSupabase
    let result: { success?: boolean; error?: string } = {};
    try {
      result = await saveCompletedWorkoutToSupabase({
        userId: targetUserId,
        dayName: dayName,
        totalVolume: totalVol,
        exercisesCount: activeRoutine.length,
        logs: todayLogs
      });
    } catch (e: any) {
      result = { success: false, error: e?.message };
    }

    if (result?.success) {
      await addXp(50);
      setWorkoutSuccessMessage('🎉 Allenamento completato e salvato! +50 XP');
      setLogs([]); // Pulisce i log locali post salvataggio
      await loadHistory(targetUserId);
      setTimeout(() => setWorkoutSuccessMessage(null), 4000);
    } else {
      // Mostro il messaggio reale di Supabase (es. colonna mancante, policy RLS) invece di un testo generico
      const detail = result?.error ? ` (${result.error})` : '';
      setWorkoutSuccessMessage(`⚠️ Errore nel salvataggio dell'allenamento${detail}. I log restano salvati in locale, riprova.`);
      setTimeout(() => setWorkoutSuccessMessage(null), 8000);
    }
  };

  const handleDeleteWorkoutHistory = async (workoutId?: string) => {
    if (!workoutId) return;
    if (!window.confirm('Vuoi davvero eliminare questo allenamento dallo storico?')) return;
    try {
      await deleteWorkoutHistoryFromSupabase(workoutId);
      setWorkoutHistory(prev => prev.filter(item => (item.id || item._id) !== workoutId));
    } catch {
      setWorkoutSuccessMessage('⚠️ Errore durante l\'eliminazione dell\'allenamento.');
      setTimeout(() => setWorkoutSuccessMessage(null), 4000);
    }
  };

  const handleSaveProgramByCoach = async () => {
    const targetId = activeAthleteId || 'default-user';
    let result: { success?: boolean; error?: string } = {};
    try {
      result = await saveProgramToSupabase(targetId, programName, programDays);
    } catch (e: any) {
      result = { success: false, error: e?.message };
    }
    if (result?.success) {
      setBuilderSuccessMessage(`✅ Scheda salvata e assegnata con successo a ${activeAthlete.displayName}! L'atleta ora può visualizzarla.`);
      setTimeout(() => setBuilderSuccessMessage(null), 4000);
    } else {
      const detail = result?.error ? ` (${result.error})` : '';
      setBuilderSuccessMessage(`⚠️ Errore durante il salvataggio della scheda${detail}.`);
      setTimeout(() => setBuilderSuccessMessage(null), 8000);
    }
  };

  const handleLogSet = (e: React.FormEvent) => {
    e.preventDefault();
    const numWeight = parseFloat(weight);
    const numReps = parseInt(reps, 10);
    const numRpe = parseFloat(rpe);
    if (!numWeight || !numReps) return;

    const newLog: SetLog = {
      id: makeId(),
      exerciseId: currentExercise?.id || currentExId,
      exerciseName: currentExercise?.name || 'Esercizio',
      weight: numWeight,
      reps: numReps,
      rpe: numRpe,
      estimated1RM: calculateEstimated1RM(numWeight, numReps, numRpe) || calculate1RM(numWeight, numReps),
      volume: numWeight * numReps,
      date: todayIso(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setLogs(prev => [newLog, ...prev]);
    void addXp(10);
    if (currentExercise?.restSeconds) startRestTimer(currentExercise.restSeconds);
    setWeight('');
    setReps('');
  };

  const handleDeleteLog = (logId: string) => {
    setLogs(prev => prev.filter(l => l.id !== logId));
  };

  const handleAddOrUpdateExercise = (e: React.FormEvent, dayId: string) => {
    e.preventDefault();
    if (!builderExName.trim()) return;

    if (editingExId && editingDayId === dayId) {
      // Modifica esercizio esistente
      setProgramDays(prevDays =>
        prevDays.map(day => {
          if (day.id === dayId) {
            return {
              ...day,
              exercises: day.exercises.map(ex =>
                ex.id === editingExId
                  ? {
                      ...ex,
                      name: builderExName.trim(),
                      muscleGroup: builderMuscleGroup || autoDetectMuscleGroup(builderExName),
                      sets: builderSets,
                      reps: builderReps,
                      targetWeight: builderWeight,
                      rpeTarget: builderRpe,
                      restSeconds: builderRest,
                      executionType: builderType,
                      tut: builderTut,
                      notes: builderNotes.trim() || undefined
                    }
                  : ex
              )
            };
          }
          return day;
        })
      );
      handleCancelEdit();
    } else {
      // Aggiunta nuovo esercizio
      const newEx: Exercise = {
        id: crypto.randomUUID(),
        name: builderExName.trim(),
        muscleGroup: builderMuscleGroup || autoDetectMuscleGroup(builderExName),
        sets: builderSets,
        reps: builderReps,
        targetWeight: builderWeight,
        rpeTarget: builderRpe,
        restSeconds: builderRest,
        executionType: builderType,
        tut: builderTut,
        notes: builderNotes.trim() || undefined
      };

      setProgramDays(prevDays =>
        prevDays.map(day => (day.id === dayId ? { ...day, exercises: [...(day.exercises || []), newEx] } : day))
      );

      setBuilderExName('');
      setBuilderNotes('');
    }
  };

  const handleRemoveExerciseFromDay = (dayId: string, exerciseId: string) => {
    setProgramDays(prevDays => prevDays.map(day =>
      day.id === dayId
        ? { ...day, exercises: (day.exercises || []).filter(ex => ex.id !== exerciseId) }
        : day
    ));
  };

  const handleRenameDay = (dayId: string, title: string) => {
    setProgramDays(prevDays => prevDays.map(day => (day.id === dayId ? { ...day, title } : day)));
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

  const getRankTitle = (level: number) => {
    if (level < 10) return "Novizio della Ghisa";
    if (level < 20) return "Recluta della Sala Pesi";
    if (level < 30) return "Sollevatore Abituale";
    if (level < 40) return "Atleta d'Acciaio";
    if (level < 50) return "Guerriero del Rack";
    if (level < 60) return "Veterano della Palestra";
    if (level < 70) return "Macchina da Guerra";
    if (level < 80) return "Titano della Ghisa";
    if (level < 90) return "Leggenda Vivente";
    return "Dio dell'Olimpo TOP GYM";
  };

  const userLevel = Math.min(99, Math.floor(Math.sqrt(userXp / 25)));
  const userRank = getRankTitle(userLevel);
  const xpForNextLevel = 25 * Math.pow(userLevel + 1, 2);
  const xpForCurrentLevel = 25 * Math.pow(userLevel, 2);
  const levelProgressPercentage = userLevel >= 99 ? 100 : Math.min(100, Math.round(((userXp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100));

  const latestReadiness = readinessHistory[0];
  const recentRpeLogs = logs.slice(0, 4);
  const highFatigueDetected = recentRpeLogs.length >= 2 && recentRpeLogs.every(l => l.rpe >= 9.5);

  // Classifica ordinata senza mutare lo stato, con l'XP aggiornato dell'utente corrente
  const leaderboard = useMemo(
    () => athletes
      .map(a => (a.id === user?.id ? { ...a, xp: userXp } : a))
      .sort((a, b) => b.xp - a.xp),
    [athletes, user?.id, userXp]
  );

  const achievements: Achievement[] = [
    { id: '1', title: 'Club dei 100kg', description: 'Solleva 100kg o più in un esercizio', icon: '🏋️', unlocked: logs.some(l => l.weight >= 100) },
    { id: '2', title: 'PR Breaker', description: 'Supera il tuo massimale stimato', icon: '🔥', unlocked: logs.length >= 3 },
    { id: '3', title: 'Atleta Consapevole', description: 'Registra Check di Readiness', icon: '🧠', unlocked: readinessHistory.length >= 1 },
    { id: '4', title: 'Costanza d\'Acciaio', description: 'Accumula oltre 500 XP', icon: '⚡', unlocked: userXp >= 500 }
  ];

  // --- CALCOLI PER LE ANALITICHE (in base alla data selezionata) ---
  const { startOfWeek, endOfWeek, startOfMonth, endOfMonth } = useMemo(() => {
    const targetDate = parseLocalDate(analyticsDate) || new Date();

    // Limiti settimana (Lunedì - Domenica)
    const dayOfWeek = targetDate.getDay();
    const diffToMonday = targetDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startW = new Date(targetDate);
    startW.setDate(diffToMonday);
    startW.setHours(0, 0, 0, 0);
    const endW = new Date(startW);
    endW.setDate(startW.getDate() + 6);
    endW.setHours(23, 59, 59, 999);

    // Limiti mese
    const startM = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const endM = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);

    return { startOfWeek: startW, endOfWeek: endW, startOfMonth: startM, endOfMonth: endM };
  }, [analyticsDate]);

  // Mappa nome esercizio -> gruppo muscolare, costruita una sola volta (prima era una ricerca per ogni serie)
  const muscleGroupByExerciseName = useMemo(() => {
    const map = new Map<string, MuscleGroup>();
    programDays.forEach(day => {
      (day.exercises || []).forEach(ex => {
        if (ex.muscleGroup && !map.has(ex.name)) map.set(ex.name, ex.muscleGroup);
      });
    });
    return map;
  }, [programDays]);

  // Tutte le serie (locali + storico Supabase) con la relativa data, calcolate una volta sola
  const allSetsWithDate = useMemo(() => {
    const items: { name: string; date: Date | null }[] = [];
    logs.forEach(log => items.push({ name: log.exerciseName, date: parseLocalDate(log.date) }));
    workoutHistory.forEach(workout => {
      if (Array.isArray(workout.logs)) {
        const wDate = parseLocalDate(workout.created_at || workout.date);
        workout.logs.forEach((log: any) => items.push({ name: log?.exerciseName || '', date: wDate }));
      }
    });
    return items;
  }, [logs, workoutHistory]);

  // Conteggio Serie Settimanali per gruppo muscolare
  const weeklySetsMap = useMemo(() => {
    const map: Record<string, number> = {};
    allSetsWithDate.forEach(({ name, date }) => {
      if (!date || date < startOfWeek || date > endOfWeek) return;
      const mg = muscleGroupByExerciseName.get(name) || autoDetectMuscleGroup(name || '');
      map[mg] = (map[mg] || 0) + 1;
    });
    return map;
  }, [allSetsWithDate, muscleGroupByExerciseName, startOfWeek, endOfWeek]);

  // Conteggio Mensile Totale
  const monthlySetsCount = useMemo(
    () => allSetsWithDate.reduce(
      (count, { date }) => (date && date >= startOfMonth && date <= endOfMonth ? count + 1 : count),
      0
    ),
    [allSetsWithDate, startOfMonth, endOfMonth]
  );

  // Totale serie di sempre e volume massimo (usati nelle analitiche)
  const totalSetsEver = useMemo(
    () => workoutHistory.reduce((s, w) => s + (Array.isArray(w.logs) ? w.logs.length : 0), 0) + logs.length,
    [workoutHistory, logs]
  );

  const maxHistoryVolume = useMemo(
    () => workoutHistory.reduce((max, w) => Math.max(max, w.total_volume || w.totalVolume || 0), 0) || 1,
    [workoutHistory]
  );

  // Serie Volume (tonnellaggio) + Intensità media (% 1RM) per sessione, per il grafico a due linee
  const volumeIntensitySeries = useMemo(() => {
    const sessions = workoutHistory.slice(0, 12).reverse();
    return sessions.map((item, idx) => {
      const volume = item.total_volume || item.totalVolume || 0;
      const sessionLogs = Array.isArray(item.logs) ? item.logs : [];
      const intensities = sessionLogs
        .map((l: any) => {
          const best = best1RMByExercise.get(l?.exerciseName);
          const w = Number(l?.weight) || 0;
          return best && best > 0 && w > 0 ? (w / best) * 100 : null;
        })
        .filter((v: number | null): v is number => v !== null);
      const avgIntensity = intensities.length
        ? Math.round(intensities.reduce((a: number, b: number) => a + b, 0) / intensities.length)
        : null;
      const dateStr = item.created_at
        ? new Date(item.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })
        : (item.date || `#${idx + 1}`);
      return { key: item.id || item._id || `session-${idx}`, dateStr, volume, avgIntensity };
    });
  }, [workoutHistory, best1RMByExercise]);
  // ----------------------------------------------------------------

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

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans p-4 md:p-8">
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
              <Shield className="text-yellow-500 w-5 h-5 flex-shrink-0" />
              <div className="w-36">
                <div className="text-[10px] text-yellow-500 font-black uppercase tracking-wider truncate">
                  {userRank}
                </div>
                <div className="flex justify-between items-center text-[10px] text-zinc-400 font-bold">
                  <span>Lvl {userLevel}/99</span>
                  <span className="font-mono">{userXp} XP</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-0.5 overflow-hidden">
                  <div className="bg-yellow-500 h-full transition-all duration-300" style={{ width: `${levelProgressPercentage}%` }} />
                </div>
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
                <button type="button" onClick={() => setShowCoachPinModal(false)} className="w-1/2 bg-zinc-800 py-2 rounded text-xs font-bold text-zinc-300">Annulla</button>
                <button type="submit" className="w-1/2 bg-[#E50914] py-2 rounded text-xs font-bold text-white uppercase">Sblocca</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
        {userRole === 'ATHLETE' && (
          <button onClick={() => setActiveTab('settings')} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-[#E50914] text-white' : 'bg-[#1E1E1E] text-zinc-400 hover:text-white'}`}><Settings className="w-4 h-4 text-zinc-300" /> Impostazioni</button>
        )}
      </div>

      <main className="max-w-5xl mx-auto">
        {activeTab === 'workout' && userRole === 'ATHLETE' && (
          <div className="space-y-6">
            {highFatigueDetected && (
              <div className="bg-amber-950/40 border border-amber-600/60 p-4 rounded-xl flex items-start gap-3 text-amber-300">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-amber-200">Livello di Fatica Accumulata Elevato!</h4>
                  <p className="text-xs text-amber-300/80 mt-1">Hai registrato serie consecutive ad RPE 9.5+. Considera di estendere il recupero di 30s.</p>
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
                  <div key={ex.id} onClick={() => setCurrentExId(ex.id)} className={`p-4 rounded-lg border cursor-pointer transition-all ${currentExId === ex.id ? 'bg-red-950/20 border-[#E50914]' : 'bg-zinc-900 border-zinc-800'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-lg text-white">{ex.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getBadgeStyle(ex.executionType)}`}>{ex.executionType}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-zinc-400 mt-2 border-t border-zinc-800/60 pt-2">
                      <div>Serie/Reps: <b className="text-white">{ex.sets} × {ex.reps}</b></div>
                      <div>Target: <b className="text-white">{ex.targetWeight} Kg</b></div>
                      <div>TUT: <b className="text-yellow-500 font-mono">{ex.tut}</b></div>
                    </div>
                    {ex.notes && <div className="text-[11px] text-zinc-400 italic mt-2 border-t border-zinc-800/40 pt-1">Note: {ex.notes}</div>}
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
                  {estimated1RMPreview !== null && (
                    <div className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg text-right space-y-1">
                      <div className="text-[10px] text-zinc-400 uppercase font-bold">1RM Stimato</div>
                      <div className="text-lg font-black text-[#E50914]">{estimated1RMPreview} Kg</div>
                      {currentIntensityPreview && (
                        <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase inline-block ${currentIntensityPreview.colorClasses}`}>
                          {currentIntensityPreview.pct}% 1RM · {currentIntensityPreview.label}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {lastLoggedSet && (
                  <div className="mb-4 bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 flex items-center justify-between flex-wrap gap-2">
                    <div className="text-xs text-zinc-400">Ultimo Carico: <b className="text-white">{lastLoggedSet.weight} kg × {lastLoggedSet.reps} reps</b> (RPE {lastLoggedSet.rpe})</div>
                    <button type="button" onClick={handleAutoFillLastLog} className="text-xs text-[#E50914] font-bold flex items-center gap-1"><Copy className="w-3.5 h-3.5"/> Copia Ultimo Carico</button>
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
                      {rpeTablePreviewPct !== null && (
                        <p className="text-[10px] text-zinc-500 mt-1">≈ {rpeTablePreviewPct}% del 1RM a {parseInt(reps, 10) || 1} reps</p>
                      )}
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-[#E50914] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 uppercase">
                    <Plus className="w-5 h-5"/> Registra Serie (+10 XP)
                  </button>
                </form>

                <div className="mt-6">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Serie Registrate Oggi</h4>
                  <div className="space-y-2">
                    {todayLogs.map((log, i) => {
                      const intensity = getIntensityInfo(log.exerciseName, log.weight);
                      return (
                        <div key={log.id} className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 flex justify-between items-center text-xs">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-zinc-500">Set {i + 1}</span>
                            <div>
                              <span className="font-bold text-white block">{log.exerciseName}</span>
                              <span className="text-zinc-400 font-mono text-[11px]">{log.weight} Kg × {log.reps} reps (RPE {log.rpe})</span>
                            </div>
                            {intensity && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${intensity.colorClasses}`}>
                                {intensity.pct}% 1RM · {intensity.label}
                              </span>
                            )}
                          </div>
                          <button type="button" onClick={() => handleDeleteLog(log.id)} title="Elimina serie" className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-zinc-800 space-y-4">
              {workoutSuccessMessage && <div className="bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl text-center font-bold text-sm">{workoutSuccessMessage}</div>}
              <button
                onClick={handleFinishAndSaveWorkout}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black py-4 rounded-xl uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <span>✅ Termina e Salva Allenamento</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'readiness' && (
          <div className="space-y-6">
            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800 space-y-6">
              {userRole === 'ATHLETE' && (
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2"><Gauge className="text-green-400"/> Check-in Giornaliero dello Stato di Forma</h2>
                  <p className="text-xs text-zinc-400 mt-1">Valuta le tue variabili biologiche per calcolare il punteggio di recupero e ricevere indicazioni sul volume o intensità.</p>
                </div>
              )}

              {readinessSuccessMessage && (
                <div className="bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg text-center font-bold text-xs">
                  {readinessSuccessMessage}
                </div>
              )}

              {userRole === 'ATHLETE' && (
                <form onSubmit={handleSaveReadiness} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1 flex items-center gap-1.5"><Moon className="w-4 h-4 text-indigo-400"/> Ore di Sonno</label>
                      <input type="number" step="0.5" value={sleepHours} onChange={e => setSleepHours(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold outline-none focus:border-[#E50914]"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1 flex items-center gap-1.5"><Scale className="w-4 h-4 text-blue-400"/> Peso Corporeo (Kg)</label>
                      <input type="number" step="0.1" value={bodyWeight} onChange={e => setBodyWeight(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-bold outline-none focus:border-[#E50914]"/>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1"><span className="text-zinc-400 flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-yellow-400"/> Qualità del Sonno</span><span className="text-yellow-400 font-mono">{sleepQuality} / 10</span></div>
                      <input type="range" min="0" max="10" value={sleepQuality} onChange={e => setSleepQuality(Number(e.target.value))} className="w-full accent-[#E50914]" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1"><span className="text-zinc-400 flex items-center gap-1.5"><Dumbbell className="w-4 h-4 text-red-400"/> Fatica Muscolare / DOMS (0 = Nessun dolore, 10 = Estremo)</span><span className="text-red-400 font-mono">{domsLevel} / 10</span></div>
                      <input type="range" min="0" max="10" value={domsLevel} onChange={e => setDomsLevel(Number(e.target.value))} className="w-full accent-[#E50914]" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1"><span className="text-zinc-400 flex items-center gap-1.5"><BatteryCharging className="w-4 h-4 text-green-400"/> Energia / Motivazione</span><span className="text-green-400 font-mono">{energyLevel} / 10</span></div>
                      <input type="range" min="0" max="10" value={energyLevel} onChange={e => setEnergyLevel(Number(e.target.value))} className="w-full accent-[#E50914]" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1"><span className="text-zinc-400 flex items-center gap-1.5"><Brain className="w-4 h-4 text-purple-400"/> Stress Percepito</span><span className="text-purple-400 font-mono">{stressLevel} / 10</span></div>
                      <input type="range" min="0" max="10" value={stressLevel} onChange={e => setStressLevel(Number(e.target.value))} className="w-full accent-[#E50914]" />
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center"><span className="text-xs text-zinc-400 uppercase font-bold">Score Stimato ({todayIso()}):</span><span className="text-lg font-black text-[#E50914]">{currentReadiness.totalScore}%</span></div>
                    <p className="text-xs text-zinc-300 font-medium"><b>Consigliato:</b> {currentReadiness.rec}</p>
                  </div>

                  <button type="submit" className="w-full bg-[#E50914] hover:bg-red-700 text-white font-bold py-3 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer">
                    <Gauge className="w-5 h-5"/> Salva Check Readiness (+20 XP)
                  </button>
                </form>
              )}
            </div>

            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <History className="text-green-400" /> Storico Check Readiness ({userRole === 'COACH' ? activeAthlete.displayName : displayUserName})
              </h3>
              {readinessLoadError && (
                <div className="mb-4 bg-red-950/40 border border-red-800 text-red-300 p-3 rounded-lg text-xs">
                  ⚠️ Impossibile caricare lo storico da Supabase: {readinessLoadError}
                  <br />Controlla le policy RLS (SELECT) sulla tabella <code className="font-mono">readiness_logs</code>.
                </div>
              )}
              {readinessHistory.length === 0 ? (
                <p className="text-xs text-zinc-400">Nessun check readiness ancora registrato.</p>
              ) : (
                <div className="space-y-3">
                  {readinessHistory.map((item) => (
                    <div key={item.id} className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 space-y-2 text-xs">
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                        <span className="font-bold text-white flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-zinc-400" /> Data: {item.date}</span>
                        <span className={`px-2.5 py-0.5 rounded font-black text-sm ${item.readinessScore >= 80 ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-yellow-950 text-yellow-400 border border-yellow-800'}`}>Score: {item.readinessScore}%</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-zinc-400 pt-1">
                        <div>Sonno: <b className="text-white">{item.sleepHours}h ({item.sleepQuality}/10)</b></div>
                        <div>Peso: <b className="text-white">{item.bodyWeight ? `${item.bodyWeight} kg` : 'N/D'}</b></div>
                        <div>DOMS: <b className="text-white">{item.domsLevel}/10</b></div>
                        <div>Energia: <b className="text-white">{item.energyLevel}/10</b></div>
                      </div>
                      <p className="text-[11px] text-zinc-300 italic pt-1 border-t border-zinc-800/40">Indicazione: {item.recommendation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'builder' && userRole === 'COACH' && (
          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800 space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 border-b border-zinc-800">
              <div className="space-y-2 flex-1 max-w-md">
                <h2 className="text-xl font-bold flex items-center gap-2"><UserCheck className="text-[#E50914]"/> Area Coach / Gestione Programma ({activeAthlete.displayName})</h2>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Nome della Scheda</label>
                  <input
                    type="text"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-bold outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                <span className="text-xs font-bold text-zinc-400">Giorni:</span>
                <div className="flex gap-1">
                  {([2, 3, 4, 5, 6] as DayCount[]).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleDayCountChange(num)}
                      className={`px-2.5 py-1 text-xs font-black rounded border transition-all ${selectedDayCount === num ? 'bg-[#E50914] border-[#E50914] text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'}`}
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
                  <div className="flex items-center gap-2 w-full max-w-sm">
                    <h3 className="font-bold text-white whitespace-nowrap text-sm">Giorno {day.dayNumber}:</h3>
                    <input 
                      type="text" 
                      value={day.title}
                      onChange={(e) => handleRenameDay(day.id, e.target.value)}
                      className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-white font-bold outline-none focus:border-[#E50914] w-full"
                    />
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">{day.exercises.length} esercizi</span>
                </div>

                <div className="space-y-2">
                  {day.exercises.map((ex) => (
                    <div 
                      key={ex.id} 
                      className={`p-3 rounded-lg border flex justify-between items-center text-xs transition-all ${
                        editingExId === ex.id ? 'bg-red-950/30 border-[#E50914]' : 'bg-[#1E1E1E] border-zinc-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{ex.name}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${getBadgeStyle(ex.executionType)}`}>
                            {ex.executionType}
                          </span>
                        </div>
                        <div className="text-zinc-400 mt-0.5">
                          {ex.sets} × {ex.reps} @ {ex.targetWeight} kg | RPE: {ex.rpeTarget} | Rec: {ex.restSeconds}s | TUT: {ex.tut}
                        </div>
                        {ex.notes && <div className="text-[10px] text-zinc-500 italic mt-0.5">Note: {ex.notes}</div>}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEditExercise(day.id, ex)}
                          className="p-1 text-zinc-400 hover:text-yellow-400 hover:bg-zinc-800 rounded transition"
                          title="Modifica esercizio"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            if (editingExId === ex.id) handleCancelEdit();
                            handleRemoveExerciseFromDay(day.id, ex.id);
                          }} 
                          className="p-1 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded transition"
                          title="Elimina esercizio"
                        >
                          <Trash2 className="w-4 h-4"/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={e => handleAddOrUpdateExercise(e, day.id)} className="space-y-3 pt-2 border-t border-zinc-800/80">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <input 
                      type="text" 
                      placeholder="Nome Esercizio" 
                      value={editingDayId === day.id ? builderExName : (editingDayId ? '' : builderExName)} 
                      onChange={e => {
                        setBuilderExName(e.target.value);
                        setBuilderMuscleGroup(autoDetectMuscleGroup(e.target.value));
                      }} 
                      className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white" 
                    />
                    <select 
                      value={builderMuscleGroup} 
                      onChange={e => setBuilderMuscleGroup(e.target.value as MuscleGroup)} 
                      className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs text-white font-bold"
                    >
                      {(['Petto', 'Dorso', 'Spalle', 'Quadricipiti', 'Femorali', 'Glutei', 'Bicipiti', 'Tricipiti', 'Polpacci', 'Addome'] as MuscleGroup[]).map(mg => (
                        <option key={mg} value={mg}>{mg}</option>
                      ))}
                    </select>
                    <input type="number" placeholder="Serie" value={builderSets} onChange={e => setBuilderSets(Number(e.target.value))} className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white" />
                    <input type="text" placeholder="Reps" value={builderReps} onChange={e => setBuilderReps(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white" />
                    <input type="text" placeholder="Carico Target" value={builderWeight} onChange={e => setBuilderWeight(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <select value={builderType} onChange={e => setBuilderType(e.target.value as ExecutionType)} className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs text-white">
                      <option value="REGULAR">Tecnica: REGULAR</option>
                      <option value="SUPERSET">Tecnica: SUPERSET</option>
                      <option value="REST_PAUSE">Tecnica: REST_PAUSE</option>
                      <option value="DROP_SET">Tecnica: DROP_SET</option>
                      <option value="CLUSTER">Tecnica: CLUSTER</option>
                    </select>
                    <input type="text" placeholder="TUT" value={builderTut} onChange={e => setBuilderTut(e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white" />
                    <input type="number" placeholder="Recupero (sec)" value={builderRest} onChange={e => setBuilderRest(Number(e.target.value))} className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white" />
                    <input type="number" step="0.5" placeholder="RPE Target" value={builderRpe} onChange={e => setBuilderRpe(Number(e.target.value))} className="bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white" />
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Note del Coach (opzionale)" 
                      value={editingDayId === day.id ? builderNotes : (editingDayId ? '' : builderNotes)} 
                      onChange={e => setBuilderNotes(e.target.value)} 
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-white" 
                    />
                    {editingExId && editingDayId === day.id ? (
                      <>
                        <button 
                          type="button" 
                          onClick={handleCancelEdit} 
                          className="bg-zinc-700 text-xs font-bold px-3 py-1.5 rounded text-white hover:bg-zinc-600 transition flex-shrink-0 cursor-pointer"
                        >
                          Annulla
                        </button>
                        <button 
                          type="submit" 
                          className="bg-yellow-500 text-xs font-bold px-4 py-1.5 rounded text-black hover:bg-yellow-400 transition flex-shrink-0 cursor-pointer"
                        >
                          Aggiorna
                        </button>
                      </>
                    ) : (
                      <button 
                        type="submit" 
                        className="bg-[#E50914] text-xs font-bold px-4 py-1.5 rounded text-white hover:bg-red-700 transition flex-shrink-0 cursor-pointer"
                      >
                        Aggiungi
                      </button>
                    )}
                  </div>
                </form>
              </div>
            ))}
            <div className="mt-6 pt-4 border-t border-zinc-800 space-y-3">
              {builderSuccessMessage && <div className="bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg text-center font-bold text-xs">{builderSuccessMessage}</div>}
              <button type="button" onClick={handleSaveProgramByCoach} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl uppercase tracking-wider transition shadow-lg cursor-pointer flex items-center justify-center gap-2">
                <span>💾 Salva e Assegna Scheda all'Atleta ({activeAthlete.displayName})</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="text-[#E50914]" /> 
                  Analisi Progressi & Volume {userRole === 'COACH' ? `(${activeAthlete.displayName})` : ''}
                </h2>
                <p className="text-xs text-zinc-400 mt-1">Monitoraggio serie e progressione tonnellaggio.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase block">Serie Complete (Sempre)</span>
                  <span className="text-lg font-black text-white">{totalSetsEver}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800 space-y-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-zinc-800 pb-3 gap-4">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-[#E50914]" /> Volume Settimanale
                  </h3>
                  <span className="text-xs text-zinc-400">Target ottimale: 10 - 20 serie/settimana</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Seleziona Giorno (Filtra Sett/Mese)</label>
                    <input 
                      type="date" 
                      value={analyticsDate}
                      onChange={e => setAnalyticsDate(e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-xs text-white font-bold outline-none focus:border-[#E50914]"
                    />
                  </div>
                  <div className="bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 text-center min-w-[80px]">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">Serie Mensili</span>
                    <span className="text-sm font-black text-blue-400">{monthlySetsCount}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 font-bold bg-zinc-900/50 p-2 rounded text-center border border-zinc-800/50">
                Mostrando i dati per la settimana: <span className="text-white">{startOfWeek.toLocaleDateString('it-IT')} - {endOfWeek.toLocaleDateString('it-IT')}</span> 
                <br/>Mese in corso: <span className="text-white capitalize">{startOfMonth.toLocaleString('it-IT', { month: 'long', year: 'numeric' })}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {(['Petto', 'Dorso', 'Spalle', 'Quadricipiti', 'Femorali', 'Glutei', 'Bicipiti', 'Tricipiti', 'Polpacci', 'Addome'] as MuscleGroup[]).map(mg => {
                  const count = weeklySetsMap[mg] || 0;
                  const maxTarget = 22;
                  const percentage = Math.min(100, Math.round((count / maxTarget) * 100));
                  
                  let statusColor = 'bg-zinc-700';
                  let textColor = 'text-zinc-400';
                  if (count >= 10 && count <= 20) { statusColor = 'bg-emerald-500'; textColor = 'text-emerald-400'; } 
                  else if (count > 20) { statusColor = 'bg-amber-500'; textColor = 'text-amber-400'; } 
                  else if (count > 0) { statusColor = 'bg-blue-500'; textColor = 'text-blue-400'; }

                  return (
                    <div key={mg} className="bg-zinc-900 p-3.5 rounded-lg border border-zinc-800 space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-zinc-200">{mg}</span>
                        <span className={textColor}>{count} Serie / sett</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                        <div className={`h-full ${statusColor} transition-all duration-500`} style={{ width: `${percentage}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-zinc-500">
                        <span>0 serie</span>
                        <span>10 (MEV)</span>
                        <span>20+ (MRV)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800 space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#E50914]" /> Storico Allenamenti & Analisi Intensità</h3>
              {workoutHistory.length === 0 ? (
                <p className="text-xs text-zinc-400 italic">Nessun allenamento registrato.</p>
              ) : (
                <div className="space-y-4">
                  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    {volumeIntensitySeries.length === 0 ? (
                      <p className="text-xs text-zinc-400 italic text-center py-8">Nessun dato sufficiente per il grafico.</p>
                    ) : (
                      <>
                        {(() => {
                          const chartW = 600;
                          const chartH = 160;
                          const padX = 24;
                          const n = volumeIntensitySeries.length;
                          const stepX = n > 1 ? (chartW - padX * 2) / (n - 1) : 0;
                          const xAt = (i: number) => padX + stepX * i;
                          const yVolAt = (v: number) => chartH - (Math.min(1, v / maxHistoryVolume) * (chartH - 20)) - 10;
                          const yIntAt = (pct: number) => chartH - (Math.min(1, pct / 100) * (chartH - 20)) - 10;

                          const volPoints = volumeIntensitySeries.map((s, i) => `${xAt(i)},${yVolAt(s.volume)}`).join(' ');
                          const intensityPointsWithData = volumeIntensitySeries
                            .map((s, i) => (s.avgIntensity !== null ? { x: xAt(i), y: yIntAt(s.avgIntensity) } : null))
                            .filter((p): p is { x: number; y: number } => p !== null);
                          const intPolyline = intensityPointsWithData.map(p => `${p.x},${p.y}`).join(' ');

                          return (
                            <svg viewBox={`0 0 ${chartW} ${chartH + 24}`} className="w-full h-52" preserveAspectRatio="none">
                              {/* Linee guida orizzontali */}
                              {[0, 0.25, 0.5, 0.75, 1].map(f => (
                                <line key={f} x1={padX} x2={chartW - padX} y1={10 + f * (chartH - 20)} y2={10 + f * (chartH - 20)} stroke="#27272a" strokeWidth="1" />
                              ))}

                              {/* Linea Volume (tonnellaggio) */}
                              <polyline points={volPoints} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                              {volumeIntensitySeries.map((s, i) => (
                                <circle key={`vol-${s.key}`} cx={xAt(i)} cy={yVolAt(s.volume)} r="3.5" fill="#3b82f6">
                                  <title>{`${s.dateStr} · Volume: ${s.volume.toLocaleString('it-IT')} kg`}</title>
                                </circle>
                              ))}

                              {/* Linea Intensità media (% 1RM), solo dove disponibile (serve almeno 2 punti per tracciarla) */}
                              {intensityPointsWithData.length >= 2 && (
                                <polyline points={intPolyline} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="4 3" />
                              )}
                              {volumeIntensitySeries.map((s, i) =>
                                s.avgIntensity !== null ? (
                                  <g key={`int-${s.key}`}>
                                    <circle cx={xAt(i)} cy={yIntAt(s.avgIntensity)} r="3.5" fill="#f59e0b">
                                      <title>{`${s.dateStr} · Intensità media: ${s.avgIntensity}% 1RM`}</title>
                                    </circle>
                                    {intensityPointsWithData.length < 2 && (
                                      <text x={xAt(i)} y={yIntAt(s.avgIntensity) - 8} fontSize="9" fill="#f59e0b" textAnchor="middle" fontWeight="bold">
                                        {s.avgIntensity}%
                                      </text>
                                    )}
                                  </g>
                                ) : null
                              )}

                              {/* Etichette data sull'asse X */}
                              {volumeIntensitySeries.map((s, i) => (
                                <text key={`label-${s.key}`} x={xAt(i)} y={chartH + 16} fontSize="9" fill="#a1a1aa" textAnchor="middle" fontFamily="monospace">
                                  {s.dateStr}
                                </text>
                              ))}
                            </svg>
                          );
                        })()}
                        <div className="text-center text-[11px] flex items-center justify-center gap-5 mt-2 font-medium">
                          <span className="flex items-center gap-1.5 text-blue-400"><span className="w-3 h-0.5 rounded-full bg-blue-500 inline-block" /> Volume (kg)</span>
                          <span className="flex items-center gap-1.5 text-amber-400"><span className="w-3 h-0.5 rounded-full bg-amber-500 inline-block" /> Intensità Media (% 1RM)</span>
                        </div>
                        {(() => {
                          const withData = volumeIntensitySeries.filter(s => s.avgIntensity !== null).length;
                          if (withData === 0) {
                            return (
                              <p className="text-[10px] text-zinc-500 italic text-center mt-2">
                                Nessun dato di intensità disponibile per queste sessioni (probabilmente registrate prima del salvataggio dei dettagli serie).
                              </p>
                            );
                          }
                          if (withData === 1) {
                            return (
                              <p className="text-[10px] text-zinc-500 italic text-center mt-2">
                                Solo una sessione con dati di intensità: serve almeno un'altra registrazione completa per tracciare l'andamento.
                              </p>
                            );
                          }
                          return null;
                        })()}
                      </>
                    )}
                  </div>

                  <div className="overflow-x-auto pt-2 space-y-2">
                    <table className="w-full text-xs text-left text-zinc-300">
                      <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] border-b border-zinc-800">
                        <tr>
                          <th className="py-2.5 px-3">Data</th>
                          <th className="py-2.5 px-3">Scheda</th>
                          <th className="py-2.5 px-3 text-right">Volume</th>
                          <th className="py-2.5 px-3 text-center">Azioni</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {workoutHistory.map((item, idx) => {
                           const rowKey = item.id || item._id || `row-${idx}`;
                           const isExpanded = expandedHistoryId === rowKey;
                           return (
                            <React.Fragment key={rowKey}>
                              <tr className="hover:bg-zinc-900/50">
                                <td className="py-2.5 px-3 font-mono text-zinc-400">{item.created_at ? new Date(item.created_at).toLocaleDateString('it-IT') : (item.date || todayIso())}</td>
                                <td className="py-2.5 px-3 font-bold text-white">{item.day_name || item.dayName || 'Allenamento'}</td>
                                <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{(item.total_volume || item.totalVolume || 0).toLocaleString('it-IT')} kg</td>
                                <td className="py-2.5 px-3">
                                  <div className="flex justify-center gap-2">
                                    <button type="button" onClick={() => setExpandedHistoryId(isExpanded ? null : rowKey)} className="bg-zinc-800 hover:bg-zinc-700 text-white px-2 py-1 rounded flex items-center gap-1">
                                      {isExpanded ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>} Dettagli
                                    </button>
                                    {userRole === 'COACH' && (
                                      <button type="button" onClick={() => handleDeleteWorkoutHistory(item.id || item._id)} className="text-zinc-500 hover:text-red-500 p-1"><Trash2 className="w-4 h-4"/></button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr className="bg-zinc-900/40">
                                  <td colSpan={4} className="p-3">
                                    {item.logs && Array.isArray(item.logs) && item.logs.length > 0 ? (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        {item.logs.map((log: any, lIdx: number) => (
                                          <div key={lIdx} className="bg-zinc-900 border border-zinc-800 p-2 rounded text-[11px]">
                                            <div className="font-bold text-white mb-1">{log.exerciseName}</div>
                                            <div className="text-zinc-400 flex justify-between">
                                              <span>{log.weight} kg × {log.reps}</span>
                                              <span className="text-red-400">RPE: {log.rpe}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-[11px] text-zinc-500 italic text-center">Nessun dettaglio delle serie salvato per questo allenamento. Assicurati che lo store Supabase salvi l'array 'logs'.</div>
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
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Trophy className="text-yellow-500"/> Classifica Palestra</h2>
              <div className="space-y-2">
                {leaderboard.map((ath, index) => (
                  <div key={ath.id} className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-zinc-500">#{index + 1}</span>
                      <span className="font-bold text-white">{ath.displayName}</span>
                    </div>
                    <span className="font-black text-yellow-500">{ath.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Medal className="text-yellow-500"/> Trofei & Traguardi</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {achievements.map(ach => (
                  <div key={ach.id} className={`p-4 rounded-lg border flex items-center gap-3 ${ach.unlocked ? 'bg-zinc-900 border-yellow-600/50' : 'bg-zinc-900/40 border-zinc-800 opacity-50'}`}>
                    <span className="text-2xl">{ach.icon}</span>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">{ach.title}{ach.unlocked && <CheckCircle className="w-3.5 h-3.5 text-green-400"/>}</div>
                      <p className="text-xs text-zinc-400 mt-0.5">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && userRole === 'ATHLETE' && (
          <div className="bg-[#1E1E1E] p-6 rounded-xl border border-zinc-800 space-y-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-white"><Settings className="text-[#E50914]"/> Impostazioni Account</h2>
              <p className="text-xs text-zinc-400 mt-1">Gestisci le credenziali del tuo profilo atleta e le opzioni di sicurezza.</p>
            </div>
            {settingsMessage && <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg text-xs font-bold text-zinc-200">{settingsMessage}</div>}
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><Key className="w-4 h-4 text-yellow-500"/> Password e Sicurezza</h3>
              <p className="text-xs text-zinc-400">Invia un link alla tua email per cambiare la tua password.</p>
              <button type="button" onClick={handlePasswordReset} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-4 py-2 rounded-lg border border-zinc-700 transition flex items-center gap-2">Invia Email Recupero Password</button>
            </div>
            <div className="bg-red-950/20 p-4 rounded-xl border border-red-900/50 space-y-3">
              <h3 className="text-sm font-bold text-red-400 flex items-center gap-2"><UserX className="w-4 h-4 text-red-500"/> Zona Pericolo</h3>
              <p className="text-xs text-zinc-400">Rimuovi definitivamente il tuo profilo Atleta.</p>
              <button type="button" onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition flex items-center gap-2">Cancella Definitivamente Account</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}