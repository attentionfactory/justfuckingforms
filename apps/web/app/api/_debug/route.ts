// TEMPORARY — delete after diagnosing the prod magic-link 500.
// Returns presence (not values) of env vars + a quick DB ping result.

import { NextResponse } from "next/server";
import { createNodeDb, sql } from "@jff/db";

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

  // Mirror lib/auth.ts: -pooler stripped, node-postgres pool.
  let dbResult = "(not tested)";
  try {
    const url = (process.env.DATABASE_URL ?? "").replace("-pooler", "");
    if (!url) throw new Error("no DATABASE_URL");
    const db = createNodeDb(url);
    const r = await db.execute(sql`SELECT 1 as ok, current_user as who`);
    dbResult = `ok rows=${r.rows.length} who=${(r.rows[0] as { who?: string })?.who ?? "?"}`;
  } catch (err) {
    dbResult = `error: ${(err as Error).message}`;
  }

  // Import lib/auth and try a method call so the lazy proxy actually builds.
  let authImport = "(not tested)";
  try {
    const { auth } = await import("@/lib/auth");
    // Forces the proxy to build the Better Auth instance.
    const session = await auth.api.getSession({
      headers: new Headers(),
    });
    authImport = `built; session=${session ? "exists" : "null"}`;
  } catch (err) {
    authImport = `error: ${(err as Error).message}`;
  }

  return NextResponse.json({ env, dbResult, authImport });
}
