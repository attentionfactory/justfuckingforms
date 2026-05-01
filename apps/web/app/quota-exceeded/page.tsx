type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function QuotaExceededPage({ searchParams }: Props) {
  const { id } = await searchParams;
  const formId = id ?? "a3f9k2x";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--jff-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--jff-font-sans)",
        padding: 40,
      }}
    >
      <div style={{ maxWidth: 520, textAlign: "center" }}>
        <div
          className="mono"
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "var(--jff-fg)",
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          429
        </div>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "var(--jff-fg)",
            letterSpacing: "-0.03em",
            margin: "16px 0 8px",
          }}
        >
          this form is paused.
        </h1>
        <p
          style={{
            color: "var(--jff-muted)",
            fontSize: 16,
            lineHeight: 1.55,
            margin: "0 0 8px",
          }}
        >
          the owner ran out of submissions for this month. your message wasn&apos;t saved.
        </p>
        <p
          style={{
            color: "var(--jff-muted)",
            fontSize: 16,
            lineHeight: 1.55,
            margin: "0 0 24px",
          }}
        >
          try again next month, or email them directly.
        </p>
        <div className="mono" style={{ fontSize: 12, color: "#a3a3a3" }}>
          POST /f/{formId} → 429 quota_exceeded
        </div>
      </div>
    </div>
  );
}
