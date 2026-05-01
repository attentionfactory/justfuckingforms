// Mirror of apps/api/src/lib/plans.ts for the web bundle. Single source of
// truth would belong in @jff/types, but since it's just two small constants
// we keep them duplicated and obvious. Update both when tier limits change.

import type { Plan } from "@jff/types";

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 100,
  starter: 1000,
  pro: 10000,
};
