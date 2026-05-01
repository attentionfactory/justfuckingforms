// Browser-side Better Auth client. Use from "use client" components.

import { createAuthClient } from 'better-auth/react';
import { magicLinkClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL:
    typeof window === 'undefined'
      ? process.env.BETTER_AUTH_URL
      : window.location.origin,
  plugins: [magicLinkClient()],
});

export const { signIn, signOut, useSession } = authClient;
