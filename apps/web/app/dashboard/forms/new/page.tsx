"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FREQUENCIES = [
  ["every", "every submission", "one email per row. best for low-traffic forms."],
  ["daily", "daily digest", "one email at 9am with everything from the day."],
  ["weekly", "weekly digest", "monday morning roundup. for slow forms."],
  ["none", "don't email me", "just store them. you'll check the dashboard."],
] as const;

export default function NewFormPage() {
  const [step, setStep] = useState(2);
  const [workspace, setWorkspace] = useState("transcriptx");
  const [name, setName] = useState("transcriptx contact");
  const [email, setEmail] = useState("mercy@transcriptx.xyz");
  const [freq, setFreq] = useState<string>("every");
  const [copied, setCopied] = useState(false);
  const formId = "a3f9k2x"; // stub — Phase 6 returns real id from POST /api/forms

  const onCopy = () => {
    setCopied(true);
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(`https://jff.dev/f/${formId}`);
    }
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="row" style={{ marginBottom: 32, gap: 8 }}>
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 999,
              background: n <= step ? "var(--jff-fg)" : "var(--jff-line)",
            }}
          />
        ))}
      </div>
      <div
        className="text-muted mono"
        style={{ fontSize: 12, letterSpacing: ".06em", marginBottom: 8 }}
      >
        STEP {step} OF 3
      </div>

      {step === 1 && (
        <>
          <h1 style={{ marginBottom: 8 }}>name your workspace.</h1>
          <p className="text-muted" style={{ marginBottom: 32, fontSize: 16 }}>
            it shows up in your inbox subject lines and on receipts. you can rename it later.
          </p>
          <div style={{ marginBottom: 32 }}>
            <Label htmlFor="workspace">workspace</Label>
            <Input
              id="workspace"
              className="h-14 text-base"
              autoFocus
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
              placeholder="transcriptx"
            />
            <div className="text-muted" style={{ fontSize: 13, marginTop: 6 }}>
              we&apos;ll prefix all your forms with this. don&apos;t overthink it.
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1 style={{ marginBottom: 8 }}>name this form.</h1>
          <p className="text-muted" style={{ marginBottom: 32, fontSize: 16 }}>
            just for you. your visitors never see it. &quot;contact form&quot; is fine.
            &quot;the form i forgot to delete&quot; is also fine.
          </p>

          <div style={{ marginBottom: 20 }}>
            <Label htmlFor="form-name">form name</Label>
            <Input
              id="form-name"
              className="h-14 text-base"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="contact form"
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <Label htmlFor="notif-email">where should we email submissions?</Label>
            <Input
              id="notif-email"
              className="h-14 text-base"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
            <div className="text-muted" style={{ fontSize: 13, marginTop: 6 }}>
              we&apos;ll never email you anything else. no newsletters. no &quot;product
              updates&quot;.
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <Label>how often?</Label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 8,
              }}
            >
              {FREQUENCIES.map(([k, n, d]) => {
                const on = freq === k;
                return (
                  <label
                    key={k}
                    className="row"
                    style={{
                      gap: 10,
                      padding: 12,
                      border: `1px solid ${on ? "var(--jff-fg)" : "var(--jff-line)"}`,
                      borderRadius: 8,
                      cursor: "pointer",
                      alignItems: "flex-start",
                      background: on ? "var(--jff-bg-alt)" : "#fff",
                    }}
                  >
                    <input
                      type="radio"
                      name="freq"
                      checked={on}
                      onChange={() => setFreq(k)}
                      style={{ accentColor: "var(--jff-fg)", marginTop: 2 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        className="text-fg"
                        style={{ fontWeight: 600, fontSize: 14 }}
                      >
                        {n}
                      </div>
                      <div
                        className="text-muted"
                        style={{ fontSize: 12, lineHeight: 1.4 }}
                      >
                        {d}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="text-muted" style={{ fontSize: 13, marginTop: 6 }}>
              change this anytime in account settings.
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h1 style={{ marginBottom: 8 }}>here&apos;s your endpoint.</h1>
          <p className="text-muted" style={{ marginBottom: 32, fontSize: 16 }}>
            paste it into your html form&apos;s <span className="kbd">action</span> attribute.
            that&apos;s the whole integration.
          </p>

          <div
            className="card"
            style={{
              background: "#fff",
              border: "1px solid var(--jff-line)",
              borderRadius: 12,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <Label>your endpoint</Label>
            <div className="row" style={{ gap: 8, marginTop: 6 }}>
              <div
                className="mono"
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  background: "var(--jff-bg-alt)",
                  border: "1px solid var(--jff-line)",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "var(--jff-fg)",
                }}
              >
                https://jff.dev/f/{formId}
              </div>
              <Button variant="outline" onClick={onCopy}>
                {copied ? (
                  <>
                    <Check size={14} /> copied
                  </>
                ) : (
                  <>
                    <Copy size={14} /> copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-muted" style={{ fontSize: 13, marginTop: 10 }}>
              first submission lands in this dashboard. notifications go to{" "}
              <span className="mono text-fg">{email}</span>.
            </p>
          </div>
        </>
      )}

      <div className="row between">
        <Button
          variant="ghost"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          ← back
        </Button>
        {step < 3 ? (
          <Button className="h-12 text-base" onClick={() => setStep(step + 1)}>
            continue →
          </Button>
        ) : (
          <Button className="h-12 text-base" asChild>
            <a href={`/dashboard/forms/${formId}`}>go to form →</a>
          </Button>
        )}
      </div>
    </div>
  );
}
