// lib/bodyweight.ts

export interface BodyweightConfig {
    name: string;
    percentage: number;
    aliases: string[];
    notes?: string;
  }
  
  /**
   * Registry configurabile delle percentuali di carico corporeo confermate.
   * Non inventare percentuali: se un esercizio non è in questo elenco, 
   * il carico effettivo rimane non calcolato (null).
   */
  export const BODYWEIGHT_EXERCISES_CONFIG: BodyweightConfig[] = [
    {
      name: 'Trazioni alla sbarra (Pull-up)',
      percentage: 0.98,
      aliases: ['trazioni', 'pull up', 'pull-up', 'chin up', 'chin-up', 'pullup', 'chinup', 'sbarra'],
      notes: 'Corpo completamente sospeso nel vuoto, escluse solo le mani.'
    },
    {
      name: 'Dip alle parallele',
      percentage: 0.90,
      aliases: ['dip', 'dips', 'parallele', 'dip alle parallele'],
      notes: 'Corpo sospeso, ma le braccia sostengono la struttura dallalto.'
    },
    {
      name: 'Squat bulgaro',
      percentage: 0.70,
      aliases: ['squat bulgaro', 'bulgaro', 'bulgarian split squat'],
      notes: 'Carico riferito esclusivamente alla gamba anteriore di lavoro.'
    },
    {
      name: 'Piegamenti sulle braccia (Push-up)',
      percentage: 0.65,
      aliases: ['piegamenti', 'push up', 'push-up', 'pushup', 'flessioni'],
      notes: 'Piegamenti standard a terra in posizione di plank.'
    },
    {
      name: 'Squat classico',
      percentage: 0.60,
      aliases: ['squat classico', 'squat corpo libero', 'air squat', 'bodyweight squat'],
      notes: 'Squat a due gambe a corpo libero, i piedi restano a terra.'
    },
    {
      name: 'Push-up sulle ginocchia',
      percentage: 0.50,
      aliases: ['push-up sulle ginocchia', 'piegamenti sulle ginocchia', 'knee push up'],
      notes: 'Variante facilitata dei piegamenti a terra.'
    },
    {
      name: 'Affondi statici',
      percentage: 0.50,
      aliases: ['affondi statici', 'affondo statico', 'static lunge'],
      notes: 'Carico calcolato per singola gamba durante la discesa.'
    }
  ];
  
  /**
   * Cerca la configurazione corpo libero tramite nome o alias.
   */
  export function findBodyweightConfig(exerciseName: string): BodyweightConfig | null {
    if (!exerciseName) return null;
    const clean = exerciseName.toLowerCase().trim();
  
    for (const config of BODYWEIGHT_EXERCISES_CONFIG) {
      if (config.name.toLowerCase() === clean) return config;
      for (const alias of config.aliases) {
        if (clean.includes(alias)) {
          // Evitiamo falsi positivi (es. "Squat bilanciere" non deve matchare "Squat classico")
          if (alias === 'squat classico' || alias === 'squat corpo libero' || alias === 'air squat') {
            if (clean.includes('bilanciere') || clean.includes('multipower') || clean.includes('smith')) {
              continue;
            }
          }
          return config;
        }
      }
    }
    return null;
  }
  
  export interface EffectiveLoadResult {
    isBodyweight: boolean;
    config: BodyweightConfig | null;
    externalLoad: number;
    bodyWeightUsed: number | null;
    percentageUsed: number | null;
    bodyweightLoad: number | null;
    effectiveLoad: number | null;
    effectiveVolume: number;
  }
  
  /**
   * Calcola il carico effettivo in base al peso corporeo rilevato dalla Readiness.
   * Se non è disponibile alcun peso corporeo o manca la percentuale, NON inventa il dato.
   */
  export function computeEffectiveLoad(
    exerciseName: string,
    externalLoad: number,
    reps: number,
    sessionBodyWeight?: number | null
  ): EffectiveLoadResult {
    const config = findBodyweightConfig(exerciseName);
  
    if (!config) {
      return {
        isBodyweight: false,
        config: null,
        externalLoad,
        bodyWeightUsed: null,
        percentageUsed: null,
        bodyweightLoad: null,
        effectiveLoad: externalLoad,
        effectiveVolume: externalLoad * reps
      };
    }
  
    // Esercizio a corpo libero riconosciuto
    if (sessionBodyWeight && sessionBodyWeight > 0) {
      const bwLoad = Math.round(sessionBodyWeight * config.percentage * 10) / 10;
      const totalEffective = Math.round((bwLoad + externalLoad) * 10) / 10;
      return {
        isBodyweight: true,
        config,
        externalLoad,
        bodyWeightUsed: sessionBodyWeight,
        percentageUsed: config.percentage,
        bodyweightLoad: bwLoad,
        effectiveLoad: totalEffective,
        effectiveVolume: Math.round(totalEffective * reps * 10) / 10
      };
    }
  
    // Corpo libero ma nessun peso corporeo nella Readiness
    return {
      isBodyweight: true,
      config,
      externalLoad,
      bodyWeightUsed: null,
      percentageUsed: config.percentage,
      bodyweightLoad: null,
      effectiveLoad: null,
      effectiveVolume: externalLoad * reps
    };
  }