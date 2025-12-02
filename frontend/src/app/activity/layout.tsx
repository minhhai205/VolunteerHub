import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ActivityUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute allowedScopes={["USER"]}>{children}</ProtectedRoute>;
}
