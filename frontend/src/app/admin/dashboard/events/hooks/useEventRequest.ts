import { useState, useEffect, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { toastManager } from "@/components/static/toast/toast";

// export interface UserSummary {
//   id: string;
//   fullName: string;
//   avatar: string;
// }

export interface EventRequest {
  id: number;
  name: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  imageUrl: string;
  category: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export const useEventRequests = (initialPage = 0, size = 10) => {
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(
        `http://localhost:8080/api/event-request/request-list`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch event requests");
      }
      const result = await response.json();
      setEventRequests(result.data as EventRequest[]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toastManager.error("Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  }, [size]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // const handleApprove = async (id: number) => {
  //   try {
  //     const response = await fetchWithAuth(
  //       `/api/v1/admin/events/requests/${id}/approve`,
  //       { method: "PUT" }
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to approve request");
  //     }
  //     toastManager.success("Event request approved");
  //     // Refresh list
  //     setRequests((prev) => prev.filter((req) => req.id !== id));
  //   } catch (err) {
  //     toastManager.error(
  //       err instanceof Error ? err.message : "Failed to approve"
  //     );
  //   }
  // };

  // const handleReject = async (id: number) => {
  //   try {
  //     const response = await fetchWithAuth(
  //       `/api/v1/admin/events/requests/${id}/reject`,
  //       { method: "PUT" }
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to reject request");
  //     }
  //     toastManager.success("Event request rejected");
  //     // Refresh list
  //     setRequests((prev) => prev.filter((req) => req.id !== id));
  //   } catch (err) {
  //     toastManager.error(
  //       err instanceof Error ? err.message : "Failed to reject"
  //     );
  //   }
  // };

  return {
    eventRequests,
    isLoading,
    error,
    // page,
    // setPage,
    // totalPages,
    // handleApprove,
    // handleReject,
  };
};
