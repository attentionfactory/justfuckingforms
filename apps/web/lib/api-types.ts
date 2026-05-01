// Shared response shapes for apps/api endpoints. Kept in apps/web rather than
// @jff/types so they only ship to the dashboard bundle (the API owns its own
// types via Drizzle's $inferSelect).

import type {
  Plan,
  BillingCycle,
  NotificationFrequency,
  InferredField,
} from '@jff/types';

export type ApiForm = {
  id: string;
  userId: string;
  name: string;
  notificationEmail: string;
  notificationFrequency: NotificationFrequency;
  redirectUrl: string | null;
  honeypotField: string;
  allowedDomains: Array<{ value: string; status: 'verified' | 'dev' | 'pending' }>;
  strictOrigin: boolean;
  isActive: boolean;
  createdAt: string;
};

export type FormListItem = Pick<
  ApiForm,
  'id' | 'name' | 'notificationEmail' | 'isActive' | 'createdAt'
> & {
  lastSubmittedAt: string | null;
  /** API returns this as a string (postgres bigint cast). Coerce in the UI. */
  submissionCount: number | string;
};

export type FormStats = {
  allTime: number;
  thisMonth: number;
  spamBlocked: number;
  planUsed: number;
  plan: Plan;
  cycle: BillingCycle;
};

export type ApiSubmission = {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  ipAddress: string | null;
  userAgent: string | null;
  isSpam: boolean;
  createdAt: string;
};

export type SubmissionsListResponse = {
  rows: ApiSubmission[];
  total: number;
  page: number;
  limit: number;
};

export type SchemaResponse = {
  fields: Array<InferredField & { visible: boolean }>;
  sampleSize: number;
};

export type InboxRow = {
  id: string;
  formId: string;
  formName: string;
  data: Record<string, unknown>;
  isSpam: boolean;
  createdAt: string;
};

export type InboxResponse = {
  rows: InboxRow[];
};
