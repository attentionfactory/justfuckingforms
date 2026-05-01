import { Hono } from 'hono';
import { and, count, desc, eq, gte, ilike, sql } from 'drizzle-orm';
import { createDb, schema } from '@jff/db';
import { requireSession } from '../middleware/auth';
import { inferSchema, defaultVisibleFields } from '../lib/schema-inference';
import type { AppEnv } from '../types';

// Authenticated dashboard CRUD. Phase 6 implementations live here.
// Public submission endpoint /f/:formId is in routes/submissions.ts.

export const forms = new Hono<AppEnv>();

forms.use('/api/forms/*', requireSession());
forms.use('/api/inbox/*', requireSession());

function csvCell(v: string): string {
  // RFC 4180 — quote if contains comma, quote, or newline; double internal quotes.
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function stringifyCell(v: unknown): string {
  if (v == null) return '';
  if (Array.isArray(v)) return v.map(String).join('; ');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

/* ============================================================================
   GET /api/forms — list user's forms with last-submission + counts
   ============================================================================ */

forms.get('/api/forms', async (c) => {
  const user = c.get('user');
  const db = createDb(c.env.DATABASE_URL);

  // Forms + per-form aggregates (last submission timestamp, total non-spam count).
  const rows = await db
    .select({
      id: schema.forms.id,
      name: schema.forms.name,
      notificationEmail: schema.forms.notificationEmail,
      isActive: schema.forms.isActive,
      createdAt: schema.forms.createdAt,
      lastSubmittedAt: sql<Date | null>`max(${schema.submissions.createdAt})`,
      submissionCount: sql<number>`count(${schema.submissions.id}) filter (where ${schema.submissions.isSpam} = false)`,
    })
    .from(schema.forms)
    .leftJoin(schema.submissions, eq(schema.submissions.formId, schema.forms.id))
    .where(eq(schema.forms.userId, user.id))
    .groupBy(schema.forms.id)
    .orderBy(desc(schema.forms.createdAt));

  return c.json({ forms: rows });
});

/* ============================================================================
   POST /api/forms — create
   ============================================================================ */

forms.post('/api/forms', async (c) => {
  const user = c.get('user');
  const body = await c.req.json().catch(() => ({} as Record<string, unknown>));
  const name = String(body.name ?? '').trim();
  const notificationEmail = String(body.notificationEmail ?? user.email).trim();
  const notificationFrequency = (body.notificationFrequency ?? 'every') as
    | 'every'
    | 'daily'
    | 'weekly'
    | 'none';

  if (!name) return c.json({ error: 'name is required.' }, 400);
  if (!notificationEmail.includes('@')) {
    return c.json({ error: 'a real notification email please.' }, 400);
  }

  const db = createDb(c.env.DATABASE_URL);
  const [created] = await db
    .insert(schema.forms)
    .values({ userId: user.id, name, notificationEmail, notificationFrequency })
    .returning();

  // Make sure the user has a subscription row so quota checks work for the
  // submission handler. Idempotent — INSERT...ON CONFLICT DO NOTHING.
  await db.execute(sql`
    INSERT INTO subscriptions (user_id, plan, status, submissions_used)
    VALUES (${user.id}, 'free', 'active', 0)
    ON CONFLICT DO NOTHING
  `);

  return c.json({ form: created }, 201);
});

/* ============================================================================
   GET /api/forms/:id — detail + 3 stats
   ============================================================================ */

forms.get('/api/forms/:id', async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const db = createDb(c.env.DATABASE_URL);

  const [form] = await db
    .select()
    .from(schema.forms)
    .where(and(eq(schema.forms.id, id), eq(schema.forms.userId, user.id)))
    .limit(1);
  if (!form) return c.json({ error: "that form doesn't exist." }, 404);

  // 3 stats: all-time non-spam count, this-month count, spam count.
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const [stats] = await db
    .select({
      allTime: sql<number>`count(*) filter (where ${schema.submissions.isSpam} = false)`,
      thisMonth: sql<number>`count(*) filter (where ${schema.submissions.isSpam} = false and ${schema.submissions.createdAt} >= ${startOfMonth.toISOString()})`,
      spamBlocked: sql<number>`count(*) filter (where ${schema.submissions.isSpam} = true)`,
    })
    .from(schema.submissions)
    .where(eq(schema.submissions.formId, id));

  // User's plan for the stat denominator ("47 of 1,000").
  const [sub] = await db
    .select({ plan: schema.subscriptions.plan, used: schema.subscriptions.submissionsUsed })
    .from(schema.subscriptions)
    .where(eq(schema.subscriptions.userId, user.id))
    .limit(1);

  return c.json({
    form,
    stats: {
      allTime: Number(stats?.allTime ?? 0),
      thisMonth: Number(stats?.thisMonth ?? 0),
      spamBlocked: Number(stats?.spamBlocked ?? 0),
      planUsed: sub?.used ?? 0,
      plan: sub?.plan ?? 'free',
    },
  });
});

/* ============================================================================
   PATCH /api/forms/:id — update
   ============================================================================ */

forms.patch('/api/forms/:id', async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => ({} as Record<string, unknown>));
  const db = createDb(c.env.DATABASE_URL);

  const update: Partial<typeof schema.forms.$inferInsert> = {};
  if (typeof body.name === 'string') update.name = body.name.trim();
  if (typeof body.notificationEmail === 'string') {
    update.notificationEmail = body.notificationEmail.trim();
  }
  if (typeof body.notificationFrequency === 'string') {
    update.notificationFrequency = body.notificationFrequency as never;
  }
  if ('redirectUrl' in body) {
    update.redirectUrl = body.redirectUrl ? String(body.redirectUrl).trim() : null;
  }
  if (typeof body.honeypotField === 'string') {
    update.honeypotField = body.honeypotField.trim() || 'website';
  }
  if (Array.isArray(body.allowedDomains)) {
    update.allowedDomains = body.allowedDomains as never;
  }
  if (typeof body.strictOrigin === 'boolean') update.strictOrigin = body.strictOrigin;
  if (typeof body.isActive === 'boolean') update.isActive = body.isActive;

  if (Object.keys(update).length === 0) {
    return c.json({ error: 'nothing to update.' }, 400);
  }

  const [updated] = await db
    .update(schema.forms)
    .set(update)
    .where(and(eq(schema.forms.id, id), eq(schema.forms.userId, user.id)))
    .returning();

  if (!updated) return c.json({ error: "that form doesn't exist." }, 404);
  return c.json({ form: updated });
});

/* ============================================================================
   DELETE /api/forms/:id — cascade
   ============================================================================ */

forms.delete('/api/forms/:id', async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const db = createDb(c.env.DATABASE_URL);

  const [deleted] = await db
    .delete(schema.forms)
    .where(and(eq(schema.forms.id, id), eq(schema.forms.userId, user.id)))
    .returning({ id: schema.forms.id });

  if (!deleted) return c.json({ error: "that form doesn't exist." }, 404);
  return c.json({ ok: true });
});

/* ============================================================================
   GET /api/forms/:id/submissions — paginated, filter, search
   ============================================================================ */

forms.get('/api/forms/:id/submissions', async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const page = Math.max(1, parseInt(c.req.query('page') ?? '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') ?? '25', 10) || 25));
  const status = c.req.query('status') ?? 'all'; // all | live | spam
  const search = c.req.query('search')?.trim() ?? '';

  const db = createDb(c.env.DATABASE_URL);

  // Ownership check
  const [form] = await db
    .select({ id: schema.forms.id })
    .from(schema.forms)
    .where(and(eq(schema.forms.id, id), eq(schema.forms.userId, user.id)))
    .limit(1);
  if (!form) return c.json({ error: "that form doesn't exist." }, 404);

  const conditions = [eq(schema.submissions.formId, id)];
  if (status === 'live') conditions.push(eq(schema.submissions.isSpam, false));
  if (status === 'spam') conditions.push(eq(schema.submissions.isSpam, true));
  if (search) {
    // Free-text across the jsonb data — Postgres ::text cast then ilike.
    conditions.push(
      sql`${schema.submissions.data}::text ILIKE ${'%' + search + '%'}`,
    );
  }

  const where = and(...conditions);

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(schema.submissions)
      .where(where)
      .orderBy(desc(schema.submissions.createdAt))
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ n: count() }).from(schema.submissions).where(where),
  ]);

  return c.json({
    rows,
    total: Number(totalRow[0]?.n ?? 0),
    page,
    limit,
  });
});

/* ============================================================================
   GET /api/forms/:id/submissions/export — CSV
   IMPORTANT: must be registered BEFORE /:subId so the static path wins.
   Hono matches in registration order; :subId is greedy and would otherwise
   capture 'export' as a UUID and 500 on the DB lookup.
   ============================================================================ */

forms.get('/api/forms/:id/submissions/export', async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const db = createDb(c.env.DATABASE_URL);

  const [form] = await db
    .select()
    .from(schema.forms)
    .where(and(eq(schema.forms.id, id), eq(schema.forms.userId, user.id)))
    .limit(1);
  if (!form) return c.json({ error: "that form doesn't exist." }, 404);

  const rows = await db
    .select()
    .from(schema.submissions)
    .where(eq(schema.submissions.formId, id))
    .orderBy(desc(schema.submissions.createdAt));

  // Inferred columns drive the header order. _meta + spam/internal fields go last.
  const fields = inferSchema(
    rows.map((r) => ({ data: r.data, createdAt: r.createdAt })),
  );
  const visible = fields.filter((f) => !f.key.startsWith('_'));
  const cols = ['received_at', 'is_spam', ...visible.map((f) => f.key)];

  const csv = [
    cols.map(csvCell).join(','),
    ...rows.map((r) =>
      cols
        .map((col) => {
          if (col === 'received_at') return csvCell(r.createdAt.toISOString());
          if (col === 'is_spam') return csvCell(r.isSpam ? 'spam' : 'ok');
          const v = (r.data as Record<string, unknown>)[col];
          return csvCell(stringifyCell(v));
        })
        .join(','),
    ),
  ].join('\n');

  const filename = `${form.name.replace(/[^a-z0-9]+/gi, '_')}_submissions.csv`;
  return new Response(csv, {
    status: 200,
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${filename}"`,
    },
  });
});

/* ============================================================================
   GET /api/forms/:id/submissions/:subId — single row
   ============================================================================ */

forms.get('/api/forms/:id/submissions/:subId', async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const subId = c.req.param('subId');
  const db = createDb(c.env.DATABASE_URL);

  // Guard: subId must be a UUID. Otherwise Postgres throws on the eq() cast,
  // which would 500 instead of cleanly 404. Cheap regex check up front.
  if (!/^[0-9a-f-]{36}$/i.test(subId)) {
    return c.json({ error: 'submission not found.' }, 404);
  }

  const [row] = await db
    .select({
      submission: schema.submissions,
      formName: schema.forms.name,
    })
    .from(schema.submissions)
    .innerJoin(schema.forms, eq(schema.forms.id, schema.submissions.formId))
    .where(
      and(
        eq(schema.submissions.id, subId),
        eq(schema.submissions.formId, id),
        eq(schema.forms.userId, user.id),
      ),
    )
    .limit(1);

  if (!row) return c.json({ error: "submission not found." }, 404);
  return c.json({ submission: row.submission, formName: row.formName });
});

/* ============================================================================
   GET /api/forms/:id/schema — inferred schema
   ============================================================================ */

forms.get('/api/forms/:id/schema', async (c) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const db = createDb(c.env.DATABASE_URL);

  const [form] = await db
    .select({ id: schema.forms.id })
    .from(schema.forms)
    .where(and(eq(schema.forms.id, id), eq(schema.forms.userId, user.id)))
    .limit(1);
  if (!form) return c.json({ error: "that form doesn't exist." }, 404);

  // Pull the most recent 500 rows for inference. Old rows beyond that don't
  // change the picture much and we save round-trip bytes.
  const rows = await db
    .select({ data: schema.submissions.data, createdAt: schema.submissions.createdAt })
    .from(schema.submissions)
    .where(eq(schema.submissions.formId, id))
    .orderBy(desc(schema.submissions.createdAt))
    .limit(500);

  const fields = inferSchema(rows);
  const visibleByDefault = new Set(defaultVisibleFields(fields).map((f) => f.key));
  return c.json({
    fields: fields.map((f) => ({
      ...f,
      visible: visibleByDefault.has(f.key),
    })),
    sampleSize: rows.length,
  });
});

/* ============================================================================
   GET /api/inbox — cross-form day-grouped stream
   ============================================================================ */

forms.get('/api/inbox', async (c) => {
  const user = c.get('user');
  const days = Math.min(30, Math.max(1, parseInt(c.req.query('days') ?? '7', 10) || 7));
  const db = createDb(c.env.DATABASE_URL);

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);

  const rows = await db
    .select({
      id: schema.submissions.id,
      formId: schema.forms.id,
      formName: schema.forms.name,
      data: schema.submissions.data,
      isSpam: schema.submissions.isSpam,
      createdAt: schema.submissions.createdAt,
    })
    .from(schema.submissions)
    .innerJoin(schema.forms, eq(schema.forms.id, schema.submissions.formId))
    .where(
      and(eq(schema.forms.userId, user.id), gte(schema.submissions.createdAt, since)),
    )
    .orderBy(desc(schema.submissions.createdAt))
    .limit(500);

  return c.json({ rows });
});
