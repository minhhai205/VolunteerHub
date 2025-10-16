package project.web.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.web.backend.entities.Post;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("""
            SELECT p FROM Post p
            ORDER BY p.createdAt DESC
            """)
    Page<Post> findAllPostsWithNoFetch(Pageable pageable);


    @Query("""
            SELECT p FROM Post p
            JOIN FETCH p.user u
            JOIN FETCH p.event e
            LEFT JOIN FETCH p.medias m
            WHERE p.id IN :ids
            """)
    List<Post> findAllPostsWithReferencesByIds(@Param("ids") List<Long> ids);


    @Query("""
            SELECT p.id, COUNT(c.id) FROM Post p
            LEFT JOIN p.comments c
            WHERE p.id IN :ids
            GROUP BY p.id
            """)
    List<Object[]> findAllPostsWithCommentCountByIds(@Param("ids") List<Long> ids);


    @Query("""
            SELECT p.id, COUNT(l.id) FROM Post p
            LEFT JOIN p.likes l
            WHERE p.id IN :ids
            GROUP BY p.id
            """)
    List<Object[]> findAllPostsWithLikeCountByIds(@Param("ids") List<Long> ids);


    @Query("""
            SELECT p FROM Post p
            JOIN FETCH p.user u
            JOIN FETCH p.medias pm
            WHERE p.id=:id
            """)
    Optional<Post> findByIdWithCreatedUserAndPostMedia(@Param("id") Long id);
}
