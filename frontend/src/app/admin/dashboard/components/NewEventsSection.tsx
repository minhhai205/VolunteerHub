"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNewestEvents } from "@/hooks/useNewestEvents";

export default function NewEventsSection() {
  const router = useRouter();
  const {
    newestEvents: events = [],
    loading = false,
    error = null,
  } = useNewestEvents();

  const handleViewEventDetails = (eventId: number) => {
    router.push(`/event/detail/${eventId}`);
  };

  if (error) {
    return (
      <Card className="rounded-lg border border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Sự kiện Mới Công bố</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{String(error)}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Sự kiện Mới Công bố</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        ) : events.length === 0 ? (
          <p className="text-sm text-muted-foreground">Không có sự kiện mới</p>
        ) : (
          events.map((event: any, index: number) => (
            <div key={event.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h3 className="text-md font-semibold text-foreground">
                    {event.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {event.description}
                  </p>
                </div>

                <Badge variant="outline" className="ml-4">
                  Mới
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDateRange(
                      event.startDate ?? event.start_date,
                      event.endDate ?? event.end_date
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>
                    {event.countMembers ??
                      event.count_members ??
                      event.attendeeCount ??
                      "—"}{" "}
                    tình nguyện viên
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewEventDetails(event.id)}
                  className="flex items-center gap-2"
                >
                  Xem chi tiết <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {index < events.length - 1 && (
                <hr className="border-t border-border/30" />
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

/** helper */
function formatDateRange(start?: string, end?: string) {
  if (!start && !end) return "Không rõ";
  try {
    const s = start ? new Date(start).toLocaleDateString("vi-VN") : "";
    const e = end ? new Date(end).toLocaleDateString("vi-VN") : "";
    return s && e ? `${s} - ${e}` : s || e || "Không rõ";
  } catch {
    return `${start ?? ""} ${end ?? ""}`.trim() || "Không rõ";
  }
}
