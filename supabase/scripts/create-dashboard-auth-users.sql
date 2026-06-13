-- =============================================================================
-- CREATE DASHBOARD AUTH USERS (run ONCE in Supabase SQL Editor)
-- Project: https://supabase.com/dashboard/project/aaptopqqtxhbujbxgtzy
--
-- BEFORE RUNNING:
-- 1. Run migration: 20260612100000_dashboard_auth.sql (or full db push)
-- 2. Change temp passwords below
-- 3. Run this entire file
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Admin 1: sherlockholme898@gmail.com
-- -----------------------------------------------------------------------------
do $$
declare
  v_user_id uuid := gen_random_uuid();
  v_email text := 'sherlockholme898@gmail.com';
  v_password text := 'ChangeMe_ZarLabs_2026!';  -- ← CHANGE THIS
begin
  if exists (select 1 from auth.users where email = v_email) then
    raise notice 'User % already exists — skip or delete in Auth → Users first', v_email;
  else
    insert into auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change
    ) values (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      v_email,
      crypt(v_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"dashboard_admin"}'::jsonb,
      '{"full_name":"Alizay Ayesha"}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    insert into auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      gen_random_uuid(),
      v_user_id,
      v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email),
      'email',
      now(),
      now(),
      now()
    );

    raise notice 'Created user % with temp password (change after first login)', v_email;
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- Admin 2: zarlabsteam@gmail.com
-- -----------------------------------------------------------------------------
do $$
declare
  v_user_id uuid := gen_random_uuid();
  v_email text := 'zarlabsteam@gmail.com';
  v_password text := 'ChangeMe_ZarLabs_2026!';  -- ← CHANGE THIS
begin
  if exists (select 1 from auth.users where email = v_email) then
    raise notice 'User % already exists — skip', v_email;
  else
    insert into auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change
    ) values (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      v_email,
      crypt(v_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"dashboard_admin"}'::jsonb,
      '{"full_name":"Zar Labs Team"}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    insert into auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      gen_random_uuid(),
      v_user_id,
      v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email),
      'email',
      now(),
      now(),
      now()
    );

    raise notice 'Created user % with temp password', v_email;
  end if;
end $$;

-- Verify
select id, email, email_confirmed_at, created_at
from auth.users
where email in ('sherlockholme898@gmail.com', 'zarlabsteam@gmail.com');

select email, display_name, is_active from public.dashboard_admins;
