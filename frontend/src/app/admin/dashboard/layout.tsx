"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../../../app/globals.css";
import AppSidebar from "./components/AppSidebar";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use localStorage instead of cookies
  const [defaultOpen, setDefaultOpen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar_state");
    if (stored !== null) {
      setDefaultOpen(stored === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar_state", String(defaultOpen));
  }, [defaultOpen]);

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <main className="w-full">
            <Navbar />
            <div className="px-4">{children}</div>
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </div>
  );
}
