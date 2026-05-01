import { Hono, type Context } from 'hono';
import { requireSession } from '../middleware/auth';
import type { AppEnv } from '../types';

// Authenticated dashboard CRUD. Phase 6 fills in the bodies; Phase 4 just
// registers the routes + auth gate so middleware runs and returns 501.

export const forms = new Hono<AppEnv>();

// Only gate /api/* — the parent app also mounts submissions which uses public
// /f/:formId. A wildcard '*' here would 401 the submission route too.
forms.use('/api/forms/*', requireSession());
forms.use('/api/inbox/*', requireSession());

const stub = (c: Context<AppEnv>, op: string) =>
  c.json(
    {
      error: 'crud handlers arrive in phase 6',
      op,
      user: c.get('user').email,
    },
    501,
  );

forms.get('/api/forms', (c) => stub(c, 'list user forms'));
forms.post('/api/forms', (c) => stub(c, 'create form'));
forms.get('/api/forms/:id', (c) => stub(c, `get form ${c.req.param('id')}`));
forms.patch('/api/forms/:id', (c) => stub(c, `update form ${c.req.param('id')}`));
forms.delete('/api/forms/:id', (c) => stub(c, `delete form ${c.req.param('id')}`));

forms.get('/api/forms/:id/submissions', (c) =>
  stub(c, `list submissions for ${c.req.param('id')}`),
);
forms.get('/api/forms/:id/submissions/export', (c) =>
  stub(c, `csv export for ${c.req.param('id')}`),
);
forms.get('/api/forms/:id/schema', (c) =>
  stub(c, `inferred schema for ${c.req.param('id')}`),
);

forms.get('/api/inbox', (c) => stub(c, 'cross-form inbox'));
