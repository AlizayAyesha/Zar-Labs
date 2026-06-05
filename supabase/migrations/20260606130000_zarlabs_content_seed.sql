-- =============================================================================
-- Zar Labs — seed all CMS content (matches current website)
-- Run AFTER: 20260606120000_zarlabs_cms_content_tables.sql
-- =============================================================================

-- SITE SETTINGS (single row)
insert into public.site_settings (
  id, company_name, tagline, email, phone, phone_display, location,
  calendly_url, instagram_url, twitter_url
) values (
  '00000000-0000-0000-0000-000000000001',
  'Zar Labs',
  'Technology partner for custom software, AI automation, and digital transformation—built for measurable business outcomes.',
  'zarlabsteam@gmail.com',
  '+923307063298',
  '+92 330 706 3298',
  'Karachi, Pakistan',
  'https://calendly.com/sherlockholme898/30min',
  'https://www.instagram.com/zar_labs/',
  'https://x.com/zarlabs'
)
on conflict (id) do update set
  company_name = excluded.company_name,
  tagline = excluded.tagline,
  email = excluded.email,
  phone = excluded.phone,
  phone_display = excluded.phone_display,
  location = excluded.location,
  calendly_url = excluded.calendly_url,
  instagram_url = excluded.instagram_url,
  twitter_url = excluded.twitter_url,
  updated_at = now();

-- NAVIGATION
delete from public.navigation_links;

insert into public.navigation_links (label, href, location, sort_order, action) values
  ('Home', '/', 'header', 1, null),
  ('About', '/about', 'header', 2, null),
  ('Works', '/works', 'header', 3, null),
  ('Get In Touch', '/contact', 'header', 4, null),
  ('Home', '/', 'footer_company', 1, null),
  ('About', '/about', 'footer_company', 2, null),
  ('Works', '/works', 'footer_company', 3, null),
  ('Contact', '/contact', 'footer_company', 4, null),
  ('Careers', '/contact', 'footer_company', 5, null),
  ('AI & Automation', '/about', 'footer_services', 1, null),
  ('Custom Software', '/about', 'footer_services', 2, null),
  ('Systems Integration', '/about', 'footer_services', 3, null),
  ('DevOps & Cloud', '/about', 'footer_services', 4, null),
  ('Project Intake', '/project-intake', 'footer_resources', 1, null),
  ('FAQ', '/faq', 'footer_resources', 2, null),
  ('Case Studies', '/works', 'footer_resources', 3, null),
  ('Book a Call', '#', 'footer_resources', 4, 'calendly'),
  ('Support', '/contact', 'footer_resources', 5, null),
  ('Terms of Service', '/terms', 'footer_legal', 1, null),
  ('Privacy Policy', '/privacy', 'footer_legal', 2, null),
  ('Cookie Policy', '/cookies', 'footer_legal', 3, null);

-- PAGE SECTIONS (headlines + animation flags)
insert into public.page_sections (section_key, page, section_type, content, sort_order) values
  ('home.hero.headline', 'home', 'hero', '{"text":"Crafting Digital Masterpieces"}'::jsonb, 1),
  ('home.hero.description', 'home', 'text', '{"text":"Harnessing Cutting-Edge Visualization Technology to Transform Vision into Tailored Digital Reality"}'::jsonb, 2),
  ('home.hero.cta_primary', 'home', 'cta', '{"label":"See More","href":"/works"}'::jsonb, 3),
  ('home.hero.cta_secondary', 'home', 'cta', '{"label":"Get In Touch","href":"/contact"}'::jsonb, 4),
  ('home.services.eyebrow', 'home', 'text', '{"text":"Our Services"}'::jsonb, 10),
  ('home.services.headline', 'home', 'text', '{"text":"Your Digital Powerhouse"}'::jsonb, 11),
  ('home.services.description', 'home', 'text', '{"text":"Where innovation fuels transformation. We empower brands to redefine possibilities and thrive in the ever-evolving digital landscape."}'::jsonb, 12),
  ('home.projects.headline', 'home', 'text', '{"text":"Pioneering Projects That Consistently Redefine What''s Possible"}'::jsonb, 20),
  ('home.testimonials.eyebrow', 'home', 'text', '{"text":"Client success stories"}'::jsonb, 30),
  ('home.testimonials.headline', 'home', 'text', '{"text":"Don''t Take Our Word For It! Hear It From Our Partners."}'::jsonb, 31),
  ('home.kpi.eyebrow', 'home', 'text', '{"text":"Key Performance Indicators"}'::jsonb, 40),
  ('home.kpi.headline', 'home', 'text', '{"text":"Numbers That Just Make Sense"}'::jsonb, 41),
  ('home.animation.hero', 'home', 'animation', '{"preset":"split_text_fade","enabled":true,"reduced_motion_fallback":true}'::jsonb, 100),
  ('home.animation.scroll', 'home', 'animation', '{"preset":"blur_reveal_stagger","enabled":true}'::jsonb, 101),
  ('about.hero.headline', 'about', 'hero', '{"text":"About Zar Labs"}'::jsonb, 1),
  ('about.partners.eyebrow', 'about', 'text', '{"text":"Strategic Ecosystem"}'::jsonb, 10),
  ('about.partners.headline', 'about', 'text', '{"text":"Strategic Partners & Joint Ventures"}'::jsonb, 11),
  ('about.team.eyebrow', 'about', 'text', '{"text":"Our Team"}'::jsonb, 20),
  ('about.team.headline', 'about', 'text', '{"text":"The people behind Zar Labs"}'::jsonb, 21),
  ('works.hero.headline', 'works', 'hero', '{"text":"Our Works"}'::jsonb, 1),
  ('works.case_studies.eyebrow', 'works', 'text', '{"text":"Case Studies"}'::jsonb, 10),
  ('works.case_studies.headline', 'works', 'text', '{"text":"We have a diverse portfolio of successful case studies"}'::jsonb, 11),
  ('contact.hero.headline', 'contact', 'hero', '{"text":"Get in Touch"}'::jsonb, 1)
on conflict (section_key) do update set
  content = excluded.content,
  sort_order = excluded.sort_order,
  updated_at = now();

-- Expand site_content keys
insert into public.site_content (field_key, page, section, content) values
  ('home.hero.headline', 'home', 'hero', '{"text":"Crafting Digital Masterpieces"}'::jsonb),
  ('home.hero.description', 'home', 'hero', '{"text":"Harnessing Cutting-Edge Visualization Technology to Transform Vision into Tailored Digital Reality"}'::jsonb),
  ('home.kpi.stat3.description', 'home', 'kpi', '{"text":"users continuously running our customized GPT tool."}'::jsonb),
  ('works.case_studies.intro', 'works', 'case_studies', '{"text":"Real projects across AI, SaaS, integrations, cloud, analytics, and growth — see how we deliver measurable results."}'::jsonb),
  ('global.footer.tagline', 'global', 'footer', '{"text":"Technology partner for custom software, AI automation, and digital transformation—built for measurable business outcomes."}'::jsonb),
  ('about.why_us.intro', 'about', 'why_us', '{"text":"Zar Labs is a technology partner helping businesses design, build, and scale digital products that deliver measurable outcomes."}'::jsonb)
on conflict (field_key) do update set content = excluded.content, updated_at = now();

-- SERVICES
insert into public.services (slug, number_label, title, description, image_url, sort_order) values
  ('ai-automation', '01', 'AI Solutions & Automation',
   'Deploy intelligent systems that automate workflows, streamline operations, and enhance customer experiences. From AI chatbots and voice agents to RAG knowledge bases and business process automation, we help organizations operate smarter and scale faster.',
   '/images/mockup12.webp', 1),
  ('custom-software-saas', '02', 'Custom Software & SaaS Development',
   'Build secure, scalable, and high-performance digital products tailored to your business. We develop web applications, SaaS platforms, enterprise portals, CRM systems, dashboards, and custom business software designed for long-term growth.',
   '/images/macbook.webp', 2),
  ('systems-integration', '03', 'Systems Integration & Digital Ecosystems',
   'Connect your technology stack into a unified ecosystem. We integrate CRMs, ERPs, payment gateways, third-party APIs, cloud services, analytics platforms, and business tools to eliminate silos and improve operational efficiency.',
   '/images/mockup7.webp', 3),
  ('devops-cloud', '04', 'DevOps, Cloud & Infrastructure',
   'Establish a reliable technology foundation with modern cloud architecture, CI/CD pipelines, deployment automation, monitoring systems, security hardening, and infrastructure management designed for scalability and resilience.',
   '/images/abs.webp', 4),
  ('data-analytics', '05', 'Data, Analytics & Business Intelligence',
   'Transform data into actionable insights through analytics dashboards, KPI tracking, reporting systems, and business intelligence solutions that support informed decision-making.',
   '/images/test17.webp', 5),
  ('seo-growth', '06', 'Search Visibility & Growth Engineering',
   'Improve discoverability, performance, and digital presence through technical SEO, Core Web Vitals optimization, structured data implementation, search strategy, and conversion-focused digital experiences.',
   '/images/test19.webp', 6)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  updated_at = now();

-- PRINCIPLES
insert into public.principles (slug, title, description, sort_order) values
  ('innovation', 'Innovation', 'Leveraging modern technologies to create competitive advantages.', 1),
  ('reliability', 'Reliability', 'Building secure, scalable, and maintainable solutions that businesses can depend on.', 2),
  ('impact', 'Impact', 'Delivering technology that produces measurable business outcomes.', 3)
on conflict (slug) do update set title = excluded.title, description = excluded.description;

-- CAPABILITIES
delete from public.capability_items where page = 'about';

insert into public.capability_items (label, sort_order) values
  ('Custom Software Development', 1),
  ('SaaS Platforms', 2),
  ('AI Solutions & Automation', 3),
  ('Enterprise Web Applications', 4),
  ('E-Commerce Systems', 5),
  ('Digital Infrastructure', 6),
  ('UI/UX Design', 7),
  ('Data & Analytics', 8),
  ('Technical Consulting', 9),
  ('Managed Support & Maintenance', 10);

-- TESTIMONIALS
insert into public.testimonials (slug, name, role, quote, image_url, sort_order) values
  ('sarah-mitchell', 'Sarah Mitchell', 'CEO, Retail SaaS Startup',
   'Zar Labs rebuilt our customer portal from the ground up. Response times dropped 60% and our support team finally has one dashboard for everything.',
   '/images/testimonials/sarah-mitchell.webp', 1),
  ('david-patel', 'David Patel', 'Project Director, Construction Tech',
   'They delivered our project management platform on schedule with clean architecture and documentation our in-house team could take over without friction.',
   '/images/pfp2.webp', 2),
  ('emily-carter', 'Emily Carter', 'Operations Manager, E-commerce',
   'The analytics dashboard Zar Labs built gave our leadership real-time visibility across Shopify, ads, and warehouse data — decisions that used to take days now take minutes.',
   '/images/testimonials/emily-carter.webp', 3),
  ('marcus-chen', 'Marcus Chen', 'CTO, B2B Software Company',
   'From ERP integration to CI/CD, they handled complex systems work without breaking existing workflows. Our deployment cycle went from weekly to multiple times a day.',
   '/images/pfp1.webp', 4),
  ('priya-sharma', 'Priya Sharma', 'Founder, Health Tech Platform',
   'We needed AI automation that actually fit our support process — not a generic chatbot. Zar Labs scoped it properly and shipped something our customers use every day.',
   '/images/testimonials/priya-sharma.webp', 5),
  ('james-rivera', 'James Rivera', 'Marketing Lead, B2B SaaS',
   'After the SEO and performance overhaul, organic traffic grew 140% in six months and our product pages finally load in under two seconds on mobile.',
   '/images/testimonials/james-rivera.webp', 6)
on conflict (slug) do update set
  name = excluded.name, role = excluded.role, quote = excluded.quote,
  image_url = excluded.image_url, sort_order = excluded.sort_order;

-- KPI STATS
insert into public.kpi_stats (slug, value, unit, description, icon, sort_order) values
  ('data-processed', '250', 'thousand', 'of data processed by our models every single month', 'globe', 1),
  ('client-revenue', '$100', 'million', 'client revenue driven by our tailored solutions and strategies.', 'user', 2),
  ('gpt-users', '500', 'million', 'users continuously running our customized GPT tool.', 'cone', 3)
on conflict (slug) do update set
  value = excluded.value, unit = excluded.unit, description = excluded.description;

-- FEATURED PROJECTS
insert into public.featured_projects (slug, title, image_url, alt_text, sort_order) values
  ('heavecorp', 'Heavecorp', '/mockups/heave.webp', 'Heavecorp project', 1),
  ('essentia', 'Essentia', '/mockups/essentia.webp', 'Essentia project', 2),
  ('kinimatic', 'Kinimatic', '/mockups/kinimatic.webp', 'Kinimatic project', 3),
  ('peak', 'Peak', '/mockups/peak.webp', 'Peak project', 4),
  ('vitalenta', 'Vitalenta', '/mockups/vitalenta.webp', 'Vitalenta project', 5),
  ('rev', 'Rev', '/mockups/rev.webp', 'Rev project', 6)
on conflict (slug) do update set title = excluded.title, image_url = excluded.image_url;

-- MARQUEE LOGOS
delete from public.marquee_logos;

insert into public.marquee_logos (label, image_url, sort_order) values
  ('Adobe', '/logos/adobe.webp', 1),
  ('Webflow', '/logos/webflow.svg', 2),
  ('Stripe', '/logos/stripe.svg', 3),
  ('Miro', '/logos/miro.svg', 4);

-- TEAM MEMBERS
insert into public.team_members (slug, name, role, bio, photo_url, initials, instagram_url, sort_order) values
  ('alizay', 'Alizay Ayesha', 'All-Rounder Expert',
   'Cross-functional specialist spanning product, delivery, and client success — keeping projects aligned from kickoff to launch.',
   '/images/alizay%20ayesha.jpg', 'AA', 'https://www.instagram.com/alizay_ayesha/', 1),
  ('caio', 'Caio Vinicius A. Faguette', 'Security & Backend Expert',
   'Architects secure, scalable backend systems with a focus on infrastructure hardening, API design, and enterprise-grade reliability.',
   '/images/caio%20.jpg', 'CV', 'https://www.instagram.com/cvinicius_28/', 2),
  ('shanzay', 'Shanzay Fatima', 'Graphic Team Lead',
   'Leads brand identity, visual systems, and creative direction — ensuring every Zar Labs deliverable looks polished and on-brand.',
   '/images/shanzay.jpg', 'SF', 'https://www.instagram.com/1_the_best_anime/', 3)
on conflict (slug) do update set
  name = excluded.name, role = excluded.role, bio = excluded.bio,
  photo_url = excluded.photo_url, instagram_url = excluded.instagram_url;

-- TEAM UNITS
insert into public.team_units (slug, title, description, sort_order) values
  ('pm', 'Project Management', 'Dedicated PMs coordinating timelines, milestones, and client communication across every engagement.', 1),
  ('cto', 'CTO & Technology Leadership', 'Senior technical leadership setting architecture standards, stack decisions, and long-term product strategy.', 2),
  ('devops', 'DevOps & Infrastructure', 'Cloud deployment, CI/CD pipelines, monitoring, and infrastructure that keeps products fast and reliable.', 3),
  ('marketing', 'Marketing Team', 'Growth strategy, campaigns, content, and digital presence built to attract and convert the right clients.', 4),
  ('video', 'Video Editing Team', 'Motion, reels, product demos, and campaign video — production-ready assets for web and social.', 5)
on conflict (slug) do update set title = excluded.title, description = excluded.description;

-- PARTNERS
insert into public.partners (
  slug, name, badge, headline, description, capabilities,
  logo_url, image_url, website_url, website_label, website_enabled, instagram_url, accent, sort_order
) values
(
  'vyzion', 'Vyzion Systems', 'Enterprise Technology Partner',
  'Enterprise Consulting & Digital Transformation',
  '["Vyzion Systems is a technology consulting and enterprise solutions company focused on helping organizations modernize operations, optimize technology investments, and accelerate digital transformation initiatives.","With expertise in enterprise architecture, infrastructure modernization, business technology consulting, and large-scale software initiatives, Vyzion Systems helps businesses bridge the gap between strategy and execution.","Working alongside Zar Labs, Vyzion Systems supports organizations in designing scalable technology ecosystems, improving operational efficiency, and implementing solutions that drive sustainable growth."]'::jsonb,
  '["Enterprise Technology Solutions","Digital Transformation Strategy","Business Technology Consulting","Infrastructure Modernization","Enterprise Software Initiatives","System Architecture & Planning","Cloud Infrastructure Strategy","Business Process Optimization","Technology Assessments","Operational Efficiency Consulting"]'::jsonb,
  '/images/vyzion%20logo.jpeg', '/images/vyzion%20logo.jpeg',
  'https://vyzionsystems-portfolio.vercel.app/', 'Visit Website', true,
  'https://www.instagram.com/vyzionsystems_ofc/', 'blue', 1
),
(
  'redoro', 'Redoro Studio', 'Creative & Branding Partner',
  'Branding, Creative Production & AI Advertising',
  '["Redoro Studio is a creative branding and visual communications company specializing in premium brand identity systems, AI-powered content creation, advertising assets, and modern marketing design.","By combining traditional creative expertise with advanced AI production tools, Redoro delivers high-quality visual content, realistic advertising campaigns, brand kits, logos, marketing templates, and digital assets that help businesses establish a strong and consistent market presence.","The company focuses on providing agency-quality creative production with faster turnaround times and cost-efficient workflows through intelligent design technologies."]'::jsonb,
  '["Brand Identity Systems","Logo Design","Brand Guidelines","Brand Kits","Marketing Templates","Social Media Creative Assets","AI-Powered Advertising","AI Product Visualizations","AI Marketing Content","Creative Campaign Production","Corporate Branding Materials","Visual Design Systems"]'::jsonb,
  '/images/redoro%20studio.png', '/images/redoro%20studio.png',
  null, 'Website Launching Soon', false,
  'https://www.instagram.com/redoro_studio/', 'gold', 2
)
on conflict (slug) do update set
  name = excluded.name, headline = excluded.headline, description = excluded.description,
  capabilities = excluded.capabilities, website_url = excluded.website_url,
  website_enabled = excluded.website_enabled;

-- FAQ
delete from public.faq_items;

insert into public.faq_items (question, answer, sort_order) values
  ('What does Zar Labs do?',
   'Zar Labs is a technology partner that builds custom software, SaaS platforms, AI automation, integrations, and cloud infrastructure for businesses that need measurable outcomes—not just deliverables.', 1),
  ('Who do you typically work with?',
   'We work with startups, growing companies, and enterprise teams in the US, UK, UAE, and beyond—especially organizations investing in $20,000–$100,000+ digital transformation projects.', 2),
  ('How does a project usually start?',
   'Most engagements begin with a discovery call to understand your goals, systems, and constraints. From there we define scope, timeline, and a phased delivery plan before development begins.', 3),
  ('Do you offer ongoing support?',
   'Yes. We provide managed support, maintenance, monitoring, and iterative improvements so your platform stays secure, performant, and aligned with business growth.', 4),
  ('Can you integrate with our existing tools?',
   'Absolutely. We regularly integrate CRMs, ERPs, payment gateways, analytics platforms, APIs, and cloud services into unified digital ecosystems.', 5),
  ('How do I get in touch?',
   'Email zarlabsteam@gmail.com, call +92 330 706 3298, visit our contact page, or book a call directly from the site. We typically respond within one business day.', 6);

-- ANIMATION PRESETS (toggles only — GSAP code stays in Next.js)
insert into public.animation_presets (preset_key, target, config) values
  ('hero_title', 'home', '{"type":"splitText","stagger":0.02,"duration":0.75,"delay":0.4}'::jsonb),
  ('scroll_reveal', 'global', '{"type":"blurFade","trigger":"top 95%","duration":0.5}'::jsonb),
  ('loader', 'global', '{"minMs":1200,"fallbackMs":2000,"enabled":true}'::jsonb),
  ('flower_sequence', 'home', '{"frameCount":300,"pathPrefix":"/imageSequence/image","scrub":true}'::jsonb)
on conflict (preset_key) do update set config = excluded.config;

-- MEDIA ASSETS metadata (images + videos — upload via npm run upload:videos)
insert into public.media_assets (bucket, path, public_url, file_type, alt_text) values
  ('site-media', 'brand/zarlabs-logo.webp', '/images/zarlabs-logo.webp', 'image', 'Zar Labs logo'),
  ('site-media', 'team/alizay-ayesha.jpg', '/images/alizay%20ayesha.jpg', 'image', 'Alizay Ayesha'),
  ('site-media', 'team/caio.jpg', '/images/caio%20.jpg', 'image', 'Caio Vinicius A. Faguette'),
  ('site-media', 'team/shanzay.jpg', '/images/shanzay.jpg', 'image', 'Shanzay Fatima'),
  ('site-media', 'testimonials/sarah-mitchell.webp', '/images/testimonials/sarah-mitchell.webp', 'image', 'Sarah Mitchell')
on conflict (bucket, path) do update set public_url = excluded.public_url, alt_text = excluded.alt_text;
