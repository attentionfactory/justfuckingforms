import { Hono } from 'hono';
import { dashboardCors } from './middleware/cors';
import { submissions } from './routes/submissions';
import { forms } from './routes/forms';
import { billing } from './routes/billing';
import type { AppEnv } from './types';

const app = new Hono<AppEnv>();

// Global error trap — Phase 5+ will capture these to Sentry. For now log + 500.
app.onError((err, c) => {
  console.error('[jff/api] unhandled', err);
  return c.json({ error: 'something broke. try again.' }, 500);
});

// Public probes
app.get('/', (c) => c.text('jff api. you POST → we email → we store the row.'));
app.get('/health', (c) => c.json({ ok: true }));

// Public submission endpoint — its own dynamic CORS lives inside (Phase 5).
app.route('/', submissions);

// Dashboard endpoints — static CORS allowlist for the web origin.
app.use('/api/forms/*', dashboardCors());
app.use('/api/inbox/*', dashboardCors());
app.use('/api/billing/*', dashboardCors());
app.route('/', forms);
app.route('/', billing);

// Cron handler stub — Phase 9b resets submissionsUsed at month boundary.
export default {
  fetch: app.fetch,
  scheduled(_event, _env, _ctx) {
    // TODO Phase 9b: reset submissionsUsed=0 and bump currentPeriodEnd
    // for active subscriptions whose currentPeriodEnd < now().
    console.log('[jff/api] cron tick — monthly reset (phase 9b)');
  },
} satisfies ExportedHandler<AppEnv['Bindings']>;
