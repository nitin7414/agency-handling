"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignOutButton({ label }: { label?: string }) {
  return <Button variant="secondary" size={label ? "default" : "icon"} onClick={() => signOut({ callbackUrl: "/login" })} aria-label="Logout"><LogOut className="h-5 w-5" />{label}</Button>;
}
