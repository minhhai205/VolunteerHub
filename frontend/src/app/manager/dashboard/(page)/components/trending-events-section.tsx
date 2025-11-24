"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, MessageSquare, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTrendingEvents } from "../../hooks/use-trending-events";
import styles from "./trending-events-section.module.css";

export function TrendingEventsSection() {
  const { events, loading } = useTrendingEvents();

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
          events.map((event) => (
            <div key={event.id} className={styles.trendingCard}>
              <div className={styles.imageContainer}>
                <img
                  src={event.imageUrl || "/placeholder.svg"}
                  alt={event.name}
                  className={styles.eventImage}
                />
              </div>

              <div className={styles.contentWrapper}>
                <div className={styles.headerSection}>
                  <h3 className={styles.eventTitle}>{event.name}</h3>
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

                  <div className={styles.actionSection}>
                    <Link href={`/event/detail/${event.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={styles.viewButton}
                      >
                        Xem chi tiết
                        <ArrowRight className="w-4 h-4 ml-2" />
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
