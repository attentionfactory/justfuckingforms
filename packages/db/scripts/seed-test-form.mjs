#!/usr/bin/env node
// Insert a test form + subscription for the existing logged-in user. Phase 6
// will replace this with the real /api/forms POST handler. Idempotent — drops
// + recreates the test form each time.

import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const here = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.resolve(here, '../../../.env.local') });

const url = (process.env.DATABASE_URL ?? '').replace('-pooler', '');
const c = new pg.Client({ connectionString: url });
await c.connect();

const TEST_FORM_ID = '00000000-0000-4000-8000-000000000001';
const TEST_USER_EMAIL = process.argv[2] ?? 'omobolathejoshua@gmail.com';

const userRow = (await c.query('SELECT id FROM "user" WHERE email = $1', [TEST_USER_EMAIL])).rows[0];
if (!userRow) {
  console.error(`no user with email ${TEST_USER_EMAIL}. log in via /login first.`);
  process.exit(1);
}
const userId = userRow.id;

await c.query('DELETE FROM forms WHERE id = $1', [TEST_FORM_ID]);
await c.query(
  `INSERT INTO forms (id, user_id, name, notification_email, notification_frequency, honeypot_field, allowed_domains, strict_origin, is_active)
   VALUES ($1, $2, $3, $4, 'every', 'website', '[]'::jsonb, false, true)`,
  [TEST_FORM_ID, userId, 'phase 5 smoke form', TEST_USER_EMAIL],
);

// Ensure a subscription row exists for this user (free tier, fresh counter).
await c.query(
  `INSERT INTO subscriptions (user_id, plan, status, submissions_used)
   VALUES ($1, 'free', 'active', 0)
   ON CONFLICT DO NOTHING`,
  [userId],
);

console.log('seeded:');
console.log('  form id:', TEST_FORM_ID);
console.log('  user:   ', TEST_USER_EMAIL);
console.log('  endpoint:', `http://localhost:8787/f/${TEST_FORM_ID}`);

await c.end();
