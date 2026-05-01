import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { createDb, schema } from '@jff/db';
import { requireSession } from '../middleware/auth';
import {
  createCheckout,
  createCustomerPortal,
  verifyWebhookSignature,
  planAndCycleForProduct,
  productForPlanAndCycle,
  type PolarSubscriptionWebhook,
} from '../lib/polar';
import type { AppEnv } from '../types';
import type { BillingCycle, Plan } from '@jff/types';

export const billing = new Hono<AppEnv>();

/* ============================================================================
   POST /api/billing/checkout — create a Polar checkout session for an upgrade.
   Body: { plan: 'starter' | 'pro', cycle?: 'monthly' | 'annual' }
   `cycle` defaults to 'annual' (UI default); explicit 'monthly' supported.
   Returns: { url } — frontend window.location.href = url
   ============================================================================ */

billing.post('/api/billing/checkout', requireSession(), async (c) => {
  const user = c.get('user');
  const body = (await c.req.json().catch(() => ({}))) as {
    plan?: string;
    cycle?: string;
  };
  const plan = body.plan as Plan | undefined;
  const cycle = (body.cycle ?? 'annual') as BillingCycle;

  if (plan !== 'starter' && plan !== 'pro') {
    return c.json({ error: "pick 'starter' or 'pro'." }, 400);
  }
  if (cycle !== 'monthly' && cycle !== 'annual') {
    return c.json({ error: "cycle must be 'monthly' or 'annual'." }, 400);
  }

  const productId = productForPlanAndCycle(plan, cycle, c.env);
  if (!productId) {
    console.error('[jff/billing] no product for', { plan, cycle });
    return c.json({ error: 'this plan is not configured.' }, 500);
  }

  try {
    const checkout = await createCheckout(c.env.POLAR_ACCESS_TOKEN, {
      productId,
      customerEmail: user.email,
      customerExternalId: user.id,
      successUrl: `${c.env.WEB_BASE_URL}/dashboard/billing?upgraded=1`,
    });
    return c.json({ url: checkout.url });
  } catch (err) {
    console.error('[jff/billing] checkout failed', err);
    return c.json({ error: "couldn't start checkout. try again." }, 500);
  }
});

/* ============================================================================
   POST /api/billing/portal — open Polar's hosted portal for an existing customer.
   ============================================================================ */

billing.post('/api/billing/portal', requireSession(), async (c) => {
  const user = c.get('user');
  try {
    const portal = await createCustomerPortal(c.env.POLAR_ACCESS_TOKEN, {
      customerExternalId: user.id,
    });
    return c.json({ url: portal.customer_portal_url });
  } catch (err) {
    console.error('[jff/billing] portal failed', err);
    return c.json({ error: "couldn't open the portal. try again." }, 500);
  }
});

/* ============================================================================
   POST /api/webhooks/polar — receive Polar subscription events.
   ============================================================================ */

billing.post('/api/webhooks/polar', async (c) => {
  const rawBody = await c.req.text();
  const webhookId = c.req.header('webhook-id') ?? '';
  const webhookTimestamp = c.req.header('webhook-timestamp') ?? '';
  const webhookSig = c.req.header('webhook-signature') ?? '';

  if (!webhookId || !webhookTimestamp || !webhookSig) {
    return c.json({ error: 'missing webhook headers' }, 400);
  }

  const ok = await verifyWebhookSignature(
    rawBody,
    webhookId,
    webhookTimestamp,
    webhookSig,
    c.env.POLAR_WEBHOOK_SECRET,
  );
  if (!ok) return c.json({ error: 'bad signature' }, 401);

  let event: PolarSubscriptionWebhook;
  try {
    event = JSON.parse(rawBody) as PolarSubscriptionWebhook;
  } catch {
    return c.json({ error: 'invalid json' }, 400);
  }

  if (
    event.type !== 'subscription.created' &&
    event.type !== 'subscription.updated' &&
    event.type !== 'subscription.canceled'
  ) {
    return c.json({ ok: true, ignored: event.type });
  }

  const userId = event.data.customer.external_id;
  if (!userId) {
    console.warn('[jff/webhook] missing external_id on customer', event.data.customer);
    return c.json({ ok: true, warning: 'no external_id' });
  }

  const mapped = planAndCycleForProduct(event.data.product_id, c.env);
  if (!mapped) {
    console.warn('[jff/webhook] unknown product_id', event.data.product_id);
    return c.json({ ok: true, warning: 'unknown product' });
  }

  const status =
    event.type === 'subscription.canceled'
      ? 'canceled'
      : event.data.status === 'past_due'
        ? 'past_due'
        : 'active';

  const currentPeriodEnd = event.data.current_period_end
    ? new Date(event.data.current_period_end)
    : null;

  const db = createDb(c.env.DATABASE_URL);

  const [existing] = await db
    .select()
    .from(schema.subscriptions)
    .where(eq(schema.subscriptions.userId, userId))
    .limit(1);

  if (existing) {
    await db
      .update(schema.subscriptions)
      .set({
        plan: mapped.plan,
        billingCycle: mapped.cycle,
        status,
        polarSubscriptionId: event.data.id,
        currentPeriodEnd,
      })
      .where(eq(schema.subscriptions.userId, userId));
  } else {
    await db.insert(schema.subscriptions).values({
      userId,
      plan: mapped.plan,
      billingCycle: mapped.cycle,
      status,
      polarSubscriptionId: event.data.id,
      currentPeriodEnd,
      submissionsUsed: 0,
    });
  }

  return c.json({ ok: true, plan: mapped.plan, cycle: mapped.cycle, status });
});
