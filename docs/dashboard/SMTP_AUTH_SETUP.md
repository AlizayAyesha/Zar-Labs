# Dashboard auth — SQL, users, SMTP & forgot password

**Project ref:** `aaptopqqtxhbujbxgtzy`  
**Dashboard:** https://supabase.com/dashboard/project/aaptopqqtxhbujbxgtzy  
**Live site (canonical):** https://zar-labs.vercel.app

Run steps **in order**. Auth users live in `auth.users` — that is separate from your CMS tables.

### Supabase Auth URL config (copy-paste now)

**Authentication → URL Configuration**

| Field | Value |
|-------|--------|
| **Site URL** | `https://zar-labs.vercel.app` |

**Redirect URLs** (add all):

```
https://zar-labs.vercel.app/auth/callback
http://localhost:3000/auth/callback
http://localhost:3002/auth/callback
```

**Vercel env** (Project → Settings → Environment Variables):

```
NEXT_PUBLIC_SITE_URL=https://zar-labs.vercel.app
```

Redeploy Vercel after changing env vars.

---

## ⚠️ Common mistake

**Do NOT paste** `SMTP_AUTH_SETUP.md` into SQL Editor — lines starting with `#` cause syntax errors.

Use **only** `.sql` files, e.g. `supabase/scripts/FIX_LOGIN_NOW.sql` (quickest) or the migration + create-user scripts below.

---

## Step 0 — Quick fix login (one SQL file)

**SQL Editor → New query → paste entire file:**

```
supabase/scripts/FIX_LOGIN_NOW.sql
```

Then sign in:

- **URL:** https://zar-labs.vercel.app/dashboard/login  
- **Email:** `sherlockholme898@gmail.com`  
- **Password:** `ChangeMe_ZarLabs_2026!`  

---

## Step 1 — Run auth SQL migration

**Supabase Dashboard → SQL Editor → New query**

Paste and run the full file:

```
supabase/migrations/20260612100000_dashboard_auth.sql
```

This creates:

| Object | Purpose |
|--------|---------|
| `public.dashboard_admins` | Allowlist of admin emails |
| `public.dashboard_auth_audit` | Login / reset audit log |
| `public.is_dashboard_admin(email)` | Check admin by email |
| `public.log_dashboard_auth_event(...)` | Insert audit row |

Seeds:

- `sherlockholme898@gmail.com`
- `zarlabsteam@gmail.com`

---

## Step 2 — Create Supabase Auth users (SQL)

Still in **SQL Editor**, open:

```
supabase/scripts/create-dashboard-auth-users.sql
```

1. Edit the two `v_password` lines to a strong temp password  
2. Run the entire script  

This inserts into **`auth.users`** and **`auth.identities`** (required for email login).

Verify:

```sql
select id, email, email_confirmed_at
from auth.users
where email in ('sherlockholme898@gmail.com', 'zarlabsteam@gmail.com');
```

You should see both rows with `email_confirmed_at` set.

**Alternative (no SQL):** Authentication → Users → Add user → enable **Auto Confirm User**.

---

## Step 3 — `.env.local` (Next.js app)

```env
NEXT_PUBLIC_SUPABASE_URL=https://aaptopqqtxhbujbxgtzy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon key>
SUPABASE_SERVICE_ROLE_KEY=<your service role key>

NEXT_PUBLIC_SITE_URL=https://zar-labs.vercel.app
ADMIN_EMAILS=sherlockholme898@gmail.com,zarlabsteam@gmail.com
```

For local dev only, you may temporarily use `http://localhost:3000` — password reset emails will use whichever URL is in Supabase **Site URL**.

Restart dev server after changes.

`ADMIN_EMAILS` must match `dashboard_admins` and `auth.users` emails.

---

## Step 4 — Redirect URLs (forgot password links)

**Authentication → URL Configuration**

| Field | Value |
|-------|--------|
| **Site URL** | `https://zar-labs.vercel.app` |

**Redirect URLs** — add each line:

```
https://zar-labs.vercel.app/auth/callback
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
http://localhost:3002/auth/callback
http://localhost:3003/auth/callback
```

Flow: forgot password email → `/auth/callback?code=...&next=/dashboard/login/reset-password` → set new password.

Repo mirror: `supabase/config.toml` → `[auth]` → `additional_redirect_urls` (local `supabase start` only).

---

## Step 5 — SMTP (password reset / OTP sender)

SMTP is **not** configured via SQL on hosted Supabase. Use the Dashboard (or `config.toml` for local).

**Authentication → Email → SMTP Settings → Enable Custom SMTP**

### Gmail

| Field | Value |
|-------|--------|
| Host | `smtp.gmail.com` |
| Port | `587` |
| Username | `sherlockholme898@gmail.com` (or your sender Gmail) |
| Password | Google **App Password** ([myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)) |
| Sender email | same as username |
| Sender name | `Zar Labs` |

### Resend (production)

| Field | Value |
|-------|--------|
| Host | `smtp.resend.com` |
| Port | `587` |
| Username | `resend` |
| Password | Resend API key |
| Sender email | `noreply@zarlabs.com` (domain verified in Resend) |
| Sender name | `Zar Labs` |

### Local Supabase (`supabase start`)

Uncomment in `supabase/config.toml`:

```toml
[auth.email.smtp]
enabled = true
host = "smtp.gmail.com"
port = 587
user = "env(SMTP_USER)"
pass = "env(SMTP_PASS)"
admin_email = "env(SMTP_USER)"
sender_name = "Zar Labs"
```

Add to `.env` in project root (for Supabase CLI):

```env
SMTP_USER=sherlockholme898@gmail.com
SMTP_PASS=your-google-app-password
```

---

## Step 6 — Email templates (reset / OTP)

Templates in repo:

| File | Used for |
|------|----------|
| `supabase/templates/recovery.html` | Forgot password link |
| `supabase/templates/confirmation.html` | Email confirm (if enabled) |

**Hosted project:** Authentication → Email Templates → **Reset password**

- Subject: `Reset your Zar Labs dashboard password`
- Body: use `{{ .ConfirmationURL }}` for the link (or paste HTML from `recovery.html`)

**Auth email OTP settings** (Dashboard → Authentication → Email):

| Setting | Default | Notes |
|---------|---------|--------|
| OTP length | 6 | Magic link / OTP codes |
| OTP expiry | 3600 sec | 1 hour |
| Enable email confirmations | **off** for dashboard | Keep off so admins can sign in immediately after SQL create |

---

## Step 7 — Test

1. `npm run dev` → `/dashboard/login`  
2. Sign in: `sherlockholme898@gmail.com` + temp password from Step 2  
3. Sign out → **Forgot password?** → check inbox  
4. Click link → `/dashboard/login/reset-password` → new password  
5. Sign in again  

Check audit log:

```sql
select event_type, email, created_at
from public.dashboard_auth_audit
order by created_at desc
limit 20;
```

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| Invalid login credentials | Run Step 2 SQL or create user in Auth → Users |
| User created but still invalid | Ensure `auth.identities` row exists (Step 2 script includes it) |
| Email not received | Enable SMTP (Step 5); check spam; default Supabase mail is rate-limited |
| Link opens but session expired | Add redirect URL (Step 4); link expires in 1 hour |
| Login works but kicked to login page | Add email to `ADMIN_EMAILS` and `dashboard_admins` |
| Email confirmation required | Authentication → Providers → Email → disable confirm, or confirm via email |

---

## App routes (reference)

| Route | Purpose |
|-------|---------|
| `/dashboard/login` | Sign in + forgot password |
| `/dashboard/login/reset-password` | New password after email |
| `/auth/callback` | Supabase code exchange |

---

## File map

```
supabase/migrations/20260612100000_dashboard_auth.sql   ← tables + functions
supabase/scripts/create-dashboard-auth-users.sql        ← auth.users INSERT
supabase/templates/recovery.html                        ← reset email body
supabase/config.toml                                    ← local redirects + SMTP
lib/dashboard/auth.js                                   ← ADMIN_EMAILS check
app/auth/callback/route.js                              ← OAuth / reset callback
```
