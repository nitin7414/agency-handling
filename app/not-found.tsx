import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() { return <main className="flex min-h-screen items-center justify-center p-6"><section className="touch-card text-center"><h1 className="text-xl font-bold">Page not found</h1><Button asChild className="mt-4"><Link href="/dashboard">Go home</Link></Button></section></main>; }
