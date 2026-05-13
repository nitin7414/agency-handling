"use client";

import { useMemo, useState } from "react";
import { Search, MapPin, Calendar, IndianRupee, Filter, PackageCheck, PackageOpen } from "lucide-react";
import { money } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Transaction = {
  id: string;
  customer: {
    id: string;
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
      <main className="space-y-8 px-4 pb-24 pt-4 sm:px-0 sm:max-w-7xl sm:mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Search & Filter */}
        <div className="sm:col-span-4 space-y-6 sm:sticky sm:top-4">
          <section>
            <div className="flex items-center gap-2 mb-4">
               <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
               <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Search & Filter</h2>
            </div>
            
            <div className="space-y-4">
              <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-lg shadow-black/5 p-1 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-3 px-4 py-2">
                  <Search className="h-4 w-4 text-primary" />
                  <input 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Search customer..." 
                    className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm font-medium h-10" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {["All", "Pending", "Done"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={cn(
                      "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border",
                      filter === f
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/10"
                        : "bg-white dark:bg-zinc-900 text-muted-foreground border-black/5 dark:border-white/10"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <div className="hidden sm:block p-6 rounded-[2rem] bg-primary/5 border border-primary/10">
             <h3 className="text-sm font-black text-primary mb-2 flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filter Guide
             </h3>
             <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                Use filters to quickly find pending payments or specific customers. Search works across names, areas, and notes.
             </p>
          </div>
        </div>

        {/* Right Column: Transaction List */}
        <div className="sm:col-span-8 space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-4">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
               <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Transaction Ledger</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((t) => (
                <article 
                  key={t.id} 
                  className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 p-6 relative overflow-hidden transition-all duration-300 group hover:shadow-2xl hover:shadow-black/10"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-black text-primary">
                        {t.customer.fullName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
                          {t.customer.fullName} <span className="text-[10px] text-muted-foreground ml-1">#{t.customer.id.slice(0, 6).toUpperCase()}</span>
                        </h3>
                        <div className="flex items-center gap-1 text-muted-foreground mt-1">
                          <MapPin className="h-2.5 w-2.5" />
                          <span className="text-[9px] font-bold uppercase tracking-wider">{t.customer.area}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={cn(
                      "rounded-lg px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border-none",
                      t.paymentStatus === "Done" ? "bg-primary text-white" : "bg-destructive/20 text-destructive"
                    )}>
                      {t.paymentStatus}
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-2 mb-6">
                    {t.filledCylindersDelivered > 0 && (
                      <div className="bg-emerald-500/5 dark:bg-emerald-500/10 rounded-xl p-3 flex items-center gap-3 border border-emerald-500/10">
                        <PackageCheck className="h-4 w-4 text-emerald-500" />
                        <div>
                          <p className="text-[8px] font-bold uppercase text-emerald-600/70 tracking-widest">Delivered</p>
                          <p className="text-sm font-black text-foreground">{t.filledCylindersDelivered} Cylinders</p>
                        </div>
                      </div>
                    )}
                    {t.emptyCylindersReceived > 0 && (
                      <div className="bg-orange-500/5 dark:bg-orange-500/10 rounded-xl p-3 flex items-center gap-3 border border-orange-500/10">
                        <PackageOpen className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-[8px] font-bold uppercase text-orange-600/70 tracking-widest">Collected</p>
                          <p className="text-sm font-black text-foreground">{t.emptyCylindersReceived} Cylinders</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span className="text-[10px] font-bold">
                        {new Date(t.deliveryDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <IndianRupee className="h-3 w-3 text-primary" />
                      <span className="text-base font-black text-primary">
                        {money(t.paymentAmount)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 p-12 text-center">
                <p className="text-muted-foreground font-medium italic">No transactions found matching your criteria.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
