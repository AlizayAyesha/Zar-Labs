-- Social Engine members — Social tab access without full dashboard admin

create table if not exists public.social_engine_members (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  tenant_id   text not null default 'zar-labs',
  role        text not null default 'editor'
              check (role in ('owner', 'editor', 'viewer')),
  status      text not null default 'active'
              check (status in ('active', 'invited', 'disabled')),
  created_at  timestamptz not null default now(),
  constraint social_engine_members_email_unique unique (email)
);

create index if not exists social_engine_members_status_idx
  on public.social_engine_members (status);

alter table public.social_engine_members enable row level security;

-- Server uses service role; no public policies

create table if not exists public.social_engine_tenants (
  id          text primary key,
  name        text not null,
  slug        text not null unique,
  brand_config jsonb not null default '{}'::jsonb,
  plan        text not null default 'internal',
  token_budget_monthly integer not null default 100000,
  created_at  timestamptz not null default now()
);

insert into public.social_engine_tenants (id, name, slug, plan)
values ('zar-labs', 'Zar Labs', 'zar-labs', 'internal')
on conflict (id) do nothing;
