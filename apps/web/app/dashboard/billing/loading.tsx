import { Skeleton } from "@/components/ui/skeleton";

export default function BillingLoading() {
  return (
    <>
      <div className="crumb">
        <Skeleton style={{ width: 140, height: 14, display: "inline-block" }} />
      </div>
      <Skeleton style={{ width: 120, height: 36, marginBottom: 24 }} />

      {/* Black current-plan card */}
      <div
        style={{
          padding: 24,
          marginBottom: 20,
          background: "var(--jff-fg)",
          borderRadius: 12,
        }}
      >
        <div className="between" style={{ alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <Skeleton style={{ width: 100, height: 12, marginBottom: 8, background: "#262626" }} />
            <Skeleton style={{ width: 200, height: 36, marginBottom: 8, background: "#262626" }} />
            <Skeleton style={{ width: 240, height: 14, background: "#262626" }} />
          </div>
          <Skeleton style={{ width: 160, height: 36, borderRadius: 6, background: "#262626" }} />
        </div>
        <div style={{ marginTop: 24 }}>
          <Skeleton style={{ width: "100%", height: 6, borderRadius: 999, background: "#262626" }} />
        </div>
      </div>

      {/* Toggle row */}
      <div className="between" style={{ marginBottom: 16 }}>
        <Skeleton style={{ width: 280, height: 14 }} />
        <Skeleton style={{ width: 220, height: 32, borderRadius: 8 }} />
      </div>

      {/* Tier cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "1px solid var(--jff-line)",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <Skeleton style={{ width: 80, height: 16, marginBottom: 8 }} />
            <Skeleton style={{ width: 120, height: 32, marginBottom: 12 }} />
            <Skeleton style={{ width: "100%", height: 14, marginBottom: 6 }} />
            <Skeleton style={{ width: "100%", height: 14, marginBottom: 6 }} />
            <Skeleton style={{ width: "100%", height: 14, marginBottom: 16 }} />
            <Skeleton style={{ width: "100%", height: 32, borderRadius: 8 }} />
          </div>
        ))}
      </div>
    </>
  );
}
