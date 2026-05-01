// Two factories — pick by runtime:
//   - createDb() in Cloudflare Workers (apps/api) — uses Neon's HTTP driver because
//     Workers can't open raw TCP. No `db.transaction()`.
//   - createNodeDb() in Node.js (apps/web on Vercel, scripts) — uses node-postgres
//     so consumers like Better Auth's drizzle adapter that wrap calls in
//     `db.transaction()` actually work.
// Both expose the same Drizzle schema and return type-compatible clients for
// most queries.

import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http';
import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';
import { Pool } from 'pg';
import * as schema from './schema';

export const createDb = (databaseUrl: string) => {
  const client = neon(databaseUrl);
  return drizzleHttp(client, { schema });
};

export const createNodeDb = (databaseUrl: string, opts?: { logger?: boolean }) => {
  const pool = new Pool({ connectionString: databaseUrl });
  return drizzleNode(pool, { schema, logger: opts?.logger ?? false });
};

export type Db = ReturnType<typeof createDb>;
export type NodeDb = ReturnType<typeof createNodeDb>;
export { schema, sql };
