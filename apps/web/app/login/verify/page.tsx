import { Check } from "lucide-react";

// Phase 7 stub: hardcoded email. Phase 3 will resolve the email from the verified session
// and redirect via a server action / route handler.
const STUB_EMAIL = "mercy@transcriptx.xyz";

export default function LoginVerifyPage() {
  return (
    <main className="af-page" style={{ paddingTop: 100 }}>
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
          {STUB_EMAIL}
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
