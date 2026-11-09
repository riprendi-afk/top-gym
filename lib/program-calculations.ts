// lib/program-calculations.ts

export interface CalculatedExercise {
  name: string;
  muscle: string;
  sets: number;
  reps: number;
  weightKg?: number;
}

/**
 * Calcola il tonnellaggio di un singolo esercizio (Serie x Ripetizioni x Carico in Kg).
 * Se il carico non è presente o è a corpo libero (0 kg), restituisce 0.
 */
export function calculateExerciseTonnage(sets: number, reps: number, weightKg: number = 0): number {
  if (sets <= 0 || reps <= 0 || weightKg <= 0) return 0;
  return Math.round(sets * reps * weightKg * 100) / 100;
}

/**
 * Calcola il tonnellaggio complessivo di una sessione sommando tutti gli esercizi.
 */
export function calculateTotalSessionTonnage(exercises: CalculatedExercise[]): number {
  if (!exercises || exercises.length === 0) return 0;

  const total = exercises.reduce((acc, ex) => {
    return acc + calculateExerciseTonnage(ex.sets, ex.reps, ex.weightKg || 0);
  }, 0);

  return Math.round(total * 100) / 100;
}

/**
 * Raggruppa e somma il numero totale di serie allenanti suddivise per gruppo muscolare.
 */
export function calculateWeeklySetsByMuscle(exercises: CalculatedExercise[]): Record<string, number> {
  const distribution: Record<string, number> = {};

  if (!exercises || exercises.length === 0) return distribution;

  exercises.forEach((ex) => {
    const muscleKey = (ex.muscle || "GENERALE").toUpperCase().trim();
    const validSets = typeof ex.sets === "number" && ex.sets > 0 ? ex.sets : 0;
    distribution[muscleKey] = (distribution[muscleKey] || 0) + validSets;
  });

  return distribution;
}
