import { useEffect, useState, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { User } from "@/lib/mockData";

// Giữ nguyên interface response của bạn
interface UserListResponse {
  status: number;
  message: string;
  data: {
    pageNo: number;
    pageSize: number;
    totalPage: number;
    data: User[];
  };
}

// Định nghĩa một interface cho thông tin phân trang
// Sẽ dùng làm state và giá trị trả về
interface PaginationState {
  pageNo: number;
  pageSize: number;
  totalPage: number;
}

/**
 * Hook tùy chỉnh để fetch danh sách người dùng với phân trang.
 * @param initialPage Trang bắt đầu, mặc định là 1
 * @param initialPageSize Số lượng item mỗi trang, mặc định là 10
 */
export function useUserList(initialPage = 1, initialPageSize = 10) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Quản lý tất cả state phân trang trong một object
  const [pagination, setPagination] = useState<PaginationState>({
    pageNo: initialPage,
    pageSize: initialPageSize,
    totalPage: 1, // Mặc định là 1 để tránh lỗi chia cho 0
  });

  // 2. useEffect sẽ chạy lại mỗi khi `pageNo` hoặc `pageSize` thay đổi
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token");

        // 3. Xây dựng URL động với query params
        const queryParams = new URLSearchParams({
          pageNo: pagination.pageNo.toString(),
          pageSize: pagination.pageSize.toString(),
        });
        const url = `http://localhost:8080/api/user/user-list?${queryParams}`;

        const response = await fetchWithAuth(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) throw new Error("Không thể tải danh sách người dùng");

        const result = (await response.json()) as UserListResponse;

        if (result.data) {
          // 4. Tách mảng user và thông tin phân trang
          const { data, ...paginationInfo } = result.data;
          setUsers(data || []);
          setPagination(paginationInfo); // Cập nhật state phân trang từ API
        } else {
          setUsers([]);
          // Đặt lại nếu không có dữ liệu
          setPagination((prev) => ({ ...prev, pageNo: 1, totalPage: 1 }));
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [pagination.pageNo, pagination.pageSize]); // <-- Mảng dependencies

  // 5. Tạo các hàm điều hướng, bọc trong `useCallback`
  //    để chúng có thể được sử dụng an toàn trong dependencies của component con.

  /** Chuyển đến một trang cụ thể */
  const setPage = useCallback(
    (page: number) => {
      // Chỉ cập nhật nếu trang nằm trong giới hạn hợp lệ
      if (page > 0 && page <= pagination.totalPage) {
        setPagination((prev) => ({ ...prev, pageNo: page }));
      }
    },
    [pagination.totalPage]
  );

  /** Chuyển đến trang tiếp theo */
  const nextPage = useCallback(() => {
    if (pagination.pageNo < pagination.totalPage) {
      setPage(pagination.pageNo + 1);
    }
  }, [pagination.pageNo, pagination.totalPage, setPage]);

  /** Chuyển về trang trước */
  const prevPage = useCallback(() => {
    if (pagination.pageNo > 1) {
      setPage(pagination.pageNo - 1);
    }
  }, [pagination.pageNo, setPage]);

  /** Thay đổi kích thước trang (và reset về trang 1) */
  const setPageSize = useCallback((size: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: size,
      pageNo: 1, // Quay về trang 1 khi đổi page size
    }));
  }, []);

  // 6. Trả về state và các hàm điều khiển
  return {
    users,
    loading,
    error,
    pagination, // Trả về object chứa (pageNo, pageSize, totalPage)
    setPage,
    setPageSize,
    nextPage,
    prevPage,
  };
}
