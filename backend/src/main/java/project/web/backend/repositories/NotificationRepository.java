package project.web.backend.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.web.backend.entities.Notification;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Query("""
            SELECT n FROM Notification n
            INNER JOIN n.sendTo st
            WHERE st.email=:email
            ORDER BY n.createdAt DESC
            """)
    List<Notification> getMyNotifications(@Param("email") String email, Pageable pageable);
}
