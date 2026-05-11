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
      <span className="text-[10px] font-bold text-center leading-tight text-muted-foreground uppercase tracking-widest px-1">
        {label}
      </span>
    </button>
  );

  const Modal = ({ title, children, open, onOpenChange }: any) => (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md animate-in fade-in duration-300" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[2.5rem] bg-white dark:bg-zinc-900 p-6 shadow-2xl animate-in zoom-in-95 duration-300 outline-none border border-black/5 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">{title}</Dialog.Title>
            <Dialog.Close className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <X className="h-5 w-5 text-zinc-500" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
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
        label="Empty Recv"
        onClick={() => {
          setOpenDialog("empty");
          setSearch("");
        }}
      />
      <ActionButton
        icon={PackageCheck}
        label="Filled Delv"
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
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative p-4 bg-white rounded-3xl mb-6">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=GasProPayment"
              alt="QR Code"
              className="w-48 h-48"
            />
          </div>
          <p className="text-center text-sm font-medium text-muted-foreground">
            Scan this QR code to make a payment to GasPro Agency
          </p>
        </div>
      </Modal>

      {/* Lists Modals */}
      {(["empty", "filled", "pending"] as const).map((type) => (
        <Modal
          key={type}
          title={
            type === "empty"
              ? "Empty Cylinders Received"
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
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{customer.fullName}</span>
                    <span className="text-sm font-black text-primary">
                      {type === "empty"
                        ? customer.totalEmptyCylindersReturned
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
