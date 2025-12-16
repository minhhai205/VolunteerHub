"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  MessageSquare,
  Users,
  Calendar,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useTrendingEvents } from "@/hooks/useTrendingEvents";

export default function TrendingEventsSection() {
  const { events = [], loading = false } = useTrendingEvents?.() ?? {};

  return (
    <Card className="rounded-lg border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Sự kiện Trending
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-muted-foreground">Đang tải...</p>
        ) : events.length === 0 ? (
          <p className="text-muted-foreground">Không có sự kiện trending</p>
        ) : (
          events.map((event: any, idx: number) => (
            <div key={event.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {event.name}
                  </h3>

                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {event.description || "Không có mô tả"}
                  </p>
                </div>

                <Badge variant="outline" className="ml-4">
                  Trending
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {event.startDate ?? event.start_date ?? event.date
                      ? new Date(
                          event.startDate ?? event.start_date ?? event.date
                        ).toLocaleDateString("vi-VN")
                      : "Không rõ"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location || "Không rõ"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>
                    {event.countMembers ??
                      event.count_members ??
                      event.count_memberships ??
                      "—"}{" "}
                    thành viên
                  </span>
                </div>
              </div>

              {idx < events.length - 1 && (
                <hr className="border-t border-border/30" />
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
