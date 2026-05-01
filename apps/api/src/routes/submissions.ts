import { Hono } from 'hono';
import { eq, sql } from 'drizzle-orm';
import { createDb, schema } from '@jff/db';
import type { AppEnv } from '../types';
import { parseSubmissionBody } from '../lib/parse-body';
import { checkOrigin } from '../lib/origin';
import { PLAN_LIMITS } from '../lib/plans';
import { defaultThankYouHtml } from '../lib/thank-you';
import { renderNotificationEmail } from '../email/notification';
import { sendEmail } from '../email/send';

// Public submission endpoint — POST /f/:formId.
//
// Order of operations matters for security + cost:
//   1. Form lookup (cheap; bail on 404 before any other work)
//   2. Origin allowlist (free, in-process — bail before rate limit so blocked
//      origins don't even consume the limiter quota)
//   3. Rate limit (workers binding — bail before parsing body)
//   4. Body parse
//   5. Honeypot + quota check
//   6. Insert + counter increment
//   7. Email via waitUntil (fire-and-forget)
//   8. Response (302 / JSON / thank-you HTML)

export const submissions = new Hono<AppEnv>();

// CORS preflight — mirror the response logic so OPTIONS doesn't surprise
// browsers. Origin handling matches the per-form allowlist.
submissions.options('/f/:formId', async (c) => {
  const origin = c.req.header('origin');
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin ?? null, true),
  });
});

submissions.post('/f/:formId', async (c) => {
  const formId = c.req.param('formId');
  const db = createDb(c.env.DATABASE_URL);
  const requestOrigin = c.req.header('origin') ?? null;
  const requestReferer = c.req.header('referer') ?? null;

  // 1. Form lookup
  const formRows = await db
    .select()
    .from(schema.forms)
    .where(eq(schema.forms.id, formId))
    .limit(1);
  const form = formRows[0];
  if (!form || !form.isActive) {
    return notFound(c, requestOrigin);
  }

  // 2. Origin allowlist
  const originResult = checkOrigin(
    requestOrigin,
    requestReferer,
    form.allowedDomains,
    form.strictOrigin,
  );
  if (!originResult.allowed) {
    return new Response(JSON.stringify({ error: 'origin not allowed' }), {
      status: 403,
      headers: { 'content-type': 'application/json' },
    });
  }
  const allowedOriginForCors = originResult.origin || requestOrigin || '';

  // 3. Rate limit (5/min per (form, ip))
  const ipAddress =
    c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for') ?? 'unknown';
  const rate = await c.env.FORM_SUBMIT_LIMITER.limit({ key: `${formId}:${ipAddress}` });
  if (!rate.success) {
    return rateLimited(c, allowedOriginForCors);
  }

  // 4. Body parse
  const data = await parseSubmissionBody(c.req.raw);
  const userAgent = c.req.header('user-agent') ?? '';

  // 5. Honeypot — mark spam; don't email, don't count toward quota.
  const honeypotValue = data[form.honeypotField];
  const isSpam =
    honeypotValue !== undefined &&
    honeypotValue !== '' &&
    honeypotValue !== null;

  // 6. Quota check (only enforced for non-spam; we still log spam rows so the
  //    owner can audit blocked traffic). If user has no subscription row yet,
  //    treat as free-tier defaults (Phase 6's form-create wires this).
  if (!isSpam) {
    const subRows = await db
      .select()
      .from(schema.subscriptions)
      .where(eq(schema.subscriptions.userId, form.userId))
      .limit(1);
    const sub = subRows[0];
    const limit = PLAN_LIMITS[sub?.plan ?? 'free'];
    const used = sub?.submissionsUsed ?? 0;
    if (used >= limit) {
      return quotaExceeded(c, formId, allowedOriginForCors);
    }
  }

  // 7. Insert
  await db.insert(schema.submissions).values({
    formId,
    data,
    ipAddress,
    userAgent,
    isSpam,
  });

  // 8. Increment counter (only for non-spam)
  if (!isSpam) {
    await db
      .update(schema.subscriptions)
      .set({ submissionsUsed: sql`${schema.subscriptions.submissionsUsed} + 1` })
      .where(eq(schema.subscriptions.userId, form.userId));
  }

  // 9. Notify owner (only for non-spam, and only when frequency=every).
  //    Phase 9b adds a daily/weekly digest cron for the other modes.
  if (!isSpam && form.notificationFrequency === 'every') {
    c.executionCtx.waitUntil(notifyOwner(c.env, form, data, ipAddress, userAgent));
  }

  // 10. Response branch
  return respondToSubmitter(c, form, allowedOriginForCors);
});

/* ============================================================================
   Helpers
   ============================================================================ */

function corsHeaders(origin: string | null, withMethods: boolean): Record<string, string> {
  const h: Record<string, string> = {
    'access-control-allow-origin': origin ?? '*',
    'vary': 'Origin',
  };
  if (withMethods) {
    h['access-control-allow-methods'] = 'POST, OPTIONS';
    h['access-control-allow-headers'] = 'Content-Type';
    h['access-control-max-age'] = '86400';
  }
  return h;
}

function notFound(c: Parameters<typeof corsHeaders>[0] extends infer _ ? any : never, origin: string | null) {
  return new Response(JSON.stringify({ error: "that form doesn't exist." }), {
    status: 404,
    headers: { 'content-type': 'application/json', ...corsHeaders(origin, false) },
  });
}

function rateLimited(c: any, origin: string) {
  const accept = c.req.header('accept') ?? '';
  const headers = { ...corsHeaders(origin, false), 'retry-after': '60' };
  if (accept.includes('application/json')) {
    return new Response(JSON.stringify({ error: 'rate_limited', retryAfter: 60 }), {
      status: 429,
      headers: { 'content-type': 'application/json', ...headers },
    });
  }
  return new Response('429 — slow down. try again in a minute.', {
    status: 429,
    headers: { 'content-type': 'text/plain', ...headers },
  });
}

function quotaExceeded(c: any, formId: string, origin: string) {
  const accept = c.req.header('accept') ?? '';
  const headers = corsHeaders(origin, false);
  if (accept.includes('application/json')) {
    return new Response(JSON.stringify({ error: 'quota_exceeded' }), {
      status: 429,
      headers: { 'content-type': 'application/json', ...headers },
    });
  }
  // Visitor-facing HTML page lives on apps/web at /quota-exceeded.
  const target = `${c.env.WEB_BASE_URL}/quota-exceeded?id=${encodeURIComponent(formId)}`;
  return new Response(null, {
    status: 302,
    headers: { location: target, ...headers },
  });
}

function respondToSubmitter(
  c: any,
  form: typeof schema.forms.$inferSelect,
  origin: string,
): Response {
  const headers = corsHeaders(origin, false);

  if (form.redirectUrl) {
    return new Response(null, {
      status: 302,
      headers: { location: form.redirectUrl, ...headers },
    });
  }

  const accept = c.req.header('accept') ?? '';
  if (accept.includes('application/json')) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'content-type': 'application/json', ...headers },
    });
  }

  return new Response(defaultThankYouHtml(), {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8', ...headers },
  });
}

async function notifyOwner(
  env: AppEnv['Bindings'],
  form: typeof schema.forms.$inferSelect,
  data: Record<string, unknown>,
  ipAddress: string,
  userAgent: string,
) {
  // Convert the jsonb data into ordered [k, v] pairs for the email table.
  const fields: Array<[string, string]> = Object.entries(data)
    // Hide internal/meta fields like _subject, _next, etc. — Phase 6's schema
    // panel will surface them; the per-submission email stays focused.
    .filter(([k]) => !k.startsWith('_') && k !== form.honeypotField)
    .map(([k, v]) => [k, stringifyValue(v)]);

  const dashboardUrl = `${env.WEB_BASE_URL}/dashboard/forms/${form.id}`;
  const settingsUrl = `${env.WEB_BASE_URL}/dashboard/forms/${form.id}?tab=settings`;

  const html = renderNotificationEmail({
    formName: form.name,
    toEmail: form.notificationEmail,
    receivedAgo: 'just now',
    fields,
    ip: ipAddress,
    ua: shortenUserAgent(userAgent),
    dashboardUrl,
    pauseUrl: settingsUrl,
    changeEmailUrl: settingsUrl,
    spamCheckPassed: true,
  });

  try {
    await sendEmail({
      apiKey: env.RESEND_API_KEY,
      from: env.EMAIL_FROM || 'JFF <onboarding@resend.dev>',
      to: form.notificationEmail,
      subject: `new submission · ${form.name}`,
      html,
    });
  } catch (err) {
    // Don't throw — we're inside waitUntil and the visitor already got 200.
    // Phase 9b will route this through Sentry; for now console.error keeps
    // the failure visible in `wrangler tail`.
    console.error('[jff/submit] email send failed', err);
  }
}

function stringifyValue(v: unknown): string {
  if (v == null) return '';
  if (Array.isArray(v)) return v.map((x) => String(x)).join(', ');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

function shortenUserAgent(ua: string): string {
  // Keep the email signature line tidy. Pick the first browser-ish token.
  const m = ua.match(/(Chrome|Safari|Firefox|Edge|curl|HTTPie)\/[\d.]+/);
  return m ? m[0] : ua.slice(0, 80);
}
