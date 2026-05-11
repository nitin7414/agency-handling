"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-zinc-950 transition-opacity duration-500">
      <div className="relative w-1/2 aspect-square animate-pulse">
        <Image
          src="/logo.png"
          alt="Shri Shyam Gas Agency Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
