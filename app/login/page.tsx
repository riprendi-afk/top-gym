'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function Home() {
  const supabase = getSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Stati per il form
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Controlla la sessione attiva all'avvio
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    // Ascolta i cambiamenti di stato dell'autenticazione (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  // Gestore per l'invio del Form (Login/Registrazione)
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setErrorMessage('');

    if (isSignUp) {
      // Registrazione
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username: username || email.split('@')[0] },
        },
      });
      if (error) setErrorMessage(error.message);
      else alert('Registrazione completata! Ora puoi accedere.');
    } else {
      // Login
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setErrorMessage(error.message);
    }
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-white">Caricamento...</div>;
  }

  // --- SE L'UTENTE NON È LOGGATO: MOSTRA FORM LOGIN / REGISTRAZIONE ---
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-white">
        <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
          <h1 className="mb-2 text-center text-2xl font-bold uppercase tracking-wider text-red-600">
            {isSignUp ? 'Crea Account' : 'Accedi alla WebApp'}
          </h1>
          <p className="mb-6 text-center text-sm text-zinc-400">
            {isSignUp ? 'Inserisci i tuoi dati per registrarti' : 'Inserisci le tue credenziali per accedere'}
          </p>

          {errorMessage && (
            <div className="mb-4 rounded bg-red-900/50 p-3 text-sm text-red-200 border border-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="mb-1 block text-xs uppercase font-semibold text-zinc-400">Username / Nome</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded bg-zinc-800 p-2.5 text-white border border-zinc-700 focus:border-red-500 focus:outline-none"
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
                className="w-full rounded bg-zinc-800 p-2.5 text-white border border-zinc-700 focus:border-red-500 focus:outline-none"
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
                className="w-full rounded bg-zinc-800 p-2.5 text-white border border-zinc-700 focus:border-red-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded bg-red-600 py-3 font-bold uppercase tracking-wide text-white hover:bg-red-700 transition"
            >
              {isSignUp ? 'Registrati' : 'Accedi'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            {isSignUp ? 'Hai già un account?' : 'Non hai ancora un account?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage('');
              }}
              className="font-semibold text-red-500 underline hover:text-red-400"
            >
              {isSignUp ? 'Accedi' : 'Registrati qui'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- SE L'UTENTE È LOGGATO: MOSTRA AREA PERSONALE ---
  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-white">
      <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-red-600">PANNELLO ATLETA</h1>
          <p className="text-sm text-zinc-400">Benvenuto, {user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
        >
          Logout
        </button>
      </header>

      <main className="mt-8">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Area Riservata Atleta</h2>
          <p className="text-zinc-400 text-sm">
            Sei autenticato con successo. Da qui collegheremo la lettura della tua scheda di allenamento, il diario dei carichi e la classifica generale!
          </p>
        </div>
      </main>
    </div>
  );
}