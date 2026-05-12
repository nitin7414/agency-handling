import { MobileHeader } from "@/components/mobile-header";
import { Gavel, Scale, FileWarning } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-600/15 via-background to-background">
      <MobileHeader title="Terms & Conditions" subtitle="Operating Guidelines" />
      
      <main className="px-6 pb-24 pt-6 space-y-8 max-w-2xl mx-auto">
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Gavel className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-black text-foreground">Usage Terms</h2>
          </div>
          
          <div className="prose prose-sm dark:prose-invert text-muted-foreground space-y-4 font-medium">
            <p>
              By accessing the Shri Shyam Gas Agency Management Portal, you agree to comply with the following operational terms.
            </p>
            
            <h3 className="text-foreground font-black text-sm uppercase tracking-wider">1. Authorized Use</h3>
            <p>
              This portal is for the exclusive use of authorized administrators and staff of Shri Shyam Gas Agency. 
              Sharing login credentials with unauthorized personnel is strictly prohibited.
            </p>

            <h3 className="text-foreground font-black text-sm uppercase tracking-wider">2. Data Accuracy</h3>
            <p>
              Administrators are responsible for ensuring that all records, including cylinder deliveries and payments, 
              are entered accurately. The system is a tool for record-keeping and its accuracy depends on manual input.
            </p>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4 items-start">
              <FileWarning className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase">Disclaimer</h4>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed italic">
                  Shri Shyam Gas Agency is not responsible for any financial discrepancies resulting from incorrect data entry by the user.
                </p>
              </div>
            </div>

            <h3 className="text-foreground font-black text-sm uppercase tracking-wider">3. System Availability</h3>
            <p>
              While we strive for 100% uptime through our hosting partners, the agency portal may occasionally be 
              unavailable for maintenance or due to internet connectivity issues.
            </p>

            <h3 className="text-foreground font-black text-sm uppercase tracking-wider">4. Modifications</h3>
            <p>
              The agency reserves the right to modify these terms or add new features to the portal at any time 
              to better serve operational needs.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
