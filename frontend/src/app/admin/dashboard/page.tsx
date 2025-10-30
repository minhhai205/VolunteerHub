// frontend/src/app/admin/dashboard/page.tsx
"use client"; // Thêm dòng này ở đầu file để biến nó thành Client Component

import { StatCard } from "./components/StatCard";
import { EventFeed } from "./components/EventFeed";
// import { mockDashboardStats } from "@/lib/mockData"; // Xóa mock data
import { Calendar, Users, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { useDashboardStats } from "./hooks/useDashboardStats"; // Import hook mới
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton để làm UI tải

export default function DashboardPage() {
  // Gọi hook để lấy dữ liệu
  const { data, loading, error } = useDashboardStats();

  // 1. Trạng thái đang tải
  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <main className="flex-1">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-foreground">
                Tổng quan
              </h1>
              <p className="text-muted-foreground">
                Xem tổng hợp sự kiện mới, hoạt động và xu hướng
              </p>
            </div>
            {/* Skeleton loading cho Stats Grid */}
            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-36 w-full" />
            </div>
            {/* Bạn cũng có thể thêm Skeleton cho EventFeed nếu muốn */}
            <EventFeed />
          </div>
        </main>
      </div>
    );
  }

  // 2. Trạng thái lỗi
  if (error || !data) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background p-8">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-xl font-semibold text-destructive">
          Không thể tải dữ liệu
        </h2>
        <p className="text-muted-foreground">
          {error || "Không tìm thấy dữ liệu."}
        </p>
      </div>
    );
  }

  // 3. Trạng thái thành công (dữ liệu đã có)
  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground">
              Tổng quan
            </h1>
            <p className="text-muted-foreground">
              Xem tổng hợp sự kiện mới, hoạt động và xu hướng
            </p>
          </div>

          {/* Stats Grid - Sử dụng 'data' từ hook */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Tổng số sự kiện"
              value={data.totalEvents} // Thay đổi
              change="+12% so với tháng trước" // Bạn có thể muốn API trả về cả thông tin này
              changeType="positive"
              icon={Calendar}
            />
            <StatCard
              title="Sự kiện chờ duyệt"
              value={data.pendingEvents} // Thay đổi
              change="Cần xem xét"
              changeType="neutral"
              icon={Clock}
            />
            <StatCard
              title="Tổng người dùng"
              value={data.totalUsers} // Thay đổi
              change="+8% so với tháng trước"
              changeType="positive"
              icon={Users}
            />
            <StatCard
              title="Tình nguyện viên hoạt động"
              value={data.activeVolunteers} // Thay đổi
              change="+15% so với tháng trước"
              changeType="positive"
              icon={TrendingUp}
            />
          </div>

          <EventFeed />
        </div>
      </main>
    </div>
  );
}
