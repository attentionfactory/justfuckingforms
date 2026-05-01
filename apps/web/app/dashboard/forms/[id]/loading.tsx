import { Skeleton } from "@/components/ui/skeleton";

// Form detail skeleton — crumb + h1 + tab bar + endpoint card + 3 stat cards.
// Tab content (overview vs settings vs code etc.) is uniformly skeletoned.

export default function FormDetailLoading() {
  return (
    <>
      <div className="crumb">
        <Skeleton style={{ width: 220, height: 14, display: "inline-block" }} />
      </div>
      <div className="between" style={{ marginBottom: 8 }}>
        <Skeleton style={{ width: 280, height: 36 }} />
        <div className="row" style={{ gap: 8 }}>
          <Skeleton style={{ width: 60, height: 20, borderRadius: 999 }} />
          <Skeleton style={{ width: 64, height: 28, borderRadius: 6 }} />
          <Skeleton style={{ width: 32, height: 28, borderRadius: 6 }} />
        </div>
      </div>
      <Skeleton style={{ width: 320, height: 14, marginBottom: 24 }} />

      {/* Tab bar */}
      <div
        className="row"
        style={{ borderBottom: "1px solid var(--jff-line)", gap: 0, marginBottom: 24 }}
      >
        {["overview", "submissions", "settings", "code"].map((t) => (
          <div key={t} style={{ padding: "10px 14px" }}>
            <Skeleton style={{ width: 80, height: 16 }} />
          </div>
        ))}
      </div>

      {/* Endpoint card */}
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--jff-line)",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <Skeleton style={{ width: 100, height: 14, marginBottom: 8 }} />
        <div className="row" style={{ gap: 8 }}>
          <Skeleton style={{ flex: 1, height: 44 }} />
          <Skeleton style={{ width: 96, height: 36, borderRadius: 6 }} />
        </div>
      </div>

      {/* 3 stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "1px solid var(--jff-line)",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <Skeleton style={{ width: 100, height: 12, marginBottom: 8 }} />
            <Skeleton style={{ width: 80, height: 28, marginBottom: 6 }} />
            <Skeleton style={{ width: 60, height: 12 }} />
          </div>
        ))}
      </div>

      {/* Recent submissions */}
      <div
        style={{
          background: "#fff",
          border: "1px solid var(--jff-line)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid var(--jff-line)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Skeleton style={{ width: 140, height: 16 }} />
          <Skeleton style={{ width: 60, height: 14 }} />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              padding: "12px 16px",
              borderBottom: i < 3 ? "1px solid var(--jff-line-soft)" : 0,
            }}
          >
            <Skeleton style={{ width: 180, height: 14, marginBottom: 6 }} />
            <Skeleton style={{ width: "70%", height: 12 }} />
          </div>
        ))}
      </div>
    </>
  );
}
