import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--jff-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        fontFamily: "var(--jff-font-sans)",
      }}
    >
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <div
          className="mono"
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "var(--jff-fg)",
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          404
        </div>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "var(--jff-fg)",
            letterSpacing: "-0.03em",
            margin: "16px 0 8px",
          }}
        >
          that form doesn&apos;t exist.
        </h1>
        <p
          style={{
            color: "var(--jff-muted)",
            fontSize: 16,
            lineHeight: 1.5,
            margin: "0 0 24px",
          }}
        >
          either you typed the endpoint wrong, or the form was deleted. either way, we can&apos;t
          email anyone for you.
        </p>
        <div className="row" style={{ justifyContent: "center", gap: 8 }}>
          <Button variant="outline" asChild>
            <Link href="/">← back</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">go to dashboard</Link>
          </Button>
        </div>
        <div
          className="mono"
          style={{ fontSize: 12, color: "#a3a3a3", marginTop: 32 }}
        >
          GET /f/k9x7m2q → 404
        </div>
      </div>
    </div>
  );
}
