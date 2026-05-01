import { pgTable, uuid, text, timestamp, boolean, jsonb, integer, pgEnum } from 'drizzle-orm/pg-core';

// Better Auth tables (user, session, account, verification) are added by its Drizzle adapter
// in Phase 3. The application-domain tables live here.

export const planEnum = pgEnum('plan', ['free', 'starter', 'pro']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'canceled', 'past_due']);
export const notificationFrequencyEnum = pgEnum('notification_frequency', ['every', 'daily', 'weekly', 'none']);

export const forms = pgTable('forms', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  notificationEmail: text('notification_email').notNull(),
  notificationFrequency: notificationFrequencyEnum('notification_frequency').notNull().default('every'),
  redirectUrl: text('redirect_url'),
  honeypotField: text('honeypot_field').notNull().default('website'),
  allowedDomains: jsonb('allowed_domains').$type<Array<{ value: string; status: 'verified' | 'dev' | 'pending' }>>().notNull().default([]),
  strictOrigin: boolean('strict_origin').notNull().default(true),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  formId: uuid('form_id').references(() => forms.id, { onDelete: 'cascade' }).notNull(),
  data: jsonb('data').$type<Record<string, unknown>>().notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  isSpam: boolean('is_spam').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  plan: planEnum('plan').notNull().default('free'),
  polarSubscriptionId: text('polar_subscription_id'),
  status: subscriptionStatusEnum('status').notNull().default('active'),
  currentPeriodEnd: timestamp('current_period_end'),
  submissionsUsed: integer('submissions_used').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow()
});
