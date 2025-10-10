import { useEffect, useState } from "react";

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
  imageUrl: string
}

export function useEventList() {
  const [events, setEvents] = useState<EventCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          "http://localhost:8080/api/event/event-list",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        if (!response.ok) throw new Error("Không thể tải danh sách sự kiện");

        const result = (await response.json()) as {
          status: number;
          message: string;
          data: EventCardData[];
        };
        setEvents(result.data || []);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return { events, loading, error };
}
