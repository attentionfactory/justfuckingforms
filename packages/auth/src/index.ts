import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { magicLink } from 'better-auth/plugins';
import type { Db, NodeDb } from '@jff/db';
import { schema } from '@jff/db';

export type AuthEnv = {
  resendApiKey: string;
  /** e.g. https://justfuckingforms.com — public URL where the auth handler is mounted */
  baseUrl: string;
  /** 32+ char secret used to sign session cookies */
  authSecret: string;
  /** From-address for magic-link emails. Use `onboarding@resend.dev` for dev. */
  emailFrom?: string;
};

/**
 * Build a Better Auth instance bound to a Drizzle client and runtime env.
 *
 * Magic-link auth only — no password. Tokens land in the `verification` table
 * via the magicLink plugin and have a 15-minute expiry by default.
 *
 * Sessions persist via cookies. SameSite=Lax keeps things working same-origin
 * (apps/web hosting both auth handler and dashboard) without the cross-site
 * cookie hassle.
 */
export const createAuth = (db: Db | NodeDb, env: AuthEnv) =>
  betterAuth({
    secret: env.authSecret,
    baseURL: env.baseUrl,
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema,
    }),
    emailAndPassword: { enabled: false },
    plugins: [
      magicLink({
        expiresIn: 60 * 15, // 15 minutes (matches the copy in /login)
        sendMagicLink: async ({ email, url }) => {
          const from = env.emailFrom ?? 'JFF <onboarding@resend.dev>';
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${env.resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from,
              to: email,
              subject: 'your jff login link',
              html: renderMagicLinkEmail(url),
            }),
          });
          if (!res.ok) {
            const body = await res.text().catch(() => '<no body>');
            throw new Error(`resend send failed (${res.status}): ${body}`);
          }
        },
      }),
    ],
  });

export type Auth = ReturnType<typeof createAuth>;

/** Inline-styled magic-link email body. Voice matches /login. */
function renderMagicLinkEmail(url: string) {
  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f5f5f5;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0a0a0a">
  <div style="max-width:480px;margin:0 auto;background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:32px">
    <div style="font-family:'JetBrains Mono',ui-monospace,Menlo,monospace;font-size:13px;font-weight:700;color:#0a0a0a;margin-bottom:24px">jff.dev</div>
    <h1 style="font-size:24px;font-weight:700;color:#0a0a0a;letter-spacing:-0.03em;line-height:1.15;margin:0 0 12px">log in to jff.</h1>
    <p style="font-size:15px;line-height:1.55;color:#525252;margin:0 0 24px">click the button. it expires in 15 minutes. if it ends up in spam, that's fucking ironic.</p>
    <a href="${url}" style="display:inline-block;background:#0a0a0a;color:#fff;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none">log in →</a>
    <p style="font-size:12px;color:#a3a3a3;margin:32px 0 0;line-height:1.5">if the button doesn't work, paste this into your browser:<br/><span style="font-family:'JetBrains Mono',ui-monospace,Menlo,monospace;color:#525252;word-break:break-all">${url}</span></p>
    <p style="font-size:12px;color:#a3a3a3;margin:24px 0 0">didn't ask for this? ignore it. nobody can log in without clicking the link.</p>
  </div>
</body></html>`;
}
