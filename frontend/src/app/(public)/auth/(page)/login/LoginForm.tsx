"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Button } from "../../../../../components/ui/button";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useLogin } from "../../hooks/useLogin";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await login({ email, password });
    if (result.success) {
      console.log("Login successful");
    } else {
      console.error("Login failed");
    }
  };
  return (
    <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-md relative z-10">
      <CardHeader className="space-y-1 text-center pb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl text-gray-800">Đăng nhập</CardTitle>
        <CardDescription className="text-gray-600">
          Nhập thông tin tài khoản để tiếp tục
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="pl-10 border-gray-200 focus:border-green-400 focus:ring-green-400/20"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">Mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 pr-10 border-gray-200 focus:border-green-400 focus:ring-green-400/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end mb-4">
            <a href="#" className="text-sm text-green-600 hover:text-green-500">Quên mật khẩu?</a>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          {/* Error message */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* Register */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Chưa có tài khoản?{" "}
            <a href="/auth/register" className="text-green-600 hover:text-green-500 underline">Đăng ký ngay</a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
