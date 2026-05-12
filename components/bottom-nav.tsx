"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardList, Home, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/reports", label: "Stats", icon: BarChart3 },
  { href: "/settings", label: "More", icon: Settings }
];


export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 bg-white border-t border-black/5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="grid grid-cols-4 h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-300",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-300",
                active && "bg-primary/10 shadow-[0_0_20px_var(--color-primary)]/10"
              )}>
                <Icon className={cn("h-5 w-5", active ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
              </div>
              <span className={cn(
                "text-[10px] font-bold tracking-tight",
                active ? "opacity-100" : "opacity-60"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
