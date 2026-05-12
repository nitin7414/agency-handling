import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MobileHeader } from "@/components/mobile-header";
import { SignOutButton } from "@/components/sign-out-button";
import { UserForm } from "@/components/user-form";
import { Shield } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const admin = await prisma.admin.findUnique({
    where: { email: session?.user?.email || "" }
  });

  if (!admin) {
    return <div>User not found</div>;
  }

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/15 via-background to-background">
      <MobileHeader title="" subtitle="Manage your account" showLogout={true} />
      
      <main className="px-4 pb-24 pt-4 space-y-8">
        
        {/* Section: Profile Details */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <div className="h-1.5 w-1.5 rounded-full bg-primary" />
             <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">My Account</h2>
          </div>
          
          <div className="rounded-[2.5rem] bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 p-6 sm:p-8">
            <UserForm user={{ name: admin.name, email: admin.email }} />
          </div>
        </section>

        {/* Section: Security Info */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
             <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Security</h2>
          </div>
          
          <div className="rounded-[2.5rem] bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 p-5 flex items-center gap-4">
             <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 text-emerald-500" />
             </div>
             <div>
                <h3 className="text-sm font-black text-foreground">Session Protection</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Your session is secure and encrypted with industry-standard protocols.</p>
             </div>
          </div>
        </section>

        <div className="pt-4 px-2">
           <SignOutButton label="Terminate Session" />
        </div>
      </main>
    </div>
  );
}

