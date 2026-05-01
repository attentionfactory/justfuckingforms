"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

const TABS = ["overview", "submissions", "settings", "code"] as const;
export type FormTab = (typeof TABS)[number];

export function FormTabs() {
  const sp = useSearchParams();
  const pathname = usePathname();
  const active = (sp.get("tab") as FormTab) ?? "overview";

  return (
    <div
      className="row"
      style={{ borderBottom: "1px solid var(--jff-line)", gap: 0, marginBottom: 24 }}
    >
      {TABS.map((t) => {
        const isActive = active === t;
        const href = t === "overview" ? pathname : `${pathname}?tab=${t}`;
        return (
          <Link
            key={t}
            href={href}
            scroll={false}
            style={{
              padding: "10px 14px",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              color: isActive ? "var(--jff-fg)" : "var(--jff-muted)",
              borderBottom: `2px solid ${isActive ? "var(--jff-fg)" : "transparent"}`,
              marginBottom: -1,
              textDecoration: "none",
            }}
          >
            {t}
          </Link>
        );
      })}
    </div>
  );
}
