"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Download, MoreHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApiSubmission, SchemaResponse } from "@/lib/api-types";

type FieldRow = SchemaResponse["fields"][number];

export function ColumnPicker({
  fields,
  sampleSize,
  onToggle,
}: {
  fields: FieldRow[];
  sampleSize: number;
  onToggle: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
        columns <ChevronDown size={12} />
      </Button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: 36,
            right: 0,
            width: 320,
            zIndex: 10,
            background: "#fff",
            border: "1px solid var(--jff-line)",
            borderRadius: 10,
            boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
            padding: 8,
          }}
        >
          <div
            style={{
              padding: "8px 10px 4px",
              fontSize: 11,
              color: "#a3a3a3",
              textTransform: "uppercase",
              letterSpacing: ".06em",
              fontWeight: 600,
            }}
          >
            columns · inferred from last {sampleSize} rows
          </div>
          {fields.length === 0 && (
            <div style={{ padding: "8px 10px", fontSize: 13, color: "#737373" }}>
              no fields detected yet. submit something to your form.
            </div>
          )}
          {fields.map((f) => (
            <div
              key={f.key}
              className="row between"
              onClick={() => onToggle(f.key)}
              style={{ padding: "8px 10px", borderRadius: 6, cursor: "pointer" }}
            >
              <div className="row" style={{ gap: 10, flex: 1, minWidth: 0 }}>
                <input
                  type="checkbox"
                  checked={f.visible}
                  readOnly
                  style={{ accentColor: "var(--jff-fg)" }}
                />
                <span
                  className="mono"
                  style={{ fontSize: 13, color: "var(--jff-fg)", fontWeight: 500 }}
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
              </div>
              <div className="row" style={{ gap: 8 }}>
                <span className="text-muted mono" style={{ fontSize: 11 }}>
                  {f.pct}%
                </span>
                <span className="text-muted" style={{ fontSize: 11 }}>
                  {f.type}
                </span>
              </div>
            </div>
          ))}
          <div
            style={{
              borderTop: "1px solid var(--jff-line)",
              marginTop: 6,
              paddingTop: 8,
              padding: "8px 10px",
              fontSize: 12,
              color: "#737373",
            }}
          >
            we infer columns from your data. fields that show up in less than 10% of rows are hidden by default.
          </div>
        </div>
      )}
    </div>
  );
}

export function SubmissionsTable({
  formId,
  rows,
  total,
  fields: initialFields,
}: {
  formId: string;
  rows: ApiSubmission[];
  total: number;
  fields: FieldRow[];
}) {
  const [fields, setFields] = useState(initialFields);
  const visible = fields.filter((f) => f.visible && !f.key.startsWith("_"));

  const toggle = (key: string) =>
    setFields((fs) => fs.map((f) => (f.key === key ? { ...f, visible: !f.visible } : f)));

  return (
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
        style={{ padding: 12, borderBottom: "1px solid var(--jff-line)" }}
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
              placeholder="search submissions..."
              style={{
                border: 0,
                outline: 0,
                fontSize: 13,
                background: "transparent",
                width: 220,
                color: "var(--jff-fg)",
              }}
            />
          </div>
          <Button variant="outline" size="sm">
            all
          </Button>
          <Button variant="ghost" size="sm">
            live
          </Button>
          <Button variant="ghost" size="sm">
            spam
          </Button>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <ColumnPicker fields={fields} sampleSize={total} onToggle={toggle} />
          <Button variant="outline" size="sm" asChild>
            <a href={`${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/forms/${formId}/submissions/export`}>
              <Download size={13} /> csv
            </a>
          </Button>
        </div>
      </div>
      {rows.length === 0 ? (
        <div style={{ padding: 48, textAlign: "center" }}>
          <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>
            no submissions yet. paste the endpoint into a form and submit.
          </p>
        </div>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                <th
                  style={{
                    width: 24,
                    padding: "10px 14px",
                    borderBottom: "1px solid var(--jff-line)",
                  }}
                >
                  <input type="checkbox" />
                </th>
                <Th>received</Th>
                {visible.map((f) => (
                  <Th key={f.key}>
                    <span className="row" style={{ gap: 6, display: "inline-flex" }}>
                      {f.key}
                      {f.isNew && (
                        <span
                          className="dot"
                          style={{ background: "#f59e0b", width: 6, height: 6 }}
                        />
                      )}
                    </span>
                  </Th>
                ))}
                <Th>status</Th>
                <Th width={32} />
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id} style={{ opacity: s.isSpam ? 0.6 : 1 }}>
                  <td style={{ padding: 14, borderBottom: "1px solid var(--jff-line-soft)" }}>
                    <input type="checkbox" />
                  </td>
                  <td
                    className="mono text-muted"
                    style={{
                      padding: 14,
                      borderBottom: "1px solid var(--jff-line-soft)",
                      fontSize: 13,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Link
                      href={`/dashboard/forms/${formId}/submissions/${s.id}`}
                      style={{ color: "var(--jff-muted)", textDecoration: "none" }}
                    >
                      {relativeTime(s.createdAt)}
                    </Link>
                  </td>
                  {visible.map((f) => {
                    const v = s.data[f.key];
                    return (
                      <td
                        key={f.key}
                        style={{
                          padding: 14,
                          borderBottom: "1px solid var(--jff-line-soft)",
                          color: "var(--jff-fg)",
                          maxWidth: 280,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {v == null || v === "" ? (
                          <span className="text-muted" style={{ fontSize: 12 }}>
                            —
                          </span>
                        ) : (
                          stringify(v)
                        )}
                      </td>
                    );
                  })}
                  <td style={{ padding: 14, borderBottom: "1px solid var(--jff-line-soft)" }}>
                    <span
                      style={{
                        background: s.isSpam ? "var(--jff-spam-bg)" : "var(--jff-ok-bg)",
                        color: s.isSpam ? "var(--jff-spam-fg)" : "var(--jff-ok-fg)",
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "0 8px",
                        height: 20,
                        display: "inline-flex",
                        alignItems: "center",
                        borderRadius: 999,
                      }}
                    >
                      {s.isSpam ? "spam" : "ok"}
                    </span>
                  </td>
                  <td style={{ padding: 14, borderBottom: "1px solid var(--jff-line-soft)" }}>
                    <MoreHorizontal size={16} color="#a3a3a3" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            className="between"
            style={{
              padding: "10px 16px",
              borderTop: "1px solid var(--jff-line)",
              fontSize: 13,
            }}
          >
            <span className="text-muted">
              showing {rows.length} of {total}
            </span>
            <div className="row" style={{ gap: 4 }}>
              <Button variant="outline" size="sm" disabled>
                ← prev
              </Button>
              <Button variant="outline" size="sm" disabled={rows.length >= total}>
                next →
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Th({ children, width }: { children?: React.ReactNode; width?: number }) {
  return (
    <th
      style={{
        textAlign: "left",
        fontWeight: 600,
        color: "var(--jff-fg)",
        padding: "10px 14px",
        borderBottom: "1px solid var(--jff-line)",
        fontSize: 12,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        width,
      }}
    >
      {children}
    </th>
  );
}

function stringify(v: unknown): string {
  if (Array.isArray(v)) return v.map(String).join(", ");
  if (typeof v === "object" && v !== null) return JSON.stringify(v);
  return String(v);
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
