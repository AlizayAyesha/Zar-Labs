-- =============================================================================
-- Zar Labs — Dashboard auth (admins allowlist + audit log)
-- Project: aaptopqqtxhbujbxgtzy
--
-- RUN IN: Supabase Dashboard → SQL Editor → New query → Run
-- Or:     npx supabase db push   (after supabase link)
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Dashboard admin allowlist (must match ADMIN_EMAILS in .env.local)
-- -----------------------------------------------------------------------------
create table if not exists public.dashboard_admins (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  display_name  text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  constraint dashboard_admins_email_unique unique (email)
);

create index if not exists dashboard_admins_active_idx
  on public.dashboard_admins (is_active) where is_active = true;

insert into public.dashboard_admins (email, display_name) values
  ('sherlockholme898@gmail.com', 'Alizay Ayesha'),
  ('zarlabsteam@gmail.com', 'Zar Labs Team')
on conflict (email) do update set
  display_name = excluded.display_name,
  is_active = true;

alter table public.dashboard_admins enable row level security;

-- No anon/authenticated policies — service role / SQL editor only
revoke all on public.dashboard_admins from anon, authenticated;
grant select on public.dashboard_admins to service_role;

-- -----------------------------------------------------------------------------
-- 2. Auth audit log (login, reset, failed attempts)
-- -----------------------------------------------------------------------------
create table if not exists public.dashboard_auth_audit (
  id          uuid primary key default gen_random_uuid(),
  event_type  text not null check (event_type in (
    'login_success',
    'login_failed',
    'logout',
    'password_reset_requested',
    'password_reset_completed',
    'session_expired'
  )),
  email       text,
  user_id     uuid references auth.users (id) on delete set null,
  ip_address  text,
  user_agent  text,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists dashboard_auth_audit_created_at_idx
  on public.dashboard_auth_audit (created_at desc);

create index if not exists dashboard_auth_audit_email_idx
  on public.dashboard_auth_audit (email);

alter table public.dashboard_auth_audit enable row level security;

revoke all on public.dashboard_auth_audit from anon, authenticated;
grant insert, select on public.dashboard_auth_audit to service_role;

-- -----------------------------------------------------------------------------
-- 3. Helper: is this email a dashboard admin?
-- -----------------------------------------------------------------------------
create or replace function public.is_dashboard_admin(check_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.dashboard_admins
    where lower(email) = lower(check_email)
      and is_active = true
  );
$$;

revoke all on function public.is_dashboard_admin(text) from public;
grant execute on function public.is_dashboard_admin(text) to service_role;

-- -----------------------------------------------------------------------------
-- 4. Helper: log auth event (call from API routes with service role)
-- -----------------------------------------------------------------------------
create or replace function public.log_dashboard_auth_event(
  p_event_type text,
  p_email text default null,
  p_user_id uuid default null,
  p_ip_address text default null,
  p_user_agent text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.dashboard_auth_audit (
    event_type, email, user_id, ip_address, user_agent, metadata
  ) values (
    p_event_type, p_email, p_user_id, p_ip_address, p_user_agent, p_metadata
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.log_dashboard_auth_event(text, text, uuid, text, text, jsonb) from public;
grant execute on function public.log_dashboard_auth_event(text, text, uuid, text, text, jsonb) to service_role;

-- -----------------------------------------------------------------------------
-- 5. View: recent auth events (for dashboard security page later)
-- -----------------------------------------------------------------------------
create or replace view public.dashboard_auth_audit_recent as
select
  id,
  event_type,
  email,
  user_id,
  ip_address,
  created_at
from public.dashboard_auth_audit
order by created_at desc
limit 500;

revoke all on public.dashboard_auth_audit_recent from anon, authenticated;
grant select on public.dashboard_auth_audit_recent to service_role;
