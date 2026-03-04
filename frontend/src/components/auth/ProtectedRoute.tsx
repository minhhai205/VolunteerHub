// components/auth/ProtectedRoute.tsx
"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/token";
import { toastManager } from "../static/toast/toast";
import { showUnauthorizedDialog } from "@/lib/unauthorizedDialog";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface ProtectedRouteProps {
  allowedScopes?: string[]; // ["ADMIN"], ["MANAGER"], []
  children: React.ReactNode;
}

export default function ProtectedRoute({
  allowedScopes = [],
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  // Dùng useLayoutEffect để check auth TRƯỚC khi browser paint → không bị nháy trắng
  useIsomorphicLayoutEffect(() => {
    const token = getAccessToken();

    console.log(token);
    // Nếu không có token → redirect login

    if (!token) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname + window.location.search;
        const redirectUrl = `/auth/login?redirect=${encodeURIComponent(
          currentPath,
        )}`;

        showUnauthorizedDialog(redirectUrl);
      }
      return;
    }

    try {
      // Decode payload
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));

      const scopes: string[] = payload.scope?.split(" ") || [];

      const roles = scopes.map((s: string) => s.replace(/^ROLE_/, ""));

      // Kiểm tra quyền
      const allowed =
        allowedScopes.length === 0 ||
        roles.some((r) => allowedScopes.includes(r));

      if (!allowed) {
        router.replace("/forbidden");
        return;
      }

      // Nếu hợp lệ → render children
      setAuthorized(true);
    } catch (err) {
      console.error("Token decode error:", err);
      router.replace("/auth/login");
    }
  }, [allowedScopes, router]);

  if (!authorized) return null;

  return <>{children}</>;
}
