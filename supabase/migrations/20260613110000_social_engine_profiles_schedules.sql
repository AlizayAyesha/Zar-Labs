-- Social Engine: profiles, subscription tiers, schedules, chat sessions, generated images

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

create index if not exists social_engine_member_profiles_auth_user_idx
  on public.social_engine_member_profiles (auth_user_id);

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

create index if not exists social_engine_post_schedules_due_idx
  on public.social_engine_post_schedules (scheduled_at, status)
  where status = 'scheduled';

create index if not exists social_engine_post_schedules_member_idx
  on public.social_engine_post_schedules (member_id);

create table if not exists public.social_engine_chat_sessions (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references public.social_engine_members(id) on delete cascade,
  title       text not null default 'Strategy chat',
  messages    jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists social_engine_chat_sessions_member_idx
  on public.social_engine_chat_sessions (member_id, updated_at desc);

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

create index if not exists social_engine_generated_images_member_idx
  on public.social_engine_generated_images (member_id, created_at desc);

alter table public.social_engine_member_profiles enable row level security;
alter table public.social_engine_post_schedules enable row level security;
alter table public.social_engine_chat_sessions enable row level security;
alter table public.social_engine_generated_images enable row level security;
