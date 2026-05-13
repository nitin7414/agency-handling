"use client";

import { useState } from "react";
import { QrCode, PackageOpen, PackageCheck, Wallet, Search, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { money } from "@/lib/utils";

interface CustomerData {
  id: string;
  fullName: string;
  totalCylindersReceived: number;
  totalEmptyCylindersReturned: number;
  totalPendingPayment: string | number;
}

interface DashboardActionsProps {
  customers: CustomerData[];
}

export function DashboardActions({ customers }: DashboardActionsProps) {
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter((c) =>
    c.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const ActionButton = ({ icon: Icon, label, onClick }: any) => (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-3 transition-transform active:scale-95"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-primary shadow-lg shadow-primary/20">
        <Icon className="h-7 w-7 text-white" />
      </div>
      <span className="text-[10px] font-bold text-center leading-tight text-white uppercase tracking-widest px-1">
        {label}
      </span>
    </button>
  );

  const Modal = ({ title, children, open, onOpenChange }: any) => (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md animate-in fade-in duration-300" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Content 
            aria-describedby={undefined}
            className="w-[92%] max-w-md rounded-[2.5rem] bg-white dark:bg-zinc-900 p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-200 ease-in-out outline-none border border-black/5 dark:border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex items-center justify-between mb-8">
              <Dialog.Title className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">{title}</Dialog.Title>
              <Dialog.Close className="h-11 w-11 rounded-full p-2.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center">
                <X className="h-5 w-5 text-zinc-500" />
              </Dialog.Close>
            </div>
            {children}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );

  return (
    <div className="grid grid-cols-4 gap-2 py-2">
      <ActionButton
        icon={QrCode}
        label="Accept Money"
        onClick={() => setOpenDialog("qr")}
      />
      <ActionButton
        icon={PackageOpen}
        label="Empty"
        onClick={() => {
          setOpenDialog("empty");
          setSearch("");
        }}
      />
      <ActionButton
        icon={PackageCheck}
        label="Filled"
        onClick={() => {
          setOpenDialog("filled");
          setSearch("");
        }}
      />
      <ActionButton
        icon={Wallet}
        label="Pending Pay"
        onClick={() => {
          setOpenDialog("pending");
          setSearch("");
        }}
      />

      {/* QR Code Modal */}
      <Modal
        title="Accept Payment"
        open={openDialog === "qr"}
        onOpenChange={(open: boolean) => !open && setOpenDialog(null)}
      >
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative p-6 bg-white rounded-[3rem] mb-8 border border-black/5 shadow-inner flex items-center justify-center aspect-square w-64 mx-auto overflow-hidden">
            <img
              src="/qr_code.jpeg"
              alt="QR Code"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">Scan & Pay</p>
            <p className="text-xs font-medium text-muted-foreground max-w-[200px] mx-auto">
              Use any UPI app to pay Shri Shyam Gas Agency directly.
            </p>
          </div>
        </div>
      </Modal>

      {/* Lists Modals */}
      {(["empty", "filled", "pending"] as const).map((type) => (
        <Modal
          key={type}
          title={
            type === "empty"
              ? "Empty Cylinders In Market"
              : type === "filled"
              ? "Filled Cylinders Delivered"
              : "Pending Payments"
          }
          open={openDialog === type}
          onOpenChange={(open: boolean) => !open && setOpenDialog(null)}
        >
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customer..."
                className="pl-10 rounded-2xl bg-white/5 border-white/10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {filteredCustomers
                .map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-white/5"
                  >
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {customer.fullName} <span className="text-[10px] text-muted-foreground ml-1">#{customer.id.slice(0, 6).toUpperCase()}</span>
                    </span>
                    <span className="text-sm font-black text-primary">
                      {type === "empty"
                        ? customer.totalCylindersReceived - customer.totalEmptyCylindersReturned
                        : type === "filled"
                        ? customer.totalCylindersReceived
                        : money(Number(customer.totalPendingPayment))}
                    </span>
                  </div>
                ))}
              {filteredCustomers.length === 0 && (
                <p className="text-center py-8 text-sm text-muted-foreground">No customers found</p>
              )}
            </div>
          </div>
        </Modal>
      ))}
    </div>
  );
}
