import { Header } from "@/components/static/HeaderManager";
import { EventRequestsPage } from "./components/event-requests-page";
import { Footer } from "@/components/static/Footer";

export default function Home() {
  return (
    <>
      <Header></Header>
      <EventRequestsPage />
      <Footer></Footer>
    </>
  );
}
