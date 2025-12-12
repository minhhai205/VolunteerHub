"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, MessageSquare, Users, ArrowRight } from "lucide-react";
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
          events.map((event: any) => (
            <div
              key={event.id}
              className="flex gap-4 items-start rounded-md p-3 hover:shadow-sm transition"
            >
              <div className="flex-shrink-0 w-24 h-16 overflow-hidden rounded-md bg-muted/30">
                <img
                  src={event.imageUrl || "/placeholder.svg"}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground truncate">
                  {event.name}
                </h3>

                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {event.description || "Không có mô tả"}
                </p>

                <div className="mt-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {event.countMembers ?? event.count_members ?? "—"} thành
                        viên
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>
                        {event.countPosts ?? event.count_posts ?? 0} bài trao
                        đổi
                      </span>
                    </div>
                  </div>

                  <div>
                    <Link href={`/event/detail/${event.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        Xem chi tiết
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
