import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { toastManager } from "@/components/static/toast/toast";

export interface EventRequest {
  id: number;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  category: string[];
  status: "pending" | "approved" | "rejected";
}

interface PaginationState {
  pageNo: number;
  pageSize: number;
  totalPage: number;
}

/**
 * Backend response shapes
 */
interface PageData<T> {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  data: T[];
}
interface ApiPageResponse<T> {
  status: number;
  message: string;
  data: PageData<T>;
}

/**
 * EventResponseDTO (from backend) simplified
 */
interface EventResponseDTO {
  id: number;
  name: string;
  description?: string;
  location?: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  categoryNames?: string[] | Set<string>;
}

export function useEventRequests(
  page = 1,
  pageSize = 10,
  statusFilter?: "pending" | "approved" | "rejected"
) {
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageNo: page, // UI uses 1-based page
    pageSize,
    totalPage: 1,
  });

  useEffect(() => {
    let mounted = true;

    const fetchRequests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token") ?? "";

        // Convert UI 1-based page to backend 0-based page index
        const apiPage = Math.max(0, page - 1);

        const params = new URLSearchParams();
        params.set("page", String(apiPage));
        params.set("size", String(pageSize));

        // If asking for approved events, call events API and map to EventRequest shape
        if (statusFilter === "approved") {
          const url = `http://localhost:8080/api/event/event-list?${params.toString()}`;
          const res = await fetchWithAuth(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          });

          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

          const body = (await res.json()) as ApiPageResponse<EventResponseDTO>;

          if (mounted) {
            const events = body.data?.data ?? [];
            const items: EventRequest[] = events.map((e) => ({
              id: e.id,
              name: e.name,
              description: e.description ?? "",
              location: e.location ?? "",
              startDate: e.startDate ?? "",
              endDate: e.endDate ?? "",
              imageUrl: e.imageUrl ?? "",
              category: Array.isArray(e.categoryNames)
                ? e.categoryNames
                : e.categoryNames
                ? Array.from(e.categoryNames as Set<string>)
                : [],
              status: "approved",
            }));
            setEventRequests(items);
            const backendPageNo = body.data?.pageNo ?? apiPage;
            setPagination({
              pageNo: backendPageNo + 1,
              pageSize: body.data?.pageSize ?? pageSize,
              totalPage: body.data?.totalPage ?? 1,
            });
          }
        } else {
          // original behavior: fetch event requests (pending/rejected etc.)
          if (statusFilter) {
            params.set("status", statusFilter.toUpperCase());
          }
          const url = `http://localhost:8080/api/event-request/request-list?${params.toString()}`;

          const res = await fetchWithAuth(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          });

          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

          const body = (await res.json()) as ApiPageResponse<EventRequest>;

          if (mounted) {
            const items = body.data?.data ?? [];
            setEventRequests(items);
            const backendPageNo = body.data?.pageNo ?? apiPage;
            setPagination({
              pageNo: backendPageNo + 1,
              pageSize: body.data?.pageSize ?? pageSize,
              totalPage: body.data?.totalPage ?? 1,
            });
          }
        }
      } catch (err: unknown) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
          toastManager.error("Failed to load requests");
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchRequests();
    return () => {
      mounted = false;
    };
  }, [page, pageSize, statusFilter]);

  const handleApprove = async (id: number) => {
    try {
      const response = await fetchWithAuth(
        `http://localhost:8080/api/event-request/approve/${id}`,
        { method: "PATCH" }
      );
      if (!response.ok) {
        throw new Error("Failed to approve request");
      }
      toastManager.success("Event request approved");
      setEventRequests((prev) => prev.filter((req) => req.id !== id));
      return true;
    } catch (err) {
      toastManager.error(
        err instanceof Error ? err.message : "Failed to approve"
      );
      return false;
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await fetchWithAuth(
        `http://localhost:8080/api/event-request/reject/${id}`,
        { method: "PATCH" }
      );
      if (!response.ok) {
        throw new Error("Failed to reject request");
      }
      toastManager.success("Event request rejected");
      setEventRequests((prev) => prev.filter((req) => req.id !== id));
      return true;
    } catch (err) {
      toastManager.error(
        err instanceof Error ? err.message : "Failed to reject"
      );
      return false;
    }
  };

  const refresh = () => {
    // callers can change page or status to trigger refetch; provide placeholder refresh if needed
    setTimeout(() => {}, 0);
  };

  return {
    eventRequests,
    isLoading,
    error,
    pagination,
    handleApprove,
    handleReject,
    refresh,
  };
}
