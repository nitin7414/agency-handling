import Link from "next/link";
import { addDays, format, subDays } from "date-fns";
import { CalendarClock, IndianRupee, PackageCheck, Plus, Users } from "lucide-react";
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

function Metric({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof IndianRupee }) { return <div className="touch-card"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div><p className="text-xs text-muted-foreground">{label}</p><p className="text-xl font-bold">{value}</p></div>; }

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <><MobileHeader title="Dashboard" subtitle="Live revenue, cylinders and reminders" /><main className="space-y-5 px-4"><section className="grid grid-cols-2 gap-3"><Metric label="Daily revenue" value={money(data.dailyRevenue)} icon={IndianRupee} /><Metric label="Monthly revenue" value={money(data.monthlyRevenue)} icon={IndianRupee} /><Metric label="Yearly revenue" value={money(data.yearlyRevenue)} icon={IndianRupee} /><Metric label="Active customers" value={data.customers} icon={Users} /><Metric label="Paid today" value={money(data.dailyPayment)} icon={PackageCheck} /><Metric label="Pending tasks" value={data.pendingTasks} icon={CalendarClock} /></section><section className="grid grid-cols-3 gap-2 text-center"><Badge>Daily sold {data.dailyCylinders}</Badge><Badge>Monthly {data.monthlyCylinders}</Badge><Badge>Yearly {data.yearlyCylinders}</Badge><Badge>Delivered today {data.dailyCylinders}</Badge><Badge>Empty in {data.emptyToday}</Badge><Badge>Pending pay {data.pendingPayments}</Badge></section><section className="grid grid-cols-2 gap-3"><Button asChild><Link href="/customers"><Plus className="h-4 w-4" />Add sale</Link></Button><Button asChild variant="secondary"><Link href="/tasks">Create reminder</Link></Button></section><RevenueChart data={data.chartData} /><CylinderChart data={data.chartData} /><section className="touch-card"><h2 className="mb-3 font-semibold">Today&apos;s pending deliveries & collections</h2><div className="space-y-3">{data.todayTasks.length === 0 ? <p className="text-sm text-muted-foreground">No pending reminders for today.</p> : data.todayTasks.map((task) => <div key={task.id} className="rounded-2xl bg-muted p-3"><div className="flex justify-between gap-2"><p className="font-semibold">{task.customer.fullName}</p><Badge className={task.dueDate < new Date() ? "bg-destructive text-destructive-foreground" : ""}>{task.priority}</Badge></div><p className="text-sm text-muted-foreground">{task.taskType === "DeliverCylinder" ? "Deliver Cylinder" : "Collect Empty Cylinder"} • {task.customer.area}</p></div>)}</div></section><section className="touch-card"><h2 className="mb-3 font-semibold">Recent activity</h2>{data.recentTransactions.map((t) => <p key={t.id} className="border-b py-2 text-sm last:border-0">{t.customer.fullName}: {t.filledCylindersDelivered} delivered • {money(Number(t.paymentAmount))}</p>)}</section></main></>;
}
