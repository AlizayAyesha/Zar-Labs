# Social Engine

AI layer for Zar Labs Social Media Management: strategy chat, marketing images, email reminders, Free/Pro tiers.

## Access

| Role | How | Dashboard scope |
|------|-----|-----------------|
| **Admin** | `ADMIN_EMAILS` | Full dashboard + Social Engine |
| **Social member** | `social_engine_members` or `SOCIAL_ENGINE_ALLOWED_EMAILS` | Strategy Chat, Image Studio, My Account |

## Plans

| | Free | Pro ($5 — Stripe TBD) |
|--|------|------------------------|
| Chat messages / mo | 30 | 300 |
| Week plans / mo | 2 | 20 |
| Image briefs / mo | 10 | 100 |
| **FAL images / mo** | 5 | 50 |
| Text models | 5 (Gemini, Groq, DeepSeek, Mistral, OpenRouter) | All |
| Email post reminders | Yes | Yes |

Admins set plan in **AI Configuration → Add member** (`subscriptionPlan: free` | `pro`).

## Routes

| UI | Path |
|----|------|
| Onboarding | `/dashboard/site-system/social-engine/onboarding` |
| Strategy Chat | `/dashboard/site-system/social-engine/strategy-chat` |
| Image Studio | `/dashboard/site-system/social-engine/image-studio` |
| My Account | `/dashboard/site-system/social-engine/my-account` |
| AI Configuration (admin) | `/dashboard/site-system/social-engine/configuration` |

## API

| Route | Purpose |
|-------|---------|
| `GET/PATCH /api/social-engine/me` | Profile, usage, BYOK |
| `GET/POST /api/social-engine/chat` | Guardrailed strategy chat |
| `POST /api/social-engine/generate-image` | FAL marketing templates |
| `GET/POST /api/social-engine/schedules` | Per-user post reminders |
| `GET /api/social-engine/cron/reminders` | Send due emails (Vercel Cron) |

## Environment variables

```bash
# AI (server-only)
FAL_KEY=
OPENROUTER_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
# ...

# Email reminders
RESEND_API_KEY=
RESEND_FROM_EMAIL=Social Engine <onboarding@resend.dev>

# Cron auth
CRON_SECRET=

SOCIAL_ENGINE_MONTHLY_TOKEN_BUDGET=100000
```

## Database

Apply migrations:

- `20260613100000_social_engine_members.sql`
- `20260613110000_social_engine_profiles_schedules.sql`

```bash
supabase link --project-ref aaptopqqtxhbujbxgtzy
supabase db push
```

## Silent model routing

When a free API hits rate limits or quota, Social Engine **automatically tries the next model** in the chain. Users never see provider or model names — only admins see routing in **AI Configuration → Test provider chain**.

Exhausted models are cooldown-tracked in `data/social-engine-exhaustion.json` (1 hour default).


Strategy Chat refuses off-topic requests (code, legal, general chat). Scope: social strategy, content plans, hooks, marketing image briefs.

## Google Calendar

OAuth placeholder on My Account. Email reminders work without Calendar.

## Stripe

Pro tier flags exist in DB (`subscription_plan`). Stripe checkout/webhooks — Phase 2.
