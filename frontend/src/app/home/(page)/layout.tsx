import { ChatPopup } from "@/components/chatbot/chat-popup";
import { Footer } from "@/components/static/Footer";
import { Header } from "@/components/static/Header";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <ChatPopup />
      <Footer />
    </>
  );
}
