// TEMPORARY — diagnose prod /dashboard 500. delete after.
//
// Mirrors what dashboard/page.tsx does: forwards the incoming cookies to the
// Workers API and reports status + body, rather than throwing into a server
// component (which Vercel hides behind a generic 500).

import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cookie = (await headers()).get("cookie") ?? "";
  const cookieNames = cookie
    .split(";")
    .map((c) => c.trim().split("=")[0])
    .filter(Boolean);

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

  const result: Record<string, unknown> = {
    apiBase,
    cookieNames,
    hasSessionCookie:
      cookieNames.includes("better-auth.session_token") ||
      cookieNames.includes("__Secure-better-auth.session_token"),
  };

  try {
    const r = await fetch(`${apiBase}/api/forms`, {
      headers: { cookie },
      cache: "no-store",
    });
    result.formsStatus = r.status;
    result.formsBody = await r.text();
  } catch (err) {
    result.formsError = (err as Error).message;
  }

  // Also test the /api/health endpoint (no auth) to confirm worker reachability.
  try {
    const r = await fetch(`${apiBase}/api/health`, { cache: "no-store" });
    result.healthStatus = r.status;
    result.healthBody = (await r.text()).slice(0, 200);
  } catch (err) {
    result.healthError = (err as Error).message;
  }

  return NextResponse.json(result);
}
