# Zar Labs SEO / AEO / GEO — Checklist Status

**Updated:** 2026-06-11  
**Canonical:** `https://zar-labs.vercel.app`

---

## Your checklist — status

| Item | Status | Notes |
|------|--------|-------|
| **Newsletter (top SEO, new topics)** | ✅ Done | `/newsletter` — 6 **new 2026 topics** (agentic AI, GEO, crawlers, MCP, etc.) — not recycled FAQ/case studies |
| **Reddit / Quora → newsletter** | ✅ Done | Topics cite community sources; footer + newsletter link to Reddit/Quora; **original briefs** (no live scraping) |
| **Open Graph** | ✅ Done | Every page via `buildPageMetadata()` — `og:title`, `og:description`, `og:url`, `og:image` 1200×630, `twitter:card` |
| **AEO FAQ website** | ✅ Done | `/faq` expanded with crawler/AEO/newsletter section + `FAQPage` JSON-LD |
| **Metadata on every page** | ✅ Done | All 17 indexable routes + case studies have unique title, description, canonical, OG, Twitter |
| **JSON files on website** | ✅ Done | `/faq.json`, `/entity.json`, `/ai-profile.json`, `/llms.txt` |
| **SEO images / OG metadata** | ✅ Done | Root `og-image.jpg`; case studies use `heroImage` / `carouselImage` per page |
| **Formspree fully connected** | ❌ **Not yet** | `.env.local` still has `your-form-id-here` — **you must add real Formspree URL** |
| **SERP** | ⚠️ Partial | Metadata + schema ready; submit sitemap in GSC after deploy |
| **H1 / H2 / H3** | ⚠️ Improved | Home: 1 H1 (hero); sections demoted to H2; works: 1 H1; about: 1 H1; FAQ: H1 + H2/H3 |
| **Crawler (robots/sitemap)** | ✅ Done | `robots.txt` + dynamic `sitemap.xml` includes `/newsletter` |
| **FAQ describing crawlers** | ✅ Done | 8 new FAQ items on AI crawlers, GEO, JSON exports, robots/sitemap |
| **Open Graph (verify)** | ✅ Code done | Test after deploy: Facebook Debugger, iMessage link preview |

---

## Live URLs to verify (localhost or production)

```
https://zar-labs.vercel.app/newsletter
https://zar-labs.vercel.app/faq
https://zar-labs.vercel.app/faq.json
https://zar-labs.vercel.app/entity.json
https://zar-labs.vercel.app/ai-profile.json
https://zar-labs.vercel.app/llms.txt
https://zar-labs.vercel.app/sitemap.xml
https://zar-labs.vercel.app/robots.txt
```

---

## Formspree — action required

1. Create form at [formspree.io](https://formspree.io)
2. Set in `.env.local`:
   ```
   NEXT_PUBLIC_FORMSPREE_PROJECT_INTAKE_URL=https://formspree.io/f/fYOUR_REAL_ID
   ```
3. Restart dev server
4. Submit test at `/project-intake`

**Newsletter** uses **Supabase** (`newsletter_subscribers` table) via `POST /api/newsletter` — not Formspree.

---

## Still not implemented (future phases)

- `/answers/{slug}` answer pages
- `/topics/{slug}` topic hubs
- GA4 + `generate_lead` events
- `seo:all` automated npm scripts
- GSC / Bing submission (manual)
- Live Reddit/Quora API scraping (not recommended; curated topics used instead)

---

## H1 map (after fixes)

| Page | H1 |
|------|-----|
| Home | `Crafting Digital Masterpieces` (hero only) |
| About | `About Zar Labs` |
| Works | `Collection of Our Works` |
| Case study | `{project title}` |
| Contact | `Get in Touch` |
| Newsletter | `Latest topics in AI, GEO…` |
| FAQ | `Frequently Asked Questions` |
| Project intake | `Project Intake` |
