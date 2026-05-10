"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { customerSchema, taskSchema, transactionSchema } from "@/actions/schemas";

export async function createCustomer(_: unknown, formData: FormData) {
  const parsed = customerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  await prisma.customer.create({ data: parsed.data });
  revalidatePath("/customers"); revalidatePath("/dashboard");
  return { ok: true, message: "Customer created" };
}

export async function createTransaction(_: unknown, formData: FormData) {
  const parsed = transactionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  await prisma.$transaction(async (tx) => {
    const data = parsed.data;
    const transaction = await tx.transaction.create({ data: { ...data, revenueCountedAt: data.paymentStatus === "Done" ? new Date() : null } });
    await tx.customer.update({ where: { id: data.customerId }, data: { totalCylindersReceived: { increment: data.filledCylindersDelivered }, totalEmptyCylindersReturned: { increment: data.emptyCylindersReceived }, totalPendingPayment: data.paymentStatus === "Pending" ? { increment: data.paymentAmount } : undefined } });
    await tx.cylinderInventory.create({ data: { movementType: "StockOut", filledQuantity: data.filledCylindersDelivered * -1, emptyQuantity: data.emptyCylindersReceived, reason: `Transaction ${transaction.id}` } });
    await tx.paymentHistory.create({ data: { customerId: data.customerId, transactionId: transaction.id, amount: data.paymentAmount, status: data.paymentStatus, paidAt: data.paymentStatus === "Done" ? new Date() : null } });
    if (data.paymentStatus === "Done" && data.paymentAmount > 0) await tx.revenueRecord.create({ data: { transactionId: transaction.id, amount: data.paymentAmount, note: "Paid at delivery" } });
  });
  revalidatePath("/customers"); revalidatePath("/dashboard");
  return { ok: true, message: "Transaction saved" };
}

export async function markPaymentDone(transactionId: string) {
  await prisma.$transaction(async (tx) => {
    const t = await tx.transaction.findUniqueOrThrow({ where: { id: transactionId } });
    if (t.paymentStatus === "Done") return;
    await tx.transaction.update({ where: { id: transactionId }, data: { paymentStatus: "Done", revenueCountedAt: new Date() } });
    await tx.customer.update({ where: { id: t.customerId }, data: { totalPendingPayment: { decrement: t.paymentAmount } } });
    await tx.paymentHistory.create({ data: { customerId: t.customerId, transactionId, amount: t.paymentAmount, status: "Done", paidAt: new Date(), note: "Payment confirmed" } });
    await tx.revenueRecord.create({ data: { transactionId, amount: t.paymentAmount, note: "Pending payment collected" } });
  });
  revalidatePath("/customers"); revalidatePath("/dashboard");
}

export async function createTask(_: unknown, formData: FormData) {
  const parsed = taskSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  await prisma.deliveryTask.create({ data: parsed.data });
  revalidatePath("/tasks"); revalidatePath("/dashboard");
  return { ok: true, message: "Task created" };
}

export async function completeTask(taskId: string) {
  await prisma.deliveryTask.update({ where: { id: taskId }, data: { status: "Completed", completedAt: new Date() } });
  revalidatePath("/tasks"); revalidatePath("/dashboard");
}
