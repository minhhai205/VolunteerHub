"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  lockAction: "lock" | "unlock";
  onConfirm: () => void;
};

export default function LockDialog({
  open,
  onOpenChange,
  user,
  lockAction,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {lockAction === "lock"
              ? "Xác nhận khóa tài khoản"
              : "Xác nhận mở khóa tài khoản"}
          </DialogTitle>
          <DialogDescription>
            {lockAction === "lock"
              ? `Bạn có chắc chắn muốn khóa tài khoản của "${user?.name}"? Người dùng sẽ không thể đăng nhập vào hệ thống.`
              : `Bạn có chắc chắn muốn mở khóa tài khoản của "${user?.name}"? Người dùng sẽ có thể đăng nhập trở lại.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            variant={lockAction === "lock" ? "destructive" : "default"}
            className={
              lockAction === "unlock"
                ? "bg-accent text-accent-foreground hover:bg-accent/90"
                : ""
            }
            onClick={onConfirm}
          >
            {lockAction === "lock" ? "Khóa" : "Mở khóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
