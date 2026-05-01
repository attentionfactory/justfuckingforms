import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Check } from "lucide-react";
import { auth } from "@/lib/auth";

// Magic-link clicks resolve to GET /api/auth/magic-link/verify?token=...&callbackURL=/dashboard
// directly — Better Auth performs the verification, sets the session cookie, and 302s the
// browser. So this page is only reached if someone navigates here by hand.
//
// If a session exists → show "you're in" + immediate meta-refresh to /dashboard.
// If not → bounce them back to /login.
export default async function LoginVerifyPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="af-page" style={{ paddingTop: 100 }}>
      <meta httpEquiv="refresh" content="0;url=/dashboard" />
      <div style={{ marginBottom: 32 }}>
        <div className="mono" style={{ fontSize: 13, color: "var(--jff-fg)", fontWeight: 600 }}>
          jff.dev
        </div>
      </div>

      <div className="row" style={{ gap: 12, marginBottom: 16 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: "var(--jff-good)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <Check size={18} strokeWidth={2.5} />
        </div>
        <h1 style={{ fontSize: 36, margin: 0 }}>you&apos;re in.</h1>
      </div>

      <p>
        logging you in as{" "}
        <span className="mono" style={{ color: "var(--jff-fg)", fontSize: 16 }}>
          {session.user.email}
        </span>
        .
      </p>
      <p>
        redirecting to your dashboard <span className="mono">.</span>
        <span className="mono">.</span>
        <span className="mono">.</span>
      </p>
    </main>
  );
}
