import 'dotenv/config';
import type { Config } from 'drizzle-kit';

// Pull DATABASE_URL from the repo-root .env.local in order of preference:
//   1. existing process.env (CI / shell export)
//   2. ../../.env.local (repo root)
//   3. ./.env.local (package-local, fallback)
import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.resolve(here, '../../.env.local') });
loadEnv({ path: path.resolve(here, '.env.local') });

const DATABASE_URL =
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is required. Copy .env.example → .env.local at the repo root and fill it in.',
  );
}

// Neon's pooler (PgBouncer in transaction mode) caches catalog state across
// connections, which breaks DDL idempotency in long migration files. Always
// run migrations against the direct (non-pooled) endpoint. We auto-derive it
// here by stripping `-pooler` from the host so callers can keep DATABASE_URL
// pointing at the pooled URL for runtime.
const migrationUrl = DATABASE_URL.replace('-pooler', '');

export default {
  schema: './src/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: { url: migrationUrl },
  strict: true,
  verbose: true,
} satisfies Config;
