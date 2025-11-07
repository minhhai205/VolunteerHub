"use client";

import { useState, useEffect } from "react";
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
    pageNo: number;
    pageSize: number;
    totalPage: number;
    data: Request[];
  };
}

export default function EventRequestsManager() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = getAccessToken();

  // Fetch danh sách yêu cầu từ API
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        "http://localhost:8080/api/event-request/registration-list",
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
      if (
        result.data === null ||
        result.data.data === null ||
        result.data.data.length === 0
      ) {
        throw new Error("Không thể tải danh sách yêu cầu");
      }
      setRequests(result.data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchRequests();
  }, []);

  // Xử lý approve
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
        // Cập nhật trạng thái local
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

  // Xử lý reject
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
        // Cập nhật trạng thái local
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
            onClick={fetchRequests}
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
      <div className={styles.container}>
        <EventRequestHeader totalRequests={0} />
        <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
          Hiện chưa có yêu cầu đăng ký nào
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <EventRequestHeader totalRequests={requests.length} />
      <EventRequestList
        requests={requests}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
