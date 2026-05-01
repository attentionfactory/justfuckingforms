"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteFormAction } from "@/app/dashboard/forms/actions";

type Props = {
  formId: string;
  formName: string;
  submissionCount: number;
  trigger?: React.ReactNode;
};

export function DeleteFormDialog({
  formId,
  formName,
  submissionCount,
  trigger,
}: Props) {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const canDelete = confirmText.trim() === formName;

  const onDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteFormAction(formId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setOpen(false);
      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setConfirmText("");
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" style={{ color: "var(--jff-danger)" }}>
            <Trash2 size={14} /> delete form
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        style={{ width: 480, maxWidth: "calc(100vw - 32px)", padding: 24 }}
      >
        <div className="row" style={{ gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "var(--jff-spam-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Trash2 size={18} color="#b91c1c" />
          </div>
          <div>
            <div
              className="text-fg"
              style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}
            >
              delete this form?
            </div>
            <div className="text-muted" style={{ fontSize: 14, lineHeight: 1.5 }}>
              this deletes{" "}
              <span className="text-fg" style={{ fontWeight: 600 }}>
                {formName}
              </span>{" "}
              and all{" "}
              <span className="text-fg" style={{ fontWeight: 600 }}>
                {submissionCount} submissions
              </span>
              . the endpoint will start returning 404 immediately.
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--jff-bg-alt)",
            border: "1px solid var(--jff-line)",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
        >
          <Label htmlFor="confirm" style={{ fontSize: 12, marginBottom: 4 }}>
            type the form name to confirm
          </Label>
          <Input
            id="confirm"
            className="font-mono"
            placeholder={formName}
            autoFocus
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
          {error && (
            <p style={{ fontSize: 13, color: "var(--jff-spam-fg)", margin: "8px 0 0" }}>
              {error}
            </p>
          )}
        </div>

        <div className="row" style={{ justifyContent: "flex-end", gap: 8 }}>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            cancel
          </Button>
          <Button
            onClick={onDelete}
            disabled={!canDelete || pending}
            style={
              canDelete && !pending
                ? { background: "#b91c1c", color: "#fff" }
                : undefined
            }
          >
            {pending ? "deleting…" : "delete form"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
