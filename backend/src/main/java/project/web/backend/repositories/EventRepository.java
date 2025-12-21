package project.web.backend.repositories;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.web.backend.entities.Event;

import java.util.Date;
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
            "categories"
    })
    List<Event> findEventByIdIn(List<Long> eventIds);

    @EntityGraph(attributePaths = {
            "categories",
            "manager",
    })
    @Query("SELECT e FROM Event e WHERE e.id = :eventId")
    Optional<Event> findEventByIdWithManager(@Param("eventId") Long eventId);


    @Query("""
                SELECT DISTINCT e
                FROM Event e
                LEFT JOIN e.categories c
                WHERE
                    (
                        :search IS NULL
                        OR LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%'))
                    )
                AND (
                        :categoryId IS NULL
                        OR c.id = :categoryId
                    )
                AND (
                        :status IS NULL
                        OR (
                            :status = 0 AND e.startDate > CURRENT_TIMESTAMP
                        )
                        OR (
                            :status = 1 AND e.startDate <= CURRENT_TIMESTAMP AND e.endDate >= CURRENT_TIMESTAMP
                        )
                        OR (
                            :status = 2 AND e.endDate < CURRENT_TIMESTAMP
                        )
                    )
                AND (
                    :fromDate IS NULL OR e.startDate >= :fromDate
                )
                ORDER BY e.startDate DESC, e.endDate DESC
            """)
    Page<Event> findAllWithSearch(
            Pageable pageable,
            @Param("search") String search,
            @Param("categoryId") Integer categoryId,
            @Param("status") Integer status,
            @Param("fromDate") Date fromDate
    );


    @EntityGraph(attributePaths = {
            "categories"
    })
    @Query("""
            SELECT e FROM Event e
            WHERE e.id IN :ids
            ORDER BY e.startDate DESC, e.endDate DESC
            """)
    List<Event> findWithCategoriesByIds(@Param("ids") List<Long> ids);


    @Query("""
            SELECT DISTINCT e FROM Event e
            INNER JOIN e.manager em
            WHERE em.email = :email
              AND (:search = '' OR e.name LIKE %:search% OR e.description LIKE %:search%)
              AND (
                   CASE
                           WHEN :status = 0 THEN true
                           WHEN :status = 1 THEN (e.startDate > CURRENT_TIMESTAMP)
                           WHEN :status = 2 THEN (e.startDate <= CURRENT_TIMESTAMP AND e.endDate >= CURRENT_TIMESTAMP)
                           WHEN :status = 3 THEN (e.endDate < CURRENT_TIMESTAMP)
                   END
              )
            ORDER BY e.createdAt DESC
            """)
    Page<Event> findManagerEvent(
            @Param("email") String email,
            @Param("search") String search,
            @Param("status") Integer status,
            Pageable pageable);


    @Query("""
            SELECT e FROM Event e
            JOIN e.manager em
            WHERE em.email=:email
            """)
    List<Event> findManagerEventTungTungTungSahurr(@Param("email") String email);


    @EntityGraph(attributePaths = {
            "categories"
    })
    @Query("""
            SELECT DISTINCT e FROM Event e
            JOIN FETCH e.members em
            INNER JOIN em.user u
            WHERE u.email=:email
            ORDER BY e.createdAt DESC
            """)
    List<Event> findMyEventWithCategories(@Param("email") String email);

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


    @Query("""
                SELECT e FROM Event e
                WHERE e.manager.id = :managerId
                ORDER BY e.createdAt DESC
            """)
    List<Event> findNewestPublishedEventsByManager(@Param("managerId") Long managerId, Pageable pageable);

    @Query("""
                SELECT e FROM Event e
                ORDER BY e.createdAt DESC
            """)
    List<Event> findNewestPublishedEvents(Pageable pageable);

    @Query("""
            SELECT e FROM Event e
            WHERE e.manager.id = :managerId
            AND SIZE(e.members) >= :minMembers
            ORDER BY SIZE(e.members) DESC, e.createdAt DESC
            """)
    List<Event> findTopTrendingEventsByManager(
            @Param("managerId") Long managerId,
            @Param("minMembers") int minMembers,
            Pageable pageable
    );

    @Query("""
            SELECT e FROM Event e
            WHERE SIZE(e.members) >= :minMembers
            ORDER BY SIZE(e.members) DESC, e.createdAt DESC
            """)
    List<Event> findTopTrendingEvents(
            @Param("minMembers") int minMembers,
            Pageable pageable
    );

    @Query("""
                SELECT COUNT(e),
                       COUNT(CASE WHEN e.endDate < CURRENT_TIMESTAMP THEN 1 END)
                FROM User u
                JOIN u.members m
                JOIN m.event e
                WHERE u.email = :email
            """)
    Object countAllEventsByEmailUser(@Param("email") String email);

    @Query("SELECT COUNT(e.id) FROM Event e WHERE e.manager.email = :email")
    Long countByManagerEmail(@Param("email") String email);

    @Query("SELECT COUNT(e.id) FROM Event e")
    Long countAll();

    @Query("""
                SELECT COUNT(e.id) FROM Event e
                WHERE e.manager.email = :email
                  AND SIZE(e.members) >= :minMembers
            """)
    Long countTopTrendingEventsByManagerEmail(
            @Param("email") String email,
            @Param("minMembers") int minMembers
    );

    @Query("""
                SELECT COUNT(e.id) FROM Event e
                WHERE SIZE(e.members) >= :minMembers
            """)
    Long countTopTrending(
            @Param("minMembers") int minMembers
    );


    @Query("""
            SELECT e FROM Event e
            LEFT JOIN FETCH e.categories
            LEFT JOIN FETCH e.members
            LEFT JOIN FETCH e.posts p
            LEFT JOIN FETCH p.comments
            LEFT JOIN FETCH p.medias
            LEFT JOIN FETCH p.likes
            LEFT JOIN FETCH e.eventRegistrations
            LEFT JOIN FETCH e.records
            WHERE e.id=:eventId
            """)
    Optional<Event> findByIdToDelete(@Param("eventId") Long eventId);
}
