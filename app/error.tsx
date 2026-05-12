"use client";
import { Button } from "@/components/ui/button";
export default function Error({ reset }: { reset: () => void }) { 
  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-background">
      <section className="touch-card text-center p-8 rounded-[2rem] bg-white dark:bg-zinc-900 shadow-2xl border border-black/5 dark:border-white/10">
        <h1 className="text-2xl font-black text-foreground mb-4">Something went wrong</h1>
        <p className="mb-6 text-sm font-medium text-muted-foreground max-w-xs mx-auto">
          We encountered an unexpected error. Please try refreshing or contact support if the issue persists.
        </p>
        <Button 
          onClick={reset} 
          className="h-12 px-8 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform"
        >
          Try Again
        </Button>
      </section>
    </main>
  ); 
}
