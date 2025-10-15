package project.web.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.web.backend.entities.PostMedia;

@Repository
public interface PostMediaRepository extends JpaRepository<PostMedia, Long> {
}
