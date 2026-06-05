-- =============================================================================
-- Zar Labs — CMS content tables (text, images metadata, sections, animations)
-- Run AFTER: 20260606000000_zarlabs_website_schema.sql (or standalone — prerequisites below)
-- Project:   aaptopqqtxhbujbxgtzy
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- PREREQUISITES from migration 1 (no-op if you already ran 20260606000000)
-- Required for: page_sections.media_asset_id FK, get_page_bundle(), seed file
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.site_content (
  id            uuid primary key default gen_random_uuid(),
  field_key     text not null,
  page          text not null default 'global',
  section       text not null default '',
  content       jsonb not null default '{}'::jsonb,
  is_published  boolean not null default true,
  updated_at    timestamptz not null default now(),
  constraint site_content_field_key_unique unique (field_key)
);

create index if not exists site_content_page_idx
  on public.site_content (page, is_published);

create table if not exists public.media_assets (
  id          uuid primary key default gen_random_uuid(),
  bucket      text not null default 'site-media',
  path        text not null,
  public_url  text not null,
  file_type   text not null default 'image'
              check (file_type in ('image', 'video', 'document', 'other')),
  alt_text    text not null default '',
  size_bytes  bigint,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  constraint media_assets_bucket_path_unique unique (bucket, path)
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'video/mp4', 'video/webm']
)
on conflict (id) do nothing;

alter table public.site_content enable row level security;
alter table public.media_assets enable row level security;

drop policy if exists site_content_select_published on public.site_content;
create policy site_content_select_published
  on public.site_content for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists media_assets_select_public on public.media_assets;
create policy media_assets_select_public
  on public.media_assets for select
  to anon, authenticated
  using (true);

drop policy if exists site_media_public_read on storage.objects;
create policy site_media_public_read
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site-media');

-- -----------------------------------------------------------------------------
-- SITE SETTINGS (contact, social, calendly — single row)
-- -----------------------------------------------------------------------------
create table if not exists public.site_settings (
  id              uuid primary key default gen_random_uuid(),
  company_name    text not null default 'Zar Labs',
  tagline         text not null default '',
  email           text not null default '',
  phone           text not null default '',
  phone_display   text not null default '',
  location        text not null default '',
  calendly_url    text not null default '',
  instagram_url   text not null default '',
  twitter_url     text not null default '',
  metadata        jsonb not null default '{}'::jsonb,
  updated_at      timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- NAVIGATION LINKS
-- -----------------------------------------------------------------------------
create table if not exists public.navigation_links (
  id            uuid primary key default gen_random_uuid(),
  label         text not null,
  href          text not null,
  location      text not null default 'header'
                check (location in ('header', 'footer_company', 'footer_services', 'footer_resources', 'footer_legal')),
  sort_order    integer not null default 0,
  is_external   boolean not null default false,
  action        text check (action is null or action in ('calendly')),
  is_published  boolean not null default true,
  created_at    timestamptz not null default now()
);

create index if not exists navigation_links_location_sort_idx
  on public.navigation_links (location, sort_order)
  where is_published = true;

-- -----------------------------------------------------------------------------
-- PAGE SECTIONS (headlines, copy, media refs, animation toggles per section)
-- content jsonb shape examples:
--   {"text":"..."}
--   {"headline":"...","subheadline":"...","description":"..."}
--   {"enabled":true,"reduced_motion_fallback":true,"preset":"fade_blur_stagger"}
-- -----------------------------------------------------------------------------
create table if not exists public.page_sections (
  id                uuid primary key default gen_random_uuid(),
  section_key       text not null,
  page              text not null,
  section_type      text not null default 'text'
                    check (section_type in ('text', 'hero', 'kpi', 'cta', 'media', 'animation')),
  content           jsonb not null default '{}'::jsonb,
  media_asset_id    uuid references public.media_assets (id) on delete set null,
  sort_order        integer not null default 0,
  is_published      boolean not null default true,
  updated_at        timestamptz not null default now(),
  constraint page_sections_key_unique unique (section_key)
);

create index if not exists page_sections_page_idx
  on public.page_sections (page, is_published, sort_order);

-- -----------------------------------------------------------------------------
-- SERVICES (About sticky services + reusable service cards)
-- -----------------------------------------------------------------------------
create table if not exists public.services (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null,
  number_label  text not null default '',
  title         text not null,
  description   text not null default '',
  image_url     text not null default '',
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint services_slug_unique unique (slug)
);

create index if not exists services_published_sort_idx
  on public.services (is_published, sort_order);

-- -----------------------------------------------------------------------------
-- PRINCIPLES (About page accordion)
-- -----------------------------------------------------------------------------
create table if not exists public.principles (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null,
  title         text not null,
  description   text not null default '',
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  constraint principles_slug_unique unique (slug)
);

-- -----------------------------------------------------------------------------
-- WHAT WE DO (About bullet list)
-- -----------------------------------------------------------------------------
create table if not exists public.capability_items (
  id            uuid primary key default gen_random_uuid(),
  label         text not null,
  page          text not null default 'about',
  sort_order    integer not null default 0,
  is_published  boolean not null default true
);

-- -----------------------------------------------------------------------------
-- TESTIMONIALS
-- -----------------------------------------------------------------------------
create table if not exists public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null,
  name          text not null,
  role          text not null default '',
  quote         text not null,
  image_url     text not null default '',
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  constraint testimonials_slug_unique unique (slug)
);

create index if not exists testimonials_published_sort_idx
  on public.testimonials (is_published, sort_order);

-- -----------------------------------------------------------------------------
-- KPI STATS (homepage numbers)
-- -----------------------------------------------------------------------------
create table if not exists public.kpi_stats (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null,
  value         text not null,
  unit          text not null default '',
  description   text not null default '',
  icon          text not null default 'globe',
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  constraint kpi_stats_slug_unique unique (slug)
);

-- -----------------------------------------------------------------------------
-- FEATURED PROJECTS (homepage / works carousel mockups)
-- -----------------------------------------------------------------------------
create table if not exists public.featured_projects (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null,
  title         text not null,
  image_url     text not null,
  alt_text      text not null default '',
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  constraint featured_projects_slug_unique unique (slug)
);

-- -----------------------------------------------------------------------------
-- MARQUEE LOGOS (hero tech strip)
-- -----------------------------------------------------------------------------
create table if not exists public.marquee_logos (
  id            uuid primary key default gen_random_uuid(),
  label         text not null default '',
  image_url     text not null,
  sort_order    integer not null default 0,
  is_published  boolean not null default true
);

-- -----------------------------------------------------------------------------
-- TEAM MEMBERS
-- -----------------------------------------------------------------------------
create table if not exists public.team_members (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null,
  name          text not null,
  role          text not null default '',
  bio           text not null default '',
  photo_url     text not null default '',
  initials      text not null default '',
  instagram_url text not null default '',
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  constraint team_members_slug_unique unique (slug)
);

-- -----------------------------------------------------------------------------
-- TEAM UNITS (specialized teams — no individual photos)
-- -----------------------------------------------------------------------------
create table if not exists public.team_units (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null,
  title         text not null,
  description   text not null default '',
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  constraint team_units_slug_unique unique (slug)
);

-- -----------------------------------------------------------------------------
-- PARTNERS
-- -----------------------------------------------------------------------------
create table if not exists public.partners (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null,
  name            text not null,
  badge           text not null default '',
  headline        text not null default '',
  description     jsonb not null default '[]'::jsonb,
  capabilities    jsonb not null default '[]'::jsonb,
  logo_url        text not null default '',
  image_url       text not null default '',
  website_url     text,
  website_label   text not null default 'Visit Website',
  website_enabled boolean not null default true,
  instagram_url   text not null default '',
  accent          text not null default 'blue',
  sort_order      integer not null default 0,
  is_published    boolean not null default true,
  constraint partners_slug_unique unique (slug)
);

-- -----------------------------------------------------------------------------
-- FAQ
-- -----------------------------------------------------------------------------
create table if not exists public.faq_items (
  id            uuid primary key default gen_random_uuid(),
  question      text not null,
  answer        text not null,
  sort_order    integer not null default 0,
  is_published  boolean not null default true
);

-- -----------------------------------------------------------------------------
-- LEGAL PAGES (terms, privacy, cookies — editable HTML/markdown in jsonb)
-- -----------------------------------------------------------------------------
create table if not exists public.legal_pages (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null,
  title         text not null,
  content       jsonb not null default '{"blocks":[]}'::jsonb,
  is_published  boolean not null default true,
  updated_at    timestamptz not null default now(),
  constraint legal_pages_slug_unique unique (slug)
);

-- -----------------------------------------------------------------------------
-- ANIMATION PRESETS (optional CMS control — code still owns GSAP logic)
-- -----------------------------------------------------------------------------
create table if not exists public.animation_presets (
  id            uuid primary key default gen_random_uuid(),
  preset_key    text not null,
  target        text not null default 'global',
  config        jsonb not null default '{}'::jsonb,
  is_enabled    boolean not null default true,
  constraint animation_presets_key_unique unique (preset_key)
);

-- -----------------------------------------------------------------------------
-- UPDATED_AT TRIGGERS
-- -----------------------------------------------------------------------------
drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

drop trigger if exists page_sections_updated_at on public.page_sections;
create trigger page_sections_updated_at
  before update on public.page_sections
  for each row execute function public.set_updated_at();

drop trigger if exists services_updated_at on public.services;
create trigger services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

drop trigger if exists legal_pages_updated_at on public.legal_pages;
create trigger legal_pages_updated_at
  before update on public.legal_pages
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY — public read, insert-only for forms (from prior migration)
-- -----------------------------------------------------------------------------
alter table public.site_settings enable row level security;
alter table public.navigation_links enable row level security;
alter table public.page_sections enable row level security;
alter table public.services enable row level security;
alter table public.principles enable row level security;
alter table public.capability_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.kpi_stats enable row level security;
alter table public.featured_projects enable row level security;
alter table public.marquee_logos enable row level security;
alter table public.team_members enable row level security;
alter table public.team_units enable row level security;
alter table public.partners enable row level security;
alter table public.faq_items enable row level security;
alter table public.legal_pages enable row level security;
alter table public.animation_presets enable row level security;

-- Public read policies (published content only)
do $$
declare
  t text;
begin
  foreach t in array array[
    'site_settings',
    'navigation_links',
    'page_sections',
    'services',
    'principles',
    'capability_items',
    'testimonials',
    'kpi_stats',
    'featured_projects',
    'marquee_logos',
    'team_members',
    'team_units',
    'partners',
    'faq_items',
    'legal_pages'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', t || '_select_public', t);
    if t = 'site_settings' then
      execute format(
        'create policy %I on public.%I for select to anon, authenticated using (true)',
        t || '_select_public', t
      );
    else
      execute format(
        'create policy %I on public.%I for select to anon, authenticated using (is_published = true)',
        t || '_select_public', t
      );
    end if;
  end loop;
end $$;

drop policy if exists animation_presets_select_public on public.animation_presets;
create policy animation_presets_select_public
  on public.animation_presets for select
  to anon, authenticated
  using (is_enabled = true);

-- -----------------------------------------------------------------------------
-- FAST FETCH: one RPC per page (fewer round trips = faster TTFB)
-- -----------------------------------------------------------------------------
create or replace function public.get_page_bundle(p_page text)
returns jsonb
language sql
stable
security invoker
as $$
  select jsonb_build_object(
    'sections', coalesce((
      select jsonb_agg(to_jsonb(ps) order by ps.sort_order)
      from public.page_sections ps
      where ps.page = p_page and ps.is_published = true
    ), '[]'::jsonb),
    'site_content', coalesce((
      select jsonb_object_agg(sc.field_key, sc.content)
      from public.site_content sc
      where sc.page = p_page and sc.is_published = true
    ), '{}'::jsonb)
  );
$$;

create or replace function public.get_home_bundle()
returns jsonb
language sql
stable
security invoker
as $$
  select jsonb_build_object(
    'settings', (select to_jsonb(s) from public.site_settings s limit 1),
    'sections', coalesce((
      select jsonb_agg(to_jsonb(ps) order by ps.sort_order)
      from public.page_sections ps
      where ps.page = 'home' and ps.is_published = true
    ), '[]'::jsonb),
    'kpi_stats', coalesce((
      select jsonb_agg(to_jsonb(k) order by k.sort_order)
      from public.kpi_stats k where k.is_published = true
    ), '[]'::jsonb),
    'testimonials', coalesce((
      select jsonb_agg(to_jsonb(t) order by t.sort_order)
      from public.testimonials t where t.is_published = true
    ), '[]'::jsonb),
    'featured_projects', coalesce((
      select jsonb_agg(to_jsonb(fp) order by fp.sort_order)
      from public.featured_projects fp where fp.is_published = true
    ), '[]'::jsonb),
    'marquee_logos', coalesce((
      select jsonb_agg(to_jsonb(ml) order by ml.sort_order)
      from public.marquee_logos ml where ml.is_published = true
    ), '[]'::jsonb),
    'animation_presets', coalesce((
      select jsonb_object_agg(ap.preset_key, ap.config)
      from public.animation_presets ap where ap.is_enabled = true
    ), '{}'::jsonb)
  );
$$;

grant execute on function public.get_page_bundle(text) to anon, authenticated;
grant execute on function public.get_home_bundle() to anon, authenticated;
