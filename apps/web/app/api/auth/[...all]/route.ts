// Better Auth catch-all handler. Mounted at /api/auth/* — all sign-in,
// magic-link, callback, sign-out, etc. requests flow through here.

import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const { GET, POST } = toNextJsHandler(auth);
