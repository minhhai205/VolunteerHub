package project.web.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.web.backend.entities.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
