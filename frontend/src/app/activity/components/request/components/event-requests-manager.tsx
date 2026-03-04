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
        `${process.env.NEXT_PUBLIC_API_URL}/api/event-request/my-registration`,
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
      <EventRequestList requests={requests} />
    </div>
  );
}
