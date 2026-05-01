import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/jff/embed-snippet";
import { apiGetOrNull } from "@/lib/api";
import type { ApiSubmission } from "@/lib/api-types";

type Props = {
  params: Promise<{ id: string; subId: string }>;
};

export default async function SingleSubmissionPage({ params }: Props) {
  const { id, subId } = await params;

  const data = await apiGetOrNull<{ submission: ApiSubmission; formName: string }>(
    `/api/forms/${id}/submissions/${subId}`,
  );
  if (!data) notFound();
  const { submission, formName } = data;

  const fields = Object.entries(submission.data ?? {}).filter(
    ([k]) => !k.startsWith("_"),
  ) as Array<[string, unknown]>;

  const payload = JSON.stringify(
    {
      ...submission.data,
      _meta: {
        ip: submission.ipAddress,
        ua: submission.userAgent,
        received_at: submission.createdAt,
      },
    },
    null,
    2,
  );

  return (
    <div style={{ maxWidth: 800 }}>
      <div className="crumb">
        forms /{" "}
        <Link href={`/dashboard/forms/${id}`} style={{ color: "var(--jff-fg)" }}>
          {formName}
        </Link>{" "}
        /{" "}
        <Link
          href={`/dashboard/forms/${id}?tab=submissions`}
          style={{ color: "var(--jff-muted)" }}
        >
          submissions
        </Link>{" "}
        / <span style={{ color: "var(--jff-fg)" }}>{shortId(submission.id)}</span>
      </div>
      <div className="between" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24 }}>submission {shortId(submission.id)}</h1>
        <div className="row">
          <Button variant="outline" size="sm">
            <ArrowLeft size={13} /> prev
          </Button>
          <Button variant="outline" size="sm">
            next <ArrowRight size={13} />
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 size={13} />
          </Button>
        </div>
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
        <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--jff-line)" }}>
          <div className="row between">
            <div>
              <div className="text-fg" style={{ fontWeight: 600, fontSize: 16 }}>
                {pickEmail(submission.data) ?? "(no email field)"}
              </div>
              <div className="text-muted mono" style={{ fontSize: 13 }}>
                received {new Date(submission.createdAt).toLocaleString()}
                {submission.ipAddress ? ` · ${submission.ipAddress}` : ""}
              </div>
            </div>
            <span
              style={{
                background: submission.isSpam ? "var(--jff-spam-bg)" : "var(--jff-ok-bg)",
                color: submission.isSpam ? "var(--jff-spam-fg)" : "var(--jff-ok-fg)",
                fontSize: 11,
                fontWeight: 600,
                padding: "0 8px",
                height: 20,
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 999,
              }}
            >
              {submission.isSpam ? "spam" : "delivered"}
            </span>
          </div>
        </div>

        <div style={{ padding: 20 }}>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: ".06em",
              color: "#a3a3a3",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            fields
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            <tbody>
              {fields.map(([k, v]) => (
                <tr key={k} style={{ borderBottom: "1px solid var(--jff-line-soft)" }}>
                  <td
                    className="mono text-muted"
                    style={{
                      padding: "10px 0",
                      width: 130,
                      verticalAlign: "top",
                      fontSize: 13,
                    }}
                  >
                    {k}
                  </td>
                  <td className="text-fg" style={{ padding: "10px 0" }}>
                    {stringify(v)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: ".06em",
              color: "#a3a3a3",
              fontWeight: 600,
              marginTop: 24,
              marginBottom: 6,
            }}
          >
            raw payload
          </div>
          <CodeBlock>{payload}</CodeBlock>
        </div>
      </div>
    </div>
  );
}

function shortId(id: string): string {
  return `#${id.split("-")[0]}`;
}

function pickEmail(data: Record<string, unknown>): string | null {
  for (const k of ["email", "from", "reply_to", "contact"]) {
    const v = data[k];
    if (typeof v === "string" && v.includes("@")) return v;
  }
  return null;
}

function stringify(v: unknown): string {
  if (v == null) return "";
  if (Array.isArray(v)) return v.map(String).join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
