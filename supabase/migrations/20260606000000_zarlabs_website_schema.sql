-- =============================================================================
-- Zar Labs Website — Supabase schema
-- Run in: Supabase Dashboard → SQL Editor (project: aaptopqqtxhbujbxgtzy)
-- Or:     npx supabase db push   (after supabase login + link)
-- =============================================================================

-- Extensions
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. NEWSLETTER SUBSCRIBERS
-- -----------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  status        text not null default 'active'
                check (status in ('active', 'unsubscribed', 'bounced')),
  source        text not null default 'footer'
                check (source in ('footer', 'homepage', 'works', 'popup', 'other')),
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  unsubscribed_at timestamptz,
  constraint newsletter_subscribers_email_unique unique (email)
);

create index if not exists newsletter_subscribers_status_idx
  on public.newsletter_subscribers (status);

create index if not exists newsletter_subscribers_created_at_idx
  on public.newsletter_subscribers (created_at desc);

-- -----------------------------------------------------------------------------
-- 2. FORM SUBMISSIONS (contact, project intake, calendly, etc.)
-- -----------------------------------------------------------------------------
create table if not exists public.form_submissions (
  id          uuid primary key default gen_random_uuid(),
  source      text not null
              check (source in (
                'contact',
                'subscription',
                'project_intake',
                'meeting_booking',
                'documentation_request'
              )),
  subject     text not null default '',
  email       text not null,
  full_name   text,
  payload     jsonb not null default '{}'::jsonb,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists form_submissions_source_created_idx
  on public.form_submissions (source, created_at desc);

create index if not exists form_submissions_email_idx
  on public.form_submissions (email);

-- -----------------------------------------------------------------------------
-- 3. CASE STUDIES / INSIGHTS (Read More pages)
-- -----------------------------------------------------------------------------
create table if not exists public.case_studies (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null,
  category        text not null,
  title           text not null,
  excerpt         text not null default '',
  summary         text not null default '',
  challenge       text not null default '',
  solution        text not null default '',
  results         jsonb not null default '[]'::jsonb,
  scope           jsonb not null default '[]'::jsonb,
  carousel_image  text not null default '',
  hero_image      text not null default '',
  gallery         jsonb not null default '[]'::jsonb,
  sort_order      integer not null default 0,
  is_published    boolean not null default true,
  published_at    timestamptz default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint case_studies_slug_unique unique (slug)
);

create index if not exists case_studies_published_sort_idx
  on public.case_studies (is_published, sort_order);

-- -----------------------------------------------------------------------------
-- 4. SITE CONTENT (editable text blocks — hero, KPI, about, etc.)
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 5. MEDIA ASSETS (metadata only — files live in Supabase Storage)
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- STORAGE BUCKET (for future CMS uploads — videos, blog images)
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  52428800, -- 50 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'video/mp4', 'video/webm']
)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- UPDATED_AT TRIGGER
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

drop trigger if exists case_studies_updated_at on public.case_studies;
create trigger case_studies_updated_at
  before update on public.case_studies
  for each row execute function public.set_updated_at();

drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------
alter table public.newsletter_subscribers enable row level security;
alter table public.form_submissions enable row level security;
alter table public.case_studies enable row level security;
alter table public.site_content enable row level security;
alter table public.media_assets enable row level security;

-- Newsletter: public can subscribe; reads are server-only (service role)
drop policy if exists "newsletter_insert_anon" on public.newsletter_subscribers;
create policy "newsletter_insert_anon"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (true);

-- Forms: public can submit
drop policy if exists "form_submissions_insert_anon" on public.form_submissions;
create policy "form_submissions_insert_anon"
  on public.form_submissions for insert
  to anon, authenticated
  with check (true);

-- Case studies: public read published only
drop policy if exists "case_studies_select_published" on public.case_studies;
create policy "case_studies_select_published"
  on public.case_studies for select
  to anon, authenticated
  using (is_published = true);

-- Site content: public read published only
drop policy if exists "site_content_select_published" on public.site_content;
create policy "site_content_select_published"
  on public.site_content for select
  to anon, authenticated
  using (is_published = true);

-- Media: public read
drop policy if exists "media_assets_select_public" on public.media_assets;
create policy "media_assets_select_public"
  on public.media_assets for select
  to anon, authenticated
  using (true);

-- Storage: public read for site-media bucket
drop policy if exists "site_media_public_read" on storage.objects;
create policy "site_media_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site-media');

-- Storage: authenticated upload (admin dashboard later)
drop policy if exists "site_media_authenticated_upload" on storage.objects;
create policy "site_media_authenticated_upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-media');

-- -----------------------------------------------------------------------------
-- SEED: CASE STUDIES (matches current website data)
-- -----------------------------------------------------------------------------
insert into public.case_studies (
  slug, category, title, excerpt, summary, challenge, solution,
  results, scope, carousel_image, hero_image, gallery, sort_order
) values
(
  'ai-customer-support-automation',
  'AI Solutions & Automation',
  'AI Support Agent for Regional Logistics Company',
  'Deployed an AI chatbot and RAG knowledge base that cut support tickets by 40% and reduced average response time from hours to seconds.',
  'A mid-size logistics operator was drowning in repetitive support requests — shipment tracking, billing questions, and delivery updates. Zar Labs built an AI-powered support layer integrated with their existing CRM, trained on internal documentation and live shipment data.',
  'Support staff spent 60% of their time on repetitive inquiries. Customers waited an average of 4 hours for responses during peak periods, and knowledge was scattered across PDFs, emails, and an outdated FAQ page.',
  'We designed a RAG-based AI agent connected to their order management system, deployed a voice-ready chatbot on their website and customer portal, and built an internal dashboard for human agents to review and improve AI responses over time.',
  '["40% reduction in tier-1 support tickets within 90 days","Average first response time dropped from 4 hours to under 30 seconds","Customer satisfaction score increased by 22 points","Support team redeployed to complex account management work"]'::jsonb,
  '["AI Chatbot Development","RAG Knowledge Base","CRM Integration","Agent Review Dashboard","Workflow Automation"]'::jsonb,
  '/casestudy/cs1.webp',
  '/images/mockup12.webp',
  '["/images/mockup12.webp","/casestudy/casestudyphoto3.avif","/casestudy/casestudyphoto1.avif","/images/test14.webp"]'::jsonb,
  1
),
(
  'saas-project-management-platform',
  'Custom Software & SaaS',
  'Custom SaaS Platform for Construction Teams',
  'Built a multi-tenant project management SaaS from scratch — scheduling, document control, and field reporting for 200+ active job sites.',
  'A construction management firm needed to replace spreadsheets and disconnected tools with a single platform their field crews and office teams could rely on daily. Zar Labs delivered a secure, multi-tenant SaaS product with role-based access and real-time project visibility.',
  'Project data lived in spreadsheets, WhatsApp groups, and legacy desktop software. Site managers had no single source of truth, causing delays, duplicate work, and missed change orders.',
  'We architected and built a cloud-native SaaS platform with project dashboards, mobile-friendly field reporting, document versioning, automated notifications, and subscription billing — designed to scale across multiple client organizations.',
  '["200+ active job sites onboarded in the first year","Reporting time reduced by 65% for field supervisors","Change order approval cycle shortened from 5 days to 1 day","Platform uptime maintained at 99.9% post-launch"]'::jsonb,
  '["SaaS Architecture","Web Application Development","Role-Based Access Control","Mobile-Responsive UI","Subscription Billing Integration"]'::jsonb,
  '/casestudy/cs2.webp',
  '/images/macbook.webp',
  '["/images/macbook.webp","/casestudy/casestudyphoto4.avif","/casestudy/casestudyphoto5.avif","/images/mockup11.webp"]'::jsonb,
  2
),
(
  'erp-crm-systems-integration',
  'Systems Integration',
  'Unified CRM & ERP Integration for Manufacturing',
  'Connected Salesforce, SAP, and payment gateways into one synchronized ecosystem — eliminating manual data entry across sales and operations.',
  'A manufacturing company struggled with data silos between sales, finance, and production. Zar Labs integrated their CRM, ERP, and payment systems into a unified data flow, giving leadership real-time visibility across the business.',
  'Sales closed deals in Salesforce while production ran on SAP. Invoices were reconciled manually, and leadership lacked a single view of pipeline-to-fulfillment performance.',
  'We mapped data flows across all systems, built middleware APIs for bi-directional sync, automated order-to-invoice workflows, and implemented error monitoring with alerting for failed sync events.',
  '["Eliminated 15+ hours of manual data entry per week","Order-to-invoice processing time reduced by 70%","Zero critical sync failures after 6 months in production","Executive team gained unified pipeline and revenue reporting"]'::jsonb,
  '["CRM & ERP Integration","API Development","Payment Gateway Sync","Data Mapping & Migration","Monitoring & Alerting"]'::jsonb,
  '/casestudy/cs3.webp',
  '/images/mockup7.webp',
  '["/images/mockup7.webp","/casestudy/casestudyphoto2.avif","/casestudy/casestudyphoto6.avif","/images/mockup4.webp"]'::jsonb,
  3
),
(
  'cloud-migration-cicd-pipeline',
  'DevOps & Cloud',
  'Cloud Migration & CI/CD for Fintech Startup',
  'Migrated a legacy monolith to AWS with automated CI/CD, cutting deployment time from days to minutes and improving system reliability.',
  'A fintech startup outgrew their single-server setup and needed enterprise-grade infrastructure without slowing down their product team. Zar Labs designed a cloud architecture, migrated their stack to AWS, and implemented full CI/CD automation.',
  'Deployments were manual and risky, taking 2–3 days per release. Downtime during updates affected paying customers, and there was no staging environment that mirrored production.',
  'We containerized the application, migrated to AWS with auto-scaling groups, set up GitHub Actions CI/CD pipelines, implemented infrastructure-as-code with Terraform, and added monitoring, logging, and security hardening.',
  '["Deployment time reduced from 3 days to under 15 minutes","99.95% uptime achieved in the first quarter post-migration","Infrastructure costs optimized by 30% through right-sizing","Zero-downtime deployments enabled for all production releases"]'::jsonb,
  '["Cloud Architecture (AWS)","CI/CD Pipeline Setup","Containerization","Infrastructure as Code","Security Hardening & Monitoring"]'::jsonb,
  '/casestudy/cs4.webp',
  '/images/abs.webp',
  '["/images/abs.webp","/casestudy/casestudyphoto1.avif","/casestudy/casestudyphoto3.avif","/images/test18.webp"]'::jsonb,
  4
),
(
  'ecommerce-analytics-dashboard',
  'Data & Analytics',
  'Executive Analytics Dashboard for E-Commerce Brand',
  'Built a real-time BI dashboard consolidating sales, marketing, and inventory data — enabling leadership to make decisions in minutes, not days.',
  'A growing e-commerce brand had data spread across Shopify, Google Analytics, Meta Ads, and warehouse systems. Zar Labs built a centralized analytics platform with real-time KPI tracking and automated reporting for the executive team.',
  'Leadership received weekly spreadsheet reports that were already outdated by the time they arrived. Marketing and operations teams used different numbers, leading to conflicting decisions.',
  'We integrated all data sources into a unified data pipeline, built interactive dashboards for revenue, CAC, inventory turnover, and campaign ROI, and set up automated daily and weekly report delivery.',
  '["Reporting cycle reduced from 7 days to real-time","Marketing spend efficiency improved by 18% in Q1","Inventory stockout incidents decreased by 35%","Executive team adopted dashboards as primary decision tool"]'::jsonb,
  '["Data Pipeline Engineering","Analytics Dashboard Development","KPI Framework Design","Automated Reporting","Multi-Source Data Integration"]'::jsonb,
  '/casestudy/cs1.webp',
  '/images/test17.webp',
  '["/images/test17.webp","/casestudy/casestudyphoto5.avif","/casestudy/casestudyphoto4.avif","/images/test19.webp"]'::jsonb,
  5
),
(
  'b2b-saas-seo-performance',
  'Search Visibility & Growth',
  'Core Web Vitals & SEO Overhaul for B2B SaaS',
  'Technical SEO and performance optimization that improved organic traffic by 85% and brought all Core Web Vitals into the green zone.',
  'A B2B SaaS company had strong product-market fit but poor organic visibility. Their site scored poorly on Core Web Vitals, lacked structured data, and had crawlability issues preventing search engines from indexing key pages.',
  'Organic traffic stagnated for 18 months despite publishing content regularly. Page load times exceeded 5 seconds on mobile, and Google Search Console showed indexing errors on 40% of product pages.',
  'Zar Labs conducted a full technical SEO audit, restructured site architecture, implemented schema markup, optimized images and JavaScript bundles, improved server response times, and built a content strategy aligned with high-intent search queries.',
  '["Organic traffic increased by 85% within 6 months","All Core Web Vitals moved into the green zone","Indexed pages increased from 60% to 98%","Demo request conversions from organic search up 45%"]'::jsonb,
  '["Technical SEO Audit","Core Web Vitals Optimization","Structured Data Implementation","Site Architecture Restructuring","Search Strategy & Content Alignment"]'::jsonb,
  '/casestudy/cs2.webp',
  '/images/test19.webp',
  '["/images/test19.webp","/casestudy/casestudyphoto6.avif","/casestudy/casestudyphoto2.avif","/images/image.webp"]'::jsonb,
  6
)
on conflict (slug) do update set
  category = excluded.category,
  title = excluded.title,
  excerpt = excluded.excerpt,
  summary = excluded.summary,
  challenge = excluded.challenge,
  solution = excluded.solution,
  results = excluded.results,
  scope = excluded.scope,
  carousel_image = excluded.carousel_image,
  hero_image = excluded.hero_image,
  gallery = excluded.gallery,
  sort_order = excluded.sort_order,
  updated_at = now();

-- -----------------------------------------------------------------------------
-- SEED: SITE CONTENT (key editable text blocks)
-- -----------------------------------------------------------------------------
insert into public.site_content (field_key, page, section, content) values
(
  'home.hero.headline',
  'home',
  'hero',
  '{"text": "Crafting Digital Masterpieces"}'::jsonb
),
(
  'home.hero.description',
  'home',
  'hero',
  '{"text": "Harnessing Cutting-Edge Visualization Technology to Transform Vision into Tailored Digital Reality"}'::jsonb
),
(
  'home.kpi.stat3.description',
  'home',
  'kpi',
  '{"text": "users continuously running our customized GPT tool."}'::jsonb
),
(
  'works.case_studies.intro',
  'works',
  'case_studies',
  '{"text": "Real projects across AI, SaaS, integrations, cloud, analytics, and growth — see how we deliver measurable results."}'::jsonb
),
(
  'global.footer.tagline',
  'global',
  'footer',
  '{"text": "Technology partner for custom software, AI automation, and digital transformation—built for measurable business outcomes."}'::jsonb
)
on conflict (field_key) do update set
  content = excluded.content,
  updated_at = now();
