
export type MultiTargetMap = Partial<Record<MuscleTarget, number>>;

export function resolveMultiTargetDistribution(exerciseName?: string, declaredGroup?: string): MultiTargetMap {
  const name = (exerciseName || "").toLowerCase().trim();
  const group = (declaredGroup || "").toLowerCase().trim();

  // Spinte 70° / Lento Avanti / Military / Spinte Spalle
  if (name.includes("70") || name.includes("lento") || name.includes("military") || name.includes("shoulder") || name.includes("spinte spalle")) {
    return {
      "Deltoidi Anteriori": 1.0,
      "Deltoidi Laterali": 0.5,
      "Deltoidi Posteriori": 0.3,
      "Upper Back": 0.3,
      "Tricipiti": 0.4
    };
  }

  // Stacco da Terra / Deadlift / Rack Pull
  if (name.includes("stacco da terra") || name.includes("deadlift") || name.includes("rack pull")) {
    return {
      "Glutei": 0.8,
      "Femorali": 0.8,
      "Upper Back": 0.6,
      "Gran Dorsale": 0.4,
      "Quadricipiti": 0.3,
      "Addome": 0.4
    };
  }

  // Stacco Rumeno / Gambe Semitese
  if (name.includes("rumeno") || name.includes("semitese") || name.includes("rdl")) {
    return {
      "Femorali": 1.0,
      "Glutei": 0.8,
      "Upper Back": 0.3
    };
  }

  // Dip alle Parallele
  if (name.includes("dip")) {
    return {
      "Petto": 0.7,
      "Tricipiti": 0.8,
      "Deltoidi Anteriori": 0.4
    };
  }

  // Panca Inclinata / Spinte 30°
  if ((name.includes("panca") || name.includes("spinte") || name.includes("chest")) && (name.includes("inclinat") || name.includes("30"))) {
    return {
      "Petto": 1.0,
      "Deltoidi Anteriori": 0.6,
      "Tricipiti": 0.4
    };
  }

  // Panca Piana / Spinte Orizzontali / Chest Press
  if (name.includes("panca piana") || (name.includes("spinte") && !name.includes("70")) || (name.includes("chest press") && !name.includes("inclinat"))) {
    return {
      "Petto": 1.0,
      "Deltoidi Anteriori": 0.5,
      "Tricipiti": 0.4
    };
  }

  // Squat / Box Squat / Leg Press / Hack Squat
  if (name.includes("squat") || name.includes("pressa") || name.includes("leg press")) {
    return {
      "Quadricipiti": 1.0,
      "Glutei": 0.6,
      "Adduttori": 0.4,
      "Addome": 0.3
    };
  }

  // Hip Thrust / Macchine Glutei
  if (name.includes("hip thrust") || name.includes("glute") || name.includes("ponte")) {
    return {
      "Glutei": 1.0,
      "Femorali": 0.3
    };
  }

  // Rematori / Pulley / Row
  if (name.includes("rematore") || name.includes("row") || name.includes("pulley")) {
    return {
      "Upper Back": 1.0,
      "Gran Dorsale": 0.7,
      "Deltoidi Posteriori": 0.5,
      "Bicipiti": 0.4
    };
  }

  // Trazioni / Lat Machine
  if (name.includes("trazioni") || name.includes("lat machine") || name.includes("lat pulldown")) {
    return {
      "Gran Dorsale": 1.0,
      "Upper Back": 0.5,
      "Deltoidi Posteriori": 0.3,
      "Bicipiti": 0.4
    };
  }

  // Isolamenti specifici
  if (name.includes("french") || name.includes("pushdown") || name.includes("tricipit") || group.includes("tricipiti")) return { "Tricipiti": 1.0 };
  if (name.includes("curl") || group.includes("bicipiti")) return { "Bicipiti": 1.0 };
  if (name.includes("alzate lateral") || name.includes("cavo lateral")) return { "Deltoidi Laterali": 1.0 };
  if (name.includes("face pull") || name.includes("alzate 90") || name.includes("deltoidi post")) return { "Deltoidi Posteriori": 0.8, "Upper Back": 0.5 };
  if (name.includes("leg extension")) return { "Quadricipiti": 1.0 };
  if (name.includes("leg curl")) return { "Femorali": 1.0 };
  if (name.includes("adductor")) return { "Adduttori": 1.0 };
  if (name.includes("calf") || name.includes("polpacc")) return { "Polpacci": 1.0 };
  if (name.includes("crunch") || name.includes("plank") || name.includes("addom")) return { "Addome": 1.0 };
  if (name.includes("croci") || name.includes("pectoral")) return { "Petto": 1.0 };

  const single = resolveMuscleTarget(exerciseName, declaredGroup);
  return single ? { [single]: 1.0 } : {};
}

﻿// MOTORE ANALISI VOLUME SETTIMANALE & METRICHE · METODO TOP GYM
// TASSONOMIA ANATOMICA COMPLETA A 14 DISTRETTI FUNZIONALI

import { AthleteGender } from './topgym-templates';

export type MuscleTarget =
  | 'Petto'
  | 'Deltoidi Anteriori'
  | 'Deltoidi Laterali'
  | 'Deltoidi Posteriori'
  | 'Gran Dorsale'
  | 'Upper Back'
  | 'Bicipiti'
  | 'Tricipiti'
  | 'Quadricipiti'
  | 'Femorali'
  | 'Adduttori'
  | 'Glutei'
  | 'Polpacci'
  | 'Addome';

// Retrocompatibilità per vecchi template ed engine
export type LegacyMuscleGroup = 'Dorso' | 'Spalle' | 'Braccia';
export type MuscleGroup = MuscleTarget | LegacyMuscleGroup;

export const ALL_MUSCLE_TARGETS: MuscleTarget[] = [
  'Petto',
  'Deltoidi Anteriori',
  'Deltoidi Laterali',
  'Deltoidi Posteriori',
  'Gran Dorsale',
  'Upper Back',
  'Bicipiti',
  'Tricipiti',
  'Quadricipiti',
  'Femorali',
  'Adduttori',
  'Glutei',
  'Polpacci',
  'Addome'
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

export const VOLUME_THRESHOLDS: Record<AthleteGender, Record<MuscleTarget, { mev: number; mav: number; mrv: number }>> = {
  MALE: {
    Petto:               { mev: 10, mav: 16, mrv: 22 },
    'Deltoidi Anteriori': { mev: 0,  mav: 6,  mrv: 12 }, // Sollecitati da tutte le distensioni
    'Deltoidi Laterali':  { mev: 8,  mav: 16, mrv: 24 }, // Elevata tolleranza al volume
    'Deltoidi Posteriori':{ mev: 6,  mav: 14, mrv: 20 },
    'Gran Dorsale':       { mev: 8,  mav: 14, mrv: 20 },
    'Upper Back':         { mev: 8,  mav: 14, mrv: 22 },
    Bicipiti:            { mev: 6,  mav: 12, mrv: 18 },
    Tricipiti:           { mev: 4,  mav: 10, mrv: 16 },
    Quadricipiti:        { mev: 8,  mav: 14, mrv: 20 },
    Femorali:            { mev: 6,  mav: 12, mrv: 18 },
    Adduttori:           { mev: 4,  mav: 10, mrv: 16 },
    Glutei:              { mev: 4,  mav: 10, mrv: 16 },
    Polpacci:            { mev: 8,  mav: 14, mrv: 20 },
    Addome:              { mev: 0,  mav: 8,  mrv: 16 },
  },
  FEMALE: {
    Petto:               { mev: 4,  mav: 8,  mrv: 12 },
    'Deltoidi Anteriori': { mev: 0,  mav: 4,  mrv: 8  },
    'Deltoidi Laterali':  { mev: 8,  mav: 16, mrv: 24 },
    'Deltoidi Posteriori':{ mev: 6,  mav: 12, mrv: 18 },
    'Gran Dorsale':       { mev: 6,  mav: 12, mrv: 18 },
    'Upper Back':         { mev: 6,  mav: 12, mrv: 18 },
    Bicipiti:            { mev: 4,  mav: 8,  mrv: 12 },
    Tricipiti:           { mev: 4,  mav: 8,  mrv: 14 },
    Quadricipiti:        { mev: 6,  mav: 12, mrv: 18 },
    Femorali:            { mev: 8,  mav: 14, mrv: 20 },
    Adduttori:           { mev: 6,  mav: 12, mrv: 18 }, // Focus prioritario femminile
    Glutei:              { mev: 10, mav: 18, mrv: 28 }, // Massimo volume target
    Polpacci:            { mev: 6,  mav: 12, mrv: 16 },
    Addome:              { mev: 0,  mav: 8,  mrv: 14 },
  }
};

export function resolveMuscleTarget(
  exerciseName?: string,
  declaredGroup?: string,
  programDictionary?: Map<string, MuscleTarget>
): MuscleTarget | null {
  // 1. Se il gruppo è già uno dei 14 distretti ufficiali, usalo subito
  if (declaredGroup && ALL_MUSCLE_TARGETS.includes(declaredGroup as MuscleTarget)) {
    return declaredGroup as MuscleTarget;
  }

  const name = (exerciseName || '').toLowerCase().trim();
  if (!name) return null;

  if (programDictionary && programDictionary.has(name)) {
    return programDictionary.get(name)!;
  }

  // 2. ADDUTTORI (priorità massima per non confonderli con quadricipiti o abduttori)
  if (
    name.includes('adductor') || name.includes('adduttor') || name.includes('adduzion') ||
    name.includes('copenaghen') || name.includes('copenhagen') || name.includes('sumo squat') ||
    name.includes('affondi lateral') || name.includes('lunge lateral')
  ) return 'Adduttori';

  // 3. FEMORALI (Ischiocrurali)
  if (
    name.includes('stacco rumeno') || name.includes('rdl') || name.includes('leg curl') ||
    name.includes('femoral') || name.includes('hamstring') || name.includes('lying curl') ||
    name.includes('seated curl') || name.includes('good morning') || name.includes('gambe tese') ||
    name.includes('nordic') || name.includes('ghr')
  ) return 'Femorali';

  // 4. GLUTEI
  if (
    name.includes('hip thrust') || name.includes('glute') || name.includes('kickback') ||
    name.includes('kick back') || name.includes('slanci') || name.includes('abductor') ||
    name.includes('abduzion') || name.includes('bridge') || name.includes('ponte') ||
    name.includes('frog pump') || name.includes('clamshell') || name.includes('step up') ||
    name.includes('step-up') || name.includes('bulgar') || name.includes('hyperextension') ||
    name.includes('iperestension') || name.includes('reverse hyper')
  ) return 'Glutei';

  // 5. QUADRICIPITI
  if (
    name.includes('squat') || name.includes('leg press') || name.includes('pressa') ||
    name.includes('leg ext') || name.includes('affondi') || name.includes('lunge') ||
    name.includes('hack') || name.includes('sissy') || name.includes('quadricipit')
  ) return 'Quadricipiti';

  // 6. DELTOIDI POSTERIORI
  if (
    name.includes('face pull') || name.includes('face-pull') || name.includes('facepull') ||
    name.includes('90°') || name.includes('90 gradi') || name.includes('posteriore') ||
    name.includes('posteriori') || name.includes('rear delt') || name.includes('reverse fly') ||
    name.includes('pec deck invers')
  ) return 'Deltoidi Posteriori';

  // 7. DELTOIDI LATERALI
  if (
    name.includes('alzate lateral') || name.includes('alzata lateral') || name.includes('lateral raise') ||
    name.includes('tirate al petto') || name.includes('tirate al mento') || name.includes('cavi later')
  ) return 'Deltoidi Laterali';

  // 8. DELTOIDI ANTERIORI
  if (
    name.includes('military') || name.includes('lento') || name.includes('shoulder press') ||
    name.includes('press spalle') || name.includes('arnold') || name.includes('alzate frontal') ||
    name.includes('front raise')
  ) return 'Deltoidi Anteriori';

  // 9. GRAN DORSALE (Ampiezza / Piani verticali e adduzione)
  if (
    name.includes('lat machine') || name.includes('lat ') || name.includes('trazioni') ||
    name.includes('pull up') || name.includes('pull-up') || name.includes('pullup') ||
    name.includes('chin up') || name.includes('chin-up') || name.includes('chinup') ||
    name.includes('pulldown') || name.includes('pull down') || name.includes('pullover')
  ) return 'Gran Dorsale';

  // 10. UPPER BACK (Spessore, Romboidi, Trapezio)
  if (
    name.includes('rematore') || name.includes('pulley') || name.includes('row') ||
    name.includes('t-bar') || name.includes('tbar') || name.includes('seal row') ||
    name.includes('shrug') || name.includes('scrollat') || name.includes('stacco da terra') ||
    name.includes('deadlift')
  ) return 'Upper Back';

  // 11. PETTO
  if (
    name.includes('panca') || name.includes('chest') || name.includes('croci') ||
    name.includes('dip') || name.includes('push up') || name.includes('push-up') ||
    name.includes('piegament') || name.includes('pectoral') || name.includes('spinte') ||
    name.includes('fly')
  ) return 'Petto';

  // 12. TRICIPITI
  if (
    name.includes('pushdown') || name.includes('french') || name.includes('tricipit') ||
    name.includes('triceps') || name.includes('skull crusher')
  ) return 'Tricipiti';

  // 13. BICIPITI
  if (
    name.includes('curl') || name.includes('bicipit') || name.includes('biceps') ||
    name.includes('hammer') || name.includes('scott')
  ) return 'Bicipiti';

  // 14. POLPACCI
  if (name.includes('polpacc') || name.includes('calf') || name.includes('calves') || name.includes('soleo')) {
    return 'Polpacci';
  }

  // 15. ADDOME
  if (
    name.includes('crunch') || name.includes('plank') || name.includes('addom') ||
    name.includes('core') || name.includes('leg raise') || name.includes('sit up')
  ) return 'Addome';

  // 16. Fallback retrocompatibilità per vecchi gruppi generici
  if (declaredGroup === 'Dorso') return 'Gran Dorsale';
  if (declaredGroup === 'Spalle') return 'Deltoidi Laterali';
  if (declaredGroup === 'Braccia') return 'Bicipiti';

  return null;
}

export function parseLocalDate(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  
  const str = String(value).trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(str);
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0);
  }
  
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
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

  const startM = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1, 0, 0, 0, 0);
  const endM = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);

  return { startOfWeek: startW, endOfWeek: endW, startOfMonth: startM, endOfMonth: endM };
}

function createEmptySetsMap(): Record<MuscleTarget, number> {
  return ALL_MUSCLE_TARGETS.reduce((acc, m) => {
    acc[m] = 0;
    return acc;
  }, {} as Record<MuscleTarget, number>);
}

export function calculateLoggedWeeklySets(
  logs: any[],
  workoutHistory: any[],
  programDays: any[],
  analyticsDate?: string
): Record<MuscleTarget, number> {
  const map = createEmptySetsMap();

  const programDict = new Map<string, MuscleTarget>();
  (programDays || []).forEach(day => {
    (day.exercises || []).forEach((ex: any) => {
      if (ex.name && ex.muscleGroup) {
        const resolved = resolveMuscleTarget(ex.name, ex.muscleGroup);
        if (resolved) {
          programDict.set(ex.name.toLowerCase().trim(), resolved);
        }
      }
    });
  });

  const { startOfWeek, endOfWeek } = getWeekDateRange(analyticsDate);
  const startMs = startOfWeek.getTime();
  const endMs = endOfWeek.getTime();
  const loggedHistoryDates = new Set<string>();

  (workoutHistory || []).forEach(w => {
    const wDate = parseLocalDate(w.created_at || w.date);
    if (!wDate) return;
    const time = wDate.getTime();
    if (time >= startMs && time <= endMs && Array.isArray(w.logs)) {
      const dateKey = `${wDate.getFullYear()}-${String(wDate.getMonth() + 1).padStart(2, '0')}-${String(wDate.getDate()).padStart(2, '0')}`;
      loggedHistoryDates.add(dateKey);

      w.logs.forEach((log: any) => {
        const reps = Number(log.reps) || 0;
        if (reps <= 0 || log.completed === false || log.isWarmup === true) return;

        const target = resolveMuscleTarget(log.exerciseName, log.muscleGroup, programDict);
        if (target) map[target] += 1;
      });
    }
  });

  (logs || []).forEach(l => {
    const d = parseLocalDate(l.date);
    if (!d) return;
    const time = d.getTime();
    if (time >= startMs && time <= endMs) {
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (loggedHistoryDates.has(dateKey)) return;

      const reps = Number(l.reps) || 0;
      if (reps <= 0 || l.completed === false || l.isWarmup === true) return;

      const target = resolveMuscleTarget(l.exerciseName, l.muscleGroup, programDict);
      if (target) map[target] += 1;
    }
  });

  return map;
}

export function calculatePlannedWeeklySets(
  daysOrTemplate: any,
  programDict?: Map<string, MuscleTarget>
): Record<MuscleTarget, number> {
  const map = createEmptySetsMap();
  const targetDays = Array.isArray(daysOrTemplate)
    ? daysOrTemplate
    : (daysOrTemplate && Array.isArray(daysOrTemplate.days) ? daysOrTemplate.days : []);

  targetDays.forEach((day: any) => {
    (day?.exercises || []).forEach((ex: any) => {
      const setsCount = Number(ex.sets) || (Array.isArray(ex.targetReps) ? ex.targetReps.length : 0);
      if (setsCount <= 0) return;

      const declared = (ex.muscleGroup || "").trim();
      let target: MuscleTarget | null = null;

      // 1. LA VOLONTÀ DEL COACH È SOVRANA: se il gruppo muscolare impostato è uno dei 14 distretti validi, usalo!
      if (declared && ALL_MUSCLE_TARGETS.includes(declared as MuscleTarget)) {
        target = declared as MuscleTarget;
      } else {
        // 2. Se manca o non è standard, risolvi tramite il dizionario o autodetect intelligente
        const resolved = resolveMuscleTarget(ex.name, declared, programDict);
        target = resolved || null;
      }

      if (target && map[target] !== undefined) {
        map[target] += setsCount;
      }
    });
  });

  return map;
};;

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

export function calculateWeeklyVolumeRadar(
  daysOrTemplate: any,
  genderParam?: AthleteGender,
  _includeIndirect: boolean = false
): MuscleVolumeStatus[] {
  const targetDays = Array.isArray(daysOrTemplate)
    ? daysOrTemplate
    : (daysOrTemplate && Array.isArray(daysOrTemplate.days) ? daysOrTemplate.days : []);
  const targetGender: AthleteGender = genderParam || daysOrTemplate?.gender || "MALE";
  const plannedMap = calculatePlannedWeeklySets(targetDays);
  return buildMuscleVolumeStatuses(plannedMap, targetGender);
}

export function calculateFromMuscleMap(
  muscleMap: Record<string, number> = {},
  gender: AthleteGender = 'MALE'
): MuscleVolumeStatus[] {
  return buildMuscleVolumeStatuses(muscleMap as any, gender);
}
