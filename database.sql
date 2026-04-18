-- Theralink — Schema do banco de dados

create table psicologos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text unique not null,
  senha text not null,
  crp text,
  foto_url text,
  criado_em timestamptz default now()
);

create table pacientes (
  id uuid primary key default gen_random_uuid(),
  psicologo_id uuid references psicologos(id) on delete cascade,
  nome text not null,
  email text,
  telefone text,
  data_nascimento date,
  convenio text,
  ativo boolean default true,
  criado_em timestamptz default now()
);

create table prontuarios (
  id uuid primary key default gen_random_uuid(),
  psicologo_id uuid references psicologos(id) on delete cascade,
  paciente_id uuid references pacientes(id) on delete cascade,
  titulo text not null,
  conteudo text,
  tipo text default 'sessao', -- sessao, avaliacao, evolucao
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

create table sessoes (
  id uuid primary key default gen_random_uuid(),
  psicologo_id uuid references psicologos(id) on delete cascade,
  paciente_id uuid references pacientes(id) on delete cascade,
  data_hora timestamptz not null,
  duracao_min int default 50,
  modalidade text default 'online', -- online, presencial
  status text default 'agendada', -- agendada, realizada, cancelada
  valor numeric(10,2),
  sala_video text,
  criado_em timestamptz default now()
);

create table pagamentos (
  id uuid primary key default gen_random_uuid(),
  psicologo_id uuid references psicologos(id) on delete cascade,
  paciente_id uuid references pacientes(id) on delete cascade,
  sessao_id uuid references sessoes(id),
  valor numeric(10,2) not null,
  status text default 'pendente', -- pendente, pago, cancelado
  stripe_session_id text,
  criado_em timestamptz default now()
);

create table mensagens (
  id uuid primary key default gen_random_uuid(),
  psicologo_id uuid references psicologos(id) on delete cascade,
  paciente_id uuid references pacientes(id) on delete cascade,
  conteudo text not null,
  remetente text not null, -- 'psicologo' ou 'paciente'
  lida boolean default false,
  criado_em timestamptz default now()
);
