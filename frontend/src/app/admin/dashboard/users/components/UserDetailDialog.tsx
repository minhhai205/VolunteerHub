"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/lib/mockData";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: User | null;
  getStatusBadge: (status: User["status"]) => React.ReactNode;
};

export default function UserDetailDialog({
  open,
  onOpenChange,
  user,
  getStatusBadge,
}: Props) {
  const renderRoleBadge = (role: User["role"]) => {
    if (!role) return null;
    switch (role.name) {
      case "ADMIN":
        return (
          <Badge className="bg-destructive text-destructive-foreground">
            Admin
          </Badge>
        );
      case "MANAGER":
        return (
          <Badge className="bg-primary text-primary-foreground">Quản lý</Badge>
        );
      default:
        return <Badge>Người dùng</Badge>;
    }
  };

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
              <Avatar className="h-16 w-16 bg-primary text-2xl font-semibold text-primary-foreground">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.fullName} />
                ) : (
                  <AvatarFallback />
                )}
              </Avatar>

              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {user.fullName}
                </h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Vai trò
                </p>
                <div className="mt-1">{renderRoleBadge(user.role)}</div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Trạng thái
                </p>
                <div className="mt-1">{getStatusBadge(user.status)}</div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Số điện thoại
                </p>
                <div className="mt-1 text-foreground">
                  {user.phoneNumber ?? "Không có dữ liệu"}
                </div>
              </div>

              {user.role.name === "MANAGER" && <div />}
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
