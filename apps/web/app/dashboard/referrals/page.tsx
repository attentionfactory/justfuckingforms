"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const STATS = [
  { label: "clicks", value: "47", sub: "last 30 days" },
  { label: "signups", value: "8", sub: "free accounts" },
  { label: "converted", value: "3", sub: "upgraded to paid" },
  { label: "credit", value: "$9", sub: "next invoice" },
];

const ACTIVITY: Array<[string, string, string, string]> = [
  ["3 days ago", "t***e@paystack.com", "upgraded to starter", "$3.00"],
  ["1 week ago", "s***h@vercel.com", "upgraded to pro", "$3.00"],
  ["2 weeks ago", "d***n@indiehackers.com", "upgraded to starter", "$3.00"],
  ["3 weeks ago", "r***n@yc.com", "free account", "—"],
  ["3 weeks ago", "b***s@meta.com", "free account", "—"],
  ["1 month ago", "(deleted)", "clicked", "—"],
];

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const link = "https://jff.dev/r/mercy";

  const onCopy = () => {
    if (navigator.clipboard) void navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <div className="crumb">workspace / referrals</div>
      <div className="between" style={{ marginBottom: 8 }}>
        <h1>refer a dev, earn $3.</h1>
        <span
          style={{
            background: "var(--jff-warn-bg)",
            color: "var(--jff-warn-fg)",
            fontSize: 11,
            fontWeight: 600,
            padding: "0 8px",
            height: 20,
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 999,
          }}
        >
          new
        </span>
      </div>
      <p className="text-muted" style={{ fontSize: 16, marginBottom: 28, maxWidth: 600 }}>
        send a friend your link. when they upgrade to a paid plan, you both get{" "}
        <span className="text-fg" style={{ fontWeight: 600 }}>
          $3 off your next month
        </span>
        . stack up to 12 months free per year.
      </p>

      <div
        className="card"
        style={{
          background: "#fff",
          border: "1px solid var(--jff-line)",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <Label style={{ marginBottom: 8 }}>your referral link</Label>
        <div className="row" style={{ gap: 8 }}>
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
            {link}
          </div>
          <Button onClick={onCopy}>
            {copied ? (
              <>
                <Check size={14} /> copied
              </>
            ) : (
              <>
                <Copy size={14} /> copy link
              </>
            )}
          </Button>
        </div>
        <p className="text-muted" style={{ fontSize: 13, marginTop: 10 }}>
          share it in tweets, slack, group chats, README files. wherever a tired dev hangs out.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            className="card"
            style={{
              background: "#fff",
              border: "1px solid var(--jff-line)",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div
              className="text-muted"
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: ".06em",
                fontWeight: 600,
              }}
            >
              {s.label}
            </div>
            <div
              className="text-fg mono"
              style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}
            >
              {s.value}
            </div>
            <div className="text-muted" style={{ fontSize: 12 }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      <div
        className="card"
        style={{
          background: "#fff",
          border: "1px solid var(--jff-line)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid var(--jff-line)",
            fontWeight: 600,
            color: "var(--jff-fg)",
          }}
        >
          activity
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr>
              {[
                ["when", "left"],
                ["email", "left"],
                ["status", "left"],
                ["credit earned", "right"],
              ].map(([h, align]) => (
                <th
                  key={h}
                  style={{
                    textAlign: align as "left" | "right",
                    fontWeight: 600,
                    color: "var(--jff-fg)",
                    padding: "10px 14px",
                    borderBottom: "1px solid var(--jff-line)",
                    fontSize: 12,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ACTIVITY.map((r, i) => (
              <tr key={i}>
                <td
                  className="mono text-muted"
                  style={{
                    padding: 14,
                    borderBottom: "1px solid var(--jff-line-soft)",
                    fontSize: 13,
                  }}
                >
                  {r[0]}
                </td>
                <td
                  style={{
                    padding: 14,
                    borderBottom: "1px solid var(--jff-line-soft)",
                    color: "var(--jff-fg)",
                  }}
                >
                  {r[1]}
                </td>
                <td style={{ padding: 14, borderBottom: "1px solid var(--jff-line-soft)" }}>
                  {r[2].startsWith("upgraded") ? (
                    <span
                      style={{
                        background: "var(--jff-ok-bg)",
                        color: "var(--jff-ok-fg)",
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "0 8px",
                        height: 20,
                        display: "inline-flex",
                        alignItems: "center",
                        borderRadius: 999,
                      }}
                    >
                      {r[2]}
                    </span>
                  ) : (
                    <span
                      style={{
                        background: "var(--jff-chip)",
                        color: "#525252",
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "0 8px",
                        height: 20,
                        display: "inline-flex",
                        alignItems: "center",
                        borderRadius: 999,
                      }}
                    >
                      {r[2]}
                    </span>
                  )}
                </td>
                <td
                  className="mono"
                  style={{
                    padding: 14,
                    borderBottom: "1px solid var(--jff-line-soft)",
                    textAlign: "right",
                    color: r[3] === "—" ? "#a3a3a3" : "var(--jff-ok-fg)",
                  }}
                >
                  {r[3]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="card"
        style={{
          background: "#fff",
          border: "1px solid var(--jff-line)",
          borderRadius: 12,
          padding: 20,
          marginTop: 20,
        }}
      >
        <div
          className="text-fg"
          style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}
        >
          the fine print, but readable
        </div>
        <ul
          style={{
            margin: 0,
            paddingLeft: 20,
            fontSize: 14,
            color: "#525252",
            lineHeight: 1.7,
          }}
        >
          <li>
            your friend signs up + upgrades to any paid plan →{" "}
            <span className="text-fg" style={{ fontWeight: 600 }}>
              $3 off
            </span>{" "}
            your next invoice. they also get $3 off theirs.
          </li>
          <li>credits stack. 12 referrals in a year = a year free.</li>
          <li>credits don&apos;t pay out as cash. they only reduce invoices.</li>
          <li>
            if a friend cancels in their first 14 days, the credit is reversed. otherwise it&apos;s yours.
          </li>
          <li>
            self-referrals, alt accounts, and obvious abuse get the credit + the account voided. don&apos;t.
          </li>
        </ul>
      </div>
    </>
  );
}
