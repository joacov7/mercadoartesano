"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Coffee, LogOut, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, getInitials } from "@/lib/utils";

interface SidebarProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    username?: string;
    rol?: string;
    logoUrl?: string;
  };
}

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/productos", label: "Mis productos", icon: Package },
  { href: "/dashboard/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/dashboard/estadisticas", label: "Estadísticas", icon: BarChart3 },
  { href: "/dashboard/perfil", label: "Mi Perfil", icon: UserCircle },
];

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-16 sm:w-56 flex flex-col bg-background border-r min-h-screen shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 p-4 border-b h-16">
        <Coffee className="h-6 w-6 text-primary shrink-0" />
        <span className="hidden sm:block font-bold text-sm text-primary truncate">MercadoArtesano</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:block">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-2 border-t">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-1">
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarImage src={user.logoUrl ?? ""} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {getInitials(user.name ?? user.username ?? "U")}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block min-w-0">
            <p className="text-xs font-medium truncate">{user.name ?? user.username}</p>
            <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="hidden sm:block">Salir</span>
        </button>
      </div>
    </aside>
  );
}
