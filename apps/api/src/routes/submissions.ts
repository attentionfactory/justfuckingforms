import { Hono } from 'hono';
import type { AppEnv } from '../types';

// Public submission endpoint — POST /f/:formId. No auth.
// Phase 5 implements: lookup form, quota check, honeypot, rate limit,
// origin allowlist, jsonb insert, fire-and-forget email.

export const submissions = new Hono<AppEnv>();

submissions.post('/f/:formId', async (c) => {
  const formId = c.req.param('formId');
  return c.json(
    { error: 'submission handler arrives in phase 5', formId },
    501,
  );
});
