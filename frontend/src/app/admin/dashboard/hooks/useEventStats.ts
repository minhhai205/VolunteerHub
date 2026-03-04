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
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/admin/statistics`
        );
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const body = await res.json();
        setData(body?.data ?? null);
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
