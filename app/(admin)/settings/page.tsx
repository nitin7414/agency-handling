import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MobileHeader } from "@/components/mobile-header";
import { SignOutButton } from "@/components/sign-out-button";
import { UserForm } from "@/components/user-form";
import { Shield, FileText } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  const admin = await prisma.admin.findUnique({
    where: { id: (session.user as any).id }
  });

  if (!admin) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/15 via-background to-background">
      <MobileHeader title="" subtitle="Manage your account" showLogout={true} />
      
      <main className="px-4 pb-24 pt-4 sm:px-0 space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Profile */}
          <div className="space-y-8">
            {/* Section: Profile Details */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                 <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">My Account</h2>
              </div>
              
              <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 p-8 sm:p-10">
                <UserForm user={{ name: admin.name, email: admin.email }} />
              </div>
            </section>
          </div>

          {/* Right Column: Security & Legal */}
          <div className="space-y-8">
            {/* Section: Security Info */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                 <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Security</h2>
              </div>
              
              <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 p-6 flex items-center gap-4">
                 <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Shield className="h-7 w-7 text-emerald-500" />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-foreground">Session Protection</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Your session is secure and encrypted with industry-standard protocols.</p>
                 </div>
              </div>
            </section>

            {/* Section: Legal & Info */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                 <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Legal & Info</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <a href="/legal/privacy" className="flex items-center justify-center gap-3 py-5 rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 text-[11px] font-bold text-muted-foreground hover:bg-zinc-100 dark:hover:bg-white/5 transition-all">
                    <Shield className="h-4 w-4" />
                    Privacy Policy
                 </a>
                 <a href="/legal/terms" className="flex items-center justify-center gap-3 py-5 rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 text-[11px] font-bold text-muted-foreground hover:bg-zinc-100 dark:hover:bg-white/5 transition-all">
                    <FileText className="h-4 w-4" />
                    Terms of Use
                 </a>
              </div>
              
              <div className="pt-8">
                 <SignOutButton label="Terminate Session" />
              </div>

              <p className="text-center text-[10px] font-medium text-zinc-400 pt-8 uppercase tracking-widest">
                Shri Shyam Gas Agency Management Portal<br/>
                v1.0.4 • © 2026 All Rights Reserved
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

