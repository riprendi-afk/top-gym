'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import { logWorkoutSet, getLeaderboard } from '@/lib/workout';
import { User } from '@supabase/supabase-js';

export default function Home() {
  const supabase = getSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Stati Auth Form
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Stati Workout & Gamification
  const [exerciseName, setExerciseName] = useState('Panca Piana');
  const [weight, setWeight] = useState(60);
  const [reps, setReps] = useState(10);
  const [sets, setSets] = useState(1);
  const [userXp, setUserXp] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user.id);
      }
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user.id);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const loadUserData = async (userId: string) => {
    if (!supabase) return;
    // Carica profilo
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_xp, level')
      .eq('id', userId)
      .single();

    if (profile) {
      setUserXp(profile.total_xp || 0);
      setUserLevel(profile.level || 1);
    }

    // Carica classifica
    const topUsers = await getLeaderboard();
    setLeaderboard(topUsers);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setErrorMessage('');

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username: username || email.split('@')[0] } },
      });
      if (error) setErrorMessage(error.message);
      else alert('Registrazione completata! Ora puoi accedere.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorMessage(error.message);
    }
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  const handleLogSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const res = await logWorkoutSet(user.id, {
      exercise_name: exerciseName,
      sets_completed: sets,
      reps_completed: reps,
      weight_kg: weight,
    });

    if (res.success) {
      setUserXp(res.newXp!);
      setUserLevel(res.newLevel!);
      const topUsers = await getLeaderboard();
      setLeaderboard(topUsers);
      alert(`Serie registrata! +10 XP Guadagnati 🚀`);
    } else {
      alert('Errore nel salvataggio: ' + res.error);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-white">Caricamento...</div>;
  }

  // --- NON LOGGATO ---
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-white">
        <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
          <h1 className="mb-2 text-center text-2xl font-bold uppercase tracking-wider text-red-600">
            {isSignUp ? 'Crea Account' : 'Accedi a TOP GYM'}
          </h1>
          {errorMessage && (
            <div className="mb-4 rounded bg-red-900/50 p-3 text-sm text-red-200 border border-red-700">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="mb-1 block text-xs uppercase font-semibold text-zinc-400">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded bg-zinc-800 p-2.5 text-white border border-zinc-700"
                  placeholder="Il tuo nome atleta"
                />
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs uppercase font-semibold text-zinc-400">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded bg-zinc-800 p-2.5 text-white border border-zinc-700"
                placeholder="atleta@email.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase font-semibold text-zinc-400">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded bg-zinc-800 p-2.5 text-white border border-zinc-700"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded bg-red-600 py-3 font-bold uppercase text-white hover:bg-red-700"
            >
              {isSignUp ? 'Registrati' : 'Accedi'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-zinc-400">
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setErrorMessage(''); }}
              className="font-semibold text-red-500 underline"
            >
              {isSignUp ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- UTENTE LOGGATO ---
  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-white md:p-8">
      {/* Header Statistiche */}
      <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-red-600">TOP GYM PWA</h1>
          <p className="text-sm text-zinc-400">Atleta: {user.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2 text-center">
            <span className="block text-xs uppercase text-zinc-500">Livello</span>
            <span className="text-xl font-bold text-red-500">{userLevel}</span>
          </div>
          <div className="rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2 text-center">
            <span className="block text-xs uppercase text-zinc-500">Esperienza</span>
            <span className="text-xl font-bold text-yellow-500">{userXp} XP</span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded border border-zinc-700 px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-800"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Grid Dashboard */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Registrazione Carico */}
        <section className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">
            Registra Allenamento
          </h2>
          <form onSubmit={handleLogSet} className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Esercizio</label>
              <input
                type="text"
                required
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                className="w-full rounded bg-zinc-800 p-2.5 text-white border border-zinc-700"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Carico (kg)</label>
                <input
                  type="number"
                  required
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full rounded bg-zinc-800 p-2.5 text-white border border-zinc-700"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Reps</label>
                <input
                  type="number"
                  required
                  value={reps}
                  onChange={(e) => setReps(Number(e.target.value))}
                  className="w-full rounded bg-zinc-800 p-2.5 text-white border border-zinc-700"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Serie N°</label>
                <input
                  type="number"
                  required
                  value={sets}
                  onChange={(e) => setSets(Number(e.target.value))}
                  className="w-full rounded bg-zinc-800 p-2.5 text-white border border-zinc-700"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded bg-red-600 py-3 font-bold uppercase tracking-wider text-white hover:bg-red-700 transition"
            >
              Completa Serie (+10 XP)
            </button>
          </form>
        </section>

        {/* Classifica Atleti */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wide flex items-center justify-between">
            <span>Classifica Gym</span>
            <span className="text-xs text-yellow-500 font-normal">TOP XP</span>
          </h2>
          <div className="space-y-3">
            {leaderboard.length === 0 ? (
              <p className="text-sm text-zinc-500">Nessun atleta in classifica.</p>
            ) : (
              leaderboard.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded bg-zinc-800/50 border border-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-zinc-500 w-4">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.username || 'Atleta'}</p>
                      <p className="text-xs text-zinc-400">Lvl {item.level}</p>
                    </div>
                  </div>
                  <span className="font-bold text-yellow-500 text-sm">{item.total_xp} XP</span>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}