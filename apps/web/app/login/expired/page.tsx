"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginExpiredPage() {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO Phase 3: re-trigger magic-link
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
          send a new link
        </Button>
      </form>
    </main>
  );
}
