// lib/topgym-timeline-generator.ts
/**
 * GENERATORE DETERMINISTICO TIMELINE E PERIODIZZAZIONE TOP GYM
 * Calcola l'evoluzione settimana per settimana per tutti gli 8 motori scientifici
 * con supporto ad override granulare su TUT, Recupero, Carichi, Serie e Ripetizioni.
 */

export type SupportedMethod =
  | 'TOPGYM_CLASSICO'
  | 'TOPGYM_BLOCKS'
  | 'BIKINI_WAVE'
  | 'POWERBLOCK_HYBRID'
  | 'HELMS_PYRAMID'
  | 'BLOOD_VOLUME_OVERLOAD'
  | 'ACETO'
  | 'HARDTOPGYM'
  | 'NOCERINO';

export interface ExerciseWeekOverride {
  sets?: number;
  reps?: string;
  weight?: string | number;
  rpe?: string | number;
  restSeconds?: number;
  tut?: string;
  notes?: string;
  isLocked?: boolean;
}

export interface TimelineExercise {
  id: string;
  name: string;
  muscle?: string;
  sets: number;
  reps: string;
  weight?: string | number;
  rpe?: string | number;
  restSeconds: number;
  tut: string;
  notes: string;
  stimulus: 'NEURAL' | 'HYPERTROPHIC' | 'METABOLIC' | string;
  isLocked?: boolean;
  isOverridden?: boolean;
}

export interface TimelineDay {
  id: string;
  title: string;
  dayNumber: number;
  exercises: TimelineExercise[];
}

export interface ProjectedWeek {
  weekNumber: number;
  phaseLabel: string;
  phaseCategory: 'ACCUMULO' | 'CONVERSIONE' | 'DELOAD' | 'PICCO' | 'OVERLOAD';
  phaseType: 'ACCUMULO' | 'CONVERSIONE' | 'DELOAD' | 'PICCO' | 'OVERLOAD';
  progressionRule: string;
  isDeload: boolean;
  days: TimelineDay[];
}

export interface EngineMeta {
  name: string;
  defaultWeeks: number;
  macrocycleSummary: string;
  phases: { name: string; weeks: string; color: string }[];
}

export const ENGINE_METADATA: Record<SupportedMethod, EngineMeta> = {
  TOPGYM_CLASSICO: {
    name: 'TopGym Metodo Classico (16 Settimane per Blocco)',
    defaultWeeks: 16,
    macrocycleSummary: 'W1-6 Accumulo (5x6), W7-9 Conversione (5x8), W10 Deload SNC (-40% vol), W11-16 Picco (+7%).',
    phases: [
      { name: 'Accumulo Volumetrico', weeks: 'W1 - W6', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
      { name: 'Conversione Ipertrofica', weeks: 'W7 - W9', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
      { name: 'Scarico SNC (Deload)', weeks: 'W10', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
      { name: 'Picco Neurale Massimale', weeks: 'W11 - W16', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' }
    ]
  },
  TOPGYM_BLOCKS: {
    name: 'TopGym Metodo Classico (16 Settimane)',
    defaultWeeks: 16,
    macrocycleSummary: 'Blocco 16w: W1-6 Accumulo, W7-9 Conversione, W10 Deload, W11-16 Picco Neurale.',
    phases: [
      { name: 'Accumulo', weeks: 'W1 - W6', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
      { name: 'Conversione', weeks: 'W7 - W9', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
      { name: 'Deload SNC', weeks: 'W10', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
      { name: 'Picco Neurale', weeks: 'W11 - W16', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' }
    ]
  },
  BIKINI_WAVE: {
    name: 'Bikini Wave System (10 Settimane)',
    defaultWeeks: 10,
    macrocycleSummary: '3 Onde x 3 settimane (3->4->5 serie fondamentali L) + W10 Deload Glicogenico (2 serie).',
    phases: [
      { name: 'Onda 1 (3->4->5 set @ 6 reps)', weeks: 'W1 - W3', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
      { name: 'Onda 2 (3->4->5 set @ 5 reps)', weeks: 'W4 - W6', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
      { name: 'Onda 3 (3->4->5 set @ 4 reps)', weeks: 'W7 - W9', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
      { name: 'Deload Glicogenico Pre-Gara', weeks: 'W10', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' }
    ]
  },
  POWERBLOCK_HYBRID: {
    name: 'PowerBlock Hybrid (13 Settimane)',
    defaultWeeks: 13,
    macrocycleSummary: '12 Settimane Triadi Big 3 + AMRAP 90% + Rotazione Day 5 + W13 Supercompensazione.',
    phases: [
      { name: 'Triade 1 (Volume & AMRAP)', weeks: 'W1 - W4', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
      { name: 'Triade 2 (Intensificazione)', weeks: 'W5 - W8', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
      { name: 'Triade 3 (Realizzazione Carichi)', weeks: 'W9 - W12', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
      { name: 'Supercompensazione Sistemica', weeks: 'W13', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' }
    ]
  },
  HELMS_PYRAMID: {
    name: 'Helms Muscle & Strength Pyramid (4 Settimane)',
    defaultWeeks: 4,
    macrocycleSummary: 'W1-W3 Wave loading composti & double progression isolamento, W4 Deload attivo RPE 6.',
    phases: [
      { name: 'Wave 1 (Base RPE 7.5)', weeks: 'W1', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
      { name: 'Wave 2 (+2.5kg @ RPE 8)', weeks: 'W2', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
      { name: 'Wave 3 (+2.5kg @ RPE 8.5-9)', weeks: 'W3', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
      { name: 'Deload Attivo SNC (RPE 6)', weeks: 'W4', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' }
    ]
  },
  BLOOD_VOLUME_OVERLOAD: {
    name: 'Blood Volume Overload (4 Settimane)',
    defaultWeeks: 4,
    macrocycleSummary: 'W1-W2 Buffer 1-2, W3 Cedimento 1 set/gruppo, W4 Cedimento totale / Deload cellulare.',
    phases: [
      { name: 'Saturazione Meccanica', weeks: 'W1 - W2', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
      { name: 'Overload Cedimento Concentrico', weeks: 'W3', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
      { name: 'Scarico Cellulare & Drenaggio', weeks: 'W4', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' }
    ]
  },
  ACETO: {
    name: 'Chris Aceto Hypertrophy Cycle (6-8 Settimane)',
    defaultWeeks: 6,
    macrocycleSummary: 'W1-2 Base, W3-4 Heavy Overload, W5 Stripping Peak, W6 Deload (-20% carico, 2 set).',
    phases: [
      { name: 'Base Volume Acquisition', weeks: 'W1 - W2', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
      { name: 'Heavy Absolute Overload', weeks: 'W3 - W4', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
      { name: 'Stripping Peak (Cedimento)', weeks: 'W5', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
      { name: 'Deload Volumetrico', weeks: 'W6', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' }
    ]
  },
  HARDTOPGYM: {
    name: 'HardTopGym Microciclo Bosco-Colli (4 Settimane)',
    defaultWeeks: 4,
    macrocycleSummary: 'W1 Setup Neurale, W2 Micro-Overload, W3 Urto They (RIR 0), W4 Scarico Attivo (-30% vol).',
    phases: [
      { name: 'Setup Neurale & Meccanico', weeks: 'W1', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
      { name: 'Micro-Overload Progressivo', weeks: 'W2', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
      { name: 'Urto They & Cedimento RIR 0', weeks: 'W3', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
      { name: 'Scarico Attivo Ormonale', weeks: 'W4', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' }
    ]
  },
  NOCERINO: {
    name: 'Metodo Nocerino (17 Microcicli)',
    defaultWeeks: 17,
    macrocycleSummary: '17 Microcicli a modulazione miotipica della tensione e TUT continuo.',
    phases: [
      { name: 'Fase I: Adattamento Connettivale', weeks: 'W1 - W4', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
      { name: 'Fase II: Densità Fibre Miste', weeks: 'W5 - W10', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
      { name: 'Fase III: Tensione Continua Max', weeks: 'W11 - W16', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
      { name: 'Scarico Rigenerativo', weeks: 'W17', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' }
    ]
  }
};

export function extractRawExercises(day: any): any[] {
  if (Array.isArray(day.exercises) && day.exercises.length > 0) return day.exercises;
  if (Array.isArray(day.segments)) {
    const list: any[] = [];
    day.segments.forEach((s: any) => {
      if (Array.isArray(s.exercises)) list.push(...s.exercises);
    });
    return list;
  }
  return [];
}

export function resolveEngineKey(methodStr?: string): SupportedMethod {
  if (!methodStr) return 'TOPGYM_CLASSICO';
  const upper = methodStr.toUpperCase();
  if (upper.includes('BIKINI')) return 'BIKINI_WAVE';
  if (upper.includes('POWERBLOCK')) return 'POWERBLOCK_HYBRID';
  if (upper.includes('HELMS')) return 'HELMS_PYRAMID';
  if (upper.includes('BLOOD') || upper.includes('VOLUME_OVERLOAD')) return 'BLOOD_VOLUME_OVERLOAD';
  if (upper.includes('ACETO')) return 'ACETO';
  if (upper.includes('HARD')) return 'HARDTOPGYM';
  if (upper.includes('NOCERINO')) return 'NOCERINO';
  if (upper.includes('BLOCKS')) return 'TOPGYM_BLOCKS';
  return 'TOPGYM_CLASSICO';
}

export function generateMacrocycleTimeline(
  baseDays: any[],
  methodKey: SupportedMethod,
  weekOverrides: Record<number, Record<string, ExerciseWeekOverride>> = {},
  totalWeeksOverride?: number
): ProjectedWeek[] {
  const meta = ENGINE_METADATA[methodKey] || ENGINE_METADATA.TOPGYM_CLASSICO;
  const numWeeks = totalWeeksOverride || meta.defaultWeeks;
  const projected: ProjectedWeek[] = [];

  for (let w = 1; w <= numWeeks; w++) {
    projected.push(projectSingleWeek(baseDays, methodKey, w, weekOverrides[w] || {}));
  }

  return projected;
}

function projectSingleWeek(
  baseDays: any[],
  methodKey: SupportedMethod,
  weekNumber: number,
  weekOverridesForWeek: Record<string, ExerciseWeekOverride>
): ProjectedWeek {
  let phaseLabel = 'Fase Base';
  let phaseCategory: 'ACCUMULO' | 'CONVERSIONE' | 'DELOAD' | 'PICCO' | 'OVERLOAD' = 'ACCUMULO';
  let progressionRule = 'Standard';
  let isDeload = false;

  // 1. TOPGYM CLASSICO
  if (methodKey === 'TOPGYM_CLASSICO' || methodKey === 'TOPGYM_BLOCKS') {
    const weekInBlock = ((weekNumber - 1) % 16) + 1;
    if (weekInBlock <= 6) {
      phaseLabel = 'Accumulo Volumetrico';
      phaseCategory = 'ACCUMULO';
      progressionRule = '5×6 @ RPE 7.5 (Buffer 2-3)';
    } else if (weekInBlock <= 9) {
      phaseLabel = 'Conversione Ipertrofica';
      phaseCategory = 'CONVERSIONE';
      progressionRule = '5×8 @ RPE 8.5 (Spinta)';
    } else if (weekInBlock === 10) {
      phaseLabel = 'Scarico Fisiologico SNC';
      phaseCategory = 'DELOAD';
      progressionRule = 'Volume -40% | Carico -15%';
      isDeload = true;
    } else {
      phaseLabel = 'Picco Neurale Massimale';
      phaseCategory = 'PICCO';
      progressionRule = '4×3-4 (+7% carico @ RPE 9.5)';
    }
  }
  // 2. BIKINI WAVE SYSTEM
  else if (methodKey === 'BIKINI_WAVE') {
    isDeload = weekNumber === 10;
    if (isDeload) {
      phaseLabel = 'Deload Glicogenico';
      phaseCategory = 'DELOAD';
      progressionRule = '2 serie fisse di pompaggio';
    } else {
      let wave = 1;
      if (weekNumber >= 4 && weekNumber <= 6) wave = 2;
      else if (weekNumber >= 7 && weekNumber <= 9) wave = 3;
      const intraWaveWeek = ((weekNumber - 1) % 3) + 1;
      phaseLabel = `Onda ${wave} (Microciclo ${intraWaveWeek}/3)`;
      phaseCategory = intraWaveWeek === 3 ? 'PICCO' : 'ACCUMULO';
      const sets = 2 + intraWaveWeek;
      const rep = wave === 1 ? '6' : wave === 2 ? '5' : '4';
      progressionRule = `${sets} serie x ${rep} reps pesanti`;
    }
  }
  // 3. POWERBLOCK HYBRID
  else if (methodKey === 'POWERBLOCK_HYBRID') {
    isDeload = weekNumber === 13;
    if (isDeload) {
      phaseLabel = 'Supercompensazione SNC';
      phaseCategory = 'DELOAD';
      progressionRule = '2 serie al 60% per dissipare fatica';
    } else {
      phaseLabel = `Mesociclo Triadico W${weekNumber}`;
      phaseCategory = weekNumber % 3 === 0 ? 'OVERLOAD' : 'ACCUMULO';
      progressionRule = 'Power Day Big 3 + AMRAP 90%';
    }
  }
  // 4. HELMS PYRAMID
  else if (methodKey === 'HELMS_PYRAMID') {
    const wave = ((weekNumber - 1) % 4) + 1;
    isDeload = wave === 4;
    if (isDeload) {
      phaseLabel = 'Deload Attivo Helms';
      phaseCategory = 'DELOAD';
      progressionRule = '2 serie con carico W1 @ RPE 6';
    } else {
      phaseLabel = `Intensificazione Wave ${wave}/3`;
      phaseCategory = wave === 3 ? 'OVERLOAD' : 'ACCUMULO';
      progressionRule = wave === 1 ? '4x6 @ RPE 7.5' : wave === 2 ? '4x5 (+2.5kg) @ RPE 8' : '4x4 (+5kg) @ RPE 9';
    }
  }
  // 5. BLOOD VOLUME OVERLOAD
  else if (methodKey === 'BLOOD_VOLUME_OVERLOAD') {
    const wave = ((weekNumber - 1) % 4) + 1;
    isDeload = wave === 4;
    if (isDeload) {
      phaseLabel = 'Scarico Cellulare';
      phaseCategory = 'DELOAD';
      progressionRule = '2 serie a fondo scala per drenaggio';
    } else if (wave === 3) {
      phaseLabel = 'Overload Cedimento';
      phaseCategory = 'OVERLOAD';
      progressionRule = 'Cedimento concentrico 1 serie/muscolo';
    } else {
      phaseLabel = 'Saturazione Meccanica';
      phaseCategory = 'ACCUMULO';
      progressionRule = '3x4-7 reps a Buffer 1-2';
    }
  }
  // 6. CHRIS ACETO
  else if (methodKey === 'ACETO') {
    isDeload = weekNumber === 6;
    if (isDeload) {
      phaseLabel = 'Deload Volumetrico';
      phaseCategory = 'DELOAD';
      progressionRule = '2 serie fisse, carichi -20%';
    } else if (weekNumber === 5) {
      phaseLabel = 'Stripping Peak';
      phaseCategory = 'PICCO';
      progressionRule = 'Drop set & cedimento muscolare positivo';
    } else if (weekNumber >= 3) {
      phaseLabel = 'Heavy Absolute Overload';
      phaseCategory = 'OVERLOAD';
      progressionRule = 'Sovraccarico (+2.5kg/+5kg) 6-8 reps';
    } else {
      phaseLabel = 'Base Volume Acquisition';
      phaseCategory = 'ACCUMULO';
      progressionRule = 'Buffer 1-2, cadenza concentrica esplosiva';
    }
  }
  // 7. HARDTOPGYM
  else if (methodKey === 'HARDTOPGYM') {
    isDeload = weekNumber === 4;
    if (isDeload) {
      phaseLabel = 'Scarico Attivo SNC';
      phaseCategory = 'DELOAD';
      progressionRule = 'Volume -30%, RIR 3-4 controllato';
    } else if (weekNumber === 3) {
      phaseLabel = 'Urto They & Intensificazione';
      phaseCategory = 'PICCO';
      progressionRule = 'Cedimento concentrico (RIR 0) Bosco-Colli';
    } else if (weekNumber === 2) {
      phaseLabel = 'Micro-Overload';
      phaseCategory = 'OVERLOAD';
      progressionRule = '+5% carico sui fondamentali';
    } else {
      phaseLabel = 'Setup Neurale';
      phaseCategory = 'ACCUMULO';
      progressionRule = 'Controllo tecnico e tensione continua';
    }
  }
  // 8. NOCERINO
  else {
    isDeload = weekNumber === 17;
    if (isDeload) {
      phaseLabel = 'Scarico Connettivale';
      phaseCategory = 'DELOAD';
      progressionRule = 'Taglio volume per recupero tendineo';
    } else {
      phaseLabel = `Microciclo Miotipico ${weekNumber}`;
      phaseCategory = weekNumber % 4 === 0 ? 'OVERLOAD' : 'ACCUMULO';
      progressionRule = 'Tensione continua miotipica Bosco';
    }
  }

  const days: TimelineDay[] = baseDays.map((d, dIdx) => {
    const rawExercises = extractRawExercises(d);
    const dayNumber = d.dayNumber || dIdx + 1;

    const transformedExercises: TimelineExercise[] = rawExercises.map((ex: any, exIdx: number) => {
      const exId = ex.id || `ex_${dIdx}_${exIdx}`;
      const override = weekOverridesForWeek[exId];

      const isLocked = ex.lockProgression || ex.isLocked || override?.isLocked;
      if (isLocked) {
        return {
          id: exId,
          name: ex.name,
          muscle: ex.muscleGroup || ex.targetMuscle || 'Muscolo',
          sets: override?.sets ?? (Number(ex.sets) || 4),
          reps: override?.reps ?? (String(ex.reps || '8-10')),
          weight: override?.weight ?? (ex.weight || ex.targetWeight || ''),
          rpe: override?.rpe ?? (ex.rpe || ex.rpeTarget || ''),
          restSeconds: override?.restSeconds ?? (Number(ex.restSeconds) || 90),
          tut: override?.tut ?? (ex.tut || '2-0-1-0'),
          notes: override?.notes ?? (ex.notes || '🔒 Esercizio Bloccato dal Coach'),
          stimulus: ex.stimulusType || ex.stimulus || 'HYPERTROPHIC',
          isLocked: true,
          isOverridden: !!override
        };
      }

      const computed = computeExerciseForWeek(ex, methodKey, weekNumber, isDeload, dIdx);

      return {
        id: exId,
        name: ex.name,
        muscle: ex.muscleGroup || ex.targetMuscle || 'Muscolo',
        sets: override?.sets !== undefined ? override.sets : computed.sets,
        reps: override?.reps !== undefined ? override.reps : computed.reps,
        weight: override?.weight !== undefined ? override.weight : computed.weight,
        rpe: override?.rpe !== undefined ? override.rpe : computed.rpe,
        restSeconds: override?.restSeconds !== undefined ? override.restSeconds : computed.restSeconds,
        tut: override?.tut !== undefined ? override.tut : computed.tut,
        notes: override?.notes !== undefined ? override.notes : computed.notes,
        stimulus: computed.stimulus,
        isLocked: false,
        isOverridden: !!override
      };
    });

    return {
      id: d.id || `day_${dIdx}`,
      title: d.title || d.name || `Sessione ${String.fromCharCode(65 + dIdx)}`,
      dayNumber,
      exercises: transformedExercises
    };
  });

  return {
    weekNumber,
    phaseLabel,
    phaseCategory,
    phaseType: phaseCategory,
    progressionRule,
    isDeload,
    days
  };
}

function computeExerciseForWeek(
  ex: any,
  methodKey: SupportedMethod,
  weekNumber: number,
  isDeload: boolean,
  dayIndex: number
): { sets: number; reps: string; weight?: string | number; rpe?: string | number; restSeconds: number; tut: string; notes: string; stimulus: string } {
  const lower = (ex.name || '').toLowerCase();
  const rawSets = Number(ex.sets) || 4;
  const rawReps = String(ex.reps || '8-10');
  const baseWeight = ex.weight || ex.targetWeight || '';

  const isNeuralCompound =
    lower.includes('squat') ||
    lower.includes('panca') ||
    lower.includes('bench') ||
    lower.includes('deadlift') ||
    lower.includes('stacco') ||
    lower.includes('military') ||
    lower.includes('overhead') ||
    lower.includes('hip thrust') ||
    lower.includes('pendlay') ||
    ex.stimulusType === 'NEURAL';

  const isMetabolic =
    lower.includes('alzate') ||
    lower.includes('curl') ||
    lower.includes('pushdown') ||
    lower.includes('croci') ||
    lower.includes('cavi') ||
    lower.includes('polpacci') ||
    ex.stimulusType === 'METABOLIC';

  const stimulus = isNeuralCompound ? 'NEURAL' : isMetabolic ? 'METABOLIC' : 'HYPERTROPHIC';

  // 1. TOPGYM CLASSICO
  if (methodKey === 'TOPGYM_CLASSICO' || methodKey === 'TOPGYM_BLOCKS') {
    const weekInBlock = ((weekNumber - 1) % 16) + 1;
    if (weekInBlock <= 6) {
      if (isNeuralCompound) return { sets: 5, reps: '6', weight: baseWeight, rpe: 7.5, restSeconds: 150, tut: '2-0-1-0', notes: 'Accumulo Neurale 5x6 (buffer 2-3 RIR)', stimulus };
      if (isMetabolic) return { sets: 3, reps: '12', weight: baseWeight, rpe: 8, restSeconds: 60, tut: '2-0-2-0', notes: 'Saturazione metabolica 3x12', stimulus };
      return { sets: 4, reps: '8-10', weight: baseWeight, rpe: 8, restSeconds: 90, tut: '2-0-1-0', notes: 'Tensione meccanica ipertrofica 4x8-10', stimulus };
    }
    if (weekInBlock <= 9) {
      if (isNeuralCompound) return { sets: 5, reps: '8', weight: baseWeight, rpe: 8.5, restSeconds: 120, tut: '2-0-1-0', notes: 'Conversione Ipertrofica 5x8 (spinta al limite buffer)', stimulus };
      if (isMetabolic) return { sets: 3, reps: '12-15', weight: baseWeight, rpe: 8.5, restSeconds: 60, tut: '2-0-2-0', notes: 'Isolamento metabolico ad alta densità', stimulus };
      return { sets: 4, reps: '10-12', weight: baseWeight, rpe: 8.5, restSeconds: 90, tut: '2-0-1-0', notes: 'Densità miotipica 4x10-12', stimulus };
    }
    if (weekInBlock === 10) {
      const deloadSets = Math.max(2, Math.round(rawSets * 0.6));
      return {
        sets: deloadSets,
        reps: '6-8',
        weight: typeof baseWeight === 'number' ? Math.round(baseWeight * 0.85) : baseWeight,
        rpe: 6,
        restSeconds: 90,
        tut: '2-0-2-0',
        notes: 'Scarico attivo SNC: volume -40%, buffer ampio',
        stimulus
      };
    }
    if (isNeuralCompound) {
      const peakWeight = typeof baseWeight === 'number' ? Math.round(baseWeight * 1.07) : baseWeight;
      return { sets: 4, reps: '3-4', weight: peakWeight, rpe: 9.5, restSeconds: 180, tut: '2-0-X-0', notes: 'Picco Neurale: +7% carico rispetto ad accumulo, 4x3-4', stimulus };
    }
    return { sets: 3, reps: '6-8', weight: baseWeight, rpe: 9, restSeconds: 120, tut: '2-0-1-0', notes: 'Mantenimento ipertrofico ad alta tensione', stimulus };
  }

  // 2. BIKINI WAVE SYSTEM
  if (methodKey === 'BIKINI_WAVE') {
    if (isDeload) {
      return { sets: 2, reps: isNeuralCompound ? '6' : '10', weight: baseWeight, rpe: 6, restSeconds: 60, tut: '2-0-2-0', notes: 'W10 Deload: 2 serie fisse a buffer controllato', stimulus };
    }
    let wave = 1;
    if (weekNumber >= 4 && weekNumber <= 6) wave = 2;
    else if (weekNumber >= 7 && weekNumber <= 9) wave = 3;
    const intraWaveWeek = ((weekNumber - 1) % 3) + 1;
    if (isNeuralCompound) {
      const waveSets = 2 + intraWaveWeek;
      const waveReps = wave === 1 ? '6' : wave === 2 ? '5' : '4';
      return { sets: waveSets, reps: waveReps, weight: baseWeight, rpe: 7.5 + intraWaveWeek * 0.5, restSeconds: 120, tut: '2-0-1-0', notes: `Onda ${wave} (W${intraWaveWeek}): ${waveSets} serie pesanti`, stimulus };
    }
    const modReps = wave === 1 ? '8-12' : wave === 2 ? '6-10' : '6-8';
    return { sets: 3, reps: modReps, weight: baseWeight, rpe: 8, restSeconds: 75, tut: '2-0-1-0', notes: `Onda ${wave}: Target ${modReps} rep ipertrofiche`, stimulus };
  }

  // Fallback universale motori
  return {
    sets: isDeload ? 2 : rawSets,
    reps: rawReps,
    weight: baseWeight,
    rpe: isDeload ? 6 : 8,
    restSeconds: 90,
    tut: '2-0-1-0',
    notes: isDeload ? 'Scarico rigenerativo' : 'Progressione scientifica',
    stimulus
  };
}
