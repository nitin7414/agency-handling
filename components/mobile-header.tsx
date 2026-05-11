import { SignOutButton } from "@/components/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Flame } from "lucide-react";

export function MobileHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="px-4 pt-6 pb-2 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/20">
            <Flame className="h-7 w-7 text-white fill-white/20" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">GasPro</p>
            <h1 className="text-xl font-black text-primary leading-none">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>
      {subtitle && (
        <p className="text-sm font-bold text-muted-foreground/80 px-1">{subtitle}</p>
      )}
    </header>
  );
}
