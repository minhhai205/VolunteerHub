"use client";

import { useState, useEffect } from "react";
import PostForm from "../post-form/post-form";
import PostItem from "../post-item/post-item";
import {
  fetchPosts,
  createPost,
  Post,
  PostMedia,
} from "../../../../hooks/useDetail";
import styles from "./event-discussion.module.css";
import { toastManager } from "@/components/static/toast/toast";

interface EventDiscussionProps {
  eventId: string;
}

interface PaginatedResponse {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  data: Post[];
}

// Type guard function
function isPaginatedResponse(response: unknown): response is PaginatedResponse {
  if (!response || typeof response !== "object") return false;

  const obj = response as Record<string, unknown>;

  return (
    typeof obj.pageNo === "number" &&
    typeof obj.pageSize === "number" &&
    typeof obj.totalPage === "number" &&
    Array.isArray(obj.data)
  );
}

export default function EventDiscussion({ eventId }: EventDiscussionProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(2);

  // Load trang đầu tiên
  useEffect(() => {
    const loadInitialPosts = async () => {
      setLoading(true);
      try {
        const response = await fetchPosts(eventId, 0, pageSize);

        if (isPaginatedResponse(response)) {
          setPosts(response.data);
          setTotalPages(response.totalPage);
          setCurrentPage(0);
        } else if (Array.isArray(response)) {
          setPosts(response);
        }
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialPosts();
  }, [eventId, pageSize]);

  // Hàm tải thêm bài viết
  const loadMorePosts = async () => {
    if (loadingMore || currentPage >= totalPages - 1) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetchPosts(eventId, nextPage, pageSize);

      if (isPaginatedResponse(response)) {
        setPosts((prev) => [...prev, ...response.data]);
        setCurrentPage(nextPage);
        setTotalPages(response.totalPage);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handlePostCreate = async (content: string, medias?: string[]) => {
    try {
      const newPost = await createPost(eventId, content, medias);
      setPosts([newPost, ...posts]);
    } catch (error) {
      console.error("Failed to create post:", error);
      toastManager.error("Tạo bài viết không thành công. Vui lòng thử lại!")
    }
  };

  const handlePostUpdate = (postId: number, updatedPost: Post) => {
    setPosts(posts.map((p) => (p.id === postId ? updatedPost : p)));
  };

  const hasMorePosts = currentPage < totalPages - 1;

  return (
    <div className={styles.discussionSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>Thảo luận</h2>
        <span className={styles.postCount}>{posts.length} bài viết</span>
      </div>

      <PostForm onSubmit={handlePostCreate} />

      <div className={styles.postsList}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Đang tải bài viết...</p>
          </div>
        ) : posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onUpdate={(updated) => handlePostUpdate(post.id, updated)}
              />
            ))}

            {/* Nút Load More */}
            {hasMorePosts && (
              <div className={styles.loadMoreContainer}>
                <button
                  onClick={loadMorePosts}
                  disabled={loadingMore}
                  className={styles.loadMoreButton}
                >
                  {loadingMore ? (
                    <>
                      <div className={styles.smallSpinner}></div>
                      <span>Đang tải...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        className={styles.loadMoreIcon}
                      >
                        <path
                          d="M10 4V16M4 10H16"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span>Tải thêm bài viết</span>
                    </>
                  )}
                </button>
                <p className={styles.loadMoreInfo}>
                  Đã hiển thị {posts.length} bài viết
                </p>
              </div>
            )}

            {/* Thông báo khi hết bài viết */}
            {!hasMorePosts && posts.length > pageSize && (
              <div className={styles.endMessage}>
                <div className={styles.endMessageLine}></div>
                <span className={styles.endMessageText}>
                  Đã hiển thị tất cả bài viết
                </span>
                <div className={styles.endMessageLine}></div>
              </div>
            )}
          </>
        ) : (
          <p className={styles.emptyState}>
            Chưa có bài viết nào. Hãy là người đầu tiên bình luận!
          </p>
        )}
      </div>
    </div>
  );
}
