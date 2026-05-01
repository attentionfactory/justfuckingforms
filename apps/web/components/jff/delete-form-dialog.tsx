"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  formName: string;
  submissionCount: number;
  trigger?: React.ReactNode;
};

export function DeleteFormDialog({ formName, submissionCount, trigger }: Props) {
  const [confirmText, setConfirmText] = useState("");
  const [open, setOpen] = useState(false);
  const canDelete = confirmText.trim() === formName;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setConfirmText("");
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
        </div>

        <div className="row" style={{ justifyContent: "flex-end", gap: 8 }}>
          <Button variant="outline" onClick={() => setOpen(false)}>
            cancel
          </Button>
          <Button
            disabled={!canDelete}
            style={
              canDelete ? { background: "#b91c1c", color: "#fff" } : undefined
            }
            // TODO Phase 6: call DELETE /api/forms/:id, redirect /dashboard
          >
            delete form
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
