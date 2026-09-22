// lib/topgym-engine.ts

export type MacroBlock = 'BLOCCO_1_FORZA' | 'BLOCCO_2_TRASFORMAZIONE' | 'BLOCCO_3_QUALITA';
export type MicroWeek = 1 | 2 | 3 | 4; // 1: Fase I, 2: Fase II, 3: Scarico, 4: Fase III
export type TopGymStimulus = 'NEURAL' | 'HYPERTROPHIC' | 'METABOLIC';
export type ExecutionType = 'REGULAR' | 'STRIPPING' | '10_PIU_MAX' | 'REST_PAUSE' | 'BACK_OFF' | 'PARZIALI' | 'ISOMETRIE' | 'SUPERSET' | 'CLUSTER';

export interface EngineExercise {
  id: string;
  name: string;
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

export interface EngineWorkoutDay {
  id: string;
  dayNumber: number;
  title: string;
  exercises: EngineExercise[];
}

/**
 * 1. CALCOLATORE DELLA SETTIMANA E DELLA FASE
 * Riceve gli allenamenti completati e determina in quale fase del blocco ci troviamo.
 */
export function calculatePhase(
  completedWorkouts: number,
  daysInRoutine: number,
  currentBlock: MacroBlock
): { realWeek: number; phase: MicroWeek; isDeload: boolean } {
  const days = Math.max(1, daysInRoutine);
  const realWeek = Math.floor(completedWorkouts / days) + 1;
  
  let phase: MicroWeek = 1;

  if (currentBlock === 'BLOCCO_1_FORZA') {
    if (realWeek <= 6) phase = 1; // Fase I: Accumulo
    else if (realWeek <= 9) phase = 2; // Fase II: Conversione
    else if (realWeek === 10) phase = 3; // Scarico
    else phase = 4; // Fase III: Intensificazione (Sett 11-15)
  } else {
    // Blocco 2 e 3
    if (realWeek <= 5) phase = 1; 
    else if (realWeek <= 9) phase = 2; 
    else if (realWeek === 10) phase = 3; // Scarico
    else phase = 4;
  }

  return { realWeek, phase, isDeload: phase === 3 };
}

/**
 * 2. MODIFICATORE: REGOLA DELLO SCARICO (-40% Volume, No Cedimento)
 */
export function applyDeloadToExercise(ex: EngineExercise): EngineExercise {
  return {
    ...ex,
    // Taglia il volume del 40% (mantenendo almeno 2 serie)
    sets: Math.max(2, Math.round(ex.sets * 0.6)), 
    // Abbassa l'intensità a RIR 3-4
    rpeTarget: 6.5, 
    // Spegne eventuali tecniche di intensità
    executionType: 'REGULAR', 
    notes: (ex.notes ? ex.notes + ' · ' : '') + 'DELOAD: Volume ridotto, carichi submassimali, no cedimento.'
  };
}

/**
 * 3. IL MOTORE PRINCIPALE (Intercetta e modifica la scheda)
 * Questa funzione verrà chiamata nel frontend prima di mostrare la scheda all'atleta.
 */
export function processDynamicWorkout(
  baseWorkout: EngineWorkoutDay,
  realWeek: number,
  phase: MicroWeek,
  block: MacroBlock
): EngineWorkoutDay {
  
  // REGOLA 1: Se il sistema rileva la Settimana di Scarico (Fase 3), modifica tutta la scheda
  if (phase === 3) {
    return {
      ...baseWorkout,
      title: `${baseWorkout.title} (SETTIMANA DI SCARICO)`,
      exercises: baseWorkout.exercises.map(applyDeloadToExercise)
    };
  }

  // --- QUI AGGIUNGEREMO LE PROSSIME REGOLE (Fase I e Fase II) ---

  // Se non ci sono modifiche da applicare, restituisce la scheda invariata
  return baseWorkout; 
}