"use client";

import { useState, useEffect, useRef } from "react";
import EventRequestHeader from "./event-request-header";
import EventRequestList from "./event-request-list";
import styles from "./styles/event-requests.module.css";
import { Request } from "./event-request-list";
import { getAccessToken } from "@/lib/token";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { toastManager } from "@/components/static/toast/toast";

interface ApiResponse {
  status: number;
  message: string;
  data: {
    pageNo: number; // BE trả index 0
    pageSize: number;
    totalPage: number;
    total: number;
    data: Request[];
  };
}

export default function EventRequestsManager() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayLoading, setDisplayLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // FE sử dụng page = 1 làm chuẩn
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const token = getAccessToken();

  // Fetch dữ liệu theo page FE (page FE = 1 → gửi lên BE = 0)
  const fetchRequests = async (
    page: number = currentPage - 1, // FE page → BE page index
    size: number = pageSize
  ) => {
    try {
      setLoading(true);

      const response = await fetchWithAuth(
        `http://localhost:8080/api/event-request/registration-list?page=${page}&size=${size}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tải danh sách yêu cầu");
      }

      const result: ApiResponse = await response.json();
      if (result.data === null || result.data.data === null) {
        throw new Error("Không thể tải danh sách yêu cầu");
      }

      setRequests(result.data.data);
      setTotalPages(result.data.totalPage);
      setTotalElements(result.data.total);

      // BE trả page index 0 → FE index = +1
      setCurrentPage(result.data.pageNo + 1);

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Scroll to top and show loading skeleton when page changes
  useEffect(() => {
    setDisplayLoading(true);
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  }, [currentPage]);

  // Hide loading skeleton after data loads
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setDisplayLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/event-request/registration/approve/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể phê duyệt yêu cầu");
      }

      const result = await response.json();
      if (result.status === 200) {
        toastManager.success("Đã duyệt đơn đăng ký");
        setRequests(
          requests.map((req) =>
            req.id === id ? { ...req, status: "approve" } : req
          )
        );
      } else {
        if (result.status === 403) {
          toastManager.error("Bạn không có quyền thực hiện hành động này");
        }
      }
    } catch (err) {
      console.error("Error approving request:", err);
      toastManager.error("Không thể phê duyệt yêu cầu. Vui lòng thử lại.");
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/event-request/registration/reject/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể từ chối yêu cầu");
      }

      const result = await response.json();
      if (result.status === 200) {
        toastManager.success("Đã từ chối đơn đăng ký");
        setRequests(
          requests.map((req) =>
            req.id === id ? { ...req, status: "rejected" } : req
          )
        );
      } else {
        if (result.status === 403) {
          toastManager.error("Bạn không có quyền thực hiện hành động này");
        }
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("Không thể từ chối yêu cầu. Vui lòng thử lại.");
    }
  };

  // FE page → BE page index
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchRequests(page - 1, pageSize);
    }
  };

  if (displayLoading) {
    return (
      <div className={styles.container} ref={containerRef}>
        <EventRequestHeader totalRequests={0} />
        <div className={styles.skeletonGrid}>
          {Array.from({ length: pageSize }).map((_, i) => (
            <div key={i} className={styles.requestCardSkeleton}>
              <div
                className={`${styles.skeleton} ${styles.skeletonAvatar}`}
              ></div>
              <div className={styles.skeletonContent}>
                <div
                  className={`${styles.skeleton} ${styles.skeletonTitle}`}
                ></div>
                <div
                  className={`${styles.skeleton} ${styles.skeletonText}`}
                ></div>
                <div
                  className={`${styles.skeleton} ${styles.skeletonText}`}
                  style={{ width: "70%" }}
                ></div>
              </div>
              <div className={styles.skeletonActions}>
                <div
                  className={`${styles.skeleton} ${styles.skeletonButton}`}
                ></div>
                <div
                  className={`${styles.skeleton} ${styles.skeletonButton}`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container} ref={containerRef}>
        <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
          Lỗi: {error}
          <button
            onClick={() => fetchRequests()}
            style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className={styles.container} ref={containerRef}>
        <EventRequestHeader totalRequests={0} />
        <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
          Hiện chưa có yêu cầu đăng ký nào
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <EventRequestHeader totalRequests={totalElements} />
      <EventRequestList
        requests={requests}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Pagination */}
      <div className={styles.paginationContainer}>
        <div className={styles.paginationButtons}>
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            ««
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            ‹
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum;

            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`${styles.pageButton} ${
                  currentPage === pageNum ? styles.activePage : ""
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            ›
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            »»
          </button>
        </div>

        <div className={styles.paginationInfo}>
          Trang {currentPage} / {totalPages}
        </div>
      </div>
    </div>
  );
}
