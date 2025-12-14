"use client";

import { useState, useEffect } from "react";
import { Footer } from "@/components/static/Footer";
import ContactForm from "./contact-form";
import Facts from "./facts";
import Hero from "./hero";
import History from "./history";
import Map from "./map";
import Team from "./team";
import { getUserRole } from "@/lib/getDataFromToken";

export default function ContactPage() {
  const [HeaderComponent, setHeaderComponent] =
    useState<React.ComponentType | null>(null);

  // Load user role and select header
  useEffect(() => {
    const role = getUserRole();

    if (role === "MANAGER") {
      import("@/components/static/HeaderManager").then((mod) =>
        setHeaderComponent(() => mod.Header)
      );
    } else {
      import("@/components/static/Header").then((mod) =>
        setHeaderComponent(() => mod.Header)
      );
    }
  }, []);

  if (!HeaderComponent) {
    return null;
  }

  return (
    <main className="w-full">
      <HeaderComponent />
      <Hero />
      <History />
      <Facts />
      <Map />
      <Team />
      <ContactForm />
      <Footer />
    </main>
  );
}
