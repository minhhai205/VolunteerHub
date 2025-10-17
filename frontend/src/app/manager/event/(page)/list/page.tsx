"use client";

import { useState } from "react";
import styles from "./events.module.css";
import { Header } from "@/components/static/Header";
import { Footer } from "@/components/static/Footer";

interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  participants: number;
  status: "upcoming" | "ongoing" | "completed";
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Chiến dịch Xuân tình nguyện 2025",
    description:
      "Tổ chức các hoạt động tình nguyện phục vụ cộng đồng trong dịp Tết Nguyên đán, mang yêu thương đến với người dân vùng cao.",
    image: "/volunteer-spring-campaign.jpg",
    startDate: "2025-01-15",
    endDate: "2025-02-10",
    participants: 156,
    status: "ongoing",
  },
  {
    id: "2",
    title: "Hiến máu nhân đạo - Giọt hồng yêu thương",
    description:
      "Chương trình hiến máu tình nguyện nhằm góp phần cứu người và lan tỏa tinh thần nhân ái trong cộng đồng sinh viên.",
    image: "/blood-donation-volunteer.jpg",
    startDate: "2025-02-20",
    endDate: "2025-02-22",
    participants: 89,
    status: "upcoming",
  },
  {
    id: "3",
    title: "Dạy học cho trẻ em vùng cao",
    description:
      "Tổ chức các lớp học bổ trợ kiến thức cho trẻ em vùng cao, giúp các em tiếp cận với giáo dục chất lượng hơn.",
    image: "/teaching-children-volunteer.jpg",
    startDate: "2024-12-01",
    endDate: "2024-12-20",
    participants: 45,
    status: "completed",
  },
  {
    id: "4",
    title: "Làm sạch môi trường - Bảo vệ hành tinh xanh",
    description:
      "Hoạt động thu gom rác thải, làm sạch công viên và khu vực công cộng, nâng cao ý thức bảo vệ môi trường.",
    image: "/environmental-cleanup-volunteer.jpg",
    startDate: "2025-03-05",
    endDate: "2025-03-06",
    participants: 120,
    status: "upcoming",
  },
  {
    id: "5",
    title: "Hỗ trợ người già neo đơn",
    description:
      "Thăm hỏi, tặng quà và hỗ trợ sinh hoạt cho người cao tuổi neo đơn tại các viện dưỡng lão và cộng đồng.",
    image: "/elderly-care-volunteer.png",
    startDate: "2025-01-10",
    endDate: "2025-01-25",
    participants: 67,
    status: "ongoing",
  },
  {
    id: "6",
    title: "Xây dựng thư viện cho trường học",
    description:
      "Quyên góp sách vở và xây dựng thư viện mini cho các trường học vùng sâu vùng xa, khuyến khích văn hóa đọc.",
    image: "/library-building-volunteer.jpg",
    startDate: "2024-11-15",
    endDate: "2024-11-30",
    participants: 92,
    status: "completed",
  },
];

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "upcoming" | "ongoing" | "completed"
  >("all");

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || event.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Sắp diễn ra";
      case "ongoing":
        return "Đang diễn ra";
      case "completed":
        return "Đã kết thúc";
      default:
        return status;
    }
  };

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Quản lý sự kiện tình nguyện</h1>
          <p className={styles.subtitle}>
            Theo dõi và quản lý các hoạt động tình nguyện của UET
          </p>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <svg
              className={styles.searchIcon}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "all" ? styles.active : ""
              }`}
              onClick={() => setActiveFilter("all")}
            >
              Tất cả
            </button>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "upcoming" ? styles.active : ""
              }`}
              onClick={() => setActiveFilter("upcoming")}
            >
              Sắp diễn ra
            </button>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "ongoing" ? styles.active : ""
              }`}
              onClick={() => setActiveFilter("ongoing")}
            >
              Đang diễn ra
            </button>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "completed" ? styles.active : ""
              }`}
              onClick={() => setActiveFilter("completed")}
            >
              Đã kết thúc
            </button>
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className={styles.eventList}>
            {filteredEvents.map((event) => (
              <div key={event.id} className={styles.eventCard}>
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className={styles.eventImage}
                />

                <div className={styles.eventContent}>
                  <div className={styles.eventHeader}>
                    <h2 className={styles.eventTitle}>{event.title}</h2>
                    <span
                      className={`${styles.eventStatus} ${
                        styles[event.status]
                      }`}
                    >
                      {getStatusText(event.status)}
                    </span>
                  </div>

                  <p className={styles.eventDescription}>{event.description}</p>

                  <div className={styles.eventMeta}>
                    <div className={styles.metaItem}>
                      <svg
                        className={styles.metaIcon}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>
                        <span className={styles.metaLabel}>Bắt đầu:</span>{" "}
                        {new Date(event.startDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    <div className={styles.metaItem}>
                      <svg
                        className={styles.metaIcon}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>
                        <span className={styles.metaLabel}>Kết thúc:</span>{" "}
                        {new Date(event.endDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    <div className={styles.metaItem}>
                      <svg
                        className={styles.metaIcon}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span>
                        <span className={styles.metaLabel}>Tham gia:</span>{" "}
                        {event.participants} người
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <h3 className={styles.emptyTitle}>Không tìm thấy sự kiện</h3>
            <p className={styles.emptyDescription}>
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
