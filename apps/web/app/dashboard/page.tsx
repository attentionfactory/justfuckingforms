import Link from "next/link";
import { ExternalLink, MoreHorizontal, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UsageBar } from "@/components/jff/usage-bar";
import { FORMS } from "@/lib/mock-data";

type Props = {
  searchParams: Promise<{ empty?: string }>;
};

export default async function FormsListPage({ searchParams }: Props) {
  const sp = await searchParams;
  const isEmpty = sp.empty === "1";
  const forms = isEmpty ? [] : FORMS;

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

      {!isEmpty && (
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
          <UsageBar used={1045} total={10000} />
          <div className="text-muted" style={{ fontSize: 13, marginTop: 10 }}>
            you&apos;re on{" "}
            <span className="text-fg" style={{ fontWeight: 600 }}>
              pro
            </span>
            . resets in 18 days.
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
              {forms.length} forms
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
                      style={{ background: f.active ? "var(--jff-good)" : "#a3a3a3" }}
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
                    jff.dev/f/{f.id}
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
                    {f.subs.toLocaleString()}
                  </td>
                  <td
                    className="text-muted"
                    style={{
                      padding: 14,
                      borderBottom: "1px solid var(--jff-line-soft)",
                      fontSize: 13,
                    }}
                  >
                    {f.last}
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

      {!isEmpty && (
        <p className="text-muted" style={{ fontSize: 13, marginTop: 16 }}>
          you can have up to <span className="text-fg">∞</span> forms on pro. on free, 3.
        </p>
      )}
    </>
  );
}
