// lib/topgym-volume.ts
// MOTORE ANALISI VOLUME SETTIMANALE · MEV / MAV / MRV · METODO TOP GYM

import { EngineWorkoutDay } from './topgym-engine';
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

export function getExerciseMuscleDistribution(
  exName: string, 
  declaredMuscle?: string
): { direct: MuscleTarget; secondary?: MuscleTarget } {
  const name = (exName || '').toLowerCase().trim();

  // 1. GLUTEI (priorità assoluta per evitare conflitti con 'panca', 'spinte', 'press')
  if (
    name.includes('hip thrust') ||
    name.includes('glute') ||
    name.includes('kickback') ||
    name.includes('kick back') ||
    name.includes('slanci') ||
    name.includes('abductor') ||
    name.includes('abduzion') ||
    name.includes('bridge') ||
    name.includes('ponte') ||
    name.includes('frog pump') ||
    name.includes('clamshell') ||
    name.includes('step up') ||
    name.includes('step-up') ||
    name.includes('bulgar') ||
    name.includes('affondi') ||
    name.includes('hyperextension') ||
    name.includes('iperestension') ||
    name.includes('reverse hyper')
  ) {
    if (name.includes('affondi') || name.includes('bulgar') || name.includes('step')) {
      return { direct: 'Glutei', secondary: 'Quadricipiti' };
    }
    return { direct: 'Glutei', secondary: 'Femorali' };
  }

  // 2. FEMORALI (prima di Dorso e Bicipiti per anticipare 'stacco' e 'curl')
  if (
    name.includes('stacco rumeno') ||
    name.includes('rdl') ||
    name.includes('leg curl') ||
    name.includes('femoral') ||
    name.includes('hamstring') ||
    name.includes('lying curl') ||
    name.includes('seated curl') ||
    name.includes('standing curl') ||
    name.includes('nordic') ||
    name.includes('ghr') ||
    name.includes('good morning') ||
    name.includes('gambe tese')
  ) {
    return { direct: 'Femorali', secondary: 'Glutei' };
  }

  // 3. QUADRICIPITI (identificazione pulita della pressa senza intaccare chest press o shoulder press)
  if (
    name.includes('squat') ||
    name.includes('leg press') ||
    name.includes('pressa') ||
    name.includes('hack') ||
    name.includes('leg ext') ||
    name.includes('quadricipit')
  ) {
    if (name.includes('leg ext')) {
      return { direct: 'Quadricipiti' };
    }
    return { direct: 'Quadricipiti', secondary: 'Glutei' };
  }

  // 4. DORSO
  if (
    name.includes('stacco da terra') ||
    name.includes('deadlift') ||
    name.includes('semi-sumo')
  ) {
    return { direct: 'Dorso', secondary: 'Glutei' };
  }
  if (
    name.includes('trazioni') ||
    name.includes('lat') ||
    name.includes('rematore') ||
    name.includes('pulley') ||
    name.includes('pull down') ||
    name.includes('pulldown') ||
    name.includes('chin up') ||
    name.includes('row')
  ) {
    return { direct: 'Dorso', secondary: 'Bicipiti' };
  }

  // 5. PETTO
  if (
    name.includes('panca') ||
    name.includes('chest') ||
    name.includes('croci') ||
    name.includes('dip') ||
    name.includes('push up') ||
    name.includes('piegament') ||
    name.includes('pectoral') ||
    name.includes('spinte') ||
    name.includes('fly')
  ) {
    return { direct: 'Petto', secondary: 'Tricipiti' };
  }

  // 6. SPALLE
  if (
    name.includes('military') ||
    name.includes('shoulder') ||
    name.includes('lento') ||
    name.includes('alzate') ||
    name.includes('deltoid') ||
    name.includes('arnold') ||
    name.includes('press spalle') ||
    name.includes('shrug')
  ) {
    return { direct: 'Spalle', secondary: 'Tricipiti' };
  }

  // 7. TRICIPITI
  if (
    name.includes('pushdown') ||
    name.includes('french') ||
    name.includes('tricipit') ||
    name.includes('triceps') ||
    name.includes('skull crusher')
  ) {
    return { direct: 'Tricipiti' };
  }

  // 8. BICIPITI
  if (
    name.includes('curl') ||
    name.includes('bicipit') ||
    name.includes('biceps') ||
    name.includes('hammer') ||
    name.includes('scott')
  ) {
    return { direct: 'Bicipiti' };
  }

  // 9. POLPACCI
  if (name.includes('calf') || name.includes('polpacc')) {
    return { direct: 'Polpacci' };
  }

  // 10. ADDOME
  if (
    name.includes('crunch') ||
    name.includes('plank') ||
    name.includes('addom') ||
    name.includes('core') ||
    name.includes('leg raise') ||
    name.includes('sit up')
  ) {
    return { direct: 'Addome' };
  }

  // Se non c'è match sul nome, ma il Coach ha selezionato un distretto valido, usa quello
  const validTargets: MuscleTarget[] = [
    'Petto', 'Dorso', 'Spalle', 'Quadricipiti', 'Femorali', 
    'Glutei', 'Bicipiti', 'Tricipiti', 'Polpacci', 'Addome'
  ];
  if (declaredMuscle && validTargets.includes(declaredMuscle as MuscleTarget)) {
    return { direct: declaredMuscle as MuscleTarget };
  }

  // Default neutro: Addome invece di sporcare il Petto
  return { direct: 'Addome' };
}

// 1. Calcolo del Volume Pianificato dalla Scheda (tutti i giorni della split)
export function calculateWeeklyVolumeRadar(
  days: EngineWorkoutDay[],
  gender: AthleteGender = 'MALE',
  includeIndirect: boolean = false
): MuscleVolumeStatus[] {
  const directCounts: Record<MuscleTarget, number> = {
    Petto: 0, Dorso: 0, Spalle: 0, Quadricipiti: 0, Femorali: 0,
    Glutei: 0, Bicipiti: 0, Tricipiti: 0, Polpacci: 0, Addome: 0
  };
  const indirectCounts: Record<MuscleTarget, number> = { ...directCounts };

  days.forEach(day => {
    (day.exercises || []).forEach(ex => {
      const setsCount = Number(ex.sets) || 0;
      if (setsCount <= 0) return;

      const mapping = getExerciseMuscleDistribution(ex.name, ex.muscleGroup);
      directCounts[mapping.direct] += setsCount;
      if (mapping.secondary) {
        indirectCounts[mapping.secondary] += setsCount * 0.5;
      }
    });
  });

  const muscleList: MuscleTarget[] = [
    'Petto', 'Dorso', 'Spalle', 'Quadricipiti', 'Femorali', 
    'Glutei', 'Bicipiti', 'Tricipiti', 'Polpacci', 'Addome'
  ];

  return muscleList.map(muscle => {
    const direct = directCounts[muscle];
    const total = includeIndirect ? direct + (indirectCounts[muscle] || 0) : direct;
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
      directSets: direct,
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

// 2. Calcolo del Volume Svolto sul Campo (legge la mappa reale dei set eseguiti)
export function calculateFromMuscleMap(
  muscleMap: Record<string, number> = {},
  gender: AthleteGender = 'MALE'
): MuscleVolumeStatus[] {
  const muscleList: MuscleTarget[] = [
    'Petto', 'Dorso', 'Spalle', 'Quadricipiti', 'Femorali', 
    'Glutei', 'Bicipiti', 'Tricipiti', 'Polpacci', 'Addome'
  ];

  return muscleList.map(muscle => {
    const direct = Number(muscleMap[muscle]) || 0;
    const { mev, mav, mrv } = VOLUME_THRESHOLDS[gender][muscle];

    let status: MuscleVolumeStatus['status'] = 'OPTIMAL';
    let statusLabel = 'Finestra Ottimale (MAV)';
    let colorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

    if (direct < mev) {
      status = 'SUB_MEV';
      statusLabel = 'Sotto MEV (Minimo Stimolo)';
      colorClass = 'text-zinc-400 bg-zinc-800 border-zinc-700';
    } else if (direct > mrv) {
      status = 'EXCESSIVE';
      statusLabel = 'Sopra MRV (Rischio Sovrallenamento)';
      colorClass = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    } else if (direct > mav) {
      status = 'OVERREACHING';
      statusLabel = 'Overreaching Controllato';
      colorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }

    const percentage = Math.min(100, Math.round((direct / mrv) * 100));

    return {
      muscle,
      directSets: direct,
      totalSets: direct,
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