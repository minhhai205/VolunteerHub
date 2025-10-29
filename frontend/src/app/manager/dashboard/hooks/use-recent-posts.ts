"use client"

import { useState, useEffect } from "react"

export interface CommentData {
  id: number
  author: string
  content: string
  timestamp: string
}

export interface PostData {
  id: number
  author: {
    name: string
    avatar: string
  }
  content: string
  image?: string
  timestamp: string
  likes: number
  comments: CommentData[]
}

// Mock data for testing
const mockPosts: PostData[] = [
  {
    id: 1,
    author: {
      name: "Nguyễn Văn A",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    },
    content: "Vừa hoàn thành chương trình tình nguyện tại trường tiểu học Lê Lợi. Rất vui được giúp đỡ các em nhỏ! 🎉",
    image: "/images/volunteer-event.jpg",
    timestamp: "2 giờ trước",
    likes: 24,
    comments: [
      {
        id: 1,
        author: "Trần Thị B",
        content: "Tuyệt vời! Các em nhỏ chắc rất vui",
        timestamp: "1 giờ trước",
      },
      {
        id: 2,
        author: "Lê Văn C",
        content: "Công việc tốt lắm!",
        timestamp: "30 phút trước",
      },
    ],
  },
  {
    id: 2,
    author: {
      name: "Trần Thị B",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    },
    content: "Tuyên bố mở đơn tình nguyện cho dự án cây xanh thành phố. Ai quan tâm thì đăng ký nha!",
    timestamp: "5 giờ trước",
    likes: 18,
    comments: [
      {
        id: 3,
        author: "Nguyễn Văn A",
        content: "Mình sẽ tham gia!",
        timestamp: "4 giờ trước",
      },
    ],
  },
  {
    id: 3,
    author: {
      name: "Lê Văn C",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gracie",
    },
    content:
      "Cảm ơn tất cả những người đã tham gia sự kiện dọn dẹp bãi biển hôm qua. Chúng ta đã thu gom được 50kg rác!",
    image: "/images/beach-cleanup.jpg",
    timestamp: "1 ngày trước",
    likes: 42,
    comments: [
      {
        id: 4,
        author: "Nguyễn Văn A",
        content: "Tuyệt vời! Bảo vệ môi trường là trách nhiệm của chúng ta",
        timestamp: "23 giờ trước",
      },
    ],
  },
]

export function useRecentPosts() {
  const [posts, setPosts] = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        // For now, use mock data. Replace with API call when ready
        // const response = await fetch("/api/posts/recent")
        // if (!response.ok) throw new Error("Failed to fetch posts")
        // const result = await response.json()
        // setPosts(result)

        // Using mock data for testing
        setPosts(mockPosts)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return { posts, loading, error }
}
