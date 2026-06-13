-- Run in Supabase SQL Editor if `supabase db push` is unavailable.
-- Combines profiles, schedules, chat, images (migration 20260613110000).

alter table public.social_engine_members
  add column if not exists subscription_plan text not null default 'free'
    check (subscription_plan in ('free', 'pro', 'included', 'enterprise', 'disabled')),
  add column if not exists token_budget_monthly integer,
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text;

create table if not exists public.social_engine_member_profiles (
  id                      uuid primary key default gen_random_uuid(),
  member_id               uuid not null unique references public.social_engine_members(id) on delete cascade,
  auth_user_id              uuid,
  display_name              text,
  timezone                  text not null default 'Asia/Karachi',
  business_niche            text,
  primary_channels          text[] default '{}',
  growth_goal               text,
  onboarding_completed_at   timestamptz,
  integrations              jsonb not null default '{"google_calendar":{"status":"not_connected","calendar_id":"","connected_at":null}}'::jsonb,
  byok_keys                 jsonb not null default '{}'::jsonb,
  preferences               jsonb not null default '{}'::jsonb,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create table if not exists public.social_engine_post_schedules (
  id                uuid primary key default gen_random_uuid(),
  member_id         uuid not null references public.social_engine_members(id) on delete cascade,
  channel           text not null default 'LinkedIn',
  post_title        text not null,
  brief             text,
  cta_link          text,
  scheduled_at      timestamptz not null,
  timezone          text not null default 'Asia/Karachi',
  reminder_sent_at  timestamptz,
  status            text not null default 'scheduled'
    check (status in ('scheduled', 'posted', 'skipped', 'missed')),
  created_at        timestamptz not null default now()
);

create table if not exists public.social_engine_chat_sessions (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references public.social_engine_members(id) on delete cascade,
  title       text not null default 'Strategy chat',
  messages    jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.social_engine_generated_images (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references public.social_engine_members(id) on delete cascade,
  prompt      text not null,
  brief       jsonb,
  image_url   text not null,
  model       text not null default 'fal-ai/flux/schnell',
  plan        text,
  created_at  timestamptz not null default now()
);

-- Per-user calendars + usage (migration 20260614100000)

create table if not exists public.social_engine_member_calendars (
  id           uuid primary key default gen_random_uuid(),
  owner_email  text not null,
  member_id    uuid references public.social_engine_members(id) on delete set null,
  data         jsonb not null default '{}'::jsonb,
  updated_at   timestamptz not null default now(),
  constraint social_engine_member_calendars_email_unique unique (owner_email)
);

create table if not exists public.social_engine_usage_monthly (
  id               uuid primary key default gen_random_uuid(),
  owner_email      text not null,
  month_key        text not null,
  chat_messages    integer not null default 0,
  week_plans       integer not null default 0,
  image_briefs     integer not null default 0,
  images_generated integer not null default 0,
  reminders_sent   integer not null default 0,
  total_tokens     bigint not null default 0,
  requests         integer not null default 0,
  by_provider      jsonb not null default '{}'::jsonb,
  updated_at       timestamptz not null default now(),
  constraint social_engine_usage_monthly_unique unique (owner_email, month_key)
);

-- Style Catalog (migration 20260614120000)

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
