import { MobileHeader } from "@/components/mobile-header";
import { CustomerClient } from "@/components/customer-client";
import { prisma } from "@/lib/prisma";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({ include: { transactions: { orderBy: { deliveryDate: "desc" } }, paymentHistory: { orderBy: { createdAt: "desc" } } }, orderBy: { updatedAt: "desc" } });
  const safeCustomers = customers.map((c) => ({ ...c, totalPendingPayment: Number(c.totalPendingPayment), transactions: c.transactions.map((t) => ({ ...t, paymentAmount: Number(t.paymentAmount) })), paymentHistory: c.paymentHistory.map((p) => ({ ...p, amount: Number(p.amount) })) }));
  return <><MobileHeader title="Customers" subtitle="Search locality, address, phone or name" /><CustomerClient customers={safeCustomers} /></>;
}
