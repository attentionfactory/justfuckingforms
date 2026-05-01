import type { NextConfig } from "next";
import { config as loadEnv } from "dotenv";
import path from "node:path";

// Load env from the repo-root .env.local so the monorepo has a single source of
// truth (same file consumed by drizzle scripts, the api, etc.). Without this,
// Next.js only auto-loads env files from apps/web/, which would force us to
// duplicate secrets per app.
loadEnv({ path: path.resolve(__dirname, "../../.env.local") });

const nextConfig: NextConfig = {
  // Workspace-package transpile is automatic in Next 16, but listing keeps it
  // explicit for our internal packages.
  transpilePackages: ["@jff/ui", "@jff/types", "@jff/db", "@jff/auth"],
};

export default nextConfig;
