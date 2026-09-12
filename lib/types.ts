export type ExecutionType = 'NORMAL' | 'SUPERSET' | 'REST_PAUSE' | 'DROP_SET' | 'CLUSTER';
export type UserRole = 'ATHLETE' | 'COACH';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  targetWeight: string;
  rpeTarget: string;
  restSeconds: number;
  executionType: ExecutionType;
  tut: string;
  notes: string;
}

export interface WorkoutDay {
  id: string;
  dayNumber: number;
  title: string;
  exercises: Exercise[];
}

export interface ExerciseDraft {
  name: string;
  sets: number;
  reps: string;
  weight: string;
  rpe: string;
  rest: number;
  type: ExecutionType;
  tut: string;
  notes: string;
}

export interface SetLog {
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

export interface ReadinessLog {
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

export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  xp: number;
}

export interface GymState {
  programName: string;
  daysCount: 2 | 3 | 4 | 5 | 6;
  programDays: WorkoutDay[];
  logs: SetLog[];
  readinessHistory: ReadinessLog[];
  xp: number;
}

export interface LeaderboardEntry {
  id: string;
  displayName: string;
  xp: number;
  level: number;
}

export const DAY_COUNT_OPTIONS = [2, 3, 4, 5, 6] as const;
export type DayCount = (typeof DAY_COUNT_OPTIONS)[number];

export const XP_PER_LEVEL = 500;
export const XP_PER_SET = 50;
export const XP_PER_READINESS = 100;

export function levelFromXp(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}
