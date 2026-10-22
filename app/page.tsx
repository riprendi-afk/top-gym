"use client";
import MacrocycleTimelineModal from '@/components/MacrocycleTimelineModal';
import { calculatePlannedWeeklySets } from "@/lib/topgym-volume";
import WeeklyVolumeRadar from "@/components/WeeklyVolumeRadar";
import Over40QuickModal from '@/components/Over40QuickModal';

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { supabase,
  saveCompletedWorkoutToSupabase,
  getWorkoutHistoryFromSupabase,
  deleteWorkoutHistoryFromSupabase,
  saveProgramToSupabase,
  getProgramFromSupabase,
} from "@/lib/store";
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
import { applyNocerinoProgression } from "@/lib/nocerino-engine";
import { computeEffectiveLoad, findBodyweightConfig } from "@/lib/lib/bodyweight";
import NotificationBell from "@/components/NotificationBell";
import PersonalRecords from "@/components/PersonalRecords";
import AthleteGoals from "@/components/AthleteGoals";
import { processDynamicWorkout, applyPhaseToProgram } from "@/lib/topgym-engine";
import { detectAthleteGender } from "@/lib/topgym-templates";
import { resolveMuscleTarget } from "@/lib/topgym-volume";
import MobileBottomNav from "@/components/MobileBottomNav";
import { applyHardTopGymWeekProgression } from "@/lib/hardtopgym-engine";
import { useProgramRealtime } from "@/lib/useProgramRealtime";
import { applyAcetoWeekProgression } from "@/lib/Aceto-engine";
import { ExerciseCard } from '@/components/ExerciseCard';
import { exportProgramToPDF } from "@/lib/lib/exportPdf";
import { autoAdvanceTopGymEngine } from "@/lib/topgym-auto-advance";

// ==========================================
// LAZY LOADING: Moduli Pesanti (Scaricati solo quando servono)
// ==========================================
const AcetoCabina = dynamic(() => import("@/components/AcetoCabina"), { ssr: false });
const NocerinoCabina = dynamic(() => import("@/components/NocerinoCabina"), { ssr: false });
const HardTopGymCabina = dynamic(() => import("@/components/HardTopGymCabina"), { ssr: false });
const TopGymClassicCabina = dynamic(() => import("@/components/TopGymClassicCabina"), { ssr: false });
const AnalyticsDashboard = dynamic(() => import("@/components/AnalyticsDashboard"), { ssr: false });
const WorkoutWizardModal = dynamic(() => import("@/components/WorkoutWizardModal"), { ssr: false });
const CoachDashboard = dynamic(() => import("@/components/CoachDashboard"), { ssr: false });
const TemplatePickerModal = dynamic(() => import("@/components/TemplatePickerModal"), { ssr: false });
const MethodologyPickerModal = dynamic(() => import("@/components/MethodologyPickerModal"), { ssr: false });

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
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
// ======================================================================
// CALCOLO PUNTO ZERO: Sedute relative alla scheda attiva
// ======================================================================
const computeActiveWorkoutCount = (days: any[], history: any[]) => {
  if (!days || days.length === 0) return 1;
  if (typeof days[0]?.startingHistoryCount === 'number') {
    return Math.max(1, ((history?.length || 0) + 1) - days[0].startingHistoryCount);
  }
  const activeTitles = days
    .map((d: any) => (d.title || '').trim().toLowerCase())
    .filter((t: string) => t.length > 2);

  if (activeTitles.length > 0 && Array.isArray(history)) {
    const matchingLogs = history.filter((w: any) => {
      const wTitle = (w.day_name || '').trim().toLowerCase();
      return activeTitles.some((t: string) => wTitle.includes(t) || t.includes(wTitle));
    });
    return matchingLogs.length + 1;
  }
  return 1;
};

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

const [isOver40ModalOpen, setIsOver40ModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);

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
  const [currentExId, setCurrentExId] = useState("ex1");

  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [rpe, setRpe] = useState("8");
  const [logs, setLogs] = useState<SetLog[]>([]);

  // State Builder
  const [builderExName, setBuilderExName] = useState("");
  const [builderMuscleGroup, setBuilderMuscleGroup] =
    useState<MuscleGroup>("Petto");
  const [builderStimulus, setBuilderStimulus] =
    useState<TopGymStimulus>("HYPERTROPHIC");
  const [builderSets, setBuilderSets] = useState(3);
  const [builderReps, setBuilderReps] = useState("8-10");
  const [builderWeight, setBuilderWeight] = useState("0");
  const [builderRpe, setBuilderRpe] = useState(8);
  const [builderRest, setBuilderRest] = useState(90);
  const [builderType, setBuilderType] = useState<ExecutionType>("REGULAR");
  const [builderTut, setBuilderTut] = useState("2-0-1-0");
  const [builderNotes, setBuilderNotes] = useState("");
  const [editingDayId, setEditingDayId] = useState<string | null>(null);
  const [editingExId, setEditingExId] = useState<string | null>(null);
  const [openDayId, setOpenDayId] = useState<string | null>(null);

  const handleApplyTopGymPreset = (stimulus: TopGymStimulus) => {
    setBuilderStimulus(stimulus);
    if (stimulus === "NEURAL") {
      setBuilderSets(4);
      setBuilderReps("4-6");
      setBuilderRpe(7.5); // Corrisponde a Buffer 2-3
      setBuilderRest(180);
      setBuilderType("REGULAR");
      setBuilderTut("2-0-X-1"); // 1" di fermo in contrazione
      setBuilderNotes(
        "Metodo TOPGYM: Spinta esplosiva sui fondamentali, rigoroso BUFFER (RIR 2-4). Mai a cedimento per non bruciare il SNC.",
      );
    } else if (stimulus === "HYPERTROPHIC") {
      setBuilderSets(3);
      setBuilderReps("8-12");
      setBuilderRpe(8.5); // Corrisponde a Buffer 1-2
      setBuilderRest(90);
      setBuilderType("REGULAR");
      setBuilderTut("2-0-1-0");
      setBuilderNotes(
        "Metodo TOPGYM: Tensione meccanica. Buffer 1-2 nelle prime serie, cedimento consentito solo all'ultima serie o back-off.",
      );
    } else {
      setBuilderSets(3);
      setBuilderReps("12-20");
      setBuilderRpe(10);
      setBuilderRest(60);
      setBuilderType("STRIPPING"); // Tecnica base per il metabolico
      setBuilderTut("2-0-1-1");
      setBuilderNotes(
        "Metodo TOPGYM: Isolamento. Ricerca del cedimento concentrico reale e tecniche di intensità .",
      );
    }
  };

  const handleStartEditExercise = (dayId: string, ex: Exercise) => {
    setEditingDayId(dayId);
    setEditingExId(ex.id);
    setBuilderExName(ex.name);
    const detectedMG = autoDetectMuscleGroup(ex.name);
    const valid14 = [
      "Petto", "Gran Dorsale", "Upper Back", "Deltoidi Anteriori", "Deltoidi Laterali", 
      "Deltoidi Posteriori", "Tricipiti", "Bicipiti", "Quadricipiti", "Femorali", 
      "Glutei", "Adduttori", "Polpacci", "Addome"
    ];
    const isInvalid = !valid14.includes(ex.muscleGroup as any);
    const isCorruptedPetto = ex.muscleGroup === "Petto" && detectedMG !== "Petto";
    const healedMG = (isInvalid || isCorruptedPetto) ? detectedMG : (ex.muscleGroup || detectedMG);
    setBuilderMuscleGroup(healedMG as MuscleGroup);
    setBuilderStimulus(ex.stimulusType || "HYPERTROPHIC");
    setBuilderSets(ex.sets);
    setBuilderReps(ex.reps);
    setBuilderWeight(ex.targetWeight);
    setBuilderRpe(ex.rpeTarget);
    setBuilderRest(ex.restSeconds);
    setBuilderType(ex.executionType);
    setBuilderTut(ex.tut);
    setBuilderNotes(ex.notes || "");
  };

  const handleCancelEdit = () => {
    setEditingDayId(null);
    setEditingExId(null);
    setBuilderExName("");
    setBuilderNotes("");
    setBuilderSets(3);
    setBuilderReps("8-10");
    setBuilderWeight("0");
    setBuilderRpe(8);
    setBuilderRest(90);
    setBuilderType("REGULAR");
    setBuilderTut("2-0-1-0");
  };

  const handleApplyDeloadWeekToProgram = () => {
    if (
      !window.confirm(
        "Vuoi convertire la scheda in SETTIMANA DI SCARICO (-40% volume, carichi submassimali, nessuna tecnica d'intensità )?",
      )
    )
      return;
    setProgramDays((prevDays) =>
      prevDays.map((day) => ({
        ...day,
        exercises: day.exercises.map((ex) => ({
          ...ex,
          sets: Math.max(2, Math.round(ex.sets * 0.6)),
          rpeTarget: 6.5,
          executionType: "REGULAR",
          notes:
            (ex.notes ? ex.notes + " - " : "") +
            "DELOAD: Volume ridotto, carichi submassimali, nessun cedimento.",
        })),
      })),
    );
    setManualWeek(3); // La fase 3 è sempre lo Scarico/Deload nel nuovo sistema
    setBuilderSuccessMessage(
      "✅ Scheda convertita in Settimana di Scarico (Fase III)!",
    );
    setTimeout(() => setBuilderSuccessMessage(null), 4000);
  };

  const handleApplyEngineToCurrentProgram = () => {
    if (
      !window.confirm(
        `Vuoi aggiornare tutti gli esercizi della scheda con le regole del ${currentBlock} - Fase ${calculatedCurrentPhase}?`,
      )
    )
      return;
    const updated = applyPhaseToProgram(
      programDays as any,
      currentBlock,
      calculatedCurrentPhase,
    );
    setProgramDays(updated as any);
    setBuilderSuccessMessage(
      `⚡ Scheda aggiornata con successo alle regole del ${currentBlock} - Fase ${calculatedCurrentPhase}! Ora puoi visionarla o modificarla.`,
    );
    setTimeout(() => setBuilderSuccessMessage(null), 5000);
  };

  const displayUserName =
    user?.user_metadata?.username ||
    (user?.email ? user.email.split("@")[0] : "Atleta");
  const targetUserId =
    ((userRole as any) === "COACH") ? activeAthleteId || user?.id || "" : user?.id || "";
  const targetAthleteName = useMemo(
    () => athletes.find((a) => a.id === targetUserId)?.displayName ?? "Atleta",
    [athletes, targetUserId],
  );

  // 1. Ripristina le serie memorizzate sul telefono quando apri l'app o cambi atleta
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storageKey = `topgym_session_logs_${targetUserId || "athlete"}`;
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLogs(parsed);
        }
      }
    } catch (e) {
      console.error("Errore nel recupero della sessione salvata:", e);
    }
  }, [targetUserId]);

  // 2. Salva in tempo reale su memoria locale ogni serie registrata o rimossa
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storageKey = `topgym_session_logs_${targetUserId || "athlete"}`;
      if (logs.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(logs));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (e) {
      console.error("Errore nel salvataggio locale della sessione:", e);
    }
  }, [logs, targetUserId]);

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
          xp: p.xp || 0,
        }));
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
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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
        recommendation: r.recommendation,
      }));
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
          table: 'messages',
        },
        (payload) => {
          const msg = payload.new as any;
          // Se il messaggio NON è stato inviato da me
          if (msg && msg.sender_id !== myCurrentId) {
            // Se sono il coach, o se sono l'atleta destinatario della stanza
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`Top Gym - Messaggio da ${msg.sender_name || 'Utente'}`, {
                body: msg.message,
                icon: '/favicon.ico',
              });
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
              exercises: [],
            },
            {
              id: `day-2-${timestamp}`,
              dayNumber: 2,
              title: "Trazione (Pull)",
              exercises: [],
            },
            {
              id: `day-3-${timestamp}`,
              dayNumber: 3,
              title: "Gambe (Legs)",
              exercises: [],
            },
            {
              id: `day-4-${timestamp}`,
              dayNumber: 4,
              title: "Spalle & Braccia",
              exercises: [],
            },
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
        options: { data: { username: username || email.split("@")[0] } },
      });
      if (error) setErrorMessage(error.message);
      else alert("Registrazione completata! Ora puoi accedere.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
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
      redirectTo: window.location.origin,
    });
  
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
      password: newPassword.trim(),
    });

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
      data: { username: username.trim() },
    });

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
        physical_notes: profileNotes.trim(),
      })
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
      if (activeTab === "builder" || activeTab === "coachDashboard")
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

  const RPE_PERCENT_1RM_TABLE: Record<string, number[]> = {
    "10": [100, 96, 92, 89, 86, 84, 81, 79, 76, 74],
    "9.5": [98, 94, 91, 88, 85, 82, 80, 77, 75, 72],
    "9": [96, 92, 89, 86, 84, 81, 79, 76, 74, 71],
    "8.5": [94, 91, 88, 85, 82, 80, 77, 75, 72, 69],
    "8": [92, 89, 86, 84, 81, 79, 76, 74, 71, 68],
    "7.5": [91, 88, 85, 82, 80, 77, 75, 72, 69, 67],
    "7": [89, 86, 84, 81, 79, 76, 74, 71, 68, 65],
    "6.5": [87, 85, 82, 80, 77, 75, 72, 69, 67, 64],
    "6": [86, 84, 81, 79, 76, 74, 71, 68, 65, 62],
  };

  const calculate1RM = (w: number, r: number) =>
    r === 1 ? w : Math.round(w * (1 + r / 30));

  const calculateEstimated1RM = useCallback(
    (weight: number, reps: number, rpe?: number): number | null => {
      if (
        !Number.isFinite(weight) ||
        weight <= 0 ||
        !Number.isFinite(reps) ||
        reps <= 0
      )
        return null;
      if (rpe !== undefined && Number.isFinite(rpe) && reps <= 10) {
        const row = RPE_PERCENT_1RM_TABLE[String(rpe)];
        if (row) {
          const pct = row[Math.round(reps) - 1];
          if (pct > 0) return Math.round(weight / (pct / 100));
        }
      }
      return calculate1RM(weight, reps);
    },
    [],
  );

  const allLoggedSets = useMemo(() => {
    const items: {
      exerciseName: string;
      weight: number;
      estimated1RM: number;
    }[] = [];
    logs.forEach((l) => {
      const w =
        l.effectiveLoad !== null && l.effectiveLoad !== undefined
          ? l.effectiveLoad
          : l.weight;
      if (w > 0 && l.reps > 0) {
        items.push({
          exerciseName: l.exerciseName,
          weight: w,
          estimated1RM:
            l.estimated1RM ||
            calculateEstimated1RM(w, l.reps, l.rpe) ||
            calculate1RM(w, l.reps),
        });
      }
    });
    workoutHistory.forEach((w) => {
      if (Array.isArray(w.logs)) {
        w.logs.forEach((l: any) => {
          const weight =
            Number(
              l.effectiveLoad !== null && l.effectiveLoad !== undefined
                ? l.effectiveLoad
                : l.weight,
            ) || 0;
          const reps = Number(l?.reps) || 0;
          const rpeVal = Number(l?.rpe);
          if (weight > 0 && reps > 0) {
            items.push({
              exerciseName: l.exerciseName || "",
              weight,
              estimated1RM:
                Number(l.estimated1RM) ||
                calculateEstimated1RM(
                  weight,
                  reps,
                  Number.isFinite(rpeVal) ? rpeVal : undefined,
                ) ||
                calculate1RM(weight, reps),
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
      if (estimated1RM > (map.get(exerciseName) || 0))
        map.set(exerciseName, estimated1RM);
    });
    return map;
  }, [allLoggedSets]);

  const getIntensityInfo = useCallback(
    (exerciseName: string, weight: number) => {
      const best1RM = best1RMByExercise.get(exerciseName);
      if (!best1RM || best1RM <= 0 || !weight) return null;
      const pct = Math.round((weight / best1RM) * 100);
      let label = "Attivazione";
      let colorClasses = "bg-zinc-800 text-zinc-300 border-zinc-700";
      if (pct >= 90) {
        label = "Picco Massimale";
        colorClasses = "bg-red-950 text-red-300 border-red-800";
      } else if (pct >= 75) {
        label = "Forza";
        colorClasses = "bg-amber-950 text-amber-300 border-amber-800";
      } else if (pct >= 55) {
        label = "Ipertrofia";
        colorClasses = "bg-emerald-950 text-emerald-300 border-emerald-800";
      }
      return { pct, label, colorClasses };
    },
    [best1RMByExercise],
  );

  const estimated1RMPreview = useMemo(() => {
    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    const rpeVal = parseFloat(rpe);
    if (!Number.isFinite(w) || !Number.isFinite(r) || w <= 0 || r <= 0)
      return null;
    return calculateEstimated1RM(
      w,
      r,
      Number.isFinite(rpeVal) ? rpeVal : undefined,
    );
  }, [weight, reps, rpe, calculateEstimated1RM]);

  const rpeTablePreviewPct = useMemo(() => {
    const r = Math.min(10, Math.max(1, parseInt(reps, 10) || 1));
    const row = RPE_PERCENT_1RM_TABLE[rpe];
    return row ? row[r - 1] : null;
  }, [rpe, reps]);

  const activeAthlete =
    athletes.find((a) => a.id === activeAthleteId) ||
    (athletes.length > 0
      ? athletes[0]
      : { id: "default", displayName: "Atleta", email: "", xp: 0 });
  const activeDay = programDays[selectedDayIndex] ?? programDays[0];

  const handleSafeFinish = () => {
    handleFinishAndSaveWorkout();
  };

  // 1. Calcolo Settimana Reale
  const calculatedCurrentRealWeek = useMemo(() => {
    const daysInRoutine = Math.max(1, programDays.length || 4);
    const activeCount = Math.max(0, computeActiveWorkoutCount(programDays, workoutHistory) - 1);
    return Math.floor(activeCount / daysInRoutine) + 1;
  }, [programDays, workoutHistory]);

// 1. Identificazione esplicita del Metodo attivo sulla scheda (Zero Errori TypeScript)
const trainingMethod: "HARDTOPGYM" | "TOPGYM_CLASSICO" | null = useMemo(() => {
  const day = activeDay as any;
  const list = (programDays || []) as any[];
  const found = list.find((d: any) => d?.method || d?.programType);
  const methodFound =
    day?.method ||
    day?.programType ||
    found?.method ||
    found?.programType;

  if (methodFound === "HARDTOPGYM" || day?.isPeriodized === true) {
    return "HARDTOPGYM";
  }
  if (methodFound === "TOPGYM_CLASSICO" || methodFound === "TOPGYM_BLOCKS") {
    return "TOPGYM_CLASSICO";
  }

  // Scheda standard/neutra: nessun metodo speciale
  return null;
}, [activeDay, programDays]);

// Flag di retrocompatibilità
const isMasterProgram = trainingMethod === "HARDTOPGYM";

// 2. Calcolo Automatico del Macro-Blocco Annuale (47 Settimane Totali)
const activeBlock: MacroBlock = useMemo(() => {
  const w = manualWeek !== null ? manualWeek : calculatedCurrentRealWeek;
  if (w <= 16) return "BLOCCO_1_FORZA";
  if (w <= 32) return "BLOCCO_2_TRASFORMAZIONE";
  return "BLOCCO_3_QUALITA";
}, [manualWeek, calculatedCurrentRealWeek]);

// 3. Calcolo Automatico della Fase Operativa (47 Settimane Classico vs 4 Settimane HardTopGym)
const calculatedCurrentPhase: MicroWeek = useMemo(() => {
  const w = manualWeek !== null ? manualWeek : calculatedCurrentRealWeek;

  // SE È HARDTOPGYM: Microciclo mensile ormonale da 4 settimane (Bosco-Colli)
  if (isMasterProgram) {
    return (((Math.max(1, w) - 1) % 4) + 1) as MicroWeek;
  }

  // SE È METODO CLASSICO: Timeline Reale delle 47 Settimane
  const weekInBlock = ((w - 1) % 16) + 1;

  if (weekInBlock <= 6) return 1;  // W1-W6: Accumulo & Volume Base
  if (weekInBlock <= 9) return 2;  // W7-W9: Sovraccarico & Intensificazione
  if (weekInBlock === 10) return 3; // W10: Deload / Scarico Attivo del SNC
  return 4;                        // W11-W16: Picco Neurale / Consolidamento
}, [manualWeek, calculatedCurrentRealWeek, isMasterProgram]);

// 4. Motore Esecutivo: delega al rispettivo engine in lib/
const dynamicActiveDay = useMemo(() => {
    if (!activeDay) return null;
    if (((userRole as any) === "COACH") && activeTab === "builder") return activeDay;

    let baseDay: any = null;
    if (isMasterProgram) {
      const progressed = applyHardTopGymWeekProgression([activeDay], calculatedCurrentPhase);
      baseDay = progressed?.[0] || activeDay;
    } else {
      baseDay = processDynamicWorkout(
        activeDay as any,
        calculatedCurrentRealWeek,
        calculatedCurrentPhase as any,
        activeBlock,
      );
    }

    if (!baseDay) return activeDay;

    // Sincronizzazione deterministica con weekOverrides del Coach
    const effectiveWeek = manualWeek !== null ? manualWeek : calculatedCurrentRealWeek;
    const overridesMap =
      (activeDay as any)?.weekOverrides?.[effectiveWeek] ||
      (programDays?.[0] as any)?.weekOverrides?.[effectiveWeek];

    if (overridesMap && Array.isArray(baseDay.exercises)) {
      const mergedExercises = baseDay.exercises.map((ex: any, exIdx: number) => {
        const exId = ex.id || `ex_${selectedDayIndex}_${exIdx}`;
        const ov = overridesMap[exId] || (ex.id ? overridesMap[ex.id] : undefined);
        if (!ov) return ex;

        return {
          ...ex,
          sets: ov.sets !== undefined ? ov.sets : ex.sets,
          reps: ov.reps !== undefined ? ov.reps : ex.reps,
          weight: ov.weight !== undefined ? ov.weight : ex.weight,
          targetWeight: ov.weight !== undefined ? String(ov.weight) : (ex.targetWeight || (ex.weight !== undefined ? String(ex.weight) : '')),
          rpe: ov.rpe !== undefined ? ov.rpe : ex.rpe,
          rpeTarget: ov.rpe !== undefined ? String(ov.rpe) : (ex.rpeTarget || (ex.rpe !== undefined ? String(ex.rpe) : '')),
          restSeconds: ov.restSeconds !== undefined ? ov.restSeconds : ex.restSeconds,
          tut: ov.tut !== undefined ? ov.tut : ex.tut,
          notes: ov.notes !== undefined ? ov.notes : ex.notes,
          isLocked: ov.isLocked ?? ex.isLocked,
        };
      });

      return {
        ...baseDay,
        exercises: mergedExercises,
      };
    }

    return baseDay;
  }, [
    activeDay,
    userRole,
    activeTab,
    isMasterProgram,
    calculatedCurrentRealWeek,
    calculatedCurrentPhase,
    activeBlock,
    manualWeek,
    programDays,
    selectedDayIndex,
  ]);

const activeRoutine = dynamicActiveDay?.exercises ?? [];
const currentExercise =
  activeRoutine.find((e: any) => e.id === currentExId) || activeRoutine[0];

const currentIntensityPreview = useMemo(() => {
  if (!currentExercise) return null;
  const w = parseFloat(weight);
  if (!Number.isFinite(w) || w <= 0) return null;
  return getIntensityInfo(currentExercise.name, w);
}, [currentExercise, weight, getIntensityInfo]);

  // Recupera il peso più recente della Readiness
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

  const currentBodyweightConfig = useMemo(() => {
    if (!currentExercise) return null;
    return findBodyweightConfig(currentExercise.name);
  }, [currentExercise]);

  const lastLoggedSet = useMemo(() => {
    if (!currentExercise) return null;
    const fromToday = logs.find((l) => l.exerciseName === currentExercise.name);
    if (fromToday) return fromToday;

    for (const w of workoutHistory) {
      if (Array.isArray(w.logs)) {
        const found = w.logs.find(
          (l: any) => l.exerciseName === currentExercise.name,
        );
        if (found) return found;
      }
    }
    return null;
  }, [currentExercise, logs, workoutHistory]);

  const handleAutoFillLastLog = () => {
    if (lastLoggedSet) {
      setWeight(
        (lastLoggedSet.externalLoad !== undefined
          ? lastLoggedSet.externalLoad
          : lastLoggedSet.weight
        ).toString(),
      );
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
      recommendation: rec,
    };
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
          recommendation: newReadiness.recommendation,
        },
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
            exercises: [],
          });
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
          exercisesCount: activeRoutine.length,
          logs: sanitizedLogs as any,
        });
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
      // Pulisce la memoria locale del telefono
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(
            `topgym_session_logs_${targetUserId || "athlete"}`,
          );
        } catch {}
      }

      // ======================================================================
      // AVANZAMENTO AUTOMATICO HARDTOPGYM A CHIUSURA MICROCICLO
      // ======================================================================
      if (
        programmingModel === "HARDTOPGYM" &&
        programDays &&
        programDays.length >= 3
      ) {
        const splitSize = programDays.length;
        // Calcoliamo quanti allenamenti ha completato adesso l'atleta (compreso quello appena salvato)
        const updatedHistoryCount = computeActiveWorkoutCount(programDays, workoutHistory);

        // Se questo allenamento ha chiuso la settimana (es. 3° su 3, o 4° su 4)
        if (updatedHistoryCount % splitSize === 0) {
          const completedWeeks = Math.floor(updatedHistoryCount / splitSize);
          const nextWeek = (completedWeeks % 4) + 1; // Calcola la nuova settimana (1, 2, 3 o 4 Deload)

          // Applica la progressione esecutiva alla scheda attiva
          const progressedDays = applyHardTopGymWeekProgression(
            programDays,
            nextWeek,
          );
          setProgramDays(progressedDays as any);

          // Salva la nuova progressione su Supabase per renderla persistente
          if (targetUserId) {
            saveProgramToSupabase(targetUserId,
              programName,
              progressedDays,
            ).catch(console.error);
          }

          // Messaggio di completamento e avanzamento
          if (nextWeek === 4) {
            setWorkoutSuccessMessage(
              "🎉 Allenamento salvato! (+50 XP) ⚡ Microciclo completato: scheda passata in Settimana 4 (Scarico Deload).",
            );
          } else {
            setWorkoutSuccessMessage(
              `🎉 Allenamento salvato! (+50 XP) ⚡ Microciclo completato: scheda avanzata a Settimana ${nextWeek}.`,
            );
          }
        } else {
          // Se non ha chiuso la settimana, mostra il tuo messaggio classico
          setWorkoutSuccessMessage(
            "🎉 Allenamento completato e salvato! +50 XP",
          );
        }
      } else {
        // Se non è HARDTOPGYM, mostra il tuo messaggio classico originale
        setWorkoutSuccessMessage(
          "🎉 Allenamento completato e salvato! +50 XP",
        );
      }

// ======================================================================
      
        // ======================================================================
        // AVANZAMENTO AUTOMATICO METODO TOPGYM CLASSIC / BLOCKS (12 SETTIMANE)
        // ======================================================================
        const isTopGymClassicModel =
          programmingModel === "TOPGYM_BLOCKS" ||
          (!["HARDTOPGYM", "ACETO", "NOCERINO", "POWERBLOCK_HYBRID", "BLOOD_VOLUME_OVERLOAD", "HELMS_PYRAMID", "BIKINI_WAVE"].includes(programmingModel as any));

        if (
          isTopGymClassicModel &&
          programDays &&
          programDays.length >= 2
        ) {
          const splitSize = programDays.length;
          const updatedHistoryCount = computeActiveWorkoutCount(programDays, workoutHistory);

          // Scatta ogni volta che l'atleta chiude l'intera split settimanale
          if (updatedHistoryCount % splitSize === 0) {
              const completedWeeks = Math.floor(updatedHistoryCount / splitSize);
              const nextWeek = (completedWeeks % 48) + 1; // Macrociclo a 48 settimane (3 blocchi da 16)

              // 1. Calcolo del Macro-Blocco (1-16: Forza, 17-32: Trasformazione, 33-48: Qualità)
              let currentMacroBlock: "BLOCCO_1_FORZA" | "BLOCCO_2_TRASFORMAZIONE" | "BLOCCO_3_QUALITA" = "BLOCCO_1_FORZA";
              if (nextWeek >= 17 && nextWeek <= 32) {
                currentMacroBlock = "BLOCCO_2_TRASFORMAZIONE";
              } else if (nextWeek >= 33) {
                currentMacroBlock = "BLOCCO_3_QUALITA";
              }

              // 2. Calcolo della Fase nel Blocco da 16 Settimane:
              // W1-W6: Fase 1 (Accumulo) | W7-W9: Fase 2 (Conversione) | W10: Fase 3 (Deload SNC) | W11-W16: Fase 4 (Picco Neurale)
              const weekInBlock = ((nextWeek - 1) % 16) + 1;
              let phaseIndex: 1 | 2 | 3 | 4 = 1;
              if (weekInBlock <= 6) {
                phaseIndex = 1;
              } else if (weekInBlock <= 9) {
                phaseIndex = 2;
              } else if (weekInBlock === 10) {
                phaseIndex = 3;
              } else {
                phaseIndex = 4;
              }

              // 3. Applicazione scientifica della fase tramite il motore nativo topgym-engine
              const progressedDays = applyPhaseToProgram(
                programDays as any,
                currentMacroBlock,
                phaseIndex
              );

              setProgramDays(progressedDays as any);

            // 4. Salvataggio persistente su Supabase
            if (targetUserId) {
              saveProgramToSupabase(
                targetUserId,
                programName,
                progressedDays as any
              ).catch((err: unknown) => {
                console.error("[TOPGYM ENGINE] Errore salvataggio progressione su Supabase:", err);
              });
            }

            // 5. Notifica dinamica all'atleta con la fase esatta raggiunta
            const phaseLabel =
              phaseIndex === 3 ? "Scarico (Deload)" :
              phaseIndex === 4 ? "Intensificazione" :
              phaseIndex === 2 ? (currentMacroBlock === "BLOCCO_1_FORZA" ? "Conversione" : "Tensione Meccanica") :
              "Accumulo";

            setWorkoutSuccessMessage(
              `🎉 Allenamento salvato! (+50 XP) ⚡ Microciclo completato: scheda avanzata a Settimana ${nextWeek} (${currentMacroBlock.replace(/_/g, " ")} - ${phaseLabel})!`
            );
          }
        }

        // AVANZAMENTO AUTOMATICO METODO ACETO A CHIUSURA MICROCICLO (6 SETTIMANE)
      // ======================================================================
      if (
        programmingModel === "ACETO" &&
        programDays &&
        programDays.length >= 3
      ) {
        const splitSize = programDays.length;
        const updatedHistoryCount = computeActiveWorkoutCount(programDays, workoutHistory);

        // Se l'atleta ha completato tutti i giorni della split (es. 4° su 4)
        if (updatedHistoryCount % splitSize === 0) {
          const completedWeeks = Math.floor(updatedHistoryCount / splitSize);
          const nextWeek = (completedWeeks % 6) + 1; // Progressione a 6 settimane (W1 -> W6)

          // Ricalcola carichi, RIR e serie (taglio a 2 nel Deload W6)
          const progressedDays = applyAcetoWeekProgression(
            programDays as any,
            nextWeek,
            workoutHistory as any,
          );
          setProgramDays(progressedDays as any);

          // Salvataggio persistente su Supabase identico a riga 1660 (HardTopGym)
          if (targetUserId) {
            saveProgramToSupabase(
              targetUserId,
              programName,
              progressedDays as any,
            ).catch((err: unknown) => {
              console.error("[ACETO ENGINE] Errore salvataggio progressione su Supabase:", err);
            });
          }
        }
      }

      // ======================================================================
        // AVANZAMENTO AUTOMATICO METODO NOCERINO A CHIUSURA MICROCICLO (3 GIORNI)
        // ======================================================================
        if (
          programmingModel === "NOCERINO" &&
          programDays &&
          programDays.length >= 3
        ) {
          const splitSize = programDays.length;
          const updatedHistoryCount = computeActiveWorkoutCount(programDays, workoutHistory);

          // Se l'atleta ha completato tutti i giorni del ciclo (multiplo di 3)
          if (updatedHistoryCount % splitSize === 0) {
            const progressedDays = applyNocerinoProgression(
              programDays as any,
              updatedHistoryCount,
            );
            setProgramDays(progressedDays as any);

            // Salvataggio persistente automatico su Supabase
            if (targetUserId) {
              saveProgramToSupabase(
                targetUserId,
                programName,
                progressedDays as any,
              ).catch((err: unknown) => {
                console.error("[NOCERINO ENGINE] Errore salvataggio progressione su Supabase:", err);
              });
            }
          }
        }
        // ======================================================================
        // ======================================================================
        // AVANZAMENTO AUTOMATICO NUOVI MOTORI TOP GYM (HELMS & FITSCHEN T29-T33)
        // ======================================================================
        const isAdvancedEngine =
          programmingModel === "POWERBLOCK_HYBRID" ||
          programmingModel === "BLOOD_VOLUME_OVERLOAD" ||
          programmingModel === "HELMS_PYRAMID" ||
          programmingModel === "BIKINI_WAVE";

        if (isAdvancedEngine && programDays && programDays.length >= 2) {
          const splitSize = programDays.length;
          const updatedHistoryCount = computeActiveWorkoutCount(programDays, workoutHistory);

          // Se l'atleta ha completato tutte le sessioni della split settimanale
          if (updatedHistoryCount % splitSize === 0) {
            const completedWeeks = Math.floor(updatedHistoryCount / splitSize);
            const currentWeek = completedWeeks + 1;

            try {
              // Prepara i log recenti della settimana
              const recentSessionLogs = (todayLogs || []).map((l: any, idx: number) => ({
                setIndex: idx + 1,
                weight: Number(l.weight) || 0,
                reps: Number(l.reps) || 0,
                rpe: l.rpe ? Number(l.rpe) : undefined,
              }));

              const formattedLogs = [
                {
                  dayNumber: activeDay?.dayNumber || 1,
                  exercises: [
                    {
                      name: activeDay?.title || "Session",
                      sets: recentSessionLogs,
                    },
                  ],
                },
              ];

              // Invocazione del motore scientifico dedicato
              const advanceResult = autoAdvanceTopGymEngine(
                {
                  engine: programmingModel as any,
                  currentWeek: currentWeek,
                  // Deload autoregolato e gestito internamente da ciascun motore scientifico
                },
                formattedLogs as any,
                programDays as any
              );

              if (advanceResult && advanceResult.modifiedDays) {
                // 1. Aggiorna l'interfaccia con le nuove serie, ripetizioni e carichi
                setProgramDays(advanceResult.modifiedDays as any);

                // 2. Rende persistente la nuova scheda su Supabase
                if (targetUserId) {
                  saveProgramToSupabase(
                    targetUserId,
                    programName,
                    advanceResult.modifiedDays as any
                  ).catch((err: unknown) => {
                    console.error(`[${programmingModel}] Errore salvataggio progressione:`, err);
                  });
                }

                setWorkoutSuccessMessage(
                  `🚀 Settimana ${currentWeek} completata! Progressione ${programmingModel} calcolata e applicata!`
                );
              }
            } catch (engineErr) {
              console.error(`[${programmingModel}] Errore calcolo avanzamento:`, engineErr);
            }
          }
        }
      // ======================================================================

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
      block: isMasterCoach ? currentBlock : null,
      phase: isMasterCoach ? calculatedCurrentPhase : null,
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
              type: "program_assigned",
            },
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



  // --- FUNZIONI RAPIDE WORKOUT ERGONOMICO (THUMB-ZONE) ---
  const handleQuickWeightAdjust = (delta: number) => {
    const current = parseFloat(weight) || 0;
    const next = Math.max(0, current + delta);
    // Arrotonda pulito a massimo 2 decimali (es. 12.5 o 12.25)
    setWeight(
      next % 1 === 0 ? next.toString() : parseFloat(next.toFixed(2)).toString(),
    );
  };

  const handleQuickRepsAdjust = (delta: number) => {
    const current = parseInt(reps, 10) || 0;
    const next = Math.max(1, current + delta);
    setReps(next.toString());
  };

  const handleCopyLastSet = () => {
    const exName = currentExercise?.name;
    if (!exName) return;
    const lastLog = logs.find((l) => l.exerciseName === exName);
    if (lastLog) {
      setWeight(String(lastLog.weight));
      setReps(String(lastLog.reps));
      if (lastLog.rpe) setRpe(String(lastLog.rpe));
    }
  };

  const handleLogSet = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const numWeight = parseFloat(weight);
    const numReps = parseInt(reps, 10);
    const numRpe = parseFloat(rpe);

    if (isNaN(numWeight) || numWeight < 0 || isNaN(numReps) || numReps <= 0)
      return;

    const exName = currentExercise?.name || "Esercizio";
    const effectiveCalc = computeEffectiveLoad(
      exName,
      numWeight,
      numReps,
      sessionBodyWeight,
    );
    const calc1RMWeight =
      effectiveCalc.effectiveLoad !== null
        ? effectiveCalc.effectiveLoad
        : numWeight;
    const estimated1RM =
      calculateEstimated1RM(calc1RMWeight, numReps, numRpe) ||
      calculate1RM(calc1RMWeight, numReps);


    // Cast esplicito a MuscleGroup così TypeScript non segnala errori di tipo
    const targetGroup =
      currentExercise?.muscleGroup || resolveMuscleTarget(exName);

    const newLog: SetLog = {
      id: makeId(),
      exerciseId: currentExercise?.id || currentExId,
      exerciseName: exName,
      muscleGroup: (targetGroup as MuscleGroup) || undefined, // Salvato in modo permanente
      weight: numWeight,
      reps: numReps,
      rpe: numRpe,
      estimated1RM,
      volume: numWeight * numReps,
      date: todayIso(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isBodyweight: effectiveCalc.isBodyweight,
      externalLoad: effectiveCalc.externalLoad,
      bodyWeightUsed: effectiveCalc.bodyWeightUsed,
      percentageUsed: effectiveCalc.percentageUsed,
      bodyweightLoad: effectiveCalc.bodyweightLoad,
      effectiveLoad: effectiveCalc.effectiveLoad,
      effectiveVolume: effectiveCalc.effectiveVolume,
    };

    setLogs((prev) => [newLog, ...prev]);
    void addXp(10);
    if (currentExercise?.restSeconds)
      startRestTimer(currentExercise.restSeconds);
// ✅ SOSTITUISCI SOLO setWeight('') E setReps('') CON QUESTO:
const setsDone = logs.filter(l => l.exerciseName === exName && l.date === todayIso()).length + 1;
const isFinished = currentExercise ? setsDone >= currentExercise.sets : false;

if (isFinished) {
  const curIdx = activeRoutine.findIndex((item: any) => item.id === currentExId);
  if (curIdx !== -1 && curIdx < activeRoutine.length - 1) {
    const nextEx = activeRoutine[curIdx + 1];
    setCurrentExId(nextEx.id);
    setWeight(nextEx.targetWeight && nextEx.targetWeight !== '0' ? String(nextEx.targetWeight) : '');
    setReps(nextEx.reps?.includes('-') ? nextEx.reps.split('-')[0] : (nextEx.reps || '8'));
  } else {
    setWeight('');
    setReps('');
  }
}
// Se non è finito, NON azzeriamo: peso e reps restano pre-compilati per la serie successiva
  };
  

  const handleDeleteLog = (logId: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== logId));
  };

  const handleAddOrUpdateExercise = (
    e: React.SyntheticEvent,
    dayId: string,
  ) => {
    e.preventDefault();
    if (!builderExName.trim()) return;

    if (editingExId && editingDayId === dayId) {
      setProgramDays((prevDays) =>
        prevDays.map((day) => {
          if (day.id === dayId) {
            return {
              ...day,
              exercises: day.exercises.map((ex) =>
                ex.id === editingExId
                  ? {
                      ...ex,
                      name: builderExName.trim(),
                      muscleGroup:
                        builderMuscleGroup ||
                        autoDetectMuscleGroup(builderExName),
                      stimulusType: builderStimulus,
                      sets: builderSets,
                      reps: builderReps,
                      targetWeight: builderWeight,
                      rpeTarget: builderRpe,
                      restSeconds: builderRest,
                      executionType: builderType,
                      tut: builderTut,
                      notes: builderNotes.trim() || undefined,
                    }
                  : ex,
              ),
            };
          }
          return day;
        }),
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
        notes: builderNotes.trim() || undefined,
      };

      setProgramDays((prevDays) =>
        prevDays.map((day) =>
          day.id === dayId
            ? { ...day, exercises: [...(day.exercises || []), newEx] }
            : day,
        ),
      );

      setBuilderExName("");
      setBuilderNotes("");
    }
  };

  const handleRemoveExerciseFromDay = (dayId: string, exerciseId: string) => {
    setProgramDays((prevDays) =>
      prevDays.map((day) =>
        day.id === dayId
          ? {
              ...day,
              exercises: (day.exercises || []).filter(
                (ex) => ex.id !== exerciseId,
              ),
            }
          : day,
      ),
    );
  };

  const handleRenameDay = (dayId: string, title: string) => {
    setProgramDays((prevDays) =>
      prevDays.map((day) => (day.id === dayId ? { ...day, title } : day)),
    );
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
      unlocked: logs.some((l) => l.weight >= 100),
    },
    {
      id: "2",
      title: "PR Breaker",
      description: "Supera il tuo massimale stimato",
      icon: "???",
      unlocked: logs.length >= 3,
    },
    {
      id: "3",
      title: "Atleta Consapevole",
      description: "Registra Check di Readiness",
      icon: "???",
      unlocked: readinessHistory.length >= 1,
    },
    {
      id: "4",
      title: "Costanza d'Acciaio",
      description: "Accumula oltre 500 XP",
      icon: "???",
      unlocked: userXp >= 500,
    },
  ];

  // 3. CALCOLO AUTOMATICO SETTIMANA E FASE (BLOCCO 1-2-3)
  const getPhaseDescription = (block: MacroBlock, phase: MicroWeek) => {
    if (block === "BLOCCO_1_FORZA") {
      switch (phase) {
        case 1:
          return {
            title: "Fase I: Accumulo",
            desc: "Progressione su serie. Buffer (RIR 2-4) per perfezionare la tecnica.",
          };
        case 2:
          return {
            title: "Fase II: Conversione",
            desc: "Aumento reps/serie e riduzione progressiva del buffer.",
          };
        case 3:
          return {
            title: "Fase III: Scarico (Deload)",
            desc: "Riduzione del volume per dissipare la fatica. Nessun cedimento.",
          };
        case 4:
          return {
            title: "Fase IV: Intensificazione",
            desc: "Meno volume, aumento carichi. Test massimale a fine ciclo.",
          };
      }
    }
    if (block === "BLOCCO_2_TRASFORMAZIONE") {
      switch (phase) {
        case 1:
          return {
            title: "Fase I: Volume & Stripping",
            desc: "Forza costante sui base. Complementari con 10+MAX.",
          };
        case 2:
          return {
            title: "Fase II: Ibrida",
            desc: "Lavoro pesante + back-off sui base. Complementari a cedimento.",
          };
        case 3:
          return {
            title: "Fase III: Scarico (Deload)",
            desc: "Riduzione volume, zero tecniche. Carichi submassimali.",
          };
        case 4:
          return {
            title: "Fase IV: Trasformazione",
            desc: "Aumento intensità . Stripping e saturazione massima.",
          };
      }
    }
    if (block === "BLOCCO_3_QUALITA") {
      switch (phase) {
        case 1:
          return {
            title: "Fase I: Accumulo Ipertrofico",
            desc: "Progressione di volume. Inserimento Back-off, Stripping e 10+MAX.",
          };
        case 2:
          return {
            title: "Fase II: Densità ",
            desc: "Aggiunta Rest-Pause su macchine guidate e parziali finali.",
          };
        case 3:
          return {
            title: "Fase III: Scarico (Deload)",
            desc: "-40% Volume, zero tecniche d'intensità . Dissipazione fatica.",
          };
        case 4:
          return {
            title: "Fase IV: Massimo Pompaggio",
            desc: "Taglio volume sui base. Massimo effort metabolico e isometrie.",
          };
      }
    }
    return { title: "", desc: "" };
  };

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
            <nav className="space-y-1">
              {((userRole as any) === "COACH") && (
                <button
                  type="button"
                  onClick={() => setActiveTab("coachDashboard")}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    activeTab === "coachDashboard"
                      ? "bg-white/10 text-white border border-white/15 shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Atleti</span>
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
                onClick={() => setActiveTab("analytics")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activeTab === "analytics"
                    ? "bg-white/10 text-white border border-white/15 shadow-sm"
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
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-white/10 text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Settings className="w-4 h-4 text-zinc-300" />
                <span>Impostazioni</span>
              </button>

              {/* MENU A TENDINA COMPATTO PER ALTRI MODULI */}
              <details className="group pt-2">
                <summary className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer list-none transition">
                  <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">Altri Moduli</span>
                  <span className="text-[9px] text-zinc-500 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="pl-3 pr-1 pt-1.5 space-y-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("readiness")}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      activeTab === "readiness" ? "text-[#E50914] font-bold" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Check Readiness
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("workout")}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      activeTab === "workout" ? "text-[#E50914] font-bold" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Scheda Atleta
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("records")}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      activeTab === "records" ? "text-[#E50914] font-bold" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Record Personali
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("goals")}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      activeTab === "goals" ? "text-[#E50914] font-bold" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Obiettivi
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("chat")}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      activeTab === "chat" ? "text-[#E50914] font-bold" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Chat & Assistenza
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("leaderboard")}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                      activeTab === "leaderboard" ? "text-[#E50914] font-bold" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Classifica
                  </button>
                </div>
              </details>
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
                {activeTab === "builder" ? "PROGRAM BUILDER" : activeTab === "coachDashboard" ? "GESTIONE ATLETI" : activeTab.toUpperCase()}
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
  <MessageSquare className="w-4 h-4" /> Chat & Assistenza
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

{/* BANNER METODO TOPGYM - VISIBILE SOLO SE ATTIVO IL BLOCCO CLASSICO */}
{trainingMethod === "TOPGYM_CLASSICO" && (
              <div className="bg-gradient-to-r from-red-950/40 via-[#12151B] to-[#12151B] border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 backdrop-blur-md shadow-xl animate-in fade-in duration-200">
                <div>
                  <span className="text-[10px] text-[#E50914] font-black uppercase tracking-wider block">
                    Metodo TOPGYM -{" "}
                    {currentBlock === "BLOCCO_1_FORZA"
                      ? "Blocco 1: Forza Ipertrofica"
                      : currentBlock === "BLOCCO_2_TRASFORMAZIONE"
                        ? "Blocco 2: Trasformazione"
                        : "Blocco 3: Qualità  Muscolare"}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {
                      getPhaseDescription(currentBlock, calculatedCurrentPhase)
                        .title
                    }
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {
                      getPhaseDescription(currentBlock, calculatedCurrentPhase)
                        .desc
                    }
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 text-yellow-400 block">
                    Settimana Reale: {calculatedCurrentRealWeek} (Fase
                    Automatica {calculatedCurrentPhase})
                  </span>
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    {workoutHistory.length} allenamenti completati nello storico
                  </span>
                </div>
              </div>
            )}

<div className="bg-[#12151B] p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Dumbbell className="text-[#E50914]" /> Scheda: {programName}
                </h2>
              </div>

{/* SELETTORE GIORNI ORIZZONTALE (Scrollabile per risparmiare spazio) */}
<div className="flex gap-2 mb-4 overflow-x-auto scrollbar-none pb-1 snap-x w-full">
                {programDays.map((day, index) => {
                  const rawTitle = day.title || (day as Record<string, any>).dayName || '';
                  const cleanTitle = rawTitle.replace(/^Giorno\s*\d+\s*[:\-\.]?\s*/i, '').trim();
                  const isSelected = selectedDayIndex === index;

                  return (
                    <button
                      key={day.id || index}
                      type="button"
                      onClick={() => {
                        setSelectedDayIndex(index);
                        if (day.exercises && day.exercises.length > 0) {
                          setCurrentExId(day.exercises[0].id);
                        }
                      }}
                      className={`shrink-0 snap-start px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-[#E50914] border-[#E50914] text-white shadow-md'
                          : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${isSelected ? 'bg-black/30' : 'bg-white/5'}`}>
                        G{day.dayNumber || index + 1}
                      </span>
                      <span>{cleanTitle.length > 18 ? cleanTitle.substring(0, 18) + '...' : cleanTitle}</span>
                    </button>
                  );
                })}
              </div>

              {/* BANNER PROMEMORIA FASE & SETTIMANA ATLETA (ULTRA-COMPATTO) */}
              {trainingMethod === "HARDTOPGYM" && (
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-[#12151B] border border-white/10 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-white">
                      {isMasterProgram ? "HARDTOPGYM" : "TOPGYM Classico"}
                    </span>
                    <span className="text-[10px] font-mono text-yellow-500 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                      Set {isMasterProgram ? String(calculatedCurrentPhase) : String(calculatedCurrentRealWeek)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 justify-between sm:justify-end w-full sm:w-auto">
                    <span className="text-[10px] font-bold text-zinc-300 truncate">
                      {isMasterProgram 
                        ? (calculatedCurrentPhase === 1 ? "1: Setup Neurale" : (calculatedCurrentPhase === 2 ? "2: Micro-Overload" : (calculatedCurrentPhase === 3 ? "3: Intensificazione (+5%)" : "4: Scarico (Deload SNC)")))
                        : (calculatedCurrentPhase === 1 ? "I: Accumulo Volume" : (calculatedCurrentPhase === 2 ? "II: Conversione" : (calculatedCurrentPhase === 3 ? "III: Scarico" : "IV: Picco")))}
                    </span>
                    
                    {((isMasterProgram && calculatedCurrentPhase === 4) || (!isMasterProgram && calculatedCurrentPhase === 3)) && (
                      <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Deload
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* BARRA DI PROGRESSO GLOBALE ALLENAMENTO */}
              {(() => {
                const totalWorkoutSets = activeRoutine.reduce((acc: number, ex: any) => acc + (ex.sets || 0), 0);
                const workoutProgressPct = totalWorkoutSets > 0 ? Math.min(100, Math.round((todayLogs.length / totalWorkoutSets) * 100)) : 0;
                return (
                  <div className="mb-5 bg-black/40 p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" /> Avanzamento Sessione
                      </span>
                      <span className="text-[12px] font-black text-white">{workoutProgressPct}%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-[#E50914] transition-all duration-700 ease-out" 
                        style={{ width: `${workoutProgressPct}%` }} 
                      />
                    </div>
                  </div>
                );
              })()}

{/* LISTA ESERCIZI CON LOGGER INTEGRATO A FISARMONICA */}
<div className="grid gap-3 md:grid-cols-2">
                {activeRoutine.map((ex: any) => {
                  const isSelected = currentExId === ex.id;
                  const isBw = !!findBodyweightConfig(ex.name);

                  return (
                    <ExerciseCard
                      key={ex.id}
                      ex={ex}
                      isSelected={isSelected}
                      onSelect={() => setCurrentExId(isSelected ? '' : ex.id)}
                      todayLogs={todayLogs}
                      isMasterProgram={isMasterProgram}
                      isBw={isBw}
                      getBadgeStyle={getBadgeStyle}
                      estimated1RMPreview={estimated1RMPreview}
                      currentIntensityPreview={currentIntensityPreview}
                      lastLoggedSet={lastLoggedSet}
                      handleAutoFillLastLog={handleAutoFillLastLog}
                      currentBodyweightConfig={currentBodyweightConfig}
                      sessionBodyWeight={sessionBodyWeight}
                      weight={weight}
                      setWeight={setWeight}
                      adjustWeight={adjustWeight}
                      reps={reps}
                      setReps={setReps}
                      rpe={rpe}
                      setRpe={setRpe}
                      handleLogSet={handleLogSet}
                      handleDeleteLog={handleDeleteLog}
                      getIntensityInfo={getIntensityInfo}
                    />
                  );
                })}
              </div>
            </div>

            {/* BARRA INFERIORE FLUTTUANTE CON TIMER ISOLATO */}
            <RestTimerBar
              todayLogsCount={todayLogs.length}
              onFinishWorkout={handleSafeFinish}
              isSavingWorkout={isSavingWorkout}
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
                    <Gauge className="text-green-400" /> Check-in Giornaliero
                    dello Stato di Forma
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Valuta le tue variabili biologiche per calcolare il
                    punteggio di recupero e ricevere indicazioni sul volume o
                    intensità .
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

{/* ====================================================================== */}
        {/* ACCESSO AL GENERATORE SONDAGGIO: ESCLUSIVO DELLA ZONA BUILDER          */}
        {/* ====================================================================== */}
        {activeTab === "builder" && (
          <>
            <button
              onClick={() => setIsOver40ModalOpen(true)}
              className="px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
            >
              <svg className="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <span>Over 40 (Desk PDF)</span>
            </button>
            <button
              onClick={() => setIsWizardOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all flex items-center gap-1.5"
            >
              <span>✨</span> Assegna Scheda tramite Sondaggio
            </button>

            <Over40QuickModal isOpen={isOver40ModalOpen} onClose={() => setIsOver40ModalOpen(false)} />
      <WorkoutWizardModal
              isOpen={isWizardOpen}
              onClose={() => setIsWizardOpen(false)}
              onApplyProgram={(newDays, recommendedEngine, successMessage) => {
                setProgramDays(newDays as any);
                setProgrammingModel(recommendedEngine as any);
                setBuilderSuccessMessage(successMessage);
                setTimeout(() => setBuilderSuccessMessage(null), 5000);
              }}
            />
          </>
        )}
        {/* ====================================================================== */}

        {/* TAB 6: BUILDER COACH METODO TOPGYM */}
        {activeTab === "builder" && ((userRole as any) === "COACH") && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"><div className="lg:col-span-8 space-y-6">
            {/* CABINA DI REGIA PERIODIZZAZIONE - VISIBILE ESCLUSIVAMENTE AL MASTER COACH */}
            {isMasterCoach && (
              <div className="space-y-5">
                  {/* ============================================================== */}
                  {/* HUB METODOLOGICO TOP GYM: 3 CLUSTER SCIENTIFICI               */}
                  {/* ============================================================== */}
                  <div className="bg-[#12151B] border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914] animate-pulse"></span>
                        <span className="text-xs font-black uppercase tracking-wider text-white">Hub Metodologico &bull; Attività Istituzionale A.S.D.</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">3 Cluster Scientifici</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* CLUSTER A: IPERTROFIA & BIOMECCANICA */}
                      <div className="bg-black/50 border border-red-500/20 rounded-xl p-3 space-y-2 flex flex-col justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-red-400 block px-0.5">Cluster A: Ipertrofia</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => setProgrammingModel("NOCERINO" as any)}
                            className={`py-2 px-2 rounded-lg text-[11px] font-black transition cursor-pointer text-center ${((programmingModel as any) === "NOCERINO") ? "bg-[#E50914] text-white shadow-md shadow-red-900/50" : "text-zinc-400 hover:text-white bg-zinc-900/70 border border-white/5"}`}
                          >
                            🔬 Nocerino (T13)
                          </button>
                          <button
                            type="button"
                            onClick={() => setProgrammingModel("HARDTOPGYM")}
                            className={`py-2 px-2 rounded-lg text-[11px] font-black transition cursor-pointer text-center ${programmingModel === "HARDTOPGYM" ? "bg-amber-500 text-black shadow-md shadow-amber-500/30" : "text-zinc-400 hover:text-white bg-zinc-900/70 border border-white/5"}`}
                          >
                            ⚡ HARDTOPGYM
                          </button>
                          <button
                            type="button"
                            onClick={() => setProgrammingModel("ACETO")}
                            className={`py-2 px-2 rounded-lg text-[11px] font-black transition cursor-pointer text-center ${programmingModel === "ACETO" ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/30" : "text-zinc-400 hover:text-white bg-zinc-900/70 border border-white/5"}`}
                          >
                            🏆 Chris Aceto
                          </button>
                          <button
                            type="button"
                            onClick={() => setProgrammingModel("HELMS_PYRAMID" as any)}
                            className={`py-2 px-2 rounded-lg text-[11px] font-black transition cursor-pointer text-center ${((programmingModel as any) === "HELMS_PYRAMID") ? "bg-[#E50914] text-white shadow-md shadow-red-900/50" : "text-zinc-400 hover:text-white bg-zinc-900/70 border border-white/5"}`}
                          >
                            Helms Pyramid
                          </button>
                        </div>
                      </div>

                      {/* CLUSTER B: ESTETICA FEMMINILE */}
                      <div className="bg-black/50 border border-rose-500/20 rounded-xl p-3 space-y-2 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 block px-0.5 mb-2">Cluster B: Estetica Femminile</span>
                          <button
                            type="button"
                            onClick={() => setProgrammingModel("BIKINI_WAVE" as any)}
                            className={`w-full py-2.5 px-3 rounded-lg text-xs font-black transition cursor-pointer text-center ${((programmingModel as any) === "BIKINI_WAVE") ? "bg-rose-600 text-white shadow-md shadow-rose-900/50" : "text-zinc-400 hover:text-white bg-zinc-900/70 border border-white/5"}`}
                          >
                            ✨ Bikini Wave System (T24)
                          </button>
                        </div>
                        <p className="text-[10px] text-zinc-500 px-0.5 leading-tight">DUP a onde &bull; Glutei / Deltoidi &bull; Anti-edema</p>
                      </div>

                      {/* CLUSTER C: METODO & LONGEVITY */}
                      <div className="bg-black/50 border border-emerald-500/20 rounded-xl p-3 space-y-2 flex flex-col justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block px-0.5">Cluster C: Metodo & Longevity</span>
                        <div className="space-y-1.5">
                          <button
                            type="button"
                            onClick={() => setProgrammingModel("TOPGYM_BLOCKS")}
                            className={`w-full py-2 px-3 rounded-lg text-[11px] font-black transition cursor-pointer text-center ${programmingModel === "TOPGYM_BLOCKS" ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/50" : "text-zinc-400 hover:text-white bg-zinc-900/70 border border-white/5"}`}
                          >
                            TOPGYM Classico (Blocchi)
                          </button>
                          <button
                            type="button"
                            onClick={() => setProgrammingModel("STATICA" as any)}
                            className={`w-full py-2 px-3 rounded-lg text-[11px] font-black transition cursor-pointer text-center ${((programmingModel as any) === "STATICA") ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/50" : "text-zinc-400 hover:text-white bg-zinc-900/70 border border-white/5"}`}
                          >
                            Desk & Longevity (Schroth)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                {/* ============================================================== */}
                {/* ============================================================== */}
                    {/* HUB METODOLOGICO TOP GYM: BARRA COMPATTA + MODALE A SCOMPARSA   */}
                    {/* ============================================================== */}
                    <div className="bg-[#12151B] border border-white/10 rounded-2xl p-3 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E50914] shadow-[0_0_8px_#E50914] animate-pulse"></span>
                        <span className="text-xs font-black uppercase tracking-wider text-white">Hub Metodologico:</span>
                        <span className="px-2.5 py-1 bg-black/50 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                          {((programmingModel as any) === "NOCERINO") && "🔬 Nocerino (T13)"}
                          {programmingModel === "HARDTOPGYM" && "⚡ HARDTOPGYM"}
                          {programmingModel === "ACETO" && "🏆 Chris Aceto"}
                          {((programmingModel as any) === "HELMS_PYRAMID") && "🏛️ Helms Pyramid"}
                          {((programmingModel as any) === "BIKINI_WAVE") && "✨ Bikini Wave System"}
                          {programmingModel === "TOPGYM_BLOCKS" && "🛡️ TOPGYM Classico"}
                          {((programmingModel as any) === "STATICA") && "🌿 Desk & Longevity"}
                          {!["NOCERINO","HARDTOPGYM","ACETO","HELMS_PYRAMID","BIKINI_WAVE","TOPGYM_BLOCKS","STATICA"].includes(programmingModel as string) && String(programmingModel)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsMethodologyModalOpen(true)}
                        className="text-xs bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 px-3.5 py-1.5 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#E50914]" />
                        <span>Libreria Metodologie (3 Cluster)</span>
                        <span className="text-[10px] bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 px-1.5 py-0.5 rounded font-mono font-bold">Cambia</span>
                      </button>
                    </div>

                    {/* MODALE CATALOGO METODOLOGIE */}
                    
        <MethodologyPickerModal
                      isOpen={isMethodologyModalOpen}
                      onClose={() => setIsMethodologyModalOpen(false)}
                      currentModel={programmingModel as string}
                      onSelectModel={(model: any) => {
                        setProgrammingModel(model);
                        setIsMethodologyModalOpen(false);
                      }}
                    />

                    {/* CASO A: CABINA TOPGYM CLASSICA (NUOVO DESIGN ORDINATO)         */}
                {/* ============================================================== */}
                {programmingModel === "TOPGYM_BLOCKS" && (
                  <>
                    <TopGymClassicCabina
                      activeAthlete={activeAthlete}
                      currentBlock={currentBlock}
                      setCurrentBlock={(b) => setCurrentBlock(b)}
                      calculatedCurrentPhase={calculatedCurrentPhase}
                      setManualWeek={(w) => setManualWeek(w)}
                      getPhaseDescription={(b, w) => getPhaseDescription(b, w)}
                      onApplyEngine={handleApplyEngineToCurrentProgram}
                      onApplyDeload={handleApplyDeloadWeekToProgram}
                      onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
                    />

                    {/* MODALE SELETTORE TEMPLATE */}
                    <TemplatePickerModal
                      isOpen={isTemplateModalOpen}
                      onClose={() => setIsTemplateModalOpen(false)}
                      currentBlock={currentBlock}
                      athleteName={activeAthlete?.displayName || ""}
                      onSelectTemplate={(days, templateName) => {
                        setProgramDays(days as any);
                        setBuilderSuccessMessage(
                          `⚡ Template "${templateName}" caricato con successo!`,
                        );
                        setTimeout(() => setBuilderSuccessMessage(null), 5000);
                      }}
                    />
                  </>
                )}

                {/* ============================================================== */}
                {/* CASO B: LA NUOVA CABINA HARDTOPGYM (SI APRE SOLO SE LA SCEGLI) */}
                {/* ============================================================== */}
                {programmingModel === "HARDTOPGYM" && (
                  <HardTopGymCabina
                    activeAthlete={activeAthlete}
                    workoutHistory={workoutHistory}
                    programDays={programDays}
                    onApplyProgram={(newDays: any[]) => {
                      setProgramDays(newDays as any);
                      setBuilderSuccessMessage(
                        "⚡ Scheda Metodo HARDTOPGYM applicata con successo!",
                      );
                      setTimeout(() => setBuilderSuccessMessage(null), 5000);
                    }}
                  />
                )}
              </div>
            )}

{/* ============================================================== */}
                {/* CASO C: CABINA CHRIS ACETO (CHAMPIONSHIP BODYBUILDING)         */}
                {/* ============================================================== */}
                {programmingModel === "ACETO" && (
                  <AcetoCabina
                    activeAthlete={activeAthlete}
                    workoutHistory={workoutHistory}
                    onApplyProgram={(newDays: any[]) => {
                      setProgramDays(newDays as any);
                      setBuilderSuccessMessage(
                        "🏆 Scheda Metodo CHRIS ACETO applicata con successo!"
                      );
                      setTimeout(() => setBuilderSuccessMessage(null), 5000);
                    }}
                  />
                )}

{/* CASO D: CABINA PIERO NOCERINO (4 FASI PROGRESSIVE) */}
{programmingModel === "NOCERINO" && (
          <NocerinoCabina
            workoutHistory={workoutHistory}
            onApplyProgram={(newDays: any[]) => {
              setProgramDays(newDays as any);
              setBuilderSuccessMessage(
                "🔬 Scheda Metodo PIERO NOCERINO applicata con successo!",
              );
              setTimeout(() => setBuilderSuccessMessage(null), 5000);
            }}
          />
        )}
                
            {/* SEZIONE GESTIONE SCHEDA - VISIBILE A ENTRAMBI I COACH */}
              <div className="bg-[#12151B] p-4 sm:p-5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md space-y-3.5">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-sm sm:text-base font-black flex items-center gap-2 text-white uppercase tracking-wider">
                      <UserCheck className="w-5 h-5 text-[#E50914]" /> Gestione Scheda
                    </h2>
                    <span className="text-xs font-mono bg-black/40 text-zinc-300 px-2.5 py-1 rounded-lg border border-white/5">
                      Atleta: <b className="text-white">{activeAthlete.displayName}</b>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap flex-1 justify-end">
                    <div className="flex items-center gap-2 flex-1 max-w-sm min-w-[220px]">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0">
                        Nome Scheda:
                      </span>
                      <input
                        type="text"
                        value={programName}
                        onChange={(e) => setProgramName(e.target.value)}
                        placeholder="Nome della Scheda..."
                        className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-bold outline-none focus:border-[#E50914] transition"
                      />
                    </div>

                    <div className="flex items-center gap-2 bg-black/40 px-2.5 py-1 rounded-xl border border-white/5 shrink-0">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Giorni:
                      </span>
                      <div className="flex gap-1">
                        {([2, 3, 4, 5, 6] as DayCount[]).map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => handleDayCountChange(num)}
                            className={`w-7 h-7 flex items-center justify-center text-xs font-black rounded-lg border transition-all ${
                              selectedDayCount === num
                                ? "bg-[#E50914] border-[#E50914] text-white shadow-md shadow-red-950/50"
                                : "bg-zinc-800/80 border-white/5 text-zinc-400 hover:text-white cursor-pointer"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ELENCO GIORNI DEL BUILDER A FISARMONICA (ACCORDION) */}
              {programDays.map((day) => {
                const isOpen = openDayId === day.id;

                return (
                  <div
                    key={day.id}
                    className="bg-zinc-900/60 rounded-2xl border border-white/5 overflow-hidden transition-all shadow-lg"
                  >
                    {/* INTESTAZIONE GIORNO (CLICCABILE PER APRIRE/CHIUDERE) */}
                    <div
                      onClick={() => setOpenDayId(isOpen ? null : day.id)}
                      className="p-4 sm:p-5 flex justify-between items-center cursor-pointer hover:bg-white/[0.02] transition select-none"
                    >
                      <div className="flex items-center gap-3 w-full max-w-md">
                        <span className="font-black text-white whitespace-nowrap text-sm bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
                          Giorno {day.dayNumber}
                        </span>
                        <input
                          type="text"
                          value={day.title}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleRenameDay(day.id, e.target.value)
                          }
                          className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white font-bold outline-none focus:border-[#E50914] w-full"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400 font-mono bg-black/30 px-2.5 py-1 rounded-lg border border-white/5">
                          {day.exercises.length} esercizi
                        </span>
                        <div className="text-zinc-400 p-1">
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-white" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CONTENUTO VISIBILE SOLO SE IL GIORNO È APERTO */}
                    {isOpen && (
                      <div className="p-4 sm:p-5 border-t border-white/5 space-y-4 bg-black/20">
                        {/* LISTA ESERCIZI DEL GIORNO */}
                        <div className="space-y-2">
                          {day.exercises.length === 0 ? (
                            <p className="text-xs text-zinc-500 italic py-2 text-center">
                              Nessun esercizio inserito in questa giornata.
                            </p>
                          ) : (
                              day.exercises.map((ex) =>
                                editingExId === ex.id ? (
                                    <div
                                      key={ex.id}
                                      className="p-4 sm:p-5 rounded-2xl border-2 border-red-600/90 bg-[#12151B] shadow-2xl space-y-4 transition-all animate-in fade-in duration-150"
                                    >
                                      {/* HEADER INLINE EDITING */}
                                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                                        <div className="flex items-center gap-2">
                                          <span className="text-zinc-500 font-mono text-xs select-none">⋮⋮</span>
                                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                                            Esercizio
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="bg-[#1F2430] text-zinc-300 border border-white/10 text-[9px] font-mono px-2 py-0.5 rounded font-black tracking-wider uppercase">
                                            INLINE EDITING
                                          </span>
                                          <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition cursor-pointer"
                                            title="Annulla"
                                          >
                                            <X className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>

                                      {/* RIGA 1: NOME & GRUPPO MUSCOLARE */}
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                        <div className="sm:col-span-2 space-y-1">
                                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                                            Nome
                                          </label>
                                          <input
                                            type="text"
                                            value={builderExName}
                                            onChange={(e) => {
                                              setBuilderExName(e.target.value);
                                              setBuilderMuscleGroup(autoDetectMuscleGroup(e.target.value));
                                            }}
                                            className="w-full bg-[#181C24] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-red-500"
                                            placeholder="Nome esercizio"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                                            Gruppo muscolare
                                          </label>
                                          <select
                                            value={builderMuscleGroup}
                                            onChange={(e) => setBuilderMuscleGroup(e.target.value as MuscleGroup)}
                                            className="w-full bg-[#181C24] border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white font-medium focus:outline-none focus:border-red-500"
                                          >
                                            {[
                                              "Petto",
                                              "Gran Dorsale",
                                              "Upper Back",
                                              "Deltoidi Anteriori",
                                              "Deltoidi Laterali",
                                              "Deltoidi Posteriori",
                                              "Tricipiti",
                                              "Bicipiti",
                                              "Quadricipiti",
                                              "Femorali",
                                              "Glutei",
                                              "Adduttori",
                                              "Polpacci",
                                              "Addome"
                                            ].map((g) => (
                                              <option key={g} value={g}>{g}</option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>

                                      {/* RIGA 2: 6 INPUT ORIZZONTALI */}
                                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block text-center">Serie</label>
                                          <input
                                            type="number"
                                            value={builderSets}
                                            onChange={(e) => setBuilderSets(parseInt(e.target.value) || 1)}
                                            className="w-full bg-[#181C24] border border-white/10 rounded-xl px-2 py-2 text-xs text-center text-white font-bold focus:outline-none focus:border-red-500"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block text-center">Reps</label>
                                          <input
                                            type="text"
                                            value={builderReps}
                                            onChange={(e) => setBuilderReps(e.target.value)}
                                            className="w-full bg-[#181C24] border border-white/10 rounded-xl px-2 py-2 text-xs text-center text-white font-bold focus:outline-none focus:border-red-500"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block text-center">Carico</label>
                                          <input
                                            type="text"
                                            value={builderWeight}
                                            onChange={(e) => setBuilderWeight(e.target.value)}
                                            placeholder="110kg"
                                            className="w-full bg-[#181C24] border border-white/10 rounded-xl px-2 py-2 text-xs text-center text-white font-bold focus:outline-none focus:border-red-500"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block text-center">Rec</label>
                                          <input
                                            type="number"
                                            value={builderRest}
                                            onChange={(e) => setBuilderRest(parseInt(e.target.value) || 0)}
                                            placeholder="120s"
                                            className="w-full bg-[#181C24] border border-white/10 rounded-xl px-2 py-2 text-xs text-center text-white font-bold focus:outline-none focus:border-red-500"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block text-center">RPE</label>
                                          <input
                                            type="number"
                                            step="0.5"
                                            value={builderRpe}
                                            onChange={(e) => setBuilderRpe(parseFloat(e.target.value) || 0)}
                                            className="w-full bg-[#181C24] border border-white/10 rounded-xl px-2 py-2 text-xs text-center text-white font-bold focus:outline-none focus:border-red-500"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block text-center">TUT</label>
                                          <input
                                            type="text"
                                            value={builderTut}
                                            onChange={(e) => setBuilderTut(e.target.value)}
                                            placeholder="2-0-1-0"
                                            className="w-full bg-[#181C24] border border-white/10 rounded-xl px-2 py-2 text-xs text-center text-white font-bold focus:outline-none focus:border-red-500"
                                          />
                                        </div>
                                      </div>

                                      {/* NOTE COACH */}
                                      <div className="space-y-1">
                                        <input
                                          type="text"
                                          value={builderNotes}
                                          onChange={(e) => setBuilderNotes(e.target.value)}
                                          placeholder="Note esecutive, cadenza TUT o accorgimenti..."
                                          className="w-full bg-[#181C24] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-red-500"
                                        />
                                      </div>

                                      {/* BOTTONI AZIONE: ANNULLA & SALVA MODIFICHE BIANCO */}
                                      <div className="flex items-center justify-end gap-2 pt-1">
                                        <button
                                          type="button"
                                          onClick={handleCancelEdit}
                                          className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:text-white bg-[#181C24] hover:bg-zinc-800 border border-white/10 transition cursor-pointer"
                                        >
                                          Annulla
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => handleAddOrUpdateExercise(e as any, day.id)}
                                          className="px-5 py-2 rounded-xl text-xs font-black text-black bg-white hover:bg-zinc-200 transition shadow-lg cursor-pointer"
                                        >
                                          Salva Modifiche
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      key={ex.id}
                                      className="p-3.5 sm:p-4 rounded-2xl border flex justify-between items-center text-xs transition-all bg-[#12151B] border-white/5 hover:border-white/15 group"
                                    >
                                      <div className="flex items-start gap-3">
                                        <span className="text-zinc-600 group-hover:text-zinc-400 font-mono text-xs select-none mt-0.5">⋮⋮</span>
                                        <div className="space-y-1">
                                          <div className="flex items-center gap-2">
                                            <span className="font-bold text-white text-xs">
                                              {ex.name}
                                            </span>
                                            <span
                                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${getBadgeStyle(ex.executionType)}`}
                                            >
                                              {ex.executionType}
                                            </span>
                                          </div>
                                          <div className="text-zinc-400 text-[11px]">
                                            Serie: <span className="text-zinc-200 font-semibold">{ex.sets}</span> &bull; Reps: <span className="text-zinc-200 font-semibold">{ex.reps}</span> &bull; Carico: <span className="text-zinc-200 font-semibold">{ex.targetWeight}kg</span> &bull; Rec: <span className="text-zinc-200 font-semibold">{ex.restSeconds}s</span>{ex.rpeTarget ? ` • RPE: ${ex.rpeTarget}` : ""}{ex.tut ? ` • TUT: ${ex.tut}` : ""}
                                          </div>
                                          {ex.notes && (
                                            <div className="text-[10px] text-zinc-500 italic">
                                              Note: {ex.notes}
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 bg-[#181C24] border border-white/5 p-1 rounded-xl">
                                        <button
                                          type="button"
                                          onClick={() => handleStartEditExercise(day.id, ex)}
                                          className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                                          title="Modifica esercizio"
                                        >
                                          <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (editingExId === ex.id) handleCancelEdit();
                                            handleRemoveExerciseFromDay(day.id, ex.id);
                                          }}
                                          className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                                          title="Elimina esercizio"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  )
                                )
                            )}
                          </div>

                          {/* PULSANTE TRATTEGGIATO + AGGIUNGI ESERCIZIO */}
                          <details className="group pt-2">
                            <summary className="list-none border border-dashed border-white/20 hover:border-white/40 hover:bg-white/5 text-zinc-400 hover:text-white rounded-xl py-3 w-full flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer select-none">
                              <span className="text-base font-normal">+</span> Aggiungi Esercizio
                            </summary>

                            <form
                              onSubmit={(e) => handleAddOrUpdateExercise(e, day.id)}
                              className="space-y-3 pt-3 mt-2 border-t border-white/5 bg-[#12151B]/50 p-4 rounded-xl border border-white/5"
                            >
                              <div>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                                  Preset Stimolo Metodo TOPGYM:
                                </span>
                                <div className="flex gap-2 flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() => handleApplyTopGymPreset("NEURAL")}
                                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 border border-white/10 transition cursor-pointer"
                                  >
                                    ⚡ Neurale (2-6 reps - Buffer)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleApplyTopGymPreset("HYPERTROPHIC")}
                                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 border border-white/10 transition cursor-pointer"
                                  >
                                    💪 Meccanico (6-12 reps - Cedimento/Buffer)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleApplyTopGymPreset("METABOLIC")}
                                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 border border-white/10 transition cursor-pointer"
                                  >
                                    🔥 Metabolico (12-20 reps - Isolamento)
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                <input
                                  type="text"
                                  placeholder="Nome Esercizio"
                                  value={editingDayId === day.id ? builderExName : (editingDayId ? "" : builderExName)}
                                  onChange={(e) => {
                                    setBuilderExName(e.target.value);
                                    setBuilderMuscleGroup(autoDetectMuscleGroup(e.target.value));
                                  }}
                                  className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                                />
                                <select
                                  value={builderMuscleGroup}
                                  onChange={(e) => setBuilderMuscleGroup(e.target.value as MuscleGroup)}
                                  className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold"
                                >
                                  {[
                                              "Petto",
                                              "Gran Dorsale",
                                              "Upper Back",
                                              "Deltoidi Anteriori",
                                              "Deltoidi Laterali",
                                              "Deltoidi Posteriori",
                                              "Tricipiti",
                                              "Bicipiti",
                                              "Quadricipiti",
                                              "Femorali",
                                              "Glutei",
                                              "Adduttori",
                                              "Polpacci",
                                              "Addome"
                                            ].map((mg) => (
                                    <option key={mg} value={mg}>{mg}</option>
                                  ))}
                                </select>
                                <input
                                  type="number"
                                  placeholder="Serie"
                                  value={builderSets}
                                  onChange={(e) => setBuilderSets(Number(e.target.value))}
                                  className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                                />
                                <input
                                  type="text"
                                  placeholder="Reps"
                                  value={builderReps}
                                  onChange={(e) => setBuilderReps(e.target.value)}
                                  className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                                />
                                <input
                                  type="text"
                                  placeholder="Carico Target"
                                  value={builderWeight}
                                  onChange={(e) => setBuilderWeight(e.target.value)}
                                  className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                                />
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <select
                                  value={builderType}
                                  onChange={(e) => setBuilderType(e.target.value as ExecutionType)}
                                  className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                                >
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
                                <input
                                  type="text"
                                  placeholder="TUT"
                                  value={builderTut}
                                  onChange={(e) => setBuilderTut(e.target.value)}
                                  className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                                />
                                <input
                                  type="number"
                                  placeholder="Recupero (sec)"
                                  value={builderRest}
                                  onChange={(e) => setBuilderRest(Number(e.target.value))}
                                  className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                                />
                                <input
                                  type="number"
                                  step="0.5"
                                  placeholder="RPE Target"
                                  value={builderRpe}
                                  onChange={(e) => setBuilderRpe(Number(e.target.value))}
                                  className="bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                                />
                              </div>

                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Note del Coach (Metodo TOPGYM)"
                                  value={editingDayId === day.id ? builderNotes : (editingDayId ? "" : builderNotes)}
                                  onChange={(e) => setBuilderNotes(e.target.value)}
                                  className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                                />
                                {editingExId && editingDayId === day.id ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={handleCancelEdit}
                                      className="bg-zinc-700 text-xs font-bold px-3 py-1.5 rounded-xl text-white cursor-pointer"
                                    >
                                      Annulla
                                    </button>
                                    <button
                                      type="submit"
                                      className="bg-amber-400 text-xs font-bold px-4 py-1.5 rounded-xl text-black cursor-pointer"
                                    >
                                      Aggiorna
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="submit"
                                    className="bg-[#E50914] text-xs font-bold px-4 py-1.5 rounded-xl text-white hover:brightness-110 cursor-pointer"
                                  >
                                    Aggiungi
                                  </button>
                                )}
                              </div>
                            </form>
                          </details>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                {builderSuccessMessage && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-center font-bold text-xs">
                    {builderSuccessMessage}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleSaveProgramByCoach}
                  className="w-full bg-emerald-600 hover:brightness-110 text-white font-black py-4 rounded-xl uppercase tracking-wider transition shadow-xl cursor-pointer"
                >
                  Salva e Assegna Scheda Metodo TOPGYM (
                  {activeAthlete.displayName})
                </button>
                </div>
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

{/* TAB CHAT & ASSISTENZA */}
{activeTab === "chat" && (
          <div className="p-4 max-w-4xl mx-auto w-full animate-in fade-in duration-200">
            <ChatBox 
              roomId={((userRole as any) === "COACH") ? (activeAthlete?.id || "sala-generale") : (targetUserId || "atleta-room")} 
              userId={((userRole as any) === "COACH") ? "coach-admin" : (targetUserId || "atleta-id")} 
              userName={((userRole as any) === "COACH") ? "Coach Top Gym" : (activeAthlete?.displayName || "Atleta Top Gym")}
              chatTitle={((userRole as any) === "COACH") ? `Chat con: ${activeAthlete?.displayName || "Seleziona un atleta"}` : "Chat Privata con il Coach"}
            />
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
      
      {/* MODALE MATRICE & TIMELINE MACROCICLO COACH (GLOBALE) */}
      <MacrocycleTimelineModal
          key={targetUserId || "timeline-modal"}
        isOpen={isTimelineModalOpen}
        onClose={() => setIsTimelineModalOpen(false)}
        athleteName={athletes.find(a => a.id === targetUserId)?.displayName || "Atleta"}
        athleteId={targetUserId}
        programDays={programDays}
        programmingModel={programmingModel as string}
        onSaveOverrides={async (updatedDays, overrides) => {
          setProgramDays(updatedDays);
          if (targetUserId) {
            await saveProgramToSupabase(
              targetUserId,
              programName || "Scheda TOPGYM",
              updatedDays);
          }
        }}
      />
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

