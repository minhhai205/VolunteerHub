"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export interface TrendingEvent {
  id: number;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  countMembers: number;
  countPosts: number;
  imageUrl: string;
  categoryNames: string[];
}

export function useTrendingEvents() {
  const [events, setEvents] = useState<TrendingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // For now, use mock data. Replace with API call when ready

        const response = await fetchWithAuth(
          "http://localhost:8080/api/event/trending",
          { method: "GET" }
        ).then((res) => res.json());

        // backend trả về { status, message, data }
        if (response.status !== 200)
          throw new Error(
            response.message || "Failed to fetch trending events"
          );

        setEvents(response.data || []); // lấy mảng sự kiện từ result.data
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
}
