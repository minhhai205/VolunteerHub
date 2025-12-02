package project.web.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.web.backend.entities.Event;
import project.web.backend.entities.EventRegistration;
import project.web.backend.utils.enums.EventRequestStatus;

import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    @Query("""
            SELECT er FROM EventRegistration er
            JOIN FETCH er.user u
            JOIN FETCH er.event e
            WHERE (:status IS NULL OR er.status = :status)
            """)
    Page<EventRegistration> getAll(
            Pageable pageable,
            @Param("status") EventRequestStatus status
    );

    @Query("""
            SELECT er FROM EventRegistration er
            JOIN FETCH er.user u
            JOIN FETCH er.event e
            WHERE u.email=:email
            """)
    public Page<EventRegistration> getMyUserRegistration(Pageable pageable, @Param("email") String email);

    @Query("""
            SELECT er FROM EventRegistration er
            JOIN FETCH er.user u
            JOIN FETCH er.event e
            WHERE er.id=:id
            """)
    Optional<EventRegistration> findByIdWithUserAndEvent(@Param("id") Long id);

    @Query("""
            SELECT er FROM EventRegistration er
            WHERE er.event.id=:eventId AND er.user.email=:email
            """)
    Optional<EventRegistration> findByEventIdAndUserEmail(@Param("eventId") Long eventId, @Param("email") String email);
}
