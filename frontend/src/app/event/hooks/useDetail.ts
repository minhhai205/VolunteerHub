/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/* ---------- Interfaces ---------- */
export interface User {
  id: number;
  fullName: string;
  avatar?: string;
}

export interface Comment {
  id: number;
  user: User;
  content: string;
  createdAt: string;
}

export interface PostMedia {
  id: number;
  fileUrl: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  eventId: number;
  user?: User;
  likesCount?: number;
  isLiked?: boolean;
  medias?: PostMedia[];
  commentsCount?: number;
  comments?: Comment[];
  createdAt: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  categoryNames?: string[];
  countMembers?: number;
  countPosts?: number;
  posts?: Post[];
}

export interface PaginatedPostResponse {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  data: Post[];
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface PaginatedCommentResponse {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  data: Comment[];
}


export async function fetchEventData(eventId: string): Promise<Event> {
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/event/${eventId}`, {
      method: "GET",
    });

    const response = await res.json();

    // Kiểm tra status logic từ backend
    if (response.status !== 200) {
      const error: any = new Error(
        response.message || "Failed to fetch event detail"
      );
      error.status = response.status;
      throw error;
    }

    return response.data as Event;
  } catch (error) {
    console.error("Failed to fetch event:", error);
    throw error;
  }
}

export async function fetchPosts(
  eventId: string,
  pageNo: number = 0,
  pageSize: number = 2
): Promise<PaginatedPostResponse> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/post/post-list/${eventId}?page=${pageNo}&size=${pageSize}`,
      { method: "GET" }
    ).then((res) => res.json());

    if (response.status === 200) {
      if (
        response.data &&
        typeof response.data === "object" &&
        "data" in response.data
      ) {
        return response.data as PaginatedPostResponse;
      }

      const posts = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      return {
        pageNo: pageNo,
        pageSize: pageSize,
        totalPage: Math.ceil(posts.length / pageSize),
        data: posts.slice(pageNo * pageSize, (pageNo + 1) * pageSize),
      };
    }

    throw new Error(response.message || "Failed to fetch posts");
  } catch (error) {
    console.error("Lỗi khi lấy bài viết:", error);
    throw error;
  }
}

export async function createPost(
  eventId: string,
  content: string,
  medias?: string[]
): Promise<Post> {
  const payload = {
    eventId,
    content,
    medias: medias || [],
  };

  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/post/create-post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => res.json());

    console.log(response)
    if (response.status !== 200) {
      const errorText = await response.message;
      throw new Error(`Tạo bài viết thất bại: ${errorText}`);
    }

    return response.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

export async function likePost(post: Post): Promise<Post> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/post/reaction/${post.id}`,
      {
        method: "POST",
      }
    ).then((res) => res.json());

    if (response.status !== 200) {
      throw new Error("Like bài viết thất bại");
    }
    
    post.isLiked = !post.isLiked;
    post.likesCount = (post.likesCount || 0) + (post.isLiked ? 1 : -1);

    return post;
  } catch (error) {
    throw error;
  }
}

export async function fetchComments(
  postId: number,
  pageNo: number = 0,
  pageSize: number = 2
): Promise<PaginatedCommentResponse> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/comment/comment-list/${postId}?page=${pageNo}&size=${pageSize}`,
      { method: "GET" }
    ).then((res) => res.json());

    if (response.status === 200) {
      if (
        response.data &&
        typeof response.data === "object" &&
        "data" in response.data
      ) {
        return response.data as PaginatedCommentResponse;
      }
      console.log(response)

      const comments = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      return {
        pageNo: pageNo,
        pageSize: pageSize,
        totalPage: Math.ceil(comments.length / pageSize),
        data: comments.slice(pageNo * pageSize, (pageNo + 1) * pageSize),
      };
    }

    throw new Error(response.message || "Failed to fetch comments");
  } catch (error) {
    console.error("Lỗi khi lấy bình luận:", error);
    throw error;
  }
}


export async function addComment(
  postId: number,
  content: string
): Promise<Comment> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/comment/create-comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, content }),
    });



    const result = await response.json();

        console.log(result);

    if (result.status !== 200) {
      throw new Error(result.message || "Thêm bình luận thất bại");
    }

    return result.data as Comment;
  } catch (error) {
    throw error;
  }
}
