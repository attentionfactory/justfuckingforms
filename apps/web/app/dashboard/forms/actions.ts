"use server";

// Server actions for dashboard form mutations. Each one calls apps/api with
// the request's session cookie (forwarded by apiFetch), then revalidates the
// affected dashboard paths so the UI re-fetches fresh data on next render.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { ApiForm } from "@/lib/api-types";
import type { NotificationFrequency } from "@jff/types";

type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

async function jsonError(res: Response): Promise<string> {
  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  return body?.error ?? `request failed (${res.status})`;
}

/* ============================================================================
   Create form (onboarding wizard)
   ============================================================================ */

export async function createFormAction(input: {
  name: string;
  notificationEmail: string;
  notificationFrequency: NotificationFrequency;
}): Promise<ActionResult<{ id: string }>> {
  const res = await apiFetch("/api/forms", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) return { ok: false, error: await jsonError(res) };
  const { form } = (await res.json()) as { form: ApiForm };
  revalidatePath("/dashboard");
  return { ok: true, data: { id: form.id } };
}

/* ============================================================================
   Update form (settings save, allowed-domains save, pause toggle)
   ============================================================================ */

export type UpdateFormInput = Partial<{
  name: string;
  notificationEmail: string;
  notificationFrequency: NotificationFrequency;
  redirectUrl: string | null;
  honeypotField: string;
  allowedDomains: ApiForm["allowedDomains"];
  strictOrigin: boolean;
  isActive: boolean;
}>;

export async function updateFormAction(
  id: string,
  input: UpdateFormInput,
): Promise<ActionResult> {
  const res = await apiFetch(`/api/forms/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) return { ok: false, error: await jsonError(res) };
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/forms/${id}`);
  revalidatePath(`/dashboard/forms/${id}/settings/domains`);
  return { ok: true, data: undefined };
}

/* ============================================================================
   Delete form
   ============================================================================ */

export async function deleteFormAction(id: string): Promise<ActionResult> {
  const res = await apiFetch(`/api/forms/${id}`, { method: "DELETE" });
  if (!res.ok) return { ok: false, error: await jsonError(res) };
  revalidatePath("/dashboard");
  return { ok: true, data: undefined };
}

/* ============================================================================
   Convenience: redirect-after-create for the onboarding step-3 'go to form'.
   ============================================================================ */

export async function createAndRedirect(input: {
  name: string;
  notificationEmail: string;
  notificationFrequency: NotificationFrequency;
}): Promise<{ error?: string }> {
  const result = await createFormAction(input);
  if (!result.ok) return { error: result.error };
  redirect(`/dashboard/forms/${result.data.id}`);
}
