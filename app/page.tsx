'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  supabase,
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
  Moon, Brain, BatteryCharging, Gauge, CalendarDays, Trash2, History, Settings, Key, UserX, ChevronDown, ChevronUp, Pencil, Target, Users, Bell, Calendar, RefreshCw, Layers
} from 'lucide-react';
import { subscribeUserToPush, sendPushNotification } from '@/lib/push';

import { computeEffectiveLoad, findBodyweightConfig } from '@/lib/lib/bodyweight';
import NotificationBell from '@/components/NotificationBell';
import PersonalRecords from '@/components/PersonalRecords';
import AthleteGoals from '@/components/AthleteGoals';
import CoachDashboard from '@/components/CoachDashboard';

export type DayCount = 2 | 3 | 4 | 5 | 6;
export type UserRole = 'ATHLETE' | 'COACH';
export type ExecutionType = 'REGULAR' | 'SUPERSET' | 'REST_PAUSE' | 'DROP_SET' | 'CLUSTER';
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

export type MacroBlock = 'BLOCCO_1_FORZA' | 'BLOCCO_2_TRASFORMAZIONE' | 'BLOCCO_3_QUALITA';
export type MicroWeek = 1 | 2 | 3 | 4;
export type TopGymStimulus = 'NEURAL' | 'HYPERTROPHIC' | 'METABOLIC';

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
  stimulusType?: TopGymStimulus;
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

export interface SetLog {
  id: string;
  exerciseId: string;
  exerciseName: string;
  muscleGroup?: MuscleGroup;
  weight: number;
  reps: number;
  rpe: number;
  estimated1RM: number;
  volume: number;
  date: string;
  time: string;
  isBodyweight?: boolean;
  externalLoad?: number;
  bodyWeightUsed?: number | null;
  percentageUsed?: number | null;
  bodyweightLoad?: number | null;
  effectiveLoad?: number | null;
  effectiveVolume?: number | null;
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
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const clampDayCount = (n: number): DayCount => (Math.min(6, Math.max(2, n)) as DayCount);

const makeId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const parseSafeDate = (value: any): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const d = new Date(value);
  if (!isNaN(d.getTime())) return d;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return null;
};

export default function TopGymApp() {
  const [user, setUser] = useState<any>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);
  const [profileHeight, setProfileHeight] = useState('');
  const [profileTargetWeight, setProfileTargetWeight] = useState('');
  const [profileGoal, setProfileGoal] = useState('Ipertrofia');
  const [profileExperience, setProfileExperience] = useState('Intermedio');
  const [profileNotes, setProfileNotes] = useState('');
  const [pushLoading, setPushLoading] = useState(false);
  const [showPushBanner, setShowPushBanner] = useState(false);
  const [showDeniedModal, setShowDeniedModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        setShowPushBanner(true);
      }
    }
  }, []);

  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [activeAthleteId, setActiveAthleteId] = useState<string>('');

  const [userRole, setUserRole] = useState<UserRole>('ATHLETE');
  const [showCoachPinModal, setShowCoachPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<
    'workout' | 'readiness' | 'analytics' | 'builder' | 'coachDashboard' | 'leaderboard' | 'records' | 'goals' | 'settings'
  >('workout');

  const [userXp, setUserXp] = useState(0);
  const userXpRef = useRef(0);
  useEffect(() => { userXpRef.current = userXp; }, [userXp]);

  const [soundEnabled, setSoundEnabled] = useState(true);

  // Timer resiliente
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const restEndTimeRef = useRef<number | null>(null);

  // Filtro data calendario
  const [analyticsDate, setAnalyticsDate] = useState(todayIso());

  // METODO TOPGYM
  const [currentBlock, setCurrentBlock] = useState<MacroBlock>('BLOCCO_1_FORZA');
  const [manualWeek, setManualWeek] = useState<MicroWeek | null>(null);

  // Readiness
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
  const [isSavingWorkout, setIsSavingWorkout] = useState(false);

  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  const [readinessHistory, setReadinessHistory] = useState<ReadinessLog[]>([]);
  const [readinessLoadError, setReadinessLoadError] = useState<string | null>(null);

  const [programName, setProgramName] = useState('Scheda Metodo TOPGYM');
  const [programDays, setProgramDays] = useState<WorkoutDay[]>([]);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [currentExId, setCurrentExId] = useState('ex1');

  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('8');
  const [logs, setLogs] = useState<SetLog[]>([]);

  // State Builder
  const [builderExName, setBuilderExName] = useState('');
  const [builderMuscleGroup, setBuilderMuscleGroup] = useState<MuscleGroup>('Petto');
  const [builderStimulus, setBuilderStimulus] = useState<TopGymStimulus>('HYPERTROPHIC');
  const [builderSets, setBuilderSets] = useState(3);
  const [builderReps, setBuilderReps] = useState('8-10');
  const [builderWeight, setBuilderWeight] = useState('0');
  const [builderRpe, setBuilderRpe] = useState(8);
  const [builderRest, setBuilderRest] = useState(90);
  const [builderType, setBuilderType] = useState<ExecutionType>('REGULAR');
  const [builderTut, setBuilderTut] = useState('2-0-1-0');
  const [builderNotes, setBuilderNotes] = useState('');
  const [editingDayId, setEditingDayId] = useState<string | null>(null);
  const [editingExId, setEditingExId] = useState<string | null>(null);

  const handleApplyTopGymPreset = (stimulus: TopGymStimulus) => {
    setBuilderStimulus(stimulus);
    if (stimulus === 'NEURAL') {
      setBuilderSets(4);
      setBuilderReps('4-6');
      setBuilderRpe(8);
      setBuilderRest(180);
      setBuilderType('REGULAR');
      setBuilderTut('2-0-X-0');
      setBuilderNotes('Metodo TOPGYM: Spinta esplosiva sui fondamentali, RIR 2, no cedimento.');
    } else if (stimulus === 'HYPERTROPHIC') {
      setBuilderSets(3);
      setBuilderReps('8-10');
      setBuilderRpe(8.5);
      setBuilderRest(90);
      setBuilderType('REGULAR');
      setBuilderTut('2-0-1-0');
      setBuilderNotes('Metodo TOPGYM: Tensione continua, cedimento eventuale solo all\'ultima serie.');
    } else {
      setBuilderSets(3);
      setBuilderReps('12-15');
      setBuilderRpe(10);
      setBuilderRest(60);
      setBuilderType('DROP_SET');
      setBuilderTut('2-0-1-1');
      setBuilderNotes('Metodo TOPGYM: Stress metabolico/pompaggio, cedimento concentrico reale.');
    }
  };

  const handleStartEditExercise = (dayId: string, ex: Exercise) => {
    setEditingDayId(dayId);
    setEditingExId(ex.id);
    setBuilderExName(ex.name);
    setBuilderMuscleGroup(ex.muscleGroup || autoDetectMuscleGroup(ex.name));
    setBuilderStimulus(ex.stimulusType || 'HYPERTROPHIC');
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
    setBuilderWeight('0');
    setBuilderRpe(8);
    setBuilderRest(90);
    setBuilderType('REGULAR');
    setBuilderTut('2-0-1-0');
  };

  const handleApplyDeloadWeekToProgram = () => {
    if (!window.confirm('Vuoi convertire la scheda in SETTIMANA DI DELOAD (-40% volume, RIR 3-4, nessuna tecnica d\'intensità)?')) return;
    setProgramDays(prevDays => prevDays.map(day => ({
      ...day,
      exercises: day.exercises.map(ex => ({
        ...ex,
        sets: Math.max(2, Math.round(ex.sets * 0.6)),
        rpeTarget: 6.5,
        executionType: 'REGULAR',
        notes: (ex.notes ? ex.notes + ' · ' : '') + 'SETTIMANA DI DELOAD: Volume ridotto, focus tecnico, nessun cedimento.'
      }))
    })));
    setManualWeek(4);
    setBuilderSuccessMessage('✅ Scheda convertita in Settimana di Deload (Week 4)!');
    setTimeout(() => setBuilderSuccessMessage(null), 4000);
  };

  const displayUserName = user?.user_metadata?.username || (user?.email ? user.email.split('@')[0] : 'Atleta');
  const targetUserId = userRole === 'COACH' ? (activeAthleteId || user?.id || 'default-user') : (user?.id || 'default-user');
  const targetAthleteName = useMemo(
    () => athletes.find(a => a.id === targetUserId)?.displayName ?? 'Atleta',
    [athletes, targetUserId]
  );

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
        setProgramName(`Scheda TOPGYM - ${targetAthleteName}`);
      }
    }).catch(() => {
      if (isMounted) setProgramDays([]);
    });
    loadHistory(targetUserId);
    loadReadinessHistory(targetUserId);
    return () => { isMounted = false; };
  }, [targetUserId, userRole, targetAthleteName, loadHistory, loadReadinessHistory]);

  const handleAuth = async (e: React.SyntheticEvent) => {
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

  useEffect(() => {
    if (!user?.id || !supabase) return;
    supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
      if (data) {
        if (data.username) setUsername(data.username);
        if (data.height) setProfileHeight(String(data.height));
        if (data.target_weight) setProfileTargetWeight(String(data.target_weight));
        if (data.training_goal) setProfileGoal(data.training_goal);
        if (data.experience_level) setProfileExperience(data.experience_level);
        if (data.physical_notes) setProfileNotes(data.physical_notes);
      }
    });
  }, [user?.id]);

  const handleUpdateProfile = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!user?.id || !supabase) return;

    await supabase.auth.updateUser({
      data: { username: username.trim() }
    });

    const { error } = await supabase.from('profiles').update({
      username: username.trim(),
      height: profileHeight ? parseFloat(profileHeight) : null,
      target_weight: profileTargetWeight ? parseFloat(profileTargetWeight) : null,
      training_goal: profileGoal,
      experience_level: profileExperience,
      physical_notes: profileNotes.trim()
    }).eq('id', user.id);

    if (error) {
      setSettingsMessage(`⚠️ Errore salvataggio: ${error.message}`);
    } else {
      setSettingsMessage('✅ Profilo aggiornato con successo!');
      setTimeout(() => setSettingsMessage(null), 3000);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email || !supabase) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, { redirectTo: window.location.origin });
    setSettingsMessage(error ? `⚠️ Errore: ${error.message}` : '📩 Email per il recupero password inviata con successo!');
  };

  const handlePushActivation = async () => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'denied') {
      setShowDeniedModal(true);
      return;
    }
    if (!user?.id) return;
    setPushLoading(true);
    const res = await subscribeUserToPush(user.id, supabase);
    if (!res.success && (res.message.includes('bloccate') || res.message.includes('rifiutato'))) {
      setShowDeniedModal(true);
    } else {
      if (res.success) setShowPushBanner(false);
      setSettingsMessage(res.message);
      setTimeout(() => setSettingsMessage(null), 5000);
    }
    setPushLoading(false);
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
    } catch {
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
      osc.onended = () => { audioCtx.close().catch(() => {}); };
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([200, 100, 200]);
    } catch {
      console.log('Audio non abilitato');
    }
  }, [soundEnabled]);

  const updateTimerRemaining = useCallback(() => {
    if (!restEndTimeRef.current) return;
    const remainingMs = restEndTimeRef.current - Date.now();
    const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
    setRestTimer(remainingSec);
    if (remainingSec <= 0) {
      restEndTimeRef.current = null;
      setIsTimerRunning(false);
      playTimerSound();
    }
  }, [playTimerSound]);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(updateTimerRemaining, 1000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') updateTimerRemaining();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isTimerRunning, updateTimerRemaining]);

  const startRestTimer = (seconds: number) => {
    if (seconds <= 0) return;
    restEndTimeRef.current = Date.now() + seconds * 1000;
    setRestTimer(seconds);
    setIsTimerRunning(true);
  };

  // APERTURA DIRETTA E ROBUSTA DELLA MODALE PIN AL CLICK SU COACH
  const handleRoleSwitchRequest = (targetRole: UserRole) => {
    if (targetRole === 'COACH') {
      setShowCoachPinModal(true);
    } else {
      setUserRole('ATHLETE');
      if (activeTab === 'builder' || activeTab === 'coachDashboard') {
        setActiveTab('workout');
      }
    }
  };

  // PIN COACH ACCESSIBILE CON 1234
  const verifyCoachPin = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '1234' || pinInput.trim() === 'admin') {
      setUserRole('COACH');
      setShowCoachPinModal(false);
      setPinInput('');
      setPinError(false);
      if (activeTab === 'workout') setActiveTab('builder');
    } else {
      setPinError(true);
    }
  };

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

  const calculate1RM = (w: number, r: number) => (r === 1 ? w : Math.round(w * (1 + r / 30)));

  const calculateEstimated1RM = useCallback((weightVal: number, repsVal: number, rpeVal?: number): number | null => {
    if (!Number.isFinite(weightVal) || weightVal <= 0 || !Number.isFinite(repsVal) || repsVal <= 0) return null;
    if (rpeVal !== undefined && Number.isFinite(rpeVal) && repsVal <= 10) {
      const row = RPE_PERCENT_1RM_TABLE[String(rpeVal)];
      if (row) {
        const pct = row[Math.round(repsVal) - 1];
        if (pct > 0) return Math.round(weightVal / (pct / 100));
      }
    }
    return calculate1RM(weightVal, repsVal);
  }, []);

  const allLoggedSets = useMemo(() => {
    const items: { exerciseName: string; weight: number; estimated1RM: number }[] = [];
    logs.forEach(l => {
      const w = l.effectiveLoad !== null && l.effectiveLoad !== undefined ? l.effectiveLoad : l.weight;
      if (w > 0 && l.reps > 0) {
        items.push({
          exerciseName: l.exerciseName,
          weight: w,
          estimated1RM: l.estimated1RM || calculate1RM(w, l.reps)
        });
      }
    });
    workoutHistory.forEach(w => {
      if (Array.isArray(w.logs)) {
        w.logs.forEach((l: any) => {
          const weightVal = Number(l.effectiveLoad !== null && l.effectiveLoad !== undefined ? l.effectiveLoad : l.weight) || 0;
          const repsVal = Number(l?.reps) || 0;
          if (weightVal > 0 && repsVal > 0) {
            items.push({
              exerciseName: l.exerciseName || '',
              weight: weightVal,
              estimated1RM: Number(l.estimated1RM) || calculate1RM(weightVal, repsVal)
            });
          }
        });
      }
    });
    return items;
  }, [logs, workoutHistory]);

  const best1RMByExercise = useMemo(() => {
    const map = new Map<string, number>();
    allLoggedSets.forEach(({ exerciseName, estimated1RM }) => {
      if (!exerciseName) return;
      if (estimated1RM > (map.get(exerciseName) || 0)) map.set(exerciseName, estimated1RM);
    });
    return map;
  }, [allLoggedSets]);

  const getIntensityInfo = useCallback((exerciseName: string, weightVal: number) => {
    const best1RM = best1RMByExercise.get(exerciseName);
    if (!best1RM || best1RM <= 0 || !weightVal) return null;
    const pct = Math.round((weightVal / best1RM) * 100);
    let label = 'Attivazione';
    let colorClasses = 'bg-zinc-800 text-zinc-300 border-zinc-700';
    if (pct >= 90) { label = 'Massimale'; colorClasses = 'bg-rose-950/80 text-rose-300 border-rose-800/80'; }
    else if (pct >= 75) { label = 'Forza'; colorClasses = 'bg-amber-950/80 text-amber-300 border-amber-800/80'; }
    else if (pct >= 55) { label = 'Ipertrofia'; colorClasses = 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'; }
    return { pct, label, colorClasses };
  }, [best1RMByExercise]);

  const estimated1RMPreview = useMemo(() => {
    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    const rpeVal = parseFloat(rpe);
    if (!Number.isFinite(w) || !Number.isFinite(r) || w <= 0 || r <= 0) return null;
    return calculateEstimated1RM(w, r, Number.isFinite(rpeVal) ? rpeVal : undefined);
  }, [weight, reps, rpe, calculateEstimated1RM]);

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

  const sessionBodyWeight = useMemo(() => {
    const todayLog = readinessHistory.find(r => r.date === todayIso() && r.bodyWeight && r.bodyWeight > 0);
    if (todayLog?.bodyWeight) return todayLog.bodyWeight;
    const latestValid = readinessHistory.find(r => r.bodyWeight && r.bodyWeight > 0);
    return latestValid?.bodyWeight || null;
  }, [readinessHistory]);

  const currentBodyweightConfig = useMemo(() => {
    if (!currentExercise) return null;
    return findBodyweightConfig(currentExercise.name);
  }, [currentExercise]);

  const lastLoggedSet = useMemo(() => {
    if (!currentExercise) return null;
    const fromToday = logs.find(l => l.exerciseName === currentExercise.name);
    if (fromToday) return fromToday;
    for (const w of workoutHistory) {
      if (Array.isArray(w.logs)) {
        const found = w.logs.find((l: any) => l.exerciseName === currentExercise.name);
        if (found) return found;
      }
    }
    return null;
  }, [currentExercise, logs, workoutHistory]);

  const handleAutoFillLastLog = () => {
    if (lastLoggedSet) {
      setWeight((lastLoggedSet.externalLoad !== undefined ? lastLoggedSet.externalLoad : lastLoggedSet.weight).toString());
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

  const handleSaveReadiness = async (e: React.SyntheticEvent) => {
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

  const todayLogs = useMemo(() => logs.filter(l => l.date === todayIso()), [logs]);

  const handleFinishAndSaveWorkout = async () => {
    if (isSavingWorkout) return;
    setIsSavingWorkout(true);

    const dayName = activeDay ? activeDay.title : 'Giornata di Allenamento';
    const totalVol = todayLogs.reduce((acc, curr) => acc + (curr.effectiveVolume || curr.volume), 0) || 0;
    
    let result: { success?: boolean; error?: string } = {};
    try {
      result = await saveCompletedWorkoutToSupabase({
        userId: targetUserId,
        dayName,
        totalVolume: totalVol,
        exercisesCount: activeRoutine.length,
        logs: todayLogs
      });
    } catch (e: any) {
      result = { success: false, error: e?.message };
    } finally {
      setIsSavingWorkout(false);
    }

    if (result?.success) {
      await addXp(50);
      setWorkoutSuccessMessage('🎉 Allenamento completato e salvato! +50 XP');
      setLogs([]); // Svuota immediatamente i log locali per evitare doppi conteggi
      await loadHistory(targetUserId);
      setTimeout(() => setWorkoutSuccessMessage(null), 4000);
    } else {
      const detail = result?.error ? ` (${result.error})` : '';
      setWorkoutSuccessMessage(`⚠️ Errore nel salvataggio dell'allenamento${detail}. Riprova.`);
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
      setBuilderSuccessMessage(`✅ Scheda salvata e assegnata con successo a ${activeAthlete.displayName}!`);
      if (supabase && targetId) {
        try {
          await supabase.from('notifications').insert([{
            user_id: targetId,
            title: 'Nuova Scheda Metodo TOPGYM!',
            message: `Il coach ha assegnato o aggiornato il programma "${programName}".`,
            type: 'program_assigned'
          }]);
        } catch {}
      }
      if (targetId && targetId !== 'default-user') {
        try {
          await sendPushNotification(
            targetId,
            'Nuova Scheda Assegnata! 🏋️',
            `Il Coach ha aggiornato il tuo programma Metodo TOPGYM (${programName || 'Nuova scheda'}).`,
            '/'
          );
        } catch {}
      }
      setTimeout(() => setBuilderSuccessMessage(null), 4000);
    } else {
      const detail = result?.error ? ` (${result.error})` : '';
      setBuilderSuccessMessage(`⚠️ Errore durante il salvataggio della scheda${detail}.`);
      setTimeout(() => setBuilderSuccessMessage(null), 8000);
    }
  };

  const handleLogSet = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const numWeight = parseFloat(weight);
    const numReps = parseInt(reps, 10);
    const numRpe = parseFloat(rpe);

    if (isNaN(numWeight) || numWeight < 0 || isNaN(numReps) || numReps <= 0) return;

    const exName = currentExercise?.name || 'Esercizio';
    const effectiveCalc = computeEffectiveLoad(exName, numWeight, numReps, sessionBodyWeight);
    const calc1RMWeight = effectiveCalc.effectiveLoad !== null ? effectiveCalc.effectiveLoad : numWeight;
    const estimated1RM = calculateEstimated1RM(calc1RMWeight, numReps, numRpe) || calculate1RM(calc1RMWeight, numReps);

    const newLog: SetLog = {
      id: makeId(),
      exerciseId: currentExercise?.id || currentExId,
      exerciseName: exName,
      muscleGroup: currentExercise?.muscleGroup || autoDetectMuscleGroup(exName),
      weight: numWeight,
      reps: numReps,
      rpe: numRpe,
      estimated1RM,
      volume: numWeight * numReps,
      date: todayIso(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isBodyweight: effectiveCalc.isBodyweight,
      externalLoad: effectiveCalc.externalLoad,
      bodyWeightUsed: effectiveCalc.bodyWeightUsed,
      percentageUsed: effectiveCalc.percentageUsed,
      bodyweightLoad: effectiveCalc.bodyweightLoad,
      effectiveLoad: effectiveCalc.effectiveLoad,
      effectiveVolume: effectiveCalc.effectiveVolume
    };

    setLogs(prev => [newLog, ...prev]);
    void addXp(10);
    if (currentExercise?.restSeconds) startRestTimer(currentExercise.restSeconds);
    setWeight('');
    setReps('');
  };

  const handleDeleteLog = (logId: string) => setLogs(prev => prev.filter(l => l.id !== logId));

  const handleAddOrUpdateExercise = (e: React.SyntheticEvent, dayId: string) => {
    e.preventDefault();
    if (!builderExName.trim()) return;

    if (editingExId && editingDayId === dayId) {
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
                      stimulusType: builderStimulus,
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
      const newEx: Exercise = {
        id: crypto.randomUUID(),
        name: builderExName.trim(),
        muscleGroup: builderMuscleGroup || autoDetectMuscleGroup(builderExName),
        stimulusType: builderStimulus,
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
      case 'SUPERSET': return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'REST_PAUSE': return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'DROP_SET': return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'CLUSTER': return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      default: return 'bg-zinc-800/80 text-zinc-400 border-zinc-700/50';
    }
  };

  const userLevel = Math.min(99, Math.floor(Math.sqrt(userXp / 25)));
  const userRank = getRankTitle(userLevel);
  const xpForNextLevel = 25 * Math.pow(userLevel + 1, 2);
  const xpForCurrentLevel = 25 * Math.pow(userLevel, 2);
  const levelProgressPercentage = userLevel >= 99 ? 100 : Math.min(100, Math.round(((userXp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100));

  const latestReadiness = readinessHistory[0];
  const recentRpeLogs = logs.slice(0, 4);
  const highFatigueDetected = recentRpeLogs.length >= 2 && recentRpeLogs.every(l => l.rpe >= 9.5);

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

  // 1. CALENDARIO SETTIMANALE SCIENTIFICO (DA LUNEDÌ A DOMENICA)
  const { startOfWeek, endOfWeek, startOfMonth, endOfMonth } = useMemo(() => {
    const targetDate = parseSafeDate(analyticsDate) || new Date();
    const dayOfWeek = targetDate.getDay();
    const diffToMonday = targetDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startW = new Date(targetDate);
    startW.setDate(diffToMonday);
    startW.setHours(0, 0, 0, 0);
    const endW = new Date(startW);
    endW.setDate(startW.getDate() + 6);
    endW.setHours(23, 59, 59, 999);

    const startM = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const endM = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);

    return { startOfWeek: startW, endOfWeek: endW, startOfMonth: startM, endOfMonth: endM };
  }, [analyticsDate]);

  // 2. CONTEGGIO SERIE REALE PER DISTRETTO (DEDUPLICAZIONE RIGOROSA SENZA FALSI DOPPI)
  const weeklyMuscleSetsMap = useMemo(() => {
    const map: Record<MuscleGroup, number> = {
      Petto: 0, Dorso: 0, Spalle: 0, Quadricipiti: 0,
      Femorali: 0, Glutei: 0, Bicipiti: 0, Tricipiti: 0,
      Polpacci: 0, Addome: 0
    };

    const startMs = startOfWeek.getTime();
    const endMs = endOfWeek.getTime();
    const countedSetIds = new Set<string>();

    // 1. Considera i log dell'allenamento attualmente in corso
    logs.forEach(l => {
      const d = parseSafeDate(l.date);
      if (d && d.getTime() >= startMs && d.getTime() <= endMs) {
        countedSetIds.add(l.id);
        const mg = (l.muscleGroup || autoDetectMuscleGroup(l.exerciseName || '')) as MuscleGroup;
        if (mg && typeof map[mg] === 'number') map[mg] += 1;
      }
    });

    // 2. Considera gli allenamenti già salvati nello storico di Supabase (escludendo doppioni di ID)
    workoutHistory.forEach(w => {
      const wDate = parseSafeDate(w.created_at || w.date);
      if (wDate && wDate.getTime() >= startMs && wDate.getTime() <= endMs && Array.isArray(w.logs)) {
        w.logs.forEach((log: any, index: number) => {
          const uniqueKey = log.id || `${w.id || w._id}-${log.exerciseName}-${index}`;
          if (!countedSetIds.has(uniqueKey)) {
            countedSetIds.add(uniqueKey);
            const mg = (log?.muscleGroup || autoDetectMuscleGroup(log?.exerciseName || '')) as MuscleGroup;
            if (mg && typeof map[mg] === 'number') map[mg] += 1;
          }
        });
      }
    });

    return map;
  }, [logs, workoutHistory, startOfWeek, endOfWeek]);

  // 3. CALCOLO AUTOMATICO SETTIMANA (MICROCICLO 1 -> 2 -> 3 -> 4)
  const calculatedCurrentWeek: MicroWeek = useMemo(() => {
    if (manualWeek !== null) return manualWeek;
    const daysInRoutine = Math.max(1, programDays.length || 4);
    const completedCount = workoutHistory.length;
    const computed = Math.floor(completedCount / daysInRoutine) + 1;
    const clamped = Math.min(4, Math.max(1, computed)) as MicroWeek;
    return clamped;
  }, [manualWeek, programDays.length, workoutHistory.length]);

  const allSetsWithDate = useMemo(() => {
    const items: { name: string; date: Date | null }[] = [];
    logs.forEach(log => items.push({ name: log.exerciseName, date: parseSafeDate(log.date) }));
    workoutHistory.forEach(workout => {
      if (Array.isArray(workout.logs)) {
        const wDate = parseSafeDate(workout.created_at || workout.date);
        workout.logs.forEach((log: any) => items.push({ name: log?.exerciseName || '', date: wDate }));
      }
    });
    return items;
  }, [logs, workoutHistory]);

  const monthlySetsCount = useMemo(
    () => allSetsWithDate.reduce(
      (count, { date }) => (date && date >= startOfMonth && date <= endOfMonth ? count + 1 : count),
      0
    ),
    [allSetsWithDate, startOfMonth, endOfMonth]
  );

  const totalSetsEver = useMemo(
    () => workoutHistory.reduce((s, w) => s + (Array.isArray(w.logs) ? w.logs.length : 0), 0) + logs.length,
    [workoutHistory, logs]
  );

  const maxHistoryVolume = useMemo(
    () => workoutHistory.reduce((max, w) => Math.max(max, w.total_volume || w.totalVolume || 0), 0) || 1,
    [workoutHistory]
  );

  const volumeIntensitySeries = useMemo(() => {
    const sessions = workoutHistory.slice(0, 12).reverse();
    return sessions.map((item, idx) => {
      const volume = item.total_volume || item.totalVolume || 0;
      const sessionLogs = Array.isArray(item.logs) ? item.logs : [];
      const intensities = sessionLogs
        .map((l: any) => {
          const best = best1RMByExercise.get(l?.exerciseName);
          const w = Number(l?.effectiveLoad !== null && l?.effectiveLoad !== undefined ? l.effectiveLoad : l?.weight) || 0;
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

  const getMicroWeekDescription = (week: MicroWeek) => {
    switch (week) {
      case 1: return { title: 'Week 1 · Intro & Accumulo', desc: 'RIR 2 (buffer 2 reps). Esegui con carichi target senza arrivare al limite.' };
      case 2: return { title: 'Week 2 · Sovraccarico Progressivo', desc: 'RIR 1-2. Spingi per incrementare 1 ripetizione o carico (+1-2.5 kg).' };
      case 3: return { title: 'Week 3 · Overreaching Controllato', desc: 'RIR 0 sull\'ultima serie. Massima spremitura muscolare prima del riposo.' };
      case 4: return { title: 'Week 4 · Deload / Scarico Attivo', desc: '-40% Volume (2 serie per esercizio), RIR 3-4, nessuna tecnica d\'intensità. Dissipa la fatica sistemica.' };
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090A0D] p-4 text-white font-sans">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12151B]/95 backdrop-blur-xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E50914] to-red-600 flex items-center justify-center shadow-lg mb-3">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-wider uppercase">TOP GYM</h1>
            <p className="text-xs text-zinc-400 mt-1">PWA Gestione Allenamenti & Coaching</p>
          </div>
          {errorMessage && (
            <div className="mb-4 rounded-xl bg-rose-500/10 p-3 text-xs text-rose-300 border border-rose-500/20">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl bg-zinc-900/90 p-3 text-sm text-white border border-white/10 outline-none focus:border-[#E50914]"
                placeholder="Nome Atleta"
              />
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-zinc-900/90 p-3 text-sm text-white border border-white/10 outline-none focus:border-[#E50914]"
              placeholder="Email"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-zinc-900/90 p-3 text-sm text-white border border-white/10 outline-none focus:border-[#E50914]"
              placeholder="Password"
            />
            <button type="submit" className="w-full rounded-xl bg-[#E50914] py-3.5 font-bold uppercase text-sm text-white hover:brightness-110 cursor-pointer">
              {isSignUp ? 'Crea Account' : 'Accedi'}
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-zinc-400">
            <button type="button" onClick={() => { setIsSignUp(!isSignUp); setErrorMessage(''); }} className="hover:text-white">
              {isSignUp ? 'Hai già un account? Accedi' : 'Registrati'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090A0D] text-white font-sans p-3 sm:p-5 md:p-8">
      {/* HEADER COMPLETO CON SELETTORE ATLETA COACH INTEGRATO */}
      <header className="max-w-6xl mx-auto bg-[#12151B]/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/10 shadow-xl mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E50914] to-red-700 flex items-center justify-center shadow-md">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-wider uppercase leading-none">TOP GYM</h1>
                <p className="text-[11px] text-zinc-400 mt-1">Utente: <span className="text-white font-bold">{displayUserName}</span></p>
              </div>
            </div>

            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 text-xs font-semibold">
              <button
                onClick={() => handleRoleSwitchRequest('ATHLETE')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${userRole === 'ATHLETE' ? 'bg-[#E50914] text-white shadow font-bold' : 'text-zinc-400 hover:text-white'}`}
              >
                <Eye className="w-3.5 h-3.5" /> Atleta
              </button>
              <button
                onClick={() => handleRoleSwitchRequest('COACH')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${userRole === 'COACH' ? 'bg-[#E50914] text-white shadow font-bold' : 'text-zinc-400 hover:text-white'}`}
              >
                {userRole === 'COACH' ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-zinc-400" />} Coach
              </button>
            </div>

            {/* SELETTORE ATLETA NELL'HEADER PER IL COACH */}
            {userRole === 'COACH' && (
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                <span className="text-zinc-400 text-xs">Gestisci Atleta:</span>
                <select
                  value={activeAthleteId}
                  onChange={e => setActiveAthleteId(e.target.value)}
                  className="bg-zinc-900 border border-white/10 text-white text-xs rounded-lg px-2 py-1 font-bold outline-none cursor-pointer"
                >
                  {athletes.map(ath => (
                    <option key={ath.id} value={ath.id}>{ath.displayName}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end flex-wrap">
            {restTimer !== null && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono font-bold">
                <Timer className="w-4 h-4 animate-pulse" />
                <span>{Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, '0')}</span>
              </div>
            )}

            {latestReadiness && (
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 text-xs">
                <Gauge className={`w-4 h-4 ${latestReadiness.readinessScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`} />
                <div>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase block leading-none">Readiness</span>
                  <b className="text-white text-xs font-mono leading-tight">{latestReadiness.readinessScore}%</b>
                </div>
              </div>
            )}

            {/* WIDGET RANGO & XP PROGRESS BAR */}
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 text-xs">
              <Shield className="text-amber-400 w-4 h-4 flex-shrink-0" />
              <div className="w-28 sm:w-32">
                <div className="text-[9px] text-amber-400 font-black uppercase tracking-wider truncate">
                  {userRank}
                </div>
                <div className="flex justify-between items-center text-[9px] text-zinc-400 font-bold">
                  <span>Lvl {userLevel}/99</span>
                  <span className="font-mono">{userXp} XP</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-0.5 overflow-hidden">
                  <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${levelProgressPercentage}%` }} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <NotificationBell userId={targetUserId} onNavigateToWorkout={() => setActiveTab('workout')} />
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 bg-black/40 hover:bg-zinc-800 border border-white/5 rounded-xl text-zinc-400 hover:text-white transition"
                title="Suoni"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
              </button>
              <button onClick={handleLogout} className="text-xs font-semibold text-zinc-400 hover:text-rose-400 bg-black/40 border border-white/5 px-2.5 py-2 rounded-xl">
                <LogOut className="w-4 h-4 text-rose-500 inline" /> Esci
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* PIN COACH MODAL APRIBILE CON Z-INDEX MASSIMO */}
      {showCoachPinModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
          <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Lock className="text-[#E50914] w-5 h-5" /> Area Riservata Coach
            </h3>
            <p className="text-xs text-zinc-400">Inserisci il PIN per accedere alla gestione coach.</p>
            <form onSubmit={verifyCoachPin} className="space-y-4">
              <input
                type="password"
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                placeholder="PIN"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-center text-xl font-mono text-white outline-none focus:border-[#E50914]"
                autoFocus
              />
              {pinError && <p className="text-xs text-rose-500 text-center font-bold">PIN Errato!</p>}
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => { setShowCoachPinModal(false); setPinInput(''); setPinError(false); }} 
                  className="w-1/2 bg-zinc-800 py-2.5 rounded-xl text-xs font-bold text-zinc-300"
                >
                  Annulla
                </button>
                <button type="submit" className="w-1/2 bg-[#E50914] py-2.5 rounded-xl text-xs font-bold text-white uppercase hover:brightness-110">
                  Sblocca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-[#12151B]/80 backdrop-blur-md border border-white/10 rounded-2xl scrollbar-none shadow-lg">
          {userRole === 'ATHLETE' && (
            <button
              onClick={() => setActiveTab('workout')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'workout' ? 'bg-[#E50914] text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
            >
              <Dumbbell className="w-4 h-4" /> Allenamento
            </button>
          )}
          <button
            onClick={() => setActiveTab('readiness')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'readiness' ? 'bg-[#E50914] text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
          >
            <Gauge className="w-4 h-4 text-emerald-400" /> Check Readiness
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'records' ? 'bg-[#E50914] text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
          >
            <Trophy className="w-4 h-4 text-amber-400" /> Record Personali
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'goals' ? 'bg-[#E50914] text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
          >
            <Target className="w-4 h-4 text-rose-400" /> Obiettivi
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-[#E50914] text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
          >
            <TrendingUp className="w-4 h-4 text-blue-400" /> Progressi
          </button>
          {userRole === 'COACH' && (
            <>
              <button
                onClick={() => setActiveTab('coachDashboard')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'coachDashboard' ? 'bg-[#E50914] text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
              >
                <Users className="w-4 h-4 text-indigo-400" /> Dashboard Atleti
              </button>
              <button
                onClick={() => setActiveTab('builder')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'builder' ? 'bg-[#E50914] text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
              >
                <UserCheck className="w-4 h-4 text-emerald-400" /> Gestisci Scheda (Metodo TOPGYM)
              </button>
            </>
          )}
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'leaderboard' ? 'bg-[#E50914] text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
          >
            <Medal className="w-4 h-4 text-amber-400" /> Classifica & Badge
          </button>
          {userRole === 'ATHLETE' && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-[#E50914] text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
            >
              <Settings className="w-4 h-4 text-zinc-300" /> Impostazioni
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        {/* Banner Notifiche per Atleta */}
        {showPushBanner && userRole === 'ATHLETE' && (
          <div className="bg-gradient-to-r from-red-950/60 to-[#12151B] border border-[#E50914]/60 p-4 rounded-2xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#E50914] text-white rounded-xl shadow">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Attiva gli avvisi delle Schede!</h4>
                <p className="text-xs text-zinc-300">
                  Ricevi un avviso sul telefono quando il Coach aggiorna i tuoi allenamenti o carichi.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowPushBanner(false)}
                className="px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white"
              >
                Più tardi
              </button>
              <button
                type="button"
                disabled={pushLoading}
                onClick={handlePushActivation}
                className="w-full sm:w-auto bg-[#E50914] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                {pushLoading ? 'Attivazione...' : 'Attiva con 1 Click'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: WORKOUT (CON SETTIMANA CALCOLATA AUTOMATICAMENTE) */}
        {activeTab === 'workout' && userRole === 'ATHLETE' && (
          <div className="space-y-6">
            {highFatigueDetected && (
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3 text-amber-300 backdrop-blur-md">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-amber-200">Livello di Fatica Accumulata Elevato!</h4>
                  <p className="text-xs text-amber-300/80 mt-1">Hai registrato serie consecutive ad RPE 9.5+. Considera di estendere il recupero di 30s.</p>
                </div>
              </div>
            )}

            {/* Banner Metodo TOPGYM con Settimana Calcolata in Automatico */}
            <div className="bg-gradient-to-r from-red-950/40 via-zinc-900 to-[#12151B] border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] text-[#E50914] font-black uppercase tracking-wider block">
                  Metodo TOPGYM · {currentBlock === 'BLOCCO_1_FORZA' ? 'Blocco 1: Forza Ipertrofica' : currentBlock === 'BLOCCO_2_TRASFORMAZIONE' ? 'Blocco 2: Trasformazione' : 'Blocco 3: Qualità (Cut)'}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">{getMicroWeekDescription(calculatedCurrentWeek).title}</h4>
                <p className="text-xs text-zinc-400 mt-0.5">{getMicroWeekDescription(calculatedCurrentWeek).desc}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 text-amber-400 block">
                  Settimana {calculatedCurrentWeek} / 4 (Automatica)
                </span>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  {workoutHistory.length} sessioni completate
                </span>
              </div>
            </div>

            <div className="bg-[#12151B]/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl">
              <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <Dumbbell className="text-[#E50914] w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Scheda Attiva</span>
                    <h2 className="text-lg sm:text-xl font-black text-white">{programName}</h2>
                  </div>
                </div>
              </div>

              {/* Bottoni Giorni */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
                {programDays.map((day, index) => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => { setSelectedDayIndex(index); if (day.exercises[0]) setCurrentExId(day.exercises[0].id); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${selectedDayIndex === index ? 'bg-[#E50914] border-[#E50914] text-white shadow-md' : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-white'}`}
                  >
                    Giorno {day.dayNumber} · {day.title}
                  </button>
                ))}
              </div>

              {/* Card Esercizi */}
              <div className="grid gap-3 sm:grid-cols-2">
                {activeRoutine.map((ex) => {
                  const isBw = !!findBodyweightConfig(ex.name);
                  const isCurrent = currentExId === ex.id;
                  return (
                    <div 
                      key={ex.id} 
                      onClick={() => setCurrentExId(ex.id)} 
                      className={`p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${isCurrent ? 'bg-zinc-900/90 border-[#E50914] ring-1 ring-[#E50914]/50 shadow-lg' : 'bg-zinc-900/40 border-white/5 hover:border-zinc-700'}`}
                    >
                      {isCurrent && <div className="absolute top-0 left-0 w-1 h-full bg-[#E50914]" />}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="font-bold text-base text-white block leading-snug">{ex.name}</span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {ex.stimulusType === 'NEURAL' ? '⚡ Neurale (Forza)' : ex.stimulusType === 'METABOLIC' ? '🔥 Metabolico' : '💪 Ipertrofico'}
                          </span>
                          {isBw && (
                            <span className="ml-2 inline-block text-[9px] font-bold uppercase text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                              Corpo Libero
                            </span>
                          )}
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${getBadgeStyle(ex.executionType)}`}>
                          {ex.executionType}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs bg-black/30 p-2.5 rounded-lg border border-white/5">
                        <div><span className="text-[9px] text-zinc-400 uppercase font-bold block">Serie/Reps</span><b className="text-white">{ex.sets} × {ex.reps}</b></div>
                        <div><span className="text-[9px] text-zinc-400 uppercase font-bold block">Target</span><b className="text-white">{ex.targetWeight} Kg</b></div>
                        <div><span className="text-[9px] text-zinc-400 uppercase font-bold block">TUT</span><b className="text-amber-400 font-mono">{ex.tut}</b></div>
                      </div>
                      {ex.notes && <div className="text-[11px] text-zinc-400 italic mt-2.5 pt-2 border-t border-white/5">Note: {ex.notes}</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inserimento Serie Workout */}
            {currentExercise && (
              <div className="bg-[#12151B]/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl space-y-5">
                <div className="pb-4 border-b border-white/10 flex justify-between items-end flex-wrap gap-3">
                  <div>
                    <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-[#E50914] px-2 py-0.5 rounded-md font-bold uppercase">
                      In Esecuzione
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1.5">{currentExercise.name}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Target: {currentExercise.sets} × {currentExercise.reps} @ {currentExercise.targetWeight} Kg (RPE {currentExercise.rpeTarget})</p>
                  </div>
                  {estimated1RMPreview !== null && (
                    <div className="bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl text-right">
                      <div className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">1RM Stimato</div>
                      <div className="text-xl font-black text-[#E50914] leading-tight">{estimated1RMPreview} Kg</div>
                      {currentIntensityPreview && (
                        <div className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase inline-block mt-1 ${currentIntensityPreview.colorClasses}`}>
                          {currentIntensityPreview.pct}% 1RM · {currentIntensityPreview.label}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {lastLoggedSet && (
                  <div className="bg-zinc-900/60 p-3 rounded-xl border border-white/5 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="text-zinc-400 flex items-center gap-2">
                      <History className="w-4 h-4 text-zinc-400" />
                      <span>
                        Ultima sessione:{' '}
                        {lastLoggedSet.isBodyweight && lastLoggedSet.bodyWeightUsed ? (
                          <b className="text-white">
                            BW {lastLoggedSet.bodyWeightUsed} kg + {lastLoggedSet.externalLoad ?? lastLoggedSet.weight} kg × {lastLoggedSet.reps} reps
                          </b>
                        ) : (
                          <b className="text-white">
                            {lastLoggedSet.externalLoad ?? lastLoggedSet.weight} kg × {lastLoggedSet.reps} reps
                          </b>
                        )}{' '}
                        <span className="text-red-400 font-semibold">(RPE {lastLoggedSet.rpe})</span>
                      </span>
                    </div>
                    <button type="button" onClick={handleAutoFillLastLog} className="text-[#E50914] font-bold flex items-center gap-1.5 hover:underline">
                      <Copy className="w-3.5 h-3.5"/> Copia Carico
                    </button>
                  </div>
                )}

                {currentBodyweightConfig && (
                  <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl text-xs text-purple-200">
                    <span className="font-bold">Modalità Corpo Libero ({Math.round(currentBodyweightConfig.percentage * 100)}%): </span>
                    {sessionBodyWeight ? (
                      <span>
                        Peso da Check: <b>{sessionBodyWeight} kg</b>. Quota corporea: <b>{Math.round(sessionBodyWeight * currentBodyweightConfig.percentage * 10) / 10} kg</b>. Inserisci <b>0</b> se a corpo libero oppure la <b>zavorra</b>.
                      </span>
                    ) : (
                      <span className="text-amber-300">
                        ⚠️ Nessun peso inserito nel Check Readiness.
                      </span>
                    )}
                  </div>
                )}

                <form onSubmit={handleLogSet} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">{currentBodyweightConfig ? 'Zavorra (Kg)' : 'Carico (Kg)'}</label>
                      <input type="number" step="0.5" required value={weight} onChange={e => setWeight(e.target.value)} placeholder="80" className="w-full bg-transparent text-xl font-black text-white outline-none" />
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Reps</label>
                      <input type="number" min="1" required value={reps} onChange={e => setReps(e.target.value)} placeholder="8" className="w-full bg-transparent text-xl font-black text-white outline-none" />
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">RPE</label>
                      <select value={rpe} onChange={e => setRpe(e.target.value)} className="w-full bg-transparent text-lg font-black text-white outline-none cursor-pointer">
                        {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(val => (<option key={val} value={val} className="bg-zinc-900 text-white">RPE {val}</option>))}
                      </select>
                      {rpeTablePreviewPct !== null && (
                        <p className="text-[9px] text-zinc-500 mt-1 font-semibold truncate">≈ {rpeTablePreviewPct}% 1RM</p>
                      )}
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-[#E50914] to-red-600 text-white font-bold py-3.5 rounded-xl uppercase text-sm hover:brightness-110 cursor-pointer">
                    <Plus className="w-5 h-5 inline mr-1"/> Registra Serie (+10 XP)
                  </button>
                </form>

                <div>
                  <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2.5">Serie Registrate Oggi ({todayLogs.length})</h4>
                  <div className="space-y-2">
                    {todayLogs.map((log, i) => (
                      <div key={log.id} className="bg-zinc-900/60 p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-zinc-500 font-mono w-10">#{i + 1}</span>
                          <div>
                            <span className="font-bold text-white block">{log.exerciseName}</span>
                            <span className="text-zinc-400 font-mono text-[11px]">
                              {log.isBodyweight && log.effectiveLoad !== null ? (
                                <>Zav: {log.weight} Kg · Effettivo: <b className="text-white">{log.effectiveLoad} Kg</b> × {log.reps} reps (RPE {log.rpe})</>
                              ) : (
                                <><b className="text-white">{log.weight} Kg</b> × {log.reps} reps (RPE {log.rpe})</>
                              )}
                            </span>
                          </div>
                        </div>
                        <button type="button" onClick={() => handleDeleteLog(log.id)} className="p-2 text-zinc-500 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button onClick={handleFinishAndSaveWorkout} disabled={isSavingWorkout} className="w-full bg-emerald-600 hover:brightness-110 text-white font-black py-4 rounded-2xl uppercase tracking-wider cursor-pointer">
              {isSavingWorkout ? 'Salvataggio...' : 'Termina e Salva Allenamento'}
            </button>
          </div>
        )}

        {/* TAB 2: RECORD PERSONALI */}
        {activeTab === 'records' && (
          <PersonalRecords workoutHistory={workoutHistory} currentLogs={logs} athleteName={targetAthleteName} />
        )}

        {/* TAB 3: OBIETTIVI */}
        {activeTab === 'goals' && (
          <AthleteGoals athleteId={targetUserId} athleteName={targetAthleteName} userRole={userRole} />
        )}

        {/* TAB 4: READINESS COMPLETO */}
        {activeTab === 'readiness' && (
          <div className="space-y-6">
            <div className="bg-[#12151B]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl space-y-6">
              {userRole === 'ATHLETE' && (
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Gauge className="text-emerald-400"/> Check-in Giornaliero dello Stato di Forma
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">Valuta le tue variabili biologiche per calcolare il punteggio di recupero e ricevere indicazioni sul volume o intensità.</p>
                </div>
              )}

              {readinessSuccessMessage && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-center font-bold text-xs">
                  {readinessSuccessMessage}
                </div>
              )}

              {userRole === 'ATHLETE' && (
                <form onSubmit={handleSaveReadiness} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1 flex items-center gap-1.5"><Moon className="w-4 h-4 text-indigo-400"/> Ore di Sonno</label>
                      <input type="number" step="0.5" value={sleepHours} onChange={e => setSleepHours(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-white font-bold outline-none focus:border-[#E50914]"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1 flex items-center gap-1.5"><Scale className="w-4 h-4 text-blue-400"/> Peso Corporeo (Kg)</label>
                      <input type="number" step="0.1" value={bodyWeight} onChange={e => setBodyWeight(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-white font-bold outline-none focus:border-[#E50914]"/>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1"><span className="text-zinc-400 flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-amber-400"/> Qualità del Sonno</span><span className="text-amber-400 font-mono">{sleepQuality} / 10</span></div>
                      <input type="range" min="0" max="10" value={sleepQuality} onChange={e => setSleepQuality(Number(e.target.value))} className="w-full accent-[#E50914]" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1"><span className="text-zinc-400 flex items-center gap-1.5"><Dumbbell className="w-4 h-4 text-rose-400"/> Fatica Muscolare / DOMS (0 = Nessun dolore, 10 = Estremo)</span><span className="text-rose-400 font-mono">{domsLevel} / 10</span></div>
                      <input type="range" min="0" max="10" value={domsLevel} onChange={e => setDomsLevel(Number(e.target.value))} className="w-full accent-[#E50914]" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1"><span className="text-zinc-400 flex items-center gap-1.5"><BatteryCharging className="w-4 h-4 text-emerald-400"/> Energia / Motivazione</span><span className="text-emerald-400 font-mono">{energyLevel} / 10</span></div>
                      <input type="range" min="0" max="10" value={energyLevel} onChange={e => setEnergyLevel(Number(e.target.value))} className="w-full accent-[#E50914]" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1"><span className="text-zinc-400 flex items-center gap-1.5"><Brain className="w-4 h-4 text-purple-400"/> Stress Percepito</span><span className="text-purple-400 font-mono">{stressLevel} / 10</span></div>
                      <input type="range" min="0" max="10" value={stressLevel} onChange={e => setStressLevel(Number(e.target.value))} className="w-full accent-[#E50914]" />
                    </div>
                  </div>

                  <div className="bg-black/30 border border-white/10 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center"><span className="text-xs text-zinc-400 uppercase font-bold">Score Stimato ({todayIso()}):</span><span className="text-lg font-black text-[#E50914]">{currentReadiness.totalScore}%</span></div>
                    <p className="text-xs text-zinc-300 font-medium"><b>Consigliato:</b> {currentReadiness.rec}</p>
                  </div>

                  <button type="submit" className="w-full bg-[#E50914] hover:brightness-110 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg">
                    <Gauge className="w-5 h-5"/> Salva Check Readiness (+20 XP)
                  </button>
                </form>
              )}
            </div>

            <div className="bg-[#12151B]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <History className="text-emerald-400" /> Storico Check Readiness ({userRole === 'COACH' ? activeAthlete.displayName : displayUserName})
              </h3>
              {readinessLoadError && (
                <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3 rounded-xl text-xs">
                  ⚠️ Impossibile caricare lo storico da Supabase: {readinessLoadError}
                </div>
              )}
              {readinessHistory.length === 0 ? (
                <p className="text-xs text-zinc-400">Nessun check readiness ancora registrato.</p>
              ) : (
                <div className="space-y-3">
                  {readinessHistory.map((item) => (
                    <div key={item.id} className="bg-zinc-900/60 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="font-bold text-white flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-zinc-400" /> Data: {item.date}</span>
                        <span className={`px-2.5 py-0.5 rounded-md font-black text-sm ${item.readinessScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>Score: {item.readinessScore}%</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-zinc-400 pt-1">
                        <div>Sonno: <b className="text-white">{item.sleepHours}h ({item.sleepQuality}/10)</b></div>
                        <div>Peso: <b className="text-white">{item.bodyWeight ? `${item.bodyWeight} kg` : 'N/D'}</b></div>
                        <div>DOMS: <b className="text-white">{item.domsLevel}/10</b></div>
                        <div>Energia: <b className="text-white">{item.energyLevel}/10</b></div>
                      </div>
                      <p className="text-[11px] text-zinc-300 italic pt-1 border-t border-white/5">Indicazione: {item.recommendation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: COACH DASHBOARD (LEGGERA E PULITA) */}
        {activeTab === 'coachDashboard' && userRole === 'COACH' && (
          <CoachDashboard
            athletes={athletes}
            activeAthleteId={activeAthleteId}
            onSelectAthlete={(id) => setActiveAthleteId(id)}
            onNavigateToBuilder={() => setActiveTab('builder')}
            workoutHistory={workoutHistory}
            readinessHistory={readinessHistory}
          />
        )}

        {/* TAB 6: BUILDER COACH METODO TOPGYM COMPLETO */}
        {activeTab === 'builder' && userRole === 'COACH' && (
          <div className="space-y-6">
            {/* CABINA DI REGIA PERIODIZZAZIONE */}
            <div className="bg-[#12151B]/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#E50914]" />
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    Cabina di Regia Periodizzazione · Metodo TOPGYM
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Atleta:</span>
                  <select
                    value={activeAthleteId}
                    onChange={e => setActiveAthleteId(e.target.value)}
                    className="bg-zinc-900 border border-white/10 text-white font-bold text-xs rounded-xl px-2.5 py-1 outline-none cursor-pointer"
                  >
                    {athletes.map(ath => (
                      <option key={ath.id} value={ath.id}>{ath.displayName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selettore Blocco Macrociclo */}
              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                  1. Imposta Blocco / Mesociclo Attivo:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCurrentBlock('BLOCCO_1_FORZA')}
                    className={`p-3 rounded-xl border text-left transition ${currentBlock === 'BLOCCO_1_FORZA' ? 'bg-zinc-900 border-[#E50914] ring-1 ring-[#E50914]' : 'bg-black/20 border-white/5 text-zinc-400'}`}
                  >
                    <b className="text-white text-xs block font-black">Blocco 1: Forza Ipertrofica</b>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Focus Neurale, Tecnica, Accumulo carichi alti sui Fondamentali</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentBlock('BLOCCO_2_TRASFORMAZIONE')}
                    className={`p-3 rounded-xl border text-left transition ${currentBlock === 'BLOCCO_2_TRASFORMAZIONE' ? 'bg-zinc-900 border-[#E50914] ring-1 ring-[#E50914]' : 'bg-black/20 border-white/5 text-zinc-400'}`}
                  >
                    <b className="text-white text-xs block font-black">Blocco 2: Trasformazione</b>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Range 6-12 reps, Complementari pesanti, Back-off</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentBlock('BLOCCO_3_QUALITA')}
                    className={`p-3 rounded-xl border text-left transition ${currentBlock === 'BLOCCO_3_QUALITA' ? 'bg-zinc-900 border-[#E50914] ring-1 ring-[#E50914]' : 'bg-black/20 border-white/5 text-zinc-400'}`}
                  >
                    <b className="text-white text-xs block font-black">Blocco 3: Qualità (Cut)</b>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">Mantenimento Forza, Volume mirato (18-22 set), Pompaggio/Cavi</span>
                  </button>
                </div>
              </div>

              {/* Progressione Microcicli con indicatore settimana automatica */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                    2. Settimana (Microciclo): Attuale automatica = <b className="text-amber-400">Week {calculatedCurrentWeek}</b>
                  </label>
                  <button
                    type="button"
                    onClick={handleApplyDeloadWeekToProgram}
                    className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 hover:bg-amber-500/20 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Applica Settimana di Deload Automatica
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[1, 2, 3, 4].map(w => {
                    const desc = getMicroWeekDescription(w as MicroWeek);
                    const isSelected = calculatedCurrentWeek === w;
                    return (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setManualWeek(w as MicroWeek)}
                        className={`p-3 rounded-xl border text-left transition ${isSelected ? 'bg-[#E50914] border-[#E50914] text-white shadow-md' : 'bg-black/30 border-white/5 text-zinc-400'}`}
                      >
                        <b className={`text-xs block ${isSelected ? 'text-white' : 'text-zinc-200'}`}>{desc.title}</b>
                        <span className={`text-[10px] block mt-1 ${isSelected ? 'text-white/80' : 'text-zinc-500'}`}>{desc.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Monitoraggio Reale Serie Settimanali per Distretto (Lun - Dom) */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#E50914]" /> Controllo Volume Settimanale (Dal Lunedì alla Domenica)
                    </h4>
                    <span className="text-[11px] text-zinc-400">
                      Settimana selezionata: <b className="text-white">{startOfWeek.toLocaleDateString('it-IT')} - {endOfWeek.toLocaleDateString('it-IT')}</b>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Cambia Settimana:</span>
                    <input
                      type="date"
                      value={analyticsDate}
                      onChange={e => setAnalyticsDate(e.target.value)}
                      className="bg-zinc-900 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white font-bold outline-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {(Object.keys(weeklyMuscleSetsMap) as MuscleGroup[]).map(mg => {
                    const count = weeklyMuscleSetsMap[mg];
                    const isCut = currentBlock === 'BLOCCO_3_QUALITA';
                    let badgeColor = 'text-zinc-400 border-white/5 bg-zinc-900/40';
                    if (isCut) {
                      if (count >= 18 && count <= 22) badgeColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
                      else if (count > 22) badgeColor = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
                    } else {
                      if (count >= 15 && count <= 25) badgeColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
                      else if (count > 25) badgeColor = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
                      else if (count >= 10) badgeColor = 'text-blue-400 border-blue-500/30 bg-blue-500/10';
                    }

                    return (
                      <div key={mg} className={`p-2.5 rounded-xl border flex justify-between items-center ${badgeColor}`}>
                        <span>{mg}</span>
                        <b className="font-mono text-sm">{count} set</b>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STRUTTURA GIORNI ESERCIZI */}
            <div className="bg-[#12151B]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 border-b border-white/10">
                <div className="space-y-2 flex-1 max-w-md">
                  <h2 className="text-xl font-bold flex items-center gap-2"><UserCheck className="text-[#E50914]"/> Struttura Giorni Scheda ({activeAthlete.displayName})</h2>
                  <input
                    type="text"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-bold outline-none focus:border-[#E50914]"
                  />
                </div>
                <div className="flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/5">
                  <span className="text-xs font-bold text-zinc-400">Giorni:</span>
                  <div className="flex gap-1">
                    {([2, 3, 4, 5, 6] as DayCount[]).map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleDayCountChange(num)}
                        className={`px-3 py-1 text-xs font-black rounded-lg border transition-all ${selectedDayCount === num ? 'bg-[#E50914] border-[#E50914] text-white shadow' : 'bg-zinc-800 border-white/5 text-zinc-400'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {programDays.map((day) => (
                <div key={day.id} className="bg-zinc-900/60 p-4 sm:p-5 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 w-full max-w-sm">
                      <h3 className="font-bold text-white whitespace-nowrap text-sm">Giorno {day.dayNumber}:</h3>
                      <input 
                        type="text" 
                        value={day.title}
                        onChange={(e) => handleRenameDay(day.id, e.target.value)}
                        className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white font-bold outline-none focus:border-[#E50914] w-full"
                      />
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">{day.exercises.length} esercizi</span>
                  </div>

                  <div className="space-y-2">
                    {day.exercises.map((ex) => (
                      <div 
                        key={ex.id} 
                        className={`p-3.5 rounded-xl border flex justify-between items-center text-xs transition-all ${editingExId === ex.id ? 'bg-rose-500/10 border-[#E50914]' : 'bg-[#12151B] border-white/5'}`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{ex.name}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${getBadgeStyle(ex.executionType)}`}>
                              {ex.executionType}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              ({ex.stimulusType === 'NEURAL' ? 'Neurale' : ex.stimulusType === 'METABOLIC' ? 'Metabolico' : 'Ipertrofico'})
                            </span>
                          </div>
                          <div className="text-zinc-400 mt-1">
                            {ex.sets} × {ex.reps} @ {ex.targetWeight} kg | RPE: {ex.rpeTarget} | Rec: {ex.restSeconds}s | TUT: {ex.tut}
                          </div>
                          {ex.notes && <div className="text-[10px] text-zinc-500 italic mt-0.5">Note: {ex.notes}</div>}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEditExercise(day.id, ex)}
                            className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded-lg"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => {
                              if (editingExId === ex.id) handleCancelEdit();
                              handleRemoveExerciseFromDay(day.id, ex.id);
                            }} 
                            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Form aggiunta esercizio con preset Metodo TOPGYM */}
                  <form onSubmit={e => handleAddOrUpdateExercise(e, day.id)} className="space-y-3 pt-3 border-t border-white/5">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                        Preset Stimolo Metodo TOPGYM:
                      </span>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleApplyTopGymPreset('NEURAL')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${builderStimulus === 'NEURAL' ? 'bg-[#E50914] text-white border-[#E50914]' : 'bg-zinc-800 border-white/5 text-zinc-300'}`}
                        >
                          1. Neurale / Forza (4-6 reps · Rec 3')
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyTopGymPreset('HYPERTROPHIC')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${builderStimulus === 'HYPERTROPHIC' ? 'bg-[#E50914] text-white border-[#E50914]' : 'bg-zinc-800 border-white/5 text-zinc-300'}`}
                        >
                          2. Ipertrofico (8-10 reps · Rec 90s)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyTopGymPreset('METABOLIC')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${builderStimulus === 'METABOLIC' ? 'bg-[#E50914] text-white border-[#E50914]' : 'bg-zinc-800 border-white/5 text-zinc-300'}`}
                        >
                          3. Metabolico / Cavi (12-15 reps · Rec 60s)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      <input 
                        type="text" 
                        placeholder="Nome Esercizio" 
                        value={editingDayId === day.id ? builderExName : (editingDayId ? '' : builderExName)} 
                        onChange={e => {
                          setBuilderExName(e.target.value);
                          setBuilderMuscleGroup(autoDetectMuscleGroup(e.target.value));
                        }} 
                        className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" 
                      />
                      <select 
                        value={builderMuscleGroup} 
                        onChange={e => setBuilderMuscleGroup(e.target.value as MuscleGroup)} 
                        className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold"
                      >
                        {(['Petto', 'Dorso', 'Spalle', 'Quadricipiti', 'Femorali', 'Glutei', 'Bicipiti', 'Tricipiti', 'Polpacci', 'Addome'] as MuscleGroup[]).map(mg => (
                          <option key={mg} value={mg}>{mg}</option>
                        ))}
                      </select>
                      <input type="number" placeholder="Serie" value={builderSets} onChange={e => setBuilderSets(Number(e.target.value))} className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
                      <input type="text" placeholder="Reps" value={builderReps} onChange={e => setBuilderReps(e.target.value)} className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
                      <input type="text" placeholder="Carico Target" value={builderWeight} onChange={e => setBuilderWeight(e.target.value)} className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <select value={builderType} onChange={e => setBuilderType(e.target.value as ExecutionType)} className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
                        <option value="REGULAR">Tecnica: REGULAR</option>
                        <option value="SUPERSET">Tecnica: SUPERSET</option>
                        <option value="REST_PAUSE">Tecnica: REST_PAUSE</option>
                        <option value="DROP_SET">Tecnica: DROP_SET</option>
                        <option value="CLUSTER">Tecnica: CLUSTER</option>
                      </select>
                      <input type="text" placeholder="TUT" value={builderTut} onChange={e => setBuilderTut(e.target.value)} className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
                      <input type="number" placeholder="Recupero (sec)" value={builderRest} onChange={e => setBuilderRest(Number(e.target.value))} className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
                      <input type="number" step="0.5" placeholder="RPE Target" value={builderRpe} onChange={e => setBuilderRpe(Number(e.target.value))} className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" />
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Note del Coach (Metodo TOPGYM)" 
                        value={editingDayId === day.id ? builderNotes : (editingDayId ? '' : builderNotes)} 
                        onChange={e => setBuilderNotes(e.target.value)} 
                        className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" 
                      />
                      {editingExId && editingDayId === day.id ? (
                        <>
                          <button type="button" onClick={handleCancelEdit} className="bg-zinc-700 text-xs font-bold px-3 py-2 rounded-xl text-white">Annulla</button>
                          <button type="submit" className="bg-amber-400 text-xs font-bold px-4 py-2 rounded-xl text-black">Aggiorna</button>
                        </>
                      ) : (
                        <button type="submit" className="bg-[#E50914] text-xs font-bold px-4 py-2 rounded-xl text-white hover:brightness-110">Aggiungi</button>
                      )}
                    </div>
                  </form>
                </div>
              ))}

              <div className="pt-4 border-t border-white/10 space-y-3">
                {builderSuccessMessage && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-center font-bold text-xs">{builderSuccessMessage}</div>}
                <button type="button" onClick={handleSaveProgramByCoach} className="w-full bg-emerald-600 hover:brightness-110 text-white font-black py-4 rounded-xl uppercase tracking-wider transition shadow-xl cursor-pointer">
                  Salva e Assegna Scheda Metodo TOPGYM ({activeAthlete.displayName})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: ANALYTICS & STORICO COMPLETO */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-[#12151B]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="text-[#E50914]" /> 
                  Analisi Progressi & Volume {userRole === 'COACH' ? `(${activeAthlete.displayName})` : ''}
                </h2>
                <p className="text-xs text-zinc-400 mt-1">Monitoraggio serie settimanali reali dal lunedì alla domenica per singolo gruppo muscolare.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-black/30 px-4 py-2 rounded-xl border border-white/5 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase block">Serie Complete (Sempre)</span>
                  <span className="text-lg font-black text-white">{totalSetsEver}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#12151B]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-white/5 pb-3 gap-4">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-[#E50914]" /> Volume Settimanale per Singolo Gruppo Muscolare
                  </h3>
                  <span className="text-xs text-zinc-400">Target ipertrofico: 15 - 25 serie per distretto (18-22 in cut)</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Seleziona Giorno (Filtra Settimana)</label>
                    <input 
                      type="date" 
                      value={analyticsDate}
                      onChange={e => setAnalyticsDate(e.target.value)}
                      className="bg-zinc-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold outline-none focus:border-[#E50914]"
                    />
                  </div>
                  <div className="bg-black/30 px-3.5 py-1.5 rounded-xl border border-white/5 text-center min-w-[80px]">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase block">Serie Mensili</span>
                    <span className="text-sm font-black text-blue-400">{monthlySetsCount}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 font-bold bg-black/20 p-2.5 rounded-xl text-center border border-white/5">
                Mostrando i dati per la settimana da Lunedì a Domenica: <span className="text-white">{startOfWeek.toLocaleDateString('it-IT')} - {endOfWeek.toLocaleDateString('it-IT')}</span> 
                <br/>Mese in corso: <span className="text-white capitalize">{startOfMonth.toLocaleString('it-IT', { month: 'long', year: 'numeric' })}</span>
              </div>

              {/* GRIGLIA CONTEGGIO SERIE REALI PER MUSCOLO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {(['Petto', 'Dorso', 'Spalle', 'Quadricipiti', 'Femorali', 'Glutei', 'Bicipiti', 'Tricipiti', 'Polpacci', 'Addome'] as MuscleGroup[]).map(mg => {
                  const count = weeklyMuscleSetsMap[mg] || 0;
                  const maxTarget = 22;
                  const percentage = Math.min(100, Math.round((count / maxTarget) * 100));
                  
                  let statusColor = 'bg-zinc-700';
                  let textColor = 'text-zinc-400';
                  if (count >= 15 && count <= 25) { statusColor = 'bg-emerald-500'; textColor = 'text-emerald-400'; } 
                  else if (count > 25) { statusColor = 'bg-rose-500'; textColor = 'text-rose-400'; } 
                  else if (count >= 10) { statusColor = 'bg-blue-500'; textColor = 'text-blue-400'; }

                  return (
                    <div key={mg} className="bg-zinc-900/60 p-3.5 rounded-xl border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-zinc-200">{mg}</span>
                        <span className={textColor}>{count} Serie / sett</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${statusColor} transition-all duration-500`} style={{ width: `${percentage}%` }} />
                      </div>
                      <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                        <span>0 serie</span>
                        <span>10 (MEV)</span>
                        <span>20+ (MRV)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grafico SVG e Tabella Storico */}
            <div className="bg-[#12151B]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#E50914]" /> Storico Allenamenti & Analisi Intensità</h3>
              {workoutHistory.length === 0 ? (
                <p className="text-xs text-zinc-400 italic">Nessun allenamento registrato.</p>
              ) : (
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5">
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
                              {[0, 0.25, 0.5, 0.75, 1].map(f => (
                                <line key={f} x1={padX} x2={chartW - padX} y1={10 + f * (chartH - 20)} y2={10 + f * (chartH - 20)} stroke="#27272a" strokeWidth="1" />
                              ))}

                              <polyline points={volPoints} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                              {volumeIntensitySeries.map((s, i) => (
                                <circle key={`vol-${s.key}`} cx={xAt(i)} cy={yVolAt(s.volume)} r="3.5" fill="#3b82f6">
                                  <title>{`${s.dateStr} · Volume: ${s.volume.toLocaleString('it-IT')} kg`}</title>
                                </circle>
                              ))}

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
                      </>
                    )}
                  </div>

                  <div className="overflow-x-auto pt-2 space-y-2">
                    <table className="w-full text-xs text-left text-zinc-300">
                      <thead className="bg-black/30 text-zinc-400 uppercase text-[10px] border-b border-white/5">
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
                                <td className="py-2.5 px-3 font-mono text-zinc-400">{item.created_at ? new Date(item.created_at).toLocaleDateString('it-IT') : (item.date || todayIso())}</td>
                                <td className="py-2.5 px-3 font-bold text-white">{item.day_name || item.dayName || 'Allenamento'}</td>
                                <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{(item.total_volume || item.totalVolume || 0).toLocaleString('it-IT')} kg</td>
                                <td className="py-2.5 px-3">
                                  <div className="flex justify-center gap-2">
                                    <button type="button" onClick={() => setExpandedHistoryId(isExpanded ? null : rowKey)} className="bg-zinc-800 hover:bg-zinc-700 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 transition">
                                      {isExpanded ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>} Dettagli
                                    </button>
                                    {userRole === 'COACH' && (
                                      <button type="button" onClick={() => handleDeleteWorkoutHistory(item.id || item._id)} className="text-zinc-500 hover:text-rose-400 p-1"><Trash2 className="w-4 h-4"/></button>
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
                                            <div className="text-zinc-400 flex justify-between flex-wrap">
                                              {log.isBodyweight && log.effectiveLoad !== null ? (
                                                <span>BW: +{log.weight} kg (Eff: {log.effectiveLoad} kg) × {log.reps}</span>
                                              ) : (
                                                <span>{log.weight} kg × {log.reps}</span>
                                              )}
                                              <span className="text-red-400 font-semibold">RPE: {log.rpe}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-[11px] text-zinc-500 italic text-center">Nessun dettaglio delle serie salvato per questo allenamento.</div>
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

        {/* TAB 8: CLASSIFICA & BADGE */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-[#12151B]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Trophy className="text-amber-400"/> Classifica Palestra</h2>
              <div className="space-y-2">
                {leaderboard.map((ath, index) => (
                  <div key={ath.id} className="p-4 bg-zinc-900/60 rounded-xl border border-white/5 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-zinc-500 font-mono">#{index + 1}</span>
                      <span className="font-bold text-white">{ath.displayName}</span>
                    </div>
                    <span className="font-black text-amber-400">{ath.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#12151B]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Medal className="text-amber-400"/> Trofei & Traguardi</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {achievements.map(ach => (
                  <div key={ach.id} className={`p-4 rounded-xl border flex items-center gap-3 transition ${ach.unlocked ? 'bg-zinc-900/80 border-amber-500/30' : 'bg-black/20 border-white/5 opacity-50'}`}>
                    <span className="text-2xl">{ach.icon}</span>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">{ach.title}{ach.unlocked && <CheckCircle className="w-3.5 h-3.5 text-emerald-400"/>}</div>
                      <p className="text-xs text-zinc-400 mt-0.5">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: IMPOSTAZIONI COMPLETO */}
        {activeTab === 'settings' && userRole === 'ATHLETE' && (
          <div className="bg-[#12151B]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-white"><Settings className="text-[#E50914]"/> Profilo & Impostazioni</h2>
              <p className="text-xs text-zinc-400 mt-1">Aggiorna le tue metriche atletiche e gestisci la sicurezza del tuo account.</p>
            </div>

            {settingsMessage && <div className="bg-zinc-900 border border-white/10 p-3 rounded-xl text-xs font-bold text-zinc-200">{settingsMessage}</div>}

            <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#E50914]" /> Notifiche Push
              </h3>
              <p className="text-xs text-zinc-400">
                Ricevi avvisi sullo smartphone per aggiornamenti delle schede e comunicazioni.
              </p>
              <button
                type="button"
                disabled={pushLoading}
                onClick={handlePushActivation}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {pushLoading ? 'Attivazione in corso...' : 'Attiva Notifiche su questo Telefono'}
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">Dati Atleta</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Nome Utente</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2.5 text-sm text-white outline-none focus:border-[#E50914]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Altezza (cm)</label>
                    <input type="number" step="0.5" value={profileHeight} onChange={e => setProfileHeight(e.target.value)} placeholder="185" className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2.5 text-sm text-white outline-none focus:border-[#E50914]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Peso Obiettivo (Kg)</label>
                    <input type="number" step="0.5" value={profileTargetWeight} onChange={e => setProfileTargetWeight(e.target.value)} placeholder="85" className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2.5 text-sm text-white outline-none focus:border-[#E50914]" />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">Obiettivi & Esperienza</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Obiettivo Principale</label>
                    <select value={profileGoal} onChange={e => setProfileGoal(e.target.value)} className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2.5 text-sm text-white font-bold outline-none">
                      <option value="Ipertrofia">Ipertrofia (Massa Muscolare)</option>
                      <option value="Forza">Forza / Powerlifting</option>
                      <option value="Calisthenics">Calisthenics & Skills</option>
                      <option value="Dimagrimento">Definizione / Dimagrimento</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Livello di Esperienza</label>
                    <select value={profileExperience} onChange={e => setProfileExperience(e.target.value)} className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2.5 text-sm text-white font-bold outline-none">
                      <option value="Principiante">Principiante (&lt; 1 anno)</option>
                      <option value="Intermedio">Intermedio (1-3 anni)</option>
                      <option value="Avanzato">Avanzato (3+ anni)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Limitazioni fisiche o note per il Coach</label>
                  <textarea value={profileNotes} onChange={e => setProfileNotes(e.target.value)} rows={2} placeholder="Es. Lieve fastidio spalla destra su distensioni sopra la testa..." className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2.5 text-sm text-white outline-none focus:border-[#E50914]" />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#E50914] hover:brightness-110 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider transition cursor-pointer shadow-lg">
                Salva Modifiche Profilo
              </button>
            </form>

            <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><Key className="w-4 h-4 text-amber-400"/> Password e Sicurezza</h3>
              <p className="text-xs text-zinc-400">Invia un link alla tua email per cambiare la tua password.</p>
              <button type="button" onClick={handlePasswordReset} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition flex items-center gap-2">Invia Email Recupero Password</button>
            </div>

            <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 space-y-3">
              <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2"><UserX className="w-4 h-4 text-rose-500"/> Zona Pericolo</h3>
              <p className="text-xs text-zinc-400">Rimuovi definitivamente il tuo profilo Atleta.</p>
              <button type="button" onClick={handleDeleteAccount} className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2">Cancella Definitivamente Account</button>
            </div>
          </div>
        )}
      </main>

      {/* MODALE PERMESSI NOTIFICHE */}
      {showDeniedModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Notifiche Disattivate</h3>
            <p className="text-xs text-zinc-300">Hai bloccato i permessi nel browser. Riabilitali dalle impostazioni del sito.</p>
            <button type="button" onClick={() => setShowDeniedModal(false)} className="w-full bg-[#E50914] text-white font-bold text-xs py-3 rounded-xl">Ho capito, chiudi</button>
          </div>
        </div>
      )}
    </div>
  );
}