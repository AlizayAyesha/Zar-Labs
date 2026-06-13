# Social Media Management (Zar Labs)

Dock tab 1 — publishing calendar, topic planner, link ups, and control tower.

## Routes

| Route | Module |
|-------|--------|
| `/dashboard/control-tower` | Overview + calendar KPIs |
| `/dashboard/social-media-management/schedule-calendar` | Week kanban (Post + Generation rows) |
| `/dashboard/social-media-management/topic-planner` | 7-day markdown import |
| `/dashboard/social-media-management/link-ups` | Production panel previews |

## Publishing brands

| ID | Shortcut | Focus |
|----|----------|--------|
| build | BUILD | Web, SaaS, full-stack |
| ai | AI | AI & automation |
| grow | GROW | SEO, GEO, AEO |
| proof | PROOF | Case studies, Vyzion |

## Data

- **Hook:** `hooks/usePublishingCalendar.js`
- **API:** `PUT/GET /api/publishing-calendar-data` (dashboard auth)
- **localStorage:** `zar_publishing_calendar_*` keys
- **Supabase:** `site_content` field `publishing-calendar.draft`

## Workflow

1. **Topic Planner** — paste markdown table → preview → **Add to Calendar**
2. **Schedule Calendar** — drag tasks between days; click chip → Production Panel
3. **Production Panel** — copy prompt, open platform, paste published URL
4. Auto-sync debounced 1.2s to API

## Phase 2 (not yet built)

- Distribution obligations (`/dashboard/site-system/distribution`)
- Social Engine configuration
- Google Sheets / platform OAuth
