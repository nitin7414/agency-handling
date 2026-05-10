import { MobileHeader } from "@/components/mobile-header";
import { TaskClient } from "@/components/task-client";
import { prisma } from "@/lib/prisma";

export default async function TasksPage() {
  const [tasks, customers] = await Promise.all([prisma.deliveryTask.findMany({ include: { customer: true }, orderBy: [{ status: "asc" }, { dueDate: "asc" }] }), prisma.customer.findMany({ select: { id: true, fullName: true, area: true }, orderBy: { fullName: "asc" } })]);
  return <><MobileHeader title="Tasks" subtitle="Delivery reminders and empty-cylinder collection" /><TaskClient tasks={tasks} customers={customers} /></>;
}
