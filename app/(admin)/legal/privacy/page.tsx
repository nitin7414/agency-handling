import { MobileHeader } from "@/components/mobile-header";
import { ScrollText, ShieldCheck, Lock } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/15 via-background to-background">
      <MobileHeader title="Privacy Policy" subtitle="Last updated: May 2026" />
      
      <main className="px-6 pb-24 pt-6 space-y-8 max-w-2xl mx-auto">
        <section className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-black text-foreground">Data Protection</h2>
          </div>
          
          <div className="prose prose-sm dark:prose-invert text-muted-foreground space-y-4 font-medium">
            <p>
              Shri Shyam Gas Agency ("we," "us," or "our") is committed to protecting the privacy of our customer records. 
              This policy explains how we handle the information recorded within this Agency Management application.
            </p>
            
            <h3 className="text-foreground font-black text-sm uppercase tracking-wider">1. Information We Collect</h3>
            <p>
              We record essential customer data required for agency operations, including:
              Names, Phone Numbers, Delivery Addresses, and transaction history (Cylinder balances and payments).
            </p>

            <h3 className="text-foreground font-black text-sm uppercase tracking-wider">2. How We Use Data</h3>
            <p>
              The information is used strictly for:
              Managing cylinder inventory, tracking customer balances, and generating operational reports. 
              We do not sell or share this data with any third-party marketing services.
            </p>

            <h3 className="text-foreground font-black text-sm uppercase tracking-wider">3. Data Security</h3>
            <div className="p-4 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-black/5 dark:border-white/10 flex gap-4 items-start">
              <Lock className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs italic leading-relaxed">
                All data is stored in a secure, encrypted cloud database (Neon) and is only accessible by authorized agency administrators through encrypted sessions.
              </p>
            </div>

            <h3 className="text-foreground font-black text-sm uppercase tracking-wider">4. Contact Us</h3>
            <p>
              If you have any questions regarding data privacy, please contact the agency administration directly.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
