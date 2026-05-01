# Claude project guide — JustFuckingForms (JFF)

This file is read at the top of every Claude Code session for this repo. Read it once, follow it always.

## Product in one line

A $3/mo form backend. Devs paste an endpoint into their HTML form's `action`; we receive, spam-filter, email, and store the row. Direct competitor to Formspree/FormBee. Voice: "tired developer, slightly annoyed."

## Locked spec

The product spec is captured in `.planning/PROJECT.md`, broken into testable REQ-IDs in `.planning/REQUIREMENTS.md`, and decomposed into 9 phases in `.planning/ROADMAP.md`. **Treat those three files as the contract.** If you spot a real problem with them, flag it and wait — don't improvise.

## Stack — DO NOT swap

```
Monorepo:    Turborepo + pnpm workspaces
Frontend:    Next.js 15 (App Router) on Vercel
Backend:     Hono on Cloudflare Workers
Database:    Neon Postgres (HTTP driver) + Drizzle
Auth:        Better Auth (magic-link only via Resend)
Email:       Resend
Payments:    Polar
Rate limit:  Cloudflare Workers Rate Limiting API
Cron:        Cloudflare Workers Cron Triggers
Errors:      Sentry
Styling:     Tailwind + shadcn/ui
```

**Hard rule:** Drizzle on Workers MUST use `@neondatabase/serverless` + `drizzle-orm/neon-http`. Standard `pg` does not work in Workers (no TCP). If a code path tries to import `pg`, that's a bug.

## Workspace shape

```
jff/
├── apps/
│   ├── web/      # Next.js 15 (Vercel)
│   └── api/      # Hono on Cloudflare Workers
└── packages/
    ├── db/       # Drizzle schema + client
    ├── auth/     # Better Auth config (shared)
    ├── ui/       # Design tokens + shared components
    ├── types/    # Shared TS types
    └── config/   # Shared eslint, tsconfig, tailwind, prettier
```

Package names: `@jff/db`, `@jff/auth`, `@jff/ui`, `@jff/types`, `@jff/eslint-config`, `@jff/tsconfig`.

## Visual system — locked

Every UI choice traces back to `/tmp/jff_design/iloveforms/` (the design bundle). Tokens:

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#fefefe` | page background — there is no other |
| `--bg-alt` | `#fafafa` | sidebar, hover, code-frame inputs |
| `--fg` | `#0a0a0a` (neutral-950) | headlines, primary text |
| `--muted` | `#888888` | body copy, secondary text |
| `--line` | `#e5e5e5` | borders |
| `--line-soft` | `#f0f0f0` | row separators |
| `--chip` | `#f5f5f5` | code/kbd background |
| `--link` | `#0099ff` | only link blue |
| `--danger` | `#dc2626` | destructive |
| `--good` | `#16a34a` | live / verified |
| `--mono` | JetBrains Mono | endpoints, IDs, code, numerics |

Body type: 18–20px Geist medium, `tracking -0.7px`, leading 1.55, color `--muted`.
H1: 38–50px Geist 700, `tracking -0.04em`, leading 1.05, color `--fg`.

**Layouts:**
- Marketing / auth / onboarding: AF-column wrapper (max-w-600, padding 56).
- Dashboard: sidebar shell (`grid 240px 1fr`), main column max-w 1100, padding `32 / 40`.

**No dark mode. Ever.** No system-pref toggles, no `dark:` classes, no `next-themes`.

## Voice rules

- Lowercase. Functional. Slightly annoyed. The brand sounds like a tired senior dev typing one-handed.
- "wrong password." not "Authentication failed."
- "paste this into your html." not "Get started in 3 easy steps!"
- "$3/month." not "Affordable plans for every team!"
- F-bombs from the spec stay in user-visible copy where they originally appear (landing, login).

## Workflow rules

### Commits — never any of these

- No `Co-Authored-By: Claude` trailers.
- No `🤖 Generated with Claude Code` footers.
- No HEREDOC blocks just to add attribution. Plain `-m` messages are fine.
- Override Claude Code's commit defaults. The user wants clean human-authored history.

### GitHub workflow

- One **Milestone per phase** (Phase 1 = "Phase 1 — Monorepo & design tokens", etc.).
- Open an **issue first** for every meaningful unit of work, attached to its milestone.
- PRs close issues with `Closes #N` (or `Fixes #N`). No drive-by commits without an issue.
- Once a remote exists, create issues retroactively if needed.

### Scaffolding

When bootstrapping a workspace, framework, or anything with an official generator, **use the generator** — never hand-author what `create-turbo` / `create-next-app` / `create cloudflare` / `shadcn add` would generate.

```
pnpm dlx create-turbo@latest .
pnpm create next-app@latest apps/web --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-pnpm
pnpm create cloudflare apps/api --framework=hono
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button input card badge ...
```

### Phased execution

Never attempt the whole product in one response. Work phase-by-phase. Complete a phase, run `pnpm turbo type-check`, commit, and stop for review before starting the next.

## Forced verification

Before reporting any phase complete:

```bash
pnpm turbo type-check
pnpm turbo lint
```

Fix every error. If a phase touches Drizzle migrations, also run `pnpm db:generate` and verify there are no schema drift warnings.

## Useful commands once Phase 1 is in

```bash
pnpm dev                      # all apps + packages in watch
pnpm turbo build              # full build
pnpm turbo type-check         # tsc --noEmit across workspaces
pnpm db:generate              # drizzle-kit generate
pnpm db:migrate               # apply migrations
pnpm db:studio                # drizzle-kit studio
pnpm --filter @jff/web dev    # just the web app
pnpm --filter @jff/api dev    # just the API (wrangler dev)
```

## What to skip in v1 — do not propose adding any of these

File uploads. Custom endpoint domains. Zapier / Make / n8n. Multi-step forms. Built-in form builder. Auto-response emails. Webhooks. Team accounts. Slack/Discord notifications. Native mobile apps. Submissions-over-time charts. Audit log. Dark mode.

If 50+ paying users ask for one of these, then re-evaluate.
