import { getSupabase, isSupabaseConfigured } from './supabase';
import { createStarterProgram, DEFAULT_PROGRAM_NAME } from './program';
import {
  levelFromXp,
  type DayCount,
  type GymState,
  type LeaderboardEntry,
  type ReadinessLog,
  type SessionUser,
  type SetLog,
  type UserRole,
  type WorkoutDay,
} from './types';

const USERS_KEY = 'topgym.v1.users';
const SESSION_KEY = 'topgym.v1.session';
const dataKey = (userId: string) => `topgym.v1.data.${userId}`;

type LocalAccount = {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: UserRole;
  xp: number;
};

async function hashPassword(password: string) {
  const data = new TextEncoder().encode(`topgym:${password}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function emptyGymState(xp = 0): GymState {
  return {
    programName: DEFAULT_PROGRAM_NAME,
    daysCount: 4,
    programDays: createStarterProgram(),
    logs: [],
    readinessHistory: [],
    xp,
  };
}

function readLocalUsers(): Record<string, LocalAccount> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}') as Record<string, LocalAccount>;
  } catch {
    return {};
  }
}

function writeLocalUsers(users: Record<string, LocalAccount>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readLocalData(userId: string): GymState | null {
  try {
    const raw = localStorage.getItem(dataKey(userId));
    if (!raw) return null;
    return JSON.parse(raw) as GymState;
  } catch {
    return null;
  }
}

function writeLocalData(userId: string, state: GymState) {
  localStorage.setItem(dataKey(userId), JSON.stringify(state));
}

export async function signUpAccount(params: {
  email: string;
  password: string;
  displayName: string;
}): Promise<{ user: SessionUser; message?: string }> {
  const email = params.email.trim().toLowerCase();
  const displayName = params.displayName.trim();
  if (!email || !params.password || !displayName) {
    throw new Error('Compila nome, email e password.');
  }
  if (params.password.length < 6) {
    throw new Error('La password deve avere almeno 6 caratteri.');
  }

  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: params.password,
      options: { data: { display_name: displayName } },
    });
    if (error) throw new Error(error.message);
    const authUser = data.user;
    if (!authUser) throw new Error('Registrazione non completata.');

    await supabase.from('profiles').upsert({
      id: authUser.id,
      display_name: displayName,
      role: 'ATHLETE',
      xp: 0,
    });

    await supabase.from('programs').upsert({
      user_id: authUser.id,
      name: DEFAULT_PROGRAM_NAME,
      days_count: 4,
      days: createStarterProgram(),
    });

    if (!data.session) {
      throw new Error(
        'Account creato. Conferma la email dal link di Supabase, poi accedi.'
      );
    }

    return {
      user: {
        id: authUser.id,
        email,
        displayName,
        role: 'ATHLETE',
        xp: 0,
      },
    };
  }

  const users = readLocalUsers();
  if (Object.values(users).some((u) => u.email === email)) {
    throw new Error('Esiste già un account con questa email.');
  }

  const id = crypto.randomUUID();
  const account: LocalAccount = {
    id,
    email,
    passwordHash: await hashPassword(params.password),
    displayName,
    role: 'ATHLETE',
    xp: 0,
  };
  users[id] = account;
  writeLocalUsers(users);
  writeLocalData(id, emptyGymState());
  localStorage.setItem(SESSION_KEY, id);

  return {
    user: {
      id,
      email,
      displayName,
      role: 'ATHLETE',
      xp: 0,
    },
    message: isSupabaseConfigured()
      ? undefined
      : 'Modalità locale: i dati restano su questo browser finché non colleghi Supabase.',
  };
}

export async function signInAccount(email: string, password: string): Promise<SessionUser> {
  const normalized = email.trim().toLowerCase();
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalized,
      password,
    });
    if (error) throw new Error(error.message);
    const authUser = data.user;
    if (!authUser) throw new Error('Accesso non riuscito.');
    return loadSessionUser(authUser.id, authUser.email || normalized);
  }

  const users = readLocalUsers();
  const account = Object.values(users).find((u) => u.email === normalized);
  if (!account || account.passwordHash !== (await hashPassword(password))) {
    throw new Error('Email o password non corretti.');
  }
  localStorage.setItem(SESSION_KEY, account.id);
  return {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
    role: account.role,
    xp: account.xp,
  };
}

export async function signOutAccount() {
  const supabase = getSupabase();
  if (supabase) await supabase.auth.signOut();
  localStorage.removeItem(SESSION_KEY);
}

export async function getCurrentSession(): Promise<SessionUser | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) return null;
    return loadSessionUser(user.id, user.email || '');
  }

  const id = localStorage.getItem(SESSION_KEY);
  if (!id) return null;
  const account = readLocalUsers()[id];
  if (!account) return null;
  return {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
    role: account.role,
    xp: account.xp,
  };
}

async function loadSessionUser(id: string, email: string): Promise<SessionUser> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase non configurato.');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, role, xp')
    .eq('id', id)
    .maybeSingle();

  const displayName =
    profile?.display_name || email.split('@')[0] || 'Atleta';

  if (!profile) {
    await supabase.from('profiles').insert({
      id,
      display_name: displayName,
      role: 'ATHLETE',
      xp: 0,
    });
    await supabase.from('programs').upsert({
      user_id: id,
      name: DEFAULT_PROGRAM_NAME,
      days_count: 4,
      days: createStarterProgram(),
    });
  }

  return {
    id,
    email,
    displayName,
    role: (profile?.role as UserRole) || 'ATHLETE',
    xp: profile?.xp ?? 0,
  };
}

export async function loadGymState(userId: string): Promise<GymState> {
  const supabase = getSupabase();
  if (supabase) {
    const [{ data: profile }, { data: program }, { data: logs }, { data: readiness }] =
      await Promise.all([
        supabase.from('profiles').select('xp').eq('id', userId).maybeSingle(),
        supabase.from('programs').select('name, days_count, days').eq('user_id', userId).maybeSingle(),
        supabase
          .from('set_logs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        supabase
          .from('readiness_logs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
      ]);

    const days = (program?.days as WorkoutDay[] | undefined) ?? createStarterProgram();
    const daysCount = (program?.days_count as DayCount | undefined) ?? 4;

    return {
      programName: program?.name || DEFAULT_PROGRAM_NAME,
      daysCount,
      programDays: days,
      logs: (logs || []).map(mapSetLog),
      readinessHistory: (readiness || []).map(mapReadiness),
      xp: profile?.xp ?? 0,
    };
  }

  return readLocalData(userId) ?? emptyGymState();
}

export async function saveProgram(userId: string, state: Pick<GymState, 'programName' | 'daysCount' | 'programDays'>) {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from('programs').upsert({
      user_id: userId,
      name: state.programName,
      days_count: state.daysCount,
      days: state.programDays,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
    return;
  }

  const current = readLocalData(userId) ?? emptyGymState();
  writeLocalData(userId, { ...current, ...state });
}

export async function saveSetLog(userId: string, log: SetLog, nextXp: number, programDays: WorkoutDay[]) {
  const supabase = getSupabase();
  if (supabase) {
    const { error: logError } = await supabase.from('set_logs').insert({
      id: log.id,
      user_id: userId,
      exercise_id: log.exerciseId,
      exercise_name: log.exerciseName,
      weight: log.weight,
      reps: log.reps,
      rpe: log.rpe,
      estimated_1rm: log.estimated1RM,
      volume: log.volume,
      logged_date: log.date,
      logged_time: log.time,
    });
    if (logError) throw new Error(logError.message);

    await supabase.from('profiles').update({ xp: nextXp, updated_at: new Date().toISOString() }).eq('id', userId);
    await supabase
      .from('programs')
      .update({ days: programDays, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    return;
  }

  const current = readLocalData(userId) ?? emptyGymState();
  const users = readLocalUsers();
  if (users[userId]) {
    users[userId] = { ...users[userId], xp: nextXp };
    writeLocalUsers(users);
  }
  writeLocalData(userId, {
    ...current,
    logs: [log, ...current.logs],
    xp: nextXp,
    programDays,
  });
}

export async function saveReadinessLog(userId: string, item: ReadinessLog, nextXp: number) {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from('readiness_logs').insert({
      id: item.id,
      user_id: userId,
      logged_date: item.date,
      sleep_hours: item.sleepHours,
      sleep_quality: item.sleepQuality,
      stress_level: item.stressLevel,
      doms_level: item.domsLevel,
      energy_level: item.energyLevel,
      body_weight: item.bodyWeight ?? null,
      readiness_score: item.readinessScore,
      recommendation: item.recommendation,
    });
    if (error) throw new Error(error.message);
    await supabase.from('profiles').update({ xp: nextXp, updated_at: new Date().toISOString() }).eq('id', userId);
    return;
  }

  const current = readLocalData(userId) ?? emptyGymState();
  const users = readLocalUsers();
  if (users[userId]) {
    users[userId] = { ...users[userId], xp: nextXp };
    writeLocalUsers(users);
  }
  writeLocalData(userId, {
    ...current,
    readinessHistory: [item, ...current.readinessHistory],
    xp: nextXp,
  });
}

export async function loadAthletes(): Promise<SessionUser[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, role, xp')
      .order('display_name');
    if (error) throw new Error(error.message);
    return (data || []).map((row) => ({
      id: row.id as string,
      email: '',
      displayName: (row.display_name as string) || 'Atleta',
      role: (row.role as UserRole) || 'ATHLETE',
      xp: (row.xp as number) || 0,
    }));
  }

  return Object.values(readLocalUsers()).map((u) => ({
    id: u.id,
    email: u.email,
    displayName: u.displayName,
    role: u.role,
    xp: u.xp,
  }));
}

export async function loadLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, xp')
      .order('xp', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map((row) => ({
      id: row.id as string,
      displayName: (row.display_name as string) || 'Atleta',
      xp: (row.xp as number) || 0,
      level: levelFromXp((row.xp as number) || 0),
    }));
  }

  return Object.values(readLocalUsers())
    .sort((a, b) => b.xp - a.xp)
    .map((u) => ({
      id: u.id,
      displayName: u.displayName,
      xp: u.xp,
      level: levelFromXp(u.xp),
    }));
}

function mapSetLog(row: Record<string, unknown>): SetLog {
  return {
    id: String(row.id),
    exerciseId: String(row.exercise_id),
    exerciseName: String(row.exercise_name),
    weight: Number(row.weight),
    reps: Number(row.reps),
    rpe: Number(row.rpe),
    estimated1RM: Number(row.estimated_1rm),
    volume: Number(row.volume),
    date: String(row.logged_date),
    time: String(row.logged_time),
  };
}

function mapReadiness(row: Record<string, unknown>): ReadinessLog {
  return {
    id: String(row.id),
    date: String(row.logged_date),
    sleepHours: Number(row.sleep_hours),
    sleepQuality: Number(row.sleep_quality),
    stressLevel: Number(row.stress_level),
    domsLevel: Number(row.doms_level),
    energyLevel: Number(row.energy_level),
    bodyWeight: row.body_weight == null ? undefined : Number(row.body_weight),
    readinessScore: Number(row.readiness_score),
    recommendation: String(row.recommendation),
  };
}

export { isSupabaseConfigured };
export async function saveCompletedWorkoutToSupabase(sessionData: {
  userId: string;
  dayName: string;
  totalVolume: number;
  exercisesCount: number;
}) {
  const supabase = getSupabase();
  if (!supabase) {
    // Fallback locale se Supabase non è attivo
    return { success: true, localOnly: true };
  }

  const { data, error } = await supabase
    .from('workout_history')
    .insert([
      {
        user_id: sessionData.userId,
        day_name: sessionData.dayName,
        total_volume: sessionData.totalVolume,
        exercises_count: sessionData.exercisesCount,
        completed_at: new Date().toISOString(),
      }
    ]);

  if (error) {
    console.error('Errore nel salvataggio dell allenamento:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
export async function getWorkoutHistoryFromSupabase(userId?: string) {
  const supabase = getSupabase();
  if (!supabase) return [];

  let query = supabase
    .from('workout_history')
    .select('*')
    .order('completed_at', { ascending: false });

  if (userId && userId !== 'default-user') {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Errore nel recupero dello storico allenamenti:', error.message);
    return [];
  }

  return data || [];
}