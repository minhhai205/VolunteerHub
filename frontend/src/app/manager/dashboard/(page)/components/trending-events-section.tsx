"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  MessageSquare,
  Heart,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useTrendingEvents } from "../../hooks/use-trending-events";
import styles from "./trending-events-section.module.css";

export function TrendingEventsSection() {
  const { events, loading } = useTrendingEvents();

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Sự kiện Trending
          </CardTitle>
        </div>
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
                {/* Dòng 1: Tiêu đề */}
                <div className={styles.headerSection}>
                  <h3 className={styles.eventTitle}>{event.name}</h3>
                </div>

                {/* Dòng 2: Mô tả */}
                <div className={styles.descriptionSection}>
                  <p className={styles.eventDescription}>
                    {event.description || "Không có mô tả"}
                  </p>
                </div>

                {/* Dòng 3: Thống kê và nút xem chi tiết */}
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
                    <Link href={`/events/${event.id}`}>
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