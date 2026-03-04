"use client";

import { useState, useEffect } from "react";
import { getAccessToken } from "@/lib/token";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export interface CommentData {
  id: number;
  author: string;
  content: string;
  timestamp: string;
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
  commentsCount: number;
  comments: CommentData[];
}

interface ApiPostMedia {
  id: number;
  fileUrl: string;
}

interface ApiUser {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  status: string;
}

interface ApiPost {
  id: number;
  eventId: number;
  user: ApiUser;
  title: string;
  content: string;
  medias: ApiPostMedia[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

interface ApiResponse {
  status: number;
  message: string;
  data: ApiPost[];
}

export function useRecentPosts() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = getAccessToken();

        const response = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_API_URL}/api/post/newest-posts`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const result: ApiResponse = await response.json();

        if (result.data && Array.isArray(result.data)) {
          const transformedPosts: PostData[] = result.data.map((post) => ({
            id: post.id,
            author: {
              name: post.user.fullName,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.user.id}`,
            },
            content: post.content,
            image:
              post.medias && post.medias.length > 0
                ? post.medias[0].fileUrl
                : undefined,
            timestamp: formatTime(post.createdAt),
            likes: post.likesCount,
            commentsCount: post.commentsCount,
            comments: [],
          }));

          setPosts(transformedPosts);
        } else {
          setPosts([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return "Vừa xong";
  } else if (diffMins < 60) {
    return `${diffMins} phút trước`;
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  } else {
    return date.toLocaleDateString("vi-VN");
  }
}
