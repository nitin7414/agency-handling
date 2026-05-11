import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-lg min-h-screen relative flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        {children}
        <div className="h-16" /> {/* Spacing for BottomNav */}
        <BottomNav />
      </div>
    </div>
  );
}
