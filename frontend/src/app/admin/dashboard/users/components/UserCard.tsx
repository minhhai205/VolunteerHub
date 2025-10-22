"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Award, Eye, Lock, Unlock } from "lucide-react";
import type { User } from "@/lib/mockData";

type Props = {
  user: User;
  getRoleBadge: (role: User["role"]) => React.ReactNode;
  getStatusBadge: (status: User["status"]) => React.ReactNode;
  onShowDetail: (u: User) => void;
  onRequestLock: (u: User, action: "lock" | "unlock") => void;
};

export default function UserCard({
  user,
  getRoleBadge,
  getStatusBadge,
  onShowDetail,
  onRequestLock,
}: Props) {
  return (
    <Card key={user.id} className="transition-shadow hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
              {user.name.charAt(0)}
            </div>

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

          <div className="flex flex-wrap gap-2 lg:flex-col">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowDetail(user)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Chi tiết
            </Button>

            {user.status === "active" ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onRequestLock(user, "lock")}
              >
                <Lock className="mr-2 h-4 w-4" />
                Khóa
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => onRequestLock(user, "unlock")}
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
