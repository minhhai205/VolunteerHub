package project.web.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.web.backend.entities.EventMember;
import project.web.backend.entities.User;
import project.web.backend.utils.enums.WorkStatus;

import java.util.List;


@Repository
public interface EventMemberRepository extends JpaRepository<EventMember, Long> {
    @Modifying
    @Query("""
                DELETE FROM EventMember em
                WHERE em.event.id = :eventId AND em.user.email = :email
            """)
    void deleteByEventIdAndUserEmail(@Param("eventId") Long eventId, @Param("email") String email);

    @Query("SELECT COUNT(em.id) FROM EventMember em WHERE em.event.manager.email = :email")
    Long countByManagerEmail(@Param("email") String email);


    @Query("""
                SELECT em FROM EventMember em
                JOIN FETCH em.event e
                JOIN FETCH em.user u
                WHERE
                    (:search IS NULL OR :search = ''
                        OR u.fullName LIKE CONCAT('%', :search, '%')
                        OR u.email LIKE CONCAT('%', :search, '%'))
                AND
                    (:status IS NULL OR em.status = :status)
                AND
                    (:eventId IS NULL OR e.id = :eventId)
            """)
    Page<EventMember> findByFilter(
            @Param("search") String search,
            @Param("status") WorkStatus status,
            @Param("eventId") Long eventId,
            Pageable pageable
    );

    @Query("SELECT COUNT(em.id) FROM EventMember em")
    Long countAll();


    @Query("""
                SELECT em.user
                FROM EventMember em
                WHERE em.event.id = :eventId
            """)
    List<User> findUsersByEventId(@Param("eventId") Long eventId);
}
