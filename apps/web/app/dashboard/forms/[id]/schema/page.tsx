import Link from "next/link";
import { notFound } from "next/navigation";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiGet, apiGetOrNull } from "@/lib/api";
import type { ApiForm, FormStats, SchemaResponse } from "@/lib/api-types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SchemaPage({ params }: Props) {
  const { id } = await params;

  const detail = await apiGetOrNull<{ form: ApiForm; stats: FormStats }>(
    `/api/forms/${id}`,
  );
  if (!detail) notFound();
  const { form } = detail;

  const { fields: INFERRED_FIELDS, sampleSize } = await apiGet<SchemaResponse>(
    `/api/forms/${id}/schema`,
  );
  const newCount = INFERRED_FIELDS.filter((f) => f.isNew).length;

  return (
    <>
      <div className="crumb">
        forms /{" "}
        <Link href={`/dashboard/forms/${form.id}`} style={{ color: "var(--jff-fg)" }}>
          {form.name}
        </Link>{" "}
        / schema
      </div>
      <h1 style={{ marginBottom: 8 }}>schema</h1>
      <p className="text-muted" style={{ fontSize: 14, marginBottom: 24 }}>
        we don&apos;t make you define one. this is whatever your form has been sending, ranked
        by how often each field shows up.
      </p>

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
          style={{ padding: "14px 18px", borderBottom: "1px solid var(--jff-line)" }}
        >
          <div>
            <div className="text-fg" style={{ fontWeight: 600, fontSize: 14 }}>
              inferred schema
            </div>
            <div className="text-muted" style={{ fontSize: 12 }}>
              from last {sampleSize} submissions · auto-updates
            </div>
          </div>
          <div className="row" style={{ gap: 6 }}>
            {newCount > 0 && (
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
                {newCount} new
              </span>
            )}
            <Button variant="ghost" size="sm">
              <Settings size={13} />
            </Button>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr>
              {[
                ["field", "left"],
                ["type", "left"],
                ["seen in", "right"],
                ["sample", "left"],
                ["", "left"],
              ].map(([h, align], i) => (
                <th
                  key={(h as string) || i}
                  style={{
                    textAlign: align as "left" | "right",
                    fontWeight: 600,
                    color: "var(--jff-fg)",
                    padding: "10px 14px",
                    borderBottom: "1px solid var(--jff-line)",
                    fontSize: 12,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    width: i === 4 ? 60 : undefined,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INFERRED_FIELDS.map((f) => (
              <tr key={f.key}>
                <td style={{ padding: 14, borderBottom: "1px solid var(--jff-line-soft)" }}>
                  <div className="row" style={{ gap: 8 }}>
                    <span
                      className="mono text-fg"
                      style={{ fontWeight: 600, fontSize: 13 }}
                    >
                      {f.key}
                    </span>
                    {f.isNew && (
                      <span
                        style={{
                          background: "var(--jff-warn-bg)",
                          color: "var(--jff-warn-fg)",
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "0 8px",
                          height: 18,
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: 999,
                        }}
                      >
                        new
                      </span>
                    )}
                    {f.key.startsWith("_") && (
                      <span
                        style={{
                          background: "var(--jff-chip)",
                          color: "#525252",
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "0 8px",
                          height: 18,
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: 999,
                        }}
                      >
                        meta
                      </span>
                    )}
                  </div>
                </td>
                <td
                  className="mono text-muted"
                  style={{
                    padding: 14,
                    borderBottom: "1px solid var(--jff-line-soft)",
                    fontSize: 12,
                  }}
                >
                  {f.type}
                </td>
                <td
                  className="mono"
                  style={{
                    padding: 14,
                    borderBottom: "1px solid var(--jff-line-soft)",
                    textAlign: "right",
                  }}
                >
                  <span className="text-fg">{f.pct}%</span>{" "}
                  <span className="text-muted" style={{ fontSize: 12 }}>
                    ({f.seen})
                  </span>
                </td>
                <td
                  className="text-muted"
                  style={{
                    padding: 14,
                    borderBottom: "1px solid var(--jff-line-soft)",
                    fontSize: 13,
                    maxWidth: 220,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {f.sample}
                </td>
                <td style={{ padding: 14, borderBottom: "1px solid var(--jff-line-soft)" }}>
                  <span className="kbd" style={{ fontSize: 10, opacity: f.visible ? 1 : 0.3 }}>
                    vis
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            padding: "12px 18px",
            borderTop: "1px solid var(--jff-line)",
            fontSize: 12,
            color: "#737373",
          }}
        >
          no schema to define. add a{" "}
          <span className="mono text-fg">{`<input name="anything"/>`}</span> to your form, it
          shows up here on the next submission.
        </div>
      </div>
    </>
  );
}
