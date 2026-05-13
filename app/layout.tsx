import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shri Shyam Gas Agency",
  description: "Mobile-first gas agency management system",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Shri Shyam Gas Agency" }
};

export const viewport: Viewport = { themeColor: "#0f766e", width: "device-width", initialScale: 1, maximumScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <main className="min-h-screen pb-[calc(4rem+env(safe-area-inset-bottom))]">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
