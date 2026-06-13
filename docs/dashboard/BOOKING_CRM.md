# Booking CRM

Channel-specific consultation portals, CTA management, and submission records.

## Channels (Zar Labs)

| Group | Channels |
|-------|----------|
| Social | LinkedIn, Instagram |
| Direct | Website, Email, Referral |

Defined in `constants/booking/channelGroups.ts`.

## Quick reference

| You want to change… | Where |
|---------------------|--------|
| LinkedIn portal headline, tiers, CTA | **CTA Management** → Social → LinkedIn → editor |
| Default FAQ / social proof | `constants/booking/portalConversionPacks.ts` + editor overrides |
| Which platforms appear | `channelGroups.ts` + enable/hide in editor |
| Form submission labels | `constants/booking/interaction-sources.ts` → `SOURCE_LABEL` |
| Google Sheet columns | `GOOGLE_SHEETS_RANGE` + `GOOGLE_SHEETS_HEADERS` (Sheets sync Phase 2) |
| Public booking URL | `/go/{slug}` — set `slug` in channel editor |
| Calendly URL sitewide | **Site Settings** → Calendly URL |

## Workflow

1. Open **Dashboard → Booking CRM → CTA Management**.
2. Select a channel (e.g. LinkedIn).
3. Edit headline, tiers, FAQ, slug.
4. **Save Draft** — stores to `site_content` key `booking-portals.draft`.
5. **Publish** — writes `booking-portals.published` and revalidates `/go/*`.

## Public routes

- `/go/linkedin`
- `/go/instagram`
- `/go/website`
- `/go/email`
- `/go/referral`

CTA button opens Calendly popup (sitewide widget) unless **CTA URL** is set on the portal.

## API

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/booking-crm/portals?view=draft` | GET | Load draft or published portals |
| `/api/booking-crm/portals` | PUT | `intent: saveDraft` or `publish` |
| `/api/dashboard/booking-crm/submissions` | GET | Latest `form_submissions` + newsletter rows |

## Phase 2

- Google Sheets sync for `form_submissions`
- Portal lead capture → Supabase (`source: portal`)
