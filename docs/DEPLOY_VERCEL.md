# Vercel production deploy

If https://zar-labs.vercel.app/join returns **404**, production is still on an old build (check `last-modified` in response headers). Code on `main` includes `/join`, dashboard, and Social Engine.

## Fix (5 minutes)

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → project **zar-labs** (or Zar-Labs).
2. **Settings → Git** — confirm repo `AlizayAyesha/Zar-Labs`, branch `main`, root directory **`.`** (not a parent folder).
3. **Settings → General → Build & Development**
   - Framework: Next.js
   - Install Command: `npm ci --legacy-peer-deps` (or leave empty; `.npmrc` sets legacy-peer-deps)
   - Build Command: `npm run build`
4. **Settings → Environment Variables** — add all keys from `.env.example` (Production).
5. **Deployments → Redeploy** latest commit `71dcfbe` (or **Deploy** → import from Git if disconnected).

## Verify after deploy

```bash
curl -I https://zar-labs.vercel.app/join
curl -I https://zar-labs.vercel.app/dashboard/login
```

Expect **200** (or **307** to login), not **404**. `last-modified` should be today.

## Optional: Deploy Hook

Vercel → Settings → Git → Deploy Hooks → create hook for `main`. POST the hook URL after each push if auto-deploy is off.

## Local check

```bash
npm run build && npm start
# open http://localhost:3000/join
```
