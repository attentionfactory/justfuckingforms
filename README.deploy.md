# Deploy

JFF is two services. Deploy them in this order so secrets line up:

1. **Neon** — Postgres (already done if you've run migrations)
2. **Resend** — verified sending domain
3. **Polar** — products + webhook
4. **Cloudflare Workers** — `apps/api` at `api.jff.dev`
5. **Vercel** — `apps/web` at `justfuckingforms.com`

---

## 1. Neon

The dev branch in `.env.local` is already migrated. For prod:

1. neon.tech → Create a new project (or new branch on the same project for prod)
2. Run migrations against it:
   ```bash
   DATABASE_URL='<prod url>' pnpm --filter @jff/db db:migrate
   ```
3. Save the **pooled** URL — both apps use it at runtime. The migrate script auto-strips `-pooler` for DDL.

---

## 2. Resend

Free tier covers ~3k emails/mo, plenty for launch.

1. resend.com → API Keys → Create
2. Domains → Add `jff.dev` (or your sending domain) → follow the DNS steps
3. Once verified, update `EMAIL_FROM` to `JFF <notify@jff.dev>` (or whatever address you want)

Until verified, leave `EMAIL_FROM=JFF <onboarding@resend.dev>` — Resend will only deliver to the API-key owner's address but it's fine for soft launch.

---

## 3. Polar

You'll set up:
- 1 organization
- 2 products (Starter $3/mo recurring, Pro $9/mo recurring)
- 1 webhook endpoint pointing at `https://api.jff.dev/api/webhooks/polar`

Steps:

1. polar.sh → Create org → Get verified
2. Products → New product → "Starter" → $3 USD/month recurring → save the `product_id`
3. Repeat for "Pro" → $9 USD/month recurring → save the `product_id`
4. Settings → Webhooks → Add endpoint
   - URL: `https://api.jff.dev/api/webhooks/polar`
   - Events: `subscription.created`, `subscription.updated`, `subscription.canceled`
   - Save the **signing secret** (starts with `whsec_`)
5. Settings → API Keys → Create access token → save it

You should now have:
- `POLAR_ACCESS_TOKEN` — the API key
- `POLAR_WEBHOOK_SECRET` — the `whsec_...` value
- `POLAR_PRODUCT_STARTER` — the Starter `product_id`
- `POLAR_PRODUCT_PRO` — the Pro `product_id`

For development, Polar has a **sandbox** at sandbox.polar.sh — use a separate token + product ids in dev.

---

## 4. Cloudflare Workers (apps/api)

```bash
cd apps/api

# One-time login
pnpm exec wrangler login

# Set every secret (interactive prompt — paste then enter)
pnpm exec wrangler secret put DATABASE_URL
pnpm exec wrangler secret put BETTER_AUTH_SECRET
pnpm exec wrangler secret put BETTER_AUTH_URL          # https://justfuckingforms.com
pnpm exec wrangler secret put RESEND_API_KEY
pnpm exec wrangler secret put EMAIL_FROM
pnpm exec wrangler secret put POLAR_ACCESS_TOKEN
pnpm exec wrangler secret put POLAR_WEBHOOK_SECRET
pnpm exec wrangler secret put POLAR_PRODUCT_STARTER
pnpm exec wrangler secret put POLAR_PRODUCT_PRO
pnpm exec wrangler secret put SENTRY_DSN              # optional, leave blank if not using
```

Edit `apps/api/wrangler.jsonc` — uncomment the route binding before deploying:

```jsonc
"routes": [{ "pattern": "api.jff.dev/*", "zone_name": "jff.dev" }]
```

Then:

```bash
pnpm exec wrangler deploy
```

After the first deploy, point your DNS:
- Cloudflare DNS for `jff.dev` → A/AAAA `api` → proxied → set up the Workers route as above.

The cron `0 0 1 * *` is already in `wrangler.jsonc`. It fires automatically — no extra setup.

---

## 5. Vercel (apps/web)

1. vercel.com → New Project → Import the GitHub repo
2. **Root Directory**: `apps/web`
3. **Framework Preset**: Next.js
4. **Build Command**: `cd ../.. && pnpm turbo build --filter=@jff/web`
5. **Install Command**: `cd ../.. && pnpm install`
6. **Output Directory**: leave default (`.next`)

Environment variables — paste these:

| Name | Value | Notes |
|------|-------|-------|
| `DATABASE_URL` | pooled Neon URL | for Better Auth's transaction-using paths |
| `BETTER_AUTH_SECRET` | same as Workers | must match |
| `BETTER_AUTH_URL` | `https://justfuckingforms.com` | the apps/web origin |
| `RESEND_API_KEY` | from Resend | apps/web sends magic-link emails |
| `RESEND_FROM` | `JFF <notify@jff.dev>` | optional, falls back to `onboarding@resend.dev` |
| `NEXT_PUBLIC_API_URL` | `https://api.jff.dev` | apps/web fetches CRUD from here |

Deploy. Add `justfuckingforms.com` as a custom domain.

> Note: `apps/web/middleware.ts` is at the app root; Vercel auto-detects it. No extra config.

---

## Smoke test

After both apps are live:

```bash
# 1. Signup flow
curl https://justfuckingforms.com/login                      # expect 200
# In browser: complete magic-link sign-in → land on /dashboard

# 2. Public submission
curl -X POST https://api.jff.dev/f/<your form id> -d 'email=you@you.com&message=hi'
# Expect 200 + thank-you HTML

# 3. Cron (manual trigger via wrangler)
cd apps/api && pnpm exec wrangler triggers cron "0 0 1 * *"
# Or wait until the 1st of next month
```

---

## Day-2 checklist

- [ ] Sentry org + project for both apps; paste DSNs
- [ ] Cloudflare Email Routing for `support@jff.dev`
- [ ] Cloudflare Analytics for the Workers route (free)
- [ ] Vercel Analytics on `apps/web` (optional)
- [ ] Branch protection on `main` once you have collaborators
