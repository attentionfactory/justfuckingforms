import type { MiddlewareHandler } from 'hono';
import { eq } from 'drizzle-orm';
import { createDb, schema } from '@jff/db';
import type { AppEnv } from '../types';

// Session cookie name used by Better Auth (default config). In HTTPS prod
// Better Auth auto-prefixes with `__Secure-`, so we check both. If we ever
// customize Better Auth's cookieName, mirror that here.
const SESSION_COOKIE_NAME = 'better-auth.session_token';
const SESSION_COOKIE_NAME_SECURE = `__Secure-${SESSION_COOKIE_NAME}`;

/**
 * Validate the Better Auth session cookie issued by apps/web.
 *
 * Better Auth's handler lives on apps/web — it owns cookie issuance. Here on
 * apps/api we just read the same cookie and validate by querying the shared
 * `session` table. No transactions needed (read-only path), so the Neon HTTP
 * driver works fine.
 *
 * On match: attaches `user` to the Hono context and calls next().
 * On miss: returns 401 with a JFF-flavored error body.
 */
export const requireSession = (): MiddlewareHandler<AppEnv> => async (c, next) => {
  const rawCookie = c.req.header('cookie') ?? '';
  const token =
    parseCookie(rawCookie, SESSION_COOKIE_NAME) ??
    parseCookie(rawCookie, SESSION_COOKIE_NAME_SECURE);
  if (!token) return c.json({ error: 'unauthorized' }, 401);

  // Strip Better Auth's signature suffix — `<token>.<signature>` — we only need the token.
  const sessionToken = token.split('.')[0]!;

  const db = createDb(c.env.DATABASE_URL);
  const rows = await db
    .select({
      sId: schema.session.id,
      sExpires: schema.session.expiresAt,
      uId: schema.user.id,
      uEmail: schema.user.email,
      uName: schema.user.name,
    })
    .from(schema.session)
    .innerJoin(schema.user, eq(schema.user.id, schema.session.userId))
    .where(eq(schema.session.token, sessionToken))
    .limit(1);

  const row = rows[0];
  if (!row) return c.json({ error: 'session not found' }, 401);
  if (row.sExpires.getTime() < Date.now()) {
    return c.json({ error: 'session expired' }, 401);
  }

  c.set('user', { id: row.uId, email: row.uEmail, name: row.uName });
  await next();
};

function parseCookie(header: string, name: string): string | null {
  for (const piece of header.split(';')) {
    const [k, ...rest] = piece.trim().split('=');
    if (k === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}
