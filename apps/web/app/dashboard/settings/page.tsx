"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CURRENT_USER } from "@/lib/mock-data";

const NOTIFS = [
  ["every", "every submission", "one email per submission. the default."],
  ["daily", "daily digest", "one email per day with all submissions."],
  ["weekly", "weekly digest", "one email per week."],
  ["none", "nothing", "just store them. check the dashboard."],
] as const;

export default function AccountSettingsPage() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [notif, setNotif] = useState<string>("every");

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="crumb">workspace / account</div>
      <h1 style={{ marginBottom: 24 }}>account</h1>

      <div
        className="card"
        style={{
          background: "#fff",
          border: "1px solid var(--jff-line)",
          borderRadius: 12,
          padding: 24,
          marginBottom: 16,
        }}
      >
        <Label htmlFor="email">email</Label>
        <Input id="email" defaultValue={CURRENT_USER.email} />
        <div className="text-muted" style={{ fontSize: 13, marginTop: 6 }}>
          we&apos;ll send a magic link to confirm if you change this.
        </div>
      </div>

      <div
        className="card"
        style={{
          background: "#fff",
          border: "1px solid var(--jff-line)",
          borderRadius: 12,
          padding: 24,
          marginBottom: 16,
        }}
      >
        <Label style={{ marginBottom: 12 }}>notification preferences</Label>
        {NOTIFS.map(([k, n, d]) => (
          <label
            key={k}
            className="row"
            style={{
              gap: 12,
              padding: "10px 0",
              cursor: "pointer",
              borderTop: "1px solid var(--jff-line-soft)",
            }}
          >
            <input
              type="radio"
              name="notif"
              checked={notif === k}
              onChange={() => setNotif(k)}
              style={{ accentColor: "var(--jff-fg)", marginTop: 2 }}
            />
            <div style={{ flex: 1 }}>
              <div className="text-fg" style={{ fontWeight: 500, fontSize: 14 }}>
                {n}
              </div>
              <div className="text-muted" style={{ fontSize: 13 }}>
                {d}
              </div>
            </div>
          </label>
        ))}
      </div>

      <div
        className="card"
        style={{
          background: "#fff",
          border: "1px solid var(--jff-line)",
          borderRadius: 12,
          padding: 24,
          marginBottom: 16,
        }}
      >
        <Label htmlFor="api-token">api token</Label>
        <div className="row" style={{ gap: 8 }}>
          <Input
            id="api-token"
            className="font-mono"
            readOnly
            value={revealed ? "jff_live_8k4Hxp0v9w2eN3qZ" : "jff_•••••••••••••••••••••"}
          />
          <Button variant="outline" onClick={() => setRevealed(!revealed)}>
            {revealed ? "hide" : "reveal"}
          </Button>
          <Button variant="outline">rotate</Button>
        </div>
        <div className="text-muted" style={{ fontSize: 13, marginTop: 6 }}>
          for programmatically creating forms. you almost certainly don&apos;t need this.
        </div>
      </div>

      <div
        className="card"
        style={{
          background: "#fff",
          border: "1px solid #fecaca",
          borderRadius: 12,
          padding: 24,
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: 14,
            marginBottom: 4,
            color: "#b91c1c",
          }}
        >
          delete account
        </div>
        <div className="text-muted" style={{ fontSize: 13, marginBottom: 12 }}>
          deletes every form, every submission, and your billing. there&apos;s no undo. we don&apos;t keep backups out of spite.
        </div>
        {!confirmDelete ? (
          <Button
            variant="outline"
            style={{ color: "#b91c1c", borderColor: "#fecaca" }}
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 size={14} /> delete my account
          </Button>
        ) : (
          <div className="row" style={{ gap: 8 }}>
            <Input
              placeholder='type "delete" to confirm'
              style={{ flex: 1 }}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoFocus
            />
            <Button
              style={{ background: "#b91c1c", color: "#fff" }}
              disabled={confirmText.trim().toLowerCase() !== "delete"}
            >
              permanently delete
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setConfirmDelete(false);
                setConfirmText("");
              }}
            >
              cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
