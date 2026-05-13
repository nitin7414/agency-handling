// reports/page.tsx
import { Download, Database, FileSpreadsheet, ShieldCheck, ArrowRight, Zap, Cloud } from "lucide-react";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-600/15 via-background to-background">
      <MobileHeader
        title=""
        subtitle="Manage exports & infrastructure"
      />

      <main className="px-4 pb-24 pt-4 sm:px-0 space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
          {/* Section: Export Data */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-primary" />
               <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Data Exports</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Customer Records Card */}
              <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Users className="h-24 w-24 text-primary" />
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <FileSpreadsheet className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground">Customer Base</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">CSV Format</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                  Generate a complete ledger of all customers, including their current cylinder balances and pending dues.
                </p>
                
                <a href="/api/export/customers">
                  <Button className="w-full h-12 rounded-xl bg-primary text-black font-black text-sm shadow-lg shadow-primary/20 touch-card">
                    <Download className="mr-2 h-4 w-4" /> Export Customers
                  </Button>
                </a>
              </div>

              {/* Transaction Report Card */}
              <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <History className="h-24 w-24 text-blue-500" />
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                    <ArrowRight className="h-7 w-7 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground">Transactions</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">History Log</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                  Export detailed transaction records, payments, and delivery logs for financial auditing.
                </p>
                
                <a href="/api/export/transactions">
                  <Button variant="secondary" className="w-full h-12 rounded-xl bg-muted/50 border-border/10 text-foreground font-black text-sm touch-card">
                    <Download className="mr-2 h-4 w-4 text-primary" /> Export Transactions
                  </Button>
                </a>
              </div>
            </div>
          </section>

          {/* Section: Infrastructure */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
               <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Infrastructure</h2>
            </div>
            
            <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Database className="h-7 w-7 text-primary" />
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Neon Cloud SQL</span>
                </div>
              </div>

              <h3 className="text-xl font-black text-foreground mb-2">Resilience & Backups</h3>
              <p className="text-xs text-muted-foreground mb-8">Database integrity and recovery guidelines.</p>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex gap-4 p-5 rounded-2xl bg-muted/50 border-border/10">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Cloud className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                     <p className="text-sm font-bold text-foreground mb-1">Point-in-Time Restore</p>
                     <p className="text-xs text-muted-foreground leading-relaxed">Continuous backup coverage is active on your Neon dashboard.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 rounded-2xl bg-muted/50 border-border/10">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                     <p className="text-sm font-bold text-foreground mb-1">Security Standards</p>
                     <p className="text-xs text-muted-foreground leading-relaxed">Your database URL is encrypted in the environment secrets manager.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 rounded-2xl bg-muted/50 border-border/10">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Zap className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                     <p className="text-sm font-bold text-foreground mb-1">Branch Backups</p>
                     <p className="text-xs text-muted-foreground leading-relaxed">Set up scheduled daily restore points for maximum safety.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// Helper icons for the page (since we're using them in standard cards)
function Users(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M23 7a4 4 0 0 0-4-4 4 4 0 0 0-3 1.37"/></svg> }
function History(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg> }
