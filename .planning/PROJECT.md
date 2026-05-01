# JustFuckingForms (JFF)

## What This Is

A dead-simple form backend service for indie developers. Devs paste an endpoint into their HTML form's `action` attribute; JFF catches the submission, filters spam, emails it to them, and stores it in a dashboard. Direct competitor to Formspree ($10/mo) and FormBee ($5/mo) — JFF prices at **$3/mo for 1k submissions**, free tier 100/mo.

Audience: tired indie devs who want a backend in 12 seconds, no SDK, no API keys, no form builder.

## Core Value

**You POST → we email → we store the row.** If the submission handler at `POST /f/:formId` doesn't reliably receive, persist, spam-filter, and email a submission within ~1s, nothing else matters.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Public submission endpoint at `api.jff.dev/f/:formId` with honeypot, rate limit, origin allowlist, and email notification.
- [ ] Schema-less submission storage (`jsonb`) with inferred column UI from recent rows.
- [ ] Magic-link email auth (Better Auth + Resend), no passwords required for v1 (spec mentioned email/pw but design locked to magic-link only).
- [ ] Multi-tenant dashboard: forms list, per-form detail (overview/code/settings), per-form submissions table with column picker, single-submission view, cross-form inbox grouped by day.
- [ ] Per-form allowed-domains origin allowlist with wildcard + dev-port support and strict mode.
- [ ] Polar-billed tiers — Free (100/3 forms), Starter $3/1k, Pro $9/10k — with usage bar, plan card, invoice list.
- [ ] Quota gate that pauses a form when monthly cap is hit (visitor sees 429 page; owner sees red banner).
- [ ] Visitor surfaces: default thank-you page, JFF-branded notification email template, 404 for missing forms, 429 quota page.
- [ ] Onboarding: 3-step new-form wizard with notification frequency choice (every / daily digest / weekly digest / none).
- [ ] Account settings: change email, notification preferences, API token (reveal/rotate), delete-account flow.
- [ ] Referral program: shareable `/r/:code` link, $3-each-side credit on paid signup, 12-month stack cap, activity log.
- [ ] AF-style visual system: white #fefefe bg only, Geist sans + JetBrains Mono, neutral-950 headlines, #888 body, #0099ff link blue, no dark mode.
- [ ] Full landing page at `justfuckingforms.com` with embedded live demo form posting to a real endpoint.
- [ ] Cloudflare Workers deploy of `apps/api` with Cron Triggers monthly reset; Vercel deploy of `apps/web`.

### Out of Scope

- File uploads — bandwidth/storage cost, not core to "post a form" loop.
- Custom endpoint domains — overkill for v1; defer until 50+ paying users ask.
- Zapier / Make / n8n — webhooks aren't even in v1; integrations layer later.
- Multi-step forms — JFF is a backend, not a builder.
- Built-in form-builder UI — you have HTML; JFF receives.
- Auto-response emails to submitters — adds template management surface.
- Webhooks (signed callbacks) — defer to v2.
- Team accounts / multi-user workspaces — single-user only in v1.
- Slack / Discord notifications — email is the channel.
- Mobile-native dashboard (responsive web only).
- Submissions-over-time analytics chart — flagged cuttable in design review.
- "Bold" mono brutalism landing variant — removed during design review (only Safe AF-column landing ships).
- Audit log — overkill for a $3 product.
- Dark mode — explicitly killed in design review.

## Context

**Author background:** indie hacker shipping their own SaaS targeting indie devs. Existing sites for dogfooding: transcriptx.xyz, attentionfactory.io, mercythaddeus.xyz. Voice across the product is "tired developer, slightly annoyed" — copy stays functional, slightly profane, no marketing speak.

**Design provenance:** UI was iterated in Claude Design (claude.ai/design) and exported as a HTML/JSX prototype bundle (`/tmp/jff_design/iloveforms/`). Source-of-truth for visuals: every `.jsx` file in `iloveforms/project/`. The chat transcript in `iloveforms/chats/chat1.md` records the design intent (no schema, no form builder, no dark mode, allowed-domains added, inbox added, bold variants removed).

**Critical engineering constraint:** Drizzle on Cloudflare Workers MUST use the Neon HTTP driver (`@neondatabase/serverless` + `drizzle-orm/neon-http`). Standard `pg` does not work in Workers — TCP not supported.

## Constraints

- **Tech stack**: Turborepo + pnpm; Next.js 15 (App Router) on Vercel; Hono on Cloudflare Workers; Neon Postgres + Drizzle (HTTP driver); Better Auth (magic link via Resend); Polar for billing; CF Workers Rate Limiting API; CF Cron Triggers for monthly reset; Sentry; Tailwind + shadcn/ui — *locked v1.*
- **Cost ceiling**: ~$5/mo at launch (Workers Paid plan only). Everything else free until scale.
- **Voice**: Functional, slightly annoyed, lowercase. "Wrong password." not "Authentication failed." Every f-bomb in the spec stays.
- **No dark mode**: explicit user decision; do not add system-preference toggles.
- **Visual lock**: white-only bg #fefefe, AF-style narrow column for marketing/auth/onboarding (max-w-600), sidebar shell for dashboard, JetBrains Mono only for endpoints/code/IDs/numerics.
- **Workflow**: GitHub milestones grouping issues; PRs always close issues. No co-author attribution on commits.
- **Scaffolding**: use official CLIs (`pnpm dlx create-turbo`, `pnpm create next-app`, `pnpm create cloudflare`, `pnpm dlx shadcn`) — never hand-create configs that a generator owns.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Magic-link only auth (no email/pw) | Spec listed both but design locked to magic link only; simpler surface, fewer error states | — Pending |
| Schema inferred from `name=` attrs | Avoids becoming Airtable; spec fits "we receive POST" model | — Pending |
| Drop "Bold" landing variant | User cut after design review | — Pending |
| Cross-form Inbox in sidebar | Useful when user owns 4+ forms; better than only per-form submissions tab | — Pending |
| Allowed-domains per form | Mercy explicitly asked for origin allowlist | — Pending |
| Notification frequency at create-time, not buried | Onboarding step exposes every/daily/weekly/none directly | — Pending |
| Drizzle Neon HTTP driver (not pg) | Workers don't support raw TCP | ✓ Required |
| Polar over Stripe | Polar handles tax + global compliance for tiny indie SaaS | — Pending |
| 9-phase ROADMAP mirroring spec build order | Each Day-block from the 3-day sprint = one milestone | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-01 after initialization*
