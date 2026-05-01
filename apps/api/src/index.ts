import { Hono } from 'hono';
import { sql } from 'drizzle-orm';
import { createDb, schema } from '@jff/db';
import { dashboardCors } from './middleware/cors';
import { submissions } from './routes/submissions';
import { forms } from './routes/forms';
import { billing } from './routes/billing';
import type { AppEnv } from './types';

const app = new Hono<AppEnv>();

app.onError((err, c) => {
  console.error('[jff/api] unhandled', err);
  return c.json({ error: 'something broke. try again.' }, 500);
});

app.get('/', (c) => c.text('jff api. you POST → we email → we store the row.'));
app.get('/health', (c) => c.json({ ok: true }));

app.route('/', submissions);

app.use('/api/forms/*', dashboardCors());
app.use('/api/inbox/*', dashboardCors());
app.use('/api/billing/*', dashboardCors());
app.route('/', forms);
app.route('/', billing);

/**
 * Monthly reset cron. Cloudflare fires `scheduled()` at `0 0 1 * *` (see
 * wrangler.jsonc). We:
 *   1. Reset submissionsUsed = 0 on every active subscription
 *   2. Bump currentPeriodEnd by 30 days where it's now or in the past
 *
 * Free-tier rows have no Polar subscription, so currentPeriodEnd may be NULL —
 * we still reset their counter so they get the next 100 free submissions.
 */
async function runMonthlyReset(env: AppEnv['Bindings']) {
  const db = createDb(env.DATABASE_URL);
  const result = await db.execute(sql`
    UPDATE subscriptions
    SET
      submissions_used = 0,
      current_period_end = CASE
        WHEN current_period_end IS NULL OR current_period_end <= NOW()
          THEN NOW() + INTERVAL '30 days'
        ELSE current_period_end
      END
    WHERE status = 'active'
  `);
  return result;
}

export default {
  fetch: app.fetch,
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(
      (async () => {
        try {
          const r = await runMonthlyReset(env);
          console.log('[jff/cron] monthly reset complete', { rowCount: r.rowCount });
        } catch (err) {
          console.error('[jff/cron] reset failed', err);
        }
      })(),
    );
  },
} satisfies ExportedHandler<AppEnv['Bindings']>;
