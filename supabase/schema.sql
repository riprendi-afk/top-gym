-- Esegui questo script nell'editor SQL di Supabase (SQL Editor → New query).
-- Poi in Authentication → Providers verifica che Email sia attivo.
-- Per test rapidi: Authentication → Providers → Email → disattiva "Confirm email".

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null,
  role text not null default 'ATHLETE' check (role in ('ATHLETE', 'COACH')),
  xp integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.programs (
  user_id uuid primary key references public.profiles on delete cascade,
  name text not null default 'Scheda Personale',
  days_count integer not null default 4,
  days jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.set_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  exercise_id text not null,
  exercise_name text not null,
  weight numeric not null,
  reps integer not null,
  rpe numeric not null,
  estimated_1rm numeric not null,
  volume numeric not null,
  logged_date date not null,
  logged_time text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.readiness_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  logged_date date not null,
  sleep_hours numeric not null,
  sleep_quality integer not null,
  stress_level integer not null,
  doms_level integer not null,
  energy_level integer not null,
  body_weight numeric,
  readiness_score integer not null,
  recommendation text not null,
  created_at timestamptz not null default now()
);

create index if not exists set_logs_user_created_idx on public.set_logs (user_id, created_at desc);
create index if not exists readiness_logs_user_created_idx on public.readiness_logs (user_id, created_at desc);
create index if not exists profiles_xp_idx on public.profiles (xp desc);

alter table public.profiles enable row level security;
alter table public.programs enable row level security;
alter table public.set_logs enable row level security;
alter table public.readiness_logs enable row level security;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select to authenticated using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "programs_select" on public.programs;
create policy "programs_select" on public.programs
  for select to authenticated using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'COACH')
  );

drop policy if exists "programs_write" on public.programs;
create policy "programs_write" on public.programs
  for all to authenticated using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'COACH')
  )
  with check (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'COACH')
  );

drop policy if exists "set_logs_select" on public.set_logs;
create policy "set_logs_select" on public.set_logs
  for select to authenticated using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'COACH')
  );

drop policy if exists "set_logs_insert" on public.set_logs;
create policy "set_logs_insert" on public.set_logs
  for insert to authenticated with check (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'COACH')
  );

drop policy if exists "readiness_select" on public.readiness_logs;
create policy "readiness_select" on public.readiness_logs
  for select to authenticated using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'COACH')
  );

drop policy if exists "readiness_insert" on public.readiness_logs;
create policy "readiness_insert" on public.readiness_logs
  for insert to authenticated with check (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'COACH')
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'Atleta')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
