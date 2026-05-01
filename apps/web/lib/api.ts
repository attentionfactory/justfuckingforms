// Server-only fetch helper that proxies dashboard reads to apps/api.
//
// Forwards the incoming request's `Cookie` header so the API's session
// middleware can validate. Result: server components and server actions can
// call the API as the logged-in user without manual auth plumbing.

import 'server-only';
import { headers } from 'next/headers';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787';

export type ApiError = { error: string };

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const cookie = (await headers()).get('cookie') ?? '';
  return fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.headers as Record<string, string> | undefined),
      cookie,
    },
    cache: 'no-store',
  });
}

/** GET helper that throws on non-2xx and returns parsed JSON. */
export async function apiGet<T>(path: string): Promise<T> {
  const res = await apiFetch(path);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as Partial<ApiError>;
    throw new ApiHttpError(res.status, body.error ?? `request failed: ${path}`);
  }
  return res.json() as Promise<T>;
}

/** Like apiGet but returns null on 404 instead of throwing. Useful for detail
    pages that should render notFound() rather than crash. */
export async function apiGetOrNull<T>(path: string): Promise<T | null> {
  const res = await apiFetch(path);
  if (res.status === 404) return null;
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as Partial<ApiError>;
    throw new ApiHttpError(res.status, body.error ?? `request failed: ${path}`);
  }
  return res.json() as Promise<T>;
}

export class ApiHttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiHttpError';
  }
}
