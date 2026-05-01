// Mirror of apps/api/src/lib/plans.ts for the web bundle. Single source of
// truth would belong in @jff/types, but since it's small + obvious we keep
// them duplicated. Update both when tier limits or prices change.

import type { Plan, BillingCycle } from "@jff/types";

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 100,
  starter: 1000,
  pro: 10000,
};

/** Display prices in dollars (USD). Annual = 10x monthly (2 months free). */
export const PLAN_PRICES: Record<Plan, Record<BillingCycle, number>> = {
  free: { monthly: 0, annual: 0 },
  starter: { monthly: 3, annual: 30 },
  pro: { monthly: 9, annual: 90 },
};
