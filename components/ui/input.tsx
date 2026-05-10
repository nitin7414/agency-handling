import * as React from "react";
import { cn } from "@/lib/utils";
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => <input ref={ref} className={cn("h-12 w-full rounded-2xl border bg-background px-4 text-base outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring", className)} {...props} />);
Input.displayName = "Input";
