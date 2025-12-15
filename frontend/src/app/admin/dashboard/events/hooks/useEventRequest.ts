import { useState, useEffect, useCallback } from "react";
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
  status: "pending" | "approve" | "rejected";
}

interface PaginationState {
  pageNo: number;
  pageSize: number;
  totalPage: number;
}

interface EventRequestListResponse {
  status: number;
  message: string;
  data: {
    pageNo: number; // backend 0-based
    pageSize: number;
    totalPage: number;
    data: EventRequest[];
  };
}

export function useEventRequests(
  page = 1,
  pageSize = 10,
  statusFilter?: "pending" | "processed"
) {
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageNo: page, // UI uses 1-based page
    pageSize,
    totalPage: 1,
  });

  // refetch whenever page / pageSize / statusFilter changes
  useEffect(() => {
    let mounted = true;

    const fetchRequests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token") ?? "";

        // Convert UI 1-based page to backend 0-based page index
        const apiPage = Math.max(0, page - 1);

        // If processed: backend exposes /processed-list (non-paginated),
        // so fetch all and paginate client-side.
        if (statusFilter === "processed") {
          const url = `http://localhost:8080/api/event-request/processed-list`;
          const res = await fetchWithAuth(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          });

          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

          const body = await res.json();
          // body.data expected to be an array of EventRequestResponseDTO
          const allItems: EventRequest[] = Array.isArray(body?.data)
            ? body.data
            : body?.data ?? [];

          if (mounted) {
            const total = allItems.length;
            const totalPage = Math.max(1, Math.ceil(total / pageSize));
            const start = (page - 1) * pageSize;
            const pageItems = allItems.slice(start, start + pageSize);

            setEventRequests(pageItems);
            setPagination({
              pageNo: page,
              pageSize,
              totalPage,
            });
          }
        } else {
          // pending or unspecified: use paginated endpoint /request-list
          const params = new URLSearchParams();
          params.set("page", String(apiPage)); // backend expects 0-based
          params.set("size", String(pageSize));
          if (statusFilter === "pending") {
            // backend expects enum name, uppercase
            params.set("status", "PENDING");
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

          const body = (await res.json()) as EventRequestListResponse;

          if (mounted) {
            const items = body.data?.data ?? [];
            // If no statusFilter provided and you want to support client-side filtering,
            // you can filter here. Currently, pending is handled server-side.
            setEventRequests(items);
            // convert backend 0-based pageNo to UI 1-based pageNo
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
      // Remove from local list
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
      // Remove from local list
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
