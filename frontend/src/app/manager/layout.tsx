import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Header } from "@/components/static/HeaderManager";
import { Footer } from "@/components/static/Footer";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ProtectedRoute allowedScopes={["MANAGER"]}>{children}</ProtectedRoute>
      <Footer />
    </>
  );
}
