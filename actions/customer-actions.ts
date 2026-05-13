"use server";
// Triggering re-compilation to pick up generated client fields (paidAmount)
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma-fresh";
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
      return { ok: false, message: `${String(field)}: ${errorMsg}` };
    }
    await prisma.customer.create({ data: parsed.data });
    revalidatePath("/customers"); revalidatePath("/dashboard");
    return { ok: true, message: "Customer created successfully" };
  } catch (error) {
    console.error("Action error:", error);
    return { ok: false, message: "An unexpected error occurred. Please try again." };
  }
}

export async function updateCustomer(_: unknown, formData: FormData) {
  try {
    await checkAdmin();
    const data = Object.fromEntries(formData);
    const customerId = data.id as string;
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
    const rawData = Object.fromEntries(formData);
    const parsed = transactionSchema.safeParse(rawData);
    if (!parsed.success) {
      console.error("Validation error:", parsed.error.issues);
      return { ok: false, message: "Invalid transaction data" };
    }
    
    await prisma.$transaction(async (tx) => {
      const data = parsed.data;
      const due = data.dueAmount ?? data.paymentAmount ?? 0;
      let paid = data.paidAmount ?? 0;
      
      // If UI explicitly says Done but doesn't use the new due/paid fields, assume fully paid
      if (data.paymentStatus === "Done" && data.dueAmount === undefined && data.paidAmount === undefined) {
        paid = due;
      }

      const balance = due - paid;
      const status = balance > 0 ? "Pending" : "Done";

      // Sanity check: Ensure market count doesn't go below zero
      if (data.emptyCylindersReceived > 0) {
        const customer = await tx.customer.findUniqueOrThrow({ where: { id: data.customerId } });
        const currentMarket = customer.totalCylindersReceived - customer.totalEmptyCylindersReturned;
        if (data.emptyCylindersReceived > currentMarket) {
          throw new Error(`Cannot collect ${data.emptyCylindersReceived} empties. Customer only has ${currentMarket} cylinders.`);
        }
      }

      const transaction = await tx.transaction.create({ 
        data: { 
          customerId: data.customerId,
          filledCylindersDelivered: data.filledCylindersDelivered,
          emptyCylindersReceived: data.emptyCylindersReceived,
          paymentAmount: due,
          paidAmount: paid,
          paymentStatus: status,
          deliveryDate: data.deliveryDate,
          notes: data.notes,
          revenueCountedAt: paid > 0 ? new Date() : null 
        } 
      });

      await tx.customer.update({ 
        where: { id: data.customerId }, 
        data: { 
          totalCylindersReceived: { increment: data.filledCylindersDelivered }, 
          totalEmptyCylindersReturned: { increment: data.emptyCylindersReceived }, 
          totalPendingPayment: { increment: balance } 
        } 
      });

      await tx.cylinderInventory.create({ 
        data: { 
          movementType: "StockOut", 
          filledQuantity: data.filledCylindersDelivered * -1, 
          emptyQuantity: data.emptyCylindersReceived, 
          reason: `Transaction ${transaction.id}` 
        } 
      });

      if (paid > 0) {
        await tx.paymentHistory.create({ 
          data: { 
            customerId: data.customerId, 
            transactionId: transaction.id, 
            amount: paid, 
            status: "Done", 
            paidAt: new Date(),
            note: balance > 0 ? "Partial payment at delivery" : "Full payment at delivery"
          } 
        });
        await tx.revenueRecord.create({ 
          data: { 
            transactionId: transaction.id, 
            amount: paid, 
            note: "Paid at delivery" 
          } 
        });
      }
    }, { timeout: 15000 });
    revalidatePath("/customers"); revalidatePath("/dashboard");
    return { ok: true, message: "Transaction recorded successfully" };
  } catch (error) {
    console.error("Action error:", error);
    return { ok: false, message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again." };
  }
}

export async function markPaymentDone(transactionId: string) {
  try {
    await checkAdmin();
    await prisma.$transaction(async (tx) => {
      const t = await tx.transaction.findUniqueOrThrow({ where: { id: transactionId } });
      if (t.paymentStatus === "Done") return;
      
      const balance = Number(t.paymentAmount) - Number(t.paidAmount);
      if (balance <= 0) {
         await tx.transaction.update({ where: { id: transactionId }, data: { paymentStatus: "Done" } });
         return;
      }

      await tx.transaction.update({ 
        where: { id: transactionId }, 
        data: { 
          paymentStatus: "Done", 
          paidAmount: t.paymentAmount, 
          revenueCountedAt: new Date() 
        } 
      });

      await tx.customer.update({ 
        where: { id: t.customerId }, 
        data: { totalPendingPayment: { decrement: balance } } 
      });

      await tx.paymentHistory.create({ 
        data: { 
          customerId: t.customerId, 
          transactionId, 
          amount: balance, 
          status: "Done", 
          paidAt: new Date(), 
          note: "Balance payment cleared" 
        } 
      });

      await tx.revenueRecord.create({ 
        data: { 
          transactionId, 
          amount: balance, 
          note: "Pending balance collected" 
        } 
      });
    }, { timeout: 15000 });
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
