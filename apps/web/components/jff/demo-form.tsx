"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type State = "idle" | "sending" | "done";

export function DemoForm() {
  const [state, setState] = useState<State>("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    window.setTimeout(() => setState("done"), 900);
  };

  return (
    <form
      onSubmit={submit}
      className="card"
      style={{
        background: "#fff",
        border: "1px solid var(--jff-line)",
        borderRadius: 12,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontSize: 14,
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 11,
          color: "#a3a3a3",
          letterSpacing: ".06em",
          textTransform: "uppercase",
        }}
      >
        POST jff.dev/f/demo
      </div>

      <div>
        <label
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--jff-fg)",
            marginBottom: 6,
            letterSpacing: "-0.01em",
          }}
        >
          your email
        </label>
        <Input type="email" placeholder="you@email.com" required />
      </div>

      <div>
        <label
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--jff-fg)",
            marginBottom: 6,
            letterSpacing: "-0.01em",
          }}
        >
          message
        </label>
        <textarea
          required
          rows={3}
          style={{
            display: "block",
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: "1px solid var(--jff-line)",
            background: "#fff",
            fontFamily: "inherit",
            fontSize: 14,
            fontWeight: 500,
            color: "var(--jff-fg)",
            outline: "none",
            resize: "vertical",
            minHeight: 80,
          }}
          placeholder="say something."
        />
      </div>

      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: "absolute", left: -9999 }}
      />

      <div className="between">
        <span className="mono" style={{ fontSize: 12, color: "#a3a3a3" }}>
          {state === "idle" && "ready"}
          {state === "sending" && "POST..."}
          {state === "done" && "200 OK"}
        </span>
        <Button type="submit" disabled={state !== "idle"}>
          {state === "idle" && "submit"}
          {state === "sending" && "sending..."}
          {state === "done" && (
            <>
              <Check size={14} /> sent
            </>
          )}
        </Button>
      </div>

      {state === "done" && (
        <div
          style={{
            background: "var(--jff-ok-bg)",
            color: "var(--jff-ok-fg)",
            padding: 10,
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          we caught it. in production this would email you within a second.
        </div>
      )}
    </form>
  );
}
