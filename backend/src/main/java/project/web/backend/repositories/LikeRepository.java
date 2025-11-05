package project.web.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import project.web.backend.entities.Like;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    @Query("""
        SELECT l FROM Like l
        WHERE l.user.id = :userId
        AND l.post.id = :postId
    """)
    Optional<Like> findByUserIdAndPostId(@Param("userId") Long userId, @Param("postId") Long postId);
}
