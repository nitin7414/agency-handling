"use client";
import { Button } from "@/components/ui/button";
export default function Error({ reset }: { reset: () => void }) { return <main className="flex min-h-screen items-center justify-center p-6"><section className="touch-card text-center"><h1 className="text-xl font-bold">Something went wrong</h1><p className="my-3 text-sm text-muted-foreground">Please retry. If this continues, check database connectivity.</p><Button onClick={reset}>Retry</Button></section></main>; }
