// Hono runtime context for the JFF API.
//
// `Bindings` come from wrangler — env vars + Workers bindings.
// `Variables` are per-request values set by middleware (auth user, etc.).

export type Bindings = {
  /** Neon Postgres connection string (HTTP-driver compatible). */
  DATABASE_URL: string;
  /** Better Auth signing secret — must match apps/web's BETTER_AUTH_SECRET. */
  BETTER_AUTH_SECRET: string;
  /** Public URL of the web/auth handler (cookies are issued here). */
  BETTER_AUTH_URL: string;
  /** Public URL of the marketing/dashboard app. */
  WEB_BASE_URL: string;
  /** Resend API key for outbound email. */
  RESEND_API_KEY: string;
  /** From-address for outbound email. */
  EMAIL_FROM: string;
  /** Polar credentials. */
  POLAR_ACCESS_TOKEN: string;
  POLAR_WEBHOOK_SECRET: string;
  /** Polar product ids — set per-environment so dev points at sandbox products. */
  POLAR_PRODUCT_STARTER: string;
  POLAR_PRODUCT_PRO: string;
  /** Sentry DSN. */
  SENTRY_DSN: string;
  /** Cloudflare rate-limiter binding (declared in wrangler.jsonc). */
  FORM_SUBMIT_LIMITER: { limit: (opts: { key: string }) => Promise<{ success: boolean }> };
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type AppEnv = {
  Bindings: Bindings;
  Variables: {
    user: AuthUser;
  };
};
