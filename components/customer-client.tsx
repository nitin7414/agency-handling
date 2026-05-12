"use client";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Root as Dialog, Content as DialogContent, Title as DialogTitle, Trigger as DialogTrigger, Close as DialogClose, Description as DialogDescription } from "@radix-ui/react-dialog";
import { CreditCard, Edit, PackagePlus, Phone, Search, X, MapPin, History, Plus, Zap, Users, IndianRupee, Trash2, Cylinder } from "lucide-react";
import { createCustomer, createTransaction, markPaymentDone, deleteCustomer } from "@/actions/customer-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { money } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { UploadButton } from "@/lib/uploadthing";
import { updateCustomer } from "@/actions/customer-actions";
import "@uploadthing/react/styles.css";

type Customer = {
  id: string; fullName: string; phoneNumber: string; fullAddress: string; area: string; notes: string | null; 
  totalCylindersReceived: number; totalEmptyCylindersReturned: number; totalPendingPayment: number; createdAt: Date;
  aadharUrl: string | null; panUrl: string | null; foodLicenseUrl: string | null; gstProofUrl: string | null;
  transactions: { id: string; filledCylindersDelivered: number; emptyCylindersReceived: number; paymentAmount: number; paymentStatus: "Pending" | "Done"; deliveryDate: Date; notes: string | null }[];
  paymentHistory: { id: string; amount: number; status: "Pending" | "Done"; paidAt: Date | null; createdAt: Date }[];
};

function SubmitButton({ children }: { children: React.ReactNode }) { 
  return <Button className="w-full bg-primary text-white font-bold h-12 rounded-2xl active:scale-95 transition-transform shadow-lg shadow-primary/20">{children}</Button>; 
}

export function CustomerClient({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"Delivery" | "Collection">("Delivery");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setAddDialogOpen(true);
    }
  }, [searchParams]);
  
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
      <section>
        <div className="flex items-center gap-2 mb-4">
           <div className="h-1.5 w-1.5 rounded-full bg-primary" />
           <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Search & Discovery</h2>
        </div>
        <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 p-2 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-3 px-4 py-2">
            <Search className="h-5 w-5 text-primary" />
            <input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Search customers..." 
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm font-medium" 
            />
          </div>
        </div>
      </section>

      {message && (
        <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4 animate-in fade-in slide-in-from-top-4">
          <p className="text-sm font-bold text-primary flex items-center gap-2">
            <Zap className="h-4 w-4" /> {message}
          </p>
        </div>
      )}

      {/* Add New Customer Button */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full h-14 rounded-3xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 touch-card" size="lg">
            <Plus className="mr-2 h-6 w-6" /> Add Customer
          </Button>
        </DialogTrigger>
        <DialogContent aria-describedby={undefined} className="fixed inset-0 z-[100] bg-background p-6 flex flex-col animate-in fade-in slide-in-from-bottom-full duration-300 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <DialogTitle className="text-3xl font-black text-foreground">New Customer</DialogTitle>
            <DialogClose className="h-10 w-10 rounded-full glass flex items-center justify-center">
               <X className="h-6 w-6 text-foreground" />
            </DialogClose>
          </div>
          
          <form action={(form) => actionWrapper(createCustomer, form)} className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">General Info</label>
               <Input name="fullName" placeholder="Full Name" required className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-sm" />
               <Input name="phoneNumber" placeholder="Phone Number" required className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-sm" />
            </div>
            
            <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Location</label>
               <Input name="area" placeholder="Area / Locality" required className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-sm" />
               <Textarea name="fullAddress" placeholder="Full Street Address" required className="min-h-[100px] rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-sm" />
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Documents</label>
               <div className="grid grid-cols-2 gap-4">
                 {[
                   { name: "aadharUrl", label: "Aadhar Card" },
                   { name: "panUrl", label: "PAN Card" },
                   { name: "foodLicenseUrl", label: "Food License" },
                   { name: "gstProofUrl", label: "GST Proof" }
                 ].map((doc) => (
                   <div key={doc.name} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-2">
                     <span className="text-[9px] font-bold uppercase text-muted-foreground">{doc.label}</span>
                     <UploadButton
                        endpoint="customerDocument"
                        onClientUploadComplete={(res) => {
                          const input = document.getElementById(`new-${doc.name}`) as HTMLInputElement;
                          if (input) input.value = res[0].url;
                          alert(`${doc.label} uploaded!`);
                        }}
                        appearance={{ button: "bg-primary h-8 text-[10px] px-3 rounded-lg" }}
                      />
                      <input type="hidden" name={doc.name} id={`new-${doc.name}`} />
                   </div>
                 ))}
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Additional</label>
               <Textarea name="notes" placeholder="Notes (Optional)" className="rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-sm" />
            </div>
            
            <div className="pt-4 sticky bottom-0 bg-background pb-4">
               <SubmitButton>Save Customer</SubmitButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Customer Grid */}
      <section className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-2 mb-2">
           <div className="h-1.5 w-1.5 rounded-full bg-primary" />
           <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Directory</h2>
        </div>
        {filtered.map((customer) => (
          <div key={customer.id}>
            <article className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Users className="h-12 w-12 text-primary" />
              </div>
              
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-left group outline-none">
                          <h2 className="text-xl font-black text-foreground leading-tight group-hover:text-primary transition-colors">{customer.fullName}</h2>
                          <div className="flex items-center gap-1 text-primary mt-1">
                             <MapPin className="h-3 w-3" />
                             <span className="text-[11px] font-bold uppercase tracking-wider">{customer.area}</span>
                          </div>
                        </button>
                      </DialogTrigger>
                      <DialogContent aria-describedby={undefined} className="fixed inset-0 z-[100] bg-background p-6 flex flex-col animate-in fade-in zoom-in-95 duration-300 overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                           <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-black text-xl">
                                 {customer.fullName.charAt(0)}
                              </div>
                              <div>
                                 <DialogTitle className="text-2xl font-black text-foreground leading-tight">{customer.fullName}</DialogTitle>
                                 <p className="text-xs font-bold text-primary uppercase tracking-widest">{customer.area}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <button 
                                onClick={async () => {
                                  if (window.confirm("Are you sure you want to delete this customer? This will also delete all their transaction history.")) {
                                    const res = await deleteCustomer(customer.id);
                                    if (res.ok) {
                                      router.refresh();
                                    } else {
                                      alert(res.message);
                                    }
                                  }
                                }}
                                className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center group"
                                title="Delete Customer"
                              >
                                <Trash2 className="h-5 w-5 text-destructive group-hover:scale-110 transition-transform" />
                              </button>
                              <button 
                                onClick={() => {
                                  const form = document.getElementById(`edit-form-${customer.id}`);
                                  form?.classList.toggle('hidden');
                                }}
                                className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
                              >
                                <Edit className="h-5 w-5 text-zinc-600" />
                              </button>
                              <DialogClose className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                 <X className="h-6 w-6 text-foreground" />
                              </DialogClose>
                           </div>
                        </div>

                        <div className="space-y-6">
                           {/* Edit Form (Hidden by default) */}
                           <div id={`edit-form-${customer.id}`} className="hidden space-y-4 p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 animate-in fade-in slide-in-from-top-4">
                              <h3 className="text-sm font-black uppercase tracking-widest text-primary">Edit Customer</h3>
                              <form action={(form) => actionWrapper((_, f) => updateCustomer(customer.id, f), form)} className="space-y-4">
                                 <Input name="fullName" defaultValue={customer.fullName} placeholder="Full Name" className="h-12 rounded-xl border-none shadow-sm" />
                                 <Input name="phoneNumber" defaultValue={customer.phoneNumber} placeholder="Phone Number" className="h-12 rounded-xl border-none shadow-sm" />
                                 <Input name="area" defaultValue={customer.area} placeholder="Area" className="h-12 rounded-xl border-none shadow-sm" />
                                 <Textarea name="fullAddress" defaultValue={customer.fullAddress} placeholder="Address" className="rounded-xl border-none shadow-sm" />
                                 
                                 <div className="grid grid-cols-2 gap-3">
                                   {[
                                     { name: "aadharUrl", label: "Aadhar", val: customer.aadharUrl },
                                     { name: "panUrl", label: "PAN", val: customer.panUrl },
                                     { name: "foodLicenseUrl", label: "Food Lic", val: customer.foodLicenseUrl },
                                     { name: "gstProofUrl", label: "GST Proof", val: customer.gstProofUrl }
                                   ].map((doc) => (
                                     <div key={doc.name} className="space-y-2">
                                       <p className="text-[9px] font-bold uppercase text-muted-foreground ml-1">{doc.label}</p>
                                       <UploadButton
                                          endpoint="customerDocument"
                                          onClientUploadComplete={(res) => {
                                            const input = document.getElementById(`edit-${customer.id}-${doc.name}`) as HTMLInputElement;
                                            if (input) input.value = res[0].url;
                                            alert(`${doc.label} updated!`);
                                          }}
                                          appearance={{ button: "w-full bg-zinc-200 dark:bg-zinc-800 h-8 text-[9px] text-zinc-600 rounded-lg" }}
                                        />
                                        <input type="hidden" name={doc.name} id={`edit-${customer.id}-${doc.name}`} defaultValue={doc.val || ""} />
                                     </div>
                                   ))}
                                 </div>
                                 
                                 <Button className="w-full bg-primary text-white font-bold h-10 rounded-xl">Update Details</Button>
                              </form>
                           </div>

                           {/* Contact & Address */}
                           <div className="rounded-3xl bg-zinc-50 dark:bg-zinc-900 p-5 space-y-3 shadow-sm border border-black/5 dark:border-white/5">
                              <div className="flex items-start gap-3">
                                 <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                 <p className="text-sm font-medium text-muted-foreground">{customer.fullAddress}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                 <Phone className="h-5 w-5 text-primary shrink-0" />
                                 <a href={`tel:${customer.phoneNumber}`} className="text-sm font-black text-foreground underline decoration-blue-600/30 underline-offset-4">{customer.phoneNumber}</a>
                              </div>
                           </div>

                           {/* Documents View */}
                           <div className="grid grid-cols-2 gap-3">
                             {[
                               { name: "Aadhar", url: customer.aadharUrl },
                               { name: "PAN", url: customer.panUrl },
                               { name: "Food Lic", url: customer.foodLicenseUrl },
                               { name: "GST Proof", url: customer.gstProofUrl }
                             ].map((doc) => (
                               <div key={doc.name} className="rounded-2xl p-4 bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex flex-col items-center gap-2">
                                 <p className="text-[9px] font-bold uppercase text-muted-foreground">{doc.name}</p>
                                 {doc.url ? (
                                   <a href={doc.url} target="_blank" rel="noreferrer" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View Doc</a>
                                 ) : (
                                   <span className="text-[10px] font-medium text-muted-foreground italic">Missing</span>
                                 )}
                               </div>
                             ))}
                           </div>

                           {/* Stats Grid */}
                           <div className="grid grid-cols-3 gap-2">
                              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-3 text-center border border-black/5 dark:border-white/5">
                                 <p className="text-[8px] font-bold uppercase text-muted-foreground mb-1">Delivered</p>
                                 <p className="text-sm font-black text-foreground">{customer.totalCylindersReceived}</p>
                              </div>
                              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-3 text-center border border-black/5 dark:border-white/5">
                                 <p className="text-[8px] font-bold uppercase text-muted-foreground mb-1">In Market</p>
                                 <p className="text-sm font-black text-primary">{customer.totalCylindersReceived - customer.totalEmptyCylindersReturned}</p>
                              </div>
                              <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-3 text-center border border-black/5 dark:border-white/5">
                                 <p className="text-[8px] font-bold uppercase text-muted-foreground mb-1">Pending</p>
                                 <p className="text-sm font-black text-primary">{money(Number(customer.totalPendingPayment))}</p>
                              </div>
                           </div>

                           {/* Add Transaction Form */}
                           <form action={(form) => actionWrapper(createTransaction, form)} className="space-y-4 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 p-6">
                              <div className="flex items-center gap-2 mb-2">
                                 <PackagePlus className="h-5 w-5 text-primary" />
                                 <h3 className="text-lg font-black text-foreground">Record New Sale</h3>
                              </div>
                              <input type="hidden" name="customerId" value={customer.id} />
                              
                              <div className="space-y-4">
                                 <div className="flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/5">
                                    {["Delivery", "Collection"].map((type) => (
                                       <button
                                          key={type}
                                          type="button"
                                          onClick={() => setActionType(type as any)}
                                          className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                             actionType === type 
                                                ? "bg-white dark:bg-zinc-700 text-primary shadow-sm" 
                                                : "text-muted-foreground"
                                          }`}
                                       >
                                          {type}
                                       </button>
                                    ))}
                                 </div>

                                 <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                       {actionType === "Delivery" ? "Cylinders Delivered" : "Cylinders Collected"}
                                    </label>
                                    <div className="relative">
                                       <Cylinder className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${actionType === "Delivery" ? "text-emerald-500" : "text-orange-500"}`} />
                                       <Input 
                                          name={actionType === "Delivery" ? "filledCylindersDelivered" : "emptyCylindersReceived"} 
                                          type="number" 
                                          min="0" 
                                          defaultValue="1" 
                                          className="h-12 pl-12 rounded-xl glass border-white/5 font-black text-foreground" 
                                       />
                                       <input type="hidden" name={actionType === "Delivery" ? "emptyCylindersReceived" : "filledCylindersDelivered"} value="0" />
                                    </div>
                                 </div>
                              </div>

                              <div className="space-y-1.5">
                                 <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Payment Amount</label>
                                 <div className="relative">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                    <Input name="paymentAmount" type="number" min="0" placeholder="Amount paid" className="h-12 pl-10 rounded-xl glass border-white/5 font-black text-foreground" />
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                 <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Status</label>
                                    <select name="paymentStatus" className="h-12 w-full rounded-xl glass border-white/5 px-4 text-sm font-bold text-foreground outline-none">
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
                                 <h3 className="text-lg font-black text-foreground">Recent Transactions</h3>
                              </div>
                              {customer.transactions.length === 0 ? (
                                 <p className="text-sm text-muted-foreground italic px-2">No transactions recorded yet.</p>
                              ) : (
                                 <div className="space-y-3">
                                    {customer.transactions.map((t) => (
                                       <div key={t.id} className="rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm p-4 flex flex-col gap-3">
                                          <div className="flex justify-between items-start">
                                             <div>
                                                <p className="text-xs font-black text-foreground">{new Date(t.deliveryDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                <p className="text-[10px] font-medium text-muted-foreground mt-0.5 uppercase tracking-wide">
                                                   {t.filledCylindersDelivered > 0 
                                                     ? `${t.filledCylindersDelivered} Delivered` 
                                                     : `${t.emptyCylindersReceived} Collected`}
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
                                             <span className="text-sm font-black text-foreground">{money(Number(t.paymentAmount))}</span>
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
                 </div>
                 {Number(customer.totalPendingPayment) > 0 && (
                   <Badge className="bg-destructive text-foreground border-none rounded-full px-3 py-1 font-black text-[10px]">
                     DUE {money(Number(customer.totalPendingPayment))}
                   </Badge>
                 )}
              </div>

              <p className="text-xs text-muted-foreground line-clamp-1 mb-6 flex items-center gap-2">
                 <Phone className="h-3 w-3" /> {customer.phoneNumber}
              </p>

              <div className="flex gap-2">
                 <div className="flex-1 bg-primary/5 rounded-2xl p-3 text-center border border-blue-600/10">
                    <p className="text-[9px] font-bold uppercase text-muted-foreground mb-1">Cylinders</p>
                    <p className="text-sm font-black text-primary">{customer.totalCylindersReceived}</p>
                 </div>
                 <div className="flex-1 bg-primary/5 rounded-2xl p-3 text-center border border-blue-600/10">
                    <p className="text-[9px] font-bold uppercase text-muted-foreground mb-1">In Market</p>
                    <p className="text-sm font-black text-primary">{customer.totalCylindersReceived - customer.totalEmptyCylindersReturned}</p>
                 </div>
                 
                 {/* Quick Sale Dialog */}
                 <Dialog>
                    <DialogTrigger asChild>
                      <button className="flex items-center justify-center bg-primary h-12 w-12 rounded-2xl text-white shadow-lg shadow-primary/20 active:scale-90 transition-transform">
                         <Plus className="h-6 w-6" />
                      </button>
                    </DialogTrigger>
                    <DialogContent aria-describedby={undefined} className="fixed inset-0 z-[110] bg-background p-6 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                       <div className="w-full max-w-sm rounded-[2.5rem] bg-white dark:bg-zinc-900 p-8 shadow-2xl border border-black/5 dark:border-white/10 space-y-6 relative">
                          <DialogClose className="absolute top-6 right-6 h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                             <X className="h-5 w-5 text-foreground" />
                          </DialogClose>

                          <div className="text-center space-y-1">
                             <DialogTitle className="text-xl font-black text-foreground">Quick Sale</DialogTitle>
                             <p className="text-xs font-bold text-primary uppercase tracking-widest">{customer.fullName}</p>
                          </div>

                          <form action={(form) => actionWrapper(createTransaction, form)} className="space-y-5">
                             <input type="hidden" name="customerId" value={customer.id} />
                             <input type="hidden" name="paymentStatus" value="Done" />
                             <input type="hidden" name="deliveryDate" value={new Date().toISOString().slice(0, 10)} />
                             
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

                                 <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                       {actionType === "Delivery" ? "Cylinders Delivered" : "Cylinders Collected"}
                                    </label>
                                    <div className="relative">
                                       <Cylinder className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${actionType === "Delivery" ? "text-emerald-500" : "text-orange-500"}`} />
                                       <Input 
                                          name={actionType === "Delivery" ? "filledCylindersDelivered" : "emptyCylindersReceived"} 
                                          type="number" 
                                          min="0" 
                                          defaultValue="1" 
                                          className="h-14 pl-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner text-lg font-black text-center" 
                                       />
                                       <input type="hidden" name={actionType === "Delivery" ? "emptyCylindersReceived" : "filledCylindersDelivered"} value="0" />
                                    </div>
                                 </div>
                              </div>

                             <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Payment Amount</label>
                                <div className="relative">
                                   <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-4 text-primary" />
                                   <Input name="paymentAmount" type="number" min="0" placeholder="0" className="h-14 pl-10 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner text-lg font-black text-center text-primary" />
                                </div>
                             </div>

                             <div className="pt-2">
                                <SubmitButton>Record Transaction</SubmitButton>
                             </div>
                          </form>
                       </div>
                    </DialogContent>
                 </Dialog>
              </div>
            </article>
          </div>
        ))}
      </section>

      {filtered.length === 0 && (
        <div className="rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 p-12 text-center">
          <p className="text-muted-foreground font-medium italic">No customers match your search.</p>
        </div>
      )}
    </main>
  );
}
