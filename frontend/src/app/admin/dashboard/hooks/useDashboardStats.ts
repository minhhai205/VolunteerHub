// frontend/src/app/admin/dashboard/hooks/useDashboardStats.ts
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

/**
 * Định nghĩa cấu trúc dữ liệu thống kê trả về từ API
 */
export interface DashboardStats {
  totalEvents: number;
  pendingEvents: number;
  totalUsers: number;
  activeVolunteers: number;
}

/**
 * Hook tùy chỉnh để lấy dữ liệu thống kê cho Admin Dashboard
 */
export function useDashboardStats() {
  // State để lưu dữ liệu thống kê
  const [data, setData] = useState<DashboardStats | null>(null);
  // State cho trạng thái tải
  const [loading, setLoading] = useState<boolean>(false);
  // State cho lỗi
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Định nghĩa hàm async để fetch dữ liệu
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Sử dụng fetchWithAuth để gọi API đã xác thực
        const response = await fetchWithAuth(
          "http://localhost:8080/api/admin/stats", // **LƯU Ý: Đây là URL API giả định**
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu tổng quan");
        }

        // Parse JSON và mong đợi cấu trúc { status, message, data }
        // tương tự như trong useList.ts
        const result = (await response.json()) as {
          status: number;
          message: string;
          data: DashboardStats;
        };

        if (result.status === 200 && result.data) {
          setData(result.data); // Cập nhật state với dữ liệu
        } else {
          throw new Error(result.message || "Lỗi không xác định từ API");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Đã xảy ra lỗi không xác định");
        }
      } finally {
        setLoading(false); // Dừng tải khi hoàn tất hoặc lỗi
      }
    };

    fetchStats(); // Gọi hàm fetch khi component được mount
  }, []); // Mảng phụ thuộc rỗng, chỉ chạy một lần

  // Trả về dữ liệu và trạng thái
  return { data, loading, error };
}
