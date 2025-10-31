"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, Users, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "../components/post/Post";
import styles from "./event-detail.module.css";
import { useDetail } from "../../../hooks/useDetail";

export default function EventDetailPage() {
  const { id } = useParams();
  const { event, posts, loading, error } = useDetail(id as string);

  if (loading) return <p className="text-center py-10">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!event) return <p className="text-center">Không tìm thấy sự kiện.</p>;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/events" className={styles.breadcrumbLink}>
            Sự kiện
          </Link>
          <span>/</span>
          <span className={styles.breadcrumbCurrent}>{event.title}</span>
        </div>

        {/* Event Header */}
        <div className={styles.eventSection}>
          <div className={styles.eventHeader}>
            <div>
              <div className={styles.titleRow}>
                <h1 className={styles.title}>{event.title}</h1>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  {event.status}
                </Badge>
              </div>
              <p className={styles.organizer}>Tổ chức bởi {event.organizer}</p>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Đăng ký tham gia
            </Button>
          </div>

          {/* Event Image */}
          <div className={styles.imageWrapper}>
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              className={styles.image}
            />
          </div>

          {/* Event Meta Info */}
          <div className={styles.metaGrid}>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="size-5 text-emerald-600" />
                <div>
                  <p className={styles.metaLabel}>Ngày</p>
                  <p className={styles.metaValue}>{event.date}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Clock className="size-5 text-emerald-600" />
                <div>
                  <p className={styles.metaLabel}>Thời gian</p>
                  <p className={styles.metaValue}>{event.time}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <MapPin className="size-5 text-emerald-600" />
                <div>
                  <p className={styles.metaLabel}>Địa điểm</p>
                  <p className={styles.metaValue}>{event.location}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Users className="size-5 text-emerald-600" />
                <div>
                  <p className={styles.metaLabel}>Người tham gia</p>
                  <p className={styles.metaValue}>{event.participants}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Description */}
          <Card className={styles.descriptionCard}>
            <CardContent className="p-6">
              <h2 className={styles.sectionTitle}>Về sự kiện</h2>
              <p className={styles.description}>{event.description}</p>

              <h3 className={styles.requirementsTitle}>Yêu cầu tham gia</h3>
              <ul className={styles.requirementsList}>
                {event.requirements.map((req, index) => (
                  <li key={index} className={styles.requirementItem}>
                    <span className={styles.bullet}>•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* User Posts Section */}
        <div>
          <div className={styles.postsHeader}>
            <h2 className={styles.postsTitle}>Thảo luận</h2>
            <Button
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
            >
              Tạo bài viết mới
            </Button>
          </div>

          <div className={styles.postsList}>
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>

          <div className={styles.loadMore}>
            <Button
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
            >
              Xem thêm bài viết
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
