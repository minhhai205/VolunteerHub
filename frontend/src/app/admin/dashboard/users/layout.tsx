"use client";

import { useState, useCallback, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, UserCog, Loader2, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import UserDetailDialog from "./components/UserDetailDialog";
import LockDialog from "./components/LockDialog";
import { User } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { UsersModalProvider, useUsersModal } from "./UserModelContext";
import { UserSearchProvider, useUserSearch } from "./UserSearchContext";
import { useLockUser } from "./hooks/useLockUser";
import { Button } from "@/components/ui/button";
import CreateManagerModal from "./components/CreateManagerModal";

function UsersInnerLayout({ children }: { children: React.ReactNode }) {
  const { searchQuery, setSearchQuery, isSearching, setIsSearching } =
    useUserSearch();
  const [inputValue, setInputValue] = useState(searchQuery);
  const pathname = usePathname();
  const router = useRouter();
  const {
    selectedUser,
    lockAction,
    showDetailDialog,
    showLockDialog,
    showCreateDialog,
    closeDetail,
    closeLock,
    openCreate,
    closeCreate,
  } = useUsersModal();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    []
  );

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const value = (e.currentTarget as HTMLInputElement).value;
        setIsSearching(true);
        setSearchQuery(value);
        // tắt trạng thái searching sau một khoảng nhỏ
        setTimeout(() => setIsSearching(false), 300);
      }
    },
    [setIsSearching, setSearchQuery]
  );

  const getStatusBadge = (status: User["status"]) =>
    status === "active" ? (
      <Badge className="bg-accent text-accent-foreground">Hoạt động</Badge>
    ) : (
      <Badge variant="destructive">Đã khóa</Badge>
    );
  const { handleLockToggle } = useLockUser();

  const handleConfirmLock = async () => {
    if (!selectedUser) return;

    const lock = lockAction === "lock";
    window.dispatchEvent(
      new CustomEvent("user-lock-optimistic", {
        detail: { userId: selectedUser.id, lock },
      })
    );

    const success = await handleLockToggle(selectedUser.id, lockAction);

    if (success) {
      toast.success(
        lockAction === "lock" ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản"
      );
      window.dispatchEvent(
        new CustomEvent("user-lock-committed", {
          detail: { userId: selectedUser.id, lock },
        })
      );
      closeLock();
    } else {
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
          <div className="relative">
            {isSearching ? (
              <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
            ) : (
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            )}
            <Input
              placeholder="Tìm kiếm người dùng theo tên hoặc email..."
              value={inputValue}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="pl-10 transition-all duration-200"
            />
          </div>

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

          {/* button to create manager */}
          {pathname.includes("managers") && (
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> Tạo quản lý
            </Button>
          )}

          {/* tab content with transition */}
          <div
            className={`transition-opacity duration-200 ${
              isSearching ? "opacity-50" : "opacity-100"
            }`}
          >
            {children}
          </div>
        </main>

        <UserDetailDialog
          open={showDetailDialog}
          onOpenChange={(v) => (v ? null : closeDetail())}
          user={selectedUser}
          getStatusBadge={getStatusBadge}
        />

        <LockDialog
          open={showLockDialog}
          onOpenChange={(v) => (v ? null : closeLock())}
          user={selectedUser}
          lockAction={lockAction}
          onConfirm={handleConfirmLock}
        />

        <CreateManagerModal
          open={showCreateDialog}
          onOpenChange={(v) => (v ? null : closeCreate())}
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
    <UserSearchProvider>
      <UsersModalProvider>
        <UsersInnerLayout>{children}</UsersInnerLayout>
      </UsersModalProvider>
    </UserSearchProvider>
  );
}
