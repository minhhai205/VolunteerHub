"use client"

import { useState, useEffect } from "react"
import PostForm from "../post-form/post-form"
import PostItem from "../post-item/post-item"
import { fetchPosts, createPost, Post, PostMedia } from "../../../../hooks/useDetail"
import styles from "./event-discussion.module.css"

interface EventDiscussionProps {
  eventId: string
}

export default function EventDiscussion({ eventId }: EventDiscussionProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts(eventId)
        setPosts(data)
      } catch (error) {
        console.error("Failed to load posts:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [eventId])

  const handlePostCreate = async (content: string, medias?: PostMedia[]) => {
    try {
      const newPost = await createPost(eventId, content, medias)
      setPosts([newPost, ...posts])
    } catch (error) {
      console.error("Failed to create post:", error)
    }
  }

  const handlePostUpdate = (postId: number, updatedPost: Post) => {
    setPosts(posts.map((p) => (p.id === postId ? updatedPost : p)))
  }

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
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostItem key={post.id} post={post} onUpdate={(updated) => handlePostUpdate(post.id, updated)} />
          ))
        ) : (
          <p className={styles.emptyState}>Chưa có bài viết nào. Hãy là người đầu tiên bình luận!</p>
        )}
      </div>
    </div>
  )
}
