-- Style Catalog — trending looks (admin prompts hidden, user uploads photo)

create table if not exists public.social_engine_style_catalog (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  description     text,
  category        text not null default 'trending',
  tags            text[] not null default '{}',
  preview_url     text not null,
  reference_url   text,
  prompt          text not null,
  negative_prompt text default '',
  fal_model       text not null default 'fal-ai/flux/dev/image-to-image',
  fal_params      jsonb not null default '{"strength":0.65,"num_inference_steps":28}'::jsonb,
  requires_face   boolean not null default true,
  trending_score  integer not null default 0,
  usage_count     integer not null default 0,
  status          text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists social_engine_style_catalog_status_idx
  on public.social_engine_style_catalog (status, trending_score desc);

create table if not exists public.social_engine_catalog_generations (
  id           uuid primary key default gen_random_uuid(),
  member_id    uuid references public.social_engine_members(id) on delete set null,
  owner_email  text not null,
  catalog_id   uuid references public.social_engine_style_catalog(id) on delete set null,
  upload_url   text,
  result_url   text not null,
  plan         text,
  created_at   timestamptz not null default now()
);

create index if not exists social_engine_catalog_generations_owner_idx
  on public.social_engine_catalog_generations (owner_email, created_at desc);

alter table public.social_engine_style_catalog enable row level security;
alter table public.social_engine_catalog_generations enable row level security;
