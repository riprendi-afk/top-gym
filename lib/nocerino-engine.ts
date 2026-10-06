// lib/nocerino-engine.ts

export type NocerinoPhaseId =
  | 'FASE_1_CARICO'
  | 'FASE_2_REPS'
  | 'RIPOSO_ATTIVO'
  | 'FASE_3_SERIE'
  | 'FASE_4_DENSITA'
  | 'COMPLETATO';

export interface ModularExerciseInput {
  id: string;
  name: string;
  targetMuscle?: string;
  baseSets: number;
  baseReps: number | string; // es. 8 oppure "6-8" oppure 12
  baseRestSeconds: number;   // es. 120
  notes?: string;
  isWarmup?: boolean;
}

export interface CalculatedNocerinoExercise {
  id: string;
  name: string;
  targetMuscle: string;
  sets: number;
  reps: string;
  restSeconds: number;
  tut: string;
  notes: string;
  loadInstruction: string;
  isWarmup: boolean;
}

export interface NocerinoProgressionState {
  completedWorkouts: number;
  microcycle: number;
  dayIndex: 0 | 1 | 2;
  phaseId: NocerinoPhaseId;
  phaseLabel: string;
  monthNumber: number;
  weekInPhase: number;
  phaseProgressPercentage: number;
  overallProgressPercentage: number;
  activeFocus: string;
  phaseDirective: string;
  isDeload: boolean;
  isCycleFinished: boolean;
}

export interface ModularDayPlan {
  dayIndex: 0 | 1 | 2;
  title: string;
  exercises: ModularExerciseInput[];
}

// 1 Microciclo = 3 sessioni (indipendente dai giorni solari)
// 1 Mese = 4 Microcicli (12 sessioni totali)
export const SESSIONS_PER_MICROCICLE = 3;
export const MICROCICLES_PER_PHASE = 4;
export const TOTAL_PROGRAM_WORKOUTS = 51; // 17 microcicli x 3 sessioni (4 mesi + 1 sett scarico)

/**
 * Calcola matematicamente lo stato, la fase e la direttiva corrente
 */
export function calculateNocerinoState(completedWorkoutsCount: number): NocerinoProgressionState {
  const safeCount = Math.max(0, completedWorkoutsCount);
  const microcycle = Math.floor(safeCount / SESSIONS_PER_MICROCICLE) + 1;
  const dayIndex = (safeCount % SESSIONS_PER_MICROCICLE) as 0 | 1 | 2;

  let phaseId: NocerinoPhaseId = 'FASE_1_CARICO';
  let phaseLabel = 'Mese 1: Intensità di Carico (+Peso)';
  let monthNumber = 1;
  let weekInPhase = 1;
  let phaseDirective = '';
  let activeFocus = '';
  let isDeload = false;
  let isCycleFinished = false;

  if (microcycle <= 4) {
    // MESE 1: 4 microcicli
    phaseId = 'FASE_1_CARICO';
    monthNumber = 1;
    weekInPhase = microcycle;
    phaseLabel = 'Mese 1: Sovraccarico Progressivo sul Carico';
    activeFocus = 'Incrementare il peso (+5% stimato ogni settimana), mantenendo fisse le ripetizioni e il recupero.';
    phaseDirective = `Microciclo ${weekInPhase}/4: Cerca di alzare il carico del 5% mantenendo il TUT 2-0-2 e i tempi di recupero base.`;
  } else if (microcycle <= 8) {
    // MESE 2: 4 microcicli
    phaseId = 'FASE_2_REPS';
    monthNumber = 2;
    weekInPhase = microcycle - 4;
    phaseLabel = 'Mese 2: Volume di Ripetizioni (+2 Reps)';
    activeFocus = 'Incrementare le ripetizioni, mantenendo il peso acquisito e i tempi di recupero.';
    phaseDirective = `Microciclo ${weekInPhase}/4: Mantieni i carichi consolidati nel Mese 1 e chiudi +2 ripetizioni su tutte le serie allenanti.`;
  } else if (microcycle === 9) {
    // TRANSIZIONE: 1 microciclo di riposo attivo / scarico
    phaseId = 'RIPOSO_ATTIVO';
    monthNumber = 2;
    weekInPhase = 1;
    phaseLabel = 'Scarico / Riposo Attivo Rigenerativo';
    activeFocus = 'Recupero neurale e tendineo prima del blocco di alto volume.';
    phaseDirective = 'Microciclo di scarico: serie dimezzate, buffer ampio (RPE 6-7), zero cedimento concentrico.';
    isDeload = true;
  } else if (microcycle <= 13) {
    // MESE 3: 4 microcicli
    phaseId = 'FASE_3_SERIE';
    monthNumber = 3;
    weekInPhase = microcycle - 9;
    phaseLabel = 'Mese 3: Volume delle Serie (+1 Serie)';
    activeFocus = 'Aumentare le serie, mantenendo peso, ripetizioni e tempo di recupero.';
    phaseDirective = `Microciclo ${weekInPhase}/4: Aggiungi +1 serie su ogni esercizio conservando i carichi e le ripetizioni conquistate nel Mese 2.`;
  } else if (microcycle <= 17) {
    // MESE 4: 4 microcicli
    phaseId = 'FASE_4_DENSITA';
    monthNumber = 4;
    weekInPhase = microcycle - 13;
    phaseLabel = 'Mese 4: Densità di Lavoro (-Recupero)';
    activeFocus = 'Diminuire i tempi di recupero, mantenendo peso, ripetizioni e serie.';
    phaseDirective = `Microciclo ${weekInPhase}/4: Taglia i recuperi del 25% mantenendo le serie aumentate e i carichi massimi.`;
  } else {
    phaseId = 'COMPLETATO';
    monthNumber = 4;
    weekInPhase = 4;
    phaseLabel = 'Macrociclo Concluso';
    activeFocus = 'Valutazione risultati e test del nuovo Massimale Relativo a TUT 2-0-2.';
    phaseDirective = 'Ciclo terminato. Pronti per la Fase 5 (TUT se pre-gara) o ripartenza con carichi ricalibrati.';
    isCycleFinished = true;
  }

  const phaseProgressPercentage = Math.min(100, Math.round((weekInPhase / 4) * 100));
  const overallProgressPercentage = Math.min(100, Math.round((safeCount / TOTAL_PROGRAM_WORKOUTS) * 100));

  return {
    completedWorkouts: safeCount,
    microcycle,
    dayIndex,
    phaseId,
    phaseLabel,
    monthNumber,
    weekInPhase,
    phaseProgressPercentage,
    overallProgressPercentage,
    activeFocus,
    phaseDirective,
    isDeload,
    isCycleFinished
  };
}

/**
 * Trasforma QUALSIASI esercizio che decidi tu applicando le regole matematiche di Nocerino
 */
export function applyNocerinoToCustomExercises(
  exercises: ModularExerciseInput[],
  state: NocerinoProgressionState
): CalculatedNocerinoExercise[] {
  return exercises.map((item) => {
    let finalSets = item.baseSets;
    let finalReps: string;
    let finalRest = item.baseRestSeconds;
    let loadInstruction = '';
    const tut = '2-0-2 (2" salita, 0" sosta, 2" discesa)';
    const isWarmup = Boolean(item.isWarmup);

    // Parsing sicuro del target reps base
    let minReps = 8;
    let maxReps = 8;
    if (typeof item.baseReps === 'number') {
      minReps = item.baseReps;
      maxReps = item.baseReps;
    } else {
      const parts = item.baseReps.split('-').map((v) => parseInt(v.trim(), 10));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        minReps = parts[0];
        maxReps = parts[1];
      } else if (parts.length === 1 && !isNaN(parts[0])) {
        minReps = parts[0];
        maxReps = parts[0];
      }
    }

    switch (state.phaseId) {
      case 'FASE_1_CARICO': {
        // Mese 1: serie base, reps base, rest base, incremento carico +5%/settimana
        finalSets = item.baseSets;
        finalReps = minReps === maxReps ? `${minReps}` : `${minReps}-${maxReps}`;
        finalRest = item.baseRestSeconds;
        loadInstruction =
          state.weekInPhase === 1
            ? 'Stabilisci il Massimale Relativo con TUT 2-0-2.'
            : `Tentare incremento del +5% rispetto al microciclo precedente (${state.weekInPhase - 1}).`;
        break;
      }

      case 'FASE_2_REPS': {
        // Mese 2: serie base, +2 ripetizioni, rest base, mantieni carichi del Mese 1
        finalSets = item.baseSets;
        if (isWarmup) {
          finalReps = minReps === maxReps ? `${minReps}` : `${minReps}-${maxReps}`;
        } else {
          finalReps = minReps === maxReps ? `${minReps + 2}` : `${minReps + 2}-${maxReps + 2}`;
        }
        finalRest = item.baseRestSeconds;
        loadInstruction = 'Mantieni il carico massimo raggiunto nel Mese 1. Chiudi +2 ripetizioni.';
        break;
      }

      case 'RIPOSO_ATTIVO': {
        // Scarico: dimezza le serie, mantieni reps, allunga recupero di 30", carico 75%
        finalSets = isWarmup ? item.baseSets : Math.max(2, Math.floor(item.baseSets / 2));
        finalReps = minReps === maxReps ? `${minReps}` : `${minReps}-${maxReps}`;
        finalRest = item.baseRestSeconds + 30;
        loadInstruction = 'Scarico rigenerativo: usa il 75% del peso, RPE 6-7, zero cedimento.';
        break;
      }

      case 'FASE_3_SERIE': {
        // Mese 3: +1 serie, mantieni le +2 reps del Mese 2, rest base, mantieni carico
        finalSets = isWarmup ? item.baseSets : item.baseSets + 1;
        if (isWarmup) {
          finalReps = minReps === maxReps ? `${minReps}` : `${minReps}-${maxReps}`;
        } else {
          finalReps = minReps === maxReps ? `${minReps + 2}` : `${minReps + 2}-${maxReps + 2}`;
        }
        finalRest = item.baseRestSeconds;
        loadInstruction = 'Mantieni sia il peso consolidato sia le ripetizioni aumentate del Mese 2.';
        break;
      }

      case 'FASE_4_DENSITA': {
        // Mese 4: serie aumentate, reps aumentate, taglia il recupero del 25%
        finalSets = isWarmup ? item.baseSets : item.baseSets + 1;
        if (isWarmup) {
          finalReps = minReps === maxReps ? `${minReps}` : `${minReps}-${maxReps}`;
        } else {
          finalReps = minReps === maxReps ? `${minReps + 2}` : `${minReps + 2}-${maxReps + 2}`;
        }
        // Riduzione densità -25% (arrotondato ai 5 secondi più vicini)
        finalRest = Math.max(20, Math.round((item.baseRestSeconds * 0.75) / 5) * 5);
        loadInstruction = 'Recupero ridotto del 25%. Mantieni pesi, serie e ripetizioni: lavoro ad alta densità.';
        break;
      }

      case 'COMPLETATO': {
        finalSets = item.baseSets;
        finalReps = minReps === maxReps ? `${minReps}` : `${minReps}-${maxReps}`;
        finalRest = item.baseRestSeconds;
        loadInstruction = 'Ciclo terminato. Esegui il test del Massimale Relativo a 6 colpi.';
        break;
      }
    }

    return {
      id: item.id,
      name: item.name,
      targetMuscle: item.targetMuscle ?? 'Gruppo Muscolare',
      sets: finalSets,
      reps: finalReps,
      restSeconds: finalRest,
      tut,
      notes: item.notes ?? '',
      loadInstruction,
      isWarmup
    };
  });
}