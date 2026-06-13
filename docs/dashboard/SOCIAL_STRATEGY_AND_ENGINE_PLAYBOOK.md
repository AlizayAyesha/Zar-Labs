# Zar Labs — Social Strategy 2026 + Engine Playbook

Digital marketing operating system for BUILD · AI · GROW · PROOF streams.

---

## 1) Your positioning (use everywhere)

**One-liner:** Custom software, AI automation, and digital products for businesses that need measurable outcomes.

**Ideal clients:** Startups and growing companies investing **$20k–$100k+** in web, SaaS, AI, and integrations (US, UK, UAE, Pakistan delivery).

**Proof assets:** `/works`, `/answers`, `/newsletter`, Vyzion enterprise partnership.

**Primary CTAs (in order):**
1. Book discovery call — Calendly / `/go/linkedin`
2. Project intake — `/project-intake`
3. Newsletter — `/newsletter`

---

## 2) 2026 annual rhythm (date-wise framework)

Import **one week at a time** via Topic Planner (7-day markdown table). Repeat weekly with the theme below.

| Quarter | Dates | Business goal | Dominant stream | Weekly theme rotation |
|---------|-------|---------------|-----------------|------------------------|
| **Q1** | Jan–Mar | Awareness + pipeline | GROW + AI | "Be found in AI search" + "AI that ships" |
| **Q2** | Apr–Jun | Conversion + case studies | PROOF + BUILD | "Outcomes we delivered" + "How we build" |
| **Q3** | Jul–Sep | Enterprise + partnerships | PROOF + AI | Vyzion collab, integrations, MCP |
| **Q4** | Oct–Dec | Year-end planning + retainers | BUILD + GROW | 2027 roadmaps, audits, retainers |

### Monthly content pillars (assign publishing start date = 1st of month)

| Month | BUILD | AI | GROW | PROOF |
|-------|-------|-----|------|-------|
| Jan | SaaS MVP scoping | Agentic workflows | GEO / llms.txt | Client win teaser |
| Feb | Next.js performance | RAG chatbots | Answer pages | Works carousel |
| Mar | Integrations | Automation ROI | Technical SEO | Discovery call stories |
| Apr | PWAs / portals | AI intake forms | Conversion funnels | Case study deep-dive |
| May | E-commerce builds | Listing automation | Local + GBP | Before/after metrics |
| Jun | Dashboard / SaaS UI | MCP orchestration | Newsletter SEO | Partner shoutout |
| Jul | Security + infra | Enterprise AI guardrails | Analytics privacy | Vyzion modernization |
| Aug | Marketplace features | Support automation | Reddit/Quora intel | Testimonial clip |
| Sep | API design | Multi-agent ops | AEO content refresh | Industry vertical post |
| Oct | Retainer models | AI cost control | Q4 SEO checklist | Annual results |
| Nov | 2027 stack planning | Custom GPT for ops | Year-in-review SEO | Gratitude + referrals |
| Dec | Maintenance + support | Year of AI lessons | GEO audit offer | Best project recap |

### Weekly posting cadence (per brand week)

When you import a week, use **one brand** as primary + 1 cross-stream post:

| Day | Channel | Format | Time (PKT) |
|-----|---------|--------|------------|
| Mon | LinkedIn | Post | 09:00 |
| Tue | Instagram | Reel / carousel | 11:00 |
| Wed | LinkedIn | Article or newsletter link | 10:00 |
| Thu | X | Thread | 09:30 |
| Fri | LinkedIn | Proof / CTA post | 09:00 |
| Sat | Instagram | Story (optional) | 12:00 |
| Sun | — | Generation / batch for next week | — |

**Generation row:** Schedule creative work **2 days before** publish (Topic Planner does this automatically).

---

## 3) Q1 Week 1 — ready to paste (Topic Planner)

Set **brand:** BUILD  
**Generation start:** `2026-01-06` (Monday)  
**Publishing start:** `2026-01-08` (Wednesday) — or align both to `2026-01-06` for Mon-start week

```markdown
Topic: Q1 Kickoff — Why $20k+ digital builds need a product-minded engineering partner
Topic type: Thought leadership
Primary audience: Founders, CTOs, ops leads at B2B companies
Primary asset: /works
Campaign intensity: Standard
Default CTA: Book a free 30-min discovery call
Compliance note: No client names without written approval

| Day | Phase | Channel | Format | Time | What to post | SEO terms | CTA |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Awareness | LinkedIn | Post | 09:00 | 3 signs your startup has outgrown no-code — and what to build next | custom software startup | /go/linkedin |
| 2 | Education | Instagram | Reel | 11:00 | 30s: Zar Labs = design + engineering + AI under one roof | Zar Labs software agency | /go/instagram |
| 3 | Authority | LinkedIn | Article | 10:00 | Teaser: how we scope SaaS MVPs in the first discovery call | SaaS MVP scoping | /project-intake |
| 4 | Engagement | X | Thread | 09:30 | 5 tweets: build vs buy for internal tools in 2026 | build vs buy software | /go/website |
| 5 | Conversion | LinkedIn | Post | 09:00 | $20k–$100k projects — who we are a fit for (and who we are not) | software development partner | /go/linkedin |
| 6 | Nurture | Instagram | Carousel | 12:00 | Carousel: Web · SaaS · AI · Integrations — one team | full stack agency | /newsletter |
| 7 | Planning | LinkedIn | Post | 09:00 | Preview next week: Agentic AI workflows (AI stream) | agentic AI 2026 | /newsletter |
```

Repeat for weeks 2–52: change **Topic** line + table rows using the monthly pillar table above.

---

## 4) How to attach your calendar to Zar Labs

### A) Internal dashboard calendar (what you have today)

This is **not** Google Calendar sync yet. It is your **publishing operations calendar**.

| Step | Action |
|------|--------|
| 1 | Log in → **Social Media Management** → **Topic Planner** |
| 2 | Select brand (BUILD / AI / GROW / PROOF) |
| 3 | Set **Generation start** + **Publishing start** dates for that week |
| 4 | Paste 7-day markdown table → **Add to Calendar** |
| 5 | Open **Schedule Calendar** → drag tasks, open Production Panel, post manually |
| 6 | Data saves to **browser localStorage** + syncs to **Supabase** (`publishing-calendar.draft`) |

**Backup / restore:** Schedule Calendar → **Export JSON**. Keep weekly backups.

**Multi-device:** Same browser profile shares localStorage; for team-wide sync rely on Supabase after API save (log in on each device, click **Sync now**).

### B) Attach Google Calendar (recommended workflow until Phase 2 iCal)

Manual mirror (15 min/week):

1. In Google Calendar, create calendar: **Zar Labs — Social Publishing**
2. After importing a week to Zar Labs, add **all-day events** on publish dates with title: `[BUILD] LinkedIn — post title`
3. In event description paste: link to Production Panel task + CTA URL

**Future platform integration (Phase 2 dev):**
- `POST /api/publishing-calendar-data` → webhook → Google Calendar API
- Or export `.ics` feed from `/api/publishing-calendar-data/feed.ics` (not built yet)

### C) Attach Calendly (bookings — already on site)

Calendly is **lead capture**, not content calendar. Use:
- Site Settings → Calendly URL
- Portal CTAs: `/go/linkedin`, `/go/instagram`
- Social posts should CTA to `/go/{channel}` not raw Calendly (better attribution)

---

## 5) Social Media Engine — what to build

The **engine** = rules + data + AI + integrations that turn strategy into scheduled tasks + copy + proof.

### Layer 1 — Strategy (you + GPT)
- Annual/quarterly themes (this doc)
- Weekly 7-day tables (Topic Planner import)
- Brand voice + CTA rules

### Layer 2 — Operations (dashboard — built)
- `usePublishingCalendar` tasks
- Production panels (11 formats)
- Link Ups channel templates
- Control Tower KPIs

### Layer 3 — Content hub (built — Newsletter tab)
- Long-form: `/dashboard/site-system/newsletter`
- Public: `/newsletter/{slug}`
- AEO: `/answers/{slug}`

### Layer 4 — Distribution (Phase 2)
- Obligation calendar per channel
- Channel URL registry
- Sheets mirror for leads

### Layer 5 — AI generation (Phase 2)
- `POST /api/ai/editor` — draft from task context
- Custom GPT outputs Topic Planner markdown tables

### Layer 6 — Integrations (Phase 2+)

| Integration | Purpose | Priority |
|-------------|---------|----------|
| OpenAI API | Generate posts from task brief | High |
| Custom GPT | Weekly plan export in markdown table format | High |
| Google Calendar API | Two-way publish reminders | Medium |
| Buffer / Later API | Optional scheduling (you still manual publish today) | Low |
| LinkedIn / Meta API | Auto-post (legal + OAuth heavy) | Later |
| Supabase | Already stores calendar + newsletter | Done |
| Formspree + `/api/newsletter` | Leads | Done |
| Google Sheets | Lead mirror | Medium |

**Env vars for AI layer (when built):**
```
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o
SOCIAL_ENGINE_SYSTEM_PROMPT_PATH=./data/social-engine-system-prompt.txt
```

---

## 6) Custom ChatGPT bot — full training pack

Create a **Custom GPT** named: **Zar Labs Social Engine**

### Instructions (paste into GPT "Instructions" field)

```
You are the Zar Labs Social Media Engine — a senior B2B digital strategist and copywriter for a software agency.

BRAND
- Name: Zar Labs
- Site: https://zar-labs.vercel.app
- Tagline: Custom software, AI automation, and digital products for measurable outcomes.
- Services: Web, SaaS, full stack, AI, automation, e-commerce, UI/UX, SEO/GEO/AEO, analytics, infra.
- Markets: US, UK, UAE, global; delivery from Pakistan.
- Project range: $20k–$100k+ transformations.
- Partner: Vyzion Systems for enterprise modernization.
- Social: Instagram @zar_labs, X @zarlabs
- CTAs: /go/linkedin, /go/instagram, /project-intake, /newsletter, Calendly discovery call

STREAMS (pick one per week)
- BUILD: engineering, SaaS, web apps, integrations
- AI: agents, RAG, automation, MCP
- GROW: SEO, GEO, AEO, llms.txt, /answers content
- PROOF: case studies, metrics, testimonials, Vyzion

VOICE
- Confident, clear, no hype or buzzword soup
- Outcome-focused: time saved, revenue, risk reduced
- Short sentences; LinkedIn professional; Instagram punchy; X concise
- Never promise guaranteed rankings or revenue
- No fake client names or metrics

OUTPUT FORMATS
1) WEEKLY_PLAN — markdown metadata block + 7-row table for Topic Planner import
2) SINGLE_POST — hook, body, CTA, hashtags (max 5), suggested image brief
3) THREAD — numbered parts for X/LinkedIn
4) REEL_SCRIPT — hook (3s), beats, CTA, on-screen text
5) NEWSLETTER_BRIEF — title, excerpt, 3 H2s, CTA to Calendly

When user asks for a week, output WEEKLY_PLAN only unless asked otherwise.
Table columns must be: Day | Phase | Channel | Format | Time | What to post | SEO terms | CTA
Times in Asia/Karachi (PKT). CTA column = relative paths like /go/linkedin or /project-intake.

Always end with: "Import: Dashboard → Topic Planner → paste table → set dates → Add to Calendar"
```

### Knowledge files to upload to the GPT

1. `lib/seo/services-data.js` (export as text or copy SERVICE_PROFILE_BULLETS)
2. `lib/seo/newsletter-topics.js` (topic titles + summaries)
3. `lib/seo/faq-data.js` or `/answers` titles
4. `constants/booking/portalConversionPacks.ts` (CTA copy)
5. This playbook (`SOCIAL_STRATEGY_AND_ENGINE_PLAYBOOK.md`)

### Starter prompts (save as GPT conversation starters)

**Weekly plan**
```
Generate WEEKLY_PLAN for brand AI, week of 2026-02-03. Theme: agentic workflows for service businesses. Primary CTA /go/linkedin. Include LinkedIn, Instagram, X. PKT times.
```

**Single LinkedIn post**
```
SINGLE_POST for BUILD stream. Topic: why Next.js 14 App Router for B2B SaaS. Audience: technical founders. CTA /project-intake. 1200 chars max.
```

**Quarter batch**
```
List 13 weekly topics (one per week) for Q2 2026 PROOF stream focusing on /works case studies. Format as a numbered list with one-line angle each.
```

**Repurpose newsletter**
```
Convert this newsletter summary into: 1 LinkedIn post, 1 X thread (5 tweets), 1 Instagram reel script. Newsletter: [paste summary]. CTA /newsletter/agentic-ai-workflows-2026
```

**GEO content**
```
GROW stream WEEKLY_PLAN for week of 2026-03-10. Theme: GEO and /answers pages. Reference llms.txt and entity.json. Channels: LinkedIn, X, Quora-style community post.
```

### Quality checklist (GPT must self-check)

- [ ] CTA matches channel (`/go/linkedin` on LinkedIn week)
- [ ] No fabricated case study numbers
- [ ] Aligns with one of four streams
- [ ] Table parses in Topic Planner (7 rows, pipe separators)
- [ ] Generation-friendly brief in "What to post" column

---

## 7) Your weekly operator workflow (60–90 min)

| When | Task |
|------|------|
| **Sunday** | Ask Custom GPT for next week's WEEKLY_PLAN → import Topic Planner |
| **Mon–Thu** | Production Panel: copy prompt → create asset → schedule post |
| **Fri** | Paste published URLs into tasks; mark **Posted** |
| **Monthly** | Publish 1 newsletter issue; link from 2 social posts |
| **Quarterly** | Refresh `/works` + 3 new `/answers` pages; push PROOF month |

---

## 8) KPIs to track (Control Tower + manual sheet)

| Metric | Target (6 mo) | Tool |
|--------|-----------------|------|
| LinkedIn posts / week | 3 | Dashboard calendar |
| Discovery calls booked | 4–8 / month | Calendly |
| Project intake forms | 2–4 / month | Formspree |
| Newsletter subscribers | +15% QoQ | Dashboard subscribers |
| `/go/*` portal visits | track in analytics | GA4 (when wired) |
| Impressions / engagement | baseline +20% | LinkedIn native analytics |

---

## 9) What to ask dev to build next (priority)

1. **Submissions inbox** — all leads in one dashboard tab
2. **Google Calendar export** — `.ics` from publishing tasks
3. **`POST /api/ai/editor`** — generate post from task `what_to_post`
4. **Social Engine config UI** — store GPT system prompt in Supabase
5. **Distribution obligations** — channel checklist per week
6. **Bulk import** — 4-week or 13-week markdown import (not just 7-day)

---

*Last updated: 2026 — Zar Labs internal playbook*
