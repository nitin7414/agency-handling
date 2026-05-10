"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState(params.get("error") ?? "");
  const [loading, setLoading] = useState(false);
  async function onSubmit(formData: FormData) {
    setLoading(true); setError("");
    const result = await signIn("credentials", { email: formData.get("email"), password: formData.get("password"), redirect: false });
    setLoading(false);
    if (result?.error) setError("Invalid admin credentials"); else router.replace("/dashboard");
  }
  return <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-gradient-to-br from-teal-700 via-teal-600 to-amber-400 p-6"><section className="rounded-[2rem] bg-background/95 p-6 shadow-2xl"><div className="mb-8 flex items-center gap-3"><div className="rounded-3xl bg-primary p-3 text-primary-foreground"><Flame className="h-8 w-8" /></div><div><h1 className="text-2xl font-bold">GasPro Admin</h1><p className="text-sm text-muted-foreground">Secure agency operations console</p></div></div><form action={onSubmit} className="space-y-4"><Input name="email" type="email" placeholder="Admin email" autoComplete="email" required /><Input name="password" type="password" placeholder="Password" autoComplete="current-password" required />{error && <p className="rounded-2xl bg-destructive/10 p-3 text-sm font-medium text-destructive">{error}</p>}<Button disabled={loading} className="w-full" size="lg">{loading ? "Signing in..." : "Login securely"}</Button></form></section></main>;
}
