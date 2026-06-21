import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Coffee, LogOut, ChevronRight } from "lucide-react";
import { signOut } from "next-auth/react";
import { DashboardSidebar } from "./dashboard-sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar user={session.user as any} />
      <main className="flex-1 min-w-0 bg-muted/30">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
