"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import {
  BarChart3,
  FileText,
  Home,
  Link2,
  PlayCircle,
  Settings,
  Users,
  Sparkles,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Workflow'lar", href: "/workflows", icon: PlayCircle },
  { name: "Markalar", href: "/brands", icon: Users },
  { name: "Bağlantılar", href: "/connections", icon: Link2 },
  { name: "Raporlar", href: "/reports", icon: FileText },
  { name: "AI Asistan", href: "/ai", icon: Sparkles },
];

const bottomNavigation = [
  { name: "Ayarlar", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-lg font-bold text-primary-foreground">M</span>
        </div>
        <span className="text-xl font-bold">MarkaRapor</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname.includes(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t p-4">
        {bottomNavigation.map((item) => {
          const isActive = pathname.includes(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Credits Card */}
      <div className="m-4 rounded-lg bg-primary/5 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Kalan Kredi</span>
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <p className="mt-1 text-2xl font-bold">50</p>
        <p className="text-xs text-muted-foreground">Free Plan</p>
      </div>
    </div>
  );
}
