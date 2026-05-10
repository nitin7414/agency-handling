import { SignOutButton } from "@/components/sign-out-button";

export function MobileHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return <header className="sticky top-0 z-40 bg-background/95 px-4 py-4 backdrop-blur"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-primary">GasPro Agency</p><h1 className="text-2xl font-bold">{title}</h1>{subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}</div><SignOutButton /></div></header>;
}
