"use client";
import { ClipboardList, Printer } from "lucide-react";

import { BookOpen, Layers } from "lucide-react";
import MethodologiesGuide from "@/components/MethodologiesGuide";

import { getActiveSessionForAthlete, resolveEngineKey, ENGINE_METADATA } from "@/lib/topgym-timeline-generator";
import MacrocycleTimelineModal from '@/components/MacrocycleTimelineModal';
import { calculatePlannedWeeklySets } from "@/lib/topgym-volume";
import WeeklyVolumeRadar from "@/components/WeeklyVolumeRadar";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef } from "react";
import { supabase,
  saveCompletedWorkoutToSupabase,
  getWorkoutHistoryFromSupabase,
  deleteWorkoutHistoryFromSupabase,
  saveProgramToSupabase,
  getProgramFromSupabase } from "@/lib/store";
import dynamic from 'next/dynamic';


import {
  Trophy, Shield, Dumbbell, UserCheck, Timer, Plus, CheckCircle, TrendingUp,
  Volume2, VolumeX, Lock, Unlock, Eye, AlertTriangle, Copy, Sparkles, Scale,
  LogOut, Medal, Moon, Brain, BatteryCharging, Gauge, CalendarDays, Trash2,
  History, Settings, UserX, ChevronDown, ChevronUp, Pencil, Target, Users,
  Bell, MessageSquare, X } from "lucide-react";

// --- IMPORTAZIONI STATICHE (Core Leggero) ---
import { subscribeUserToPush, sendPushNotification } from "@/lib/push";
import ChatBox from "@/components/ChatBox";
import { RestTimerBar } from '@/components/RestTimerBar';
import ActiveWorkoutSession from '@/components/ActiveWorkoutSession';
import { computeEffectiveLoad, findBodyweightConfig } from "@/lib/lib/bodyweight";
import NotificationBell from "@/components/NotificationBell";
import PersonalRecords from "@/components/PersonalRecords";
import AthleteGoals from "@/components/AthleteGoals";
import { detectAthleteGender } from "@/lib/topgym-templates";
import { resolveMuscleTarget } from "@/lib/topgym-volume";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useProgramRealtime } from "@/lib/useProgramRealtime";
import { ExerciseCard } from '@/components/ExerciseCard';
import { exportProgramToPDF } from "@/lib/lib/exportPdf";

// ==========================================
// LAZY LOADING: Moduli Pesanti (Scaricati solo quando servono)
// ==========================================
const AnalyticsDashboard = dynamic(() => import("@/components/AnalyticsDashboard"), { ssr: false });
const CoachDashboard = dynamic(() => import("@/components/CoachDashboard"), { ssr: false });
const TemplatePickerModal = dynamic(() => import("@/components/TemplatePickerModal"), { ssr: false });

export type DayCount = 2 | 3 | 4 | 5 | 6;
export type UserRole = "ATHLETE" | "COACH";

export type ExecutionType =
  | "REGULAR"
  | "STRIPPING"
  | "10_PIU_MAX"
  | "REST_PAUSE"
  | "BACK_OFF"
  | "PARZIALI"
  | "ISOMETRIE"
  | "SUPERSET"
  | "CLUSTER";

export type MuscleGroup =
  | "Petto"
  | "Dorso"
  | "Spalle"
  | "Quadricipiti"
  | "Femorali"
  | "Glutei"
  | "Bicipiti"
  | "Tricipiti"
  | "Polpacci"
  | "Addome";

export type MacroBlock =
  "BLOCCO_1_FORZA" | "BLOCCO_2_TRASFORMAZIONE" | "BLOCCO_3_QUALITA";
export type MicroWeek = 1 | 2 | 3 | 4; // Map: 1=Fase I, 2=Fase II, 3=Scarico, 4=Fase III
export type TopGymStimulus = "NEURAL" | "HYPERTROPHIC" | "METABOLIC";

export const autoDetectMuscleGroup = (nameRaw: string): MuscleGroup => {
  const name = (nameRaw || "").toLowerCase().trim();
  if (!name) return "Petto" as MuscleGroup;

  // 1. TRICIPITI (Pushdown, Cavi Corda, French Press, Ercolina, Kickback)
  if (
    name.includes("pushdown") ||
    name.includes("french") ||
    name.includes("tricipit") ||
    name.includes("triceps") ||
    name.includes("ercolina") ||
    name.includes("corda") ||
    name.includes("kickback") ||
    name.includes("skull crusher") ||
    name.includes("cavo alto") ||
    (name.includes("dip") && !name.includes("petto"))
  ) {
    return "Tricipiti" as MuscleGroup;
  }

  // 2. BICIPITI
  if (
    name.includes("curl") ||
    name.includes("bicipit") ||
    name.includes("biceps") ||
    name.includes("hammer") ||
    name.includes("scott")
  ) {
    return "Bicipiti" as MuscleGroup;
  }

  // 3. SPALLE - DELTOIDI SPECIFICI (Anteriori, Laterali, Posteriori)
  if (name.includes("lateral") || name.includes("cavo lateral")) {
    return "Deltoidi Laterali" as MuscleGroup;
  }
  if (name.includes("face pull") || name.includes("alzate 90") || name.includes("deltoidi post") || name.includes("croci inverse") || name.includes("rear delt")) {
    return "Deltoidi Posteriori" as MuscleGroup;
  }
  if (
    name.includes("70") ||
    name.includes("lento") ||
    name.includes("military") ||
    name.includes("shoulder") ||
    name.includes("spinte spalle") ||
    name.includes("arnold") ||
    name.includes("frontali") ||
    name.includes("alzate")
  ) {
    return "Deltoidi Anteriori" as MuscleGroup;
  }

  // 4. SCHIENA SPECIFICA (Gran Dorsale vs Upper Back)
  if (
    name.includes("trazioni") ||
    name.includes("lat machine") ||
    name.includes("lat pulldown") ||
    name.includes("pullover")
  ) {
    return "Gran Dorsale" as MuscleGroup;
  }
  if (
    name.includes("rematore") ||
    name.includes("row") ||
    name.includes("pulley") ||
    name.includes("seal") ||
    name.includes("scrollate") ||
    name.includes("shrug") ||
    name.includes("dorso")
  ) {
    return "Upper Back" as MuscleGroup;
  }

  // 5. FEMORALI (Stacco Rumeno, Leg Curl, RDL)
  if (
    name.includes("rumeno") ||
    name.includes("semitese") ||
    name.includes("rdl") ||
    name.includes("leg curl") ||
    name.includes("femorali") ||
    name.includes("iperestensioni")
  ) {
    return "Femorali" as MuscleGroup;
  }

  // 6. STACCO DA TERRA / DEADLIFT
  if (name.includes("stacco da terra") || name.includes("deadlift") || name.includes("rack pull")) {
    return "Femorali" as MuscleGroup;
  }

  // 7. GLUTEI
  if (
    name.includes("hip thrust") ||
    name.includes("glute") ||
    name.includes("ponte") ||
    name.includes("abductor") ||
    name.includes("slanci")
  ) {
    return "Glutei" as MuscleGroup;
  }

  // 8. ADDUTTORI
  if (name.includes("adductor") || name.includes("adduttor")) {
    return "Adduttori" as MuscleGroup;
  }

  // 9. QUADRICIPITI
  if (
    name.includes("squat") ||
    name.includes("pressa") ||
    name.includes("leg press") ||
    name.includes("leg extension") ||
    name.includes("affondi") ||
    name.includes("bulgar") ||
    name.includes("hack") ||
    name.includes("sissy")
  ) {
    return "Quadricipiti" as MuscleGroup;
  }

  // 10. POLPACCI
  if (
    name.includes("calf") ||
    name.includes("polpacc") ||
    name.includes("soleo")
  ) {
    return "Polpacci" as MuscleGroup;
  }

  // 11. ADDOME / CORE
  if (
    name.includes("crunch") ||
    name.includes("plank") ||
    name.includes("addom") ||
    name.includes("core") ||
    name.includes("leg raise") ||
    name.includes("sit up")
  ) {
    return "Addome" as MuscleGroup;
  }

  // 12. PETTO (Default per spinte piane/inclinate, croci)
  if (
    name.includes("panca") ||
    name.includes("spinte") ||
    name.includes("chest") ||
    name.includes("croci") ||
    name.includes("pectoral") ||
    name.includes("dip")
  ) {
    return "Petto" as MuscleGroup;
  }

  return "Petto" as MuscleGroup;
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
  weekOverrides?: any;
  [key: string]: any;
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
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const clampDayCount = (n: number): DayCount =>
  Math.min(6, Math.max(2, n)) as DayCount;

const makeId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
    return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const parseLocalDate = (value: any): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const d = new Date(value);
  if (!isNaN(d.getTime())) return d;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (match)
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return null;
};

export default function TopGymApp() {
  const [user, setUser] = useState<any>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
const [resetEmailSent, setResetEmailSent] = useState(false);
const [resetLoading, setResetLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);
  const [profileHeight, setProfileHeight] = useState("");
  const [profileTargetWeight, setProfileTargetWeight] = useState("");
  const [profileGoal, setProfileGoal] = useState("Ipertrofia");
  const [profileExperience, setProfileExperience] = useState("Intermedio");
  const [profileNotes, setProfileNotes] = useState("");
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
const [newPassword, setNewPassword] = useState("");
const [recoveryLoading, setRecoveryLoading] = useState(false);
const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [showPushBanner, setShowPushBanner] = useState(false);
  const [showDeniedModal, setShowDeniedModal] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
// [RIMOSSO] Calcolo dinamico punto zero

// DOPO (SOSTITUISCI CON):
const [programmingModel, setProgrammingModel] = useState<
  | "TOPGYM_BLOCKS"
  | "HARDTOPGYM"
  | "ACETO"
  | "NOCERINO"
  | "POWERBLOCK_HYBRID"
  | "BLOOD_VOLUME_OVERLOAD"
  | "HELMS_PYRAMID"
  | "BIKINI_WAVE"
>("TOPGYM_BLOCKS");

  
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        setShowPushBanner(true);
      }
    }
  }, []);

  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [activeAthleteId, setActiveAthleteId] = useState<string>("");

// Ruolo utente persistente (Evita il reset al refresh F5)
const [userRole, setUserRole] = useState<UserRole>(() => {
  if (typeof window !== 'undefined') {
    const savedRole = localStorage.getItem('topgym_user_role');
    return (savedRole === 'COACH' || savedRole === 'ATHLETE') ? savedRole : 'ATHLETE';
  }
  return 'ATHLETE';
});

const [showCoachPinModal, setShowCoachPinModal] = useState(false);
const [pinInput, setPinInput] = useState("");
const [pinError, setPinError] = useState(false);
const [isMasterCoach, setIsMasterCoach] = useState<boolean>(() => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('topgym_is_master_coach') === 'true';
  }
  return false;
});

// Tab attivo persistente (Mantiene tutti i tipi originali intatti)
const [activeTab, setActiveTab] = useState<
    | "methodologies"
  | "workout"
  | "readiness"
  | "analytics"
  | "builder"
  | "coachDashboard"
  | "leaderboard"
  | "records"
  | "goals"
  | "settings"
  | "chat"
>(() => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('topgym_active_tab') as any) || 'workout';
  }
  return 'workout';
});

// Salvataggio automatico su localStorage al cambio di stato
useEffect(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('topgym_user_role', userRole);
  }
}, [userRole]);

useEffect(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('topgym_user_role', userRole);
  }
}, [userRole]);

useEffect(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('topgym_is_master_coach', String(isMasterCoach));
  }
}, [isMasterCoach]);

useEffect(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('topgym_active_tab', activeTab);
  }
}, [activeTab]);

  const [userXp, setUserXp] = useState(0);
  const userXpRef = useRef(0);
  useEffect(() => {
    userXpRef.current = userXp;
  }, [userXp]);

  const [soundEnabled, setSoundEnabled] = useState(true);

  // Filtro data calendario
  const [analyticsDate, setAnalyticsDate] = useState(todayIso());

  // METODO TOPGYM
  const [currentBlock, setCurrentBlock] =
    useState<MacroBlock>("BLOCCO_1_FORZA");
  const [manualWeek, setManualWeek] = useState<MicroWeek | null>(null);

  // Readiness
  const [selectedDayCount, setSelectedDayCount] = useState<DayCount>(4);
  const [sleepHours, setSleepHours] = useState("0");
  const [sleepQuality, setSleepQuality] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);
  const [domsLevel, setDomsLevel] = useState(0);
  const [energyLevel, setEnergyLevel] = useState(0);
  const [bodyWeight, setBodyWeight] = useState("");

  const [readinessSuccessMessage, setReadinessSuccessMessage] = useState<
    string | null
  >(null);
  const [builderSuccessMessage, setBuilderSuccessMessage] = useState<
    string | null
  >(null);
  const [workoutSuccessMessage, setWorkoutSuccessMessage] = useState<
    string | null
  >(null);
  const [isSavingWorkout, setIsSavingWorkout] = useState(false);

  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(
    null,
  );

  const [readinessHistory, setReadinessHistory] = useState<ReadinessLog[]>([]);
  const [coachReadinessHistory, setCoachReadinessHistory] = useState<any[]>([]);
  const [readinessLoadError, setReadinessLoadError] = useState<string | null>(
    null,
  );

  const [programName, setProgramName] = useState("Scheda Metodo TOPGYM");
  
  // Allinea gli esercizi della scheda ai loro gruppi reali se sporcati da vecchi salvataggi
  const sanitizeProgramExercises = (days: any[]) => {
    return days.map((d: any) => ({
      ...d,
      exercises: (d.exercises || []).map((ex: any) => {
        const name = (ex.name || "").toLowerCase();
        let targetGroup = ex.muscleGroup;
        // Se un esercizio per le braccia e rimasto etichettato come Petto, sanalo direttamente nella scheda
        if (ex.muscleGroup === "Petto" && (name.includes("pushdown") || name.includes("french") || name.includes("ercolina") || name.includes("kickback"))) {
          targetGroup = "Tricipiti";
        } else if (ex.muscleGroup === "Petto" && (name.includes("curl") || name.includes("hammer") || name.includes("scott"))) {
          targetGroup = "Bicipiti";
        }
        return { ...ex, muscleGroup: targetGroup };
      })
    }));
  };
  
  const [programDays, setProgramDays] = useState<WorkoutDay[]>([]);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [viewWeekSelected, setViewWeekSelected] = useState<number>(1);
  const [viewDaySelected, setViewDaySelected] = useState<number>(0);
  const [currentExId, setCurrentExId] = useState("ex1");

  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [rpe, setRpe] = useState("8");
  const [logs, setLogs] = useState<SetLog[]>([]);

  const displayUserName =
    user?.user_metadata?.username ||
    (user?.email ? user.email.split("@")[0] : "Atleta");
  const targetUserId =
    ((userRole as any) === "COACH") ? activeAthleteId || user?.id || "" : user?.id || "";
  const targetAthleteName = useMemo(
    () => athletes.find((a) => a.id === targetUserId)?.displayName ?? "Atleta",
    [athletes, targetUserId],
  );

  // [PULITO] Persistenza sessione delegata interamente ad ActiveWorkoutSession

  useEffect(() => {
    if (!supabase) return;
    const fetchAthletes = async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, username, email, xp");
    
      console.log("DEBUG PROFILI SUPABASE:", { profiles, error });
    
      if (profiles) {
        const formatted: Athlete[] = profiles.map((p: any) => ({
          id: p.id,
          displayName:
            p.username || (p.email ? p.email.split("@")[0] : "Atleta"),
          email: p.email || "",
          xp: p.xp || 0 }));
        setAthletes(formatted);

        // --- SELEZIONE INTELLIGENTE DELL'UTENTE CONNESSO ---
        if (formatted.length > 0) {
          const { data: authData } = await supabase.auth.getUser();
          const myId = authData?.user?.id;
          const myEmail = (authData?.user?.email || "").toLowerCase().trim();

          const myProfile = formatted.find(
            (a: any) =>
              a.id === myId ||
              (a.email && a.email.toLowerCase().trim() === myEmail),
          );

          if (((userRole as any) === "ATHLETE") && myProfile) {
            setActiveAthleteId(myProfile.id);
          } else if (!activeAthleteId) {
            setActiveAthleteId(myProfile ? myProfile.id : formatted[0].id);
          }
        }
      }
    };
    fetchAthletes();

    const loadXp = (userId: string) => {
      supabase!
        .from("profiles")
        .select("xp")
        .eq("id", userId)
        .single()
        .then(({ data }) => {
          if (data && typeof data.xp === "number") setUserXp(data.xp);
        });
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadXp(session.user.id);
      }
    });

    const {
      data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY")
        setIsRecoveryMode(true);
      setUser(session?.user ?? null);
      if (session?.user) loadXp(session.user.id);
      else setUserXp(0);
    });
    return () => subscription.unsubscribe();
  }, []);

  const addXp = useCallback(
    async (amount: number) => {
      const newXp = userXpRef.current + amount;
      userXpRef.current = newXp;
      setUserXp(newXp);
      const uid = user?.id;
      if (supabase && uid) {
        await supabase.from("profiles").update({ xp: newXp }).eq("id", uid);
        setAthletes((prev) =>
          prev.map((a) => (a.id === uid ? { ...a, xp: newXp } : a)),
        );
      }
    },
    [user?.id],
  );

  const loadHistory = useCallback(async (userId: string) => {
    if (!userId) return;
    try {
      const data = await getWorkoutHistoryFromSupabase(userId);
      setWorkoutHistory(Array.isArray(data) ? data : []);
    } catch {
      setWorkoutHistory([]);
    }
  }, []);

  const loadAllAthletesReadiness = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("readiness_logs")
        .select("user_id, readiness_score, date")
        .order("date", { ascending: false });
      if (!error && data) {
        const mapped = data.map((d: any) => ({
          athleteId: d.user_id,
          user_id: d.user_id,
          readinessScore: Number(d.readiness_score) || 0,
          readiness_score: Number(d.readiness_score) || 0,
          date: d.date
        }));
        setCoachReadinessHistory(mapped);
      }
    } catch (e) {
      console.error("Errore caricamento readiness globale coach:", e);
    }
  }, []);

  useEffect(() => {
    if (userRole === "COACH" || activeTab === "coachDashboard") {
      loadAllAthletesReadiness();
    }
  }, [userRole, activeTab, loadAllAthletesReadiness]);

  const loadReadinessHistory = useCallback(async (userId: string) => {
    if (!supabase || !userId) {
      setReadinessLoadError(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("readiness_logs")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

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
        recommendation: r.recommendation }));
      setReadinessHistory(formatted);
    } catch (e: any) {
      setReadinessHistory([]);
      setReadinessLoadError(
        e?.message || "Errore di rete durante il caricamento.",
      );
    }
  }, []);

  // Ascoltatore globale per le notifiche chat in tempo reale (funziona da qualsiasi tab)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Richiedi il permesso per le notifiche all'avvio
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const myCurrentId = userRole === 'COACH' ? 'coach-admin' : (targetUserId || 'atleta-id');

    // Canale globale supabase per intercettare i messaggi in arrivo
    const globalChannel = supabase
      .channel('global-chat-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages' },
        (payload) => {
          const msg = payload.new as any;
          // Se il messaggio NON è stato inviato da me
          if (msg && msg.sender_id !== myCurrentId) {
            // Se sono il coach, o se sono l'atleta destinatario della stanza
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`Top Gym - Messaggio da ${msg.sender_name || 'Utente'}`, {
                body: msg.message,
                icon: '/favicon.ico' });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(globalChannel);
    };
  }, [userRole, targetUserId]);

  // Sincronizzazione in tempo reale del programma (Supabase Realtime)
  useProgramRealtime(targetUserId, (updatedProgram) => {
    if (updatedProgram && updatedProgram.days_data && updatedProgram.days_data.length > 0) {
      setProgramDays(updatedProgram.days_data);
      const detectedEngine = updatedProgram.days_data[0]?.method || updatedProgram.days_data[0]?.programmingModel || updatedProgram.days_data[0]?.engine;
      if (detectedEngine) setProgrammingModel(detectedEngine as any);
      setSelectedDayCount(clampDayCount(updatedProgram.days_data.length));
      if (updatedProgram.program_name) setProgramName(updatedProgram.program_name);
    }
  });

  useEffect(() => {
    if (!supabase || !targetUserId) return;
    let isMounted = true;
    setProgramDays([]);
    setSelectedDayIndex(0);
    getProgramFromSupabase(targetUserId)
      .then((data) => {
        if (!isMounted) return;
        if (data && data.days_data && data.days_data.length > 0) {
          setProgramDays(data.days_data);
          const detectedEngine = data.days_data[0]?.method || data.days_data[0]?.programmingModel || data.days_data[0]?.engine;
          if (detectedEngine) setProgrammingModel(detectedEngine as any);
          setSelectedDayCount(clampDayCount(data.days_data.length));
          if (data.program_name) setProgramName(data.program_name);
        } else {
          const timestamp = Date.now();
          setProgramDays([
            {
              id: `day-1-${timestamp}`,
              dayNumber: 1,
              title: "Spinta (Push)",
              exercises: [] },
            {
              id: `day-2-${timestamp}`,
              dayNumber: 2,
              title: "Trazione (Pull)",
              exercises: [] },
            {
              id: `day-3-${timestamp}`,
              dayNumber: 3,
              title: "Gambe (Legs)",
              exercises: [] },
            {
              id: `day-4-${timestamp}`,
              dayNumber: 4,
              title: "Spalle & Braccia",
              exercises: [] },
          ]);
          setSelectedDayCount(4);
          setProgramName(`Scheda TOPGYM - ${targetAthleteName}`);
        }
      })
      .catch(() => {
        if (isMounted) setProgramDays([]);
      });
    loadHistory(targetUserId);
    loadReadinessHistory(targetUserId);
    return () => {
      isMounted = false;
    };
  }, [
    targetUserId,
    userRole,
    targetAthleteName,
    loadHistory,
    loadReadinessHistory,
  ]);

  const handleAuth = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setErrorMessage("");
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username: username || email.split("@")[0] } } });
      if (error) setErrorMessage(error.message);
      else alert("Registrazione completata! Ora puoi accedere.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password });
      if (error) setErrorMessage(error.message);
    }
  };

  const handleResetPassword = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!email.trim()) {
      setErrorMessage("Inserisci la tua email per ricevere il link di recupero.");
      return;
    }
    setResetLoading(true);
    setErrorMessage("");
  
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin });
  
    setResetLoading(false);
    if (error) {
      setErrorMessage(error.message);
    } else {
      setResetEmailSent(true);
    }
  };

  const handleUpdatePassword = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (newPassword.trim().length < 6) {
      setErrorMessage("La nuova password deve contenere almeno 6 caratteri.");
      return;
    }

    setRecoveryLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.updateUser({
      password: newPassword.trim() });

    setRecoveryLoading(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      setRecoverySuccess(true);
      setTimeout(() => {
        setIsRecoveryMode(false);
        setRecoverySuccess(false);
        setNewPassword("");
        setErrorMessage("");
      }, 2500);
    }
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    if (!user?.id || !supabase) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          if (data.username) setUsername(data.username);
          if (data.height) setProfileHeight(String(data.height));
          if (data.target_weight)
            setProfileTargetWeight(String(data.target_weight));
          if (data.training_goal) setProfileGoal(data.training_goal);
          if (data.experience_level)
            setProfileExperience(data.experience_level);
          if (data.physical_notes) setProfileNotes(data.physical_notes);
        }
      });
  }, [user?.id]);

  const handleUpdateProfile = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!user?.id || !supabase) return;

    await supabase.auth.updateUser({
      data: { username: username.trim() } });

    const { error } = await supabase
      .from("profiles")
      .update({
        username: username.trim(),
        height: profileHeight ? parseFloat(profileHeight) : null,
        target_weight: profileTargetWeight
          ? parseFloat(profileTargetWeight)
          : null,
        training_goal: profileGoal,
        experience_level: profileExperience,
        physical_notes: profileNotes.trim() })
      .eq("id", user.id);

    if (error) {
      setSettingsMessage(`⚠️ Errore salvataggio: ${error.message}`);
    } else {
      setSettingsMessage("✅ Profilo aggiornato con successo!");
      setTimeout(() => setSettingsMessage(null), 3000);
    }
  };

  const handlePushActivation = async () => {
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "denied"
    ) {
      setShowDeniedModal(true);
      return;
    }
    if (!user?.id) return;
    setPushLoading(true);
    const res = await subscribeUserToPush(user.id, supabase);
    if (
      !res.success &&
      (res.message.includes("bloccate") || res.message.includes("rifiutato"))
    ) {
      setShowDeniedModal(true);
    } else {
      if (res.success) setShowPushBanner(false);
      setSettingsMessage(res.message);
      setTimeout(() => setSettingsMessage(null), 5000);
    }
    setPushLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Sei sicuro di voler eliminare il tuo account? Questa azione non può essere annullata.",
      ) ||
      !supabase
    )
      return;
    try {
      const { error } = await supabase.rpc("delete_user");
      if (error)
        setSettingsMessage(
          `⚠️ Impossibile eliminare l'account: ${error.message}`,
        );
      else {
        alert("Account eliminato con successo.");
        await handleLogout();
      }
    } catch {
      await handleLogout();
    }
  };

  // Trigger leggero del Rest Timer isolato (zero re-render su app/page.tsx)
  const startRestTimer = (seconds: number) => {
    if (seconds <= 0) return;
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("topgym:start-rest", { detail: seconds })
      );
    }
  };

  const handleRoleSwitchRequest = (targetRole: UserRole) => {
    if (targetRole === "COACH") {
      setShowCoachPinModal(true);
    } else {
      setUserRole("ATHLETE");
      setIsMasterCoach(false); // <-- Reset di sicurezza quando si torna ad Atleta
      if (activeTab === "builder" || activeTab === "coachDashboard" || activeTab === "methodologies")
        setActiveTab("workout");
    }
  };

  const verifyCoachPin = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const enteredPin = pinInput.trim();

    // 1. ACCESSO MASTER COACH (Tu: tutto sbloccato)
    if (enteredPin === "2222" || enteredPin === "admin") {
      setUserRole("COACH");
      setIsMasterCoach(true);
      setShowCoachPinModal(false);
      setPinInput("");
      setPinError(false);
      if (activeTab === "workout") setActiveTab("builder");
      return;
    }

    // 2. ACCESSO COACH STANDARD (Il tuo socio: solo gestione base)
    if (enteredPin === "5678") {
      setUserRole("COACH");
      setIsMasterCoach(false);
      setShowCoachPinModal(false);
      setPinInput("");
      setPinError(false);
      if (activeTab === "workout") setActiveTab("builder");
      return;
    }

    // PIN errato
    setPinError(true);
  };

  const activeAthlete =
    athletes.find((a) => a.id === activeAthleteId) ||
    (athletes.length > 0
      ? athletes[0]
      : { id: "default", displayName: "Atleta", email: "", xp: 0 });
  const activeDay = programDays[selectedDayIndex] ?? programDays[0];

  // Recupera il peso più recente della Readiness (utilizzato da ActiveWorkoutSession)
  const sessionBodyWeight = useMemo(() => {
    const todayLog = readinessHistory.find(
      (r) => r.date === todayIso() && r.bodyWeight && r.bodyWeight > 0,
    );
    if (todayLog?.bodyWeight) return todayLog.bodyWeight;
    const latestValid = readinessHistory.find(
      (r) => r.bodyWeight && r.bodyWeight > 0,
    );
    return latestValid?.bodyWeight || null;
  }, [readinessHistory]);

  const computeReadiness = useCallback(() => {
    const sleepFactor = sleepQuality * 10 * 0.35;
    const energyFactor = energyLevel * 10 * 0.3;
    const stressFactor = (11 - (stressLevel || 1)) * 10 * 0.2;
    const domsFactor = (11 - (domsLevel || 1)) * 10 * 0.15;
    const totalScore = Math.round(
      sleepFactor + energyFactor + stressFactor + domsFactor,
    );
    let rec = "";
    if (totalScore >= 80)
      rec =
        "Pronto per la massima intensità ! Segui i carichi target e spingi al 100%.";
    else if (totalScore >= 60)
      rec =
        "Stato discreto. Allenamento regolare, ma mantieni 1 rep di margine.";
    else
      rec =
        "Fatica/Stress elevati. Consigliato scarico attivo o riduzione carichi/volume del 15-20%.";
    return { totalScore, rec };
  }, [sleepQuality, energyLevel, stressLevel, domsLevel]);

  const currentReadiness = useMemo(
    () => computeReadiness(),
    [computeReadiness],
  );

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
      recommendation: rec };
    setReadinessHistory((prev) => [newReadiness, ...prev]);
    if (supabase && targetUserId) {
      const { error } = await supabase.from("readiness_logs").insert([
        {
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
          recommendation: newReadiness.recommendation },
      ]);
      if (error) {
        setReadinessHistory((prev) =>
          prev.filter((r) => r.id !== newReadiness.id),
        );
        setReadinessSuccessMessage(
          "⚠️ Errore nel salvataggio del check readiness.",
        );
        setTimeout(() => setReadinessSuccessMessage(null), 4000);
        return;
      }
    }
    await addXp(20);
    setReadinessSuccessMessage(
      "🎉 Check Readiness salvato nello storico dell'atleta! (+20 XP)",
    );
    setSleepHours("0");
    setSleepQuality(0);
    setStressLevel(0);
    setDomsLevel(0);
    setEnergyLevel(0);
    setBodyWeight("");
    setTimeout(() => setReadinessSuccessMessage(null), 4000);
  };

  const handleDayCountChange = (count: DayCount) => {
    setSelectedDayCount(count);
    setProgramDays((prev) => {
      if (prev.length < count) {
        const newDays = [...prev];
        for (let i = prev.length + 1; i <= count; i++) {
          newDays.push({
            id: `day-${i}-${makeId()}`,
            dayNumber: i,
            title: `Giorno ${i}`,
            exercises: [] });
        }
        return newDays;
      }
      return prev.slice(0, count);
    });
    setSelectedDayIndex((prev) => Math.min(prev, count - 1));
  };


  const todayLogs = useMemo(() => {
    const today = todayIso();
    return logs.filter((l) => l.date === today);
  }, [logs]);

  const handleFinishAndSaveWorkout = async () => {
  // Helper anti-virgola iOS per evitare NaN su PostgreSQL
  const parseSafeNumber = (val: any): number => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const str = String(val).replace(',', '.').replace(/[^0-9.-]/g, '');
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  };

    if (isSavingWorkout) return;

    if (todayLogs.length === 0) {
      if (!window.confirm("Attenzione: non hai registrato alcuna serie oggi. Vuoi salvare comunque l'allenamento?")) {
        return;
      }
    } else {
      if (!window.confirm("Sei sicuro di voler terminare e salvare l'allenamento?")) {
        return;
      }
    }

    if (!targetUserId) {
      setWorkoutSuccessMessage("⚠️ Impossibile salvare: utente non identificato.");
      setTimeout(() => setWorkoutSuccessMessage(null), 5000);
      return;
    }

    setIsSavingWorkout(true);

    const dayName = activeDay ? activeDay.title : "Giornata di Allenamento";
    const totalVol = Math.round(
      todayLogs.reduce((acc, curr) => {
        const w = parseSafeNumber(curr.weight);
        const r = parseSafeNumber(curr.reps);
        const eff = parseSafeNumber(curr.effectiveVolume);
        const validEff = eff > 0 && eff < 100000 ? eff : (parseSafeNumber(curr.volume) || (w * r));
        return acc + validEff;
      }, 0) * 10
    ) / 10;

    let result: { success?: boolean; error?: string } = {};
    try {
      const sanitizedLogs = todayLogs.map(l => ({
          ...l,
          weight: parseSafeNumber(l.weight),
          reps: parseSafeNumber(l.reps),
          volume: parseSafeNumber(l.weight) * parseSafeNumber(l.reps)
        }));

        result = await saveCompletedWorkoutToSupabase({
          userId: targetUserId,
          dayName: dayName,
          totalVolume: totalVol,
          exercisesCount: (activeDay?.exercises || []).length,
          logs: sanitizedLogs as any });
    } catch (e: any) {
      result = { success: false, error: e?.message };
    } finally {
      setIsSavingWorkout(false);
    }

    if (!result?.success) {
        alert("⚠️ Attenzione: Impossibile salvare l'allenamento sul server: " + (result?.error || "Errore di connessione.") + "\n\nI tuoi dati NON sono stati cancellati. Controlla la connessione e riprova a premere Salva.");
        setWorkoutSuccessMessage("⚠️ Salvataggio fallito. I tuoi dati sono al sicuro sul telefono, riprova a salvare.");
        return;
      }

      if (result?.success) {
      await addXp(50);
      setLogs([]);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(`topgym_session_logs_${targetUserId || "athlete"}`);
        } catch {}
      }

      // NESSUN AUTO-AVANZAMENTO: La scheda e i carichi rimangono rigorosamente invariati
      setWorkoutSuccessMessage("🎉 Allenamento completato e registrato con successo nello storico! (+50 XP)");

      await loadHistory(targetUserId);
      setTimeout(() => setWorkoutSuccessMessage(null), 5000);
    } else {
      const detail = result?.error ? ` (${result.error})` : "";
      setWorkoutSuccessMessage(
        `⚠️ Errore nel salvataggio dell'allenamento${detail}. Verifica la connessione e riprova.`,
      );
      setTimeout(() => setWorkoutSuccessMessage(null), 8000);
    }
  };

  const handleDeleteWorkoutHistory = async (workoutId?: string) => {
    if (!workoutId) return;
    if (
      !window.confirm(
        "Vuoi davvero eliminare questo allenamento dallo storico?",
      )
    )
      return;
    try {
      await deleteWorkoutHistoryFromSupabase(workoutId);
      setWorkoutHistory((prev) =>
        prev.filter((item) => (item.id || item._id) !== workoutId),
      );
    } catch {
      setWorkoutSuccessMessage(
        "⚠️ Errore durante l'eliminazione dell'allenamento.",
      );
      setTimeout(() => setWorkoutSuccessMessage(null), 4000);
    }
  };

  const handleSaveProgramByCoach = async () => {
    const targetId = activeAthleteId || "default-user";
    let result: { success?: boolean; error?: string } = {};

    

    // 1. Definiamo la firma in base al Coach connesso
    const coachEmail = isMasterCoach
      ? "riprendi@gmail.com"
      : "maggiopaolo34@gmail.com";

    // 2. Firmiamo ogni giornata della scheda con i metadati del Metodo TOPGYM
    // Questi dati viaggiano dentro il JSON di Supabase senza toccare le tabelle del DB
    const programDaysToSave = programDays.map((day) => ({
        ...day,
        isPeriodized: isMasterCoach,
        assignedByCoach: coachEmail,
        weekOverrides: (day as any).weekOverrides || (programDays[0] as any)?.weekOverrides || {}
      }));

    try {
      result = await saveProgramToSupabase(
        targetId,
        programName,
        programDaysToSave,
      );
    } catch (e: any) {
      result = { success: false, error: e?.message };
    }

    if (result?.success) {
        setProgramDays(programDaysToSave as any);
      setBuilderSuccessMessage(
        `✅ Scheda salvata e assegnata con successo a ${activeAthlete.displayName}!`,
      );

      if (supabase && targetId) {
        try {
          await supabase.from("notifications").insert([
            {
              user_id: targetId,
              title: isMasterCoach
                ? "Nuova Scheda Metodo TOPGYM!"
                : "Nuova Scheda di Allenamento",
              message: isMasterCoach
                ? `Il Coach ha assegnato o aggiornato il programma "${programName}".`
                : `Il Coach ha aggiornato la tua scheda "${programName}".`,
              type: "program_assigned" },
          ]);
        } catch {}
      }

      if (targetId && targetId !== "default-user") {
        try {
          await sendPushNotification(
            targetId,
            isMasterCoach
              ? "Nuova Scheda Metodo TOPGYM! ???"
              : "Nuova Scheda Assegnata! ???",
            isMasterCoach
              ? `Il Coach ha aggiornato il tuo programma Metodo TOPGYM (${programName || "Nuova scheda"}).`
              : `Il Coach ha aggiornato la tua scheda di allenamento (${programName || "Nuova scheda"}).`,
            "/",
          );
        } catch {}
      }

      setTimeout(() => setBuilderSuccessMessage(null), 4000);
    } else {
      const detail = result?.error ? ` (${result.error})` : "";
      setBuilderSuccessMessage(
        `⚠️ Errore durante il salvataggio della scheda${detail}.`,
      );
      setTimeout(() => setBuilderSuccessMessage(null), 8000);
    }
  };



  const getBadgeStyle = (type: ExecutionType) => {
    switch (type) {
      case "SUPERSET":
        return "bg-purple-950 text-purple-300 border-purple-800";
      case "REST_PAUSE":
        return "bg-amber-950 text-amber-300 border-amber-800";
      case "STRIPPING":
        return "bg-rose-950 text-rose-300 border-rose-800";
      case "10_PIU_MAX":
        return "bg-red-950 text-red-300 border-red-800";
      case "BACK_OFF":
        return "bg-orange-950 text-orange-300 border-orange-800";
      case "PARZIALI":
        return "bg-pink-950 text-pink-300 border-pink-800";
      case "ISOMETRIE":
        return "bg-cyan-950 text-cyan-300 border-cyan-800";
      case "CLUSTER":
        return "bg-blue-950 text-blue-300 border-blue-800";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
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
  const levelProgressPercentage =
    userLevel >= 99
      ? 100
      : Math.min(
          100,
          Math.round(
            ((userXp - xpForCurrentLevel) /
              (xpForNextLevel - xpForCurrentLevel)) *
              100,
          ),
        );

  const latestReadiness = readinessHistory[0];
  const recentRpeLogs = logs.slice(0, 4);
  const highFatigueDetected =
    recentRpeLogs.length >= 2 && recentRpeLogs.every((l) => l.rpe >= 9.5);

  const leaderboard = useMemo(
    () =>
      athletes
        .map((a) => (a.id === user?.id ? { ...a, xp: userXp } : a))
        .sort((a, b) => b.xp - a.xp),
    [athletes, user?.id, userXp],
  );

  const achievements: Achievement[] = [
    {
      id: "1",
      title: "Club dei 100kg",
      description: "Solleva 100kg o più in un esercizio",
      icon: "???",
      unlocked: workoutHistory.some((w: any) => Array.isArray(w.logs) && w.logs.some((l: any) => Number(l.weight) >= 100)) },
    {
      id: "2",
      title: "PR Breaker",
      description: "Supera il tuo massimale stimato",
      icon: "???",
      unlocked: workoutHistory.some((w: any) => Array.isArray(w.logs) && w.logs.length >= 3) },
    {
      id: "3",
      title: "Atleta Consapevole",
      description: "Registra Check di Readiness",
      icon: "???",
      unlocked: readinessHistory.length >= 1 },
    {
      id: "4",
      title: "Costanza d'Acciaio",
      description: "Accumula oltre 500 XP",
      icon: "???",
      unlocked: userXp >= 500 },
  ];

  // [RIMOSSO] getPhaseDescription

  if (isRecoveryMode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-white font-sans">
        <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
          <h1 className="mb-2 text-center text-2xl font-black uppercase tracking-wider text-[#E50914] flex items-center justify-center gap-2">
            <Dumbbell className="w-7 h-7" /> TOP GYM
          </h1>
          <h2 className="text-sm font-bold text-center text-zinc-200 mb-1">
            Reimposta Password
          </h2>
          <p className="text-xs text-center text-zinc-400 mb-6">
            Inserisci una nuova password sicura per il tuo account.
          </p>

          {errorMessage && (
            <div className="mb-4 rounded bg-red-950/60 p-3 text-xs text-red-200 border border-red-800">
              {errorMessage}
            </div>
          )}

          {recoverySuccess ? (
            <div className="rounded bg-emerald-950/60 p-3 text-xs text-emerald-300 border border-emerald-600/40 text-center font-semibold">
              ✅ Password aggiornata con successo! Accesso in corso...
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs uppercase font-semibold text-zinc-400">
                  Nuova Password (min. 6 caratteri)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded bg-zinc-800 p-2.5 text-white border border-zinc-700 outline-none focus:border-[#E50914]"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={recoveryLoading}
                className="w-full rounded bg-[#E50914] py-3 font-bold uppercase text-white hover:bg-red-700 disabled:opacity-50 transition tracking-wider cursor-pointer"
              >
                {recoveryLoading ? "Salvataggio in corso..." : "Salva Nuova Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-white font-sans">
        <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
          <h1 className="mb-2 text-center text-3xl font-black uppercase tracking-wider text-[#E50914] flex items-center justify-center gap-2">
            <Dumbbell className="w-8 h-8" /> TOP GYM
          </h1>
          <p className="text-xs text-center text-zinc-400 mb-6">
            PWA Gestione Allenamenti & Coaching
          </p>

          {errorMessage && (
            <div className="mb-4 rounded bg-red-950/60 p-3 text-xs text-red-200 border border-red-800">
              {errorMessage}
            </div>
          )}

          {isForgotPassword ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-xs text-zinc-400">
                Inserisci l&apos;email del tuo account TopGym. Riceverai un link per reimpostare la tua password.
              </p>

              {resetEmailSent ? (
                <div className="rounded bg-emerald-950/60 p-3 text-xs text-emerald-300 border border-emerald-600/40">
                  📩 Email inviata! Controlla la casella di posta (e la cartella Spam).
                </div>
              ) : (
                <>
                  <div>
                    <label className="mb-1 block text-xs uppercase font-semibold text-zinc-400">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded bg-zinc-800 p-2.5 text-white border border-zinc-700 outline-none focus:border-[#E50914]"
                      placeholder="atleta@topgym.it"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full rounded bg-[#E50914] py-3 font-bold uppercase text-white hover:bg-red-700 disabled:opacity-50 transition tracking-wider cursor-pointer"
                  >
                    {resetLoading ? "Invio in corso..." : "Invia Link di Recupero"}
                  </button>
                </>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setResetEmailSent(false);
                    setErrorMessage("");
                  }}
                  className="text-xs font-semibold text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  ← Torna al Login
                </button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleAuth} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="mb-1 block text-xs uppercase font-semibold text-zinc-400">
                      Username
                    </label>
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
                  <label className="mb-1 block text-xs uppercase font-semibold text-zinc-400">
                    Email
                  </label>
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
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs uppercase font-semibold text-zinc-400">
                      Password
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setResetEmailSent(false);
                          setErrorMessage("");
                        }}
                        className="text-[11px] text-zinc-400 hover:text-[#E50914] transition-colors cursor-pointer"
                      >
                        Password dimenticata?
                      </button>
                    )}
                  </div>
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
                  {isSignUp ? "Crea Account" : "Accedi al Dashboard"}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-zinc-400">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorMessage("");
                  }}
                  className="font-semibold text-[#E50914] hover:underline cursor-pointer"
                >
                  {isSignUp
                    ? "Hai già un account? Accedi"
                    : "Non hai un account? Registrati"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090A0D] text-white font-sans flex">
        {/* SIDEBAR VERTICALE SINISTRA (STILE GEMINI TARGET) */}
        {((userRole as any) === "COACH") && (
<aside className="w-64 min-h-screen bg-[#0C0E14] border-r border-white/10 flex flex-col justify-between p-4 sticky top-0 h-screen shrink-0 z-40">
          <div className="space-y-6">
            {/* LOGO BRAND */}
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="p-2 bg-[#E50914]/15 rounded-xl border border-[#E50914]/30 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-[#E50914]" />
              </div>
              <div>
                <span className="font-black text-lg tracking-wider text-white">
                  TOP <span className="text-[#E50914]">GYM</span>
                </span>
                <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase leading-none">
                  COACH SYSTEM
                </p>
              </div>
            </div>

            {/* NAVIGAZIONE PRINCIPALE */}
            <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-270px)] pr-1 scrollbar-none">
              {((userRole as any) === "COACH") && (
                <button
                  type="button"
                  onClick={() => setActiveTab("coachDashboard")}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    activeTab === "coachDashboard"
                      ? "bg-white/10 text-white border border-white/15 shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>Atleti</span>
                  </div>
                  {activeTab === "coachDashboard" && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab("builder")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activeTab === "builder"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Programmi</span>
                </div>
                {activeTab === "builder" && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("methodologies")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activeTab === "methodologies"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Metodologie & Linee Guida</span>
                </div>
                {/* TAB COACH: METODOLOGIE & LINEE GUIDA */}
          {activeTab === "methodologies" && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("workout")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activeTab === "workout"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Dumbbell className="w-4 h-4 text-[#E50914]" />
                  <span>Scheda Atleta</span>
                </div>
                {activeTab === "workout" && (
                  <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("readiness")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activeTab === "readiness"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Gauge className="w-4 h-4 text-green-400" />
                  <span>Check Readiness</span>
                </div>
                {activeTab === "readiness" && (
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("analytics")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activeTab === "analytics"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span>Progressi & Analisi</span>
                </div>
                {activeTab === "analytics" && (
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("records")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activeTab === "records"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>Record Personali</span>
                </div>
                {activeTab === "records" && (
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("goals")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activeTab === "goals"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Target className="w-4 h-4 text-rose-400" />
                  <span>Obiettivi</span>
                </div>
                {activeTab === "goals" && (
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activeTab === "chat"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-4 h-4 text-sky-400" />
                  <span>Visualizza Scheda</span>
                </div>
                {activeTab === "chat" && (
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("leaderboard")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activeTab === "leaderboard"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Medal className="w-4 h-4 text-amber-400" />
                  <span>Classifica</span>
                </div>
                {activeTab === "leaderboard" && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-[#181C24] text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-zinc-300" />
                  <span>Impostazioni</span>
                </div>
                {activeTab === "settings" && (
                  <span className="w-2 h-2 rounded-full bg-zinc-300 animate-pulse"></span>
                )}
              </button>
            </nav>
          </div>

          {/* PIEDE SIDEBAR: RUOLO, ATLETA E LOGOUT */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            {/* SELETTORE ATLETA SE COACH */}
            {((userRole as any) === "COACH") && (
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                  Gestisci Atleta:
                </span>
                <select
                  value={activeAthleteId}
                  onChange={(e) => setActiveAthleteId(e.target.value)}
                  className="w-full bg-[#181C24] border border-white/10 text-white text-xs rounded-xl px-2.5 py-1.5 font-bold outline-none cursor-pointer focus:border-[#E50914]"
                >
                  {athletes.map((ath) => (
                    <option key={ath.id} value={ath.id}>
                      {ath.displayName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* SWITCH RUOLO */}
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleRoleSwitchRequest("ATHLETE")}
                className={`flex-1 py-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  ((userRole as any) === "ATHLETE")
                    ? "bg-[#E50914] text-white shadow font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Eye className="w-3 h-3" /> Atleta
              </button>
              <button
                type="button"
                onClick={() => handleRoleSwitchRequest("COACH")}
                className={`flex-1 py-1 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  ((userRole as any) === "COACH")
                    ? "bg-[#E50914] text-white shadow font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {((userRole as any) === "COACH") ? (
                  <Unlock className="w-3 h-3 text-green-400" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
                Coach
              </button>
            </div>

            {/* INFO UTENTE E LOGOUT */}
            <div className="flex items-center justify-between pt-1">
              <div className="truncate">
                <p className="text-[10px] text-zinc-500 font-mono leading-none">Accesso come</p>
                <p className="text-xs font-bold text-white truncate">{displayUserName}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                title="Esci"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
        )}

        {/* PIN COACH MODAL (PRESERVATO AL 100%) */}
        {showCoachPinModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
            <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 max-w-sm w-full shadow-2xl">
              <h3 className="text-lg font-black text-white mb-2 flex items-center gap-2">
                <Lock className="text-[#E50914]" /> Area Riservata Coach
              </h3>
              <p className="text-xs text-zinc-400 mb-4">
                Inserisci il PIN (default: 1234) per accedere alla gestione coach.
              </p>
              <form onSubmit={verifyCoachPin} className="space-y-4">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-center text-xl font-mono text-white outline-none focus:border-[#E50914]"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-[#E50914] text-center font-bold">
                    PIN Errato o non autorizzato!
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCoachPinModal(false);
                      setPinInput("");
                      setPinError(false);
                    }}
                    className="w-1/2 bg-zinc-800 py-2.5 rounded-xl text-xs font-bold text-zinc-300 cursor-pointer"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-[#E50914] hover:brightness-110 py-2.5 rounded-xl text-xs font-bold text-white uppercase cursor-pointer"
                  >
                    Sblocca
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* COLONNA CONTENUTI PRINCIPALE CON TOPBAR */}
        <div className="flex-1 flex flex-col min-w-0">
          {((userRole as any) === "COACH") ? (
<header className="h-16 border-b border-white/5 bg-[#12151B]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">TOP GYM /</span>
              <span className="text-xs font-black uppercase tracking-wider text-white">
                {activeTab === "builder" ? "PROGRAM BUILDER" : activeTab === "coachDashboard" ? "GESTIONE ATLETI" : activeTab === "methodologies" ? "METODOLOGIE & LINEE GUIDA" : activeTab.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {latestReadiness && (
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                  <Gauge className={`w-3.5 h-3.5 ${latestReadiness.readinessScore >= 80 ? "text-green-400" : "text-yellow-400"}`} />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-zinc-400 font-bold uppercase">Readiness</span>
                    <span className="text-xs font-black text-white">{latestReadiness.readinessScore}%</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                <Shield className="text-yellow-500 w-3.5 h-3.5 flex-shrink-0" />
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-yellow-500 font-black uppercase truncate max-w-[80px]">{userRank}</span>
                  <span className="text-zinc-400 font-mono">Lvl {userLevel}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <NotificationBell
                  userId={targetUserId}
                  onNavigateToWorkout={() => setActiveTab("workout")}
                />
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 bg-black/40 border border-white/5 rounded-xl text-zinc-400 hover:text-white transition cursor-pointer"
                  title="Audio"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-zinc-600" />
                  )}
                </button>
              </div>
            </div>
          </header>
          ) : (
            <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
<header className="max-w-5xl mx-auto bg-[#12151B] rounded-2xl p-5 border border-white/10 shadow-2xl mb-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-wider text-[#E50914] flex items-center gap-2">
              <Dumbbell className="w-7 h-7" /> TOP GYM
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Utente:{" "}
              <span className="text-white font-bold">{displayUserName}</span>
            </p>

            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <div className="flex bg-black/50 p-1 rounded-xl border border-white/5 text-xs font-semibold">
                <button
                  onClick={() => handleRoleSwitchRequest("ATHLETE")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${((userRole as any) === "ATHLETE") ? "bg-[#E50914] text-white shadow font-bold" : "text-zinc-400 hover:text-white"}`}
                >
                  <Eye className="w-3.5 h-3.5" /> Atleta
                </button>
                <button
                  onClick={() => handleRoleSwitchRequest("COACH")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${((userRole as any) === "COACH") ? "bg-[#E50914] text-white shadow font-bold" : "text-zinc-400 hover:text-white"}`}
                >
                  {((userRole as any) === "COACH") ? (
                    <Unlock className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}{" "}
                  Coach
                </button>
              </div>

              {((userRole as any) === "COACH") && (
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                  <span className="text-zinc-400 text-xs font-bold">
                    Gestisci Atleta:
                  </span>
                  <select
                    value={activeAthleteId}
                    onChange={(e) => setActiveAthleteId(e.target.value)}
                    className="bg-zinc-900 border border-white/10 text-white text-xs rounded-lg px-2.5 py-1 font-bold outline-none cursor-pointer"
                  >
                    {athletes.map((ath) => (
                      <option key={ath.id} value={ath.id}>
                        {ath.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between flex-wrap">
            <div className="flex items-center gap-2">
              <NotificationBell
                userId={targetUserId}
                onNavigateToWorkout={() => setActiveTab("workout")}
              />

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2.5 bg-black/40 border border-white/5 rounded-xl text-zinc-400 hover:text-white transition"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-green-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-zinc-600" />
                )}
              </button>
            </div>

            {latestReadiness && (
              <div className="flex items-center gap-2 bg-black/40 px-3.5 py-2 rounded-xl border border-white/5">
                <Gauge
                  className={`w-4 h-4 ${latestReadiness.readinessScore >= 80 ? "text-green-400" : "text-yellow-400"}`}
                />
                <div>
                  <div className="text-[9px] text-zinc-400 uppercase font-bold">
                    READINESS
                  </div>
                  <div className="text-xs font-black">
                    {latestReadiness.readinessScore}%
                  </div>
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
                  <div
                    className="bg-yellow-500 h-full transition-all duration-300"
                    style={{ width: `${levelProgressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white bg-black/40 border border-white/5 px-3 py-2.5 rounded-xl"
            >
              <LogOut className="w-4 h-4 text-red-500" /> Esci
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
            <p className="text-xs text-zinc-400 mb-4">
              Inserisci il PIN (default: 1234) per accedere alla gestione coach.
            </p>
            <form onSubmit={verifyCoachPin} className="space-y-4">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="PIN"
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-center text-xl font-mono text-white outline-none focus:border-[#E50914]"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-[#E50914] text-center font-bold">
                  PIN Errato o non autorizzato!
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCoachPinModal(false);
                    setPinInput("");
                    setPinError(false);
                  }}
                  className="w-1/2 bg-zinc-800 py-2.5 rounded-xl text-xs font-bold text-zinc-300 cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#E50914] hover:brightness-110 py-2.5 rounded-xl text-xs font-bold text-white uppercase cursor-pointer"
                >
                  Sblocca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NAVBAR A SCORRIMENTO MODERNA */}
      <nav className="hidden md:block max-w-5xl mx-auto mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-[#12151B] backdrop-blur-md border border-white/10 rounded-2xl scrollbar-none shadow-lg">
          {((userRole as any) === "ATHLETE") && (
            <button
              onClick={() => setActiveTab("workout")}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${activeTab === "workout" ? "bg-[#E50914] text-white shadow" : "text-zinc-400 hover:text-white"}`}
            >
              Esegui Allenamento
            </button>
          )}

          <button
            onClick={() => setActiveTab("readiness")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "readiness" ? "bg-[#E50914] text-white shadow" : "text-zinc-400 hover:text-white"}`}
          >
            <Gauge className="w-4 h-4 text-green-400" /> Check Readiness
          </button>

          <button
            onClick={() => setActiveTab("records")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "records" ? "bg-[#E50914] text-white shadow" : "text-zinc-400 hover:text-white"}`}
          >
            <Trophy className="w-4 h-4 text-yellow-500" /> Record
          </button>

          <button
            onClick={() => setActiveTab("goals")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "goals" ? "bg-[#E50914] text-white shadow" : "text-zinc-400 hover:text-white"}`}
          >
            <Target className="w-4 h-4 text-[#E50914]" /> Obiettivi
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "analytics" ? "bg-[#E50914] text-white shadow" : "text-zinc-400 hover:text-white"}`}
          >
            <TrendingUp className="w-4 h-4 text-blue-400" /> Progressi
          </button>

          <button
  type="button"
  onClick={() => setActiveTab("chat")}
  className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
    activeTab === "chat" ? "bg-[#E50914] text-white shadow" : "text-zinc-400 hover:text-white"
  }`}
>
  <ClipboardList className="w-4 h-4 text-sky-400" /> Visualizza Scheda
</button>

          {((userRole as any) === "COACH") && (
            <>
              <button
                onClick={() => setActiveTab("coachDashboard")}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "coachDashboard" ? "bg-[#E50914] text-white shadow" : "text-zinc-400 hover:text-white"}`}
              >
                <Users className="w-4 h-4 text-indigo-400" /> Dashboard Atleti
              </button>
              <button
                onClick={() => setActiveTab("builder")}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "builder" ? "bg-[#E50914] text-white shadow" : "text-zinc-400 hover:text-white"}`}
              >
                <UserCheck className="w-4 h-4 text-emerald-400" /> Gestisci
                Scheda (Coach)
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "leaderboard" ? "bg-[#E50914] text-white shadow" : "text-zinc-400 hover:text-white"}`}
          >
            <Medal className="w-4 h-4 text-yellow-500" /> Classifica
          </button>

          {((userRole as any) === "ATHLETE") && (
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === "settings" ? "bg-[#E50914] text-white shadow" : "text-zinc-400 hover:text-white"}`}
            >
              <Settings className="w-4 h-4 text-zinc-300" /> Impostazioni
            </button>
          )}
        </div>
      </nav>
            </div>
          )}

          <main className="flex-1 max-w-[1600px] w-full mx-auto space-y-6 px-4 md:px-8 py-6">
        {/* Banner Notifiche per Atleta */}
        {showPushBanner && ((userRole as any) === "ATHLETE") && (
          <div className="bg-gradient-to-r from-red-950/80 to-[#12151B] border border-[#E50914]/60 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#E50914] text-white rounded-xl">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">
                  Attiva gli avvisi delle Schede!
                </h4>
                <p className="text-xs text-zinc-300">
                  Ricevi un avviso sul telefono quando il Coach aggiorna i tuoi
                  allenamenti o carichi.
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
                {pushLoading ? "Attivazione..." : "Attiva con 1 Click"}
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: WORKOUT */}
        {activeTab === "workout" && ((userRole as any) === "ATHLETE") && (
          <div className="space-y-6">
            {highFatigueDetected && (
              <div className="bg-amber-950/40 border border-amber-600/60 p-4 rounded-2xl flex items-start gap-3 text-amber-300 backdrop-blur-md">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-amber-200">
                    Livello di Fatica Accumulata Elevato!
                  </h4>
                  <p className="text-xs text-amber-300/80 mt-1">
                    Hai registrato serie consecutive ad RPE 9.5+. Considera di
                    estendere il recupero di 30s.
                  </p>
                </div>
              </div>
            )}



<ActiveWorkoutSession
                programDays={programDays}
                programName={programName}
                athleteId={targetUserId}
                athleteName={targetAthleteName}
                sessionBodyWeight={sessionBodyWeight}
                workoutHistory={workoutHistory}
                onWorkoutSaved={async () => {
                  await addXp(50);
                  await loadHistory(targetUserId);
                  setWorkoutSuccessMessage("🎉 Allenamento completato e registrato con successo nello storico! (+50 XP)");
                  setTimeout(() => setWorkoutSuccessMessage(null), 5000);
                }}
              />
          </div>
        )}

        {/* TAB 2: RECORD PERSONALI */}
        {activeTab === "records" && (
          <PersonalRecords
            workoutHistory={workoutHistory}
            currentLogs={logs}
            athleteName={targetAthleteName}
          />
        )}

        {/* TAB 3: OBIETTIVI */}
        {activeTab === "goals" && (
          <AthleteGoals
            athleteId={targetUserId}
            athleteName={targetAthleteName}
            userRole={userRole}
          />
        )}

        {/* TAB 4: READINESS */}
        {activeTab === "readiness" && (
          <div className="space-y-6">
            <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md space-y-6">
              {((userRole as any) === "ATHLETE") && (
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Gauge className="text-green-400" /> Check-in Giornaliero dello Stato di Forma
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Valuta le tue variabili biologiche per calcolare il punteggio di recupero e ricevere indicazioni sul volume o intensità.
                  </p>
                </div>
              )}

              {readinessSuccessMessage && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-center font-bold text-xs">
                  {readinessSuccessMessage}
                </div>
              )}

              {((userRole as any) === "ATHLETE") && (
                <form onSubmit={handleSaveReadiness} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1 flex items-center gap-1.5">
                        <Moon className="w-4 h-4 text-indigo-400" /> Ore di
                        Sonno
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={sleepHours}
                        onChange={(e) => setSleepHours(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-white font-bold outline-none focus:border-[#E50914]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1 flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-blue-400" /> Peso
                        Corporeo (Kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={bodyWeight}
                        onChange={(e) => setBodyWeight(e.target.value)}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-white font-bold outline-none focus:border-[#E50914]"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-zinc-400 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-yellow-400" />{" "}
                          Qualità del Sonno
                        </span>
                        <span className="text-yellow-400 font-mono">
                          {sleepQuality} / 10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={sleepQuality}
                        onChange={(e) =>
                          setSleepQuality(Number(e.target.value))
                        }
                        className="w-full accent-[#E50914]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-zinc-400 flex items-center gap-1.5">
                          <Dumbbell className="w-4 h-4 text-red-400" /> Fatica
                          Muscolare / DOMS (0 = Nessun dolore, 10 = Estremo)
                        </span>
                        <span className="text-red-400 font-mono">
                          {domsLevel} / 10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={domsLevel}
                        onChange={(e) => setDomsLevel(Number(e.target.value))}
                        className="w-full accent-[#E50914]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-zinc-400 flex items-center gap-1.5">
                          <BatteryCharging className="w-4 h-4 text-green-400" />{" "}
                          Energia / Motivazione
                        </span>
                        <span className="text-green-400 font-mono">
                          {energyLevel} / 10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={energyLevel}
                        onChange={(e) => setEnergyLevel(Number(e.target.value))}
                        className="w-full accent-[#E50914]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-zinc-400 flex items-center gap-1.5">
                          <Brain className="w-4 h-4 text-purple-400" /> Stress
                          Percepito
                        </span>
                        <span className="text-purple-400 font-mono">
                          {stressLevel} / 10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={stressLevel}
                        onChange={(e) => setStressLevel(Number(e.target.value))}
                        className="w-full accent-[#E50914]"
                      />
                    </div>
                  </div>

                  <div className="bg-black/30 border border-white/10 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-zinc-400 uppercase font-bold">
                        Score Stimato ({todayIso()}):
                      </span>
                      <span className="text-lg font-black text-[#E50914]">
                        {currentReadiness.totalScore}%
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 font-medium">
                      <b>Consigliato:</b> {currentReadiness.rec}
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#E50914] hover:brightness-110 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Gauge className="w-5 h-5" /> Salva Check Readiness (+20 XP)
                  </button>
                </form>
              )}
            </div>

            <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <History className="text-green-400" /> Storico Check Readiness (
                {((userRole as any) === "COACH")
                  ? activeAthlete.displayName
                  : displayUserName}
                )
              </h3>
              {readinessLoadError && (
                <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3 rounded-xl text-xs">
                  ⚠️ Impossibile caricare lo storico da Supabase:{" "}
                  {readinessLoadError}
                </div>
              )}
              {readinessHistory.length === 0 ? (
                <p className="text-xs text-zinc-400">
                  Nessun check readiness ancora registrato.
                </p>
              ) : (
                <div className="space-y-3">
                  {readinessHistory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-zinc-900/60 p-4 rounded-xl border border-white/5 space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <CalendarDays className="w-4 h-4 text-zinc-400" />{" "}
                          Data: {item.date}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-md font-black text-sm ${item.readinessScore >= 80 ? "bg-green-950 text-green-400 border border-green-800" : "bg-yellow-950 text-yellow-400 border border-yellow-800"}`}
                        >
                          Score: {item.readinessScore}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-zinc-400 pt-1">
                        <div>
                          Sonno:{" "}
                          <b className="text-white">
                            {item.sleepHours}h ({item.sleepQuality}/10)
                          </b>
                        </div>
                        <div>
                          Peso:{" "}
                          <b className="text-white">
                            {item.bodyWeight ? `${item.bodyWeight} kg` : "N/D"}
                          </b>
                        </div>
                        <div>
                          DOMS:{" "}
                          <b className="text-white">{item.domsLevel}/10</b>
                        </div>
                        <div>
                          Energia:{" "}
                          <b className="text-white">{item.energyLevel}/10</b>
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-300 italic pt-1 border-t border-white/5">
                        Indicazione: {item.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: COACH DASHBOARD */}
        {activeTab === "coachDashboard" && ((userRole as any) === "COACH") && (
          <CoachDashboard
              onOpenTimeline={(id) => { setActiveAthleteId(id); setIsTimelineModalOpen(true); }}
            athletes={athletes}
            activeAthleteId={activeAthleteId}
            onSelectAthlete={(id) => setActiveAthleteId(id)}
            onNavigateToBuilder={() => setActiveTab("builder")}
            workoutHistory={workoutHistory}
            readinessHistory={coachReadinessHistory}
          />
        )}


        {/* TAB 6: BUILDER COACH METODO TOPGYM */}
        {activeTab === "builder" && ((userRole as any) === "COACH") && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"><div className="lg:col-span-8 space-y-6">
              {/* PANNELLO DI REGIA COACH: UNICA SORGENTE DI VERITA' */}
              <div className="bg-[#12151B] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <UserCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <h2 className="text-sm font-black uppercase tracking-wider text-white">
                          Regia Scheda & Assegnazione Programma
                        </h2>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Atleta: <b className="text-white">{activeAthlete.displayName}</b> &bull; Gestione centralizzata su Matrice W1–W16
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsTemplateModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E50914] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/30 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95 shrink-0"
                  >
                    <Layers className="w-4 h-4 text-white" />
                    <span>Scegli Template Split</span>
                  </button>
                </div>

                {/* NOME DELLA SCHEDA E TASTO MASTER SALVA E ASSEGNA */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-7 space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Nome della Scheda
                    </label>
                    <input
                      type="text"
                      value={programName}
                      onChange={(e) => setProgramName(e.target.value)}
                      placeholder="Nome della Scheda..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold outline-none focus:border-[#E50914] transition"
                    />
                  </div>

                  <div className="sm:col-span-5 sm:self-end">
                    <button
                      type="button"
                      onClick={handleSaveProgramByCoach}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Salva e Assegna ({activeAthlete.displayName})</span>
                    </button>
                  </div>
                </div>

                {builderSuccessMessage && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-center font-bold text-xs animate-in fade-in">
                    {builderSuccessMessage}
                  </div>
                )}
              </div>

              {/* MODALE SELETTORE TEMPLATE */}
              <TemplatePickerModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                currentBlock={currentBlock}
                athleteName={activeAthlete?.displayName || ""}
                onSelectTemplate={(days, templateName) => {
                  setProgramDays(days as any);
                  setProgramName(templateName);
                  setBuilderSuccessMessage("⚡ Template \"" + templateName + "\" caricato nella Matrice!");
                  setTimeout(() => setBuilderSuccessMessage(null), 4000);
                }}
              />

              {/* MATRICE MACROCICLO W1-W16: SINGLE SOURCE OF TRUTH */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914] animate-pulse"></span>
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">
                      Matrice Macrociclo (W1–W16) &bull; Single Source of Truth
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest hidden sm:inline">
                      {programDays.length} Giornate Attive
                    </span>
                    <button
                        type="button"
                        onClick={() => setIsTimelineModalOpen(!isTimelineModalOpen)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5"
                      >
                        {isTimelineModalOpen ? "Riduci Schermo" : "Schermo Intero"}
                      </button>
                  </div>
                </div>

                <MacrocycleTimelineModal
                  key={(targetUserId || "timeline-inline") + (programmingModel || "")}
                  inline={!isTimelineModalOpen}
                  isOpen={true}
                  onClose={() => setIsTimelineModalOpen(false)}
                  athleteName={athletes.find((a: any) => a.id === targetUserId)?.displayName || activeAthlete?.displayName || "Atleta"}
                  athleteId={targetUserId}
                  programDays={programDays}
                  programmingModel={programmingModel as string}
                  programName={programName}
                  onProgramNameChange={setProgramName}
                  onOpenTemplatePicker={() => setIsTemplateModalOpen(true)}
                  onSaveOverrides={async (updatedDays, overrides) => {
                    const coachEmail = isMasterCoach
                      ? "riprendi@gmail.com"
                      : "maggiopaolo34@gmail.com";

                    const daysWithOverrides = updatedDays.map((d: any) => ({
                      ...d,
                      isPeriodized: isMasterCoach,
                      assignedByCoach: coachEmail,
                      weekOverrides: overrides || d.weekOverrides || {}
                    }));

                    setProgramDays(daysWithOverrides);

                    const savedMethod = (daysWithOverrides[0] as any)?.method || (daysWithOverrides[0] as any)?.programmingModel;
                    if (savedMethod) {
                      setProgrammingModel(savedMethod as any);
                    }

                    const targetId = activeAthleteId || targetUserId || "default-user";
                    if (targetId) {
                      await saveProgramToSupabase(
                        targetId,
                        programName || "Scheda TOPGYM",
                        daysWithOverrides
                      );

                      if (supabase && targetId && targetId !== "default-user") {
                        try {
                          await supabase.from("notifications").insert([
                            {
                              user_id: targetId,
                              title: isMasterCoach
                                ? "Nuova Scheda Metodo TOPGYM!"
                                : "Nuova Scheda di Allenamento",
                              message: isMasterCoach
                                ? `Il Coach ha assegnato o aggiornato il programma "${programName}".`
                                : `Il Coach ha aggiornato la tua scheda "${programName}".`,
                              type: "program_assigned"
                            }
                          ]);
                        } catch {}

                        try {
                          await sendPushNotification(
                            targetId,
                            isMasterCoach
                              ? "Nuova Scheda Metodo TOPGYM! 💪"
                              : "Nuova Scheda Assegnata! 💪",
                            isMasterCoach
                              ? `Il Coach ha aggiornato il tuo programma Metodo TOPGYM (${programName || "Nuova scheda"}).`
                              : `Il Coach ha aggiornato la tua scheda di allenamento (${programName || "Nuova scheda"}).`,
                            "/"
                          );
                        } catch {}
                      }

                      setBuilderSuccessMessage(`✅ Scheda salvata e assegnata con successo a ${activeAthlete?.displayName || "Atleta"}!`);
                      setTimeout(() => setBuilderSuccessMessage(null), 4000);
                    }
                  }}
                />
              </div>
            </div>

            {/* COLONNA DESTRA (30% STICKY): ANALISI & TELEMETRIA DEL MESOCICLO */}
            <div className="lg:col-span-4 space-y-4 sticky top-6">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">Analisi & Telemetria del Mesociclo</span>
                <span className="text-[9px] font-mono bg-red-950/60 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-full font-bold">LIVE SYNC</span>
              </div>

              <div className="bg-[#12151B] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-5">
                {/* 1. VOLUME SETTIMANALE PER DISTRETTO (TOPGYM ENGINE 14 DISTRETTI) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Volume Settimanale per Gruppo</span>
                    <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">14 Distretti</span>
                  </div>

                  {(() => {
                    
                  const plannedMap = calculatePlannedWeeklySets(programDays || []);
                    const entries = Object.entries(plannedMap)
                      .filter(([_, sets]) => (Number(sets) || 0) > 0)
                      .sort((a, b) => (Number(b[1]) || 0) - (Number(a[1]) || 0));

                    if (entries.length === 0) {
                      return (
                        <p className="text-xs text-zinc-500 italic py-2">Nessun esercizio presente nella scheda.</p>
                      );
                    }

                    const displayMuscles = entries;
                    const maxVal = Math.max(...displayMuscles.map(m => Number(m[1]) || 0), 1);
                    const colorStyles = [
                      { bar: "bg-[#E50914]", text: "text-red-400" },
                      { bar: "bg-cyan-400", text: "text-cyan-400" },
                      { bar: "bg-amber-400", text: "text-amber-400" },
                      { bar: "bg-emerald-400", text: "text-emerald-400" },
                      { bar: "bg-purple-400", text: "text-purple-400" },
                      { bar: "bg-sky-400", text: "text-sky-400" }
                    ];

                    return (
                      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                        {displayMuscles.map(([name, sets], idx) => {
                          const setsCount = Number(sets) || 0;
                          const pct = Math.min(100, Math.round((setsCount / maxVal) * 100));
                          const c = colorStyles[idx % colorStyles.length];
                          return (
                            <div key={name} className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-zinc-200">{name}</span>
                                <span className="font-mono text-zinc-400 text-[11px]">{setsCount} set/sett</span>
                              </div>
                              <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden border border-white/5">
                                <div className={"h-full " + c.bar + " rounded-full transition-all duration-500"} style={{ width: pct + "%" }}></div>
                              </div>
                            </div>
                          );
                        })}
                        
                      </div>
                    );
                  })()}
                </div>

                {/* 2. DISTRIBUZIONE STIMOLI (DUP) */}
                <div className="space-y-2.5 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300 block">Distribuzione Stimoli (DUP)</span>
                    <span className="text-[9px] text-zinc-400 font-mono">Dinamico su Reps</span>
                  </div>
                  {(() => {
                    let neurale = 0, ipertrofico = 0, metabolico = 0, total = 0;
                    (programDays || []).forEach((d: any) => {
                      (d.exercises || []).forEach((ex: any) => {
                        const s = Number(ex.sets) || (Array.isArray(ex.targetReps) ? ex.targetReps.length : 1);
                        total += s;
                        const repsStr = String(ex.reps || "").toLowerCase();
                        const nameStr = String(ex.name || "").toLowerCase();
                        const notesStr = String(ex.notes || "").toLowerCase();
                        const full = nameStr + " " + repsStr + " " + notesStr;

                        const isMetabolic = repsStr.includes("+max") || repsStr.includes("rest-pause") || repsStr.includes("stripping") || repsStr.includes("pompa") || repsStr.includes("drop") || full.includes("pompa venosa") || full.includes("rest pause");

                        let repNum = 8;
                        const nums = repsStr.match(/\d+/g);
                        if (nums && nums.length > 0) {
                          if (nums.length >= 2 && (repsStr.includes("x") || repsStr.includes("*"))) {
                            repNum = parseInt(nums[1], 10);
                          } else if (nums.length >= 2 && repsStr.includes("-")) {
                            repNum = (parseInt(nums[0], 10) + parseInt(nums[1], 10)) / 2;
                          } else {
                            repNum = parseInt(nums[0], 10);
                          }
                        }

                        if (isMetabolic || repNum >= 13) {
                          metabolico += s;
                        } else if (repNum <= 6) {
                          neurale += s;
                        } else {
                          ipertrofico += s;
                        }
                      });
                    });

                    const pNeu = total > 0 ? Math.round((neurale / total) * 100) : 0;
                    const pIper = total > 0 ? Math.round((ipertrofico / total) * 100) : 0;
                    const pMeta = total > 0 ? Math.max(0, 100 - pNeu - pIper) : 0;

                    return (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-sm bg-sky-500"></span>
                            <span className="text-zinc-300 font-medium">Neurale (1-6 reps / CAT)</span>
                          </div>
                          <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded text-[11px] font-mono font-bold">{pNeu}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
                            <span className="text-zinc-300 font-medium">Ipertrofico (7-12 reps / MAV)</span>
                          </div>
                          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] font-mono font-bold">{pIper}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                            <span className="text-zinc-300 font-medium">Metabolico (13+ reps / Tecniche)</span>
                          </div>
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-mono font-bold">{pMeta}%</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 3. SICUREZZA & IMPATTO (CARICO SPINALE) */}
                <div className="space-y-2.5 pt-4 border-t border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300 block">Sicurezza & Impatto</span>
                  {(() => {
                    let axialSets = 0;
                    (programDays || []).forEach((d: any) => {
                      (d.exercises || []).forEach((ex: any) => {
                        const name = String(ex.name || "").toLowerCase();
                        if (name.includes("squat") || name.includes("stacco") || name.includes("military") || name.includes("lento avanti") || name.includes("rack pull") || name.includes("rematore con bilanciere")) {
                          axialSets += Number(ex.sets) || 1;
                        }
                      });
                    });

                    let label = "BASSO";
                    let colorClass = "bg-emerald-950/60 text-emerald-400 border-emerald-500/40 shadow-emerald-950";
                    if (axialSets >= 16) {
                      label = "ALTO (Monitorare Recupero)";
                      colorClass = "bg-rose-950/60 text-rose-400 border-rose-500/40 shadow-rose-950";
                    } else if (axialSets >= 8) {
                      label = "MODERATO";
                      colorClass = "bg-amber-950/60 text-amber-400 border-amber-500/40 shadow-amber-950";
                    }

                    return (
                      <div className="bg-black/50 border border-white/5 p-3 rounded-xl space-y-2.5">
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Stress assiale stimato sul rachide in base ai fondamentali pesanti (" + axialSets + " set totali).
                        </p>
                        <div className={"inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black border shadow-sm " + colorClass}>
                          <span>🛡️</span> Carico Spinale: {label}
                        </div>
                      </div>
                    );
                  })()}
                </div>
{/* 5. AZIONI RAPIDE DELOAD & STAMPA PDF */}
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      if (!window.confirm("Applicare scarico volumetrico (-40% serie su tutti i microcicli)?")) return;
                      const deloaded = programDays.map((day: any) => ({
                        ...day,
                        exercises: day.exercises?.map((ex: any) => ({
                          ...ex,
                          sets: Math.max(1, Math.round((Number(ex.sets) || 3) * 0.6))
                        }))
                      }));
                      setProgramDays(deloaded as any);
                    }}
                    className="w-full bg-[#181C24] hover:bg-zinc-800 border border-white/10 hover:border-zinc-700 text-zinc-200 font-semibold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>⇅</span> Inverti con Scarico (-40%)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const printName = window.prompt("Nome atleta da stampare sul PDF:", activeAthlete?.displayName);
                      if (printName !== null) {
                        exportProgramToPDF(printName.trim() || activeAthlete?.displayName, programName, programDays);
                      }
                    }}
                    className="w-full bg-[#181C24] hover:bg-zinc-800 border border-white/10 hover:border-zinc-700 text-zinc-200 font-semibold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>🖨️</span> Stampa PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

{/* TAB COACH: METODOLOGIE & LINEE GUIDA */}
          {activeTab === "methodologies" && (
            <MethodologiesGuide />
          )}

          {/* TAB 7: ANALYTICS & STORICO COMPLETO */}
{activeTab === "analytics" && (
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

{/* TAB VISUALIZZA SCHEDA COMPLETA (W1 - W16) */}
        {activeTab === "chat" && (
          <div className="space-y-4 max-w-5xl mx-auto animate-in fade-in duration-200">
            {/* BARRA SUPERIORE: TITOLO & TASTO STAMPA PDF */}
            <div className="bg-[#12151B] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white tracking-wide leading-tight">
                    {programName || "Scheda di Allenamento"}
                  </h2>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    Consultazione Macrociclo &bull; {programDays.length} Giornate
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const printName = window.prompt("Nome atleta da stampare sul PDF:", activeAthlete?.displayName);
                  if (printName !== null) {
                    exportProgramToPDF(printName.trim() || activeAthlete?.displayName, programName, programDays);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-white/10 transition cursor-pointer shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PDF A4</span>
              </button>
            </div>

            {/* SELETTORE SETTIMANA ORIZZONTALE A SCORRIMENTO (W1 - W16) */}
            <div className="bg-[#12151B] border border-white/10 rounded-2xl p-3 shadow-lg space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  Seleziona Settimana (Microciclo)
                </span>
                <span className="text-[10px] font-mono text-sky-400 font-bold">
                  {viewWeekSelected === 4 || viewWeekSelected === 10 || viewWeekSelected === 16 ? "Fase Scarico / Deload" : "Microciclo Regolare"}
                </span>
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x">
                {Array.from({ length: 16 }, (_, i) => i + 1).map((wNum) => {
                  const isDeload = wNum === 4 || wNum === 10 || wNum === 16;
                  const isSelected = viewWeekSelected === wNum;
                  return (
                    <button
                      key={wNum}
                      type="button"
                      onClick={() => setViewWeekSelected(wNum)}
                      className={`shrink-0 snap-start px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all border cursor-pointer ${
                        isSelected
                          ? "bg-[#E50914] border-[#E50914] text-white shadow-md shadow-red-950/50"
                          : isDeload
                          ? "bg-blue-950/30 border-blue-500/30 text-blue-300 hover:bg-blue-900/40"
                          : "bg-black/40 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>W{wNum}</span>
                      {isDeload && <span className="text-[9px] block text-[9px] opacity-80 leading-none">Deload</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SELETTORE GIORNATA COMPATTO */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {programDays.map((day, idx) => {
                const isDaySelected = viewDaySelected === idx;
                return (
                  <button
                    key={day.id || idx}
                    type="button"
                    onClick={() => setViewDaySelected(idx)}
                    className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-2 ${
                      isDaySelected
                        ? "bg-zinc-800 text-white border-white/20 shadow-sm"
                        : "bg-black/30 text-zinc-500 border-white/5 hover:text-zinc-300"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isDaySelected ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
                    <span>G{day.dayNumber || idx + 1}: {day.title || `Seduta ${idx + 1}`}</span>
                  </button>
                );
              })}
            </div>

            {/* DETTAGLIO ESERCIZI DELLA GIORNATA SELEZIONATA (LETTURA PULITA) */}
            {(() => {
              const currentDay = programDays[viewDaySelected] || programDays[0];
              if (!currentDay || !currentDay.exercises || currentDay.exercises.length === 0) {
                return (
                  <div className="bg-[#12151B] border border-white/10 rounded-2xl p-8 text-center text-zinc-500 text-xs">
                    Nessun esercizio inserito in questa giornata.
                  </div>
                );
              }

              // Calcolo modificatore deload visuale su W4/W10/W16
              // Calcolo dinamico dello stato di deload: legge prioritariamente dagli override della matrice o dalla fase
                const currentDayOverrides = currentDay?.weekOverrides || (programDays && (programDays[0] as any)?.weekOverrides) || {};
                const currentWeekData = currentDayOverrides?.[viewWeekSelected] || currentDayOverrides?.[String(viewWeekSelected)] || {};
                const isDeloadWeek = Object.values(currentWeekData).some((ov: any) => ov?.isDeload === true);

              return (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1 text-[11px] text-zinc-400 font-mono">
                    <span>Esercizi previsti per <b>Settimana {viewWeekSelected}</b>:</span>
                    <span>{currentDay.exercises.length} esercizi</span>
                  </div>

                  {currentDay.exercises.map((ex: any, exIdx: number) => {
                    const weekOverrides = currentDay.weekOverrides || (programDays && (programDays[0] as any)?.weekOverrides) || {};
                    const weekOverride = weekOverrides?.[viewWeekSelected]?.[ex.id] || weekOverrides?.[String(viewWeekSelected)]?.[ex.id];

                    const plannedSets = (weekOverride?.sets !== undefined && weekOverride?.sets !== null && weekOverride?.sets !== "")
                      ? Number(weekOverride.sets)
                      : (weekOverride?.isDeload ? Math.max(2, Math.round(Number(ex.sets || 4) * 0.6)) : Number(ex.sets) || 4);

                    const plannedReps = (weekOverride?.reps !== undefined && weekOverride?.reps !== null && weekOverride?.reps !== "")
                      ? String(weekOverride.reps)
                      : String(ex.reps || "6");

                    const plannedWeight = (weekOverride?.targetWeight !== undefined && weekOverride?.targetWeight !== null && weekOverride?.targetWeight !== "")
                      ? String(weekOverride.targetWeight)
                      : (ex.targetWeight ? String(ex.targetWeight) : "");

                    const plannedRest = (weekOverride?.restSeconds !== undefined && weekOverride?.restSeconds !== null && weekOverride?.restSeconds !== "")
                      ? Number(weekOverride.restSeconds)
                      : Number(ex.restSeconds) || 90;

                    const plannedRpe = weekOverride?.rpeTarget || ex.rpeTarget;
                    const plannedNotes = weekOverride?.notes || ex.notes;
return (
                      <div
                        key={ex.id || exIdx}
                        className="bg-[#12151B] border border-white/10 rounded-2xl p-3.5 sm:p-4 shadow-lg space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-zinc-500 font-mono text-xs font-bold">
                                #{exIdx + 1}
                              </span>
                              <h3 className="text-sm font-black text-white">
                                {ex.name}
                              </h3>
                              {ex.muscleGroup && (
                                <span className="text-[9px] px-2 py-0.5 rounded-md bg-black/40 text-zinc-400 border border-white/5 font-mono">
                                  {ex.muscleGroup}
                                </span>
                              )}
                              {ex.executionType && ex.executionType !== "REGULAR" && (
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${getBadgeStyle(ex.executionType)}`}>
                                  {ex.executionType}
                                </span>
                              )}
                            </div>
                            {ex.notes && (
                              <p className="text-[11px] text-zinc-400 italic">
                                Note: {plannedNotes}
                              </p>
                            )}
                          </div>

                          {isDeloadWeek && (
                            <span className="text-[9px] px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-500/30 font-bold shrink-0">
                              -40% Set
                            </span>
                          )}
                        </div>

                        {/* GRIGLIA PARAMETRI COMPATTA SMARTPHONE */}
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 font-mono text-center">
                          <div className="bg-black/50 p-1.5 rounded-xl border border-white/5">
                            <span className="text-[9px] text-zinc-500 uppercase block">Serie</span>
                            <b className="text-white text-xs">{plannedSets}</b>
                          </div>
                          <div className="bg-black/50 p-1.5 rounded-xl border border-white/5">
                            <span className="text-[9px] text-zinc-500 uppercase block">Reps</span>
                            <b className="text-white text-xs">{plannedReps}</b>
                          </div>
                          <div className="bg-black/50 p-1.5 rounded-xl border border-white/5">
                            <span className="text-[9px] text-zinc-500 uppercase block">Carico</span>
                            <b className="text-white text-xs">{plannedWeight ? `${plannedWeight}kg` : "Auto"}</b>
                          </div>
                          <div className="bg-black/50 p-1.5 rounded-xl border border-white/5">
                            <span className="text-[9px] text-zinc-500 uppercase block">Rec</span>
                            <b className="text-yellow-400 text-xs">{plannedRest}s</b>
                          </div>
                          <div className="bg-black/50 p-1.5 rounded-xl border border-white/5 col-span-4 sm:col-span-1">
                            <span className="text-[9px] text-zinc-500 uppercase block">Target</span>
                            <b className="text-emerald-400 text-xs">{plannedRpe ? `RPE ${plannedRpe}` : (ex.tut ? `TUT ${ex.tut}` : "RIR 1-2")}</b>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 8: CLASSIFICA & BADGE */}
        {activeTab === "leaderboard" && (
          <div className="space-y-6">
            <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Trophy className="text-yellow-500" /> Classifica Palestra
              </h2>
              <div className="space-y-2">
                {leaderboard.map((ath, index) => (
                  <div
                    key={ath.id}
                    className="p-4 bg-zinc-900/60 rounded-xl border border-white/5 flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-zinc-500 font-mono">
                        #{index + 1}
                      </span>
                      <span className="font-bold text-white">
                        {ath.displayName}
                      </span>
                    </div>
                    <span className="font-black text-yellow-500">
                      {ath.xp} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Medal className="text-yellow-500" /> Trofei & Traguardi
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`p-4 rounded-xl border flex items-center gap-3 transition ${ach.unlocked ? "bg-zinc-900/80 border-amber-500/30" : "bg-black/20 border-white/5 opacity-50"}`}
                  >
                    <span className="text-2xl">{ach.icon}</span>
                    <div>
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        {ach.title}
                        {ach.unlocked && (
                          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: IMPOSTAZIONI */}
        {activeTab === "settings" && ((userRole as any) === "ATHLETE") && (
          <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md space-y-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Settings className="text-[#E50914]" /> Profilo & Impostazioni
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Aggiorna le tue metriche atletiche e gestisci la sicurezza del
                tuo account.
              </p>
            </div>

            {settingsMessage && (
              <div className="bg-zinc-900 border border-white/10 p-3 rounded-xl text-xs font-bold text-zinc-200">
                {settingsMessage}
              </div>
            )}

            <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#E50914]" /> Notifiche Push
              </h3>
              <p className="text-xs text-zinc-400">
                Ricevi avvisi sullo smartphone per aggiornamenti delle schede e
                comunicazioni.
              </p>
              <button
                type="button"
                disabled={pushLoading}
                onClick={handlePushActivation}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {pushLoading
                  ? "Attivazione in corso..."
                  : "Attiva Notifiche su questo Telefono"}
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Dati Atleta
                </h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">
                      Nome Utente
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2.5 text-sm text-white outline-none focus:border-[#E50914]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">
                      Altezza (cm)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={profileHeight}
                      onChange={(e) => setProfileHeight(e.target.value)}
                      placeholder="185"
                      className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2.5 text-sm text-white outline-none focus:border-[#E50914]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">
                      Peso Obiettivo (Kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={profileTargetWeight}
                      onChange={(e) => setProfileTargetWeight(e.target.value)}
                      placeholder="85"
                      className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2.5 text-sm text-white outline-none focus:border-[#E50914]"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Obiettivi & Esperienza
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">
                      Obiettivo Principale
                    </label>
                    <select
                      value={profileGoal}
                      onChange={(e) => setProfileGoal(e.target.value)}
                      className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2.5 text-sm text-white font-bold outline-none"
                    >
                      <option value="Ipertrofia">
                        Ipertrofia (Massa Muscolare)
                      </option>
                      <option value="Forza">Forza / Powerlifting</option>
                      <option value="Calisthenics">
                        Calisthenics & Skills
                      </option>
                      <option value="Dimagrimento">
                        Definizione / Dimagrimento
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">
                      Livello di Esperienza
                    </label>
                    <select
                      value={profileExperience}
                      onChange={(e) => setProfileExperience(e.target.value)}
                      className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2.5 text-sm text-white font-bold outline-none"
                    >
                      <option value="Principiante">
                        Principiante (&lt; 1 anno)
                      </option>
                      <option value="Intermedio">Intermedio (1-3 anni)</option>
                      <option value="Avanzato">Avanzato (3+ anni)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">
                    Limitazioni fisiche o note per il Coach
                  </label>
                  <textarea
                    value={profileNotes}
                    onChange={(e) => setProfileNotes(e.target.value)}
                    rows={2}
                    placeholder="Es. Lieve fastidio spalla destra su distensioni sopra la testa..."
                    className="w-full bg-zinc-800 border border-white/10 rounded-xl p-2.5 text-sm text-white outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E50914] hover:brightness-110 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider transition cursor-pointer shadow-lg"
              >
                Salva Modifiche Profilo
              </button>
            </form>

            <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 space-y-3">
              <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                <UserX className="w-4 h-4 text-rose-500" /> Zona Pericolo
              </h3>
              <p className="text-xs text-zinc-400">
                Rimuovi definitivamente il tuo profilo Atleta.
              </p>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                Cancella Definitivamente Account
              </button>
            </div>
          </div>
        )}
      
      </main>
        </div>

      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
      />

      {/* MODALE GUIDA PERMESSI BLOCCATI (DENIED) */}
      {showDeniedModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Notifiche Disattivate
                </h3>
                <p className="text-xs text-zinc-400">
                  Hai bloccato i permessi nel browser
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
              <p>
                Il browser non consente di richiedere nuovamente
                l&apos;autorizzazione in automatico. Per abilitarle manualmente:
              </p>

              <div className="bg-zinc-900 p-3.5 rounded-xl border border-white/5 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 bg-[#E50914] text-white rounded-full flex items-center justify-center font-bold text-[11px]">
                    1
                  </span>
                  <span>
                    Tocca l&apos;icona delle{" "}
                    <b>impostazioni sito / lucchetto</b> a sinistra
                    dell&apos;indirizzo web in alto.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 bg-[#E50914] text-white rounded-full flex items-center justify-center font-bold text-[11px]">
                    2
                  </span>
                  <span>
                    Cerca la voce <b>Notifiche</b> o <b>Autorizzazioni</b>.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 bg-[#E50914] text-white rounded-full flex items-center justify-center font-bold text-[11px]">
                    3
                  </span>
                  <span>
                    Imposta su <b className="text-green-400">Consenti</b> oppure
                    tocca <b>Reimposta autorizzazioni</b>.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 bg-[#E50914] text-white rounded-full flex items-center justify-center font-bold text-[11px]">
                    4
                  </span>
                  <span>
                    Ricarica la pagina e premi di nuovo <i>Attiva Notifiche</i>.
                  </span>
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

