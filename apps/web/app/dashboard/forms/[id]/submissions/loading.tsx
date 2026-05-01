import { Skeleton } from "@/components/ui/skeleton";

// Submissions table skeleton.

export default function SubmissionsLoading() {
  return (
    <>
      <div className="between" style={{ marginBottom: 24 }}>
        <div>
          <div className="crumb">
            <Skeleton style={{ width: 220, height: 14, display: "inline-block" }} />
          </div>
          <Skeleton style={{ width: 200, height: 36, marginTop: 4 }} />
        </div>
        <Skeleton style={{ width: 120, height: 36, borderRadius: 6 }} />
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid var(--jff-line)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Filter row */}
        <div
          className="between"
          style={{ padding: 12, borderBottom: "1px solid var(--jff-line)" }}
        >
          <div className="row" style={{ gap: 8 }}>
            <Skeleton style={{ width: 240, height: 28, borderRadius: 6 }} />
            <Skeleton style={{ width: 56, height: 28, borderRadius: 6 }} />
            <Skeleton style={{ width: 56, height: 28, borderRadius: 6 }} />
          </div>
          <div className="row" style={{ gap: 8 }}>
            <Skeleton style={{ width: 96, height: 28, borderRadius: 6 }} />
            <Skeleton style={{ width: 64, height: 28, borderRadius: 6 }} />
          </div>
        </div>

        {/* Header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "24px 110px 200px 1fr 80px 32px",
            gap: 14,
            padding: "10px 14px",
            borderBottom: "1px solid var(--jff-line)",
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} style={{ height: 12 }} />
          ))}
        </div>

        {/* Rows */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "24px 110px 200px 1fr 80px 32px",
              gap: 14,
              padding: 14,
              borderBottom: i < 6 ? "1px solid var(--jff-line-soft)" : 0,
            }}
          >
            <Skeleton style={{ width: 14, height: 14, borderRadius: 3 }} />
            <Skeleton style={{ height: 14 }} />
            <Skeleton style={{ height: 14 }} />
            <Skeleton style={{ height: 14 }} />
            <Skeleton style={{ width: 56, height: 18, borderRadius: 999 }} />
            <Skeleton style={{ width: 18, height: 18 }} />
          </div>
        ))}
      </div>
    </>
  );
}
