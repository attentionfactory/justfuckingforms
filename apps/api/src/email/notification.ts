// Notification email — server-rendered HTML string for Resend. Mirrors the
// React preview at apps/web /preview/email-notification.
//
// Inline styles only. Email clients don't support stylesheets, CSS variables,
// or modern selectors. Tested against Gmail web + iOS Mail.

export type NotificationEmailProps = {
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

export function renderNotificationEmail(p: NotificationEmailProps) {
  const fieldsRows = p.fields
    .map(
      ([k, v]) => `
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:10px 12px 10px 0;width:110px;color:#888;font-size:13px;vertical-align:top;font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace">${escapeHtml(k)}</td>
        <td style="padding:10px 0;color:#0a0a0a;font-size:14px">${escapeHtml(v)}</td>
      </tr>`,
    )
    .join('');

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f5f5f5;font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0a0a0a">
  <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden">
    <div style="padding:20px;border-bottom:1px solid #f0f0f0">
      <div style="font-size:20px;font-weight:600;color:#0a0a0a;margin-bottom:12px">new submission · ${escapeHtml(p.formName)}</div>
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:36px;height:36px;border-radius:999px;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600">J</div>
        <div style="flex:1">
          <div style="font-size:14px"><span style="color:#0a0a0a;font-weight:600">JFF</span> <span style="color:#888">&lt;notify@jff.dev&gt;</span></div>
          <div style="color:#888;font-size:13px">to ${escapeHtml(p.toEmail)} · ${escapeHtml(p.receivedAgo)}</div>
        </div>
      </div>
    </div>
    <div style="padding:24px;font-size:15px;line-height:1.6;color:#0a0a0a">
      <p style="margin:0 0 16px">someone just filled out <strong style="color:#0a0a0a;font-weight:600">${escapeHtml(p.formName)}</strong>:</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <tbody>${fieldsRows}</tbody>
      </table>
      <a href="${escapeAttr(p.dashboardUrl)}" style="display:inline-block;background:#0a0a0a;color:#fff;padding:10px 16px;border-radius:6px;font-size:14px;font-weight:600;text-decoration:none">view in dashboard →</a>
      <div style="margin-top:28px;padding-top:16px;border-top:1px solid #f0f0f0;font-size:12px;color:#a3a3a3">
        <div>received from ${escapeHtml(p.ip)} · ${escapeHtml(p.ua)}</div>
        <div>spam check: ${p.spamCheckPassed ? 'passed (honeypot empty, rate ok)' : 'flagged (review row in dashboard)'}</div>
        <div style="margin-top:8px">
          don&apos;t want these? <a href="${escapeAttr(p.pauseUrl)}" style="color:#888">pause this form</a> · <a href="${escapeAttr(p.changeEmailUrl)}" style="color:#888">change email</a>
        </div>
      </div>
    </div>
  </div>
</body></html>`;
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(s: string) {
  return escapeHtml(s);
}
