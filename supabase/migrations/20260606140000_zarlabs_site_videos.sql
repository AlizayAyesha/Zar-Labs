-- =============================================================================
-- Zar Labs — site videos registry (serve from Supabase Storage CDN)
-- Run AFTER: 20260606120000_zarlabs_cms_content_tables.sql
-- Upload files: npm run upload:videos
-- =============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Allow .mov uploads in site-media bucket
update storage.buckets
set
  file_size_limit = 104857600, -- 100 MB
  allowed_mime_types = array[
    'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif',
    'video/mp4', 'video/webm', 'video/quicktime'
  ]
where id = 'site-media';

-- -----------------------------------------------------------------------------
-- SITE VIDEOS
-- storage_path = path inside bucket `site-media` (no leading slash)
-- local_fallback = dev fallback before upload completes
-- -----------------------------------------------------------------------------
create table if not exists public.site_videos (
  id              uuid primary key default gen_random_uuid(),
  video_key       text not null,
  title           text not null default '',
  storage_path    text not null,
  local_fallback  text not null default '',
  poster_path     text,
  mime_type       text not null default 'video/mp4',
  page            text not null default 'home',
  section         text not null default '',
  autoplay        boolean not null default true,
  loop            boolean not null default true,
  muted           boolean not null default true,
  preload         text not null default 'auto'
                  check (preload in ('auto', 'metadata', 'none')),
  sort_order      integer not null default 0,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint site_videos_key_unique unique (video_key)
);

create index if not exists site_videos_page_sort_idx
  on public.site_videos (page, is_published, sort_order);

drop trigger if exists site_videos_updated_at on public.site_videos;
create trigger site_videos_updated_at
  before update on public.site_videos
  for each row execute function public.set_updated_at();

alter table public.site_videos enable row level security;

drop policy if exists site_videos_select_public on public.site_videos;
create policy site_videos_select_public
  on public.site_videos for select
  to anon, authenticated
  using (is_published = true);

-- Seed — public_url is built in app: {SUPABASE_URL}/storage/v1/object/public/site-media/{storage_path}
insert into public.site_videos (
  video_key, title, storage_path, local_fallback, mime_type, page, section, sort_order
) values
  (
    'home.services',
    'Services showcase',
    'videos/serviceshighquality.mp4',
    '/videos/serviceshighquality.mp4',
    'video/mp4',
    'home',
    'services',
    1
  ),
  (
    'home.techstack.logos',
    'Tech stack logos animation',
    'videos/logos.mp4',
    '/videos/logos.mp4',
    'video/mp4',
    'home',
    'techstack',
    2
  ),
  (
    'works.casestudy.demo',
    'Case study demo reel',
    'videos/casestudytestvideo.mov',
    '/casestudy/casestudytestvideo.mov',
    'video/quicktime',
    'works',
    'casestudy',
    3
  )
on conflict (video_key) do update set
  title = excluded.title,
  storage_path = excluded.storage_path,
  local_fallback = excluded.local_fallback,
  mime_type = excluded.mime_type,
  page = excluded.page,
  section = excluded.section,
  sort_order = excluded.sort_order,
  updated_at = now();

-- Mirror in media_assets for CMS / admin views
insert into public.media_assets (bucket, path, public_url, file_type, alt_text) values
  ('site-media', 'videos/serviceshighquality.mp4', '/videos/serviceshighquality.mp4', 'video', 'Services showcase'),
  ('site-media', 'videos/logos.mp4', '/videos/logos.mp4', 'video', 'Tech stack logos animation'),
  ('site-media', 'videos/casestudytestvideo.mov', '/casestudy/casestudytestvideo.mov', 'video', 'Case study demo reel')
on conflict (bucket, path) do update set
  public_url = excluded.public_url,
  alt_text = excluded.alt_text,
  file_type = excluded.file_type;

-- Include videos in home bundle RPC
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
    'site_videos', coalesce((
      select jsonb_agg(to_jsonb(sv) order by sv.sort_order)
      from public.site_videos sv
      where sv.page = 'home' and sv.is_published = true
    ), '[]'::jsonb),
    'animation_presets', coalesce((
      select jsonb_object_agg(ap.preset_key, ap.config)
      from public.animation_presets ap where ap.is_enabled = true
    ), '{}'::jsonb)
  );
$$;

grant execute on function public.get_home_bundle() to anon, authenticated;
