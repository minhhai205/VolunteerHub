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
  author: User;
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

// Mock data based on backend DTOs
const mockEvent: Event = {
  id: 1,
  name: "Chiến dịch Xuân tính nguyện 2025",
  description:
    "Chiến dịch Xuân tính nguyện 2025 là một hoạt động ý nghĩa nhằm mang lại niềm vui và sự ấm áp cho cộng đồng trong dịp Tết Nguyên Đán. Chúng tôi sẽ tổ chức các hoạt động trong cây xanh, dọn dẹp môi trường, và trao quà cho các gia đình có hoàn cảnh khó khăn.",
  location: "Hà Nội, Việt Nam",
  imageUrl: "/event-banner.jpg",
  startDate: "2026-01-15T08:00:00",
  endDate: "2026-01-15T17:00:00",
  categoryNames: ["Tình nguyện", "Cộng đồng"],
  countMembers: 156,
  countPosts: 5,
};

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
        author: { id: 2, fullName: "Trần Thị B" },
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

export async function fetchPosts(eventId: string): Promise<Post[]> {
  try {
    const response = await fetchWithAuth(
      `${API_BASE_URL}/post/post-list/${eventId}`,
      { method: "GET" }
    ).then((res) => res.json());

    console.log("Fetching posts for event:", eventId);
    console.log(response.data.data)

    if (response.status == 200) {
      return response.data.data;
    }
  } catch (error) {
    console.warn("API call failed, using mock data:", error);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPosts);
    }, 300);
  });
}

export async function createPost(
  eventId: string,
  content: string,
  medias?: PostMedia[]
): Promise<Post> {
  // try {
  //   const payload = {
  //     eventId,
  //     content,
  //     medias: medias || [],
  //   }
  //   const response = await fetch(`${API_BASE_URL}/posts`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   })
  //   if (response.ok) {
  //     return response.json()
  //   }
  // } catch (error) {
  //   console.warn("API call failed, using mock data:", error)
  // }

  return new Promise((resolve) => {
    setTimeout(() => {
      const newPost: Post = {
        id: Date.now(),
        title: "Bài viết của bạn",
        content,
        userId: 0,
        eventId: Number.parseInt(eventId),
        user: { id: 0, fullName: "Bạn" },
        likesCount: 0,
        isLiked: false,
        commentsCount: 0,
        medias: medias || [],
        comments: [],
        createdAt: new Date().toISOString(),
      };
      resolve(newPost);
    }, 300);
  });
}

export async function likePost(postId: number): Promise<Post> {
  // try {
  //   const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
  //     method: "POST",
  //   })
  //   if (response.ok) {
  //     return response.json()
  //   }
  // } catch (error) {
  //   console.warn("API call failed, using mock data:", error)
  // }

  return new Promise((resolve) => {
    setTimeout(() => {
      const post = mockPosts.find((p) => p.id === postId);
      if (post) {
        post.isLiked = !post.isLiked;
        post.likesCount = (post.likesCount || 0) + (post.isLiked ? 1 : -1);
        resolve(post);
      }
    }, 200);
  });
}

export async function addComment(
  postId: number,
  content: string
): Promise<Post> {
  // try {
  //   const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ content }),
  //   })
  //   if (response.ok) {
  //     return response.json()
  //   }
  // } catch (error) {
  //   console.warn("API call failed, using mock data:", error)
  // }

  return new Promise((resolve) => {
    setTimeout(() => {
      const post = mockPosts.find((p) => p.id === postId);
      if (post) {
        const newComment: Comment = {
          id: Date.now(),
          author: { id: 0, fullName: "Bạn" },
          content,
          createdAt: new Date().toISOString(),
        };
        post.comments = [...(post.comments || []), newComment];
        post.commentsCount = (post.commentsCount || 0) + 1;
        resolve(post);
      }
    }, 300);
  });
}
