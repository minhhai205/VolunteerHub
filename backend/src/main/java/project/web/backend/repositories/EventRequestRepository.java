package project.web.backend.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.web.backend.entities.EventCreateRequest;
import project.web.backend.entities.EventRegistration;
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
            ORDER BY ec.createdAt DESC
            """)
    Page<EventCreateRequest> findAllPagination(Pageable pageable);

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
}
