import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/jff/embed-snippet";
import { FORMS, SUBS } from "@/lib/mock-data";

type Props = {
  params: Promise<{ id: string; subId: string }>;
};

export default async function SingleSubmissionPage({ params }: Props) {
  const { id, subId } = await params;
  const form = FORMS.find((f) => f.id === id);
  if (!form) notFound();

  const sub = SUBS.find((s) => String(s.id) === subId) ?? SUBS[0];

  // Stub-derive name and company from email handle
  const name =
    sub.who === "sarah@vercel.com"
      ? "Sarah Drasner"
      : sub.who.split("@")[0].replace(/[._-]/g, " ");
  const company =
    sub.who.includes("@")
      ? sub.who.split("@")[1].split(".")[0].replace(/^\w/, (c) => c.toUpperCase())
      : "";

  const fields: Array<[string, string]> = [
    ["email", sub.who],
    ["name", name],
    ["company", company],
    ["message", sub.message],
  ];

  const payload = JSON.stringify(
    {
      email: sub.who,
      name,
      company,
      message: sub.message,
      _meta: {
        ip: "197.210.226.43",
        ua: "Mozilla/5.0 (Mac; Safari/17.0)",
        received_at: "2026-04-30T11:24:18Z",
      },
    },
    null,
    2,
  );

  return (
    <div style={{ maxWidth: 800 }}>
      <div className="crumb">
        forms /{" "}
        <Link href={`/dashboard/forms/${form.id}`} style={{ color: "var(--jff-fg)" }}>
          {form.name}
        </Link>{" "}
        /{" "}
        <Link
          href={`/dashboard/forms/${form.id}?tab=submissions`}
          style={{ color: "var(--jff-muted)" }}
        >
          submissions
        </Link>{" "}
        /{" "}
        <span style={{ color: "var(--jff-fg)" }}>#{1042 + sub.id}</span>
      </div>
      <div className="between" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24 }}>submission #{1042 + sub.id}</h1>
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
              <div
                className="text-fg"
                style={{ fontWeight: 600, fontSize: 16 }}
              >
                {sub.who}
              </div>
              <div className="text-muted mono" style={{ fontSize: 13 }}>
                received {sub.when} · 197.210.226.43
              </div>
            </div>
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
              delivered
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
                    {v}
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
