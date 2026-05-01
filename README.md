# just fucking forms.

a $3/month form backend. paste an endpoint into your html. we email you the submissions.

```
turborepo + pnpm workspaces
apps/web — next.js on vercel       https://jff-web.vercel.app
apps/api — hono on cloudflare      https://jff-api.young-queen-5ffa.workers.dev
neon postgres + drizzle, better auth (magic link via resend), polar billing
```

## dev

```bash
pnpm install
cp .env.example .env.local        # fill in neon, resend, better-auth secrets
pnpm db:migrate                   # apply schema
pnpm dev                          # web + api in watch
```

## deploy

see [README.deploy.md](./README.deploy.md).

## structure

```
apps/
  web/   next.js app router, dashboard + auth ui
  api/   hono worker, /f/:id submission endpoint, dashboard reads
packages/
  db/    drizzle schema + migrations
  auth/  better auth factory (shared)
  ui/    tokens + shared components
  types/ shared ts types
  config/ eslint, tsconfig, tailwind
```

## scripts

```bash
pnpm dev               # all apps in watch
pnpm turbo build       # full build
pnpm turbo type-check  # tsc --noEmit across the repo
pnpm db:generate       # drizzle-kit generate (after schema edits)
pnpm db:migrate        # apply migrations
pnpm db:studio         # drizzle studio
```

## stack — locked

next.js 16 · hono · cloudflare workers · neon · drizzle · better auth · resend · polar · tailwind · shadcn/ui

no dark mode. no file uploads. no team accounts. no webhooks. no zapier. if you need any of that, use a different product.
