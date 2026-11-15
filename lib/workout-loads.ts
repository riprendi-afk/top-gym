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
 * per evitare discrepanze tra maiuscole, minuscole o spazi doppi.
 */
export function normalizeExerciseKey(name: string): string {
  if (!name) return "";
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Analizza l'array workoutHistory (sedute salvate su Supabase) ed estrae
 * l'ultimo carico positivo (> 0) registrato per ciascun esercizio.
 */
export function extractLoadsFromWorkoutHistory(
  workoutHistory: any[] = []
): Record<string, number> {
  const historyMap: Record<string, number> = {};
  if (!Array.isArray(workoutHistory) || workoutHistory.length === 0) {
    return historyMap;
  }

  // Ordiniamo una copia dalla seduta più recente alla più vecchia
  const sortedSessions = [...workoutHistory].sort((a, b) => {
    const dateA = new Date(a?.created_at || a?.date || 0).getTime();
    const dateB = new Date(b?.created_at || b?.date || 0).getTime();
    if (isNaN(dateA) || isNaN(dateB)) return 0;
    return dateB - dateA;
  });

  for (const session of sortedSessions) {
    if (!session) continue;

    // Supporta sia sedute con array "logs" sia eventuali formati con "exercises" o piatta
    const entries = Array.isArray(session.logs)
      ? session.logs
      : Array.isArray(session.exercises)
      ? session.exercises
      : [session];

    for (const entry of entries) {
      if (!entry) continue;
      const rawName = entry.exerciseName || entry.exercise_name || entry.name;
      if (!rawName) continue;

      const key = normalizeExerciseKey(String(rawName));
      if (!key || historyMap[key] !== undefined) continue;

      const rawWeight =
        entry.weight ?? entry.externalLoad ?? entry.load ?? entry.target_weight;
      if (rawWeight === undefined || rawWeight === null) continue;

      const parsed = parseFloat(String(rawWeight).replace(",", "."));
      if (!isNaN(parsed) && parsed > 0) {
        historyMap[key] = parsed;
      }
    }
  }

  return historyMap;
}

/**
 * Determina il carico da visualizzare all'apertura dell'esercizio:
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
 * Combina lo storico sessioni (workoutHistory), i log su Supabase e la cache locale
 * per restituire la mappa completa degli ultimi carichi dell'atleta.
 */
export async function getAthleteLastLoads(
  userId: string,
  exerciseNames: string[],
  workoutHistory: any[] = []
): Promise<Record<string, number>> {
  // 1. Partiamo dai carichi estratti dallo storico sessioni (funziona su ogni dispositivo)
  const resultMap: Record<string, number> = extractLoadsFromWorkoutHistory(workoutHistory);

  if (!userId || !exerciseNames || exerciseNames.length === 0) return resultMap;

  // 2. Integriamo eventuali log dalla tabella workout_logs di Supabase
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
      }
    }
  } catch (err) {
    console.warn("Recupero log Supabase non riuscito, proseguo con storico e cache:", err);
  }

  // 3. Sovrascriviamo con la cache locale del telefono (contiene eventuali serie appena fatte)
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

  // 4. Aggiorniamo la cache locale con i dati consolidati
  if (typeof window !== "undefined" && Object.keys(resultMap).length > 0) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(resultMap));
    } catch {
      // Gestione silenziosa quota localStorage
    }
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