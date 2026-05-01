// Server-only Better Auth singleton. Imports the @jff/auth factory and binds
// it to the Drizzle client + runtime env. Anything in apps/web that needs
// server-side session info imports `auth` from here.
//
// We lazy-build the instance on first use rather than at module-load time so
// `next build` can statically collect the route file without env vars (Vercel
// only injects env at runtime, not during the build's static-collection pass).

import 'server-only';
import { createNodeDb } from '@jff/db';
import { createAuth, type Auth } from '@jff/auth';

const required = (name: string, value: string | undefined) => {
  if (!value)
    throw new Error(
      `${name} is required. Set it in .env.local at the repo root (see .env.example).`,
    );
  return value;
};

let _auth: Auth | null = null;

function buildAuth(): Auth {
  const databaseUrl = required('DATABASE_URL', process.env.DATABASE_URL);
  const authSecret = required('BETTER_AUTH_SECRET', process.env.BETTER_AUTH_SECRET);
  const baseUrl = required('BETTER_AUTH_URL', process.env.BETTER_AUTH_URL);
  const resendApiKey = required('RESEND_API_KEY', process.env.RESEND_API_KEY);

  // Better Auth wraps writes in db.transaction(); Neon's pooler (PgBouncer in
  // transaction mode) caches catalog state and breaks DDL idempotency, so we
  // strip `-pooler` for the auth client. Runtime queries that don't need
  // transactions (apps/api on Workers) keep using the pooled URL.
  const authDbUrl =
    process.env.DATABASE_URL_UNPOOLED ?? databaseUrl.replace('-pooler', '');

  const db = createNodeDb(authDbUrl);

  return createAuth(db, {
    authSecret,
    baseUrl,
    resendApiKey,
    emailFrom: process.env.RESEND_FROM ?? 'JFF <onboarding@resend.dev>',
  });
}

/**
 * Lazy proxy: routes / server components do `auth.api.getSession(...)` etc.
 * The first property access triggers `buildAuth()`, which reads env. After
 * that, we cache the instance.
 *
 * `has` and `ownKeys` are required because Better Auth's `toNextJsHandler`
 * uses `"handler" in auth` to branch — without these traps it reads the
 * empty target and returns false, then tries to call the proxy as a
 * function and crashes.
 */
export const auth = new Proxy({} as Auth, {
  get(_target, prop) {
    _auth ??= buildAuth();
    return Reflect.get(_auth, prop);
  },
  has(_target, prop) {
    _auth ??= buildAuth();
    return Reflect.has(_auth, prop);
  },
  ownKeys(_target) {
    _auth ??= buildAuth();
    return Reflect.ownKeys(_auth);
  },
  getOwnPropertyDescriptor(_target, prop) {
    _auth ??= buildAuth();
    return Reflect.getOwnPropertyDescriptor(_auth, prop);
  },
});
