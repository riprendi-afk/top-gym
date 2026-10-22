// lib/topgym-timeline-generator.ts
/**
 * GENERATORE DETERMINISTICO TIMELINE E PERIODIZZAZIONE TOP GYM
 * Motore scientifico a 8 metodologie per macrocicli di allenamento.
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
  [key: string]: any;
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
  [key: string]: any;
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
    name: 'TopGym Metodo Classico (16 Settimane)',
    defaultWeeks: 16,
    macrocycleSummary: 'W1-6 Accumulo (5x6), W7-10 Conversione (5x8), W11 Deload SNC (-40%), W12-15 Picco Neurale (4x3), W16 Test 1RM.',
    phases: [
      { name: 'Accumulo Volumetrico', weeks: 'W1 - W6', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
      { name: 'Conversione Ipertrofica', weeks: 'W7 - W10', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
      { name: 'Scarico Fisiologico SNC', weeks: 'W11', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
      { name: 'Picco Neurale (4 Settimane)', weeks: 'W12 - W15', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
      { name: 'Tapering & Test Massimali', weeks: 'W16', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' }
    ]
  },
  TOPGYM_BLOCKS: {
    name: 'TopGym Metodo Classico (16 Settimane)',
    defaultWeeks: 16,
    macrocycleSummary: 'W1-6 Accumulo (5x6), W7-10 Conversione (5x8), W11 Deload SNC, W12-15 Picco Neurale, W16 Test 1RM.',
    phases: [
      { name: 'Accumulo Volumetrico', weeks: 'W1 - W6', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
      { name: 'Conversione Ipertrofica', weeks: 'W7 - W10', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
      { name: 'Scarico Fisiologico SNC', weeks: 'W11', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
      { name: 'Picco Neurale (4 Settimane)', weeks: 'W12 - W15', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
      { name: 'Tapering & Test Massimali', weeks: 'W16', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' }
    ]
  },
  BIKINI_WAVE: {
    name: 'Bikini Wave System (10 Settimane)',
    defaultWeeks: 10,
    macrocycleSummary: '3 Onde x 3 settimane (3->4->5 serie fondamentali) + W10 Deload Glicogenico Pre-Gara.',
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
    macrocycleSummary: '12 Settimane Triadi Big 3 + AMRAP 90% (W4, W8, W12) + W13 Supercompensazione.',
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
    macrocycleSummary: 'W1-W3 Wave loading composti & progressione isolamento, W4 Deload attivo RPE 6.',
    phases: [
      { name: 'Wave 1 (Base RPE 7.5)', weeks: 'W1', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
      { name: 'Wave 2 (+2.5kg @ RPE 8)', weeks: 'W2', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
      { name: 'Wave 3 (+5kg @ RPE 8.5-9)', weeks: 'W3', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
      { name: 'Deload Attivo SNC (RPE 6)', weeks: 'W4', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' }
    ]
  },
  BLOOD_VOLUME_OVERLOAD: {
    name: 'Blood Volume Overload (4 Settimane)',
    defaultWeeks: 4,
    macrocycleSummary: 'W1-W2 Buffer 1-2, W3 Cedimento concentrico 1 set/gruppo, W4 Scarico cellulare.',
    phases: [
      { name: 'Saturazione Meccanica', weeks: 'W1 - W2', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
      { name: 'Overload Cedimento Concentrico', weeks: 'W3', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
      { name: 'Scarico Cellulare & Drenaggio', weeks: 'W4', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' }
    ]
  },
  ACETO: {
    name: 'Chris Aceto Hypertrophy Cycle (6 Settimane)',
    defaultWeeks: 6,
    macrocycleSummary: 'W1-2 Base, W3-4 Heavy Overload (+5%), W5 Stripping Peak, W6 Deload (-20% carico, 2 set).',
    phases: [
      { name: 'Base Volume Acquisition', weeks: 'W1 - W2', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
      { name: 'Heavy Absolute Overload', weeks: 'W3 - W4', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
      { name: 'Stripping Peak (Cedimento)', weeks: 'W5', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
      { name: 'Deload Volumetrico', weeks: 'W6', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' }
    ]
  },
  HARDTOPGYM: {
    name: 'HardTopGym Microciclo Emilio They (4 Settimane)',
    defaultWeeks: 4,
    macrocycleSummary: 'W1 Setup Neurale, W2 Micro-Overload (+5%), W3 Urto They (RIR 0), W4 Scarico Ormonale (-40% vol).',
    phases: [
      { name: 'Setup Neurale & Tensione', weeks: 'W1', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
      { name: 'Micro-Overload Progressivo', weeks: 'W2', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
      { name: 'Urto They & Cedimento RIR 0', weeks: 'W3', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
      { name: 'Scarico Ormonale Attivo', weeks: 'W4', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' }
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

function adjustWeight(base: string | number | undefined, multiplier: number, addKg: number = 0): string | number {
  if (base === undefined || base === '' || base === null) return '';
  const num = typeof base === 'number' ? base : parseFloat(String(base));
  if (isNaN(num)) return base;
  return Math.round((num * multiplier + addKg) * 2) / 2;
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
    } else if (weekInBlock <= 10) {
      phaseLabel = 'Conversione Ipertrofica';
      phaseCategory = 'CONVERSIONE';
      progressionRule = '5×8 @ RPE 8.5 (Spinta)';
    } else if (weekInBlock === 11) {
      phaseLabel = 'Scarico Fisiologico SNC';
      phaseCategory = 'DELOAD';
      progressionRule = 'Volume -40% | Carico -15%';
      isDeload = true;
    } else if (weekInBlock <= 15) {
      phaseLabel = 'Picco Neurale (4 Settimane)';
      phaseCategory = 'PICCO';
      progressionRule = '4×3-4 (+7% carico @ RPE 9-9.5)';
    } else {
      phaseLabel = 'Tapering & Test Massimali';
      phaseCategory = 'OVERLOAD';
      progressionRule = 'Test 1RM / Supercompensazione';
    }
  }
  // 2. BIKINI WAVE SYSTEM
  else if (methodKey === 'BIKINI_WAVE') {
    isDeload = weekNumber === 10;
    if (isDeload) {
      phaseLabel = 'Deload Glicogenico Pre-Gara';
      phaseCategory = 'DELOAD';
      progressionRule = '2 serie pump a buffer controllato';
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
    } else if (weekNumber === 4 || weekNumber === 8 || weekNumber === 12) {
      phaseLabel = `Realizzazione Triade W${weekNumber}`;
      phaseCategory = 'OVERLOAD';
      progressionRule = 'Power Day Big 3 + AMRAP Test';
    } else {
      phaseLabel = `Mesociclo Triadico W${weekNumber}`;
      phaseCategory = 'ACCUMULO';
      progressionRule = 'Big 3 Carichi alti + rotazione Day 5';
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
    } else if (wave === 3) {
      phaseLabel = 'Wave 3 (Picco Intensità)';
      phaseCategory = 'PICCO';
      progressionRule = '4x4 (+5kg composti) @ RPE 8.5-9';
    } else if (wave === 2) {
      phaseLabel = 'Wave 2 (Progressione)';
      phaseCategory = 'OVERLOAD';
      progressionRule = '4x5 (+2.5kg composti) @ RPE 8';
    } else {
      phaseLabel = 'Wave 1 (Base)';
      phaseCategory = 'ACCUMULO';
      progressionRule = '4x6 composti base @ RPE 7.5';
    }
  }
  // 5. BLOOD VOLUME OVERLOAD
  else if (methodKey === 'BLOOD_VOLUME_OVERLOAD') {
    const wave = ((weekNumber - 1) % 4) + 1;
    isDeload = wave === 4;
    if (isDeload) {
      phaseLabel = 'Scarico Cellulare & Drenaggio';
      phaseCategory = 'DELOAD';
      progressionRule = '2 serie fondo scala per drenaggio';
    } else if (wave === 3) {
      phaseLabel = 'Overload Cedimento';
      phaseCategory = 'OVERLOAD';
      progressionRule = 'Cedimento concentrico 1 serie/muscolo';
    } else {
      phaseLabel = 'Saturazione Meccanica';
      phaseCategory = 'ACCUMULO';
      progressionRule = '3-4x6-10 reps a Buffer 1-2';
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
      progressionRule = 'Sovraccarico (+5% carico) 6-8 reps';
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
      phaseLabel = 'Scarico Ormonale Attivo';
      phaseCategory = 'DELOAD';
      progressionRule = 'Volume -40%, carichi al 65%, RIR 3-4';
    } else if (weekNumber === 3) {
      phaseLabel = 'Urto They & Intensificazione';
      phaseCategory = 'PICCO';
      progressionRule = 'Cedimento concentrico (RIR 0) Bosco-Colli';
    } else if (weekNumber === 2) {
      phaseLabel = 'Micro-Overload';
      phaseCategory = 'OVERLOAD';
      progressionRule = '+5% carico sui fondamentali';
    } else {
      phaseLabel = 'Setup Neurale & Tensione';
      phaseCategory = 'ACCUMULO';
      progressionRule = 'Controllo cadenza 3-0-1-0 e tensione continua';
    }
  }
  // 8. NOCERINO
  else {
    isDeload = weekNumber === 17;
    if (isDeload) {
      phaseLabel = 'Scarico Rigenerativo';
      phaseCategory = 'DELOAD';
      progressionRule = 'Taglio volume per recupero tendineo';
    } else if (weekNumber >= 11) {
      phaseLabel = `Fase III: Tensione Continua Max (W${weekNumber})`;
      phaseCategory = 'PICCO';
      progressionRule = 'Carichi crescenti 6-8 reps @ RPE 9';
    } else if (weekNumber >= 5) {
      phaseLabel = `Fase II: Densità Fibre Miste (W${weekNumber})`;
      phaseCategory = 'OVERLOAD';
      progressionRule = 'Densità 8-10 reps & isometria intermedia';
    } else {
      phaseLabel = `Fase I: Adattamento Connettivale (W${weekNumber})`;
      phaseCategory = 'ACCUMULO';
      progressionRule = 'TUT continuo 3-0-2-0, 10-12 reps lente';
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
    if (weekInBlock <= 10) {
      if (isNeuralCompound) return { sets: 5, reps: '8', weight: baseWeight, rpe: 8.5, restSeconds: 120, tut: '2-0-1-0', notes: 'Conversione Ipertrofica 5x8 (spinta al limite buffer)', stimulus };
      if (isMetabolic) return { sets: 3, reps: '12-15', weight: baseWeight, rpe: 8.5, restSeconds: 60, tut: '2-0-2-0', notes: 'Isolamento metabolico ad alta densità', stimulus };
      return { sets: 4, reps: '10-12', weight: baseWeight, rpe: 8.5, restSeconds: 90, tut: '2-0-1-0', notes: 'Densità miotipica 4x10-12', stimulus };
    }
    if (weekInBlock === 11) {
      const deloadSets = Math.max(2, Math.round(rawSets * 0.6));
      return {
        sets: deloadSets,
        reps: '6-8',
        weight: adjustWeight(baseWeight, 0.85),
        rpe: 6,
        restSeconds: 90,
        tut: '2-0-2-0',
        notes: 'Scarico attivo SNC: volume -40%, buffer ampio',
        stimulus
      };
    }
    if (weekInBlock <= 15) {
      if (isNeuralCompound) {
        return { sets: 4, reps: '3-4', weight: adjustWeight(baseWeight, 1.07), rpe: 9.5, restSeconds: 180, tut: '2-0-X-0', notes: 'Picco Neurale: +7% carico rispetto ad accumulo, 4x3-4', stimulus };
      }
      return { sets: 3, reps: '6-8', weight: baseWeight, rpe: 9, restSeconds: 120, tut: '2-0-1-0', notes: 'Mantenimento ipertrofico ad alta tensione', stimulus };
    }
    // W16: Test Massimali
    if (isNeuralCompound) {
      return { sets: 3, reps: '2-1', weight: adjustWeight(baseWeight, 1.10), rpe: 10, restSeconds: 240, tut: '1-0-X-0', notes: 'Test 1RM: Supercompensazione massimale', stimulus };
    }
    return { sets: 2, reps: '8', weight: baseWeight, rpe: 7, restSeconds: 90, tut: '2-0-1-0', notes: 'Attivazione muscolare a volume ridotto', stimulus };
  }

  // 2. BIKINI WAVE SYSTEM
  if (methodKey === 'BIKINI_WAVE') {
    if (isDeload) {
      return { sets: 2, reps: isNeuralCompound ? '6' : '10', weight: baseWeight, rpe: 6, restSeconds: 60, tut: '2-0-2-0', notes: 'W10 Deload: 2 serie fisse pump pre-gara', stimulus };
    }
    let wave = 1;
    if (weekNumber >= 4 && weekNumber <= 6) wave = 2;
    else if (weekNumber >= 7 && weekNumber <= 9) wave = 3;
    const intraWaveWeek = ((weekNumber - 1) % 3) + 1;
    if (isNeuralCompound) {
      const waveSets = 2 + intraWaveWeek;
      const waveReps = wave === 1 ? '6' : wave === 2 ? '5' : '4';
      return { sets: waveSets, reps: waveReps, weight: baseWeight, rpe: 7.5 + intraWaveWeek * 0.5, restSeconds: 120, tut: '2-0-1-0', notes: `Onda ${wave} (W${intraWaveWeek}/3): ${waveSets} serie pesanti`, stimulus };
    }
    const modReps = wave === 1 ? '8-12' : wave === 2 ? '6-10' : '6-8';
    return { sets: 3, reps: modReps, weight: baseWeight, rpe: 8, restSeconds: 75, tut: '2-0-1-0', notes: `Onda ${wave}: complementare a target ${modReps} reps`, stimulus };
  }

  // 3. POWERBLOCK HYBRID
  if (methodKey === 'POWERBLOCK_HYBRID') {
    if (isDeload) {
      return { sets: 2, reps: '5', weight: adjustWeight(baseWeight, 0.60), rpe: 6, restSeconds: 90, tut: '2-0-1-0', notes: 'Supercompensazione SNC al 60%', stimulus };
    }
    if (weekNumber === 4 || weekNumber === 8 || weekNumber === 12) {
      const amrapReps = weekNumber === 4 ? 'AMRAP (3+)' : weekNumber === 8 ? 'AMRAP (2+)' : '1RM Test';
      return { sets: 4, reps: amrapReps, weight: adjustWeight(baseWeight, 1.05), rpe: 9.5, restSeconds: 180, tut: '2-0-X-0', notes: `Test Realizzazione W${weekNumber}`, stimulus };
    }
    if (isNeuralCompound) {
      const mult = weekNumber >= 9 ? 1.08 : weekNumber >= 5 ? 1.04 : 1.0;
      const r = weekNumber >= 9 ? '2-3' : weekNumber >= 5 ? '4' : '5';
      return { sets: 4, reps: r, weight: adjustWeight(baseWeight, mult), rpe: 8.5, restSeconds: 150, tut: '2-0-1-0', notes: `Triade W${weekNumber}: Big 3 ad alta intensità`, stimulus };
    }
    return { sets: 3, reps: '8-10', weight: baseWeight, rpe: 8, restSeconds: 90, tut: '2-0-1-0', notes: 'Ipertrofia complementare', stimulus };
  }

  // 4. HELMS PYRAMID
  if (methodKey === 'HELMS_PYRAMID') {
    const wave = ((weekNumber - 1) % 4) + 1;
    if (isDeload) {
      return { sets: 2, reps: '6', weight: adjustWeight(baseWeight, 0.90), rpe: 6, restSeconds: 90, tut: '2-0-1-0', notes: 'Deload Helms attivo: 2 set RPE 6', stimulus };
    }
    if (isNeuralCompound) {
      const repsTarget = wave === 1 ? '6' : wave === 2 ? '5' : '4';
      const addedKg = wave === 1 ? 0 : wave === 2 ? 2.5 : 5;
      const rpeTarget = wave === 1 ? 7.5 : wave === 2 ? 8 : 9;
      return { sets: 4, reps: repsTarget, weight: adjustWeight(baseWeight, 1.0, addedKg), rpe: rpeTarget, restSeconds: 150, tut: '2-0-1-0', notes: `Wave ${wave}: ${repsTarget} reps @ RPE ${rpeTarget}`, stimulus };
    }
    return { sets: 3, reps: '10-12', weight: baseWeight, rpe: 7.5 + wave * 0.5, restSeconds: 90, tut: '2-0-1-0', notes: `Wave ${wave}: progressione volume isolamento`, stimulus };
  }

  // 5. BLOOD VOLUME OVERLOAD
  if (methodKey === 'BLOOD_VOLUME_OVERLOAD') {
    const wave = ((weekNumber - 1) % 4) + 1;
    if (isDeload) {
      return { sets: 2, reps: '12-15', weight: adjustWeight(baseWeight, 0.75), rpe: 6, restSeconds: 60, tut: '2-0-2-0', notes: 'Scarico cellulare e drenaggio', stimulus };
    }
    if (wave === 3) {
      return { sets: 4, reps: '6-8', weight: adjustWeight(baseWeight, 1.03), rpe: 10, restSeconds: 90, tut: '2-0-1-0', notes: 'Overload cedimento concentrico (RIR 0)', stimulus };
    }
    return { sets: 4, reps: '6-10', weight: baseWeight, rpe: 8, restSeconds: 75, tut: '2-0-1-0', notes: 'Saturazione meccanica, buffer 1-2', stimulus };
  }

  // 6. CHRIS ACETO
  if (methodKey === 'ACETO') {
    if (isDeload) {
      return { sets: 2, reps: '8-10', weight: adjustWeight(baseWeight, 0.80), rpe: 6, restSeconds: 60, tut: '2-0-2-0', notes: 'Deload volumetrico Aceto: 2 set -20% carico', stimulus };
    }
    if (weekNumber === 5) {
      return { sets: 3, reps: isNeuralCompound ? '6 + drop' : '8 + stripping', weight: baseWeight, rpe: 10, restSeconds: 90, tut: '2-0-1-0', notes: 'Stripping Peak: cedimento concentrico e scalata', stimulus };
    }
    if (weekNumber >= 3) {
      return { sets: 4, reps: isNeuralCompound ? '6-8' : '8-10', weight: adjustWeight(baseWeight, 1.05), rpe: 9, restSeconds: 120, tut: '2-0-1-0', notes: 'Heavy Absolute Overload (+5% carico)', stimulus };
    }
    return { sets: 4, reps: '8-10', weight: baseWeight, rpe: 8, restSeconds: 90, tut: '2-0-1-0', notes: 'Base Volume: cadenza esplosiva concentrica', stimulus };
  }

  // 7. HARDTOPGYM
  if (methodKey === 'HARDTOPGYM') {
    if (isDeload) {
      const deloadSets = Math.max(2, Math.round(rawSets * 0.6));
      return { sets: deloadSets, reps: '8', weight: adjustWeight(baseWeight, 0.70), rpe: 6, restSeconds: 90, tut: '2-0-2-0', notes: 'Scarico attivo ormonale Emilio They', stimulus };
    }
    if (weekNumber === 3) {
      return { sets: 4, reps: '6', weight: adjustWeight(baseWeight, 1.05), rpe: 10, restSeconds: 150, tut: '3-0-1-0', notes: 'Urto They: cedimento assoluto (RIR 0) Bosco-Colli', stimulus };
    }
    if (weekNumber === 2) {
      return { sets: 4, reps: '6', weight: adjustWeight(baseWeight, 1.05), rpe: 8.5, restSeconds: 120, tut: '3-0-1-0', notes: 'Micro-Overload They: +5% carichi fondamentali', stimulus };
    }
    return { sets: 4, reps: '6-8', weight: baseWeight, rpe: 7.5, restSeconds: 120, tut: '3-0-1-0', notes: 'Setup neurale They & controllo tensione continua', stimulus };
  }

  // 8. NOCERINO
  if (isDeload) {
    return { sets: 2, reps: '10', weight: adjustWeight(baseWeight, 0.75), rpe: 6, restSeconds: 90, tut: '2-0-2-0', notes: 'Scarico connettivale e rigenerativo', stimulus };
  }
  if (weekNumber >= 11) {
    return { sets: 4, reps: '6-8', weight: adjustWeight(baseWeight, 1.06), rpe: 9, restSeconds: 90, tut: '2-0-2-0', notes: 'Fase III: Tensione continua max senza punti morti', stimulus };
  }
  if (weekNumber >= 5) {
    return { sets: 4, reps: '8-10', weight: adjustWeight(baseWeight, 1.03), rpe: 8.5, restSeconds: 75, tut: '2-1-2-0', notes: 'Fase II: Densità fibre miste & isometria', stimulus };
  }
  return { sets: 4, reps: '10-12', weight: baseWeight, rpe: 7.5, restSeconds: 90, tut: '3-0-2-0', notes: 'Fase I: Adattamento tendineo & TUT continuo lento', stimulus };
}

/**
 * Risolve la sessione attiva dell'atleta per la settimana corrente (Single Source of Truth).
 * Preserva tutti i metadati originali dell'esercizio applicando la progressione scientifica o gli override del Coach.
 */
export function getActiveSessionForAthlete(
  activeDay: any,
  dayIndex: number,
  currentWeek: number,
  programmingModel?: string,
  weekOverrides?: Record<number, Record<string, ExerciseWeekOverride>>
): any {
  if (!activeDay) return null;
  const methodKey = resolveEngineKey(programmingModel || activeDay.method || activeDay.programmingModel);
  const weekNum = Math.max(1, currentWeek || 1);

  const overridesMap =
    weekOverrides?.[weekNum] ||
    (activeDay.weekOverrides?.[weekNum]) ||
    {};

  const projectedWeek = projectSingleWeek([activeDay], methodKey, weekNum, overridesMap);
  const projectedDay = projectedWeek.days[0] || activeDay;

  return {
    ...activeDay,
    ...projectedDay,
    isDeload: projectedWeek.isDeload,
    phaseLabel: projectedWeek.phaseLabel,
    phaseCategory: projectedWeek.phaseCategory,
    progressionRule: projectedWeek.progressionRule,
  };
}
