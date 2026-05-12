// dashboard/page.tsx
import Link from "next/link";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { 
  CalendarClock, IndianRupee, PackageCheck, Plus, Users, 
  Flame, TrendingUp, ArrowRight, Bell, Zap, Cylinder 
} from "lucide-react";
import { MobileHeader } from "@/components/mobile-header";
import { Badge } from "@/components/ui/badge";
import { CylinderChart } from "@/components/analytics-charts";
import { dayRange, monthRange, yearRange } from "@/lib/dates";
import { money } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "./dashboard-header";
import { DashboardActions } from "./dashboard-actions";
import { NewSaleDialog } from "@/components/new-sale-dialog";

async function getDashboardData() {
  const today = dayRange(); 
  const month = monthRange(); 
  const year = yearRange();
  
  const [
    dailyRevenue, 
    monthlyRevenue, 
    yearlyRevenue, 
    dailyTx, 
    monthlyTx, 
    yearlyTx, 
    pendingPayments, 
    customersCount, 
    recentTransactions,
    allCustomers
  ] = await Promise.all([
    prisma.revenueRecord.aggregate({ _sum: { amount: true }, where: { recordedAt: { gte: today.start, lt: today.end } } }),
    prisma.revenueRecord.aggregate({ _sum: { amount: true }, where: { recordedAt: { gte: month.start, lt: month.end } } }),
    prisma.revenueRecord.aggregate({ _sum: { amount: true }, where: { recordedAt: { gte: year.start, lt: year.end } } }),
    prisma.transaction.aggregate({ _sum: { filledCylindersDelivered: true, emptyCylindersReceived: true, paymentAmount: true }, where: { deliveryDate: { gte: today.start, lt: today.end }, paymentStatus: "Done" } }),
    prisma.transaction.aggregate({ _sum: { filledCylindersDelivered: true, paymentAmount: true }, where: { deliveryDate: { gte: month.start, lt: month.end }, paymentStatus: "Done" } }),
    prisma.transaction.aggregate({ _sum: { filledCylindersDelivered: true, paymentAmount: true }, where: { deliveryDate: { gte: year.start, lt: year.end }, paymentStatus: "Done" } }),
    prisma.transaction.count({ where: { paymentStatus: "Pending" } }),
    prisma.customer.count({ where: { isActive: true } }),
    prisma.transaction.findMany({ include: { customer: true }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.customer.findMany({ 
      select: { 
        id: true, 
        fullName: true, 
        totalCylindersReceived: true, 
        totalEmptyCylindersReturned: true, 
        totalPendingPayment: true, 
        area: true,
        fullAddress: true,
        phoneNumber: true,
        notes: true,
        aadharUrl: true,
        panUrl: true,
        foodLicenseUrl: true,
        gstProofUrl: true
      }, 
      where: { isActive: true }, 
      orderBy: { fullName: 'asc' } 
    })
  ]);


  // Monthly cylinder delivery chart data (Last 6 months)
  const monthlyChartData = await Promise.all(
    Array.from({ length: 6 }).map(async (_, i) => {
      const date = subMonths(new Date(), 5 - i);
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      const tx = await prisma.transaction.aggregate({
        _sum: { filledCylindersDelivered: true },
        where: { deliveryDate: { gte: start, lt: end }, paymentStatus: "Done" }
      });
      return {
        label: format(date, "MMM"),
        cylinders: tx._sum.filledCylindersDelivered ?? 0,
        revenue: 0 // Not needed but keep for type compatibility if necessary
      };
    })
  );

  const totals = allCustomers.reduce((acc, c) => ({
    marketBalance: acc.marketBalance + (c.totalCylindersReceived - c.totalEmptyCylindersReturned),
    totalDelivered: acc.totalDelivered + c.totalCylindersReceived,
    totalPending: acc.totalPending + Number(c.totalPendingPayment)
  }), { marketBalance: 0, totalDelivered: 0, totalPending: 0 });

  return { 
    dailyRevenue: Number(dailyRevenue._sum.amount ?? 0), 
    monthlyRevenue: Number(monthlyRevenue._sum.amount ?? 0), 
    yearlyRevenue: Number(yearlyRevenue._sum.amount ?? 0), 
    dailyPayment: Number(dailyTx._sum.paymentAmount ?? 0), 
    monthlyPayment: Number(monthlyTx._sum.paymentAmount ?? 0), 
    yearlyPayment: Number(yearlyTx._sum.paymentAmount ?? 0), 
    dailyCylinders: dailyTx._sum.filledCylindersDelivered ?? 0, 
    monthlyCylinders: monthlyTx._sum.filledCylindersDelivered ?? 0, 
    yearlyCylinders: yearlyTx._sum.filledCylindersDelivered ?? 0, 
    emptyToday: dailyTx._sum.emptyCylindersReceived ?? 0, 
    pendingPayments, 
    customersCount, 
    recentTransactions, 
    monthlyChartData,
    marketBalance: totals.marketBalance,
    totalDelivered: totals.totalDelivered,
    totalPendingAmount: totals.totalPending,
    allCustomers: allCustomers.map(c => ({ ...c, totalPendingPayment: Number(c.totalPendingPayment) }))
  };
}

function MetricCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  icon: any;
  accent?: boolean;
}) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-[2rem] p-5 transition-all duration-300 touch-card
        ${accent
          ? "bg-gradient-to-br from-primary to-primary text-white shadow-2xl shadow-primary/20"
          : "bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 text-foreground"
        }
      `}
    >
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl ${
          accent ? "bg-white/20" : "bg-primary/10"
        }`}
      >
        <Icon className={`h-5 w-5 ${accent ? "text-white" : "text-primary"}`} />
      </div>
      <p className={`text-[10px] font-bold uppercase tracking-widest ${accent ? "text-white/70" : "text-muted-foreground"}`}>
        {label}
      </p>
      <p className={`mt-1 text-2xl font-black tracking-tight ${accent ? "text-primary-foreground" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

function StatBadge({ label, value, icon: Icon }: { label: string; value: number | string; icon: any }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[1.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm px-3 py-4 text-center">
      <div className="p-2 rounded-full bg-primary/5">
        <Icon className="h-4 w-4 text-primary/60" />
      </div>
      <div>
        <p className="text-lg font-black text-foreground leading-none">{value}</p>
        <p className="mt-1 text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background">
      <DashboardHeader customers={data.allCustomers} />

      <main className="space-y-8 px-4 pb-24 pt-4">
        
        {/* ── Dashboard Actions ── */}
        <section>
          <DashboardActions customers={data.allCustomers} />
        </section>

        {/* ── Cylinder Stats ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="h-1.5 w-1.5 rounded-full bg-primary" />
             <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Operations</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <StatBadge label="Empty" value={data.marketBalance} icon={PackageCheck} />
            <StatBadge label="Delivered" value={data.totalDelivered} icon={Cylinder} />
            <StatBadge label="Pending" value={money(data.totalPendingAmount)} icon={IndianRupee} />
          </div>
        </section>

        {/* ── Quick Actions ── */}
        <section>
          <NewSaleDialog customers={data.allCustomers} />
        </section>

        {/* ── Recent Activity (Moved up) ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
               <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Recent Activity</h2>
            </div>
            <Link href="/transactions" className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 divide-y divide-black/5 dark:divide-white/5 overflow-hidden shadow-xl shadow-black/5">
            {data.recentTransactions.map((t, i) => (
              <div key={t.id} className="flex items-center justify-between px-6 py-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                   <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[10px] font-bold text-primary">
                      {t.customer.fullName.charAt(0)}
                   </div>
                   <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-none">{t.customer.fullName}</p>
                    <p className="text-[10px] font-medium text-muted-foreground mt-1 tracking-wide">{t.filledCylindersDelivered} cyl delivered</p>
                  </div>
                </div>
                <span className="text-sm font-black text-primary">
                  {money(Number(t.paymentAmount))}
                </span>
              </div>
            ))}
          </div>
        </section>


        {/* ── Monthly Delivery Chart (Moved down) ── */}
        <section>
           <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 p-6 shadow-xl shadow-black/5">
              <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                <Cylinder className="h-4 w-4 text-primary" />
                Monthly Delivery Count
              </h3>
              <CylinderChart data={data.monthlyChartData} />
           </div>
        </section>

      </main>
    </div>
  );
}
