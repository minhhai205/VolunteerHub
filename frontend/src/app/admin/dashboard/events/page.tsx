"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Check,
  X,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Users,
  Heart,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

export default function EventsPage() {
  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground">
              Quản lý sự kiện
            </h1>
            <p className="text-muted-foreground">
              Duyệt, từ chối hoặc xóa các sự kiện chờ phê duyệt
            </p>
          </div>

          {/* Summary cards */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Chờ duyệt
                    </p>
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                      5
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Đã duyệt
                    </p>
                    <p className="text-3xl font-bold text-accent">12</p>
                  </div>
                  <Check className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tổng sự kiện
                    </p>
                    <p className="text-3xl font-bold text-foreground">17</p>
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search bar */}
          <Card className="mb-6">
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Tìm kiếm sự kiện..." className="pl-10" />
              </div>
            </CardContent>
          </Card>

          {/* Example event list */}
          <div>
            <Card className="border-yellow-500/50 bg-yellow-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  Sự kiện chờ duyệt (3)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Example Event Item */}
                <Card className="border-yellow-500/30 bg-card transition-all hover:shadow-lg hover:border-yellow-500/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            Sự kiện mẫu
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            Mô tả ngắn về sự kiện mẫu này để minh họa giao diện.
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                        >
                          Chờ duyệt
                        </Badge>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-lg border border-border/50 bg-muted/30 p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-accent shrink-0" />
                          <span className="text-sm text-foreground">
                            Hà Nội
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-accent shrink-0" />
                          <span className="text-sm text-foreground">
                            20/10/2025
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-accent shrink-0" />
                          <span className="text-sm text-foreground">
                            123 người
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <span>
                            Tạo bởi:{" "}
                            <span className="text-foreground font-medium">
                              Admin
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Heart className="h-4 w-4" />
                          <span>25</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MessageSquare className="h-4 w-4" />
                          <span>8</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <Button
                          size="default"
                          className="bg-accent text-accent-foreground hover:bg-accent/90 flex-1 sm:flex-none"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Duyệt sự kiện
                        </Button>
                        <Button
                          size="default"
                          variant="destructive"
                          className="flex-1 sm:flex-none"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Từ chối
                        </Button>
                        <Button size="default" variant="outline">
                          <Eye className="mr-2 h-4 w-4" />
                          Chi tiết
                        </Button>
                        <Button
                          size="default"
                          variant="outline"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Static dialogs for illustration */}
      <Dialog>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Chi tiết sự kiện mẫu
            </DialogTitle>
            <DialogDescription>
              Mô tả chi tiết của sự kiện mẫu.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>Địa điểm: Hà Nội</p>
            <p>Ngày tổ chức: 20/10/2025</p>
          </div>
          <DialogFooter>
            <Button variant="outline">Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
