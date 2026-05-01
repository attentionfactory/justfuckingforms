import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CodeBlock, EmbedSnippet } from "@/components/jff/embed-snippet";
import { CopyEndpoint } from "@/components/jff/copy-endpoint";
import { FormTabs, type FormTab } from "@/components/jff/form-tabs";
import { SubmissionsTable } from "@/components/jff/submissions-table";
import { FORMS, SUBS } from "@/lib/mock-data";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: FormTab; paused?: string }>;
};

export default async function FormDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const tab: FormTab = sp.tab ?? "overview";
  const paused = sp.paused === "1";

  const form = FORMS.find((f) => f.id === id);
  if (!form) notFound();

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
          {paused ? (
            <Button size="sm">upgrade to resume</Button>
          ) : (
            <Button variant="outline" size="sm">
              pause
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Settings size={14} />
          </Button>
        </div>
      </div>
      <p className="text-muted" style={{ fontSize: 14, marginBottom: 24 }}>
        created jan 14. notifications go to{" "}
        <span className="text-fg mono" style={{ fontSize: 13 }}>
          {form.email}
        </span>
        .
      </p>

      {paused && (
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
                <span style={{ fontWeight: 600 }}>100/100</span> on the free plan. visitors get
                a 429. upgrade to starter ($3/mo, 1,000 submissions) to keep receiving.
              </div>
              <div className="row" style={{ gap: 8, marginTop: 12 }}>
                <Button size="sm">upgrade to starter</Button>
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
            <CopyEndpoint url={`https://jff.dev/f/${form.id}`} />
            <p className="text-muted" style={{ fontSize: 13, marginTop: 10 }}>
              paste this into your html form&apos;s <span className="kbd">action</span>{" "}
              attribute. that&apos;s the whole integration.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { label: "submissions", value: form.subs.toLocaleString(), sub: "all time" },
              { label: "this month", value: "47", sub: "of 1,000" },
              { label: "spam blocked", value: "23", sub: "14% rate" },
            ].map((s) => (
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
                    fontSize: 12,
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
              {SUBS.slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  className="between"
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--jff-line-soft)",
                    fontSize: 14,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="text-fg" style={{ fontWeight: 500 }}>
                      {s.who}
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
                      {s.message}
                    </div>
                  </div>
                  <div className="text-muted mono" style={{ fontSize: 12 }}>
                    {s.when}
                  </div>
                </div>
              ))}
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
            <span className="str">{`'https://jff.dev/f/${form.id}'`}</span>, {"{"}
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
        <div
          className="card"
          style={{
            background: "#fff",
            border: "1px solid var(--jff-line)",
            borderRadius: 12,
            padding: 24,
            maxWidth: 560,
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <Label htmlFor="form-name">form name</Label>
            <Input id="form-name" defaultValue={form.name} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <Label htmlFor="notif">notification email</Label>
            <Input id="notif" defaultValue={form.email} />
            <div className="text-muted" style={{ fontSize: 13, marginTop: 6 }}>
              we&apos;ll send each submission to this address.
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Label htmlFor="redir">redirect after submit (optional)</Label>
            <Input id="redir" placeholder="https://yoursite.com/thanks" />
            <div className="text-muted" style={{ fontSize: 13, marginTop: 6 }}>
              leave blank for our default thank-you page.
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <Label htmlFor="hp">honeypot field name</Label>
            <Input id="hp" className="font-mono" defaultValue="website" />
            <div className="text-muted" style={{ fontSize: 13, marginTop: 6 }}>
              if a bot fills this hidden field, we mark the row spam.
            </div>
          </div>
          <div className="row between">
            <Button>save</Button>
            <Button variant="ghost" style={{ color: "var(--jff-danger)" }}>
              <Trash2 size={14} /> delete form
            </Button>
          </div>
          <p className="text-muted" style={{ fontSize: 13, marginTop: 16 }}>
            also see{" "}
            <Link
              href={`/dashboard/forms/${form.id}/settings/domains`}
              style={{ color: "var(--jff-link)" }}
            >
              allowed domains
            </Link>{" "}
            to lock down where this endpoint accepts submissions from.
          </p>
        </div>
      )}

      {tab === "submissions" && <SubmissionsTable />}
    </>
  );
}
