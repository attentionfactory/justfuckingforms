import Link from "next/link";
import { ExternalLink, MoreHorizontal, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UsageBar } from "@/components/jff/usage-bar";
import { apiGet } from "@/lib/api";
import { PLAN_LIMITS } from "@/lib/plans";
import type { FormListItem } from "@/lib/api-types";
import type { Plan } from "@jff/types";

type FormsResponse = { forms: FormListItem[] };
type SubResponse = { plan: Plan; submissionsUsed: number };

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export default async function FormsListPage() {
  const { forms } = await apiGet<FormsResponse>("/api/forms");

  // Per-user usage. Rather than a dedicated /api/me/usage endpoint, hit form
  // detail of any form (Phase 9b will fold this into a single dashboard load).
  const sub: SubResponse = forms.length
    ? await apiGet<{ stats: { plan: Plan; planUsed: number } }>(
        `/api/forms/${forms[0].id}`,
      ).then((r) => ({ plan: r.stats.plan, submissionsUsed: r.stats.planUsed }))
    : { plan: "free", submissionsUsed: 0 };

  const limit = PLAN_LIMITS[sub.plan];

  return (
    <>
      <div className="between" style={{ marginBottom: 28 }}>
        <div>
          <div className="crumb">workspace / forms</div>
          <h1>forms</h1>
        </div>
        <div className="row">
          <Button variant="outline">
            <ExternalLink size={14} /> docs
          </Button>
          <Button asChild>
            <Link href="/dashboard/forms/new">
              <Plus size={14} /> new form
            </Link>
          </Button>
        </div>
      </div>

      {forms.length > 0 && (
        <div
          className="card"
          style={{
            background: "#fff",
            border: "1px solid var(--jff-line)",
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <UsageBar used={sub.submissionsUsed} total={limit} />
          <div className="text-muted" style={{ fontSize: 13, marginTop: 10 }}>
            you&apos;re on{" "}
            <span className="text-fg" style={{ fontWeight: 600 }}>
              {sub.plan}
            </span>
            . resets on the 1st.
          </div>
        </div>
      )}

      {forms.length > 0 ? (
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
            className="between"
            style={{ padding: "12px 16px", borderBottom: "1px solid var(--jff-line)" }}
          >
            <div className="row" style={{ gap: 8 }}>
              <div
                className="row"
                style={{
                  gap: 6,
                  padding: "4px 10px",
                  background: "var(--jff-bg-alt)",
                  border: "1px solid var(--jff-line)",
                  borderRadius: 6,
                }}
              >
                <Search size={13} color="#a3a3a3" />
                <input
                  className="mono"
                  placeholder="search forms..."
                  style={{
                    border: 0,
                    outline: 0,
                    fontSize: 13,
                    background: "transparent",
                    width: 200,
                    color: "var(--jff-fg)",
                  }}
                />
              </div>
            </div>
            <div className="text-muted" style={{ fontSize: 13 }}>
              {forms.length} {forms.length === 1 ? "form" : "forms"}
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                <th
                  style={{
                    width: 36,
                    padding: "10px 14px",
                    borderBottom: "1px solid var(--jff-line)",
                  }}
                />
                {["name", "endpoint", "submissions", "last received", ""].map((h, i) => (
                  <th
                    key={h || i}
                    style={{
                      textAlign: i === 2 ? "right" : "left",
                      fontWeight: 600,
                      color: "var(--jff-fg)",
                      padding: "10px 14px",
                      borderBottom: "1px solid var(--jff-line)",
                      fontSize: 12,
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                      width: i === 4 ? 32 : undefined,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {forms.map((f) => (
                <tr key={f.id}>
                  <td style={{ padding: 14, borderBottom: "1px solid var(--jff-line-soft)" }}>
                    <span
                      className="dot"
                      style={{ background: f.isActive ? "var(--jff-good)" : "#a3a3a3" }}
                    />
                  </td>
                  <td
                    style={{
                      padding: 14,
                      borderBottom: "1px solid var(--jff-line-soft)",
                      fontWeight: 600,
                      color: "var(--jff-fg)",
                    }}
                  >
                    <Link
                      href={`/dashboard/forms/${f.id}`}
                      style={{ color: "var(--jff-fg)", textDecoration: "none" }}
                    >
                      {f.name}
                    </Link>
                  </td>
                  <td
                    className="mono text-muted"
                    style={{
                      padding: 14,
                      borderBottom: "1px solid var(--jff-line-soft)",
                      fontSize: 13,
                    }}
                  >
                    {endpointLabel(f.id)}
                  </td>
                  <td
                    className="mono"
                    style={{
                      padding: 14,
                      borderBottom: "1px solid var(--jff-line-soft)",
                      textAlign: "right",
                      color: "var(--jff-fg)",
                    }}
                  >
                    {Number(f.submissionCount).toLocaleString()}
                  </td>
                  <td
                    className="text-muted"
                    style={{
                      padding: 14,
                      borderBottom: "1px solid var(--jff-line-soft)",
                      fontSize: 13,
                    }}
                  >
                    {f.lastSubmittedAt ? relativeTime(f.lastSubmittedAt) : "never"}
                  </td>
                  <td style={{ padding: 14, borderBottom: "1px solid var(--jff-line-soft)" }}>
                    <MoreHorizontal size={16} color="#a3a3a3" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className="card"
          style={{
            background: "#fff",
            border: "1px dashed var(--jff-line)",
            borderRadius: 12,
            padding: 64,
            textAlign: "center",
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 11,
              color: "#a3a3a3",
              letterSpacing: ".1em",
              marginBottom: 16,
            }}
          >
            0 FORMS
          </div>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "var(--jff-fg)",
              letterSpacing: "-0.03em",
              margin: "0 0 8px",
            }}
          >
            nothing here yet.
          </h2>
          <p
            className="text-muted"
            style={{ fontSize: 16, maxWidth: 400, margin: "0 auto 24px" }}
          >
            create a form, get an endpoint, paste it into your html. takes about 12 seconds.
          </p>
          <Button asChild className="h-12 text-base">
            <Link href="/dashboard/forms/new">
              <Plus size={16} /> create my first form
            </Link>
          </Button>
          <div className="text-muted" style={{ fontSize: 13, marginTop: 16 }}>
            or{" "}
            <Link href="#" style={{ color: "var(--jff-link)" }}>
              read the docs
            </Link>{" "}
            if you really want to.
          </div>
        </div>
      )}

      {forms.length > 0 && (
        <p className="text-muted" style={{ fontSize: 13, marginTop: 16 }}>
          you can have up to <span className="text-fg">∞</span> forms on pro. on free, 3.
        </p>
      )}
    </>
  );
}

function endpointLabel(id: string) {
  const host = API_BASE.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `${host}/f/${id}`;
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
