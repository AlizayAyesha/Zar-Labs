# Zar Labs — Admin Controls (Section 0 filled)

**Project:** Zar Labs  
**Canonical:** `https://zar-labs.vercel.app`  
**Framework:** Next.js 14 App Router + Supabase

---

## Customization worksheet

| Item | Zar Labs value |
|------|----------------|
| Canonical URL | `NEXT_PUBLIC_SITE_URL=https://zar-labs.vercel.app` |
| Home | `/` → `/dashboard/site-system/home` |
| About (was Discover) | `/about` → `/dashboard/site-system/about` |
| Services | Home sections + About sticky services (no `/engagement`) |
| Expertise | **Removed** — not applicable |
| Portfolio / Works | `/works`, `/works/[slug]` → `/dashboard/site-system/case-studies` |
| Blog / Insights | **Phase 2** — newsletter topics at `/newsletter` |
| Media / speaking | **Removed** |
| Expertise hubs | 0 |
| Media library page keys | `all, home, about, works, contact, newsletter, faq` |
| Auth | Supabase session + `ADMIN_EMAILS` env |

---

## Dock order (implemented)

| # | Tab | Default route |
|---|-----|---------------|
| 1 | Social Media Management | `/dashboard/social-media-management/schedule-calendar` |
| 2 | Booking CRM | `/dashboard/booking-crm/cta-management` |
| 3 | **Admin Controls** | `/dashboard/site-system` → `/dashboard/site-system/home` |

---

## Admin Controls sidebar

### Content
- Home — **draft/publish live** via `/api/home-config`
- About, Contact, Newsletter — Phase 2 shells
- Works / Case Studies — CRUD (Supabase)
- FAQ — CRUD (Supabase)
- Media Library — tabbed by page key
- Discarded — Phase 2

### System
- System Logs, SEO Health, Sitemap Controls, Traffic & Funnels
- Platform Config (site settings + videos at `/dashboard/site-system/videos`)
- Booking Email, Website ↔ Supabase

---

## Booking CRM (2 sidebar items)

| Route | Purpose |
|-------|---------|
| `/dashboard/booking-crm/cta-management` | Site CTAs inventory |
| `/dashboard/booking-crm/sheets-records` | Newsletter subscribers + form records |

---

## Draft/publish contract

```
GET  /api/home-config?view=draft|published
PUT  /api/home-config  body: { intent: 'saveDraft'|'publish', ...payload }
GET  /api/seo-config?view=draft|published
PUT  /api/seo-config   body: { intent, ...payload }
```

Storage: Supabase `site_content` (`home-config.draft`, `home-config.published`) + `data/*.json` fallback.

---

## Phase 2 backlog

- Wire public pages to `?view=published` APIs
- Full About/Contact CMS editors
- Media library upload + merge on publish
- Social calendar + posts
- GA4 + Sheets sync
- `/answers/{slug}` SEO pages
