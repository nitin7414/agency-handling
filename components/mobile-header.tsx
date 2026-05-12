import { SignOutButton } from "@/components/sign-out-button";

import { Flame } from "lucide-react";

export function MobileHeader({ title, subtitle, showLogout = false }: { title: string; subtitle?: string; showLogout?: boolean }) {
  return (
    <header className="relative bg-white dark:bg-zinc-950 border-b border-black/5 dark:border-white/10 px-4 pb-6 space-y-4" style={{ paddingTop: "calc(1.5rem + env(safe-area-inset-top))" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 dark:shadow-none overflow-hidden">
            <img src="/logo.png" alt="Shri Shyam Gas Agency Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="text-[20px] font-black uppercase tracking-[0.2em]">
  <span className="text-green-600">Shri Shyam</span>
  <span className="text-red-600"> Gas Agency</span>
</p>
            <h1 className="text-xl font-black text-primary leading-none">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">

          {showLogout && <SignOutButton />}
        </div>
      </div>
      {subtitle && (
        <p className="text-sm font-bold text-muted-foreground/80 px-1">{subtitle}</p>
      )}
    </header>
  );
}
