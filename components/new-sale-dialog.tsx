"use client";

import { useState, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, Search, X, ArrowLeft, Cylinder, PackagePlus, IndianRupee, UserPlus, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { money } from "@/lib/utils";
import { createTransaction } from "@/actions/customer-actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Customer {
  id: string;
  fullName: string;
  phoneNumber: string;
  area: string;
  totalCylindersReceived: number;
  totalEmptyCylindersReturned: number;
  totalPendingPayment: number;
}

interface NewSaleDialogProps {
  customers: Customer[];
}

export function NewSaleDialog({ customers }: NewSaleDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [actionType, setActionType] = useState<"Delivery" | "Collection">("Delivery");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(c => 
      c.fullName.toLowerCase().includes(q) || 
      c.phoneNumber.includes(q) || 
      c.area.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const handleAction = async (formData: FormData) => {
    const res = await createTransaction(null, formData);
    setMessage(res.message);
    if (res.ok) {
      setTimeout(() => {
        setMessage("");
        setOpen(false);
        setSelectedCustomer(null);
        setSearch("");
      }, 2000);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) {
        setSelectedCustomer(null);
        setSearch("");
        setMessage("");
      }
    }}>
      <Dialog.Trigger asChild>
        <Button className="w-full h-14 rounded-3xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 touch-card" size="lg">
          <Plus className="mr-2 h-6 w-6" /> New Sale
        </Button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md animate-in fade-in duration-300" />
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <Dialog.Content 
            aria-describedby={undefined}
            className="w-[94%] max-w-md rounded-[2.5rem] bg-background p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200 ease-in-out max-h-[90vh] overflow-y-auto outline-none border border-black/5 dark:border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {selectedCustomer && (
                  <button 
                    onClick={() => setSelectedCustomer(null)}
                    className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                )}
                <Dialog.Title className="text-xl font-black text-foreground">
                  {selectedCustomer ? "Record Sale" : "New Sale"}
                </Dialog.Title>
              </div>
              <Dialog.Close className="h-11 w-11 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center active:scale-95 transition-transform">
                <X className="h-5 w-5 text-foreground" />
              </Dialog.Close>
            </div>

            {message && (
              <div className="mb-6 rounded-2xl bg-primary/10 border border-primary/20 p-4 animate-in fade-in slide-in-from-top-4">
                <p className="text-sm font-bold text-primary flex items-center gap-2">
                  <Zap className="h-4 w-4" /> {message}
                </p>
              </div>
            )}

            {!selectedCustomer ? (
              <div className="space-y-6">
                {/* Add New Customer Button */}
                <Link 
                  href="/customers?new=true" 
                  className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <UserPlus className="h-5 w-5" /> Add New Customer
                </Link>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Search customer name or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-14 pl-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner"
                  />
                </div>

                <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {filtered.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCustomer(c)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 hover:border-primary/30 transition-all text-left group"
                    >
                      <div>
                        <p className="font-black text-foreground group-hover:text-primary transition-colors">{c.fullName}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{c.area} • {c.phoneNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-primary">{c.totalCylindersReceived - c.totalEmptyCylindersReturned} Cyl</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">In Market</p>
                      </div>
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-center py-8 text-sm text-muted-foreground italic">No customers found.</p>
                  )}
                </div>
              </div>
            ) : (
              <form action={handleAction} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <p className="text-sm font-black text-primary">{selectedCustomer.fullName}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{selectedCustomer.area} • {selectedCustomer.phoneNumber}</p>
                </div>

                <input type="hidden" name="customerId" value={selectedCustomer.id} />
                
                <div className="space-y-4">
                  <div className="flex p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/5">
                    {["Delivery", "Collection"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setActionType(type as any)}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                          actionType === type 
                            ? "bg-white dark:bg-zinc-700 text-primary shadow-sm" 
                            : "text-muted-foreground"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">
                      {actionType === "Delivery" ? "Cylinders Delivered" : "Cylinders Collected"}
                    </label>
                    <div className="relative">
                      <Cylinder className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${actionType === "Delivery" ? "text-emerald-500" : "text-orange-500"}`} />
                      <Input 
                        name={actionType === "Delivery" ? "filledCylindersDelivered" : "emptyCylindersReceived"} 
                        type="number" 
                        min="0" 
                        defaultValue="1" 
                        className="h-14 pl-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner text-lg font-black" 
                      />
                      <input type="hidden" name={actionType === "Delivery" ? "emptyCylindersReceived" : "filledCylindersDelivered"} value="0" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Payment Amount</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                    <Input name="paymentAmount" type="number" min="0" placeholder="0.00" className="h-14 pl-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner text-xl font-black text-primary" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Status</label>
                    <select name="paymentStatus" className="h-14 w-full rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner px-4 text-sm font-black text-foreground outline-none">
                      <option value="Pending">Pending</option>
                      <option value="Done">Paid Full</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Date</label>
                    <Input name="deliveryDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner text-sm font-bold" />
                  </div>
                </div>

                <Textarea name="notes" placeholder="Any special notes..." className="rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner min-h-[100px]" />

                <Button className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-transform">
                  Record Transaction
                </Button>
              </form>
            )}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
