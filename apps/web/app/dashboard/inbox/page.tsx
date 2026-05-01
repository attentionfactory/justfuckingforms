import { Download, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INBOX, FORM_COLORS } from "@/lib/mock-data";

export default function InboxPage() {
  const unreadCount = INBOX.flatMap((g) => g.items).filter((i) => i.unread).length;

  return (
    <>
      <div className="between" style={{ marginBottom: 24 }}>
        <div>
          <div className="crumb">workspace / inbox</div>
          <h1>inbox</h1>
        </div>
        <div className="row">
          <Button variant="outline" size="sm">
            mark all read
          </Button>
          <Button variant="outline" size="sm">
            <Download size={13} /> export
          </Button>
        </div>
      </div>

      <p className="text-muted" style={{ fontSize: 14, marginBottom: 20 }}>
        every submission, every form, one stream.{" "}
        <span className="text-fg" style={{ fontWeight: 600 }}>
          {unreadCount} unread
        </span>
        .
      </p>

      <div
        className="card"
        style={{
          background: "#fff",
          border: "1px solid var(--jff-line)",
          borderRadius: 12,
          padding: 12,
          marginBottom: 20,
        }}
      >
        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <div
            className="row"
            style={{
              gap: 6,
              padding: "4px 10px",
              background: "var(--jff-bg-alt)",
              border: "1px solid var(--jff-line)",
              borderRadius: 6,
              flex: 1,
              minWidth: 200,
            }}
          >
            <Search size={13} color="#a3a3a3" />
            <input
              className="mono"
              placeholder="search across all forms..."
              style={{
                border: 0,
                outline: 0,
                fontSize: 13,
                background: "transparent",
                flex: 1,
                color: "var(--jff-fg)",
              }}
            />
          </div>
          <Button variant="outline" size="sm">
            all forms <ChevronDown size={11} />
          </Button>
          <Button variant="ghost" size="sm">
            unread
          </Button>
          <Button variant="ghost" size="sm">
            live
          </Button>
          <Button variant="ghost" size="sm">
            spam
          </Button>
        </div>
        <div className="row" style={{ gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          {Object.keys(FORM_COLORS).map((name) => (
            <span
              key={name}
              className="row"
              style={{
                gap: 6,
                padding: "3px 10px",
                background: "var(--jff-bg-alt)",
                border: "1px solid var(--jff-line)",
                borderRadius: 999,
                fontSize: 12,
              }}
            >
              <span className="dot" style={{ background: FORM_COLORS[name] }} />
              <span className="text-fg">{name}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="stack" style={{ gap: 24 }}>
        {INBOX.map((group) => (
          <div key={group.day}>
            <div
              className="mono"
              style={{
                fontSize: 11,
                color: "#a3a3a3",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: 8,
                paddingLeft: 4,
              }}
            >
              {group.day}
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
              {group.items.map((s, i) => (
                <div
                  key={`${group.day}-${i}`}
                  className="row"
                  style={{
                    gap: 14,
                    padding: "14px 18px",
                    borderBottom:
                      i < group.items.length - 1 ? "1px solid var(--jff-line-soft)" : 0,
                    opacity: s.spam ? 0.55 : 1,
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  {s.unread && (
                    <div
                      style={{
                        position: "absolute",
                        left: 6,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 4,
                        height: 24,
                        background: "var(--jff-fg)",
                        borderRadius: 2,
                      }}
                    />
                  )}
                  <div
                    className="mono text-muted"
                    style={{ fontSize: 12, width: 44, flexShrink: 0 }}
                  >
                    {s.time}
                  </div>
                  <span
                    className="row"
                    style={{
                      gap: 6,
                      padding: "3px 8px",
                      background: "var(--jff-bg-alt)",
                      border: "1px solid var(--jff-line)",
                      borderRadius: 999,
                      fontSize: 11,
                      flexShrink: 0,
                      maxWidth: 220,
                    }}
                  >
                    <span
                      className="dot"
                      style={{
                        background: FORM_COLORS[s.form] ?? "#a3a3a3",
                        width: 6,
                        height: 6,
                      }}
                    />
                    <span
                      className="text-fg"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {s.form}
                    </span>
                  </span>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      gap: 8,
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      className="text-fg"
                      style={{
                        fontWeight: s.unread ? 600 : 500,
                        fontSize: 14,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.who}
                    </span>
                    <span
                      className="text-muted"
                      style={{
                        fontSize: 14,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        flex: 1,
                      }}
                    >
                      {s.message}
                    </span>
                  </div>
                  {s.spam && (
                    <span
                      style={{
                        background: "var(--jff-spam-bg)",
                        color: "var(--jff-spam-fg)",
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "0 8px",
                        height: 20,
                        display: "inline-flex",
                        alignItems: "center",
                        borderRadius: 999,
                        letterSpacing: ".02em",
                      }}
                    >
                      spam
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p
        className="text-muted"
        style={{ fontSize: 13, marginTop: 24, textAlign: "center" }}
      >
        that&apos;s all 142 submissions.{" "}
        <a href="#" style={{ color: "var(--jff-link)" }}>
          load older
        </a>
      </p>
    </>
  );
}
