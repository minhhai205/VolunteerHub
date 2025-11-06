"use client";

import { useState, useEffect } from "react";
import styles from "./page1.module.css";
import { getAccessToken } from "@/lib/token";

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

interface ApiEvent {
  id: number | string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  categoryNames: string[];
  countMembers: number;
  countPosts: number;
}

const getEventStatus = (
  startDate: string,
  endDate: string
): "upcoming" | "ongoing" | "completed" => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return "upcoming";
  } else if (now >= start && now <= end) {
    return "ongoing";
  } else {
    return "completed";
  }
};

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "upcoming" | "ongoing" | "completed"
  >("all");

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = getAccessToken();
        if (!token) {
          throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
        }
        const response = await fetch(
          "http://localhost:8080/api/event/my-event",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Lỗi API: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        console.log("Dữ liệu API thực tế:", JSON.stringify(result, null, 2));

        if (!Array.isArray(result.data)) {
          throw new Error("Cấu trúc dữ liệu API trả về không hợp lệ.");
        }

        const apiData: ApiEvent[] = result.data;

        const mappedEvents: Event[] = apiData.map((apiEvent) => ({
          id: apiEvent.id.toString(),
          title: apiEvent.name,
          description: apiEvent.description,
          image: apiEvent.imageUrl || "/placeholder.svg",
          startDate: apiEvent.startDate,
          endDate: apiEvent.endDate,
          participants: apiEvent.countMembers,
          status: getEventStatus(apiEvent.startDate, apiEvent.endDate),
        }));

        setAllEvents(mappedEvents);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Một lỗi không xác định đã xảy ra.");
        }
        console.error("Failed to fetch events:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = allEvents.filter((event) => {
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
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Các sự kiện tôi đã tham gia</h1>
          <p className={styles.subtitle}>
            Theo dõi và quản lý các hoạt động tình nguyện của tôi
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

        {isLoading && (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>Đang tải sự kiện...</h3>
          </div>
        )}

        {!isLoading && error && (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>Lỗi tải dữ liệu</h3>
            <p className={styles.emptyDescription}>{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {filteredEvents.length > 0 ? (
              <div className={styles.eventList}>
                {filteredEvents.map((event) => (
                  <div key={event.id} className={styles.eventCard}>
                    <img
                      src={event.image}
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
                      <p className={styles.eventDescription}>
                        {event.description}
                      </p>
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
                            {new Date(event.startDate).toLocaleDateString(
                              "vi-VN"
                            )}
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
                            {new Date(event.endDate).toLocaleDateString(
                              "vi-VN"
                            )}
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
                        <button
                          className={styles.detailButton}
                          onClick={() =>
                            (window.location.href = `http://localhost:3000/event/detail/${event.id}`)
                          }
                        >
                          Xem chi tiết
                        </button>
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
          </>
        )}
      </main>
    </div>
  );
}
