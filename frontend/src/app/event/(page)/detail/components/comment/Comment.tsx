"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import styles from "./comment.module.css";
import type { CommentData } from "./Post";

interface CommentProps {
  comment: CommentData;
}

export function Comment({ comment }: CommentProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <div className={styles.comment}>
      <Avatar className={styles.avatar}>
        <AvatarImage
          src={comment.author.avatar || "/placeholder.svg"}
          alt={comment.author.name}
        />
        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className={styles.commentContent}>
        <div className={styles.commentBubble}>
          <h4 className={styles.authorName}>{comment.author.name}</h4>
          <p className={styles.commentText}>{comment.content}</p>
        </div>
        <div className={styles.commentActions}>
          <button
            className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`}
            onClick={handleLike}
          >
            Thích
          </button>
          {likesCount > 0 && (
            <span className={styles.likesCount}>
              <Heart className={styles.heartIcon} />
              {likesCount}
            </span>
          )}
          <span className={styles.timestamp}>{comment.timestamp}</span>
        </div>
      </div>
    </div>
  );
}
