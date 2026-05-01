// Per-form origin allowlist matching.
//
// Patterns supported:
//   - exact: "transcriptx.xyz"     → matches https://transcriptx.xyz
//   - wildcard subdomain: "*.transcriptx.xyz" → matches any sub of transcriptx.xyz
//   - wildcard port: "localhost:*" → matches localhost on any port
//
// We accept either Origin or Referer to identify the requester. Origin is
// preferred since it's set by the browser for cross-origin requests. Referer
// is a fallback for older browsers.

export type AllowedDomain = {
  value: string;
  status: 'verified' | 'dev' | 'pending';
};

export type OriginCheckResult =
  | { allowed: true; origin: string }
  | { allowed: false; reason: 'no_origin_strict' | 'origin_not_allowed'; attempted: string | null };

/**
 * Decide whether a submission should be accepted.
 *
 * @param requestOrigin  raw Origin header value (or null if missing)
 * @param requestReferer raw Referer header (or null)
 * @param allowedDomains form's allowedDomains array (empty = allow anyone)
 * @param strictMode     when true, missing Origin → reject
 */
export function checkOrigin(
  requestOrigin: string | null,
  requestReferer: string | null,
  allowedDomains: AllowedDomain[],
  strictMode: boolean,
): OriginCheckResult {
  // Empty allowlist = "anyone can post". Common during initial setup.
  if (allowedDomains.length === 0) {
    return { allowed: true, origin: requestOrigin ?? requestReferer ?? '' };
  }

  const origin = requestOrigin ?? hostFromReferer(requestReferer);
  if (!origin) {
    return strictMode
      ? { allowed: false, reason: 'no_origin_strict', attempted: null }
      : { allowed: true, origin: '' };
  }

  for (const domain of allowedDomains) {
    if (matchesPattern(origin, domain.value)) {
      return { allowed: true, origin };
    }
  }
  return { allowed: false, reason: 'origin_not_allowed', attempted: origin };
}

function hostFromReferer(referer: string | null): string | null {
  if (!referer) return null;
  try {
    const u = new URL(referer);
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

function matchesPattern(origin: string, pattern: string): boolean {
  let host: string;
  let port: string;
  try {
    const u = new URL(origin);
    host = u.hostname;
    port = u.port;
  } catch {
    // Not a full URL — treat as bare host (e.g. allowedDomains row "transcriptx.xyz")
    host = origin;
    port = '';
  }

  // Pattern with port wildcard: "localhost:*"
  if (pattern.endsWith(':*')) {
    const baseHost = pattern.slice(0, -2);
    return host === baseHost; // any port matches
  }

  // Pattern with explicit port: "localhost:3000"
  if (pattern.includes(':')) {
    const [pHost, pPort] = pattern.split(':');
    return host === pHost && port === pPort;
  }

  // Pattern with wildcard subdomain: "*.transcriptx.xyz"
  if (pattern.startsWith('*.')) {
    const suffix = pattern.slice(2);
    return host === suffix || host.endsWith(`.${suffix}`);
  }

  // Exact host match (any port). Most common case.
  return host === pattern;
}
