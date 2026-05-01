// Server-only Better Auth singleton. Imports the @jff/auth factory and binds
// it to the Drizzle client + runtime env. Anything in apps/web that needs
// server-side session info imports `auth` from here.

import 'server-only';
import { createNodeDb } from '@jff/db';
import { createAuth } from '@jff/auth';

const required = (name: string, value: string | undefined) => {
  if (!value)
    throw new Error(
      `${name} is required. Set it in .env.local at the repo root (see .env.example).`,
    );
  return value;
};

const databaseUrl = required('DATABASE_URL', process.env.DATABASE_URL);
const authSecret = required('BETTER_AUTH_SECRET', process.env.BETTER_AUTH_SECRET);
const baseUrl = required('BETTER_AUTH_URL', process.env.BETTER_AUTH_URL);
const resendApiKey = required('RESEND_API_KEY', process.env.RESEND_API_KEY);

// Better Auth wraps writes in db.transaction(); Neon's pooler (PgBouncer in
// transaction mode) is fine with that, but we've seen sporadic "relation
// does not exist" errors that disappear on the direct endpoint. Strip
// `-pooler` for the auth client. Runtime queries that don't need
// transactions (apps/api on Workers) keep using the pooled URL.
const authDbUrl = process.env.DATABASE_URL_UNPOOLED ?? databaseUrl.replace('-pooler', '');

const db = createNodeDb(authDbUrl);

export const auth = createAuth(db, {
  authSecret,
  baseUrl,
  resendApiKey,
  emailFrom: process.env.RESEND_FROM ?? 'JFF <onboarding@resend.dev>',
});
