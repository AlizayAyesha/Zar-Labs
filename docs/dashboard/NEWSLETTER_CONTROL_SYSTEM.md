# Newsletter Control System (Admin Controls tab)

Dock tab 3 — **Newsletter Control System**. All dashboard links use `constants/websiteCmsPaths.ts`.

## Navigation

| Item | Route |
|------|-------|
| Media Library | `/dashboard/site-system/media-library` |
| Newsletter | `/dashboard/site-system/newsletter` |
| ↳ Subscribers | `/dashboard/site-system/newsletter/subscribers` |

No blog/post/insights editors in this tab.

## Components

| Component | Route |
|-----------|-------|
| `MediaLibraryPage` | media-library |
| `NewsletterPostsList` | newsletter |
| `NewsletterPostEditor` | newsletter/new, newsletter/[id] |
| `NewsletterSubscribers` | newsletter/subscribers |

## Data

- **API:** `GET/PUT /api/cms/website-data?view=draft|published`
- **Registry key:** `newsletter_posts_registry` inside `website_data`
- **Storage:** Supabase `site_content` + `data/website-data.json`
- **Publish:** `intent: publish` revalidates `/newsletter` and `/newsletter/[slug]`

## Public site

| Route | Purpose |
|-------|---------|
| `/newsletter` | Hub — lists published newsletters |
| `/newsletter/[slug]` | Single newsletter detail |

## Legacy redirects

| Old path | New path |
|----------|----------|
| `/dashboard/site-system/posts` | newsletter list |
| `/dashboard/site-system/distribution` | newsletter list |
| `/dashboard/site-system/home` | newsletter list |
| `/dashboard/booking-crm/newsletter` | subscribers |
| `/dashboard/newsletter` | subscribers |
