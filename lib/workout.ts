import { getSupabase } from '@/lib/supabase';
export interface ExerciseLog {
  sheet_id?: string;
  exercise_name: string;
  sets_completed: number;
  reps_completed: number;
  weight_kg: number;
}

// 1. Recupera la scheda attiva dell'utente
export async function getUserWorkoutSheet(userId: string) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('workout_sheets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Errore recupero scheda:', error.message);
  }
  return data;
}

// 2. Registra una serie completata e assegna XP
export async function logWorkoutSet(userId: string, log: ExerciseLog) {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase non configurato' };

  // A. Inserisci il log nella tabella workout_logs
  const { error: logError } = await supabase
    .from('workout_logs')
    .insert([
      {
        user_id: userId,
        sheet_id: log.sheet_id || null,
        exercise_name: log.exercise_name,
        sets_completed: log.sets_completed,
        reps_completed: log.reps_completed,
        weight_kg: log.weight_kg,
        xp_gained: 10,
      },
    ]);

  if (logError) return { success: false, error: logError.message };

  // B. Aggiorna l'XP totale dell'utente nel profilo
  const { data: profile } = await supabase
    .from('profiles')
    .select('total_xp, level')
    .eq('id', userId)
    .single();

  const currentXp = profile?.total_xp || 0;
  const newXp = currentXp + 10;
  const newLevel = Math.floor(newXp / 100) + 1; // Ogni 100 XP si sale di livello

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ total_xp: newXp, level: newLevel })
    .eq('id', userId);

  if (profileError) return { success: false, error: profileError.message };

  return { success: true, newXp, newLevel };
}

// 3. Recupera la classifica generale (Leaderboard)
export async function getLeaderboard() {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, total_xp, level')
    .order('total_xp', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Errore recupero classifica:', error.message);
    return [];
  }
  return data;
}