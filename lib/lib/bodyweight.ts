export interface BodyweightConfig {
  isBodyweight: boolean;
  percentage: number;
  label: string;
}

export interface EffectiveLoadResult {
  isBodyweight: boolean;
  externalLoad: number;
  bodyWeightUsed: number | null;
  percentageUsed: number | null;
  bodyweightLoad: number | null;
  effectiveLoad: number | null;
  effectiveVolume: number | null;
}

export function findBodyweightConfig(exerciseName: string): BodyweightConfig | null {
  if (!exerciseName) return null;
  const name = exerciseName.toLowerCase().trim();

  // 1. Esclusione Macchinari: se contiene queste parole NON è a corpo libero
  if (
    name.includes('machine') || 
    name.includes('macchinario') || 
    name.includes('guidat') || 
    name.includes('sedut') ||
    name.includes('assistit') ||
    name.includes('press')
  ) {
    return null;
  }

  // 2. Dip (parallele, anelli, zavorrate)
  if (name.includes('dip')) {
    return {
      isBodyweight: true,
      percentage: 1.0,
      label: 'Dip'
    };
  }

  // 3. Trazioni alla sbarra / Anelli
  if (name.includes('trazioni') || name.includes('pull up') || name.includes('chin up')) {
    return {
      isBodyweight: true,
      percentage: 1.0,
      label: 'Trazioni'
    };
  }

  // 4. Piegamenti / Push up
  if (name.includes('push up') || name.includes('piegament')) {
    return {
      isBodyweight: true,
      percentage: 0.65,
      label: 'Piegamenti'
    };
  }

  return null;
}

export function computeEffectiveLoad(
  exerciseName: string,
  externalWeight: number,
  reps: number,
  bodyWeight: number | null
): EffectiveLoadResult {
  const config = findBodyweightConfig(exerciseName);

  if (!config) {
    return {
      isBodyweight: false,
      externalLoad: externalWeight,
      bodyWeightUsed: null,
      percentageUsed: null,
      bodyweightLoad: null,
      effectiveLoad: externalWeight,
      effectiveVolume: externalWeight * reps
    };
  }

  const bw = bodyWeight && bodyWeight > 0 ? bodyWeight : null;

  if (bw !== null) {
    const bodyweightLoad = Math.round(bw * config.percentage * 10) / 10;
    const effectiveLoad = Math.round((bodyweightLoad + externalWeight) * 10) / 10;
    const effectiveVolume = Math.round(effectiveLoad * reps * 10) / 10;

    return {
      isBodyweight: true,
      externalLoad: externalWeight,
      bodyWeightUsed: bw,
      percentageUsed: config.percentage,
      bodyweightLoad,
      effectiveLoad,
      effectiveVolume
    };
  }

  return {
    isBodyweight: true,
    externalLoad: externalWeight,
    bodyWeightUsed: null,
    percentageUsed: config.percentage,
    bodyweightLoad: null,
    effectiveLoad: externalWeight > 0 ? externalWeight : null,
    effectiveVolume: externalWeight > 0 ? externalWeight * reps : null
  };
}