# Zar Labs Media Library

**Dashboard:** `/dashboard/site-system/media-library` (Newsletter Control System tab)

## Quick mental model

1. **Bootstrap** — Library reads images from Home, Works (portfolio), Newsletter posts, About (team/partners), and site logos (SEO config + tech-stack marquee).
2. **Edit in one place** — Replace, delete, alt text in Media Library UI.
3. **Save Draft** — Updates library draft + pushes URLs into draft CMS (website-data, case studies, partners, team, featured projects, marquee logos, seo-config).
4. **Publish** — Same with `view=published`; public paths revalidate.
5. **Certs & logos** — Org/OG logos sync to SEO config; tech-stack + partner logos appear under **Certs & Logos** tab.

## Architecture

```
CMS sources → bootstrap on first GET
    → Media Library UI
    → PUT /api/media-library-data { intent: saveDraft|publish }
    → syncLinkedSourcesFromLibrary()
    → revalidatePath on publish
```

## Page tabs

| Tab | Aggregates from |
|-----|-----------------|
| all | Everything |
| home | Featured projects, tech-stack marquee, org logo, OG image |
| about | Partners, team |
| works | Case study hero, carousel, gallery |
| newsletter (Posts) | Newsletter `heroImage` |
| certs | Marquee logos, partner logos, org/OG images |
| contact / faq | Reserved |

## sourceType → CMS field

| sourceType | CMS field |
|------------|-----------|
| `newsletter` | `newsletter_posts_registry[].heroImage` |
| `case-study-hero` | `case_studies.hero_image` |
| `case-study-carousel` | `case_studies.carousel_image` |
| `case-study-gallery` | `case_studies.gallery[n]` |
| `partner-logo` | `partners.logo_url` |
| `partner-image` | `partners.image_url` |
| `team-member` | `team_members.photo_url` |
| `home-featured` | `featured_projects.image_url` |
| `home-marquee` | `marquee_logos.image_url` |
| `website-logo` | `seo-config.organizationLogo` |
| `website-og-image` | `seo-config.defaultOgImage` |

## API

- `GET /api/media-library-data?view=draft|published`
- `PUT /api/media-library-data` — body: `{ assets, intent: saveDraft|publish }`

## Note

Public `/works` still reads `case-studies-data.js` until wired to Supabase. Library sync updates the DB for dashboard + future public reads.
