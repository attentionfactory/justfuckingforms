// Phase 3 will wire Better Auth's drizzle adapter + magic link plugin to Resend.
// Stubbed for Phase 1 so the package resolves and type-checks.

export type AuthEnv = {
  resendApiKey: string;
  baseUrl: string;
  authSecret: string;
};

export const createAuth = (_env: AuthEnv) => {
  throw new Error('createAuth: implemented in Phase 3 (Auth package + auth pages)');
};
