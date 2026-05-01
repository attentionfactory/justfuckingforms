"use client";

import { useState } from "react";
import { ChevronDown, Download, MoreHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INFERRED_FIELDS, SUBS } from "@/lib/mock-data";

export function ColumnPicker() {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState(INFERRED_FIELDS);

  const toggle = (key: string) =>
    setFields((fs) => fs.map((f) => (f.key === key ? { ...f, visible: !f.visible } : f)));

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
            columns · inferred from last 142 rows
          </div>
          {fields.map((f) => (
            <div
              key={f.key}
              className="row between"
              onClick={() => toggle(f.key)}
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

export function SubmissionsTable() {
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
          <ColumnPicker />
          <Button variant="outline" size="sm">
            <Download size={13} /> csv
          </Button>
        </div>
      </div>
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
            {["received", "email", "message", "status", ""].map((h, i) => (
              <th
                key={h || i}
                style={{
                  textAlign: "left",
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
          {SUBS.map((s) => (
            <tr key={s.id} style={{ opacity: s.spam ? 0.6 : 1 }}>
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
                {s.when}
              </td>
              <td
                style={{
                  padding: 14,
                  borderBottom: "1px solid var(--jff-line-soft)",
                  color: "var(--jff-fg)",
                  fontWeight: 500,
                }}
              >
                <a
                  href={`/dashboard/forms/a3f9k2x/submissions/${s.id}`}
                  style={{ color: "var(--jff-fg)", textDecoration: "none" }}
                >
                  {s.who}
                </a>
              </td>
              <td
                style={{
                  padding: 14,
                  borderBottom: "1px solid var(--jff-line-soft)",
                  color: "var(--jff-fg)",
                  maxWidth: 380,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {s.message}
              </td>
              <td style={{ padding: 14, borderBottom: "1px solid var(--jff-line-soft)" }}>
                <span
                  style={{
                    background: s.spam ? "var(--jff-spam-bg)" : "var(--jff-ok-bg)",
                    color: s.spam ? "var(--jff-spam-fg)" : "var(--jff-ok-fg)",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "0 8px",
                    height: 20,
                    display: "inline-flex",
                    alignItems: "center",
                    borderRadius: 999,
                  }}
                >
                  {s.spam ? "spam" : "ok"}
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
        <span className="text-muted">10 per page</span>
        <div className="row" style={{ gap: 4 }}>
          <Button variant="outline" size="sm" disabled>
            ← prev
          </Button>
          <Button variant="outline" size="sm">
            next →
          </Button>
        </div>
      </div>
    </div>
  );
}
