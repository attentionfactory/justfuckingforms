// Plan-tier monthly submission limits. Single source of truth for the API
// quota check. Keep in sync with the marketing copy on /pricing and the
// /dashboard/billing tier cards.

import type { Plan } from '@jff/types';

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
