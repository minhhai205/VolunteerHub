import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ListEventUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute allowedScopes={["USER"]}>{children}</ProtectedRoute>;
}
