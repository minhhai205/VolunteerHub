"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, TrendingUp, MessageSquare } from "lucide-react";
import { useEventStats } from "../hooks/useEventStats";

export default function EventStats() {
  const { data, loading } = useEventStats?.() ?? {
    data: undefined,
    loading: false,
  };

  const stats = [
    {
      title: "Tổng Sự kiện",
      value: data?.totalEvents ?? "0",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50/80 dark:bg-green-900/40",
    },
    {
      title: "Tình nguyện viên",
      value: data?.totalVolunteers ?? "0",
      icon: Users,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50/80 dark:bg-emerald-900/40",
    },
    {
      title: "Sự kiện Trending",
      value: data?.trendingEvents ?? "0",
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-50/80 dark:bg-orange-900/40",
    },
    {
      title: "Bài Trao đổi Mới",
      value: data?.totalNewDiscussionPosts ?? "0",
      icon: MessageSquare,
      color: "text-purple-500",
      bgColor: "bg-purple-50/80 dark:bg-purple-900/40",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="rounded-lg border border-border/50 shadow-sm"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {loading ? "..." : stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
