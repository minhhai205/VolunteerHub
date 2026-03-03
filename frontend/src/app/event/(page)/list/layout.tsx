import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Header } from "@/components/static/Header";
import { Footer } from "@/components/static/Footer";

export default function ListEventUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ProtectedRoute allowedScopes={["USER"]}>{children}</ProtectedRoute>
      <Footer />
    </>
  );
}
