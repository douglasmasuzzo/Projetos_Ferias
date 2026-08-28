-- Execute este script no SQL Editor do Supabase

-- Tipos de atividade definidos pelo usuário (substitui as categorias fixas)
create table activity_types (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  color text not null default '#b8ad8f',
  created_at timestamptz default now()
);

-- Blocos da grade semanal (dia + horário + tipo de atividade escolhido)
create table schedule_slots (
  id uuid primary key default gen_random_uuid(),
  day text not null,
  time_slot text not null,
  activity_type_id uuid references activity_types(id) on delete set null,
  updated_at timestamptz default now(),
  unique (day, time_slot)
);

-- Prioridades da semana
create table priorities (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  done boolean default false,
  priority_level text not null default 'media' check (priority_level in ('baixa', 'media', 'alta')),
  created_at timestamptz default now()
);

-- Habilita acesso público de leitura/escrita (uso pessoal, sem autenticação de usuários)
alter table activity_types enable row level security;
alter table schedule_slots enable row level security;
alter table priorities enable row level security;

create policy "Acesso público total" on activity_types for all using (true) with check (true);
create policy "Acesso público total" on schedule_slots for all using (true) with check (true);
create policy "Acesso público total" on priorities for all using (true) with check (true);

-- Tipos de atividade padrão (seed inicial)
insert into activity_types (label, color) values
  ('Trabalho', '#c8674f'),
  ('Estudos', '#4a7c6c'),
  ('Projeto', '#7a6ba6'),
  ('Livre', '#b8ad8f');
