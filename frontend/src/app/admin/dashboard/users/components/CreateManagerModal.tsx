"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Phone } from "lucide-react";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function CreateManagerModal({ open, onOpenChange }: Props) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: string, value: string) =>
    setForm((s) => ({ ...s, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetchWithAuth(`${apiUrl}/api/user/create`, {
        method: "POST",
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          phoneNumber: form.phoneNumber,
          roleName: "MANAGER",
        }),
      });

      // Try read JSON response
      let json: any = null;
      try {
        json = await res.json();
      } catch {
        // ignore parse error
      }

      if (res.ok && (json?.status === undefined || json?.status === 200)) {
        toast.success("Tạo quản lý thành công");
        onOpenChange(false);
        return;
      }

      const msg = json?.message || `Lỗi server: ${res.status}`;
      throw new Error(msg);
    } catch (err) {
      console.error("Create manager error:", err);
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      toast.error(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full max-h-[80vh] overflow-y-auto p-6 sm:p-8 rounded-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold">
            Tạo quản lý sự kiện
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Tạo tài khoản quản lý sự kiện (admin only)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium"
            >
              Họ và tên
            </Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className="pl-12 h-12"
                placeholder="Họ và tên (ví dụ: Nguyễn Văn A)"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="pl-12 h-12"
                autoComplete="off"
                placeholder="Email (ví dụ: example@domain.com)"
                required
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="phoneNumber"
              className="mb-2 block text-sm font-medium"
            >
              Số điện thoại
            </Label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="phoneNumber"
                value={form.phoneNumber}
                onChange={(e) => update("phoneNumber", e.target.value)}
                className="pl-12 h-12"
                placeholder="Số điện thoại (ví dụ: 0123456789)"
                required
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Mật khẩu
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="pl-12 h-12"
                placeholder="Mật khẩu (ít nhất 8 ký tự)"
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium"
            >
              Xác nhận mật khẩu
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                className="pl-12 h-12"
                placeholder="Xác nhận mật khẩu"
                required
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <DialogFooter className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo quản lý"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
