"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, MessageSquare, Users } from "lucide-react";
import { useTrendingEvents } from "../../hooks/use-trending-events";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./trending-events-section.module.css";

export function TrendingEventsSection() {
  const { events, loading } = useTrendingEvents();
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

  return (
    <Card className={`${styles.cardGreen} border-border`}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Sự kiện Trending
        </CardTitle>
      </CardHeader>

      <CardContent className={styles.contentContainer}>
        {loading ? (
          <p className="text-muted-foreground">Đang tải...</p>
        ) : events.length === 0 ? (
          <p className="text-muted-foreground">Không có sự kiện trending</p>
        ) : (
          <>
            {displayedEvents.map((event) => (
              <div
                key={event.id}
                className={styles.trendingCard}
                onClick={() => handleViewEventDetails(event.id)}
              >
                <div className={styles.imageContainer}>
                  <img
                    src={event.imageUrl || "/placeholder.svg"}
                    alt={event.name}
                    className={styles.eventImage}
                  />
                </div>

                <div className={styles.contentWrapper}>
                  <div className={styles.headerSection}>
                    <h3 className="font-semibold text-foreground text-lg">
                      {event.name}
                    </h3>
                  </div>

                  <div className={styles.descriptionSection}>
                    <p className={styles.eventDescription}>
                      {event.description || "Không có mô tả"}
                    </p>
                  </div>

                  <div className={styles.footerSection}>
                    <div className={styles.statsSection}>
                      <div className={styles.statItem}>
                        <Users className="w-4 h-4" />
                        <span>{event.countMembers} thành viên</span>
                      </div>
                      <div className={styles.statItem}>
                        <MessageSquare className="w-4 h-4" />
                        <span>{event.countPosts} bài trao đổi</span>
                      </div>
                    </div>
                  </div>
                </div>
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
