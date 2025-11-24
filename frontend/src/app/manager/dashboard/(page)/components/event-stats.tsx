"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, TrendingUp, MessageSquare } from "lucide-react";
import { useEventStats } from "../../hooks/use-event-stats";
import styles from "./event-stats.module.css";

export function EventStats() {
  const { data, loading } = useEventStats();

  const stats = [
    {
      title: "Tổng Sự kiện",
      value: data?.totalEvents || "0",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Tình nguyện viên",
      value: data?.totalVolunteers || "0",
      icon: Users,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      title: "Sự kiện Trending",
      value: data?.trendingEvents || "0",
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      title: "Bài Trao đổi Mới",
      value: data?.totalNewDiscussionPosts || "0",
      icon: MessageSquare,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className={styles.statCard}>
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
