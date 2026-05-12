"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { signUpAdmin } from "@/actions/auth-actions";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    
    const result = await signUpAdmin(formData);
    
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px]" />

      <section className="w-full max-w-sm z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex h-20 w-20 items-center justify-center mb-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Admin Signup</h1>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Create your management account</p>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-2xl shadow-black/10 p-8 space-y-6">
          {success ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in duration-500">
              <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="h-8 w-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold">Account Created!</h2>
              <p className="text-sm text-muted-foreground">Redirecting you to login...</p>
            </div>
          ) : (
            <form action={onSubmit} className="space-y-4">
              <div className="space-y-3">
                <div className="relative group">
                  <Input 
                    name="name" 
                    placeholder="Full Name" 
                    required 
                    className="h-12 bg-white/5 border-white/5 rounded-2xl pl-12 text-foreground placeholder:text-muted-foreground focus:border-primary/50 transition-all duration-300"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>

                <div className="relative group">
                  <Input 
                    name="email" 
                    type="email" 
                    placeholder="Admin Email" 
                    required 
                    className="h-12 bg-white/5 border-white/5 rounded-2xl pl-12 text-foreground placeholder:text-muted-foreground focus:border-primary/50 transition-all duration-300"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>

                <div className="relative group">
                  <Input 
                    name="password" 
                    type="password" 
                    placeholder="Create Password (min 8 chars)" 
                    required 
                    minLength={8}
                    className="h-12 bg-white/5 border-white/5 rounded-2xl pl-12 text-foreground placeholder:text-muted-foreground focus:border-primary/50 transition-all duration-300"
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
                className="w-full h-12 rounded-2xl bg-primary text-white font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 gap-2" 
              >
                {loading ? "Creating Account..." : "Create Account"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
