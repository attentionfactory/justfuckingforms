"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeleteFormDialog } from "./delete-form-dialog";
import { updateFormAction } from "@/app/dashboard/forms/actions";

type Props = {
  formId: string;
  initialName: string;
  initialNotificationEmail: string;
  initialRedirectUrl: string | null;
  initialHoneypotField: string;
  submissionCount: number;
};

export function FormSettings({
  formId,
  initialName,
  initialNotificationEmail,
  initialRedirectUrl,
  initialHoneypotField,
  submissionCount,
}: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [notificationEmail, setNotificationEmail] = useState(
    initialNotificationEmail,
  );
  const [redirectUrl, setRedirectUrl] = useState(initialRedirectUrl ?? "");
  const [honeypotField, setHoneypotField] = useState(initialHoneypotField);
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "saving" }
    | { kind: "saved" }
    | { kind: "error"; message: string }
  >({ kind: "idle" });
  const [pending, startTransition] = useTransition();

  const dirty =
    name !== initialName ||
    notificationEmail !== initialNotificationEmail ||
    redirectUrl !== (initialRedirectUrl ?? "") ||
    honeypotField !== initialHoneypotField;

  const save = () => {
    setState({ kind: "saving" });
    startTransition(async () => {
      const result = await updateFormAction(formId, {
        name: name.trim(),
        notificationEmail: notificationEmail.trim(),
        redirectUrl: redirectUrl.trim() || null,
        honeypotField: honeypotField.trim() || "website",
      });
      if (!result.ok) {
        setState({ kind: "error", message: result.error });
        return;
      }
      setState({ kind: "saved" });
      router.refresh();
      window.setTimeout(() => setState({ kind: "idle" }), 2000);
    });
  };

  return (
    <div
      className="card"
      style={{
        background: "#fff",
        border: "1px solid var(--jff-line)",
        borderRadius: 12,
        padding: 24,
        maxWidth: 560,
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <Label htmlFor="form-name">form name</Label>
        <Input
          id="form-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Label htmlFor="notif">notification email</Label>
        <Input
          id="notif"
          value={notificationEmail}
          onChange={(e) => setNotificationEmail(e.target.value)}
        />
        <div className="text-muted" style={{ fontSize: 13, marginTop: 6 }}>
          we&apos;ll send each submission to this address.
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Label htmlFor="redir">redirect after submit (optional)</Label>
        <Input
          id="redir"
          placeholder="https://yoursite.com/thanks"
          value={redirectUrl}
          onChange={(e) => setRedirectUrl(e.target.value)}
        />
        <div className="text-muted" style={{ fontSize: 13, marginTop: 6 }}>
          leave blank for our default thank-you page.
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <Label htmlFor="hp">honeypot field name</Label>
        <Input
          id="hp"
          className="font-mono"
          value={honeypotField}
          onChange={(e) => setHoneypotField(e.target.value)}
        />
        <div className="text-muted" style={{ fontSize: 13, marginTop: 6 }}>
          if a bot fills this hidden field, we mark the row spam.
        </div>
      </div>
      <div className="row between">
        <div className="row" style={{ gap: 8 }}>
          <Button onClick={save} disabled={!dirty || pending}>
            {state.kind === "saving" ? "saving…" : state.kind === "saved" ? "saved ✓" : "save"}
          </Button>
          {state.kind === "error" && (
            <span style={{ fontSize: 13, color: "var(--jff-spam-fg)" }}>
              {state.message}
            </span>
          )}
        </div>
        <DeleteFormDialog
          formId={formId}
          formName={initialName}
          submissionCount={submissionCount}
        />
      </div>
      <p className="text-muted" style={{ fontSize: 13, marginTop: 16 }}>
        also see{" "}
        <Link
          href={`/dashboard/forms/${formId}/settings/domains`}
          style={{ color: "var(--jff-link)" }}
        >
          allowed domains
        </Link>{" "}
        to lock down where this endpoint accepts submissions from.
      </p>
    </div>
  );
}
