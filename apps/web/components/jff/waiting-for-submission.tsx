import { CodeBlock } from "./embed-snippet";

export function WaitingForFirstSubmission({ formId }: { formId: string }) {
  return (
    <div
      className="card"
      style={{
        background: "#fff",
        border: "1px solid var(--jff-line)",
        borderRadius: 12,
        padding: 32,
        textAlign: "center",
      }}
    >
      <div className="row" style={{ justifyContent: "center", gap: 6, marginBottom: 16 }}>
        <span
          className="dot"
          style={{
            background: "var(--jff-good)",
            width: 8,
            height: 8,
            animation: "jff-pulse 1.6s infinite",
          }}
        />
        <span
          className="dot"
          style={{
            background: "var(--jff-good)",
            opacity: 0.5,
            width: 8,
            height: 8,
            animation: "jff-pulse 1.6s infinite .2s",
          }}
        />
        <span
          className="dot"
          style={{
            background: "var(--jff-good)",
            opacity: 0.2,
            width: 8,
            height: 8,
            animation: "jff-pulse 1.6s infinite .4s",
          }}
        />
      </div>
      <h2
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "var(--jff-fg)",
          letterSpacing: "-0.03em",
          margin: "0 0 8px",
        }}
      >
        waiting for your first submission.
      </h2>
      <p className="text-muted" style={{ fontSize: 15, maxWidth: 480, margin: "0 auto 20px" }}>
        the table below will shape itself around whatever{" "}
        <span className="mono text-fg" style={{ fontSize: 13 }}>
          name=
        </span>{" "}
        attributes your html form has. no schema to define.
      </p>
      <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "left" }}>
        <div
          className="text-muted mono"
          style={{
            fontSize: 11,
            letterSpacing: ".06em",
            marginBottom: 6,
            textTransform: "uppercase",
          }}
        >
          or send a test:
        </div>
        <CodeBlock>
          {`curl -X POST https://jff.dev/f/${formId} \\\n  -d "email=test@you.com" \\\n  -d "message=hello"`}
        </CodeBlock>
      </div>
    </div>
  );
}
