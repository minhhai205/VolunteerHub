package project.web.backend.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import project.web.backend.entities.EventCreateRequest;

@Repository
public interface EventCreateRequestRepository extends CrudRepository<EventCreateRequest, Integer> {
}
