"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full w-10 h-10 bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center"
    >
      {theme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-slate-400 transition-all" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
