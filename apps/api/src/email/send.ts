// Resend HTTP client. Single-purpose: POST a transactional email. Returns
// resolved when the API accepts the request, throws on non-2xx so the caller
// (typically wrapped in waitUntil) can log failures.

export type SendEmailArgs = {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(args: SendEmailArgs): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: args.from,
      to: args.to,
      subject: args.subject,
      html: args.html,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '<no body>');
    throw new Error(`resend send failed (${res.status}): ${body}`);
  }
}
