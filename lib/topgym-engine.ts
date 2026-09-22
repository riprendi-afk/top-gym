// lib/topgym-engine.ts
// MOTORE ALGORITMICO DI PROGRAMMAZIONE E PERIODIZZAZIONE · METODO TOP GYM

export type MacroBlock = 'BLOCCO_1_FORZA' | 'BLOCCO_2_TRASFORMAZIONE' | 'BLOCCO_3_QUALITA';
export type MicroWeek = 1 | 2 | 3 | 4; // 1: Fase I, 2: Fase II, 3: Scarico (Deload), 4: Fase IV (Intensificazione)
export type TopGymStimulus = 'NEURAL' | 'HYPERTROPHIC' | 'METABOLIC';
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

export interface EngineExercise {
  id: string;
  name: string;
  muscleGroup?: string;
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
 * Rileva in automatico lo stimolo Hatfield se non è esplicitato
 */
export function detectStimulus(ex: EngineExercise): TopGymStimulus {
  if (ex.stimulusType) return ex.stimulusType;
  const name = ex.name.toLowerCase();
  if (name.includes('panca') || name.includes('squat') || name.includes('stacco') || name.includes('military') || name.includes('trazioni')) {
    return 'NEURAL';
  }
  if (name.includes('croci') || name.includes('alzate') || name.includes('cavi') || name.includes('pushdown') || name.includes('curl') || name.includes('leg ext') || name.includes('abductor')) {
    return 'METABOLIC';
  }
  return 'HYPERTROPHIC';
}

/**
 * TRASFORMAZIONE DI UN SINGOLO ESERCIZIO IN BASE A BLOCCO E FASE
 */
export function transformExerciseForPhase(
  ex: EngineExercise,
  block: MacroBlock,
  phase: MicroWeek
): EngineExercise {
  const stimulus = detectStimulus(ex);
  let sets = ex.sets;
  let reps = ex.reps;
  let rpeTarget = ex.rpeTarget;
  let executionType: ExecutionType = 'REGULAR';
  let restSeconds = ex.restSeconds;
  let tut = ex.tut || '2-0-1-0';
  let targetWeight = ex.targetWeight;
  let phaseNote = '';

  const baseW = parseFloat(targetWeight) || 0;

  // -------------------------------------------------------------
  // SETTIMANA DI SCARICO (Fase 3 - Valida per tutti i blocchi)
  // -------------------------------------------------------------
  if (phase === 3) {
    return {
      ...ex,
      sets: Math.max(2, Math.round(ex.sets * 0.6)), // -40% Volume
      rpeTarget: 6.5, // Buffer 3-4
      targetWeight: baseW > 0 ? (Math.round((baseW * 0.85) * 2) / 2).toString() : targetWeight,
      executionType: 'REGULAR',
      notes: 'SETTIMANA DI SCARICO (Deload): Volume -40%, carichi submassimali (-15%), focus rigenerativo del SNC.'
    };
  }

  // -------------------------------------------------------------
  // BLOCCO 1: FORZA IPERTROFICA
  // -------------------------------------------------------------
  if (block === 'BLOCCO_1_FORZA') {
    if (phase === 1) {
      // FASE I: Accumulo di Volume Neurale
      if (stimulus === 'NEURAL') {
        sets = 5;
        reps = '6';
        rpeTarget = 7.5; // RIR 2-3
        restSeconds = 180;
        tut = '2-0-X-1';
        phaseNote = 'Metodo TOPGYM Accumulo: 5×6 a carico costante, rigoroso BUFFER (RIR 2-3). Mai al cedimento per consolidare lo schema motorio.';
      } else if (stimulus === 'HYPERTROPHIC') {
        sets = 4;
        reps = '8-10';
        rpeTarget = 8.0;
        restSeconds = 120;
        phaseNote = 'Complementare base a buffer costante (RIR 2).';
      } else {
        sets = 3;
        reps = '12';
        rpeTarget = 8.5;
        restSeconds = 60;
        phaseNote = 'Lavoro di isolamento controllato a buffer.';
      }
    } else if (phase === 2) {
      // FASE II: Conversione
      if (stimulus === 'NEURAL') {
        sets = 5;
        reps = '8';
        rpeTarget = 8.5; // RIR 1-2
        restSeconds = 180;
        phaseNote = 'Metodo TOPGYM Conversione: 5×8 a buffer ridotto, progressione di ripetizioni a parità di carico.';
      } else if (stimulus === 'HYPERTROPHIC') {
        sets = 4;
        reps = '10-12';
        rpeTarget = 8.5;
        restSeconds = 90;
        phaseNote = 'Progressione sul volume dei complementari.';
      } else {
        sets = 3;
        reps = '12-15';
        rpeTarget = 9.0;
        restSeconds = 60;
        phaseNote = 'Isolamento ad intensità percepita più alta.';
      }
    } else if (phase === 4) {
      // FASE IV: Intensificazione + Test Massimale
      if (stimulus === 'NEURAL') {
        sets = 4;
        reps = '3-4';
        rpeTarget = 9.5; // RIR 0-1
        restSeconds = 210;
        if (baseW > 0) targetWeight = (Math.round((baseW * 1.07) * 2) / 2).toString();
        phaseNote = 'Metodo TOPGYM Intensificazione: 4×3-4 ad alto carico (+7%) e focus neurale. Test massimale a fine ciclo.';
      } else if (stimulus === 'HYPERTROPHIC') {
        sets = 3;
        reps = '6-8';
        rpeTarget = 9.0;
        restSeconds = 120;
        phaseNote = 'Volume compresso a carichi pesanti.';
      } else {
        sets = 3;
        reps = '10-12';
        rpeTarget = 9.0;
        restSeconds = 60;
        phaseNote = 'Mantenimento metabolico.';
      }
    }
  }

  // -------------------------------------------------------------
  // BLOCCO 2: TRASFORMAZIONE IPERTROFICA
  // -------------------------------------------------------------
  if (block === 'BLOCCO_2_TRASFORMAZIONE') {
    if (phase === 1) {
      // FASE I: Accumulo Volume ed Effort
      if (stimulus === 'NEURAL') {
        sets = 4;
        reps = '6';
        rpeTarget = 8.0;
        restSeconds = 150;
        phaseNote = 'Mantenimento forza a inizio seduta a buffer.';
      } else if (stimulus === 'HYPERTROPHIC') {
        sets = 4;
        reps = '8-10';
        rpeTarget = 9.0; // Cedimento ultima serie
        restSeconds = 90;
        phaseNote = 'Cuore del programma: 65-75% del volume, spingi al cedimento concentrico nell\'ultima serie.';
      } else {
        sets = 3;
        reps = '10 + MAX';
        rpeTarget = 10;
        executionType = '10_PIU_MAX';
        restSeconds = 60;
        phaseNote = '10+MAX Metodo TOPGYM: 10 reps a buffer 2, scarica subito il 40% del peso e vai a cedimento concentrico assoluto.';
      }
    } else if (phase === 2) {
      // FASE II: Tensione Meccanica e Lavoro Ibrido
      if (stimulus === 'NEURAL') {
        sets = 4;
        reps = '6 + Back-off';
        rpeTarget = 9.0;
        executionType = 'BACK_OFF';
        restSeconds = 180;
        phaseNote = 'Lavoro Ibrido: Serie pesanti + ultima serie di back-off al -25% portata a cedimento concentrico.';
      } else if (stimulus === 'HYPERTROPHIC') {
        sets = 4;
        reps = '8-10';
        rpeTarget = 9.5;
        restSeconds = 90;
        phaseNote = 'Tensione Meccanica: Aumento progressivo del carico, cedimento concentrico reale.';
      } else {
        sets = 3;
        reps = '10-12';
        executionType = 'STRIPPING';
        rpeTarget = 10;
        restSeconds = 60;
        phaseNote = 'Stripping a 1-2 scarichi (-35%) fino a cedimento.';
      }
    } else if (phase === 4) {
      // FASE IV: Intensificazione Ipertrofica
      if (stimulus === 'NEURAL') {
        sets = 4;
        reps = '4-6';
        rpeTarget = 9.0;
        restSeconds = 180;
        phaseNote = 'Trasformazione in forza ipertrofica ad alto carico.';
      } else if (stimulus === 'HYPERTROPHIC') {
        sets = 3;
        reps = '8-10';
        rpeTarget = 9.5;
        restSeconds = 90;
        phaseNote = 'Volume compresso e carichi alti portati al limite.';
      } else {
        sets = 3;
        reps = '12';
        executionType = 'STRIPPING';
        rpeTarget = 10;
        restSeconds = 60;
        phaseNote = 'Saturazione muscolare: Stripping a doppio scarico (-35% e -55%).';
      }
    }
  }

  // -------------------------------------------------------------
  // BLOCCO 3: QUALITÀ MUSCOLARE
  // -------------------------------------------------------------
  if (block === 'BLOCCO_3_QUALITA') {
    if (phase === 1) {
      // FASE I: Accumulo Volume Ipertrofico
      if (stimulus === 'NEURAL') {
        sets = 3;
        reps = '5-6';
        rpeTarget = 8.0;
        restSeconds = 180;
        phaseNote = 'Preservazione neurale senza affaticare il SNC a buffer.';
      } else if (stimulus === 'HYPERTROPHIC') {
        sets = 4;
        reps = '8-10';
        executionType = 'BACK_OFF';
        rpeTarget = 9.5;
        restSeconds = 90;
        phaseNote = 'Inserimento serie di Back-off a cedimento (-25% carico) sull\'ultima serie.';
      } else {
        sets = 3;
        reps = '10 + MAX';
        executionType = '10_PIU_MAX';
        rpeTarget = 10;
        restSeconds = 45;
        phaseNote = 'Densità e pompaggio: serie 10+MAX con scarico rapido del 40%.';
      }
    } else if (phase === 2) {
      // FASE II: Densità e Rest-Pause
      if (stimulus === 'NEURAL') {
        sets = 3;
        reps = '4-5';
        rpeTarget = 8.5;
        restSeconds = 180;
        phaseNote = 'Reclutamento neurale pesante a inizio seduta.';
      } else if (stimulus === 'HYPERTROPHIC') {
        sets = 3;
        reps = '12 (Cluster)';
        executionType = 'REST_PAUSE';
        rpeTarget = 10;
        restSeconds = 90;
        phaseNote = 'REST-PAUSE Metodo TOPGYM: Cedimento a 12 reps -> pausa 15"-20" -> max reps -> pausa 15"-20" -> max reps.';
      } else {
        sets = 3;
        reps = '12 + Parziali';
        executionType = 'PARZIALI';
        rpeTarget = 10;
        restSeconds = 45;
        phaseNote = 'Ripetizioni Parziali: Al cedimento a ROM completo, continua con 6-10 mezze reps veloci nel punto di massima tensione.';
      }
    } else if (phase === 4) {
      // FASE IV: Intensificazione e Massimo Pompaggio
      if (stimulus === 'NEURAL') {
        sets = 3;
        reps = '3-4';
        rpeTarget = 8.5;
        restSeconds = 210;
        if (baseW > 0) targetWeight = (Math.round((baseW * 1.05) * 2) / 2).toString();
        phaseNote = 'Massima tensione neurale: 3×3-4 ad alto carico con recupero completo di 3\'-4\'.';
      } else if (stimulus === 'HYPERTROPHIC') {
        sets = 3;
        reps = '10-12';
        executionType = 'REST_PAUSE';
        rpeTarget = 10;
        restSeconds = 75;
        phaseNote = 'Massimo effort meccanico tramite Rest-Pause.';
      } else {
        sets = 3;
        reps = '15 + Isometria';
        executionType = 'ISOMETRIE';
        rpeTarget = 10;
        restSeconds = 45;
        phaseNote = 'ISOMETRIA DI PICCO: Al cedimento concentrico blocca il carico per 10-15 secondi in massima contrazione.';
      }
    }
  }

  return {
    ...ex,
    sets,
    reps,
    targetWeight,
    rpeTarget,
    restSeconds,
    executionType,
    tut,
    notes: phaseNote
  };
}

/**
 * TRASFORMA L'INTERO PROGRAMMA (TUTTI I GIORNI E TUTTI GLI ESERCIZI)
 */
export function applyPhaseToProgram(
  days: EngineWorkoutDay[],
  block: MacroBlock,
  phase: MicroWeek
): EngineWorkoutDay[] {
  return days.map(day => ({
    ...day,
    title: phase === 3 ? `${day.title.replace(' (SETTIMANA DI SCARICO)', '')} (SETTIMANA DI SCARICO)` : day.title.replace(' (SETTIMANA DI SCARICO)', ''),
    exercises: day.exercises.map(ex => transformExerciseForPhase(ex, block, phase))
  }));
}

/**
 * FUNZIONE PER IL CONSUMO REAL-TIME
 */
export function processDynamicWorkout(
  baseWorkout: EngineWorkoutDay,
  _realWeek: number,
  phase: MicroWeek,
  block: MacroBlock
): EngineWorkoutDay {
  if (!baseWorkout || !baseWorkout.exercises) return baseWorkout;
  return {
    ...baseWorkout,
    title: phase === 3 ? `${baseWorkout.title.replace(' (SETTIMANA DI SCARICO)', '')} (SETTIMANA DI SCARICO)` : baseWorkout.title.replace(' (SETTIMANA DI SCARICO)', ''),
    exercises: baseWorkout.exercises.map(ex => transformExerciseForPhase(ex, block, phase))
  };
}