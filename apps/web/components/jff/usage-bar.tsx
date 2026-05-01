type Props = {
  used: number;
  total: number;
  accent?: string;
  label?: string;
};

export function UsageBar({ used, total, accent = "#0a0a0a", label = "submissions this month" }: Props) {
  const pct = Math.min(100, (used / total) * 100);
  return (
    <div>
      <div className="between" style={{ marginBottom: 6, fontSize: 13 }}>
        <span className="text-muted">{label}</span>
        <span className="mono text-fg">
          {used.toLocaleString()} / {total.toLocaleString()}
        </span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 999,
          background: "var(--jff-line-soft)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: accent,
            transition: "width .3s",
          }}
        />
      </div>
    </div>
  );
}
