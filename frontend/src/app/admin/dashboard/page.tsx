import { StatCard } from "./components/StatCard";
import { EventFeed } from "./components/EventFeed";
import { mockDashboardStats } from "@/lib/mockData";
import { Calendar, Users, Clock, TrendingUp } from "lucide-react";

export default function DashboardPage() {
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

          {/* Stats Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Tổng số sự kiện"
              value={mockDashboardStats.totalEvents}
              change="+12% so với tháng trước"
              changeType="positive"
              icon={Calendar}
            />
            <StatCard
              title="Sự kiện chờ duyệt"
              value={mockDashboardStats.pendingEvents}
              change="Cần xem xét"
              changeType="neutral"
              icon={Clock}
            />
            <StatCard
              title="Tổng người dùng"
              value={mockDashboardStats.totalUsers}
              change="+8% so với tháng trước"
              changeType="positive"
              icon={Users}
            />
            <StatCard
              title="Tình nguyện viên hoạt động"
              value={mockDashboardStats.activeVolunteers}
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
