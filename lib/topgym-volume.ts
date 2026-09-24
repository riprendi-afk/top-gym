// lib/topgym-volume.ts
// MOTORE ANALISI VOLUME SETTIMANALE & METRICHE · METODO TOP GYM

import { AthleteGender } from './topgym-templates';

export type MuscleTarget = 
  | 'Petto' 
  | 'Dorso' 
  | 'Spalle' 
  | 'Quadricipiti' 
  | 'Femorali' 
  | 'Glutei' 
  | 'Bicipiti' 
  | 'Tricipiti' 
  | 'Polpacci' 
  | 'Addome';

export type MuscleGroup = MuscleTarget;

export const ALL_MUSCLE_TARGETS: MuscleTarget[] = [
  'Petto', 'Dorso', 'Spalle', 'Quadricipiti', 'Femorali', 
  'Glutei', 'Bicipiti', 'Tricipiti', 'Polpacci', 'Addome'
];

export interface MuscleVolumeStatus {
  muscle: MuscleTarget;
  directSets: number;
  totalSets: number;
  mev: number;
  mav: number;
  mrv: number;
  status: 'SUB_MEV' | 'OPTIMAL' | 'OVERREACHING' | 'EXCESSIVE';
  statusLabel: string;
  colorClass: string;
  percentage: number;
}

const VOLUME_THRESHOLDS: Record<AthleteGender, Record<MuscleTarget, { mev: number; mav: number; mrv: number }>> = {
  MALE: {
    Petto:        { mev: 10, mav: 16, mrv: 22 },
    Dorso:        { mev: 10, mav: 18, mrv: 25 },
    Spalle:       { mev: 8,  mav: 16, mrv: 22 },
    Quadricipiti: { mev: 8,  mav: 14, mrv: 20 },
    Femorali:     { mev: 6,  mav: 12, mrv: 18 },
    Glutei:       { mev: 4,  mav: 10, mrv: 16 },
    Bicipiti:     { mev: 6,  mav: 12, mrv: 18 },
    Tricipiti:    { mev: 6,  mav: 12, mrv: 18 },
    Polpacci:     { mev: 8,  mav: 14, mrv: 20 },
    Addome:       { mev: 0,  mav: 8,  mrv: 16 },
  },
  FEMALE: {
    Petto:        { mev: 4,  mav: 8,  mrv: 12 },
    Dorso:        { mev: 8,  mav: 14, mrv: 20 },
    Spalle:       { mev: 8,  mav: 16, mrv: 22 },
    Quadricipiti: { mev: 8,  mav: 14, mrv: 18 },
    Femorali:     { mev: 8,  mav: 14, mrv: 20 },
    Glutei:       { mev: 10, mav: 18, mrv: 26 },
    Bicipiti:     { mev: 4,  mav: 8,  mrv: 14 },
    Tricipiti:    { mev: 4,  mav: 10, mrv: 16 },
    Polpacci:     { mev: 6,  mav: 12, mrv: 16 },
    Addome:       { mev: 0,  mav: 8,  mrv: 14 },
  }
};

/**
 * Risoluzione automatica del gruppo muscolare:
 * 1. Usa il gruppo esplicitamente dichiarato se valido
 * 2. Cerca nel dizionario degli esercizi della scheda
 * 3. Applica pattern matching con priorità anatomiche corrette
 * 4. Ritorna null se non riconosciuto (nessun falso fallback su Petto)
 */
export function resolveMuscleTarget(
  exerciseName?: string, 
  declaredGroup?: string,
  programDictionary?: Map<string, MuscleTarget>
): MuscleTarget | null {
  if (declaredGroup && ALL_MUSCLE_TARGETS.includes(declaredGroup as MuscleTarget)) {
    return declaredGroup as MuscleTarget;
  }

  const name = (exerciseName || '').toLowerCase().trim();
  if (!name) return null;

  if (programDictionary && programDictionary.has(name)) {
    return programDictionary.get(name)!;
  }

  // 1. FEMORALI (prima di Dorso e Bicipiti per anticipare 'stacco' e 'curl')
  if (
    name.includes('stacco rumeno') || name.includes('rdl') || name.includes('leg curl') ||
    name.includes('femoral') || name.includes('hamstring') || name.includes('lying curl') ||
    name.includes('seated curl') || name.includes('good morning') || name.includes('gambe tese') ||
    name.includes('nordic') || name.includes('ghr')
  ) return 'Femorali';

  // 2. GLUTEI (prima di Quadricipiti e Petto per isolare Kickback, Hip Thrust, Bulgari)
  if (
    name.includes('hip thrust') || name.includes('glute') || name.includes('kickback') ||
    name.includes('kick back') || name.includes('slanci') || name.includes('abductor') ||
    name.includes('abduzion') || name.includes('bridge') || name.includes('ponte') ||
    name.includes('frog pump') || name.includes('clamshell') || name.includes('step up') ||
    name.includes('step-up') || name.includes('bulgar') || name.includes('hyperextension') ||
    name.includes('iperestension') || name.includes('reverse hyper')
  ) return 'Glutei';

  // 3. DORSO (include Pull up, Chin up, T-Bar, Lat, Stacchi da terra)
  if (
    name.includes('pull up') || name.includes('pull-up') || name.includes('pullup') ||
    name.includes('chin up') || name.includes('chin-up') || name.includes('chinup') ||
    name.includes('trazioni') || name.includes('lat machine') || name.includes('lat ') ||
    name.includes('rematore') || name.includes('pulley') || name.includes('row') ||
    name.includes('pulldown') || name.includes('pull down') || name.includes('t-bar') ||
    name.includes('tbar') || name.includes('stacco da terra') || name.includes('deadlift')
  ) return 'Dorso';

  // 4. QUADRICIPITI
  if (
    name.includes('squat') || name.includes('leg press') || name.includes('pressa') ||
    name.includes('leg ext') || name.includes('affondi') || name.includes('lunge') ||
    name.includes('hack') || name.includes('quadricipit')
  ) return 'Quadricipiti';

  // 5. SPALLE
  if (
    name.includes('face pull') || name.includes('face-pull') || name.includes('facepull') ||
    name.includes('military') || name.includes('shoulder') || name.includes('lento') ||
    name.includes('alzate') || name.includes('deltoid') || name.includes('arnold') ||
    name.includes('press spalle') || name.includes('shrug')
  ) return 'Spalle';

  // 6. PETTO
  if (
    name.includes('panca') || name.includes('chest') || name.includes('croci') ||
    name.includes('dip') || name.includes('push up') || name.includes('push-up') ||
    name.includes('piegament') || name.includes('pectoral') || name.includes('spinte') ||
    name.includes('fly')
  ) return 'Petto';

  // 7. TRICIPITI
  if (
    name.includes('pushdown') || name.includes('french') || name.includes('tricipit') ||
    name.includes('triceps') || name.includes('skull crusher')
  ) return 'Tricipiti';

  // 8. BICIPITI
  if (
    name.includes('curl') || name.includes('bicipit') || name.includes('biceps') ||
    name.includes('hammer') || name.includes('scott')
  ) return 'Bicipiti';

  // 9. POLPACCI
  if (name.includes('polpacc') || name.includes('calf') || name.includes('calves')) return 'Polpacci';

  // 10. ADDOME
  if (
    name.includes('crunch') || name.includes('plank') || name.includes('addom') ||
    name.includes('core') || name.includes('leg raise') || name.includes('sit up')
  ) return 'Addome';

  return null;
}

export function parseLocalDate(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const d = new Date(value);
  if (!isNaN(d.getTime())) return d;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return null;
}

export function getWeekDateRange(dateString?: string) {
  const targetDate = parseLocalDate(dateString) || new Date();
  const dayOfWeek = targetDate.getDay();
  const diffToMonday = targetDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const startW = new Date(targetDate);
  startW.setDate(diffToMonday);
  startW.setHours(0, 0, 0, 0);

  const endW = new Date(startW);
  endW.setDate(startW.getDate() + 6);
  endW.setHours(23, 59, 59, 999);

  const startM = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
  const endM = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);

  return { startOfWeek: startW, endOfWeek: endW, startOfMonth: startM, endOfMonth: endM };
}

export function calculateLoggedWeeklySets(
  logs: any[],
  workoutHistory: any[],
  programDays: any[],
  analyticsDate?: string
): Record<MuscleTarget, number> {
  const map: Record<MuscleTarget, number> = {
    Petto: 0, Dorso: 0, Spalle: 0, Quadricipiti: 0,
    Femorali: 0, Glutei: 0, Bicipiti: 0, Tricipiti: 0,
    Polpacci: 0, Addome: 0
  };

  const programDict = new Map<string, MuscleTarget>();
  (programDays || []).forEach(day => {
    (day.exercises || []).forEach((ex: any) => {
      if (ex.name && ex.muscleGroup) {
        programDict.set(ex.name.toLowerCase().trim(), ex.muscleGroup as MuscleTarget);
      }
    });
  });

  const { startOfWeek, endOfWeek } = getWeekDateRange(analyticsDate);
  const startMs = startOfWeek.getTime();
  const endMs = endOfWeek.getTime();
  const countedSetIds = new Set<string>();

  (logs || []).forEach(l => {
    const d = parseLocalDate(l.date);
    if (d && d.getTime() >= startMs && d.getTime() <= endMs) {
      countedSetIds.add(l.id);
      const target = resolveMuscleTarget(l.exerciseName, l.muscleGroup, programDict);
      if (target) map[target] += 1;
    }
  });

  (workoutHistory || []).forEach(w => {
    const wDate = parseLocalDate(w.created_at || w.date);
    if (wDate && wDate.getTime() >= startMs && wDate.getTime() <= endMs && Array.isArray(w.logs)) {
      w.logs.forEach((log: any, index: number) => {
        const uniqueKey = log.id || `${w.id || w._id}-${log.exerciseName}-${index}`;
        if (!countedSetIds.has(uniqueKey)) {
          countedSetIds.add(uniqueKey);
          const target = resolveMuscleTarget(log.exerciseName, log.muscleGroup, programDict);
          if (target) map[target] += 1;
        }
      });
    }
  });

  return map;
}

export function calculatePlannedWeeklySets(
  days: any[],
  programDict?: Map<string, MuscleTarget>
): Record<MuscleTarget, number> {
  const map: Record<MuscleTarget, number> = {
    Petto: 0, Dorso: 0, Spalle: 0, Quadricipiti: 0,
    Femorali: 0, Glutei: 0, Bicipiti: 0, Tricipiti: 0,
    Polpacci: 0, Addome: 0
  };

  (days || []).forEach(day => {
    (day.exercises || []).forEach((ex: any) => {
      const setsCount = Number(ex.sets) || 0;
      if (setsCount <= 0) return;
      const target = resolveMuscleTarget(ex.name, ex.muscleGroup, programDict);
      if (target) map[target] += setsCount;
    });
  });

  return map;
}

export function buildMuscleVolumeStatuses(
  setsMap: Record<MuscleTarget, number>,
  gender: AthleteGender = 'MALE'
): MuscleVolumeStatus[] {
  return ALL_MUSCLE_TARGETS.map(muscle => {
    const total = setsMap[muscle] || 0;
    const { mev, mav, mrv } = VOLUME_THRESHOLDS[gender][muscle];

    let status: MuscleVolumeStatus['status'] = 'OPTIMAL';
    let statusLabel = 'Finestra Ottimale (MAV)';
    let colorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

    if (total < mev) {
      status = 'SUB_MEV';
      statusLabel = 'Sotto MEV (Minimo Stimolo)';
      colorClass = 'text-zinc-400 bg-zinc-800 border-zinc-700';
    } else if (total > mrv) {
      status = 'EXCESSIVE';
      statusLabel = 'Sopra MRV (Rischio Sovrallenamento)';
      colorClass = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    } else if (total > mav) {
      status = 'OVERREACHING';
      statusLabel = 'Overreaching Controllato';
      colorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }

    const percentage = Math.min(100, Math.round((total / mrv) * 100));

    return {
      muscle,
      directSets: total,
      totalSets: total,
      mev,
      mav,
      mrv,
      status,
      statusLabel,
      colorClass,
      percentage
    };
  });
}

// --- FUNZIONI DI COMPATIBILITÀ CON ALTRI COMPONENTI ESISTENTI ---
export function calculateWeeklyVolumeRadar(
  days: any[],
  gender: AthleteGender = 'MALE',
  _includeIndirect: boolean = false
): MuscleVolumeStatus[] {
  const plannedMap = calculatePlannedWeeklySets(days);
  return buildMuscleVolumeStatuses(plannedMap, gender);
}

export function calculateFromMuscleMap(
  muscleMap: Record<string, number> = {},
  gender: AthleteGender = 'MALE'
): MuscleVolumeStatus[] {
  return buildMuscleVolumeStatuses(muscleMap as any, gender);
}