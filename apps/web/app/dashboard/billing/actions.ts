"use server";

import { apiFetch } from "@/lib/api";

type Result = { ok: true; url: string } | { ok: false; error: string };

async function jsonError(res: Response): Promise<string> {
  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  return body?.error ?? `request failed (${res.status})`;
}

export async function checkoutAction(plan: "starter" | "pro"): Promise<Result> {
  const res = await apiFetch("/api/billing/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ plan }),
  });
  if (!res.ok) return { ok: false, error: await jsonError(res) };
  const { url } = (await res.json()) as { url: string };
  return { ok: true, url };
}

export async function portalAction(): Promise<Result> {
  const res = await apiFetch("/api/billing/portal", { method: "POST" });
  if (!res.ok) return { ok: false, error: await jsonError(res) };
  const { url } = (await res.json()) as { url: string };
  return { ok: true, url };
}
