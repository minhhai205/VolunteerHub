"use client"

import type React from "react"
import { useState } from "react"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import type { Post } from "../../../../hooks/useDetail"
import { likePost, addComment } from "../../../../hooks/useDetail"
import styles from "./post-item.module.css"
import { toastManager } from "@/components/static/toast/toast"

interface PostItemProps {
  post: Post
  onUpdate: (post: Post) => void
}

export default function PostItem({ post, onUpdate }: PostItemProps) {
  const [isLiking, setIsLiking] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentContent, setCommentContent] = useState("")
  const [isCommentLoading, setIsCommentLoading] = useState(false)

  const handleLike = async () => {
    setIsLiking(true)
    try {
      const updatedPost = await likePost(post)
      onUpdate(updatedPost)
    } catch (error) {
      toastManager.error("Like post thất bại!")
      console.error("Failed to like post:", error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentContent.trim()) return

    setIsCommentLoading(true)
    try {
      const updatedPost = await addComment(post.id, commentContent)
      onUpdate(updatedPost)
      setCommentContent("")
      setShowCommentForm(false)
    } catch (error) {
      console.error("Failed to add comment:", error)
    } finally {
      setIsCommentLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Vừa xong"
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`
    return date.toLocaleDateString("vi-VN")
  }

  return (
    <div className={styles.postCard}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{post.user?.fullName?.charAt(0).toUpperCase() || "U"}</div>
          <div>
            <p className={styles.userName}>{post.user?.fullName || "Người dùng"}</p>
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
              <img src={media.fileUrl || "/placeholder.svg"} alt={`Media ${idx}`} className={styles.mediaImage} />
            </div>
          ))}
        </div>
      )}

      <div className={styles.stats}>
        <span className={styles.stat}>{post.likesCount || 0} lượt thích</span>
        <span className={styles.stat}>{post.commentsCount || 0} bình luận</span>
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
        <button onClick={() => setShowCommentForm(!showCommentForm)} className={styles.actionBtn}>
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
          <button type="submit" disabled={!commentContent.trim() || isCommentLoading} className={styles.commentBtn}>
            {isCommentLoading ? "Đang gửi..." : "Gửi"}
          </button>
        </form>
      )}

      {post.comments && post.comments.length > 0 && (
        <div className={styles.commentsList}>
          <h4 className={styles.commentsTitle}>Bình luận</h4>
          {post.comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentAvatar}>{comment.author.fullName.charAt(0).toUpperCase()}</div>
              <div className={styles.commentContent}>
                <p className={styles.commentAuthor}>{comment.author.fullName}</p>
                <p className={styles.commentText}>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
