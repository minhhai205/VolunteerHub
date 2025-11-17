// frontend/src/app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { StatCard } from "./components/StatCard";
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import { useDashboardStats } from "./hooks/useDashboardStats";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

// Import UI components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
// Bỏ import Button nếu không dùng
// import { Button } from "@/components/ui/button";

// --- START: Định nghĩa Types (Sao chép từ các hook của manager) ---
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

export interface TrendingEvent extends EventResponse {
  countPosts: number;
}

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
  comments: CommentData[];
}
// --- END: Định nghĩa Types ---

// --- START: Mock Data cho Recent Posts (Dùng làm fallback) ---
const mockPosts: PostData[] = [
  {
    id: 1,
    author: {
      name: "Nguyễn Văn A (Mock)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    },
    content:
      "Vừa hoàn thành chương trình tình nguyện tại trường tiểu học Lê Lợi. Rất vui được giúp đỡ các em nhỏ! 🎉",
    image: "/images/volunteer-event.jpg",
    timestamp: "2 giờ trước",
    likes: 24,
    comments: [],
  },
  {
    id: 2,
    author: {
      name: "Trần Thị B (Mock)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    },
    content:
      "Tuyên bố mở đơn tình nguyện cho dự án cây xanh thành phố. Ai quan tâm thì đăng ký nha!",
    timestamp: "5 giờ trước",
    likes: 18,
    comments: [],
  },
];
// --- END: Mock Data ---

export default function DashboardPage() {
  // 1. Hook cho Stats Cards (Giữ nguyên)
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
  } = useDashboardStats();

  // --- START: Logic fetch trực tiếp ---

  // 2. State cho Sự kiện mới
  const [newEvents, setNewEvents] = useState<EventResponse[]>([]);
  const [newEventsLoading, setNewEventsLoading] = useState(true);
  const [newEventsError, setNewEventsError] = useState<string | null>(null);

  // 3. State cho Sự kiện thu hút
  const [trendingEvents, setTrendingEvents] = useState<TrendingEvent[]>([]);
  const [trendingEventsLoading, setTrendingEventsLoading] = useState(true);
  const [trendingEventsError, setTrendingEventsError] = useState<string | null>(
    null
  );

  // 4. State cho Bài đăng gần đây
  const [recentPosts, setRecentPosts] = useState<PostData[]>([]);
  const [recentPostsLoading, setRecentPostsLoading] = useState(true);
  const [recentPostsError, setRecentPostsError] = useState<string | null>(null);

  // Fetch Sự kiện mới
  useEffect(() => {
    const fetchNewEvents = async () => {
      try {
        setNewEventsLoading(true);
        // !!! CẬP NHẬT URL NÀY CHO ĐÚNG VỚI API ADMIN CỦA BẠN
        const response = await fetchWithAuth(
          "http://localhost:8080/api/manager/newest" // Giả định URL
        ).then((res) => res.json());

        if (response.status !== 200) {
          throw new Error(response.message || "Failed to fetch new events");
        }
        setNewEvents(response.data || []);
        setNewEventsError(null);
      } catch (err) {
        setNewEventsError(
          err instanceof Error ? err.message : "An error occurred"
        );
      } finally {
        setNewEventsLoading(false);
      }
    };
    fetchNewEvents();
  }, []);

  // Fetch Sự kiện thu hút
  useEffect(() => {
    const fetchTrendingEvents = async () => {
      try {
        setTrendingEventsLoading(true);
        // !!! CẬP NHẬT URL NÀY CHO ĐÚNG VỚI API ADMIN CỦA BẠN
        const response = await fetchWithAuth(
          "http://localhost:8080/api/admin/events/trending" // Giả định URL
        ).then((res) => res.json());

        if (response.status !== 200) {
          throw new Error(
            response.message || "Failed to fetch trending events"
          );
        }
        setTrendingEvents(response.data || []);
        setTrendingEventsError(null);
      } catch (err) {
        setTrendingEventsError(
          err instanceof Error ? err.message : "An error occurred"
        );
      } finally {
        setTrendingEventsLoading(false);
      }
    };
    fetchTrendingEvents();
  }, []);

  // Fetch Bài đăng gần đây
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setRecentPostsLoading(true);
        // !!! CẬP NHẬT URL NÀY CHO ĐÚNG VỚI API ADMIN CỦA BẠN
        const response = await fetchWithAuth(
          "http://localhost:8080/api/admin/posts/recent" // Giả định URL
        ).then((res) => res.json());

        if (response.status !== 200) {
          throw new Error(response.message || "Failed to fetch recent posts");
        }
        setRecentPosts(response.data || []);
        setRecentPostsError(null);
      } catch (err) {
        // Tạm thời dùng mock data nếu API lỗi
        console.warn("API posts lỗi, sử dụng mock data. Lỗi:", err);
        setRecentPosts(mockPosts); // DÙNG MOCK DATA KHI LỖI
        setRecentPostsError(null); // Xóa lỗi vì đã fallback
      } finally {
        setRecentPostsLoading(false);
      }
    };
    fetchRecentPosts();
  }, []);

  // --- END: Logic fetch trực tiếp ---

  // 1. Trạng thái đang tải (Chỉ kiểm tra stats card, các section con sẽ tự xử lý skeleton)
  if (statsLoading) {
    return (
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Tổng quan</h1>
          <p className="text-muted-foreground">
            Xem tổng hợp sự kiện mới, hoạt động và xu hướng
          </p>
        </div>
        {/* Skeleton loading cho Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
        {/* Skeleton cho nội dung sự kiện mới */}
        <div className="mt-12 grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </main>
    );
  }

  // 2. Trạng thái lỗi (Chỉ kiểm tra lỗi của stats card)
  if (statsError || !statsData) {
    return (
      <main className="flex h-full flex-1 flex-col items-center justify-center bg-background p-8">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-xl font-semibold text-destructive">
          Không thể tải dữ liệu thống kê
        </h2>
        <p className="text-muted-foreground">
          {statsError || "Không tìm thấy dữ liệu."}
        </p>
      </main>
    );
  }

  // 3. Trạng thái thành công (dữ liệu đã có)
  return (
    <main className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground">Tổng quan</h1>
        <p className="text-muted-foreground">
          Xem tổng hợp sự kiện mới, hoạt động và xu hướng
        </p>
      </div>

      {/* Stats Grid - Sử dụng 'data' từ hook */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng số sự kiện"
          value={statsData.totalEvents}
          changeType="positive"
          icon={Calendar}
        />
        <StatCard
          title="Sự kiện chờ duyệt"
          value={statsData.pendingEvents}
          changeType="neutral"
          icon={Clock}
        />
        <StatCard
          title="Tổng người dùng"
          value={statsData.totalUsers}
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Tình nguyện viên hoạt động"
          value={statsData.activeVolunteers}
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      {/* --- HIỂN THỊ DỮ LIỆU FETCH ĐƠN GIẢN --- */}
      <div className="mt-12 grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Cột 1: Sự kiện mới */}
        <Card>
          <CardHeader>
            <CardTitle>Sự kiện mới (Toàn hệ thống)</CardTitle>
          </CardHeader>
          <CardContent>
            {newEventsLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : newEventsError ? (
              <div className="text-destructive flex items-center">
                <AlertCircle className="mr-2" size={16} /> Lỗi: {newEventsError}
              </div>
            ) : newEvents.length === 0 ? (
              <p className="text-muted-foreground">Không có sự kiện mới.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2">
                {newEvents.slice(0, 5).map(
                  (
                    event // Chỉ hiển thị 5 sự kiện mới nhất
                  ) => (
                    <li key={event.id}>
                      <Link
                        href={`/event/detail/${event.id}`}
                        className="font-medium hover:underline"
                      >
                        {event.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {event.countMembers} thành viên -{" "}
                        {new Date(event.startDate).toLocaleDateString("vi-VN")}
                      </p>
                    </li>
                  )
                )}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Cột 2: Sự kiện thu hút */}
        <Card>
          <CardHeader>
            <CardTitle>Sự kiện thu hút (Toàn hệ thống)</CardTitle>
          </CardHeader>
          <CardContent>
            {trendingEventsLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : trendingEventsError ? (
              <div className="text-destructive flex items-center">
                <AlertCircle className="mr-2" size={16} /> Lỗi:{" "}
                {trendingEventsError}
              </div>
            ) : trendingEvents.length === 0 ? (
              <p className="text-muted-foreground">
                Không có sự kiện nào thu hút.
              </p>
            ) : (
              <ul className="list-disc pl-5 space-y-2">
                {trendingEvents.slice(0, 5).map(
                  (
                    event // Chỉ hiển thị 5 sự kiện
                  ) => (
                    <li key={event.id}>
                      <Link
                        href={`/event/detail/${event.id}`}
                        className="font-medium hover:underline"
                      >
                        {event.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {event.countMembers} TV, {event.countPosts} bài đăng
                      </p>
                    </li>
                  )
                )}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Cột 3: Bài đăng gần đây */}
        <Card>
          <CardHeader>
            <CardTitle>Bài đăng gần đây (Toàn hệ thống)</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPostsLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : recentPostsError ? (
              <div className="text-destructive flex items-center">
                <AlertCircle className="mr-2" size={16} /> Lỗi:{" "}
                {recentPostsError}
              </div>
            ) : recentPosts.length === 0 ? (
              <p className="text-muted-foreground">Không có bài đăng mới.</p>
            ) : (
              <ul className="space-y-4">
                {recentPosts.slice(0, 4).map(
                  (
                    post // Chỉ hiển thị 4 bài đăng
                  ) => (
                    <li key={post.id} className="flex items-start space-x-3">
                      <Avatar className="h-9 w-9 border">
                        <AvatarImage
                          src={post.author.avatar}
                          alt={post.author.name}
                        />
                        <AvatarFallback>
                          {post.author.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">
                          {post.author.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {post.content}
                        </p>
                      </div>
                    </li>
                  )
                )}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      {/* --- KẾT THÚC PHẦN DỮ LIỆU MỚI --- */}
    </main>
  );
}
