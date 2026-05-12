// customers/page.tsx
import { MobileHeader } from "@/components/mobile-header";
import { CustomerClient } from "@/components/customer-client";
import { prisma } from "@/lib/prisma";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    include: {
      transactions: { orderBy: { deliveryDate: "desc" } },
      paymentHistory: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const safeCustomers = customers.map((c) => ({
    ...c,
    totalPendingPayment: Number(c.totalPendingPayment),
    aadharUrl: c.aadharUrl,
    panUrl: c.panUrl,
    foodLicenseUrl: c.foodLicenseUrl,
    gstProofUrl: c.gstProofUrl,
    transactions: c.transactions.map((t) => ({
      ...t,
      paymentAmount: Number(t.paymentAmount),
    })),
    paymentHistory: c.paymentHistory.map((p) => ({
      ...p,
      amount: Number(p.amount),
    })),
  }));

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/15 via-background to-background">
        <MobileHeader
          title=""
          subtitle="Search by locality, address, phone or name"
        />
        <CustomerClient customers={safeCustomers} />
      </div>
  );
}