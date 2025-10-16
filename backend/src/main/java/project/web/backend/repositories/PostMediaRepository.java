package project.web.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import project.web.backend.entities.PostMedia;

import java.util.List;

@Repository
public interface PostMediaRepository extends JpaRepository<PostMedia, Long> {
    @Query("""
            DELETE FROM PostMedia pm
            WHERE pm.id IN :ids
            """)
    @Transactional
    @Modifying
    public void deleteAllByIds(@Param("ids") List<Long> ids);
}
