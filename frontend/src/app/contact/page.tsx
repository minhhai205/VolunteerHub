import { Footer } from "@/components/static/Footer";
import ContactForm from "./contact-form";
import Facts from "./facts";
import Hero from "./hero";
import History from "./history";
import Map from "./map";
import Team from "./team";
import { Header } from "@/components/static/HeaderManager";

export default function ContactPage() {
  return (
    <main className="w-full">
      <Header></Header>
      <Hero />
      <History />
      <Facts />
      <Map />
      <Team />
      <ContactForm />
      <Footer></Footer>
    </main>
  );
}
