"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { useNewEvents } from "../../hooks/use-new-events";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./new-events-section.module.css";

export function NewEventsSection() {
  const { events, loading, error } = useNewEvents();
  const router = useRouter();
  const [displayCount, setDisplayCount] = useState(4);
  const displayedEvents = events.slice(0, displayCount);
  const hasMoreEvents = events.length > displayCount;

  const handleViewEventDetails = (eventId: number) => {
    router.push(`/event/detail/${eventId}`);
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 4);
  };

  if (error) {
    return (
      <Card className={`${styles.cardGreen} border-border`}>
        <CardHeader>
          <CardTitle className="text-xl">Sự kiện Mới Công bố</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${styles.cardGreen} border-border`}>
      <CardHeader>
        <CardTitle className="text-xl">Sự kiện Mới Công bố</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-muted-foreground">Đang tải...</p>
        ) : events.length === 0 ? (
          <p className="text-muted-foreground">Không có sự kiện mới</p>
        ) : (
          <>
            {displayedEvents.map((event, index) => (
              <div key={event.id}>
                <div
                  className={styles.eventCard}
                  onClick={() => handleViewEventDetails(event.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.eventCardRow}>
                    {/* Ảnh sự kiện */}
                    {event.imageUrl && (
                      <div className={styles.eventImageContainer}>
                        <img
                          src={event.imageUrl}
                          alt={event.name}
                          className={styles.eventImage}
                        />
                      </div>
                    )}

                    <div className={styles.eventContent}>
                      {/* Tiêu đề và mô tả */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground text-lg">
                            {event.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description}
                          </p>
                        </div>
                        <Badge className={`${styles.badgeNew} ml-2`}>Mới</Badge>
                      </div>

                      {/* Thông tin chi tiết */}
                      <div className={styles.eventDetails}>
                        <div
                          className={`${styles.eventDetail} text-muted-foreground`}
                        >
                          <Calendar className="w-4 h-4" />
                          {formatDateRange(event.startDate, event.endDate)}
                        </div>
                        <div
                          className={`${styles.eventDetail} text-muted-foreground`}
                        >
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                        <div
                          className={`${styles.eventDetail} text-muted-foreground`}
                        >
                          <Users className="w-4 h-4" />
                          {event.countMembers} tình nguyện viên
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider giữa các event */}
                {index < displayedEvents.length - 1 && (
                  <hr className="my-4 border-t border-border" />
                )}
              </div>
            ))}
            {hasMoreEvents && (
              <button
                onClick={handleLoadMore}
                className="mt-4 w-full py-2 px-4 text-center text-green-600 font-semibold hover:bg-green-50 rounded transition-colors"
              >
                Xem thêm →
              </button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

/** Định dạng ngày bắt đầu - kết thúc */
function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start).toLocaleDateString("vi-VN");
  const endDate = new Date(end).toLocaleDateString("vi-VN");
  return `${startDate} - ${endDate}`;
}
