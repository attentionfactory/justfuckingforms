export type Plan = 'free' | 'starter' | 'pro';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due';
export type NotificationFrequency = 'every' | 'daily' | 'weekly' | 'none';

export type Form = {
  id: string;
  userId: string;
  name: string;
  notificationEmail: string;
  redirectUrl: string | null;
  honeypotField: string;
  notificationFrequency: NotificationFrequency;
  isActive: boolean;
  createdAt: Date;
};

export type Submission = {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  ipAddress: string | null;
  userAgent: string | null;
  isSpam: boolean;
  createdAt: Date;
};

export type InferredField = {
  key: string;
  type: 'string' | 'text' | 'number' | 'boolean' | 'json';
  seen: number;
  pct: number;
  isNew: boolean;
  sample: string;
};
