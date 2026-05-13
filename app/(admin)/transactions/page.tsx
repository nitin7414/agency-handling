import { prisma } from "@/lib/prisma-fresh";
import { MobileHeader } from "@/components/mobile-header";
import { TransactionClient } from "@/components/transaction-client";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    include: {
      customer: true,
    },
    orderBy: {
      deliveryDate: "desc",
    },
  });

  const safeTransactions = transactions.map((t) => ({
    ...t,
    paymentAmount: Number(t.paymentAmount),
    paidAmount: Number(t.paidAmount),
    customer: {
      ...t.customer,
      totalPendingPayment: Number(t.customer.totalPendingPayment),
    },
  }));

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/15 via-background to-background">
      <MobileHeader 
        title="Transactions" 
        subtitle="Detailed history of sales and collections" 
      />
      <TransactionClient transactions={safeTransactions} />
    </div>
  );
}
