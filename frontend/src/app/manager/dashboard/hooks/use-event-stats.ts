"use client";

import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useState, useEffect } from "react";

export interface EventStatsData {
  totalEvents: number;
  totalVolunteers: number;
  trendingEvents: number;
  totalNewDiscussionPosts: number;
}

export function useEventStats() {
  const [data, setData] = useState<EventStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetchWithAuth(
          "http://localhost:8080/api/dashboard/manager/statistics"
        ).then((res) => res.json());

        if (!response.status) throw new Error("Failed to fetch stats");
        setData(response.data);

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { data, loading, error };
}
