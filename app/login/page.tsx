"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Flame, Lock, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState(params.get("error") ?? "");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true); 
    setError("");
    const result = await signIn("credentials", { 
      email: formData.get("email"), 
      password: formData.get("password"), 
      redirect: false 
    });
    setLoading(false);
    if (result?.error) setError("Invalid admin credentials"); 
    else router.replace("/dashboard");
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]" />

      <section className="w-full max-w-sm z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex h-24 w-24 items-center justify-center mb-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">Shri Shyam Gas Agency</h1>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.3em] mt-1">Agency Management</p>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-2xl shadow-black/10 p-8 space-y-6">
          <div className="flex flex-col items-center gap-2 mb-4">
             <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
                <ShieldCheck className="h-3 w-3" /> Secure Access
             </div>
          </div>

          <form action={onSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="relative group">
                <Input 
                  name="email" 
                  type="email" 
                  placeholder="Admin Email" 
                  autoComplete="email" 
                  required 
                  className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 text-foreground placeholder:text-muted-foreground focus:border-primary/50 transition-all duration-300"
                />
                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>

              <div className="relative group">
                <Input 
                  name="password" 
                  type="password" 
                  placeholder="Password" 
                  autoComplete="current-password" 
                  required 
                  className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 text-foreground placeholder:text-muted-foreground focus:border-primary/50 transition-all duration-300"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 animate-in shake duration-500">
                <p className="text-xs font-bold text-destructive text-center">{error}</p>
              </div>
            )}

            <Button 
              disabled={loading} 
              className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300" 
              size="lg"
            >
              {loading ? "Authenticating..." : "Login Securely"}
            </Button>
          </form>
        </div>

        <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
           &copy; 2026 Shri Shyam Gas Agency Operations Console
        </p>
      </section>
    </main>
  );
}
