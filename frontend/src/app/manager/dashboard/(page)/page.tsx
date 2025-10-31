"use client";

import { Header } from "@/components/static/HeaderManager";
import { EventStats } from "./components/event-stats";
import { NewEventsSection } from "./components/new-events-section";
import { TrendingEventsSection } from "./components/trending-events-section";
import { RecentPostsSection } from "./components/recent-posts-section";
import { Footer } from "@/components/static/Footer";
import "./style.css";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Quản lý sự kiện và tình nguyện viên của bạn
          </p>
        </div>

        <EventStats />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <NewEventsSection />
            <TrendingEventsSection />
          </div>
          <RecentPostsSection />
        </div>
      </main>
      <Footer /> 
    </div>
  );
}
