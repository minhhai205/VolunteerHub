"use client";

import { useState, useEffect } from "react";
import EventRequestHeader from "./event-request-header";
import EventRequestList from "./event-request-list";
import styles from "./styles/event-requests.module.css";
import filterStyles from "./styles/event-request-filter.module.css";
import { Request } from "./event-request-list";
import { getAccessToken } from "@/lib/token";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { toastManager } from "@/components/static/toast/toast";

interface ApiResponse {
  status: number;
  message: string;
  data: {
    pageNo: number;
    pageSize: number;
    totalPage: number;
    total: number;
    data: Request[];
  };
}

type FilterStatus = "pending" | "approved" | "rejected" | null;

export default function EventRequestsManager() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const token = getAccessToken();

  const fetchRequests = async (
    page: number = currentPage - 1,
    size: number = pageSize,
    status: FilterStatus = filterStatus
  ) => {
    try {
      setLoading(true);

      let url = `http://localhost:8080/api/event-request/registration-list?page=${page}&size=${size}`;

      if (status) {
        url += `&status=${status}`;
      }

      const response = await fetchWithAuth(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

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

  const handleFilterChange = (status: FilterStatus) => {
    setFilterStatus(status);
    setCurrentPage(1);
    fetchRequests(0, pageSize, status);
  };

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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchRequests(page - 1, pageSize, filterStatus);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
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

  return (
    <div className={styles.container}>
      <EventRequestHeader totalRequests={totalElements} />

      {/* Filter Buttons */}
      <div className={filterStyles.filterContainer}>
        <button
          onClick={() => handleFilterChange(null)}
          className={`${filterStyles.filterButton} ${filterStyles.filterAll} ${
            filterStatus === null ? filterStyles.active : ""
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => handleFilterChange("pending")}
          className={`${filterStyles.filterButton} ${
            filterStyles.filterPending
          } ${filterStatus === "pending" ? filterStyles.active : ""}`}
        >
          Chưa duyệt
        </button>
        <button
          onClick={() => handleFilterChange("approved")}
          className={`${filterStyles.filterButton} ${
            filterStyles.filterApproved
          } ${filterStatus === "approved" ? filterStyles.active : ""}`}
        >
          Đã duyệt
        </button>
        <button
          onClick={() => handleFilterChange("rejected")}
          className={`${filterStyles.filterButton} ${
            filterStyles.filterRejected
          } ${filterStatus === "rejected" ? filterStyles.active : ""}`}
        >
          Đã từ chối
        </button>
      </div>

      {requests.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
          Hiện chưa có yêu cầu đăng ký nào
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
