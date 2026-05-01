#!/usr/bin/env node
// Apply pending Drizzle migrations against the configured Postgres database.
// Uses drizzle-orm's programmatic `migrate()` (canonical), not drizzle-kit's
// `migrate` CLI — the CLI ignores its own ledger and re-applies the first
// migration every time, which fights with Neon's catalog state.
//
// Usage: pnpm --filter @jff/db db:migrate
//
// Reads DATABASE_URL from repo-root .env.local. For Neon, automatically
// strips `-pooler` from the host so DDL hits the direct endpoint.

import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

const here = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.resolve(here, '../../../.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('error: DATABASE_URL not set. Copy .env.example → .env.local at repo root.');
  process.exit(1);
}
const url = DATABASE_URL.replace('-pooler', '');

const client = new pg.Client({ connectionString: url });
await client.connect();
const db = drizzle(client);

console.log('applying migrations…');
await migrate(db, { migrationsFolder: path.resolve(here, '../migrations') });
console.log('done.');

await client.end();
