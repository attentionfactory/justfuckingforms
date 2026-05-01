import { EmailNotification } from "@/components/jff/email-notification";

// Visual preview of the per-submission notification email.
// In Phase 5 the submission handler renders <EmailNotification /> to an HTML string
// and passes it to Resend; this preview is just for tweaking the template visually.

export default function EmailNotificationPreviewPage() {
  return (
    <EmailNotification
      formName="transcriptx contact"
      toEmail="mercy@transcriptx.xyz"
      receivedAgo="2 minutes ago"
      fields={[
        ["email", "jen@stripe.com"],
        ["name", "Jen Simmons"],
        ["company", "Stripe"],
        [
          "message",
          "hey, would love to chat about a partnership. ping me when you have a minute.",
        ],
      ]}
      ip="197.210.226.43"
      ua="Mac Safari"
      dashboardUrl="https://justfuckingforms.com/dashboard/forms/a3f9k2x"
      pauseUrl="https://justfuckingforms.com/dashboard/forms/a3f9k2x?tab=settings"
      changeEmailUrl="https://justfuckingforms.com/dashboard/forms/a3f9k2x?tab=settings"
      spamCheckPassed
    />
  );
}
