"use client";

import { useState, use } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ALLOWED_DOMAINS, FORMS, type AllowedDomain } from "@/lib/mock-data";

type Props = {
  params: Promise<{ id: string }>;
};

const STATUS_COLORS: Record<AllowedDomain["status"], string> = {
  verified: "var(--jff-good)",
  dev: "#f59e0b",
  pending: "#a3a3a3",
};

export default function AllowedDomainsPage({ params }: Props) {
  const { id } = use(params);
  const form = FORMS.find((f) => f.id === id);

  const [domains, setDomains] = useState<AllowedDomain[]>(ALLOWED_DOMAINS);
  const [draft, setDraft] = useState("");
  const [strict, setStrict] = useState(true);

  const add = () => {
    if (!draft.trim()) return;
    setDomains([...domains, { value: draft.trim(), status: "pending", last: "never" }]);
    setDraft("");
  };

  if (!form) {
    return (
      <p className="text-muted">that form doesn&apos;t exist.</p>
    );
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <div className="crumb">
        forms /{" "}
        <Link href={`/dashboard/forms/${form.id}`} style={{ color: "var(--jff-fg)" }}>
          {form.name}
        </Link>{" "}
        / settings / domains
      </div>
      <h1 style={{ marginBottom: 8 }}>allowed domains</h1>
      <p className="text-muted" style={{ fontSize: 15, marginBottom: 24, maxWidth: 580 }}>
        we&apos;ll only accept submissions whose{" "}
        <span className="mono text-fg" style={{ fontSize: 13 }}>
          Origin
        </span>{" "}
        or{" "}
        <span className="mono text-fg" style={{ fontSize: 13 }}>
          Referer
        </span>{" "}
        matches one of these. stops randos from posting to your endpoint from their own site.
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
        <Label htmlFor="add-domain">add a domain</Label>
        <div className="row" style={{ gap: 8 }}>
          <Input
            id="add-domain"
            placeholder="yourdomain.com or *.yourdomain.com"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
          />
          <Button onClick={add}>
            <Plus size={14} /> add
          </Button>
        </div>
        <div className="text-muted" style={{ fontSize: 13, marginTop: 6 }}>
          wildcards: <span className="mono text-fg">*.yourdomain.com</span> covers every
          subdomain. <span className="mono text-fg">localhost:*</span> covers any port for
          dev.
        </div>
      </div>

      <div
        className="card"
        style={{
          background: "#fff",
          border: "1px solid var(--jff-line)",
          borderRadius: 12,
          marginBottom: 16,
          overflow: "hidden",
        }}
      >
        <div
          className="between"
          style={{ padding: "14px 18px", borderBottom: "1px solid var(--jff-line)" }}
        >
          <div className="text-fg" style={{ fontWeight: 600, fontSize: 14 }}>
            allowed origins
          </div>
          <span className="text-muted" style={{ fontSize: 13 }}>
            {domains.length} domains
          </span>
        </div>
        {domains.length > 0 ? (
          domains.map((d, i) => (
            <div
              key={`${d.value}-${i}`}
              className="between"
              style={{
                padding: "12px 18px",
                borderBottom:
                  i < domains.length - 1 ? "1px solid var(--jff-line-soft)" : 0,
              }}
            >
              <div className="row" style={{ gap: 12 }}>
                <span className="dot" style={{ background: STATUS_COLORS[d.status] }} />
                <span
                  className="mono text-fg"
                  style={{ fontSize: 14, fontWeight: 500 }}
                >
                  {d.value}
                </span>
                {d.status === "verified" && (
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
                    verified
                  </span>
                )}
                {d.status === "dev" && (
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
                    dev
                  </span>
                )}
                {d.status === "pending" && (
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
                    pending first hit
                  </span>
                )}
              </div>
              <div className="row" style={{ gap: 12 }}>
                <span className="text-muted" style={{ fontSize: 13 }}>
                  last hit {d.last}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDomains(domains.filter((_, j) => j !== i))}
                  style={{ color: "var(--jff-danger)" }}
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: 32, textAlign: "center" }}>
            <div
              className="text-fg"
              style={{ fontWeight: 600, marginBottom: 4 }}
            >
              no domains. anyone can post.
            </div>
            <div className="text-muted" style={{ fontSize: 13 }}>
              add one above to lock this form down.
            </div>
          </div>
        )}
      </div>

      <div
        className="card"
        style={{
          background: "#fff",
          border: "1px solid var(--jff-line)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <label
          className="row"
          style={{ gap: 12, alignItems: "flex-start", cursor: "pointer" }}
        >
          <input
            type="checkbox"
            checked={strict}
            onChange={(e) => setStrict(e.target.checked)}
            style={{ accentColor: "var(--jff-fg)", marginTop: 3 }}
          />
          <div style={{ flex: 1 }}>
            <div className="text-fg" style={{ fontWeight: 600, fontSize: 14 }}>
              strict mode
            </div>
            <div className="text-muted" style={{ fontSize: 13 }}>
              {strict ? (
                <>
                  reject submissions with no{" "}
                  <span className="mono text-fg" style={{ fontSize: 12 }}>
                    Origin
                  </span>{" "}
                  header (curl, postman, server-to-server). uncheck if you POST from a backend.
                </>
              ) : (
                <>
                  allow submissions with no Origin header. less secure but works for
                  server-side calls and webhooks.
                </>
              )}
            </div>
          </div>
        </label>
      </div>

      <div
        className="card"
        style={{
          background: "var(--jff-fg)",
          color: "#fafafa",
          border: "1px solid var(--jff-fg)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #262626",
            fontSize: 12,
            color: "#a3a3a3",
            fontFamily: "var(--jff-font-mono)",
            letterSpacing: ".04em",
            textTransform: "uppercase",
          }}
        >
          recently blocked
        </div>
        <div
          style={{
            padding: 16,
            fontFamily: "var(--jff-font-mono)",
            fontSize: 12,
            lineHeight: 1.7,
          }}
        >
          <div>
            <span style={{ color: "var(--jff-danger)" }}>403</span>{" "}
            <span style={{ color: "#737373" }}>11:42</span> origin=
            <span style={{ color: "#fde68a" }}>{`"https://copycat.fake"`}</span> → not in
            allowlist
          </div>
          <div>
            <span style={{ color: "var(--jff-danger)" }}>403</span>{" "}
            <span style={{ color: "#737373" }}>09:18</span> origin=
            <span style={{ color: "#fde68a" }}>{`"https://malicious.site"`}</span> → not in
            allowlist
          </div>
          <div>
            <span style={{ color: "var(--jff-danger)" }}>403</span>{" "}
            <span style={{ color: "#737373" }}>yesterday</span> origin=
            <span style={{ color: "#737373" }}>(none)</span> → strict mode
          </div>
          <div style={{ color: "#525252", marginTop: 8 }}>
            # 23 blocked this week. 0 false positives reported.
          </div>
        </div>
      </div>

      <p className="text-muted" style={{ fontSize: 13, marginTop: 16 }}>
        we also send the right{" "}
        <span className="mono text-fg" style={{ fontSize: 12 }}>
          Access-Control-Allow-Origin
        </span>{" "}
        header per request, so CORS just works for these domains.
      </p>
    </div>
  );
}
