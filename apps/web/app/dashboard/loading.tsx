import { Skeleton } from "@/components/ui/skeleton";

// Default dashboard skeleton — used for /dashboard (forms list) and any
// nested route without its own loading.tsx. Mirrors the crumb + h1 + content
// shape so the layout doesn't shift when the real page renders.

export default function DashboardLoading() {
  return (
    <>
      <div className="crumb">
        <Skeleton style={{ width: 140, height: 14, display: "inline-block" }} />
      </div>
      <Skeleton style={{ width: 220, height: 36, marginBottom: 28 }} />

      <div
        style={{
          background: "#fff",
          border: "1px solid var(--jff-line)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <Skeleton style={{ width: "100%", height: 14, marginBottom: 8 }} />
        <Skeleton style={{ width: "100%", height: 6, borderRadius: 999 }} />
        <Skeleton
          style={{ width: 220, height: 12, marginTop: 10 }}
        />
      </div>

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
            padding: "12px 16px",
            borderBottom: "1px solid var(--jff-line)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Skeleton style={{ width: 240, height: 28, borderRadius: 6 }} />
          <Skeleton style={{ width: 60, height: 16 }} />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              padding: 14,
              borderBottom:
                i < 3 ? "1px solid var(--jff-line-soft)" : 0,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <Skeleton style={{ width: 6, height: 6, borderRadius: 999 }} />
            <Skeleton style={{ width: 200, height: 16 }} />
            <Skeleton style={{ width: 240, height: 14, marginLeft: "auto" }} />
            <Skeleton style={{ width: 60, height: 14 }} />
            <Skeleton style={{ width: 90, height: 14 }} />
          </div>
        ))}
      </div>
    </>
  );
}
