"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import type { Post, Comment } from "../../../../hooks/useDetail";
import {
  likePost,
  addComment,
  fetchComments,
} from "../../../../hooks/useDetail";
import styles from "./post-item.module.css";
import { toastManager } from "@/components/static/toast/toast";
import { getName } from "@/lib/getDataFromToken";

interface PostItemProps {
  post: Post;
  onUpdate: (post: Post) => void;
}

interface PaginatedCommentResponse {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  data: Comment[];
}

// Type guard function
function isPaginatedCommentResponse(
  response: unknown
): response is PaginatedCommentResponse {
  if (!response || typeof response !== "object") return false;
  const obj = response as Record<string, unknown>;
  return (
    typeof obj.pageNo === "number" &&
    typeof obj.pageSize === "number" &&
    typeof obj.totalPage === "number" &&
    Array.isArray(obj.data)
  );
}

export default function PostItem({ post, onUpdate }: PostItemProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string>("Người dùng");

  // Comment pagination states
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);
  const [currentCommentPage, setCurrentCommentPage] = useState(0);
  const [totalCommentPages, setTotalCommentPages] = useState(1);
  const [commentPageSize] = useState(2);
  const [showComments, setShowComments] = useState(false);

  // Load comments khi mở section comments
  useEffect(() => {
    if (
      showComments &&
      comments.length === 0 &&
      (post.commentsCount || 0) > 0
    ) {
      loadInitialComments();
    }
  }, [showComments]);

  // Get current user name từ token
  useEffect(() => {
    const userName = getName() || "Người dùng";
    setCurrentUserName(userName);
  }, []);

  const loadInitialComments = async () => {
    setLoadingComments(true);
    try {
      const response = await fetchComments(post.id, 0, commentPageSize);

      if (isPaginatedCommentResponse(response)) {
        setComments(response.data);
        setTotalCommentPages(response.totalPage);
        setCurrentCommentPage(0);
      } else if (Array.isArray(response)) {
        setComments(response);
      }
    } catch (error) {
      console.error("Failed to load comments:", error);
      toastManager.error("Không thể tải bình luận");
    } finally {
      setLoadingComments(false);
    }
  };

  const loadMoreComments = async () => {
    if (loadingMoreComments || currentCommentPage >= totalCommentPages - 1)
      return;

    setLoadingMoreComments(true);
    try {
      const nextPage = currentCommentPage + 1;
      const response = await fetchComments(post.id, nextPage, commentPageSize);

      if (isPaginatedCommentResponse(response)) {
        setComments((prev) => {
          const map = new Map<number, Comment>();
          [...prev, ...response.data].forEach((c) => map.set(c.id, c));
          return Array.from(map.values());
        });

        setCurrentCommentPage(nextPage);
        setTotalCommentPages(response.totalPage);
      }
    } catch (error) {
      console.error("Failed to load more comments:", error);
      toastManager.error("Không thể tải thêm bình luận");
    } finally {
      setLoadingMoreComments(false);
    }
  };

  const handleLike = async () => {
    setIsLiking(true);
    try {
      const updatedPost = await likePost(post);
      onUpdate(updatedPost);
    } catch (error) {
      toastManager.error("Like post thất bại!");
      console.error("Failed to like post:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setIsCommentLoading(true);
    try {
      const newComment = await addComment(post.id, commentContent);

      // Thêm comment mới vào đầu danh sách
      setComments((prev) => [newComment, ...prev]);

      // Cập nhật count
      const updatedPost = {
        ...post,
        commentsCount: (post.commentsCount || 0) + 1,
      };
      onUpdate(updatedPost);

      setCommentContent("");
      setShowCommentForm(false);
      setShowComments(true);
    } catch (error) {
      console.error("Failed to add comment:", error);
      toastManager.error("Không thể thêm bình luận");
    } finally {
      setIsCommentLoading(false);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const hasMoreComments = currentCommentPage < totalCommentPages - 1;

  return (
    <div className={styles.postCard}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {post.user?.fullName?.charAt(0).toUpperCase() ||
              currentUserName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className={styles.userName}>
              {post.user?.fullName || currentUserName}
            </p>
            <p className={styles.timestamp}>{formatDate(post.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <p>{post.content}</p>
      </div>

      {post.medias && post.medias.length > 0 && (
        <div className={styles.mediaGrid}>
          {post.medias.map((media, idx) => (
            <div key={idx} className={styles.mediaItem}>
              <img
                src={media.fileUrl || "/placeholder.svg"}
                alt={`Media ${idx}`}
                className={styles.mediaImage}
              />
            </div>
          ))}
        </div>
      )}

      <div className={styles.stats}>
        <span className={styles.stat}>{post.likesCount || 0} lượt thích</span>
        <span
          className={`${styles.stat} ${styles.clickable}`}
          onClick={toggleComments}
        >
          {post.commentsCount || 0} bình luận
        </span>
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`${styles.actionBtn} ${post.isLiked ? styles.liked : ""}`}
        >
          <Heart className={styles.icon} />
          <span>Thích</span>
        </button>
        <button
          onClick={() => setShowCommentForm(!showCommentForm)}
          className={styles.actionBtn}
        >
          <MessageCircle className={styles.icon} />
          <span>Bình luận</span>
        </button>
        <button className={styles.actionBtn}>
          <Share2 className={styles.icon} />
          <span>Chia sẻ</span>
        </button>
      </div>

      {showCommentForm && (
        <form onSubmit={handleAddComment} className={styles.commentForm}>
          <input
            type="text"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Viết bình luận..."
            className={styles.commentInput}
          />
          <button
            type="submit"
            disabled={!commentContent.trim() || isCommentLoading}
            className={styles.commentBtn}
          >
            {isCommentLoading ? "Đang gửi..." : "Gửi"}
          </button>
        </form>
      )}

      {showComments && (
        <div className={styles.commentsList}>
          <h4 className={styles.commentsTitle}>Bình luận</h4>

          {loadingComments ? (
            <div className={styles.loadingComments}>
              <div className={styles.spinner}></div>
              <p>Đang tải bình luận...</p>
            </div>
          ) : comments.length > 0 ? (
            <>
              {comments.map((comment) => (
                <div key={comment.id} className={styles.comment}>
                  <div className={styles.commentAvatar}>
                    {comment.user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.commentContent}>
                    <p className={styles.commentAuthor}>
                      {comment.user.fullName}
                    </p>
                    <p className={styles.commentText}>{comment.content}</p>
                    <p className={styles.commentTime}>
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Nút Load More Comments */}
              {hasMoreComments && (
                <div className={styles.loadMoreCommentsContainer}>
                  <button
                    onClick={loadMoreComments}
                    disabled={loadingMoreComments}
                    className={styles.loadMoreCommentsButton}
                  >
                    {loadingMoreComments ? (
                      <>
                        <div className={styles.smallSpinner}></div>
                        <span>Đang tải...</span>
                      </>
                    ) : (
                      <span>
                        Xem thêm bình luận ({comments.length}/
                        {post.commentsCount})
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* Thông báo khi hết comment */}
              {!hasMoreComments && comments.length > commentPageSize && (
                <div className={styles.endCommentsMessage}>
                  <span>Đã hiển thị tất cả bình luận</span>
                </div>
              )}
            </>
          ) : (
            <p className={styles.noComments}>Chưa có bình luận nào</p>
          )}
        </div>
      )}
    </div>
  );
}
