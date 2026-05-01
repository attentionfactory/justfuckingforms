#!/usr/bin/env node
// Drops public + drizzle schemas and recreates an empty public schema.
// Destructive — only use against dev databases. Re-running migrate after
// reset rebuilds everything from migrations/.
//
// Usage: pnpm --filter @jff/db db:reset

import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const here = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.resolve(here, '../../../.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('error: DATABASE_URL not set');
  process.exit(1);
}
const url = DATABASE_URL.replace('-pooler', '');

const client = new pg.Client({ connectionString: url });
await client.connect();

console.log('dropping public + drizzle schemas…');
await client.query('DROP SCHEMA IF EXISTS public CASCADE');
await client.query('DROP SCHEMA IF EXISTS drizzle CASCADE');
await client.query('CREATE SCHEMA public');
// Restore default grants. Neon's role is the database owner.
await client.query('GRANT ALL ON SCHEMA public TO neondb_owner').catch(() => {});
await client.query('GRANT ALL ON SCHEMA public TO public').catch(() => {});
console.log('reset complete.');

await client.end();
