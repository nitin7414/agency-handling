"use client";

import { useState } from "react";
import { Search, Flame, User, X, MapPin, Phone, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";

import * as Dialog from "@radix-ui/react-dialog";
import { money } from "@/lib/utils";

interface Customer {
  id: string;
  fullName: string;
  area: string;
  fullAddress: string;
  phoneNumber: string;
  notes: string | null;
  totalCylindersReceived: number;
  totalEmptyCylindersReturned: number;
  totalPendingPayment: number;
  aadharUrl: string | null;
  panUrl: string | null;
  foodLicenseUrl: string | null;
  gstProofUrl: string | null;
}

export function DashboardHeader({ customers }: { customers: Customer[] }) {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const results = customers
    .filter(c => c.fullName.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 5);

  return (
    <header className="px-4 pt-6 pb-2 space-y-6 sm:px-0 sm:pt-0">
      <div className="flex items-center justify-between sm:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 dark:shadow-none overflow-hidden">
            <img src="/logo.png" alt="Shri Shyam Gas Agency Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="text-[20px] font-black uppercase tracking-[0.2em]">
              <span className="text-green-600">Shri Shyam</span>
              <span className="text-red-600"> Gas Agency</span>
            </p>
          </div>
        </div>
      </div>

      <div className="relative max-w-2xl">
        <div className="flex items-center rounded-2xl bg-white dark:bg-zinc-900 shadow-xl shadow-black/5 dark:shadow-none focus-within:ring-2 focus-within:ring-blue-600 transition-all overflow-hidden">
          <div className="pl-4 flex items-center justify-center">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            placeholder="Search any customer..."
            className="h-14 border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
        </div>

        {showResults && search.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
            {results.length > 0 ? (
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {results.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCustomer(c);
                      setShowResults(false);
                      setSearch("");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{c.fullName} <span className="text-[10px] text-muted-foreground ml-1">#{c.id.slice(0, 6).toUpperCase()}</span></p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{c.area}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-4 text-center text-sm text-muted-foreground">
                No customers found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      <Dialog.Root open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md animate-in fade-in duration-300" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Dialog.Content 
              aria-describedby={undefined}
              className="w-full max-w-md rounded-[2.5rem] bg-white dark:bg-zinc-900 p-8 shadow-2xl animate-in zoom-in-95 duration-300 outline-none border border-black/5 dark:border-white/10 overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              {selectedCustomer && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xl">
                        {selectedCustomer.fullName.charAt(0)}
                      </div>
                      <div>
                        <Dialog.Title className="text-xl font-black text-zinc-900 dark:text-white leading-tight">
                          {selectedCustomer.fullName}
                        </Dialog.Title>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{selectedCustomer.area}</p>
                          <span className="text-[10px] font-black text-muted-foreground bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-lg">#{selectedCustomer.id.slice(0, 6).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                    <Dialog.Close className="rounded-full p-2.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                      <X className="h-4 w-4 text-zinc-500" />
                    </Dialog.Close>
                  </div>

                <div className="space-y-4">
                   <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5 space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-muted-foreground">{selectedCustomer.fullAddress}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-blue-600 shrink-0" />
                        <p className="text-sm font-black text-zinc-900 dark:text-white">{selectedCustomer.phoneNumber}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-2">
                      <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5 text-center">
                        <p className="text-[8px] font-bold uppercase text-muted-foreground mb-1">Delivered</p>
                        <p className="text-sm font-black text-zinc-900 dark:text-white">{selectedCustomer.totalCylindersReceived}</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5 text-center">
                        <p className="text-[8px] font-bold uppercase text-muted-foreground mb-1">In Market</p>
                        <p className="text-sm font-black text-zinc-900 dark:text-white">{selectedCustomer.totalCylindersReceived - selectedCustomer.totalEmptyCylindersReturned}</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5 text-center">
                        <p className="text-[8px] font-bold uppercase text-muted-foreground mb-1">Due</p>
                        <p className="text-sm font-black text-blue-600">{money(selectedCustomer.totalPendingPayment)}</p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Documents</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: "Aadhar", url: selectedCustomer.aadharUrl },
                          { name: "PAN", url: selectedCustomer.panUrl },
                          { name: "Food Lic", url: selectedCustomer.foodLicenseUrl },
                          { name: "GST", url: selectedCustomer.gstProofUrl }
                        ].map((doc) => (
                          <div key={doc.name} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5">
                            <span className="text-[10px] font-bold text-muted-foreground">{doc.name}</span>
                            {doc.url ? (
                              <a href={doc.url} target="_blank" rel="noreferrer" className="text-[10px] font-black text-blue-600 uppercase">View</a>
                            ) : (
                              <span className="text-[10px] text-muted-foreground italic">NA</span>
                            )}
                          </div>
                        ))}
                      </div>
                   </div>

                   {selectedCustomer.notes && (
                     <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                        <p className="text-[10px] font-bold uppercase text-blue-600 mb-1">Notes</p>
                        <p className="text-xs text-muted-foreground italic">"{selectedCustomer.notes}"</p>
                     </div>
                   )}
                </div>
              </div>
            )}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
    </header>
  );
}
