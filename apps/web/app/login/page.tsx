"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    // TODO Phase 3: POST to /api/auth/magic-link via Better Auth
  };

  return (
    <main className="af-page" style={{ paddingTop: 80 }}>
      <div style={{ marginBottom: 40 }}>
        <div className="mono" style={{ fontSize: 13, color: "var(--jff-fg)", fontWeight: 600 }}>
          jff.dev
        </div>
      </div>

      <h1 style={{ fontSize: 38 }}>log in.</h1>
      <p>
        we&apos;ll email you a link. no password to forget. no auth0 dashboard to hate.
      </p>

      {!sent ? (
        <form
          onSubmit={onSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24 }}
        >
          <Input
            className="h-14 text-base"
            type="email"
            placeholder="you@email.com"
            required
            autoFocus
          />
          <Button className="h-14 text-base w-full" type="submit">
            send me a link
          </Button>
        </form>
      ) : (
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--jff-line)",
            borderRadius: 12,
            padding: 20,
            marginTop: 24,
          }}
        >
          <div className="row" style={{ gap: 10, marginBottom: 6 }}>
            <Mail size={18} color="var(--jff-fg)" />
            <span style={{ color: "var(--jff-fg)", fontWeight: 600, fontSize: 16 }}>
              check your email.
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 14 }}>
            link expires in 15 minutes. if it ends up in spam, that&apos;s fucking ironic.
          </p>
        </div>
      )}

      <p style={{ fontSize: 16, marginTop: 32 }}>
        no account yet? same form. we&apos;ll make one.
      </p>
    </main>
  );
}
