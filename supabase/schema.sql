-- Create trips table
create table public.trips (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  cities jsonb not null default '[]'::jsonb,
  start_date timestamp with time zone,
  total_days integer not null default 1,
  created_at timestamp with time zone not null default now(),
  constraint trips_pkey primary key (id)
);

-- Enable RLS
alter table public.trips enable row level security;

-- Policies
create policy "Users can view own trips"
  on public.trips for select
  using (auth.uid() = user_id);

create policy "Users can insert own trips"
  on public.trips for insert
  with check (auth.uid() = user_id);

create policy "Users can update own trips"
  on public.trips for update
  using (auth.uid() = user_id);

create policy "Users can delete own trips"
  on public.trips for delete
  using (auth.uid() = user_id);
