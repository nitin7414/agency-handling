import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { Sidebar } from "@/components/sidebar";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-background flex overflow-x-hidden">
      {/* Permanent Sidebar — visible on md (768px) and above */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen md:pl-64 transition-all duration-300">
        <div className="flex-1 w-full max-w-[1600px] mx-auto relative flex flex-col px-4 md:px-10 py-6 md:py-10 bg-background min-h-screen">
          {children}

          {/* Spacer so content isn't hidden behind bottom nav on mobile */}
          <div className="h-20 md:hidden" />
          <BottomNav />
        </div>
      </main>
    </div>
  );
}