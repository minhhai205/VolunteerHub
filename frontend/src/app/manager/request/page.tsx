import { Header } from "@/components/static/HeaderManager";
import EventRequestsManager from "./components/event-requests-manager";
import { Footer } from "@/components/static/Footer";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="min-h-screen bg-[#F7FFF2]">
        <EventRequestsManager />
      </main>
      <Footer />
    </div>
  );
}
