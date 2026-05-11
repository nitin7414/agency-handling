import { SignOutButton } from "@/components/sign-out-button";

export function MobileHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-40 glass px-4 py-4 safe-top">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
            GasPro Agency
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">{title}</h1>
          {subtitle && (
            <p className="text-xs font-medium text-muted-foreground/80">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
           <SignOutButton />
        </div>
      </div>
    </header>
  );
}
