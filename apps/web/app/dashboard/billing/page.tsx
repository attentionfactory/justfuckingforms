import { Button } from "@/components/ui/button";

const TIERS = [
  { name: "free", price: "$0", subs: "100", forms: "3", current: false },
  { name: "starter", price: "$3", subs: "1,000", forms: "unlimited", current: true },
  { name: "pro", price: "$9", subs: "10,000", forms: "unlimited", current: false },
] as const;

const INVOICES: Array<[string, string, string]> = [
  ["apr 14, 2026", "starter", "$3.00"],
  ["mar 14, 2026", "starter", "$3.00"],
  ["feb 14, 2026", "starter", "$3.00"],
  ["jan 14, 2026", "starter", "$3.00 — first month"],
];

export default function BillingPage() {
  return (
    <>
      <div className="crumb">workspace / billing</div>
      <h1 style={{ marginBottom: 24 }}>billing</h1>

      <div
        className="card"
        style={{
          padding: 24,
          marginBottom: 20,
          background: "var(--jff-fg)",
          color: "#fafafa",
          border: 0,
          borderRadius: 12,
        }}
      >
        <div className="between" style={{ alignItems: "flex-start" }}>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#a3a3a3",
                letterSpacing: ".06em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              current plan
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                margin: "4px 0",
              }}
            >
              starter
            </div>
            <div style={{ color: "#a3a3a3", fontSize: 14 }}>
              $3/month · renews may 14, 2026
            </div>
          </div>
          <Button style={{ background: "#fafafa", color: "var(--jff-fg)" }}>
            upgrade to pro
          </Button>
        </div>
        <div style={{ marginTop: 24 }}>
          <div className="between" style={{ marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: "#a3a3a3" }}>submissions used</span>
            <span className="mono">347 / 1,000</span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 999,
              background: "#262626",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "34.7%",
                height: "100%",
                background: "#fafafa",
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 32,
        }}
      >
        {TIERS.map((p) => (
          <div
            key={p.name}
            className="card"
            style={{
              background: "#fff",
              border: `1px solid ${p.current ? "var(--jff-fg)" : "var(--jff-line)"}`,
              borderRadius: 12,
              padding: 20,
              boxShadow: p.current ? "0 0 0 1px var(--jff-fg)" : "none",
            }}
          >
            <div className="between">
              <div
                style={{
                  fontWeight: 700,
                  color: "var(--jff-fg)",
                  fontSize: 16,
                  textTransform: "lowercase",
                }}
              >
                {p.name}
              </div>
              {p.current && (
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
                  current
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "var(--jff-fg)",
                letterSpacing: "-0.03em",
                marginTop: 8,
              }}
            >
              {p.price}
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--jff-muted)",
                }}
              >
                /mo
              </span>
            </div>
            <div className="text-muted" style={{ fontSize: 13, marginTop: 12 }}>
              <div>{p.subs} submissions/mo</div>
              <div>{p.forms} forms</div>
              <div>spam filter, csv export</div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              style={{ marginTop: 16, width: "100%" }}
              disabled={p.current}
            >
              {p.current ? "you're here" : p.name === "pro" ? "upgrade" : "switch"}
            </Button>
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
          invoices
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr>
              {["date", "plan", "amount", "status", ""].map((h, i) => (
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
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((r, i) => (
              <tr key={i}>
                <td
                  className="mono"
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
                <td
                  className="mono"
                  style={{
                    padding: 14,
                    borderBottom: "1px solid var(--jff-line-soft)",
                    color: "var(--jff-fg)",
                  }}
                >
                  {r[2]}
                </td>
                <td style={{ padding: 14, borderBottom: "1px solid var(--jff-line-soft)" }}>
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
                    paid
                  </span>
                </td>
                <td style={{ padding: 14, borderBottom: "1px solid var(--jff-line-soft)" }}>
                  <a
                    href="#"
                    style={{ color: "var(--jff-link)", fontSize: 13 }}
                  >
                    receipt ↓
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
