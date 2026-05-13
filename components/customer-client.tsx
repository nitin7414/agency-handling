"use client";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Root as Dialog, Content as DialogContent, Title as DialogTitle, Trigger as DialogTrigger, Close as DialogClose, Portal as DialogPortal } from "@radix-ui/react-dialog";
import { 
  Edit, Phone, Search, X, MapPin, Plus, Zap, Users, 
  IndianRupee, Trash2, CheckCircle2, PartyPopper,
  ArrowRight, LayoutGrid, Filter, Info
} from "lucide-react";
import { createCustomer, createTransaction, markPaymentDone, deleteCustomer, updateCustomer } from "@/actions/customer-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { money } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { UploadButton } from "@/lib/uploadthing";

type Customer = {
  id: string; fullName: string; phoneNumber: string; fullAddress: string; area: string; notes: string | null; 
  totalCylindersReceived: number; totalEmptyCylindersReturned: number; totalPendingPayment: number; createdAt: Date;
  aadharUrl: string | null; panUrl: string | null; foodLicenseUrl: string | null; gstProofUrl: string | null;
  transactions: { id: string; filledCylindersDelivered: number; emptyCylindersReceived: number; paymentAmount: number; paidAmount: number; paymentStatus: "Pending" | "Done"; deliveryDate: Date; notes: string | null }[];
  paymentHistory: { id: string; amount: number; status: "Pending" | "Done"; paidAt: Date | null; createdAt: Date }[];
};

function SubmitButton({ children }: { children: React.ReactNode }) { 
  return <Button type="submit" className="w-full bg-primary text-white font-bold h-11 rounded-xl active:scale-95 transition-transform shadow-lg shadow-primary/20">{children}</Button>; 
}

export function CustomerClient({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [quickSaleOpenId, setQuickSaleOpenId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
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

  async function actionWrapper(
    action: (state: unknown, form: FormData) => Promise<{ ok: boolean; message: string }>, 
    form: FormData,
    onSuccess?: () => void
  ) { 
    const res = await action(null, form); 
    if (res.ok) {
       if (onSuccess) onSuccess();
       setShowSuccess(true);
       setTimeout(() => {
         setShowSuccess(false);
         setMessage("");
         router.refresh();
       }, 1000); // Popup stays for 1 second
    } else {
       setMessage(res.message); 
       setTimeout(() => setMessage(""), 3000);
    }
  }

  return (
    <main className="space-y-8 relative">
      
      {/* SUCCESS TOAST ANIMATION */}
      {showSuccess && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[300] bg-emerald-500 text-white px-10 py-8 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(16,185,129,0.5)] flex flex-col items-center gap-4 animate-in zoom-in-95 fade-in duration-300 backdrop-blur-md border border-white/20 text-center">
           <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
              <PartyPopper className="h-10 w-10 text-white" />
           </div>
           <div>
              <h4 className="text-2xl font-black mb-1">Success!</h4>
              <p className="text-xs font-bold text-emerald-50 uppercase tracking-[0.2em]">Transaction Recorded</p>
           </div>
        </div>
      )}

      {/* 2-Column Desktop Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Search & Quick Actions */}
        <div className="sm:col-span-4 space-y-6 sm:sticky sm:top-4">
          <section>
            <div className="flex items-center gap-2 mb-4">
               <div className="h-1.5 w-1.5 rounded-full bg-primary" />
               <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Directory Search</h2>
            </div>
            
            <div className="space-y-4">
              <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-lg shadow-black/5 p-1 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-3 px-4 py-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Search by name, area..." 
                    className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm font-medium h-10" 
                  />
                </div>
              </div>

              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                    <Plus className="h-5 w-5" /> Add New Customer
                  </Button>
                </DialogTrigger>
                <DialogPortal>
                  <DialogContent aria-describedby={undefined} className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-300">
                    <div className="w-full max-w-xl bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
                      <div className="p-5 sm:p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
                         <div>
                            <DialogTitle className="text-xl font-black text-foreground tracking-tight">New Customer</DialogTitle>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Onboarding</p>
                         </div>
                         <DialogClose className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-lg active:scale-90 transition-transform hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            <X className="h-5 w-5" />
                         </DialogClose>
                      </div>

                      <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar bg-white dark:bg-zinc-950">
                        {message && (
                          <div className="mb-6 rounded-xl bg-destructive/10 border border-destructive/20 p-3 animate-in fade-in slide-in-from-top-4">
                            <p className="text-xs font-bold text-destructive flex items-center gap-2">
                              <Zap className="h-3 w-3" /> {message}
                            </p>
                          </div>
                        )}
                        
                        <form action={(form) => actionWrapper(createCustomer, form, () => setAddDialogOpen(false))} className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                               <Input name="fullName" placeholder="John Doe" required className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner" />
                            </div>
                            <div className="space-y-1.5">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone</label>
                               <Input name="phoneNumber" placeholder="+91..." required className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner" />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Area</label>
                               <Input name="area" placeholder="Locality" required className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner" />
                            </div>
                            <div className="space-y-1.5">
                               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Address</label>
                               <Input name="fullAddress" placeholder="Full address" required className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner" />
                            </div>
                          </div>

                           <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                 <div className="h-px flex-1 bg-black/5 dark:bg-white/5"></div>
                                 <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">KYC Documents (Optional)</span>
                                 <div className="h-px flex-1 bg-black/5 dark:bg-white/5"></div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                  { name: "aadharUrl", label: "Aadhar Card" },
                                  { name: "panUrl", label: "PAN Card" },
                                  { name: "foodLicenseUrl", label: "Food License" },
                                  { name: "gstProofUrl", label: "GST Proof" }
                                ].map((doc) => (
                                  <div key={doc.name} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center gap-2 text-center overflow-hidden">
                                    <span className="text-[10px] font-bold uppercase text-muted-foreground">{doc.label}</span>
                                    <div className="w-full mt-1 flex justify-center">
                                       <UploadButton
                                          endpoint="customerDocument"
                                          onClientUploadComplete={(res) => {
                                            const input = document.getElementById(`new-${doc.name}`) as HTMLInputElement;
                                            if (input) input.value = res[0].url;
                                            alert(`${doc.label} uploaded!`);
                                          }}
                                          content={{ button: "Upload" }}
                                          appearance={{ 
                                            container: "w-full",
                                            button: "bg-primary/10 text-primary h-8 text-[10px] px-3 rounded-lg font-bold w-full truncate",
                                            allowedContent: "hidden" 
                                          }}
                                        />
                                    </div>
                                    <input type="hidden" name={doc.name} id={`new-${doc.name}`} />
                                  </div>
                                ))}
                              </div>
                           </div>
                          <div className="space-y-1.5 pt-2">
                             <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Notes</label>
                             <Textarea name="notes" placeholder="Optional notes..." className="rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner min-h-[80px]" />
                          </div>
                          
                          <div className="pt-4">
                             <SubmitButton>Register Customer</SubmitButton>
                          </div>
                        </form>
                      </div>
                    </div>
                  </DialogContent>
                </DialogPortal>
              </Dialog>
            </div>
          </section>

          <div className="hidden sm:block p-6 rounded-[2rem] bg-primary/5 border border-primary/10">
             <h3 className="text-sm font-black text-primary mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" /> Usage Guide
             </h3>
             <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                Use the search bar to find customers by name or area. The 'Quick Sale' button on cards allows for rapid entry of deliveries and collections.
             </p>
          </div>
        </div>

        {/* Right Column: Customer Grid */}
        <div className="sm:col-span-8 space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-4">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
               <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Customer Directory</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((customer) => (
                <div key={customer.id} className="group">
                  <article className="h-full rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 p-6 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/20 hover:-translate-y-1">
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl border border-primary/5">
                             {customer.fullName.charAt(0)}
                          </div>
                          <div>
                             <h2 className="text-xl font-black text-foreground leading-tight tracking-tight">{customer.fullName}</h2>
                             <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3 text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{customer.area}</span>
                             </div>
                          </div>
                       </div>
                       {Number(customer.totalPendingPayment) > 0 && (
                         <Badge className="bg-destructive text-white border-none rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-widest">
                           {money(Number(customer.totalPendingPayment))}
                         </Badge>
                       )}
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                       <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-3.5 text-center border border-black/5 dark:border-white/5">
                          <p className="text-[8px] font-bold uppercase text-muted-foreground tracking-wider mb-1">Empty</p>
                          <p className="text-base font-black text-primary">{Math.max(0, customer.totalCylindersReceived - customer.totalEmptyCylindersReturned)}</p>
                       </div>
                       <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-3.5 text-center border border-black/5 dark:border-white/5">
                          <p className="text-[8px] font-bold uppercase text-muted-foreground tracking-wider mb-1">Filled</p>
                          <p className="text-base font-black text-foreground">{customer.totalCylindersReceived}</p>
                       </div>
                       <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-3.5 text-center border border-black/5 dark:border-white/5">
                          <p className="text-[8px] font-bold uppercase text-muted-foreground tracking-wider mb-1">Pending</p>
                          <p className="text-base font-black text-destructive">{money(Number(customer.totalPendingPayment))}</p>
                       </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                       <Dialog>
                          <DialogTrigger asChild>
                             <Button className="flex-1 h-12 rounded-2xl bg-blue-600 text-white font-bold text-xs uppercase tracking-widest">
                                Profile <ArrowRight className="ml-2 h-4 w-4" />
                             </Button>
                          </DialogTrigger>
                          <DialogPortal>
                            <DialogContent aria-describedby={undefined} className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200">
                               <div className="w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-[2rem] shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
                           
                                  {/* HEADER */}
                                  <div className="p-4 sm:p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0 gap-3">
                                     <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-inner shrink-0">
                                           {customer.fullName.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                           <DialogTitle className="text-lg sm:text-xl font-black text-foreground tracking-tight truncate">
                                              {customer.fullName}
                                           </DialogTitle>
                                           <div className="flex items-center gap-2 mt-1">
                                              <Badge className="bg-primary/10 text-primary border-none rounded-md px-2 py-0.5 font-bold text-[10px] uppercase tracking-widest shrink-0">
                                                 {customer.area}
                                              </Badge>
                                              <a href={`tel:${customer.phoneNumber}`} className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors truncate">
                                                 <Phone className="h-3 w-3 shrink-0" /> 
                                                 <span className="truncate hidden sm:inline">{customer.phoneNumber}</span>
                                              </a>
                                           </div>
                                        </div>
                                     </div>

                                     <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                        <Dialog>
                                          <DialogTrigger asChild>
                                             <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground" title="Edit Profile">
                                               <Edit className="h-4 w-4" />
                                             </Button>
                                          </DialogTrigger>
                                          <DialogPortal>
                                             <DialogContent aria-describedby={undefined} className="fixed inset-0 z-[210] bg-background/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-300">
                                                <div className="w-full max-w-xl bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
                                                   <div className="p-5 sm:p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
                                                      <div>
                                                         <DialogTitle className="text-xl font-black text-foreground tracking-tight">Edit Customer</DialogTitle>
                                                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Update Profile</p>
                                                      </div>
                                                      <DialogClose className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-lg active:scale-90 transition-transform hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                                                         <X className="h-5 w-5" />
                                                      </DialogClose>
                                                   </div>

                                                   <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar bg-white dark:bg-zinc-950">
                                                      <form action={(form) => actionWrapper(updateCustomer, form)} className="space-y-6">
                                                         <input type="hidden" name="id" value={customer.id} />
                                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div className="space-y-1.5">
                                                               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                                               <Input name="fullName" defaultValue={customer.fullName} required className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner" />
                                                            </div>
                                                            <div className="space-y-1.5">
                                                               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone</label>
                                                               <Input name="phoneNumber" defaultValue={customer.phoneNumber} required className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner" />
                                                            </div>
                                                         </div>
                                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div className="space-y-1.5">
                                                               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Area</label>
                                                               <Input name="area" defaultValue={customer.area} required className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner" />
                                                            </div>
                                                            <div className="space-y-1.5">
                                                               <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Address</label>
                                                               <Input name="fullAddress" defaultValue={customer.fullAddress} required className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner" />
                                                            </div>
                                                         </div>
                                                         <div className="space-y-1.5">
                                                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Notes</label>
                                                            <Textarea name="notes" defaultValue={customer.notes || ""} placeholder="Optional notes..." className="rounded-xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner min-h-[80px]" />
                                                         </div>
                                                         <div className="pt-4">
                                                            <SubmitButton>Save Changes</SubmitButton>
                                                         </div>
                                                      </form>
                                                   </div>
                                                </div>
                                             </DialogContent>
                                          </DialogPortal>
                                        </Dialog>

                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          onClick={() => { if(confirm("Are you sure you want to delete this customer?")) deleteCustomer(customer.id).then(() => router.refresh()); }} 
                                          className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground shrink-0"
                                          title="Delete Customer"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                        
                                        <DialogClose className="h-9 w-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-black/5 dark:border-white/10 flex items-center justify-center shadow-sm active:scale-90 transition-transform hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 shrink-0">
                                          <X className="h-4 w-4" />
                                        </DialogClose>
                                     </div>
                                  </div>

                                  {/* BODY */}
                                  <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-950">
                                     <div className="p-5 sm:p-6 space-y-8">
                                        <div className="grid grid-cols-2 gap-4">
                                           <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 p-5 border border-emerald-100 dark:border-emerald-500/20 text-center shadow-sm">
                                              <p className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 mb-1 tracking-widest">Delivered Cylinders</p>
                                              <p className="text-3xl font-black text-emerald-700 dark:text-emerald-500">{customer.totalCylindersReceived}</p>
                                           </div>
                                           <div className="rounded-2xl bg-orange-50 dark:bg-orange-500/10 p-5 border border-orange-100 dark:border-orange-500/20 text-center shadow-sm">
                                              <p className="text-[10px] font-bold uppercase text-orange-600 dark:text-orange-400 mb-1 tracking-widest">Market (Empty)</p>
                                              <p className="text-3xl font-black text-orange-700 dark:text-orange-500">{Math.max(0, customer.totalCylindersReceived - customer.totalEmptyCylindersReturned)}</p>
                                           </div>
                                        </div>

                                        <div className="space-y-4">
                                           <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                             <div className="h-px flex-1 bg-black/5 dark:bg-white/5"></div>
                                             KYC Documents
                                             <div className="h-px flex-1 bg-black/5 dark:bg-white/5"></div>
                                           </h3>
                                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                               {[
                                                  { label: "Aadhar", url: customer.aadharUrl, name: "aadharUrl" },
                                                  { label: "PAN Card", url: customer.panUrl, name: "panUrl" },
                                                  { label: "Food Lic.", url: customer.foodLicenseUrl, name: "foodLicenseUrl" },
                                                  { label: "GST Proof", url: customer.gstProofUrl, name: "gstProofUrl" }
                                               ].map((doc) => (
                                                  <div key={doc.label} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-2 text-center group transition-colors hover:border-primary/30 overflow-hidden">
                                                     <span className="text-[10px] font-bold uppercase text-foreground">{doc.label}</span>
                                                     {doc.url && (
                                                        <a href={doc.url} target="_blank" className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 hover:underline mb-1">
                                                           <CheckCircle2 className="h-3 w-3" /> View Uploaded
                                                        </a>
                                                     )}
                                                     <div className="w-full">
                                                        <UploadButton
                                                           endpoint="customerDocument"
                                                           onClientUploadComplete={(res) => {
                                                             alert(`${doc.label} uploaded successfully!`);
                                                           }}
                                                           appearance={{ button: "bg-primary/10 text-primary h-8 text-[10px] px-3 rounded-lg font-bold w-full truncate mt-1" }}
                                                         />
                                                     </div>
                                                  </div>
                                               ))}
                                           </div>
                                        </div>
                                     </div>

                                     {/* FOOTER */}
                                     <div className="p-5 sm:p-6 border-t border-black/5 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/30">
                                        <div className="flex items-center justify-between mb-4">
                                           <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Recent Activity</h3>
                                           <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/5 shadow-sm">
                                              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Pending Dues</span>
                                              <span className={`text-xs font-black ${Number(customer.totalPendingPayment) > 0 ? "text-destructive" : "text-emerald-500"}`}>
                                                {money(Number(customer.totalPendingPayment))}
                                              </span>
                                           </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                           {customer.transactions.length > 0 ? (
                                              customer.transactions.slice().reverse().slice(0, 5).map((t) => (
                                                 <div key={t.id} className="p-3 rounded-xl bg-white dark:bg-zinc-950 border border-black/5 dark:border-white/5 flex items-center justify-between shadow-sm hover:border-primary/20 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                       <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${t.filledCylindersDelivered > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"}`}>
                                                          {t.filledCylindersDelivered > 0 ? <ArrowRight className="h-4 w-4" /> : <ArrowRight className="h-4 w-4 rotate-180" />}
                                                       </div>
                                                       <div>
                                                          <p className="text-xs font-black text-foreground">
                                                             {t.filledCylindersDelivered > 0 ? `Delivered: ${t.filledCylindersDelivered}` : `Collected: ${t.emptyCylindersReceived}`} Cylinders
                                                          </p>
                                                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                                                             {new Date(t.deliveryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                                          </p>
                                                       </div>
                                                    </div>
                                                    <div className="text-right flex flex-col items-end">
                                                       <p className="text-xs font-black text-primary">{money(Number(t.paymentAmount))}</p>
                                                       {t.paymentStatus === "Pending" && (
                                                          <p className="text-[8px] font-bold text-muted-foreground">Paid: {money(Number(t.paidAmount))}</p>
                                                       )}
                                                       <Badge className={`mt-1 border-none px-1.5 py-0 rounded text-[8px] font-black uppercase tracking-widest ${t.paymentStatus === "Done" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"}`}>
                                                          {t.paymentStatus}
                                                       </Badge>
                                                    </div>
                                                 </div>
                                              ))
                                           ) : (
                                              <div className="py-6 text-center rounded-xl border border-dashed border-black/10 dark:border-white/10">
                                                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No recent activity recorded</p>
                                              </div>
                                           )}
                                        </div>
                                     </div>
                                  </div>

                               </div>
                            </DialogContent>
                          </DialogPortal>
                       </Dialog>

                       {/* QUICK SALE COMPONENT */}
                       <Dialog open={quickSaleOpenId === customer.id} onOpenChange={(open) => setQuickSaleOpenId(open ? customer.id : null)}>
                          <DialogTrigger asChild>
                             <button className="h-12 w-12 rounded-2xl bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition-all group/btn shadow-lg shadow-primary/5">
                                <Plus className="h-6 w-6 group-hover/btn:rotate-90 transition-transform duration-300" />
                             </button>
                          </DialogTrigger>
                          <DialogPortal>
                             <DialogContent aria-describedby={undefined} className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-xl p-6 flex items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                                 <div className="w-full max-w-sm rounded-[2.5rem] bg-white dark:bg-zinc-950 p-10 shadow-2xl border border-black/5 dark:border-white/10 space-y-8 relative">
                                    <DialogClose className="absolute top-8 right-8 h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                                       <X className="h-5 w-5 text-foreground" />
                                    </DialogClose>
                                    
                                    <div className="text-center space-y-2">
                                       <DialogTitle className="text-2xl font-black text-foreground tracking-tight">Quick Sale</DialogTitle>
                                       <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{customer.fullName}</p>
                                    </div>

                                    <form action={(form) => actionWrapper(createTransaction, form, () => setQuickSaleOpenId(null))} className="space-y-6">
                                       <input type="hidden" name="customerId" value={customer.id} />
                                       <input type="hidden" name="paymentStatus" value="Done" />
                                       <input type="hidden" name="deliveryDate" value={new Date().toISOString().slice(0, 10)} />
                                       
                                       <div className="space-y-4">
                                           {/* CYLINDERS SECTION (Fill & Empty separated) */}
                                           <div className="grid grid-cols-2 gap-4">
                                              <div className="space-y-2">
                                                 <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Fill (Delivered)</label>
                                                 <Input 
                                                    name="filledCylindersDelivered" 
                                                    type="number" 
                                                    min="0" 
                                                    defaultValue="0" 
                                                    className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner text-2xl font-black text-center" 
                                                 />
                                              </div>
                                              <div className="space-y-2">
                                                 <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Empty (Collected)</label>
                                                 <Input 
                                                    name="emptyCylindersReceived" 
                                                    type="number" 
                                                    min="0" 
                                                    defaultValue="0" 
                                                    className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner text-2xl font-black text-center" 
                                                 />
                                              </div>
                                           </div>

                                           {/* MONEY SECTION (Due & Paid separated) */}
                                           <div className="grid grid-cols-2 gap-4 pt-2">
                                              <div className="space-y-2">
                                                 <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Due Amount</label>
                                                 <div className="relative">
                                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input name="dueAmount" type="number" min="0" placeholder="0" className="h-12 pl-10 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner text-lg font-black text-foreground" />
                                                 </div>
                                              </div>
                                              <div className="space-y-2">
                                                 <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Paid Amount</label>
                                                 <div className="relative">
                                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                                    <Input name="paidAmount" type="number" min="0" placeholder="0" className="h-12 pl-10 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none shadow-inner text-lg font-black text-primary" />
                                                 </div>
                                              </div>
                                           </div>
                                       </div>
                                       
                                       <SubmitButton>Confirm Transaction</SubmitButton>
                                    </form>
                                 </div>
                             </DialogContent>
                          </DialogPortal>
                       </Dialog>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-black/5 dark:border-white/10 shadow-xl shadow-black/5 p-20 text-center space-y-6">
                <div className="h-20 w-20 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto">
                   <Search className="h-10 w-10 text-muted-foreground opacity-20" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-foreground">No matches</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Try a different name or area</p>
                </div>
                <Button onClick={() => setQuery("")} variant="outline" className="rounded-xl px-8 h-12 font-bold uppercase tracking-widest text-[10px]">Clear</Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}