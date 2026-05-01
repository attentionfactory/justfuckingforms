// TEMPORARY — delete after diagnosing the prod magic-link 500.
// Returns presence (not values) of env vars + a quick DB ping result.

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const envs = [
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "RESEND_API_KEY",
    "RESEND_FROM",
    "NEXT_PUBLIC_API_URL",
  ];
  const env: Record<string, string> = {};
  for (const k of envs) {
    const v = process.env[k];
    env[k] = v ? `set (len ${v.length})` : "MISSING";
  }

  // Try a DB connect via the same path Better Auth uses.
  let dbResult = "(not tested)";
  try {
    const { Pool } = await import("pg");
    const url = (process.env.DATABASE_URL ?? "").replace("-pooler", "");
    const pool = new Pool({ connectionString: url, max: 1 });
    const r = await pool.query("SELECT 1 as ok");
    await pool.end();
    dbResult = `ok rows=${r.rows.length}`;
  } catch (err) {
    dbResult = `error: ${(err as Error).message}`;
  }

  // Try importing @jff/auth + @jff/db.
  let authImport = "(not tested)";
  try {
    await import("@/lib/auth");
    authImport = "imported";
  } catch (err) {
    authImport = `error: ${(err as Error).message}`;
  }

  return NextResponse.json({ env, dbResult, authImport });
}
