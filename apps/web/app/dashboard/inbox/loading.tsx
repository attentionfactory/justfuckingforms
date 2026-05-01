import { Skeleton } from "@/components/ui/skeleton";

// Inbox skeleton — header + filter row + 2 day groups with 4 rows each.
// Mirrors the actual inbox layout so layout shift on hydration is minimal.

export default function InboxLoading() {
  return (
    <>
      <div className="between" style={{ marginBottom: 24 }}>
        <div>
          <div className="crumb">
            <Skeleton style={{ width: 140, height: 14, display: "inline-block" }} />
          </div>
          <Skeleton style={{ width: 120, height: 36, marginTop: 4 }} />
        </div>
        <div className="row" style={{ gap: 8 }}>
          <Skeleton style={{ width: 100, height: 28, borderRadius: 6 }} />
          <Skeleton style={{ width: 84, height: 28, borderRadius: 6 }} />
        </div>
      </div>

      <Skeleton style={{ width: 280, height: 16, marginBottom: 20 }} />

      <div
        style={{
          background: "#fff",
          border: "1px solid var(--jff-line)",
          borderRadius: 12,
          padding: 12,
          marginBottom: 20,
        }}
      >
        <div className="row" style={{ gap: 8 }}>
          <Skeleton style={{ flex: 1, height: 28, borderRadius: 6 }} />
          <Skeleton style={{ width: 96, height: 28, borderRadius: 6 }} />
          <Skeleton style={{ width: 56, height: 28, borderRadius: 6 }} />
          <Skeleton style={{ width: 56, height: 28, borderRadius: 6 }} />
        </div>
      </div>

      <div className="stack" style={{ gap: 24 }}>
        {["today", "yesterday"].map((day) => (
          <div key={day}>
            <Skeleton style={{ width: 60, height: 12, marginBottom: 8, marginLeft: 4 }} />
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--jff-line)",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="row"
                  style={{
                    gap: 14,
                    padding: "14px 18px",
                    borderBottom: i < 3 ? "1px solid var(--jff-line-soft)" : 0,
                  }}
                >
                  <Skeleton style={{ width: 44, height: 12 }} />
                  <Skeleton style={{ width: 160, height: 18, borderRadius: 999 }} />
                  <Skeleton style={{ width: 140, height: 14 }} />
                  <Skeleton style={{ flex: 1, height: 14 }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
