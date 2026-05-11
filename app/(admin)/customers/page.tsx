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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        body, html {
          background: #0b0f1a;
          font-family: 'Sora', sans-serif;
        }

        .customers-root {
          min-height: 100dvh;
          background: #0b0f1a;
          background-image:
            radial-gradient(ellipse 70% 35% at 50% -5%, rgba(251,146,60,0.10) 0%, transparent 70%);
        }

        /* ── Search bar override ──
           CustomerClient renders its own search input.
           These globals will style it consistently. */
        .customers-root input[type="search"],
        .customers-root input[type="text"] {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.10) !important;
          border-radius: 14px !important;
          color: #f1f5f9 !important;
          font-family: 'Sora', sans-serif !important;
          font-size: 14px !important;
          padding: 12px 16px !important;
          outline: none !important;
          width: 100% !important;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .customers-root input[type="search"]:focus,
        .customers-root input[type="text"]:focus {
          border-color: rgba(251,146,60,0.5) !important;
          box-shadow: 0 0 0 3px rgba(251,146,60,0.10) !important;
        }
        .customers-root input::placeholder {
          color: #475569 !important;
        }

        /* ── Customer card overrides ── */
        .customers-root [class*="card"],
        .customers-root [class*="touch-card"] {
          background: rgba(255,255,255,0.04) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 18px !important;
          color: #f1f5f9 !important;
        }

        /* ── Badge overrides ── */
        .customers-root [class*="badge"],
        .customers-root [class*="Badge"] {
          background: rgba(251,146,60,0.15) !important;
          color: #fb923c !important;
          border: none !important;
          border-radius: 8px !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          padding: 2px 8px !important;
        }
        .customers-root [class*="badge"][class*="destructive"],
        .customers-root [class*="Badge"][class*="destructive"] {
          background: rgba(239,68,68,0.15) !important;
          color: #f87171 !important;
        }

        /* ── Button overrides ── */
        .customers-root button[class*="primary"],
        .customers-root [class*="btn-primary"] {
          background: #f59e0b !important;
          color: white !important;
          border-radius: 14px !important;
          font-weight: 600 !important;
          border: none !important;
        }

        .customers-root p, .customers-root span, .customers-root div {
          color: inherit;
        }
        .customers-root .text-muted-foreground {
          color: #64748b !important;
        }
        .customers-root .font-semibold, .customers-root .font-bold {
          color: #f1f5f9;
        }
        .customers-root h1, .customers-root h2, .customers-root h3 {
          color: #f8fafc;
          font-family: 'Sora', sans-serif;
        }
      `}</style>

      <div className="customers-root">
        <MobileHeader
          title="Customers"
          subtitle="Search by locality, address, phone or name"
        />
        <CustomerClient customers={safeCustomers} />
      </div>
    </>
  );
}