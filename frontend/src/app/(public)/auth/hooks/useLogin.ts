"use client";

import { useState } from "react";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  data?: unknown;
  error?: string;
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
      const result = await response.json() as { message?: string; [key: string]: unknown };
      if (result.status === 200) {
        return { success: true, data: result };
      }
      if (result.status === 401) {
        const message = result.message ?? "Đăng nhập thất bại";
        setError(message);
        return { success: false, error: message };
      }
      const message = result.message ?? "Đã xảy ra lỗi";
      setError(message);
      return { success: false, error: message };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Có lỗi xảy ra";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  return { login, loading, error };
}
