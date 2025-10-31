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
    <Card className="border-border h-fit">
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

                <p className="text-sm text-foreground mb-3 line-clamp-3">
                  {post.content}
                </p>

                {post.image && (
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt="Post image"
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}

                <div className={styles.postStats}>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs">{post.comments.length}</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between text-green-600 hover:text-green-700 mt-3"
                  onClick={() => handleViewPostDetails(post.id)}
                >
                  Xem chi tiết
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Dòng kẻ ngăn cách ở DƯỚI mỗi bài post (trừ bài cuối cùng) */}
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
