"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, ArrowRight } from "lucide-react";
import { useRecentPosts } from "../../hooks/use-recent-posts";
import { useRouter } from "next/navigation";
import styles from "./recent-posts-section.module.css";

export function RecentPostsSection() {
  const { posts, loading } = useRecentPosts();
  const router = useRouter();

  const handleViewPostDetails = (postId: number) => {
    router.push(`/posts/${postId}`);
  };

  return (
    <Card className={`border-border h-fit ${styles.cardGreen}`}>
      <CardHeader>
        <CardTitle className="text-lg">Bài Post Gần đây</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-muted-foreground">Đang tải...</p>
        ) : posts.length === 0 ? (
          <p className="text-muted-foreground">Không có bài post</p>
        ) : (
          posts.map((post, index) => (
            <div key={post.id}>
              <div className={styles.postCard}>
                {/* Thông tin tác giả */}
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">
                      {post.author.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {post.timestamp}
                    </p>
                  </div>
                </div>

                {/* Nội dung post */}
                <p className="text-sm text-foreground mb-3 line-clamp-3">
                  {post.content}
                </p>

                {/* Ảnh post nếu có */}
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post image"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}

                {/* Thống kê likes/comments */}
                <div className={styles.postStats}>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs">{post.commentsCount}</span>
                  </div>
                </div>
              </div>

              {/* Divider giữa các post */}
              {index < posts.length - 1 && (
                <div className="border-t border-border my-4" />
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
