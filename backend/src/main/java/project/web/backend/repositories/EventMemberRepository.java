package project.web.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.web.backend.entities.EventMember;

import java.util.Optional;

@Repository
public interface EventMemberRepository extends JpaRepository<EventMember, Long> {
    @Modifying
    @Query("""
        DELETE FROM EventMember em
        WHERE em.event.id = :eventId AND em.user.email = :email
    """)
    void deleteByEventIdAndUserEmail(@Param("eventId") Long eventId, @Param("email") String email);

    @Query("SELECT COUNT(em) FROM EventMember em WHERE em.event.manager.email = :email")
    Long countByManagerEmail(@Param("email") String email);

}
