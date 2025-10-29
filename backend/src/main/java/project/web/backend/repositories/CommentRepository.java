package project.web.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import project.web.backend.entities.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}