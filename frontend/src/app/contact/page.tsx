"use client";

import { useState, useLayoutEffect, useEffect } from "react";
import { Footer } from "@/components/static/Footer";
import { Header as UserHeader } from "@/components/static/Header";
import { Header as ManagerHeader } from "@/components/static/HeaderManager";
import ContactForm from "./contact-form";
import Facts from "./facts";
import Hero from "./hero";
import History from "./history";
import Map from "./map";
import Team from "./team";
import { getUserRole } from "@/lib/getDataFromToken";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function ContactPage() {
  const [role, setRole] = useState<string | null>(null);

  useIsomorphicLayoutEffect(() => {
    setRole(getUserRole() || "USER");
  }, []);

  const HeaderComponent = role === "MANAGER" ? ManagerHeader : UserHeader;

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
