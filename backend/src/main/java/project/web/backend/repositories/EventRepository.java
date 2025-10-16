package project.web.backend.repositories;


import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.web.backend.entities.Event;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    @EntityGraph(attributePaths = {
            "categories"
    })
    @Query("SELECT e FROM Event e WHERE e.id = :eventId")
    Optional<Event> findEventById(@Param("eventId") Long eventId);

    @EntityGraph(attributePaths = {
            "categories",
            "manager",
    })
    @Query("SELECT e FROM Event e WHERE e.id = :eventId")
    Optional<Event> findEventByIdWithManager(@Param("eventId") Long eventId);

    @EntityGraph(attributePaths = {
            "categories"
    })
    @Query("SELECT DISTINCT e FROM Event e")
    List<Event> findAllWithCategories();

    @Query("""
                SELECT e.id, COUNT(m.id)
                FROM Event e
                LEFT JOIN e.members m
                WHERE e.id IN :eventIds
                GROUP BY e.id
            """)
    List<Object[]> findCountMemberForEvents(@Param("eventIds") List<Long> eventIds);

    @Query("""
                SELECT e.id, COUNT(p.id)
                FROM Event e
                LEFT JOIN e.posts p
                WHERE e.id IN :eventIds
                GROUP BY e.id
            """)
    List<Object[]> findCountPostForEvents(@Param("eventIds") List<Long> eventIds);

}
