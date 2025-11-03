"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { saveTokens } from "@/lib/token";
import { registerPushAfterLogin } from "@/lib/notification";

import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  sub: string;
  scope: string;
  exp: number;
};

import { toastManager } from "@/components/static/toast/toast";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (result.status !== 200) {
        throw new Error("Invalid email or password!");
      }

      saveTokens(result.data.accessToken, result.data.refreshToken);

      // Đăng ký nhận Push Notification
      registerPushAfterLogin(result.data.accessToken);

      // Decode JWT để lấy role
      const decoded = jwtDecode<JwtPayload>(result.data.accessToken);
      const role = decoded.scope?.replace("ROLE_", ""); // ADMIN / USER / MANAGER

      console.log("Login success:", result);

      // Điều hướng theo role
      // Điều hướng theo role (ưu tiên redirect URL nếu có)
      toastManager.success("Đăng nhập thành công !");

      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirect");

      if (redirectTo) {
        router.push(redirectTo);
      } else {
        switch (role) {
          case "ADMIN":
            router.push("/admin/dashboard");
            break;
          case "MANAGER":
            router.push("/manager/dashboard");
            break;
          default:
            router.push("/home");
            break;
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      toastManager.error("Thông tin đăng nhập hoặc mật khẩu không chính xác !");
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-12"
            required
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Mật khẩu
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 h-12"
            required
          />
        </div>
      </div>

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <Label
            htmlFor="remember"
            className="text-sm font-normal cursor-pointer"
          >
            Ghi nhớ đăng nhập
          </Label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary hover:underline"
        >
          Quên mật khẩu?
        </Link>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full h-12 text-base group"
        size="lg"
        disabled={loading}
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">hoặc</span>
        </div>
      </div>

      {/* Register link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-primary hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </form>
  );
}
