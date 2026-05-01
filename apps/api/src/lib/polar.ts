// Minimal Polar HTTP client. We use REST directly rather than @polar-sh/sdk —
// the SDK pulls in zod + retry layers we don't need on Workers.
//
// Three call paths:
//   - createCheckout(env, args)        → hosted checkout URL for upgrade
//   - createCustomerPortal(env, args)  → hosted portal URL for "manage subscription"
//   - verifyWebhookSignature(...)      → HMAC-SHA256 against POLAR_WEBHOOK_SECRET
//
// Customer mapping: we pass our user.id as Polar's `external_id` when creating
// the customer. On webhooks, we resolve our user via that field — no extra DB
// column needed beyond subscriptions.polarSubscriptionId.

import type { Plan } from '@jff/types';

const POLAR_BASE = 'https://api.polar.sh/v1';

export type PolarCheckoutArgs = {
  productId: string;
  customerEmail: string;
  customerExternalId: string;
  successUrl: string;
};

export type PolarCheckoutResponse = {
  id: string;
  url: string;
};

export async function createCheckout(
  accessToken: string,
  args: PolarCheckoutArgs,
): Promise<PolarCheckoutResponse> {
  const res = await fetch(`${POLAR_BASE}/checkouts/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: args.productId,
      customer_email: args.customerEmail,
      customer_external_id: args.customerExternalId,
      success_url: args.successUrl,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '<no body>');
    throw new PolarError(res.status, `checkout failed: ${body}`);
  }
  return (await res.json()) as PolarCheckoutResponse;
}

export type PolarPortalArgs = {
  customerExternalId: string;
};

export type PolarPortalResponse = {
  customer_portal_url: string;
};

/**
 * Polar's customer portal session endpoint creates a short-lived link the
 * user can click to manage subscription / payment method / invoices on
 * Polar's hosted UI. Falls back to the customer-by-external lookup endpoint
 * if the customer doesn't have an active session yet.
 */
export async function createCustomerPortal(
  accessToken: string,
  args: PolarPortalArgs,
): Promise<PolarPortalResponse> {
  const res = await fetch(
    `${POLAR_BASE}/customer-sessions/`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_external_id: args.customerExternalId,
      }),
    },
  );
  if (!res.ok) {
    const body = await res.text().catch(() => '<no body>');
    throw new PolarError(res.status, `portal session failed: ${body}`);
  }
  return (await res.json()) as PolarPortalResponse;
}

/**
 * Verify a Polar webhook signature using HMAC-SHA256. Polar sends the signature
 * in `webhook-signature` (Standard Webhooks format: `v1,<base64>`). We compute
 * the expected HMAC and constant-time compare.
 *
 * @returns true if signature matches, false otherwise.
 */
export async function verifyWebhookSignature(
  rawBody: string,
  webhookId: string,
  webhookTimestamp: string,
  signatureHeader: string,
  secret: string,
): Promise<boolean> {
  // Standard Webhooks payload-to-sign format: "<id>.<timestamp>.<body>"
  const toSign = `${webhookId}.${webhookTimestamp}.${rawBody}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret.replace(/^whsec_/, '')),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(toSign));
  const expected = bufToBase64(sig);

  // Header looks like: "v1,<sig1> v1,<sig2>" (multiple acceptable)
  const candidates = signatureHeader
    .split(' ')
    .map((piece) => piece.split(',')[1])
    .filter((s): s is string => Boolean(s));

  return candidates.some((c) => safeEqual(c, expected));
}

export type PolarSubscriptionWebhook = {
  type: 'subscription.created' | 'subscription.updated' | 'subscription.canceled' | string;
  data: {
    id: string;
    status: 'active' | 'canceled' | 'past_due' | string;
    current_period_end: string | null;
    customer: {
      external_id: string | null;
      email: string;
    };
    product_id: string;
  };
};

/**
 * Map a Polar product_id back to our Plan enum. The mapping is configured
 * via env vars so prod/staging can use different Polar products.
 */
export function planForProduct(
  productId: string,
  env: { POLAR_PRODUCT_STARTER?: string; POLAR_PRODUCT_PRO?: string },
): Plan | null {
  if (productId === env.POLAR_PRODUCT_STARTER) return 'starter';
  if (productId === env.POLAR_PRODUCT_PRO) return 'pro';
  return null;
}

export class PolarError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'PolarError';
  }
}

function bufToBase64(buf: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
