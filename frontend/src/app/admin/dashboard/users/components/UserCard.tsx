"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Eye, Lock, Unlock } from "lucide-react";
import type { User } from "@/lib/mockData";
import { useUsersModal } from "../UserModelContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

type Props = {
  user: User;
  onShowDetail?: (u: User) => void;
  onRequestLock?: (u: User, action: "lock" | "unlock") => void;
};

export default function UserCard({ user, onShowDetail, onRequestLock }: Props) {
  const fallback = (() => {
    try {
      return useUsersModal();
    } catch {
      return null;
    }
  })();

  const showDetail = (u: User) => {
    if (onShowDetail) return onShowDetail(u);
    fallback?.openDetail(u);
  };

  const requestLock = (u: User, action: "lock" | "unlock") => {
    if (onRequestLock) return onRequestLock(u, action);
    fallback?.openLock(u, action);
  };

  // Avatar: nếu user.avatar có thì dùng, nếu không tạo avatar DiceBear với seed từ user.id (nếu có) hoặc tên
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    if (user.avatar) return user.avatar;
    const seed =
      user.id ?? user.fullName ?? Math.random().toString(36).slice(2, 9);
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      String(seed)
    )}`;
  });

  useEffect(() => {
    if (user.avatar) {
      setAvatarUrl(user.avatar);
    } else {
      const seed =
        user.id ?? user.fullName ?? Math.random().toString(36).slice(2, 9);
      setAvatarUrl(
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          String(seed)
        )}`
      );
    }
  }, [user]);

  const initials = (user.fullName || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <Card key={user.id} className="transition-shadow hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-start gap-4">
            <Avatar className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={user.fullName} />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {user.fullName || "No Name"}
                </h3>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:flex-col">
            <Button
              variant="outline"
              size="sm"
              onClick={() => showDetail(user)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Chi tiết
            </Button>

            {user.status === "active" ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => requestLock(user, "lock")}
              >
                <Lock className="mr-2 h-4 w-4" />
                Khóa
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => requestLock(user, "unlock")}
              >
                <Unlock className="mr-2 h-4 w-4" />
                Mở khóa
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
