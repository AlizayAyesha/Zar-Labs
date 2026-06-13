-- Per-user publishing calendars + monthly usage metering (Free / Pro tiers)

create table if not exists public.social_engine_member_calendars (
  id           uuid primary key default gen_random_uuid(),
  owner_email  text not null,
  member_id    uuid references public.social_engine_members(id) on delete set null,
  data         jsonb not null default '{}'::jsonb,
  updated_at   timestamptz not null default now(),
  constraint social_engine_member_calendars_email_unique unique (owner_email)
);

create index if not exists social_engine_member_calendars_member_idx
  on public.social_engine_member_calendars (member_id);

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

create index if not exists social_engine_usage_monthly_month_idx
  on public.social_engine_usage_monthly (month_key);

alter table public.social_engine_member_calendars enable row level security;
alter table public.social_engine_usage_monthly enable row level security;
