"use client";

import { Header } from "@/components/static/Header";
import { Footer } from "@/components/static/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Heart,
  Users,
  Target,
  Award,
  ArrowRight,
  Calendar,
} from "lucide-react";
import styles from "./page.module.css";

interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  countMembers: number;
  imageUrl: string;
  categoryNames: string[];
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetchWithAuth(
          "http://localhost:8080/api/event/newest",
          { method: "GET" }
        ).then((res) => res.json());

        if (response.status === 200) {
          setEvents(response.data?.slice(0, 3) || []);
        }
      } catch (err) {
        console.error("Fetch events error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleViewEventDetails = (eventId: number) => {
    router.push(`/event/detail/${eventId}`);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString("vi-VN")} - ${end.toLocaleDateString("vi-VN")}`;
  };
  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Chào mừng đến với UET Volunteer
            </h1>
            <p className={styles.heroDescription}>
              Nơi kết nối những trái tim yêu thương, cùng nhau tạo nên những giá
              trị ý nghĩa cho cộng đồng.
            </p>
            <div className={styles.heroActions}>
              <Link href="/event/list">
                <Button size="lg" className={styles.heroPrimaryButton}>
                  Tham gia ngay
                  <ArrowRight className={styles.heroArrowIcon} />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.statsSection}>
          <div className={styles.statsContainer}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>500+</div>
                <div className={styles.statLabel}>Tình nguyện viên</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>120+</div>
                <div className={styles.statLabel}>Dự án hoàn thành</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>50+</div>
                <div className={styles.statLabel}>Đối tác</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>10K+</div>
                <div className={styles.statLabel}>Người được giúp đỡ</div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className={styles.valuesSection}>
          <div className={styles.valuesHeader}>
            <h2 className={styles.valuesTitle}>Giá trị cốt lõi</h2>
            <p className={styles.valuesDescription}>
              Những giá trị định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className={styles.valuesGrid}>
            <Card className={styles.valueCard}>
              <CardHeader>
                <div className={styles.valueIcon}>
                  <Heart className={styles.valueIconSvg} />
                </div>
                <CardTitle className={styles.valueTitle}>Yêu thương</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={styles.valueDescription}>
                  Lan tỏa tình yêu thương đến mọi người trong cộng đồng
                </CardDescription>
              </CardContent>
            </Card>

            <Card className={styles.valueCard}>
              <CardHeader>
                <div className={styles.valueIcon}>
                  <Users className={styles.valueIconSvg} />
                </div>
                <CardTitle className={styles.valueTitle}>Đoàn kết</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={styles.valueDescription}>
                  Kết nối và hợp tác để tạo ra sức mạnh tập thể
                </CardDescription>
              </CardContent>
            </Card>

            <Card className={styles.valueCard}>
              <CardHeader>
                <div className={styles.valueIcon}>
                  <Target className={styles.valueIconSvg} />
                </div>
                <CardTitle className={styles.valueTitle}>Trách nhiệm</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={styles.valueDescription}>
                  Cam kết thực hiện mọi hoạt động với tinh thần trách nhiệm cao
                </CardDescription>
              </CardContent>
            </Card>

            <Card className={styles.valueCard}>
              <CardHeader>
                <div className={styles.valueIcon}>
                  <Award className={styles.valueIconSvg} />
                </div>
                <CardTitle className={styles.valueTitle}>Chất lượng</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={styles.valueDescription}>
                  Đảm bảo chất lượng trong từng hoạt động và dự án
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recent Activities Section */}
        <section className={styles.activitiesSection}>
          <div className={styles.activitiesContainer}>
            <div className={styles.activitiesHeader}>
              <h2 className={styles.activitiesTitle}>Hoạt động gần đây</h2>
              <p className={styles.activitiesDescription}>
                Những hoạt động từ thiện ý nghĩa mà chúng tôi đã thực hiện
              </p>
            </div>

            <div className={styles.activitiesGrid}>
              {loading ? (
                <p className="text-muted-foreground">Đang tải...</p>
              ) : events.length === 0 ? (
                <p className="text-muted-foreground">Không có sự kiện mới</p>
              ) : (
                events.map((event) => (
                  <Card
                    key={event.id}
                    className={styles.activityCard}
                    onClick={() => handleViewEventDetails(event.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <CardHeader>
                      <div className={styles.activityImage}>
                        {event.imageUrl && (
                          <Image
                            src={event.imageUrl}
                            alt={event.name}
                            className={styles.activityImageElement}
                            width={300}
                            height={200}
                          />
                        )}
                      </div>
                      <CardTitle className={styles.activityTitle}>
                        {event.name}
                      </CardTitle>
                      <div className={styles.activityDate}>
                        <Calendar className={styles.activityDateIcon} />
                        <span>
                          {formatDateRange(event.startDate, event.endDate)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className={styles.activityDescription}>
                        {event.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>
              Cùng chúng tôi tạo nên sự khác biệt
            </h2>
            <p className={styles.ctaDescription}>
              Mỗi hành động nhỏ đều có thể tạo nên những thay đổi lớn. Hãy tham
              gia cùng chúng tôi!
            </p>
            <div className={styles.ctaActions}>
              <Link href="/event/list">
                <Button size="lg" className={styles.ctaPrimaryButton}>
                  Đăng ký tình nguyện
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Liên hệ với chúng tôi
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
