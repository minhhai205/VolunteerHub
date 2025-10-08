"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Button } from "../../../../../components/ui/button";
import { Eye, EyeOff, Lock, Mail, UserPlus } from "lucide-react";
import { useState } from "react";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    setError("");
    // TODO: gọi API đăng ký ở đây
    console.log("Register with:", { password });
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-md relative z-10">
      <CardHeader className="space-y-1 text-center pb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl text-gray-800">Đăng ký</CardTitle>
        <CardDescription className="text-gray-600">
          Tạo tài khoản mới để bắt đầu sử dụng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                className="pl-10 border-gray-200 focus:border-green-400 focus:ring-green-400/20"
                required
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 border-gray-200 focus:border-green-400 focus:ring-green-400/20"
                required
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm" className="text-gray-700">Xác nhận mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`pl-10 pr-10 border-gray-200 focus:border-green-400 focus:ring-green-400/20 ${
                  error ? "border-red-400" : ""
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Đăng ký
          </Button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Đã có tài khoản?{" "}
            <a href="/auth/login" className="text-green-600 hover:text-green-500 underline">
              Đăng nhập
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
