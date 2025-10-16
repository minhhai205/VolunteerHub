"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export interface CommentData {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
}

export interface PostData {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: CommentData[];
}

export interface EventData {
  id: number;
  title: string;
  date: string;
  location: string;
  time: string;
  participants: number;
  description: string;
  image: string;
  status: string;
  organizer: string;
  requirements: string[];
}

interface UseDetailResult {
  event: EventData | null;
  posts: PostData[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook fetch dữ liệu chi tiết sự kiện và bài viết (hoặc mock nếu chưa có API)
 */
export const useDetail = (eventId: string): UseDetailResult => {
  const [event, setEvent] = useState<EventData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventRes, postsRes] = await Promise.allSettled([
          fetchWithAuth(`http://localhost:8080/api/events/${eventId}`),
          fetchWithAuth(`http://localhost:8080/api/events/${eventId}/posts`),
        ]);

        console.log("eventRes.status: ", eventRes.status)

        if (
          eventRes.status === "rejected" ||
          postsRes.status === "rejected" ||
          !eventRes.value.ok
        ) {
          // Mock dữ liệu fallback
          const mockEvent: EventData = {
            id: 1,
            title: "Chiến dịch Mùa hè Xanh 2025",
            date: "2025-10-20",
            location: "Quận 9, TP. HCM",
            time: "07:00 - 17:00",
            participants: 80,
            description:
              "Sự kiện tình nguyện lớn nhất năm nhằm hỗ trợ người dân vùng sâu vùng xa.",
            image: "/placeholder.svg",
            status: "Đang mở đăng ký",
            organizer: "Đoàn Trường Đại học Bách Khoa",
            requirements: [
              "Sinh viên đang theo học đại học",
              "Có tinh thần trách nhiệm cao",
              "Cam kết tham gia đầy đủ thời gian chiến dịch",
            ],
          };

          const mockPosts: PostData[] = [
            {
              id: 1,
              author: {
                name: "Nguyễn Văn A",
                avatar: "/avatars/a.png",
              },
              content: "Mình đã tham gia năm ngoái, rất đáng nhớ luôn 😍",
              timestamp: "2025-10-01T09:00:00Z",
              image: "/images/event1.jpg",
              likes: 23,
              comments: [
                {
                  id: 1,
                  author: { name: "Trần Thị B", avatar: "/avatars/b.png" },
                  content: "Năm nay chắc còn vui hơn!",
                  timestamp: "2025-10-01T10:00:00Z",
                  likes: 3,
                },
              ],
            },
            {
              id: 2,
              author: {
                name: "Lê Minh C",
                avatar: "/avatars/c.png",
              },
              content: "Cho mình hỏi cần chuẩn bị gì khi tham gia ạ?",
              timestamp: "2025-10-02T08:00:00Z",
              likes: 15,
              comments: [],
            },
          ];

          setEvent(mockEvent);
          setPosts(mockPosts);
        } else {
          const eventData: EventData = await eventRes.value.json();
          const postsData: PostData[] =
            postsRes.status === "fulfilled" && postsRes.value.ok
              ? await postsRes.value.json()
              : [];
          setEvent(eventData);
          setPosts(postsData);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("Lỗi khi tải dữ liệu");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);
  return { event, posts, loading, error };
};
