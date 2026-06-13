-- =============================================================================
-- ZAR LABS — FIX DASHBOARD LOGIN (paste ONLY this file in Supabase SQL Editor)
-- Dashboard: https://supabase.com/dashboard/project/aaptopqqtxhbujbxgtzy/sql/new
--
-- After running, sign in at https://zar-labs.vercel.app/dashboard/login
--   Email:    sherlockholme898@gmail.com
--   Password: ChangeMe_ZarLabs_2026!
-- =============================================================================

create extension if not exists "pgcrypto";

-- Admin allowlist (safe if migration already ran)
create table if not exists public.dashboard_admins (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  display_name  text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  constraint dashboard_admins_email_unique unique (email)
);

insert into public.dashboard_admins (email, display_name) values
  ('sherlockholme898@gmail.com', 'Alizay Ayesha'),
  ('zarlabsteam@gmail.com', 'Zar Labs Team')
on conflict (email) do update set is_active = true;

-- Lock down: RLS on, no public API access (service role only)
alter table public.dashboard_admins enable row level security;
revoke all on public.dashboard_admins from anon, authenticated;
grant select on public.dashboard_admins to service_role;

-- -----------------------------------------------------------------------------
-- Create OR reset password for sherlockholme898@gmail.com
-- -----------------------------------------------------------------------------
do $$
declare
  v_user_id uuid;
  v_email text := 'sherlockholme898@gmail.com';
  v_password text := 'ChangeMe_ZarLabs_2026!';
begin
  select id into v_user_id from auth.users where email = v_email;

  if v_user_id is null then
    v_user_id := gen_random_uuid();

    insert into auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated', v_email,
      crypt(v_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"role":"dashboard_admin"}'::jsonb,
      '{"full_name":"Alizay Ayesha"}'::jsonb,
      now(), now(), '', '', '', ''
    );

    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email),
      'email', now(), now(), now()
    );

    raise notice 'CREATED user % — password: %', v_email, v_password;
  else
    update auth.users
    set
      encrypted_password = crypt(v_password, gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      updated_at = now()
    where id = v_user_id;

    if not exists (select 1 from auth.identities where user_id = v_user_id and provider = 'email') then
      insert into auth.identities (
        id, user_id, provider_id, identity_data, provider,
        last_sign_in_at, created_at, updated_at
      ) values (
        gen_random_uuid(), v_user_id, v_user_id::text,
        jsonb_build_object('sub', v_user_id::text, 'email', v_email),
        'email', now(), now(), now()
      );
    end if;

    raise notice 'RESET password for % — new password: %', v_email, v_password;
  end if;
end $$;

-- Verify
select id, email, email_confirmed_at, last_sign_in_at
from auth.users
where email = 'sherlockholme898@gmail.com';

select email, is_active from public.dashboard_admins
where email = 'sherlockholme898@gmail.com';
