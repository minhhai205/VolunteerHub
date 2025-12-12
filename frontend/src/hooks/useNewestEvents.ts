"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export interface EventResponse {
  id: number;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  countMembers: number;
  imageUrl: string;
  categoryNames: string[];
}

export function useNewestEvents() {
  const [newestEvents, setNewestEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const response = await fetchWithAuth(
          "http://localhost:8080/api/event/newest",
          { method: "GET" }
        ).then((res) => res.json());

        // backend trả về { status, message, data }
        if (response.status !== 200)
          throw new Error(response.message || "Failed to fetch new events");

        console.log("Fetched new events:", response.data);

        setNewestEvents(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Fetch new events error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setNewestEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { newestEvents, loading, error };
}
