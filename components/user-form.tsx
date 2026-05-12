"use client";

import { useState } from "react";
import { updateAdminProfile } from "@/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Save, CheckCircle2, AlertCircle } from "lucide-react";

interface UserFormProps {
  user: {
    name: string;
    email: string;
  };
}

export function UserForm({ user }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      const result = await updateAdminProfile(formData);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(typeof result.error === 'string' ? result.error : "Validation failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Name</Label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              name="name"
              defaultValue={user.name}
              placeholder="Your Name"
              className="pl-11 h-12 rounded-2xl bg-white dark:bg-zinc-900 border-black/5 dark:border-white/10 shadow-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              placeholder="your@email.com"
              className="pl-11 h-12 rounded-2xl bg-white dark:bg-zinc-900 border-black/5 dark:border-white/10 shadow-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-black/5 dark:border-white/5">
           <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-1">Security Update</h4>
           
           <div className="space-y-2">
             <Label htmlFor="currentPassword" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Current Password</Label>
             <div className="relative">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                 id="currentPassword"
                 name="currentPassword"
                 type="password"
                 placeholder="Enter current password to save changes"
                 className="pl-11 h-12 rounded-2xl bg-white dark:bg-zinc-900 border-black/5 dark:border-white/10 shadow-sm focus:ring-2 focus:ring-blue-500/20"
               />
             </div>
             <p className="text-[10px] text-muted-foreground/70 ml-1">Required only if you are setting a new password.</p>
           </div>

           <div className="space-y-2">
             <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">New Password</Label>
             <div className="relative">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                 id="password"
                 name="password"
                 type="password"
                 placeholder="Leave blank to keep current"
                 className="pl-11 h-12 rounded-2xl bg-white dark:bg-zinc-900 border-black/5 dark:border-white/10 shadow-sm focus:ring-2 focus:ring-blue-500/20"
               />
             </div>
           </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive">
           <AlertCircle className="h-5 w-5 shrink-0" />
           <p className="text-xs font-bold">{error}</p>
        </div>
      )}

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full h-12 rounded-2xl font-bold text-sm bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 gap-2"
      >
        {loading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : success ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {loading ? "Updating..." : success ? "Saved Successfully" : "Update Profile"}
      </Button>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
           <CheckCircle2 className="h-5 w-5 shrink-0" />
           <p className="text-xs font-bold">Your profile has been updated successfully. You remain securely logged in on this device.</p>
        </div>
      )}
    </form>
  );
}
