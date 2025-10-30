"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import styles from "./post.module.css";
import { Comment } from "./Comment";

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

interface PostProps {
  post: PostData;
}

export function Post({ post }: PostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentData[]>(post.comments);
  const [newComment, setNewComment] = useState("");

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: CommentData = {
        id: Date.now(),
        author: {
          name: "Bạn",
          avatar: "/user-avatar.jpg",
        },
        content: newComment,
        timestamp: "Vừa xong",
        likes: 0,
      };
      setComments([...comments, comment]);
      setNewComment("");
      setShowComments(true);
    }
  };

  return (
    <div className={styles.post}>
      {/* Post Header */}
      <div className={styles.postHeader}>
        <Avatar className={styles.avatar}>
          <AvatarImage
            src={post.author.avatar || "/placeholder.svg"}
            alt={post.author.name}
          />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className={styles.authorInfo}>
          <h3 className={styles.authorName}>{post.author.name}</h3>
          <p className={styles.timestamp}>{post.timestamp}</p>
        </div>
      </div>

      {/* Post Content */}
      <div className={styles.postContent}>
        <p className={styles.contentText}>{post.content}</p>
        {post.image && (
          <div className={styles.postImage}>
            <img src={post.image || "/placeholder.svg"} alt="Post content" />
          </div>
        )}
      </div>

      {/* Post Stats */}
      <div className={styles.postStats}>
        <button className={styles.statsButton}>
          <Heart
            className={`${styles.heartIcon} ${isLiked ? styles.liked : ""}`}
          />
          <span>{likesCount} lượt thích</span>
        </button>
        <button
          className={styles.statsButton}
          onClick={() => setShowComments(!showComments)}
        >
          <span>{comments.length} bình luận</span>
        </button>
      </div>

      {/* Post Actions */}
      <div className={styles.postActions}>
        <button
          className={`${styles.actionButton} ${isLiked ? styles.active : ""}`}
          onClick={handleLike}
        >
          <Heart className={styles.actionIcon} />
          <span>Thích</span>
        </button>
        <button
          className={styles.actionButton}
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className={styles.actionIcon} />
          <span>Bình luận</span>
        </button>
        <button className={styles.actionButton}>
          <Share2 className={styles.actionIcon} />
          <span>Chia sẻ</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className={styles.commentsSection}>
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}

          {/* Add Comment */}
          <div className={styles.addComment}>
            <Avatar className={styles.commentAvatar}>
              <AvatarImage src="/user-avatar.jpg" alt="You" />
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <div className={styles.commentInputWrapper}>
              <Textarea
                placeholder="Viết bình luận..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className={styles.commentInput}
                rows={1}
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                size="sm"
                className={styles.commentButton}
              >
                Gửi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
