"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, CheckCircle, UserPlus, Heart } from "lucide-react";
import { useRecentActivities } from "../../hooks/use-recent-activities";
import styles from "./recent-activity-section.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  comment: MessageCircle,
  completed: CheckCircle,
  joined: UserPlus,
  liked: Heart,
};

export function RecentActivitySection() {
  const { activities, loading } = useRecentActivities();

  return (
    <Card className="border-border h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Hoạt động Gần đây</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-muted-foreground">Đang tải...</p>
        ) : activities.length === 0 ? (
          <p className="text-muted-foreground">Không có hoạt động</p>
        ) : (
          activities.map((activity) => {
            const Icon = iconMap[activity.type] || MessageCircle;
            return (
              <div key={activity.id} className={styles.activityItem}>
                <div className={`${activity.color} mt-1`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{activity.user}</span>{" "}
                    {activity.action}{" "}
                    <span className="font-semibold text-green-600">
                      {activity.target}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
