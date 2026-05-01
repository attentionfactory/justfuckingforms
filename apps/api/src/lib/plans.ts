// Plan tier limits + pricing. Single source of truth for the API quota check
// and the price labels on /dashboard/billing. Mirrored in apps/web/lib/plans.ts.
//
// Annual = ~17% off (2 months free). Polar's two products per paid plan keep
// the pricing in sync; we display these here so the UI can render before
// hitting Polar.

import type { Plan, BillingCycle } from '@jff/types';

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 100,
  starter: 1000,
  pro: 10000,
};

export const PLAN_MAX_FORMS: Record<Plan, number | null> = {
  free: 3,
  starter: null, // unlimited
  pro: null,
};

/** Display prices in dollars (USD). Annual price = 10x monthly (i.e., 2 months free). */
export const PLAN_PRICES: Record<Plan, Record<BillingCycle, number>> = {
  free: { monthly: 0, annual: 0 },
  starter: { monthly: 3, annual: 30 },
  pro: { monthly: 9, annual: 90 },
};
