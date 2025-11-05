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

const mockPosts: Post[] = [
  {
    id: 1,
    title: "Bình luận từ Nguyễn Văn A",
    content:
      "Mình rất mong chờ được tham gia sự kiện này! Đây là lần đầu tiên mình tham gia hoạt động tính nguyện và rất hào hức.",
    userId: 1,
    eventId: 1,
    user: { id: 1, fullName: "Nguyễn Văn A", avatar: "" },
    likesCount: 12,
    isLiked: false,
    commentsCount: 2,
    medias: [],
    comments: [
      {
        id: 1,
        user: { id: 2, fullName: "Trần Thị B" },
        content: "Mình cũng vậy, chúng ta cố gắng làm tốt nhé!",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 2,
    title: "Bình luận từ Trần Thị B",
    content:
      "Các bạn có thể cho mình biết chuẩn bị những gì không? Mình muốn tham gia nhưng chưa rõ về trạng phục và dung cụ cần thiết.",
    userId: 2,
    eventId: 1,
    user: { id: 2, fullName: "Trần Thị B", avatar: "" },
    likesCount: 8,
    isLiked: false,
    commentsCount: 0,
    medias: [
      { id: 1, fileUrl: "/images/home1.jpg" },
      // { id: 1, fileUrl: "/images/home1.jpg" },
      // { id: 1, fileUrl: "/images/home1.jpg" },
    ],
    comments: [],
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 3,
    title: "Bình luận từ Lê Minh C",
    content:
      "Mình chia sẻ một số tips hữu ích cho những ai sắp tham gia lần đầu. Hãy mang theo nước uống đầy đủ!",
    userId: 3,
    eventId: 1,
    user: { id: 3, fullName: "Lê Minh C", avatar: "" },
    likesCount: 24,
    isLiked: false,
    commentsCount: 3,
    medias: [],
    comments: [],
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
];

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

    if (response.status !== 200) {
      const errorText = await response.text();
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


/* Cập nhật hàm fetchComments với pagination */
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


/* Cập nhật hàm addComment để trả về comment mới thay vì toàn bộ post */
export async function addComment(
  postId: number,
  content: string
): Promise<Comment> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/post/${postId}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      }
    ).then((res) => res.json());

    if (response.status !== 200) {
      throw new Error("Thêm bình luận thất bại");
    }

    return response.data as Comment;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}