import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const getSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
};

export interface CompletedSetLog {
  exerciseId?: string;
  exerciseName: string;
  weight: number;
  reps: number;
  rpe: number;
  estimated1RM?: number;
  volume?: number;
  date?: string;
  time?: string;
}

export async function saveCompletedWorkoutToSupabase(workout: {
  userId: string;
  dayName: string;
  totalVolume: number;
  exercisesCount: number;
  logs: CompletedSetLog[];
}) {
  const supabase = getSupabase();
  if (!supabase) return { success: true, localOnly: true };

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
  const supabase = getSupabase();
  if (!supabase || !userId) return [];

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
  const supabase = getSupabase();
  if (!supabase) return { success: true };

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
  const supabase = getSupabase();
  if (!supabase) return { success: true, localOnly: true };

  const { data: existing } = await supabase
    .from('programs')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  let error;

  if (existing) {
    const res = await supabase
      .from('programs')
      .update({
        program_name: programName,
        days_data: days,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    error = res.error;
  } else {
    const res = await supabase
      .from('programs')
      .insert({
        user_id: userId,
        program_name: programName,
        days_data: days,
        updated_at: new Date().toISOString()
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
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return data;
}