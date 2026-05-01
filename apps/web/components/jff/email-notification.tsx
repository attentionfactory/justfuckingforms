// Email template for the per-submission notification email.
// Inline styles only — email clients don't support stylesheets or CSS variables.
// Phase 5's submission handler will render this to a string with renderToStaticMarkup
// and pass the result as Resend's `html` body.

export type EmailNotificationProps = {
  formName: string;
  toEmail: string;
  receivedAgo: string;
  fields: Array<[string, string]>;
  ip: string;
  ua: string;
  dashboardUrl: string;
  pauseUrl: string;
  changeEmailUrl: string;
  spamCheckPassed: boolean;
};

export function EmailNotification({
  formName,
  toEmail,
  receivedAgo,
  fields,
  ip,
  ua,
  dashboardUrl,
  pauseUrl,
  changeEmailUrl,
  spamCheckPassed,
}: EmailNotificationProps) {
  return (
    <div
      style={{
        minHeight: 820,
        background: "#f5f5f5",
        padding: 24,
        fontFamily: "Geist, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "#fff",
          border: "1px solid #e5e5e5",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {/* gmail-ish header */}
        <div style={{ padding: 20, borderBottom: "1px solid #f0f0f0" }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#0a0a0a",
              marginBottom: 12,
            }}
          >
            new submission · {formName}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                background: "#0a0a0a",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              J
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14 }}>
                <span style={{ color: "#0a0a0a", fontWeight: 600 }}>JFF</span>{" "}
                <span style={{ color: "#888" }}>&lt;notify@jff.dev&gt;</span>
              </div>
              <div style={{ color: "#888", fontSize: 13 }}>
                to {toEmail} · {receivedAgo}
              </div>
            </div>
          </div>
        </div>

        {/* body */}
        <div
          style={{
            padding: 24,
            fontSize: 15,
            lineHeight: 1.6,
            color: "#0a0a0a",
          }}
        >
          <p style={{ margin: "0 0 16px" }}>
            someone just filled out{" "}
            <strong style={{ color: "#0a0a0a", fontWeight: 600 }}>{formName}</strong>:
          </p>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 20,
            }}
          >
            <tbody>
              {fields.map(([k, v]) => (
                <tr key={k} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td
                    style={{
                      padding: "10px 12px 10px 0",
                      width: 110,
                      color: "#888",
                      fontSize: 13,
                      verticalAlign: "top",
                      fontFamily:
                        'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace',
                    }}
                  >
                    {k}
                  </td>
                  <td
                    style={{
                      padding: "10px 0",
                      color: "#0a0a0a",
                      fontSize: 14,
                    }}
                  >
                    {v}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <a
            href={dashboardUrl}
            style={{
              display: "inline-block",
              background: "#0a0a0a",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            view in dashboard →
          </a>

          <div
            style={{
              marginTop: 28,
              paddingTop: 16,
              borderTop: "1px solid #f0f0f0",
              fontSize: 12,
              color: "#a3a3a3",
            }}
          >
            <div>
              received from {ip} · {ua}
            </div>
            <div>
              spam check:{" "}
              {spamCheckPassed
                ? "passed (honeypot empty, rate ok)"
                : "flagged (review row in dashboard)"}
            </div>
            <div style={{ marginTop: 8 }}>
              don&apos;t want these?{" "}
              <a href={pauseUrl} style={{ color: "#888" }}>
                pause this form
              </a>{" "}
              ·{" "}
              <a href={changeEmailUrl} style={{ color: "#888" }}>
                change email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
