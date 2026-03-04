import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export interface EventCardData {
  id: number;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  categoryNames: string[];
  countMembers: number;
  countPosts: number;
  imageUrl: string;
  status?: string;
}

export interface Pageable {
  page: number;
  size: number;
  sort?: string[];
}

export interface FilterParams {
  category?: string;
  status?: string;
  fromDate?: string;
}

export interface PageResponse<T> {
  data: T[];
  totalPage: number;
  pageNo: number;
  pageSize: number;
}

export function useEventList(
  search: string = "",
  pageable: Pageable,
  filters?: FilterParams
) {
  const [events, setEvents] = useState<EventCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("access_token");

        // Xây dựng query params
        const params = new URLSearchParams({
          page: pageable.page.toString(),
          size: pageable.size.toString(),
        });

        console.log(pageable);

        // Thêm search nếu có
        params.append("search", search.trim());

        // Thêm filters nếu có
        if (filters?.category) {
          params.append("categoryId", filters.category);
        }
        if (filters?.status) {
          params.append("status", filters.status);
        }
        if (filters?.fromDate) {
          params.append("fromDate", filters.fromDate);
        }
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/event/event-list?${params.toString()}`;

        const response = await fetchWithAuth(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) {
          throw new Error("Không thể tải danh sách sự kiện");
        }

        const result = (await response.json()) as {
          status: number;
          message: string;
          data: PageResponse<EventCardData>;
        };

        // Cập nhật state từ response phân trang
        setEvents(result.data.data || []);
        setTotalPages(result.data.totalPage || 0);
        console.log(result.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Lỗi không xác định");
        }
        // Reset data khi có lỗi
        setEvents([]);
        setTotalPages(0);
        setTotalElements(0);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [
    search,
    pageable.page,
    pageable.size,
    pageable.sort,
    filters?.category,
    filters?.status,
    filters?.fromDate,
  ]);

  return {
    events,
    loading,
    error,
    totalPages,
    totalElements,
  };
}
