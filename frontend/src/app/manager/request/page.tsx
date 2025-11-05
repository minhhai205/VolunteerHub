import { Header } from "@/components/static/HeaderManager";
import EventRequestsManager from "./components/event-requests-manager";
import { Footer } from "@/components/static/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header></Header>
      <EventRequestsManager />
      <Footer></Footer>
    </main>
  );
}
