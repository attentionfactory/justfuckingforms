# Roadmap: JustFuckingForms

**Milestone:** v1.0 launch
**Granularity:** Fine — 9 phases mirroring the spec's 3-day, 9-block build order. Each phase = one GitHub Milestone, work tracked via issues opened first and closed by PRs.
**Mode:** YOLO. Plan-check + verifier on. Parallel execution within each phase where dependencies allow.

## Phase Map

| # | Phase | Goal | REQs | UI hint |
|---|-------|------|------|---------|
| 1 | Monorepo & design tokens | Bootstrap Turborepo with all 7 workspaces, scaffold `apps/web` + `apps/api`, wire Geist + JetBrains Mono, install shadcn/ui with JFF tokens | SETUP-01..06 | yes |
| 2 | Database package | Drizzle schema for forms/submissions/subscriptions + Better Auth tables; `@jff/db` with Neon HTTP driver; migrations runnable | DB-01..04 | no |
| 3 | Auth package | `@jff/auth` exposing `createAuth(db, env)` with magic-link via Resend; sessions; auth pages | AUTH-01..06, WEB-04..06 | yes |
| 4 | API skeleton | Hono on Workers with Better Auth handler mounted, env bindings, Sentry, basic health route | (foundation for 5/6) | no |
| 5 | Submission handler | `POST /f/:formId` end-to-end: parse, lookup, quota, honeypot, rate limit, allowed-domains, insert, notify | API-01..10 | no |
| 6 | Dashboard CRUD endpoints | Forms / submissions / inbox / schema / export endpoints + integration tests | API-11..19 | no |
| 7 | Marketing & auth pages | Landing (LandingSafe + DemoForm + EmbedSnippet), 404 visitor surfaces, login/expired/verify auth pages | WEB-01..03, WEB-04..06, WEB-08 | yes |
| 8 | Dashboard UI | Sidebar shell + Forms list + Inbox + Empty + Onboarding + Form detail (overview/code/settings/submissions tabs) + Single submission + Schema panel + Allowed domains | DASH-01..20 | yes |
| 9 | Billing, polish, deploy | Polar checkout/portal/webhooks, Cron monthly reset, Billing/Account/Referrals screens, visitor 429 + thank-you + email template, delete-form modal, paused-form banner, Vercel + CF deploy | API-20..23, DASH-21..25, WEB-07/09/10, OPS-01..04 | yes |

## Phase 1 — Monorepo & design tokens

**Goal:** A coding agent can `pnpm install && pnpm dev` and see the Next.js dev server boot at `apps/web` with Geist + JetBrains Mono loaded and shadcn primitives importable.

**Requirements:** SETUP-01, SETUP-02, SETUP-03, SETUP-04, SETUP-05, SETUP-06

**Success criteria:**
1. `pnpm-workspace.yaml` lists `apps/*` and `packages/*`; root `package.json` defines turbo scripts (dev/build/lint/type-check/db:generate/db:migrate/db:studio).
2. `apps/web` boots Next.js 15 dev server; root layout loads Geist sans + JetBrains Mono via `next/font`.
3. `apps/api` Wrangler config exists; `wrangler dev` starts a placeholder Hono `GET /` returning "ok".
4. `packages/ui` exports a `tokens.css` with all 11 design tokens (`--bg #fefefe`, `--fg #0a0a0a`, `--muted #888888`, `--line #e5e5e5`, `--line-soft #f0f0f0`, `--chip #f5f5f5`, `--link #0099ff`, `--danger #dc2626`, `--good #16a34a`, `--mono`, `--bg-alt #fafafa`).
5. shadcn/ui initialized in `apps/web`; `Button`, `Input`, `Card`, `Badge` components added; theme config has dark-mode disabled.

**Build sequence:**
1. `pnpm dlx create-turbo@latest .` (or hand-port if scaffolder fails on non-empty dir)
2. `pnpm create next-app@latest apps/web --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-pnpm`
3. `pnpm create cloudflare apps/api --framework=hono` (non-interactive flags as available)
4. Create `packages/{db,auth,ui,types,config}` with minimal `package.json` + `tsconfig.json` extending `@jff/tsconfig`
5. Add `geist` and `next/font/google` (JetBrains Mono) imports in `apps/web/app/layout.tsx`
6. Write `packages/ui/src/tokens.css` and `packages/ui/src/globals.css` re-exported via `@jff/ui/styles`
7. `pnpm dlx shadcn@latest init` in `apps/web`; configure `components.json` with `@jff/ui` token alias
8. `pnpm dlx shadcn@latest add button input card badge table`

## Phase 2 — Database package

**Goal:** `@jff/db` exposes typed Drizzle client wired to Neon HTTP driver, with all required tables migrated.

**Requirements:** DB-01, DB-02, DB-03, DB-04

**Success criteria:**
1. `packages/db/src/schema.ts` defines `forms`, `submissions`, `subscriptions` tables matching the spec (cascading FKs, jsonb data column, plan/status pgEnums).
2. Better Auth Drizzle adapter consumed; tables `user`, `session`, `account`, `verification` materialize in same schema.
3. `createDb(databaseUrl)` returns typed client using `@neondatabase/serverless` + `drizzle-orm/neon-http`.
4. `pnpm db:generate` produces SQL migrations; `pnpm db:migrate` applies them against Neon dev branch.
5. drizzle-kit `studio` works.

## Phase 3 — Auth package + auth pages

**Goal:** A new user enters email at `/login`, gets a magic-link email, clicks it, lands on `/dashboard` with a session.

**Requirements:** AUTH-01..06, WEB-04..06

**Success criteria:**
1. `@jff/auth` exports `createAuth(db, env)` with magic-link plugin and Resend sender.
2. `apps/web` mounts Better Auth at `/api/auth/*`; middleware protects `/dashboard/*`.
3. `/login` renders LoginSafe (AF column, h1 38px, single email input, "send me a link" button → "check your email" card).
4. `/login/expired` renders LoginExpired ("that link is dead").
5. `/login/verify` (magic-link callback) renders MagicLinkLanding ("you're in", redirect with dot animation).
6. Sessions persist across refresh; logging out from sidebar UserMenu clears the session.

## Phase 4 — API skeleton

**Goal:** Hono on Workers serves all API routes with auth middleware, env bindings, and observability — even if handlers are stubbed.

**Requirements:** (foundation only)

**Success criteria:**
1. `apps/api/src/index.ts` mounts Hono app with routes registered for `/f/:formId`, `/api/auth/*`, `/api/forms`, `/api/forms/:id`, `/api/forms/:id/submissions`, `/api/forms/:id/schema`, `/api/inbox`, `/api/billing/*`, `/api/webhooks/polar`.
2. Better Auth handler is mounted and signing in via web works through the Workers API.
3. Sentry DSN wired; uncaught errors flush before the request ends (`waitUntil`).
4. `wrangler.toml` has `[[unsafe.bindings]] FORM_SUBMIT_LIMITER` rate limiter, env secrets stubbed, route binding for `api.jff.dev` recorded.
5. CORS middleware echoes `Access-Control-Allow-Origin` per allowed origin.

## Phase 5 — Submission handler

**Goal:** Posting a form to `POST /f/:formId` works end-to-end: validates, deduplicates spam, persists row, sends email, returns the right response shape.

**Requirements:** API-01..10

**Success criteria:**
1. `POST /f/:formId` returns 404 for unknown / inactive forms.
2. Honeypot field (configured per form) when filled marks `is_spam=true` and still returns 200.
3. Rate limit at 5 reqs / IP / minute / form via Cloudflare Rate Limiting; over-limit returns 429.
4. Origin allowlist enforced (wildcard + dev port); strict mode rejects no-Origin requests with 403.
5. `submissions` row inserted with `data` jsonb populated from urlencoded or JSON body.
6. `submissionsUsed` incremented on the user's active subscription within the same SQL transaction (or single round-trip via Neon HTTP).
7. Resend notification fires via `executionCtx.waitUntil()` using the JFF email template.
8. Response: `redirectUrl` → 302; `Accept: application/json` → JSON; default → thank-you HTML.
9. Integration tests cover honeypot, rate limit, allowed domains, quota gate.

## Phase 6 — Dashboard CRUD endpoints

**Goal:** All authenticated dashboard data calls resolve from real DB.

**Requirements:** API-11..19

**Success criteria:**
1. `GET /api/forms` returns user's forms with last-submission timestamp + count + active state — as needed by FormsListSafe.
2. `POST /api/forms` creates form with name, notification email, frequency, optional redirect — feeds Onboarding step 2.
3. `GET /api/forms/:id` returns detail + 3-stat aggregate (all-time, this month, spam blocked).
4. `PATCH` and `DELETE /api/forms/:id` work.
5. `GET /api/forms/:id/submissions` paginates, filters by status, free-text searches across jsonb `data`.
6. `GET /api/forms/:id/submissions/export` streams CSV.
7. `GET /api/forms/:id/schema` returns inferred fields (key, type, count, pct, sample, isNew).
8. `GET /api/inbox` returns day-grouped cross-form stream with optional filters.

## Phase 7 — Marketing & auth pages (UI)

**Goal:** Visitor lands on `/`, sees full LandingSafe, can submit the demo form and get a confirmation. Auth pages render. 404 catch-all visitor page renders.

**Requirements:** WEB-01..03 (already covered AUTH-related WEB-04..06 in Phase 3 implementation)

**Success criteria:**
1. `/` matches LandingSafe spec to within token tolerance — every section, copy line, hr, and footer link present.
2. EmbedSnippet copy button works (clipboard); coloration matches design (.tag pink, .attr blue, .str yellow, .com gray).
3. DemoForm posts to live `/f/demo` endpoint and shows the success card.
4. 404 page renders NotFound design.

## Phase 8 — Dashboard UI

**Goal:** Authenticated user sees fully working dashboard: list, detail, settings, submissions, schema, allowed domains, inbox, empty state, onboarding.

**Requirements:** DASH-01..20

**Success criteria:**
1. Sidebar shell renders with brand chip, active link state, sidebar bg `#fafafa`, right border `var(--line)`, badges for Forms (4) and Inbox (142).
2. UserMenu popover shows full menu (Account / Billing & usage / Workspace settings / Refer a dev (new) / Docs / Report broken / Log out).
3. `/dashboard` forms-list table works against real `/api/forms`.
4. `/dashboard/inbox` renders InboxPage with day groups, color chips per form, filter row, unread bar, spam dimming.
5. `/dashboard/forms/new` (Onboarding step 2) implements 3-step progress + frequency picker.
6. Empty state shows when 0 forms.
7. `/dashboard/forms/:id` overview tab matches FormDetailSafe with copy button + 3 stats + recent submissions.
8. Tabs (overview / submissions / settings / code) work; settings tab matches design; code tab shows EmbedSnippet + JSON fetch CodeBlock.
9. Submissions tab uses inferred schema from `/schema` and renders ColumnPicker; waiting state shows when no rows yet.
10. Schema panel renders at `/dashboard/forms/:id/schema` with field table + 2-new badge + meta tag.
11. Single submission view renders with raw payload CodeBlock and prev/next/delete.
12. `/dashboard/forms/:id/settings/domains` renders AllowedDomainsSettings — add row, list rows with status dots, strict mode checkbox, "recently blocked" terminal log.

## Phase 9 — Billing, polish, deploy

**Goal:** Plan upgrade flow works through Polar; quota gate triggers paused-form banner + 429 visitor page; visitor surfaces (thank-you + email + 429) all render; Vercel + CF deploys are live; cron resets monthly.

**Requirements:** API-20..23, DASH-21..25, WEB-07/09/10, OPS-01..04

**Success criteria:**
1. `/dashboard/billing` renders BillingPage with current-plan card, 3 tier cards, invoices table.
2. Polar checkout session opens for upgrade; webhook updates `subscriptions.plan/status/currentPeriodEnd`.
3. `/dashboard/settings` (account) renders AccountSettings with notification preferences, API token reveal/rotate, delete-account confirm flow.
4. `/dashboard/referrals` renders ReferralsPage with link card, 4 stats, activity table, rules card.
5. Quota-exceeded form shows red owner banner (PausedForm) with "upgrade to starter" CTA; visitor `POST` returns 429 + serves QuotaExceeded page when `Accept: text/html`.
6. Default thank-you page (ThankYouPage) served from API when `redirectUrl` empty + Accept html.
7. Resend email template (HTML) ships matching EmailNotification design — black "JFF" avatar, fields table, CTA, spam-check footer.
8. Delete-form confirm modal renders with form-name typing gate.
9. Vercel deploy of `apps/web` succeeds with all env vars.
10. CF Workers deploy succeeds; route binding for `api.jff.dev` works.
11. Cron Trigger fires on `0 0 1 * *`, resets `submissionsUsed` and bumps `currentPeriodEnd` for active subs.
12. Sentry receives errors from both apps; dashboards visible in Sentry UI.

## Dependencies

- Phase 2 depends on Phase 1.
- Phase 3 depends on Phase 2.
- Phase 4 depends on Phase 3 (Better Auth handler).
- Phase 5 depends on Phase 4.
- Phase 6 depends on Phase 4 (auth) + Phase 2 (db).
- Phase 7 depends on Phase 1 (tokens, shadcn) — can run after Phase 1 in parallel with 2/3/4 if dummy demo endpoint is mocked first.
- Phase 8 depends on Phase 6 (CRUD endpoints) + Phase 1 (tokens, shadcn).
- Phase 9 depends on Phases 5, 6, 8 (full UI + API surface). Polar/cron pieces can land independently.

## Workflow Rules (locked)

- **One GitHub Milestone per phase.** Issues opened first, PRs close them.
- **No co-author trailers** on commits.
- **Use scaffolding CLIs** for any new monorepo / framework / generator-owned config.
- **shadcn always** for UI primitives. Custom CSS allowed only via `packages/ui` design tokens; no inline-styled tokens scattered across components.
- **Voice rule** on every visible string: lowercase, functional, "tired developer."
- **Drizzle on Workers ⇒ neon-http driver.** Never `pg`. Hard rule.

---
*Defined: 2026-05-01*
