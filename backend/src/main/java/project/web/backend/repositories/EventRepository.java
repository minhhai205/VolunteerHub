package project.web.backend.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.web.backend.entities.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
}
