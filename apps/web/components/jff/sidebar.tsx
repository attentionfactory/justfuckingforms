"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { File, Inbox, CreditCard, Settings, ExternalLink } from "lucide-react";
import { UserMenu } from "./user-menu";

type NavItem = {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  href: string;
};

const PRIMARY: NavItem[] = [
  { key: "forms", label: "Forms", icon: File, href: "/dashboard" },
  { key: "inbox", label: "Inbox", icon: Inbox, href: "/dashboard/inbox" },
  { key: "billing", label: "Billing", icon: CreditCard, href: "/dashboard/billing" },
  { key: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

const SECONDARY: NavItem[] = [
  { key: "docs", label: "Docs", icon: ExternalLink, href: "#" },
];

function isActive(pathname: string, item: NavItem) {
  if (item.key === "forms") {
    // /dashboard, /dashboard/forms/*, but NOT /dashboard/inbox or /dashboard/billing or /dashboard/settings
    return (
      pathname === "/dashboard" ||
      (pathname.startsWith("/dashboard/forms") && !pathname.startsWith("/dashboard/forms/new"))
    );
  }
  if (item.key === "inbox") return pathname.startsWith("/dashboard/inbox");
  if (item.key === "billing") return pathname.startsWith("/dashboard/billing");
  if (item.key === "settings") return pathname === "/dashboard/settings";
  return false;
}

export function Sidebar() {
  const pathname = usePathname();

  const renderItem = (item: NavItem) => {
    const Icon = item.icon;
    const active = isActive(pathname, item);
    return (
      <Link
        key={item.key}
        href={item.href}
        className={`sb-link ${active ? "active" : ""}`}
        style={{ textDecoration: "none" }}
      >
        <Icon size={15} />
        <span style={{ flex: 1 }}>{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="sb-aside">
      <div className="sb-brand">
        <span style={{ color: "var(--jff-fg)" }}>jff</span>
        <span style={{ color: "#a3a3a3" }}>.dev</span>
      </div>
      <div style={{ padding: "0 4px" }}>{PRIMARY.map(renderItem)}</div>
      <div className="sb-section">Account</div>
      <div style={{ padding: "0 4px" }}>{SECONDARY.map(renderItem)}</div>
      <div className="sb-foot" style={{ position: "relative" }}>
        <UserMenu />
      </div>
    </aside>
  );
}
