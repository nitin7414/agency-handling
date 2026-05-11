// dashboard/page.tsx
import Link from "next/link";
import { addDays, format, subDays } from "date-fns";
import { CalendarClock, IndianRupee, PackageCheck, Plus, Users, Flame, TrendingUp, ArrowRight, Bell, Zap, Cylinder } from "lucide-react";
import { MobileHeader } from "@/components/mobile-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RevenueChart, CylinderChart } from "@/components/analytics-charts";
import { dayRange, monthRange, yearRange } from "@/lib/dates";
import { money } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

async function getDashboardData() {
  const today = dayRange(); const month = monthRange(); const year = yearRange();
  const [dailyRevenue, monthlyRevenue, yearlyRevenue, dailyTx, monthlyTx, yearlyTx, pendingPayments, pendingTasks, customers, todayTasks, recentTransactions] = await Promise.all([
    prisma.revenueRecord.aggregate({ _sum: { amount: true }, where: { recordedAt: { gte: today.start, lt: today.end } } }),
    prisma.revenueRecord.aggregate({ _sum: { amount: true }, where: { recordedAt: { gte: month.start, lt: month.end } } }),
    prisma.revenueRecord.aggregate({ _sum: { amount: true }, where: { recordedAt: { gte: year.start, lt: year.end } } }),
    prisma.transaction.aggregate({ _sum: { filledCylindersDelivered: true, emptyCylindersReceived: true, paymentAmount: true }, where: { deliveryDate: { gte: today.start, lt: today.end }, paymentStatus: "Done" } }),
    prisma.transaction.aggregate({ _sum: { filledCylindersDelivered: true, paymentAmount: true }, where: { deliveryDate: { gte: month.start, lt: month.end }, paymentStatus: "Done" } }),
    prisma.transaction.aggregate({ _sum: { filledCylindersDelivered: true, paymentAmount: true }, where: { deliveryDate: { gte: year.start, lt: year.end }, paymentStatus: "Done" } }),
    prisma.transaction.count({ where: { paymentStatus: "Pending" } }),
    prisma.deliveryTask.count({ where: { status: "Pending" } }),
    prisma.customer.count({ where: { isActive: true } }),
    prisma.deliveryTask.findMany({ where: { status: "Pending", dueDate: { lt: today.end } }, include: { customer: true }, orderBy: [{ dueDate: "asc" }, { priority: "desc" }], take: 8 }),
    prisma.transaction.findMany({ include: { customer: true }, orderBy: { createdAt: "desc" }, take: 6 })
  ]);
  const chartData = await Promise.all(Array.from({ length: 6 }).map(async (_, i) => { const date = subDays(new Date(), 5 - i); const range = dayRange(date); const [rev, tx] = await Promise.all([prisma.revenueRecord.aggregate({ _sum: { amount: true }, where: { recordedAt: { gte: range.start, lt: range.end } } }), prisma.transaction.aggregate({ _sum: { filledCylindersDelivered: true }, where: { deliveryDate: { gte: range.start, lt: range.end }, paymentStatus: "Done" } })]); return { label: format(date, "dd MMM"), revenue: Number(rev._sum.amount ?? 0), cylinders: tx._sum.filledCylindersDelivered ?? 0 }; }));
  return { dailyRevenue: Number(dailyRevenue._sum.amount ?? 0), monthlyRevenue: Number(monthlyRevenue._sum.amount ?? 0), yearlyRevenue: Number(yearlyRevenue._sum.amount ?? 0), dailyPayment: Number(dailyTx._sum.paymentAmount ?? 0), monthlyPayment: Number(monthlyTx._sum.paymentAmount ?? 0), yearlyPayment: Number(yearlyTx._sum.paymentAmount ?? 0), dailyCylinders: dailyTx._sum.filledCylindersDelivered ?? 0, monthlyCylinders: monthlyTx._sum.filledCylindersDelivered ?? 0, yearlyCylinders: yearlyTx._sum.filledCylindersDelivered ?? 0, emptyToday: dailyTx._sum.emptyCylindersReceived ?? 0, pendingPayments, pendingTasks, customers, todayTasks, recentTransactions, chartData };
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
          ? "bg-gradient-to-br from-primary to-orange-600 text-white shadow-2xl shadow-primary/20"
          : "glass-card text-foreground"
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
      <p className={`mt-1 text-2xl font-black tracking-tight ${accent ? "text-white" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

function StatBadge({ label, value, icon: Icon }: { label: string; value: number | string; icon: any }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[1.5rem] glass-card px-3 py-4 text-center">
      <div className="p-2 rounded-full bg-primary/5">
        <Icon className="h-4 w-4 text-primary/60" />
      </div>
      <div>
        <p className="text-xl font-black text-white leading-none">{value}</p>
        <p className="mt-1 text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <MobileHeader title="Overview" subtitle="Real-time agency metrics" />

      <main className="space-y-8 px-4 pb-24 pt-4">
        
        {/* ── Revenue Metrics ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
             <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Financial Summary</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard label="Today" value={money(data.dailyRevenue)} icon={IndianRupee} accent />
            <MetricCard label="Monthly" value={money(data.monthlyRevenue)} icon={TrendingUp} />
            <MetricCard label="Customers" value={data.customers} icon={Users} />
            <MetricCard label="Tasks" value={data.pendingTasks} icon={CalendarClock} />
          </div>
        </section>

        {/* ── Cylinder Stats ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
             <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Operations</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <StatBadge label="Sold" value={data.dailyCylinders} icon={Zap} />
            <StatBadge label="Month" value={data.monthlyCylinders} icon={Cylinder} />
            <StatBadge label="Empty" value={data.emptyToday} icon={PackageCheck} />
          </div>
        </section>

        {/* ── Quick Actions ── */}
        <section className="grid grid-cols-2 gap-4">
          <Link
            href="/customers"
            className="flex items-center justify-center gap-3 rounded-2xl bg-primary px-4 py-4 text-sm font-bold text-black shadow-xl shadow-primary/20 touch-card"
          >
            <Plus className="h-5 w-5" /> New Sale
          </Link>
          <Link
            href="/tasks"
            className="flex items-center justify-center gap-3 rounded-2xl glass-card px-4 py-4 text-sm font-bold text-white touch-card"
          >
            <Bell className="h-5 w-5 text-primary" /> Reminders
          </Link>
        </section>

        {/* ── Charts ── */}
        <section className="space-y-4">
           <div className="rounded-[2.5rem] glass-card p-6">
              <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Revenue Trend
              </h3>
              <RevenueChart data={data.chartData} />
           </div>
           
           <div className="rounded-[2.5rem] glass-card p-6">
              <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                <Cylinder className="h-4 w-4 text-primary" />
                Delivery Volume
              </h3>
              <CylinderChart data={data.chartData} />
           </div>
        </section>

        {/* ── Today's Tasks ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
               <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Priority Tasks</h2>
            </div>
          </div>
          <div className="space-y-3">
            {data.todayTasks.length === 0 ? (
              <div className="rounded-[2rem] glass-card p-8 text-center border-dashed border-white/5">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Flame className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">All systems go. No tasks for today.</p>
              </div>
            ) : (
              data.todayTasks.map((task) => {
                const overdue = task.dueDate < new Date();
                return (
                  <div
                    key={task.id}
                    className={`rounded-2xl p-4 flex items-center justify-between transition-all duration-300 ${
                      overdue
                        ? "bg-destructive/10 border border-destructive/20"
                        : "glass-card"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        overdue ? "bg-destructive/20" : "bg-primary/10"
                      }`}>
                         <PackageCheck className={`h-5 w-5 ${overdue ? "text-destructive" : "text-primary"}`} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm leading-none">{task.customer.fullName}</p>
                        <p className="text-[10px] font-medium text-muted-foreground mt-1.5 uppercase tracking-wider">
                          {task.taskType === "DeliverCylinder" ? "Delivery" : "Collection"} • {task.customer.area}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={`rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-widest ${
                        overdue
                          ? "bg-destructive text-white"
                          : "bg-primary/20 text-primary border-none"
                      }`}
                    >
                      {overdue ? "Overdue" : task.priority}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ── Recent Activity ── */}
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
          <div className="rounded-[2.5rem] glass-card divide-y divide-white/5 overflow-hidden">
            {data.recentTransactions.map((t, i) => (
              <div key={t.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                   <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                      {t.customer.fullName.charAt(0)}
                   </div>
                   <div>
                    <p className="text-sm font-bold text-white leading-none">{t.customer.fullName}</p>
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

      </main>
    </div>
  );
}