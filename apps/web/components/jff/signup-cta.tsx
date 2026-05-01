"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";

// Landing-page CTA. Same magic-link flow as /login, just triggered inline.
export function SignupCTA() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "sending" }
    | { kind: "sent" }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState({ kind: "sending" });
    const { error } = await signIn.magicLink({
      email: email.trim(),
      callbackURL: "/dashboard",
    });
    if (error) {
      setState({ kind: "error", message: error.message ?? "couldn't send the link." });
      return;
    }
    setState({ kind: "sent" });
  };

  if (state.kind === "sent") {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--jff-line)",
          borderRadius: 12,
          padding: 20,
          marginTop: 28,
          marginBottom: 16,
        }}
      >
        <div className="row" style={{ gap: 10, marginBottom: 6 }}>
          <Mail size={18} color="var(--jff-fg)" />
          <span style={{ color: "var(--jff-fg)", fontWeight: 600, fontSize: 16 }}>
            check your email.
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 14 }}>
          we sent a link to <span className="mono text-fg">{email}</span>. it expires in 15 minutes. if it ends up in spam, that&apos;s fucking ironic.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginTop: 28,
        marginBottom: 16,
      }}
    >
      <Input
        className="h-14 text-base"
        type="email"
        placeholder="you@email.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={state.kind === "sending"}
      />
      <Button
        className="h-14 text-base w-full"
        type="submit"
        disabled={state.kind === "sending"}
      >
        {state.kind === "sending" ? "sending..." : "get my endpoint →"}
      </Button>
      {state.kind === "error" && (
        <p style={{ fontSize: 14, color: "var(--jff-spam-fg)", margin: "8px 0 0" }}>
          {state.message}
        </p>
      )}
    </form>
  );
}
