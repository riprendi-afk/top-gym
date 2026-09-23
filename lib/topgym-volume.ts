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
  totalSets: number; // Include frazioni indirette
  mev: number;       // Volume Minimo Efficace
  mav: number;       // Volume Massimo Adattativo (Sweet spot)
  mrv: number;       // Massimo Volume Recuperabile
  status: 'SUB_MEV' | 'OPTIMAL' | 'OVERREACHING' | 'EXCESSIVE';
  statusLabel: string;
  colorClass: string;
  percentage: number; // Percentuale rispetto a MRV
}

// Soglie settimanali calibrate per Uomo e Donna
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
    Glutei:       { mev: 10, mav: 18, mrv: 26 }, // Priorità estetica femminile
    Bicipiti:     { mev: 4,  mav: 8,  mrv: 14 },
    Tricipiti:    { mev: 4,  mav: 10, mrv: 16 },
    Polpacci:     { mev: 6,  mav: 12, mrv: 16 },
    Addome:       { mev: 0,  mav: 8,  mrv: 14 },
  }
};

/**
 * Calcola l'impatto muscolare diretto e indiretto di un esercizio
 */
function getExerciseMuscleDistribution(exName: string, declaredMuscle?: string): { direct: MuscleTarget; secondary?: MuscleTarget } {
  const name = (exName || '').toLowerCase();

  // Glutei & Catena Posteriore
  if (name.includes('hip thrust') || name.includes('glute') || name.includes('abductor') || name.includes('ponte glutei')) {
    return { direct: 'Glutei', secondary: 'Femorali' };
  }
  if (name.includes('stacco rumeno') || name.includes('rdl') || name.includes('leg curl') || name.includes('femorali')) {
    return { direct: 'Femorali', secondary: 'Glutei' };
  }
  if (name.includes('stacco da terra') || name.includes('semi-sumo') || name.includes('deadlift')) {
    return { direct: 'Dorso', secondary: 'Glutei' };
  }

  // Gambe Quad-Dominant
  if (name.includes('squat') || name.includes('press') && !name.includes('bench') && !name.includes('shoulder')) {
    return { direct: 'Quadricipiti', secondary: 'Glutei' };
  }
  if (name.includes('affondi') || name.includes('bulgari') || name.includes('step up')) {
    return { direct: 'Glutei', secondary: 'Quadricipiti' };
  }
  if (name.includes('leg extension')) {
    return { direct: 'Quadricipiti' };
  }

  // Spinta Petto & Braccia
  if (name.includes('panca') || name.includes('chest') || name.includes('croci') || name.includes('dip') || name.includes('push up')) {
    return { direct: 'Petto', secondary: 'Tricipiti' };
  }

  // Spalle
  if (name.includes('military') || name.includes('shoulder') || name.includes('lento') || name.includes('alzate laterali') || name.includes('deltoid')) {
    return { direct: 'Spalle', secondary: 'Tricipiti' };
  }

  // Trazione Dorso & Braccia
  if (name.includes('trazioni') || name.includes('lat machine') || name.includes('rematore') || name.includes('pulley') || name.includes('pulldown')) {
    return { direct: 'Dorso', secondary: 'Bicipiti' };
  }

  // Braccia Dirette
  if (name.includes('curl') || name.includes('bicipit')) return { direct: 'Bicipiti' };
  if (name.includes('french') || name.includes('pushdown') || name.includes('tricipit')) return { direct: 'Tricipiti' };
  if (name.includes('calf') || name.includes('polpacci')) return { direct: 'Polpacci' };
  if (name.includes('crunch') || name.includes('plank') || name.includes('addom')) return { direct: 'Addome' };

  // Fallback sul valore dichiarato dal coach
  const normalized = (declaredMuscle || 'Petto') as MuscleTarget;
  return { direct: normalized };
}

/**
 * Elabora il volume completo della scheda settimanale
 */
export function calculateWeeklyVolumeRadar(
  days: EngineWorkoutDay[],
  gender: AthleteGender = 'MALE'
): MuscleVolumeStatus[] {
  const directCounts: Record<MuscleTarget, number> = {
    Petto: 0, Dorso: 0, Spalle: 0, Quadricipiti: 0, Femorali: 0,
    Glutei: 0, Bicipiti: 0, Tricipiti: 0, Polpacci: 0, Addome: 0
  };

  const indirectCounts: Record<MuscleTarget, number> = { ...directCounts };

  // Conteggio rigoroso dei set
  days.forEach(day => {
    (day.exercises || []).forEach(ex => {
      const setsCount = Number(ex.sets) || 0;
      if (setsCount <= 0) return;

      const mapping = getExerciseMuscleDistribution(ex.name, ex.muscleGroup);
      
      // Volume Diretto (1.0x)
      directCounts[mapping.direct] += setsCount;

      // Volume Indiretto / Sinergico (0.5x)
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
    const total = direct + indirectCounts[muscle];
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