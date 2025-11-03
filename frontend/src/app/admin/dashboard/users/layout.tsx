"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, UserCog } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import UserDetailDialog from "./components/UserDetailDialog";
import LockDialog from "./components/LockDialog";
import { User } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UsersModalProvider, useUsersModal } from "./UserModelContext";
import { useLockUser } from "./hooks/useLockUser";

function UsersInnerLayout({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const {
    selectedUser,
    lockAction,
    showDetailDialog,
    showLockDialog,
    closeDetail,
    closeLock,
  } = useUsersModal();

  const getStatusBadge = (status: User["status"]) =>
    status === "active" ? (
      <Badge className="bg-accent text-accent-foreground">Hoạt động</Badge>
    ) : (
      <Badge variant="destructive">Đã khóa</Badge>
    );
  const { handleLockToggle } = useLockUser();

  const handleConfirmLock = async () => {
    if (!selectedUser) return;

    // optimistic update: broadcast change to UI immediately
    const lock = lockAction === "lock";
    window.dispatchEvent(
      new CustomEvent("user-lock-optimistic", {
        detail: { userId: selectedUser.id, lock },
      })
    );

    // Gọi API bằng hook mới
    const success = await handleLockToggle(selectedUser.id, lockAction);

    if (success) {
      // Nếu API thành công:
      toast.success(
        lockAction === "lock" ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản"
      );
      // we could broadcast a committed event if needed
      window.dispatchEvent(
        new CustomEvent("user-lock-committed", {
          detail: { userId: selectedUser.id, lock },
        })
      );
      closeLock(); // Đóng dialog
      // refresh(); // Tải lại danh sách user (optional)
    } else {
      // Nếu API thất bại: revert the optimistic change by asking page to re-sync from server state
      window.dispatchEvent(
        new CustomEvent("user-lock-revert", {
          detail: { userId: selectedUser.id },
        })
      );
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      closeLock();
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          <header>
            <h1 className="text-3xl font-semibold">Quản lý người dùng</h1>
            <p className="text-muted-foreground">
              Xem và quản lý tài khoản tình nguyện viên và quản lý sự kiện
            </p>
          </header>

          {/* search bar */}
          <Card>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* tabs navigation */}
          <Tabs
            value={pathname.includes("managers") ? "managers" : "volunteers"}
            onValueChange={(val) => router.push(`${val}`)}
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger
                value="volunteers"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" /> Tình nguyện viên
              </TabsTrigger>
              <TabsTrigger value="managers" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" /> Quản lý sự kiện
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* tab content */}
          {children}
        </main>

        <UserDetailDialog
          open={showDetailDialog}
          onOpenChange={(v) => (v ? null : closeDetail())}
          user={selectedUser}
          // getRoleBadge={() => {}}
          getStatusBadge={getStatusBadge}
        />

        <LockDialog
          open={showLockDialog}
          onOpenChange={(v) => (v ? null : closeLock())}
          user={selectedUser}
          lockAction={lockAction}
          onConfirm={handleConfirmLock}
        />
      </div>
    </div>
  );
}

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UsersModalProvider>
      <UsersInnerLayout>{children}</UsersInnerLayout>
    </UsersModalProvider>
  );
}
