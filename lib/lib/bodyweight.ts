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

  // 1. FILTRO BLOCCANTE MACCHINARI, DISCHI E BILANCIERI
  // Se il nome contiene una di queste parole, NON è corpo libero (es. "Dip Machine", "Macchina Dip")
  const machineKeywords = [
    'machine',
    'macchina',
    'macchinario',
    'guidat',
    'sedut',
    'assistit',
    'press',
    'multipower',
    'smith',
    'bilanciere',
    'manubri',
    'cavi',
    'cable',
    'leva',
    'lever',
    'pacco pesi'
  ];

  if (machineKeywords.some(keyword => name.includes(keyword))) {
    return null;
  }

  // 2. TRAZIONI ALLA SBARRA / ANELLI (98%)
  if (name.includes('trazioni') || name.includes('pull up') || name.includes('chin up')) {
    return {
      isBodyweight: true,
      percentage: 0.98,
      label: 'Trazioni'
    };
  }

  // 3. DIP PARALLELE / ANELLI (90%)
  // Si attiva solo se non è stata rilevata una macchina
  if (name.includes('dip')) {
    return {
      isBodyweight: true,
      percentage: 0.90,
      label: 'Dip Parallele'
    };
  }

  // 4. SQUAT BULGARO (70%)
  if (name.includes('bulgar') || name.includes('bulgarian')) {
    return {
      isBodyweight: true,
      percentage: 0.70,
      label: 'Squat Bulgaro'
    };
  }

  // 5. PUSH-UP SULLE GINOCCHIA (50%)
  if (
    (name.includes('push up') || name.includes('piegament')) && 
    (name.includes('ginocchi') || name.includes('knee'))
  ) {
    return {
      isBodyweight: true,
      percentage: 0.50,
      label: 'Push-up Ginocchia'
    };
  }

  // 6. PIEGAMENTI STANDARD / PUSH-UP (65%)
  if (name.includes('push up') || name.includes('piegament')) {
    return {
      isBodyweight: true,
      percentage: 0.65,
      label: 'Piegamenti'
    };
  }

  // 7. AFFONDI STATICI / CORPO LIBERO (50%)
  if (name.includes('affond') || name.includes('lunge')) {
    return {
      isBodyweight: true,
      percentage: 0.50,
      label: 'Affondi'
    };
  }

  // 8. SQUAT A CORPO LIBERO / AIR SQUAT (60%)
  if (
    name.includes('air squat') || 
    name.includes('squat corpo libero') || 
    name.includes('squat libero') || 
    name.includes('squat classico') ||
    name === 'squat'
  ) {
    return {
      isBodyweight: true,
      percentage: 0.60,
      label: 'Squat Classico'
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