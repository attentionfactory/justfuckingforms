import { Hono } from 'hono';
import { requireSession } from '../middleware/auth';
import type { AppEnv } from '../types';

// Polar billing — phase 9b implements checkout, portal, webhook handler.

export const billing = new Hono<AppEnv>();

billing.post('/api/billing/checkout', requireSession(), (c) =>
  c.json({ error: 'polar checkout arrives in phase 9b' }, 501),
);

billing.post('/api/billing/portal', requireSession(), (c) =>
  c.json({ error: 'polar portal arrives in phase 9b' }, 501),
);

// Polar → JFF webhook (no auth — uses signature verification instead).
billing.post('/api/webhooks/polar', (c) =>
  c.json({ error: 'polar webhook arrives in phase 9b' }, 501),
);
