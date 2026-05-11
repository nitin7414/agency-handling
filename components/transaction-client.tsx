"use client";

import { useMemo, useState } from "react";
import { Search, MapPin, Calendar, CreditCard, Filter, PackageCheck, PackageOpen } from "lucide-react";
import { money } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Transaction = {
  id: string;
  customer: {
    fullName: string;
    area: string;
  };
  filledCylindersDelivered: number;
  emptyCylindersReceived: number;
  paymentAmount: number;
  paymentStatus: "Pending" | "Done";
  deliveryDate: Date;
  notes: string | null;
};

export function TransactionClient({ transactions }: { transactions: Transaction[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Pending" | "Done">("All");

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesQuery = t.customer.fullName.toLowerCase().includes(query.toLowerCase()) || 
                          t.customer.area.toLowerCase().includes(query.toLowerCase()) ||
                          (t.notes?.toLowerCase().includes(query.toLowerCase()));
      const matchesFilter = filter === "All" || t.paymentStatus === filter;
      return matchesQuery && matchesFilter;
    });
  }, [transactions, query, filter]);

  return (
    <main className="space-y-6 px-4 pb-24 pt-4">
      {/* Search & Filter */}
      <section>
        <div className="flex items-center gap-2 mb-4">
           <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
           <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Search & Filter</h2>
        </div>
        
        <div className="space-y-3">
          <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm p-2 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-3 px-4 py-2">
              <Search className="h-5 w-5 text-primary" />
              <input 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Search by customer or area..." 
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm font-medium" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {["All", "Pending", "Done"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={cn(
                  "py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border",
                  filter === f
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/10"
                    : "bg-white/5 text-muted-foreground border-white/5"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Transaction List */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
           <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Transaction Ledger</h2>
        </div>

        {filtered.map((t) => (
          <article 
            key={t.id} 
            className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 p-6 relative overflow-hidden transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-lg font-black text-primary">
                  {t.customer.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground leading-tight group-hover:text-primary transition-colors">
                    {t.customer.fullName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t.customer.area}</span>
                  </div>
                </div>
              </div>
              <Badge className={cn(
                "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border-none",
                t.paymentStatus === "Done" ? "bg-primary text-white" : "bg-destructive/20 text-destructive"
              )}>
                {t.paymentStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <PackageCheck className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-muted-foreground">Delivered</p>
                  <p className="text-sm font-black text-foreground">{t.filledCylindersDelivered} Cyl</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <PackageOpen className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-muted-foreground">Collected</p>
                  <p className="text-sm font-black text-foreground">{t.emptyCylindersReceived} Cyl</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-bold text-muted-foreground">
                  {new Date(t.deliveryDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <span className="text-lg font-black text-primary">
                  {money(t.paymentAmount)}
                </span>
              </div>
            </div>

            {t.notes && (
              <div className="mt-4 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                <p className="text-[10px] text-muted-foreground italic leading-relaxed">"{t.notes}"</p>
              </div>
            )}
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 p-12 text-center border-dashed border-black/10 dark:border-white/10">
            <p className="text-muted-foreground font-medium italic">No transactions found matching your criteria.</p>
          </div>
        )}
      </section>
    </main>
  );
}
