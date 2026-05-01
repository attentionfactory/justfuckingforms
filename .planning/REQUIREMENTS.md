# Requirements: JustFuckingForms

**Defined:** 2026-05-01
**Core Value:** You POST → we email → we store the row.

## v1 Requirements

Each REQ-ID maps to exactly one phase in `ROADMAP.md`. Voice rule applies to every visible string: lowercase, functional, slightly annoyed.

### Setup & Foundation

- [ ] **SETUP-01**: Monorepo bootstrapped with Turborepo + pnpm workspaces (`apps/web`, `apps/api`, `packages/db`, `packages/auth`, `packages/ui`, `packages/types`, `packages/config`).
- [ ] **SETUP-02**: Root `turbo.json`, `pnpm-workspace.yaml`, shared TS / ESLint / Tailwind / Prettier configs in `packages/config`.
- [ ] **SETUP-03**: `apps/web` scaffolded as Next.js 15 (App Router, TS, Tailwind, App dir, no `src/`).
- [ ] **SETUP-04**: `apps/api` scaffolded as Hono on Cloudflare Workers via `create cloudflare`.
- [ ] **SETUP-05**: Geist + JetBrains Mono fonts wired via `next/font`; design tokens exported as CSS vars in `packages/ui` matching `styles.css` (--bg, --fg, --muted, --line, --line-soft, --chip, --link, --danger, --good, --mono).
- [ ] **SETUP-06**: shadcn/ui initialized in `apps/web` with custom theme set to JFF tokens (white-only, no dark mode).

### Database

- [ ] **DB-01**: Drizzle schema in `packages/db/src/schema.ts` for `forms`, `submissions`, `subscriptions` + plan/status pgEnums.
- [ ] **DB-02**: Better Auth Drizzle adapter generates `users`, `sessions`, `accounts`, `verification` tables in same schema.
- [ ] **DB-03**: `createDb(databaseUrl)` exported from `@jff/db`, using Neon HTTP driver (`@neondatabase/serverless` + `drizzle-orm/neon-http`).
- [ ] **DB-04**: Drizzle migrations runnable via `pnpm db:generate` / `pnpm db:migrate` Turbo tasks.

### Auth

- [ ] **AUTH-01**: `createAuth(db, env)` exported from `@jff/auth` with Better Auth + magic-link plugin.
- [ ] **AUTH-02**: Magic link emails sent through Resend (`from: notify@jff.dev`), 15-minute expiry.
- [ ] **AUTH-03**: Magic link landing page shows "you're in" + redirects to `/dashboard`.
- [ ] **AUTH-04**: Expired-link state at `/login/expired` ("that link is dead") with re-send form.
- [ ] **AUTH-05**: Login page at `/login` (AF column, single email input + send button + "check your email" success state).
- [ ] **AUTH-06**: Sessions persist across refresh; auth-required routes redirect unauthenticated users.

### API — Submission Handler (the core)

- [ ] **API-01**: `POST /f/:formId` accepts `application/x-www-form-urlencoded` and `application/json`.
- [ ] **API-02**: Handler returns 404 if form not found, 404 if `is_active = false`, 429 if quota exceeded.
- [ ] **API-03**: Honeypot check — configured field filled → mark `is_spam=true`, still 200 response.
- [ ] **API-04**: Rate limit via Cloudflare Workers Rate Limiting API: max 5 submissions per IP per minute per form.
- [ ] **API-05**: Origin allowlist enforcement: reject (403) when `Origin`/`Referer` don't match allowed domains; strict mode rejects requests with no Origin header.
- [ ] **API-06**: Insert into `submissions` with `data` jsonb + ip + user agent.
- [ ] **API-07**: Increment `submissionsUsed` on user's subscription atomically.
- [ ] **API-08**: Send Resend notification via `c.executionCtx.waitUntil()` (fire-and-forget) using JFF-branded email template (subject: "new submission · {form name}").
- [ ] **API-09**: Response branches: `redirectUrl` set → 302; `Accept: application/json` → `{success:true}`; else → default thank-you HTML.
- [ ] **API-10**: Per-request `Access-Control-Allow-Origin` echoed back for allowlisted origins.

### API — Dashboard CRUD (authenticated)

- [ ] **API-11**: `GET /api/forms` lists current user's forms with last-submission, count, active state.
- [ ] **API-12**: `POST /api/forms` creates form (name, notification email, frequency, optional redirect URL).
- [ ] **API-13**: `GET /api/forms/:id` returns form detail + stats (all-time, this-month, spam blocked).
- [ ] **API-14**: `PATCH /api/forms/:id` updates name, notification email, redirect, honeypot field, allowed domains, strict mode, frequency, is_active (pause/resume).
- [ ] **API-15**: `DELETE /api/forms/:id` deletes form + cascades submissions.
- [ ] **API-16**: `GET /api/forms/:id/submissions` paginated, filter by status (live/spam), free-text search across data fields.
- [ ] **API-17**: `GET /api/forms/:id/submissions/export` returns CSV with inferred columns.
- [ ] **API-18**: `GET /api/forms/:id/schema` returns inferred schema (field key, type, count, pct, sample, isNew).
- [ ] **API-19**: `GET /api/inbox` cross-form unified stream grouped by day, supports filters (form / unread / live / spam).

### API — Billing

- [ ] **API-20**: `POST /api/billing/checkout` creates Polar checkout session for selected plan.
- [ ] **API-21**: `POST /api/billing/portal` opens Polar customer portal.
- [ ] **API-22**: `POST /api/webhooks/polar` handles `subscription.created/updated/canceled` events with signature verification.
- [ ] **API-23**: Cron Trigger `0 0 1 * *` resets `submissionsUsed = 0` and bumps `currentPeriodEnd` for active subscriptions.

### Web — Marketing

- [ ] **WEB-01**: `/` landing page implements LandingSafe layout — AF column (max-w-600, padding 56), nav (jff.dev / docs / login), h1 "just fucking forms.", body copy, embedded `<EmbedSnippet>` block, CTA email + button, demo `<DemoForm>` posting to real `/f/demo` endpoint, "what we don't do" section, footer (docs/status/changelog/terms/privacy + @jffdev/github + © 2026 line).
- [ ] **WEB-02**: Embed snippet renders syntax-highlighted `<form action method><input name=email><textarea name=message><button>` with copy button.
- [ ] **WEB-03**: Demo form has honeypot, optimistic submit state ("ready" → "POST..." → "200 OK"), success card showing "we caught it".

### Web — Auth pages

- [ ] **WEB-04**: `/login` implements LoginSafe — h1 "log in.", email input + "send me a link" button, post-submit "check your email" card; 38px h1, AF page wrapper.
- [ ] **WEB-05**: `/login/expired` implements LoginExpired — h1 "that link is dead.", re-send input.
- [ ] **WEB-06**: `/login/verify` implements MagicLinkLanding — green check + h1 "you're in.", "logging you in as {email}", redirect with dot animation.

### Web — Dashboard shell

- [ ] **DASH-01**: Sidebar shell layout (`grid 240px 1fr`, `--bg #fefefe`, sidebar bg `#fafafa`, right border `--line`) with brand "jff.dev", section labels, links (Forms / Inbox / Billing / Settings) with icons + numeric badges.
- [ ] **DASH-02**: User menu popover (bottom of sidebar): avatar + email + plan + Account / Billing & usage / Workspace settings / Refer a dev (new badge) / Docs / Report broken / Log out.
- [ ] **DASH-03**: Crumb trail + h1 + right-aligned actions header pattern; main column max-width 1100px, padding 32 / 40.

### Web — Forms list & Inbox

- [ ] **DASH-04**: `/dashboard` (forms list) — usage card with `<UsageBar>`, search input, table (status dot / name / endpoint mono / submissions / last received / kebab) and "you can have up to ∞ forms on pro" footer.
- [ ] **DASH-05**: `/dashboard/inbox` — filter row (search / form filter dropdown / unread / live / spam), color-chip per source form, day-grouped feed (today / yesterday / apr 28), unread bar indicator, spam dimming, "load older" link.
- [ ] **DASH-06**: Empty state at `/dashboard` when 0 forms — dashed card, "0 FORMS", "nothing here yet.", CTA "create my first form".

### Web — Onboarding

- [ ] **DASH-07**: `/dashboard/forms/new` — 3-step progress bar, "STEP 2 OF 3" label, h1 "name this form.", form name + email + frequency cards (every / daily digest / weekly digest / don't email me) + back/continue.
- [ ] **DASH-08**: Step 1 = workspace name (claim from chat — covered in spec footnote), Step 3 = "here's your endpoint, copy it." + go-to-form CTA.

### Web — Form detail

- [ ] **DASH-09**: `/dashboard/forms/:id` — crumb, h1 (form name), live/paused badge, pause/settings buttons, "created … notifications go to {email}" subhead.
- [ ] **DASH-10**: Tab bar `overview | submissions | settings | code` with active state (border-bottom 2px black).
- [ ] **DASH-11**: Overview tab — endpoint card (mono URL + copy button), 3 stat cards (submissions / this month / spam blocked), recent submissions list (top 4).
- [ ] **DASH-12**: Settings tab — form name / notification email / redirect URL / honeypot field name + Save + delete-form (red ghost) buttons; max-w 560.
- [ ] **DASH-13**: Code tab — html drop-in (EmbedSnippet) + `fetch` JSON variant CodeBlock.
- [ ] **DASH-14**: Paused-form variant — red banner with usage / "upgrade to starter" CTA + dimmed endpoint card.

### Web — Submissions & schema

- [ ] **DASH-15**: Submissions tab inside form detail — search / all/live/spam toggles / pagination / `export csv` button / table (received / email / message / status / kebab) with spam-row dimming.
- [ ] **DASH-16**: `/dashboard/forms/:id/submissions/:subId` single submission view — header (sender + ip + timestamp + delivered badge), prev/next/delete buttons, fields table, raw payload `<CodeBlock>`.
- [ ] **DASH-17**: Waiting-for-first-submission state — pulsing green dots + h2 + curl snippet `<CodeBlock>`.
- [ ] **DASH-18**: Inferred-columns submissions screen — schema-aware columns built from API `/schema`, column picker dropdown (key / pct / type / new badge / 10% threshold note).
- [ ] **DASH-19**: `/dashboard/forms/:id/schema` panel — inferred fields table (field / type / seen-in pct / sample / vis kbd) + `2 new` badge + meta `_subject` chip.

### Web — Allowed Domains

- [ ] **DASH-20**: `/dashboard/forms/:id/settings/domains` — copy explainer, add-domain row (input + button + wildcard help), allowed-origins card list (status dot, domain mono, badge verified/dev/pending, last hit, trash), strict mode checkbox, "recently blocked" terminal log (black bg, mono red 403 lines), CORS note.

### Web — Billing

- [ ] **DASH-21**: `/dashboard/billing` — current-plan card (black bg, white text, plan name + renew date + upgrade CTA + usage bar), 3 tier cards (free / starter / pro) with current ring, plan/forms/features list + switch button.
- [ ] **DASH-22**: Invoices table — date / plan / amount / paid badge / receipt download.

### Web — Account & Referrals

- [ ] **DASH-23**: `/dashboard/settings` (account) — email field + "we'll send a magic link to confirm" help, notification preferences (radios), API token (reveal/rotate), delete-account danger card with type-to-confirm.
- [ ] **DASH-24**: `/dashboard/referrals` — h1 + new badge, link card (copy link button), 4 stat cards (clicks / signups / converted / credit), activity table (when / email masked / status badge / credit), "fine print, but readable" rules card.

### Web — Visitor surfaces

- [ ] **WEB-07**: `/f/:formId/thanks` (default thank-you page) — black-circle check, h1 "submitted.", "they got it." copy, "delivered by jff.dev" footer with "get your own endpoint" link.
- [ ] **WEB-08**: 404 page — mono "404", h1 "that form doesn't exist.", back/dashboard buttons, mono "GET /f/{id} → 404" footer.
- [ ] **WEB-09**: 429 quota-exceeded visitor page — mono "429", h1 "this form is paused.", explanation, mono `POST /f/{id} → 429 quota_exceeded`.
- [ ] **WEB-10**: Notification email template (Resend HTML) matching design — black "JFF" avatar + "new submission · {form}" subject, fields table, CTA "view in dashboard →", spam-check footer + pause/change-email links.

### Modals

- [ ] **DASH-25**: Delete-form confirm modal — red trash icon, "delete this form?" + form name + submission count, type-the-form-name input, cancel + delete-form buttons.

### Ops

- [ ] **OPS-01**: `apps/web` deploys to Vercel via Root Directory `apps/web`, build `pnpm turbo build --filter=@jff/web`, with env vars wired (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `RESEND_API_KEY`, `POLAR_ACCESS_TOKEN`, `NEXT_PUBLIC_API_URL`).
- [ ] **OPS-02**: `apps/api` deploys to Cloudflare Workers via `wrangler deploy`; secrets via `wrangler secret put`; route binding for `api.jff.dev`.
- [ ] **OPS-03**: Sentry DSN wired in both apps (free tier).
- [ ] **OPS-04**: Cron Trigger configured for monthly reset (`0 0 1 * *`) with idempotent reset logic.

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Future

- **V2-01**: Webhook callbacks (signed) for form events.
- **V2-02**: Onboarding step 1 (workspace name) and step 3 (endpoint reveal) — only step 2 fully designed.
- **V2-03**: Mobile-optimized dashboard layouts (forms list + submissions).
- **V2-04**: Submission detail "raw email" view (debug tool).
- **V2-05**: Billing failure / payment-retry banner.
- **V2-06**: Spam folder/quarantine UI separate from main submissions table.

## Out of Scope

| Feature | Reason |
|---------|--------|
| File uploads | Bandwidth/storage cost; not core to "post a form" loop |
| Custom endpoint domains | Overkill for v1 |
| Zapier / Make / n8n | Webhooks aren't even in v1 |
| Multi-step forms | JFF is a backend, not a builder |
| Built-in form-builder UI | Users have HTML; that's the spec |
| Auto-response emails | Adds template management surface |
| Team accounts | Single-user only in v1 |
| Slack / Discord notifications | Email is the channel |
| Native mobile apps | Web-first |
| Submissions-over-time analytics | Cuttable per design review |
| "Bold" mono brutalism landing variant | Removed during design review |
| Audit log | Overkill for $3 product |
| Dark mode | Explicitly killed |
| API tokens for programmatic form creation | Visible in account settings UI but functional v2 |

## Traceability

Filled by `gsd-roadmapper` after roadmap creation. Each REQ-ID maps to exactly one phase. See `ROADMAP.md` for current mapping.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SETUP-01 → SETUP-06 | Phase 1 | Pending |
| DB-01 → DB-04 | Phase 2 | Pending |
| AUTH-01 → AUTH-06 | Phase 3 | Pending |
| API-01 → API-10 | Phase 5 | Pending |
| API-11 → API-19 | Phase 6 | Pending |
| API-20 → API-23 | Phase 9 | Pending |
| WEB-01 → WEB-03 | Phase 7 | Pending |
| WEB-04 → WEB-06 | Phase 7 | Pending |
| DASH-01 → DASH-08 | Phase 8 | Pending |
| DASH-09 → DASH-19 | Phase 8 | Pending |
| DASH-20 | Phase 8 | Pending |
| DASH-21 → DASH-25 | Phase 9 | Pending |
| WEB-07 → WEB-10 | Phase 9 | Pending |
| OPS-01 → OPS-04 | Phase 9 | Pending |

**Coverage:** all v1 REQs mapped to phases — see `ROADMAP.md` for the full table.

---
*Requirements defined: 2026-05-01*
*Last updated: 2026-05-01 after initialization*
