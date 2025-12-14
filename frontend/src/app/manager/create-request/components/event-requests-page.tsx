"use client";

import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { StatsCard } from "./stats-card";
import { FilterButtons } from "./filter-buttons";
import { EventRequestCard } from "./event-request-card";
import styles from "./event-requests-page.module.css";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getAccessToken } from "@/lib/token";

type EventStatus = "pending" | "approved" | "rejected";

interface EventRequest {
  id: number;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  status: EventStatus;
}

interface ApiResponse {
  status: number;
  message: string;
  data: {
    pageNo: number;
    pageSize: number;
    totalPage: number;
    total: number;
    data: EventRequest[];
  };
}

export function EventRequestsPage() {
  const [filter, setFilter] = useState<"all" | EventStatus>("all");
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchEventRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getAccessToken();

        // Tạo URL với các query params
        let url = `http://localhost:8080/api/event-request/create-request?page=${currentPage}&size=${pageSize}`;

        // Thêm status vào URL nếu filter không phải "all"
        if (filter !== "all") {
          url += `&status=${filter}`;
        }

        const response = await fetchWithAuth(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        console.log(result.data.data);

        if (result.status === 200 && result.data?.data) {
          setEventRequests(result.data.data);
          setTotalPages(result.data.totalPage);
          setTotalCount(result.data.total);
        } else {
          throw new Error(result.message || "Failed to fetch data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching event requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventRequests();
  }, [filter, currentPage, pageSize]);

  // Không cần filter ở client nữa vì đã filter ở server
  const filteredRequests = eventRequests;

  const pendingCount = eventRequests.filter(
    (r) => r.status === "pending"
  ).length;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFilterChange = (newFilter: "all" | EventStatus) => {
    setFilter(newFilter);
    setCurrentPage(0); // Reset về trang đầu khi đổi filter
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    if (startPage > 0) {
      pages.push(
        <button
          key={0}
          onClick={() => handlePageChange(0)}
          className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 transition-colors"
        >
          1
        </button>
      );
      if (startPage > 1) {
        pages.push(
          <span key="dots1" className="px-2 text-gray-400">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentPage === i
              ? "bg-green-500 text-white shadow-sm"
              : "text-gray-700 hover:bg-green-50"
          }`}
        >
          {i + 1}
        </button>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push(
          <span key="dots2" className="px-2 text-gray-400">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages - 1}
          onClick={() => handlePageChange(totalPages - 1)}
          className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 transition-colors"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium mb-2">Lỗi tải dữ liệu</p>
            <p className="text-red-500 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <h1>Các Yêu Cầu Tạo Sự Kiện Của Tôi</h1>
              <p>Theo dõi trạng thái các yêu cầu tạo sự kiện đã gửi</p>
            </div>
            <StatsCard label="Tổng đơn" count={totalCount} />
          </div>
        </div>

        <FilterButtons
          currentFilter={filter}
          onFilterChange={handleFilterChange}
          pendingCount={pendingCount}
        />

        <div className={styles.cardsGrid}>
          {filteredRequests.map((request) => (
            <EventRequestCard key={request.id} {...request} />
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className={styles.emptyTitle}>Không có yêu cầu nào</h3>
            <p className={styles.emptyDescription}>
              Không tìm thấy yêu cầu tạo sự kiện nào với bộ lọc này
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2 pb-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-green-50"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">{renderPageNumbers()}</div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages - 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-green-50"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
