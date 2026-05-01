#!/usr/bin/env node
// Inspect the Postgres schema — tables, enums, FKs, ledger.
//
// Usage: pnpm --filter @jff/db db:inspect

import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const here = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.resolve(here, '../../../.env.local') });

const url = (process.env.DATABASE_URL ?? '').replace('-pooler', '');
const c = new pg.Client({ connectionString: url });
await c.connect();

const t = await c.query(
  "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
);
console.log('TABLES:', t.rows.map((r) => r.table_name).join(', ') || '(none)');

const e = await c.query("SELECT typname FROM pg_type WHERE typtype = 'e' ORDER BY typname");
console.log('ENUMS: ', e.rows.map((r) => r.typname).join(', ') || '(none)');

const fks = await c.query(`
  SELECT tc.table_name AS from_table, kcu.column_name AS from_col,
         ccu.table_name AS to_table, ccu.column_name AS to_col
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu USING (constraint_schema, constraint_name)
  JOIN information_schema.constraint_column_usage ccu USING (constraint_schema, constraint_name)
  WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
  ORDER BY tc.table_name, kcu.column_name`);
console.log('FKs:');
for (const r of fks.rows) console.log(`  ${r.from_table}.${r.from_col} → ${r.to_table}.${r.to_col}`);

try {
  const ledger = await c.query(
    'SELECT id, hash, created_at FROM drizzle.__drizzle_migrations ORDER BY id',
  );
  console.log('LEDGER:');
  for (const r of ledger.rows)
    console.log(`  #${r.id}  ${r.hash.slice(0, 16)}…  when=${r.created_at}`);
} catch {
  console.log('LEDGER: (drizzle.__drizzle_migrations does not exist yet)');
}

await c.end();
