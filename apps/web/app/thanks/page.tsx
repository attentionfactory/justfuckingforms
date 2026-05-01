import Link from "next/link";
import { Check } from "lucide-react";

export default function ThanksPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--jff-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--jff-font-sans)",
        padding: 40,
      }}
    >
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            background: "var(--jff-fg)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <Check size={28} strokeWidth={2.5} />
        </div>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "var(--jff-fg)",
            letterSpacing: "-0.03em",
            margin: "0 0 8px",
          }}
        >
          submitted.
        </h1>
        <p
          style={{
            color: "var(--jff-muted)",
            fontSize: 16,
            lineHeight: 1.55,
            margin: "0 0 20px",
          }}
        >
          they got it. you can close this tab. or stare at it. up to you.
        </p>
        <p
          className="mono"
          style={{ fontSize: 12, color: "#a3a3a3" }}
        >
          ← back to where you came from
        </p>
        <div
          className="mono"
          style={{ fontSize: 11, color: "#d4d4d4", marginTop: 56 }}
        >
          delivered by jff.dev —{" "}
          <Link href="/" style={{ color: "#a3a3a3" }}>
            get your own endpoint
          </Link>
        </div>
      </div>
    </div>
  );
}
