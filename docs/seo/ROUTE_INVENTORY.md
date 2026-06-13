# Zar Labs — Route Inventory (Phase 0 + Phase 1)

**Audit date:** 2026-06-06  
**Repo:** `zarlabs/` (Next.js 14 App Router)  
**Canonical domain:** `https://zarlabs.com`  
**Framework:** Next.js 14.2.x  

---

## Site context

| Field | Value |
|-------|-------|
| **Site name** | Zar Labs |
| **Canonical domain** | `https://zarlabs.com` |
| **Alternate / handle domain** | Unknown — confirm if `zar_labs` social handles only |
| **Primary business** | Digital agency: custom websites, SaaS, AI automation, integrations, branding, motion/3D |
| **Target regions / languages** | English; clients in US, UK, UAE (per FAQ copy) |
| **Forms backend** | Formspree — **project intake only** (`/project-intake`); Calendly for booking CTAs |
| **Analytics** | **Not configured** — no `NEXT_PUBLIC_GA_MEASUREMENT_ID`; cookie banner exists but does not gate analytics |
| **Search Console** | Not verified in repo |

---

## Phase 0 — Prerequisites checklist

| Check | Status | Notes |
|-------|--------|-------|
| Canonical domain + DNS + SSL | ⚠️ Unverified | `zarlabs.com` referenced in code; live site returned 404 in prior curl test — confirm production host |
| `NEXT_PUBLIC_SITE_URL` set to canonical HTTPS | ⚠️ Partial | Default `https://zarlabs.com` in `layout.jsx`; must be set in production env |
| www → apex 301 | ❓ Unknown | Not in repo — verify at DNS/hosting |
| Alias domain → canonical 301 | ❓ Unknown | No alternate domain configured in code |
| Build passes locally | ✅ Yes | Recent builds succeeded |
| Production URL matches canonical | ❓ Unknown | Requires deploy verification |
| `metadataBase` uses env URL | ✅ Yes | `app/layout.jsx` |

**Stop / fix before Phase 3+:** Confirm live `https://zarlabs.com` serves this Next app and env vars are set on production.

---

## Public route inventory

| Route | Source file | Page type | Index? | Sitemap? | Priority |
|-------|-------------|-----------|--------|----------|----------|
| `/` | `app/page.jsx` | Home | yes | yes (1.0) | P0 |
| `/about` | `app/about/page.jsx` | About | yes | yes (0.8) | P0 |
| `/works` | `app/works/page.jsx` | Portfolio hub | yes | yes (0.8) | P0 |
| `/works/ai-customer-support-automation` | `app/works/[slug]/page.jsx` | Case study | yes | yes (0.7) | P1 |
| `/works/saas-project-management-platform` | ↑ | Case study | yes | yes (0.7) | P1 |
| `/works/erp-crm-systems-integration` | ↑ | Case study | yes | yes (0.7) | P1 |
| `/works/cloud-migration-cicd-pipeline` | ↑ | Case study | yes | yes (0.7) | P1 |
| `/works/ecommerce-analytics-dashboard` | ↑ | Case study | yes | yes (0.7) | P1 |
| `/works/b2b-saas-seo-performance` | ↑ | Case study | yes | yes (0.7) | P1 |
| `/contact` | `app/contact/page.jsx` | Contact | yes | yes (0.8) | P0 |
| `/project-intake` | `app/project-intake/page.jsx` | Lead form | yes | yes (0.85) | P0 |
| `/faq` | `app/faq/page.jsx` | FAQ hub | yes | yes (0.6) | P1 |
| `/terms` | `app/terms/page.jsx` | Legal | yes | yes (0.4) | P2 |
| `/privacy` | `app/privacy/page.jsx` | Legal | yes | yes (0.4) | P2 |
| `/cookies` | `app/cookies/page.jsx` | Legal | yes | yes (0.4) | P2 |
| `/robots.txt` | `app/robots.jsx` | Crawler rules | n/a | n/a | — |
| `/sitemap.xml` | `app/sitemap.jsx` | Sitemap | n/a | n/a | — |
| `/icon.png` | `app/icon.png` | Favicon | n/a | no | — |
| `/apple-icon.png` | `app/apple-icon.png` | Apple touch | n/a | no | — |
| `/opengraph-image.jpg` | `app/opengraph-image.jpg` | Default OG | n/a | no | — |

### Excluded / not present

| Route pattern | Status |
|---------------|--------|
| `/admin`, `/dashboard`, `/login` | Not in repo |
| `/api/*` | No public API routes in `app/api` |
| `/answers/{slug}` | **Missing** (AEO) |
| `/topics/{slug}` | **Missing** (GEO) |
| `/llms.txt`, `/faq.json`, `/entity.json` | **Missing** (AI crawlers) |
| `/feed.xml` / `/rss.xml` | **Missing** |
| `/private/*` | Disallowed in robots only; route does not exist |

---

## Per-route SEO detail

### `/` (Home)

| Field | Current value |
|-------|----------------|
| **Title** | `Zar Labs \| Cutting-Edge Website Design & Custom Digital Solutions` (root layout) |
| **Meta description** | Harnessing Cutting-Edge Visualization Technology to Transform Vision into Tailored Digital Reality. |
| **Canonical** | Inherited via `metadataBase` → `https://zarlabs.com/` |
| **robots** | Default `index,follow` |
| **JSON-LD** | **None** |
| **H1 (visible)** | **Multiple H1s** — violates one-H1 rule: |
| | • Hero: `Crafting Digital Masterpieces` (`SectionHero.jsx`) |
| | • Services: `Your Digital Powerhouse` |
| | • Projects (desktop + mobile sections): `Pioneering Projects…` (×2 in DOM) |
| | • Discover: `Discover Who We Are & What We Build` |
| | • Tech stack: `Integrating Powerful Tools…` |
| | • Testimonials, KPI, Flower (8× `Grow/Your/Digital…`), Footer: `Zar Labs` |
| **OG title** | Same as root title |
| **OG description** | Same as root |
| **OG image** | `/og-image.jpg` (1200×630) + `opengraph-image.jpg` auto |
| **Twitter** | `summary_large_image` |
| **Placeholder risk** | Low — content is real; heavy client-side animation |
| **AEO score (1–5)** | **2** — strong brand page but no FAQ strip, no schema, heading chaos hurts extractability |
| **Required fix** | Single page-level H1; demote section titles to H2; add `Organization` + `WebSite` JSON-LD |

---

### `/about`

| Field | Current value |
|-------|----------------|
| **Title** | `Zar Labs \| About Us` |
| **Meta description** | Zar Labs helps businesses transform ideas into scalable digital products… |
| **Canonical** | `https://zarlabs.com/about` (inferred) |
| **robots** | index,follow |
| **JSON-LD** | **None** |
| **H1** | **Missing proper H1** — main headline is **H2**: `About Zar Labs` (`about-whyus-headline`). Services block uses **multiple H1s** per service row. Partners section has **H1**: `Our Partners` |
| **OG** | Title only: `About Us` — **no page-specific OG image** |
| **Twitter** | Inherited from root |
| **AEO score** | **3** — good prose; fix headings + add `Organization` schema |
| **Required fix** | One H1: `About Zar Labs`; services → H2/H3; partners title → H2 |

---

### `/works`

| Field | Current value |
|-------|----------------|
| **Title** | `Zar Labs \| Works` |
| **Meta description** | Generic site tagline (duplicate of home/contact) |
| **JSON-LD** | **None** |
| **H1** | **Three H1s on one page:** |
| | • `Collection of Our Works` |
| | • `We have extensive experience across multiple industries` |
| | • `We have a diverse portfolio of successful case studies` |
| **OG** | Title: `Works` only |
| **AEO score** | **2** — portfolio visible; descriptions generic; heading structure broken |
| **Required fix** | One H1; industries + case studies → H2; unique meta description |

---

### `/works/[slug]` (×6 case studies)

| Field | Current value |
|-------|----------------|
| **Title** | `Zar Labs \| {study.title}` (dynamic) |
| **Meta description** | `{study.excerpt}` (unique per study) ✅ |
| **JSON-LD** | **None** — should be `Article` or `CreativeWork` + `BreadcrumbList` |
| **H1** | `{study.title}` ✅ (single H1 on case study detail) |
| **OG** | Title + description per study; **no per-study OG image** |
| **Sitemap** | All 6 slugs listed ✅ |
| **AEO score** | **4** — strong factual content; add schema + OG images |
| **Required fix** | Per-study `og:image` from `carouselImage` or `heroImage`; JSON-LD |

---

### `/contact`

| Field | Current value |
|-------|----------------|
| **Title** | `Zar Labs \| Get in Touch` |
| **Meta description** | **Duplicate generic tagline** (same as home) |
| **H1** | `Get in Touch` ✅ |
| **JSON-LD** | **None** — should add `ContactPage` + `LocalBusiness`/`Organization` contactPoint |
| **Forms** | **No on-page form** — mailto/tel links + Calendly via other CTAs |
| **OG** | Title: `Get in Touch` only |
| **AEO score** | **3** — clear CTA; expand FAQ-style copy; unique description |
| **Required fix** | Unique meta; visible email/phone in semantic markup; `ContactPage` schema |

---

### `/project-intake`

| Field | Current value |
|-------|----------------|
| **Title** | `Zar Labs \| Project Intake` |
| **Meta description** | Unique ✅ |
| **H1** | `Project Intake` (class `project-intake-title`) ✅ |
| **Form** | Formspree POST — see Form inventory below |
| **OG** | Title: `Project Intake` only |
| **AEO score** | **4** for conversion; **2** for discovery |
| **Required fix** | Verify Formspree env in production; add `generate_lead` when GA4 added |

---

### `/faq`

| Field | Current value |
|-------|----------------|
| **Title** | `Zar Labs \| FAQ` |
| **Meta description** | Unique ✅ |
| **H1** | `Frequently Asked Questions` (via `LegalPageLayout`) ✅ |
| **H2** | Each question as H2 ✅ |
| **JSON-LD** | **None** — should add `FAQPage` matching visible Q&A (6 items) |
| **faq.json** | **Missing** |
| **AEO score** | **3** — good start; need 40+ FAQs + machine export |
| **Required fix** | `FAQPage` schema; expand content; `/faq.json` route |

---

### `/terms`, `/privacy`, `/cookies`

| Route | Title | H1 | JSON-LD | OG image |
|-------|-------|-----|---------|----------|
| `/terms` | Zar Labs \| Terms of Service | Terms of Service | None | Root default |
| `/privacy` | Zar Labs \| Privacy Policy | Privacy Policy | None | Root default |
| `/cookies` | Zar Labs \| Cookie Policy | Cookie Policy | None | Root default |

**AEO score:** 2 each — fine for legal; no schema required beyond basics.

---

## Pseudo-routes & crawler files

| Asset | Status | Gap |
|-------|--------|-----|
| `robots.txt` | ✅ `app/robots.jsx` | Hardcoded `https://zarlabs.com/sitemap.xml`; should use `NEXT_PUBLIC_SITE_URL` |
| `sitemap.xml` | ✅ `app/sitemap.jsx` | Hardcoded URLs; not generated from `CASE_STUDIES` data (manual sync risk); no `lastmod` stability |
| `llms.txt` | ❌ Missing | Phase 10 |
| `faq.json` | ❌ Missing | Phase 5/10 |
| `entity.json` / `ai-profile.json` | ❌ Missing | Phase 10 |
| `humans.txt` | ❌ Missing | Optional |
| `rss.xml` | ❌ Missing | No blog route exists |

---

## Metadata gaps (all indexable pages)

| Issue | Affected routes |
|-------|-----------------|
| Duplicate meta descriptions | `/`, `/works`, `/contact` share same tagline |
| Incomplete Open Graph | Child pages missing `og:url`, `og:image`, `og:description` overrides |
| No `twitter:site` | Sitewide |
| No per-page `canonical` explicit override | Relies on Next defaults (usually OK) |
| `next-seo` in package.json | **Installed but unused** |
| Case studies lack OG images | All `/works/[slug]` |

---

## JSON-LD / schema (sitewide)

| Page type | Required schema | Status |
|-----------|-----------------|--------|
| Home | `Organization` + `WebSite` + `SearchAction` | ❌ |
| FAQ | `FAQPage` | ❌ |
| Case studies | `Article` / `CreativeWork` + `BreadcrumbList` | ❌ |
| About | `Organization` | ❌ |
| Contact | `ContactPage` | ❌ |
| Services (home sections) | `Service` (optional) | ❌ |

**Risk:** No fake `AggregateRating` detected ✅

---

## Form inventory (Phase 13 preview)

| Form / capture | Location | Backend | Status |
|----------------|----------|---------|--------|
| Project intake | `/project-intake` | Formspree (`NEXT_PUBLIC_FORMSPREE_PROJECT_INTAKE_URL`) | ⚠️ `.env.local` has placeholder URL — **not production-ready** |
| Book a call | Home, works, footer, services | Calendly (popup) | ⚠️ External — not tracked in repo submissions |
| Contact email/phone | `/contact` | `mailto:` / `tel:` links | ✅ No form submission |
| Cookie consent | Sitewide banner | localStorage only | ✅ No PII sent |

**No** newsletter, footer email capture, or chat gate forms found.

---

## Heading hierarchy summary (critical)

| Page | H1 count | Severity |
|------|----------|----------|
| `/` (home) | **15+** | 🔴 Critical |
| `/works` | **3** | 🔴 Critical |
| `/about` | **0 proper** (H2 main + many H1s in services) | 🔴 Critical |
| `/works/[slug]` | **1** | ✅ OK |
| `/contact` | **1** | ✅ OK |
| `/faq` | **1** | ✅ OK |
| Legal pages | **1** | ✅ OK |
| `/project-intake` | **1** | ✅ OK |

---

## AEO / GEO missing routes (Phase 6–7)

| Planned route | Status |
|---------------|--------|
| `/answers/who-is-zar-labs` | ❌ |
| `/answers/what-does-zar-labs-do` | ❌ |
| `/answers/how-to-book-zar-labs` | ❌ |
| `/topics/custom-software` | ❌ |
| `/topics/ai-automation` | ❌ |
| `/topics/web-design-development` | ❌ |

---

## Gap analysis summary (Phases 1–20)

### Implemented (partial)

- Root metadata + OG image (1200×630)
- Favicon / apple-icon / opengraph-image via App Router
- `robots.txt` + `sitemap.xml` with 16 URLs
- FAQ page with 6 Q&As (on-page)
- 6 case study pages with unique titles/descriptions
- Cookie consent banner
- Formspree wiring for project intake (code complete)

### Missing or broken (priority order)

1. **P0 — Production env:** `NEXT_PUBLIC_SITE_URL`, Formspree URL, confirm domain live
2. **P0 — Heading fixes:** Home, Works, About multiple-H1 anti-patterns
3. **P0 — Unique meta descriptions** per high-intent page
4. **P1 — JSON-LD:** Organization, WebSite, FAQPage, case study schema
5. **P1 — AI files:** `llms.txt`, `faq.json`, `entity.json`
6. **P1 — OG images** on case studies + child pages
7. **P2 — AEO answer pages** (`/answers/*`)
8. **P2 — Topic hubs** (`/topics/*`)
9. **P2 — FAQ expansion** to 40+ items
10. **P2 — GA4** + consent-gated analytics + `generate_lead`
11. **P2 — SEO npm scripts** (`seo:all`, postdeploy smoke) — none exist
12. **P3 — Sitemap** dynamic generation from `CASE_STUDIES`
13. **P3 — Internal linking** to answers/topics (after creation)
14. **P3 — GSC/Bing** submission checklists

---

## Phased implementation plan (one phase per session)

| Session | Phase | Deliverable |
|---------|-------|-------------|
| 1 | **0 + 1** | ✅ This document |
| 2 | **2** | `CANONICAL_URL_MAP.md` + redirect tests |
| 3 | **3** | Fix metadata on all pages; unique descriptions; OG per route |
| 4 | **4** | `HEADING_ROUTE_INVENTORY.md` + H1/H2 fixes (home, works, about) |
| 5 | **5** | FAQ expansion + `FAQPage` schema + `/faq.json` |
| 6 | **6–7** | `/answers/*` + `/topics/*` first 3 each |
| 7 | **8–9** | Case study schema + `SCHEMA_IMPLEMENTATION_MATRIX.md` |
| 8 | **10–11** | `llms.txt`, `entity.json`, dynamic sitemap |
| 9 | **12** | Per-route OG images + alt text audit |
| 10 | **13** | `FORM_INVENTORY.md` + Formspree production test |
| 11 | **14–15** | Noindex matrix + internal linking pass |
| 12 | **18–19** | GA4 + `seo:*` validation scripts |
| 13 | **16–17, 20** | AI testing sheet + GSC deploy checklist |

---

## Phase 1 sign-off

**Inventory complete.** No code changes made in this phase.

**Recommended next session:** Phase 2 (canonical/redirect matrix) + Phase 4 (heading fixes on home/works/about) — highest impact for SERP + AEO before adding new routes.

---

*Generated from repo crawl: `app/**/page.jsx`, `layout.jsx`, `sitemap.jsx`, `robots.jsx`, section components, `case-studies-data.js`, `formspree.js`.*
