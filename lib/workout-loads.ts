// lib/workout-loads.ts
import { getSupabase } from "@/lib/supabase";

export interface ExerciseLoadHistory {
  exerciseName: string;
  weight: number;
  reps?: number;
  date?: string;
}

/**
 * Normalizza il nome dell'esercizio (rimuove spazi superflui e converte in minuscolo)
 * per evitare discrepanze tra maiuscole, minuscole o accenti.
 */
export function normalizeExerciseKey(name: string): string {
  if (!name) return "";
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Determina il carico da visualizzare:
 * 1. Usa l'ultimo peso utilizzato dall'atleta (se disponibile e > 0).
 * 2. In alternativa usa il target impostato dal coach.
 * 3. Altrimenti restituisce una stringa vuota per mostrare il placeholder.
 */
export function resolveInitialExerciseWeight(
  exerciseName: string,
  historyMap: Record<string, number>,
  coachTargetWeight?: string | number
): string {
  const key = normalizeExerciseKey(exerciseName);
  const historicWeight = historyMap[key];

  if (typeof historicWeight === "number" && historicWeight > 0) {
    return String(historicWeight);
  }

  if (coachTargetWeight !== undefined && coachTargetWeight !== null) {
    const parsedCoach = parseFloat(String(coachTargetWeight).replace(",", "."));
    if (!isNaN(parsedCoach) && parsedCoach > 0) {
      return String(parsedCoach);
    }
  }

  return "";
}

/**
 * Recupera da Supabase e da localStorage l'ultimo carico registrato per un insieme di esercizi.
 */
export async function getAthleteLastLoads(
  userId: string,
  exerciseNames: string[]
): Promise<Record<string, number>> {
  const resultMap: Record<string, number> = {};
  if (!userId || !exerciseNames || exerciseNames.length === 0) return resultMap;

  // 1. Carica prima la cache locale dal dispositivo dell'atleta
  const cacheKey = `topgym_loads_cache_${userId}`;
  try {
    const localRaw = typeof window !== "undefined" ? localStorage.getItem(cacheKey) : null;
    if (localRaw) {
      const parsed = JSON.parse(localRaw);
      Object.assign(resultMap, parsed);
    }
  } catch (err) {
    console.warn("Impossibile leggere cache carichi locale:", err);
  }

  // 2. Interroga Supabase per avere i dati più recenti
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("workout_logs")
        .select("exercise_name, weight, load, target_weight, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(100);

      if (!error && data && data.length > 0) {
        data.forEach((row: any) => {
          const rawName = row.exercise_name;
          if (!rawName) return;
          const key = normalizeExerciseKey(rawName);

          if (resultMap[key] === undefined) {
            const rawW = row.weight ?? row.load ?? row.target_weight;
            const num = parseFloat(String(rawW).replace(",", "."));
            if (!isNaN(num) && num > 0) {
              resultMap[key] = num;
            }
          }
        });

        // Aggiorna la memoria locale
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(resultMap));
          } catch (e) {
            // Quota storage gestita silenziosamente
          }
        }
      }
    }
  } catch (err) {
    console.warn("Recupero log Supabase non riuscito, uso dati offline:", err);
  }

  return resultMap;
}

/**
 * Salva nella memoria del dispositivo l'ultimo carico utilizzato appena l'atleta registra una serie.
 */
export function recordCompletedLoadLocally(
  userId: string,
  exerciseName: string,
  weight: number
): void {
  if (!userId || !exerciseName || weight <= 0 || typeof window === "undefined") return;

  const cacheKey = `topgym_loads_cache_${userId}`;
  try {
    const localRaw = localStorage.getItem(cacheKey);
    const existing = localRaw ? JSON.parse(localRaw) : {};
    existing[normalizeExerciseKey(exerciseName)] = weight;
    localStorage.setItem(cacheKey, JSON.stringify(existing));
  } catch (err) {
    console.error("Errore salvataggio rapido carico locale:", err);
  }
}