"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/mockData";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: User | null;
  getRoleBadge: (role: User["role"]) => React.ReactNode;
  getStatusBadge: (status: User["status"]) => React.ReactNode;
};

export default function UserDetailDialog({
  open,
  onOpenChange,
  user,
  getRoleBadge,
  getStatusBadge,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Thông tin người dùng
          </DialogTitle>
        </DialogHeader>

        {user && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {user.name}
                </h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Vai trò
                </p>
                <div className="mt-1">{getRoleBadge(user.role)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Trạng thái
                </p>
                <div className="mt-1">{getStatusBadge(user.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ngày tham gia
                </p>
                <p className="text-foreground">
                  {new Date(user.joinedAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Sự kiện đã tham gia
                </p>
                <p className="text-foreground">{user.eventsJoined}</p>
              </div>
              {user.role === "event_manager" && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Sự kiện đã tạo
                  </p>
                  <p className="text-foreground">{user.eventsCreated}</p>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border p-4">
              <h4 className="mb-2 font-medium text-foreground">
                Tóm tắt hoạt động
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Tham gia {user.eventsJoined} sự kiện tình nguyện</p>
                {user.role === "event_manager" && (
                  <p>• Tạo {user.eventsCreated} sự kiện</p>
                )}
                <p>
                  • Thành viên từ{" "}
                  {new Date(user.joinedAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
