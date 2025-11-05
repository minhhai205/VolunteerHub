package project.web.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.web.backend.entities.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("""
            SELECT c FROM Comment c
            WHERE c.post.id=:postId
            ORDER BY c.createdAt DESC
            """)
    Page<Comment> findAllCommentsByPost(Pageable pageable, @Param("postId") Long postId);
}