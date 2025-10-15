package project.web.backend.repositories;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.web.backend.entities.EventCreateRequest;

import java.util.Optional;

@Repository
public interface EventRequestRepository extends CrudRepository<EventCreateRequest, Integer> {

    @EntityGraph(attributePaths = {
            "categories",
            "manager"
    })
    Optional<EventCreateRequest> findById(Long requestId);
}
