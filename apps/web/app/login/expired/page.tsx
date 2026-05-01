"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { signIn } from "@/lib/auth-client";

export default function LoginExpiredPage() {
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

  return (
    <main className="af-page" style={{ paddingTop: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <div className="mono" style={{ fontSize: 13, color: "var(--jff-fg)", fontWeight: 600 }}>
          jff.dev
        </div>
      </div>

      <h1 style={{ fontSize: 38 }}>that link is dead.</h1>
      <p>
        magic links expire after 15 minutes. for security, supposedly. mostly to annoy us all.
      </p>
      <p>throw your email in. we&apos;ll send a fresh one.</p>

      {state.kind === "sent" ? (
        <div
          style={{
            background: "#fff",
            border: "1px solid var(--jff-line)",
            borderRadius: 12,
            padding: 20,
            marginTop: 24,
          }}
        >
          <p style={{ margin: 0, fontSize: 14 }}>
            new link on its way to <span className="mono text-fg">{email}</span>. check your
            inbox.
          </p>
        </div>
      ) : (
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={state.kind === "sending"}
          />
          <Button
            className="h-14 text-base w-full"
            type="submit"
            disabled={state.kind === "sending"}
          >
            {state.kind === "sending" ? (
              <>
                <Spinner style={{ width: 14, height: 14 }} /> sending...
              </>
            ) : (
              "send a new link"
            )}
          </Button>
          {state.kind === "error" && (
            <p
              style={{ fontSize: 14, color: "var(--jff-spam-fg)", margin: "8px 0 0" }}
            >
              {state.message}
            </p>
          )}
        </form>
      )}
    </main>
  );
}
