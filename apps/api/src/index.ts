import { Hono } from 'hono';

type Bindings = {
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  RESEND_API_KEY: string;
  POLAR_ACCESS_TOKEN: string;
  POLAR_WEBHOOK_SECRET: string;
  SENTRY_DSN: string;
  FORM_SUBMIT_LIMITER: { limit: (opts: { key: string }) => Promise<{ success: boolean }> };
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', (c) => c.text('jff api. you POST → we email → we store the row.'));
app.get('/health', (c) => c.json({ ok: true }));

export default app;
