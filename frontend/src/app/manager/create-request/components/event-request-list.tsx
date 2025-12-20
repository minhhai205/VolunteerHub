"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { EventRequestCard } from "./event-request-card";
import styles from "./event-requests-page.module.css";

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

interface EventRequestListProps {
  requests: EventRequest[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

export function EventRequestList({
  requests,
  currentPage,
  totalPages,
  onPageChange,
  loading,
}: EventRequestListProps) {
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
          onClick={() => onPageChange(0)}
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
          onClick={() => onPageChange(i)}
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
          onClick={() => onPageChange(totalPages - 1)}
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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.cardsGrid}>
        {requests.map((request) => (
          <EventRequestCard key={request.id} {...request} />
        ))}
      </div>

      {requests.length === 0 && (
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
            onClick={() => onPageChange(currentPage - 1)}
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
            onClick={() => onPageChange(currentPage + 1)}
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
    </>
  );
}
