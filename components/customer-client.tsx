"use client";
import { useMemo, useState } from "react";
import { Root as Dialog, Content as DialogContent, Title as DialogTitle, Trigger as DialogTrigger, Close as DialogClose, Description as DialogDescription } from "@radix-ui/react-dialog";
import { CreditCard, Edit, PackagePlus, Phone, Search, X, MapPin, History, Plus, Zap, Users, IndianRupee } from "lucide-react";
import { createCustomer, createTransaction, markPaymentDone } from "@/actions/customer-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { money } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Customer = {
  id: string; fullName: string; phoneNumber: string; fullAddress: string; area: string; notes: string | null; totalCylindersReceived: number; totalEmptyCylindersReturned: number; totalPendingPayment: number; createdAt: Date;
  transactions: { id: string; filledCylindersDelivered: number; emptyCylindersReceived: number; paymentAmount: number; paymentStatus: "Pending" | "Done"; deliveryDate: Date; notes: string | null }[];
  paymentHistory: { id: string; amount: number; status: "Pending" | "Done"; paidAt: Date | null; createdAt: Date }[];
};

function SubmitButton({ children }: { children: React.ReactNode }) { 
  return <Button className="w-full bg-primary text-black font-bold h-12 rounded-2xl active:scale-95 transition-transform">{children}</Button>; 
}

export function CustomerClient({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  
  const filtered = useMemo(() => { 
    const q = query.toLowerCase(); 
    return customers.filter((c) => [c.fullName, c.area, c.fullAddress, c.phoneNumber].some((v) => v.toLowerCase().includes(q))); 
  }, [customers, query]);

  async function actionWrapper(action: (state: unknown, form: FormData) => Promise<{ ok: boolean; message: string }>, form: FormData) { 
    const res = await action(null, form); 
    setMessage(res.message); 
    if (res.ok) {
       setTimeout(() => setMessage(""), 3000);
    }
  }

  return (
    <main className="space-y-6 px-4 pb-24 pt-4">
      {/* Search Bar */}
      <div className="sticky top-[80px] z-30 glass-card rounded-3xl p-2 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-3 px-4 py-2">
          <Search className="h-5 w-5 text-primary" />
          <input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Search customers..." 
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-muted-foreground text-sm font-medium" 
          />
        </div>
      </div>

      {message && (
        <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4 animate-in fade-in slide-in-from-top-4">
          <p className="text-sm font-bold text-primary flex items-center gap-2">
            <Zap className="h-4 w-4" /> {message}
          </p>
        </div>
      )}

      {/* Add New Customer Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full h-14 rounded-3xl bg-primary text-black font-black text-lg shadow-xl shadow-primary/20 touch-card" size="lg">
            <Plus className="mr-2 h-6 w-6" /> Add Customer
          </Button>
        </DialogTrigger>
        <DialogContent aria-describedby={undefined} className="fixed inset-0 z-[100] bg-background p-6 flex flex-col animate-in fade-in slide-in-from-bottom-full duration-300 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <DialogTitle className="text-3xl font-black text-white">New Customer</DialogTitle>
            <DialogClose className="h-10 w-10 rounded-full glass flex items-center justify-center">
               <X className="h-6 w-6 text-white" />
            </DialogClose>
          </div>
          
          <form action={(form) => actionWrapper(createCustomer, form)} className="space-y-4">
            <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">General Info</label>
               <Input name="fullName" placeholder="Full Name" required className="h-14 rounded-2xl glass-card border-white/5" />
               <Input name="phoneNumber" placeholder="Phone Number" required className="h-14 rounded-2xl glass-card border-white/5" />
            </div>
            
            <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Location</label>
               <Input name="area" placeholder="Area / Locality" required className="h-14 rounded-2xl glass-card border-white/5" />
               <Textarea name="fullAddress" placeholder="Full Street Address" required className="min-h-[100px] rounded-2xl glass-card border-white/5" />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Additional</label>
               <Textarea name="notes" placeholder="Notes (Optional)" className="rounded-2xl glass-card border-white/5" />
            </div>
            
            <div className="pt-4">
               <SubmitButton>Save Customer</SubmitButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Customer Grid */}
      <section className="grid grid-cols-1 gap-4">
        {filtered.map((customer) => (
          <Dialog key={customer.id}>
            <DialogTrigger asChild>
              <article className="glass-card rounded-[2rem] p-5 touch-card group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                   <Users className="h-12 w-12 text-primary" />
                </div>
                
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <h2 className="text-xl font-black text-white leading-tight">{customer.fullName}</h2>
                      <div className="flex items-center gap-1 text-primary mt-1">
                         <MapPin className="h-3 w-3" />
                         <span className="text-[11px] font-bold uppercase tracking-wider">{customer.area}</span>
                      </div>
                   </div>
                   {Number(customer.totalPendingPayment) > 0 && (
                     <Badge className="bg-destructive text-white border-none rounded-full px-3 py-1 font-black text-[10px]">
                       DUE {money(Number(customer.totalPendingPayment))}
                     </Badge>
                   )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-1 mb-6 flex items-center gap-2">
                   <Phone className="h-3 w-3" /> {customer.phoneNumber}
                </p>

                <div className="flex gap-2">
                   <div className="flex-1 bg-white/5 rounded-2xl p-3 text-center">
                      <p className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Cylinders</p>
                      <p className="text-sm font-black text-white">{customer.totalCylindersReceived}</p>
                   </div>
                   <div className="flex-1 bg-white/5 rounded-2xl p-3 text-center">
                      <p className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Balance</p>
                      <p className="text-sm font-black text-white">{customer.totalEmptyCylindersReturned}</p>
                   </div>
                   <div className="flex items-center justify-center bg-primary h-12 w-12 rounded-2xl text-black">
                      <Plus className="h-6 w-6" />
                   </div>
                </div>
              </article>
            </DialogTrigger>
            
            <DialogContent aria-describedby={undefined} className="fixed inset-0 z-[100] bg-background p-6 flex flex-col animate-in fade-in zoom-in-95 duration-300 overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xl">
                       {customer.fullName.charAt(0)}
                    </div>
                    <div>
                       <DialogTitle className="text-2xl font-black text-white leading-tight">{customer.fullName}</DialogTitle>
                       <p className="text-xs font-bold text-primary uppercase tracking-widest">{customer.area}</p>
                    </div>
                 </div>
                 <DialogClose className="h-10 w-10 rounded-full glass flex items-center justify-center">
                    <X className="h-6 w-6 text-white" />
                 </DialogClose>
              </div>

              <div className="space-y-6">
                 {/* Contact & Address */}
                 <div className="rounded-3xl bg-white/5 p-5 space-y-3">
                    <div className="flex items-start gap-3">
                       <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                       <p className="text-sm font-medium text-slate-300">{customer.fullAddress}</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <Phone className="h-5 w-5 text-primary shrink-0" />
                       <a href={`tel:${customer.phoneNumber}`} className="text-sm font-black text-white underline decoration-primary/30 underline-offset-4">{customer.phoneNumber}</a>
                    </div>
                 </div>

                 {/* Stats Grid */}
                 <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card rounded-2xl p-4 text-center">
                       <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Total Cylinders</p>
                       <p className="text-xl font-black text-white">{customer.totalCylindersReceived}</p>
                    </div>
                    <div className="glass-card rounded-2xl p-4 text-center">
                       <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Pending Amount</p>
                       <p className="text-xl font-black text-primary">{money(Number(customer.totalPendingPayment))}</p>
                    </div>
                 </div>

                 {/* Add Transaction Form */}
                 <form action={(form) => actionWrapper(createTransaction, form)} className="space-y-4 glass-card rounded-3xl p-6 border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                       <PackagePlus className="h-5 w-5 text-primary" />
                       <h3 className="text-lg font-black text-white">Record New Sale</h3>
                    </div>
                    <input type="hidden" name="customerId" value={customer.id} />
                    
                    <div className="grid grid-cols-2 gap-3">
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Delivered</label>
                          <Input name="filledCylindersDelivered" type="number" min="0" placeholder="0" defaultValue="1" className="h-12 rounded-xl glass border-white/5" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Received Empty</label>
                          <Input name="emptyCylindersReceived" type="number" min="0" placeholder="0" defaultValue="0" className="h-12 rounded-xl glass border-white/5" />
                       </div>
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Payment Amount</label>
                       <div className="relative">
                          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                          <Input name="paymentAmount" type="number" min="0" placeholder="Amount paid" className="h-12 pl-10 rounded-xl glass border-white/5 font-black text-white" />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Status</label>
                          <select name="paymentStatus" className="h-12 w-full rounded-xl glass border-white/5 px-4 text-sm font-bold text-white outline-none">
                             <option value="Pending" className="bg-background">Pending</option>
                             <option value="Done" className="bg-background">Paid Full</option>
                          </select>
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Date</label>
                          <Input name="deliveryDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="h-12 rounded-xl glass border-white/5" />
                       </div>
                    </div>

                    <Textarea name="notes" placeholder="Transaction notes..." className="rounded-xl glass border-white/5 min-h-[80px]" />
                    
                    <SubmitButton>Record Transaction</SubmitButton>
                 </form>

                 {/* History Sections */}
                 <section className="space-y-4 pb-8">
                    <div className="flex items-center gap-2">
                       <History className="h-5 w-5 text-primary" />
                       <h3 className="text-lg font-black text-white">Recent Transactions</h3>
                    </div>
                    {customer.transactions.length === 0 ? (
                       <p className="text-sm text-muted-foreground italic px-2">No transactions recorded yet.</p>
                    ) : (
                       <div className="space-y-3">
                          {customer.transactions.map((t) => (
                             <div key={t.id} className="glass-card rounded-2xl p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                   <div>
                                      <p className="text-xs font-black text-white">{new Date(t.deliveryDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                      <p className="text-[10px] font-medium text-muted-foreground mt-0.5 uppercase tracking-wide">
                                         {t.filledCylindersDelivered} In / {t.emptyCylindersReceived} Out
                                      </p>
                                   </div>
                                   <Badge className={cn(
                                      "rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest",
                                      t.paymentStatus === "Done" ? "bg-primary text-black" : "bg-destructive/20 text-destructive border-destructive/30"
                                   )}>
                                      {t.paymentStatus}
                                   </Badge>
                                </div>
                                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                   <span className="text-sm font-black text-white">{money(Number(t.paymentAmount))}</span>
                                   {t.paymentStatus === "Pending" && (
                                      <Button 
                                         size="sm" 
                                         className="h-8 rounded-lg bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-wider px-3"
                                         onClick={() => markPaymentDone(t.id)}
                                      >
                                         Mark Paid
                                      </Button>
                                   )}
                                </div>
                                {t.notes && <p className="text-[10px] text-muted-foreground italic">"{t.notes}"</p>}
                             </div>
                          ))}
                       </div>
                    )}
                 </section>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </section>

      {filtered.length === 0 && (
        <div className="glass-card rounded-[2rem] p-12 text-center">
          <p className="text-muted-foreground font-medium italic">No customers match your search.</p>
        </div>
      )}
    </main>
  );
}
