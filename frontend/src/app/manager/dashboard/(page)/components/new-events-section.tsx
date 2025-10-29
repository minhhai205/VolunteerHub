"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { useNewEvents } from "../../hooks/use-new-events";
import { useRouter } from "next/navigation";
import styles from "./new-events-section.module.css";

export function NewEventsSection() {
  const { events, loading } = useNewEvents();
  const router = useRouter();

  const handleViewEventDetails = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-xl">Sự kiện Mới Công bố</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-muted-foreground">Đang tải...</p>
        ) : events.length === 0 ? (
          <p className="text-muted-foreground">Không có sự kiện mới</p>
        ) : (
          events.map((event, index) => (
            <div key={event.id}>
              <div className={styles.eventCard}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {event.status}
                  </Badge>
                </div>
                <div className={styles.eventDetails}>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {event.volunteers} tình nguyện viên
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-green-600 hover:text-green-700"
                  onClick={() => handleViewEventDetails(event.id)}
                >
                  Xem chi tiết
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              {index < events.length - 1 && (
                <hr className="my-4 border-t border-border" />
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}