import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedScopes={["MANAGER"]}>{children}</ProtectedRoute>
  );
}
