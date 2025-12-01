import { ChatPopup } from "@/components/chatbot/chat-popup";
import { Footer } from "@/components/static/Footer";
import { Header } from "@/components/static/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header /> {/* ✅ Không reload */}
        <main>{children}</main> {/* ✅ Chỉ phần này thay đổi */}
        <ChatPopup></ChatPopup>
        <Footer /> {/* ✅ Không reload */}
      </body>
    </html>
  );
}
