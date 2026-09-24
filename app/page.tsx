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
import { processDynamicWorkout, applyPhaseToProgram } from '@/lib/topgym-engine';
import { getRecommendedTemplatesForBlock, getTemplateById } from '@/lib/topgym-templates';
import TemplatePickerModal from '@/components/TemplatePickerModal';
import WeeklyVolumeRadar from '@/components/WeeklyVolumeRadar';
import { detectAthleteGender } from '@/lib/topgym-templates';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { resolveMuscleTarget } from '@/lib/topgym-volume';

export type DayCount = 2 | 3 | 4 | 5 | 6;
export type UserRole = 'ATHLETE' | 'COACH';

export type ExecutionType = 
  | 'REGULAR' 
  | 'STRIPPING' 
  | '10_PIU_MAX' 
  | 'REST_PAUSE' 
  | 'BACK_OFF' 
  | 'PARZIALI' 
  | 'ISOMETRIE' 
  | 'SUPERSET' 
  | 'CLUSTER';

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
export type MicroWeek = 1 | 2 | 3 | 4; // Map: 1=Fase I, 2=Fase II, 3=Scarico, 4=Fase III
export type TopGymStimulus = 'NEURAL' | 'HYPERTROPHIC' | 'METABOLIC';

export const autoDetectMuscleGroup = (exerciseName: string): MuscleGroup => {
  const name = exerciseName.toLowerCase().trim();

  // 1. FEMORALI (da controllare PRIMA di Dorso e Bicipiti per evitare conflitti con 'stacco' e 'curl')
  if (
    name.includes('stacco rumeno') ||
    name.includes('rdl') ||
    name.includes('leg curl') ||
    name.includes('femoral') ||
    name.includes('hamstring') ||
    name.includes('lying curl') ||
    name.includes('seated curl') ||
    name.includes('standing curl') ||
    name.includes('nordic') ||
    name.includes('ghr') ||
    name.includes('good morning') ||
    name.includes('gambe tese')
  ) return 'Femorali';

  // 2. GLUTEI (da controllare PRIMA di Petto/Quadricipiti per evitare conflitti con 'panca', 'spinte', 'squat')
  if (
    name.includes('hip thrust') ||
    name.includes('glute') ||
    name.includes('kickback') ||
    name.includes('kick back') ||
    name.includes('slanci') ||
    name.includes('abductor') ||
    name.includes('abduzion') ||
    name.includes('bridge') ||
    name.includes('ponte') ||
    name.includes('frog pump') ||
    name.includes('clamshell') ||
    name.includes('step up') ||
    name.includes('step-up') ||
    name.includes('bulgar') ||
    name.includes('hyperextension') ||
    name.includes('iperestension')
  ) return 'Glutei';

  // 3. DORSO (dopo Femorali, così 'stacco' prende solo lo stacco regolare/sumo da terra)
  if (
    name.includes('trazioni') ||
    name.includes('lat') ||
    name.includes('rematore') ||
    name.includes('pulley') ||
    name.includes('stacco') ||
    name.includes('pull down') ||
    name.includes('pulldown') ||
    name.includes('chin up') ||
    name.includes('row')
  ) return 'Dorso';

  // 4. QUADRICIPITI
  if (
    name.includes('squat') ||
    name.includes('pressa') ||
    name.includes('leg ext') ||
    name.includes('affondi') ||
    name.includes('lunge') ||
    name.includes('hack') ||
    name.includes('quadricipit')
  ) return 'Quadricipiti';

  // 5. SPALLE
  if (
    name.includes('shoulder') ||
    name.includes('military') ||
    name.includes('lento') ||
    name.includes('alzate') ||
    name.includes('deltoid') ||
    name.includes('arnold') ||
    name.includes('press spalle') ||
    name.includes('shrug')
  ) return 'Spalle';

  // 6. PETTO
  if (
    name.includes('panca') ||
    name.includes('chest') ||
    name.includes('croci') ||
    name.includes('dip') ||
    name.includes('push up') ||
    name.includes('piegament') ||
    name.includes('pectoral') ||
    name.includes('spinte') ||
    name.includes('fly')
  ) return 'Petto';

  // 7. TRICIPITI (da controllare prima di bicipiti per 'pushdown')
  if (
    name.includes('pushdown') ||
    name.includes('french') ||
    name.includes('tricipit') ||
    name.includes('triceps') ||
    name.includes('skull crusher') ||
    name.includes('estensioni manubrio')
  ) return 'Tricipiti';

  // 8. BICIPITI (dopo Femorali e Tricipiti)
  if (
    name.includes('curl') ||
    name.includes('bicipit') ||
    name.includes('biceps') ||
    name.includes('hammer') ||
    name.includes('scott')
  ) return 'Bicipiti';

  // 9. POLPACCI
  if (
    name.includes('polpacc') ||
    name.includes('calf') ||
    name.includes('calves')
  ) return 'Polpacci';

  // 10. ADDOME
  if (
    name.includes('crunch') ||
    name.includes('plank') ||
    name.includes('addominal') ||
    name.includes('core') ||
    name.includes('leg raise') ||
    name.includes('sit up')
  ) return 'Addome';

  // Se non riconosciuto, NON ritornare 'Petto' alla cieca!
  // Restituiamo un default intelligente o lasciamolo come Glutei/Addome/Altro se non specificato
  return 'Glutei'; // Oppure gestito come distretto jolly/Addome invece di intasare il Petto
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

const parseLocalDate = (value: any): Date | null => {
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
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

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
  const [isMasterCoach, setIsMasterCoach] = useState<boolean>(false);

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
      setBuilderRpe(7.5); // Corrisponde a Buffer 2-3
      setBuilderRest(180);
      setBuilderType('REGULAR');
      setBuilderTut('2-0-X-1'); // 1" di fermo in contrazione
      setBuilderNotes('Metodo TOPGYM: Spinta esplosiva sui fondamentali, rigoroso BUFFER (RIR 2-4). Mai a cedimento per non bruciare il SNC.');
    } else if (stimulus === 'HYPERTROPHIC') {
      setBuilderSets(3);
      setBuilderReps('8-12');
      setBuilderRpe(8.5); // Corrisponde a Buffer 1-2
      setBuilderRest(90);
      setBuilderType('REGULAR');
      setBuilderTut('2-0-1-0');
      setBuilderNotes('Metodo TOPGYM: Tensione meccanica. Buffer 1-2 nelle prime serie, cedimento consentito solo all\'ultima serie o back-off.');
    } else {
      setBuilderSets(3);
      setBuilderReps('12-20');
      setBuilderRpe(10);
      setBuilderRest(60);
      setBuilderType('STRIPPING'); // Tecnica base per il metabolico
      setBuilderTut('2-0-1-1');
      setBuilderNotes('Metodo TOPGYM: Isolamento. Ricerca del cedimento concentrico reale e tecniche di intensità.');
    }
  }

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
    if (!window.confirm('Vuoi convertire la scheda in SETTIMANA DI SCARICO (-40% volume, carichi submassimali, nessuna tecnica d\'intensità)?')) return;
    setProgramDays(prevDays => prevDays.map(day => ({
      ...day,
      exercises: day.exercises.map(ex => ({
        ...ex,
        sets: Math.max(2, Math.round(ex.sets * 0.6)),
        rpeTarget: 6.5,
        executionType: 'REGULAR',
        notes: (ex.notes ? ex.notes + ' · ' : '') + 'DELOAD: Volume ridotto, carichi submassimali, nessun cedimento.'
      }))
    })));
    setManualWeek(3); // La fase 3 è sempre lo Scarico/Deload nel nuovo sistema
    setBuilderSuccessMessage('✅ Scheda convertita in Settimana di Scarico (Fase III)!');
    setTimeout(() => setBuilderSuccessMessage(null), 4000);
  };

  const handleApplyEngineToCurrentProgram = () => {
    if (!window.confirm(`Vuoi aggiornare tutti gli esercizi della scheda con le regole del ${currentBlock} · Fase ${calculatedCurrentPhase}?`)) return;
    const updated = applyPhaseToProgram(programDays as any, currentBlock, calculatedCurrentPhase);
    setProgramDays(updated as any);
    setBuilderSuccessMessage(`⚡ Scheda aggiornata con successo alle regole del ${currentBlock} · Fase ${calculatedCurrentPhase}! Ora puoi visionarla o modificarla.`);
    setTimeout(() => setBuilderSuccessMessage(null), 5000);
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

        // --- SELEZIONE INTELLIGENTE DELL'UTENTE CONNESSO ---
        if (formatted.length > 0) {
          const { data: authData } = await supabase.auth.getUser();
          const myId = authData?.user?.id;
          const myEmail = (authData?.user?.email || '').toLowerCase().trim();

          const myProfile = formatted.find(
            (a: any) => a.id === myId || (a.email && a.email.toLowerCase().trim() === myEmail)
          );

          if (userRole === 'ATHLETE' && myProfile) {
            setActiveAthleteId(myProfile.id);
          } else if (!activeAthleteId) {
            setActiveAthleteId(myProfile ? myProfile.id : formatted[0].id);
          }
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

  const handleRoleSwitchRequest = (targetRole: UserRole) => {
    if (targetRole === 'COACH') {
      setShowCoachPinModal(true);
    } else {
      setUserRole('ATHLETE');
      setIsMasterCoach(false); // <-- Reset di sicurezza quando si torna ad Atleta
      if (activeTab === 'builder' || activeTab === 'coachDashboard') setActiveTab('workout');
    }
  };

  const verifyCoachPin = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const enteredPin = pinInput.trim();

    // 1. ACCESSO MASTER COACH (Tu: tutto sbloccato)
    if (enteredPin === '1234' || enteredPin === 'admin') {
      setUserRole('COACH');
      setIsMasterCoach(true);
      setShowCoachPinModal(false);
      setPinInput('');
      setPinError(false);
      if (activeTab === 'workout') setActiveTab('builder');
      return;
    }

    // 2. ACCESSO COACH STANDARD (Il tuo socio: solo gestione base)
    if (enteredPin === '5678') {
      setUserRole('COACH');
      setIsMasterCoach(false);
      setShowCoachPinModal(false);
      setPinInput('');
      setPinError(false);
      if (activeTab === 'workout') setActiveTab('builder');
      return;
    }

    // PIN errato
    setPinError(true);
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

  const allLoggedSets = useMemo(() => {
    const items: { exerciseName: string; weight: number; estimated1RM: number }[] = [];
    logs.forEach(l => {
      const w = l.effectiveLoad !== null && l.effectiveLoad !== undefined ? l.effectiveLoad : l.weight;
      if (w > 0 && l.reps > 0) {
        items.push({
          exerciseName: l.exerciseName,
          weight: w,
          estimated1RM: l.estimated1RM || calculateEstimated1RM(w, l.reps, l.rpe) || calculate1RM(w, l.reps)
        });
      }
    });
    workoutHistory.forEach(w => {
      if (Array.isArray(w.logs)) {
        w.logs.forEach((l: any) => {
          const weight = Number(l.effectiveLoad !== null && l.effectiveLoad !== undefined ? l.effectiveLoad : l.weight) || 0;
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

  const best1RMByExercise = useMemo(() => {
    const map = new Map<string, number>();
    allLoggedSets.forEach(({ exerciseName, estimated1RM }) => {
      if (!exerciseName) return;
      if (estimated1RM > (map.get(exerciseName) || 0)) map.set(exerciseName, estimated1RM);
    });
    return map;
  }, [allLoggedSets]);

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
  
  // 1. Calcolo Settimana Reale
  const calculatedCurrentRealWeek = useMemo(() => {
    const daysInRoutine = Math.max(1, programDays.length || 4);
    const completedCount = workoutHistory.length;
    return Math.floor(completedCount / daysInRoutine) + 1;
  }, [programDays.length, workoutHistory.length]);
  
  // 2. Calcolo Fase del Blocco
  const calculatedCurrentPhase: MicroWeek = useMemo(() => {
    if (manualWeek !== null) return manualWeek;
    const w = calculatedCurrentRealWeek;
    if (currentBlock === 'BLOCCO_1_FORZA') {
      if (w <= 6) return 1;
      if (w <= 9) return 2;
      if (w === 10) return 3; // Scarico
      return 4;
    } else {
      if (w <= 5) return 1;
      if (w <= 9) return 2;
      if (w === 10) return 3; // Scarico
      return 4;
    }
  }, [manualWeek, calculatedCurrentRealWeek, currentBlock]);
  
  // 3. Il Motore che elabora la scheda in base alla fase
  const dynamicActiveDay = useMemo(() => {
    if (!activeDay) return null;
    if (userRole === 'COACH' && activeTab === 'builder') return activeDay;
    return processDynamicWorkout(activeDay as any, calculatedCurrentRealWeek, calculatedCurrentPhase as any, currentBlock as any);
  }, [activeDay, userRole, activeTab, calculatedCurrentRealWeek, calculatedCurrentPhase, currentBlock]);
  
  // Riconosce se la scheda appartiene al Metodo TOPGYM (salvata da te) o a Paolo
const isMasterProgram = programDays.some((d: any) => d.isPeriodized === true || d.assignedByCoach === 'riprendi@gmail.com');
  const activeRoutine = dynamicActiveDay?.exercises ?? [];
  const currentExercise = activeRoutine.find((e: any) => e.id === currentExId) || activeRoutine[0];

  const currentIntensityPreview = useMemo(() => {
    if (!currentExercise) return null;
    const w = parseFloat(weight);
    if (!Number.isFinite(w) || w <= 0) return null;
    return getIntensityInfo(currentExercise.name, w);
  }, [currentExercise, weight, getIntensityInfo]);

  // Recupera il peso più recente della Readiness
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

  const adjustWeight = (delta: number) => {
    const current = parseFloat(weight) || 0;
    const updated = Math.max(0, current + delta);
    setWeight(updated.toString());
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

  const todayLogs = useMemo(() => {
    const today = todayIso();
    return logs.filter(l => l.date === today);
  }, [logs]);

  const handleFinishAndSaveWorkout = async () => {
    if (isSavingWorkout) return;
    setIsSavingWorkout(true);

    const dayName = activeDay ? activeDay.title : 'Giornata di Allenamento';
    const totalVol = todayLogs.reduce((acc, curr) => acc + (curr.effectiveVolume || curr.volume), 0) || 0;
    
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
    } finally {
      setIsSavingWorkout(false);
    }

    if (result?.success) {
      await addXp(50);
      setWorkoutSuccessMessage('🎉 Allenamento completato e salvato! +50 XP');
      setLogs([]);
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

    // 1. Definiamo la firma in base al Coach connesso
    const coachEmail = isMasterCoach ? 'riprendi@gmail.com' : 'maggiopaolo34@gmail.com';

    // 2. Firmiamo ogni giornata della scheda con i metadati del Metodo TOPGYM
    // Questi dati viaggiano dentro il JSON di Supabase senza toccare le tabelle del DB
    const programDaysToSave = programDays.map(day => ({
      ...day,
      isPeriodized: isMasterCoach,
      assignedByCoach: coachEmail,
      block: isMasterCoach ? currentBlock : null,
      phase: isMasterCoach ? calculatedCurrentPhase : null,
    }));

    try {
      result = await saveProgramToSupabase(targetId, programName, programDaysToSave);
    } catch (e: any) {
      result = { success: false, error: e?.message };
    }

    if (result?.success) {
      setBuilderSuccessMessage(`✅ Scheda salvata e assegnata con successo a ${activeAthlete.displayName}!`);
      
      if (supabase && targetId) {
        try {
          await supabase.from('notifications').insert([{
            user_id: targetId,
            title: isMasterCoach ? 'Nuova Scheda Metodo TOPGYM!' : 'Nuova Scheda di Allenamento',
            message: isMasterCoach 
              ? `Il Coach ha assegnato o aggiornato il programma "${programName}".`
              : `Il Coach ha aggiornato la tua scheda "${programName}".`,
            type: 'program_assigned'
          }]);
        } catch {}
      }

      if (targetId && targetId !== 'default-user') {
        try {
          await sendPushNotification(
            targetId,
            isMasterCoach ? 'Nuova Scheda Metodo TOPGYM! 🏋️' : 'Nuova Scheda Assegnata! 🏋️',
            isMasterCoach 
              ? `Il Coach ha aggiornato il tuo programma Metodo TOPGYM (${programName || 'Nuova scheda'}).`
              : `Il Coach ha aggiornato la tua scheda di allenamento (${programName || 'Nuova scheda'}).`,
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

    // Cast esplicito a MuscleGroup così TypeScript non segnala errori di tipo
   const targetGroup = currentExercise?.muscleGroup || resolveMuscleTarget(exName);

    const newLog: SetLog = {
      id: makeId(),
      exerciseId: currentExercise?.id || currentExId,
      exerciseName: exName,
      muscleGroup: targetGroup as MuscleGroup || undefined, // Salvato in modo permanente
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

  const handleDeleteLog = (logId: string) => {
    setLogs(prev => prev.filter(l => l.id !== logId));
  };

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
      case 'SUPERSET': return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'REST_PAUSE': return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'STRIPPING': return 'bg-rose-950 text-rose-300 border-rose-800';
      case '10_PIU_MAX': return 'bg-red-950 text-red-300 border-red-800';
      case 'BACK_OFF': return 'bg-orange-950 text-orange-300 border-orange-800';
      case 'PARZIALI': return 'bg-pink-950 text-pink-300 border-pink-800';
      case 'ISOMETRIE': return 'bg-cyan-950 text-cyan-300 border-cyan-800';
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
    const targetDate = parseLocalDate(analyticsDate) || new Date();
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

  // 2. CONTEGGIO SERIE REALE PER DISTRETTO (DEDUPLICAZIONE RIGOROSA)
  const weeklyMuscleSetsMap = useMemo(() => {
    const map: Record<MuscleGroup, number> = {
      Petto: 0, Dorso: 0, Spalle: 0, Quadricipiti: 0,
      Femorali: 0, Glutei: 0, Bicipiti: 0, Tricipiti: 0,
      Polpacci: 0, Addome: 0
    };

    const startMs = startOfWeek.getTime();
    const endMs = endOfWeek.getTime();
    const countedSetIds = new Set<string>();

    logs.forEach(l => {
      const d = parseLocalDate(l.date);
      if (d && d.getTime() >= startMs && d.getTime() <= endMs) {
        countedSetIds.add(l.id);
        const mg = (l.muscleGroup || autoDetectMuscleGroup(l.exerciseName || '')) as MuscleGroup;
        if (mg && typeof map[mg] === 'number') map[mg] += 1;
      }
    });

    workoutHistory.forEach(w => {
      const wDate = parseLocalDate(w.created_at || w.date);
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

  // 3. CALCOLO AUTOMATICO SETTIMANA E FASE (BLOCCO 1-2-3)
  const getPhaseDescription = (block: MacroBlock, phase: MicroWeek) => {
    if (block === 'BLOCCO_1_FORZA') {
      switch (phase) {
        case 1: return { title: 'Fase I: Accumulo', desc: 'Progressione su serie. Buffer (RIR 2-4) per perfezionare la tecnica.' };
        case 2: return { title: 'Fase II: Conversione', desc: 'Aumento reps/serie e riduzione progressiva del buffer.' };
        case 3: return { title: 'Fase III: Scarico (Deload)', desc: 'Riduzione del volume per dissipare la fatica. Nessun cedimento.' };
        case 4: return { title: 'Fase IV: Intensificazione', desc: 'Meno volume, aumento carichi. Test massimale a fine ciclo.' };
      }
    }
    if (block === 'BLOCCO_2_TRASFORMAZIONE') {
      switch (phase) {
        case 1: return { title: 'Fase I: Volume & Stripping', desc: 'Forza costante sui base. Complementari con 10+MAX.' };
        case 2: return { title: 'Fase II: Ibrida', desc: 'Lavoro pesante + back-off sui base. Complementari a cedimento.' };
        case 3: return { title: 'Fase III: Scarico (Deload)', desc: 'Riduzione volume, zero tecniche. Carichi submassimali.' };
        case 4: return { title: 'Fase IV: Trasformazione', desc: 'Aumento intensità. Stripping e saturazione massima.' };
      }
    }
    if (block === 'BLOCCO_3_QUALITA') {
      switch (phase) {
        case 1: return { title: 'Fase I: Accumulo Ipertrofico', desc: 'Progressione di volume. Inserimento Back-off, Stripping e 10+MAX.' };
        case 2: return { title: 'Fase II: Densità', desc: 'Aggiunta Rest-Pause su macchine guidate e parziali finali.' };
        case 3: return { title: 'Fase III: Scarico (Deload)', desc: '-40% Volume, zero tecniche d\'intensità. Dissipazione fatica.' };
        case 4: return { title: 'Fase IV: Massimo Pompaggio', desc: 'Taglio volume sui base. Massimo effort metabolico e isometrie.' };
      }
    }
    return { title: '', desc: '' };
  };

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
              className="w-full rounded bg-[#E50914] py-3 font-bold uppercase text-white hover:bg-red-700 transition tracking-wider cursor-pointer"
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
    <div className="min-h-screen bg-[#090A0D] text-white font-sans p-4 md:p-8 pb-28">
      <header className="max-w-5xl mx-auto bg-[#12151B] rounded-2xl p-5 border border-white/10 shadow-2xl mb-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-wider text-[#E50914] flex items-center gap-2">
              <Dumbbell className="w-7 h-7" /> TOP GYM
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Utente: <span className="text-white font-bold">{displayUserName}</span></p>

            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <div className="flex bg-black/50 p-1 rounded-xl border border-white/5 text-xs font-semibold">
                <button
                  onClick={() => handleRoleSwitchRequest('ATHLETE')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${userRole === 'ATHLETE' ? 'bg-[#E50914] text-white shadow font-bold' : 'text-zinc-400 hover:text-white'}`}
                >
                  <Eye className="w-3.5 h-3.5" /> Atleta
                </button>
                <button
                  onClick={() => handleRoleSwitchRequest('COACH')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${userRole === 'COACH' ? 'bg-[#E50914] text-white shadow font-bold' : 'text-zinc-400 hover:text-white'}`}
                >
                  {userRole === 'COACH' ? <Unlock className="w-3.5 h-3.5 text-green-400" /> : <Lock className="w-3.5 h-3.5" />} Coach
                </button>
              </div>

              {userRole === 'COACH' && (
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                  <span className="text-zinc-400 text-xs font-bold">Gestisci Atleta:</span>
                  <select
                    value={activeAthleteId}
                    onChange={e => setActiveAthleteId(e.target.value)}
                    className="bg-zinc-900 border border-white/10 text-white text-xs rounded-lg px-2.5 py-1 font-bold outline-none cursor-pointer"
                  >
                    {athletes.map(ath => (
                      <option key={ath.id} value={ath.id}>{ath.displayName}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between flex-wrap">
            <div className="flex items-center gap-2">
              <NotificationBell userId={targetUserId} onNavigateToWorkout={() => setActiveTab('workout')} />

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2.5 bg-black/40 border border-white/5 rounded-xl text-zinc-400 hover:text-white transition"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-green-400" /> : <VolumeX className="w-4 h-4 text-zinc-600" />}
              </button>
            </div>

            {latestReadiness && (
              <div className="flex items-center gap-2 bg-black/40 px-3.5 py-2 rounded-xl border border-white/5">
                <Gauge className={`w-4 h-4 ${latestReadiness.readinessScore >= 80 ? 'text-green-400' : 'text-yellow-400'}`} />
                <div>
                  <div className="text-[9px] text-zinc-400 uppercase font-bold">READINESS</div>
                  <div className="text-xs font-black">{latestReadiness.readinessScore}%</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 bg-black/40 px-3.5 py-2 rounded-xl border border-white/5">
              <Shield className="text-yellow-500 w-4 h-4 flex-shrink-0" />
              <div className="w-32">
                <div className="text-[9px] text-yellow-500 font-black uppercase tracking-wider truncate">
                  {userRank}
                </div>
                <div className="flex justify-between items-center text-[9px] text-zinc-400 font-bold">
                  <span>Lvl {userLevel}/99</span>
                  <span className="font-mono">{userXp} XP</span>
                </div>
                <div className="w-full bg-zinc-800 h-1 rounded-full mt-0.5 overflow-hidden">
                  <div className="bg-yellow-500 h-full transition-all duration-300" style={{ width: `${levelProgressPercentage}%` }} />
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white bg-black/40 border border-white/5 px-3 py-2.5 rounded-xl"
            >
              <LogOut className="w-4 h-4 text-red-500"/> Esci
            </button>
          </div>
        </div>
      </header>

      {/* PIN COACH MODAL (Z-INDEX GARANTITO) */}
      {showCoachPinModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
          <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-black text-white mb-2 flex items-center gap-2">
              <Lock className="text-[#E50914]" /> Area Riservata Coach
            </h3>
            <p className="text-xs text-zinc-400 mb-4">Inserisci il PIN (default: 1234) per accedere alla gestione coach.</p>
            <form onSubmit={verifyCoachPin} className="space-y-4">
              <input
                type="password"
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                placeholder="PIN"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-center text-xl font-mono text-white outline-none focus:border-[#E50914]"
                autoFocus
              />
              {pinError && <p className="text-xs text-[#E50914] text-center font-bold">PIN Errato o non autorizzato!</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => { setShowCoachPinModal(false); setPinInput(''); setPinError(false); }} className="w-1/2 bg-zinc-800 py-2.5 rounded-xl text-xs font-bold text-zinc-300 cursor-pointer">Annulla</button>
                <button type="submit" className="w-1/2 bg-[#E50914] hover:brightness-110 py-2.5 rounded-xl text-xs font-bold text-white uppercase cursor-pointer">Sblocca</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NAVBAR A SCORRIMENTO MODERNA */}
      <nav className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-[#12151B] backdrop-blur-md border border-white/10 rounded-2xl scrollbar-none shadow-lg">
          {userRole === 'ATHLETE' && (
            <button onClick={() => setActiveTab('workout')} className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${activeTab === 'workout' ? 'bg-[#E50914] text-white shadow' : 'text-zinc-400 hover:text-white'}`}>
              Esegui Allenamento
            </button>
          )}

          <button onClick={() => setActiveTab('readiness')} className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === 'readiness' ? 'bg-[#E50914] text-white shadow' : 'text-zinc-400 hover:text-white'}`}>
            <Gauge className="w-4 h-4 text-green-400" /> Check Readiness
          </button>

          <button onClick={() => setActiveTab('records')} className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === 'records' ? 'bg-[#E50914] text-white shadow' : 'text-zinc-400 hover:text-white'}`}>
            <Trophy className="w-4 h-4 text-yellow-500" /> Record
          </button>

          <button onClick={() => setActiveTab('goals')} className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === 'goals' ? 'bg-[#E50914] text-white shadow' : 'text-zinc-400 hover:text-white'}`}>
            <Target className="w-4 h-4 text-[#E50914]" /> Obiettivi
          </button>

          <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === 'analytics' ? 'bg-[#E50914] text-white shadow' : 'text-zinc-400 hover:text-white'}`}>
            <TrendingUp className="w-4 h-4 text-blue-400" /> Progressi
          </button>

          {userRole === 'COACH' && (
            <>
              <button
                onClick={() => setActiveTab('coachDashboard')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === 'coachDashboard' ? 'bg-[#E50914] text-white shadow' : 'text-zinc-400 hover:text-white'}`}
              >
                <Users className="w-4 h-4 text-indigo-400" /> Dashboard Atleti
              </button>
              <button
                onClick={() => setActiveTab('builder')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === 'builder' ? 'bg-[#E50914] text-white shadow' : 'text-zinc-400 hover:text-white'}`}
              >
                <UserCheck className="w-4 h-4 text-emerald-400" /> Gestisci Scheda (Coach)
              </button>
            </>
          )}

          <button onClick={() => setActiveTab('leaderboard')} className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === 'leaderboard' ? 'bg-[#E50914] text-white shadow' : 'text-zinc-400 hover:text-white'}`}>
            <Medal className="w-4 h-4 text-yellow-500" /> Classifica
          </button>

          {userRole === 'ATHLETE' && (
            <button onClick={() => setActiveTab('settings')} className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === 'settings' ? 'bg-[#E50914] text-white shadow' : 'text-zinc-400 hover:text-white'}`}>
              <Settings className="w-4 h-4 text-zinc-300" /> Impostazioni
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto space-y-6">
        {/* Banner Notifiche per Atleta */}
        {showPushBanner && userRole === 'ATHLETE' && (
          <div className="bg-gradient-to-r from-red-950/80 to-[#12151B] border border-[#E50914]/60 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#E50914] text-white rounded-xl">
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
                className="w-full sm:w-auto bg-[#E50914] hover:brightness-110 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                {pushLoading ? 'Attivazione...' : 'Attiva con 1 Click'}
              </button>
            </div>
          </div>
        )}

{/* TAB 1: WORKOUT */}
{activeTab === 'workout' && userRole === 'ATHLETE' && (
          <div className="space-y-6">
            {highFatigueDetected && (
              <div className="bg-amber-950/40 border border-amber-600/60 p-4 rounded-2xl flex items-start gap-3 text-amber-300 backdrop-blur-md">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-amber-200">Livello di Fatica Accumulata Elevato!</h4>
                  <p className="text-xs text-amber-300/80 mt-1">Hai registrato serie consecutive ad RPE 9.5+. Considera di estendere il recupero di 30s.</p>
                </div>
              </div>
            )}

            {/* BANNER METODO TOPGYM · VISIBILE ESCLUSIVAMENTE SULLE TUE SCHEDE */}
            {isMasterProgram && (
              <div className="bg-gradient-to-r from-red-950/40 via-[#12151B] to-[#12151B] border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 backdrop-blur-md shadow-xl animate-in fade-in duration-200">
                <div>
                  <span className="text-[10px] text-[#E50914] font-black uppercase tracking-wider block">
                    Metodo TOPGYM · {currentBlock === 'BLOCCO_1_FORZA' ? 'Blocco 1: Forza Ipertrofica' : currentBlock === 'BLOCCO_2_TRASFORMAZIONE' ? 'Blocco 2: Trasformazione' : 'Blocco 3: Qualità Muscolare'}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{getPhaseDescription(currentBlock, calculatedCurrentPhase).title}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">{getPhaseDescription(currentBlock, calculatedCurrentPhase).desc}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 text-yellow-400 block">
                    Settimana Reale: {calculatedCurrentRealWeek} (Fase Automatica {calculatedCurrentPhase})
                  </span>
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    {workoutHistory.length} allenamenti completati nello storico
                  </span>
                </div>
              </div>
            )}

            <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <h2 className="text-xl font-black text-white flex items-center gap-2"><Dumbbell className="text-[#E50914]" /> Scheda: {programName}</h2>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {programDays.map((day, index) => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => { setSelectedDayIndex(index); if (day.exercises[0]) setCurrentExId(day.exercises[0].id); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${selectedDayIndex === index ? 'bg-[#E50914] border-[#E50914] text-white shadow' : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'}`}
                  >
                    Giorno {day.dayNumber} · {day.title}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {activeRoutine.map((ex) => {
                  const isBw = !!findBodyweightConfig(ex.name);
                  const hasLoggedToday = logs.some(l => l.exerciseName === ex.name && l.date === todayIso());
                  return (
                    <div 
                      key={ex.id} 
                      onClick={() => setCurrentExId(ex.id)} 
                      className={`p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${
                        currentExId === ex.id 
                          ? 'bg-zinc-900/90 border-[#E50914] ring-1 ring-[#E50914]/50 shadow-lg' 
                          : 'bg-zinc-900/40 border-white/5 hover:border-zinc-700'
                      }`}
                    >
                      {currentExId === ex.id && <div className="absolute top-0 left-0 w-1 h-full bg-[#E50914]" />}
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold text-base text-white block">{ex.name}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            {/* Stimolo visibile solo se è una tua scheda periodizzata */}
                            {isMasterProgram && (
                              <span className="text-[10px] text-zinc-400 font-mono">
                                {ex.stimulusType === 'NEURAL' ? '⚡ Neurale' : ex.stimulusType === 'METABOLIC' ? '🔥 Metabolico' : '💪 Ipertrofico'}
                              </span>
                            )}
                            {isBw && <span className="text-[9px] text-purple-400 font-bold uppercase bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">Corpo Libero</span>}
                            {hasLoggedToday && <span className="text-[9px] text-green-400 font-bold uppercase bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20 flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5"/> Completato oggi</span>}
                          </div>
                        </div>
                        {/* Mostra il badge della tecnica solo per le schede Master o se la tecnica non è semplicemente REGULAR */}
                        {(isMasterProgram || ex.executionType !== 'REGULAR') && (
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${getBadgeStyle(ex.executionType)}`}>{ex.executionType}</span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs bg-black/30 p-2.5 rounded-lg border border-white/5 mt-3">
                        <div><span className="text-[9px] text-zinc-400 uppercase font-bold block">Serie/Reps</span><b className="text-white">{ex.sets} × {ex.reps}</b></div>
                        <div><span className="text-[9px] text-zinc-400 uppercase font-bold block">Target</span><b className="text-white">{ex.targetWeight} Kg</b></div>
                        <div>
                          <span className="text-[9px] text-zinc-400 uppercase font-bold block">{isMasterProgram ? 'TUT' : 'Recupero'}</span>
                          <b className="text-yellow-500 font-mono">{isMasterProgram ? (ex.tut || '2-0-1-0') : `${ex.restSeconds || 90}s`}</b>
                        </div>
                      </div>
                      {ex.notes && <div className="text-[11px] text-zinc-400 italic mt-2.5 pt-2 border-t border-white/5">Note: {ex.notes}</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {currentExercise && (
              <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md space-y-5">
                <div className="pb-4 border-b border-white/10 flex justify-between items-end flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-[#E50914] px-2 py-0.5 rounded-md font-bold uppercase">
                      In Esecuzione
                    </span>
                    <h3 className="text-2xl font-black text-white flex items-center gap-2 mt-1.5">
                      {currentExercise.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Target: {currentExercise.sets} Serie × {currentExercise.reps} Reps @ {currentExercise.targetWeight} Kg 
                      {isMasterProgram && currentExercise.rpeTarget ? ` (RPE ${currentExercise.rpeTarget})` : ''}
                    </p>
                  </div>
                  {estimated1RMPreview !== null && (
                    <div className="bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl text-right">
                      <div className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">1RM Stimato</div>
                      <div className="text-xl font-black text-[#E50914]">{estimated1RMPreview} Kg</div>
                      {currentIntensityPreview && (
                        <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border uppercase inline-block mt-1 ${currentIntensityPreview.colorClasses}`}>
                          {currentIntensityPreview.pct}% 1RM · {currentIntensityPreview.label}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* CONFRONTO CON L'ULTIMA SESSIONE */}
                {lastLoggedSet && (
                  <div className="bg-zinc-900/60 p-3 rounded-xl border border-white/5 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="text-zinc-400 flex items-center gap-2">
                      <History className="w-4 h-4 text-zinc-400" />
                      <span>
                        Ultima volta:{' '}
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
                    <button type="button" onClick={handleAutoFillLastLog} className="text-xs text-[#E50914] font-bold flex items-center gap-1.5 hover:underline cursor-pointer">
                      <Copy className="w-3.5 h-3.5"/> Copia Ultimo Carico
                    </button>
                  </div>
                )}

                {/* INFO CORPO LIBERO */}
                {currentBodyweightConfig && (
                  <div className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl text-xs text-purple-200">
                    <span className="font-bold">Modalità Corpo Libero ({Math.round(currentBodyweightConfig.percentage * 100)}%): </span>
                    {sessionBodyWeight ? (
                      <span>
                        Peso Readiness: <b>{sessionBodyWeight} kg</b>. 
                        Quota corporea: <b>{Math.round(sessionBodyWeight * currentBodyweightConfig.percentage * 10) / 10} kg</b>. 
                        Inserisci <b>0</b> per solo peso corporeo oppure la <b>zavorra</b>.
                      </span>
                    ) : (
                      <span className="text-amber-300">
                        ⚠️ Nessun peso inserito nel Check Readiness. Il carico effettivo resterà non calcolato.
                      </span>
                    )}
                  </div>
                )}

                <form onSubmit={handleLogSet} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] uppercase font-bold text-zinc-400">
                          {currentBodyweightConfig ? 'Zavorra (Kg)' : 'Carico (Kg)'}
                        </label>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => adjustWeight(-2.5)} className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold rounded text-zinc-300">-2.5</button>
                          <button type="button" onClick={() => adjustWeight(2.5)} className="px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold rounded text-zinc-300">+2.5</button>
                        </div>
                      </div>
                      <input 
                        type="number" 
                        step="0.5" 
                        min="0"
                        required 
                        value={weight} 
                        onChange={e => setWeight(e.target.value)} 
                        placeholder={currentBodyweightConfig ? '0' : '80'} 
                        className="w-full bg-transparent text-xl font-black text-white outline-none" 
                      />
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Reps</label>
                      <input 
                        type="number" 
                        min="1"
                        required 
                        value={reps} 
                        onChange={e => setReps(e.target.value)} 
                        placeholder="8" 
                        className="w-full bg-transparent text-xl font-black text-white outline-none" 
                      />
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
                  <button type="submit" className="w-full bg-[#E50914] hover:brightness-110 text-white font-bold py-3.5 rounded-xl uppercase text-sm tracking-wider transition-transform active:scale-95 cursor-pointer shadow-lg">
                    <Plus className="w-5 h-5 inline mr-1"/> Registra Serie (+10 XP)
                  </button>
                </form>

                <div className="mt-6">
                  <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2.5">Serie Registrate Oggi ({todayLogs.length})</h4>
                  <div className="space-y-2">
                    {todayLogs.map((log, i) => {
                      const intensity = getIntensityInfo(log.exerciseName, log.effectiveLoad || log.weight);
                      return (
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
                            {intensity && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${intensity.colorClasses}`}>
                                {intensity.pct}% 1RM · {intensity.label}
                              </span>
                            )}
                          </div>
                          <button type="button" onClick={() => handleDeleteLog(log.id)} title="Elimina serie" className="p-2 text-zinc-500 hover:text-rose-400 rounded-lg transition cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* BARRA INFERIORE FLUTTUANTE PER AZIONI RAPIDE */}
            <div className="fixed bottom-4 left-4 right-4 z-40 max-w-5xl mx-auto bg-[#12151B]/95 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {restTimer !== null ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono font-bold">
                    <Timer className="w-4 h-4 animate-pulse" />
                    <span>Recupero: {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, '0')}</span>
                  </div>
                ) : (
                  <span className="text-xs text-zinc-400 font-medium">Sessione in corso · {todayLogs.length} set registrati</span>
                )}
              </div>
              <button
                onClick={handleFinishAndSaveWorkout}
                disabled={isSavingWorkout}
                className="bg-emerald-600 hover:brightness-110 text-white font-black px-6 py-3 rounded-xl uppercase text-xs tracking-wider cursor-pointer shadow-lg transition-all disabled:opacity-50"
              >
                {isSavingWorkout ? 'Salvataggio...' : 'Termina e Salva'}
              </button>
            </div>
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

        {/* TAB 4: READINESS */}
        {activeTab === 'readiness' && (
          <div className="space-y-6">
            <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md space-y-6">
              {userRole === 'ATHLETE' && (
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Gauge className="text-green-400"/> Check-in Giornaliero dello Stato di Forma
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

            <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <History className="text-green-400" /> Storico Check Readiness ({userRole === 'COACH' ? activeAthlete.displayName : displayUserName})
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
                        <span className={`px-2.5 py-0.5 rounded-md font-black text-sm ${item.readinessScore >= 80 ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-yellow-950 text-yellow-400 border border-yellow-800'}`}>Score: {item.readinessScore}%</span>
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

        {/* TAB 5: COACH DASHBOARD */}
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

{/* TAB 6: BUILDER COACH METODO TOPGYM */}
{activeTab === 'builder' && userRole === 'COACH' && (
          <div className="space-y-6">

            {/* CABINA DI REGIA PERIODIZZAZIONE · VISIBILE ESCLUSIVAMENTE AL MASTER COACH */}
            {isMasterCoach && (
              <>
                <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md space-y-5">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="text-[#E50914] w-5 h-5"/> Cabina di Regia Periodizzazione · Metodo TOPGYM
                    </h3>
                    <span className="text-xs text-zinc-400 font-mono">Atleta: <b className="text-white">{activeAthlete.displayName}</b></span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                      1. Imposta Blocco / Mesociclo Attivo:
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setCurrentBlock('BLOCCO_1_FORZA')}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${currentBlock === 'BLOCCO_1_FORZA' ? 'bg-zinc-900 border-[#E50914] ring-1 ring-[#E50914]' : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:bg-zinc-900'}`}
                      >
                        <b className="text-white text-xs block font-black">Blocco 1: Forza Ipertrofica</b>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">Consolida gli schemi motori, costruisce efficienza neurale e alza i carichi base. Lavoro a Buffer.</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentBlock('BLOCCO_2_TRASFORMAZIONE')}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${currentBlock === 'BLOCCO_2_TRASFORMAZIONE' ? 'bg-zinc-900 border-[#E50914] ring-1 ring-[#E50914]' : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:bg-zinc-900'}`}
                      >
                        <b className="text-white text-xs block font-black">Blocco 2: Trasformazione</b>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">Lavoro ibrido pesante + back-off. Si spinge l'effort fino al cedimento nei complementari.</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentBlock('BLOCCO_3_QUALITA')}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${currentBlock === 'BLOCCO_3_QUALITA' ? 'bg-zinc-900 border-[#E50914] ring-1 ring-[#E50914]' : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:bg-zinc-900'}`}
                      >
                        <b className="text-white text-xs block font-black">Blocco 3: Qualità Muscolare</b>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">Massimo sforzo e qualità. Tecniche di intensità massicce (Stripping, Rest-Pause, Back-off).</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                        2. Fasi del Microciclo (Fase Attuale Auto = <b className="text-yellow-400">Fase {calculatedCurrentPhase}</b>):
                      </label>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={handleApplyEngineToCurrentProgram}
                          className="text-xs bg-[#E50914] hover:brightness-110 text-white px-3.5 py-1.5 rounded-lg font-black flex items-center gap-1.5 shadow-md cursor-pointer transition"
                        >
                          ⚡ Applica Progressione Motore alla Scheda
                        </button>
                        <button
                          type="button"
                          onClick={handleApplyDeloadWeekToProgram}
                          className="text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 hover:bg-amber-500/20 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Forza Settimana di Scarico
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsTemplateModalOpen(true)}
                          className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition"
                        >
                          <Layers className="w-3.5 h-3.5 text-[#E50914]" /> Carica Template Split
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[1, 2, 3, 4].map(w => {
                        const desc = getPhaseDescription(currentBlock, w as MicroWeek);
                        const isSelected = calculatedCurrentPhase === w;
                        return (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setManualWeek(w as MicroWeek)}
                            className={`p-3 rounded-xl border text-left transition cursor-pointer ${isSelected ? 'bg-[#E50914] border-[#E50914] text-white shadow-md' : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:bg-zinc-900'}`}
                          >
                            <b className={`text-xs block ${isSelected ? 'text-white' : 'text-zinc-200'}`}>{desc.title}</b>
                            <span className={`text-[10px] block mt-1 ${isSelected ? 'text-white/80' : 'text-zinc-500'}`}>{desc.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* MODALE SELETTORE TEMPLATE (SOLO MASTER COACH) */}
                <TemplatePickerModal
                  isOpen={isTemplateModalOpen}
                  onClose={() => setIsTemplateModalOpen(false)}
                  currentBlock={currentBlock}
                  athleteName={activeAthlete?.displayName || ''}
                  onSelectTemplate={(days, templateName) => {
                    setProgramDays(days as any);
                    setBuilderSuccessMessage(`⚡ Template "${templateName}" caricato con successo!`);
                    setTimeout(() => setBuilderSuccessMessage(null), 5000);
                  }}
                />
              </>
            )}

            {/* SEZIONE GESTIONE SCHEDA · VISIBILE A ENTRAMBI I COACH */}
            <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md space-y-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 border-b border-white/10">
                <div className="space-y-2 flex-1 max-w-md">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white"><UserCheck className="text-[#E50914]"/> Gestione Scheda · {activeAthlete.displayName}</h2>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Nome della Scheda</label>
                    <input
                      type="text"
                      value={programName}
                      onChange={(e) => setProgramName(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-bold outline-none focus:border-[#E50914]"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/5">
                  <span className="text-xs font-bold text-zinc-400">Giorni:</span>
                  <div className="flex gap-1">
                    {([2, 3, 4, 5, 6] as DayCount[]).map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleDayCountChange(num)}
                        className={`px-3 py-1 text-xs font-black rounded-lg border transition-all ${selectedDayCount === num ? 'bg-[#E50914] border-[#E50914] text-white shadow' : 'bg-zinc-800 border-white/5 text-zinc-400 hover:text-white cursor-pointer'}`}
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
                        className={`p-3.5 rounded-xl border flex justify-between items-center text-xs transition-all ${
                          editingExId === ex.id ? 'bg-red-950/30 border-[#E50914]' : 'bg-[#12151B] border-white/5'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{ex.name}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${getBadgeStyle(ex.executionType)}`}>
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
                            className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded-lg transition cursor-pointer"
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
                            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition cursor-pointer"
                            title="Elimina esercizio"
                          >
                            <Trash2 className="w-4 h-4"/>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={e => handleAddOrUpdateExercise(e, day.id)} className="space-y-3 pt-3 border-t border-white/5">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                        Preset Stimolo Metodo TOPGYM:
                      </span>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleApplyTopGymPreset('NEURAL')}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 border border-white/10 transition cursor-pointer"
                        >
                          ⚡ Neurale (2-6 reps · Buffer)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyTopGymPreset('HYPERTROPHIC')}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 border border-white/10 transition cursor-pointer"
                        >
                          💪 Meccanico (6-12 reps · Cedimento/Buffer)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyTopGymPreset('METABOLIC')}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 border border-white/10 transition cursor-pointer"
                        >
                          🔥 Metabolico (12-20 reps · Isolamento)
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
                        <option value="STRIPPING">Tecnica: STRIPPING (Drop Set)</option>
                        <option value="10_PIU_MAX">Tecnica: 10 + MAX</option>
                        <option value="REST_PAUSE">Tecnica: REST-PAUSE</option>
                        <option value="BACK_OFF">Tecnica: BACK-OFF a Cedimento</option>
                        <option value="PARZIALI">Tecnica: RIPETIZIONI PARZIALI</option>
                        <option value="ISOMETRIE">Tecnica: ISOMETRIE FINALI</option>
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
                          <button type="button" onClick={handleCancelEdit} className="bg-zinc-700 text-xs font-bold px-3 py-1.5 rounded-xl text-white cursor-pointer">Annulla</button>
                          <button type="submit" className="bg-amber-400 text-xs font-bold px-4 py-1.5 rounded-xl text-black cursor-pointer">Aggiorna</button>
                        </>
                      ) : (
                        <button type="submit" className="bg-[#E50914] text-xs font-bold px-4 py-1.5 rounded-xl text-white hover:brightness-110 cursor-pointer">Aggiungi</button>
                      )}
                    </div>
                  </form>
                </div>
              ))}

              <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
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
          <AnalyticsDashboard
            logs={logs}
            workoutHistory={workoutHistory}
            programDays={programDays}
            athleteName={activeAthlete?.displayName}
            athleteGender={detectAthleteGender(activeAthlete?.displayName)}
            userRole={userRole}
            onDeleteWorkout={handleDeleteWorkoutHistory}
          />
        )}
        
        {/* TAB 8: CLASSIFICA & BADGE */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white"><Trophy className="text-yellow-500"/> Classifica Palestra</h2>
              <div className="space-y-2">
                {leaderboard.map((ath, index) => (
                  <div key={ath.id} className="p-4 bg-zinc-900/60 rounded-xl border border-white/5 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-zinc-500 font-mono">#{index + 1}</span>
                      <span className="font-bold text-white">{ath.displayName}</span>
                    </div>
                    <span className="font-black text-yellow-500">{ath.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white"><Medal className="text-yellow-500"/> Trofei & Traguardi</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {achievements.map(ach => (
                  <div key={ach.id} className={`p-4 rounded-xl border flex items-center gap-3 transition ${ach.unlocked ? 'bg-zinc-900/80 border-amber-500/30' : 'bg-black/20 border-white/5 opacity-50'}`}>
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

        {/* TAB 9: IMPOSTAZIONI */}
        {activeTab === 'settings' && userRole === 'ATHLETE' && (
          <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md space-y-6">
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
              <h3 className="text-sm font-bold text-white flex items-center gap-2"><Key className="w-4 h-4 text-yellow-500"/> Password e Sicurezza</h3>
              <p className="text-xs text-zinc-400">Invia un link alla tua email per cambiare la tua password.</p>
              <button type="button" onClick={handlePasswordReset} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition flex items-center gap-2 cursor-pointer">Invia Email Recupero Password</button>
            </div>

            <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 space-y-3">
              <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2"><UserX className="w-4 h-4 text-rose-500"/> Zona Pericolo</h3>
              <p className="text-xs text-zinc-400">Rimuovi definitivamente il tuo profilo Atleta.</p>
              <button type="button" onClick={handleDeleteAccount} className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer">Cancella Definitivamente Account</button>
            </div>
          </div>
        )}
      </main>

      {/* MODALE GUIDA PERMESSI BLOCCATI (DENIED) */}
      {showDeniedModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Notifiche Disattivate</h3>
                <p className="text-xs text-zinc-400">Hai bloccato i permessi nel browser</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
              <p>
                Il browser non consente di richiedere nuovamente l&apos;autorizzazione in automatico. Per abilitarle manualmente:
              </p>

              <div className="bg-zinc-900 p-3.5 rounded-xl border border-white/5 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 bg-[#E50914] text-white rounded-full flex items-center justify-center font-bold text-[11px]">1</span>
                  <span>Tocca l&apos;icona delle <b>impostazioni sito / lucchetto</b> a sinistra dell&apos;indirizzo web in alto.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 bg-[#E50914] text-white rounded-full flex items-center justify-center font-bold text-[11px]">2</span>
                  <span>Cerca la voce <b>Notifiche</b> o <b>Autorizzazioni</b>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 bg-[#E50914] text-white rounded-full flex items-center justify-center font-bold text-[11px]">3</span>
                  <span>Imposta su <b className="text-green-400">Consenti</b> oppure tocca <b>Reimposta autorizzazioni</b>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 bg-[#E50914] text-white rounded-full flex items-center justify-center font-bold text-[11px]">4</span>
                  <span>Ricarica la pagina e premi di nuovo <i>Attiva Notifiche</i>.</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDeniedModal(false)}
              className="w-full bg-[#E50914] hover:brightness-110 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer"
            >
              Ho capito, chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}