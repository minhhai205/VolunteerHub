package project.web.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.web.backend.entities.EventCreateRequest;
import project.web.backend.utils.enums.EventRequestStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRequestRepository extends CrudRepository<EventCreateRequest, Integer> {

    @EntityGraph(attributePaths = {
            "categories",
            "manager"
    })
    Optional<EventCreateRequest> findById(Long requestId);


    @Query("""
                SELECT ec FROM EventCreateRequest ec
                WHERE
                    (:search IS NULL OR :search = ''
                        OR ec.name LIKE %:search%
                        OR ec.description LIKE %:search%)
                AND
                    (:status IS NULL OR ec.status = :status)
                ORDER BY ec.createdAt DESC
            """)
    Page<EventCreateRequest> findAllPagination(
            Pageable pageable,
            @Param("search") String search,
            @Param("status") EventRequestStatus status
    );

    @EntityGraph(attributePaths = {
            "categories",
    })
    @Query("""
            SELECT ec FROM EventCreateRequest ec
            WHERE ec.id IN :ids
            """)
    List<EventCreateRequest> findByIdsWithCategories(@Param("ids") List<Long> ids);

    @EntityGraph(attributePaths = {
            "categories",
    })
    @Query("""
            SELECT ec FROM EventCreateRequest ec
            WHERE ec.status IN :status
            ORDER BY ec.createdAt DESC
            """)
    List<EventCreateRequest> findByStatusIn(@Param("status") List<EventRequestStatus> status);

    @Query("""
                SELECT
                    COUNT(ec),
                    SUM(CASE WHEN ec.status = 'PENDING' THEN 1 ELSE 0 END),
                    SUM(CASE WHEN ec.status = 'APPROVED' THEN 1 ELSE 0 END),
                    SUM(CASE WHEN ec.status = 'REJECTED' THEN 1 ELSE 0 END)
                FROM EventCreateRequest ec
            """)
    List<Object[]> countStatistics();
}
