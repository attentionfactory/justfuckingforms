import { Sidebar } from "@/components/jff/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sb-shell">
      <Sidebar />
      <main className="main">{children}</main>
    </div>
  );
}
