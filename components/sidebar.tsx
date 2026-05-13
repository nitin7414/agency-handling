"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  BarChart3, 
  Settings, 
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "./sign-out-button";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: Receipt, label: "Transactions", href: "/transactions" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    // Changed: hidden sm:flex → hidden md:flex
    // This hides the sidebar on phones (< 768px) and shows it on tablets/laptops/desktops (≥ 768px)
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 z-[100] bg-white dark:bg-zinc-950 border-r border-black/5 dark:border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none">
      {/* Brand Header */}
      <div className="p-8">
        <div className="flex items-center gap-4 px-2 py-2">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
            <div className="relative w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center shadow-2xl shadow-black/5 border border-black/5 dark:border-white/10 overflow-hidden">
              <img src="/logo.png" alt="Logo" className="h-full w-full object-contain p-1" />
            </div>
          </div>
          <div>
            <p className="text-[14px] font-black uppercase tracking-[0.2em] leading-none mb-1">
              <span className="text-green-600">Shri</span>
              <span className="text-red-600 ml-1">Shyam</span>
            </p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Agency</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <div className="px-4 py-4">
           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-4">Main Menu</p>
           {menuItems.map((item) => {
             const Icon = item.icon;
             const isActive = pathname === item.href;
             return (
               <Link
                 key={item.href}
                 href={item.href}
                 className={cn(
                   "group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300",
                   isActive 
                     ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" 
                     : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
                 )}
               >
                 <div className="flex items-center gap-3">
                   <div className={cn(
                     "p-2 rounded-xl transition-colors duration-300",
                     isActive ? "bg-white/20" : "bg-primary/10 group-hover:bg-primary/20"
                   )}>
                     <Icon className="h-4.5 w-4.5" />
                   </div>
                   <span className="text-sm font-black tracking-wide uppercase">{item.label}</span>
                 </div>
                 {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
               </Link>
             );
           })}
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="p-6 mt-auto">
        <div className="rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/50 p-6 border border-black/5 dark:border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 h-16 w-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
          <div className="relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-foreground truncate">Admin Account</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">System Manager</p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>
    </aside>
  );
}