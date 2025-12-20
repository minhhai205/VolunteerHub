"use client";

import { useState, useEffect } from "react";
import styles from "./event-requests-page.module.css";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getAccessToken } from "@/lib/token";
import { EventRequestHeader } from "./event-request-header";
import { EventRequestList } from "./event-request-list";

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

type FilterType = "all" | EventStatus;

export function EventRequestsPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const fetchEventRequests = async (
    page: number = currentPage,
    filterStatus: FilterType = filter
  ) => {
    try {
      setLoading(true);
      setError(null);

      const token = getAccessToken();

      // Tạo URL với các query params
      let url = `http://localhost:8080/api/event-request/create-request?page=${page}&size=${pageSize}`;

      // Thêm status vào URL nếu filter không phải "all"
      if (filterStatus !== "all") {
        url += `&status=${filterStatus}`;
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

  // Initial load
  useEffect(() => {
    fetchEventRequests(0, "all");
  }, []);

  // Fetch when page changes
  useEffect(() => {
    fetchEventRequests(currentPage, filter);
  }, [currentPage, filter]);

  const pendingCount = eventRequests.filter(
    (r) => r.status === "pending"
  ).length;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setCurrentPage(0); // Reset về trang đầu khi đổi filter
  };

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
        <EventRequestHeader
          totalCount={totalCount}
          currentFilter={filter}
          onFilterChange={handleFilterChange}
          pendingCount={pendingCount}
        />

        <EventRequestList
          requests={eventRequests}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          loading={loading}
        />
      </div>
    </div>
  );
}
