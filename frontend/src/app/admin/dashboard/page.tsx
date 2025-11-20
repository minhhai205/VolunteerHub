// frontend/src/app/admin/dashboard/page.tsx
"use client";

import EventStats from "./components/EventStats";
import NewEventsSection from "./components/NewEventsSection";
import TrendingEventsSection from "./components/TrendingEventsSection";

export default function DashboardPage() {
  return (
    <main className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground">Tổng quan</h1>
        <p className="text-muted-foreground">
          Xem tổng hợp sự kiện mới, hoạt động và xu hướng
        </p>
      </div>
      <EventStats />
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <NewEventsSection />
          <TrendingEventsSection />
        </div>
      </div>
    </main>
  );
}
