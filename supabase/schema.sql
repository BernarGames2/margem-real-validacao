-- Página de validação Margem Real (Fases 17 e 18) · versão 1
-- Rode uma vez no SQL Editor do seu projeto Supabase (região South America (São Paulo), sa-east-1).
-- O site só consegue GRAVAR nestas tabelas; ler, alterar e apagar fica com você, no painel do Supabase.

create table if not exists public.leads (
  id              bigint generated always as identity primary key,
  criado_em       timestamptz not null default now(),
  variante        text not null check (variante in ('a', 'b', 'c')),
  nome            text not null check (char_length(btrim(nome)) between 2 and 120),
  email           text not null check (char_length(email) <= 160 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  whatsapp        text not null check (whatsapp ~ '^55[1-9]{2}[0-9]{8,9}$'),
  marketplace     text not null check (marketplace in ('Mercado Livre', 'Shopee', 'Mercado Livre e Shopee', 'Só Amazon', 'Só loja própria ou outros')),
  faturamento     text not null check (faturamento in ('Menos de R$ 50 mil', 'R$ 50 a 200 mil', 'R$ 200 a 500 mil', 'R$ 500 mil a 1 milhão', 'Mais de R$ 1 milhão')),
  anuncios        text not null check (anuncios in ('Sim', 'Não')),
  ferramenta      text check (ferramenta in ('Planilha', 'Bling', 'UpSeller', 'Tiny (Olist)', 'Base', 'Outro ERP', 'Nenhuma')),
  maior_dor       text check (maior_dor in ('Custo de anúncio por produto', 'Saber que preço cobrar e o que pausar', 'Cobranças erradas do marketplace', 'Impostos e reforma tributária', 'Outro')),
  consentimento   boolean not null check (consentimento),
  utm_source      text check (char_length(utm_source) <= 100),
  utm_medium      text check (char_length(utm_medium) <= 100),
  utm_campaign    text check (char_length(utm_campaign) <= 100),
  referencia      text check (char_length(referencia) <= 200),
  armadilha       text check (armadilha is null or armadilha = ''),
  -- 3 dos 5 critérios do perfil; CNPJ e quem decide são confirmados na conversa
  perfil_provavel boolean generated always as (
    marketplace in ('Mercado Livre', 'Shopee', 'Mercado Livre e Shopee')
    and faturamento in ('R$ 50 a 200 mil', 'R$ 200 a 500 mil', 'R$ 500 mil a 1 milhão')
    and anuncios = 'Sim'
  ) stored
);

create table if not exists public.eventos (
  id           bigint generated always as identity primary key,
  criado_em    timestamptz not null default now(),
  tipo         text not null check (tipo in ('visita', 'clique_cta', 'inicio_formulario')),
  variante     text not null check (variante in ('a', 'b', 'c')),
  utm_source   text check (char_length(utm_source) <= 100),
  utm_medium   text check (char_length(utm_medium) <= 100),
  utm_campaign text check (char_length(utm_campaign) <= 100),
  referencia   text check (char_length(referencia) <= 200)
);

-- Segurança: o visitante (papel anon) só insere; nunca lê, altera ou apaga.
alter table public.leads enable row level security;
alter table public.eventos enable row level security;

revoke all on table public.leads from anon, authenticated;
revoke all on table public.eventos from anon, authenticated;
grant insert on table public.leads to anon;
grant insert on table public.eventos to anon;

drop policy if exists "site grava leads" on public.leads;
create policy "site grava leads" on public.leads
  for insert to anon
  with check (consentimento and (armadilha is null or armadilha = ''));

drop policy if exists "site grava eventos" on public.eventos;
create policy "site grava eventos" on public.eventos
  for insert to anon
  with check (tipo in ('visita', 'clique_cta', 'inicio_formulario'));
