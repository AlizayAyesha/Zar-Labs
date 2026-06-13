# Zar Labs Dashboard

Three-tab dock matching the Sh3ikhMABZ pattern: **Social → Booking CRM → Admin Controls**.

**Login:** `/dashboard/login`  
**Default landing:** `/dashboard/control-tower`

---

## Dock tabs

| # | Tab | Default route | Purpose |
|---|-----|---------------|---------|
| 1 | **Social Media Management** | `/dashboard/social-media-management/schedule-calendar` | Publishing calendar, posts, distribution |
| 2 | **Booking CRM** | `/dashboard/booking-crm/cta-management` | CTAs, form records, newsletter subscribers |
| 3 | **Admin Controls** | `/dashboard/site-system/home` | Page text, images, media library, SEO |

Click any dock tab to switch mode and sidebar navigation.

---

## Admin Controls (tab 3)

| Route | Public page | Status |
|-------|-------------|--------|
| `/dashboard/site-system/home` | `/` | Phase 2 shell |
| `/dashboard/site-system/about` | `/about` | Phase 2 shell |
| `/dashboard/site-system/case-studies` | `/works/*` | ✅ CRUD (DB; public still JS) |
| `/dashboard/site-system/contact` | `/contact` | Links to settings |
| `/dashboard/site-system/newsletter` | `/newsletter` | Topics read-only |
| `/dashboard/site-system/faq` | `/faq` | ✅ CRUD (DB; public still JS) |
| `/dashboard/site-system/media-library` | — | Phase 2 shell |
| `/dashboard/site-system/seo` | JSON exports | ✅ SEO hub |
| `/dashboard/site-system/settings` | contact config | ✅ Edit DB |
| `/dashboard/site-system/videos` | home videos | ✅ Toggle publish |
| `/dashboard/migrate` | — | Live Supabase counts |

**Draft/publish contract:** `lib/cms/draft-publish.js` — `GET ?view=draft|published`, `intent: saveDraft|publish`.

---

## Booking CRM (tab 2)

| Route | Purpose |
|-------|---------|
| `/dashboard/booking-crm/cta-management` | Site CTAs inventory |
| `/dashboard/booking-crm/sheets-records` | Form submission mirror (Phase 2 Sheets) |
| `/dashboard/booking-crm/newsletter` | Subscriber list + CSV export |

---

## Social (tab 1)

| Route | Purpose |
|-------|---------|
| `/dashboard/control-tower` | Overview stats + quick links |
| `/dashboard/social-media-management/schedule-calendar` | Phase 2 |
| `/dashboard/social-media-management/topic-planner` | Phase 2 |
| `/dashboard/social-media-management/link-ups` | Phase 2 |
| `/dashboard/site-system/distribution` | Phase 2 |
| `/dashboard/site-system/posts` | Phase 2 |

---

## Setup

1. Run SQL in Supabase SQL Editor: `migrations/20260612100000_dashboard_auth.sql` then `scripts/create-dashboard-auth-users.sql`
2. Set `ADMIN_EMAILS` and `NEXT_PUBLIC_SITE_URL` in `.env.local`
3. Configure **SMTP** + **redirect URLs** in Supabase Dashboard (see `SMTP_AUTH_SETUP.md`)
4. `npm run dev` → `/dashboard/login` (forgot password supported)

See also: `constants/dashboardRoutes.js` for nav definitions.

---

## Legacy redirects

Old paths redirect automatically:

- `/dashboard/case-studies` → `/dashboard/site-system/case-studies`
- `/dashboard/newsletter` → `/dashboard/booking-crm/newsletter`
- `/dashboard/faq`, `/settings`, `/videos`, `/seo` → `/dashboard/site-system/*`
