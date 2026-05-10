import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return <div className="mobile-shell">{children}<BottomNav /></div>;
}
