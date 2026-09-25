import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Client esportato direttamente: mai null per TypeScript
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CompletedSetLog {
  id?: string;
  exerciseId?: string;
  exerciseName: string;
  weight: number;
  reps: number;
  rpe: number;
  estimated1RM?: number;
  volume?: number;
  date?: string;
  time?: string;
  isBodyweight?: boolean;
  externalLoad?: number;
  bodyWeightUsed?: number | null;
  percentageUsed?: number | null;
  bodyweightLoad?: number | null;
  effectiveLoad?: number | null;
  effectiveVolume?: number | null;
}

export async function saveCompletedWorkoutToSupabase(workout: {
  userId: string;
  dayName: string;
  totalVolume: number;
  exercisesCount: number;
  logs: CompletedSetLog[];
}) {
  const { error } = await supabase.from('workout_history').insert({
    user_id: workout.userId,
    day_name: workout.dayName,
    total_volume: workout.totalVolume,
    exercises_count: workout.exercisesCount,
    logs: workout.logs ?? [],
  });

  if (error) {
    console.error('Errore salvataggio allenamento:', error.message);
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function getWorkoutHistoryFromSupabase(userId: string) {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('workout_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Errore caricamento storico:', error.message);
    return [];
  }
  return data || [];
}

export async function deleteWorkoutHistoryFromSupabase(workoutId: string) {
  const { error } = await supabase
    .from('workout_history')
    .delete()
    .eq('id', workoutId);

  if (error) {
    console.error('Errore eliminazione storico:', error.message);
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function saveProgramToSupabase(userId: string, programName: string, days: any[]) {
  if (!userId) return { success: false, error: 'User ID mancante' };

  // Recupera l'id dell'ultima scheda esistente evitando il blocco di maybeSingle()
  const { data: existingRows } = await supabase
    .from('programs')
    .select('id')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1);

  const existing = existingRows && existingRows.length > 0 ? existingRows[0] : null;

  let error;

  if (existing?.id) {
    const res = await supabase
      .from('programs')
      .update({
        program_name: programName,
        days_data: days,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
    error = res.error;
  } else {
    const res = await supabase
      .from('programs')
      .insert({
        user_id: userId,
        program_name: programName,
        days_data: days,
        updated_at: new Date().toISOString(),
      });
    error = res.error;
  }

  if (error) {
    console.error('Errore salvataggio programma:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getProgramFromSupabase(userId: string) {
  if (!userId) return null;

  // Ordina per updated_at decrescente e prende sempre la versione più recente
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Errore caricamento programma:', error.message);
    return null;
  }

  if (!data || data.length === 0) return null;
  return data[0];
}