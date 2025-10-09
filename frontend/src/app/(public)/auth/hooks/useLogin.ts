"use client";

import { useState } from "react";
import { saveTokens } from "@/lib/token";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: LoginPayload): Promise<LoginResult> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        status: number;
        message: string;
        data: {
          accessToken: string;
          refreshToken: string;
        };
      };
      // save token to localStorage
      if (result.status === 200) {
        saveTokens(result.data.accessToken, result.data.refreshToken);
        return { success: true };
      }
      if (result.status === 401) {
        const message = result.message ?? "Đăng nhập thất bại";
        setError(message);
        return { success: false };
      }
      const message = result.message ?? "Đã xảy ra lỗi";
      setError(message);
      return { success: false };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Có lỗi xảy ra";
      setError(message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };
  return { login, loading, error };
}
