import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';

/* ============================================================================
   Better Auth tables — shapes match better-auth v1.1.x's documented Drizzle
   schema. We declare them ourselves (not auto-generated) so drizzle-kit can
   diff and produce migrations. Better Auth reads these by name via the
   drizzle adapter; field names must match exactly.
   ============================================================================ */

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Used by the magic-link plugin to store short-lived verification tokens.
export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/* ============================================================================
   Application-domain tables.
   ============================================================================ */

export const planEnum = pgEnum('plan', ['free', 'starter', 'pro']);
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'canceled',
  'past_due',
]);
export const notificationFrequencyEnum = pgEnum('notification_frequency', [
  'every',
  'daily',
  'weekly',
  'none',
]);
export const billingCycleEnum = pgEnum('billing_cycle', ['monthly', 'annual']);

export const forms = pgTable('forms', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  notificationEmail: text('notification_email').notNull(),
  notificationFrequency: notificationFrequencyEnum('notification_frequency')
    .notNull()
    .default('every'),
  redirectUrl: text('redirect_url'),
  honeypotField: text('honeypot_field').notNull().default('website'),
  allowedDomains: jsonb('allowed_domains')
    .$type<Array<{ value: string; status: 'verified' | 'dev' | 'pending' }>>()
    .notNull()
    .default([]),
  strictOrigin: boolean('strict_origin').notNull().default(true),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  formId: uuid('form_id')
    .notNull()
    .references(() => forms.id, { onDelete: 'cascade' }),
  data: jsonb('data').$type<Record<string, unknown>>().notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  isSpam: boolean('is_spam').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  plan: planEnum('plan').notNull().default('free'),
  /**
   * 'monthly' or 'annual'. Determines which Polar product the subscription is
   * tied to. Annual gets ~17% off (2 months free). Free-tier users default to
   * 'monthly' since the cycle is meaningless for them.
   */
  billingCycle: billingCycleEnum('billing_cycle').notNull().default('monthly'),
  polarSubscriptionId: text('polar_subscription_id'),
  status: subscriptionStatusEnum('status').notNull().default('active'),
  currentPeriodEnd: timestamp('current_period_end'),
  submissionsUsed: integer('submissions_used').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
