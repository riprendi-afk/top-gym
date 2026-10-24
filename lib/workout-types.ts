export type MacroBlock =
  | "BLOCCO_1_FORZA"
  | "BLOCCO_2_TRASFORMAZIONE"
  | "BLOCCO_3_QUALITA";

export type MicroWeek = 1 | 2 | 3 | 4;

export type TopGymStimulus = "NEURAL" | "HYPERTROPHIC" | "METABOLIC";

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

export interface EngineExercise {
  id: string;
  name: string;
  muscleGroup?: string;
  stimulusType?: TopGymStimulus;
  sets: number;
  reps: string;
  targetWeight?: string;
  rpeTarget?: number;
  restSeconds?: number;
  executionType?: ExecutionType;
  tut?: string;
  notes?: string;
  [key: string]: any;
}

export interface EngineWorkoutDay {
  id?: string;
  dayNumber?: number;
  title: string;
  exercises: EngineExercise[];
  weekOverrides?: any;
  [key: string]: any;
}
