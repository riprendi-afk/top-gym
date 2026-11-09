// types/athlete-program.ts
// Modello tipizzato per atleti, schede e programmazione macrociclo Top Gym

export type MuscleGroup =
  | 'PETTORALI'
  | 'DORSALI'
  | 'GAMBE'
  | 'SPALLE'
  | 'BRACCIA'
  | 'CORE'
  | 'GENERALE';

export type StimulusCategory = 'NEURAL' | 'HYPERTROPHIC' | 'METABOLIC';

export interface AthleteProfile {
  id: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  readinessScore?: number;
  lastActive?: string;
}

export interface MatrixExerciseParams {
  id: string;
  name: string;
  muscle: MuscleGroup | string;
  stimulus: StimulusCategory;
  sets: number;
  reps: string;
  weight: number | string;
  targetWeight?: string;
  restSeconds: number;
  rpeTarget?: string;
  notes?: string;
  isLocked?: boolean;
}

export interface ProgramDayPlan {
  id: string;
  title: string;
  dayIndex: number;
  exercises: MatrixExerciseParams[];
  weekOverrides?: Record<number, Record<string, Partial<MatrixExerciseParams>>>;
  method?: string;
  programmingModel?: string;
}

export interface FullMacrocycleProgram {
  programId?: string;
  programName: string;
  athleteId: string;
  coachEmail: string;
  days: ProgramDayPlan[];
  createdAt?: string;
  updatedAt?: string;
}
