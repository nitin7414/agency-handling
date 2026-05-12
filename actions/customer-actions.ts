"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { customerSchema, taskSchema, transactionSchema } from "@/actions/schemas";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
}

export async function createCustomer(_: unknown, formData: FormData) {
  try {
    await checkAdmin();
    const data = Object.fromEntries(formData);
    const parsed = customerSchema.safeParse(data);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid customer data";
      const field = parsed.error.issues[0]?.path[0];
      return { ok: false, message: `${field}: ${errorMsg}` };
    }
    await prisma.customer.create({ data: parsed.data });
    revalidatePath("/customers"); revalidatePath("/dashboard");
    return { ok: true, message: "Customer created successfully" };
  } catch (error) {
    console.error("Action error:", error);
    return { ok: false, message: "An unexpected error occurred. Please try again." };
  }
}

export async function updateCustomer(customerId: string, formData: FormData) {
  try {
    await checkAdmin();
    const data = Object.fromEntries(formData);
    const parsed = customerSchema.safeParse(data);
    if (!parsed.success) return { ok: false, message: "Invalid customer data" };
    await prisma.customer.update({ where: { id: customerId }, data: parsed.data });
    revalidatePath("/customers"); revalidatePath("/dashboard");
    return { ok: true, message: "Customer updated successfully" };
  } catch (error) {
    console.error("Action error:", error);
    return { ok: false, message: "An unexpected error occurred. Please try again." };
  }
}

export async function createTransaction(_: unknown, formData: FormData) {
  try {
    await checkAdmin();
    const parsed = transactionSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return { ok: false, message: "Invalid transaction data" };
    await prisma.$transaction(async (tx) => {
      const data = parsed.data;
      const transaction = await tx.transaction.create({ data: { ...data, revenueCountedAt: data.paymentStatus === "Done" ? new Date() : null } });
      await tx.customer.update({ where: { id: data.customerId }, data: { totalCylindersReceived: { increment: data.filledCylindersDelivered }, totalEmptyCylindersReturned: { increment: data.emptyCylindersReceived }, totalPendingPayment: data.paymentStatus === "Pending" ? { increment: data.paymentAmount } : undefined } });
      await tx.cylinderInventory.create({ data: { movementType: "StockOut", filledQuantity: data.filledCylindersDelivered * -1, emptyQuantity: data.emptyCylindersReceived, reason: `Transaction ${transaction.id}` } });
      await tx.paymentHistory.create({ data: { customerId: data.customerId, transactionId: transaction.id, amount: data.paymentAmount, status: data.paymentStatus, paidAt: data.paymentStatus === "Done" ? new Date() : null } });
      if (data.paymentStatus === "Done" && data.paymentAmount > 0) await tx.revenueRecord.create({ data: { transactionId: transaction.id, amount: data.paymentAmount, note: "Paid at delivery" } });
    });
    revalidatePath("/customers"); revalidatePath("/dashboard");
    return { ok: true, message: "Transaction recorded successfully" };
  } catch (error) {
    console.error("Action error:", error);
    return { ok: false, message: "An unexpected error occurred. Please try again." };
  }
}

export async function markPaymentDone(transactionId: string) {
  try {
    await checkAdmin();
    await prisma.$transaction(async (tx) => {
      const t = await tx.transaction.findUniqueOrThrow({ where: { id: transactionId } });
      if (t.paymentStatus === "Done") return;
      await tx.transaction.update({ where: { id: transactionId }, data: { paymentStatus: "Done", revenueCountedAt: new Date() } });
      await tx.customer.update({ where: { id: t.customerId }, data: { totalPendingPayment: { decrement: t.paymentAmount } } });
      await tx.paymentHistory.create({ data: { customerId: t.customerId, transactionId, amount: t.paymentAmount, status: "Done", paidAt: new Date(), note: "Payment confirmed" } });
      await tx.revenueRecord.create({ data: { transactionId, amount: t.paymentAmount, note: "Pending payment collected" } });
    });
    revalidatePath("/customers"); revalidatePath("/dashboard");
  } catch (error) {
    console.error("Payment update error:", error);
  }
}

export async function createTask(_: unknown, formData: FormData) {
  try {
    await checkAdmin();
    const parsed = taskSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return { ok: false, message: "Invalid task data" };
    await prisma.deliveryTask.create({ data: parsed.data });
    revalidatePath("/tasks"); revalidatePath("/dashboard");
    return { ok: true, message: "Task created successfully" };
  } catch (error) {
    console.error("Action error:", error);
    return { ok: false, message: "An unexpected error occurred. Please try again." };
  }
}

export async function completeTask(taskId: string) {
  try {
    await checkAdmin();
    await prisma.deliveryTask.update({ where: { id: taskId }, data: { status: "Completed", completedAt: new Date() } });
    revalidatePath("/tasks"); revalidatePath("/dashboard");
  } catch (error) {
    console.error("Task update error:", error);
  }
}
export async function deleteCustomer(customerId: string) {
  try {
    await checkAdmin();
    await prisma.customer.delete({ where: { id: customerId } });
    revalidatePath("/customers"); 
    revalidatePath("/dashboard");
    return { ok: true, message: "Customer deleted successfully" };
  } catch (error) {
    console.error("Action error:", error);
    return { ok: false, message: "Failed to delete customer." };
  }
}
