import { useState, useEffect, useCallback } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export interface AdminStats {
  totalEvents: number;
  totalVolunteers: number;
  trendingEvents: number;
  totalNewDiscussionPosts: number;
}

export interface EventStats {
  totalEvents: number;
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
}

export function useStatistics() {
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [eventStats, setEventStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token") ?? "";
      const headers = {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      };

      const [resAdmin, resEvent] = await Promise.all([
        fetchWithAuth("http://localhost:8080/api/dashboard/admin/statistics", {
          method: "GET",
          headers,
        }),
        fetchWithAuth(
          "http://localhost:8080/api/dashboard/admin/event/statistics",
          { method: "GET", headers }
        ),
      ]);

      if (!resAdmin.ok)
        throw new Error(`Admin stats fetch failed: ${resAdmin.status}`);
      if (!resEvent.ok)
        throw new Error(`Event stats fetch failed: ${resEvent.status}`);

      const bodyAdmin = await resAdmin.json();
      const bodyEvent = await resEvent.json();

      setAdminStats(bodyAdmin?.data ?? null);
      setEventStats(bodyEvent?.data ?? null);
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    adminStats,
    eventStats,
    loading,
    error,
    refresh: fetchAll,
  };
}
