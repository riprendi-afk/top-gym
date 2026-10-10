// lib/engines/topgym-auto-advance.ts

export type EngineType =
  | 'POWERBLOCK_HYBRID'
  | 'BLOOD_VOLUME_OVERLOAD'
  | 'HELMS_PYRAMID'
  | 'BIKINI_WAVE';

export interface SetLog {
  setIndex: number;
  weight: number;
  reps: number;
  rpe?: number;
}

export interface ExerciseLog {
  name: string;
  sets: SetLog[];
}

export interface WorkoutLog {
  dayNumber: number;
  exercises: ExerciseLog[];
}

export interface PowerBlockState {
  squat1RM: number;
  bench1RM: number;
  deadlift1RM: number;
  squatFails: number;
  benchFails: number;
  deadliftFails: number;
  rotationIndex: number; // 0: Gambe/Spalle, 1: Dorso/Bicipiti, 2: Petto/Tricipiti
}

export interface BloodVolumeState {
  overloadWeights: Record<string, number>;
}

export interface HelmsState {
  compoundBaseWeights: Record<string, number>;
  isolationCatalog: Record<string, { currentWeight: number; lastReps: number[] }>;
  fatigueScore: number; // 0-5 domande affirmative del test post-blocco
}

export interface EngineState {
  engine: EngineType;
  currentWeek: number;
  isDeload: boolean;
  powerBlock?: PowerBlockState;
  bloodVolume?: BloodVolumeState;
  helms?: HelmsState;
}

export interface AutoAdvanceOutput {
  nextState: EngineState;
  logSummary: string[];
  neonStatus: 'OVERLOAD' | 'PROGRESSION' | 'DELOAD' | 'PUMP';
  engineNotes: string;
  modifiedDays: any[];
}

// ============================================================================
// 1. MOTORE POWERBLOCK HYBRID (Peter Fitschen & Cliff Wilson)
// pp. 251-253: Big 3 Power Day + Mesocicli Triadici + Rotazione Day 5
// ============================================================================
export function advancePowerBlock(
  state: EngineState,
  logs: WorkoutLog[],
  baseDays: any[]
): AutoAdvanceOutput {
  const nextWeek = state.currentWeek + 1;
  const isDeload = nextWeek === 13;

  const pb: PowerBlockState = state.powerBlock || {
    squat1RM: 100,
    bench1RM: 80,
    deadlift1RM: 120,
    squatFails: 0,
    benchFails: 0,
    deadliftFails: 0,
    rotationIndex: 0
  };

  const day1 = logs.find(l => l.dayNumber === 1);
  const logSummary: string[] = [];

  // 1. Valutazione AMRAP al 90% sui Big 3 (Fitschen/Wilson p. 253)
  if (day1) {
    const checkBig3 = (
      liftName: string,
      rmKey: 'squat1RM' | 'bench1RM' | 'deadlift1RM',
      failKey: 'squatFails' | 'benchFails' | 'deadliftFails'
    ) => {
      const ex = day1.exercises.find(e => e.name.toLowerCase().includes(liftName));
      if (ex && ex.sets.length > 0) {
        const amrapSet = ex.sets[ex.sets.length - 1];
        if (amrapSet.reps >= 3) {
          pb[rmKey] += 2.5; // +5 lbs (~2.5 kg)
          pb[failKey] = 0;
          logSummary.push(`${liftName.toUpperCase()}: ${amrapSet.reps} rep al 90%. Target superato! Nuovo 1RM: ${pb[rmKey]}kg (+2.5kg).`);
        } else {
          pb[failKey] += 1;
          if (pb[failKey] >= 2) {
            pb[rmKey] = Math.max(0, pb[rmKey] - 9.0); // Reset di 20 lbs (~9 kg)
            pb[failKey] = 0;
            logSummary.push(`${liftName.toUpperCase()}: <3 rep per 2 settimane. Scarico neurale: ${pb[rmKey]}kg (-9kg).`);
          } else {
            logSummary.push(`${liftName.toUpperCase()}: ${amrapSet.reps} rep al 90%. Carico mantenuto invariato.`);
          }
        }
      }
    };

    checkBig3('squat', 'squat1RM', 'squatFails');
    checkBig3('bench', 'bench1RM', 'benchFails');
    checkBig3('deadlift', 'deadlift1RM', 'deadliftFails');
  }

  // 2. Definizione del range di ripetizioni per i Block Days (Triadi da 3 settimane)
  let blockRepRange = '5-7';
  if (nextWeek >= 4 && nextWeek <= 6) blockRepRange = '8-10';
  else if (nextWeek >= 7 && nextWeek <= 9) blockRepRange = '10-15';
  else if (nextWeek >= 10 && nextWeek <= 12) blockRepRange = '15-30';
  else if (isDeload) blockRepRange = '6-8 (Deload)';

  // 3. Rotazione rigorosa del 5° giorno (Tabella 7.1 Fitschen/Wilson)
  // W1 (rot 0): Gambe/Spalle | W2 (rot 1): Dorso/Bicipiti | W3 (rot 2): Petto/Tricipiti
  const nextRotationIndex = isDeload ? 0 : (pb.rotationIndex + 1) % 3;
  const sourceDayIndex = nextRotationIndex === 0 ? 1 : nextRotationIndex === 1 ? 2 : 3;

  const modifiedDays = baseDays.map((day, idx) => {
    // Aggiornamento percentuali Day 1 (Powerlifting)
    if (day.dayNumber === 1) {
      return {
        ...day,
        segments: day.segments.map((seg: any) => ({
          ...seg,
          exercises: seg.exercises.map((ex: any) => {
            const lower = ex.name.toLowerCase();
            let base1RM = 0;
            if (lower.includes('squat') && !lower.includes('hack')) base1RM = pb.squat1RM;
            if (lower.includes('bench') && !lower.includes('incline') && !lower.includes('dumbbell')) base1RM = pb.bench1RM;
            if (lower.includes('deadlift') && !lower.includes('romanian')) base1RM = pb.deadlift1RM;

            if (base1RM > 0) {
              return {
                ...ex,
                notes: `Target 1RM: ${base1RM}kg | 2x5@${Math.round(base1RM * 0.7)}kg, 2x3@${Math.round(base1RM * 0.8)}kg, 1x1@${Math.round(base1RM * 0.9)}kg (AMRAP buffer 1)`
              };
            }
            return ex;
          })
        }))
      };
    }

    // Giorno 5: replica esatta del distretto secondo rotazione della Tabella 7.1
    if (idx === 4) {
      const sourceDay = baseDays[sourceDayIndex];
      return {
        ...sourceDay,
        dayNumber: 5,
        title: `Giorno 5 (Rotazione Settimanale W${nextWeek}): ${sourceDay.title.replace(/Giorno \d+: /, '')}`,
        segments: sourceDay.segments.map((seg: any) => ({
          ...seg,
          exercises: seg.exercises.map((ex: any) => ({
            ...ex,
            sets: isDeload ? Math.max(2, Math.floor(ex.sets / 2)) : ex.sets,
            reps: ex.reps === 'Block Reps' ? blockRepRange : ex.reps
          }))
        }))
      };
    }

    // Giorni 2, 3, 4 (Block Days standard)
    return {
      ...day,
      segments: day.segments.map((seg: any) => ({
        ...seg,
        exercises: seg.exercises.map((ex: any) => ({
          ...ex,
          sets: isDeload ? Math.max(2, Math.floor(ex.sets / 2)) : ex.sets,
          reps: ex.reps === 'Block Reps' ? blockRepRange : ex.reps
        }))
      }))
    };
  });

  return {
    nextState: {
      ...state,
      currentWeek: isDeload ? 1 : nextWeek,
      isDeload,
      powerBlock: { ...pb, rotationIndex: nextRotationIndex }
    },
    logSummary,
    neonStatus: isDeload ? 'DELOAD' : 'PROGRESSION',
    engineNotes: isDeload
      ? 'Settimana 13 Deload: volume dimezzato per supercompensazione sistemica.'
      : `Settimana ${nextWeek}: Rep range a blocchi impostato su ${blockRepRange}.`,
    modifiedDays
  };
}

// ============================================================================
// 2. MOTORE BLOOD VOLUME & OVERLOAD (Peter Fitschen & Cliff Wilson)
// pp. 252-256: 6 Workout completi (3 ON, 1 OFF, 2 ON, 1 OFF) + Cedimento a Fasi
// ============================================================================
export function advanceBloodVolume(
  state: EngineState,
  logs: WorkoutLog[],
  baseDays: any[]
): AutoAdvanceOutput {
  const currentWeek = state.currentWeek;
  const nextWeek = (currentWeek % 4) + 1;
  const isDeload = currentWeek === 4;

  const bvState: BloodVolumeState = state.bloodVolume || { overloadWeights: {} };
  const logSummary: string[] = [];
  const increases: string[] = [];

  // Controllo se l'atleta ha completato 7 ripetizioni in tutti i set Overload (3x4-7)
  logs.forEach(w => {
    w.exercises.forEach(e => {
      if (e.sets.length >= 3 && e.sets.every(s => s.reps >= 7)) {
        const prevWeight = bvState.overloadWeights[e.name] || e.sets[0].weight;
        bvState.overloadWeights[e.name] = prevWeight + 2.5;
        increases.push(e.name);
        logSummary.push(`${e.name}: 7 rep completate su tutte le serie! Carico incrementato a ${bvState.overloadWeights[e.name]}kg (+2.5kg).`);
      }
    });
  });

  let failureNote = 'Buffer 1-2 RIR su tutti i set (no cedimento).';
  if (nextWeek === 3) failureNote = 'Porta a CEDIMENTO concentrico esattamente 1 serie per gruppo muscolare.';
  if (nextWeek === 4) failureNote = 'Porta a CEDIMENTO concentrico l ultima serie di OGNI esercizio.';

  const modifiedDays = baseDays.map(day => ({
    ...day,
    segments: day.segments.map((seg: any) => ({
      ...seg,
      exercises: seg.exercises.map((ex: any) => {
        const isOverload = String(ex.reps).includes('4-7');
        if (isOverload) {
          const newWeight = bvState.overloadWeights[ex.name];
          return {
            ...ex,
            sets: isDeload ? 2 : ex.sets,
            notes: `${failureNote} ${newWeight ? `[Nuovo carico target: ${newWeight}kg]` : ''}`.trim()
          };
        }
        return {
          ...ex,
          sets: isDeload ? 2 : ex.sets,
          notes: 'Blood Volume: TUT 3-0-3 (3s salita, 3s discesa, squeeze 1s), rest <= 10s nel superset.'
        };
      })
    }))
  }));

  return {
    nextState: {
      ...state,
      currentWeek: nextWeek,
      isDeload,
      bloodVolume: bvState
    },
    logSummary,
    neonStatus: nextWeek === 4 ? 'OVERLOAD' : isDeload ? 'DELOAD' : 'PUMP',
    engineNotes: isDeload
      ? 'Deload cellulare: volume ridotto, recupero delle fibre e rigenerazione connettiva.'
      : `Settimana ${nextWeek}: ${failureNote}`,
    modifiedDays
  };
}

// ============================================================================
// 3. MOTORE HELMS PYRAMID (Eric Helms)
// pp. 109-114, 123: Wave Loading Compound + Double Progression Isolamento
// ============================================================================
export function advanceHelmsPyramid(
  state: EngineState,
  logs: WorkoutLog[],
  baseDays: any[]
): AutoAdvanceOutput {
  const currentWeek = state.currentWeek;
  const currentWave = ((currentWeek - 1) % 4) + 1; // 1, 2, 3 o 4 (Deload)
  const nextWave = currentWave + 1;

  const helms: HelmsState = state.helms || {
    compoundBaseWeights: {},
    isolationCatalog: {},
    fatigueScore: 0
  };

  const isDeload = nextWave === 4 || helms.fatigueScore >= 2;
  const logSummary: string[] = [];

  // Gestione Double Progression sugli isolamenti (12-15 rep)
  logs.forEach(w => {
    w.exercises.forEach(e => {
      const isIsolation = !e.name.includes('Barbell') && !e.name.includes('Squat') && !e.name.includes('Deadlift');
      if (isIsolation && e.sets.length >= 3) {
        const lastWeight = e.sets[0].weight;
        const all15 = e.sets.every(s => s.reps >= 15);

        if (!helms.isolationCatalog[e.name]) {
          helms.isolationCatalog[e.name] = { currentWeight: lastWeight, lastReps: e.sets.map(s => s.reps) };
        }

        if (all15) {
          helms.isolationCatalog[e.name].currentWeight += 1.5; // Step minimo di carico
          helms.isolationCatalog[e.name].lastReps = [12, 12, 12];
          logSummary.push(`${e.name}: 3x15 completato! Double Progression superata: nuovo carico ${helms.isolationCatalog[e.name].currentWeight}kg (riparti da 3x12).`);
        } else {
          helms.isolationCatalog[e.name].lastReps = e.sets.map(s => s.reps);
        }
      }
    });
  });

  const modifiedDays = baseDays.map(day => ({
    ...day,
    segments: day.segments.map((seg: any) => ({
      ...seg,
      exercises: seg.exercises.map((ex: any) => {
        const isCompound = ex.name.includes('Barbell') || ex.name.includes('Squat') || ex.name.includes('Deadlift');

        if (isCompound) {
          // Wave Loading: W1 (4x6 @ RPE 7.5) -> W2 (4x5 +2.5kg @ RPE 8) -> W3 (4x4 +2.5kg @ RPE 8.5-9) -> W4 Deload (2x6 @ RPE 6)
          if (isDeload) {
            return { ...ex, sets: 2, reps: '6', notes: 'Deload Helms: 2 serie con carico W1 a RPE 6 (fatica dissipata)' };
          }
          if (nextWave === 2) return { ...ex, reps: '5', notes: '+2.5kg rispetto a W1 @ RPE 8' };
          if (nextWave === 3) return { ...ex, reps: '4', notes: '+2.5kg rispetto a W2 @ RPE 8.5-9' };
          return { ...ex, reps: '6', notes: 'Inizio onda mesociclo @ RPE 7.5' };
        }

        // Isolamento con Double Progression
        const iso = helms.isolationCatalog[ex.name];
        if (isDeload) {
          return { ...ex, sets: 2, reps: '12', notes: 'Deload isolamento: 2 serie a fondo scala' };
        }
        return {
          ...ex,
          reps: '12-15',
          notes: iso
            ? `Carico target: ${iso.currentWeight}kg. Progredisci nelle rep fino a chiudere 3x15 prima di aumentare il peso.`
            : 'Double Progression: completa 3x15 prima di aumentare il carico.'
        };
      })
    }))
  }));

  return {
    nextState: {
      ...state,
      currentWeek: currentWeek + 1,
      isDeload,
      helms
    },
    logSummary,
    neonStatus: isDeload ? 'DELOAD' : 'PROGRESSION',
    engineNotes: isDeload
      ? 'Deload Helms: Volume ridotto del 50%, preserva il recupero sistemico.'
      : `Settimana ${nextWave} Onda Lineare Helms: carico calibrato su RPE target.`,
    modifiedDays
  };
}

// ============================================================================
// 4. MOTORE BIKINI WAVE (Peter Fitschen & Cliff Wilson)
// pp. 253-263: 3 Onde x 3 Settimane + Scalabilità Serie SOLO sui Low-Reps (L)
// ============================================================================
export function advanceBikiniWave(
  state: EngineState,
  _logs: WorkoutLog[],
  baseDays: any[]
): AutoAdvanceOutput {
  const nextWeek = state.currentWeek + 1;
  const isDeload = nextWeek === 10;

  // Calcolo onda corrente (Onda 1: W1-3, Onda 2: W4-6, Onda 3: W7-9)
  let wave = 1;
  if (nextWeek >= 4 && nextWeek <= 6) wave = 2;
  else if (nextWeek >= 7 && nextWeek <= 9) wave = 3;

  const intraWaveWeek = ((nextWeek - 1) % 3) + 1; // 1, 2 o 3
  const lowRepSets = isDeload ? 2 : 2 + intraWaveWeek; // W1 = 3 set, W2 = 4 set, W3 = 5 set

  let lowRepTarget = '6';
  let modRepTarget = '8-12';
  if (wave === 2) { lowRepTarget = '5'; modRepTarget = '6-10'; }
  if (wave === 3) { lowRepTarget = '4'; modRepTarget = '6-8'; }

  const modifiedDays = baseDays.map(day => ({
    ...day,
    segments: day.segments.map((seg: any) => ({
      ...seg,
      exercises: seg.exercises.map((ex: any) => {
        const lower = ex.name.toLowerCase();
        const isLowRepCompound = lower.includes('deadlift') || lower.includes('squat') || lower.includes('overhead press') || lower.includes('hip thrust') || lower.includes('pendlay');

        // Solo i fondamentali Low Reps (L) aumentano le serie da 3 a 5
        if (isLowRepCompound && (String(ex.reps).includes('4-6') || ex.reps === '6' || ex.reps === '5' || ex.reps === '4')) {
          return {
            ...ex,
            sets: isDeload ? 2 : lowRepSets,
            reps: isDeload ? '6' : lowRepTarget,
            notes: `Onda ${wave} (W${intraWaveWeek}): ${lowRepSets} serie x ${lowRepTarget} rep pesanti.`
          };
        }

        // Gli esercizi Moderate Reps (M) mantengono 3 serie fisse ma scalano le ripetizioni per onda
        if (String(ex.reps).includes('6-12') || String(ex.reps).includes('8-12') || String(ex.reps).includes('6-10') || String(ex.reps).includes('6-8')) {
          return {
            ...ex,
            sets: isDeload ? 2 : 3,
            reps: isDeload ? '10' : modRepTarget,
            notes: `Onda ${wave}: Target ${modRepTarget} rep ipertrofiche.`
          };
        }

        // Gli esercizi High Reps (H) mantengono volume e range fisso (15-30 rep) per la densità
        return {
          ...ex,
          sets: isDeload ? 2 : ex.sets,
          reps: '15-30',
          notes: 'High Reps: Pompaggio continuo e densità metabolica.'
        };
      })
    }))
  }));

  return {
    nextState: {
      ...state,
      currentWeek: isDeload ? 1 : nextWeek,
      isDeload
    },
    logSummary: [
      isDeload
        ? 'Raggiunta la settimana 10: attivazione Deload da palco.'
        : `Avanzamento a Onda ${wave}, Settimana ${intraWaveWeek}: fondamentali (L) scalati a ${lowRepSets} serie x ${lowRepTarget} rep.`
    ],
    neonStatus: isDeload ? 'DELOAD' : 'PUMP',
    engineNotes: isDeload
      ? 'Settimana 10 Deload Bikini: volume al 50% per massimizzare il riempimento di glicogeno.'
      : `Onda ${wave} (Sett. ${intraWaveWeek}): Low Reps target ${lowRepTarget}, volume sui fondamentali: ${lowRepSets} serie.`,
    modifiedDays
  };
}

// ============================================================================
// 5. MASTER DISPATCHER UNIVERSALE
// ============================================================================
export function autoAdvanceTopGymEngine(
  currentState: EngineState,
  recentLogs: WorkoutLog[],
  baseTemplateDays: any[]
): AutoAdvanceOutput {
  switch (currentState.engine) {
    case 'POWERBLOCK_HYBRID':
      return advancePowerBlock(currentState, recentLogs, baseTemplateDays);
    case 'BLOOD_VOLUME_OVERLOAD':
      return advanceBloodVolume(currentState, recentLogs, baseTemplateDays);
    case 'HELMS_PYRAMID':
      return advanceHelmsPyramid(currentState, recentLogs, baseTemplateDays);
    case 'BIKINI_WAVE':
      return advanceBikiniWave(currentState, recentLogs, baseTemplateDays);
    default:
      throw new Error(`Engine ${currentState.engine} non implementato.`);
  }
}