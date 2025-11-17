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

export function useNewEvents() {
  const [events, setEvents] = useState<EventResponse[]>([]);
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

        setEvents(response.data || []); // lấy mảng sự kiện từ result.data
        setError(null);
      } catch (err) {
        console.error("Fetch new events error:", err);
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
