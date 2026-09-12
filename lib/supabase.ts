import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  if (!isSupabaseConfigured()) {
    console.warn('Variabili d’ambiente Supabase mancanti.');
    return null;
  }

  supabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return supabaseInstance;
}