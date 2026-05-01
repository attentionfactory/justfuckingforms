"use client";

import { useEffect, useRef, useState } from "react";
import {
  User,
  CreditCard,
  Settings,
  Zap,
  ExternalLink,
  AlertCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { CURRENT_USER } from "@/lib/mock-data";

type ItemProps = {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  hint?: string;
  danger?: boolean;
};

function MenuItem({ icon: Icon, label, hint, danger }: ItemProps) {
  return (
    <div
      className="row"
      style={{
        gap: 10,
        padding: "8px 10px",
        borderRadius: 6,
        cursor: "pointer",
        color: danger ? "var(--jff-danger)" : "var(--jff-fg)",
        fontSize: 13,
        fontWeight: 500,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--jff-chip)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <Icon size={14} />
      <span style={{ flex: 1 }}>{label}</span>
      {hint && (
        <span className="text-muted mono" style={{ fontSize: 11 }}>
          {hint}
        </span>
      )}
    </div>
  );
}

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(!open)}
        className="row"
        style={{
          gap: 10,
          padding: 6,
          borderRadius: 8,
          cursor: "pointer",
          background: open ? "var(--jff-line-soft)" : "transparent",
        }}
        onMouseEnter={(e) => {
          if (!open) e.currentTarget.style.background = "var(--jff-chip)";
        }}
        onMouseLeave={(e) => {
          if (!open) e.currentTarget.style.background = "transparent";
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            background: "var(--jff-fg)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {CURRENT_USER.initial}
        </div>
        <div style={{ flex: 1, lineHeight: 1.2, minWidth: 0 }}>
          <div style={{ color: "var(--jff-fg)", fontWeight: 600, fontSize: 13 }}>
            {CURRENT_USER.email.split("@")[0]}
          </div>
          <div style={{ fontSize: 11, color: "var(--jff-muted)" }}>{CURRENT_USER.plan}</div>
        </div>
        <ChevronDown size={14} color="#a3a3a3" />
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid var(--jff-line)",
            borderRadius: 10,
            boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
            padding: 6,
            zIndex: 20,
          }}
        >
          <div style={{ padding: "8px 10px 6px" }}>
            <div style={{ color: "var(--jff-fg)", fontWeight: 600, fontSize: 13 }}>
              {CURRENT_USER.email}
            </div>
            <div className="text-muted" style={{ fontSize: 11 }}>
              {CURRENT_USER.workspace} · {CURRENT_USER.plan}
            </div>
          </div>
          <div
            style={{ borderTop: "1px solid var(--jff-line-soft)", margin: "4px 0" }}
          />
          <MenuItem icon={User} label="Account" hint="⌘," />
          <MenuItem icon={CreditCard} label="Billing & usage" />
          <MenuItem icon={Settings} label="Workspace settings" />
          <div
            style={{ borderTop: "1px solid var(--jff-line-soft)", margin: "4px 0" }}
          />
          <MenuItem icon={Zap} label="Refer a dev, earn $3" hint="new" />
          <MenuItem icon={ExternalLink} label="Docs" />
          <MenuItem icon={AlertCircle} label="Report something broken" />
          <div
            style={{ borderTop: "1px solid var(--jff-line-soft)", margin: "4px 0" }}
          />
          <MenuItem icon={LogOut} label="Log out" danger />
        </div>
      )}
    </div>
  );
}
