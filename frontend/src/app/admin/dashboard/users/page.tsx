"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockUsers, type User } from "@/lib/mockData";
import {
  Search,
  Lock,
  Unlock,
  Eye,
  Mail,
  Calendar,
  Award,
  Users,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showLockDialog, setShowLockDialog] = useState(false);
  const [lockAction, setLockAction] = useState<"lock" | "unlock">("lock");

  const volunteers = users.filter((user) => user.role === "volunteer");
  const eventManagers = users.filter((user) => user.role === "event_manager");

  const filterUsers = (userList: User[]) => {
    return userList.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredVolunteers = filterUsers(volunteers);
  const filteredEventManagers = filterUsers(eventManagers);

  const handleLockToggle = () => {
    if (selectedUser) {
      const newStatus = lockAction === "lock" ? "locked" : "active";
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? { ...u, status: newStatus as User["status"] }
            : u
        )
      );
      toast(
        lockAction === "lock" ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản",
        {
          description:
            lockAction === "lock"
              ? "Người dùng không thể đăng nhập vào hệ thống"
              : "Người dùng có thể đăng nhập trở lại",
          // optional: use toast.success / toast.error for different types
        }
      );
      setShowLockDialog(false);
      setSelectedUser(null);
    }
  };

  const getRoleBadge = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-primary text-primary-foreground">
            Quản trị viên
          </Badge>
        );
      case "event_manager":
        return (
          <Badge className="bg-accent text-accent-foreground">
            Quản lý sự kiện
          </Badge>
        );
      case "volunteer":
        return <Badge variant="secondary">Tình nguyện viên</Badge>;
    }
  };

  const getStatusBadge = (status: User["status"]) => {
    return status === "active" ? (
      <Badge className="bg-accent text-accent-foreground">Hoạt động</Badge>
    ) : (
      <Badge variant="destructive">Đã khóa</Badge>
    );
  };

  const UserCard = ({ user }: { user: User }) => (
    <Card key={user.id} className="transition-shadow hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* User Info */}
          <div className="flex flex-1 items-start gap-4">
            {/* Avatar */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
              {user.name.charAt(0)}
            </div>

            {/* Details */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {user.name}
                </h3>
                {getRoleBadge(user.role)}
                {getStatusBadge(user.status)}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Tham gia:{" "}
                  {new Date(user.joinedAt).toLocaleDateString("vi-VN")}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  {user.eventsJoined} sự kiện đã tham gia
                </div>
                {user.role === "event_manager" && (
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    {user.eventsCreated} sự kiện đã tạo
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 lg:flex-col">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedUser(user);
                setShowDetailDialog(true);
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Chi tiết
            </Button>

            {user.status === "active" ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  setSelectedUser(user);
                  setLockAction("lock");
                  setShowLockDialog(true);
                }}
              >
                <Lock className="mr-2 h-4 w-4" />
                Khóa
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => {
                  setSelectedUser(user);
                  setLockAction("unlock");
                  setShowLockDialog(true);
                }}
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

  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-foreground">
                Quản lý người dùng
              </h1>
              <p className="text-muted-foreground">
                Xem và quản lý tài khoản tình nguyện viên và quản lý sự kiện
              </p>
            </div>

            {/* Search */}
            <Card className="mb-6">
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

            <Tabs defaultValue="volunteers" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger
                  value="volunteers"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Tình nguyện viên ({volunteers.length})
                </TabsTrigger>
                <TabsTrigger
                  value="managers"
                  className="flex items-center gap-2"
                >
                  <UserCog className="h-4 w-4" />
                  Quản lý sự kiện ({eventManagers.length})
                </TabsTrigger>
              </TabsList>

              {/* Volunteers Tab */}
              <TabsContent value="volunteers" className="space-y-4">
                {filteredVolunteers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}

                {filteredVolunteers.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Không tìm thấy tình nguyện viên nào
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Event Managers Tab */}
              <TabsContent value="managers" className="space-y-4">
                {filteredEventManagers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}

                {filteredEventManagers.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <UserCog className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Không tìm thấy quản lý sự kiện nào
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* User Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Thông tin người dùng
              </DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                {/* Avatar and basic info */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {selectedUser.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Vai trò
                    </p>
                    <div className="mt-1">
                      {getRoleBadge(selectedUser.role)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Trạng thái
                    </p>
                    <div className="mt-1">
                      {getStatusBadge(selectedUser.status)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Ngày tham gia
                    </p>
                    <p className="text-foreground">
                      {new Date(selectedUser.joinedAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Sự kiện đã tham gia
                    </p>
                    <p className="text-foreground">
                      {selectedUser.eventsJoined}
                    </p>
                  </div>
                  {selectedUser.role === "event_manager" && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Sự kiện đã tạo
                      </p>
                      <p className="text-foreground">
                        {selectedUser.eventsCreated}
                      </p>
                    </div>
                  )}
                </div>

                {/* Activity summary */}
                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-2 font-medium text-foreground">
                    Tóm tắt hoạt động
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      • Tham gia {selectedUser.eventsJoined} sự kiện tình nguyện
                    </p>
                    {selectedUser.role === "event_manager" && (
                      <p>• Tạo {selectedUser.eventsCreated} sự kiện</p>
                    )}
                    <p>
                      • Thành viên từ{" "}
                      {new Date(selectedUser.joinedAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDetailDialog(false)}
              >
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Lock/Unlock Confirmation Dialog */}
        <Dialog open={showLockDialog} onOpenChange={setShowLockDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {lockAction === "lock"
                  ? "Xác nhận khóa tài khoản"
                  : "Xác nhận mở khóa tài khoản"}
              </DialogTitle>
              <DialogDescription>
                {lockAction === "lock"
                  ? `Bạn có chắc chắn muốn khóa tài khoản của "${selectedUser?.name}"? Người dùng sẽ không thể đăng nhập vào hệ thống.`
                  : `Bạn có chắc chắn muốn mở khóa tài khoản của "${selectedUser?.name}"? Người dùng sẽ có thể đăng nhập trở lại.`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowLockDialog(false)}
              >
                Hủy
              </Button>
              <Button
                variant={lockAction === "lock" ? "destructive" : "default"}
                className={
                  lockAction === "unlock"
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : ""
                }
                onClick={handleLockToggle}
              >
                {lockAction === "lock" ? "Khóa" : "Mở khóa"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
