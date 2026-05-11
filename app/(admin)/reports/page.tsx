// reports/page.tsx
import { Download, Database, FileSpreadsheet, ShieldCheck, ArrowRight, Zap, Cloud } from "lucide-react";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <MobileHeader
        title="Reports"
        subtitle="Manage exports & infrastructure"
      />

      <main className="px-4 pb-24 pt-4 space-y-8">

        {/* Section: Export Data */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="h-1.5 w-1.5 rounded-full bg-primary" />
             <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Data Exports</h2>
          </div>
          
          <div className="space-y-4">
            {/* Customer Records Card */}
            <div className="glass-card rounded-[2rem] p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users className="h-20 w-20 text-primary" />
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <FileSpreadsheet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Customer Base</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">CSV Format</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Generate a complete ledger of all customers, including their current cylinder balances and pending dues.
              </p>
              
              <a href="/api/export/customers">
                <Button className="w-full h-12 rounded-xl bg-primary text-black font-black text-sm shadow-lg shadow-primary/10 touch-card">
                  <Download className="mr-2 h-4 w-4" /> Export Customers
                </Button>
              </a>
            </div>

            {/* Transaction Report Card */}
            <div className="glass-card rounded-[2rem] p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <History className="h-20 w-20 text-blue-500" />
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Transactions</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">History Log</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Export detailed transaction records, payments, and delivery logs for financial auditing.
              </p>
              
              <a href="/api/export/transactions">
                <Button variant="secondary" className="w-full h-12 rounded-xl bg-white/5 border border-white/5 text-white font-black text-sm touch-card">
                  <Download className="mr-2 h-4 w-4 text-primary" /> Export Transactions
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Section: Infrastructure */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
             <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Infrastructure</h2>
          </div>
          
          <div className="glass-card rounded-[2rem] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <Database className="h-6 w-6 text-emerald-500" />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Neon Cloud SQL</span>
              </div>
            </div>

            <h3 className="text-lg font-black text-white mb-2">Resilience & Backups</h3>
            <p className="text-xs text-muted-foreground mb-6">Database integrity and recovery guidelines.</p>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Cloud className="h-4 w-4 text-primary" />
                </div>
                <div>
                   <p className="text-xs font-bold text-white mb-1">Point-in-Time Restore</p>
                   <p className="text-[11px] text-muted-foreground leading-relaxed">Continuous backup coverage is active on your Neon dashboard.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                   <p className="text-xs font-bold text-white mb-1">Security Standards</p>
                   <p className="text-[11px] text-muted-foreground leading-relaxed">Your database URL is encrypted in the environment secrets manager.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Zap className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                   <p className="text-xs font-bold text-white mb-1">Branch Backups</p>
                   <p className="text-[11px] text-muted-foreground leading-relaxed">Set up scheduled daily restore points for maximum safety.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

// Helper icons for the page (since we're using them in standard cards)
function Users(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M23 7a4 4 0 0 0-4-4 4 4 0 0 0-3 1.37"/></svg> }
function History(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg> }