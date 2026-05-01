"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { signIn } from "@/lib/auth-client";

// Top-level page wraps the form in <Suspense> so Next can statically prerender
// the shell. useSearchParams() reads at runtime; without the boundary, build
// fails with PRERENDER_ERROR.
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormShell />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const sp = useSearchParams();
  const next = sp.get("next") ?? "/dashboard";

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
      callbackURL: next,
    });
    if (error) {
      setState({ kind: "error", message: error.message ?? "couldn't send the link." });
      return;
    }
    setState({ kind: "sent" });
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

      {state.kind !== "sent" ? (
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
              "send me a link"
            )}
          </Button>
          {state.kind === "error" && (
            <p
              style={{
                fontSize: 14,
                color: "var(--jff-spam-fg)",
                margin: "8px 0 0",
              }}
            >
              {state.message}
            </p>
          )}
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
            we sent a link to <span className="mono text-fg">{email}</span>. it expires in 15 minutes. if it ends up in spam, that&apos;s fucking ironic.
          </p>
        </div>
      )}

      <p style={{ fontSize: 16, marginTop: 32 }}>
        no account yet? same form. we&apos;ll make one.
      </p>
    </main>
  );
}

// Static shell rendered during prerender. Same layout, no interactive bits —
// gets replaced by <LoginForm /> on hydration.
function LoginFormShell() {
  return (
    <main className="af-page" style={{ paddingTop: 80 }}>
      <div style={{ marginBottom: 40 }}>
        <div className="mono" style={{ fontSize: 13, color: "var(--jff-fg)", fontWeight: 600 }}>
          jff.dev
        </div>
      </div>
      <h1 style={{ fontSize: 38 }}>log in.</h1>
      <p>we&apos;ll email you a link. no password to forget. no auth0 dashboard to hate.</p>
    </main>
  );
}
