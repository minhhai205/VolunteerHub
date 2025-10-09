"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Lock, ArrowRight } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log("[v0] Login attempt:", { email, rememberMe })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email field */}
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

      {/* Password field */}
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

      {/* Remember me & Forgot password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
            Ghi nhớ đăng nhập
          </Label>
        </div>
        <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
          Quên mật khẩu?
        </Link>
      </div>

      {/* Submit button */}
      <Button type="submit" className="w-full h-12 text-base group" size="lg">
        Đăng nhập
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>

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
          <Link href="/auth/register" className="font-semibold text-primary hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </form>
  )
}
