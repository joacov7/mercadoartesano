"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, LayoutDashboard, Users, FileText, Home, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Panel Admin", icon: LayoutDashboard, exact: true },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/reportes", label: "Reportes", icon: FileText },
  { href: "/dashboard", label: "Mi Dashboard", icon: Home },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-16 sm:w-56 flex flex-col bg-background border-r min-h-screen shrink-0">
      <div className="flex items-center gap-2 p-4 border-b h-16 bg-primary/5">
        <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
        <span className="hidden sm:block font-bold text-sm text-primary truncate">Admin Panel</span>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:block">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
