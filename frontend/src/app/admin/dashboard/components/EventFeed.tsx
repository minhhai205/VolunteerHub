"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Users,
  MessageSquare,
  Heart,
  TrendingUp,
  Sparkles,
  Flame,
} from "lucide-react";
import { mockEvents } from "@/lib/mockData";

export function EventFeed() {
  const [activeTab, setActiveTab] = useState("new");

  // Sự kiện mới công bố (trong 7 ngày gần đây)
  const newEvents = mockEvents
    .filter((e) => e.status === "approved")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  // Sự kiện có hoạt động mới (nhiều bình luận gần đây)
  const activeEvents = mockEvents
    .filter((e) => e.status === "approved")
    .sort((a, b) => b.comments - a.comments)
    .slice(0, 5);

  // Sự kiện thu hút (tăng thành viên/like nhanh)
  const trendingEvents = mockEvents
    .filter((e) => e.status === "approved")
    .sort((a, b) => b.participants + b.likes - (a.participants + a.likes))
    .slice(0, 5);

  const renderEventCard = (
    event: (typeof mockEvents)[0],
    showTrending = false
  ) => (
    <Card
      key={event.id}
      className="p-6 hover:border-primary/50 transition-colors"
    >
      <div className="flex gap-4">
        {/* Event Image */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>

        {/* Event Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1">
                {event.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {event.description}
              </p>
            </div>
            <Badge
              variant={event.status === "approved" ? "default" : "secondary"}
            >
              {event.status === "approved"
                ? "Đã duyệt"
                : event.status === "pending"
                ? "Chờ duyệt"
                : "Từ chối"}
            </Badge>
          </div>

          {/* Event Details */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(event.date).toLocaleDateString("vi-VN")}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                {event.category}
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-sm">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">
                {event.participants}
              </span>
              <span className="text-muted-foreground">người tham gia</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-foreground">
                {event.comments}
              </span>
              <span className="text-muted-foreground">bình luận</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="font-medium text-foreground">{event.likes}</span>
              <span className="text-muted-foreground">lượt thích</span>
            </div>
            {showTrending && (
              <div className="flex items-center gap-1.5 text-sm text-orange-500">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Đang hot</span>
              </div>
            )}
          </div>

          {/* Manager Info */}
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {event.createdBy?.charAt(0) || "?"}
                  </span>
                </div>
                <span>
                  Tạo bởi{" "}
                  <span className="text-foreground font-medium">
                    {event.createdBy || "Không rõ"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="new" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Mới công bố
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Có hoạt động
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <Flame className="w-4 h-4" />
            Đang thu hút
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Sự kiện mới công bố
            </h2>
            <Badge variant="secondary">{newEvents.length}</Badge>
          </div>
          <div className="space-y-4">
            {newEvents.map((event) => renderEventCard(event))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-foreground">
              Sự kiện có tin bài mới
            </h2>
            <Badge variant="secondary">{activeEvents.length}</Badge>
          </div>
          <div className="space-y-4">
            {activeEvents.map((event) => renderEventCard(event))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-semibold text-foreground">
              Sự kiện đang thu hút
            </h2>
            <Badge variant="secondary">{trendingEvents.length}</Badge>
          </div>
          <div className="space-y-4">
            {trendingEvents.map((event) => renderEventCard(event, true))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
