"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../../../app/globals.css";
import AppSidebar from "./components/AppSidebar";
import Navbar from "./components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sidebar state
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
    <ProtectedRoute allowedScopes={["ADMIN"]}>
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
      >
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <main className="w-full">
            <Navbar />
            <div className="px-4">{children}</div>
          </main>
        </SidebarProvider>
      </div>
    </ProtectedRoute>
  );
}
