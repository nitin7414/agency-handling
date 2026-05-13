"use client";

import { SignOutButton } from "./sign-out-button";

export function MobileHeader({ title, subtitle, showLogout = false }: { title: string; subtitle?: string; showLogout?: boolean }) {
  return (
    <header className="relative w-full mb-8" style={{ paddingTop: "calc(1.5rem + env(safe-area-inset-top))" }}>
      {/* Phone-only Branding */}
      <div className="flex items-center justify-between sm:hidden mb-6 bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-black/5 dark:border-white/10 shadow-xl shadow-black/5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 dark:shadow-none overflow-hidden border border-black/5 dark:border-white/10">
            <img src="/logo.png" alt="Logo" className="h-full w-full object-contain p-1" />
          </div>
          <div>
            <p className="text-[18px] font-black uppercase tracking-[0.2em] leading-tight">
              <span className="text-green-600">Shri</span>
              <span className="text-red-600 ml-1">Shyam</span>
            </p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-center">Gas Agency</p>
          </div>
        </div>
        {showLogout && <SignOutButton />}
      </div>

      {/* Main Title Area - Matches Dashboard Proportions */}
      <div className="space-y-1">
        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tighter leading-none">{title}</h1>
        {subtitle && (
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] opacity-80">{subtitle}</p>
        )}
      </div>
    </header>
  );
}
