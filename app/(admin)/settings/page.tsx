import { MobileHeader } from "@/components/mobile-header";
import { SignOutButton } from "@/components/sign-out-button";
import { Smartphone, Moon, Shield, Info, ExternalLink } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <MobileHeader title="Settings" subtitle="System & preferences" />
      
      <main className="px-4 pb-24 pt-4 space-y-6">
        
        {/* Section: Application */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="h-1.5 w-1.5 rounded-full bg-primary" />
             <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Application</h2>
          </div>
          
          <div className="space-y-3">
            <div className="glass-card rounded-3xl p-5 flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Smartphone className="h-6 w-6 text-primary" />
               </div>
               <div>
                  <h3 className="text-sm font-black text-white">Mobile PWA</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Install GasPro as a native-like app via your browser's home screen.</p>
               </div>
            </div>

            <div className="glass-card rounded-3xl p-5 flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Moon className="h-6 w-6 text-blue-500" />
               </div>
               <div>
                  <h3 className="text-sm font-black text-white">Visual Theme</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Dark mode is enabled by default for maximum power efficiency.</p>
               </div>
            </div>
          </div>
        </section>

        {/* Section: Security */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
             <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Security</h2>
          </div>
          
          <div className="glass-card rounded-3xl p-5 flex items-center gap-4">
             <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 text-emerald-500" />
             </div>
             <div>
                <h3 className="text-sm font-black text-white">Session Security</h3>
                <p className="text-xs text-muted-foreground mt-0.5">All sessions are encrypted and managed via secure JWT tokens.</p>
             </div>
          </div>
        </section>

        {/* Section: About */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="h-1.5 w-1.5 rounded-full bg-slate-500" />
             <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">About</h2>
          </div>
          
          <div className="glass-card rounded-3xl p-5 space-y-4">
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                   <Info className="h-6 w-6 text-slate-400" />
                </div>
                <div>
                   <h3 className="text-sm font-black text-white">GasPro Agency v2.0</h3>
                   <p className="text-xs text-muted-foreground mt-0.5">Advanced Gas Agency Management System</p>
                </div>
             </div>
             
             <div className="pt-2 border-t border-white/5">
                <button className="w-full py-3 flex items-center justify-between text-xs font-bold text-slate-400 hover:text-white transition-colors">
                   <span>View Documentation</span>
                   <ExternalLink className="h-3 w-3" />
                </button>
             </div>
          </div>
        </section>

        <div className="pt-4">
           <SignOutButton label="Terminate Session" />
        </div>
      </main>
    </div>
  );
}
