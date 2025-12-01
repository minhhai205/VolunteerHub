"use client";

import { useState, useEffect } from "react";
import styles from "./events.module.css";
import { Header } from "@/components/static/HeaderManager";
import { Footer } from "@/components/static/Footer";
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

interface PageResponse {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  data: ApiEvent[];
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 4;
  const [totalPages, setTotalPages] = useState(0);

  const getStatusParam = (
    filter: "all" | "upcoming" | "ongoing" | "completed"
  ): string => {
    switch (filter) {
      case "all":
        return "0";
      case "upcoming":
        return "1";
      case "ongoing":
        return "2";
      case "completed":
        return "3";
      default:
        return "0";
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = getAccessToken();
        if (!token) {
          throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
        }

        // Xây dựng URL với query params
        const params = new URLSearchParams({
          page: currentPage.toString(),
          size: pageSize.toString(),
        });

        console.log(params);

        params.append("search", searchQuery.trim());
        params.append("status", getStatusParam(activeFilter));

        const response = await fetch(
          `http://localhost:8080/api/event/manager/my-event?${params.toString()}`,
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

        const result: { data: PageResponse } = await response.json();

        console.log(result.data);

        if (!result.data || !Array.isArray(result.data.data)) {
          throw new Error("Cấu trúc dữ liệu API trả về không hợp lệ.");
        }

        const pageResponse = result.data;
        const apiData: ApiEvent[] = pageResponse.data;

        // Cập nhật thông tin phân trang
        setTotalPages(pageResponse.totalPage);

        console.log(pageResponse.totalPage);

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
  }, [currentPage, pageSize, searchQuery, activeFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const handleFilterChange = (
    filter: "all" | "upcoming" | "ongoing" | "completed"
  ) => {
    setActiveFilter(filter);
    // setCurrentPage(0);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusText = (startDateStr: string, endDateStr: string) => {
    const now = new Date();
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    let status: "upcoming" | "ongoing" | "completed";

    if (now < startDate) {
      status = "upcoming";
    } else if (now >= startDate && now <= endDate) {
      status = "ongoing";
    } else {
      status = "completed";
    }

    console.log(status);

    switch (status) {
      case "upcoming":
        return "Sắp diễn ra";
      case "ongoing":
        return "Đang diễn ra";
      case "completed":
        return "Đã kết thúc";
      default:
        return "";
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage < 3) {
        for (let i = 0; i < 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages - 1);
      } else if (currentPage > totalPages - 4) {
        pages.push(0);
        pages.push("...");
        for (let i = totalPages - 4; i < totalPages; i++) pages.push(i);
      } else {
        pages.push(0);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages - 1);
      }
    }

    return pages;
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
              onChange={handleSearchChange}
            />
          </div>
          <div className={styles.filterGroup}>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "all" ? styles.active : ""
              }`}
              onClick={() => handleFilterChange("all")}
            >
              Tất cả
            </button>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "upcoming" ? styles.active : ""
              }`}
              onClick={() => handleFilterChange("upcoming")}
            >
              Sắp diễn ra
            </button>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "ongoing" ? styles.active : ""
              }`}
              onClick={() => handleFilterChange("ongoing")}
            >
              Đang diễn ra
            </button>
            <button
              className={`${styles.filterButton} ${
                activeFilter === "completed" ? styles.active : ""
              }`}
              onClick={() => handleFilterChange("completed")}
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
            {allEvents.length > 0 ? (
              <>
                <div className={styles.eventList}>
                  {allEvents.map((event) => (
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
                            {getStatusText(event.startDate, event.endDate)}
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
                              <span className={styles.metaLabel}>
                                Kết thúc:
                              </span>{" "}
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
                              <span className={styles.metaLabel}>
                                Tham gia:
                              </span>{" "}
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

                {
                  <div className={styles.pagination}>
                    <button
                      className={styles.pageButton}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      Trước
                    </button>

                    <div className={styles.pageNumbers}>
                      {getPageNumbers().map((page, index) => (
                        <button
                          key={index}
                          className={`${styles.pageNumber} ${
                            page === currentPage ? styles.activePage : ""
                          } ${page === "..." ? styles.ellipsis : ""}`}
                          onClick={() =>
                            typeof page === "number" && handlePageChange(page)
                          }
                          disabled={page === "..."}
                        >
                          {typeof page === "number" ? page + 1 : page}
                        </button>
                      ))}
                    </div>

                    <button
                      className={styles.pageButton}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                    >
                      Sau
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                }
              </>
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
      <Footer />
    </div>
  );
}
