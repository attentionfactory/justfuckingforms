import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CodeBlock, EmbedSnippet } from "@/components/jff/embed-snippet";
import { CopyEndpoint } from "@/components/jff/copy-endpoint";
import { FormTabs, type FormTab } from "@/components/jff/form-tabs";
import { SubmissionsTable } from "@/components/jff/submissions-table";
import { PauseToggle } from "@/components/jff/pause-toggle";
import { FormSettings } from "@/components/jff/form-settings";
import { apiGetOrNull, apiGet } from "@/lib/api";
import type {
  ApiForm,
  FormStats,
  SchemaResponse,
  SubmissionsListResponse,
} from "@/lib/api-types";
import { PLAN_LIMITS } from "@/lib/plans";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: FormTab }>;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export default async function FormDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const tab: FormTab = sp.tab ?? "overview";

  const detail = await apiGetOrNull<{ form: ApiForm; stats: FormStats }>(
    `/api/forms/${id}`,
  );
  if (!detail) notFound();
  const { form, stats } = detail;

  // Pull recent submissions for the overview list AND the submissions tab. Two
  // small reads run in parallel; cheaper than two sequential awaits.
  const [recent, schema] =
    tab === "submissions"
      ? await Promise.all([
          apiGet<SubmissionsListResponse>(`/api/forms/${id}/submissions?limit=25`),
          apiGet<SchemaResponse>(`/api/forms/${id}/schema`),
        ])
      : tab === "overview"
        ? await Promise.all([
            apiGet<SubmissionsListResponse>(`/api/forms/${id}/submissions?limit=4`),
            Promise.resolve(null),
          ])
        : [null, null];

  const paused = !form.isActive;
  const planLimit = PLAN_LIMITS[stats.plan];
  const quotaExceeded = stats.planUsed >= planLimit;
  const submissionCount = stats.allTime + stats.spamBlocked;
  const spamRate =
    submissionCount > 0
      ? Math.round((stats.spamBlocked / submissionCount) * 100)
      : 0;
  const endpointUrl = `${API_BASE}/f/${form.id}`;
  const createdLabel = formatCreated(form.createdAt);

  return (
    <>
      <div className="crumb">
        forms /{" "}
        <Link href={`/dashboard/forms/${form.id}`} style={{ color: "var(--jff-fg)" }}>
          {form.name}
        </Link>
      </div>
      <div className="between" style={{ marginBottom: 8 }}>
        <h1>{form.name}</h1>
        <div className="row">
          {paused ? (
            <span
              className="row"
              style={{
                gap: 4,
                background: "var(--jff-spam-bg)",
                color: "var(--jff-spam-fg)",
                fontSize: 11,
                fontWeight: 600,
                padding: "0 8px",
                height: 20,
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 999,
              }}
            >
              <span className="dot" style={{ background: "var(--jff-danger)" }} /> paused
            </span>
          ) : (
            <span
              className="row"
              style={{
                gap: 4,
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
              <span className="dot" style={{ background: "var(--jff-good)" }} /> live
            </span>
          )}
          <PauseToggle formId={form.id} isActive={form.isActive} />
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/forms/${form.id}?tab=settings`}>
              <Settings size={14} />
            </Link>
          </Button>
        </div>
      </div>
      <p className="text-muted" style={{ fontSize: 14, marginBottom: 24 }}>
        created {createdLabel}. notifications go to{" "}
        <span className="text-fg mono" style={{ fontSize: 13 }}>
          {form.notificationEmail}
        </span>
        .
      </p>

      {quotaExceeded && (
        <div
          style={{
            padding: 16,
            background: "var(--jff-spam-bg)",
            border: "1px solid #fecaca",
            borderRadius: 10,
            marginBottom: 24,
          }}
        >
          <div className="row" style={{ gap: 12, alignItems: "flex-start" }}>
            <AlertCircle size={18} color="#b91c1c" />
            <div style={{ flex: 1, fontSize: 14 }}>
              <div style={{ color: "#7f1d1d", fontWeight: 600, marginBottom: 4 }}>
                this form is rejecting submissions.
              </div>
              <div style={{ color: "#991b1b" }}>
                you&apos;ve used{" "}
                <span style={{ fontWeight: 600 }}>
                  {stats.planUsed}/{planLimit}
                </span>{" "}
                on the {stats.plan} plan. visitors get a 429. upgrade to keep receiving.
              </div>
              <div className="row" style={{ gap: 8, marginTop: 12 }}>
                <Button size="sm">upgrade</Button>
                <Button variant="ghost" size="sm" style={{ color: "#7f1d1d" }}>
                  see usage
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <FormTabs />

      {tab === "overview" && (
        <div className="stack" style={{ gap: 20 }}>
          <div
            className="card"
            style={{
              background: "#fff",
              border: "1px solid var(--jff-line)",
              borderRadius: 12,
              padding: 20,
              opacity: paused ? 0.6 : 1,
            }}
          >
            <Label style={{ marginBottom: 8 }}>your endpoint</Label>
            <CopyEndpoint url={endpointUrl} />
            <p className="text-muted" style={{ fontSize: 13, marginTop: 10 }}>
              paste this into your html form&apos;s <span className="kbd">action</span>{" "}
              attribute. that&apos;s the whole integration.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <StatCard label="submissions" value={stats.allTime} sub="all time" />
            <StatCard
              label="this month"
              value={stats.thisMonth}
              sub={`of ${planLimit.toLocaleString()}`}
            />
            <StatCard
              label="spam blocked"
              value={stats.spamBlocked}
              sub={`${spamRate}% rate`}
            />
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
              className="between"
              style={{ padding: "14px 16px", borderBottom: "1px solid var(--jff-line)" }}
            >
              <div className="text-fg" style={{ fontWeight: 600, fontSize: 14 }}>
                recent submissions
              </div>
              <Link
                href={`/dashboard/forms/${form.id}?tab=submissions`}
                style={{ fontSize: 13, color: "var(--jff-link)", textDecoration: "none" }}
              >
                view all →
              </Link>
            </div>
            <div>
              {recent && recent.rows.length > 0 ? (
                recent.rows.map((s) => (
                  <div
                    key={s.id}
                    className="between"
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid var(--jff-line-soft)",
                      fontSize: 14,
                      opacity: s.isSpam ? 0.55 : 1,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="text-fg" style={{ fontWeight: 500 }}>
                        {pickEmail(s.data) ?? "(unknown sender)"}
                      </div>
                      <div
                        className="text-muted"
                        style={{
                          fontSize: 13,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 480,
                        }}
                      >
                        {pickMessage(s.data)}
                      </div>
                    </div>
                    <div className="text-muted mono" style={{ fontSize: 12 }}>
                      {relativeTime(s.createdAt)}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: 32, textAlign: "center" }}>
                  <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>
                    no submissions yet. paste the endpoint into a form and submit.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "code" && (
        <div className="stack" style={{ gap: 16 }}>
          <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>
            html drop-in. no js, no library, no api keys.
          </p>
          <EmbedSnippet formId={form.id} />
          <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>
            if you want a JSON response instead of redirect:
          </p>
          <CodeBlock>
            <span className="com">{"// fetch from anywhere"}</span>
            {"\n"}
            <span className="tag">fetch</span>(
            <span className="str">{`'${endpointUrl}'`}</span>, {"{"}
            {"\n"}
            {"  "}method: <span className="str">{`'POST'`}</span>,{"\n"}
            {"  "}headers: {"{"} <span className="attr">{`'Accept'`}</span>:{" "}
            <span className="str">{`'application/json'`}</span> {"}"},{"\n"}
            {"  "}body: <span className="tag">new</span> FormData(form){"\n"}
            {"}"})
          </CodeBlock>
        </div>
      )}

      {tab === "settings" && (
        <FormSettings
          formId={form.id}
          initialName={form.name}
          initialNotificationEmail={form.notificationEmail}
          initialRedirectUrl={form.redirectUrl}
          initialHoneypotField={form.honeypotField}
          submissionCount={submissionCount}
        />
      )}

      {tab === "submissions" && recent && schema && (
        <SubmissionsTable
          formId={form.id}
          rows={recent.rows}
          total={recent.total}
          fields={schema.fields}
        />
      )}
    </>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <div
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
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: ".06em",
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        className="text-fg mono"
        style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}
      >
        {value.toLocaleString()}
      </div>
      <div className="text-muted" style={{ fontSize: 12 }}>
        {sub}
      </div>
    </div>
  );
}

function pickEmail(data: Record<string, unknown>): string | null {
  for (const k of ["email", "from", "reply_to", "contact"]) {
    const v = data[k];
    if (typeof v === "string" && v.includes("@")) return v;
  }
  return null;
}

function pickMessage(data: Record<string, unknown>): string {
  for (const k of ["message", "body", "comment", "note", "text"]) {
    const v = data[k];
    if (typeof v === "string") return v;
  }
  for (const [k, v] of Object.entries(data)) {
    if (k.startsWith("_") || k === "email") continue;
    if (typeof v === "string") return v;
  }
  return "";
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

function formatCreated(iso: string): string {
  return new Date(iso)
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toLowerCase();
}
