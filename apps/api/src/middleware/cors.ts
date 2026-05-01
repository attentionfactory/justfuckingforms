import { cors } from 'hono/cors';
import type { MiddlewareHandler } from 'hono';
import type { AppEnv } from '../types';

// Static origin allowlist for dashboard endpoints (/api/forms, /api/inbox, etc.).
// The web app on justfuckingforms.com calls these with credentials (session
// cookie), so we can't use `*` — we have to echo back specific origins and
// include Access-Control-Allow-Credentials.
//
// Submission endpoint POST /f/:formId handles its own CORS based on the form's
// per-row `allowedDomains` list (Phase 5).

const allowedOrigins = (env: AppEnv['Bindings']) =>
  new Set(
    [env.WEB_BASE_URL, 'http://localhost:3000', 'http://localhost:3030'].filter(
      Boolean,
    ),
  );

export const dashboardCors = (): MiddlewareHandler<AppEnv> =>
  cors({
    origin: (origin, c) => {
      if (!origin) return null;
      const allow = allowedOrigins(c.env);
      return allow.has(origin) ? origin : null;
    },
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    maxAge: 86400,
  });
