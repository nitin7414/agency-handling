"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardList, Home, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "More", icon: Settings }
];

export function BottomNav() {
  const pathname = usePathname();
  return <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md border-t bg-card/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur"><div className="grid grid-cols-5 gap-1">{items.map((item) => { const Icon = item.icon; const active = pathname.startsWith(item.href); return <Link key={item.href} href={item.href} className={cn("flex min-h-14 flex-col items-center justify-center rounded-2xl text-xs font-medium text-muted-foreground", active && "bg-primary/10 text-primary")}><Icon className="h-5 w-5" /><span>{item.label}</span></Link>; })}</div></nav>;
}
