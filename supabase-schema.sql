-- Criar tabela de transações
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text check (type in ('income', 'expense')) not null,
  amount numeric(12, 2) not null check (amount > 0),
  date date not null,
  category text not null,
  description text not null,
  created_at timestamptz default now() not null
);

-- Ativar Row Level Security
alter table transactions enable row level security;

-- Política: usuário só acessa seus próprios dados
create policy "usuarios acessam apenas suas transacoes"
  on transactions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Índice para melhorar performance dos filtros por data
create index if not exists transactions_user_date_idx on transactions (user_id, date desc);
